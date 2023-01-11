const {MongoClient}=require('mongodb');

function circulationRepo(){
    const url='mongodb://localhost:27017';
    const dbName='circulation';
    function loadData(data){
        return new Promise(async function(resolve,reject){
            const client=new MongoClient(url);
            try{
                await client.connect();
                const results=await client.db(dbName).collection('newspapers').insertMany(data);
                resolve(results);
            }catch(err){
                reject(err);
            }
        });
    }
    return {loadData};
}

module.exports= circulationRepo();