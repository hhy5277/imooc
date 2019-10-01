
Jx().$package("tank.robotState", function(J) {
    var $D = J.dom,
    $E = J.event;
	var isRobot=function(obj){
		return obj instanceof tank.Robot;
	};
	var isGun=function(obj){
		return obj instanceof tank.Gun;
	};
	var getMode=function(){
		return $D.id('battleMode').value;
	};
	var getUpdateFunc=function(d,speed,obj,speedType,onFinished){

		var mode=getMode();
		var acceDist;
		var slowDist;
		if(speedType==0){
			//acceDist=20;
			slowDist=20;
		}
		else{
			//acceDist=Math.PI/10;//不同速度类型的加速距离
			slowDist=Math.PI/10;//不同速度类型的减速距离
		}

		if(d<0) speed*=-1;
		var oriSpeed=speed;
		//var oriD=d;
		//obj.speed[speedType]=speed=0;

		var isFinish=false;
		return function(){
			var robot=obj.robot||obj;

			if(Math.abs(d)<slowDist&&speedType==0){//减速过程
				speed=Math.abs(d)/slowDist*oriSpeed;
			}
			if(Math.round(d*100)==0||Math.abs(speed)>=Math.abs(d)){
				speed=d;
				isFinish=true;
				if(mode!="dev"){
					if(J.isNumber(onFinished)){
						//worker发送行为完成的通知	
						tankKeyObj[robot.name]["worker"].postMessage({"mId":onFinished});
						onFinished=null;
					}					
				}
				else if(J.isFunction(onFinished)){
					//eval则直接执行回调
					onFinished.call(robot);
					onFinished=null;
				}
			}
			obj.speed[speedType]=speed;
			obj.preSpeed=obj.speed.slice();
			d-=speed;
			return isFinish;
		}

	};
	var updateObj=function(moveSpeed,turnSpeed){//更新后的值
		this.moveSpeed=moveSpeed;
		this.turnSpeed=turnSpeed;
	};
	this.State=function(options){
		this.init(options);

	};
	this.State.prototype={
		init:function(options){
			options=options||{};
			this.name=options.name;
			this.owner=options.owner;
			this.distance=options.distance;
			this.power=options.power;
			this.angle=options.angle;
			this.gunAngle=options.gunAngle;
			this.radarAngle=options.radarAngle;
			this.updateFuncList=[];//update函数列表
			this.onMoveFinished=options.onMoveFinished;
			this.onTurnFinished=options.onTurnFinished;
			this.onGunTurnFinished=options.onGunTurnFinished;
			this.onRadarTurnFinished=options.onRadarTurnFinished;
		},
		update:function(){
			var isFinish=true;
			for(var i=0;i<this.updateFuncList.length;i++){
				if(!this.updateFuncList[i]())
					isFinish=false;
			}
			return isFinish;
		},
		setOptions:function(options){
			for(var name in options){
				if(options.hasOwnProperty(name))
					this[name]=options[name];
			}
		},

		addFunc:function(options){
			
			options=options||this;
			var owner=options.owner;
			if(options.stop){
				this.updateFuncList.push(function(){
					if(options.owner.currentEvtName)//事件里 则清除主循环的状态
					owner.stateManager.cleanMainStateList();
					//options.owner.stateManager.cleanEventStateList();
					///options.owner.hasStop=true;
					return true;
				});
			}
			if(options.power){
				this.updateFuncList.push(function(){
					owner.gun.fire(options.power);
					return true;
				});				
			}
			if(options.scan){
				this.updateFuncList.push(function(){
					owner.radar.canScan=true;
					//options.owner.radar.runScan=true;
					if(owner.currentEvtName=="scannedRobot"){///中断重新执行正在执行的onScannedRobot
						owner.currentEvtName=null;

					}
					return true;
				});				
			}
			if(!J.isUndefined(options.distance)){
				this.updateFuncList.push(getUpdateFunc(options.distance,
					owner.moveSpeed,
					owner,
					0,
					options.onMoveFinished
				));
			}
			if(!J.isUndefined(options.angle)){
				this.updateFuncList.push(getUpdateFunc(options.angle,
					owner.turnSpeed,
					owner,
					1,
					options.onTurnFinished
				));
				if(!owner.isAdjustGunForRobotTurn){//枪跟随坦克旋转
					options.gunAngle=options.angle;
					if(!this.owner.isAdjustRadarForRobotTurn){//雷达跟随坦克旋转
						options.radarAngle=options.angle;
					}
				}
			}
			if(!J.isUndefined(options.gunAngle)){
				this.updateFuncList.push(getUpdateFunc(options.gunAngle,
					owner.gun.turnSpeed,
					owner.gun,
					1,
					options.onGunTurnFinished
				));
				if(!owner.isAdjustRadarForGunTurn){//雷达跟随枪旋转
					options.radarAngle=options.gunAngle;
				}
			}
			if(!J.isUndefined(options.radarAngle)){
				this.updateFuncList.push(getUpdateFunc(options.radarAngle,
					owner.radar.turnSpeed,
					owner.radar,
					1,
					options.onRadarTurnFinished
				));
			}
		}

	}

	this.StateManager=function(options){
		this.init(options);
	};
	this.StateManager.prototype={
		init:function(options){
			this.currentMainStateIndex=0;
			this.currentEventStateIndex=0;
			this.mainStateList=[];//主程序状态队列
			this.eventStateList=[];//事件状态队列
			this.owner=options.owner;
			this.onFinished=options.onFinished;

		},
		update:function(){
			this.updateMainState();
			this.updateEventState();
		},
		updateMainState:function(){
			var mode=getMode();
			var currentMainState=this.mainStateList[0];
			if(currentMainState){
				var isFinishMain=currentMainState.update();//是否完成当前状态
				if(isFinishMain){
					if(mode!="dev"){
						tankKeyObj[this.owner.name]["worker"].postMessage({"mId":currentMainState.onFinished});
					}
					else{
						currentMainState.onFinished&&currentMainState.onFinished.call(this.owner);	
					}
					currentMainState.onFinished=null;	
					this.toNextMainState();

				}
			}			

		},
		updateEventState:function(){
			var mode=getMode();
			var currentEventState=this.eventStateList[0];
			if(currentEventState){	
				var isFinishEvent=currentEventState.update();//是否完成当前状态
				if(isFinishEvent){
					if(mode!="dev"){
						tankKeyObj[this.owner.name]["worker"].postMessage({"mId":currentEventState.onFinished});			
					}
					else{
						currentEventState.onFinished&&currentEventState.onFinished.call(this.owner);
					}
					currentEventState.onFinished=null;	
					this.toNextEventState();
					if(!this.eventStateList.length){
						this.owner.currentEvtName=null;
					}
				}
			}
		},
		getCurrentState:function(owner){
			if(owner.isInterEvent&&this.eventStateList.length>0){
				return this.eventStateList[0];
			}
			return this.mainStateList[0];
		},
		addState:function(state){

			state.addFunc();
			if(state.owner.isInterEvent){
				this.addAsEvent(state);
			}
			else{
				this.addAsMain(state);
			}
			
		},
		addAsMain:function(state){
			this.mainStateList.push(state);
		},
		addAsEvent:function(state){
			this.eventStateList.push(state);
		},
		toNextMainState:function(){

			this.mainStateList.splice(0,1);

		},
		toNextEventState:function(){
			this.eventStateList.splice(0,1);
		},
		cleanMainStateList:function(){
			this.mainStateList=[];
		},
		cleanEventStateList:function(){
			this.eventStateList=[];
			this.owner.currentEvtName=null;
		},
		getMainListLength:function(){
			return this.mainStateList.length;
		},
		getEventListLength:function(){
			return this.eventStateList.length;

		}
	};
});