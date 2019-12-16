

// 实名认证图标显示的判断
$(document).ready(function(){
    if($("#untitledY").val() == ''&&$("#landlordY").val() == ''){
    	$("#store-identity-verify-i2").css('display','block');
    	$("#store-identity-verify-i1").css('display','none');
    }else{
    	$("#store-identity-verify-i1").css('display','block');
    	$("#store-identity-verify-i2").css('display','none');
    }
     
    $("#show-change").click(function(){
    	$(".center-in-center").css('display','block')
    });
    $("#hide-change").click(function(){
    	$(".center-in-center").css('display','none')
    });
});

