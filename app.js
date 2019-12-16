const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const sockets = require('./model/sockets.js');//socktes列表,用来作为全局作用域存储所有的socket连接

const server_config = require('./server_config.json');
const platform = require('./routers/platform');//平台管理路由
const platform_goods = require('./routers/platform_goods');//平台与商品之间的路由
const public_interface = require('./routers/public_interface');//公共接口
const merchant = require('./routers/merchant');//商家路由
const goods = require('./routers/goods.js');//商品路由
let public_path = require('./model/public_file_path.js');
let app = express();
app.use(session({
        secret: 'tmshop',
        name: 'session',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie: {maxAge: 1800000 },  //过期时间半小时
        keys:['staff','user'],
        resave: false,
        saveUninitialized: true,
 }));
app.set('views',path.join(__dirname,'views'));
app.engine('.html',require('express-art-template'));

// app.use(function(req,res,next){
//     //console.log("此处请求的路径为:"+req.url);
//     next();
// });
// let conn
app.use('/static',express.static(path.join(__dirname,server_config.static_path)));
app.use('/imgs',express.static(path.join(__dirname,server_config.static_path,'/imgs')));
app.use('/js',express.static(path.join(__dirname,server_config.static_path,'/js')));
app.use('/css',express.static(path.join(__dirname,server_config.static_path,'/css')));
app.use('/model',express.static(path.join(__dirname,'/model')));
app.use('/picture',express.static(path.join(__dirname,'/picture')));
// app.use('/vue',express.static(path.join(__dirname,'/vue')));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
// console.log(platform);
app.use('/platform',platform);
app.use('/platform_goods',platform_goods);
app.use('/merchant',merchant);
app.use('/goods',goods);
app.use(public_interface);//公共接口
app.use('*',function(req,res){
    res.send("404 page not found"+req.path)
});
var server = app.listen(80,()=>{
    console.log("server is running");
});
var io = require('socket.io').listen(server);
io.on('connection',function(socket){
    console.log('成员连接');
    socket.on('message',function(obj){
        try{
            obj=JSON.parse(obj);
            io.emit('message',obj);
            if(obj.func === "connect"){
                console.log("连接");
                sockets[obj.staff_id] = socket;
            }
        }catch(e){
            console.log(e);
        }
    });
});

//使用全局变量将部分数据存储在其模块中
public_path.paths['index']=__dirname;