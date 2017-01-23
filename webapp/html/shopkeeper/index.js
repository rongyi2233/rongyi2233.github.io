/**
 * @file            index.js
 * @description     掌柜主页JS
 * @author          黄祖伟
 * @version         1.2.0
 * @date            2017/01/12
 * @copyright       河南巧脉信息技术有限公司
 */

"use strict";
var token=qmwx.Configs.token;
mui.ready(function(){
    mui.init();
    keeperCenter.initializePage();
});
//掌柜主页
var keeperCenter = {
	Config:{
		linjiaMoneyRequestApi: qmwx.Configs.userBasePath +"shopKeeper/linjiaMoney?token=" + token,
		keeperStoreRequestApi: qmwx.Configs.userBasePath + 'shopKeeper/store?token=' + token,
		shopInfoRequestApi: qmwx.Configs.userBasePath + 'shop/current?token=' + token
	},
	initializePage: function(){
		var keeperInfo = JSON.parse(sessionStorage.getItem("keeperInfo"));
		if(keeperInfo){
		    mui("#keeperName")[0].innerText=keeperInfo.trueName;
		}
		this.getKeeperInfo();
		this.getLinjiaMoney();
		this.getShopInfo();
	},
	//店铺信息
	getKeeperInfo: function(){
	    
		var defaultStore = JSON.parse(localStorage.getItem("defaultStore"));
	    if(defaultStore){
	    	mui("#keeperStore")[0].innerText = defaultStore.name;
	    } else {
	    	mui.ajax(this.Config.keeperStoreRequestApi, {
				dataType: 'json',
				type: 'get',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				success: function(data) {
					if(data && data.length >= 1) {
						defaultStore = data[0];
						localStorage.setItem("defaultStore", JSON.stringify(data[0]));
						mui("#keeperStore")[0].innerText = defaultStore.name;
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
	},
	getLinjiaMoney: function(){
		mui.ajax(this.Config.linjiaMoneyRequestApi, {
			dataType: 'json',
			type: 'get',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			success: function(data) {
				if(data){
					mui(".linjia-money")[0].innerText=keeperCenter.toNumber(data);
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
	getShopInfo: function(){
		mui.ajax(this.Config.shopInfoRequestApi, {
			dataType: 'json',
			type: 'get',
			headers: {
					'Content-Type': 'application/json;charset=utf-8'
			},
			success: function(data) {
				if(data){
					var telphone = data.telephone;
					mui(".tel")[0].innerHTML='<a href="tel:' + telphone + '">' + telphone + '</a>';
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
	toNumber: function(data){
		return Number(data).toFixed(2);
	}
}
