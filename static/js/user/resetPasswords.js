var phone = document.getElementById('phone').value;
var userDate = document.getElementById('userDate')
//1.判断该字符串里是否包含数字
function getNum(text){
    var value = text.replace(/[^0-9]/ig,""); 
    return value;
}
//2.if包含数字，判断数据长度是否为11
if(getNum(phone).length > 4){
    //3.截取所有数字，并用*替换4，4
    var phNum = getNum(phone),
    phnumAfter = phNum.substr(0,3) + "*" + phNum.substr(7);
}
if(getNum(phone).length == 11){
	var phNum1 = getNum(phone),
    phnumAfter1 = phNum1.substr(0,3) + "*" + phNum1.substr(7);
}
//4.替换输出
var phone = phone.replace(phNum,phnumAfter);
userDate.innerText = phone;

