var pools = require('./pool.js');

// 注册的时候 查找账号是否存在
module.exports.verification = function(phone,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){
			callback(err,null)
		}else{
			var sql='select * from user where phone=?'
			conn.query(sql,[phone],function(err,result){
				// 释放连接,防止接口被占
        	    conn.release()
				if(err){
					callback(err,null)
				}else{
					callback(null,result)
				}
			})
		}
	})
}

// 验证邮箱是否存在
module.exports.verificationEamil = function (email,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){
			callback(err,null)
		}else{
			var sql = 'select * from user where email=?'
			conn.query(sql,[email],function(err,result){
				conn.release()
				if(err){
					callback(err,null)
				}else{
					callback(null,result)
				}
			})
		}
	})
}

// 验证会员名是否存在
module.exports.verificationName = function (name,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){
			callback(err,null)
		}else{
			var sql = 'select * from user where name=?'
			conn.query(sql,[name],function(err,result){
				conn.release()
				if(err){
					callback(err,null)
				}else{
					callback(null,result)
				}
			})
		}
	})
}

// 保存会员的信息
module.exports.saveUser = function (name,phone2,password,email,hmetown,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){callback(err,null)}
			else{
			var sql = 'insert into user(user_id,name,phone,UPDATED_BY,email,hmetown) values(null,?,?,?,?,?)'
			conn.query(sql,[name,phone2,password,email,hmetown],function(err,result){
				conn.release()
				if(err){callback(err,null)}
				else{callback(null,result)}
			})
		}
	})
}

// 会员手机登录
module.exports.loginPhone = function (name,password,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){callback(err,null)}
			else{
			var sql = 'select * from user where phone=? and UPDATED_BY=?'
			conn.query(sql,[name,password],function(err,result){
				conn.release()
				if(err){callback(err,null)}
				else{callback(null,result)}
			})
		}
	})
}

// 会员邮箱登录
module.exports.loginEmail = function (name,password,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){callback(err,null)}
			else{
			var sql = 'select * from user where email=? and UPDATED_BY=?'
			conn.query(sql,[name,password],function(err,result){
				conn.release()
				if(err){callback(err,null)}
				else{callback(null,result)}
			})
		}
	})
}

// 会员 会员名登录
module.exports.loginUsername = function (name,password,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){callback(err,null)}
			else{
			var sql = 'select * from user where name=? and UPDATED_BY=?'
			conn.query(sql,[name,password],function(err,result){
				conn.release()
				if(err){callback(err,null)}
				else{callback(null,result)}
			})
		}
	})
}

//  登录之后获取用户信息
module.exports.userIfm = function(id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){callback(err,null)}
			else{
			var sql = 'select * from user,user_avatar where user.user_id=?';
			conn.query(sql,[id],function(err,result){
				conn.release()
				if(err){callback(err,null)}
				else{callback(null,result)}
			})
		}
	})
}

// 移入购物车获取购物车信息
module.exports.userShopping = function(id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
			else{
			var sql = 'select * from shopping_car,goods_sku,goods where user_id=? AND shopping_car.goods_id = goods.goods_id AND goods.goods_id = goods_sku.goods_id AND shopping_car.goods_sku = goods_sku.sku_id';
			conn.query(sql,[id],function(err,result){
				conn.release()
				if(err){callback(err,null)}
				else{callback(null,result)}
			})
		}
	})
}

// 删除购物车商品
module.exports.userShopDel = function(user_id,goods_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'delete from shopping_car where user_id=? and goods_id=?'
			conn.query(sql,[user_id,goods_id],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 获取左侧导航终点商品数据
module.exports.leftShop = function(callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from goods where publish_status=1 and recommand_status=1 and verify_status=1'
			conn.query(sql,function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 用户身份存入之前,查询是否存在
module.exports.inquireIdentity = function(user_real_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from user_identity where  user_real_id=?'
			conn.query(sql,[user_real_id],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 用户身份信息存入
module.exports.identityt = function(user_id,user_real_name,user_real_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = "insert into user_identity(user_id,user_real_name,user_real_id) values(?,?,?)"
			conn.query(sql,[user_id,user_real_name,user_real_id],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 查询用户身份信息inquire
module.exports.inquire = function(user_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from user_identity where user_id=?'
			conn.query(sql,[user_id],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 密保问题存入数据库
module.exports.tjiaoform = function(body,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'insert into user_security values(?,?,?,?,?,?,?)'
			var values = [body.user_id,body.securtiy_topic1,body.securtiy_topic_anwer1,body.securtiy_topic2,body.securtiy_topic_anwer2,body.securtiy_topic3,body.securtiy_topic_anwer3]
			// console.log(values)
			conn.query(sql,values,function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 查询用户密保问题
module.exports.inquireSecurtiy = function(user_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from user_security where user_id=?'
			conn.query(sql,user_id,function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 修改密保问题
module.exports.amendform = function(body,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'update user_security set securtiy_topic1=?,securtiy_topic_anwer1=?,securtiy_topic2=?,securtiy_topic_anwer2=?,securtiy_topic3=?,securtiy_topic_anwer3=? where user_id=?'
			var values = [body.securtiy_topic1,body.securtiy_topic_anwer1,body.securtiy_topic2,body.securtiy_topic_anwer2,body.securtiy_topic3,body.securtiy_topic_anwer3,body.user_id]
			console.log(values)
			conn.query(sql,values,function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 查询用户密保问题
module.exports.inquiresecur = function(user_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from user_security where user_id=?'
			conn.query(sql,[user_id],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 忘记密码查询用户名是否存在
module.exports.yanZUserPhone = function(user_name,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from user where phone=?'
			conn.query(sql,[user_name],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}
module.exports.yanZUserEmail = function(user_name,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from user where email=?'
			conn.query(sql,[user_name],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}
module.exports.yanZUserUsername = function(user_name,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ callback(err,null) }
		else{
			var sql = 'select * from user where name=?'
			conn.query(sql,[user_name],function(err,result){
				conn.release()
				if(err){ callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 验证码存入数据库
	// 查询以前是否存入过验证码
	module.exports.inquireResetTb = function(user_id,callback){
		pools.pool.getConnection(function(err,conn){
			if(err){ console.log(err);callback(err,null) }
			else{
				var sql = 'select * from user_reset_ver where user_id=?'
				conn.query(sql,[user_id],function(err,result){
					conn.release()
					if(err){ console.log(err);callback(err,null) }
					else{ callback(null,result) }
				})
			}
		})
	}
	// 更新验证码
	module.exports.updateVer = function(user_id,VerificationCode,dataTime,callback){
		pools.pool.getConnection(function(err,conn){
			if(err){ console.log(err);callback(err,null) }
			else{
				var sql = "update user_reset_ver set verification_code=?,time=? where user_id=?"
				conn.query(sql,[VerificationCode,dataTime,user_id],function(err,result){
					conn.release()
					if(err){ console.log(err);callback(err,null) }
					else{ callback(null,result) }
				})
			}
		})
	}
	// 直接插入验证码
	module.exports.interpositionVer = function(user_id,VerificationCode,callback){
		pools.pool.getConnection(function(err,conn){
			if(err){ console.log(err);callback(err,null) }
			else{
				var sql = 'insert into user_reset_ver(user_id,verification_code) values(?,?)'
				conn.query(sql,[user_id,VerificationCode],function(err,result){
					conn.release()
					if(err){ console.log(err);callback(err,null) }
					else{ callback(null,result) }
				})
			}
		})
	}

// 查询用户名验证码表
module.exports.inquireResetUserVer = function(user_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'select * from user_reset_ver where user_id=?'
			conn.query(sql,[user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 重置用户密码
module.exports.resetPassword = function(user_id,password,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'update user set UPDATED_BY=? where user_id=?'
			conn.query(sql,[password,user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 查询是否有密保问题
module.exports.securitQuestionVerificationinqure = function(user_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'select * from user_security where user_id=?'
			conn.query(sql,[user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 验证密保问题
module.exports.verificationSecurQ = function(user_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'select * from user_security where user_id=?'
			conn.query(sql,[user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 重置密码
module.exports.securitQuestionPassword = function(user_id,password,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'update user set UPDATED_BY=? where user_id=?'
			conn.query(sql,[password,user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 查询修改的手机号是否重复
module.exports.chaphoneshifyouchongf = function(phone,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'select * from user where phone=?'
			conn.query(sql,[phone],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 修改用户手机号
module.exports.gainphoneczuo = function(user_id,phone,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'update user set phone=? where user_id=?'
			conn.query(sql,[phone,user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 查询旧密码是否正确
module.exports.pduanPasswordshifzq = function(user_id,formerPassword,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'select * from user where user_id=? and UPDATED_BY=?'
			conn.query(sql,[user_id,formerPassword],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 修改用户密码
module.exports.modificationPassword = function(user_id,newPassword,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'update user set UPDATED_BY=? where user_id=?'
			conn.query(sql,[newPassword,user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 查询购物车页面总数据
module.exports.shoppingCarGain = function(user_id,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'select * from shopping_car,goods_sku,goods where user_id=? AND shopping_car.goods_id = goods.goods_id AND goods.goods_id = goods_sku.goods_id;'
			conn.query(sql,[user_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}

// 购物车改变商品数量
module.exports.gainxiaoxiaoshul = function(user_id,goods_id,shop_id,num,callback){
	pools.pool.getConnection(function(err,conn){
		if(err){ console.log(err);callback(err,null) }
		else{
			var sql = 'update shopping_car set num=? where user_id=? and goods_id=? and shop_id=?'
			conn.query(sql,[num,user_id,goods_id,shop_id],function(err,result){
				conn.release()
				if(err){ console.log(err);callback(err,null) }
				else{ callback(null,result) }
			})
		}
	})
}


