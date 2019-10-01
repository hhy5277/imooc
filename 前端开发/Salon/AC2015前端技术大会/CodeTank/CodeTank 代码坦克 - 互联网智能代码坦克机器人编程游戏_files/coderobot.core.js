Jx().$package('codeTank', function(J) {
	document.domain = "alloyteam.com";
	var $D = J.dom,
		$E = J.event,
		srcObj=codeTank.config.srcObj;
	
	J.cnGame.init("canvas", { size:[800,600],bgImageSrc:srcObj.bg,fps:30,tps:30});//初始化框架

	var cg=J.cnGame,
		config=tank.config,
		core=cg.core,
		Sprite=cg.Sprite,
		spriteList=cg.spriteList,
		Polygon=cg.shape.Polygon,
		em=cg.eventManager,
		Animation=cg.Animation,
		Text=cg.shape.Text,
		event=codeTank.event;

	var Robot=codeTank.Robot,
		Bullet=codeTank.Bullet,
		Gun=codeTank.Gun;
	//兼容已经存在的用户代码
	tank = codeTank;

		
	var oldList=[];//保存开始战斗的所有坦克
	var robotList;//战场上的坦克
	var teamObj={};//团队对象
	var isBegin=false;
	var beginPos=40;//who killed who 文字显示起始位置
	var robotCount=0;	
	var isColl=function(obj1,obj2){	
		var	minDistance =55; 
		return obj1.getDistance(obj2)<minDistance&&codeTank.collision.collisionDetect(obj1,obj2);

		//return collision.col_between_Polygons(obj1.getRect(),obj2.getRect());
		
	};
	var getMode = this.getMode =function(){
		return J.localStorage.getItem("mode")||"oneVSOne";
	}
	var setMode = this.setMode = function(mode){
		J.localStorage.setItem("mode",mode);
	}

	/*	是否撞墙	*/
	var isCol_Wall=function(robot){

		var wallAngle;
		var x=0,y=0;
		var robotRect=robot.getRect();
		var points=robotRect.pointsArr;

		for(var i=0,len=4;i<len;i++){

			var point=points[i];
			if(point[0]>=cg.width){
				x=point[0]-cg.width+5;
				wallAngle=0;
			}
			if(point[0]<=0){
				x=point[0]-5;
				wallAngle=180;
			}
			if(point[1]<=0){
				y=point[1]-5;
				wallAngle=90;
			}
			if(point[1]>=cg.height){
				y=point[1]-cg.height+5;
				wallAngle=270;
			}
		}
		robot.pos[0]-=x;
		robot.pos[1]-=y;

		return wallAngle;
	};

	var setSelector=function(canSelect){
		$D.id('battleMode').disabled=!canSelect;
	};


	/*	是否robot	*/
	var isRobot=function(elem){
		return elem instanceof Robot;
	};
	/*	是否bullet	*/
	var isBullet=function(elem){
		return elem instanceof Bullet;
	};
	/*	设置kill robot文字动画	*/
	var setKillTextAnimate=function(textObj,list){
		Animation.add(new Animation({targetElem:textObj,propertyName:"alpha",from:1,to:0,duration:2000,onFinished:function(){
			list.shift();
			Animation.remove(this);
			if(list[0]){
				setKillTextAnimate(list[0],list);
			}
		}}));
	};
	/*	获取浏览器信息	*/
	var getBrowserMessage=function(){
	    return J.browser.name+" "+J.browser.version||"";
	};
	/*	信息文本字典	*/
	var textObj={
		"killedText":new Text({pos:[20,0],style:"#fff",font:"16px Arial"})
	};
	var gameTitle=$D.id("gameTitle");//loading遮罩
	var loadingBar=$D.id("loadingBar");//loading遮罩
	var tpsInput=$D.id("tpsSetting");
	var tpsValue=$D.id("tpsValue");
	var setTitleSize=function(){
		gameTitle.style.width=cg.size[0]+"px";
		gameTitle.style.height=cg.size[1]+"px";
	};
	var bindDelBtnHandler=function(robot){
		// cg.core.bindHandler(robot.deleteArea.btn,"click",function(e){
		// 	if(!gameObj.isStartBattle){
		// 		codeTank.removeRobot(this.id);
		// 		this.disappear();
				
		// 	}					
		// },robot);
		// cg.core.bindHandler(robot.deleteArea.mask,"mouseover",function(){
		// 	if(gameObj.isStartBattle) return;
		// 	robot.deleteArea&&robot.deleteArea.show();
		// });
		// cg.core.bindHandler(robot.deleteArea.mask,"mouseout",function(){
		// 	if(gameObj.isStartBattle) return;
		// 	robot.deleteArea&&robot.deleteArea.hide();
		// });				
	}
	//检测是否每队人数都为count人
	var teamMembersCheck=function(teamObj,count){
		for(var tn in teamObj){//存在队伍人数不为count，警告
			if(teamObj.hasOwnProperty(tn)&&teamObj[tn]!=count){
				return false;
			}
		}
		return true;
	}
	var updateTPS=function(){
		tpsValue.innerHTML="tps: "+tpsInput.value;
		cg.loop.tps=parseInt(tpsInput.value);
		//cg.loop.fps=parseInt(tpsInput.value);
	};
	var soundPlay=function(name){
		if(!codeTank.config.isPlaySound){
			return;
		}
		var sound=cg.loader.loadedAudios[srcObj[name]];
		if(sound){
			sound.currentTime=0;
			sound.play();
		}
	}
	var getUrlParam = function ( name ,href ,noDecode ) {
		var re = new RegExp( '(?:\\?|#|&)' + name + '=([^&]*)(?:$|&|#)',  'i' ), m = re.exec( href );
		var ret = m ? m[1] : '' ;
		return !noDecode ? decodeURIComponent( ret ) : ret;
	}

	var scorePanelConfig = {
		className: 'robotRank robotScore',
        title: '战斗得分榜',
        titleText: 'BATTLE SCORE',
        html: '<div id="robotScore"></div>',
        footerText: '本次比赛的计分榜', 
        onClose: function(){
	    	gameObj.spriteList=new cg.SpriteList();
			gameObj.isStartBattle=false;
	    }
	}
	var timeId;	
	var spriteList;
	/*	游戏对象	*/
	var gameObj= {
		
		/*	初始化	*/
		initialize:function(){
			
			this.robotList=[];
			loadingBar.style.opacity=1;
			Animation.add(new Animation({
				targetElem:loadingBar.style,
				propertyName:"opacity",
				from:1,
				to:0,
				duration:3000,
				tweenFun:Animation.tweenObj.cubic.easeOut,
				onFinished:function(){
					$D.hide(loadingBar);
				}
			}));//开场动画
			if(!this.spriteList) this.spriteList = new cg.SpriteList();
			this.showBrowser();
			this.tps=30;
		},
		/*	开始战斗	*/
		startBattle:function(){
		
			var mode=getMode();
			robotList= this.getCurrentRobotList();
			var count=robotList.length;
			var teamCount=0;
			teamObj={};
			for(var i=0;i<count;i++){//记录组队清空
				var teamId=robotList[i].team;
				if(teamId){
					if(!teamObj[teamId]){
						teamObj[teamId]=0;
						teamCount++;
					}
					teamObj[teamId]++;
				}
			}	

			
			if(count>0){
				if(mode=="oneVSOne"&&count!=2){
					alert("1V1模式下坦克必须为2辆！");
					return;
				}
				if(mode=="melee"&&count!=10){
					alert("10人混战模式下坦克必须为10辆！");
					return;
				}
				else if((mode=="teamTwo"||mode=="teamFive")){
					if(teamCount!=2){//队伍数不为2，警告
						alert("暂时只支持两个战队对战");
						return;
					}
					if(mode=="teamTwo"){
						if(!teamMembersCheck(teamObj,2)){//每队成员数不为2，警告
							alert("双人对决模式下坦克必须每队两辆！");
							return;
						}	
					}	
					if(mode=="teamFive"){
						if(!teamMembersCheck(teamObj,5)){//每队成员数不为5，警告
							alert("战队对战模式下坦克必须每队五辆！");
							return;
						}
					}
				}
			}
			else{
				alert("请先添加坦克！");
				return;					
			}
				
			this.isStartBattle=true;
			oldList=robotList.slice();
			site.sidebar.resetSelectedButton();
			return this.isStartBattle;
			
		},
		getCurrentRobotList:function(){

			return this.spriteList.get(function(elem){
				return elem instanceof Robot&&!elem.isExplode;
			});
		},
		isTeamOver:function(team){//团队是否已经被歼灭
			return teamObj[team]===0;
		},
		setBattleFieldSize:function(width,height){
			J.cnGame.setSize(width,height);
		},
		getBattleFieldSize:function(){
			return J.cnGame.getSize();
		},
		/*	结束战斗	*/
		endBattle:function(){
			oldList=[];
			this.cleanFieldArea();
			teamObj={};
			this.isStartBattle=false;
			this.showGameTitle();
			isBegin=false;
			site.resetBattleButton();
			robotCount=0;
		},
		cleanFieldArea:function(){
			var arr=this.spriteList.get();
			for(var i=0,l=arr.length;i<l;i++){
				arr[i].disappear();
			}
		},
		showGameTitle:function(){
			gameTitle.style.opacity=1;
			$D.show(gameTitle);
		},
		/*	添加robot	*/
		addRobot:function(options){//name pos angle
			//属性设置
			var self=this;
			var name=options.name||"testRobot";
			var id=options.id;
			var team=options.team;
			var teamName=options.teamName;
			var teamColor=options.teamColor;
			var pos=options.pos||[100,100];
			var angle=options.angle||0;

			var mode=getMode();
			var PlayerRobot;

			if(mode!="dev"){//worker使用Robot基类，eval下使用用户定义的机器人类
				PlayerRobot=codeTank.Robot;
			}
			else{
				PlayerRobot=options.Robot;
				PlayerRobot.prototype.init=function(options){//增加初始化方法，避免用户调用
					this.constructor.superClass.init.call(this,options);
				};	
			}
			
			var newRobot=new PlayerRobot({
				id:id,
				name:name,
				team:team,
				teamName:teamName,
				teamColor:teamColor,
				pos:pos,
				energy:codeTank.config.energy,
				size:codeTank.config.robot_size,
				angle:angle,
				moveSpeed:codeTank.config.robot_speed,
				turnSpeed:codeTank.config.robot_rotate_speed,
				maxSpeed:codeTank.config.robot_max_speed
			});
			
			codeTank.score.reset(newRobot);
			if(!this.spriteList) this.spriteList = new cg.SpriteList();
			this.spriteList.add(newRobot);


			
			newRobot.setGun({size:codeTank.config.gun_size,heatAddFunc:codeTank.config.heat_add,coldRate:codeTank.config.cold_rate,turnSpeed:codeTank.config.gun_rotate_speed});
			newRobot.setRadar({size:codeTank.config.radar_size,turnSpeed:codeTank.config.radar_rotate_speed,scanStyle:codeTank.config.scan_style});
			newRobot.setBullet({explodeSrc:srcObj.explode,size:codeTank.config.bullet_size,speed:[codeTank.config.bullet_speed,0]});
			newRobot.setUI();
			
			//事件订阅
			var e=codeTank.event;
			e.subscribe(newRobot,"bulletMissed",newRobot.onBulletMissed);
			e.subscribe(newRobot,"bulletHit",newRobot.onBulletHit);
			e.subscribe(newRobot,"bulletHitBullet",newRobot.onBulletHitBullet);
			e.subscribe(newRobot,"hitByBullet",newRobot.onHitByBullet);
			e.subscribe(newRobot,"hitRobot",newRobot.onHitRobot);
			e.subscribe(newRobot,"hitWall",newRobot.onHitWall);
			e.subscribe(newRobot,"scannedRobot",newRobot.onScannedRobot);
			e.subscribe(newRobot,"death",newRobot.onDeath);
			e.subscribe(newRobot,"win",newRobot.onWin);
			e.subscribe(newRobot,"robotDeath",newRobot.onRobotDeath);
			e.subscribe(newRobot,"messageReceived",newRobot.onMessageReceived);
			e.subscribe(newRobot,"paint",newRobot.onPaint);


			e.bindOriHandler(newRobot,"mouseMove");
			e.bindOriHandler(newRobot,"click");
			e.bindOriHandler(newRobot,"mouseDown");
			e.bindOriHandler(newRobot,"mouseUp");
			e.bindOriHandler(newRobot,"keyDown");
			e.bindOriHandler(newRobot,"keyUp");

			bindDelBtnHandler(newRobot);
			// if(!tankKeyObj[name]){
			// 	tankKeyObj[name] = {};
			// }
			if(mode!="dev"){
				//使用worker 需要保存主线程上的坦克对象
				tankKeyObj[name]["main"]=newRobot;
				//获取数据副本
				var robotData=newRobot.getRobotData(newRobot);
				//获取所有坦克数据副本
				robotData.spriteList=newRobot.getRobotListData();
				//通知worker执行run
				robotData.cmd="run";
				tankKeyObj[name]["worker"].postMessage(robotData);
			}
			else{
				//执行run
				newRobot.run();
			}

			
		
			if(!isBegin){
				isBegin=true;
				Animation.add(new Animation({
					targetElem:gameTitle.style,
					propertyName:"opacity",
					from:1,
					to:0,
					duration:2000,
					tweenFun:Animation.tweenObj.cubic.easeOut,
					onFinished:function(){
						$D.hide(gameTitle);
					}
				}));//渐变动画
			}
		},
		/*	更新	*/
		update:function(duration){

			var r,b,r1,b1;
			var mode=getMode();
			//获取现在战场上的robot
			robotList=this.getCurrentRobotList();
			robotCount=robotList.length;
			//战场有坦克则不能改变战场模式选择
			if(robotCount){
				setSelector(false);
			}
			else{
				setSelector(true);
			}

			updateTPS();
			if(!this.isStartBattle) {
				setTitleSize();
				return;
			}


			spriteList=this.spriteList;
			spriteList.update(duration);
			for(var i=0;i<spriteList.getLength();i++){
				b=r=null;
				var itemI=spriteList.get(i);
				if(isBullet(itemI)&&!itemI.isExplode){	
					b=itemI;
					//子弹超出地图边界	
					if(cg.isOutsideCanvas(b)){
						codeTank.event.notifyBulletMissedEvent(b);
						b.disappear();
						i--;
						continue;
					}
				}
				else if(isRobot(itemI)&&!itemI.isExplode){
					r=itemI;
					//与墙壁发生碰撞
					if(!cg.core.isUndefined(wallAngle=isCol_Wall(r))){
						//清除状态
						r.stateManager.cleanEventStateList();
						r.stateManager.cleanMainStateList();
						r.hurt(codeTank.config.wall_hit(r.preSpeed[0])).resetPos().stopMove();
						//声音播放
						soundPlay("hitWall");
						//撞墙事件通知				
						codeTank.event.notifyHitWallEvent(r,wallAngle);
					}
					//robot死亡
					if(r.energy<=0){
						//死亡事件通知
						codeTank.event.notifyDeathEvent(r);
						//robot爆炸
						r.explode();
						//其他robot获得生存得分
						codeTank.score.addSurvival(robotList);
						//更改数量记录
						if(!J.isUndefined(teamObj[r.team])){
							teamObj[r.team]--;
						}
						//死亡事件广而告之
						codeTank.event.notifyRobotDeathEvent(robotList,r);
						robotCount=this.getCurrentRobotList().length;//实时坦克数量
						//胜利
						if(!robotCount||robotCount==1||this.isTeamOver(r.team)){
							//延时1s弹出计分框
							if(!timeId){
								var self=this;
								//胜利事件通知
								codeTank.event.notifyWinEvent(robotList);
								timeId=window.setTimeout(function(){
									//分数显示
									site.panelManager.showPanel('scorePanel', scorePanelConfig);
								
									codeTank.score.show(oldList);

									//重置位置记录和数量
									site.resetCount();
									robotCount=0;
									//结束战斗，reset工作
									self.endBattle();
									timeId=null;

									//社招
									if(window.tencentTankName){
										if(robotList.length == 1 && robotList[0].name != window.tencentTankName){
											alert("恭喜你过关了！");
											// location.href = "http://www.qq.com";
											// window.opener["pass" + getUrlParam("t",location.href)]();
											try{
							        			window.opener["pass" + getUrlParam("t", location.href)]()
							        		} catch(err){
							        			var getCSRFToken = function (str) {
													var hash = 5381;
													for (var i = 0, len = str.length; i < len; ++i) {
														hash += (hash << 5) + str.charAt(i).charCodeAt();
													}

													return hash & 0x7fffffff;
												};

							        			var divEl = $D.node('div', {
								        				style: 'position:absolute;top:-999px;left:0;height:1px;'
								        			}),
							        				frameEl = $D.node('iframe', {
							        					id : 'submitIframe',
							        					name : 'submitIframe'
							        				}),
							        				formEl = $D.node('form', {
							        					method: 'post',
							                    		action: "http://codestar.alloyteam.com/pass?t=" + (new Date().getTime()),
							                    		target : 'submitIframe'
							        				});
							        			divEl.appendChild(formEl);
							        			divEl.appendChild(frameEl);

							        			var data = {
							        				q : 1,
							        				s : 3,
							        				_t : getCSRFToken(getUrlParam("_t", location.href)),
							        				callback : 'frameElement.quizCallback'
							        			};
							        			var inputEl;
							        			for(var item in data){
							        				inputEl = $D.node('input', {
							        					type : 'text',
							        					name : item
							        				});
							        				inputEl.value = data[item];
							        				formEl.appendChild(inputEl);
							        			}

							        			document.body.appendChild(divEl);
							        			frameEl.quizCallback = function(data){
													if(data.retcode === 0){
														location.href = 'http://codestar.alloyteam.com/1/4';
													}
												};
							        			formEl.submit();
							        		}
										}
										else{
											if(confirm("亲，你输了，再来一次不？")){
												location.reload();
											}
										}
									}

								},1000);
							}
							break;
						}
					}
			
				}
				else{
					//爆炸的robot或bullet
					continue;
				}
				for(var j=i+1;j<spriteList.getLength();j++){
					b1=r1=null;
					var itemJ=spriteList.get(j);
					if(isBullet(itemJ)&&!itemJ.isExplode){
						b1=itemJ;
					}
					else if(isRobot(itemJ)&&!itemJ.isExplode){
						r1=itemJ;
					}
					else{
						continue;
					}
					//双方都是子弹，并且相碰
					if(b&&b1&&isColl(b,b1)){
						//b.explode();
						//b1.explode();
						codeTank.event.notifyBulletHitBulletEvent(b,b1);
						continue;
					}	

					//一方是子弹一方是机器人
					if(b&&r1&&b.robot!=r1||b1&&r&&b1.robot!=r){
						var rb=r||r1;
						var bu=b||b1;
						//子弹击中机器人
						if(isColl(rb,bu)){
							//能量增减
							var hurtEnergy=codeTank.config.hurt(bu.power);
							rb.hurt(hurtEnergy);						 
							bu.robot.energy+=codeTank.config.gain(bu.power);
							//得分记录
							codeTank.score.recordHurt(bu.robot,rb.getName(),hurtEnergy,true);
							codeTank.score.addBulletDmgScore(bu.robot,hurtEnergy);
							//事件通知
							codeTank.event.notifyBulletHitEvent(rb,bu);
							codeTank.event.notifyHitByBulletEvent(rb,bu);
							//子弹击中爆炸
							bu.explode();

							if(rb.energy<=0){
								this.addKilledText(bu.robot.name,rb.name);
								codeTank.score.addBulletDmgBonus(bu.robot,rb.name);								
							}
						}
						continue;
					}
					//双方为机器人
					if(r&&r1){
						//机器人产生碰撞
						if(isColl(r,r1)){
							var hurtEnergy=codeTank.config.robot_hit;
							//碰撞后清除所有状态
							r.stateManager.cleanMainStateList();
							r.stateManager.cleanEventStateList();

							r1.stateManager.cleanMainStateList();
							r1.stateManager.cleanEventStateList();

							//碰撞后的能量损耗	以及重置位置	
							r.hurt(hurtEnergy).resetPos().stopMove();
							r1.hurt(hurtEnergy).resetPos().stopMove();	
							//分数计算
							codeTank.score.recordHurt(r,r1.getName(),hurtEnergy,false);
							codeTank.score.addRamDmgScore(r,hurtEnergy);
							codeTank.score.recordHurt(r1,r.getName(),hurtEnergy,false);
							codeTank.score.addRamDmgScore(r1,hurtEnergy);
							if(r.energy<=0){
								this.addKilledText(r1.name,r.name);
								codeTank.score.addRamDmgBonus(r,r1.getName());
							}
							if(r1.energy<=0){
								this.addKilledText(r.name,r1.name);
								codeTank.score.addRamDmgBonus(r1,r.getName());
							}
							//声音播放
							soundPlay("hitRobot");
							//事件通知
							codeTank.event.notifyHitRobotEvent(r,r1);
						}
						//雷达侦测到敌人
						if(r.radar.isScan(r1)){
							codeTank.event.notifyScannedRobotEvent(r,r1);
						}
						if(r1.radar.isScan(r)){
							codeTank.event.notifyScannedRobotEvent(r1,r);
						}
	
					}
				}
			}
			//由于worker的异步性，这里需要特别处理多一次goLoop
			if(mode!="dev"){
				for(var e=0;e<robotList.length;e++){
					robotList[e].goLoop();
				}				
			}
		},
		/*	浏览器和尺寸信息显示	*/
		showBrowser:function(){
			$D.id("browser").innerHTML=getBrowserMessage();
		},
		showSize:function(){
			$D.id("size").innerHTML=cg.width+" X "+cg.height;
			$D.id('info').style.width=cg.width+"px";

		},
		/*	fps tps和坦克数量信息显示	*/
		showFPSAndCount:function(){
			$D.id("tankNum").innerHTML=robotCount||0;
			$D.id("fps").innerHTML=cg.loop.avgFPS;
			$D.id("tps").innerHTML=cg.loop.avgTPS;
		},
		/*	开场渐变动画	*/
		showLoadingBar:function(percent){
			loadingBar.innerHTML=percent+"%";		
		},
		/*	添加被杀robot的文本	*/
		addKilledText:function(robotName,deathRobotName){
			this.killedList=this.killedList||[];
			var text=cg.core.extend({},textObj["killedText"]);	
			text.setOptions({text:robotName+" killed "+deathRobotName});	
			this.killedList.length==0&&(setKillTextAnimate(text,this.killedList));
			this.killedList.push(text);
		},
		/*	绘制被杀robot信息	*/
		drawKilledRobots:function(){
			var nextText;
			this.killedList=this.killedList||[];
			for(var i=0;i<this.killedList.length;i++){
				this.killedList[i].pos[1]=beginPos+i*20;
				this.killedList[i].draw();
			}					
		},
		/*	绘制	*/
		draw:function(){

			this.spriteList.draw();
			if(this.isStartBattle){
				this.showFPSAndCount();
			}
			this.drawKilledRobots();
		}
	};

	cg.loader.start(gameObj, { 
		srcArray: srcObj,
		onLoad:function(percent){
			cg.clean();
			gameObj.showLoadingBar(percent);
		}
	});
	window.gameObj=gameObj;
});
