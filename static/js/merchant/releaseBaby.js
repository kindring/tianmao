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
    var register = $("#register-date-ipt-id").val();
    var dateee = new Date(register).toJSON();
    var date = new Date(+new Date(dateee)+8*3600*1000).toLocaleDateString();
    if(register != ''){
        $("#register-date-id1").text(date)
    }
});

// 列表数据
$(document).ready(function(){
    $("#estimate-data").click(function(){
    })
});

    var categor_data = document.getElementById('categor_data'); 
    var obj = eval(categor_data.value);//获取到的分类数据?
    var dataJson  ={"option" : obj};
    var l1 = 0,
        l2 = 0;
    var cname1, cname2, cname3;
    var cid1, cid2, cid3;
    var canClick = !0;
    var canClose = !1;
    $('.select-box').css({
        left: $('.select-res').offset().left,
        top: $('.select-res').offset().top + $('.select-res').outerHeight(true)
    });
    $('span', $('.select-res')).on('click', function() {
        alert("test");
        $('.select-box').show();
        if (canClick) {
            $('ul', $('.select-box')).html('');
            fillData();
            canClick = !1;
        }
    });//显示可选框
    $('span', $('.select-box')).on("click", function() {
        canClose ? $('.select-box').hide() : alert('请选择下级品类！');
        canClick = !0;
    });

    $('.select-res').on('click', 'a', function() {
       alert("断点");
        $(this).parent().remove();
        $('.select-box').css({
            top: $('.select-res').offset().top + $('.select-res').outerHeight(true)
        });
    });//清除自身

    $('ul.first', $('.select-box')).on('click', 'li', function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        $('ul.third').html('');
        fillData($(this).index());
        l1 = $(this).index();
        cname1 = $(this).text();
        cid1 = $(this).attr('val');
        canClose = !1;
        $('input.cid', $('.select-res')).val(cid1);
        $('input.cname', $('.select-res')).val(cname1);
    });
    $('ul.second', $('.select-box')).on('click', 'li', function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        fillData(l1, $(this).index());
        l2 = $(this).index();
        cname2 = $(this).text();
        cid2 = $(this).attr('val');
        canClose = !1;
        $('input.cid', $('.select-res')).val(cid1 + ',' + cid2);
        $('input.cname', $('.select-res')).val(cname1 + ',' + cname2);
    });
    $('ul.third', $('.select-box')).on('click', 'li', function() {
        $(this).addClass('selected').siblings().removeClass('selected');
        cname3 = $(this).text();
        cid3 = $(this).attr('val');
        canClose = !0;
        var hasExist = !1;
        $('.select-res').find("p").each(function() {
            if ($(this).text().split(' > ')[2] == cname3) hasExist = !0;
        });
        hasExist ? alert('所选品类已被添加！') : $('.select-res').append('<p>' + cname1 + ' > ' + cname2 + ' > ' + cname3 + '<a></a><input type="hidden" value="' + cid1 + ',' + cid2 + ',' + cid3 + '" name="cid[]" /><input type="hidden" value="' + cname1 + ',' + cname2 + ',' + cname3 + '" name="cname[]" /></p>');
        $('.select-box').css({
            top: $('.select-res').offset().top + $('.select-res').outerHeight(true)
        });
        $('input.cid', $('.select-res')).val(cid1 + ',' + cid2 + ',' + cid3);
        $('input.cname', $('.select-res')).val(cname1 + ',' + cname2 + ',' + cname3);
        // console.log($('input.cid'),$('.select-res').val())
        console.log(cid1)
        if(cid1 && cid2 && cid3 != ''){
            $('#catename1').attr('value',cname1)
            $('#catename2').attr('value',cname2)
            $('#catename3').attr('value',cname3)
            $('#cateid1').attr('value',cid1)
            $('#cateid2').attr('value',cid2)
            $('#cateid3').attr('value',cid3)
        }

    });

    //渲染列表数据
    function fillData(l1, l2) {
        var temp_html = "";
        if (typeof(dataJson.option) != 'undefined' && arguments.length == 0) {
            $.each(dataJson.option, function(i, pro) {
                temp_html += '<li val="' + pro.id + '">' + pro.name + '</li>';
            });
        } else if (typeof(dataJson.option[l1].node_catergory) != 'undefined' && arguments.length == 1) {
            $.each(dataJson.option[l1].node_catergory, function(i, pro) {
                temp_html += '<li val="' + pro.id + '">' + pro.name + '</li>';
            });
        } else if (typeof(dataJson.option[l1].node_catergory[l2].node_catergory) != 'undefined' && arguments.length == 2) {
            $.each(dataJson.option[l1].node_catergory[l2].node_catergory, function(i, pro) {
                temp_html += '<li val="' + pro.id + '">' + pro.name + '</li>';
            });
        }
        $('.select-box ul:eq(' + arguments.length + ')').html(temp_html);
    }



