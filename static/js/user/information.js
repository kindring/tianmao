$(document).ready(function(){
    function pduan(){
        if(identityShowpduan.innerText == 1){
            $('.safetyClassData').text('中')
            $('.safetyClassPhotoData').css('display','none')
            $('.safetyClassPhotoData1').css('display','block')
        }
        if(securityQuestionShowpduan.innerText == 1){
            $('.safetyClassData').text('中')
            $('.safetyClassPhotoData').css('display','none')
            $('.safetyClassPhotoData1').css('display','block')
        }
        if(identityShowpduan.innerText == 1 && securityQuestionShowpduan.innerText == 1){
            $('.safetyClassData').text('高')
            $('.safetyClassPhotoData,.safetyClassPhotoData1,.safetyClassImgR').css('display','none')
            $('.safetyClassPhotoData2,.safetyClassImgG').css('display','block')
        }
    }
    var identityShowpduan =document.getElementById('identityShowpduan')
    var securityQuestionShowpduan =document.getElementById('securityQuestionShowpduan')
	var userId = localStorage.getItem('userId');
	$.ajax({
        url : '/user/inquire',
        type : 'post', 
        data : {Id:userId},   
        dataType: 'json',      
        success : function(data){
            var err_code = data.err_code
            if(err_code == 0){
                $('#identityShowpduan').text('1')
                $('.identityAuthenticationText').text('已认证')
                $('.identityAuthenticationImgM').css('display','none')
                $('.identityAuthenticationImg').css('display','block')
                $('.identityAuthenticationAlink').text('查看')
                pduan()
            }else if(err_code == 1){
                
            }
      　}
    })
    $.ajax({
        url : '/user/inquiresecur',
        type : 'post',
        data : {Id:userId},  
        dataType: 'json',
        success : function(data){
            var err_code = data.err_code
            if(err_code == 0){
                $('#securityQuestionShowpduan').text('1')
                $('.securityQuestionText').text('已设置')
                $('.securityQuestionImgM').css('display','none')
                $('.securityQuestionImg').css('display','block')
                $('.securityQuestionAlink').text('查看')
                pduan()
            }else if(err_code == 1){
                
            }
      　}
    })
// $('#securityQuestionShowpduan').text('1')
})