/**
 * @file            store.js
 * @description     店铺地址JS
 * @author          王要伟
 * @version         1.2.0
 * @date            2017/01/10
 * @copyright       河南巧脉信息技术有限公司
 */
"use strict";
var token=qmwx.Configs.token;
var defaultStore;
var localKeeperStores = [];
mui.ready(function(){
    mui.init();
    defaultStore = JSON.parse(localStorage.getItem("defaultStore"));
    keeperStore.initializePage();
});

var keeperStore = {
	config: {	
		keeperStoreRequestApi: qmwx.Configs.userBasePath + '/shopKeeper/store?token=' + token,
		storeTem:'<li class="mui-table-view-cell mui-media $activeClass$" id="$id$"><div class="mui-media-body">$name$<p>$contacts$&nbsp;&nbsp;$phone$</p>'
					+ '<p>$address$</p></div></li>'
	},
	initializePage: function(){
		mui.ajax(this.config.keeperStoreRequestApi,{
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	              
			success:function(data){
				localKeeperStores = data;
				var storeHtml = '';
				mui.each(data, function(index, ele){
					ele.activeClass = '';
					if(defaultStore){
						if(defaultStore.id == ele.id){
							ele.activeClass = 'active';
						}
					} else if (index == 0){
						ele.activeClass = 'active';
					}
					storeHtml += keeperStore.config.storeTem.template(ele);
				});
				mui(".mui-table-view")[0].innerHTML = storeHtml;
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
			},
			complete: function(result, status, xhr) {
				if (result.status == 400 || result.status == 500) {
					var msg =JSON.parse(result.response).desc;
					mui.alert(msg, "提醒");
				}
			}
		});
		mui(".mui-table-view").on('tap','.mui-table-view-cell',function(){
		  	//获取id
		  	var id = this.getAttribute("id");
		  	mui.each(localKeeperStores, function(index, ele){
				if(id === ele.id){
					localStorage.setItem("defaultStore", JSON.stringify(ele));
				}
			});
			mui.back();
		});
	}
}

String.prototype.template = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];
        return (returns + "") == "undefined"? "": returns;
    });
};
