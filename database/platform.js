const pool = require('./pool.js');
function query(sql,values,cb){
    pool.getConnection((err,conn)=>{
        if(err){return cb(err)}
        conn.query(sql,values,cb);
        conn.release();
    })
}//简写部分代码
function login(json,cb,cb2){
    //包含员工账号,员工密码的对象
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数"})}
    if(!json.account||!json.password){return cb({message:'没有相应的账号密码'})}
    var sql = 'select * from staff where staff_account = ? and staff_password = ?';
    var values = [json.account,json.password];
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//平台账号登录
// 职工登录
// login({account:'17374627185',password:'123456'},function(err,result){
//     if(err){return console.log(err)}
//     console.log(result);
// });
function subdepartments(department_id,cb){
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数"})}
    var sql = 'select * from department where department_id = ? or parent_department_id = ?';
    var values = [department_id,department_id];
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//某个部门以及其所有的子部门
function departments(cb){
    var sql = 'select * from department';
    var values = null;
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//整个平台的所有部门
function add_staff(json,cb){
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数"})}
    console.log("添加员工数据验证");
    console.log(json);
    if(!json.staff_id||!json.department_id||!json.account||!json.password||!json.name||!json.authority_level||!json.phone){return cb({message:'请填写所有项'})}
    //所有数据都存在则去重验证
    //因为是多次操作数据库所以此处开启一个连接池
    pool.getConnection((err,coon)=>{
        if(err){
            return cb({
                code:500,
                message:err.message,
                descript:"数据库错误"
            })
        }//连接错误处理
        //员工去重
        var set_promise = new Promise((resolve,reject)=>{
            coon.query("select * from staff where staff_account = ? or staff_name = ?",[json.account,json.name],function(err,data){
                if(err){return reject({
                    code:500,
                    message:err.message,
                    descript:"服务器错误"
                })}//错误抛出
                if(data.length!==0){
                    console.log("账号或者用户名称重复");
                    return reject({
                        code:403,
                        message:'account or name is exist',
                        descript:"账号或者用户名称重复"
                    });//去重

                }//去重
                resolve();//成功下一步
            })
        });//是否与其数据存在冲突
        var level_promise = new Promise((resolve,reject)=>{
            coon.query("select * from level where staff_id = ?",[json.staff_id],function(err,data){
                if(err){return reject({
                    code:500,
                    message:err.message,
                    descript:"服务器错误"
                })}//错误抛出
                if(data.length===0){
                    return reject({
                        code:302,
                        message:'staff dons not exist',
                        descript:"用户不存在"
                    });//去重
                }//去除员工不存在的情况
                console.log("等级查询----");
                console.log(data[0].authority_level);
                resolve(data[0]);//成功下一步
            });
        });//获取等级
        Promise.all([set_promise,level_promise]).then((values)=>{
            //去重和等级都获取完成则开始将数据添加至数据库中
            var staff_level = values[1].authority_level;
            if(json.authority_level>staff_level){
                json.authority_level=staff_level
            }//等级限制
            console.log(json);
            var sql = "insert into staff(department_id,staff_account,staff_password,staff_name,authority_level,phone,reserve,sex) values(?,?,?,?,?,?,?,?)";
            var values = [json.department_id,json.account,json.password,json.name,json.authority_level,json.phone,json.reserve||'暂时没有简介',json.sex||0];
            //使用连接进行添加操作
            coon.query(sql,values,function(err,result){
                if(err){return cb({
                    code:500,
                    message:err.message,
                    descript:"服务器错误,添加员工失败"
                })}//错误抛出
                cb(null,result);//告知成功
                coon.release();
            })
        },(error)=>{
            cb(error)//在前两步有错误时则中止行动
        })
    });//sql操作

}//只需要传入员工数据,此方法自动完成查重以及等级验证后将其加入至数据库中并且为其添加对应方法
function check_func(json,cb){
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数"})}
    if(!json.staff_id||!json.func_id){return cb({message:'必须要有相应的员工编号以及功能编号'})}
    let sql = "select * from staff_func_re as s , func_item as f where s.staff_id = ? and ((f.func_id = ? and s.func_id = f.func_id) or (f.parent_func_id = s.func_id and f.func_id = ?) or (f.parent_func_id = s.func_id and f.func_id = 0))";//判断一个账号是否有所有功能
    let values = [json.staff_id,json.func_id,json.func_id];
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//检测是否有此功能
function staffs(cb){
    var sql="select d.department_name,s.department_id,s.staff_id,s.staff_name,s.phone,s.entry_time,s.authority_level,s.reserve,s.sex from department as d join staff as s\n" +
        "where d.department_id = s.department_id";
    var values = null;
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//员工列表,有部门的员工
function staff(staff_id,cb){
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数,一个员工id和callback"})}
    var sql="select * from staff where staff_id = ?";
    var values = staff_id;
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        console.log('--------result');
        console.log(result);
        cb(err,result[0])
    })
}//指定员工的具体信息
function funcs(json,cb){
    //该功能所需返回数据为,功能的基本信息,如果有
    if(arguments.length<1){return console.log('错误')}//异常抛出
    let sql,values;
    if(arguments.length===1){
        //没有参数,显示所有的功能
        //默认将其参数,作为callback
        sql="select * from func_item";
    }else{
        //有参数,默认为
        //判断参数是员工id还是部门id
        if(json.department_id){
            //判断其部门是否为顶级部门,如果是顶级部门则列出所有的部门
            if(json.department_id==1){
                sql = "select * from func_item"
            }else{
                sql  = "select * from func_item as f , department_func as d where f.func_id = d.func_id and d.department_id = ?";
                values = json.department_id
            }
        }else if(json.staff_id){
            sql  = "select * from staff_func_re as s , func_item as f where s.func_id = f.func_id and s.staff_id = ?";
            values = json.staff_id
        }
    }
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result)
    })
}//可以判断某个员工的所有功能,或者某个部门下边的所有功能,亦或者是所有的功能/
function level(staff_id,cb){
    if(arguments.length<=1){return cb({message:"该方法至少需要两个参数,一个员工id和callback"})}
    var sql = 'select * from level';//查询的是一个叫做level的视图,包含员工id和员工等级
    var values = staff_id;
    query(sql,values,function(err,result){
        if(err){return cb({code:'500',message:err.message})}
        cb(err,result[0])
    })
}//返回对象//查询员工
function find_staff(json,cb){
    //判断是查询所有员工还是特定条件的员工
}//查询员工
function add_funcs(condition,funcs,cb){
    if(arguments.length===3){
        //看查询条件,根据什么来生成查询,可以根据员工名或者账号来查询
        var sql = 'select * from staff where ';
        var value = '';
        if(condition.staff_id||condition.id){
            //根据员工id来添加
            sql = sql + "staff_id = ?";
            value = condition.staff_id||condition.id;
        }else if(condition.phone||condition.account||condition.staff_account){
            sql = sql + "staff_account = ?";
            value = condition.phone||condition.account||condition.staff_account;
        }else if(condition.name||condition.staff_name){
            sql = sql + "staff_name = ?";
            value = condition.name||condition.staff_name
        }else{
            return cb({
                message:"批量为某员工添加功能第一个参数需要员工名或者是手机号或者账号,或者是员工id"
            })
        }
        //创建连接
        pool.getConnection((err,coon)=>{
            if(err){
                return cb({
                    message:"数据库连接错误"
                });
            }
            var promise = new Promise((resolve, reject)=>{
                coon.query(sql,value,(err,data)=>{
                    if(err){
                        return reject({
                            message:err.message
                        })
                    }
                    resolve(data)
                })
            });
            promise.then((data)=>{
                if(data.length===0){
                    return cb({
                        message:"无法查询到此员工"
                    })
                }
                //使用for循环遍历添加功能,创建promise列表
                var promise_list=[];
                for (var i in funcs.funcs) {
                    //去个重吧
                    var add_func_promise = new Promise((resolve,reject)=>{
                        //生成sql语句
                        var _sql = "insert into staff_func_re (staff_id,func_id,action_id) values(?,?,?)";
                        var _values = [data[0].staff_id,funcs.funcs[i],funcs.staff_id];
                        //在其未错误并且未重复时进行添加
                        var set_sql = "select * from staff_func_re where staff_id = ? and func_id = ?";
                        var set_values = [data[0].staff_id,funcs.funcs[i]];
                        coon.query(set_sql,set_values,function(_error,_result){
                            if(_error){
                                console.log("错误");
                                return reject({
                                    message:_error.message
                                })
                            }//错误抛出
                            if(_result.length===0){
                                //如果不存在则使用添加语句
                                coon.query(_sql,_values,(err,result)=>{
                                    if(err){
                                        return reject({
                                            message:err.message
                                        })
                                    }
                                    resolve(result);
                                })//添加
                            }else{
                                resolve('ok')
                                //已经存在则跳过此处操作,避免资源浪费
                            }
                        });
                    });
                    promise_list.push(add_func_promise)
                }
                Promise.all(promise_list).then((results)=>{
                    cb(null,results);//返回结果
                    coon.release();//成败与否都释放
                },(err)=>{
                    cb(err);
                    coon.release();
                })
            },(err)=>{
                cb(err);
                //释放连接
                coon.release();
            })
        })
    }
}//批量添加员工功能


function detail(query_staff,staff_id,cb){
    if(arguments.length<=2){return cb({message:"该方法至少需要三个参数,请求者的id以及一个员工id和callback"})}
    //根据员工id查询员工的基本信息以及拥有的功能
    //创建连接
    pool.getConnection((err,coon)=>{
        if(err){return cb({message:err.message})}
        //先行获取请求者id
        var staff_level = new Promise((resolve, reject)=>{
            var sql = "select * from level where staff_id = ?";
            var value = query_staff;
            coon.query(sql,value,(err,data)=>{
                if(err){
                    return reject({message:err.message})
                }
                return resolve(data[0])
            })
        });//获取请求者等级,无法
        var staff_avatar = new Promise((resolve, reject)=>{
            var sql = "select path from staff_avatar where staff_id = ? order by date desc";
            var value = staff_id;
            coon.query(sql,value,(err,data)=>{
                if(err){
                    return reject({message:err.message})
                }
                return resolve(data[0])
            })
        });//获取被请求者的头像数据等
        var _detail = new Promise((resolve, reject)=>{
            var sql = "select * from department  as d , staff as s where s.department_id = d.department_id and s.staff_id = ?";
            var value = staff_id;
            coon.query(sql,value,(err,data)=>{
              if(err){
                 return reject({message:err.message})
              }
              return resolve(data[0])
            })
        });
        var _funcs = new Promise((resolve, reject)=>{
            funcs({
                staff_id:staff_id
            },(err,data)=>{
                if(err){
                    return reject({message:err.message})
                }
                resolve(data)
            })
        });
        Promise.all([staff_level,_detail,_funcs,staff_avatar]).then((values)=>{
            var staff_level = values[0];
            var staff = values[1];
            var funcs = values[2];
            var avatar = values[3];
            if (staff){staff.funcs = funcs;}
            if(staff_level){
                if(staff_level.authority_level<=staff.authority_level){
                    //如果等级比请求者等级低则将其密码隐藏
                    staff.staff_password="******"
                }
            }
            if(avatar){
                staff.avatar=avatar.path
            }else{
                staff.avatar="/default.png"
            }//如果没有获取到头像则设置为默认头像
            cb(null,staff);
            coon.release();
        },(err)=>{
            cb(err);
            coon.release();
        })
    });
}

function change_staff(query_staff,json,cb){
    if(arguments.length<=2){return cb({message:"该方法至少需要2个参数,修改后的数据和callback"})}
    //判断是否有越级修改关键数据
    //使用该请求者获取数据对比,在返回值为******时证明是无法修改这些数据的,则可以
    var _detail=new Promise((resolve, reject)=>{
        detail(query_staff,json.staff_id,function(err,data){
            if(err){return reject(err)}
            resolve(data)
        })
    });
    var _level = new Promise((resolve, reject) => {
        level(query_staff,function(err,data){
            if(err){return reject(err)}
            resolve(data)
        })
    });
    Promise.all([_detail,_level]).then((values)=>{
            var staff = values[0];
            var level = values[1];
        //判断数据是否与其有冲突,如密码
        if(staff.staff_password==="******"){
            //在请求者等级比被修改者等级低时判断是否有关键数据被改变
            //如等级,账号,密码等
            console.log("***********");
            console.log(json);
            console.log(staff);
            if(json.staff_password!="******"||json.authority_level!=staff.authority_level||json.staff_account!=staff.staff_account){
                //这些数据不允许越级修改或者是同级修改
                return cb({code:403,message:"越级情况下无法对账号密码等级进行修改"})
            }
        }//特殊数据修改限制
        if(level.authority_level<json.authority_level){
            //该员工将等级设置为比自身高,拒绝操作
            return cb({code:403,message:"无法将该员工设置比操作员更高的等级!最多设置为同级",descript:"无法将该员工设置比操作员更高的等级"})
        }//等级修改限制
        //开始添加
        // 按条件生成sql语句等
        //如果有密码为******则不设置此些列
        var sql = "update staff set";
        var values = [];
        var index = 0;
        for(var key in json){
            var str = "";
            if(index==0){
                str = " "+key+" = ?";
            }else{
                str = ","+key+" = ?";
            }
            if(key==="staff_password"){
                if(staff.staff_password==="******"){
                    //如果有此列的话则跳过生成
                }else{
                    sql+=str;
                    values.push(json[key]);
                }
            }else{
                sql+=str;
                values.push(json[key]);
            }
            index ++;
        }
        sql +=" where staff_id = ?";
        values.push(staff.staff_id);
        console.log("生成的sql语句是"+sql);
        console.log(values);
        query(sql,values,function(err,data){
            if(err){return cb({code:500,message:err.message})}
            cb(null,data);
        })
    },(err)=>{cb(err)});
}

function update_avatar(json,cb){
    if(arguments.length<2){return cb({message:"该方法至少需要2个参数,修改后的数据和callback"})}
    if(!json.path||!json.staff_id){return cb({message:"缺少参数"})}
    var sql = "insert into staff_avatar (staff_id,path) values(?,?)";
    var values = [json.staff_id,json.path];
    console.log(sql);
    console.log(values);
    query(sql,values,function(err,result){
        console.log(err,result);
        if(err){return cb({code:'500',message:err.message})}
        cb(null,result)
    })
}
//导出此接口
module.exports.login = login;
module.exports.add_staff = add_staff;
module.exports.check_func = check_func;
module.exports.staffs = staffs;
module.exports.staff = staff;
module.exports.subdepartments = subdepartments;
module.exports.departments = departments;
module.exports.funcs = funcs;
module.exports.level = level;
module.exports.add_funcs = add_funcs;
module.exports.detail = detail;
module.exports.change_staff = change_staff;
module.exports.update_avatar = update_avatar;

//module.exports.find_staffs = find_staffs;//按照条件查询员工


