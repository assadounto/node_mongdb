const MongoClient = require('mongodb').MongoClient;
const circulationRepo = require('./repos/circulationRepo.js');
const data = require('./circulation.json');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

// Use connect method to connect to the server

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  const results = await circulationRepo.loadData(data);
  console.log(results.insertedCount,results.ops);
  const admin = client.db(dbName).admin();
  console.log(await admin.listDatabases());
}

main()