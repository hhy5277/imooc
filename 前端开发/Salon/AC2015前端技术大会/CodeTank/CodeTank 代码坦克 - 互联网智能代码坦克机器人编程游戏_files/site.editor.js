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

Jx().$package("site.editor",function(J){
    var packageContext = this;
	var $E = J.event;
	var $D = J.dom;
	
	var $robotNameText, //robot名称的输入框
		$battleBtnBox,
		$shareCodeButton,
		$battleMode,
		$editor,
    	$robotListWrap,
    	$editorWrap,
		$openSourceBtn,
		$openSourceClick,
		$openSourceMask;

	var isEditing = false;
	var editorSession;
	var openedRobotFullName;
/*********************************************************************************
//  资源加载
/*********************************************************************************/

	var waitingAction = false;
	var resourcesLoading = false;
	var resources = [
		'js/ace.all.js'
		// 'js/ace/ace.js',
		// 'js/ace/mode-javascript.js',
		// 'js/ace/theme-tumblr.js'
	];

	var loadResource = function(){
		var url = resources.shift();
		if(!url){
			resources = false;
			resourcesLoading = false;
			J.event.notifyObservers(packageContext, 'resourcesLoad');
			if(waitingAction){
				packageContext[waitingAction[0]].apply(packageContext, waitingAction.slice(1));
				waitingAction = null;
			}
		}
		J.http.loadScript(url, {
			onSuccess: function(){
				loadResource();
			}
		});
	}

	var loadResources = function(action){
		waitingAction = action;//动作之保存最近一次
		if(resourcesLoading){
			return;
		}
		resourcesLoading = true;
		loadResource();
		
	}
/*********************************************************************************
//  事件
/*********************************************************************************/
	var robotListCommands = {
		'new': function(param, target, event){
			packageContext.create();
		},
		'cancelEdit': function(param, target, event){
			if (EditorStatus.checkIsUpdate()){
    			closeCode();
			}
		},
		'delete': function(param, target, event){
			TankSave.del();
        	closeCode();
	    },
	    'save': function(param, target, event){
	    	var robotFullName = $robotNameText.value;
	    	//保存robot代码
	    	TankSave.save(robotFullName);
	    },
	    'editorCollect': function(param, target, event){
	    	site.robotManager.collectTank(target.getAttribute('tid'));
	    },
		'openSourceClick': function(param, target, event){
			$openSourceMask = $D.id('openSourceMask');
			var robotFullName = $robotNameText.value;
			if($D.hasClass($openSourceMask, "osActive")){
				$D.removeClass($openSourceMask, "osActive");
				//保存robot代码
				var osStatus = 1;
		    	TankSave.save(robotFullName,osStatus);
			}else{
				if(confirm("选择闭源后，别人将搜索不到您的代码。您确认闭源么？")){
					$D.addClass($openSourceMask, "osActive");
			    	//保存robot代码
					var osStatus = 2;
			    	TankSave.save(robotFullName,osStatus);
				}
			}
			// var robotFullName = $robotNameText.value;
	  //   	//保存robot代码
	  //   	TankSave.save(robotFullName);
		},
		'openSourceClickCreate': function(param, target, event){
			$openSourceMask = $D.id('openSourceMask');
	
			if($D.hasClass($openSourceMask, "osActive")){
				$D.removeClass($openSourceMask, "osActive");
					var osStatus = 1;

			}else{
				if(confirm("选择闭源后，别人将搜索不到您的代码。您确认闭源么？")){
					$D.addClass($openSourceMask, "osActive");
				}
			}
			// var robotFullName = $robotNameText.value;
	  //   	//保存robot代码
	  //   	TankSave.save(robotFullName);
		}
	}
	
/*********************************************************************************
//  内部方法
/*********************************************************************************/

	var initReferences = function(){
		$robotNameText = $D.id("nameText");
		$battleBtnBox = $D.id('editorBtnBox');
		$shareCodeButton = $D.id('shareCodeButton');
		$battleMode = $D.id('battleMode'); 

		$editor = $D.id('editor');
    	$robotListWrap = $D.id('robotListWrap');
    	$editorWrap = $D.id('editorWrap');

		$openSourceBtn = $D.id('openSourceBtn');
		$openSourceClick = $D.id('openSourceClick');
		$openSourceMask = $D.id('openSourceMask');


	}

	var initEditor = function(){
		var JsMode = require('ace/mode/javascript').Mode;      
		var edit = ace.edit('editor');
		edit.setTheme('ace/theme/tumblr'); 
		editorSession = edit.getSession();
	 	editorSession.setMode(new JsMode());
		editorSession.setUseWrapMode(true);
	}

	var bindCommands = function(){
		qtool.bindCommands($editorWrap, 'click', robotListCommands);

	}

	var setEditorStyle = function (type, tid, openSource){
		//按钮配置
		type = type || 0;
		openSource = openSource || 2;
		var html = '';
		var openHtml = '';
		if (type == 1){
			html = '<div  cmd="save" class="left btn btn-success tankbaseControlButton" report="editor.save,tank.save" title="快捷键：Ctrl+S">保存</div>\
					 <div  cmd="delete" class="left btn btn-danger tankbaseControlButton"  report="editor.del,tank.del">删除</div>';
			$robotNameText.disabled = false;
		 
			if (openSource == 0){
				openHtml = '<a title="点击选择是否公开您的坦克代码。"><div id="openSourceClick" cmd="openSourceClick" class="btn btn-success tankbaseControlButton ">开源 闭源\
							<div id="openSourceMask" class="openSourceMask osActive"></div>\
						 </div></a>';
					}else if(openSource == 1){
						openHtml = '<a title="点击选择是否公开您的坦克代码。"><div id="openSourceClick" cmd="openSourceClick" class="btn btn-success tankbaseControlButton ">开源 闭源\
							<div id="openSourceMask" class="openSourceMask"></div>\
						 </div></a>';
					}else if(openSource == 2){
						openHtml = '<a title="点击选择是否公开您的坦克代码。"><div id="openSourceClick" cmd="openSourceClickCreate" class="btn btn-success tankbaseControlButton ">开源 闭源\
							<div id="openSourceMask" class="openSourceMask"></div>\
						 </div></a>';
					}
			//是否开源
						
		}else if (type == 2){
			html = '<div cmd="editorCollect" tid="'+ tid +'" class="left btn btn-success tankbaseControlButton" report="editor.addFav,tank.addFav">收藏</div>';
			$robotNameText.disabled = true;
			openHtml = '';
		}else{
			$robotNameText.disabled = true;
			openHtml ='';
		}
		$battleBtnBox.innerHTML = html;
		$openSourceBtn.innerHTML = openHtml;
	}


	/*	打开编辑代码	*/
	var openCode=function(robotFullName,code){
		
		openedRobotFullName = robotFullName;
		//robotFullName == "" ? isNew=true : isNew=false;
		var arr = robotFullName.split('.');
		arr.shift();
		robotFullName = arr.join('.');
		$robotNameText.value=robotFullName;
		
		packageContext.setContent(code);
		EditorStatus.init(code);

        $D.addClass($robotListWrap, "robotListWrapCollapse");
        $D.removeClass($editorWrap, "sideCollapse");

        isEditing = true;
        
	};

	/*	关闭编辑代码	*/
	var closeCode=function(){
		isEditing = false;
        $D.addClass($editorWrap, "sideCollapse");
        $D.removeClass($robotListWrap, "robotListWrapCollapse");
       
		EditorStatus.offBeforeunload();
	};
	
	/*	请求代码	*/
	var requesetCode=function(robotFullName, callback){
		var code;
		code = J.localStorage.getItem(robotFullName);
		//是否在localStorage中存在
		if(code){
			callback(code);
		} else {
			//不存在于localStorage中则请求服务器脚本资源
			J.http.ajax("robot/"+robotFullName+".js", {
				type:"text",
				onSuccess:function(data){
					callback(data.responseText);
				}
			});
		}
	};
/*********************************************************************************
//  公有方法
/*********************************************************************************/

	this.init = function(){
		J.event.addObserver(packageContext, 'resourcesLoad', function(){
			initReferences();
			initEditor();
			bindCommands();
		});
	
	
	}

	/**
	 * 创建新坦克
	 * @return {[type]}
	 */
	this.create = function(){
		if(resources){
			loadResources(['create']);
			return;
		}
		TankSave.setEditId('');
		setEditorStyle(1);
		var robotFullName = "CodeTank.Robot1";
		requesetCode(robotFullName, function(code){
			openCode(robotFullName, code);
		});
	}

	/**
	 * 编辑查看代码
	 * @param  {Object} tank tankModel对象
	 * @param  {Number} type 0默认为纯查看，1：编辑坦克，2：收藏坦克 id: 为_id 
	 */
	this.edit = function(tank, type){
		var tankName = tank.uid + '.' + tank.tid;
		if(resources){
			loadResources(['edit', tank, type]);
			return;
		}else if(site.account.isLogin() && tank.uid !== site.account.getCurrentUser().uid && tank.openSource == 0){
			site.util.Alert.warning('该坦克代码闭源，暂时不能查看哈！');
			return;
		}
		setEditorStyle(type, tank._id,tank.openSource);	
	    //var tankName = tank.uid + '.' + tank.tid;
        if(site.account.isLogin() && tank.uid === site.account.getCurrentUser().uid){
            $D.show($shareCodeButton);
            var text = '#CodeTank# 这是我写的@CodeTank 智能坦克代码哦，谁来跟我切磋下？ ' + 
            'http://codetank.alloyteam.com/?cmd=view&param=' + tankName;
            $shareCodeButton.shareText = text;
            //site.share.bindSinaPostCMD('shareCodeToSina', text);
        }else{
            $D.hide($shareCodeButton);
        }
		TankSave.setEditId(tank._id);

		openCode(tankName, tank.code);
		
	}

	this.getContent = function(){
		return editorSession.getValue();
	}

	this.setContent = function(content){
		editorSession.setValue(content);
	}
/*********************************************************************************
//  一些代码的封装
/*********************************************************************************/
	/*
	 * Yukin: 坦克保存类
	 */
	var TankSave = {
		currentId : null, // 当前编辑的id
		dom : {},
	
		setEditId : function(id){
			this.currentId = id;
		},
		setBtnStatus : function(status){
			this.dom.save = $D.id('saveButton');
			
			var dom = this.dom.save;
			if (status){
				if ($D.hasClass(dom, 'disabled')){					
					$D.removeClass(dom, 'disabled');
				}
			}else{
				if (!$D.hasClass(dom, 'disabled')){					
					$D.addClass(dom, 'disabled');
				}
			}
		},
		save : function(name,osStatus){
			if(name =="" ) {
				site.util.Alert.warning('名称不能空！');
				return false;
			}
			var code = packageContext.getContent();
			if(code =="" ) {
				site.util.Alert.warning('代码不能空！');
				return false;
			}
			var isopen;
			if(osStatus){
				if(osStatus === 1){
					isopen = 1;
				}else{
					isopen = 0;
				}
			}else{
			
				$openSourceMask = $D.id('openSourceMask');
				if($D.hasClass($openSourceMask, 'osActive')){
					isopen = 0;
				}else{
					isopen = 1;
				}
			}
			if (this.currentId){

				this.update(name, code, isopen);
			}else{
				this.add(name, code, isopen);
			}
			
		},
		add : function(name, code, isopen){ 
			if (this.dom.save && $D.hasClass(this.dom.save, 'disabled')){
				return false;
			}
			if (!site.account.isLogin()){
				site.util.Alert.warning('请先登录!');//alert('请先登录！');
				return false;
			} 
			var user = site.account.getCurrentUser();
			var intIsopen = parseInt(isopen);
			var param = {
				tid : name, 
				uid : user.uid,
				openSource : intIsopen,
				code : code
			}
			var tank = site.robotManager.getTankByName(user.uid + '.' + name);
			if (tank){
				site.util.Alert.warning('坦克名称已经存在，请修改!');//alert('坦克名称已经存在，请修改'); 
				return false;
			}
			var _this = this;			
			this.setBtnStatus(false);
			site.rpc('/api/tanks/create', param, function(data){   
				if (data.code == 0){				 
					site.util.Alert.success(name + " 保存成功！");//alert(name + " 保存成功！");
					EditorStatus.setCode(code);
					site.robotManager.updateMyRobotList();
				}else if (data.code == 10002){
					site.util.Alert.warning('坦克名称已经存在，请修改'); 
				}else{
					site.util.Alert.warning('保存失败，请重试！');	
				}
				_this.setBtnStatus(true);
			});
		}, 
		update : function(name, code, isopen){
			if (this.dom.save && $D.hasClass(this.dom.save, 'disabled')){
				return false;
			}
			if (!site.account.isLogin()){
				site.util.Alert.warning('请先登录！');
				return false;
			}
			if (!this.checkUser()){
				site.util.Alert.warning('您只能修改自己的坦克！');
				return false;	
			}
			var user = site.account.getCurrentUser();
			var intIsopen = parseInt(isopen);
			var param = {	
				'_id' : this.currentId, 
				tid : name, 
				uid : user.uid,
				openSource : intIsopen,
				code : code
			}
			var tank = site.robotManager.getTankByName(user.uid + '.' + name);
			if (tank && tank._id != this.currentId){
				site.util.Alert.warning('坦克名称已经存在，请修改'); 
				return false;
			}
			var _this = this;
			this.setBtnStatus(false); 
			site.rpc('/api/tanks/save', param, function(data){   
				if (data.code == 0){				 
					site.util.Alert.success(name + " 修改保存成功！");
					EditorStatus.setCode(code);
					site.robotManager.updateMyRobotList();
				}else if (data.code == 10002){
					site.util.Alert.warning('坦克名称已经存在，请修改'); 
				}else{
					site.util.Alert.warning('修改保存失败，请重试！');	
				}
				_this.setBtnStatus(true);
			});
		},
		del : function(){
			if (!site.account.isLogin()){
				site.util.Alert.warning('请先登录！');
				return false;
			}
			if (!this.checkUser()){
				site.util.Alert.warning('您只能删除自己的坦克！');
				return false;	
			}
			var param = {	
				'_id' : this.currentId, 
				tid : site.robotManager.getTank(this.currentId).tid, 
				uid : site.account.getCurrentUser().uid
			}
			var _this = this;
			site.rpc('/api/tanks/delete', param, function(data){   
				if (data.code == 0){				 
					site.util.Alert.success(name + " 删除成功！");
					site.robotManager.updateMyRobotList();
				}else{
					site.util.Alert.warning('删除失败，请重试！');	
				}
			});
		},
		checkUser : function(){
			var tank = site.robotManager.getTank(this.currentId);
			if (!tank){
				return false;
			}	
			if (!site.account.isLogin()){ 
				return false;
			}
			if (tank.uid != site.account.getCurrentUser().uid){
				return false;	
			}
			return true;
		}
	}

	/*
	 *
	 */
	var EditorStatus = {
		code : '',
		msg : '正在编辑的代码未保存，确定离开吗？',
		init : function(code){
			this.setCode(code);
			this.onBeforeunload();
		},		
		setCode : function(code){
			this.code = code;	
		},
		closeHook : function(e){
			var _this = EditorStatus;
			var message = _this.msg;
			var code = packageContext.getContent();
			if (_this.code == code){
				return;	
			}
			if(J.browser.safari || J.browser.chrome ){
				return message;
			}else{
				if( J.browser.ie > 0 ){	
					var event = window.event;
					event.returnValue = message;				 
				}else{
					e.returnValue = message;
				}
			}
		},
		//判断是否保存更新
		checkIsUpdate : function(){
			var code = packageContext.getContent();
			if (this.code == code){
				return true;	
			}
			if (confirm(this.msg)){
				return true;
			}else{
				return false;	
			}
		},
		onBeforeunload : function(){ 
			 $E.on(window, "beforeunload", this.closeHook);
		},
		offBeforeunload : function(){
			 $E.off(window, "beforeunload", this.closeHook);
		}
	}

});


