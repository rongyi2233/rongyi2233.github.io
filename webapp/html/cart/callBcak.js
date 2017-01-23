/**
 * @file            callBack.js
 * @description     支付成功回调JS
 * @author          郝四海
 * @version         1.2.0
 * @date            2017/1/12
 * @copyright       河南巧脉信息技术有限公司
 */
$(function() {
	/**
	 * @description 对象 
	 */
	var obj = new Object();

	/**
	 * description 全局变量
	 */
	var url = qmwx.Configs.userBasePath;
	var token = qmwx.Configs.token;

	/**
	 * @description 配置项
	 */
	obj.Configs = {
		payMentUrl: url + "/wx/jsPay",
		paySuccessUrl: url + "order/paySuccess"
	}

	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	var code = getQueryString("code");
	var orderId = getQueryString("orderId");
	var posturl = obj.Configs.payMentUrl + '?orderId=' + orderId + '&code=' + code + "&token=" + token;
	if (code) {
		mui.ajax(posturl, {
			dataType: 'json',
			type: 'post',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			success: function(data) {
				WeixinJSBridge.invoke('getBrandWCPayRequest', {
					"appId": data.appId,
					"timeStamp": data.timeStamp,
					"nonceStr": data.nonceStr,
					"package": data.package,
					"signType": data.signType,
					"paySign": data.paySign
				}, function(res) {
					WeixinJSBridge.log(res.err_msg);
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						mui.ajax(obj.Configs.paySuccessUrl + '?id=' + orderId + '&paymentMethod=1&token=' + token, {
							dataType: 'json',
							type: 'get',
							headers: {
								'Content-Type': 'application/json;charset=utf-8'
							},
							success: function(data) {
								mui.alert("微信支付成功!","提示",function(){
									window.location.href = "../category/category.html";	
								});
							},
							error: function(xhr, type, errorThrown) {
								mui.alert("支付失败","提示")
								console.log(type);
							},
							complete: function(result, status, xhr) {
								if (result.status == 400 || result.status == 500) {
									errorResult(result.responseJSON);
								}
							}
						});
					} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						mui.alert("支付取消","提示", function(){
							window.location.href = "payDetails.html";
						});
					} else {
						mui.alert("支付失败","提示", function(){
							window.location.href = "payDetails.html";
						});
					}
				})
			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
			},
			complete: function(result, status, xhr) {
				//	window.location.reload();
				if (result.status == 400 || result.status == 500) {
					errorResult(result.responseJSON);
				}
			}
		});
	} else {
		mui.alert("微信缺少code","提示")
	}
})