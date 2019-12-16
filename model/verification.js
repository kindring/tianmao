//导入短信配置文件
const verification = require('../verification.json');//导入配置文件
const QcloudSms = require("qcloudsms_js");//腾讯云短信sdk
//创建一个短信对象

function Sms(phone,params){
    this.phone=phone;//手机号
    this.params=params;//参数
    this.nationcode=86;
    this.appid=verification.appid;//短信应用id
    this.appkey=verification.key;//短信应用key
    this.SmsSign=verification.SmsSign;//签名
    this.templateid=verification.templateid;//模板id
}
Sms.prototype.send = function(cb){
    //发送数据,只需一个callback接受结果即可
    if(!this.params){throw "send message must have params";}//不发送没有参数的消息
    if(!this.phone){throw "未指定手机号,可以在创建阶段指定手机号或者是使用setPhone方法指定手机号"}
    var qcloudsms = QcloudSms(this.appid,this.appkey);//实例化
    var ssender = qcloudsms.SmsSingleSender();//单发api
    var params = [this.params,5];//验证码参数,第二个是使用时间
    ssender.sendWithParam(this.nationcode, this.phone,this.templateid,params, this.SmsSign,"","",cb);  // 签名参数未提供或者为空时，会使用默认签名发送短信
};//单发功能
Sms.prototype.createParams = function(number){
    number=number||6;//如果没有则默认为6位数的数据
    let rnd="";
    for(var i=0;i<number;i++){
        rnd+=Math.floor(Math.random()*10);//
    }
    this.params=rnd;
    return this;//返回this进行链式调用
};//生成一个新的参数
Sms.prototype.setPhone=function(phone){
    this.phone = phone||this.phone;
    return this;//链式调用
};//设置手机号
Sms.prototype.getParams =function(){
    return this.params;
};//获取验证码
// 实例化?
function sms (phone,params){
    //传入参数,该方法进行new操作
    return new Sms(phone,params)
}//导出此方法

module.exports = sms;