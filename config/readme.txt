配置文件应当全部放这个文件夹里面

文件作用描述:
    database.json   ->   用于存储连接数据库的配置
        内容
        {
            "host":"127.0.0.1",   
            "port":"3306",
            "user":"root",
            "password":"passworld",
            "connectionLimit":"100",
            "database":"tm_test"
        }
        host:数据库地址  port:数据库端口 user:连接的用户 password:密码 connectionLimit:连接池最大数量限制,这个可以为空  database:需要连接到的数据库的名称


    server.json     ->  设置服务器的端口号和监听的地址
        内容
        {
            "host":"127.0.0.1",
            "port":"80"
        }   
        host:ip地址  port:所监听的端口号