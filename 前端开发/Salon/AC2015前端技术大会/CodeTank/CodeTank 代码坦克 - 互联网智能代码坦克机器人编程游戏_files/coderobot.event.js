Jx().$package("codeTank.event", function(J) {
  /**
	* @namespace	
	* @name tank
	* @type Object
	*/
	var cg=J.cnGame,
	config=tank.config,
	em=cg.eventManager;
	var $D = J.dom,
    $E = J.event;

	var getMode=function(){
		return $D.id('battleMode').value;
	};

	/**
	 * 子弹击中其他robot的事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name BulletHitEvent
	 * @return BulletHitEvent实例
	 */
	this.BulletHitEvent=function(options){

		this.name=options.name;		//被打中robot的名字
		this.energy=options.energy;//被打中robot的剩余energy
		this.bullet=options.bullet;//打中其他robot的子弹
	}
	this.BulletHitEvent.prototype={
		/**
		 * 获取击中敌人的子弹对象
		 * 
		 * @name getBullet
		 * @function
		 * @memberOf codeTank.event.BulletHitEvent.prototype
		 * @return {Object} 击中敌人的子弹对象
		 */
		getBullet:function(){
			return this.bullet;
		},
		/**
		 * 获取击中的敌人的名字
		 * 
		 * @name getName
		 * @function
		 * @memberOf codeTank.event.BulletHitEvent.prototype
		 * @return {Number} 击中的敌人的名字
		 */		
		getName:function(){
			return this.name;
		},
		/**
		 * 获取击中的敌人的能量
		 * 
		 * @name getEnergy
		 * @function
		 * @memberOf codeTank.event.BulletHitEvent.prototype
		 * @return {Number} 击中的敌人的能量
		 */				
		getEnergy:function(){
			return this.energy;
		}
	}
	/**
	 * 子弹击中其他robot的子弹的事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name BulletHitBulletEvent
	 * @param {Object} options 初始化参数
	 * @return {Object} BulletHitBulletEvent实例
	 */	

	this.BulletHitBulletEvent=function(options){

		this.bullet=options.bullet;//击中其他子弹的子弹
		this.hitBullet=options.hitBullet;//被robot的子弹击中的子弹
	}
	this.BulletHitBulletEvent.prototype={
		/**
		 * 获取击中的敌人子弹的子弹
		 * 
		 * @name getBullet
		 * @function
		 * @memberOf codeTank.event.BulletHitBulletEvent.prototype
		 * @return {Object} 击中的敌人子弹的子弹
		 */			
		getBullet:function(){
			return this.bullet;
		},
		/**获取被击中的子弹
		 * 
		 * @name getHitBullet
		 * @function
		 * @memberOf codeTank.event.BulletHitBulletEvent.prototype
		 * @return {Object} 击被击中的子弹
		 */			
		getHitBullet:function(){
			return this.hitBullet;
		}
	}
	/**
	 * 子弹击中墙壁的事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name BulletMissedEvent
	 * @param {Object} options 初始化参数
	 * @return BulletMissedEvent实例
	 */		
	this.BulletMissedEvent=function(options){
		this.bullet=options.bullet;///missed的子弹
	}
	this.BulletMissedEvent.prototype={
		/**获取射失的子弹
		 * 
		 * @name getBullet
		 * @function
		 * @memberOf codeTank.event.BulletMissedEvent.prototype
		 * @return {Object} 射失的子弹
		 */		
		getBullet:function(){
			return this.bullet;
		}
	}
	/**
	 * robot死亡的事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name DeathEvent
	 * @param {Object} options 初始化参数
	 * @return DeathEvent实例
	 */			
	this.DeathEvent=function(options){

	}
	/**
	 * 被其他子弹击中的事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name HitByBulletEvent
	 * @param {Object} options 初始化参数
	 * @return HitByBulletEvent实例
	 */		
	this.HitByBulletEvent=function(options){

		this.bearing=options.bearing;//子弹相对于robot的方向
		this.bullet=options.bullet;//击中robot的子弹对象
	}
	this.HitByBulletEvent.prototype={
		/**获取子弹相对于robot的角度
		 * 
		 * @name getBearing
		 * @function
		 * @memberOf codeTank.event.HitByBulletEvent.prototype
		 * @return {Object} 射失的子弹
		 */			
		getBearing:function(){
			return this.bearing;
		},
		/**获取子弹
		 * 
		 * @name getBullet
		 * @function
		 * @memberOf codeTank.event.HitByBulletEvent.prototype
		 * @return {Object} 击中的子弹
		 */			
		getBullet:function(){
			return this.bullet;	
		},
		/**获取子弹朝向
		 * 
		 * @name getHeading
		 * @function
		 * @memberOf codeTank.event.HitByBulletEvent.prototype
		 * @return {Number} 击中的子弹
		 */			
		getHeading:function(){//子弹的朝向
			return this.bullet.getHeading();
		},
		/**获取发出子弹的robot的名字
		 * 
		 * @name getName
		 * @function
		 * @memberOf codeTank.event.HitByBulletEvent.prototype
		 * @return {String} 发出子弹的robot的名字
		 */			
		getName:function(){//返回发出子弹的robot的名字
			return this.bullet.robot.getName();
		},
		/**获取子弹的power
		 * 
		 * @name getPower
		 * @function
		 * @memberOf codeTank.event.HitByBulletEvent.prototype
		 * @return {Number} 子弹的power
		 */			
		getPower:function(){//返回子弹的power
			return this.bullet.power;
		},
		/**获取子弹的速度
		 * 
		 * @name getSpeed
		 * @function
		 * @memberOf codeTank.event.HitByBulletEvent.prototype
		 * @return {Number} 子弹的速度
		 */			
		getSpeed:function(){
			return this.bullet.getSpeed();	
		}
	}
	/**
	 * 撞到其他robot的事件
	 * @memberOf codeTank.event
	 * @class
	 * @name HitRobotEvent
	 * @param {Object} options 初始化参数
	 * @return HitRobotEvent实例
	 */		
	this.HitRobotEvent=function(options){

		this.name=options.name;//撞到的robot的名字
		this.bearing=options.bearing;//撞到的robot相对于该robot的角度
		this.energy=options.energy;//撞到的robot的剩余energy
	}
	this.HitRobotEvent.prototype={
		/**获取撞击的robot相对位置
		 * 
		 * @name getBearing
		 * @function
		 * @memberOf codeTank.event.HitRobotEvent.prototype
		 * @return {Number} 位置相对角度
		 */				
		getBearing:function(){
			return this.bearing;
		},
		/**获取撞击的robot的能量
		 * 
		 * @name getEnergy
		 * @function
		 * @memberOf codeTank.event.HitRobotEvent.prototype
		 * @return {Number} 撞击的robot的能量
		 */			
		getEnergy:function(){
			return this.energy;
		},
		/**获取撞击的robot的名字
		 * 
		 * @name getName
		 * @function
		 * @memberOf codeTank.event.HitRobotEvent.prototype
		 * @return {Number} 撞击的robot的名字
		 */			
		getName:function(){
			return this.name;
		}
	};
	/**
	 * 撞到墙壁的事件
	 * @memberOf codeTank.event
	 * @class
	 * @name HitWallEvent
	 * @param {Object} options 初始化参数
	 * @return HitWallEvent实例
	 */		
	this.HitWallEvent=function(options){
		this.bearing=options.bearing;//墙相对于robot的弧度
		
	}
	this.HitWallEvent.prototype={
		/**获取撞击的墙壁的朝向角度
		 * 
		 * @name getBearing
		 * @function
		 * @memberOf codeTank.event.HitWallEvent.prototype
		 * @return {Number} 撞击的墙壁的朝向角度
		 */			
		getBearing:function(){
			return this.bearing;
		}
	}
	/**
	 * 其他robot死亡的事件
	 * @memberOf codeTank.event
	 * @class
	 * @name RobotDeathEvent
	 * @param {Object} options 初始化参数
	 * @return RobotDeathEvent实例
	 */			

	this.RobotDeathEvent=function(options){
		this.name=options.name;//死亡的robot的名字
	}
	this.RobotDeathEvent.prototype={
		/**获取死亡的robot的名字
		 * 
		 * @name getName
		 * @function
		 * @memberOf codeTank.event.RobotDeathEvent.prototype
		 * @return {String} 死亡的robot的名字
		 */			
		getName:function(){
			return this.name;
		}
	}
	/**
	 * 扫描到其他robot的事件
	 * @memberOf codeTank.event
	 * @class
	 * @name ScannedRobotEvent
	 * @param {Object} options 初始化参数
	 * @return ScannedRobotEvent实例
	 */			
	this.ScannedRobotEvent=function(options){

		this.name=options.name;		//扫描到的robot的名字
		this.energy=options.energy;//扫描到的robot的剩余energy	
		this.bearing=options.bearing;//扫描到的robot相对于该robot的角度
		this.heading=options.heading;//扫描到的robot的角度
		this.distance=options.distance;//扫描到的robot相对于该robot的距离
		this.speed=options.speed;//扫描到的robot的速度
		
	}
	this.ScannedRobotEvent.prototype={
		/**获取扫描到robot的能量
		 * 
		 * @name getEnergy
		 * @function
		 * @memberOf codeTank.event.ScannedRobotEvent.prototype
		 * @return {Number} 扫描到robot的能量
		 */			
		getEnergy:function(){
			return this.energy;
		},
		/**获取扫描到robot的名字
		 * 
		 * @name getName
		 * @function
		 * @memberOf codeTank.event.ScannedRobotEvent.prototype
		 * @return {String} 扫描到robot的名字
		 */				
		getName:function(){
			return this.name;
		},
		/**获取扫描到robot的相对朝向
		 * 
		 * @name getBearing
		 * @function
		 * @memberOf codeTank.event.ScannedRobotEvent.prototype
		 * @return {String} 扫描到robot的名字
		 */			
		getBearing:function(){
			return this.bearing;
		},
		/**获取扫描到robot的朝向
		 * 
		 * @name getHeading
		 * @function
		 * @memberOf codeTank.event.ScannedRobotEvent.prototype
		 * @return {String} 扫描到robot的朝向
		 */			
		getHeading:function(){
			return this.heading;
		},
		/**获取扫描到robot的距离
		 * 
		 * @name getDistance
		 * @function
		 * @memberOf codeTank.event.ScannedRobotEvent.prototype
		 * @return {String} 扫描到robot的距离
		 */			
		getDistance:function(){
			return this.distance;
		},
		/**获取扫描到robot的速度
		 * 
		 * @name getSpeed
		 * @function
		 * @memberOf codeTank.event.ScannedRobotEvent.prototype
		 * @return {Number} 扫描到robot的速度
		 */			
		getSpeed:function(){
			return this.speed;
		}
	}
	/**
	 * 胜利的事件
	 * @memberOf codeTank.event
	 * @class
	 * @name WinEvent
	 * @param {Object} options 初始化参数
	 * @return WinEvent实例
	 */			
	this.WinEvent=function(){}
	/**
	 * 获取到消息的事件
	 * @memberOf codeTank.event
	 * @class
	 * @name MessageEvent
	 * @param {Object} options 初始化参数
	 * @return MessageEvent实例
	 */			
	this.MessageEvent=function(options){
		this.sender=options.sender;
		this.message=options.message;
	};
	this.MessageEvent.prototype={
		/**获取消息发送者
		 * 
		 * @name getSender
		 * @function
		 * @memberOf codeTank.event.MessageEvent.prototype
		 * @return {Object} 获取消息发送者
		 */	
		getSender:function(){
			return this.sender;
		},
		/**获取消息
		 * 
		 * @name getMessage
		 * @function
		 * @memberOf codeTank.event.MessageEvent.prototype
		 * @return {Object} 获取消息
		 */			
		getMessage:function(){
			return this.message;
		}
	};
	/**
	 * 绘制事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name PaintEvent
	 * @param {Object} options 初始化参数
	 * @return PaintEvent实例
	 */		
	 this.PaintEvent=function(options){
	 	this.context=options.context;
	 };
	 this.PaintEvent.prototype={
		/**获取绘制的context元素
		 * 
		 * @name getContext
		 * @function
		 * @memberOf codeTank.event.PaintEvent.prototype
		 * @return {Object} 用于绘制的context
		 */	 	
	 	getContext:function(){
	 		return this.context;
	 	}
	 }
	/**
	 * 鼠标事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name MouseEvent
	 * @param {Object} options 初始化参数
	 * @return MouseEvent实例
	 */		
	 this.MouseEvent=function(options){
	 	this.pos=options.pos;
	 	this.button=options.button;
	 }
	 this.MouseEvent.prototype={
		/**获取鼠标相对canvas位置
		 * 
		 * @name getPos
		 * @function
		 * @memberOf codeTank.event.MouseEvent.prototype
		 * @return {Array} 鼠标相对canvas位置
		 */		 	
	 	getPos:function(){
	 		return this.pos;
	 	},
		/**获取鼠标点击button
		 * 
		 * @name getButton
		 * @function
		 * @memberOf codeTank.event.MouseEvent.prototype
		 * @return {String} 点击button
		 */			 	
	 	getButton:function(){
	 		return this.button;
	 	}
	 };
	/**
	 * 键盘事件对象
	 * @memberOf codeTank.event
	 * @class
	 * @name KeyEvent
	 * @param {Object} options 初始化参数
	 * @return KeyEvent实例
	 */		
	 this.KeyEvent=function(){
	 }
	 this.KeyEvent.prototype={
		/**获取某个键是否点击
		 * 
		 * @name getButton
		 * @function
		 * @memberOf codeTank.event.KeyEvent.prototype
		 * @return {Boolean} 某个键是否点击
		 */		 	
	 	isPressed:function(keyName){
	 		return J.cnGame.input.isPressed(keyName);
	 	}
	 };
	 this.notify=function(target,evtName,evtObj){
	 	var mode=getMode();
	 	var r;
	 	var handlerName
	 	if(mode!="dev"){
	 		//用户坦克实现的事件处理程序字典
	 		var userTank=tankKeyObj[target.name]&&tankKeyObj[target.name]["userTank"];
			if(J.isUndefined(userTank)){
				return;
			}
			//检测对象为用户事件处理程序字典
			r=userTank;

	 	}
	 	else{
	 		//检测对象为用户实现的坦克对象
	 		r=target.constructor.prototype;
	 	}
 		
	 	//事件处理程序名
		handlerName="on"+evtName.substring(0,1).toUpperCase( ) + evtName.substring(1);

		if(r.hasOwnProperty(handlerName)){
			//paint事件特殊处理，不中断其他事件
			if(evtName=="paint"){
				em.notify(target,evtName,evtObj);
				return;
			}
			//事件优先级比较，高优先级中断低优先级
			if(target.currentEvtName&&codeTank.config.eventPriority[evtName]<=codeTank.config.eventPriority[target.currentEvtName])
				return;

			target.isInterEvent=true;		
			//中断正在执行的其他事件处理

			target.stateManager.cleanEventStateList();
			target.currentEvtName=evtName;

			if(mode!="dev"){
				//如果在worker，发消息通知事件
				tankKeyObj[target.name]["worker"].postMessage({"cmd":evtName,"e":evtObj});
			}
			else{
				//如果在eval，直接通知事件
				em.notify(target,evtName,evtObj);	
				if(!target.stateManager.getEventListLength()){
					target.currentEvtName=null;
				}
				target.isInterEvent=false;
			}
			

		}
	};
	/*	处理程序代理	*/
	this.subscribe=function(target,evtName,func){
		var mode=getMode();
		var r;
		if(mode!="dev"){
			var userTank=tankKeyObj[target.name]&&tankKeyObj[target.name]["userTank"];
			if(J.isUndefined(userTank)){
				return;
			}
			r=userTank;

		}
		else{
			r=target.constructor.prototype;
		}
		var handlerName="on"+evtName.substring(0,1).toUpperCase( ) + evtName.substring(1);
		if(r.hasOwnProperty(handlerName)){
			em.subscribe(target,evtName,function(){
				func.apply(this,arguments);
			},target);
		}
	};
	/*	worker事件处理完毕的消息通知	*/
 	this.eventHandleFinished=function(rName){
		var target=tankKeyObj[rName]&&tankKeyObj[rName]["main"];
		if(J.isUndefined(target)){
			return;
		}
		if(!target.stateManager.getEventListLength()){
			target.currentEvtName=null;
		}
		target.isInterEvent=false;
	}
	this.bindOriHandler=function(target,evtName){
		var mode=getMode();
		var r;		
		if(mode!="dev"){
			var userTank=tankKeyObj[target.name]&&tankKeyObj[target.name]["userTank"];
			if(J.isUndefined(userTank)){
				return;
			}
			r=userTank;

		}
		else{
			r=target.constructor.prototype;
		}

		var handlerName="on"+evtName.substring(0,1).toUpperCase( ) + evtName.substring(1);
		var evtObj;
		var btn;
		var input=J.cnGame.input;

		if(r.hasOwnProperty(handlerName)){

			cg.core.bindHandler(window,evtName.toLowerCase(),function(e){
				if(!gameObj.isStartBattle) return;

				if(evtName=="mouseMove"&&target.currentEvtName&&target.currentEvtName!=evtName)//mouseMove不中断正在执行的事件
					return;

				if(evtName=="mouseMove"||evtName=="click"||evtName=="mouseDown"||evtName=="mouseUp"){
					if(input.mouse.left_pressed) btn="left";
					if(input.mouse.right_pressed) btn="right";

					evtObj=new codeTank.event.MouseEvent({
						pos:[input.mouse.x,input.mouse.y].slice(),
						button:btn
					});
				}
				else if(evtName=="keyDown"||evtName=="keyUp"){
					evtObj=new codeTank.event.KeyEvent();		
				}

				this.isInterEvent=true;
				this.currentEvtName=evtName;
				this.stateManager.cleanEventStateList();//中断正在执行的其他事件处理


				if(mode!="dev"){
					tankKeyObj[target.name]["worker"].postMessage({"cmd":evtName,"e":evtObj,"handlerName":handlerName});
				}
				else{
					this[handlerName].call(this,evtObj);
					this.isInterEvent=false;					
				}

			},target);
			
		}
	};
	//bullet 副本
	var BulletObject=function(b){
		this.pos=b.pos.slice();
		this.speed=b.speed;
		this.power=b.power;
		this.heading=b.getHeading();
		this.robotName=b.robot.getName();	
	}
	BulletObject.prototype={
		getPos:function(){
			return this.pos;
		},
		getHeading:function(){
			return this.heading;
		},
		getSpeed:function(){
			return this.speed;
		},
		getPower:function(){
			return this.power;
		}
	}
	//robot副本
	var RobotObject=function(sender){
		this.team=sender.team;
		this.name=sender.name;
		this.pos=sender.pos.slice();
		this.heading=sender.getHeading();
		this.speed=sender.getSpeed();
		this.energy=sender.getEnergy();
	}
	RobotObject.prototype={
		getName:function(){
			return this.name;
		},
		getPos:function(){
			return this.pos;
		},
		getHeading:function(){
			return this.heading;
		},
		getSpeed:function(){
			return this.speed;
		},
		getEnergy:function(){
			return this.energy;
		}
	}




	this.notifyBulletMissedEvent=function(b){
		var mode=getMode();
		var r=b.robot;
		if(mode!="dev"){
			b=new BulletObject(b);
		}
		this.notify(r,"bulletMissed",new this.BulletMissedEvent({
			bullet:b
		}));
	};
	this.notifyBulletHitBulletEvent=function(b1,b2){
		var r1=b1.robot;
		var r2=b2.robot;
		var mode=getMode();
		if(mode!="dev"){
			b1=new BulletObject(b1);
			b2=new BulletObject(b2);
		}
		//子弹和子弹相碰撞
		this.notify(r1,"bulletHitBullet",new this.BulletHitBulletEvent({
			bullet:b1,
			hitBullet:b2
		}));
		
		this.notify(r2,"bulletHitBullet",new this.BulletHitBulletEvent({
			bullet:b2,
			hitBullet:b1
		}));	
	};
	this.notifyBulletHitEvent=function(r,b){
		var mode=getMode();
		var r1=b.robot;
		if(mode!="dev"){
			b=new BulletObject(b);
		}
		this.notify(r1,"bulletHit",new this.BulletHitEvent({
			name:r.getName(),
			energy:r.getEnergy(),
			bullet:b	
		}));
	};
	this.notifyHitByBulletEvent=function(r,b){
		var mode=getMode();
		var bearing=r.getBearing(b);
		if(mode!="dev"){
			b=new BulletObject(b);
		}

		this.notify(r,"hitByBullet",new this.HitByBulletEvent({
					bearing:bearing,
					bullet:b
					
		}));

		$E.notifyObservers(this,"eventTrigger",{
			tankName:r.name,
			eventName:"hitByBullet",
			eventParam:""
		});	
	};
	this.notifyDeathEvent=function(r){
		this.notify(r,"death",new this.DeathEvent({}));
	};
	this.notifyRobotDeathEvent=function(robotList,deadRobot){
		for(var m=0,len=robotList.length;m<len;m++){
			if(!robotList[m].isExplode)
				this.notify(robotList[m],"robotDeath",new this.RobotDeathEvent({name:deadRobot.name}));//robot死亡事件广而告之
		}

	};
	this.notifyWinEvent=function(robotList){
		for(var k=0;k<robotList.length;k++){
			if(!robotList[k].isExplode)
				this.notify(robotList[k],"win",new this.WinEvent({}));//触发胜利事件 	
		}
		
		$E.notifyObservers(this,"eventTrigger",{
			tankName:"",
			eventName:"win",
			eventParam:""
		});	

	};
	this.notifyHitRobotEvent=function(r1,r2){
		this.notify(r1,"hitRobot",new this.HitRobotEvent({
			name:r2.getName(),
			bearing:r1.getBearing(r2),
			energy:r2.getEnergy()
		}));
		this.notify(r2,"hitRobot",new this.HitRobotEvent({
			name:r1.getName(),
			bearing:r2.getBearing(r1),
			energy:r1.getEnergy()
		}));	

		$E.notifyObservers(this,"eventTrigger",{
			tankName:r1.name,
			eventName:"hitRobot",
			eventParam:r2.name
		});			
	};
	this.notifyHitWallEvent=function(r,wallAngle){	
		var angle=wallAngle-r.getHeading();
		if(angle>180){
			angle=angle-360;
		}
		else if(angle<-180){
			angle=angle+360;
		}
		this.notify(r,"hitWall",new this.HitWallEvent({bearing:angle}));
	};
	this.notifyScannedRobotEvent=function(r,r1){
		this.notify(r,"scannedRobot",new this.ScannedRobotEvent({//扫描到其他robot的事件
			name:r1.getName(),
			energy:r1.getEnergy(),
			bearing:r.getBearing(r1),
			heading:r1.getHeading(),
			distance:r.getDistance(r1),
			speed:r1.getSpeed()
		}));
		$E.notifyObservers(this,"eventTrigger",{
			tankName:r.name,
			eventName:"scanned",
			eventParam:r1.name
		});
		
	};
	this.notifyMessageReceivedEvent=function(sender,robot,message){
		var mode=getMode();
		if(mode!="dev"){
			sender=new RobotObject(sender);
		}
		this.notify(robot,"messageReceived",new codeTank.event.MessageEvent({
			sender:sender,
			message:message
		}));		
	};
	this.notifyPaintEvent=function(robot,context){
		this.notify(robot,"paint",new codeTank.event.PaintEvent({
			context:context
		}));		
	};

});


