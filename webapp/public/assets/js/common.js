/**
 * @file            common.js
 * @description     公共配置JS
 * @author          王要伟
 * @version         1.0.0
 * @date            2017/01/10
 * @copyright       河南巧脉信息技术有限公司
 */
var qmwx =(function(){
	var userBasePath="http://store.api.linjia.top:8083/shop/";
	var _configs ={
	   basePath:'http://wechat.linjia.top/',
	   userBasePath:"http://store.api.linjia.top:8083/shop/",
	   //userBasePath:'http://192.168.1.102:8083/shop/',
       token:window.sessionStorage.getItem("token")
	};
	return {
		Configs:_configs,
		//页面跳转的实现
		switchPage:function(url){
			mui.openWindow({
		    url:url,
		    id:url,
		    styles:{
		      /*top:newpage-top-position,//新页面顶部位置
		      bottom:newage-bottom-position,//新页面底部位置
		      width:newpage-width,//新页面宽度，默认为100%
		      height:newpage-height,//新页面高度，默认为100%
		      ......*/
		    },
		    extras:{
		    	selfName:"你好"
		      /*.....//自定义扩展参数，可以用来处理页面间传值*/
		    },
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow:"slide-in-right",//页面显示动画，默认为”slide-in-right“；
		      duration:100//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		    },
		    waiting:{
		      autoShow:true,//自动显示等待框，默认为true
		      title:'加载中...',//等待对话框上显示的提示内容
		      /*options:{
		        width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
		        height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
		        ......
		      }*/
		    }
		});
		/*return false;*/
		}
	}
})();

$(function(){
	//超出一定宽度后，页面的大小不再改变
	var deviceW=parseInt(window.screen.availWidth);
	if(deviceW>=900){
		$("html").css("max-width","900px");
		$("body").css("max-width","900px");		
		if($("body").width()==900){
			$("html").css({"font-size":"120px","margin":"0 auto"});
			$("#header").css("width","900px");
			$("#footer").css("width","900px");
		}
	}
	//底部切换按钮
	$("body").on("tap",".simulationA",function(){
		var url=$(this).attr("data-url");
		if(url){
			qmwx.switchPage(url);
		}
	});
})
	
