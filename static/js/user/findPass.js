$(document).ready(function(){
    var phoneY = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    var emailY = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    var nameY = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
    function y1(){
        if($('#userName').val() == '' ){
            $('#pduanK').css('display','block'),$('#pduanB,#pduanC,#pduanY').css('display','none');
            return false
        }else{
            $('#pduanK,#pduanB,#pduanC,#pduanY').css('display','none')
            if(phoneY.test($('#userName').val()) || emailY.test($('#userName').val()) || nameY.test($('#userName').val())){
                
            }else{
                $('#pduanB').css('display','block'),$('#pduanK,#pduanC,#pduanY').css('display','none');
                return false
            }
        }
        return true
    }
    function sub(){
        $('#userName').bind('input propertychange',function(){
            y1()
        })
    }
    sub();
    $('#yanZUser').on('submit',function(e){
        if($('#pduan1').val() != 1){
            $('#pduanY').css('display','block'),$('#pduanB,#pduanC,#pduanK').css('display','none');
            return false
        }
        if (!y1()){
            e.preventDefault()//阻止默认事件
            return false
        }

        e.preventDefault()
        var formData=$(this).serialize()//获取表单内容
        $.ajax({
            url : '/user/yanZUser',
            type : 'post', 
            data : formData,   
            dataType: 'json',      
            success : function(data){
                var err_code = data.err_code;
                var userPhone = data.userPhone;
                var user_id = data.user_id;
                if(err_code == 0){
                    // alert('你')
                    window.location = '/user/resetPasswords?userPhone='+userPhone+'&user_id='+user_id;
                    $('#pduanC').css('display','none');
                }else if(err_code == 1){
                    $('#pduanC').css('display','block')
                }
          　}
        })
    })
})