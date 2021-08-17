//发送请求先必须先启动服务器（运行该js代码）

let http=require("http")
let url=require("url")
let querystring=require("querystring")//需要下包
let MongoClient = require('mongodb').MongoClient;
let MongoUrl = "mongodb://localhost:27017/";
// var fs=require("fs")

http.createServer(function(req,res){
    //post
    let reqBody='';
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量
    req.on('data',function (data) {
        reqBody += data;
    });
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end',function () {    //req完成后处理数据并返回
        reqBody = JSON.parse(reqBody);
        //查询数据库并获取资源然后返回
        switch(reqBody.type){
            case 'square':    //初始化数据请求
                queryData(reqBody, res, 'square');
                break;
            case 'userPost':
                queryData(reqBody, res, 'square');
                break;
            case 'detailContent':
                queryData(reqBody, res, 'comments');
                break;
        }
        
    })

    //************************************解析get方法请求
    // obj = querystring.parse/* 以&和=为分隔符将字符串转成对象 */(url.parse(req.url)/* 将req对象中的url字符串转成对象 更好的区分path和query */.query);
    // res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});  //向响应头中写入响应码，内容类型，解码格式
    // res.end(JSON.stringify(obj)/* 参数为字符串类型 */);
}).listen(3000);    //监听3000端口

function queryData(req, res, collection){
    MongoClient.connect(MongoUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("square");      //数据库
        dbo.collection(collection).find(queryRequest(req)).skip(req.start).limit(req.num).toArray(function(err, result) {
            if (err) throw err;
            res.setHeader("Access-Control-Allow-Origin", "*");      //允许跨域
            res.writeHead(200, {'Content-Type':'text/html; charset = UTF-8'});
            res.end(JSON.stringify({result}));
            db.close();
    });
    });
}

function queryRequest(req){
    return req.email ? req.id ? {'email': req.email, 'id': req.id} : {'email': req.email} : '';
}