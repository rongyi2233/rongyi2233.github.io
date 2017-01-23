/**
 * @file            coupon.js
 * @description     掌柜优惠券JS
 * @author          郝四海
 * @version         1.2.0
 * @date            2017/01/23
 * @copyright       河南巧脉信息技术有限公司
 */
"use strict";
var token=qmwx.Configs.token;//登录信息
var userBasePath=qmwx.Configs.userBasePath;//根目录
var ifDyq=false;
var ifGwq=false;
var shopGoodsId;     //商品id；
var orderQuantity;   //商品数量；
var goodsPrice;  //商品价格
var orderPayment;//可使用优惠券商品总价
var CouponsJson="";
/*var array=[];*/
mui.ready(function(){
	mui.init();	
	keeperCoupon.initializePage();		
	$("#content").on("tap",".item",function(){
		keeperCoupon.clickCoupon(this);
	});
	$("#content").on("tap",".confirmBtn",function(){
		keeperCoupon.confirmCoupon();
	})
});


/**
 * @description 定义掌柜优惠券页面处理类
 */
var keeperCoupon = {
	Config: {
		listTemplate: '<div class="item $typeCss$"data-price=$price$ data-id=$id$ data-minOrderPrice=$minOrderPrice$><div class="item-left"><div>$ruleDesc$</div><div>&yen$price$</div>' + '<div>有效期:<span>$beginDate$</span>至<em>$endDate$</em></div></div><div class="item-right"><h2>$typeName$</h2></div></div>',
		listRequestApi: userBasePath + "coupon/canUsed" + "?token=" + token
	},
	/*页面初始处理*/
	initializePage: function() {
		keeperCoupon.goodsInfo();
	},
	/**
	 * description 获取商品信息
	 */
	goodsInfo: function() {
		var arr = [];
		if (window.sessionStorage.getItem("goodsList")) {
			var goodsList = window.sessionStorage.getItem("goodsList");
			goodsList = JSON.parse(goodsList);
			var len = goodsList.length;
			for (var i = 0; i < len; i++) {
				shopGoodsId = goodsList[i].id; //获取商品id
				goodsPrice = goodsList[i].goodsPrice; //获取商品价格
				orderQuantity = goodsList[i].orderQuantity; //获取商品数量
				arr.push({
					shopGoodsId: shopGoodsId,
					goodsPrice: goodsPrice,
					orderQuantity: orderQuantity
				});
			}

			this.loadKeeperCoupon(arr);
		};
	},

	/*加载掌柜优惠券数据*/
	loadKeeperCoupon: function(arr) {
		mui.ajax(this.Config.listRequestApi, {
			dataType: 'json',
			type: 'post',
			data: JSON.stringify({
				goods: arr
			}),
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			success: function(data) {
				if (data) {
					$("#content").attr("data-orderPayment", data[0].canUsedPrice);
					/*orderPayment=data[0].canUsedPrice;*/
					var aCouponsDate = [];
					mui.each(data, function(k, v) {
						var ruleDesc = "";
						if (v.typeName == "购物券") {
							var typeCss = 'item_gwq';
						} else if (v.typeName == "抵用券") {
							var typeCss = 'item_dyq';
						};
						if (v.minSkuNum == 0) {
							v.minSkuNum = 1
						};
						var oCouponsDate = {
							ruleDesc: '满' + v.minSkuNum + '种商品且满' + v.minOrderPrice + '元可用',
							price: v.price,
							beginDate: v.beginDate,
							endDate: v.endDate,
							typeCss: typeCss,
							typeName: v.typeName,
							id: v.id,
							minOrderPrice: v.minOrderPrice
						};
						aCouponsDate.push(oCouponsDate);
					});
					keeperCoupon.renderKeeperCoupon(aCouponsDate);

				};
				keeperCoupon.chooseCoupon();
			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
			},
			complete: function(result, status, xhr) {
				if (result.status == 400 || result.status == 500) {
					var msg = JSON.parse(result.response).desc;
					mui.alert(msg, "提醒");
				}
			}
		});
	},
	renderKeeperCoupon: function(couponData) {
		var listHtml = '';
		mui.each(couponData, function(index, element) {
			listHtml += keeperCoupon.Config.listTemplate.template(element);
		});
		mui("#content")[0].innerHTML = listHtml;
		var confirmBtn = '<button type="button" class="mui-btn mui-btn-success confirmBtn">确认</button>';
		$("#content").append(confirmBtn);
	},
	/*
	 * 优惠券的点击事件
	 */
	clickCoupon: function(_this) {
		if ($(_this).hasClass("item_gwq")) {
			if ($(_this).find(".item-right").hasClass("active")) {
				$(_this).find(".item-right").removeClass("active");
				ifGwq = false;
				$("#content .item_gwq").each(function(index, ele) {
					if ($(ele).find(".item-right").hasClass("active")) {
						ifGwq = true;
					}
				});
			} else {
				if ($(_this).css("background-color") == "rgb(255, 255, 255)") {
					$(_this).find(".item-right").addClass("active");
					ifGwq = true;
					$(_this).siblings(".item_dyq").css("background-color", "#ccc");
					console.log($(_this).siblings(".item_dyq").css("background-color"));
				} else {
					mui.alert("请先释放其他优惠券", "无法选择", "确定")
				}

			};
			keeperCoupon.chooseCoupon();
		} else {
			if (!ifGwq) {
				if ($(_this).find(".item-right").hasClass("active")) {
					$(_this).find(".item-right").removeClass("active");
					ifDyq = false;
				} else {
					if ($(_this).css("background-color") == "rgb(255, 255, 255)") {
						ifDyq = true;
						$(_this).siblings().not("button").css("background-color", "#ccc");
						$(_this).find(".item-right").addClass("active");

					} else {
						mui.alert("请先释放其他优惠券", "无法选择", "确定")
					}

				};
				keeperCoupon.chooseCoupon();
			} else {
				mui.alert("请先释放其他优惠券", "无法选择", "确定");
			}

		}
	},

	/*
	 * 确定优惠券是否可以选择
	 */
	chooseCoupon: function() {
		var hasChecked = [];
		var uncheck = [];
		var CouponsNum = 0;
		var CouponsPrice = 0;
		orderPayment = $("#content").attr("data-orderPayment");
		$("#content").find(".item").each(function(k, v) {
			if ($(v).find(".item-right").hasClass("active")) {
				CouponsNum++;
				CouponsPrice += Number($(v).attr("data-price"));
				orderPayment -= $(v).attr("data-minOrderPrice");
				var oHasChecked = {
					"id": $(v).attr("data-id")
				};
				hasChecked.push(oHasChecked);
			} else {
				setTimeout(function() {
					if (orderPayment >= Number($(v).attr("data-minOrderPrice")) && (!ifDyq)) {
						if ($(v).hasClass("item_gwq")) {
							$(v).css("background-color", "#fff");
						} else {
							if (!ifGwq) {
								$(v).css("background-color", "#fff");
							}
						}

					} else {
						$(v).css("background-color", "#ccc");
					}
					var oUncheck = {
						"CouponsPrice": $(v).attr("data-price"),
						"CouponsList": $(v).attr("data-id")
					};
					uncheck.push(oUncheck);
				}, 0)

			};
		});
		var oCouponsJson = {
			"CouponsNum": CouponsNum,
			"CouponsPrice": CouponsPrice,
			"CouponsList": hasChecked
		};
		CouponsJson = JSON.stringify(oCouponsJson);
	},
	confirmCoupon: function() {
		window.sessionStorage.setItem("CouponsJson", CouponsJson);
		window.location.href = "confirmOrder.html";
	}
}

String.prototype.template = function(obj) {
	return this.replace(/\$\w+\$/gi, function(matchs) {
		var returns = obj[matchs.replace(/\$/g, "")];
		return (returns + "") == "undefined" ? "" : returns;
	});
};