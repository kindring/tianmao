// 判断ipt
    var shuzi = /^[0-9]*$/;
    var phone = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    function y1(){
        if($('#verification').val() == '' ){
            $('#verpduanK').css('display','block'),$('#verpduanG,#verpduanB,#verpduanW,#verpduanP').css('display','none')
            return false
        }else{
            var lengthVer = $('#verification').val();
            $('#verpduanK,#verpduanG,#verpduanB,#verpduanW,#verpduanP').css('display','none');
            if(shuzi.test($('#verification').val())){
                if(lengthVer.length == 5){
                    
                }else{
                    $('#verpduanW').css('display','block'),$('#verpduanK,#verpduanB,#verpduanG,#verpduanP').css('display','none')
                    return false
                }
            }else{
                $('#verpduanG').css('display','block'),$('#verpduanK,#verpduanB,#verpduanW,#verpduanP').css('display','none')
                return false
            }
        }
        
        return true
    }
    function y2(){
        if($('#phone').val() == '' ){
            $('#phoneK').css('display','block'),$('#phoneG').css('display','none')
            return false
        }else{
            $('#phoneG,#phoneK').css('display','none');
            if(phone.test($('#phone').val())){
                
            }else{
                $('#phoneG').css('display','block'),$('#phoneK').css('display','none')
                return false
            }
        }
        return true
    }
    function yanz(){
        $('#verification').bind('input propertychange',function(){
            y1()
        })
        $('#phone').bind('input propertychange',function(){
            y2()
        })
    }
    yanz();
    $("#phoneVer5").on('submit',function(e){

        if (!judgeCondition()){
            alert('60s的时间并没有过去!')
            e.preventDefault();
            return false
        }
        if (!y2()){
            e.preventDefault();
            return false
        }
        $('.verificationIpt').css('display','block')
        $('#verification').css('display','block')
        limit();
        var p = $('#phone').val();
        $('#gainPhone').val(p);
        e.preventDefault();
        var formData=$(this).serialize();//获取表单内容
        $.ajax({    
            url : '/user/phoneResetVerification',    
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
            url : '/user/gainPhonepduanNew',
            type : 'post',
            data : formData,
            dataType: 'json',
            success : function(data){
            	var err_code=data.err_code
            	if(err_code == 0 ){
            		alert('修改成功');
                    window.location = '/user/information';
            	}else if(err_code == 1){
            		$('#verpduanP').css('display','block'),$('#verpduanK,#verpduanG,#verpduanB,#verpduanW').css('display','none');
            	}else if(err_code == 3){
            		alert('电话号码已存在,请输入其他电话号码')
            	}else if(err_code == 2){
            		$('#verpduanB').css('display','block'),$('#verpduanK,#verpduanG,#verpduanW,#verpduanP').css('display','none');
            	}
          　}
        })    
    });