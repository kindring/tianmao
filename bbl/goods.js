let db = require('../database/all_database.js');
let fs = require('fs');
let path = require('path');
let public_path = require('../model/public_file_path.js');//公共路径存储

module.exports.add_goods=function(req,res){
    // 判断是否含有关键数据
    // console.log(req.session.shop);
    if(!req.body){return res.json({code:403,message:"error",descript:"数据不存在"})}
    if(!req.body.category_id||!req.body.name){return res.json({code:403,message:"",descript:"分类或者,名称为必填项"})}
    if(!req.body.skus||!req.body.pars){return res.json({code:403,message:"data not have",descript:"数据缺失"})};
    //判断par数据格式是否正常
    var skus = req.body.skus;
    console.log(skus);
    console.log(skus.datas);
    if(skus.length==0){return res.json({code:403,message:"失败,至少需要一个sku数据",descript:"失败"})}
    if(!skus[0].price||!skus[0].total||!skus[0].datas){return res.json({code:403,message:"sku数据缺少",descript:"失败"})}
    // try{
    //     skus.datas = JSON.parse(skus.datas);
    //     //尝试使用try来解析datas数据
    // }catch(e){
    //     res.json({code:403,message:e.message,descript:"输入的数据不合法,拒绝操作"})
    // }
    //是否需要验证商品的sku编号等信息是否合法?
    // 不验证
    // 生成数据体
    var goods = {
        shop_id:req.session.shop.shop_id,
        category_id:req.body.category_id,
        name:req.body.name,
        brief:req.body.brief,
        publish_status:req.body.publish_status,
        pars:req.body.pars,
        skus:skus
    };
    db.goods.add_goods(goods,function(err,result,goods_id){
        if(err){return res.json({code:500,message:err.message,descript:"服务器错误"})}
        // 返回的数据体
        res.json({code:200,data:goods_id})
    })
};//添加宝贝业务逻辑

module.exports.upload_image = function(req,res){
    //更新登录状态,防止过期
    let shop = req.session.shop;
    req.session.shop = shop;
    if (!req.body) {return res.json({code:403,message:"不存在数据体",descript:"不存在数据体"})}
    console.log(req.body);
    if(!req.body.goods_id||!req.body.name||!req.body.base64||!req.body.index){return res.json({code:403,message:"数据缺失",descript:"数据缺失"})}
    req.body.base64=req.body.base64.replace(/^data:image\/\w+;base64,/,'');//将上传添加的符号清除
    if(!Buffer.isEncoding(req.body.base64)){console.error("失败")}//不知名数据转换
    let bitmap = new Buffer(req.body.base64, 'base64');//二进制文件
    // 1.将其base64数据转化为buffer
    let imgpath = public_path.paths['index'];
    // 将商品id与下标拼接成图片的路径
    let extname = path.extname(req.body.name);//文件后缀名
    let filepath = req.body.goods_id+"_"+req.body.index+extname;
    filepath = path.join('picture/goods',filepath);//分开来,先获取位于商品的文件路径
    imgpath = path.join(imgpath,filepath);//添加至准确的位置

    fs.writeFile(imgpath, bitmap,function(err,result){
        if(err){return res.json({code:500,message:err.message})}
        //存入数据库
        // 设置下标
        db.goods.setcover({
            goods_id:req.body.goods_id,
            index:req.body.index,
            filePath:filepath
        },function(err){
            if(err){return res.json({code:500,message:err.message})}
            res.json({code:200,message:"ok",data:"ok"});
        })
    });
};//上传图片

module.exports.meBabys = function(req,res){
    let shop = req.session.shop;
    req.session.shop = shop;
    let limit = req.query.limit||20;
    let page = req.query.page||1;
    console.log("test test test")
    let shop_id = req.query.shop_id||req.session.shop.shop_id;
    db.goods.search_me_goods({
        shop_id:shop_id
    },{
        limit:20,
        page:page
    },function(err,result){
        if(err){
            console.log("look me baby error ------");
            console.log(err.message);
            return res.json({
                code:500,
                message:err.message,
                descript:"服务器错误"
            });
        }
        console.log(result);
        res.json({
            code:200,
            result:result,
            message:'ok',
            descript:'ok'
        });
    });
};//获取某个店家的所有商品




