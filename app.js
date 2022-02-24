//1.引入http模块
let http = require('http')
let {router} = require('./router');

// let url = require('url')
// let querystring = require('querystring')


//2.创建web服务器
let server = http.createServer(router);
//3.监听请求
// server.on('request', function(req, res){
// 	router(req, res);
// });
//4.启动服务
server.listen(3000, function(){
	console.log('启动成功，访问：http://localhost:3000')
})