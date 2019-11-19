//该文件进行平台与商品间的管理
const fs = require('fs');
const path = require('path');
const db = require('../database/all_database.js');//封装好的数据库查询方法
const reg = require('../model/regs.js');
function check_func(json){
    //传入员工编号以及功能编号
    //返回promise对象
    let promise=new Promise((resolve,reject)=>{
        //此方法因为是异步查询数据库所以使用promise进行回调,只判断是否可以操作无视是否可以
        //判断数据是否合法
        if(!reg.test('id',json.staff_id)||!reg.test('id',json.func_id)){
            console.log(json);
            return resolve(false)}
        db.platform.check_func({
            staff_id:json.staff_id,
            func_id:json.func_id
        },function(err,data){
            if(err){
                console.log("在检测功能是否有权限调用时: "+err.message);
                console.log(err);
                return resolve(false)
            }
            console.log(data);
            if(data.length===0){return resolve(false)}
            resolve(true);
        })
    });
    return promise;
}
function categorys(req,res){
    //直接调用数据库拿取所有数据,可以指定参数之只获取某类下面的子集,也可以不指定返回全部数据
    var parent_id = req.query.parent_id;
    if(!parent_id){
        //未指定父级时返回全部数据
        db.platform_goods.categorys(function(err,result){
            if(err){return res.json({
                code:500,
                message:err.message,
                descript:"错误,未知,请调试"
            })}
            //分类列表
            let categorys = {};
            for(let i in result){
                if(result[i].parent_id===0){
                    categorys[result[i].id] = result[i];
                    categorys[result[i].id].node_category = {};//二级
                }else{
                    //二级分类添加
                    if(categorys[result[i].parent_id]){
                        categorys[result[i].parent_id].node_category[result[i].id] = result[i];
                        categorys[result[i].parent_id].node_category[result[i].id].node_category = {};//三级
                    }else{
                        //三级分类
                        for(let j in categorys){
                            //循环获取1级分类下边的二级分类
                            if(categorys[j].node_category[result[i].parent_id]){
                                //匹配到则表明有二级分类
                                categorys[j].node_category[result[i].parent_id].node_category[result[i].id] = result[i];
                                break;
                            }
                        }
                    }

                }
            }
            res.json({
                code:200,
                data:categorys,
                message:'ok',
                descript:"成功"
            })
        })
    }else{
        //指定了父级时返回子集数据
        //判断数据合法性
        if(!reg.test("id",parent_id)){return res.json({code:403,message:"data type error",descript:"数据格式错误"})}
        db.platform_goods.p_categorys(parent_id,function(err,result){
            if(err){return res.json({code:err.code||500,message:err.message||"服务器错误",descript:err.descript||"服务器错误"})}
            res.json({code:200,data:result,message:"ok",descript:"ok"})
        })
    }

}//获取所有的分类,按格式返回

function category_num(req,res){
    //需要权限?命名
    //获取逻辑,判断是否有父级id,如果没有则显示一级分类,有的话则显示该分类下边的所有匹配的功能
    var category_id = req.query.parent_id||0;
    console.log(category_id);
    if(!reg.test('id',category_id)){return res.json({code:403,message:"数据格式错误",descript:"数据格式错误"})}
    db.platform_goods.category_num(category_id,function(err,result){
        if(err){return res.json({code:err.code||500,message:err.message||"服务器错误",descript:err.descript||"服务器错误"})}
        res.json({code:200,data:result})
    })
}//分类下边的数量

function category_add(req,res){
    let category = req.body;
    if(!category.name||!category.parent_id){return res.json({code:402,message:"添加分类必须要有分类名称",descript:"添加分类失败"})}
    db.platform.check_func({
        staff_id:req.session.staff,
        func_id:9
    },function(err,func){
        if(err){return res.json({code:500,message:err.message,descript:"出现错误了"})}
        if(func.length===0){return res.json({code:500,message:"not this func",descript:"没有该方法"})}
        //有此功能,继续
        db.platform_goods.category_add(category,function(err,result){
            if(err){return res.json({code:403,message:err.message,descript:"错误"})}
            res.json({code:200,message:"成功",descript:"ok",data:result});
        })
    })
}//添加分类

function update_category(req,res){
    let category = req.body;
    if(!category.id){return res.json({code:402,message:"修改分类分类必须要有分类id",descript:"修改分类失败"})}
    db.platform_goods.update_category(category,function(err,data){
        console.log(err);
        if(err){return res.json({code:err.code|500,message:err.message,descript:err.descript|"未知错误"})}
        console.log(data);
        res.json({code:200,message:"ok",descript:"ok"})
    })
}//更新指定分类数据

function add_attr(req,res){
    //判断数据是否合法
    if(!req.body){return res.json({code:403,message:"must have data",descript:"必须含有数据"})}
    if(!req.body.name||!req.body.category_id||!req.body.select_type||!req.body.input_type||!req.body.input_list||!req.body.hand_add_status||!req.body.type||!req.body.required){
        console.log("添加分类所输入的数据----");
        console.log(req.body);
        return res.json({code:403,message:"data is bug",descript:"数据不完整"})
    }
    let body = req.body;
    //判断是否有功能
    check_func({
        staff_id:req.session.staff,
        func_id:11
    }).then((flag)=>{
        if(!flag){return res.json({code:403,message:"fail not this func",descript:"失败,没有此功能"})}
        // 有权限,判断数据是否合法
        // 判断数据是否存在
        db.platform_goods.add_attr(body,function(err,result){
            if(err){return res.json({code:err.code||500,message:err.message||"server is error",descript:err.descript||"服务器错误"})}
            res.json({code:200,data:result,message:"ok",descript:"ok"})
        });
    })
}//添加属性规格

function delect_category(req,res){
    //首先判断是否有此功能
    var id = req.query['id'];
    if(!id){return res.json({code:402,message:"删除分类必须要有分类id",descript:"删除分类必须要有分类id"})}
    check_func({staff_id:req.session.staff,func_id:10}).then((flag)=>{
        if(!flag){return res.json({code:403,message:"无权限访问",descript:"无权限使用该功能"})}
        //判断被删除者是否被关联,有子类则无法直接删除
        db.platform_goods.delect_category(id,function(err,result){
            if(err){return res.json({code:err.code||500, message: err.message || "未知错误",descript:err.descript||"未知错误"})}
            res.json({code:200,message:'ok',descript:'ok'});
        })
    })
}//删除分类的方法

function attr(req,res){
    //判断是否有对应参数
    if(!req.query.category_id){return res.json({code:403,message:"fail",descript:"失败,该接口因传入分类id即category_id"})}
    db.platform_goods.attr(req.query.category_id,function(err,result){
        if(err){return res.json({code:403,message:err.message,descript:"fail"})}
        res.json({code:200,data:result,message:"ok",descript:"ok"})
    });
}//获取指定分类下边的规格与参数信息



module.exports.categorys = categorys;
module.exports.category_add = category_add;
module.exports.update_category = update_category;
module.exports.delect_category = delect_category;
module.exports.category_num = category_num;

module.exports.add_attr = add_attr;
module.exports.attr = attr;