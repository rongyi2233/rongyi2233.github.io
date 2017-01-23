/**
 * @file            pay.js
 * @description     进货单JS
 * @author          郝四海
 * @version         1.2.0
 * @date            2017/1/5
 * @copyright       河南巧脉信息技术有限公司
 */

/**
 * @description 对象 
 */
var obj=new Object();

/**
 * description 全局变量
 */

var url=qmwx.Configs.userBasePath;
var token=qmwx.Configs.token;

/**
 * @description 配置项
 */
obj.Configs={
	beforePay:url+"order/payVerify",
	payMentUrl:url+"wx/authorization"
}

/**
 * @description 全局变量
 */
var orderID; //订单ID

/**
 * @description 获取支付金额
 */
obj.getOrderMoney=function(){
	var payDetails = window.sessionStorage.getItem("orderDetail");
	payDetails=JSON.parse(payDetails);
	orderMoney = Number(payDetails.realPayment).toFixed(2);
	$(".orderNumber").text(payDetails.orderNum);
	$(".money").find("b").text(orderMoney);
	orderID=payDetails.orderId;
}

/**
 * @description 选择支付方式
 */
obj.payMethod = function() {
	mui("#content").on("tap", ".confirmPay", function() {
		if ($(".radio").find("input").is(":checked")) {
			mui.ajax(obj.Configs.beforePay +'?id=' + orderID + '&token=' + token, {
				dataType: 'json',
				type: 'get',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				success: function(data) {
					window.location.href = obj.Configs.payMentUrl + '?orderId=' + orderID + '&token=' + token;
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
		} else {
			mui.alert("请选择支付方式", "提示");
		}
	})
}
/**
 * @description 页面初始化
 */
$(function(){;
	obj.getOrderMoney()
	obj.payMethod();
})
