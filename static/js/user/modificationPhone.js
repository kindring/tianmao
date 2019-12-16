// 判断ipt
    function y1(){
        if($('#verification').val() == '' ){
            $('#verpduanK').css('display','block'),$('#verpduanG,#verpduanB,#verpduanW,#verpduanP').css('display','none')
            return false
        }else{
            var lengthVer = $('#verification').val();
            $('#verpduanK,#verpduanG,#verpduanB,#verpduanW,#verpduanP').css('display','none');
            if(shuzi.test($('#verification').val())){
                if(lengthVer.length == 5){
                    return true
                }else{
                    $('#verpduanW').css('display','block'),$('#verpduanK,#verpduanB,#verpduanG,#verpduanP').css('display','none')
                    return false
                }
            }else{
                $('#verpduanG').css('display','block'),$('#verpduanK,#verpduanB,#verpduanW,#verpduanP').css('display','none')
                return false
            }
        } 
    }
    function yanz(){
        $('#verification').bind('input propertychange',function(){
            y1()
        })
    }
    yanz();
// 定义验证成功
	var succeed = false;
    $("#pduanModificationPhoneVer").on('submit',function(e){
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
            		window.location = '/user/importNewPhone'
            	}else if(err_code == 2){
            		$('#verpduanB').css('display','block'),$('#verpduanK,#verpduanG,#verpduanW,#verpduanP').css('display','none');
            	}
          　}
        })    
    });