//1.引入http模块
let fs = require('fs')
let url = require('url')
let http = require('http')
let querystring = require('querystring')
let MongoClient = require('mongodb').MongoClient;
let mongoose = require('mongoose');
const { type } = require('os');
let MongoUrl = "mongodb://localhost:27017/";

//2.创建web服务器
let server = http.createServer();
//3.监听请求
server.on('request', function(req, res){
	//获取当前请求地址
	let currentUrl = req.url;
	//判断请求地址
	if (currentUrl === '/' || currentUrl.indexOf('html') !== -1) {    //请求页面
		readHtml(req, res);
	} 
  else if(currentUrl.startsWith('/public')){    //请求静态资源
    readSource(req, res);
  }
  else if(currentUrl === '/square' || currentUrl === '/userPost' || currentUrl === '/detailContent'){   //请求数据库数据
    readDB(req, res);
  }
  else if(currentUrl.indexOf('insert') !== -1){    //包含'insert'的请求，向数据库更新并获取新内容
    insertDB(req, res);
  }
});
//4.启动服务
server.listen(3000, function(){
	console.log('启动成功，访问：http://localhost:3000')
})






function queryData(req, res, collection){   //查询数据
  MongoClient.connect(MongoUrl, function(err, db) {
      if (err) throw err;
      var dbo = db.db("square");      //数据库
      let q = queryRequest(req)
      dbo.collection(collection).find(q.request).skip(q.start).limit(q.num).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader("Access-Control-Allow-Origin", "*");      //允许跨域
          res.writeHead(200, {'Content-Type':'text/html; charset = UTF-8'});
          res.end(JSON.stringify({result}));
          db.close();
  });
  });
}


function insertData(req, res, collection){    //插入数据
  MongoClient.connect(MongoUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("square");
    dbo.collection(collection).insertOne(req.obj, function(err, result) {
        if (err) throw err;
        console.log('插入成功');
        res.setHeader("Access-Control-Allow-Origin", "*");      //允许跨域
        res.writeHead(200, {'Content-Type':'text/html; charset = UTF-8'});
        res.end(JSON.stringify({result}));
        db.close();
    });
});
}


function queryRequest(req){   //查询数据时，根据请求返回查询数据所需的条件
  if(req._id) return {'request': {'_id' : mongoose.Types.ObjectId(req._id)}, 'start': 0, 'num': 0};   //如果是查询新插入的数据，start和num都为0，全局查找
  return req.email ? req.id ? {'request': {'email': req.email, 'id': req.id}, 'start': req.start, 'num': req.num} : {'request': {'email': req.email}, 'start': req.start, 'num': req.num} : '';
}


function judgeResourceType(currentUrl){   //判断静态资源类型
  if(currentUrl.endsWith('.css'))
    return 'text/css';
  else if(currentUrl.endsWith('.js'))
    return 'text/javascript';
  /* 若请求的资源为字体文件，
    因为fontawesome中对字体文件的url后用?拼接了版本号用于更新缓存，
    然而node无法将url中的路径部分和用?拼接的参数部分区分开来，所以路径会出错，
    所以手动将font-awesome.min.css中url部分?后面的内容删去 */
  else if(currentUrl.endsWith('.woff2') || currentUrl.endsWith('.woff') )
    return 'application/x-font-woff';   
  else if(currentUrl.endsWith('.ttf'))
    return 'application/octet-stream';
  else if(currentUrl.endsWith('.jpg'))
    return 'image/jpg';
  else if(currentUrl.endsWith('.png'))
   return 'image/png';
}


function readHtml(req, res){    //读取html页面
  let currentUrl = req.url;
  let htmlName = 'square';    //默认为广场页
  if(currentUrl !== '/')
    htmlName = currentUrl.slice(currentUrl.indexOf('/')+1, currentUrl.indexOf('.'));
  fs.readFile('./view/square/' + htmlName + '.html', 'utf8', function(err, data){
    if (err) res.end(err);
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end(data);
  })
}


function readSource(req, res){    //读取静态资源
  let currentUrl = req.url;
  let type = judgeResourceType(currentUrl);
  fs.readFile('.' + currentUrl, 'binary', function(err, data){    //这里使用utf8无法显示图片，使用binary正常，而文件的contenttype影响不大
    if (err) res.end(err);
    res.setHeader('Content-Type', type + ';charset=utf-8');
    res.write(data,'binary');
    res.end();
  })
}


function readDB(req, res){    //查询数据库数据
  let currentUrl = req.url;
  let collection = 'square';    //默认为广场页
  if(currentUrl === '/detailContent')
    collection = 'comments';
  //post
  let reqBody='';
  req.on('data',function (data) {
      reqBody += data;
  });
  // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
  req.on('end',function () {    //req完成后处理数据并返回
      reqBody = JSON.parse(reqBody);
      queryData(reqBody, res, collection);
    }
  )
}


function insertDB(req, res){
  let currentUrl = req.url;
  let collection = 'square';
  if(currentUrl.indexOf('DetailContent') !== -1)
    collection = 'comments';
  //post
  let reqBody='';
  req.on('data',function (data) {
      reqBody += data;
  });
  // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
  req.on('end',function () {    //req完成后处理数据并返回
      reqBody = JSON.parse(reqBody);
      //let id = '';
      insertData(reqBody, res, collection);      
    }
  )
}
