Secrets Manager Setup

This project supports loading `MONGO_URI` from environment variables or from a cloud secrets manager. Supported providers: Azure Key Vault and AWS Secrets Manager.

Environment variables (priority order):
- `MONGO_URI`: If set, this value is used directly.
- `SECRETS_PROVIDER`: set to `azure` or `aws` to use a provider.
- `SECRET_NAME`: name/ID of the secret to read (default `MONGO_URI`).

Azure Key Vault Setup
---------------------
1. Create an Azure Key Vault and add a secret named `MONGO_URI` with the connection string.
2. Grant access to the application principal (Managed Identity or service principal) to `get` secrets.
3. Configure these environment variables on the host or CI/CD:
   - `SECRETS_PROVIDER=azure`
   - `AZURE_KEY_VAULT_URL=https://<vault-name>.vault.azure.net` or `AZURE_KEY_VAULT_NAME=<vault-name>`
   - Provide creds via environment or use Managed Identity:
     - `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET` if using a service principal.
4. Restart the server. The code uses `@azure/identity` DefaultAzureCredential, which supports many auth options.

AWS Secrets Manager Setup
-------------------------
1. Store the `MONGO_URI` secret in AWS Secrets Manager.
2. Configure IAM credentials or allow the host role to read the secret.
3. Configure these environment variables on the host or CI/CD:
   - `SECRETS_PROVIDER=aws`
   - `SECRET_NAME=<your-secret-name-or-arn>` (optional; default: `MONGO_URI`)
   - `AWS_REGION` (e.g., `ap-southeast-1`)
   - Credentials: provide `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` or use a host IAM role.
4. Restart the server. The code uses `@aws-sdk/client-secrets-manager` to get the secret.

Notes
-----
- `MONGO_URI` may still be provided directly via `.env` for local development.
- If both `MONGO_URI` and a secrets provider are available, `MONGO_URI` takes precedence.
- Remove secrets from `.env` and from source control for production — use a secrets manager instead.
- The app expects MONGO_URI to be the full connection string (mongodb+srv://...)
   - Avoid leaving angle-bracket placeholders like `<cluster>` or `<user>` in the value — replace them with your actual cluster host and credentials.
   - If you see errors like `querySrv EBADNAME _mongodb._tcp.<cluster>.mongodb.net`, it usually means the URI still contains a placeholder or DNS SRV lookups are failing. Try using the standard `mongodb://host:port` connection string as a fallback.

Local development and examples
------------------------------
- Use `.env.example` as a template. Copy it to `.env` and fill in values only for local testing.
- The repository `.env` has placeholder values to avoid accidental secret commits; replace with real values only for local testing and never commit them.
- Delete local `.env` before pushing changes to remote and use `fetch-secret` in CI or host startup instead.
- Never commit actual secrets; if you accidentally do, rotate them and purge the git history using the BFG or git filter-repo.

Pre-commit secret scanning
--------------------------
This repo includes a pre-commit hook (Husky) that runs a secret scan on staged files. To install locally, run:

```bash
npm install
npx husky install
```

The pre-commit hook runs `npm run check-secrets` and prevents commits containing obvious secret patterns (e.g. `MONGO_URI`, `PRIVATE_KEY`, etc.). Use `npm run check-secrets` manually to test.

Security Best Practices
-----------------------
- Use least-privilege for the DB user (e.g., `readWrite` for the specific database only).
- Use host-managed identities instead of long-lived credentials where possible.
- Rotate secrets regularly and revoke old credentials when rotated.
- Audit access to secrets.

If you want me to configure a specific provider (Azure or AWS) in-place, provide the necessary service credentials or invite me with temporary access, and I will update configuration and restart the server.

Example GitHub Actions Workflow
------------------------------
The included example workflow `.github/workflows/fetch-and-deploy.yml` demonstrates how to fetch `MONGO_URI` from either Azure Key Vault or AWS Secrets Manager, write it to `.env.local`, and run subsequent build/deploy steps.

Note: Add the required secrets to your repository settings (`Settings → Secrets`) before running a workflow:
- Azure: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_KEY_VAULT_NAME`
- AWS: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_SECRET_NAME`

The workflow fetches the secret and writes it to `.env.local` with restrictive permissions so deployment steps or runtime process managers can read it securely. Modify the deploy step to match your hosting provider.