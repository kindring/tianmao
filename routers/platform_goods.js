const express = require('express');
const router = express.Router();
const bbl = require('../bbl/platform_goods.js');
router.get('/categorys',(req,res)=>{
    //无需权限即可查看
    bbl.categorys(req,res);
});//返回被格式化后的数据
router.get('/category_num',(req,res)=>{
    if(!req.session.staff){return res.json({code:302,message:"当前方法需要登录"})}
    bbl.category_num(req,res)
});//返回某类下的所有子分类,以及属性规格数量
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

router.get('/attr',(req,res)=>{/*无需权限*/
    bbl.attr(req,res);
});//获取分类下的所有规格与参数

router.get('/del_attr',(req,res)=>{
    if(!req.session.staff){return res.json({code:302,message:"登录失效",descript:"未授权,请获取授权"})}
    bbl.del_attr(req,res);
});//删除规格或者属性

//为某个属性添加分类
router.post('/category_add_attr',(req,res)=>{
    if(!req.session.staff){return res.send({code:302,message:"login is out",descript:"登录失效"})}
    bbl.add_attr(req,res);
});

router.post('/attribute_change',(req,res)=>{
    if(!req.session.staff){return res.send({code:302,message:"login is out",descript:"登录失效"})}
    bbl.attribute_change(req,res);
});



module.exports = router;