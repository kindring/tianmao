const express = require('express');
const router = express.Router();
const bbl = require('../bbl/merchant.js');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest:'upload'});//用来保存文件的文件夹名称
var path = require('path');

// 商家首页页面显示路由,只做路由不做业务逻辑
router.get('/',function(req,res){
    //渲染平台管理页面
    if(!req.session.shop){
        
        return res.redirect(302,'/merchant/login')
    }
    console.log(req.session);
    console.log('---------');
    // res.json(req.session.shop);
    res.render('./merchant/index.html',{
    	shop:req.session.shop
    });
});

// 商家登录注册页面显示路由
router.get('/login',function(req,res){
    res.render('./merchant/login.html')
});

// 商家登录请求路由
router.post('/login',function(req,res){
    //读数据库,获取资源
    //调用读取数据库方法
    //数据比对返回登录信息
    bbl.login(req,res)
});

// 商家主页页面登出的路由
router.get('/loginout',function(req,res){
	req.session.shop = null // 删除session
    res.redirect(302,'/merchant/login')
})

// 商家注册页面的路由
router.get('/register',function(req,res){
	res.render('./merchant/register.html')
})

// 商家注册请求路由
router.post('/register',function(req,res){
	bbl.register(req,res)
})

// 商家注册请求验证码路由
router.post('/verification',function(req,res){
	bbl.verification(req,res)
});

// 商家账号信息页面路由
router.get('/information',function(req,res){
	if(!req.session.shop){
        return res.redirect(302,'/merchant/login')
    }
    console.log(req.session);
    console.log('---------');
	res.render('./merchant/information.html',{
    	shop:req.session.shop
    })
});

// 商家账号基本信息保存路由
router.post('/informationAdd',function(req,res){
	bbl.informationAdd(req,res)
});

// 商家头像更改保存路由
router.post('/changeBusinessesface',upload.single('shop_photo'),function(req,res,next){
	bbl.changeBusinessesface(req,res)
});

// 商家发布宝贝页面显示路由
router.get('/releaseBaby',function(req,res){
	if(!req.session.shop){
        return res.redirect(302,'/merchant/login')
    }
    bbl.releaseBaby(req,res)
});

// 类目数据传送
router.post('/releaseBaby',function(req,res){
	if(!req.session.shop){
        return res.redirect(302,'/merchant/login')
    }
	bbl.releaseBaby1(req,res)
});

// 商家发布宝贝详情页面显示页面
router.get('/releaseDetails',function(req,res){
	if(!req.session.shop){
        return res.redirect(302,'/merchant/login')
    }
    res.render('./merchant/releaseDetails.html',{
    	shop:req.session.shop
    })
});

// 商家宝贝详情数据保存
router.post('/releaseDetails',function(req,res){
	if(!req.session.shop){
        return res.redirect(302,'/merchant/login')
    }
    bbl.releaseDetails1(req,res)
});

router.get('/me_baby',function(req,res){
    if(!req.session.shop){return res.redirect(302,'/merchant/login')}
    var shop = req.session.shop;
    req.session.shop = shop;
    res.render('merchant/me_baby.html',{
        shop:shop
    });
});//我的宝贝列表

module.exports=router;