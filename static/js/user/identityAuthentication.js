$(document).ready(function(){
	var userId = localStorage.getItem('userId');
	$.ajax({
        url : '/user/inquire',
        type : 'post', 
        data : {Id:userId},   
        dataType: 'json',      
        success : function(data){
            var err_code = data.err_code
            
            if(err_code == 0){
            	var useridentity = data.useridentity
	            var user_real_name = useridentity.user_real_name
	            var user_real_id = useridentity.user_real_id
            	//1.判断该字符串里是否包含数字
				function getNum(text){
				    var value = text.replace(/[^0-9]/ig,"");
				    return value;
				}
				//2.if包含数字，判断数据长度是否为11
				if(getNum(user_real_id).length == 18){
				    //3.截取所有数字，并用*替换4，4
				    var phNum = getNum(user_real_id),
				    phnumAfter = phNum.substr(0,1) + "****************" + phNum.substr(17);
				}
				//4.替换输出
				var user_real_id1 = user_real_id.replace(phNum,phnumAfter);
				a = user_real_name.substring(0,1); //str
				user_real_name = user_real_name.substr(1); //删除第一个字符
				lengthName = user_real_name.length
				if(lengthName == 1){
					var user_real_name1 = a + '*'
				}else if(lengthName == 2){
					var user_real_name1 = a + '**'
				}else if(lengthName == 3){
					var user_real_name1 = a + '***'
				}
                $('.identityAuthenticationImg').remove()
                $('.informationPass').css('background','#edfed0')
                $('.identityAuthenticationImg1').css('display','block')
                $('.passIconText2').text('已通过实名认证')
                $('.passText').text('很高兴认识你，现在您可以享受更多的服务和保障')
                $('.leftTitle3').text('你的身份信息:')
                $('#userRealName').attr("disabled","disabled")
                $('#userRealId').attr("disabled","disabled")
                $('#userRealName').val(user_real_name1)
                $('#userRealId').val(user_real_id1)
                $('.tjiao').remove()
            }else if(err_code == 1){
                
            }
      　}
    })
	var realName = /^[\u4e00-\u9fa5]{0,}$/;
	var userIdp1 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	function y1(){
		if($('#userRealName').val() == '' ){
			$('#yanz1K').css('display','block'),$('#yanz1B').css('display','none')
			return false
		}else{
			$('#yanz1B,#yanz1K').css('display','none')
			if(realName.test($('#userRealName').val())){

			}else{
				$('#yanz1B').css('display','block'),$('#yanz1K').css('display','none')
				return false
			}
		}
		if($('#userRealId').val() == '' ){
			$('#yanz2K').css('display','block'),$('#yanz2B').css('display','none')
			return false
		}else{
			$('#yanz2B,#yanz2K').css('display','none')
			if(userIdp1.test($('#userRealId').val())){
				
			}else{
				$('#yanz2B').css('display','block'),$('#yanz1K').css('display','none')
				return false
			}
		}
		return true
	}
	function sub(){
		$('#userRealName').bind('input propertychange',function(){
			y1()
		})
		$('#userRealId').bind('input propertychange',function(){
			y1()
		})
	}
	sub();
	$('#idtjiao').on('submit',function(e){
		if (!y1()){
			e.preventDefault()//阻止默认事件
	        return false
	    }
	    e.preventDefault()
	    var formData=$(this).serialize()//获取表单内容
	    $.ajax({
	        url : '/user/identityt',
	        type : 'post', 
	        data : formData,   
	        dataType: 'json',      
	        success : function(data){
	        	console.log(data)
	            var err_code = data.err_code
	            if(err_code == 0){
	                window.location= '/user/identityAuthentication';
	            }else if(err_code == 1){
	                alert('提交失败,该用户信息以存在')
	            }
	      　}
	    })
	})
})

