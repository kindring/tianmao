


// 左侧导航和上导航显示和点击效果和监听滚动条
    function Show() {
        var Height = $(window).height();
        var Width = $(window).width();
        $('.leftNavTerminus').each(function(ind) {
            var Top = $(this).offset().top; //元素距离顶部距离
            var scroll = $(document).scrollTop(); //滚动高度
            // console.log(Top + '  ' + scroll);
            // console.log(ind)
        	if (scroll < 600){
            	$('.leftNavigation').fadeOut()
            }else if(scroll >= 600){
            	$('.leftNavigation').css('display','block')
            }
            if (scroll < 800){
            	$('#topNavigation').fadeOut()
            }else if(scroll >= 600){
            	$('#topNavigation').css('display','block')
            }
        	if(Top - scroll <= 61){
            	$('.leftSite').eq(ind).css('background-color','rgba(0,0,0)').siblings('.leftSite').css('background-color','rgba(0,0,0,.6)')
            }
        });
    }
// 左侧导航点击事件
    $('.leftSite').click(function(){
    	// 非兄弟元素获取序号
    	var c=$('.leftSite').index(this);
    	var Top = $('.leftNavTerminus').eq(c).offset().top;
    	$(document).scrollTop(Top - 60);
    })
    $('#returnTop').click(function(){
    	$(document).scrollTop(0)
    })
    // 实时监听浏览器的大小变化
    $(window).resize(function(){
    	var scroll = $(document).scrollTop();
    	var Width = $(window).width();
    	var Height = $(window).width();
    	// console.log(Width)
    	if (Width < 1422){
	    	$('.leftNavigation').fadeOut()
	    	$('.leftSite').css('background-color','rgba(0,0,0,.6)')
	    }else if(Width >= 1422 && scroll >= 600){
	    	$('.leftNavigation').css('display','block')
	    }
    })
    Show();
    $(function() {
        $(window).scroll(function() {
            Show();
        })
    })
// 店铺显示进入和名字
    $('.merchant-item').mouseenter(function(){
    	var c=$('.merchant-item').index(this);
    	$('.merchant-alink').eq(c).css('display','block');
    })
    $('.merchant-item').mouseleave(function(){
    	var c=$('.merchant-item').index(this);
    	$('.merchant-alink').eq(c).css('display','none');
    })
// 商品鼠标进入效果
    $('.rightShopCon').mouseenter(function(){
    	var c=$('.rightShopCon').index(this);
    	$('.rightShopCon').eq(c).css('border-color','red');
    	$('.rightShopImg').eq(c).css('opacity','0.7');
    })
    $('.rightShopCon').mouseleave(function(){
    	var c=$('.rightShopCon').index(this);
    	$('.rightShopCon').eq(c).css('border-color','white');
    	$('.rightShopImg').eq(c).css('opacity','1');
    })
// 左侧导航类总商品图片鼠标进入效果
	$('.leftNavPhoto').mouseenter(function(){
		var c=$('.leftNavPhoto').index(this);
		$('.leftNavPhoto').eq(c).css('opacity','0.7');
	})
	$('.leftNavPhoto').mouseleave(function(){
    	var c=$('.leftNavPhoto').index(this);
    	$('.leftNavPhoto').eq(c).css('opacity','1');
    })
// 获取左侧导航终点商品数据
	$(document).ready(function(){
		$.ajax({
	        url : '/user/leftShop', 
	        type : 'post',
	        success : function(data){
	        	var err_code = data.err_code
	        	var leftShopData = data.leftShopData
	        	if(err_code == 0){
	        		// console.log(leftShopData);
	        		var guojiarr =[];
	        		var mliarr = [];
	        		for (var i = 0;i < leftShopData.length;i++){
	        			if(leftShopData[i].type_id == 45){
	        				guojiarr.push(leftShopData[i])
	        				guojiShopText = document.getElementsByClassName('guojiShopText');
	        				for(var j = 0; j<guojiarr.length; j++){
	    						document.querySelectorAll('.guojiShopImg')[j].dataset.src = guojiarr[j].goods_photo;
	        					guojiShopText[j].innerText = guojiarr[j].goods_name;
	        					document.getElementsByClassName('guojiShopPrice')[j].innerText = '¥ '+guojiarr[j].price;
	    					}
	        			}else if(leftShopData[i].type_id == 43){
	        				mliarr.push(leftShopData[i])
	        				mliShopText = document.getElementsByClassName('mliShopText');
	        				for(var j = 0; j<mliarr.length; j++){
	    						document.querySelectorAll('.mliShopImg')[j].dataset.src = mliarr[j].goods_photo;
	        					mliShopText[j].innerText = mliarr[j].goods_name;
	        					document.getElementsByClassName('mliShopPrice')[j].innerText = '¥ '+mliarr[j].price;
	    					}
	        			}
	        		}
	        	}else if(err_code == 1){
	        		alert('我们的数据库管理员把商品删了跑路了!!!')
	        	}
	        }
	    })
	})
	

// 查询JS效果 
	function blinkit(){
		var ipt1=document.getElementsByClassName('ipt1')[0]
		var ipt11=document.getElementsByClassName('ipt1')[0].value
	    if(ipt11==''){
	    	intrvl=0;
		　  for(nTimes=0;nTimes<3;nTimes++){
		　  　  intrvl += 200;
		　  　  setTimeout(()=>{
					ipt1.style.backgroundColor="rgba(225, 210, 137, 0.65)"
				},intrvl);
		　  　  intrvl += 200;
		　  　  setTimeout(()=>{
					ipt1.style.backgroundColor="rgba(0,0,0,0)"
				},intrvl);
		　  }
	    	document.getElementById('lb1').innerHTML='请输入关键字'
	    }
	}
// 输入东西之后input背景变色
	function OnInput (event) {
	    document.getElementsByClassName('ipt1')[0].style.backgroundColor='white'
	    if(document.getElementsByClassName('ipt1')[0].value==''){
	    	document.getElementsByClassName('ipt1')[0].style.backgroundColor='rgba(0,0,0,0)'
	    }
	    // 判断值
	    // alert ("The new content: " + event.target.value);
	}
	// function OnPropChanged (event) {
		// 实时判断更新的值
	    // if (event.propertyName.toLowerCase() == "value") {
	    //     alert ("The new content: " + event.srcElement.value);
	    // }
	// }

	// function sub() {  
	//     // jquery 表单提交   
	//     $("#formId").ajaxSubmit(function(message) {   
	//     // 对于表单提交成功后处理，message为返回内容   
	//     });   
	//     return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转   
	// }   


// jq

// input点击label字体颜色变化
$(document).ready(function(){
    $('.ipt1').focus(function(){
		$('#lb1').css('color','#999999')
	});
	$('.ipt1').blur(function(){
		$('#lb1').css('color','#777777')
	});
});

// 
$(document).ready(function(){
	var c=0;
	$('.gcgul li,.gcg_show1').mouseover(function(){
        c = $(this).index();
        $('.gcg_show1').eq(c).css('display','block').siblings('.gcg_show1').css('display','none');
        $('.gcgul li').eq(c).css('background-color','black')
	})
	$('.gcgul li,.gcg_show1').mouseout(function(){
        c = $(this).index();
        $('.gcg_show1').eq(c).css('display','none');
        $('.gcgul li').eq(c).css('background-color','rgba(0,0,0,0)')
	})
})

// 轮播
$(document).ready(function(){
	var c=0;
	function autorun(){
        c++
        c = c==4?0:c
        $('.carousel_f').eq(c).addClass("carousel_f_1_item").siblings().removeClass('carousel_f_1_item') 
        $('.small_label li').eq(c).css('background-color','black').siblings().css('background-color','gray')
	}
	$('.small_label li').mouseenter(function(){
		c=$(this).index()
        $('.carousel_f').eq(c).addClass("carousel_f_1_item").siblings().removeClass('carousel_f_1_item')
        $('.small_label li').eq(c).css('background-color','black').siblings().css('background-color','gray')
	})
	var timer=setInterval(autorun(),5000)
	$('.carousel1').mouseover(function(){
		clearInterval(timer)
	})
    $('.carousel1').mouseout(function(){
		timer=setInterval(autorun,5000)
	})
})



// const imgs = document.querySelectorAll('img');
// let begin = 0;
// function lazyload(){
//     for (let index = begin; index < imgs.length; index++) {
//         const img = imgs[index];
//         if(img.offsetTop < document.documentElement.clientHeight + document.documentElement.scrollTop){
//             // console.log("scroll"+index+"到了")
//             begin = index; //不去遍历已经加载了得图片
//             console.log(img.dataset.src)
//             img.src = img.dataset.src
//         }
//         console.log(img.offsetTop)
//         console.log(document.documentElement.clientHeight)
//         console.log(document.documentElement.scrollTop)
//     }
// }
// lazyload() //渲染首屏，先执行一次
// window.onscroll = lazyload;



 















































console.log("%c \u5b89\u5168\u8b66\u544a\uff01","font-size:50px;color:red;-webkit-text-fill-color:red;-webkit-text-stroke: 1px black;")
console.log("%c \u6b64\u6d4f\u89c8\u5668\u529f\u80fd\u4e13\u4f9b\u5f00\u53d1\u8005\u4f7f\u7528\u3002\u8bf7\u4e0d\u8981\u5728\u6b64\u7c98\u8d34\u6267\u884c\u4efb\u4f55\u5185\u5bb9\uff0c\u8fd9\u53ef\u80fd\u4f1a\u5bfc\u81f4\u60a8\u7684\u8d26\u6237\u53d7\u5230\u653b\u51fb\uff0c\u7ed9\u60a8\u5e26\u6765\u635f\u5931 \uff01","font-size: 20px;color:#333")
console.log("   :::                                :::  \n :::::::                             ::::: \n:::::::::                          ::::::::\n:::::::::::::::::::::::::::::::::::::::::::\n::::    :::    ::::::::::::::::   :::  ::::\n:::    Smart    :::::cool::::    Crazy  :::\n:::::   :::    :::::::::::::::    :::   :::\n:::::::::::::::::::::::::::::::::::::::::::")


