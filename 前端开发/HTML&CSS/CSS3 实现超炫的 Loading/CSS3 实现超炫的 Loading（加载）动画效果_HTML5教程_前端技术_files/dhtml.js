var xmlHttp=null;
function setcount(cp,id)
{
if (id.length==0)
  { 
  document.getElementById("hits").innerHTML="";
  return;
  }
try
  {// Firefox, Opera 8.0+, Safari, IE7
  xmlHttp=new XMLHttpRequest();
  }
catch(e)
  {// Old IE
  try
    {
    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  catch(e)
    {
    alert ("Your browser does not support XMLHTTP!");
    return;  
    }
  }
var url=cp + 'stat.asp?s=1&id=' + id;
url=url+"&sid="+Math.random();
xmlHttp.open("GET",url,false);
xmlHttp.send(null);
document.getElementById("hits").innerHTML=xmlHttp.responseText;

var url= '/ajaxservice.asp?at=digg&id=' + id;
url=url+"&sid="+Math.random();
xmlHttp.open("GET",url,false);
xmlHttp.send(null);
document.getElementById("digg").innerHTML=xmlHttp.responseText.split('|')[1];

}

function digg(id) {
if (id.length==0)
  { 
  document.getElementById("digg").innerHTML="0";
  return;
  }
try
  {// Firefox, Opera 8.0+, Safari, IE7
  xmlHttp=new XMLHttpRequest();
  }
catch(e)
  {// Old IE
  try
    {
    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  catch(e)
    {
    alert ("Your browser does not support XMLHTTP!");
    return;  
    }
  }
var url= '/ajaxservice.asp?s=1&at=digg&id=' + id;
url=url+"&sid="+Math.random();
xmlHttp.open("GET",url,false);
xmlHttp.send(null);
alert(xmlHttp.responseText.split('|')[0]);
document.getElementById("digg").innerHTML=xmlHttp.responseText.split('|')[1];

}
function bbimg(o){
	var zoom=parseInt(o.style.zoom, 10)||100;zoom+=event.wheelDelta/12;if (zoom>0) o.style.zoom=zoom+'%';
	return false;
}
function imgzoom(img,maxsize){
	var a=new Image();
	a.src=img.src
	if(a.width > maxsize)
	{
		img.style.width=maxsize;
	}
	else if(a.width >= maxsize)
	{
		img.style.width=Math.round(a.width * Math.floor(maxsize / a.width));
	}
	return false;
}

//图片自动调整的模式，1为按比例调整 ，2 按大小调整。
var resizemode=1
function imgresize(o){
	 if (resizemode==2 || o.onmousewheel){
	 	if(o.width > 500 ){
				o.style.width='500px';
			}
			if(o.height > 800){
				o.style.height='800px';
			}
		}else{
		var parentNode=o.parentNode.parentNode
		if (parentNode){
		if (o.offsetWidth>=parentNode.offsetWidth) o.style.width='98%';
		}else{
		var parentNode=o.parentNode
		if (parentNode){
			if (o.offsetWidth>=parentNode.offsetWidth) o.style.width='98%';
			}
		}
	}
}
