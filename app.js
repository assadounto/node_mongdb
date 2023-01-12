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
   
  const id = getData[4]._id.toString();
  const byId = await circulationRepo.getById(id);
  assert.deepEqual(getData[4], byId);
  const newItem = {
    "Newspaper": "Ghana Today",
    "Daily Circulation, 2004": 2192,
    "Daily Circulation, 2013": 1674,
    "Change in Daily Circulation, 2004-2013": -24,
    "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
    "Pulitzer Prize Winners and Finalists, 2004-2014": 1,
    "Pulitzer Prize Winners and Finalists, 1990-2014": 2
  }
  const addedItem = await circulationRepo.addItem(newItem);

  assert(addedItem.insertedId);
  const addedItemQuery = await circulationRepo.getById(addedItem.insertedId);
  assert.deepEqual( addedItemQuery,newItem);
   
  const updatedItem = await circulationRepo.updateItem(addedItem.insertedId, {
    "Newspaper": "New Ghana Today",
    "Daily Circulation, 2004": 2192,
    "Daily Circulation, 2013": 1674,
    "Change in Daily Circulation, 2004-2013": -24,
    "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
    "Pulitzer Prize Winners and Finalists, 2004-2014": 1,
    "Pulitzer Prize Winners and Finalists, 1990-2014": 2
  });

  //assert.equal(updatedItem.modifiedCount, 1);
  const updatedItemQuery = await circulationRepo.getById(addedItem.insertedId);
  assert.equal(updatedItemQuery.Newspaper, "New Ghana Today");
  
  const removed = await circulationRepo.remove(addedItem.insertedId)
  assert(removed)

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