#!/usr/bin/env node
/*
  Test MongoDB connection helper.
  Usage: set `MONGO_URI` in env and run `node scripts/test-connection.js`.
  This script intentionally does not print the full URI or credentials.
*/
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not set. Set the environment variable and retry.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
    maxPoolSize: 5,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000
  });

  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB.');

    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log('Databases found:', dbs.databases.map(d => d.name).join(', ') || '(none)');

    // Determine default DB from the connection string path (if any) without mis-parsing credentials
    let defaultDb = null;
    try {
      const afterAt = uri.includes('@') ? uri.split('@').pop() : uri;
      const pathPart = afterAt.includes('/') ? afterAt.split('/').slice(1).join('/') : '';
      const candidate = pathPart ? pathPart.split('?')[0] : '';
      // Basic validation: DB name should not contain characters like '@' or ':' or spaces
      if (candidate && !/[@:\s]/.test(candidate)) defaultDb = candidate;
    } catch (e) {
      defaultDb = null;
    }

    if (defaultDb) {
      console.log(`Listing collections in database: ${defaultDb}`);
      const cols = await client.db(defaultDb).listCollections().toArray();
      console.log('Collections:', cols.map(c => c.name).join(', ') || '(none)');
    } else {
      console.log('No default database found in URI; skipping collection listing.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    if (/querySrv|EBADNAME|ENOTFOUND|EAI_AGAIN/i.test(err.message)) {
      console.error('Hint: SRV/DNS lookup failed. Check that the URI host is correct and does not contain placeholders like <cluster>.');
      console.error('If your network blocks SRV lookups, try a mongodb://host:port connection string instead.');
    }
    process.exit(2);
  } finally {
    try { await client.close(); } catch (e) {}
  }
}

main();
