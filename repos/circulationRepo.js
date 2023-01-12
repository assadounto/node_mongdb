const {MongoClient,ObjectId}=require('mongodb');

function circulationRepo(){
    const url='mongodb://localhost:27017';
    const dbName='circulation';
    

    function addItem(item) {
        return new Promise(async function(resolve,reject){
            const client=new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);
                const addedItem= await db.collection('newspapers').insertOne(item); 
                console.log(addedItem);
                resolve(addedItem);
                client.close();
            }catch(err){
                reject(err);
            }
        });

    }
    function getById(id){
        return new Promise(async function(resolve,reject){
            const client=new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);
                const item= await db.collection('newspapers').findOne({_id:ObjectId(id)});
                resolve(item);
                client.close();
            }catch(err){
                reject(err);
            }
        });
    }

    

    function get(query,limit){
        return new Promise(async function(resolve,reject){
            const client=new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);
               let items= db.collection('newspapers').find(query);
                if (limit>0){
                    items=items.limit(limit);
                }
               
               resolve(await items.toArray());
                client.close();
            }catch(err){
                reject(err);
            }
        });

    }
    function loadData(data){
        return new Promise(async function(resolve,reject){
            const client=new MongoClient(url);
            try{
                await client.connect();
                const results=await client.db(dbName).collection('newspapers').insertMany(data);
                resolve(results);
                client.close();
            }catch(err){
                reject(err);
            }
        });
    }
    return {loadData,get,getById,addItem};
}


module.exports= circulationRepo();