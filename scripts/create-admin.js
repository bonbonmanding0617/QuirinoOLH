#!/usr/bin/env node
/* Create or update admin user using ADMIN_EMAIL and ADMIN_PASSWORD env vars or CLI args.
   Usage: ADMIN_EMAIL=me@org.com ADMIN_PASSWORD=secret node scripts/create-admin.js
   Or: node scripts/create-admin.js --email me@org.com --password secret
*/
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: process.env.ENV_PATH || '.env.local' });

const argv = require('minimist')(process.argv.slice(2));
const email = argv.email || process.env.ADMIN_EMAIL;
const password = argv.password || process.env.ADMIN_PASSWORD;
const name = argv.name || process.env.ADMIN_NAME || 'Admin User';

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required (env or args).');
  process.exit(1);
}

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qolh';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'student' }
});

async function main() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    const User = mongoose.model('User', userSchema);

    const hash = await bcrypt.hash(password, 10);
    const update = { name, email, password: hash, role: 'admin' };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

    const admin = await User.findOneAndUpdate({ email }, update, opts);
    console.log('Admin created/updated:', admin.email);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exit(2);
  }
}

main();
