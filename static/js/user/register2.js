$(document).ready(function(){
	var passwordY = /^[A-Za-z0-9]+$/;
	var emailY = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	var hmetownY = /^[\u4e00-\u9fa5]{0,}$/;
	var nameY = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
	function y3(){
    	if($('#password').val() == ''){
    		$('#passwordK').css('display','block'),$('#passwordB').css('display','none')
    		return false
    	}else{
    		$('#passwordK').css('display','none'),$('#passwordB').css('display','none')
    		if(passwordY.test($('#password').val())){
    			if($('#password').val().length > 6){
    			}else{
    				$('#passwordB').css('display','block')
    				return false
    			}
    		}else{
    			$('#passwordB').css('display','block')
    			return false
    		}
    	}
    	if($('#password1').val() == ''){
    		$('#password1K').css('display','block'),$('#password1B').css('display','none')
    		return false
    	}else{
    		$('#password1K').css('display','none'),$('#password1B').css('display','none')
    		if($('#password1').val() == $('#password').val()){
    		}else{
    			$('#password1B').css('display','block')
    			return false
    		}
    	}
    	if($('#email').val() == ''){
    		$('#emailK').css('display','block'),$('#emailB').css('display','none')
    		return false
    	}else{
    		$('#emailK').css('display','none'),$('#emailB').css('display','none')
    		if(emailY.test($('#email').val())){
    		}else{
    			$('#emailB').css('display','block')
    			return false
    		}
    	}
    	if($('#hmetown').val() == ''){
    		$('#hmetownK').css('display','block'),$('#hmetownB').css('display','none')
    		return false
    	}else{
    		$('#hmetownK').css('display','none'),$('#hmetownB').css('display','none')
    		if(hmetownY.test($('#hmetown').val())){
    		}else{
    			$('#hmetownB').css('display','block')
    			return false
    		}
    	}
    	if($('#name').val() == ''){
    		$('#nameK').css('display','block'),$('#nameB').css('display','none')
    		return false
    	}else{
    		$('#nameK').css('display','none'),$('#nameB').css('display','none')
    		if(nameY.test($('#name').val())){
    		}else{
    			$('#nameB').css('display','block')
    			return false
    		}
    	}
        return true
    }
    function sub(){
        $("#password").bind("input propertychange",function(){
            y3()
        });
        $("#password1").bind("input propertychange",function(){
            y3()
        });
        $("#email").bind("input propertychange",function(){
            y3()
        });
        $("#hmetown").bind("input propertychange",function(){
            y3()
        });
        $("#name").bind("input propertychange",function(){
            y3()
        });
    }
    sub();
    $("#register1").on('submit',function(e){
        if (!y3()){
            e.preventDefault()//阻止默认事件
            return false
        }
        e.preventDefault()
        var formData=$(this).serialize()//获取表单内容
        $.ajax({    
            url : '/user/register1',    
            type : 'post', 
            data : formData,    
            dataType: 'json',      
            success : function(data){  
                var err_code=data.err_code
                if(err_code == 0){
                    $('#nameC').css('display','none')
                    alert('注册成功')
                    window.location= '/user/login'
                }else if(err_code == 1){
                    $('#emailC').css('display','block')
                }else if(err_code == 2){
                    $('#nameC').css('display','block'),$('#emailC').css('display','none')
                }
          　}
        })    
    })
})