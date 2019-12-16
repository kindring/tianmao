$(document).ready(function(){
	var phoneY = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
	var emailY = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	var nameY = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
	var passwordY = /^[A-Za-z0-9]+$/;
	function y1(){
		if($('#name').val() == '' ){
			$('#nameK').css('display','block'),$('#PawwK,#namePawwGB,#namePawwB').css('display','none')
			return false
		}else{
			$('#nameK,#PawwK,#namePawwGB,#namePawwB').css('display','none')
			if(phoneY.test($('#name').val()) || emailY.test($('#name').val()) || nameY.test($('#name').val())){

			}else{
				$('#namePawwGB').css('display','block'),$('#nameK,#PawwK,#namePawwB').css('display','none')
				return false
			}
		}
		if($('#password').val() == '' ){
			$('#PawwK').css('display','block'),$('#nameK,#namePawwGB,#namePawwB').css('display','none')
			return false
		}else{
			$('#nameK,#PawwK,#namePawwGB,#namePawwB').css('display','none')
			if(passwordY.test($('#password').val())){

			}else{
				$('#namePawwGB').css('display','block'),$('#nameK,#PawwK,#namePawwB').css('display','none')
				return false
			}
		}
		return true
	}
	function sub(){
		$('#name').bind('input propertychange',function(){
			y1()
		})
		$('#password').bind('input propertychange',function(){
			y1()
		})
	}
	sub();
	$("#dologin").on('submit',function(e){
        if (!y1()){
            e.preventDefault()//阻止默认事件
            return false
        }
        e.preventDefault()
        var formData=$(this).serialize()//获取表单内容
        $.ajax({    
            url : '/user/login',    
            type : 'post', 
            data : formData,    
            dataType: 'json',      
            success : function(data){  
                var err_code = data.err_code
                var id = data.id
                if(err_code == 0){
                    $('#namePawwB').css('display','none');
                    localStorage.userId=id;
                    window.location= '/user';
                }else if(err_code == 1){
                    $('#namePawwB').css('display','block');
                }
          　}
        })    
    })
})