const MongoClient = require('mongodb').MongoClient;
const circulationRepo = require('./repos/circulationRepo.js');
const data = require('./circulation.json');
const assert = require('assert');
const { get } = require('http');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

// Use connect method to connect to the server

async function main() {
  const client = new MongoClient(url);
  try {
  
  await client.connect();
  const results = await circulationRepo.loadData(data);
  assert.equal(data.length, results.insertedCount);
  
  const getData = await circulationRepo.get();
  assert.equal(data.length, getData.length);
   const filterData = await circulationRepo.get({ Newspaper:  getData[4].Newspaper });

   assert.deepEqual(getData[4], filterData[0]);

   const limitData = await circulationRepo.get({}, 3);
   assert.equal(limitData.length, 3);
  } catch (err) {
    console.log(err);
  }
    finally {
  const admin = client.db(dbName).admin();
  console.log(await admin.listDatabases());
  await client.db(dbName).dropDatabase();
    client.close();
    }
}

main()