const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const MongoUrl = "mongodb://localhost:27017/";
const dbName = 'square';
const client = new MongoClient(MongoUrl);


client.connect((err) => {
  if (err) {
      console.log('数据库连接错误');
      client.close();
      return;
  }
});
//切换到要操作的数据库
let db = client.db(dbName);


function queryRequest(req){   //查询数据时，根据请求返回查询数据所需的条件
  if(req._id) return {'request': {'_id' : mongoose.Types.ObjectId(req._id)}, 'start': 0, 'num': 0};   //如果是查询新插入的数据，start和num都为0，全局查找
  return req.email ? req.id ? {'request': {'email': req.email, 'id': req.id}, 'start': req.start, 'num': req.num} : {'request': {'email': req.email}, 'start': req.start, 'num': req.num} : '';
}


function queryDB(req, collection){   //查询数据
  return new Promise((resolve, reject) => {
    let q = queryRequest(req)
    db.collection(collection).find(q.request).skip(parseInt(q.start)).limit(parseInt(q.num)).toArray(function(err, result) {
      if (err) reject(err);
      else resolve(JSON.stringify({result}));
    });
  })    
}


function insertDB(req, collection){    //插入数据
  return new Promise((resolve, reject) => {
    db.collection(collection).insertOne(req.obj, function(err, result) {
      if (err) reject(err);
      else resolve(JSON.stringify({result}));   //返回插入数据的_id
    });
  }) 
}


function updateDB(req, collection){    //插入数据
  return new Promise((resolve, reject) => {
    db.collection(collection).updateOne(req.obj, function(err, result) {
      if (err) reject(err);
      else resolve(JSON.stringify({result}));
    });
  }) 
}


function deleteDB(req, collection){    //插入数据
  return new Promise((resolve, reject) => {
    db.collection(collection).deleteOne(req.obj, function(err, result) {
      if (err) reject(err);
      else resolve(JSON.stringify({result}));
    });
  }) 
}


module.exports = {queryDB, insertDB, updateDB, deleteDB};