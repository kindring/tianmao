
$(document).ready(function(){
	var phoneY = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    function y1(){
    	if($('#phone').val() == ''){
    		$('#phoneK').css('display','block'),$('#phoneB').css('display','none')
    		return false
    	}else{
    		$('#phoneK').css('display','none'),$('#phoneB').css('display','none')
    		if(phoneY.test($('#phone').val())){
    			return true
    		}else{
    			$('#phoneB').css('display','block')
    			return false
    		}
    	}
    }
    function y2(){
    	if($('verification').val() == ''){
    		$('#verificationK').css('display','block'),$('#verificationB').css('display','none')
    		return false
    	}else{
    		$('#verificationK').css('display','none'),$('#verificationB').css('display','none')
    		return true
    	}
    }
    function sub(){
        $("#phone").bind("input propertychange",function(){
            y1()
        });
        $("#verification").bind("input propertychange",function(){
            y2()
        });
    }
    sub();
	$("#verification2").on('submit',function(e){
		if (!y1()){
            e.preventDefault()//阻止默认事件
            return false
        }
        var phone1 = $('#phone').val()
        $('#phone1').attr('value',phone1)
        $('#phone2').attr('value',phone1)
        $('.phone1-text').text(phone1)
        e.preventDefault()
        var formData=$(this).serialize()//获取表单内容
        $.ajax({    
            url : '/user/verification',    
            type : 'post', 
            data : formData,    
            dataType: 'json',      
            success : function(data){ 
            	var err_code=data.err_code
            	if(err_code == 0){
            		alert('发送成功')
            	}
          　}
        })    
    })
    $("#verification1").on('submit',function(e){
		if (!y2()){
            e.preventDefault()//阻止默认事件
            return false
        }
        e.preventDefault()
        var formData=$(this).serialize()//获取表单内容
        $.ajax({    
            url : '/user/nextStep',    
            type : 'post', 
            data : formData,    
            dataType: 'json',      
            success : function(data){  
            	var err_code=data.err_code
            	if(err_code == 0){
                    $('#phonezong').css('display','none'),$('#informationzong').css('display','block'),$('.ol_li1').attr("id",""),$('.ol_li2').attr("id","active")
                }else if(err_code == 1){
            		$('#verificationB').css('display','block'),$('#verificationK').css('display','none')
            	}else if(err_code == 2){
            		alert('该号码已经被注册,请去登录页面')
            	}else if(err_code == 3){
            		$('#verificationK').css('display','block'),$('#verificationB').css('display','none')
            	}else if(err_code == 4){
            		alert('未填写手机号码或未获取验证码')
            	}
          　}
        })    
    })
})

