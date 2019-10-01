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

Jx().$package("site.sidebar",function(J){
    var packageContext = this;
	var $E = J.event;
	var $D = J.dom;
	var cg=J.cnGame;

	var $robotList, $editor, $robotListWrap,
		$sideNetTankList ,$sideNetTeamList
		;

	var fixHeight = 50+46;

	this.init = function(){
		$robotList = $D.id('robotList');
		$editor = $D.id('editor');
		$sideNetTankList = $D.id('sideNetTankList');
		$sideNetTeamList = $D.id('sideNetTeamList');
		

		$E.on(window, "resize", resize);

		$E.on($robotList,"click",listClickHandler);
		$E.on($sideNetTankList,"click",listClickHandler);
		$E.on($sideNetTeamList,"click",listClickHandler);

		Side.init();

		resize();
	}

	this.toggle = function(){
		Side.toggle();
	}

	this.show = function(){
		Side.show();
	}

	this.close = function(){
		Side.close();
	}

	this.resetSelectedButton=function(){
		var inputArr=$D.tagName("input",$robotList);
		for(var i=0,l=inputArr.length;i<l;i++){
			if(inputArr[i].checked)
			inputArr[i].checked=false;
		}
	}

/*********************************************************************************
//  内部方法
/*********************************************************************************/

	var resize=function(){

        var winWidth = window.innerWidth || document.documentElement.offsetWidth, 
            winHeight = window.innerHeight || document.documentElement.offsetHeight;

		var width = Math.max(200, parseInt(winWidth)-cg.width-42);
		var height = parseInt(winHeight);
		
		$robotList.style.height = height - fixHeight +"px";
		$editor.style.height = height - fixHeight +"px";
		if(SideNetTank){
			SideNetTank.resize(height);
		}
	};

	var listClickHandler= function(e){
		var mode=codeTank.getMode();
		var target=e.target;
		if(gameObj.isStartBattle){
			e.preventDefault();
		}
		if(target.tagName!="INPUT"){
			return;
		}
		// var mode=$D.id("battleMode").value;
		var inputtype=target.getAttribute("inputtype");

		if(mode=="teamTwo"||mode=="teamFive"||mode=="dev"){
			var teamId=target.getAttribute("tid");
			
			if(target.checked){
				if(mode!="dev"&&inputtype!="team") {
					alert("该模式下请选择队伍进行对战！");
					return;
				}
				//组队pk
				if(inputtype=="team")
					site.robotManager.getSelectedTeam(teamId);
			}
			else{
				if(inputtype=="team")
					site.robotManager.deleteTeam(teamId);
			}
		}
		if(mode=="oneVSOne"||mode=="melee"||mode=="dev"){//单挑群殴
			var tId=target.getAttribute("tid");
			var robot = site.robotManager.getSelectedRobot(target);	
			if(target.checked){//点击添加
				if(mode!="dev"&&inputtype!="robot"){
					alert("该模式下不能选择队伍进行对战！");
					return;				
				}
				if(mode!="dev"){
					J.http.ajax("js/game/coderobot.worker.js", {
						type:"text",
						onSuccess:function(data){
							robot.getCode(function(code, robot){	
									
								window.URL = window.URL || window.webkitURL || window.mozURL;

								var workerCode=	";(function(){"
									+data.responseText
									+"var handlers;"
									+"(function(){var self;var deleteOnMessage;var postMessage=function(){};var onmessage;var Robot;"
									+code
									+"newTank=new Robot();"
									+"handlers=initHandlers();"
									+"})();"
									+"postMessage({cmd:'initEventHandlers','newTank':handlers});"
									+"})();";

								var codeContent;
								try {
									codeContent = new Blob([workerCode]);
								}
								catch(ex){
									window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder; 
									if(BlobBuilder){
										var blob=new BlobBuilder();
										blob.append(workerCode);
										codeContent=blob.getBlob();
									}

								}
							
								var blobURL = window.URL.createObjectURL(codeContent);
								
								var worker = new Worker(blobURL);
					
						
								if(J.isUndefined(window.tankKeyObj)){
									window.tankKeyObj={};
								}
								var fullName=robot.uid+'.'+robot.tid;
								var ko=tankKeyObj[fullName]={};
								ko["args"]=[tId,fullName,robot.team];
								ko["worker"]=worker;
								worker.onmessage=site.workerMessageCallBack(fullName);			
							});
						}
					});
				}
				else{
					robot.getCode(function(code, robot){	
						try{		
							eval(code);
							site.addRobot(tId,robot.uid+'.'+robot.tid, robot.team);	
						}
						catch(e){
							console.log(e);
							alert("坦克: "+robot.uid+'.'+robot.tid+" 的代码存在错误！");
						}
						
					});					
				}

			}
			else{//点击删除
				site.robotManager.deleteRobot(robot.uid+'.'+robot.tid);
			}
			
		}
		
	};

/*********************************************************************************
//  资源封装
/*********************************************************************************/

	/*
	 *	Yukin:侧边栏控制
	 */ 

	var Side = {
		dom :{},

		init : function(){
			

			this.dom.main = $D.id('robotFactory');
			this.dom.btn = $D.id('sideButton');
			this.dom.leftMain = $D.id('leftMain');
			this.dom.toolbar = $D.id('toolbar');
			
			//初始化网络坦克框
			SideNetTank.init();
			SideNetTeam.init();
			// $E.on(this.dom.wrapper, 'click', function(e){
			// 	e.stopPropagation();
			// });
			site.util.ClickProxy.call(this, {target:['tankbaseControl']});
		},

		//打开折叠控制
		toggle : function(){			
			if ($D.hasClass(this.dom.main, 'sideUnfold')){
				this.close();				
			}else{
				this.show();			
			}
		},
		show : function(){
			$D.addClass(this.dom.main, 'sideUnfold');
			//this.dom.btn.innerHTML = '&gt;&gt;';
			$D.addClass(this.dom.btn, 'sideButtonRight');
			//绑定其他区域点击关闭	
			$E.on(this.dom.toolbar, 'click', this.onWinClick);	
			$E.on(this.dom.leftMain, 'click', this.onWinClick);	
		},
		close : function(){
			$D.removeClass(this.dom.main, 'sideUnfold');
			//this.dom.btn.innerHTML = '&lt;&lt;';
			$D.removeClass(this.dom.btn, 'sideButtonRight');
			//$E.off(document, 'click', this.onWinClick);
			$E.off(this.dom.toolbar, 'click', this.onWinClick);	
			$E.off(this.dom.leftMain, 'click', this.onWinClick);
		},
		//响应窗口点击
		onWinClick : function(e){	 
			Side.close();
		},
		//tankbaseControl响应方法*************
		//查看网络战队
		onViewNetTeam : function(dom){  
			SideNetTeam.show();
		},
		onViewNetTank : function(dom){
			SideNetTank.show();
		},
		onCreateTank: function(){
			site.editor.create();
		},
		onCreateTeam : function(dom){ 
			//site.util.Alert.tips('xxx', 2, {isAutoClose:false, hasClose:true, hasBtn:true, callback : function(result){ alert(result.retcode)}}); return false;
			site.robotManager.addTeam();
		}
	}

	/*
	 *	网络坦克侧边控制类
	 */ 
	var SideNetTank = {
		dom : {},		
		isShow : false,
		init : function(){
			this.dom.main = $D.id('sideNetTankWrap');
			this.dom.box = $D.id('sideNetTankBox');
			this.dom.list = $D.id('sideNetTankList');
				
			
			var _this = this;
			$E.on($D.id('netTankBack'),'click' , function(){
				_this.back();	
			});
			$E.addObserver(site.account, 'loginSuccess', function(e){
				if (_this.isShow){
					_this.show();
				}
			});		 
		},
		show : function(){
			if (!this.dom.main){
				return false;	
			}
			this.isShow = true;
			if ($D.hasClass(this.dom.main, 'sideCollapse')){
				$D.removeClass(this.dom.main, 'sideCollapse');
			}
			site.robotManager.netTankList();
			this.resize();
		},
		close : function(){
			if (!this.dom.main){
				return false;	
			}
			this.isShow = false
			if (!$D.hasClass(this.dom.main, 'sideCollapse')){
				$D.addClass(this.dom.main, 'sideCollapse');
			}
		},
		back : function(){
			this.close();
		},
		resize : function(height){
			if (this.isShow && this.dom.box){
				if (!height){
					var winHeight = window.innerHeight || document.documentElement.offsetHeight; 
					height = parseInt(winHeight);	
				}
				this.dom.box.style.height = height - fixHeight + 'px';	
			}
		}
	} 
	
	/*
	 *	网络战队侧边控制类
	 */ 
	var SideNetTeam = {
		dom : {},		
		isShow : false,
		init : function(){
			this.dom.main = $D.id('sideNetTeamWrap');
			this.dom.box = $D.id('sideNetTeamBox');
			this.dom.list = $D.id('sideNetTeamList');
				
			
			var _this = this;
			$E.on($D.id('netTeamBack'),'click' , function(){
				_this.back();	
			});
			$E.addObserver(site.account, 'loginSuccess', function(e){
				if (_this.isShow){
					_this.show();
				}
			});		 
		},
		show : function(){
			if (!this.dom.main){
				return false;	
			}
			this.isShow = true;
			if ($D.hasClass(this.dom.main, 'sideCollapse')){
				$D.removeClass(this.dom.main, 'sideCollapse');
			}
			site.robotManager.netTeamList();
			this.resize();
		},
		close : function(){
			if (!this.dom.main){
				return false;	
			}
			this.isShow = false
			if (!$D.hasClass(this.dom.main, 'sideCollapse')){
				$D.addClass(this.dom.main, 'sideCollapse');
			}
		},
		back : function(){
			this.close();
		},
		resize : function(height){
			if (this.isShow && this.dom.box){
				if (!height){
					var winHeight = window.innerHeight || document.documentElement.offsetHeight; 
					height = parseInt(winHeight);	
				}
				this.dom.box.style.height = height - fixHeight + 'px';	
			}
		}
	} 

});


