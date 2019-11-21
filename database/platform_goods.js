const pool = require('./pool.js');
function query(sql,values,cb){
    pool.getConnection((err,conn)=>{
        if(err){return cb(err)}
        conn.query(sql,values,cb);
        conn.release();
    })
}//简写部分代码

// categorys(function(err,result){
//     if(err){return console.log(err)}
//     var categorys = [];
//     for(let i in result){
//         if(result[i].parent_id===0){
//             result[i].node_catergory = [];
//             categorys.push(result[i])
//         }else{
//             //二级分类添加
//             for(var j in categorys){
//                 if(categorys[j].id === result[i].parent_id){
//                     //二级分类
//                     result[i].node_catergory = [];
//                     categorys[j].node_catergory.push(result[i]);
//                 }else{
//                     //三级分类
//                     for(var x in categorys[j].node_catergory){
//                         if(categorys[j].node_catergory[x].id === result[i].parent_id){
//                             //在二级分类列表中找到了当前的父级
//                             result[i].node_catergory = [];
//                             categorys[j].node_catergory[x].node_catergory.push(result[i]);
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     console.log(categorys);
//     // for(var i in categorys){
//     //     var one = categorys[i];
//     //     console.log("1级分类"+one.name);
//     //     for(var j in one.node_catergory){
//     //         var two = one.node_catergory[j];
//     //         console.log("   2级分类-"+two.name);
//     //         for(var x in two.node_catergory){
//     //             var three = two.node_catergory[x];
//     //             console.log("           3级分类---"+three.name);
//     //         };
//     //
//     //     }
//     // }
// });

function categorys(cb){
    var sql = "select * from goods_category";
    var values = [];
    query(sql,values,cb)
}//获取所有分类
function p_categorys(parent_id,cb){
    var sql = "select * from goods_category where parent_id = ?";
    var values = [parent_id||0];
    query(sql,values,cb);
}//获取指定分类下的所有子分类
//获取分类,理应归并为一个方法,使用arguments进行重构

function category_num(parent_id,cb){
    //查询视图
    pool.getConnection((err,coon)=>{
        if(err){return cb({code:500,message:err.message,descript:"连接错误"})}
        var pro_category_num = new Promise((resolve, reject)=>{
            var sql = "select * from category_count as n,goods_category as c where c.id = n.category_id and c.parent_id = ?";
            var values = [parent_id];
            coon.query(sql,values,function(err,result){
                if(err){return reject({message:err.message})}
                resolve(result);
            })
        });//获取带数量的分类
        var pro_category = new Promise((resolve, reject) => {
            var sql = "select * from goods_category as c where c.parent_id = ?";
            var values = [parent_id];
            coon.query(sql,values,function(err,result){
                if(err){return reject({message:err.message})}
                resolve(result);
            })
        }) ;
        Promise.all([pro_category,pro_category_num]).then((values) => {
            var result1 = values[0];
            var result2 = values[1];
            var list = [];
            for(var i in result1){
                item = result1[i];
                var tem = null;
                for(var j =0;j<result2.length;j++){
                    item2=result2[j];
                    //数组去重,在匹配到对应的之后将其移除
                    if(item.id === item2.category_id){
                        // 如果有对应的则将其push至数组中
                        tem = item2;
                        result2.splice(j,1);
                    }
                }
                //console.log(result2);
                if(!tem){
                    tem=item;
                    tem.specifications = 0;
                    tem.parameter = 0;
                }
                list.push(tem);
             }
            cb(null,list);
            coon.release();
        },(err)=>{
            console.log(err);
            cb({code:403,message:err.message,descript:"服务器错误"});
            coon.release();
        })
    })

}//获取分类下边的属性规格数量

function category_add(json,cb){
    if(!json.name||!json.parent_id){return res.json({code:403,message:"数据缺失",descript:"数据缺失"})}
    //判断是否有相应的父级id
    pool.getConnection(function(err,coon){
        if(err){coon.release();return cb({message:err.message})}
        if(json.parent_id==0){
            console.log("1级分类");
            //1级分类,无需验证父级
            var sql = "insert into goods_category (parent_id,name,show_status,nav_status,keywords,description,product_unit) values(?,?,?,?,?,?,?)";
            var values = [json.parent_id,json.name,json.show_status||0,json.nav_status||0,json.keywords||'',json.description||'',json.unit||'无'];
            coon.query(sql,values,function(err,result){
                cb(err,result);
                coon.release();
            });
        }else{
            //非一级分类需验证是否存在
            var sql = "select * from goods_category where id = ?";
            var values = [json.parent_id];
            coon.query(sql,values,function(err,result){
                if(err){coon.release();return cb({message:err.message})}
                if(result.length===0){coon.release();return cb({message:"无法进行添加无效的父级id"})}
                var _sql = "insert into goods_category (parent_id,name,show_status,nav_status,keywords,description,product_unit) values(?,?,?,?,?,?,?)";
                var _values = [json.parent_id,json.name,json.show_status||0,json.nav_status||0,json.keywords||'',json.description||'',json.unit||'无'];
                coon.query(_sql,_values,function(_err,_result){
                    cb(_err,result);
                    coon.release();
                });

            })
        }
    })
}//添加分类

function update_category(json,cb){
    if(!json.id){return cb({code:403,message:"数据缺失",descript:"数据缺失,拒绝操作"})}
    console.log(json);
    var sql = "update goods_category set name = '"+json.name+"',show_status = '"+json.nav_status+"',nav_status = '"+json.show_status+"',keywords = '"+json.keywords+" ',product_unit = '"+json.product_unit+" ' where id = "+json.id;
    console.log(sql);
    var values = [json.id];
    query(sql,cb);
}//更新某个分类

function delect_category(id,cb){
    if(arguments.length < 2){return cb({message:"该方法必须要有被删除的id和回调",descript:"该方法必须要有被删除的id和回调"})}
    pool.getConnection((err,coon)=>{
        if(err){return cb({message:err.message,descript:"连接失败"})}
        var sql = "select * from goods_category where parent_id = ?";
        var values = [id];
        coon.query(sql,values,function(err,result){
            if(err){coon.release(); return cb(err)}
            if(result.length!==0){coon.release();return cb({code:400,message:"conot delect this category,beacse this category have child category",descript:"无法删除含有子分类"})}
            var _sql = "delete from goods_category where id = ?";
            var _values = [id];
            coon.query(_sql,_values,function(_err,_result){
                if(_err){coon.release();return cb(_err)}
                cb(null,_result);
            })
        })
    })
}//删除某个分类

function add_attr(attr,cb){
    // 是否判断数据是否合法?判断分类是否存在?
    if(!attr.name||!attr.category_id||!attr.select_type||!attr.input_type||!attr.input_list||!attr.hand_add_status||!attr.type||!attr.required){return cb({code:403,message:"data is bug",descript:"数据不完整"})}
    pool.getConnection((error,coon)=>{
        if(error){return cb({message:error.message,descript:"连接失败"})}
        var category = new Promise((resolve, reject) => {
            var sql = "select * from goods_category where id = ?";
            var values = [attr.category_id];
            coon.query(sql,values,function(err,result){
                if(err){return reject(err)}
                if(result.length===0){return reject({code:404,message:"选择的分类不存在",descript:"选择的分类不存在"})}
                if(result[0].parent_id===0){return reject({code:403,message:"one level not allow add attr",descript:"一级分类不允许添加分类"})}
                resolve(result[0]);
            })
        });
        //查询一下分类是否存在,并且判断是否在对一级分类进行添加
        category.then(()=>{
            var sql = "insert into goods_attribute (name,category_id,select_type,input_type,input_list,hand_add_status,type,required) values(?,?,?,?,?,?,?,?)";
            var values =[attr.name,attr.category_id,attr.select_type,attr.input_type,attr.input_list,attr.hand_add_status,attr.type,attr.required];
            console.log(values);
            coon.query(sql,values,function(err,result){
                if(err){coon.release();return cb(err);}
                cb(null,result);
                coon.release();
            })
        },(err)=>{
            cb(err);
            coon.release();
        });
    });
}//添加属性

function attr(category_id,cb){
    var sql = "select * from goods_attribute where category_id = ?";
    var values = [category_id];
    query(sql,values,cb);
}//获取指定分类下的属性

function attribute_chnage(attr,cb){
   //使用for循环生成sql语句
    if(arguments.length<2){
        return //未正常调用,无法继续执行
    }
    var sql = "update goods_attribute set ";//指定字段更新
    var values = [];
    for(var key in attr){
        if(key != "id"){
            //在不为id时进行sql 添加.暂时未判断是否存在于字段中
            if(values.length===0){
                // 第一个
                sql = sql + key +"= ?";
                var value = attr[key];
                if(value == "false"){value = 0}//如果传入的值有true或者false等进行转化成0或者1
                if(value == "true"){value = 1}
                values.push(value);
            }else{
                sql = sql +','+key+"= ?";
                var value = attr[key];
                if(value == "false"){value = 0}//如果传入的值有true或者false等进行转化成0或者1
                if(value == "true"){value = 1}
                values.push(value);
            }
        }
    }
    if(values.length<1){return cb({message:"没有要改变的值"})}
    sql += " where id = ?";
    values.push(attr.id);
    console.log("生成的sql语句为:"+sql);
    console.log(values);
    query(sql,values,cb);
}//属性修改功能

module.exports.categorys = categorys;
module.exports.p_categorys = p_categorys;
module.exports.category_num = category_num;
module.exports.category_add = category_add;
module.exports.update_category = update_category;
module.exports.delect_category = delect_category;
module.exports.add_attr = add_attr;
module.exports.attr = attr;
module.exports.attribute_change = attribute_chnage;