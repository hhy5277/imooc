var RADIUS = 12 ;
var Win_W = 0 ;
var Win_H = 0 ;
var WORDS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var colors = ["#FF69B4","#FF4500","#8968CD","#7FFF00","#5CACEE","#76EE00","#9400D3","#CD00CD","#E9967A","#EEC900"] ;

var sballs = [] ;	//屏幕上的字母
var score = 0 ;		//正确的个数
var err = 0 ;		//出去的个数
var context = '' ;
window.onload=function(){

	getPlayer();
	getRisk();

	var canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    Win_W = context.canvas.width ;
    Win_H = context.canvas.height ;

    nostart(context);

    document.getElementById("begin").onclick=function()
    {
    	onstart(context);
    }
    document.getElementById("share").onclick=function()
	{
		alert("您的浏览器不支持此功能！")
	}
 	// addball();
	// window.onkeydown = function(e){
	// 	keyCtl(e);
	// } ;
    
	// //重绘字母
 //    setInterval(function(){        
 //        drawballs(context);
 //        update();
 //    },1000/10)	

 //    //添加字母
 //    var t = 900-10*score ; //间隔时间
 //    setInterval(function(){              
 //    	if(score <= 50)
 //    		t = 900-10*score;
 //    	else if( score > 50 && score < 80 )
 //    		t = 350 ;
 //    	else 
 //    		t = 300 ;

 //    	if(sballs.length <= score && sballs.length < 20)
 //    	 	addball();
 //    	else
 //    		return ;
 //    },t)

}
function keyCtl(event)
{
	// var e = event || window.event || arguments.callee.caller.arguments[0] ;
	// var code = String.fromCharCode(e.keyCode) ;

	var e = (event) ? event : ((window.event) ? window.event : arguments.callee.caller.arguments[0]);
    var code = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
    code = String.fromCharCode(code) ;

    for(var i=0;i<sballs.length;i++)
    {
    	if(sballs[i].text == code)
    	{
    		score += 1 ;
			sballs.splice(i,1);
    	}
    }
}
function drawballs(ctx)
{
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for(var j = 0 ; j < sballs.length ; j++)
	{
 		drawball(ctx,sballs[j]);
 	}
}
function drawball(ctx,aball)
{
	ctx.beginPath();
	ctx.strokeStyle = "rgba(230,230,230,.9)";
	ctx.fillStyle = aball.vc ;
	ctx.arc(aball.x, aball.y, RADIUS, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
	

 	ctx.font = "14px Verdana" ;
 	ctx.fillStyle = "white" ;
 	ctx.fillText(aball.text, aball.x - 5, aball.y + 5 ) ;
}

function addball()
{
	var j = Math.floor( Math.random()*WORDS.length );
	var vy = 0 ;

	if(score <= 80 )
		vy = 0.2*score + 2.5 ;
	else
		vy = 20 ;

	var abll = {
		text:WORDS[j],
		x: getRondamX() ,
		y: getRondamY() ,
		vx: getRondamVx() ,
		vy: vy ,
		vc: colors[getRondamCol()]
	};
	sballs.push(abll);
}
function update()
{
	for(var i=0;i<sballs.length;i++)
	{
		sballs[i].y += sballs[i].vy ;
		sballs[i].x += sballs[i].vx ;
	}

	var cnt = 0 ;
	for(var i=0;i<sballs.length;i++)
	{
		if(sballs[i].x - 0 < Win_W && sballs[i].x - 0 > 0 && sballs[i].y - 0 < Win_H )
		{
			sballs[cnt++] = sballs[i];
		}
		else
			err ++ ;
	}

	for(cnt;cnt<sballs.length;cnt++)
	{
		var j = Math.floor( Math.random()*WORDS.length );
		var vy = 0 ;
		if(score <= 80 )
			vy = 0.2*score + 2.5 ;
		else
			vy = 22 ;
	
		var abll = {
			text:WORDS[j],
			x: getRondamX() ,
			y: getRondamY() ,
			vx: getRondamVx() ,
			vy: vy ,
			vc: colors[getRondamCol()]
		};
		sballs.splice(cnt,1,abll);
	}
	console.log(err)
	if(err >= 15 )
	{
		document.getElementById("score").innerHTML = score ;
		document.getElementById("begin").innerHTML = "重新开始" ;
		nostart(context);
	}
}
// 未开始时初始状态
var start = false ;
var ballval = 0 ;
var tval = 0 ;
function nostart(ctx)
{
	document.getElementsByClassName("bg")[0].style.display='';
	document.getElementsByClassName("tips")[0].style.display='';
	document.getElementsByClassName("risklist")[0].style.display='';

	start = false ;
	err = 0 ;
	score = 0 ;
	clearInterval(ballval) ;
	clearInterval(tval) ;
	sballs = [] ;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ballval = setInterval(function(){        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for(var i=0;i<5;i++)
        {
        	addball();
        }
        for(var j = 0 ; j < 5 ; j++)
		{
	 		drawball(ctx,sballs[j]);
	 	}
	 	for(var i=0;i<5;i++)
		{
			sballs[i].y += sballs[i].vy ;
			sballs[i].x += sballs[i].vx ;

			if(sballs[i].y >= Win_H - 12 || sballs[i].y <= 12)
				sballs[i].vy *= -1 ;
			if(sballs[i].x >= Win_W - 12 || sballs[i].x <= 12 )
				sballs[i].vx *= -1 ;
		}
    },1000/10)	
}
// 开始函数
function onstart(ctx)
{

	document.getElementsByClassName("bg")[0].style.display='none';
	document.getElementsByClassName("tips")[0].style.display='none';
	document.getElementsByClassName("risklist")[0].style.display='none';

	start = true ;
	sballs.length = 0 ;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	clearInterval(ballval);
	clearInterval(tval);

	addball();
	window.onkeydown = function(e){
		keyCtl(e);
	} ;
    
	//重绘字母
    ballval = setInterval(function(){  
        drawballs(ctx);
        update();
    },1000/10)	

    //添加字母
    var t = 900-10*score ; //间隔时间
    tval = setInterval(function(){              
    	if(score <= 50)
    		t = 900-10*score;
    	else if( score > 50 && score < 80 )
    		t = 350 ;
    	else 
    		t = 300 ;

    	if(sballs.length <= score && sballs.length < 25)
    	{ 	
    		addball();
    	 	var m = Math.random();
    	 	if(m > 0.5)
    	 		addball();
    	}
    	else
    		return ;
    },t)
}
// 常用随机函数
function getRondamX()
{
	var nor = Math.random()*Win_W - 0 ; 	
	return nor ;
}
function getRondamY()
{
	var nor ;
	if(!start){
		nor = Math.random()*Win_H ;
		return nor ;
	}
	else{ 
		nor = Math.random()*20 + 30 ;
		return 0 - nor ;
	}
}
function getRondamVx()
{
	return ( Math.random() - 0.5 ) * 4 ;
}
function getRondamCol()
{
	return Math.floor(Math.random()*colors.length);
}
function loadshow()
{
	document.getElementsByClassName("loadbox")[0].style.display='';
}
function loadhide(){
	document.getElementsByClassName("loadbox")[0].style.display='none';
	document.getElementById("nicheng").value = '';
}
// 获取排行和人数
// 1发送分数
function sentResult()
{
	var name = document.getElementById("nicheng").value ;
	if(name == '')
	{
		alert("请输入昵称！");
		return ;
	}
	var score = document.getElementById("score").innerHTML ;
	if(score == 0)
	{
		alert("你还没有开始玩游戏呢！");
		return ;
	}

	document.getElementsByClassName("loadbox")[0].style.display='none';
	document.getElementById("nicheng").value = '';

	$.ajax({
	     type: "GET",
	     url: "http://1.wshome.sinaapp.com/h5-web/game/drop-words/send.php",
	     data: {"name":name,"score":score},
	     dataType: "jsonp",
	     crossDomain:"true",
	     jsonpCallback:"sentBack"
 	});
}
function sentBack(json)
{
	if(json.status == 'ok')
		getRisk();
	else
	{
		alert("服务器繁忙，请重试！")
		return ;
	}
}
// 2获取人数
function getPlayer()
{
	$.ajax({
	     type: "GET",
	     url: "http://1.wshome.sinaapp.com/h5-web/game/drop-words/getrisk.php",
	     data: {"game":"dropwords","type":"num"},
	     dataType: "jsonp",
	     crossDomain:"true",
	     jsonpCallback:"getPlayerBack"
 	});
}
function getPlayerBack(json)
{
	$("#pnum").text(json.num);
}

// 3获取排名
function getRisk()
{
	$.ajax({
	     type: "GET",
	     url: "http://1.wshome.sinaapp.com/h5-web/game/drop-words/getrisk.php",
	     data: {"game":"dropwords","type":"risk"},
	     dataType: "jsonp",
	     crossDomain:"true",
	     jsonpCallback:"getRiskBack"
 	});
}
function getRiskBack(json)
{
    var data = json.txt;        //全部tips的txt格式
    var rel = data.split('|');
    var len = rel.length - 1;   // 最后实际有一条为空数据
    var _htm = '<tr><th>昵称</th><th>分数</th></tr>';
    if(len==0)
    {
    	_htm += '<tr><td rowspan="2">系统崩溃，请稍后再试！</td></tr>';
    }
    else
    {
        for(var i=0;i<len;i++)
        {
            mes = eval('(' + rel[i] + ')');

            _htm += '<tr><td>'+ mes.name +'</td><td>'+mes.score+'</td></tr>';
        }
    }
    $("#list").empty();
    $("#list").append(_htm);
}