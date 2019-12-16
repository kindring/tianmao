const pool = require('./pool.js');

function query(sql,values,cb){
    pool.getConnection((err,conn)=>{
        if(err){return cb(err)}
        conn.query(sql,values,cb);
        conn.release();
    })
}
//简写部分代码

//商家账号登录
function login(json,cb,cb2){
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数"})}
    if(!json.account||!json.password){return cb({message:'没有相应的账号密码'})}
    var sql = 'select * from shop_basic where shop_account = ? and shop_password = ?';
    var values = [json.account,json.password];
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//商家登录功能

//商家账号注册查询商家名字是否存在
function registerC(json,cb,cb2){
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数"})}
    if(!json.account||!json.password||!json.name){return cb({message:'没有相应的账号密码'})}
    var sql1 = 'select * from shop_basic where shop_name = ?';
    var values = [json.name];
    query(sql1,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//根据名称查询数据

// 商家账号注册插入数据库
function registerI(json,cb,cb2){
    //包含商家账号,商家密码的对象
    if(arguments.length<=1){return cb({message:"该方法至少需要2个参数"})}
    if(!json.account||!json.password||!json.name){return cb({message:'没有相应的账号密码'})}
    var sql1 = 'insert into shop_basic(shop_id,shop_account,shop_password,shop_name) values(null,?,?,?)';
    var values = [json.account,json.password,json.name];
    query(sql1,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//添加店铺数据

function informationAdd(shop_name,shop_descript,shop_address,untitled,landlord,shop_account,cb,cb2){
	var sql = 'UPDATE shop_basic SET shop_name=?,shop_descript=?,shop_address=?,untitled=?,landlord=? WHERE shop_account=?';
	var values = [shop_name,shop_descript,shop_address,untitled,landlord,shop_account];
	query(sql,values,function(err,result){
        if(err){
        	return cb({
        		code:'500',message:err.message
        	})
        }
        cb(err,result)
    })
}//更新店铺数据?

function informationY(shop_name,cb) {
	var sql='select * from shop_basic where shop_name=?';
	query(sql,[shop_name],function(err,result){
		if(err){
        	return cb({
        		code:'500',message:err.message
        	})
        }
        cb(err,result)
	})
}//按照名称查询店铺?

// 商家头像更改保存路由
function changeBusinessesface(shop_photo,shop_account_change,cb,cb2){
	var sql = 'UPDATE shop_basic SET shop_photo = ? WHERE shop_account=?';
	var values = [shop_photo,shop_account_change]
	query(sql,values,function(err,result){
        if(err){
        	return cb({
        		code:'500',message:err.message
        	})
        }
        cb(err,result)
    })
}

// 商家宝贝详情数据保存
function releaseBaby(cb,cb2){
	var sql = 'select * from goods_category';
	query(sql,function(err,result){
		if(err){
        	return cb({
        		code:'500',message:err.message
        	})
        }
        cb(err,result)
	})
}//查询分类数据?废弃

function releaseDetails1fields(shop_id,type_id,goods_name,goods_sn,price,stock,cb,cb2){
	var sql = 'insert into goods(shop_id,goods_id,type_id,goods_name,goods_sn,price,stock) values(?,null,?,?,?,?,?)'
	var values = [shop_id,type_id,goods_name,goods_sn,price,stock]
	query(sql,values,function(err,result){
        if(err){
        	return cb({
        		code:'500',message:err.message
        	})
        }
        // cb(err,result)
        var sql1 = 'select * from goods order by goods_id desc'
        query(sql1,function(err,result){
        	if(err){
	        	return cb({
	        		code:'500',message:err.message
	        	})
	        }
	        cb(err,result)
        })
    })
}

function releaseDetails1files(goods_id,F,cb,cb2){
	var sql = 'insert into goods_cover(goods_id,filepath) values(?,"?")';
	var values = [goods_id,F];
	query(sql,values,function(err,result){
		if(err){
        	return cb({
        		code:'500',message:err.message
        	})
        }
        cb(err,result)
	})
}


//导出此接口
module.exports.login = login;
module.exports.registerC = registerC;
module.exports.registerI = registerI;
module.exports.informationAdd = informationAdd;
module.exports.informationY = informationY;
module.exports.changeBusinessesface = changeBusinessesface;
module.exports.releaseBaby = releaseBaby;
module.exports.releaseDetails1fields = releaseDetails1fields;
module.exports.releaseDetails1files = releaseDetails1files;