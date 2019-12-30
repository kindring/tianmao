const mysql = require('mysql');
const databseConfig = require('../config/database.json');//数据库连接的配置文件
//作用
//导出全局连接池对象,使其可以统一使用此连接池操作数据库
const pool = mysql.createPool({
    connectionLimit:databseConfig.connectionLimit||100,//连接限制
    host:databseConfig.host,//地址
    user:databseConfig.user,//用户
    password:databseConfig.password,//密码
    database:databseConfig.database//数据库名称
});//创建连接池对象
module.exports=pool;


