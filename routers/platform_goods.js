const express = require('express');
const router = express.Router();
const bbl = require('../bbl/platform_goods.js');
router.get('/categorys',(req,res)=>{
    //无需权限即可查看
    bbl.categorys(req,res);
});
router.post('/category_add',(req,res)=>{
    if(!req.session.staff){return res.json({code:302,message:"登录失效",descript:"未授权,请获取授权"})}
    bbl.category_add(req,res);
});

router.post('/update_category',(req,res)=>{
    if(!req.session.staff){return res.json({code:302,message:"登录失效",descript:"未授权,请获取授权"})}
    bbl.update_category(req,res);
});

router.get('/delect_category',(req,res)=>{
    if(!req.session.staff){return res.json({code:302,message:"登录失效",descript:"未授权,请获取授权"})}
    bbl.delect_category(req,res);
});




module.exports = router;