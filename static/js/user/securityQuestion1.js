$(document).ready(function(){
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
	$('#amendform').on('submit',function(e){
		if (!y1()){
			e.preventDefault()//阻止默认事件
	        return false
	    }
	    e.preventDefault()
	    var formData=$(this).serialize()//获取表单内容
		$.ajax({
			url: '/user/amendform',
			type : 'post', 
			data: formData,
			dataType: 'json',      
	        success : function(data){
	        	console.log(data)
	            var err_code = data.err_code
	            if(err_code == 0){
	                window.location = '/user/securityQuestion'
	            }else if(err_code == 1){
	                
	            }
	      　}
		})
	})
})
	