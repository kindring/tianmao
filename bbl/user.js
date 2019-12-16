//只处理业务逻辑.不操做数据库交互,如判断该返回什么数据,以及是否有权限进行操作等.返回页面或者数据
//通过一系列操作判断返回何种页面以及数据
const fs = require('fs');
const db = require('../database/all_database.js');//封装好的数据库查询方法
const reg = require('../model/regs.js');
var QcloudSms = require("qcloudsms_js");
var config = require("../config.js")
var formidable=require("formidable")
var path=require('path')
var multer = require('multer')
var bin = multer({dest:'bin'});//用来保存文件的文件夹名称

//生成5位验证码
	function RndNum(n){
	    var rnd="";
	    for(var i=0;i<n;i++)
	        rnd+=Math.floor(Math.random()*10);
	    return rnd;
	}
	var VerificationCode=RndNum(5);
// 用户注册请求验证码
module.exports.verification=function(req,res){
	var phone = req.body.phone
    // 短信应用SDK AppID
	var appid = 1400274194;  // SDK AppID是1400开头
	// 短信应用SDK AppKey
	var appkey = "4aa6f9a92b1e0d65c8f9ad303e1b927a";
	// 需要发送短信的手机号码
	var phoneNumbers = [phone]; 
	// 短信模板ID，需要在短信应用中申请
	var templateId = 454063;  // NOTE: 这里的模板ID`242762`只是一个示例，真实的模板ID需要在短信控制台中申请
	// 签名
	var SmsSign = "sxmjcn";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`
	// 实例化QcloudSms
	var qcloudsms = QcloudSms(appid, appkey);
	function callback(err, res, resData) {
	    if (err) {
	        console.log("err: ", err);
	    } else {
	        console.log("request data: ", res.req);
	        console.log("response data: ", resData);
	    }
	}
	var ssender = qcloudsms.SmsSingleSender();
	var params = [VerificationCode,"5"];
	ssender.sendWithParam(86, phoneNumbers[0], templateId,params, SmsSign,"","",callback);  // 签名参数未提供或者为空时，会使用默认签名发送短信
	res.status(200).json({ err_code:0 })
}

// 用户注册第一步验证
module.exports.nextStep = function(req,res){
	var phone1 = req.body.phone1
	var verification = req.body.verification
	console.log(verification)
	console.log(phone1)
	if (phone1 == ''){
		return res.status(200).json({ err_code:4 })
	}
	if (verification == ''){
		return res.status(200).json({ err_code:3 })
	}
	db.user.verification(phone1,function(err,result){
		if(err){ return res.status(500).send(err) }
		if(result.length == 1){
			return res.status(200).json({ err_code:2 })
		}else if(result.length == 0){
			if(verification == VerificationCode){
				res.status(200).json({ err_code:0 })
			}else{
				return res.status(200).json({ err_code:1 })
			}
		}
	})
}

// 存入数据库
module.exports.register1 = function (req,res){
	var phone2 = req.body.phone2;
	var password = req.body.password
	var email = req.body.email
	var hmetown = req.body.hmetown
	var name = req.body.name
	db.user.verificationEamil(email,function(err,result){
		if(err){ console.log(err);return res.status(500).send(err) }
		if(result.length == 1){
			return res.status(200).json({ err_code:1 })
		}else if(result.length == 0){
			// return res.status(200).json({ err_code:3 })
			db.user.verificationName(name,function(err,result){
				if(err){ return res.status(500).send(err) }
				if(result.length == 1){
					return res.status(200).json({ err_code:2 })
				}else if(result.length == 0){
					// return res.status(200).json({ err_code:4 })
					db.user.saveUser(name,phone2,password,email,hmetown,function(err,result){
						if(err){ return res.status(500).send(err) }
						res.status(200).json({ err_code:0 })
					})
				}
			})
		}
	})
}

// 登录判断
module.exports.login = function (req,res) {
	var name = req.body.nameEamilPhone
	var password = req.body.password
	if ( reg.test('phone',name) ){
		db.user.loginPhone(name,password,function(err,result){
			if (err) { return res.status(500).send(err) }
			if (result.length == 0) { return res.status(200).json({ err_code:1 }) }
			else if (result.length == 1) { 
				var id=result[0].user_id;
				req.session.user=result[0];
				res.status(200).json({ err_code:0,id:id })
            }
		})
	}else if ( reg.test('email',name) ) {
		db.user.loginEmail(name,password,function(err,result){
			if (err) { return res.status(500).send(err) }
			if (result.length == 0) { return res.status(200).json({ err_code:1 }) }
			else if (result.length == 1) { 
				var id=result[0].user_id;
				req.session.user=result[0];
				res.status(200).json({ err_code:0,id:id })
			}
		})
	}else if ( reg.test('username',name) ){
		db.user.loginUsername(name,password,function(err,result){
			if (err) { return res.status(500).send(err) }
			if (result.length == 0) { return res.status(200).json({ err_code:1 }) }
			else if (result.length == 1) { 
				var id=result[0].user_id;
				req.session.user=result[0];
				res.status(200).json({ err_code:0,id:id }) 
			}
		})
	}
}

// 登录之后获取用户信息
module.exports.userIfm = function(req,res){
	var id = req.body.Id
	db.user.userIfm(id,function(err,result){
		if (err) { return res.status(500).send(err) }
		if (req.session.user == null){
			return res.status(200).json({ err_code:1 })
		}
		if (result.length == 0) { return res.status(200).json({ err_code:1}) }
		else if (result.length == 1) {
			var userTotal=result[0];
			res.status(200).json({ err_code:0,userTotal:userTotal }) 
		}
	})
}

// 移入购物车获取购物车信息
module.exports.userShopping = function(req,res){
	var id = req.body.Id
	db.user.userShopping(id,function(err,result){
		if (err) { return res.status(500).send(err) }
		if (req.session.user == null){
			return res.status(200).json({ err_code:2 })
		}
		if (result.length == 0) { return res.status(200).json({ err_code:1 }) }
		else if (result.length > 0 ) { 
			var shoppingL = result.length;
			var userShoppingTotal=result;
			res.status(200).json({ err_code:0,userShoppingTotal:userShoppingTotal,shoppingL:shoppingL }) 
		}
	})
}

// 删除购物车商品
module.exports.userShopDel = function(req,res){
	var user_id = req.body.user_id
	var goods_id = req.body.goods_id
	db.user.userShopDel(user_id,goods_id,function(err,result){
		if (err) { return res.status(500).send(err) }
		res.status(200).json({ err_code:0 }) 
	})
}

// 获取左侧导航终点商品数据
module.exports.leftShop = function(req,res){
	db.user.leftShop(function(err,result){
		if (err) { return res.status(500).send(err) }
		var leftShopData=result;
		// console.log(leftShopData)
		if(result.length == 0){
			return res.status(200).json({ err_code:1 })
		}
		res.status(200).json({ err_code:0,leftShopData:leftShopData })
	})
}

// 用户身份信息提交
module.exports.identityt = function(req,res){
	var user_real_name = req.body.userRealName
	var user_real_id = req.body.userRealId
	var user_id = req.body.user_id
	db.user.inquireIdentity(user_real_id,function(err,result){
		if (err) { return res.status(500).send(err) }
		if(result.length > 0){
			return res.status(200).json({ err_code:1 })
		}else if(result.length == 0){
			db.user.identityt(user_id,user_real_name,user_real_id,function(err,result){
				if (err) { return res.status(500).send(err.message) }
				res.status(200).json({ err_code:0 })
			})
		}
	})
}

// 查询用户信息
module.exports.inquire = function(req,res){
	var user_id = req.body.Id
	db.user.inquire(user_id,function(err,result){
		if (err) { return res.status(500).send(err) }
		if(result.length == 1){
			var useridentity = result[0]
			res.status(200).json({ err_code:0,useridentity : useridentity })
		}else if(result.length == 0){
			res.status(200).json({ err_code:1 })
		}
	})
}

// 提交密保信息
module.exports.tjiaoform = function(req,res){
	var body = req.body
	db.user.tjiaoform(body,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		res.status(200).json({ err_code:0 })
	})
}

// 查询用户密保问题
module.exports.inquireSecurtiy = function(req,res){
	var user_id = req.body.Id
	db.user.inquireSecurtiy(user_id,function(err,result){
		if (err) { return res.status(500).send(err) }
		if(result.length == 0){
			return res.status(200).json({ err_code:1 })
		}else if(result.length == 1){
			var securtiy = result[0]
			res.status(200).json({ err_code:0,securtiy:securtiy })
		}
	})
}

// 修改密保问题
module.exports.amendform = function(req,res){
	console.log('什么意思?我只是个臭弟弟?')
	var body = req.body
	db.user.amendform(body,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		res.status(200).json({ err_code:0 })
	})
}

// 查询用户密保问题
module.exports.inquiresecur = function(req,res){
	var user_id = req.body.Id
	db.user.inquiresecur(user_id,function(err,result){
		if (err) { return res.status(500).send(err) }
		if(result.length == 1){
			res.status(200).json({ err_code:0 })
		}else{
			res.status(200).json({ err_code:1 })
		}
	})
}

// 忘记密码查询用户名
module.exports.yanZUser = function(req,res){
	var user_name = req.body.userName;
	console.log(req.body);
	if ( reg.test('phone',user_name) ){
		db.user.yanZUserPhone(user_name,function(err,result){
			if (err) { return res.status(500).send(err) }
			if (result.length == 0) { return res.status(200).json({ err_code:1 }) }
			else if (result.length == 1) { 
				userPhone = result[0].phone;
				user_id = result[0].user_id;
				req.session.userFindPass=result[0];
				res.status(200).json({ err_code:0,userPhone:userPhone,user_id:user_id })
            }
		})
	}else if ( reg.test('email',user_name) ) {
		db.user.yanZUserEmail(user_name,function(err,result){
			if (err) { return res.status(500).send(err) }
			if (result.length == 0) { return res.status(200).json({ err_code:1 }) }
			else if (result.length == 1) { 
				userPhone = result[0].phone;
				user_id = result[0].user_id;
				req.session.userFindPass=result[0];
				res.status(200).json({ err_code:0,userPhone:userPhone,user_id:user_id })
			}
		})
	}else if ( reg.test('username',user_name) ){
		db.user.yanZUserUsername(user_name,function(err,result){
			if (err) { return res.status(500).send(err) }
			if (result.length == 0) { return res.status(200).json({ err_code:1 }) }
			else if (result.length == 1) { 
				userPhone = result[0].phone;
				user_id = result[0].user_id;
				req.session.userFindPass=result[0];
				res.status(200).json({ err_code:0,userPhone:userPhone,user_id:user_id }) 
			}
		})
	}
}

// 打开重置密码
module.exports.resetPasswords = function(req,res){
	var phone = req.query.userPhone;
	var user_id = req.query.user_id
	res.render('./user/resetPasswords.html',{phone:phone,user_id:user_id})
}

// 手机验证重置密码页面
module.exports.phoneReset = function(req,res){
	var phone = req.query.phone;
	var user_id = req.query.user_id
	res.render('./user/phoneReset.html',{phone:phone,user_id:user_id})
}

// 获取重置密码 验证码
module.exports.phoneResetVerification = function(req,res){
	var phone = req.body.phone;
	var user_id = req.body.user_id;
	// 随机生成五位数的验证码
	function RndNum(n){
	    var rnd="";
	    for(var i=0;i<n;i++)
	        rnd+=Math.floor(Math.random()*10);
	    return rnd;
	}
	var VerificationCode=RndNum(5);
    // 短信应用SDK AppID
	var appid = 1400274194;  // SDK AppID是1400开头
	// 短信应用SDK AppKey
	var appkey = "4aa6f9a92b1e0d65c8f9ad303e1b927a";
	// 需要发送短信的手机号码
	var phoneNumbers = [phone]; 
	// 短信模板ID，需要在短信应用中申请
	var templateId = 454063;  // NOTE: 这里的模板ID`242762`只是一个示例，真实的模板ID需要在短信控制台中申请
	// 签名
	var SmsSign = "sxmjcn";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`
	// 实例化QcloudSms
	var qcloudsms = QcloudSms(appid, appkey);
	function callback(err, res, resData) {
	    if (err) {
	        console.log("err: ", err);
	    } else {
	        console.log("request data: ", res.req);
	        console.log("response data: ", resData);
	    }
	}
	var ssender = qcloudsms.SmsSingleSender();
	var params = [VerificationCode,"5"];
	ssender.sendWithParam(86, phoneNumbers[0], templateId,params, SmsSign,"","",callback);  // 签名参数未提供或者为空时，会使用默认签名发送短信
	db.user.inquireResetTb(user_id,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		console.log(result.length)
		if(result.length == 1){
			var myDate = new Date();
			var date = myDate.toLocaleDateString();
			var hours = myDate.getHours();       //获取当前小时数(0-23)
			var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
			var seconds = myDate.getSeconds();     //获取当前秒数(0-59)
			var time = hours + ':' + minutes + ':' + seconds;
			var dataTime = date +' '+time;
			db.user.updateVer(user_id,VerificationCode,dataTime,function(err,result){
				if (err) { console.log(err);return res.status(500).send(err) }
				res.status(200).json({ err_code:0 })
			})
		}else if(result.length == 0){
			db.user.interpositionVer(user_id,VerificationCode,function(err,result){
				if (err) { console.log(err);return res.status(500).send(err) }
				res.status(200).json({ err_code:0 }) 
			})
		}
		
	})
}

// 判断重置验证码是否正确或者过期
var rainUserResetVerificationflag = false;
module.exports.rainUserResetVerification = function(req,res){
	var verification = req.body.verification;
	var user_id = req.body.user_id;
	db.user.inquireResetUserVer(user_id,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		if(result.length == 0){
			return res.status(200).json({ err_code:1 })
		}else if(result.length == 1){
			if(verification != result[0].verification_code){
				return res.status(200).json({ err_code:2 })
			}
			var myDate = new Date();
			var date = myDate.toLocaleDateString();
			var hours = myDate.getHours();       //获取当前小时数(0-23)
			var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
			var seconds = myDate.getSeconds();     //获取当前秒数(0-59)

			var strs= new Array(); //定义分割数据库总时间数组
			var datefege= new Array(); //定义分割数据库日期数组
			var timefege= new Array(); //定义分割数据库时间数组
			var bendiDate= new Array(); //定义分割本地日期数组
			var shujVer = result[0].verification_code;
			var shujDateTime = result[0].time;
			// 转换成可用字符串
			var d = new Date(shujDateTime);
			var shujDateTimes=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
			// 分割数据库时间字符串
			strs=shujDateTimes.split(" "); //字符总时间分割
			var shujDate = strs[0]; // 数据库的日期
			var shujTime = strs[1]; // 数据库的时间
			datefege=shujDate.split("-"); //字符数据库日期分割
			timefege=shujTime.split(":"); //字符数据库时间分割
			bendiDate=date.split("-"); //字符本地日期分割
			if(bendiDate[0] > datefege[0] || bendiDate[0] < datefege[0]){
				return res.status(200).json({ err_code:1 })
			}else if(bendiDate[0] == datefege[0]){
				if(bendiDate[1] > datefege[1] || bendiDate[1] < datefege[1]){
					return res.status(200).json({ err_code:1 })
				}else if(bendiDate[1] == datefege[1]){
					if(bendiDate[2] > datefege[2] || bendiDate[2] < datefege[2]){
						return res.status(200).json({ err_code:1 })
					}else if(bendiDate[2] == datefege[2]){
						if(hours > timefege[0] || hours < timefege[0] ){
							return res.status(200).json({ err_code:1 })
						}else if(hours == timefege[0]){
							if((minutes - timefege[1]) > 5){
								return res.status(200).json({ err_code:1 })
							}else if((minutes - timefege[1]) < 5){
								rainUserResetVerificationflag = true;
								res.status(200).json({ err_code:3 })
							}else if((minutes - timefege[1]) == 5){
								if((seconds - timefege[2]) < 0){
									rainUserResetVerificationflag = true;
									res.status(200).json({ err_code:3 })
								}else if((seconds - timefege[2]) > 0){
									return res.status(200).json({ err_code:1 })
								}
							}
						}
					}
				}
			}
		}
	})
}

// 重置用户密码
module.exports.resetPassword = function(req,res){
	var user_id = req.body.user_id;
	var password = req.body.password;
	// console.log(req.body);
	console.log(rainUserResetVerificationflag);
	if(rainUserResetVerificationflag != true){
		return res.status(200).json({ err_code:1 })
	}
	db.user.resetPassword(user_id,password,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		res.status(200).json({ err_code:0 })
	})
}

// 打开验证密保页面
module.exports.securitQuestionVerification = function(req,res){
	var user_id = req.query.user_id;
	console.log(req.body);
	res.render('./user/securitQuestionVerification.html',{ user_id:user_id })
}

// 查询用户是否有密保问题securitQuestionVerificationinqure
module.exports.securitQuestionVerificationinqure = function(req,res){
	var user_id = req.body.user_id;
	console.log(req.body);
	db.user.securitQuestionVerificationinqure(user_id,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		if(user_id == ''){
			return res.status(200).json({ err_code:2 })
		}
		if(result.length == 0){
			res.status(200).json({ err_code:1 })
		}else if(result.length == 1){
			var securtiyData = result[0];
			res.status(200).json({ err_code:0,securtiyData:securtiyData })
		}
	})
}

// 验证密保问题
var verificationSQflag = false;
module.exports.verificationSecurQ = function(req,res){
	var user_id = req.body.user_id;
	var s1 = req.body.securtiy_topic1;
	var s2 = req.body.securtiy_topic2;
	var s3 = req.body.securtiy_topic3;
	var sr1 = req.body.securtiy_topic_anwer1;
	var sr2 = req.body.securtiy_topic_anwer2;
	var sr3 = req.body.securtiy_topic_anwer3;
	db.user.verificationSecurQ(user_id,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		if(result.length == 0){
			res.status(200).json({ err_code:1 })
		}else if(result.length == 1){
			var sD = result[0];
			if(s1 == sD.securtiy_topic1 && s2 == sD.securtiy_topic2 && s3 == sD.securtiy_topic3 && sr1 == sD.securtiy_topic_anwer1 && sr2 == sD.securtiy_topic_anwer2 && sr3 == sD.securtiy_topic_anwer3){
				verificationSQflag = true;
				res.status(200).json({ err_code:0 })
			}else{
				return res.status(200).json({ err_code:2 })
			}
			
		}
	})
}

// 重置用户密码
module.exports.securitQuestionPassword = function(req,res){
	var user_id = req.body.user_id;
	var password = req.body.password;
	if(verificationSQflag != true){
		return res.status(200).json({ err_code:2 })
	}
	if(user_id == ''){
		return res.status(200).json({ err_code:3 })
	}
	db.user.securitQuestionPassword(user_id,password,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		res.status(200).json({ err_code:0 })
	})
}

// pduanModificationPhoneVer判断修改手机号验证码
// var pduanModificationPhoneVerflag = false;
module.exports.gainPhonepduanNew = function(req,res){
	var user_id = req.body.user_id;
	var verification = req.body.verification;
	var phone = req.body.phone;
	// console.log(req.body);
	db.user.inquireResetUserVer(user_id,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		if(result.length == 0){
			return res.status(200).json({ err_code:1 })
		}else if(result.length == 1){
			if(verification != result[0].verification_code){
				return res.status(200).json({ err_code:2 })
			}
			var myDate = new Date();
			var date = myDate.toLocaleDateString();
			var hours = myDate.getHours();       //获取当前小时数(0-23)
			var minutes = myDate.getMinutes();     //获取当前分钟数(0-59)
			var seconds = myDate.getSeconds();     //获取当前秒数(0-59)

			var strs= new Array(); //定义分割数据库总时间数组
			var datefege= new Array(); //定义分割数据库日期数组
			var timefege= new Array(); //定义分割数据库时间数组
			var bendiDate= new Array(); //定义分割本地日期数组
			var shujVer = result[0].verification_code;
			var shujDateTime = result[0].time;
			// 转换成可用字符串
			var d = new Date(shujDateTime);
			var shujDateTimes=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
			// 分割数据库时间字符串
			strs=shujDateTimes.split(" "); //字符总时间分割
			var shujDate = strs[0]; // 数据库的日期
			var shujTime = strs[1]; // 数据库的时间
			datefege=shujDate.split("-"); //字符数据库日期分割
			timefege=shujTime.split(":"); //字符数据库时间分割
			bendiDate=date.split("-"); //字符本地日期分割
			if(bendiDate[0] > datefege[0] || bendiDate[0] < datefege[0]){
				return res.status(200).json({ err_code:1 })
			}else if(bendiDate[0] == datefege[0]){
				if(bendiDate[1] > datefege[1] || bendiDate[1] < datefege[1]){
					return res.status(200).json({ err_code:1 })
				}else if(bendiDate[1] == datefege[1]){
					if(bendiDate[2] > datefege[2] || bendiDate[2] < datefege[2]){
						return res.status(200).json({ err_code:1 })
					}else if(bendiDate[2] == datefege[2]){
						if(hours > timefege[0] || hours < timefege[0] ){
							return res.status(200).json({ err_code:1 })
						}else if(hours == timefege[0]){
							if((minutes - timefege[1]) > 5){
								return res.status(200).json({ err_code:1 })
							}else if((minutes - timefege[1]) < 5){
								// rainUserResetVerificationflag = true;
								// res.status(200).json({ err_code:3 })
								db.user.chaphoneshifyouchongf(phone,function(err,result){
									if (err) { console.log(err);return res.status(500).send(err) }
									if(result.length != 0){
										return res.status(200).json({ err_code:3 })
									}
									db.user.gainphoneczuo(user_id,phone,function(err,result){
										if (err) { console.log(err);return res.status(500).send(err) }
										res.status(200).json({ err_code:0 })
									})
								})
							}else if((minutes - timefege[1]) == 5){
								if((seconds - timefege[2]) < 0){
									db.user.chaphoneshifyouchongf(phone,function(err,result){
										if (err) { console.log(err);return res.status(500).send(err) }
										if(result.length != 0){
											return res.status(200).json({ err_code:3 })
										}
										db.user.gainphoneczuo(user_id,phone,function(err,result){
											if (err) { console.log(err);return res.status(500).send(err) }
											res.status(200).json({ err_code:0 })
										})
									})
								}else if((seconds - timefege[2]) > 0){
									return res.status(200).json({ err_code:1 })
								}
							}
						}
					}
				}
			}
		}
	})
}

// 修改密码
module.exports.modificationPassword = function(req,res){
	var user_id = req.body.user_id;
	var formerPassword = req.body.formerPassword;
	var newPassword = req.body.newPassword;
	if(user_id == ''){
		return res.status(200).json({ err_code:2 })
	}
	if(formerPassword == '' && newPassword == ''){
		return res.status(200).json({ err_code:1 })
	}
	db.user.pduanPasswordshifzq(user_id,formerPassword,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		if(result.length == 1){
			db.user.modificationPassword(user_id,newPassword,function(err,result){
				if (err) { console.log(err);return res.status(500).send(err) }
				res.status(200).json({ err_code:0 })
			})
			
		}else if(result.length == 0){
			res.status(200).json({ err_code:3 })
		}
	})
}

// 购物车页面获取购物车总数据
module.exports.shoppingCarGain = function(req,res){
	var user_id = req.body.Id;
	console.log(user_id);
	if(user_id == ''){
		return res.status(200).json({ err_code:2 })
	}
	db.user.shoppingCarGain(user_id,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		if(result.length == 0){
			res.status(200).json({err_code:3})
		}else{
			shoppingAll = result;
			res.status(200).json({err_code:0,shoppingAll:shoppingAll})
		}
	})
}

// 购物车改变商品数量
module.exports.gainxiaoxiaoshul = function(req,res){
	var user_id = req.body.user_id;
	var goods_id = req.body.goods_id;
	var shop_id = req.body.shop_id;
	var num = req.body.num;
	if(user_id == ''){
		return res.status(200).json({ err_code:2 })
	}
	db.user.gainxiaoxiaoshul(user_id,goods_id,shop_id,num,function(err,result){
		if (err) { console.log(err);return res.status(500).send(err) }
		res.status(200).json({ err_code:0 })
	})
}

// 获取购物车商品规格数据
module.exports.gainShopSpecification = function(req,res){
	var goods_id = req.body.goods_id;
	if (goods_id == ''){
		return res.status(200).json({ err_code:1 })
	}
}