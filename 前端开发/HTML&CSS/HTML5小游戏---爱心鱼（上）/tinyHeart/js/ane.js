var aneObj = function(){
	//start point, control point, end point(sin)
	this.rootx = [];
	this.headx = [];
	this.heady = [];
	this.alpha = 0;
	this.amp = [];
	//this.len = [];
}
aneObj.prototype.num = 50;
aneObj.prototype.init = function(){
	var h = can1.height;
	for (var i = 0; i <this.num; i++) {
		this.rootx[i] = i * 16 + Math.random() * 20;//[0,1)
		this.headx[i] = this.rootx[i];
		this.heady[i] = h - 250 + Math.random() * 50;
		this.amp[i] = Math.random() * 50 + 50;
		//this.len[i] = 200 + Math.random() * 50;
	}
}	
aneObj.prototype.draw = function(){
	this.alpha += deltaTime * 0.0008;
	var l = Math.sin(this.alpha);
	ctx2.save();
	ctx2.globalAlpha = 0.6;
	ctx2.lineWidth = 20;
	ctx2.lineCap = "round";
	ctx2.strokeStyle= "#3b154e";
	for (var i = 0; i < this.num; i++) {
		//beginPath, moveTo, lineTo, stroke, strokeStyle, lineWidth,lineCap
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i], canHeight);
		this.headx[i] = this.rootx[i] + l * this.amp[i];
		//ctx2.lineTo(this.x[i], canHeight - this.len[i]);		
		ctx2.quadraticCurveTo(this.rootx[i], canHeight - 100, this.headx[i], this.heady[i]);
		
		ctx2.stroke();
	}
	ctx2.restore();
}	
