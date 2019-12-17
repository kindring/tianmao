//商品管理的部分数据库操作
const pool = require('./pool.js');
function query(sql,values,cb){
    pool.getConnection((err,conn)=>{
        if(err){return cb(err)}
        conn.query(sql,values,cb);
        conn.release();
    })
}
function add_goods(json, cb) {
    // 数据格式,至少一个sku,商品名称
    pool.getConnection(function (err, coon) {
        if (err) {
            return console.log(err)
        }
        //先生成一个商品id
        new_goods_id(coon, function (err,goods_id) {
           if (err) {
                console.error(err);
                coon.release();
                return cb({code: 500, message: err.message, descript: "服务器错误"})
            }
           // console.log(JSON.stringify(json.pars));
            let promise = new Promise((resolve, reject) => {
                var sql = "insert into goods (goods_id,shop_id,category_id,goods_name,parameter,brief) values(?,?,?,?,?,?)";
                var values = [goods_id, json.shop_id, json.category_id, json.name, JSON.stringify(json.pars), json.brief || "未填写简介"];
                coon.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("添加商品失败");
                        return reject(err)
                    }
                    //console.log(result);
                    //添加成功,新增sku
                    resolve(goods_id);
                })
            });//添加商品的sql操作
            promise.then((goods_id)=>{
                //往sku表中添加sku数据
                // 生成sql数据
                var sql = "insert into goods_sku (goods_id,sku_code,price,stock,sp) values ";
                var values = [];
                var oneFlag = true;
                for(var key in json.skus){
                    //通过循环遍历sku数据,此时第一条数据至少有相对完整的数据
                    var str = "";
                    if(oneFlag){
                        oneFlag = false;
                    }else{
                        sql+=",";
                    }
                    let price = json.skus[key].price||json.skus[0].price;
                    let total = json.skus[key].total||json.skus[0].total;
                    let sku_code = json.skus[key].sku_code||json.skus[0].sku_code||"000000";
                    let datas = json.skus[key].datas||json.skus[0].datas;
                    datas=JSON.stringify(datas);
                    sql+=`(${goods_id},${sku_code},${price},${total},?)`;
                    values.push(datas);
                }
                console.log("生成的sql"+sql);
                coon.query(sql,values,function(err,result){
                    if(err){
                    var del_sql = "delete from goods where goods_id = ?";
                    var del_values = [goods_id];
                    conn.query(del_sql,del_values,function(del_err,data){
                        if(del_err){
                            conn.release();
                            return cb({code:500,message:del_err.message,descript:"添加失败请重新尝试添加商品"});
                        }
                        coon.release();
                        return cb({code:500,message:err.message,descript:"添加失败请重新尝试添加商品"});
                    });
                    //在有错误时将刚才添加的无用数据进行删除操作
                   }else{
                    //没有错误则关闭连接并且返回id
                    coon.release();
                    cb(null,result,goods_id);
                   }
                    
                })
            },(err)=>{
                coon.release();
                cb({code: 500, message: err.message, descript: "添加商品失败"})
            })//添加sku数据的操作
        });
    })

};//添加商品

var goods = {
    category_id: 2,//分类id
    name: "小米9",//商品名称
    brief: "最新款的小米手机",//简介
    publish_status: 0,//即存入仓库
    pars: [
        {key: "屏幕尺寸", value: "5寸"},
        {key: "电池容量", value: "4000毫安"},
        {key: "网络运营商", value: "电信,移动,联通"},
        {key: "分辨率", value: "4k"}
    ],//属性表,
    skuValues: [
        {
            id: 1,//属性的id
            name: "颜色"//属性的名称
        },
        {
            id: 2,
            name: "内存"
        },
    ],//存储sku对象的属性
    skus: [
        {
            values: [
                {id: 1, value: '革命红'},
                {id: 2, value: '16g'},
            ],
            stock: 15,//存货
            price: 100,
        }, {
            spe_value: [
                {id: 1, value: '飘雪白'},
                {id: 2, value: '32g'},
            ],
            stock: 15,//存货
            price: 1988,
        }, {
            spe_value: [
                {id: 1, value: '炫酷黑'},
                {id: 2, value: '64g'},
            ],
            stock: 10,//存货
            price: 3200,
        },
    ]
};//添加商品因该有的数据结构?
//暂时先让商家添加这么一些信息,然后可以到商品列表中自行修改一些数据
// add_goods(goods);

function search_goods() {
    pool.getConnection(function (err, coon) {
        if (err) {
            return console.log(err)
        }
        var sql = "select * from goods";
        coon.query(sql, null, (err, result) => {
            if (err) {
                return console.log(err.message);
            }
            console.log(result);
            var par = JSON.parse(result[0].parameter);
            console.log(par);
        })
    })
}

function setcover(json,cb){
    if(!json.goods_id||!json.filePath||!json.index){return cb({message:"数据缺失"})}
    //连接
    pool.getConnection((err,conn)=>{
        if(err){return cb({message:"无法连接数据"})}
        conn.query("select * from goods where goods_id = ?",json.goods_id,(err,result)=>{
            if(err){
                conn.release();
                return cb({message:err.message})}
            if (result.length<1){conn.release();return cb({message:"可能传入了错误的商品id,无法匹配"})}
            var sql = "insert into goods_cover (goods_id,filepath,_index) values (?,?,?)";
            var values = [json.goods_id,json.filePath,json.index];
            conn.query(sql,values,(err,result)=>{
                if(err){
                    conn.release();
                    return cb({message:err.message})}
                cb(null,result)//添加完成
            })
        })

    })
}

function new_goods_id(moon, cb) {
    var sql = "select * from goods where goods_id=?";
    var rnd = "";
    var one = true;
    for (var i = 0; i < 10; i++) {
        var num = Math.floor(Math.random() * 10);
        if(num==0&&one){
            num+=1;
            one = false;
        }
        rnd += num;
    }
    var values = rnd;
    moon.query(sql, values, function (err, result) {
        if (err) {
            return cb(err)
        }
        if (result.length !== 0) {
            new_goods_id(moon, cb);//在不为0时继续调用自己
        } else {
            cb(null, rnd);
        }
    })
}//生成一个新的商品id

function search_me_goods(condition,limition,callback){
    //判断参数数量
    let cb,limit;
    limit = limition;
    if(arguments.length===2){
        if(typeof(arguments[1])==="function"){
            throw "如果只传入两个参数第二个参数则需要为callback"
        }
        cb = arguments[1];//如果只有两个参数则表明第二个参数为callback
        limit = {
            limit:20,
            page:1,
        }//使用默认限制
    }else if(arguments.length<2){
        throw "该方法至少需要两个参数"
    }else{
        cb = arguments[2];
    }
    // 创建sql语句
    
    //创建连接
    pool.getConnection(function(err,conn){
        if(err){ return cb(err);}
        //promise进行并发连接查询

        let goods_base = new Promise((resolve,reject)=>{
            var sql = "select * from goods_base where shop_id = ? limit ? , ?";
            var values = [condition.shop_id,limit.limit*(limit.page-1),limit.limit];
            conn.query(sql,values,function(err,result){
                if(err){
                    return reject(err);
                }
                resolve(result);
            })
        });
        let goods_num = new Promise((resolve,reject)=>{
            var sql = "select count(*) from goods_base where shop_id = ?";
            var values = [condition.shop_id];
            conn.query(sql,values,function(err,result){
                if(err){
                    return reject(err);
                }
                resolve(result);
            })
        });
        Promise.all([goods_base,goods_num]).then(
            function(values){
                let goods_list = values[0];
                let number = values[1][0]['count(*)'];
                let residuce = number-goods_list.length;
                console.log(number);
                let data = {
                    number:number,//总数量
                    residuce:residuce,//剩余多少条
                    data:goods_list,//具体数量
                }
                console.log(data);
                cb(null,data);
                conn.release();
            },
            function(error){
                conn.release();//关闭连接
                cb(err);
            }
        )
    })
}//搜索商品,按照条件搜索

function search_sku(){
    var sql = 'select * from goods_sku';
    query(sql,null,function(err,result){
        if(err){
            console.log(err);
        }
        console.log(result);
        var list = [];
        for(var i in result){
            result[i].sp = JSON.parse(result[i].sp);
        }
        console.log(result);
    });
}
search_sku();
/*
/*
*/
function search(condition,limit,callback){
    //判断参数数量
    // 如果只有一个参数则直接查询不做任何筛选
    let default_limit = {
        page:1,
        limit:20,
    }//默认分页配置
    let option = {
        category:null,//分类选择
        shop:null,//商家id,
        shop_name:null,//商家名称
        keywords:null,//关键字  商品名称中包含此值的 以及分类关键字中包含有此值的 商品
        delected:null,//是否被删除的状态  ,默认应当为未删除
        veify_status:null,//审核状态,是否被审核
        publish_status:null,//上架状态,可以为0,1或者true或者false.对应值为 0-false-未上架(存入仓库)

    };//默认的参数,只允许从此间获取用来筛选的字段  只在其有值时进行数据获取  是否被删除的状态时默认显示为未删除的数据
    if(arguments.length===1){
        if(typeof(argument[0]) != 'function'){throw "如果你只想使用默认配置搜索,至少需要一个callback回调来获取结果";}
        //直接生成sql进行查询即可
        let sql = "select * from goods_base limit ?,?";
        let values = [default_limit.limit*(default_limit.page-1),default_limit.limit];
        query(sql,values,callback);
    }else if(arguments.length===2){
        // 如果只有两个参数则查看第一个参数的具体数据来查看该如何获取数据
        if(typeof(arguments[1])!='function'){throw "两个参宿时第二个参数必须为callback"}
        if(arguments[0].limit||argument[0].page){
            //此项为分页数据
            // 无需获取数据直接
            default_limit.limit = arguments.limit||default_limit.limit;
            default_limit.page = arguments.page||default_limit.page;
            // 直接生成一个普通的sql
            let sql = "select * from goods_base limit ?,?";
            let values = [default_limit.limit*(default_limit.page-1),default_limit.limit];
            query(sql,values,callback);
        }else{
            //认为是用来筛选的函数
        }
    }else{
        //在参数大于等于3个时,只取三个参数
        //第一条件  使用分类查询
        
    }
}

module.exports.add_goods = add_goods;//添加商品
module.exports.setcover = setcover;//设置商品图片
module.exports.search_me_goods =search_me_goods;//搜索商家图片


