/**	
 * CodeTank
 * Copyright (c) 2012 Tencent AlloyTeam All rights reserved.
 *
 * @fileOverview CodeTank!
 * @version	1.0
 * @author	Cson(<a href="mailto:csonlai1989@gmail.com">csonlai1989@gmail.com</a>)
 * @description 
 * 雷达、子弹、坦克、炮管的类
 */



Jx().$package("codeTank", function(J) {
   /**
	* @namespace	
	* @name codeTank
	* @type Object
	*/
	var cg=J.cnGame,
		core=J.cnGame.core,
		$D = J.dom,
		config=tank.config,
		$E = J.event,
		Sprite=J.cnGame.Sprite,
		spriteList=J.cnGame.spriteList,
		Line=J.cnGame.shape.Line,
		Circle=J.cnGame.shape.Circle,
		Text=J.cnGame.shape.Text,
		SS=J.cnGame.SpriteSheet,
		srcObj=codeTank.config.srcObj,
		uiObj=codeTank.config.uiObj,
		battleTopMargin = 98,
		robotState=tank.robotState,
		Polygon=J.cnGame.shape.Polygon;
		
	var getMode=function(){
		return $D.id('battleMode').value;
	};

	var ui=this.ui={
		"classic":[
			uiObj.classicBody,
			uiObj.classicGun,
			uiObj.classicRadar,
			uiObj.classicBullet
		],
		// 红
		"red":[
			uiObj.redBody,
			uiObj.redGun,
			uiObj.redRadar,
			uiObj.redBullet
		],
		// 橙
		"orange":[
			uiObj.orangeBody,
			uiObj.orangeGun,
			uiObj.orangeRadar,
			uiObj.orangeBullet
		],
		// 黄
		"yellow":[
			uiObj.yellowBody,
			uiObj.yellowGun,
			uiObj.yellowRadar,
			uiObj.yellowBullet
		],
		// 绿
		"green":[
			uiObj.greenBody,
			uiObj.greenGun,
			uiObj.greenRadar,
			uiObj.greenBullet
		],
		// 靛
		"indigo":[
			uiObj.indigoBody,
			uiObj.indigoGun,
			uiObj.indigoRadar,
			uiObj.indigoBullet
		],
		// 蓝
		"blue":[
			uiObj.blueBody,
			uiObj.blueGun,
			uiObj.blueRadar,
			uiObj.blueBullet
		],
		// 紫
		"purple":[
			uiObj.purpleBody,
			uiObj.purpleGun,
			uiObj.purpleRadar,
			uiObj.purpleBullet
		],
		// 金
		"gold":[
			uiObj.goldBody,
			uiObj.goldGun,
			uiObj.goldRadar,
			uiObj.goldBullet
		],	
		// 白
		"white":[
			uiObj.whiteBody,
			uiObj.whiteGun,
			uiObj.whiteRadar,
			uiObj.whiteBullet
		]				
	}
    var angleToRadian=function(angle){
    	return angle/180*Math.PI;
    }
    var radianToAngle=function(radian){
    	return radian*180/Math.PI;
    }	
	/**
	 *限制角度在0-360内
	**/
	var restrictAngle=function(angle){
		if(angle>Math.PI*2||angle<-Math.PI*2){
			angle%=Math.PI*2;
		}
		if(angle<0) angle+=Math.PI*2;
		return angle;
	};    
	/*	子弹类 */
	var Bullet=this.Bullet=new J.Class({extend : J.cnGame.Sprite},(function(){						  
		return {
			/**
			 * 初始化 
			 */
			init:function(options){
				
				this.robot=null;
				Bullet.superClass.init.call(this,options);
				this.powerScope=this.powerScope||[1,3];//子弹能量范围
				this.power=Math.max(this.powerScope[0],Math.min(this.powerScope[1],this.power));//修正power值
				
			},
			/**
			 * 返回子弹的速度 
			 * @function
			 * @name getSpeed
			 * @memberOf Bullet.prototype
			 * 
			 * @return {Number} 返回子弹速度值
			 */
			getSpeed:function(){
				return this.speed[0];
			},
			/**
			 * 返回子弹的角度 
			 * @function
			 * @name getHeading
			 * @memberOf Bullet.prototype
			 * 
			 * @return {Number} 返回子弹的角度 
			 */
			getHeading:function(){
				return radianToAngle(restrictAngle(this.angle));
			},
			/**
			 * 返回某个对象相对于子弹的角度 
			 * 
			 * @name getBearing
			 * @function
			 * @memberOf Bullet.prototype
			 * @param {Object} obj 相对的对象
			 * @return {Number} 返回某个对象相对于子弹的角度 
			 */
			getBearing:function(obj){
				return this.getRelatedAngle(obj);
			},
			/**
			 * 子弹击中爆炸    
			 * @name explode
			 * @function	
			 * @memberOf Bullet.prototype
			 */
			explode:function(){//爆炸位置
				var self=this;
				this.pos=[this.pos[0]-this.size[0]/2,this.pos[1]-this.size[1]/2];
				this.stop();
				this.isExplode=true;
				var explodeAnimation=new SS({id:"explode",size:[184,46],frameSize:[46,46],src:self.explodeSrc,onFinish:function(){self.disappear();}});//添加爆炸动画
				this.addAnimation(explodeAnimation);
				if(codeTank.config.isPlaySound){
					var audio=cg.loader.loadedAudios[srcObj.bulletExplode];
					if(audio){
						audio.currentTime=0;
						audio.play();
					}
				}
				this.setCurrentAnimation("explode");
			},
			/**
			 * 子弹消失 
			 * 
			 * @name disappear
			 * @function	
			 * @memberOf Bullet.prototype
			 */
			disappear:function(){
				gameObj.spriteList.remove(this);

			}

		}
	})());

	/**
	 * 火炮
	 * @class Gun
	 * @constructor Gun
	 * @param {Object} options 参数对象
	 * @return 火炮实例
	 */						  
					
	var Gun=this.Gun=new J.Class({extend : J.cnGame.Sprite},(function(){
										 
		return {
			/**
			*初始化
			**/
			init:function(options){
				this.robot=null;
				Gun.superClass.init.call(this,options);
				this.heat=0;//热度
				this.coldRate=this.coldRate||0.1;//冷却速度
				//this.fireHurt=this.fireHurt||1;//发射子弹的能量损耗
				this.heatAddFunc=this.heatAddFunc||function(power){return power/2;};//炮管加热的计算
				this.turnSpeed=this.turnSpeed||Math.PI/40;
				
			},
			isStop:function(){
				return this.speed[0]==0&&this.speed[1]==0;
			},
			/**
			 * 设置子弹的参数值
			 * 
			 * @name setBullet
			 * @function
			 * @memberOf Gun.prototype
			 * @param {Object} options 参数对象
			 */
			setBullet:function(options){
				this.bulletOpt=options;//保存子弹基本参数
				
			},
			/**
			 * 开火
			 * 
			 * @name fire
			 * @function
			 * @memberOf Gun.prototype
			 * @param {Number} power 子弹能量
			 * @return {Number} 返回子弹对象
			 */
			fire:function(power){
				var newBullet;
				var self=this;
				if(this.heat==0){
					this.addHeat(power);
					this.robot.hurt(power);
					var bulletPos=[self.pos[0]+30*Math.cos(self.angle),self.pos[1]-30*Math.sin(self.angle)];//炮弹发出位置
					var bulletOpt=cg.core.extend(this.bulletOpt,{src:self.robot.ui[3],angle:self.angle,pos:bulletPos,power:power});
					newBullet=new Bullet(bulletOpt);
					gameObj.spriteList.add(newBullet);
					
					if(codeTank.config.isPlaySound){
						var audio=cg.loader.loadedAudios[srcObj.gun];
						if(audio){
							audio.currentTime = 0;
							audio.play();
						}
					}
				}
				return newBullet;	
			},
			/**
			 * 获取火炮朝向角度
			 * 
			 * @name getHeading
			 * @function
			 * @memberOf Gun.prototype
			 * @return {Number} 返回robot角度
			 */
			getHeading:function(){
				return radianToAngle(restrictAngle(this.angle));
			},
			/**
			 * 返回某对象相对于火炮的角度
			 * 
			 * @name getBearing
			 * @function
			 * @memberOf Gun.prototype
			 * @return {Number} 返回某对象相对于火炮的角度
			 */
			getBearing:function(obj){
				return this.getRelatedAngle(obj);
			},
			/**
			*炮管加热
			**/		
			addHeat:function(power){
				this.heat+=this.heatAddFunc(power);
			},
			/**
			*炮管冷却
			**/
			cold:function(){
				this.heat=Math.max(0,this.heat-this.coldRate);
			},
			/**
			*更新
			**/
			update:function(duration){
				Gun.superClass.update.call(this,duration);
				this.setCurrentImage(this.robot.ui[1],[0,0],this.size);
				if(this.heat>0){
					this.cold();
				}
			}
		}
	})());

	/**
	 * 雷达
	 * @class Radar
	 * @constructor Radar
	 * @param {Object} options 参数对象
	 * @return 雷达实例
	 */			
	var Radar=this.Radar=new J.Class({extend : J.cnGame.Sprite},(function(){	

		var isInnerArea=function(radar,point,polygonLines){
			var robot=radar.robot;
			var count=0;
			var crossPointArr=[];//相交的点的数组
			var crossPoint;
			var leftLine=new Line({start:point,end:[point[0]-9999,point[1]]});//左射线
			var lines=polygonLines;
			for(var i=0,len=lines.length;i<len;i++){
				var l=lines[i];
				crossPoint=l.isCross(leftLine);
		
				if(crossPoint){
					for(var j=0,len2=crossPointArr.length;j<len2;j++){
		                //如果交点和之前的交点相同，即表明交点为多边形的顶点
		                if(crossPointArr[j][0]==crossPoint[0]&&crossPointArr[j][1]==crossPoint[1]){
		                    break;    
		                }
			        }		         
			        if(j==len2){//没有和之前的交点相同，则添加
		                crossPointArr.push(crossPoint);    
		                count++;
			        }
				}
			}
		    if(count%2==0){
		        return false;
		    }
		    else if(crossPoint&&count==1&&crossPoint[0]==robot.pos[0]&&crossPoint[1]==robot.pos[1]){
		    	var rightLine=new Line({start:point,end:[point[0]+9999,point[1]]});//右射线
		    	for(var i=0,len=lines.length;i<len;i++){
		    		var l=lines[i];
		    		if(l.isCross(rightLine)){
		    			return true;
		    		}
		    	}
	    		return false;
		    }
		    return true;//包含
		};
		return {
			/**
			*初始化
			**/
			init:function(options){
				Radar.superClass.init.call(this,options);
				this.scanStyle=this.scanStyle||"blue";//雷达素描区域颜色
				this.scanRadian=this.scanRadian||Math.PI/18;//素描区域角度
				this.rayArr=[];//雷达射线数组
				this.density=this.density||15;//射线密度
				this.maxLength=2000;//射线长度
				this.dRad=this.scanRadian/this.density;//角度之间的夹角角度
				this.rads=[this.angle+this.scanRadian/2,this.angle-this.scanRadian/2];//区域左右边界的角度
				this.turnSpeed=this.turnSpeed||Math.PI/40;
				this.scan();
			},
			/**
			*雷达开始检测
			**/
			scan:function(){
				//this.robot.runScan=true;
				var rads=this.rads=[this.angle+this.scanRadian/2,this.angle-this.scanRadian/2];//更新区域左右边界的角度
				var maxLength=this.maxLength;
				var startPos=this.pos;
				var leftPoint=[this.pos[0]+Math.cos(rads[0])*maxLength,this.pos[1]-Math.sin(rads[0])*maxLength];
				var rightPoint=[this.pos[0]+Math.cos(rads[1])*maxLength,this.pos[1]-Math.sin(rads[1])*maxLength];
				this.scanArea=new Polygon({pointsArr:[startPos,leftPoint,rightPoint],style:this.scanStyle});
			},
			isScan:function(robot){
				//if(this.robot.isStop()) return false;

				var lines=this.scanArea.getLineSegs();
				if(this.runScan&&isInnerArea(this,robot.pos,lines)){
					return true;
				}	
				return false;
			},
			isStop:function(){
				return this.speed[0]==0&&this.speed[1]==0;
			},			
			/**
			 * 设置雷达射线颜色
			 * 
			 * @name setScanStyle
			 * @function
			 * @memberOf Radar.prototype
			 * @param {String} style 射线颜色
			 */
			setScanStyle:function(style){
				this.scanStyle=style;
			},
			/**
			 * 获取雷达朝向角度
			 * 
			 * @name getHeading
			 * @function
			 * @memberOf Radar.prototype
			 * @return {Number} 返回雷达朝向角度
			 */
			getHeading:function(){
				return radianToAngle(restrictAngle(this.angle));
			},
			/**
			 * 获取某对象相对于雷达的朝向角度
			 * 
			 * @name getBearing
			 * @function
			 * @memberOf Radar.prototype
			 * @param {Object} obj 相对对象     
			 * @return {Number} 某对象相对于雷达的朝向角度
			 */
			getBearing:function(obj){
				return this.getRelatedAngle(obj);
			},
			/**
			*消失
			**/
			disappear:function(){
				gameObj.spriteList.remove(this);
			},
			/**
			*重写update
			**/
			update:function(duration){
				Radar.superClass.update.call(this,duration);
				this.setCurrentImage(this.robot.ui[2],[0,0],this.size);
				if(this.runScan)
				this.scan();
			},
			/**
			*重写draw
			**/
			draw:function(){

				//if(codeTank.config.isShowRadar&&this.runScan)
				if(codeTank.config.isShowRadar)
				this.scanArea.draw();

				Radar.superClass.draw.call(this);
			}
			
		}
	})());

	/**
	 *		
	 * @memberOf tank
	 * @class
	 * @name Robot
	 * @param {Object} options 初始化参数
	 * @return Robot实例
	 */
	var Robot=this.Robot=new J.Class({extend : J.cnGame.Sprite},(function(){	

		/**
		 * tank 对话框
		 */
		var TankMsgBox = function (tank, msg, color) {
			this.tank = tank;
			this.msg = msg;
			this.color = color;
			
			this._init();
		};
		TankMsgBox.prototype = {
			_init: function () {
				this._createDom();
				this.update();
			},
			_createDom: function () {
				if (!this.dom) {
					this.dom = document.createElement('div');
					this.textDom = document.createElement('div');
					this.arrowDom = document.createElement('div');
					
					this.dom.className = 'tankMsgBox';
					this.textDom.className = 'tankMsgBoxText';
					this.arrowDom.className = 'tankMsgBoxArrow';
					this.dom.style.display = 'none';
					document.body.appendChild(this.dom);
					this.dom.appendChild(this.textDom);
					this.dom.appendChild(this.arrowDom);
					
				}
				return this.dom;
			},
			update: function () { 
				var canvasTop=J.cnGame.pos[1];
				var canvasLeft=J.cnGame.pos[0];
				if (this.isVisible() && this.dom) {
					var pos = this.tank.getPos(),
						dim = {
							width: this.dom.offsetWidth,
							height: this.dom.offsetHeight
						};
					
					this.arrowDom.style.left = dim.width/2-3 + 'px';
					this.dom.style.left = pos[0]-(dim.width/2) + canvasLeft+ 'px';//20为canvas 左边距
					this.dom.style.top = pos[1]-dim.height + canvasTop - 58 + 'px';
				}
			},
			getMsg: function () {
				return this.msg;
			},
			setMsg: function (msg, color) {
				if (msg) this.msg = msg;
				color = color || "#aaa";
				//this.dom.innerHTML = msg;
				if (this.dom) {
					this.textDom.innerHTML = msg;
					this.dom.style.color = color;
				}
				
				//this.dom.style.borderColor = color;
			},
			show: function (msg, color) {
				var me = this;
				msg && this.setMsg(msg, color);
				//if (time == undefined) time = 500;
				var time = 3000;
				if (this.dom) this.dom.style.display = 'block';
				this.update();
				
				clearTimeout(this.__timer)
				this.__timer = setTimeout(function () {
					me.hide();
					
					/*if (me.tank.energy <= 0) {
						//me.destory();

					}*/
				}, time);
			},
			hide: function () {
				if (this.dom) this.dom.style.display = 'none';
			},
			isVisible: function () {
				return !(this.dom.style.display == 'none');
			},
			destory: function () {
				document.body.removeChild(this.dom);
				this.dom = null;
				this.textDom = null;
				this.arrowDom = null;
			}
		};
        
        // dom 的血条框
        var DomRect = function (opt) {
            this.opt = opt;
            this._init();
        };
        DomRect.prototype = {
            _init: function () {
                this._createDom();
            },
            _createDom: function () {
                var dom = document.createElement('div');
                dom.className = 'tankEnergyRect';
                document.body.appendChild(dom);
                this.dom = dom;
            },
            setOptions: function (o) {
                if (o.pos) this.pos = o.pos;
                if (o.size) this.size = o.size;
            },
            draw: function () {
				var canvasTop=J.cnGame.pos[1];
				var canvasLeft=J.cnGame.pos[0];
                if (this.dom && this.pos && this.size) {
                	this.dom.style['width'] = this.size[0] + 'px';
                    this.dom.style['left'] = this.pos[0] - (this.dom.offsetWidth/2) +canvasLeft + 'px';
                    this.dom.style['top'] = this.pos[1] + canvasTop +7+ 'px';
                    
                }
            },
            hide: function () {
                this.dom.style['display'] = 'none';
            },
            destory: function () {
                document.body.removeChild(this.dom);
                this.dom = null;
            }
        };
        
        // dom 名字
        var DomText = function (opt) {
            this.opt = opt;
            this._init();
        };
        DomText.prototype = {
            _init: function () {
                this._createDom();
            },
            _createDom: function () {
                var dom = document.createElement('span');
                dom.className = 'tankNameText';
                document.body.appendChild(dom);
                this.dom = dom;
            },
            getWidth:function(){
            	return this.dom.clientWidth;
            },
            getHeight:function(){
            	return this.dom.clientHeight;
            },            
            setOptions: function (o) {

                if (o.pos) this.pos = o.pos;
                if (o.style) this.style=o.style;
                if (o.text && !this.text) {
                    this.text = o.text;
                    this.dom.innerHTML = this.text;
                } 
            },
            draw: function () {
				var canvasTop=J.cnGame.pos[1];
				var canvasLeft=J.cnGame.pos[0];
                if (this.dom && this.pos && this.text) {
                
             		this.dom.style['color']=this.style;
                    this.dom.style['left'] = this.pos[0] - (this.dom.offsetWidth/2) + canvasLeft + 'px';
                    this.dom.style['top'] = this.pos[1] + canvasTop -3 + 'px';
                }
            },
            hide: function () {
                this.dom.style['display'] = 'none';
            },
            destory: function () {
                document.body.removeChild(this.dom);
                this.dom = null;
            }
        };

        var DomArea=function(opt){
        	this.opt=opt;
        	this._init();
        };
        DomArea.prototype={
        	_init:function(){
        		this._createDom();
        	},
            _createDom: function () {
            	var mask=document.createElement('span');
            	mask.className="tankMask";
                var btn = document.createElement('span');
                btn.className = 'deletBtn panelCloseButton';
                btn.innerHTML="x";
                mask.appendChild(btn);
                this.btn = btn;
                this.mask=mask;
            },
            getWidth:function(){
            	return this.mask.clientWidth;
            },
            getHeight:function(){
            	return this.mask.clientHeight;
            },
            setOptions: function (o) {
                if (o.pos) this.pos = o.pos;
                if (o.size) this.size = o.size;
                var r=this.opt.robot;
                r.nameText.dom.appendChild(this.mask);
            },
            draw: function () {
                if (this.mask && this.size) {
                	this.mask.style['width'] = this.size[0] + 'px';
                	this.mask.style['height'] = this.size[1] + 'px';       
                }
                
            },
            show:function(){
            	this.btn.style['display'] = 'block';
            },
            hide: function () {
                this.btn.style['display'] = 'none';
            },
            destory: function () {
            	var r=this.opt.robot;
                this.mask.removeChild(this.btn);
                r.nameText.dom.removeChild(this.mask);
                this.btn = null;
                this.mask = null;
            }
        };

        var teamColorObj={
        	"1":"red",
        	"2":"yellow"
        };
        var createCanvas=function(width,height,left,top){
			var robotCanvas=document.createElement("canvas");
			//robotCanvas.style.background="rgba(152,133,107,0.5)";
			robotCanvas.style.position="absolute";
			robotCanvas.style.top=top+"px";
			robotCanvas.style.left=left+"px";
			robotCanvas.width=width;
			robotCanvas.height=height;  
			return robotCanvas;      	
        }


		return {
			/**
			*初始化
			**/
			init:function(options){
				var self=this;
				Robot.superClass.init.call(this,options);
		
                // 名字和血条是否使用dom实现
                this.useDom = true;
				this.energy=this.energy||100;
				this.teamColor=teamColorObj[this.teamColor];
				this.name=this.name||"test";
				this.nameText= this.useDom ? new DomText({style: this.teamColor}) : new Text({style:this.teamColor});
				this.energyRect= this.useDom ? new DomRect({style: 'rgb(40, 249, 59)'}) : new cg.shape.Rect({style:"rgb(40,249,59)"});//血条
				this.deleteArea= new DomArea({robot:this});
				this.moveSpeed=this.moveSpeed||5;//robot移动速度
				this.turnSpeed=this.turnSpeed||Math.PI/80;//robot旋转速度


				
				this.setAdjustGunForRobotTurn(false);
				this.setAdjustRadarForGunTurn(false);
				this.setAdjustRadarForRobotTurn(false);
				
				this.stateManager=new robotState.StateManager({owner:this});
				this.updateText();	
				
			},
			isStop:function(){
				return this.speed[0]==0&&this.speed[1]==0&&this.radar.isStop()&&this.gun.isStop();
			},			
			/**
			 * 说话
			 * @function
			 * @name say
			 * @memberOf tank.Robot.prototype
			 * @param {String} words
			 * @param {String} color
			 */
			say: function (words, color) {
				if(!codeTank.config.isShowMsg) return;
				if (!this.msgBox) {
					this.msgBox = new TankMsgBox(this, words, color);
				}
				this.msgBox.show(words, color);
			},
			/*setName:function(name){
				this.name=name;
				return this;
			},*/
			/**
			 * 更换UI
			 * 
			 * @name setUI
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} ui ui对象（如tank.ui["green"]）   
			 * @return {Object} 坦克实例
			 */
			setUI:function(newUI){
	
				this.ui=newUI||ui.orange;
				var self=this;
				var loadedImgsObj=cg.loader.loadedImgs;
		
				cg.loader.load(this.ui[0],function(img){
					var src=img.srcPath;
					self.tbody=new cg.SpriteSheet({id:"tbody",size:[38,76],src:src,frameSize:[38,38],direction:"down",loop:true});
					self.setCurrentAnimation(self.tbody);

				});				
				cg.loader.load(this.ui[1],function(img){
					var src=img.srcPath;
					self.gunSrc=src;
					self.gun.setCurrentImage(src);//更新ui
				});
				cg.loader.load(this.ui[2],function(img){
					var src=img.srcPath;
					self.radarSrc=src;
					self.radar.setCurrentImage(src);//更新ui
				}); 

				cg.loader.load(this.ui[3],function(img){
					var src=img.srcPath;
					self.bulletSrc=src;
				});                			
				
				return this;
			},
			/**
			 * 返回绘制坦克的2Dcontext
			 * @name getGraphics
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 返回绘制坦克的2Dcontext
			 */	
			getGraphics:function(){
				var area=this.deleteArea;
				var w=area.getWidth();
				var h=area.getHeight();
				var canvasW=80;
				var canvasH=h;

				if(!this.robotDrawContext){
					
					var name=this.nameText;
					
					var robotCanvas=createCanvas(canvasW,canvasH,(name.getWidth()-80)/2,14);
					area.mask.appendChild(robotCanvas);

					var robotDrawContext=robotCanvas.getContext('2d');
					this.robotDrawContext=robotDrawContext;
				}
				this.robotDrawContext.clearRect(0,0,canvasW,canvasH);
				this.robotDrawContext.save();
				this.robotDrawContext.translate(canvasW/2,42);//坦克中点
				this.robotDrawContext.rotate(this.angle * -1);
				return this.robotDrawContext;
			},			
			/**
			*绘制robot
			**/
			draw:function(){
				Robot.superClass.draw.call(this);
				this.gun.draw();		
				this.radar.draw();
				this.drawText();
			
				if(this.constructor.prototype.hasOwnProperty("onPaint")){//用户实现了onPaint处理程序
					var context=this.getGraphics();
					codeTank.event.notifyPaintEvent(this,context);//robot绘制前的回调
					context.restore();
				}
			},
			/**
			*更新文本
			**/		
			updateText:function(){
				var self=this;
				if(this.nameText&&this.energyRect&&this.deleteArea){
					this.nameText.setOptions({pos:[this.pos[0],this.pos[1]-50],text: self.name,style:this.teamColor});
					this.energyRect.setOptions({pos:[this.pos[0],this.pos[1]-40],size:[self.energy/2,3]});
					this.deleteArea.setOptions({pos:[this.pos[0],this.pos[1]],size:[this.nameText.dom.clientWidth+20,80]});
				}

			},
			/**
			*绘制文本
			**/	
			drawText:function(){
				var self=this;
				if(this.nameText&&this.energyRect&&this.deleteArea){
					this.nameText.setOptions({text: self.name});
					this.nameText.draw();
					this.energyRect.draw();
					this.deleteArea.draw();
				}

				
			},
			/**
			*设置雷达
			**/
			setRadar:function(options){
				options.angle*=-1;
				var self=this;
				this.setOptions.call(options,{pos:self.pos,robot:self,angle:self.angle,src:self.radarSrc});//添加对robot的引用，中点位置，角度与robot一致
				this.radar=new Radar(options);
		
			},
			/**
			*设置火炮
			**/
			setGun:function(options){
				options.angle*=-1;
				var self=this;
				this.setOptions.call(options,{pos:self.pos,robot:self,angle:self.angle,src:self.gunSrc});//添加对robot的引用，中点位置，角度与robot一致
				this.gun=new Gun(options);
			},
			/**
			*设置子弹
			**/
			setBullet:function(options){
				var self=this;
				cg.core.extend(options,{robot:self,src:self.bulletSrc});//增加对robot的引用
				this.gun.setBullet(options);
			},
			/**
			 * 返回剩余的移动距离
			 * 
			 * @name getDistanceRemaining
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 剩余移动距离
			 */			
			getDistanceRemaining:function(){
				return this.distanceRemaining;
			},
			/**
			 * 返回剩余的旋转角度
			 * 
			 * @name getTurnRemaining
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 剩余旋转角度
			 */			
			getTurnRemaining:function(){
				return radianToAngle(this.radianRemaining);
			},	
			/**
			 * 返回大炮剩余的旋转角度
			 * 
			 * @name getGunTurnRemaining
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 剩余大炮旋转角度
			 */							
			getGunTurnRemaining:function(){
				return radianToAngle(this.gun.radianRemaining);
			},	
			/**
			 * 返回剩余的雷达旋转角度
			 * 
			 * @name getRadarTurnRemaining
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 剩余雷达旋转角度
			 */						
			getRadarTurnRemaining:function(){
				return radianToAngle(this.radar.radianRemaining);
			},	
			/**
			 * 向前走一定距离
			 * 
			 * @name ahead
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} distance 距离 
			 * @param {Function} onFinished 完成移动的回调函数 
			 * @return {Object} 坦克实例
			 */
			ahead:function(distance,onFinished){
				var self=this;
				var aheadState=new robotState.State(this.customState);
				aheadState.setOptions({
					name:"ahead",
					distance:distance,
					onMoveFinished:onFinished,
					owner:self
				});
				this.stateManager.addState(aheadState);
				this.customState=null;
				return this;
			},
			/**
			 * 向后走
			 * 
			 * @name back
			 * @function
			 * @param {Number} distance 后退距离
			 * @param {Function} onFinished 后退完成的回调函数
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			back:function(distance,onFinished){
				distance*=-1;
				this.ahead(distance,onFinished);
				return this;
			},				
			/**
			 * 坦克车身旋转一定角度
			 * 
			 * @name turn
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turn:function(angle,onFinished){
				angle*=-1;
				var self=this;
				var radian=angleToRadian(angle);
				var turnState=new robotState.State(this.customState);
				turnState.setOptions({
					name:"turn",
					angle:radian,
					onTurnFinished:onFinished,
					owner:self
				});
				this.stateManager.addState(turnState);
				this.customState=null;
				return this;				
			},

			/**
			 * 坦克车身向右旋转一定角度
			 * 
			 * @name turnRight
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnRight:function(angle,onFinished){
				this.turn(angle, onFinished);
				return this;
			},

			/**
			 * 坦克车身向左旋转一定角度
			 * 
			 * @name turnLeft
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnLeft:function(angle,onFinished){
				angle*=-1;
				this.turn(angle, onFinished);
				return this;
			},
			/**
			 * 火炮旋转一定角度
			 * 
			 * @name turnGun
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnGun:function(angle,onFinished){
				angle*=-1;
				var self=this;
				var radian=angleToRadian(angle);
				var turnState=new robotState.State(this.customState);
				turnState.setOptions({
					name:"turnGun",
					gunAngle:radian,
					onGunTurnFinished:onFinished,
					owner:self
				});
				this.stateManager.addState(turnState);
				this.customState=null;
				return this;						
			},


			/**
			 * 火炮向右旋转一定角度
			 * 
			 * @name turnGunRight
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnGunRight:function(angle,onFinished){
				this.turnGun(angle, onFinished);
				return this;
			},


			/**
			 * 火炮向左旋转一定角度
			 * 
			 * @name turnGunLeft
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnGunLeft:function(angle,onFinished){
				angle*=-1;	
				this.turnGun(angle, onFinished);
				return this;
			},
			/**
			 * 雷达旋转一定角度
			 * 
			 * @name turnRadar
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnRadar:function(angle,onFinished){
				angle*=-1;
				var self=this;
				var radian=angleToRadian(angle);
				var turnState=new robotState.State(this.customState);
				turnState.setOptions({
					name:"turnRadar",
					radarAngle:radian,
					onRadarTurnFinished:onFinished,
					owner:self
				});
				this.stateManager.addState(turnState);
				this.customState=null;
				return this;	
			},

			/**
			 * 雷达向右旋转一定角度
			 * 
			 * @name turnRadarRight
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnRadarRight:function(angle,onFinished){
				this.turnRadar(angle, onFinished);
				return this;
			},

			/**
			 * 雷达向左旋转一定角度
			 * 
			 * @name turnRadarLeft
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} angle 旋转角度
			 * @param {Function} onFinished 完成转动的回调函数 
			 * @return {Object} 坦克实例
			 */
			turnRadarLeft:function(angle,onFinished){
				angle*=-1;
				this.turnRadar(angle, onFinished);
				return this;
			},

			/**
			 * 设置火炮是否独立于robot的旋转
			 * 
			 * @name setAdjustGunForRobotTurn
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Boolean} independent 是否独立 
			 * @return {Object} 坦克实例
			 */
			setAdjustGunForRobotTurn:function(independent){//independent:true or false
				this.isAdjustGunForRobotTurn=independent;
				return this;
			},	
			/**
			 * 设置雷达是否独立于火炮的旋转
			 * 
			 * @name setAdjustRadarForGunTurn
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Boolean} independent 是否独立 
			 * @return {Object} 坦克实例
			 */
			setAdjustRadarForGunTurn:function(independent){
				this.isAdjustRadarForGunTurn=independent;
				return this;
				
			},
			/**
			 * 设置雷达是否独立于robot的旋转
			 * 
			 * @name setAdjustRadarForRobotTurn
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Boolean} independent 是否独立 
			 * @return {Object} 坦克实例
			 */		
			setAdjustRadarForRobotTurn:function(independent){
				this.isAdjustRadarForRobotTurn=independent;
				return this;
			},
			/**
			 * 运动主函数，用户重写该函数，实现robot自定义的运动轨迹
			 * 
			 * @name run
			 * @function
			 * @memberOf tank.Robot.prototype
			 */	
			run:function(){},
			/**
			 * 停止移动
			 * 
			 * @name stopMove
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			stopMove:function(){
				
				var self=this;
				
				var stopState=new robotState.State(this.customState);
				stopState.setOptions({
					name:"stop",
					angle:0,
					gunAngle:0,
					radarAngle:0,
					distance:0,
					stop:true,
					owner:this
				});
				
				this.stateManager.addState(stopState);	
				this.customState=null;		
				return this;	
			},
			cancelScan:function(){
				this.radar.runScan=false;
			},
			/**
			 * 恢复雷达扫描
			 * 
			 * @name scan
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */				
			scan:function(){
				var scanState=new robotState.State(this.customState);

				scanState.setOptions({
					scan:true,
					owner:this
				});	
				this.stateManager.addState(scanState);
				return this;			
			},	
			getRobotData:function(robot){

				var robotData={};

				robotData.heading=robot.getHeading();
				robotData.gunHeading=robot.getGunHeading();
				robotData.radarHeading=robot.getRadarHeading();
				robotData.battleSize=robot.getBattleFieldSize();
				robotData.energy=robot.getEnergy();
				robotData.size=robot.getSize();
				robotData.speed=robot.getSpeed();
				robotData.name=robot.getName();
				robotData.others=robot.getOthers();
				robotData.pos=robot.getPos();
				robotData.gunColdRate=robot.getGunColdRate();
				robotData.gunHeat=robot.getGunHeat();
				robotData.isExplode=robot.isExplode;
				robotData.team=robot.team;
				robotData.moveSpeed=robot.moveSpeed;
				robotData.turnSpeed=robot.turnSpeed;
				return robotData;
			},
			updateRobotData:function(){
				var worker=tankKeyObj[this.name]&&tankKeyObj[this.name]["worker"];
				if(J.isUndefined(worker)){
					return;
				}
				var robotData=this.getRobotData(this);
				robotData.spriteList=this.getRobotListData();
			
				robotData.cmd="updateData";
				worker.postMessage(robotData);
			},
			getRobotListData:function(){
				var list=gameObj.getCurrentRobotList();
				var sList=[];
				for(var i=0,len=list.length;i<len;i++){
					var rd=this.getRobotData(list[i]);
					sList.push(rd);
				}
				return sList;
			},		
			/**
			*帧更新
			**/
			update:function(duration){
				
				this.goLoop();	
				this.stateManager.update();
				
				if(!this.radar.canScan&&this.isStop()) this.cancelScan();
				else {
					this.radar.runScan=true;
					this.radar.canScan=false;
				}

				
				Robot.superClass.update.call(this,duration);
	
				this.gun.update(duration);
				this.radar.update(duration);
				this.updateText();
				this.msgBox && this.msgBox.update(duration);



				var mode=getMode();
				if(mode!="dev"){
					//更新worker维护的数据
					this.updateRobotData();
				}

				this.handleCustomEvent();//处理自定义事件
				if(!this.isExplode)
				this.setCurrentImage(this.ui[0],[0,0],this.size);
	
				this.speed=[0,0];
				this.gun.speed=[0,0];
				this.radar.speed=[0,0];
				
	
		
			
			},
			goLoop:function(){
				var mode=getMode();
				///事件状态队列为空时才添加
				if(!this.isExplode&&!this.stateManager.getEventListLength()&&!this.stateManager.getMainListLength()){
					if(mode!="dev"){
						var worker=tankKeyObj[this.name]&&tankKeyObj[this.name]["worker"];
						if(J.isUndefined(worker)){
							return;
						}	
						worker.postMessage({cmd:"loop"});					
					}
					else{
						this.loopFunc&&this.loopFunc.call(this);
					}
					
				}
			},
			/**
			 * 设置下一次执行的前进的距离
			 * 
			 * @name setAhead
			 * @function
			 * @param {Number} distance 前进的距离
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			setAhead:function(distance,onFinished){
				this.customState=this.customState||{};
				this.customState.owner=this;
				this.customState.distance=distance;
				this.customState.onMoveFinished=onFinished;				
				return this;
			},
			/**
			 * 设置下一次执行旋转的角度
			 * 
			 * @name setTurn
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			setTurn:function(angle,onFinished){
				angle*=-1;
				this.customState=this.customState||{};
				var radian=angleToRadian(angle);
				this.customState.owner=this;
				this.customState.angle=radian;
				this.customState.onTurnFinished=onFinished;
				return this;
			},
			/**
			 * 设置下一次执行向左旋转的角度
			 * 
			 * @name setTurnLeft
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			setTurnLeft:function(angle,onFinished){
				angle*=-1;
				this.setTurn(angle,onFinished);
				return this;
			},
			/**
			 * 设置下一次执行向右旋转的角度
			 * 
			 * @name setTurnRight
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			setTurnRight:function(angle,onFinished){
				this.setTurn(angle,onFinished);
				return this;
			},			
			/**
			 * 设置下一次火炮执行旋转的角度
			 * 
			 * @name setGunTurn
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			setGunTurn:function(angle,onFinished){
				angle*=-1;
				this.customState=this.customState||{};
				var radian=angleToRadian(angle);
				this.customState.owner=this;
				this.customState.gunAngle=radian;
				this.customState.onGunTurnFinished=onFinished;	
				return this;
			},
			/**
			 * 设置下一次火炮执行向左旋转的角度
			 * 
			 * @name setGunTurnLeft
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */				
			setGunTurnLeft:function(angle,onFinished){
				angle*=-1;
				this.setGunTurn(angle,onFinished);
				return this;
			},
			/**
			 * 设置下一次火炮执行向右旋转的角度
			 * 
			 * @name setGunTurnRight
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */				
			setGunTurnRight:function(angle,onFinished){
				this.setGunTurn(angle,onFinished);
				return this;
			},
			/**
			 * 设置下一次雷达执行向左旋转的角度
			 * 
			 * @name setRadarTurnLeft
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */				
			setRadarTurnLeft:function(angle,onFinished){
				angle*=-1;
				this.setRadarTurn(angle,onFinished);
				return this;
			},
			/**
			 * 设置下一次雷达执行向右旋转的角度
			 * 
			 * @name setRadarTurnRight
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */				
			setRadarTurnRight:function(angle,onFinished){
				this.setRadarTurn(angle,onFinished);
				return this;
			},			
			/**
			 * 设置下一次开火的能量
			 * 
			 * @name setFire
			 * @function
			 * @param {Number} power 能量值
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */				
			setFire:function(power){
				power=power||1;
				power=Math.min(power,3);//不能超过3的火力
				this.customState=this.customState||{};
				this.customState.owner=this;
				this.customState.power=power;
				return this;
			},
			/**
			 * 设置下一次雷达执行旋转的角度
			 * 
			 * @name setRadarTurn
			 * @function
			 * @param {Number} angle 旋转的角度
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			setRadarTurn:function(angle,onFinished){
				angle*=-1;
				this.customState=this.customState||{};
				var radian=angleToRadian(angle);
				this.customState.owner=this;
				this.customState.radarAngle=radian;
				this.customState.onRadarTurnFinished=onFinished;	
				return this;
			},
			/**
			 * 添加自定义组合状态
			 * 
			 * @name execute
			 * @function
			 * @param {Function} onFinished 完成的回调函数
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */	
			execute:function(onFinished){
				var customState=this.stateManager.getCurrentState(this);
				if(customState){
					//customState.updateFuncList=[];
					customState.addFunc(this.customState);
				}
				else{
					customState=new robotState.State(this.customState);
					customState.setOptions({owner:this,onFinished:onFinished});
					this.stateManager.addState(customState);
					this.customState=customState;
				}
				this.customState=null;
				return this;		
			},
			/**
			 * 一直循环执行的行为
			 * 
			 * @name loop
			 * @function
			 * @param {Function} func 需要循环执行的方法
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */			
			loop:function(func){
				this.loopFunc=func;
				return this;
			},			
			/**
			 * 神马也不做
			 * 
			 * @name doNothing
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */
			doNothing:function(){
				var self=this;
				var nothingState=new robotState.State();
				nothingState.setOptions({
					name:"doNothing",
					owner:this
				});
				this.stateManager.addState(nothingState);
				return this;
			},
			/**
			 * 输出日志
			 * 
			 * @name log
			 * @function
 			 * @param {Object} msg 日志输出的消息
			 * @param {String} tag 日志消息的tag
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克实例
			 */			
			log:function(msg,tag){
				var currentUser=site.account.getCurrentUser();
				if(!currentUser) return;
				var uid=currentUser.uid;
				var tankUser=this.name.split(".")[0];
				if(tankUser==uid){//只输出自己创建的坦克的日志
					J.log(this.name+":"+msg,tag);
				}
				return this;	
			},
			/**
			 * 开火
			 * 
			 * @name fire
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Number} power 火力大小（1-3）
			 * @return {Object} 坦克实例
			 */
			fire:function(power){//power:火力大小
				power=power||1;//默认火力值为1
				power=Math.min(power,3);//不能超过3的火力
				var fireState=new robotState.State(this.customState);
				fireState.setOptions({
					name:"fire",
					power:power,
					owner:this
				});
				this.stateManager.addState(fireState);
			},
			/**
			 * 设置雷达射线颜色
			 * 
			 * @name setScanStyle
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {String} style 雷达扫描区域样式
			 * @return {Object} 坦克实例
			 */	
			setScanStyle:function(style){
				this.radar.setScanStyle(style);
				return this;
			},
			/**
			 * 返回战场尺寸
			 * 
			 * @name getBattleFieldSize
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Array} 战场尺寸
			 */	
			getBattleFieldSize:function(){
				return [cg.canvas.width,cg.canvas.height];
			},
			/**
			 * 返回战场高度
			 * 
			 * @name getBattleFieldHeight
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 战场高度
			 */				
			getBattleFieldHeight:function(){
				return cg.canvas.height;
			},
			/**
			 * 返回战场宽度
			 * 
			 * @name getBattleFieldWidth
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 战场宽度
			 */				
			getBattleFieldWidth:function(){
				return cg.canvas.width;
			},
			/**
			 * 返回坦克能量
			 * 
			 * @name getEnergy
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 坦克能量
			 */	
			getEnergy:function(){
				return this.energy;
			},
			/**
			 * 返回坦克距离某对象的距离
			 * 
			 * @name getDistance
			 * @function
			 * @param {Object} obj 要比较的坦克对象
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 坦克距离某对象的距离
			 */	
			/*getDistance:function(obj){
				return this.parent.prototype.getDistance.call(this,obj);
			},*/
			/**
			 * 返回坦克朝向角度
			 * 
			 * @name getHeading
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 坦克朝向角度
			 */	
			getHeading:function(){
				return radianToAngle(restrictAngle(this.angle));
			},
			/**
			 * 返回火炮朝向角度
			 * 
			 * @name getGunHeading
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 火炮朝向角度
			 */	
			getGunHeading:function(){
				return this.gun.getHeading();
			},
			/**
			 * 返回雷达朝向角度
			 * 
			 * @name getRadarHeading
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 雷达朝向角度
			 */	
			getRadarHeading:function(){
				return this.radar.getHeading();
			},
			/**
			 * 返回某对象相对于坦克的角度
			 * 
			 * @name getBearing
			 * @function
			 * @param {Object} obj 要比较的坦克对象
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回某对象相对于坦克的角度
			 */	
			getBearing:function(obj){
				return this.getRelatedAngle(obj);
			},
			/**
			 * 返回坦克的尺寸
			 * @name getSize
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的尺寸
			 */	
			getSize:function(){
				return this.size;
			},
			/**
			 * 返回坦克的高度
			 * @name getHeight
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的高度
			 */				
			getHeight:function(){
				return this.size[1];
			},
			/**
			 * 返回坦克的宽度
			 * @name getWidth
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的宽度
			 */				
			getWidth:function(){
				return this.size[0];
			},			
			/**
			 * 返回坦克的位置
			 * @name getPos
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的位置
			 */	
			getPos:function(){
				return this.pos;
			},
			/**
			 * 返回坦克的X位置
			 * @name getX
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的X位置
			 */				
			getX:function(){
				return this.pos[0];
			},
			/**
			 * 返回坦克的Y位置
			 * @name getY
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的Y位置
			 */				
			getY:function(){
				return this.pos[1];
			},
			/**
			 * 返回坦克的速度
			 * @name getSpeed
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的速度
			 */	
			getSpeed:function(){
				if(!J.isUndefined(this.preSpeed)){
					return parseInt(this.preSpeed[0]);
				}
				return 0;
			},
			/**
			 * 返回坦克的名字
			 * @name getName
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回坦克的名字
			 */	
			getName:function(){
				return this.name;
			},

			/**
			*重置robot位置到上一次的位置
			**/
			resetPos:function(){
				//this.preSpeed=this.preSpeed||this.speed;
				//this.preSpeed=this.speed;
				if(!this.preSpeed) this.preSpeed=[0,0];
				if(!this.gun.preSpeed) this.gun.preSpeed=[0,0];
				if(!this.radar.preSpeed) this.radar.preSpeed=[0,0];

				this.pos[0]-=this.preSpeed[0]*Math.cos(this.angle)*2;
				this.pos[1]+=this.preSpeed[0]*Math.sin(this.angle)*2;
				this.angle-=this.preSpeed[1];
				this.gun.angle-=this.gun.preSpeed[1];
				this.radar.angle-=this.radar.preSpeed[1];


				return this;
			},
			/**
			*受伤能量损耗
			**/
			hurt:function(energy){
				this.energy-=energy;
				return this;
			
			},
			/**
			*robot消失
			**/
			disappear:function(){
				gameObj.spriteList.remove(this);	
				gameObj.spriteList.remove(this.gun);
				gameObj.spriteList.remove(this.radar);

                this.deleteArea.destory();
                this.nameText.destory();
                this.energyRect.destory();

                this.deleteArea=this.nameText=this.energyRect=null;
         
				return this;
			},
			/**
			 * 获取敌人的数量
			 * @name getOthers
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 返回敌人的数量
			 */	
			getOthers:function(){
				var robotList=gameObj.spriteList.get(function(elem){
					return elem instanceof Robot;								
				})
				return robotList.length-1;
			},
			/**
			*添加用户事件处理
			**/	
			addCustomEvent:function(evtName,condition,handler){
				this.conditionObj=this.conditionObj||{};
				this.conditionHandlerObj=this.conditionHandlerObj||{};
				var conditionObj=this.conditionObj;
				var conditionHandlerObj=this.conditionHandlerObj;
				conditionHandlerObj[evtName]||(conditionHandlerObj[evtName]=[]);
				conditionObj[evtName]=condition;
				conditionHandlerObj[evtName].push(handler);
				
				
			},
			/**
			*触发用户事件处理
			**/		
			handleCustomEvent:function(){
				var conditionObj=this.conditionObj;
				var conditionHandlerObj=this.conditionHandlerObj;
				for(name in conditionObj){
					if(conditionObj&&conditionObj.hasOwnProperty(name)&&conditionObj[name].call(this)){
						if(conditionHandlerObj&&conditionHandlerObj[name]){
							for(var i=0,len=conditionHandlerObj[name].length;i<len;i++){
								conditionHandlerObj[name][i].call(this);	
							}
						}
					}
				}
			},
			/**
			 * 坦克爆炸    
			 * @name explode
			 * @function	
			 * @memberOf Tank.prototype
			 */
			explode:function(){//爆炸位置
				var self=this;
				this.stateManager.cleanMainStateList();
				this.stateManager.cleanEventStateList();
				this.stop();
				this.isExplode=true;
				var explodeAnimation=new SS({id:"e1",size:[322,46],frameSize:[46,46],src:codeTank.config.srcObj.explode,onFinish:function(){self.disappear();}});//添加爆炸动画
				this.addAnimation(explodeAnimation);
				if(codeTank.config.isPlaySound){
					var audio=cg.loader.loadedAudios[srcObj.bulletExplode];
					if(audio){
						audio.currentTime=0;
						audio.play();
					}
				}
				this.setCurrentAnimation("e1");
			},
			/**
			 * 获取炮管冷却速率
			 * @name getGunColdRate
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 获取炮管冷却速率
			 */	
			getGunColdRate:function(){
				return this.gun.coldRate;
			},	
			/**
			 * 获取炮管热度
			 * @name getGunHeat
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Number} 获取炮管热度
			 */	
			getGunHeat:function(){
				return this.gun.heat;
			},	
			/**
			 * 获取是否队友
			 * @name isTeammate
			 * @function
			 * @param {String} name 坦克的名字
			 * @memberOf tank.Robot.prototype
			 * @return {boolean} 获取是否队友
			 */				
			isTeammate:function(name){
				var teammatesList=this.getTeammates();

				for(var i=0,len=teammatesList.length;i<len;i++){
					var robot=teammatesList[i];
					if(robot.name==name){
						return true;
					}
				}
				return false;

			},
			/**
			 * 获取队友列表
			 * @name getTeammates
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @return {Array} 队友列表
			 */				
			getTeammates:function(){
				var teammatesList=[];
				var robotList=gameObj.getCurrentRobotList();
				for(var i=0,len=robotList.length;i<len;i++){	
					var robot=robotList[i];
					if(!J.isUndefined(this.team)&&!robot.isExplode&&this.team==robot.team&&robot!=this){
						teammatesList.push(robot);
					}
				}			
				return teammatesList;
			},
			/**
			 * 向队友发送信息
			 * @name sendMessage
			 * @function
			 * @param {Array} robot 坦克对象数组或单个坦克对象
			 * @param {Object} message 发送的消息对象
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克对象
			 */				
			sendMessage:function(robot,message){//robot可以为单个robot或一个robot数组
				if(J.isArray(robot)){
					for(var i=0,len=robot.length;i<len;i++){
						arguments.callee.call(this,robot[i],message);
					}
					return;
				}
				if(this.isTeammate(robot.name)&&!robot.isExplode){
					codeTank.event.notifyMessageReceivedEvent(this,robot,message);
				}
				return this;
			},
			/**
			 * 向所有队友发送信息
			 * @name broadcastMessage
			 * @function
			 * @param {Object} message 发送的消息对象
			 * @memberOf tank.Robot.prototype
			 * @return {Object} 坦克对象
			 */				
			broadcastMessage:function(message){
				var teammates=this.getTeammates();
				this.sendMessage(teammates,message);
				return this;
			},
			onMouseOver:function(){
				this.deletPannel.show();
			},
			/**
			 * 收到消息处理程序，由子类重写
			 * @name onMessageReceived
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */				
			onMessageReceived:function(e){
			},
			/**
			 * 子弹射失处理程序，由子类重写
			 * @name onBulletMissed
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */	
			onBulletMissed:function(e){//eve.bullet:missed的子弹对象
			},
			/**
			 * 子弹射中其他robot处理程序，由子类实现
			 * @name onBulletHit
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */	
			onBulletHit:function(e){//eve.bullet:射中的子弹对象  eve.robot:射中的robot对象
			},
			/**
			 * 子弹射中其他子弹的处理程序，由子类重写
			 * @name onBulletHitBullet
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */				
			onBulletHitBullet:function(e){//eve.ownBullet:射出的子弹对象  eve.bullet:击中的敌人的子弹
				
			},
			/**
			 * 被子弹射中处理程序，由子类重写
			 * @name onHitByBullet
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */	
			onHitByBullet:function(e){//eve.bullet:被哪个子弹射中
			},
			/**
			 * 撞击其他Robot处理程序，由子类重写
			 * @name onHitRobot
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */	
			onHitRobot:function(e){//eve.robot:与哪个robot相碰撞	
			
			},
			/**
			 * 撞击墙壁处理程序，由子类重写
			 * @name onHitWall
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */	
			onHitWall:function(e){//eve.wall:与哪个方向的墙碰撞（{up:true,left:true,down:false,right:false} 未完善！
			
			},
			/**
			 * 雷达扫描到其他robot的处理程序，由子类重写
			 * @name onScannedRobot
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */	
			onScannedRobot:function(e){//eve.scanList:看到的其他robot的列表	
			},
			/**
			 * 其他robot死亡的处理程序，由子类重写
			 * @name onRobotDeath
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */	
			onRobotDeath:function(e){},
			/**
			 * robot死亡的处理程序，由子类重写
			 * @name onDeath
			 * @function
			 * @param {Object} e 事件对象
			 * @memberOf tank.Robot.prototype
			 */			
			onDeath:function(e){},
			/**
			 * robot胜利的处理程序，由子类重写
			 * @name onWin
			 * @function
			 * @param {Object} e 事件对象back
			 * @memberOf tank.Robot.prototype
			 */	
			onWin:function(e){},
			/**
			 * 绘制机器人前的回调函数
			 * @name onPaint
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} context 2Dcontext对象
			 * @return {Number} 绘制机器人前的回调函数
			 */				
			onPaint:function(context){
			},
			/**
			 * 键盘按下事件处理程序
			 * @name onKeyDown
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} e 事件对象
			 */				
			onKeyDown:function(e){		
			},
			/**
			 * 键盘松开事件处理程序
			 * @name onKeyUp
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} e 事件对象
			 */				
			onKeyUp:function(e){
			},
			/**
			 * 鼠标点击事件处理程序
			 * @name onClick
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} e 事件对象
			 */		
			onClick:function(e){
			},
			/**
			 * 鼠标移动事件处理程序
			 * @name onMouseMove
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} e 事件对象
			 */				
			onMouseMove:function(e){
			},
			/**
			 * 鼠标按下事件处理程序
			 * @name onMouseDown
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} e 事件对象
			 */				
			onMouseDown:function(e){
			},
			/**
			 * 鼠标松开事件处理程序
			 * @name onMouseUp
			 * @function
			 * @memberOf tank.Robot.prototype
			 * @param {Object} e 事件对象
			 */				
			onMouseUp:function(e){
			}
		}
	})());
});						  
						  
						  
