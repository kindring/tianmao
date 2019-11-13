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
}

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
}

function update_category(json,cb){
    if(!json.id){return cb({code:403,message:"数据缺失",descript:"数据缺失,拒绝操作"})}
    console.log(json);
    var sql = "update goods_category set name = '"+json.name+"',show_status = '"+json.nav_status+"',nav_status = '"+json.show_status+"',keywords = '"+json.keywords+" ',product_unit = '"+json.product_unit+" ' where id = "+json.id;
    console.log(sql);
    var values = [json.id];
    query(sql,cb);
}

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
}
module.exports.categorys = categorys;
module.exports.category_add = category_add;
module.exports.update_category = update_category;
module.exports.delect_category = delect_category;