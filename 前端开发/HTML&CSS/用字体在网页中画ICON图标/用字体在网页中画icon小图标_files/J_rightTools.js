$(function(){
	$("body").append("<div id='J_rightTools'>");
	$("#J_rightTools").append("<div class='rightTools'>");
	var sFloorTitle = "";
	sFloorTitle += "<a class='robot-help' href='javascript:;' onclick='ib_wopen();'></a>";
	sFloorTitle += "<a class='bdsharebuttonbox shareBnt bds_more' data-cmd='more' href=''>分享</a>";
	sFloorTitle += "<script>with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];</script>";
	
	
	$(".rightTools").append(sFloorTitle);
})