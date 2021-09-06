let fs = require('fs')
let {queryDB, insertDB, updateDB, deleteDB} = require('./db');
const mime = {
  'css': 'text/css',
  'js': 'text/javascript',
  'woff2': 'application/x-font-woff',
  'woff': 'application/x-font-woff',
  'ttf': 'application/octet-stream',
  'jpg': 'image/jpg',
  'png': 'image/png'
}


function readHtml(req, res){    //读取html页面
  let currentUrl = req.url;
  let htmlName = 'square';    //默认为广场页
  if(currentUrl !== '/')
    htmlName = currentUrl.slice(currentUrl.indexOf('/')+1, currentUrl.indexOf('.'));
  fs.readFile('./view/square/' + htmlName + '.html', 'utf8', function(err, data){
    if (err) res.end(err);
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.end(data);
  })
}


function readSource(req, res){    //读取静态资源
  let currentUrl = req.url;
  let extName = currentUrl.slice(currentUrl.lastIndexOf('.')+1);
  let type = mime[extName];
  fs.readFile('.' + currentUrl, 'binary', function(err, data){    //这里使用utf8无法显示图片，使用binary正常，而文件的contenttype影响不大
    if (err) res.end(err);
    res.writeHead(200, {'Content-Type': type + ';charset=utf-8'});
    res.write(data,'binary');
    res.end();
  })
}


function readDB(req, res){    //查询数据库数据
  let type = req.type;
  let collection = 'square';    //默认为广场页
  if(type === 'detailContent-query')
    collection = 'comments';
  queryDB(req,collection).then(value => {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset = UTF-8',
      "Access-Control-Allow-Origin": "*"  //允许跨域
      });
    res.end(value);
  }, reason => {
    console.log(reason);
  });
}


function insertData(req, res){
  let type = req.type;
  let collection = 'square';
  if(type.indexOf('detailContent') !== -1)
    collection = 'comments';
  insertDB(req, collection).then(value => {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset = UTF-8',
        "Access-Control-Allow-Origin": "*"  //允许跨域
        });
      res.end(value);
    }, reason => {
      console.log(reason);
  }) 
}


function router(req, res){
  if(req.method === 'GET' || req.method === 'get'){
    let currentUrl = req.url;
    if (currentUrl === '/' || currentUrl.indexOf('html') !== -1) {    //请求页面
      readHtml(req, res);
    } 
    else if(currentUrl.startsWith('/public')){    //请求静态资源
      readSource(req, res);
    }
    else{
      res.writeHead(404, {'Content-Type': 'charset=utf-8'});
      res.end('Not Found');
    }
  }
  else if(req.method === 'POST' || req.method === 'post'){
    let reqBody='';
    req.on('data',function (data) {
        reqBody += data;
    });
    req.on('end', function(){
      reqBody = JSON.parse(reqBody)
      let type = reqBody.type;
      if(type === 'square-query' || type === 'userPost-query' || type === 'detailContent-query'){   //请求数据库数据
        readDB(reqBody, res);
      }
      else if(type.indexOf('insert') !== -1){    //包含'insert'的请求，向数据库更新并获取新内容
        insertData(reqBody, res);
      }
      else{
        res.writeHead(404, {'Content-Type': 'charset=utf-8'});
        res.end('Not Found');
      }
    })
  }
}


exports.router = router;