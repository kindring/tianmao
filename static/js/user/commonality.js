// ajax获取用户数据
    $(document).ready(function(){
    	var userId = localStorage.getItem('userId');
		$.ajax({
	        url : '/user/userIfm', 
	        type : 'post',
	        data : {Id:userId},
	        dataType: 'json',  
	        success : function(data){  
	            var err_code = data.err_code
	            var userTotal = data.userTotal
	            if(err_code == 0){
	            	console.log(userTotal)
	            	var userName = userTotal.name
	            	var userEmail = userTotal.email
	            	var userPhone = userTotal.phone
	            	var userHead = userTotal.address
	            	$('#modificationPhoneipt').val(userPhone)
	            	$('#modificationPhoneipt1').val(userPhone)
					//1.判断该字符串里是否包含数字
					function getNum(text){
					    var value = text.replace(/[^0-9]/ig,""); 
					    return value;
					}
					//2.if包含数字，判断数据长度是否为11
					if(getNum(userEmail).length > 4){
					    //3.截取所有数字，并用*替换4，4
					    var phNum = getNum(userEmail),
					    phnumAfter = phNum.substr(0,3) + "****" + phNum.substr(7);
					}
					if(getNum(userPhone).length == 11){
						var phNum1 = getNum(userPhone),
					    phnumAfter1 = phNum1.substr(0,3) + "****" + phNum1.substr(7);
					}
					//4.替换输出
					var userEmail1 = userEmail.replace(phNum,phnumAfter);
					var userPhone1 = userPhone.replace(phNum1,phnumAfter1);
	            	if (userTotal.address !=''){

	            	}
	            	$('#userName').text(userName)
	            	$('.userInformationUser').text(userName)
	            	$('.userInformationEmail').text(userEmail1)
	            	$('.userInformationPhone').text(userPhone1)
	            	$('#user_id_identity').val(userId)
	            	$('#user_id').val(userId)
	            	$('#notLogin,#noLoginshop').css('display','none')
	            	$('.loginUser,#yesLoginshop').css('display','block')
	            }else if(err_code == 1){
	            	$('#notLogin,#noLoginshop').css('display','block')
	            	$('.loginUser,#yesLoginshop').css('display','none')
	            }
	      　}
	    });
	});
// 用户退出
	function tuichu(){
        localStorage.userId='';
        window.location='/user/login'
    }
    function gainUserShop(){
    	var userId = localStorage.getItem('userId');
	    $('.shoppingTrolleyUnit').css('display','none');
		$.ajax({
	        url : '/user/userShopping', 
	        type : 'post',
	        data : {Id:userId},
	        dataType: 'json',  
	        success : function(data){  
	            var err_code = data.err_code
	            var userShoppingTotal = data.userShoppingTotal
	            var shoppingL = data.shoppingL
	            if(err_code == 0){
	            	// console.log(userShoppingTotal)
	            	function addIfmOperation(){
	            		$('.shoppingTrolleyTitle').eq(i).text(userShoppingTotal[i].goods_name)
	            		$('.Del').eq(i).text('删除')
	            		$('.shoppingMoney').eq(i).text('¥'+userShoppingTotal[i].price)
		            	document.getElementsByClassName('Del')[i].href='#?user_id='+userId+'&goods_id='+userShoppingTotal[i].goods_id;
		            	document.getElementsByClassName('Del')[i].data=userId+','+userShoppingTotal[i].goods_id;
		            	document.querySelectorAll('.userShopPhoto')[i].dataset.src = '/static/imgs/user/index/TB1.jpg';
		            	document.getElementsByClassName('shoppingTrolleyUnit')[i].style.display='block';
	            	}
	            	if(userShoppingTotal.length >5){
	            		for (var i=0; i<5; i++){
		            		addIfmOperation();
		            		var numlength = userShoppingTotal.length - 5;
		            		$('.shoppingTrolleySurplus').css('display','block');
		            		$('.numValue').text(numlength);
		            	}
	            	}else if(userShoppingTotal.length <= 5){
	            		for (var i=0; i<userShoppingTotal.length; i++){
		            		addIfmOperation()
		            	}
	            	}
	            	$('#yesLoginshopNum').text(shoppingL)
	            	
	            }else if(err_code == 1){
	            	$('#yesLoginshopNum').text('0');
	            	$('.noshop').css('display','block');
	            	$('.recentlyAddBaby,.examineShoppingTrolley,shoppingTrolleySurplus').css('display','none');
	            }else if(err_code == 2){
	            	$('#yesLoginshopNum').text('');
	            	$('#notLogin,#noLoginshop').css('display','block')
	            	$('.loginUser,#yesLoginshop').css('display','none')
	            }
	      　}
	    })
    }
// 鼠标移入购物车获取购物车数据
    $(".shoppingTrolley").mouseenter(function(){
	    gainUserShop()
	});
	// 页面加载时获取一次
	gainUserShop();
// 删除小型购物车商品
    Del = document.getElementsByClassName('Del');
    for(var i = 0; i<Del.length; i++){
	    Del[i].index = i;
	    Del[i].onclick = function () {
	        var c = this.index;
	        var data1 = document.getElementsByClassName('Del')[c].data;
			var arr = data1.split(",");
			console.log(data1[0])
			$.ajax({
		        url : '/user/userShopDel',
		        type : 'post',
		        data : {user_id:arr[0],goods_id:arr[1]},
		        dataType: 'json',
		        success : function(data){
		        	var err_code = data.err_code
		        	if(err_code == 0){
		        		var F=$('#yesLoginshopNum').text();
		        		var F = F -1;
		        		$('#yesLoginshopNum').text(F);
		        		$('.shoppingTrolleyUnit').eq(c).fadeOut();
		        		if(F == 0){
		        			$('.noshop').css('display','block');
	            	    	$('.recentlyAddBaby,.examineShoppingTrolley,shoppingTrolleySurplus').css('display','none');
		        		}   
		        	}
			    }
			})
	    }
    }
// 图片懒加载
	function imgonload() {
	    let img = document.querySelectorAll("img");
	    /*console.log(img);*/
	    for(let i=0; i<img.length; i++) {
		    if(img[i].getBoundingClientRect().top < window.innerHeight) {
		        //图片一旦有src就会加载出来，所以图片的路径不会放在src中，而是一个自定义的属性data-src中
		        // console.log(img[i].dataset)
		        img[i].src = img[i].dataset.src;
		    }
	    }
	}

	function scollImg(fn) {
		let timer = null;
		let context = this;
		return function () {
			clearTimeout(timer);
			timer = setTimeout(() => {
			    fn.apply(context);
			}, 500)
		}
	}
	window.onload = imgonload();
	window.onscroll = scollImg(imgonload);
	$(".shopping_trolley").mouseenter(function(){
		imgonload();
	})