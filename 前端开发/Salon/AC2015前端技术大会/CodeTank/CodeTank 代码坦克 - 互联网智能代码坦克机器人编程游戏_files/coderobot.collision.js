
Jx().$package("codeTank.collision",function(J){

	var cg=J.cnGame;
	//获取该矩形上的垂直的两个轴
	var getTwoAxis=function(rectPointsArr){
		var p0=rectPointsArr[0];
		var p1=rectPointsArr[1];
		var p2=rectPointsArr[2];
		axis1=[p0,p1];
		axis2=[p1,p2];
		return [axis1,axis2];
	};
	//获取该矩形上的四条边
	var getFourLines=function(rectPointsArr){
		var p0=rectPointsArr[0];
		var p1=rectPointsArr[1];
		var p2=rectPointsArr[2];
		var p3=rectPointsArr[3];
		var l1=[p0,p1];
		var l2=[p1,p2];
		var l3=[p2,p3];
		var l4=[p3,p0];
		return [l1,l2,l3,l4];

	}
	var getTYPoing=function(p,axis){//获取点在轴上的投影点
		//顶点在轴上的投影
		var x=((p[0]*axis[0]+p[1]*axis[1])/(axis[0]*axis[0]+axis[1]*axis[1]))*axis[0];
		var y=((p[0]*axis[0]+p[1]*axis[1])/(axis[0]*axis[0]+axis[1]*axis[1]))*axis[1];
		return [x,y];
	};
	var getLineTYToAxis=function(line,axis){//线到轴的投影
	
		var a=[axis[1][0]-axis[0][0],axis[1][1]-axis[0][1]];//轴向量
		var p0=line[0];//线的一个顶点0
		var p1=line[1];//线的一个顶点1
		var pt0=getTYPoing(p0,a);
		var pt1=getTYPoing(p1,a);
		return [pt0,pt1];
		
	};
	var isLineOverlap=function(l1,l2){//判断线段是否重叠
		
		var l1p1=l1[0],l1p2=l1[1],l2p1=l2[0],l2p2=l2[1];
		if(l1p1[0]!=l2p1[0]){//非垂直X轴的两线段
			if((l1p1[0]-l2p1[0])*(l1p1[0]-l2p2[0])<0||(l1p2[0]-l2p1[0])*(l1p2[0]-l2p2[0])<0||(l2p1[0]-l1p1[0])*(l2p1[0]-l1p2[0])<0||(l2p2[0]-l1p1[0])*(l2p2[0]-l1p2[0])<0){
				return true;
			}
		}
		else{
			if((l1p1[1]-l2p1[1])*(l1p1[1]-l2p2[1])<0||(l1p2[1]-l2p1[1])*(l1p2[1]-l2p2[1])<0||(l2p1[1]-l1p1[1])*(l2p1[1]-l1p2[1])<0||(l2p2[1]-l1p1[1])*(l2p2[1]-l1p2[1])<0){
				return true;
			}			
		}
		return false;
	}
	var detectAxisCollision=function(axis,lineArr){//矩形的轴和另一个矩形要比较的四个边
		
		for(var i=0,len=lineArr.length;i<len;i++){
			var tyLine=getLineTYToAxis(lineArr[i],axis);//获取线段在轴上的投影线段 [[a,b],[a1,b1]]
			var tyAxis=getLineTYToAxis(axis,axis);
			
			if(isLineOverlap(tyLine,tyAxis)){
				return true;
			}
		}
		return false;
	};
	this.collisionDetect=function(r1,r2){//碰撞检测入口方法
		var rect1=r1.getRect();
		var rect2=r2.getRect();

		var linesArr1=getFourLines(rect1.pointsArr);//矩形1的四个边
		var linesArr2=getFourLines(rect2.pointsArr);//矩形2的四个边
		
		if(detectAxisCollision(linesArr2[0],linesArr1)&&detectAxisCollision(linesArr2[1],linesArr1)&&detectAxisCollision(linesArr1[0],linesArr2)&&detectAxisCollision(linesArr1[1],linesArr2)){
			return true;
		}
		return false;
	};
});



