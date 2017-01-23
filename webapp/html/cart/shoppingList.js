/**
 * @file            shoppingList.js
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
var totalPrice;	//判断总价
var kindNum; //商品种类
var goodsTotalNum; //总商品的数量
var url=qmwx.Configs.userBasePath;
var token=qmwx.Configs.token;
var minNum; //最小限购量
var maxNum; //最大限购量
var stock; //库存
/**
 * description 配置项
 */
obj.Configs={
	cartUrl:url+"cart/"
}

/**
 * description 获取商品信息
 */
obj.goodsInfo = function() {
	mui.ajax(obj.Configs.cartUrl+'?token='+token, {
		dataType: 'json',
		type: 'get',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		success: function(data) {
			var str = "";
			if (data) {
				var len = data.length;
				for (var i = 0; i < len; i++) {
					if(data[i].shopGoods.limitOrderQuantity==0){
						data[i].shopGoods.limitOrderQuantity=data[i].shopGoods.stock;
					}
					str += "<div class='item'>";
					str += "<input class='shopGoodsId' type='hidden' value='" + data[i].shopGoodsId + "'>";
					str += "<div class='mui-input-row mui-checkbox mui-left radio'>";
					str += "<label>";
					str += "</label>";
					str += "<input class='id' name='checkbox' checked type='checkbox' value='" + data[i].id + "'>";
					str += "</div>";
					str += "<dl class='mui-push-right'>";
					str += "<dt>";
					if (data[i].shopGoods.goods.goodsPictureList.length >= 1) {
						var pLen=data[i].shopGoods.goods.goodsPictureList.length;
							str += "<img src='" + data[i].shopGoods.goods.goodsPictureList[0].url + "'/>";
							if(data[i].shopGoods.stock == 0 || data[i].shopGoods.stock < data[i].shopGoods.minOrderQuantity){
								str += "<p>售罄</p>" ;
							}
					}else{
						str += "<img src='../../public/assets/img/model.png'/>";
						if(data[i].shopGoods.stock == 0 || data[i].shopGoods.stock < data[i].shopGoods.minOrderQuantity){
								str += "<p>售罄</p>" ;
						}
					}
					str += "</dt>";
					str += "<dd class='name noWrap'>" + data[i].shopGoods.goods.name + "</dd>";
					str += "<dd class='standard'>";
					str += "<span>" + data[i].shopGoods.goods.standard + "</span>";
					str += "</dd>";
					str += "<dd class='goodsPrice'>";
					str += "<span>&yen</span>";
					str += "<em class='price'>" + data[i].shopGoods.sellPrice + "</em>";
					str += "<b  class='unit'>/<span>" + data[i].shopGoods.goods.unit + "</span></b>";
					str += "</dd>";
					str += "<dd class='date'>";
					if (data[i].shopGoods.productDate) {
						var newTime = new Date(data[i].shopGoods.productDate);
						var year = newTime.getFullYear(); /*年*/
						var month = newTime.getMonth() + 1; /*月*/
						if (month < 10) {
							month = "0" + month;
						}
						var date = newTime.getDate(); /*日*/
						if (date < 10) {
							date = "0" + date;
						}
						str += "<i></i>" + year + "-" + month + "-" + date;
					}
					str += "<span>";
					str +="<input class='stock' type='hidden' value='"+data[i].shopGoods.stock+"'>";
					if( data[i].shopGoods.minOrderQuantity !=1 && data[i].shopGoods.minOrderQuantity != 0 ){
						str += "起订:<em class='minOrderQuantity'>" + data[i].shopGoods.minOrderQuantity + "</em>";
					}else{
						str += "起订:<em class='minOrderQuantity'>" + 1+ "</em>";
					}
					if( data[i].shopGoods.limitOrderQuantity != 0 ){
						str += "限订:<b class='limitOrderQuantity'>" + data[i].shopGoods.limitOrderQuantity + "</b>";
					}	
					str += "</span>";
					str += "</dd>";
					str += "</dl>";
					if( data[i].shopGoods.limitOrderQuantity != 0 ){
						if(data[i].shopGoods.stock == 0 || data[i].shopGoods.stock < data[i].shopGoods.minOrderQuantity){
							str += "<div class='mui-numbox' data-numbox-min='0' data-numbox-max='0'>";
						}else if(data[i].shopGoods.stock >= data[i].shopGoods.limitOrderQuantity){
							str += "<div class='mui-numbox' data-numbox-min='" + data[i].shopGoods.minOrderQuantity + "' data-numbox-max='" + data[i].shopGoods.limitOrderQuantity + "'>";
						}else if(data[i].shopGoods.stock <= data[i].shopGoods.limitOrderQuantity){
							str += "<div class='mui-numbox' data-numbox-min='" + data[i].shopGoods.minOrderQuantity + "' data-numbox-max='" + data[i].shopGoods.stock + "'>";
						}
					}else{
						str += "<div class='mui-numbox' data-numbox-min='" + data[i].shopGoods.minOrderQuantity + "' data-numbox-max='200'>";
					}
					if(data[i].shopGoods.stock == 0 || data[i].shopGoods.stock < data[i].shopGoods.minOrderQuantity || data[i].number==data[i].shopGoods.minOrderQuantity){
						str += "<button class='mui-btn disdecrease mui-numbox-btn-minus' disabled type='button'></button>";
					}else{
						str += "<button class='mui-btn decrease mui-numbox-btn-minus' type='button'></button>";
					}
					if(data[i].shopGoods.stock == 0 || data[i].shopGoods.stock < data[i].shopGoods.minOrderQuantity){
						str += "<input class='mui-numbox-input' value='0'  type='number' />";
					}else{
						str += "<input class='mui-numbox-input' value='" + data[i].number + "'  type='number' />";
					}
					if(data[i].shopGoods.stock == 0 || data[i].shopGoods.stock < data[i].shopGoods.minOrderQuantity || data[i].number==data[i].shopGoods.limitOrderQuantity || data[i].shopGoods.stock == data[i].number){
						str += "<button  class='mui-btn disadd mui-numbox-btn-plus' type='button'></button>";
					}else{
						str += "<button class='mui-btn add mui-numbox-btn-plus' type='button'></button>";
					}
					str += "</div>";
					str += "</div>";
				}
			}
			$(".order-details").append(str);
			obj.calculateTotalPrice();
			mui('.mui-numbox').numbox();
			obj.goodsNumChange();
			obj.allChecked();
			obj.radio();
			obj.delete();		
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

/**
 * description 商品删除
 */
obj.delete=function(){
	mui("#header").on("tap",".removeBtn",function(){
		var params="";
		var arr=[];
		var checkboxLength=$(".item input[type=checkbox]:checked").length;
		if(checkboxLength>0){
			$(".item input[type=checkbox]").each(function(k,v){
					if(v.checked==true){
						var id=$(v).val();
						var	number=$(v).parent().siblings(".mui-numbox").find(".mui-numbox-input").val();
						var shopGoodsId=$(v).parent().siblings("input").val();
						 params={
							"id":id,
							"number":number,
							"shopGoodsId":shopGoodsId
						}
						 arr.push(params);
					}
				});
				mui.confirm("确认删除该商品吗？", "提醒" , function(e){
					if(e.index==1){
						obj.confirmDelete(arr);
					}
				})
		}else{
			mui.alert("请选择您要删除的商品","提醒")
		}
	})
}

/**
 * description 确认删除
 */
obj.confirmDelete = function(n) {
	mui.ajax(obj.Configs.cartUrl+'?token='+token, {
		dataType: 'json',
		type: 'delete',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		data: JSON.stringify(n),
		success: function(data) {
			window.location.reload();
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

/**
 * description 计算进货单商品种类与数量
 */
obj.calculateTotalPrice = function() {
	totalPrice = 0;
	kindNum = 0;
	goodsTotalNum = 0;
	$(".item").each(function(k, v) {
		if ($(v).find("input[type=checkbox]")[0].checked) {
			kindNum++;
			var goodsNum = parseInt($(v).find("input[type=number]").val());
			var goodPrice = $(v).find(".price").text();
			goodsTotalNum += goodsNum;
			totalPrice += goodsNum * goodPrice;
		}
	});
	totalPrice = parseFloat(totalPrice);
	totalPrice = (totalPrice).toFixed(2);
	$(".total").find("b").text(goodsTotalNum);
	$(".total").find("em").text(kindNum);
	$(".totalPrice").text(totalPrice);

}

/**
 * description 进货单商品数量的增减
 */
obj.goodsNumChange = function() {
	$(".item button").on("tap",function(){
		obj.goodsOrderLimit($(this));
		obj.calculateTotalPrice();
		var editId=$(this).parent().siblings(".radio").children(".id").val();
		var editNumber=$(this).siblings(".mui-numbox-input").val();
		var editshopGoodsId=$(this).parent().siblings(".shopGoodsId").val();
		var n={
			"id":editId,
			"number":editNumber,
			"shopGoodsId":editshopGoodsId
		}
		obj.goodsEdit(n,editId);
		});
}

/**
 * description 商品修改
 */
obj.goodsEdit=function(n,editId){
	mui.ajax(obj.Configs.cartUrl+editId+'?token='+token, {
		dataType: 'json',
		type: 'put',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		data: JSON.stringify(n),
		success: function(data) {
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


/**
 * description 确认订单
 */
obj.confirmOrder = function() {
	$(".setBtn").on("tap", function() {
		var array = [];
		var params;
		var checkboxLength = $(".item input[type=checkbox]:checked").length;
		if(checkboxLength > 0) {
			$(".item").each(function(k, v) {
				if($(v).find("input[type=checkbox]")[0].checked) {
					value = $(v).find(".mui-numbox-input").val();
					if(value == 0) {
						mui.alert("结算的商品有售罄的情况", "提醒 ");
						return false;
					} else {
						//$(".item input[type=checkbox]").each(function(k, v) {
						//if (v.checked == true) {
						var id = $(v).find('.id').val();
						var orderQuantity = $(v).find(".mui-numbox-input").val();
						var shopGoodsId = $(v).find(".shopGoodsId").val();
						var imgUrl = $(v).find(".mui-push-right").find("dt").children("img").attr("src");
						var name = $(v).find(".name").text();
						var standard = $(v).find(".standard").children("span").text();
						var price = $(v).find(".goodsPrice").children(".price").text();
						var unit = $(v).find(".goodsPrice").children(".unit").find("span").text();
						var total = (price * orderQuantity).toFixed(2);
						var supplier = '';
						params = {
								"id": id,
								"orderQuantity": orderQuantity,
								"shopGoodsId": shopGoodsId,
								"goodsPrice": price,
								"supplier": supplier,
								"total": total,
								"imgUrl": imgUrl,
								"name": name,
								"standard": standard,
								"unit": unit
							}
							//}
						array.push(params);
						//});
						var goodsList = JSON.stringify(array);
						window.sessionStorage.setItem("goodsList", goodsList);
						window.location.href = "../order/confirmOrder.html";
					}
				}
			});
		} else {
			mui.alert("请选择您结算的商品", "提醒");
		}
	})
}

/**
 * description 最大最小起订量遮罩层
 */
obj.goodsOrderLimit = function(_this) {
	var num = $("input", _this.parent()).val();
	num = parseInt(num);
	minNum = _this.parent(".mui-numbox").siblings("dl").find(".minOrderQuantity").text();
	maxNum = _this.parent(".mui-numbox").siblings("dl").find(".limitOrderQuantity").text();
	stock = _this.parent(".mui-numbox").parent().find(".stock").val();
	stock = parseInt(stock);
	if (num == minNum || num == 1) {
		_this.removeClass("decrease");
		_this.addClass("disdecrease");
		mui.toast('已是起订量', {
			duration: 'long'
		});
		if ($(".disadd", _this.parent())) {
			var _btn = $(".disadd", _this.parent());
			_btn.removeClass("disadd");
			_btn.addClass("add");
		};
	} else if (num == maxNum) {
		_this.removeClass("add");
		_this.addClass("disadd");
		mui.toast('已达限订量', {
			duration: 'long'
		});
		if ($(".disdecrease", _this.parent())) {
			var _btn = $(".disdecrease", _this.parent());
			_btn.removeClass("disdecrease");
			_btn.addClass("decrease");
		};
	} else if (num >= stock) {
		_this.removeClass("add");
		_this.addClass("disadd");
		mui.toast('库存不足', {
			duration: 'long'
		});
		if ($(".disdecrease", _this.parent())) {
			var _btn = $(".disdecrease", _this.parent());
			_btn.removeClass("disdecrease");
			_btn.addClass("decrease");
		};
	} else {
		if ($(".disdecrease", _this.parent())) {
			var _btn = $(".disdecrease", _this.parent());
			_btn.removeClass("disdecrease");
			_btn.addClass("decrease");
		};
		if ($(".disadd", _this.parent())) {
			var _btn = $(".disadd", _this.parent());
			_btn.removeClass("disadd");
			_btn.addClass("add");
		};
	}
}
/**
 * description 全选 
 */
obj.allChecked=function(){
	$(".allChecked").on("change",function(){
		if($(this).find("input").is(":checked")){
			$(".item input[type=checkbox]").each(function(k,v){
					v.checked=true;
				});
		}else{
			$(".item input[type=checkbox]").each(function(k,v){
					v.checked=false;
				});
		}
			obj.calculateTotalPrice();
	})
}

/**
 * description 单选
 */
obj.radio = function() {
	var chsub = $(".item input[type=checkbox]").length; //获取复选框的个数
	var checkedsub; //获取选中的subcheck的个数 
	$(".item").on("change", "input", function() {
		checkedsub = $(".item input[type=checkbox]:checked").length;
		if (checkedsub == chsub) {
			$(".allChecked").find("input").prop("checked", true);
			obj.calculateTotalPrice();
		} else {
			$(".allChecked").find("input").prop("checked", false);
			obj.calculateTotalPrice();
		}
	})
}

/**
 * description 页面初始化
 */
$(function(){
	obj.goodsInfo();
	obj.confirmOrder();
})

	