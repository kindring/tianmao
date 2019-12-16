$(document).ready(function(){
	var userId = localStorage.getItem('userId');
	if(userId == ''){
		window.location = '/user/login';
	}
	// 验证用户输入
	var password = /^[A-Za-z0-9]+$/;
	function y1(){
		if($('#formerPassword').val() == ''){
			$('#formerK').css('display','block'),$('#formerB').css('display','none')
			return false
		}
		if($('#newPassword').val() == ''){
			$('#newK').css('display','block'),$('#newB,#newD').css('display','none')
			return false
		}else{
			$('#newK,#newB,#newD').css('display','none')
			if(password.test($('#newPassword').val())){
				if($('#newPassword').val().length > 6){

				}else{
					$('#newD').css('display','block'),$('#newK,#newB').css('display','none')
					return false
				}
			}else{
				$('#newB').css('display','block'),$('#newK,#newD').css('display','none')
				return false
			}
		}
		return true
	}
	function sub(){
		$('#formerPassword').bind('input propertychange',function(){
			y1();
		})
		$('#newPassword').bind('input propertychange',function(){
			y1();
		})
	}
	// form表单提交
	$('#passwordForm').on('submit',function(e){
		if (!y1()){
            e.preventDefault();
            return false
        }
        e.preventDefault();
        var formData=$(this).serialize();//获取表单内容
        $.ajax({
            url : '/user/modificationPassword',
            type : 'post',
            data : formData,
            dataType: 'json',
            success : function(data){
                var err_code=data.err_code
                if(err_code == 0){
                    alert('修改成功')
                    window.location = '/user/login'
                }else if(err_code == 1){
                	alert('你未提交数据')
                }else if(err_code == 2){
                	alert('不存在用户正在操作')
                	window.location = '/user/login'
                }else if(err_code == 3){
                	$('#formerB').css('display','block')
                }
          　}
        })
	})
})