

/**
 * @file            shopkeeperOrder.js
 * @description     掌柜订单JS
 * @author          王容易
 * @version         1.2.0
 * @date            2017/1/17
 * @copyright       河南巧脉信息技术有限公司
 */



var token=qmwx.Configs.token;//登录信息
var userBasePath=qmwx.Configs.userBasePath;//根目录
var num=Number(window.location.href.indexOf("="))+1;//获取url里的参数；
var returnArgument=window.location.href.slice(num);
returnArgument=returnArgument==1?1:0;
var shopkeeperOrder={
	configs:{
		showPayment:userBasePath+"order?token="+token+"&orderStatus=0",
		showforGoods:userBasePath+"order?token="+token+"&orderStatus=1",
		changeOrders:userBasePath+"order/invaild?token="+token
	},//配置文件
	confirmShowGoods:function(){		
		if(returnArgument){
			$("#header .tab li").eq(1).addClass("active").siblings().removeClass("active");			
				$("#content .forGoods").show().siblings().hide();				
		}else{
			$("#header .tab li").eq(0).addClass("active").siblings().removeClass("active");							
				$("#content .payment").show().siblings().hide();										
		};
	},
	//	展示待付款商品
	showPayment:function(){
		var paymentHtml="";
		mui.ajax({
			url:this.configs.showPayment,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},
			success:function(data){	
				if(data&&data.length){
					mui.each(data,function(k,v){
						var goodsNum=0;//商品总件数	
						var nowDate=new Date();
						nowDate.setTime(v.createDate);
						var dateYears=nowDate.getFullYear();
						var dataMonth=parseInt(nowDate.getMonth()+1)>9?parseInt(nowDate.getMonth()+1):"0"+parseInt(nowDate.getMonth()+1);
						var dateDate=parseInt(nowDate.getDate())>9?parseInt(nowDate.getDate()):"0"+parseInt(nowDate.getDate());
						var sDateDate=dateYears+"-"+dataMonth+"-"+dateDate;
						
						var dateHours=parseInt(nowDate.getHours())>9?parseInt(nowDate.getHours()):"0"+parseInt(nowDate.getHours());
						var dateMinute=parseInt(nowDate.getMinutes())>9?parseInt(nowDate.getMinutes()):"0"+parseInt(nowDate.getMinutes());			
						var dateTime=dateHours+":"+dateMinute;
						
						
						if(v.goodsList){
							paymentHtml+='<div class="item clearfloat">';
				    		paymentHtml+='<div class="item-title">';
			    			paymentHtml+='<span class="l">订单号：<b>'+v.orderNumber+'</b></span>';
			    			paymentHtml+='<em class="r">下单时间：<i>'+sDateDate+'</i><b>'+dateTime+'</b></em>';
				    		paymentHtml+='</div>';
				    		paymentHtml+='<div class="item-content">'; 
				    		
				    		mui.each(v.goodsList,function(index,ele){
				    			goodsNum+=ele.orderQuantity;				    			
				    			paymentHtml+='<div class="content-details">';	    				    			
			    				paymentHtml+='<dl class="l">';
					    		paymentHtml+='<dt>'+ele.shopGoods.goods.name+'</dt>';			
					    		paymentHtml+='<dd>'+ele.shopGoods.goods.standard+'</dd>';			
					    		paymentHtml+='</dl>';		
					    		paymentHtml+='<p class="r">';		
					    		paymentHtml+='<span class="l">&yen;<b>'+ele.shopGoods.sellPrice+'</b><i>/'+ele.shopGoods.goods.unit+'</i></span>';			
					    		paymentHtml+='<em class="r">x'+ele.orderQuantity+'</em>';			
					    		paymentHtml+='</p>';		
					    		paymentHtml+='</div>';	
				    		});
				    			    					    		
				    		paymentHtml+='</div>';
				    		paymentHtml+='<div class="item-footer">';
				    		paymentHtml+='<p class="l">共<b>'+v.goodsList.length+'</b>种商品<em>'+goodsNum+'</em>件 合计<i>&yen;'+v.paymentAmount+'</i></p>';	
				    		paymentHtml+='<p class="r">';	
				    		paymentHtml+='<span class="l changeOrder">修改订单</span>';		
				    		paymentHtml+='<a class="payMoney r"data-id="'+v.id+'"data-orderNumber="'+v.orderNumber+'"data-totalPrice="'+v.paymentAmount+'">付款</a>';		
				    		paymentHtml+='</p>';			    			
				    		paymentHtml+='</div>';
				    		paymentHtml+='</div>';
			    		}
					});
					var goodsNumber=data.length?'('+data.length+')':"";
					$("#header .tab li").eq(0).find("span").html(goodsNumber);
					
				}else{
					paymentHtml+='<div class="nullShow"><div>您还没有相关订单</div><div>可以去看看有哪些想买的</div><div><button class="simulationA"data-url="../category/category.html">随便逛逛</button></div></div>';										
				}
				$("#content .payment").html(paymentHtml);
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
		})
	},
	//	展示待收货商品
	showforGoods:function(){
		var showforGoods="";
		mui.ajax({
			url:this.configs.showforGoods,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},
			success:function(data){
				if(data&&data.length){
					mui.each(data,function(k,v){
						var goodsNum=0;//商品总件数						
						var nowDate=new Date();
						nowDate.setTime(v.createDate);
						var dateYears=nowDate.getFullYear();
						var dataMonth=parseInt(nowDate.getMonth()+1)>9?parseInt(nowDate.getMonth()+1):"0"+parseInt(nowDate.getMonth()+1);
						var dateDate=parseInt(nowDate.getDate())>9?parseInt(nowDate.getDate()):"0"+parseInt(nowDate.getDate());
						var sDateDate=dateYears+"-"+dataMonth+"-"+dateDate;
						
						var dateHours=nowDate.getHours();
						var dateMinute=nowDate.getMinutes();			
						var dateTime=dateHours+":"+dateMinute;
						
						
						if(v.goodsList){
							showforGoods+='<div class="item clearfloat">';
				    		showforGoods+='<div class="item-title">';
			    			showforGoods+='<span class="l">订单号：<b>'+v.orderNumber+'</b></span>';
			    			showforGoods+='<em class="r">下单时间：<i>'+sDateDate+'</i><b>'+dateTime+'</b></em>';
				    		showforGoods+='</div>';
				    		showforGoods+='<div class="item-content">'; 
				    		
				    		mui.each(v.goodsList,function(index,ele){
				    			goodsNum+=ele.orderQuantity;		    			
				    			showforGoods+='<div class="content-details">';	    				    			
			    				showforGoods+='<dl class="l">';
					    		showforGoods+='<dt>'+ele.shopGoods.goods.name+'</dt>';			
					    		showforGoods+='<dd>'+ele.shopGoods.goods.standard+'</dd>';			
					    		showforGoods+='</dl>';		
					    		showforGoods+='<p class="r">';		
					    		showforGoods+='<span class="l">&yen;<b>'+ele.shopGoods.sellPrice+'</b><i>/'+ele.shopGoods.goods.unit+'</i></span>';			
					    		showforGoods+='<em class="r">x'+ele.orderQuantity+'</em>';			
					    		showforGoods+='</p>';		
					    		showforGoods+='</div>';	
				    		});
				    			    					    		
				    		showforGoods+='</div>';
				    		showforGoods+='<div class="item-footer">';
				    		showforGoods+='<p class="l">共<b>'+v.goodsList.length+'</b>种商品<em>'+goodsNum+'</em>件 合计<i>&yen;'+v.paymentAmount+'</i></p>';	
				    		showforGoods+='<p class="r">';			
				    		//showforGoods+='<a class="confirmGoodsBtn r">确认收货</a>';		
				    		showforGoods+='</p>';			    			
				    		showforGoods+='</div>';
				    		showforGoods+='</div>';	
						}
						
					});
					var goodsNumber=data.length?'('+data.length+')':"";
					$("#header .tab li").eq(1).find("span").html(goodsNumber);
					
				}else{
					showforGoods+='<div class="nullShow"><div>您还没有相关订单</div><div>可以去看看有哪些想买的</div><div><button class="simulationA"data-url="../category/category.html">随便逛逛</button></div></div>';					
					/*$("#content .nullShow").show().siblings().hide();*/
				}
				$("#content .forGoods").html(showforGoods);
				
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
		})
	},
	changeOrders:function(_this){
		var orderNum=$(_this).next().attr("data-id");
		mui.ajax({
			url:this.configs.changeOrders+"&id="+orderNum,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},
			/*data:JSON.stringify({
				"id":orderNum
			}),*/
			success:function(data){
				/*console.log(data);*/
				qmwx.switchPage("../cart/shoppingList.html");
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
	},
	payMoney:function(_this){		
		var orderDetail ={
			realPayment:$(_this).attr("data-totalPrice"),
		  	orderId:$(_this).attr("data-id"),
		  	orderNum:$(_this).attr("data-orderNumber")
		}
		window.sessionStorage.setItem("orderDetail",JSON.stringify(orderDetail));
		qmwx.switchPage("../cart/payDetails.html");
	}
	
	
}





//点击切换待付款和待收货
mui.ready(function(){
	shopkeeperOrder.showforGoods();
	shopkeeperOrder.showPayment();
	$("#header .tab").on("tap","li",function(){
		returnArgument=$(this).index();
		shopkeeperOrder.confirmShowGoods();
	});
	shopkeeperOrder.confirmShowGoods();
	$("#content").on("tap",".changeOrder",function(){
		shopkeeperOrder.changeOrders(this);
	});
	$("#content").on("tap",".payMoney",function(){
		shopkeeperOrder.payMoney(this);
	})
});