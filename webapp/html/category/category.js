

/**
 * @file            category.js
 * @description     商品分类JS
 * @author          王容易
 * @version         1.2.0
 * @date            2017/1/5
 * @copyright       河南巧脉信息技术有限公司
 */


var obj=new Object;
var mySwiper1;//初始化一级类目容器 ；
var mySwiper2;//初始化二级类目容器 ；
var goodsListHtml="";//商品列表的html内容
var categoryId;//一级类目id
var goodsId;//二级类目id
var pageNumber=0;//页码
var size=10;//每页显示的商品数量
var btn=false;//上拉加载判断开关
var searchName=sessionStorage.getItem("search");//搜索的关键字
/*var token=sessionStorage.getItem("token");//登录信息*/
var token=qmwx.Configs.token;//登录信息
var userBasePath=qmwx.Configs.userBasePath;//根目录
var configs={
	leftListUrl:"goodsCategory",
	goodsListUrl:"shopGoods",
	cartUrl:"cart/"
	
};//配置文件
/*var tokenGood="c1a500b283d54da8ad0e1edba430a359";*/

/*
 *初始化左侧一级类目
 * */
obj.initLeftList=function(){
	mui.ajax({
		type:"get",
		contentType: 'application/json;charset=utf-8',
        dataType: "json",
		url:userBasePath+configs.leftListUrl+"?token="+token,
		async:true,
		success:function(data){
			var leftConHtml='<div class="swiper-slide active">全部</div>';
			mui.each(data,function(k,v){
				leftConHtml+='<div data-id="'+v.id+'" class="swiper-slide">';
				leftConHtml+=v.name;
				leftConHtml+='</div>';
			});			
			$("#swiper-container1 .swiper-wrapper").html(leftConHtml);
			mySwiper1.update();
		},
		error:function(a){
			mui.alert("登录失败，请重新登录","登录失败","确定",function(){
				qmwx.switchPage("../login.html");
			});
			
			console.log("获取信息失败",a)
		}
	});	
}




/*
 *初始化上面二级类目
 * */
obj.initTopList=function(){
	mui.ajax({
		type:"get",
		contentType: 'application/json;charset=utf-8',
        dataType: "json",
		url:userBasePath+configs.leftListUrl+"?token="+token,
		async:true,
		success:function(data){
			var topHtml='<div class="swiper-slide active">全部</div>';
			categoryId=$("#swiper-container1 .active").attr("data-id");
			if(categoryId){
				$("#swiper-container2").show("slow");
				mui.each(data,function(k,v){
					if(v.id==categoryId){
						mui.each(v.children,function(index,ele){
							topHtml+='<div data-id="'+ele.id+'" class="swiper-slide">';
							topHtml+=ele.name;
							topHtml+='</div>';
						})
						
					}
				});				
			}else{
				$("#swiper-container2").hide();
			}
			$("#swiper-container2 .swiper-wrapper").html(topHtml);
			mySwiper2.update(true);	
			mySwiper2.slideTo(0);
			goodsListHtml="";
			obj.initGoodsList();
		}
	});
}


/*
 * 初始化商品列表
 */
obj.initGoodsList=function(){
	goodsId=$("#swiper-container2 .active").attr("data-id");
	categoryId=$("#swiper-container1 .active").attr("data-id");
	goodsListHtml="";
	if(goodsId){
		categoryId=goodsId;
	}else if(categoryId){
		categoryId=categoryId;
	}else{
		
		categoryId="";
	}
	if(searchName){
		searchName=searchName;
		sessionStorage.setItem("search","");//点击清空搜索关键字
		
	}else{
		searchName="";
	}
	mui.ajax({
		type:"get",
		contentType: 'application/json;charset=utf-8',
        dataType: "json",
        async:true,
        data: {
        	categoryId:categoryId,
        	searchName:searchName,
        	number:pageNumber,
        	size:size,
        },
		url:userBasePath+configs.goodsListUrl+"?token="+token,
		success:function(data){	
			if(btn){
				mui('#refreshContainer').pullRefresh().endPullupToRefresh(!data.content.length);
			}
			if(data.content.length){
				mui.each(data.content,function(k,v){
					if(v.productDate){
						var productDate='<i></i>'+v.productDate;
					}else{
						productDate="";
					}
					if(v.goods.imgUrlOfList){//判断是否有图片，没有的话用占位符
						var imgUrlOfList=v.goods.imgUrlOfList;
					}else{
						var imgUrlOfList="../../public/assets/img/model.png";
					};
					if(v.goods.cartNumber){//确定是否是购物车内的商品
						var cartNumber='<span>'+v.goods.cartNumber+'</span>';
					}else{
						var cartNumber="";
					};
					if(v.minOrderQuantity==1){//确定是否需要起订量和限订量
						var minimum="";
					}else{
						var minimum='<em data-minimum="'+v.minOrderQuantity+'">起订:'+v.minOrderQuantity+'</em>';
					};
					if(v.limitOrderQuantity==0){
						var maximum="";
					}else{
						var maximum='<b data-maximum="'+v.limitOrderQuantity+'">限订:'+v.limitOrderQuantity+'</b>';
					};
					if(v.stock){//判断是否售罄
						var soldOut="";
					}else{
						var soldOut='<span>售罄</span>';						
					}
					goodsListHtml+='<dl data-id="'+v.id+'"data-stock="'+v.stock+'" data-cartId="'+v.goods.cartId+'" data-cartNumber="'+v.goods.cartNumber+'">';
	    			goodsListHtml+='<dt>';			
	    			goodsListHtml+='<img src="'+imgUrlOfList+'"alt="图片获取失败"/>';					
	    			goodsListHtml+=	'<em></em>';				
	    			goodsListHtml+='<em>'+v.goods.skucode+'</em>';	
	    			goodsListHtml+=soldOut;
	    			goodsListHtml+='</dt>';				
	    			goodsListHtml+='<dd class="noWrap">'+v.goods.name+'</dd>';				
	    			goodsListHtml+='<dd><span>'+v.goods.standard+'</span></dd>';				
	    			goodsListHtml+='<dd><span>&yen</span><em>'+v.sellPrice+'</em><b>/'+v.goods.unit+'</b><p class="addCart">'+cartNumber+'</p></dd>';				
	    			goodsListHtml+='<dd>'+productDate+'<span>'+minimum+maximum+'</span></dd>';				
	    			goodsListHtml+='</dl>';	
				});
			}else{
				if(searchName&&pageNumber==0){
					mui.toast("未找到您要的商品");
				}
				
			}			
			$("#swiper-container3 .mui-scroll .goodsList").append(goodsListHtml);
			obj.initPullRefresh();
			btn=false;
		},
		error:function(a){
			console.log("获取数据失败",a)
		}
	});
}

/*
 * 初始化三个可滑动区域
 */
obj.initSwiper=function(){
	//设置商品展示的3个轮播图
	mySwiper1 = new Swiper ('#swiper-container1', {
	    direction: 'vertical',
	    slideToClickedSlide:true,
	    slidesPerView : "auto",
	    observer:true,//修改swiper自己或子元素时，自动初始化swiper
		observeParents:true,//修改swiper的父元素时，自动初始化swiper	  
	}) ;
	mySwiper1.on("tap",function(swiper){				
		$(swiper.clickedSlide).addClass("active").siblings().removeClass('active');	
		pageNumber=0;
		searchName="";
		$("#swiper-container3 .mui-scroll .goodsList").html("");
		obj.initTopList();//更新二级类目
		setTimeout(function(){
			mui('#refreshContainer').pullRefresh().refresh(true);//重置上拉加载
			mui('#refreshContainer').pullRefresh().scrollTo(0,0);
		},500);
		
	});
	mySwiper2 = new Swiper('#swiper-container2', {
		//和諧使用
		watchSlidesProgress : true,
		watchSlidesVisibility : true,
		slidesPerView : "auto",//'auto'
		initialSlide:1,
		spaceBetween : 2,
		observer:true,//修改swiper自己或子元素时，自动初始化swiper
		observeParents:true,//修改swiper的父元素时，自动初始化swiper
		onTap:function(swiper){
			pageNumber=0;
			searchName="";
			swiper.slides.removeClass("active").eq(swiper.clickedIndex).addClass("active");
			$("#swiper-container3 .mui-scroll .goodsList").html("");
			obj.initGoodsList();//更新商品列表
			setTimeout(function(){
				mui('#refreshContainer').pullRefresh().refresh(true);//重新初始化下拉加载功能
			},100);										
			swiper.slideTo(swiper.clickedIndex);			
			/*obj.initPullRefresh();*/
			/*mui('#refreshContainer').scroll().scrollTo(0,0);//100毫秒滚动到顶*/
		}
	});
}	
/*
 * 确定购物图标的背景图
 */
obj.changeIcon=function(){
	var addCart=$(".addCart");
	addCart.each(function(k,v){
		if(v.innerText){
			$(v).css("background-image","url(../../public/assets/img/che_dianji@2x.png)")
		}
	})
}

/*
 * 加入进货单
 */
obj.addCart=function(){
	$("#swiper-container3").on("tap",".addCart",function(){	
		if(!token){
			mui.alert("请登录");
		}
		var minNum=parseInt($(this).parent().next().find("em").attr("data-minimum"));
		var maxNum=parseInt($(this).parent().next().find("b").attr("data-maximum"));
		var goodStock=parseInt($(this).parent().parent().attr("data-stock"));
		minNum=minNum?minNum:1;
		maxNum=maxNum?maxNum:200;
		var spanText=$(this).text();
		var that=this;
		if($(this).text()){
			spanText++;
			if(maxNum<goodStock){
				if(spanText>maxNum){
					spanText=maxNum;					
					mui.toast('已达限订量',{
						duration:'long'
					});
				};
			}else{
				if(spanText>goodStock){
					spanText=goodStock;
					mui.toast('库存不足',{
						duration:'long'
					});
				}
			}
			
			
			var goodsNum=spanText;
			var shopGoodsId=$(this).parent().parent().attr("data-id");
			var cartId=$(this).parent().parent().attr("data-cartId");
			var postData={
				"shopGoodsId":shopGoodsId,
		        "number":goodsNum,
		        "id":cartId
			};	
			mui.ajax({
				type:"put",
				contentType: 'application/json;charset=utf-8',
		        dataType: "json",
		        async:true,
		        data: JSON.stringify(postData),
				url:userBasePath+configs.cartUrl+cartId+"?token="+token,
				success:function(data){
					/*console.log(data,that)*/					
				},
				error:function(message){
					console.log("添加数量失败");
				}
			});
		}else{			
			spanText=minNum;
			if(goodStock<minNum){
				spanText=0;		
				mui.toast('库存不足',{
					duration:'long'
				});
				return;
			}else{
				if(maxNum<goodStock){
					if(spanText>maxNum){
						spanText=maxNum;					
						mui.toast('已达限订量',{
							duration:'long'
						});
					};
				}else{
					if(spanText>goodStock){
						spanText=goodStock;
						mui.toast('库存不足',{
							duration:'long'
						});
					}
				}
			}
			
			var goodsNum=spanText;
			var shopGoodsId=$(this).parent().parent().attr("data-id");
			var postData={
				"shopGoodsId":shopGoodsId,
		        "number":goodsNum
			}	
			console.log(postData)
			mui.ajax({
				type:"post",
				contentType: 'application/json;charset=utf-8',
		        dataType: "json",
		        async:true,
		        data: JSON.stringify(postData),
				url:userBasePath+configs.cartUrl+"?token="+token,
				success:function(data){
					/*console.log(data);*/
					$(that).parent().parent().attr("data-cartId",data.id);
				},
				error:function(message){
					console.log("获取数据失败",message)
				}
			});
			
		};
		if(spanText){
			$(this).html(
				"<span>"+spanText+"</span>"
			);
		}		
		obj.changeIcon();			
	});
}
/*
 * 确定订货单内商品数量
 * */
obj.initGoodsNum=function(){
	var num=0;
	mui.ajax({
		type:"get",
		contentType: 'application/json;charset=utf-8',
        dataType: "json",
        async:true,
		url:userBasePath+configs.cartUrl+"?token="+token,
		success:function(data){			
			mui.each(data,function(k,v){				
				num+=v.number;
			});
			if(num){
				if(num>99){
					num="99+";
				};
				if($("#footer .shoppingList").find("b")){
					$("#footer .shoppingList").find("b").html(num);
				}else{
					var b=document.createElement("b");
					b.innerHTML=num;
					$("#footer .shoppingList").append(b);
				}
				
			}
		},
		error:function(message){
			console.log("获取数据失败",message)
		}
	});
}
/*
 * 初始化滚动区域
 */
obj.initScroll=function(){
	mui('#refreshContainer').scroll({
		deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		indicators: false,
		startX: 0, //初始化时滚动至x
 		startY: 0, //初始化时滚动至y
	});
}
/*
 * 上拉加载
 */
obj.pullupRefresh=function(){
	/*page++;*/
	btn=true;
	pageNumber++;
	setTimeout(function(){
     	obj.initGoodsList();
     },1000);
}

/*
 * 初始化上拉加载区域
 */	
obj.initPullRefresh=function(){
	mui.init({
	  pullRefresh : {
	    container:"#refreshContainer",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			auto:false,
			height:100,//可选.默认50.触发上拉加载拖动距离
		    contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
		    contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: obj.pullupRefresh//上拉加载回调函数
		}
	  }
	});
}

/*
 * 循环模板
 */
String.prototype.template = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];
        return (returns + "") == "undefined"? "": returns;
    });
};	
	
/*
 * 初始化页面
 */
$(function(){
	obj.initLeftList();
	obj.initTopList();
	obj.initSwiper();
	obj.changeIcon();
	obj.addCart();
	obj.initScroll();
	obj.initPullRefresh();
	/*obj.initGoodsNum();*/
})
	
