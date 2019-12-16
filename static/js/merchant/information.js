// 头像显示
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imgInp").change(function(){
    readURL(this);
});

// 表单提交事件
$("#login_form").on('submit',function(e){
    e.preventDefault();//阻止默认事件
    var formData=$(this).serialize();//获取表单内容
    // 验证
    reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
    reguntitled = /^[\u4e00-\u9fa5]{0,}$/;
    regidentity = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//身份证正则?
    if($("#shop_name").val() != ""){
        if(reg.test($("#shop_name").val())){
        }else{
        	return $("#in-n-v").css('display','block'),$("#in-n-v1").css('display','none')
        }
    }else{
			return $("#in-n-v").css('display','none'),$("#in-n-v1").css('display','block')
    }
    if($("#untitled").val() != ""){
        if(reguntitled.test($("#untitled").val())){
        }else{
        	return $("#in-i-v").css('display','block'),$("#in-i-v1").css('display','none')
        }
    }else{
			return $("#in-i-v").css('display','none'),$("#in-i-v1").css('display','block')
    }
    if($("#landlord").val() != ""){//身份证验证
        if(regidentity.test($("#landlord").val())){//正则匹配

        }else{
        	return $("#in-l-v").css('display','block'),$("#in-l-v1").css('display','none')
        }
    }else{
			return $("#in-l-v").css('display','none'),$("#in-l-v1").css('display','block')
    }
    $.ajax({
        url:'/merchant/informationAdd',
        type:'post',
        data:formData, //就是上面拿到的表单内容
        dataType:'json',
        success:function(data){
        var err_code=data.err_code
        if(err_code==0){
        	alert("保存成功,请重新登录")
            window.location.href='/merchant/login'
        }else if(err_code == 1){
            alert('店铺名字已存在')
        }else if(err_code == 3){
        	alert("你没有做出更改")
        }else{
            alert('服务器忙,请稍后重试')
        }
      }
    })
});

// jq 把数据库的时间类型改成 年月日
$(document).ready(function(){
    var register = $("#register-date-ipt-id").val()
    var dateee = new Date(register).toJSON();
    var date = new Date(+new Date(dateee)+8*3600*1000).toLocaleDateString()  
    if(register != ''){
        $("#register-date-id1").text(date)
    }
})


