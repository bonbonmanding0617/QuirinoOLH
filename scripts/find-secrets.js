#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getTrackedFiles() {
  try {
    // Check staged files (pre-commit) or all tracked files if none staged
    const staged = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' }).trim();
    if (staged) {
      return staged.split('\n').filter(Boolean);
    }
    const out = execSync('git ls-files', { encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch (e) {
    // fallback to scanning all files
    return scanDir(process.cwd());
  }
}

function scanDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (entry === 'node_modules' || entry === '.git') continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...scanDir(full));
    } else {
      results.push(path.relative(process.cwd(), full).replace(/\\/g, '/'));
    }
  }
  return results;
}

const patterns = [
  /mongodb\+srv:\/\//i,
  /MONGO_URI=/i,
  /PRIVATE_KEY=/i,
  /PUBLIC_KEY=/i,
  /AWS_SECRET|AWS_ACCESS_KEY|AWS_SECRET_ACCESS_KEY/i,
  /AZURE_CLIENT_SECRET/i,
  /SECRET=.*(=|:)/i,
  /PASSWORD=.*(=|:)/i,
  /URI=.*(mongodb|mongo)/i
];

const files = getTrackedFiles();
// Exclude some default benign files/patterns and directories
const EXCLUDE = ['node_modules/', '.git/', '.husky/', 'README.md', 'SECURE_SECRETS.md', 'scripts/'];

function shouldIgnore(file) {
  for (const e of EXCLUDE) if (file.indexOf(e) === 0 || file.includes('/' + e) || file === e) return true;
  if (file.endsWith('.md') || file.endsWith('.lock')) return true;
  return false;
}
let found = false;
for (const f of files) {
  try {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, 'utf8');
    if (shouldIgnore(f)) continue;
    for (const pat of patterns) {
      if (pat.test(content)) {
        console.error(`Potential secret in file: ${f} -- matched ${pat}`);
        found = true;
      }
    }
  } catch (e) {
    // ignore binary or unreadable
  }
}

if (found) {
  console.error('\nOne or more potential secrets were detected in tracked files.');
  console.error('Please remove them from tracked files and add to .gitignore before committing.');
  process.exit(1);
} else {
  console.log('No obvious secrets found in tracked files.');
  process.exit(0);
}
