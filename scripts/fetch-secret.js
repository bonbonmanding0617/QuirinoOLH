#!/usr/bin/env node
/*
  Fetch secret helper to run in CI/CD or locally.
  Usage: node scripts/fetch-secret.js --provider azure|aws --name SECRET_NAME
  Requires env vars for provider auth:
    - Azure: AZURE_KEY_VAULT_NAME, AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET (or managed identity)
    - AWS: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
*/
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

async function getFromAzure(secretName) {
  const vaultName = process.env.AZURE_KEY_VAULT_NAME;
  if (!vaultName) throw new Error('AZURE_KEY_VAULT_NAME is required for Azure provider');
  const vaultUrl = `https://${vaultName}.vault.azure.net`;
  const cred = new DefaultAzureCredential();
  const client = new SecretClient(vaultUrl, cred);
  const result = await client.getSecret(secretName);
  return result.value;
}

async function getFromAws(secretName) {
  const region = process.env.AWS_REGION || 'us-east-1';
  const client = new SecretsManagerClient({ region });
  const cmd = new GetSecretValueCommand({ SecretId: secretName });
  const resp = await client.send(cmd);
  return resp.SecretString || (resp.SecretBinary && Buffer.from(resp.SecretBinary, 'base64').toString('utf-8'));
}

async function main() {
  const argv = require('minimist')(process.argv.slice(2));
  const provider = (argv.provider || process.env.SECRETS_PROVIDER || 'env').toLowerCase();
  const secretName = argv.name || process.env.SECRET_NAME || 'MONGO_URI';
  let value = process.env.MONGO_URI;
  try {
    if (!value) {
      if (provider === 'azure') {
        value = await getFromAzure(secretName);
      } else if (provider === 'aws') {
        value = await getFromAws(secretName);
      }
    }
  } catch (err) {
    console.error('Failed to fetch secret:', err.message);
    process.exit(1);
  }

  if (!value) {
    console.error('MONGO_URI not found from environment or secrets manager');
    process.exit(1);
  }

  // Basic validation: ensure the secret doesn't contain placeholder angle brackets
  if (/[<>]/.test(value)) {
    console.error('Fetched MONGO_URI looks like it contains placeholders (e.g. <cluster> or <password>).');
    console.error('Please update the secret to include the actual cluster host, user and password.');
    process.exit(1);
  }

  // Write to .env.local for the runner / container; do not print the value directly
  const outPath = path.resolve(process.cwd(), '.env.local');
  const content = `MONGO_URI=${value}\n`;
  fs.writeFileSync(outPath, content, { encoding: 'utf-8', mode: 0o600 });
  console.log('Wrote .env.local with MONGO_URI (secret content not shown)');
}

main();
