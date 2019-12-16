const express = require('express');

let bbl = require('../bbl/goods.js');

let router = express.Router();
router.post('/add',(req,res)=>{
    //验证用户是否登录
    if(!req.session.shop){return res.json({code:302,message:"未登录,无权限",descript:"未登录无权限"})}
    bbl.add_goods(req,res);
});

router.post('/uplaod_goods_image',(req,res)=>{
    if(!req.session.shop){return res.json({code:302,message:"未登录,无权限",descript:"未登录无权限"})}
    bbl.upload_image(req,res);
});

router.get('/mebabys',(req,res)=>{
    if(!req.session.shop){return res.json({code:302,message:"登录失效",descript:"登录失败"})}
    bbl.meBabys(req,res);
});

module.exports = router;