//只处理业务逻辑.不操做数据库交互,如判断该返回什么数据,以及是否有权限进行操作等.返回页面或者数据
//通过一系列操作判断返回何种页面以及数据
const fs = require('fs');
var path=require('path');
var QcloudSms = require("qcloudsms_js");//腾讯云短信sdk
var formidable=require("formidable");
var multer = require('multer');
var bin = multer({dest:'bin'});//用来保存文件的文件夹名称

const reg = require('../model/regs.js');//正则方法
var config = require("../config.js");//配置文件?
const db = require('../database/all_database.js');//封装好的数据库查询方法
const SMS = require('../model/verification.js');//短信发送模块
let store = require('../model/storeSomething.js');//存储数据模块
// 商家登录
module.exports.login=function(req,res){
    //判断数据是否合法?
    if(!req.body||!req.body.account||!req.body.password){return res.json({
        code:401,
        message:"missin data",
        desctipt:"数据缺失,请输入正确数据"
    })};//判断是否携带参数
    //判断数据是否合法,遍历判断或者单独判断
    if(!reg.test('account',req.body.account)||!reg.test('password',req.body.password)){
        return res.json({
            code:402,
            message:"error data",
            desctipt:"数据格式错误,请输入正确格式的数据"
        })
    }
    //查询数据
    db.merchant.login(req.body,(err,data)=>{
        if(err){return res.json({
                code:500,
                message:err.message,
                desctipt:"数据查询错误,请稍后重试"
        })}
        if(data.length===0){return res.json({
            code:403,
            message:"account or password error",
            desctipt:"账号或者密码错误,请检查"
        })}
        //console.log(data);
        //登录成功,保存登录信息cookie自定义或者session
        req.session.shop=data[0];
        res.json({
            code:200,
            message:"login success",
            descript:"登录成功"
        })
    })
};

module.exports.verification=function(req,res){
	if(!req.body.verification){res.json({code:403,message:"参数错误",descript:"未传入手机号"})}
	var phoneNumber = req.body.verification;//得到手机号
	console.log("手机号为"+phoneNumber);
	var sms = SMS(phoneNumber);//获取对象
	var params = sms.createParams(5).getParams();//生成一个随机6位数参数,并且获取
	// 发送
	sms.send(function(err,response,resData){
		if(err){return res.json({code:500,message:err.message,descript:"短信发送失败"})}
		//先查询是否存在该手机号,存在则更新验证码
        let obj = null;
        store.foreach(function(item){
            if(item.datas.phone===phoneNumber){
                obj = item;
            }
        });
        if(obj){
            obj.datas.params = params;
            obj.expire(1000*60*15);//更新手机号
        }else{
            store.newstore({phone:phoneNumber,params:params}).expire(1000*60*15);//存储手机号和参数;
        }

		console.log(response);
		console.log(resData);
        return res.json({
            code:200,
            message:"login success",
            descript:"发送成功"
        })
	});
};//短信发送功能?

module.exports.register=function(req,res){
    //判断数据是否合法?
    if(!req.body||!req.body.account||!req.body.password||!req.body.name){return res.json({
        code:401,
        message:"missin data",
        desctipt:"数据缺失,请输入正确数据"
    })}//判断是否携带参数
    //判断数据是否合法,遍历判断或者单独判断
    if(!reg.test('account',req.body.account)||!reg.test('password',req.body.password)||!reg.test('name',req.body.name)){
        return res.json({
            code:402,
            message:"error data",
            desctipt:"数据格式错误,请输入正确格式的数据"
        })
    }
    // 判断验证码是否正确
    var obj = null;
    store.foreach(function(item){
		// 查看当前手机号是否存在
		console.log(item);
		if(item.data.phone===req.body.account){
			obj = item;// 如果存在则获取该对象
		}
	});
    if(!obj){return res.json({code:405,message:"验证码过期",descript:"验证码过期"})}
	if(req.body.verification != obj.data.params){
    	console.log("输入的验证码:"+req.body.verification);
    	console.log("data内的验证码:"+obj.data.params);
		return res.json({
            code:406,
            message:"The captcha is incorrect, please re-enter it",
            desctipt:"验证码不正确,请重新输入"
        })
	}
    //查询数据
    db.merchant.registerC(req.body,(err,data)=>{
    	// console.log(err);
        if(err){
        	return res.json({
	            code:500,
	            message:err.message,
	            desctipt:"数据查询错误,请稍后重试"
	        })
        }
        if(data.length > 0){
            return res.json({
	            code:403,
	            message:"The merchant name already exists",
	            desctipt:"商家名字已存在,请检查"
	        })
        }else{
            db.merchant.registerI(req.body,(err,data)=>{
            	if(err){
            		return res.json({
		                code:500,
		                message:err.message,
		                desctipt:"数据查询错误,请稍后重试"
			        })
		        }else{
		        	return res.json({
			            code:200,
			            message:"login success",
			            descript:"注册成功"
		            })
		        }
            })
        	
        }
    })
};

// 商家账号基本信息保存
module.exports.informationAdd=function(req,res){
    
    var shop_account = req.body.shop_account;
    var shop_name1 = req.body.shop_name1;
    var shop_descript1 = req.body.shop_descript1;
    var shop_address1 = req.body.shop_address1;
    var untitled1 = req.body.untitled1;
    var landlord1 = req.body.landlord1;
    var shop_name = req.body.shop_name;
    var shop_descript = req.body.shop_descript;
    var shop_address = req.body.shop_address;
    var untitled = req.body.untitled;
    var landlord = req.body.landlord;
    
    if(shop_name1 == shop_name&&shop_descript1 == shop_descript&&untitled1 == untitled&&shop_address1 == shop_address&&landlord1 == landlord){
    	res.status(200).json({ err_code:3 })
    }
    db.merchant.informationY(shop_name,function(err,result){
    	if(err){ return res.status(500).send(err) }
		if(result.length == 1){
            if(result[0].shop_name == shop_name1){
				db.merchant.informationAdd(shop_name,shop_descript,shop_address,untitled,landlord,shop_account,function(err,results){
			    	if (err){ return res.end(err.message) }
			        req.session.shop = null // 删除session
			        res.status(200).json({ err_code:0 })
			    })
			}else{
				return res.status(200).json({ err_code:1 })
			}
		}else{
    		db.merchant.informationAdd(shop_name,shop_descript,shop_address,untitled,landlord,shop_account,function(err,results){
		    	if (err) { return res.end(err.message) }
		        req.session.shop = null // 删除session
		        res.status(200).json({ err_code:0 })
		    })
    	}
    })
}

// 商家头像更改保存路由
module.exports.changeBusinessesface = function(req,res){
	var shop_account_change = req.body.shop_account_change
	var filename = req.file.originalname;
    fs.renameSync('./upload/'+req.file.filename,'./upload/'+filename);
    var shop_photo = '/upload/'+filename
    console.log(shop_account_change)
    console.log(shop_photo)
    db.merchant.changeBusinessesface(shop_photo,shop_account_change,function(err,result){
    	if (err) { return res.end(err.message) }
    	req.session.shop = null // 删除session
		res.setHeader('Content-Type','text/html;charset=utf-8')
        res.end("<script>alert('更改成功,请重新登录');window.location.href='/merchant/login';</script>")
    })
}

// 商家发布宝贝页面
module.exports.releaseBaby = function(req,res){
	db.platform_goods.p_categorys(0,function(err,result){
		// console.log(result[0])
		res.render('./merchant/releaseBaby.html',{
    	shop:req.session.shop,
    	categorys : result
    	})
	})
};

module.exports.releaseBaby1 = function (req,res) {
	if(!req.body||!req.body.categoryPath){
        return res.send("错误");
    }
    var categoryPath = JSON.parse(req.body.categoryPath);
    var catenamearr = [];
    console.log(categoryPath);
	for(var i in categoryPath){
        catenamearr.push(categoryPath[i].name)
    }
    if(catenamearr.length<3){catenamearr.push(" ")}
    console.log(catenamearr);
    res.render('./merchant/releaseDetails.html',{
    	shop:req.session.shop,
        categoryPath:JSON.stringify(categoryPath),
    	catenamearr : catenamearr,
    })
};

// 商家宝贝详情数据保存
module.exports.releaseDetails1 = function (req,res){
	var form = formidable.IncomingForm();
	form.multiples=true;//设置为多文件上传
    form.keepExtensions=true;//是否包含文件后缀
    var files=[];
    //文件都将保存在files数组中
    form.on('file', function (filed,file) {
        files.push([filed,file]);
    });
    var targetFile = path.join(__dirname,'../upload');
    form.uploadDir = targetFile;
    form.parse(req,function(error,fields,files) {
        if (error) {
            console.log("error" + error.message);
            return;
        }
        var shop_id = fields.shop_id
        var type_id = fields.type_id
        var goods_name = fields.goods_name
        var goods_sn = fields.goods_sn
        var price = fields.price
        var stock = fields.stock
        
        console.log(files)
        console.log(fields.goods_name)
        console.log(type_id)
        console.log(files.shop_photo[0].name)
        console.log(files.shop_photo.length)
        var F=[]
        // files.shop_photo[k]里保存着用户所上传的文件
        for(var k=0;k<files.shop_photo.length;k++){
            var fileName=files.shop_photo[k].name;
            console.log(fileName)
            var fileUrl="./upload/"+fileName.split('.')[0]+new Date().getTime()+'.'+fileName.split('.')[1];
            console.log(fileUrl)
            console.log(files.shop_photo[k].path)
            fs.renameSync(files.shop_photo[k].path,fileUrl);
            F.push(fileUrl)
        }
        db.merchant.releaseDetails1fields(shop_id,type_id,goods_name,goods_sn,price,stock,function(err,result){
	    	if (err) { return res.end(err.message) }
	    		var goods_id = result[0].goods_id
	    	    console.log(goods_id)
	    	db.merchant.releaseDetails1files(goods_id,F,function(err,result){
	    		if (err) { return res.end(err.message) }
	    		console.log(F)
		        res.setHeader('Content-Type','text/html;charset=utf-8')
        res.end("<script>alert('上传成功,等待管理员的验证');window.location.href='/merchant';</script>")
	    	})
	    	// req.session.shop = null // 删除session
			// res.setHeader('Content-Type','text/html;charset=utf-8')
	  //       res.end("<script>alert('更改成功,请重新登录');window.location.href='/merchant/login';</script>")
	  		
	    })
        
    });
}