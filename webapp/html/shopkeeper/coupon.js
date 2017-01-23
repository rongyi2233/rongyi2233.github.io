/**
 * @file            coupon.js
 * @description     掌柜优惠券JS
 * @author          王容易
 * @version         1.2.0
 * @date            2017/01/23
 * @copyright       河南巧脉信息技术有限公司
 */
"use strict";
var token=qmwx.Configs.token;//登录信息
var userBasePath=qmwx.Configs.userBasePath;//根目录
mui.ready(function(){
	mui.init();
	keeperCoupon.initializePage();	
});

var testData = [{
	ruleDesc: '全场满500元可用，特价商品除外',
	price: 500,
	beginDate:'2017-01-01',
	endDate: '2017-02-01',
	typeCss: 'item_gwq',
	typeName: '购物券'
},{
	ruleDesc: '全场满200元可用，特价商品除外',
	price: 200,
	beginDate:'2017-01-01',
	endDate: '2018-01-01',
	typeCss: 'item_dyq',
	typeName: '抵用券'
}];

/**
 * @description 定义掌柜优惠券页面处理类
 */
var keeperCoupon = {
	Config: {
		listTemplate: '<div class="item"><div class="item-left"><div>$ruleDesc$</div><div>￥$price$</div>' 
					+ '<div>有效期:<span>$beginDate$</span>至<em>$endDate$</em></div></div><div class="item-right $typeCss$"><h2>$typeName$</h2></div></div>',
		listRequestApi: userBasePath+"coupon/keeper"+"?token="+token
	},
	/*页面初始处理*/
	initializePage: function(){
		this.loadKeeperCoupon();
	},
	/*加载掌柜优惠券数据*/
	loadKeeperCoupon: function(){
		
		/*keeperCoupon.renderKeeperCoupon(testData);*/
		mui.ajax(this.Config.listRequestApi, {
			dataType: 'json',
			type: 'get',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			success: function(data) {
				if(data){					
					var aCouponsDate=[];
					mui.each(data,function(k,v){
						var ruleDesc="";
						if(v.typeName=="购物券"){
							var typeCss= 'item_gwq';
						}else if(v.typeName=="抵用券"){
							var typeCss= 'item_dyq';
						};
						var oCouponsDate={
							ruleDesc: '满'+v.minSkuNum+'种商品且满'+v.minOrderPrice+'元可用',
							price: v.price,
							beginDate:v.beginDate,
							endDate: v.endDate,
							typeCss: typeCss,
							typeName: v.typeName
						};
						aCouponsDate.push(oCouponsDate);
					});
					keeperCoupon.renderKeeperCoupon(aCouponsDate);
					
					
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
	},
	renderKeeperCoupon: function(couponData){
		var listHtml = '';
		mui.each(couponData, function(index, element){
			listHtml += keeperCoupon.Config.listTemplate.template(element);
		});
		mui("#content")[0].innerHTML = listHtml;
	}
}

String.prototype.template = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];
        return (returns + "") == "undefined"? "": returns;
    });
};
