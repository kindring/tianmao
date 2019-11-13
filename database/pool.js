const mysql = require('mysql');
//作用
//导出全局连接池对象,使其可以统一使用此连接池操作数据库
const pool = mysql.createPool({
    connectionLimit:100,
    host:'127.0.0.1',
    user:'root',
    password:'password',
    database:'tm_test'
});//创建连接池对象
module.exports=pool;


