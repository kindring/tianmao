// 公共变量
var carAllcheckbox = document.getElementsByName("carAllcheckbox");
var merchantAllcheckbox = document.getElementsByName("merchantAllcheckbox");
var shoppingcheckbox = document.getElementsByName("shoppingcheckbox");
var shoppingMerchantAll = document.getElementsByClassName("shoppingMerchantAll");
var allshop = document.getElementById('Allshop');
var jiaojshop = document.getElementById('Jiaojshop');
var kucjinz = document.getElementById('Kucjinz');
// 公共变量-计算
var shoppingMoneyjis = document.getElementsByClassName('shoppingMoneyjis');
var unitPricePduan = document.getElementsByClassName('unitPricePduan');
var shoppingAmount = document.getElementsByClassName('shoppingAmount');
var nethermostAllMoneySpan =document.getElementsByClassName('nethermostAllMoneySpan');
var num = document.getElementsByClassName('num');
var allShoppingNum = document.getElementById('allShoppingNum');
// 数量加减计算

// 判断是否降价-公共变量
var unitPriceAdd = document.getElementsByClassName('unitPriceAdd');
var shoppingUnitPrice = document.getElementsByClassName('shoppingUnitPrice');

// 判断是否显示
var specificationData = document.getElementsByClassName('specificationData');
var specificationData1 = document.getElementsByClassName('specificationData1');
var shoppingSpecificationSon = document.getElementsByClassName('shoppingSpecificationSon');
var shoppinginformationAll = document.getElementsByClassName('shoppinginformationAll');
var specificationDataCls = document.getElementsByClassName('specificationDataCls');
var specificationDataCls1 = document.getElementsByClassName('specificationDataCls1');
var shoppingSpecification = document.getElementsByClassName('shoppingSpecification');

// 改变库存
	function gainkucu(user_id,goods_id,shop_id,num){
		$.ajax({
			url : '/user/gainxiaoxiaoshul',
	        type : 'post',
	        data : {user_id:user_id,goods_id:goods_id,shop_id:shop_id,num:num},
	        dataType: 'json',
	        success : function(data){
	        	err_code = data.err_code
	        	if(err_code == 0){

	        	}else if(err_code == 2){
	        		window.location='/user/login'
	        	}
	        }
		})
	}

// 全选计算处理
	function qxuanjis(){
		var zong = 0;
		for(var i = 0;i < shoppingMoneyjis.length;i++){
			// 价格
			var n=unitPricePduan[i].innerHTML;
			// 数量
			var m=num[i].value;
			zong +=n*m;
		}
		nethermostAllMoneySpan[0].innerHTML = zong;
		// allShoppingNum.innerHTML = shoppingMoneyjis.length;
	}
// 商品数量处理
	function shopnum(){
		var num = 0;
		for(var i = 0; i<shoppingMoneyjis.length; i++){
			if(shoppingcheckbox[i].checked == true){
				num++;
			}
		}
		allShoppingNum.innerHTML = num;
	}
// 计算处理
	function danxuanAdd(){
		var zong = 0;
		for(var i = 0; i<shoppingMoneyjis.length; i++){
			if(shoppingcheckbox[i].checked == true){
				zong += parseInt(shoppingMoneyjis[i].innerHTML);
			}
		}
		nethermostAllMoneySpan[0].innerHTML = zong;
	}

// 数量加减计算
	function numAdd(t,user_id,goods_id,shop_id){
		var n = num[t].value;
		n++;
		num[t].value = n;
		var m = unitPricePduan[t].innerHTML;
		var zong3 = n*m;
		shoppingMoneyjis[t].innerHTML = zong3;
		if(shoppingcheckbox[t].checked == true){
			var zong2 = nethermostAllMoneySpan[0].innerHTML;
			var zong = parseFloat(zong2)+parseFloat(m);
			nethermostAllMoneySpan[0].innerHTML = zong;
		}
		gainkucu(user_id,goods_id,shop_id,n);
		
	}
	function numJian(t,user_id,goods_id,shop_id){
		var n = num[t].value;
		n--;
		if (n < 1){
			num[t].value = 1;
			return;
		}
		num[t].value = n;
		var m = unitPricePduan[t].innerHTML;
		var zong3 = n*m;
		shoppingMoneyjis[t].innerHTML = zong3;
		if (shoppingcheckbox[t].checked == true){
			var zong2 = nethermostAllMoneySpan[0].innerHTML;
			var zong = parseFloat(zong2)-parseFloat(m);
			nethermostAllMoneySpan[0].innerHTML = zong;
		}
		gainkucu(user_id,goods_id,shop_id,n);
	}
// input数量框改变计算
	var numzhengz = /^[0-9]*$/;
	function numIptPduan(t,user_id,goods_id,shop_id){
		var n1 = num[t].value;
		if (!numzhengz.test(num[t].value)){
			num[t].value = 1;
		}
		var n = num[t].value;
		if (n == '' || n < 1){
			num[t].value = 1;
		}
		n = num[t].value;
		var m = unitPricePduan[t].innerHTML;
		var zong3 = n*m;
		shoppingMoneyjis[t].innerHTML = zong3;
		gainkucu(user_id,goods_id,shop_id,n);
	}
// 全选处理
	function carAll(s){
		var length = merchantAllcheckbox.length;
		var length1 = shoppingcheckbox.length;
		if(s == 0){
			if(carAllcheckbox[0].checked == false){
				carAllcheckbox[1].checked = false;
				nethermostAllMoneySpan[0].innerHTML = 0.00;
			}else if(carAllcheckbox[0].checked == true){
				carAllcheckbox[1].checked = true;
				qxuanjis();
			}
		}else if(s == 1){
			if(carAllcheckbox[1].checked == false){
				carAllcheckbox[0].checked = false;
				nethermostAllMoneySpan[0].innerHTML = 0.00;
			}else if(carAllcheckbox[1].checked == true){
				carAllcheckbox[0].checked = true;
				qxuanjis();
			}
		}
		if(carAllcheckbox[0].checked == true && carAllcheckbox[1].checked == true){
	        for(var i = 0; i < length; i++){
	            merchantAllcheckbox[i].checked = true;
	        }
	        for(var i = 0; i < length1; i++){
	            shoppingcheckbox[i].checked = true;
	        }
	    }else{
	        //未选中处理
	        for(var i = 0; i < length; i++){
	            merchantAllcheckbox[i].checked = false;
	        }
	        for(var i = 0; i < length1; i++){
	            shoppingcheckbox[i].checked = false;
	        }
	    }
	    shopnum();
	}
// 店铺全选处理
	function merchantAll(t){
		var merchantlength = shoppingMerchantAll.length;
		var ipt=shoppingMerchantAll[t].querySelectorAll("input[type='checkbox']");
		var merchantFlag = 0;
		if(merchantAllcheckbox[t].checked == true){
			for(var j=0;j<ipt.length;j++){
				ipt[j].checked = true;
			}
		}else{
			for(var j=0;j<ipt.length;j++){
				ipt[j].checked = false;
			}
		}
		// 店铺全选改变超级全选
		for(var i=0;i<merchantlength;i++){
			if(merchantAllcheckbox[i].checked == true){
				merchantFlag++;
			}
		}
		if(merchantlength == merchantFlag){
			carAllcheckbox[0].checked = true;
			carAllcheckbox[1].checked = true;
		}else{
			carAllcheckbox[0].checked = false;
			carAllcheckbox[1].checked = false;
		}
		// 算法
		danxuanAdd();
		shopnum();
	}
// 商品选择处理
	function shopping(i,t,xulie){
		var merchantlength = shoppingcheckbox.length;
		var ipt=shoppingMerchantAll[i].querySelectorAll("input[type='checkbox']");
		var flaglength = ipt.length;
		var flag=0;
		// 商品选择改变店铺全选
		for(var j=0;j<flaglength;j++){
			if(ipt[j].checked == true){
				flag++;
			}
			if(flaglength == flag){
				merchantAllcheckbox[i].checked = true;
			}else{
				merchantAllcheckbox[i].checked = false;
			}
			
		}
		// 商品选择改变超级全选
		var merchantFlag = 0;
		for(var g=0;g<merchantlength;g++){
			if(shoppingcheckbox[g].checked == true){
				merchantFlag++;
			}
		}
		if(merchantlength == merchantFlag){
			carAllcheckbox[0].checked = true;
			carAllcheckbox[1].checked = true;
		}else{
			carAllcheckbox[0].checked = false;
			carAllcheckbox[1].checked = false;
		}
		// 算法
		danxuanAdd();
		shopnum();
	}
// 获取购物车
	var userId = localStorage.getItem('userId');
	var shoppingCarinformationAll = document.getElementById('shoppingCarinformationAll');
	var shoppingMerchantAll = document.getElementsByClassName('shoppingMerchantAll');
	$.ajax({
		url : '/user/shoppingCarGain',
        type : 'post',
        data : {Id:userId},
        dataType: 'json',  
        success : function(data){
        	var err_code = data.err_code;
        	if(err_code == 0){
        		var shoppingAll2 = data.shoppingAll;
        		var shoppingAll = [];
        		// console.log(JSON.parse(shoppingAll2[1].sp));
        		for (var i = 0;i < shoppingAll2.length; i++){
        			if(shoppingAll2[i].goods_sku == shoppingAll2[i].sku_id){
        				shoppingAll.push(shoppingAll2[i])
        			}
        		}

        		// var shoppingAll = data.shoppingAll;
        		var merchant = [];
        		var merchantName = []; 
        		for(var m = 0;m < shoppingAll.length; m++){
        			merchant.push(shoppingAll[m].shop_id);
        			merchantName.push(shoppingAll[m].shop_name);
        		}
        		// 店铺去重
        		var merchants = []; // 店铺的个数
				var merchantLength = merchant.length;
				for(var i = 0; i < merchantLength; i++){
					if(merchants.indexOf(merchant[i]) < 0){//第一次检索到的元素是 -1，重复的元素是大于0的
						merchants.push(merchant[i]);//将这个元素加入到数组arrs中
					}
				}
				// 店铺名字,和重复的次数
				// 把不重复的店铺放入数组
				var newArr = [];
                for(var i = 0; i < merchantName.length; i++) {
                    if(newArr.indexOf(merchantName[i]) == -1) {
                        newArr.push(merchantName[i])
                    }
                }
                // 定义一个新数组,长度等于不重复的数组的长度
                var newarr2 = new Array(newArr.length);
                for(var t = 0; t < newarr2.length; t++) {
                    newarr2[t] = 0;
                }
                // 重复时加次数
                for(var p = 0; p < newArr.length; p++) {
                    for(var j = 0; j < merchantName.length; j++) {
                        if(newArr[p] == merchantName[j]) {
                            newarr2[p]++;
                        }
                    }

                }
                // 把重复的值和名字,放到一个数组中去
                var _res = [];
                for(var m = 0; m < newArr.length; m++) {
                    _res.push([newArr[m],newarr2[m]])
                }
				// 根据店铺名字进行分类
				var w = {};
				var norms = [];
				for (var i = 0;i < merchants.length; i++){
					eval("var l" + i +"= []");
					eval("var n" + i +"= []");
					for(var j = 0;j < shoppingAll.length; j++){
						if(shoppingAll[j].shop_name == _res[i][0]){
							eval("l"+i).push(shoppingAll[j]);
							eval("n"+i).push(JSON.parse(shoppingAll[j].sp));
						}
					}
					w[i] = eval("l"+i);
					norms[i] = eval("n"+i);
				}
				console.log(norms);
				console.log(JSON.parse(norms[0][0]));
				var v1 = JSON.parse(norms[0][0]);
				console.log(v1[0].key);
				var html ='';
				var html6 = [];
				var xulie = 0;
				var n = {};
				for(var s = 0;s < _res.length; s++){
					html +='<div class="shoppingCarinformation">'+
					    			'<div class="shoppingMerchant">'+
					    				'<div>'+
					    					'<input type="checkbox" name="merchantAllcheckbox" onclick="merchantAll('+s+')">'+
					    				'</div>'+
					    				'<div>'+
					    					'<img style="padding-top: 10px;" data-src="/static/imgs/user/tm2.jpg" src="/static/imgs/user/tm2.jpg" width="20" height="20">'+
					    				'</div>'+
					    				'<div>'+
					    					'<span>店铺:</span>'+
					    					'<span class="merchantName">&nbsp;'+_res[s][0]+'</span>'+
					    				'</div>'+
					    				'<div>'+
					    					'<img style="padding-top: 10px;" data-src="/static/imgs/user/shoppingCar/wangwang.png" src="/static/imgs/user/shoppingCar/wangwang.png" width="22" height="22" >'+
					    				'</div>'+
					    			'</div>'+
					    			'<div class="shoppingMerchantAll">'+
					    			'</div>'+
					    		'</div>'+
					    	'</div>';
					html6[s] = '';
					for(var g = 0;g < _res[s][1]; g++){
						eval("var n" + s + g +"= []");
						eval("n"+s+g).push(JSON.parse(norms[s][g]));
						console.log(eval("n"+s+g))
						html6[s] += '<div class="shoppinginformationAll">'+
				    					'<div class="shoppingann">'+
				    						'<input type="checkbox" name="shoppingcheckbox" onclick="shopping('+s+','+g+','+xulie+')">'+
				    					'</div>'+
				    					'<div class="shoppingPhoto">'+
				    						'<img data-src="/static/imgs/user/index/TB1.jpg" src="/static/imgs/user/index/TB1.jpg" width="80" height="80">'+
				    					'</div>'+
				    					'<div class="shoppingTitle">'+
				    						'<a href="#">'+w[s][g].goods_name+'</a>'+
				    					'</div>'+
				    					'<div class="shoppingSpecification">'+
				    						'<div class="shoppingSpecificationSon">'+
							    				'<div style="width: 200px;height: 20px;">'+
							    					'<span class="specificationXgai" onclick="gainSpecification('+w[s][g].goods_id+')">修改</span>'+
							    				'</div>'+
							    				'<div class="specificationDataCls">'+
							    					'<span>'+eval("n"+s+g)[0][0].key+'</span>&nbsp;&nbsp;'+
							    					'<span class="specificationData">'+eval("n"+s+g)[0][0].value+'</span>'+
							    				'</div>'+
							    				'<div class="specificationDataCls1">'+
							    					'<span>'+eval("n"+s+g)[0][1].key+'</span>&nbsp;&nbsp;'+
							    					'<span class="specificationData1">'+eval("n"+s+g)[0][1].value+'</span>'+
							    				'</div>'+
							    			'</div>'+
				    					'</div>'+
				    					'<div class="shoppingUnitPrice">¥'+
				    						'<span class="unitPriceAdd">'+w[s][g].add_price+'</span>'+
	    									'<span class="unitPricePduan">'+w[s][g].price+'</span>'+
	    								'</div>'+
				    					'<div class="shoppingAmount">'+
				    						'<div class="m-num fl">'+
												'<span class="jian" onclick="numJian('+xulie+','+w[s][g].user_id+','+w[s][g].goods_id+','+w[s][g].shop_id+')">-</span>'+	
												'<input type="text" value="'+w[s][g].num+'" class="num" oninput="numIptPduan('+xulie+','+w[s][g].user_id+','+w[s][g].goods_id+','+w[s][g].shop_id+')" />'+
												'<span class="add" onclick="numAdd('+xulie+','+w[s][g].user_id+','+w[s][g].goods_id+','+w[s][g].shop_id+')">+</span>'+
											'</div>'+
				    					'</div>'+
				    					'<div class="shoppingMoney1">¥<span class="shoppingMoneyjis"></span></div>'+
				    					'<div class="shoppingOperation">'+
				    						'<div class="moveToFavorites"><a href="#">移入收藏夹</a></div>'+
				    						'<div class="delshop"><a href="#">删除</a></div>'+
				    					'</div>'+
				    				'</div>';
				    	xulie++;
					}
					
				}
				shoppingCarinformationAll.innerHTML = html;
				for(var p = 0;p < _res.length;p++){
					shoppingMerchantAll[p].innerHTML = html6[p];
				}
				// 计算价格
				for(var i = 0;i < shoppingMoneyjis.length;i++){
					// 价格
					var n=unitPricePduan[i].innerHTML;
					// 数量
					var m=num[i].value;
					var zong=n*m;
					shoppingMoneyjis[i].innerHTML = zong;
				}
				// 判断是否降价
				var jiaojnum = 0;
				for(var i = 0;i < shoppingUnitPrice.length;i++){
					// 现有价格
					var n=unitPricePduan[i].innerHTML;
					// 加入价格
					var a=unitPriceAdd[i].innerHTML;
					var pduan=a-n;
					if(pduan > 0){
						var htmlJ = '<div class="depreciateShop">¥<span class="unitPricePduan">'+n+'</span><span class="unitPriceAdd">'+a+'</span></div>'+
		    						'<div class="depreciateMerchant">'+
		    							'<span>卖家降价</span>'+
		    						'</div>'+
		    						'<div class="depreciateExplain">'+
		    							'<div>优惠:&nbsp;&nbsp;¥<span>'+pduan+'</span></div>'+
		    							'<div>比加入购物车时,又优惠了</div>'+
		    							'<div>¥<span>'+pduan+'</span></div>'+
		    						'</div>';
						shoppingUnitPrice[i].innerHTML = htmlJ;
						jiaojnum++;
					}
				}
				allshop.innerHTML = shoppingAll.length;
				jiaojshop.innerHTML = jiaojnum;
				// 判断规格是否需要显示
			  	for(var i=0;i<shoppinginformationAll.length;i++){
			  		console.log(specificationData[i])
			  		var t =  specificationData[i].innerHTML;
			  		console.log(t);
			  		if(specificationData[i].innerHTML == ''){
			  			specificationDataCls[i].style.display = 'none';
			  		}
			  		if(specificationData1[i].innerHTML == ''){
			  			specificationDataCls1[i].style.display = 'none';
			  		}
			  		if(specificationData[i].innerHTML == '' && specificationData1[i].innerHTML == ''){
			  			shoppingSpecificationSon[i].style.display = 'none';
			  		}
			  	}



				// JQ动画
				// 降价商品的优惠价格动画
				$('.depreciateMerchant').mouseenter(function(){
					var c=$('.depreciateMerchant').index(this);
					$('.depreciateExplain').eq(c).css('display','block');
				});
				$(".depreciateMerchant").mouseleave(function(){
			    	var c=$('.depreciateMerchant').index(this);
					$('.depreciateExplain').eq(c).css('display','none');
			  	});
			  	
			  	// 修改商品规格的动画
			  	$('.shoppinginformationAll').mouseenter(function(){
			  		var c = $('.shoppinginformationAll').index(this);
			  		$('.shoppingSpecificationSon').eq(c).css('border','dashed 1px #eee');
			  		$('.specificationXgai').eq(c).css('display','block');
			  	})
			  	$('.shoppinginformationAll').mouseleave(function(){
			  		var c = $('.shoppinginformationAll').index(this);
			  		$('.shoppingSpecificationSon').eq(c).css('border','solid 1px white');
			  		$('.specificationXgai').eq(c).css('display','none');
			  	})
			  	$('.shoppingSpecificationSon').mouseenter(function(){
			  		var c = $('.shoppingSpecificationSon').index(this);
			  		$('.shoppingSpecificationSon').eq(c).css('border','dashed 1px #f03');
			  		$('.specificationXgai').eq(c).css('background-color','#f03');
			  	})
			  	$('.shoppingSpecificationSon').mouseleave(function(){
			  		var c = $('.shoppingSpecificationSon').index(this);
			  		$('.shoppingSpecificationSon').eq(c).css('border','solid 1px white');
			  		$('.specificationXgai').eq(c).css('background-color','#ccc');
			  	})

        	}else if(err_code == 1){

        	}else if(err_code == 2){
        		window.location = '/user/login'
        	}else if(err_code == 3){
        		alert('你没得商品');
        	}
        }
	})

// 获取商品规格ajax
  	function gainSpecification(goods_id){
  		var goods_id = goods_id;
  		$.ajax({
  			url: '/user/gainShopSpecification',
  			type: 'post',
  			data: {goods_id:goods_id},
  			dataType: 'json',
  			success: function(data){
  				var err_code = data.err_code;
  			}
  		})
  	}



	// JQ动画
	$(document).ready(function(){

	})
	