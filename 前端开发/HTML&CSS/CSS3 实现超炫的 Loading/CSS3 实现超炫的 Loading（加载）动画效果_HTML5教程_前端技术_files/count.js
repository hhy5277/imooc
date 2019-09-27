//右下角百度var cpro_id = "u772717";
//document.write('<script src="http://cpro.baidustatic.com/cpro/ui/f.js" type="text/javascript"></script>');

var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fc262f1b4e591bbe53a5acb2f325c6f81' type='text/javascript'%3E%3C/script%3E"));

//2345右下角飘浮
//BAIDU_CLB_SLOT_ID = "1001508";
//document.write('<script type="text/javascript" src="http://cbjs.baidu.com/js/o.js"></script>');

lastScrollY=0;
function heartBeat(){ 
var diffY;
if (document.documentElement && document.documentElement.scrollTop)
	diffY = document.documentElement.scrollTop;
else if (document.body)
	diffY = document.body.scrollTop
else
    {/*Netscape stuff*/}
	
//alert(diffY);
percent=.1*(diffY-lastScrollY); 
if(percent>0)percent=Math.ceil(percent); 
else percent=Math.floor(percent); 
//document.getElementById("lovexin12").style.top=parseInt(document.getElementById("lovexin12").style.top)+percent+"px";
//document.getElementById("lovexin14").style.top=parseInt(document.getElementById("lovexin12").style.top)+percent+"px";
 
lastScrollY=lastScrollY+percent; 
//alert(lastScrollY);
}//from alixixi.com
//suspendcode12="<DIV id=\"lovexin12\" style='left:0;position:absolute;TOP:190px;width:60px;height:220px;background:#efefef'><a href='http://zs.ewall.com.cn/' target='_blank'><img src='http://www.alixixi.com/adsview/u1.gif'></a></div>"
//suspendcode14="<DIV id=\"lovexin14\" style='right:0;position:absolute;TOP:190px;width:60px;height:220px;background:#efefef''><a href='http://zs.ewall.com.cn/' target='_blank'><img src='http://www.alixixi.com/adsview/u2.gif'></a></div>"
//document.write(suspendcode12); 
//document.write(suspendcode14); 
//window.setInterval("heartBeat()",1);
