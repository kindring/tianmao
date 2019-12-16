// 头像显示
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imgInp").change(function(){
    readURL(this);
});

//jq 把数据库的时间类型改成 年月日
$(document).ready(function(){
    var register = $("#register-date-ipt-id").val()
    var dateee = new Date(register).toJSON();
    var date = new Date(+new Date(dateee)+8*3600*1000).toLocaleDateString()  
    if(register != ''){
        $("#register-date-id1").text(date)
    }
})