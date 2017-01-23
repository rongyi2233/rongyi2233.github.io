/**
 * @file            confirmOrder.js
 * @description     微商城-确认订单JS
 * @author          王要伟
 * @version         1.0.0
 * @date            2016/01/06
 * @copyright       河南巧脉信息技术有限公司
 */

//创建对象和全局变量
var obj =new Object();
var url =qmwx.Configs.userBasePath;
var token=qmwx.Configs.token;
//订单金额
var orderMonery=0;
var totleLjMoney=0;
//优惠券金额和邻家币可用金额
var couponMoney = 0;
var usableLjMoney =0;
//优惠金额
var countAmount = 0
//运费配置
var freeShipping =0;
var deliverFee =0;
//运费
var orderFreight =0;

var loadedNum =0;
var max = 5;
var isableSwitch =false;

//全局配置
obj.Config ={
	moneyLJUrl:url +"shopKeeper/linjiaMoney",
	shopkeeperUrl:url + "shopKeeper/store",
	orderSaveUrl:url +"order",
	freightSetting:url+"/setting/carriage"
}

//订单Json
var orderJson ={
		"payableAmount":"",     //应付金额            obj.obj.calculateReal
		"paymentAmount":"",     //实付金额            obj.obj.calculateReal
		"carriage":"",          //运费                   obj.loadFreight
		"linjiaCurrency":"",    //邻家币               obj.calculateReal
		"orderSource":"",      //订单来源              obj.loadOtherMsg
		"keeperStoreId":"",     //收货人店铺ID   obj.shopKeeper
		"receiverName":"",      // 收货人              obj.shopKeeper
		"receiverAddress":"",   //收货地址            obj.shopKeeper
		"receiverPhone":"",     //收货电话            obj.shopKeeper
		"receiverEmail":"",     //收货邮箱            obj.shopKeeper
		"leaveMessage":"",      //客户留言            obj.shopKeeper
		"goodsList":[],         //订单信息            obj.loadGoods
		"couponKeeperList":[]   //卡券信息            obj.loadCoupons();
}
//初始化
obj.Initialization =function(){
	//初始化 Swiper
	/*obj.initSwiper();*/
	//初始化数据
	obj.initdata();
		//初始化开关按钮
	obj.isableSwitch();
}
//初始化数据
obj.initdata =function(){
	obj.shopKeeper();
	obj.loadCoupons();
	obj.loadLJMoney();
	obj.loadGoods();
	obj.loadFreight();
	obj.loadOtherMsg();
}
//加载店铺数据
obj.shopKeeper =function(){
	var defaultStore = JSON.parse(localStorage.getItem("defaultStore"));
		var shopKeeperUrl = obj.Config.shopkeeperUrl +"?token=" +token;
		mui.ajax(shopKeeperUrl, {
		dataType: 'json',
		type: 'get',
		headers: {
			'Cache-Control':'no-cache',
			'Content-Type': 'application/json;charset=utf-8'
		},
		success: function(data) {
			if(data)
			{
				if(defaultStore!=null)
				{
					var flag = false;
					mui.each(data, function(index, element){
						if(element.id == defaultStore.id){
							flag = true;
							return ;
						}
					});
					if(!flag){
						defaultStore = data[0];
						localStorage.setItem("defaultStore", JSON.stringify(data[0]));
					}
				}else{
					defaultStore = data[0];
					localStorage.setItem("defaultStore", JSON.stringify(data[0]));
				}
				$("#shopKeeperNM").html(defaultStore.name);
				$("#receiver").html(defaultStore.contacts);
				$("#phone").html(defaultStore.phone);
				$("#receiverAddress").html(defaultStore.address);
				//订单回填数据
				orderJson.keeperStoreId =defaultStore.id;
				orderJson.receiverName =defaultStore.contacts;
				orderJson.receiverAddress =defaultStore.address;
				orderJson.receiverPhone =defaultStore.phone;
				orderJson.receiverEmail ="";
				orderJson.leaveMessage ="";   
			}
			loadedNum ++;
			console.log("loaded: " +loadedNum);
			if(loadedNum == max){
				obj.calculateReal();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		},
		complete: function(result, status, xhr) {
			if (result.status == 400 || result.status == 500) {
				errorResult(result.responseJSON);
			}
		}
	});
}

//加载卡券信息 
obj.loadCoupons =function(){
	//模拟测试数据
  /*  var CouponsJson1 ={
		"CouponsNum":"1",
		"CouponsPrice":"5",
		"CouponsList":[{"id":"84b52688-6f94-4eee-92fa-77cba00f22ab"}]
	}
    window.sessionStorage.setItem("CouponsJson",JSON.stringify(CouponsJson1));*/
    //获取卡券数据
	var CouponsJson=window.sessionStorage.getItem("CouponsJson");

	if(CouponsJson&&CouponsJson != 'undefined')
	{
		CouponsJson =JSON.parse(CouponsJson);
		$("#CouponsNum").html(CouponsJson.CouponsNum);
		$("#CouponsPrice").html(CouponsJson.CouponsPrice);
		orderJson.couponKeeperList =CouponsJson.CouponsList;
		couponMoney =CouponsJson.CouponsPrice;
	}
	else{
		$("#CouponsNum").html("0");
	    $("#CouponsPrice").html("0");
	}
	//计算实付金额
	loadedNum ++;
	console.log("loaded: " +loadedNum);
	if(loadedNum == max){
		obj.calculateReal();
	}
}

//加载运费接口
obj.loadFreight =function(){
	var loadFreightUrl = obj.Config.freightSetting +"?token=" +token;
	mui.ajax(loadFreightUrl, {
		dataType: 'json',
		type: 'get',
		headers: {
			'Cache-Control':'no-cache',
			'Content-Type': 'application/json;charset=utf-8'
		},
		success: function(data) {
				if(data)
				{
					freeShipping = data.freeShipping;
					deliverFee =data.deliverFee;
				}
				loadedNum ++;
				console.log("loaded: " +loadedNum);
			if(loadedNum == max){
				obj.calculateReal();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		},
		complete: function(result, status, xhr) {
			if (result.status == 400 || result.status == 500) {
				var msg =JSON.parse(result.response).desc;
					mui.alert(msg, "提醒");
			}
		}
	});
}

//加载其他后台需要信息  暂时为测试接口
obj.loadOtherMsg =function(){
	var ortherJson ={
		"orderSource":1
	}
	orderJson.orderSource =ortherJson.orderSource;
}

//初始化掌柜邻家币
obj.loadLJMoney =function(){
	orderJson.linjiaCurrency =0;
	var loadLJMoneyUrl = obj.Config.moneyLJUrl +"?token=" +token;
		mui.ajax(loadLJMoneyUrl, {
		dataType: 'json',
		type: 'get',
		headers: {
			'Cache-Control':'no-cache',
			'Content-Type': 'application/json;charset=utf-8'
		},
		success: function(data) {
				if(data==null ||data==""||data ==0)
				{
					$("#ljMoneyRemainder").text("0");
					totleLjMoney =0;
				}
				else{
					$("#ljMoneyRemainder").text(obj.toNumber(data));
					totleLjMoney =obj.toNumber(data);
					//$("#usableMoney").text(obj.toNumber(data));
				}
				loadedNum ++;
				console.log("loaded: " +loadedNum);
			if(loadedNum == max){
				obj.calculateReal();
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		},
		complete: function(result, status, xhr) {
			if (result.status == 400 || result.status == 500) {
				var msg =JSON.parse(result.response).desc;
					mui.alert(msg, "提醒");
			}
		}
	});
}


/***********************添加微商城-商品信息*********************************/
/*商品信息*/
var goodTemp ='<div class="item"><dl class="mui-push-right"><dt><img src="$imgUrl$"/></dt>' +
              '<dd>$goodName$</dd><dd><span>$goodType$</span></dd><dd><span>&yen</span><em class ="price">$goodsPrice$</em><b>/$unit$</b></dd></dl>' +
              '<b class="goodNum">x<em id="goodstotal">$orderQuantity$</em></b>'+
			  '</div>';

//加载商品信息
obj.loadGoods =function(){
	var goodList=window.sessionStorage.getItem("goodsList")
		goodList=JSON.parse(goodList);
		//console.log(goodList);
		if(goodList!=null)
		{
			var goodsHtml ="";
			for(var i=0;i<goodList.length;i++)
			{
				var good = {
					       shopGoodsId:goodList[i].shopGoodsId,
		                   imgUrl: goodList[i].imgUrl,
		                   goodName: goodList[i].name,
		                   goodType: goodList[i].standard,
		                   goodsPrice:goodList[i].goodsPrice,
		                   orderQuantity:goodList[i].orderQuantity,
		                   total:goodList[i].total,
		                   supplier:goodList[i].supplier,
		                   unit:goodList[i].unit
		                };
		        orderJson.goodsList.push(good);
				goodsHtml+=goodTemp.template(good);
			}
			$('#goodsContainer').append(goodsHtml);	
			obj.calculateTotalPrice();
			loadedNum ++;
			console.log("loaded: " +loadedNum);
			if(loadedNum == max){
				obj.calculateReal();
			}	
		}
}
/**
 * description 计算订单商品种类和价格
 */
obj.calculateTotalPrice = function() {
	totalPrice = 0;
	kindNum = 0;
	goodsTotalNum = 0;
	kindNum = $(".item").length;
	$(".item").each(function(k, v) {
		var goodsNum = $(v).find("#goodstotal").text();
		var goodPrice = $(v).find(".price").text();
		goodsTotalNum += parseInt(goodsNum);
		totalPrice += goodsNum * goodPrice;
	});
	totalPrice = obj.toNumber(totalPrice)
    $('#goodsCategory').text(kindNum);
	$('#goodsCategoryNum').text(goodsTotalNum);
	$('#orderMonery').text(totalPrice);
	orderMonery =totalPrice;
}

/**
 * description 计算订单金额
 */
obj.calculateReal = function() {
	//判断订单金额是否达到免运费
	if (orderMonery >= freeShipping) {
		deliverFee = 0;
	}
	deliverFee = obj.toNumber(deliverFee);
	$("#freight").text(deliverFee);
	orderJson.carriage = deliverFee;

	//计算实付金额
	//	var realPayment = orderMonery - couponMoney + deliverFee;
	//	if(realPayment > 0) {
	//		if(isableSwitch){
	//			if(realPayment >= totleLjMoney) {
	//				usableLjMoney = totleLjMoney;
	//			} else {
	//				usableLjMoney = realPayment;
	//			}
	//			$("#usableMoney").html("可用<em>"+usableLjMoney+"</em>");
	//		} else {
	//			usableLjMoney = 0;
	//		}
	//		realPayment = realPayment - usableLjMoney;
	//	} else {
	//		realPayment = 0;
	//	}
	var realPayment = orderMonery - couponMoney;
	if (realPayment < 0) {
		realPayment = 0;
	}
	realPayment = realPayment + deliverFee;
		if (isableSwitch) {
			if (realPayment >= totleLjMoney) {
				usableLjMoney = totleLjMoney;
			} else {
				usableLjMoney = realPayment;
			}
			$("#usableMoney").html("可用<em>" + usableLjMoney + "</em>");
		} else {
			usableLjMoney = 0;
		}
		realPayment = realPayment - usableLjMoney;
		countAmount =couponMoney +usableLjMoney;
	//前端显示
	$("#discountAmount").text(countAmount);
	$("#realPayment").text(obj.toNumber(realPayment));
}


//判断开关是否开启
obj.isableSwitch =function(){
	$("#mySwitch")[0].addEventListener("toggle",function(event){
	       if(event.detail.isActive){
			    isableSwitch =true;
			 }else{
			 	isableSwitch =false;
			 	$("#usableMoney").html("");
			 }
			 obj.calculateReal();
	});
}
/* String extension */
String.prototype.template = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];
        return (returns + "") == "undefined"? "": returns;
    });
};

/**
 * description 提交订单方法初始化
 */
$(".subBtn").on('click',function(){
	var realPayment = $("#realPayment").text();
	orderJson.payableAmount =orderMonery;
	orderJson.paymentAmount =realPayment;
	orderJson.linjiaCurrency =obj.toNumber(usableLjMoney);
	//orderJson.linjiaCurrency =parseInt(usableLjMoney);
	obj.orderSave();
})
$(".continueBtn").on('click',function(){
	window.sessionStorage.removeItem("CouponsJson");
	window.location.href="../category/category.html";
});
/**
 * description 提交订单实现
 */
obj.orderSave =function(){
	var ordersUrl = obj.Config.orderSaveUrl +"?token=" +token;
	mui.ajax({
		    url:ordersUrl,
			type: "post",
			dataType: "json",
			headers: {
			'Cache-Control':'no-cache',
			'Content-Type': 'application/json;charset=utf-8'
			},
			data: JSON.stringify(orderJson),
			crossDomain:true,
			success: function(data) {
				if(data)
				{
					if(data.paymentAmount > 0){
					  var orderDetail ={
					  	realPayment:data.paymentAmount,
					  	orderId:data.id,
					  	orderNum:data.orderNumber
					  }
					   window.sessionStorage.setItem("orderDetail",JSON.stringify(orderDetail));
					   window.sessionStorage.removeItem("CouponsJson");
				       window.location.href="../cart/payDetails.html";
					
					} else {
						var msg ="支付完成";
						window.sessionStorage.removeItem("CouponsJson");
						mui.alert(msg, "提醒",function(){
							window.location.href ="../category/category.html";
						});
					}
				}
		    },
			error: function(xhr, type, errorThrown) {
				console.log(xhr);
			},
			complete: function(result, status, xhr) {
				if (result.status == 400 || result.status == 500) {
					var msg =JSON.parse(result.response).desc;
					mui.alert(msg, "提醒");
				}
			}
	    });	
}
//保留两位小数
obj.toNumber =function(data)
{
	var ss = parseFloat(data).toFixed(2);
	return parseFloat(ss);
}

//页面加载方法
mui.ready(function(){
    mui.init({
    	beforeback: function(){
		window.sessionStorage.removeItem("CouponsJson");
		return false;
		}
    });
    var old_back = mui.back;
    mui.back=function(){
    	window.location.href ='../cart/shoppingList.html';
    	old_back();
    }
    pushHistory(); 
    window.addEventListener("popstate", function(e) { 
        //alert("我监听到了浏览器的返回按钮事件啦");
        window.sessionStorage.removeItem("CouponsJson");
        window.location.href ='../cart/shoppingList.html';
    }, false); 
    function pushHistory() { 
        var state = { 
            title: "title", 
            url: "#"
        }; 
        window.history.pushState(state, "title", "#"); 
    } 
   //页面初始化
	obj.Initialization();
});