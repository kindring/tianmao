$(document).ready(function(){
	var userId = localStorage.getItem('userId');
	$.ajax({
        url : '/user/inquireSecurtiy',
        type : 'post', 
        data : {Id:userId},   
        dataType: 'json',      
        success : function(data){
            var err_code = data.err_code
            if(err_code == 0){
            	var securtiy = data.securtiy
	            var securtiy_topic1 = securtiy.securtiy_topic1
	            var securtiy_topic2 = securtiy.securtiy_topic2
	            var securtiy_topic3 = securtiy.securtiy_topic3
				$("#securtiy_topic1").find("option[value = '"+securtiy_topic1+"']").attr("selected", true);
				$("#securtiy_topic2").find("option[value = '"+securtiy_topic2+"']").attr("selected", true);
				$("#securtiy_topic3").find("option[value = '"+securtiy_topic3+"']").attr("selected", true);
	            $('.tjiaoxgai').text('修改密保问题')
	            $('#banzige').css('display','block')
	            $('#banzige').text('修改密保问题')
	            $('.tjiaoxgai').css('display','none')
	            $('.tjiaoxgai').remove('id','tjiao')
	            $('.tjiaoxgai').attr('id','tjiaoxg')
                $('.identityAuthenticationImg').remove()
                $('.informationPass').css('background','#edfed0')
                $('.identityAuthenticationImg1').css('display','block')
                $('.passIconText2').text('已设置密保问题')
                $('.passText').text('你的账号安全等级提高了!')
                $('.securityQuestionTitle').text('你的密保问题:')
                $('#securtiy_topic_anwer1,#securtiy_topic_anwer2,#securtiy_topic_anwer3').attr("disabled","disabled")
                $('#securtiy_topic_anwer1,#securtiy_topic_anwer2,#securtiy_topic_anwer3').val('********')
                // $('.tjiao').remove()
            }else if(err_code == 1){
                
            }
      　}
    })
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
	$('#tjiaoform').on('submit',function(e){
		if (!y1()){
			e.preventDefault()//阻止默认事件
	        return false
	    }
	    e.preventDefault()
	    var formData=$(this).serialize()//获取表单内容
		$.ajax({
			url: '/user/tjiaoform',
			type : 'post', 
			data: formData,
			dataType: 'json',      
	        success : function(data){
	            var err_code = data.err_code
	            if(err_code == 0){
	                window.location = '/user/securityQuestion'
	            }else if(err_code == 1){
	                
	            }
	      　}
		})
	})
	$('#banzige').click(function(){
		$('.formpduan').remove('id','tjiaoform')
	    $('.formpduan').attr('id','amendform')
	    $('#securtiy_topic_anwer1,#securtiy_topic_anwer2,#securtiy_topic_anwer3').removeAttr("disabled")
	    $('#banzige').css('display','none')
        $('.tjiaoxgai').css('display','block')
	})
	
})