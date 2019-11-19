const db = require('../database/all_database.js');//封装好的数据库查询方法
const reg = require('../model/regs.js');

function get_province(req,res){
    db.address.province(function(err,data){
        if(err){return res.json({code:500,message:err.message||"服务器错误"})}
        res.json({code:200,data:data})
    })
}
function get_city(req,res){
    if(!req.query.province){return res.json({code:403,message:"需要指定获取什么省份下的城市,必须要有参数province"})}
    var code = req.query.province;
    db.address.city(code,function(err,data){
        if(err){return res.json({code:500,message:err.message||"服务器错误"})}
        res.json({code:200,data:data})
    })
}
function get_area(req,res){
    if(!req.query.city){return res.json({code:403,message:"需要指定获取什么城市下的区域,必须要有参数city"})}
    var code = req.query.city;
    db.address.area(code,function(err,data){
        if(err){return res.json({code:500,message:err.message||"服务器错误"})}
        res.json({code:200,data:data})
    })
}
function get_street(req,res){
    if(!req.query.area){return res.json({code:403,message:"需要指定获取什么区域下的街道,必须要有参数area"})}
    var code = req.query.area;
    db.address.street(code,function(err,data){
        if(err){return res.json({code:500,message:err.message||"服务器错误"})}
        res.json({code:200,data:data})
    })
}

module.exports.get_province = get_province;
module.exports.get_city = get_city;
module.exports.get_area = get_area;
module.exports.get_street = get_street;