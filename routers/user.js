const express = require('express');
const router = express.Router();
const bbl = require('../bbl/user.js');
var fs = require('fs')
var multer = require('multer')
var upload = multer({dest:'upload'});//用来保存文件的文件夹名称
var path = require('path');

// 展示首页
router.get('/',function(req,res){
	res.render('./user/index.html',{
		user:req.session.user
	});
})

// 用户注册页面
router.get('/register1',function(req,res){
	res.render('./user/register1.html')
})

// 用户注册请求验证码路由
router.post('/verification',function(req,res){
	bbl.verification(req,res)
})

// 用户注册第一步验证
router.post('/nextStep',function(req,res){
	bbl.nextStep(req,res)
})

// 存入数据库
router.post('/register1',function(req,res){
	bbl.register1(req,res)
})

// 登录页面展示
router.get('/login',function(req,res){
	res.render('./user/login.html')
})

// 登录页面判断
router.post('/login',function(req,res){
	bbl.login(req,res)
})

// 忘记密码页面
router.get('/findPass',function(req,res){
	res.render('./user/findPass.html')
})

// 登录之后获取用户信息
router.post('/userIfm',function(req,res){
	bbl.userIfm(req,res)
})

// 退出用户登录
router.get('/loginOut',function(req,res){
	req.session.user = null // 删除session
    res.redirect(302,'/user/login')
})

// 移入购物车获取购物车信息
router.post('/userShopping',function(req,res){
	bbl.userShopping(req,res)
})

// 删除购物车商品
router.post('/userShopDel',function(req,res){
	bbl.userShopDel(req,res)
})

// 获取左侧导航终点商品数据
router.post('/leftShop',function(req,res){
	bbl.leftShop(req,res)
})

// 用户账户管理页面
router.get('/information',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
    res.render('./user/information.html')
})

// 用户身份认证页面
router.get('/identityAuthentication',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
    res.render('./user/identityAuthentication.html')
})

// 用户身份信息提交
router.post('/identityt',function(req,res){
	bbl.identityt(req,res)
})

// 查询用户信息
router.post('/inquire',function(req,res){
	bbl.inquire(req,res)
})

// 密保问题页面
router.get('/securityQuestion',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
    res.render('./user/securityQuestion.html')
})

// 密保问题修改页面
router.get('/securityQuestion1',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
    res.render('./user/securityQuestion1.html')
})

// 提交密保问题
router.post('/tjiaoform',function(req,res){
	bbl.tjiaoform(req,res)
})

// 查询用户密保问题
router.post('/inquireSecurtiy',function(req,res){
	bbl.inquireSecurtiy(req,res)
})

// 修改密保问题
router.post('/amendform',function(req,res){
	bbl.amendform(req,res)
})

// 查询用户密保问题
router.post('/inquiresecur',function(req,res){
	bbl.inquiresecur(req,res)
})

// 忘记密码查询用户名
router.post('/yanZUser',function(req,res){
	bbl.yanZUser(req,res)
})

// 重置密码页面
router.get('/resetPasswords',function(req,res){
	if(!req.session.userFindPass){
        return res.redirect(302,'/user/findPass')
    }
    bbl.resetPasswords(req,res)
})

// 手机验证重置页面页面
router.get('/phoneReset',function(req,res){
	if(!req.session.userFindPass){
        return res.redirect(302,'/user/findPass')
    }
	bbl.phoneReset(req,res)
})

// 获取重置密码 手机验证码
router.post('/phoneResetVerification',function(req,res){
	bbl.phoneResetVerification(req,res)
})

// 获取用户输入的 重置密码手机验证码
router.post('/rainUserResetVerification',function(req,res){
	bbl.rainUserResetVerification(req,res)
})

// 重置密码
router.post('/resetPassword',function(req,res){
	bbl.resetPassword(req,res)
})

// 打开验证密保问题
router.get('/securitQuestionVerification',function(req,res){
	if(!req.session.userFindPass){
        return res.redirect(302,'/user/findPass')
    }
	bbl.securitQuestionVerification(req,res)
})

// 查询用户是否有密保问题
router.post('/securitQuestionVerification',function(req,res){
	bbl.securitQuestionVerificationinqure(req,res)
})

// 验证密保问题
router.post('/verificationSecurQ',function(req,res){
	bbl.verificationSecurQ(req,res)
})

// 重置用户密码
router.post('/securitQuestionPassword',function(req,res){
	bbl.securitQuestionPassword(req,res)
})

// 打开修改手机号页面
router.get('/modificationPhone',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
	res.render('./user/modificationPhone.html')
})


// 打开输入新手机号页面
router.get('/importNewPhone',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
	res.render('./user/importNewPhone.html')
})

// 判断新手机号验证码,并修改手机号
router.post('/gainPhonepduanNew',function(req,res){
	bbl.gainPhonepduanNew(req,res)
})

router.get('/modificationPassword',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
    res.render('./user/modificationPassword.html')
})

// 修改密码
router.post('/modificationPassword',function(req,res){
	bbl.modificationPassword(req,res)
})

// 打开用户购物车页面
router.get('/shoppingCar',function(req,res){
	if(!req.session.user){
        return res.redirect(302,'/user/login')
    }
    res.render('./user/shoppingCar.html')
})

// 购物车页面获取购物车总数据
router.post('/shoppingCarGain',function(req,res){
	bbl.shoppingCarGain(req,res)
})

// 购物车改变商品数量
router.post('/gainxiaoxiaoshul',function(req,res){
	bbl.gainxiaoxiaoshul(req,res)
})

// 获取购物车商品规格数据
router.post('/gainShopSpecification',function(req,res){
	bbl.gainShopSpecification(req,res)
})

module.exports=router;