const {MongoClient}=require('mongodb');

function circulationRepo(){
    const url='mongodb://localhost:27017';
    const dbName='circulation';

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
    return {loadData,get};
}

module.exports= circulationRepo();