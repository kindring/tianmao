const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const server_config = require('./server_config.json');
const platform = require('./routers/platform');
const merchant = require('./routers/merchant');
const user = require('./routers/user');
const fs = require('fs');

let app = express();
app.use(
    session({
        secret: 'tmshop',
        name: 'session',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie: {maxAge: 1800000 },  //过期时间半小时
        keys:['staff','user'],
        resave: false,
        saveUninitialized: true,
 })
);
app.set('views',path.join(__dirname,'views'));
app.engine('.html',require('express-art-template'));

app.use(function(req,res,next){
    console.log("此处请求的路径为:"+req.url);
    next();
});
// let conn
app.use('/static',express.static(path.join(__dirname,server_config.static_path)));
app.use('/imgs',express.static(path.join(__dirname,server_config.static_path,'/imgs')));
app.use('/js',express.static(path.join(__dirname,server_config.static_path,'/js')));
app.use('/css',express.static(path.join(__dirname,server_config.static_path,'/css')));
app.use('/model',express.static(path.join(__dirname,'/model')));
app.use('/upload',express.static(path.join(__dirname,'/upload')));


// app.use('/vue',express.static(path.join(__dirname,'/vue')));
app.get('/vue/index.js',(req,res)=>{
    fs.readFile('./vue/index.vue',(err,data)=>{
        if(err){return res.end()}
        var obj={
            template: "<div>------------foo+++ <span v-text='title'></span></div>",
            data:function data(){
                return {
                    title:"abc"
                }
            }
        };
        for (var i in obj){
            obj[i]=obj[i].toString();
        }

        obj=JSON.stringify(obj);
        console.log(obj);
        res.send(obj);
    })
});
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// console.log(platform);
app.use('/platform',platform);
app.use('/merchant',merchant);
app.use('/user',user);

app.use('*',function(req,res){
    res.send("404 page not found"+req.url)
});
app.listen(8000,'127.0.0.1',()=>{
    console.log("server is running");
});
