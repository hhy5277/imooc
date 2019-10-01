/**    
 * CODETANK 
 * Copyright (c) 2012, Tencent AlloyTeam, All rights reserved.
 * http://CodeTank.AlloyTeam.com/
 *
 * @version		1.0
 * @author		TAT.Kinvix
 *
 *  .d8888b.                888      88888888888               888   TM   
 * d88P  Y88b               888      ''''888''''               888      
 * 888    888               888          888                   888      
 * 888         .d88b.   .d88888  .d88b.  888  8888b.  88888b.  888  888 
 * 888        d88""88b d88" 888 d8P  Y8b 888     "88b 888 "88b 888 .88P 
 * 888    888 888  888 888  888 88888888 888 .d888888 888  888 888888K  
 * Y88b  d88P Y88..88P Y88b 888 Y8b.     888 888  888 888  888 888 "88b 
 *  "Y8888P"   "Y88P"   "Y88888  "Y8888  888 "Y888888 888  888 888  888 
 * 
 */

Jx().$package("site",function(J){

	// 定义全局变量Robot；
    window.Robot=null;

    window.tankKeyObj = {};

    var packageContext = this;
	var $E = J.event;
	var $D = J.dom;


	var cg=J.cnGame;
	var c=cg.core;
	var posRecord=[];
    var count=0;
    var d=50;

	// $ 开头的变量, 表示它是一个 dom
	var $codeTankWrapper,
		$battleMode,
		$battleButtonText;

	var ASYNC_CALL_CONFIG = {
		'ranking': {
			src: 'js/site/site.ranking.js',
			onload: function(){
				site.ranking.init();
			},
			exec: function(){
				site.ranking.show();
			}
		},
		'share': {
			src: 'js/share.all.js',
			onload: function(){
				site.shareApi.init();
				site.shareBox.init();
				site.share.init();
			},
			exec: function(){
				site.share.shareCodeTank();
			}
		},
		'message': {
			src: 'js/site/site.message.js',
			onload: function(){
				site.message.init();
			}
		}
	}


/*********************************************************************************
//  公有方法
/*********************************************************************************/

	this.init = function(){
    	initReferences();

    	bindEvents();

    	site.setting.init();
    	site.panelManager.init();

    	site.account.init();
    	site.sidebar.init();
    	site.robotManager.init();

    	site.editor.init();
    	site.urlBattle.init();

    	site.explainWall.init();
    	//site.explainWall.add("abc","ahead","50px");

    	$E.notifyObservers(window, 'systemReady');
    }

	this.report = function(tag){
		if(typeof _gaq == 'undefined' ) return;
    	var list = tag.split(','), main, des;
    	for(var i = 0, item; item = list[i]; i++) {
    	    item = J.string.trim(item);
    	    item = item.split('.');
    	    main = item[0];
    	    des = item[1] ? item.slice(1).join('.') : main;
    	    
			_gaq.push(['_trackEvent', main, des]);
    	}
    }

    /**
     * 异步加载代码并执行
     */
    this.asyncCall = function(id, callback){
    	var config = ASYNC_CALL_CONFIG[id];
    	if(config){
    		if(!config.status){
    			config.status = 1;
	    		J.http.loadScript(config.src, {
	    			onSuccess: function(){
	    				config.status = 2;
	    				config.onload && config.onload();
	    				if(callback){
		    				callback();
		    			}else{
		    				config.exec && config.exec();
		    			}
	    			},
	    			timeout: 30000,
	    			onTimeout: function(){
	    				if(config.status == 2){
	    					return;
	    				}
	    				config.status = 0;
	    				// alert('加载失败，请稍候重试');
	    			}
	    		});
    		}else if(config.status === 2){
    			if(callback){
    				callback();
    			}else{
    				config.exec && config.exec();
    			}
    		}else{
    			alert('正在加载中，请稍候');
    		}
    	}
    }

/*********************************************************************************
//  commands
/*********************************************************************************/
	var bodyCommands = {
    	closePopupPanel: function(param, target, event){
    		site.panelManager.hidePanel(param);
		},
		shareScore: function(param, target, event){
			site.asyncCall('share', function(){
				site.share.shareScore(target);
			});
		}

    };

	var wrapperCommands = {
		shareCodeTank: function(param, target, event){
			site.asyncCall('share');
		},
		about: function(param, target, event){
	        showAboutPanel();
		},
		showRanking: function(param, target, event){
	        site.asyncCall('ranking');
		},
		setting: function(param, target, event){
			site.setting.show();
		},
		robotStore: function(param, target, event){
			site.sidebar.toggle();
		},
		stopPropagation: function(param, target, event){
			event.stopPropagation();
		},
		console: function(param, target, event){
			// site.asyncCall('console');
			J.console.toggleShow();
		},
		setMode: function(param, target, event){
			codeTank.setMode(target.value);
		},
		battle: function(param, target, event){
			startBattle();
		},
		endBattle: function(param, target, event){
			gameObj.endBattle();
		},
		shareCode: function(param, target, event){
			site.asyncCall('share', function(){
				site.share.shareCode();
			});
		}
	}

	var siteReport = function(event){
		var target = qtool.getActionTarget(event, 6, 'report', this);
		if(target){
			var param = target.getAttribute('report');
			site.report(param);
		}
	}
	var onDocumentKeypress = function(e){

		if(/*isEditing && */e.keyCode === 83 && e.ctrlKey === true){//编辑状态时，保存：Ctrl+S
			e.preventDefault();
			// var robotFullName = robotNameText.value;
			// TankSave.save(robotFullName);
			site.editor.isEditing() && site.editor.save();
		}else if(e.keyCode === 66 && e.ctrlKey === true){//：Ctrl+B
			e.preventDefault();
			startBattle();
		}else if(e.keyCode === 32 && e.ctrlKey === true){//：Ctrl+Space 空格
			e.preventDefault();
			site.sidebar.toggle();
		}else if(e.keyCode === 27){//：Esc
			e.preventDefault();
			site.sidebar.toggle();
		}

		
    };

    var onSystemReady = function(){
    	$battleMode.value = codeTank.getMode();

    	site.asyncCall('message');
    }

/*********************************************************************************
//  内部方法
/*********************************************************************************/
	var initReferences = function(){
		$codeTankWrapper = $D.id('codeTankWrapper');
		$battleMode = $D.id('battleMode');
		$battleButtonText = $D.id('battleText');

		var followUsBtnSina = $D.id('followUsBtnSina'),
		    followUsBtnTencent = $D.id('followUsBtnTencent');
		followUsBtnSina.src =  'http://widget.weibo.com/relationship/followbutton.php?language=zh_cn&width=63&height=24&uid=2842618110&style=1&btn=light&dpc=1';
		followUsBtnTencent.src = 'http://follow.v.t.qq.com/index.php?c=follow&a=quick&name=codetank&style=5&t=1347253058369&f=0';
    }

    var bindEvents = function(){
    	qtool.bindCommands(document.body, 'click', bodyCommands);

    	qtool.bindCommands($codeTankWrapper, 'click', wrapperCommands);

    	//统一绑定点击上报
    	J.event.on(document.body, 'click', siteReport);
    	//快捷键支持
    	J.event.on(window, "keydown", onDocumentKeypress);

    	J.event.addObserver(window, 'systemReady', onSystemReady);
    }

    var showAboutPanel = function(){
    	if(!site.panelManager.getPanel('aboutCodeTank')){
    		site.panelManager.createPanel('aboutCodeTank', {
    			className: 'aboutCodeTank',
                title: '关于 CodeTank',
                titleText: 'ABOUT',
                html: qtool.getTemplate('aboutCodeTank'),
                buttons: [
                	'确　定'
                ]
    		});
    	}
    	site.panelManager.showPanel('aboutCodeTank');
    }


/*********************************************************************************
//  战场增删坦克相关(下面的代码不整理了 - -||)
/*********************************************************************************/

    /*	添加robot	*/
	var addRobot =this.addRobot=function(tid,robotFullName,teamId,teamColor,teamName){
		var fieldSize=gameObj.getBattleFieldSize();
		var m=Math.floor(fieldSize[0]/d)-1;
		var n=Math.floor(fieldSize[1]/d)-1;

		//var head=J.dom.tagName("head")[0];
		if(gameObj.isStartBattle) return;		
		
		if(count>=m*n){
			alert("坦克数量已达上限！");
			return;
		}
		do{
			var xIndex=Math.ceil(Math.random()*m),yIndex=Math.ceil(Math.random()*n);
			if(!posRecord[xIndex]) posRecord[xIndex]=[];
		}
		while(posRecord[xIndex][yIndex]) 
		posRecord[xIndex][yIndex]=true;
		count++;

		
		/*var t=iarr.pop();
		var xIndex=t[0];
		var yIndex=t[1];*/

		var posX=d*xIndex;
		var posY=d*yIndex;
		var angle=Math.random()*Math.PI*2;

		//var teamName=getTeamName(robotFullName);

		gameObj.addRobot({
			id:tid,
			Robot:Robot,
			name:robotFullName,
			team:teamId,
			teamName:teamName,
			pos:[posX,posY],
			angle:angle,
			teamColor:teamColor
		});
	};
	this.resetBattleButton=function(){
		$battleButtonText.innerHTML="战　斗";
		cg.loop.pause=false;
	};
	/*	清空位置记录	*/
	this.resetCount=function(robotList){
	    if(robotList&&robotList.length){
	    	posRecord[robotList[0].pos[0]/d]=[];
	    	posRecord[robotList[0].pos[0]/d][robotList[0].pos[1]/d]=true;
	    }
	};
	var removeRobot=this.removeRobot=function(id){
    	var inputArr=$D.tagName("input",$robotList);
    	for(var i=0,len=inputArr.length;i<len;i++){
    		if(inputArr[i].getAttribute("tid")==id&&inputArr[i].checked){
    			inputArr[i].checked=false;
    		}
    	}
    };

    var startBattle = function(){
		//e.preventDefault();
		if(gameObj.isStartBattle){//已经开始战斗
			if(cg.loop.pause){
				cg.loop.pause=false;
				$battleButtonText.innerHTML="暂   停";
			}
			else{
				cg.loop.pause=true;
				$battleButtonText.innerHTML="战   斗";
				
			}			
		}
		else if(gameObj.startBattle()){//还没开始战斗，但开始战斗成功
			cg.loop.pause=false;
			$battleButtonText.innerHTML="暂   停";
		}
	};

/*********************************************************************************
//  worker 相关
/*********************************************************************************/

/*	worker回调	*/
	this.workerMessageCallBack=function(name){
		return function(e){

			var data=e.data;
			var cmd=data.cmd;
			var mId=data.mId;

			if(!tankKeyObj[name]){
				return;
			}
			var main=tankKeyObj[name]["main"];
			if(cmd=="initEventHandlers"){
				var uid=data.uid;
				var newTank=data.newTank;
				var args=tankKeyObj[name]["args"];
				tankKeyObj[name]["userTank"]=newTank;
				if(uid)
					site.addRobot(args[0], args[1], args[2],args[3],uid+":"+args[4]);
				else{
					site.addRobot(args[0], args[1], args[2],args[3],args[4]);
				}
			}
			if(cmd=="error"){
				alert("用户代码有错误！");
				site.report("code.error");
			}
			if(cmd=="fire"){
				var power=data.power;
				main.fire(power);
			}
			if(cmd=="ahead"){
				var distance=data.distance;
				main.ahead(distance,mId);
			}
			if(cmd=="back"){
				var distance=data.distance;
				main.back(distance,mId);
			}
			if(cmd=="turn"){
				var angle=data.angle;
				main.turn(angle,mId);
			}
			if(cmd=="turnLeft"){
				var angle=data.angle;
				main.turnLeft(angle,mId);					
			}
			if(cmd=="turnRight"){
				var angle=data.angle;
				main.turnRight(angle,mId);					
			}	
			if(cmd=="turnGun"){
				var angle=data.angle;
				main.turnGun(angle,mId);						
			}	
			if(cmd=="turnGunLeft"){
				var angle=data.angle;
				main.turnGunLeft(angle,mId);						
			}	
			if(cmd=="turnGunRight"){
				var angle=data.angle;
				main.turnGunRight(angle,mId);						
			}
			if(cmd=="turnRadar"){
				var angle=data.angle;
				main.turnRadar(angle,mId);	
			}	
			if(cmd=="turnRadarLeft"){
				var angle=data.angle;
				main.turnRadarLeft(angle,mId);	
			}	
			if(cmd=="turnRadarRight"){
				var angle=data.angle;
				main.turnRadarRight(angle,mId);	
			}
			if(cmd=="setAdjustGunForRobotTurn"){
				var independent=data.independent;
				main.setAdjustGunForRobotTurn(independent);
			}
			if(cmd=="setAdjustRadarForGunTurn"){
				var independent=data.independent;
				main.setAdjustRadarForGunTurn(independent);
			}	
			if(cmd=="setAdjustRadarForRobotTurn"){
				var independent=data.independent;
				main.setAdjustRadarForRobotTurn(independent);
			}
			if(cmd=="stopMove"){
				main.stopMove();
			}
			if(cmd=="scan"){
				main.scan();
			}	
			if(cmd=="setAhead"){
				var distance=data.distance;
				main.setAhead(distance,mId);
			}
			if(cmd=="setTurn"){
				var angle=data.angle;
				main.setTurn(angle,mId);
			}	
			if(cmd=="setTurnLeft"){
				var angle=data.angle;
				main.setTurnLeft(angle,mId);
			}
			if(cmd=="setTurnRight"){
				var angle=data.angle;
				main.setTurnRight(angle,mId);
			}
			if(cmd=="setGunTurn"){
				var angle=data.angle;
				main.setGunTurn(angle,mId);
			}
			if(cmd=="setGunTurnLeft"){
				var angle=data.angle;
				main.setGunTurnLeft(angle,mId);
			}
			if(cmd=="setGunTurnRight"){
				var angle=data.angle;
				main.setGunTurnRight(angle,mId);
			}
			if(cmd=="setRadarTurnLeft"){
				var angle=data.angle;
				main.setRadarTurnLeft(angle,mId);
			}
			if(cmd=="setRadarTurnRight"){
				var angle=data.angle;
				main.setRadarTurnRight(angle,mId);
			}
			if(cmd=="setRadarTurn"){
				var angle=data.angle;
				main.setRadarTurn(angle,mId);
			}
			if(cmd=="setFire"){
				var angle=data.angle;
				main.setFire(power);
			}
			if(cmd=="execute"){
				main.execute(mId);
			}
			if(cmd=="doNothing"){	
				main.doNothing();
			}
			if(cmd=="log"){
				var msg=data.msg;
				var tag=data.tag;
				main.log(msg,tag);
			}	
			if(cmd=="setScanStyle"){
				var style=data.style;
				main.setScanStyle(style);
			}
			if(cmd=="getBattleFieldSize"){
				main.getBattleFieldSize();
			}
			if(cmd=="say"){
				var words=data.words;
				var color=data.color;
				main.say(words,color);
			}
			if(cmd=="scan"){
				main.scan();
			}	

			if(cmd=="setUI"){
				var ui=data.ui;
				main.setUI(ui);
			}
			if(cmd=="sendMessage"){

				var sendRobot=data.robot;
				var message=data.message;
				var list=gameObj.getCurrentRobotList();

				for(var i=0,len=list.length;i<len;i++){
					if(list[i].name==sendRobot.name){
						main.sendMessage(list[i],message);
					}
					
				}
			}
			if(cmd=="broadcastMessage"){
				var message=data.message;
				main.broadcastMessage(message);
			}
			if(cmd=="eventFinished"){
				var rName=data.name;
				codeTank.event.eventHandleFinished(rName);
			}
		}	
	}
});

Jx().$package(function(J){
	site.init();
});

