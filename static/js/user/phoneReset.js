// $(document).ready(function(){
	var phone = document.getElementById('phone').value;
	var userDate = document.getElementById('phone1')
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
	var phone1 = phone.replace(phNum,phnumAfter);
	userDate.innerText = phone1;
	// removeAttribute
	
// 提交验证码
	// 定义验证成功
	var succeed = false;
    $("#verificationVer").on('submit',function(e){
		if (!y1()){
		    e.preventDefault();
		    return false
		}
        e.preventDefault();
        var formData=$(this).serialize();//获取表单内容
        $.ajax({
            url : '/user/rainUserResetVerification',
            type : 'post',
            data : formData,
            dataType: 'json',
            success : function(data){  
            	var err_code=data.err_code
            	if(err_code == 0 ){
            		alert('发送成功')
            	}else if(err_code == 1){
            		$('#verpduanP').css('display','block'),$('#verpduanK,#verpduanG,#verpduanB,#verpduanW').css('display','none');
            	}else if(err_code == 3){
            		$('.subAll').fadeOut();
            		$('.passwordAll').css('display','block');
            		$('.verificationAll').fadeOut();
            		succeed = true;
            		// alert('验证成功')
            	}else if(err_code == 2){
            		$('#verpduanB').css('display','block'),$('#verpduanK,#verpduanG,#verpduanW,#verpduanP').css('display','none');
            	}
          　}
        })    
    });
// 提交新密码
	var passwordY = /^[A-Za-z0-9]+$/;
	function y2(){
		if($('#password').val() == ''){
			$('#pduanPsK').css('display','block'),$('#pduanPsB,#pduanPsD,#pduanPsY').css('display','none');
			return false
		}else{
			$('#pduanPsK,#pduanPsB,#pduanPsD,#pduanPsY').css('display','none');
			if(passwordY.test($('#password').val())){
				if($('#password').val().length > 6){
					return true
    			}else{
    				$('#pduanPsD').css('display','block'),$('#pduanPsB,#pduanPsK,#pduanPsY').css('display','none');
    				return false
    			}
			}else{
				$('#pduanPsB').css('display','block'),$('#pduanPsK,#pduanPsD,#pduanPsY').css('display','none')
				return false
			}
		}
		
	}
	function passwordVer(){
		$('#password').bind('input propertychange',function(){
			y2()
		})
	}
	passwordVer();
	$("#xgaiPass").on('submit',function(e){
		if (succeed != true){
		    e.preventDefault();
		    $('#pduanPsY').css('display','block')
		    return false
		}
		if(!y2()){
			e.preventDefault()//阻止默认事件
            return false
		}
        e.preventDefault();
        var formData=$(this).serialize();//获取表单内容
        $.ajax({
            url : '/user/resetPassword',
            type : 'post',
            data : formData,
            dataType: 'json',
            success : function(data){  
            	var err_code=data.err_code
            	if(err_code == 0 ){
            		alert('修改成功?')
            		window.location = '/user/login';
            	}else if(err_code == 1){
            		alert('你没有通过验证')
            	}
          　}
        })    
    });


