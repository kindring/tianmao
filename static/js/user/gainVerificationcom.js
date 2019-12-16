	var huoqu = document.getElementById('huoqu');
	var forbid = document.getElementById('forbid');
	var judgeCondition1 = document.getElementById('judgeCondition1');
	// 判断状态
	function judgeCondition(){
		if(judgeCondition1.innerText == 1){
			return false;
		}else{
			return true;
		}
	}
	function limit(){
		if (!judgeCondition()){
		    alert('60s的时间并没有过去!')
		    return false
		}
		judgeCondition1.innerText = 1;
		var d = document.createAttribute('disabled','true');
	    huoqu.setAttributeNode(d);
	    timeReset();
	    timeOne();
	    styleAlter();
	}
	var oneMinute = 59;
	// 时间重置
	function timeReset(){
		setTimeout('timeResetData()',61000)
	}
	function timeResetData(){
		return oneMinute = 59;
	}
	// 一分钟过完的判断
	function judgetime(){
		var t = setTimeout("timeOne()",1000)
		if (oneMinute == -1){
			clearTimeout(t);
			stylecomeBack();
			judgeCondition1.innerText = 0;
		}
	}
	// 数字的变化
	function timeOne(){
		huoqu.innerText = oneMinute+'s';
		oneMinute--;
		judgetime();
	}
	// 样式的改变
	function styleAlter(){
		forbid.style.display = 'block';
		huoqu.style.background = 'gray';
	}
	// 样式变回
	function stylecomeBack(){
		forbid.style.display = 'none';
		huoqu.style.background = '#ff0033';
		huoqu.innerText = '获取验证码';
		huoqu.removeAttribute('disabled');
	}

	var shuzi = /^[0-9]*$/;
	// input的监听
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
// 获取验证码
	$("#phoneVer").on('submit',function(e){
		$('.verificationIpt').css('display','block')
		$('#verification').css('display','block')
		if (!judgeCondition()){
		    alert('60s的时间并没有过去!')
		    e.preventDefault();
		    return false
		}
		limit();
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