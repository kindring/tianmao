//只处理业务逻辑.不操做数据库交互,如判断该返回什么数据,以及是否有权限进行操作等.返回页面或者数据
//通过一系列操作判断返回何种页面以及数据
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const db = require('../database/all_database.js');//封装好的数据库查询方法
const reg = require('../model/regs.js');

let sockets = require('../model/sockets.js');

//分析请求->查询数据->处理业务->响应?
//请求?通过回调让其路由做相应操作?或者是在出此进行相应
function check_func(json){
    //传入员工编号以及功能编号
    //返回promise对象
    let promise=new Promise((resolve,reject)=>{
        //此方法因为是异步查询数据库所以使用promise进行回调,只判断是否可以操作无视是否可以
        //判断数据是否合法
        if(!reg.test('id',json.staff_id)||!reg.test('id',json.func_id)){
            console.log(json);
            return resolve(false)}
        db.platform.check_func({
            staff_id:json.staff_id,
            func_id:json.func_id
        },function(err,data){
            if(err){
                console.log("在检测功能是否有权限调用时: "+err.message);
                console.log(err);
                return resolve(false)
            }
            console.log(data);
            if(data.length===0){return resolve(false)}
            resolve(true);
        })
    });
    return promise;
}//作为辅助方法存在,用于检测是否可以进行操作.返回值为promise
module.exports.check_func=check_func;
module.exports.login=function(req,res){
    //判断数据是否合法?
    if(!req.body||!req.body.account||!req.body.password){return res.json({
        code:401,
        message:"missin data",
        desctipt:"数据缺失,请输入正确数据"
    })}//判断是否携带参数
    //判断数据是否合法,遍历判断或者单独判断
    if(!reg.test('account',req.body.account)||!reg.test('password',req.body.password)){
        return res.json({
            code:402,
            message:"error data",
            desctipt:"数据格式错误,请输入正确格式的数据"
        })
    }
    //查询数据
    db.platform.login(req.body,(err,data)=>{
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
        req.session.staff=data[0].staff_id;
        res.json({
            code:200,
            message:"login success",
            descript:"登录成功"
        });
    })
};//登录
module.exports.addstaff=function(req,res){
    // 先将员工添加至表中
    //  生成员工数据
    if(!req.body||!req.body.password||!req.body.phone||!req.body.authority_level||!req.body.staff_name||!req.body.department_id){return res.json({
        code:401,
        message:"missin data",
        desctipt:"数据缺失,请输入正确数据"
    })}
    //格式验证
    if(!reg.test('phone',req.body.phone)||!reg.test('password',req.body.password)||!reg.test('authority_level',req.body.authority_level)||!reg.test('staff_name',req.body.staff_name)||!reg.test('department_id',req.body.department_id)||!reg.test('password',req.body.password)){
        return res.json({
            code:402,
            message:"error data",
            desctipt:"数据格式错误,请输入正确格式的数据"
        })
    }
    //去重验证
    var staff = {
        staff_id:req.session.staff,//进行添加操作的员工id
        department_id:req.body.department_id,
        account:req.body.phone,
        name:req.body.staff_name,
        password:req.body.password,
        authority_level:req.body.authority_level,
        phone:req.body.phone,
        reserve:req.body.reserve,
        funcs:req.body.funcs
    };//员工数据
    //全部交给数据库方法来操作,返回相应错误或者是否成功即可
    db.platform.add_staff(staff,function(err,data){
        if(err){
            console.log(err);
            return res.json(err);
        }
        console.log(data);
        //如果没有错误则表明应当是成功了
        //则可以通过手机号查询
        var funcs = [];
        for(var i in staff.funcs){
            funcs.push(staff.funcs[i].func_id)
        }
        db.platform.add_funcs({
            phone:staff.phone//通过手机进行操作
        },{
            staff_id:staff.staff_id,
            funcs:funcs//功能列表
        },function(err,data){
            if(err){
                return res.json({
                    code:405,
                    message:err.message,
                    descript:"为该员工添加方法时出现错误"
                })
            }
            res.json({
                code:200,
                data:data
            })
        });//第一个条件为谁添加,第二个为参数,第三个为callback//

    });

};  //添加员工
module.exports.staffs=function(req,res){
    //查看员工列表需要权限
    check_func({
        staff_id:req.session.staff,
        func_id:2
    }).then(flag=>{
        console.log(flag);
        if(!flag){return res.json({
                code:401,
                message:"refuse vist",
                desctipt:"拒绝访问,你没有权限访问"
        })}
        db.platform.staffs(function(err,data){
            if(err){return res.json({
                code:500,
                message:err.message,
                desctipt:"数据查询错误,请稍后重试"
            })}
            req.session.staff = req.session.staff;
            res.json({
                code:200,
                staffs:data
            });
        })
    })
};//员工列表
module.exports.departments=function(req,res){
    //查看部门列表需要权限
    check_func({
        staff_id:req.session.staff,
        func_id:4
    }).then(flag=>{
        console.log(flag);
        if(!flag){return res.json({
                code:401,
                message:"refuse vist",
                desctipt:"拒绝访问,你没有权限访问"
        })}
        //只显示可选的部门,不可跨级添加
        //所以需要先查询操作员是属于什么部门的.将其部门以及父部门返回供其查看
        db.platform.staff(req.session.staff,(err,data)=>{
            //错误判断
            if(err){return res.json({
                code:500,
                message:err.message,
                desctipt:"数据查询错误,请稍后重试"
            })}
            //是否存在判断
            if(data.length===0){return res.json({
                code:404,
                message:'not found this staff',
                desctipt:"当前员工未找到,请稍后重试"
            })}
            //取第一个数据
            let staff=data;
            //判断是否为顶级部门,顶级部门则表示
            //查询某个类别的部门以及属于其子部门的所有部门
            var cb = function(error,result){
                if(error){return res.json({
                    code:500,
                    message:error.message,
                    desctipt:"数据查询错误,请稍后重试"
                })}
                req.session.staff = req.session.staff;
                res.json({
                    code:200,
                    data:result
                });
            };//作为一个方法,只是返回数据不同,是否能获取req以及res???
            console.log(staff);
            if(staff.department_id==1){
                //如果父级部门为0则表示为顶级部门
                db.platform.departments(cb)
            }else{
                db.platform.subdepartments(staff.department_id,cb)
            }

        });
    })
};
module.exports.funcs=function(req,res){
    //判断是否有权限?此方法可公开无需验证权限,只需要判断是否登录
    //判断是否有query
    //请求数据格式验证
    db.platform.funcs({
        department_id:req.query.department_id,
        staff_id:req.query.staff_id
    },function(err,result){
        if(err){
           return res.json({
               code:500,
               message:err.message,
               descript:"查询数据库出现错误"
           })
        }//错误处理
        req.session.staff = req.session.staff;
        res.json({
            code:200,
            data:result
        })
    })
};

module.exports.detail=function(req,res){
    //获取员工详情  无法越级查看员工数据
    var staff_id=req.query.staff_id;
    //判断是否越级
    var query_staff = req.session.staff;//获取请求者的员工id

    //判断是否越级,以判断是否为其显示密码.
    db.platform.detail(query_staff,staff_id,function(err,data){
        if(err){
            return res.json({
                code:500,
                message:err.message,
                descript:"服务器错误"
            })
        }
        res.json({
            code:200,
            data:data
        })
    })//根据员工id返回对应的信息
};
module.exports.change_staff=function(req,res){
    //获取员工详情  无法越级查看员工数据
    //必要数据判断
    if(!req.body.staff_id){return res.json({code:401,message:"未指明对谁进行修改",descript:"未指明对谁进行修改"})}
    //判断是否为自己修改
    if(req.body.staff_id===req.session.staff){
        //直接允许修改
        db.platform.change_staff(req.session.staff,req.body,function(err,data){
            if(err){return res.json({code:500,message:err.message,descript:err.descript|"服务器错误"})}
            res.json({
                code:200,
                data:data
            })
        });
    }else{

        //以及请求者是否有权限修改数据
        check_func({
            staff_id:req.session.staff,
            func_id:2
        }).then(function(flag){
            if(flag){
                //获取被修改的员工数据,查看被修改项,判断是否有关键数据不一致
                //允许修改则直接调用修改方法,在修改方法内判断是否有问题
                db.platform.change_staff(req.session.staff,req.body,function(err,data){
                    if(err){return res.json({code:500,message:err.message,descript:err.descript||"服务器错误"})}
                    res.json({
                        code:200,
                        data:data
                    })
                });
            }else{
                res.json({code:403,message:"you are not this func",descript:"你没有权限修改员工数据"})
            }

        });

    }

};

module.exports.update_avatar=function(req,res){
    //上传数据
    let form = new formidable.IncomingForm();
    let staff_id = req.session.staff;
    var allFile=[];
    form.uploadDir='./picture/temporary/';
    form.type=true;
    form.on('progress', function(bytesReceived, bytesExpected) {//在控制台打印文件上传进度
        let progressInfo = {
            value: bytesReceived,//当前进度
            total: bytesExpected//总进度
        };
        let bar_progress = Math.floor((progressInfo.value/progressInfo.total)*100);
        try{
            sockets[staff_id].emit('progress',bar_progress);
        }catch (e) {
            // console.log(e);
        }
        //res.write(JSON.stringify(progressInfo));
    }).on('file', function (filed, file) {
        allFile.push([filed, file]);//收集传过来的所有文件
    }).on('end', function() {
        res.end('上传成功！');
    }).on('error', function(err) {
        console.error('上传失败：', err.message);
    }).parse(req,function(err,fields,files){
        console.log(fields);
        console.log(files);
        if(err){return res.end(JSON.stringify({
            code:500,
            message:err.message,
            descript:"接收文件时错误了"
        }))}
        console.log("断点");
        if(fields.staff_id && files.image){
            // 生成新路径
            var _path = files.image.path.replace('picture\\temporary','');
            console.log(_path);
            var file_name = _path + path.extname(files.image.name);
            var new_path = './picture/staff/avatar/'+file_name;
            console.log("新路径"+new_path);
            // 获取文件名
            fs.rename(files.image.path,new_path,function(error){
                if(error){
                    console.log(error);
                    return res.end(JSON.stringify({
                        code:500,
                        message:err.message,
                        descript:"出现错误"
                    }))
                }
                // 如果成功则存入数据库
                var json = {
                    path:file_name,
                    staff_id:staff_id
                };
                console.log(json);
                db.platform.update_avatar(json,(err,result)=>{
                    if(err){
                        console.log("错误");
                        console.log(err);
                        return res.end(JSON.stringify({
                            code:500,
                            message:err.message,
                            descript:"出现错误"
                        }))
                    }
                    console.log(result);
                    res.end(JSON.stringify({
                        code:200,
                        message:"成功",
                        descript:"ok"
                    }))
                });
            })
        }
    })
};

