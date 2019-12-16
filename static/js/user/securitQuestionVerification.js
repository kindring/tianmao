$(document).ready(function(){
	// 查询是否存在密保问题
	var userId = document.getElementById('securitQ').innerText;
	var flag = true;
	$.ajax({
		url:'/user/securitQuestionVerification',
		type:'post',
		data: {user_id:userId},
		dataType: 'json',
        success : function(data){
        	var err_code=data.err_code;
        	var securtiyData = data.securtiyData;
        	if(err_code == 0){
        		console.log(securtiyData.securtiy_topic1)
        		var securtiy_topic1 = securtiyData.securtiy_topic1
	            var securtiy_topic2 = securtiyData.securtiy_topic2
	            var securtiy_topic3 = securtiyData.securtiy_topic3
	            $("#securtiy_topic1").append("<option value='"+securtiy_topic1+"'>"+securtiy_topic1+"</option>");
	            $("#securtiy_topic2").append("<option value='"+securtiy_topic2+"'>"+securtiy_topic2+"</option>");
	            $("#securtiy_topic3").append("<option value='"+securtiy_topic3+"'>"+securtiy_topic3+"</option>");
        	}else if(err_code == 1){
        		$('.nosecurQ').css('display','block');
        		$('.securitQuestionAll').css('display','none');
        		$('#tjiao').attr('disabled',true);
        		// chaoji(false);
        		flag = false;
        		alert('你没有设置密保问题');
        	}else if(err_code == 2){
        		window.location = '/user/login';
        	}
      　}
	})
// 答案判断
	var realName = /^[\u4e00-\u9fa5]{0,}$/;
	function y1(){
		if($('#securtiy_topic_anwer1').val() == '' ){
			$('#pduanK1').css('display','block'),$('#pduanB1').css('display','none')
			return false
		}else{
			$('#pduanK1,#pduanB1').css('display','none')
			if(realName.test($('#securtiy_topic_anwer1').val())){

			}else{
				$('#pduanB1').css('display','block'),$('#pduanK1').css('display','none')
				return false
			}
		}
		if($('#securtiy_topic_anwer2').val() == '' ){
			$('#pduanK2').css('display','block'),$('#pduanB2').css('display','none')
			return false
		}else{
			$('#pduanK2,#pduanB2').css('display','none')
			if(realName.test($('#securtiy_topic_anwer2').val())){

			}else{
				$('#pduanB2').css('display','block'),$('#pduanK2').css('display','none')
				return false
			}
		}
		if($('#securtiy_topic_anwer3').val() == '' ){
			$('#pduanK3').css('display','block'),$('#pduanB3').css('display','none')
			return false
		}else{
			$('#pduanK3,#pduanB3').css('display','none')
			if(realName.test($('#securtiy_topic_anwer3').val())){

			}else{
				$('#pduanB3').css('display','block'),$('#pduanK3').css('display','none')
				return false
			}
		}
		return true
	}
	function sub(){
		$('#securtiy_topic_anwer1').bind('input propertychange',function(){
			y1()
		})
		$('#securtiy_topic_anwer2').bind('input propertychange',function(){
			y1()
		})
		$('#securtiy_topic_anwer3').bind('input propertychange',function(){
			y1()
		})
	}
	sub();
// 验证密保问题提交
	var securitQuesFlag = false;
	$('#verificationSecurQ').on('submit',function(e){
		if (!y1()){
			e.preventDefault()//阻止默认事件
	        return false
	    }
	    if(flag != true){
	    	e.preventDefault()//阻止默认事件
	    	alert('无法提交')
	    	return false
	    }
	    e.preventDefault()
	    var formData=$(this).serialize()//获取表单内容
	    $.ajax({
			url: '/user/verificationSecurQ',
			type : 'post', 
			data: formData,
			dataType: 'json',      
	        success : function(data){
	            var err_code = data.err_code
	            if(err_code == 0){
	            	$('#passwordAll').css('display','block');
	            	$('#securitQtjiao').css('display','none');
	            	securitQuesFlag = true;
	            }else if(err_code == 1){
	                $('.nosecurQ').css('display','block');
	        		$('.securitQuestionAll').css('display','none');
	        		$('#tjiao').attr('disabled',true);
	        		alert('你没有设置密保问题');
	            }else if(err_code == 2){
	            	alert('密保问题不正确');
	            }
	      　}
		})
	})
//  重置密码提交
	// 验证
	var passwordY = /^[A-Za-z0-9]+$/;
	function y2(){
		if($('#password').val() == ''){
			$('#pduanK4').css('display','block'),$('#pduanB4,#pduanD4,#pduanY4').css('display','none');
			return false
		}else{
			$('#pduanK4,#pduanB4,#pduanD4,#pduanY4').css('display','none');
			if(passwordY.test($('#password').val())){
				if($('#password').val().length > 6){
					return true
				}else{
					$('#pduanD4').css('display','block'),$('#pduanK4,#pduanB4,#pduanY4').css('display','none');
					return false
				}
			}else{
				$('#pduanB4').css('display','block'),$('#pduanK4,#pduanD4,#pduanY4').css('display','none');
				return false
			}
		}
	}
	function sub1(){
		$('#password').bind('input propertychange',function(){
			y2();
		})
	}
	sub1();
	$('#securitQuestionPassword').on('submit',function(e){
		if (!y2()){
			e.preventDefault()//阻止默认事件
	        return false
	    }
	    if(securitQuesFlag != true){
	    	e.preventDefault()//阻止默认事件
	    	alert('无法重置')
	    	return false
	    }
	    e.preventDefault()
	    var formData=$(this).serialize()//获取表单内容
	    $.ajax({
			url: '/user/securitQuestionPassword',
			type : 'post',
			data: formData,
			dataType: 'json',
	        success : function(data){
	            var err_code = data.err_code
	            if(err_code == 0){
	            	window.location= '/user/login'
	            }else if(err_code == 1){
	                
	            }else if(err_code == 2){
	            	$('#passwordAll').css('display','none');
	            	$('#securitQtjiao').css('display','block');
	            	alert('你没有验证密保问题');
	            }else if(err_code == 3){
	            	alert('不存在');
	            }
	      　}
		})
	})
})