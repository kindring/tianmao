const express = require('express');
const router = express.Router();


const bbl = require('../bbl/platform.js');
//平台路由,只做路由不做业务逻辑
router.get('/',function(req,res){
    //渲染平台管理页面
    if(!req.session.staff){
        //拒绝访问
        return res.redirect(302,'/platform/login')
    }
    console.log(req.session);
    console.log('---------');
    //res.json(req.session.staff)
    res.render('./platform/index.html');
});
router.get('/login',function(req,res){
    res.render('./platform/login.html');
});
router.post('/login',function(req,res){
    //读数据库,获取资源
    //调用读取数据库方法
    //数据比对返回登录信息
    bbl.login(req,res);
});
router.get('/staffs',(req,res)=>{
    if(!req.session.staff){
        //拒绝访问
        return res.json({
            code:302,
            message:'login state expire',
            descript:"登录失效,请重新登录"
        })
    }
    bbl.staffs(req,res)
});
router.get('/logout',(req,res)=>{
    //注销登录
    req.session.staff = null;
    res.redirect(302,'/platform/login')
});
router.get('/check_func',(req,res)=>{
    //query请求
    bbl.check_func({
        staff_id:req.session.staff,
        func_id:req.query.func_id
    }).then(
        (flag)=>{
            if(flag){
                res.json({
                    code:200,
                    message:"允许添加员工"
                })
            }else{
                res.json({
                    code:401,
                    message:"you do not have this feature",
                    descript:"你无法使用此功能"
                })
            }
        }
    )
});
router.get('/departments',(req,res)=>{
    if(!req.session.staff){
        //拒绝访问
        return res.json({
            code:302,
            message:'login state expire',
            descript:"登录失效,请重新登录"
        })
    }
    bbl.departments(req,res)
});
router.post('/addstaff',(req,res)=>{
    if(!req.session.staff){
        //拒绝访问
        return res.json({
            code:302,
            message:'login state expire',
            descript:"登录失效,请重新登录"
        })
    }
    bbl.check_func({
            staff_id:req.session.staff,
            func_id:4
        }).then(function(flag){
            if(!flag){
                return res.json({
                    code:401,
                    message:"",
                    descript:"你没有权限使用此功能"
                })
            }//无权限中断
            bbl.addstaff(req,res)
    })
});
router.get('/funcs',(req,res)=>{
    //查询所有的功能,可选参数
    if(!req.session.staff){
        //拒绝访问
        return res.json({
            code:302,
            message:'login state expire',
            descript:"登录失效,请重新登录"
        })
    }
    bbl.funcs(req,res)
});//查询功能的接口
router.get('/staff_detail',(req,res)=>{
    //判断是否可以访问
    if(!req.query.staff_id){
        return res.json({
            code:401,
            message:"访问员工详情必须包含被访问者的id",
            descript:"访问员工详情必须包含被访问者的id"
        })
    }//权限验证
    if(!req.session.staff){
        return res.json({
            code:302,
            message:"未登录",
            descript:"请登录后进行访问"
        })
    }//权限验证
    //判断是否为自己访问自己
    if(req.query.staff_id === req.session.staff){
        //访问自己
        //无需验证权限
        bbl.detail(req,res);
    }else{
        //验证是否有权限访问
        bbl.check_func({
            staff_id:req.session.staff,
            func_id:2
        }).then((flag)=>{
                if(flag){
                    //允许访问
                    //查询是否高于请求者等级
                    bbl.detail(req,res);
                }else{
                    res.json({
                        code:401,
                        message:"you do not have this feature",
                        descript:"你无法使用此功能"
                    })
                }
            }
        )
    }

});//获取用户详情
router.post('/change_staff',(req,res)=>{
    if(!req.session.staff){return res.json({code:302,message:"you are not login",descript:"未登录,请登录后尝试"})}
    if(!req.body){return res.json({code:402,message:"you are not post",descript:"无效请求,无数据"})}
    bbl.change_staff(req,res);
});//修改员工基本信息
router.post('/update_avatar',(req,res)=>{
    if(!req.session.staff){return res.json({code:302,message:"you are not login",descript:"未登录,请登录后尝试"})}
    console.log(req.body);
    bbl.update_avatar(req,res);//更新数据
});
module.exports=router;

