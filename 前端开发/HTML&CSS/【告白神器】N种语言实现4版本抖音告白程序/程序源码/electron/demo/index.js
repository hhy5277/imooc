let agree=document.querySelector("#agree")
agree.onclick=function(){
	alert("小姐姐，晚上下班一起走呗？")
}

let disagree=document.querySelector("#disagree")
disagree.onmouseenter=function(){
	let x=Math.random()*600
	let y=Math.random()*400
	disagree.style.left=x+"px"
	disagree.style.top=y+"px"
}