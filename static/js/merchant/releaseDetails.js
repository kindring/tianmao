// 头像显示
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function () {
    readURL(this);
});


//jq 把数据库的时间类型改成 年月日
$(document).ready(function () {
    var register = $("#register-date-ipt-id").val();
    var dateee = new Date(register).toJSON();
    var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toLocaleDateString()
    if (register != '') {
        $("#register-date-id1").text(date)
    }
});

// 元素高度大于192.8的属性
// 各个元素的初始高度
// nav-a1
var information_navigation1 = $("#information-navigation").offset().top;
var basic_information1 = $("#basic-information").offset().top;
var sales_message1 = $("#sales-message").offset().top;
var graphic_description1 = $("#graphic-description").offset().top;

var information_navigation_flag = true;
var basic_information_flag = true;
var sales_message_flag = true;
var graphic_description_flag = true;
// 副元素的自身高度
var basic_information_h = $("#basic-information").height();
var sales_message_h = $("#sales-message").height();
var graphic_description_h = $("#graphic-description").height();
console.log(basic_information_h);

$(window).scroll(function () {
    var topScroll = $(window).scrollTop()
    // console.log(basic_information1)
    // console.log(topScroll)
    if (topScroll - information_navigation1 >= 0) {
        if (information_navigation_flag) {
            $("#information-navigation").toggleClass("element-height-big")
            information_navigation_flag = false
        }
    } else if (topScroll - information_navigation1 < 0) {
        $("#information-navigation").removeClass("element-height-big")
        information_navigation_flag = true
    }

    if (topScroll - basic_information1 >= 0 && topScroll - basic_information1 < basic_information_h) {
        if (basic_information_flag) {
            $("#nav-a1").toggleClass("nav-a-add")
            basic_information_flag = false
        }
    } else if (topScroll - basic_information1 < 0) {
        $("#nav-a1").removeClass("nav-a-add")
        basic_information_flag = true
    } else if (topScroll - basic_information1 >= basic_information_h) {
        $("#nav-a1").removeClass("nav-a-add")
        basic_information_flag = true
    }

    if (topScroll - sales_message1 >= 0 && topScroll - sales_message1 <= sales_message_h) {
        if (sales_message_flag) {
            $("#nav-a2").toggleClass("nav-a-add")
            sales_message_flag = false
        }
    } else if (topScroll - sales_message1 <= 0) {
        $("#nav-a2").removeClass("nav-a-add")
        sales_message_flag = true
    } else if (topScroll - sales_message1 >= sales_message_h) {
        $("#nav-a2").removeClass("nav-a-add")
        sales_message_flag = true
    }

    if (topScroll - graphic_description1 >= 0 && topScroll - graphic_description1 < graphic_description_h) {
        if (graphic_description_flag) {
            $("#nav-a3").toggleClass("nav-a-add")
            graphic_description_flag = false
        }
    } else if (topScroll - graphic_description1 < 0) {
        $("#nav-a3").removeClass("nav-a-add")
        graphic_description_flag = true
    } else if (topScroll - graphic_description1 > graphic_description_h) {
        $("#nav-a3").removeClass("nav-a-add")
        graphic_description_flag = true
    }
});


window.onload = function () {
    var input = document.getElementById("file_input");
    var result;
    var dataArr = []; // 储存所选图片的结果(文件名和base64数据)  
    var fd;  //FormData方式发送请求    
    var oSelect = document.getElementById("select");
    var oAdd = document.getElementById("add");
    var oSubmit = document.getElementById("submit");
    var oInput = document.getElementById("file_input");

    if (typeof FileReader === 'undefined') {
        alert("抱歉，你的浏览器不支持 FileReader");
        input.setAttribute('disabled', 'disabled');
    } else {
        // input.addEventListener('change', readFile, false);
    }　　　　　//handler    


    function readFile() {
        fd = new FormData();
        var iLen = this.files.length;
        for (var i = 0; i < iLen; i++) {
            if (!input['value'].match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {　　//判断上传文件格式
                return alert("上传的图片格式不正确，请重新选择");
            }
            var reader = new FileReader();
            fd.append(i, this.files[i]);
            reader.readAsDataURL(this.files[i]);  //转成base64    
            reader.fileName = this.files[i].name;

            reader.onload = function (e) {
                var imgMsg = {
                    name: this.fileName,//获取文件名
                    base64: this.result   //reader.readAsDataURL方法执行完后，base64数据储存在reader.result里
                };
                dataArr.push(imgMsg);
                result = '<div class="delete">delete</div><div class="result"><img class="subPic" src="' + this.result + '" alt="' + this.fileName + '"/></div>';
                var div = document.createElement('div');
                div.innerHTML = result;
                div['className'] = 'float';
                document.getElementById('computer_boby_data').appendChild(div); //插入dom树    
                // document.getElementsByTagName('body')[0].appendChild(div);  　　//插入dom树    
                var img = div.getElementsByTagName('img')[0];
                img.onload = function () {
                    var nowHeight = ReSizePic(this); //设置图片大小    
                    this.parentNode.style.display = 'block';
                    var oParent = this.parentNode;
                    if (nowHeight) {
                        oParent.style.paddingTop = (oParent.offsetHeight - nowHeight) / 2 + 'px';
                    }
                };
                div.onclick = function () {
                    $(this).remove();                  // 在页面中删除该图片元素  
                }
            }
        }
    }


    // function send(){   
    //     var submitArr = [];  
    //     $('.subPic').each(function () {
    //             submitArr.push({
    //                 name: $(this).attr('alt'),
    //                 base64: $(this).attr('src')
    //             });  
    //         }
    //     );
    //     $.ajax({    
    //         url : 'http://123.206.89.242:9999',    
    //         type : 'post', 
    //         data : JSON.stringify(submitArr),    
    //         dataType: 'json',    
    //         //processData: false,   用FormData传fd时需有这两项    
    //         //contentType: false,    
    //         success : function(data){    
    //             console.log('返回的数据：'+JSON.stringify(data))    
    //       　}
    //     })    
    // }
    var money = /^[1-9][0-9]*$/

    // var sum =
    function t1() {
        if ($("#goods_name").val() === '') {
            $('#goods_name1').css('display', 'block');
            return false
        } else {
            $('#goods_name1').css('display', 'none');
            // return true
        }

        if ($("#price").val() === '') {
            $('#price1').css('display', 'block'), $('#price2').css('display', 'none')
            return false
        } else {
            $('#price1').css('display', 'none'), $('#price2').css('display', 'none')
            if (money.test($("#price").val())) {
                // return true
            } else {
                $('#price2').css('display', 'block')
                return false
            }
        }

        if ($("#stock").val() === '') {
            $('#stock1').css('display', 'block'), $('#stock2').css('display', 'none')
            return false
        } else {
            $('#stock1').css('display', 'none'), $('#stock2').css('display', 'none')
            if (money.test($("#stock").val())) {
                // return true
            } else {
                $('#stock2').css('display', 'block')
                return false
            }
        }
        if (dataArr.length < 5) {
            // alert('请选择5张图片')
            $('#file_input2').css('display', 'block')
            return false
        } else {
            $('#file_input2').css('display', 'none')
        }
        return true

    }

    // function t2(){

    // }
    // function t3(){

    // }
    function sub() {
        $("#goods_name").bind("input propertychange", function () {
            t1()
        });
        $("#price").bind("input propertychange", function () {
            t1()
        });
        $("#stock").bind("input propertychange", function () {
            t1()
        });

    }

    sub()
    $("#add_form").on('submit', function (e) {

        if (!t1()) {
            e.preventDefault()//阻止默认事件
            return false

        }

        var formData = $(this).serialize()//获取表单内容
        // var formData = new FormData(document.getElementById('d1'));
        $.ajax({
            url: '/merchant/releaseDetails',
            type: 'post',
            data: formData,
            // data : JSON.stringify(submitArr),    
            dataType: 'json',
            contentType: false,
            // data:inpData,// 打成的数据包可以直接通过send发送
            processData: false,
            //processData: false,   用FormData传fd时需有这两项    
            //contentType: false,    
            success: function (data) {
                console.log('返回的数据：' + JSON.stringify(data))
            }
        })
    })


    // oSelect.οnclick=function(){   
    //     oInput.value = "";   // 先将oInput值清空，否则选择图片与上次相同时change事件不会触发  
    //     //清空已选图片  
    //     $('.float').remove();        
    //     oInput.click();   
    // }   


    // oAdd.οnclick=function(){  
    //     oInput.value = "";   // 先将oInput值清空，否则选择图片与上次相同时change事件不会触发  
    //     oInput.click();   
    // }   


    // oSubmit.οnclick=function(){    
    //     if(!dataArr.length){    
    //         return alert('请先选择文件');    
    // }    
    //     send();    
    // }    
}

/*    
 用ajax发送fd参数时要告诉jQuery不要去处理发送的数据，    
 不要去设置Content-Type请求头才可以发送成功，否则会报“Illegal invocation”的错误，    
 也就是非法调用，所以要加上“processData: false,contentType: false,”    
 * */


function ReSizePic(ThisPic) {
    var RePicWidth = 200; //这里修改为您想显示的宽度值    

    var TrueWidth = ThisPic.width; //图片实际宽度    
    var TrueHeight = ThisPic.height; //图片实际高度    

    if (TrueWidth > TrueHeight) {
        //宽大于高    
        var reWidth = RePicWidth;
        ThisPic.width = reWidth;
        //垂直居中    
        var nowHeight = TrueHeight * (reWidth / TrueWidth);
        return nowHeight;  //将图片修改后的高度返回，供垂直居中用    
    } else {
        //宽小于高    
        var reHeight = RePicWidth;
        ThisPic.height = reHeight;
    }
}    
