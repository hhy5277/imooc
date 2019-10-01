Jx().$package("site.robotManager",function(J){
	var $D=J.dom,
		$E=J.event,
		packageContext = this;

	//入口函数
	this.init = function(){
		//showNewRobots();
		//监听登录事件
		$E.addObserver(site.account, 'loginSuccess', loginSuccess);//登录不成功
		//设置代理
		ViewProxy.init();
		
		$E.addObserver(window, 'systemReady', function(){
			//处理我的坦克列表
			MyTank.init(); 
			AlloyTank.init();
			MyCollect.init();
			NetTank.init();
			NetTeam.init();
			
			Team.init();
			MyFavTeam.init();
		});
	}
	
	/****************************************
	 *	对外接口
	 */
	//更新坦克列表
	this.updateMyRobotList = function(){
		MyTank.getList();
	}
	//获取选中的坦克
	this.getSelectedRobot = function(dom){
		return TankModel.get(dom.getAttribute('tid'));
	}
	this.deleteRobot=function(name){
		var robotList=gameObj.getCurrentRobotList();
		var mode=codeTank.getMode();
		if(mode!="dev"&&tankKeyObj){
			tankKeyObj[name]=undefined;
		}
		
		for(var i=0,l=robotList.length;i<l;i++){
			if(robotList[i].name==name){
				robotList[i].disappear();
				break;
			}
		}			
	};
	this.deleteTeam=function(teamId){
		var robotList=gameObj.getCurrentRobotList();
		for(var i=0,l=robotList.length;i<l;i++){
			if(robotList[i].team==teamId){
				robotList[i].disappear();
			}
		}	
	};
	var colorArr=[1,2];
	//获取选中的队伍名称,因为需要弹出颜色选择，所以通过参数回调实现.回调返回值：{teamId:颜色代码}
	this.getSelectedTeam = function(teamId){ 
		//改为异步获取
		TeamModel.getEx(teamId, getSelectedTeamCallback); 
	}
	//获取战队异步回调
	function getSelectedTeamCallback(team){
		//var team=site.robotManager.getTeam(teamId);
		if(!team) return;
		 
		var mode=codeTank.getMode();
		//Team.addToWar(callback);
		if(!colorArr.length) colorArr=[1,2];
		var teamColor=colorArr.pop();
		
		var teamName=team.name, teamId = team._id;
		members=team.members;

		if(!members) return;
		if(mode!="dev"){
			J.http.ajax("js/game/coderobot.worker.js", {
				type:"text",
				onSuccess:function(data){
					for(var m=0,l=members.length;m<l;m++){
						var robot=site.robotManager.getTank(members[m]);
						(function(num){
							robot.getCode(function(code, robot){	
								try{
									window.URL = window.URL || window.webkitURL || window.mozURL;
									var workerCode=	";(function(){"
										+data.responseText
										+"var handlers;"
										+"(function(){var self;var deleteOnMessage;var postMessage=function(){};var onmessage;var Robot;"
										+code
										+"newTank=new Robot();"
										+"handlers=initHandlers();"	
										+"})();"
										+"postMessage({cmd:'initEventHandlers','newTank':handlers,'uid':'"+robot.uid+"'});"
										+"})();"; 
		
									
									var blob = new Blob([workerCode]);
									var blobURL = window.URL.createObjectURL(blob);
									var worker = new Worker(blobURL);
							
									if(J.isUndefined(window.tankKeyObj)){
										window.tankKeyObj={};
									}
									var fullName=robot.uid+':'+teamName+'.'+robot.tid;
									var ko=tankKeyObj[fullName]={};		
									ko["args"]=[members[num],fullName, teamId,teamColor,teamName];
									ko["worker"]=worker;

									worker.onmessage=site.workerMessageCallBack(fullName);
								}
								catch(e){
									site.util.Alert.warning("坦克: "+ fullName +" 的代码存在错误！");
								}	
							});
						})(m);
					}
				}
			});
		}
		else{
			for(var m=0,l=members.length;m<l;m++){
				var robot=site.robotManager.getTank(members[m]);
				robot.getCode(function(code, robot){	
					try{
						eval(code);
						site.addRobot(members[m],robot.uid+':'+teamName+'.'+robot.tid, teamId,teamColor,robot.uid+':'+teamName);
					}
					catch(e){
						site.util.Alert.warning("坦克: "+robot.uid+':'+teamName+'.'+robot.tid+" 的代码存在错误！");
					}

						
				});
			}
		}
	}
	
	
	//更新tank
	this.updateTank = function(id, tid, code){
		TankModel.update(id, tid, code);	
	}
	//通过id获取名称
	this.getTank = function(id){
		return TankModel.get(id);	
	}
	//通过名称获取坦克:name=uid.tid
	this.getTankByName = function(name){
		return TankModel.getByName(name);
	}
	//添加坦克
	this.addTanks = function(tanks){
		TankModel.addList(tanks);

	}
	//添加一个队伍
	this.addTeam = function(){
		Team.add();	
	}
	//获取一个team
	this.getTeam = function(teamId){  
		return TeamModel.get(teamId);	
	}
	//查看网络坦克
	this.netTankList = function(){
		NetTank.showList();	
	}
	//查看网络战队
	this.netTeamList = function(){
		NetTeam.showList();	
	}
	//收藏坦克
	this.collectTank = function(tid){
		NetTank.collect(tid);
	}
	
	//输出日志测试
	this.log = function(){
		console.log(TankModel.list);	
	}

	

	/****************************************
	 * 内部方法
	 */ 
	 //获取代理的事件源节点
	 function getActionTarget(event, level, property, parent){
		var t = event.target,
			l = level || 3,
			s = level !== -1,
			p = property || 'cmd',
			end = parent || document.body;
		while(t && (t !== end) && (s ? (l-- > 0) : true)){
			if(t.getAttribute(p)){
				return t;
			}else{
				t = t.parentNode;
			}
		}
		return null;
	}

	function getBattleCount(tank){
		return '<span class="battleCount" title="战斗次数">[' + (tank.battleCount || 0) + ']</span>';
	}

	/*
	 *	页面代理
	 */
	var ViewProxy = {
		dom : {},
		init : function(){
			var dom = $D.id('robotList');
			$E.on(dom, 'click', this.onClick);
		},
		onClick : function(e){
			var target = getActionTarget(e);
			if (!target){
				return false;
			}
			e.preventDefault();
			var cmd = target.getAttribute('cmd');
			switch(cmd){
				case 'viewCode' : 
					var _id = target.getAttribute('tid');
					var type = target.getAttribute('param');
					var robot = TankModel.get(_id);
					if (robot){
						robot.getCode(function(code, obj){
							// tank.editTank(obj, type);
							site.editor.edit(obj, type);
						});	
					}					
					break;
				case 'delCode' : 
					if (confirm('确定删除吗？')){
						var _id = target.getAttribute('tid');
						MyTank.del(_id);
					}
					break;	
				case 'showChild' : 
					var dom = target.parentNode;
					if ($D.hasClass(dom, 'showChild')){
						$D.removeClass(dom, 'showChild')
					}else{
						$D.addClass(dom, 'showChild')
					}
					break;
				case 'editTeam' : 
					Team.edit(target.getAttribute('tid'));	
					break;
				case 'collectCode' : 
					favTank(target.getAttribute('tid'));	
					break;	
				case 'delTeam' : 
					if (confirm('确定删除吗？')){
						Team.del(target.getAttribute('tid'));	
					}
					break;	
				case 'delCollect' : //删除收藏tank
					if (confirm('确定删除吗？')){
						MyCollect.del(target.getAttribute('cid'));
					}
					break;
				case 'delFavTeam' : //删除收藏
					if (confirm('确定删除吗？')){
						MyFavTeam.del(target.getAttribute('cid'));	
					}
					break;	
				case 'viewFavTeamMember' : //查看收藏战队成员
					MyFavTeam.viewMembers(target.getAttribute('tid'), target.getAttribute('cid'));	
					break;									
			}
		}
	}
	
	//公共函数：收藏tank
	function favTank(id){
		if (!site.account.isLogin()){
			site.util.Alert.warning('请先登录!'); 
			return false;	
		} 
		var param = { tid : id };
		site.rpc('/api/fav/create', param, function(data){
			if (data.code == 10000){
				site.util.Alert.warning('请先登录!');
				return false;// not login	
			}
			if (data.code == 10002){
				site.util.Alert.warning('已收藏过！'); 
				return false;
			}else if (data.code != 0){
				site.util.Alert.warning('收藏失败！'); 
				return false;
			}
			if (data.code == 0){
				site.util.Alert.success('收藏成功！'); 
				MyCollect.getList();
			}
			
		});	
	}
	
	
	
	//登录成功
	function loginSuccess(user){  
		MyTank.getList();
		MyCollect.getList();
		Team.getData();
		MyFavTeam.getList(); 
	} 
	 
	
	
	/**
	 * tank数据模型
	 标准坦克数据对象: {_id : '内部唯一编号', 'tid' : 'tank name', uid : 'user name', code :'', team : '队名'}
	 */
	var TankModel = {
		list : {},
		callback : null, //获取代码回调
		add : function(tank){ 
			 this.list[tank._id] = tank;
			 //为tank添加一个获取code的方法. 	第二个参数即为对象本身
			 tank.getCode = function(callback){
				if (!callback){
					return false;	
				}
				if (this.code && this.code != ''){
					callback(this.code, this);
					return false;
				}
				var _this = this;
				site.rpc('/api/tanks/get', {_id : this._id }, function(data){					 
					if (data.code == 0){
						_this.code = data.data.code;
						callback(_this.code, _this);
						
					}else{
						site.util.Alert.warning('获取坦克:'+ _this.uid + '.'+ _this.tid + '代码失败!'); 
						return false;
					} 
				});
				
			 }

		},
		addList : function(tanks){
			for(var i = 0, item; item = tanks[i]; i++) {
			   // this.list[item._id] = item;
			    this.add(item);
			}
		},
		get : function(id){
			return  this.list[id];
		},
		remove : function(id){
			if (this.list[id]){
				this.list[id] = null;
				delete this.list[id];	
			}
		},
		getByName: function(name){
			var name = name.split('.'), list = this.list;
			var uid = name[0], tid = name[1];
			for(var i in list){
				if(list[i].uid == uid && list[i].tid == tid){
					return list[i];
				}
			}
			return null;
		},
		update : function(key, name, code){
			if (!this.list[tank._id]){
				return false;	
			}
			this.list[tank._id].tid = name;
			this.list[tank._id].code = code;
		},
		setTeam : function(id, teamName){
			if (this.list[id]){
				this.list[id].team = teamName;
			}
		}
	}
	
	
	/*
	 *	我的坦克
	 */
	var MyTank  = {
		dom : {},
		list : [], //只保存_id
		init : function(){
			this.dom.main = $D.id("myRobotList");			
			if (site.account.isLogin()){
				this.getList(); //
			}else{
				this.showInfo('请先登录!');	
			}
		},
		getList : function(){
			var user = site.account.getCurrentUser();
			if (!user){
				return false;	
			}
			var _this = this;
			var param = { uid : user.uid};
			site.rpc('/api/tanks/list', param, function(data){
				if (data.code == 10000){
					_this.showInfo('请先登录!');
					return false;// not login	
				}
				if (data.code != 0){
					site.util.Alert.warning('拉取个人坦克列表失败');
					_this.showInfo('拉取个人坦克列表失败!');
					return false;
				}
				//_this.list = data.data;				
				_this.fillList(data.data);
			});
		},
		fillList : function(list){
			////我的坦克列表，数据格式：[{_id : '内部唯一编号', 'tid' : 'tank name', uid : 'user name', code :''}, ...]
			//var list = this.list;
			list = list || [];
 			this.dom.main.innerHTML = '';
 			this.list = [];
			for (var k = 0, l = list.length; k < l; k++){
				var tank = list[k];

				TankModel.add(tank);
				this.addToList(tank); 
				this.list.push(tank._id);
			}
			

			if (list.length == 0){
				this.dom.main.innerHTML = '<li class="loading">请先创建属于您自己的坦克!</li>';
			}
		},
		showInfo : function(txt){ 
			this.dom.main.innerHTML = '<li class="loading">'+ txt +'</li>';
		},
		//返回我的坦克ID列表
		getTankIdList : function(){
			return this.list;	
		},
		addToList : function(tank){ 
			var tankName = tank.uid + '.' + tank.tid;
			var node = $D.node('li', {
							'id' : 'tank_' + tank._id,
							'tid' : tank._id,
							'title' : tankName							
						});		
			/*var tag = targetDom.getAttribute('id');		
			var type = 2;
			if (tag == 'myRobotList'){
				type = 1;
			}else if (tag == 'netRobotList'){
				type = 2;
			}
			var str = 	needCollect ? '<a href="###" class="viewCode" cmd="collectCode" tid="'+ tank._id +'" report="netlist.addFav,tank.addFav">收藏</a>' : '';	
			*/	
			var html = '<a href="###">\
								<input id="checkmyRobotList'+ tank._id +'" class="robotCheckInput" type="checkbox" inputType="robot" tid="'+ tank._id +'" />\
								<label class="robotCheckLabel" for="checkmyRobotList'+ tank._id +'">'+ tankName +getBattleCount(tank) + '</label>\
						</a>\
						<a href="###" class="viewCode" cmd="viewCode" param="1" tid="'+ tank._id +'" report="tank.view,mylist.view" >编辑</a>\
						<a href="###" class="viewCode" cmd="delCode" param="1" tid="'+ tank._id +'" report="tank.del,mylist.del" >删除</a>';
			node .innerHTML = html;
			this.dom.main.appendChild(node);
		},
		del : function(tid){
			if (!site.account.isLogin()){
				site.util.Alert.warning('请先登录！');
				return false;
			} 
			var param = {	
				'_id' : tid, 
				tid : TankModel.get(tid).tid, 
				uid : site.account.getCurrentUser().uid
			}
			var _this = this;
			site.rpc('/api/tanks/delete', param, function(data){   
				if (data.code == 0){				 
					site.util.Alert.success(name + " 删除成功！");
					TankModel.remove(tid);
					_this.getList();
				}else{
					site.util.Alert.warning('删除失败，请重试！');	
				}
			});
		}
	}
	
	
	/*
	 *	网络的坦克 官方坦克
	 */
	var AlloyTank  = {
		dom : {},
		list : [
			{'_id': 'net_001', 
				tid : 'Robot1',
				uid  : 'CodeTank',
				code : 'Jx().$package(function(J){\r\n	Robot = new J.Class({extend : tank.Robot},{\r\n		/**\r\n		*\u521D\u59CB\u5316\r\n		**/	\r\n		init:function(options){\r\n			this.constructor.superClass.init.call(this,options);\r\n			this.setUI(tank.ui.green);\r\n			this.say(\"Hello world\uFF01\\n\u563F\uFF0C\u4F19\u8BA1\uFF0C\u6211\u6765\u4E86\uFF01\", \"deepskyblue\");\r\n			//this.say(\"\u6218\u6597\u5F00\u59CB\u4E86\uFF0C\u6218\u573A\u73AF\u5883\u611F\u89C9\u4E0D\u9519\u54E6\uFF01\", \"deepskyblue\");\r\n		},\r\n		/**\r\n		*robot\u4E3B\u5FAA\u73AF\r\n		**/	\r\n		run:function(){\r\n			this.ahead(500);//\u5411\u524D\u8D7050\u50CF\u7D20\r\n			this.turn(360);//\u5927\u70AE\u5411\u5DE6\u8F6C360\u5EA6\r\n			this.back(50);//\u540E\u900050\u50CF\r\n			this.turn(-180);//\u5927\u70AE\u5411\u53F3\u8F6C180\u5EA6\r\n			this.say(\"\u6211\u627E\u554A\uFF0C\u627E\u554A\uFF0C\u627ETank\uFF01\");\r\n		},\r\n		/**\r\n		*\u770B\u5230\u5176\u4ED6robot\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onScannedRobot:function(e){\r\n        \r\n			if(this.energy>=5){  \r\n				var a=e.getBearing();\r\n				this.turn(a,function(){\r\n					this.fire(1);//\u770B\u5230\u654C\u4EBA\u7684\u65F6\u5019\u5F00\u706B \r\n				});\r\n				//this.ahead({distance:100});\r\n				\r\n			}\r\n			this.say(\"\u563F\uFF0C\u5C0F\u6837\uFF0C\u6211\u53D1\u73B0\u4F60\u4E86\uFF01\uFF01\", \"deepskyblue\");\r\n			//this.back({distance:50});//\u5F00\u706B\u540E\u5411\u540E\u900050\u50CF\u7D20\r\n		},\r\n		onWin:function(){\r\n			this.say(\"\u4E0D\u597D\u610F\u601D\uFF0C\u6211\u8D62\u5566^_^\",\"yellow\");\r\n		},\r\n		/**\r\n		*\u88AB\u5B50\u5F39\u51FB\u4E2D\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onHitByBullet:function(e){\r\n			this.say(\"\u8D70\u5F00\uFF0C\u4E0D\u8981\u6253\u6211\u4E86\u5566\uFF01\",\"#ffff00\");\r\n            this.ahead(100);\r\n		},\r\n		onHitRobot:function(){\r\n			this.say(\"\u6253\u6B7B\u4F60\uFF01\");\r\n			this.back(30);\r\n		},\r\n		/**\r\n		*\u548C\u5899\u78B0\u649E\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onHitWall:function(e){\r\n			this.say(\"\u5BF9\u4E0D\u8D77\u5566\uFF0C\u4F1F\u5927\u7684\u5899\u5148\u751F\uFF01\");\r\n			var bearing=e.getBearing();\r\n			if(bearing<90&&bearing>-90){//\u5982\u679C\u662F\u8FCE\u9762\u649E\u4E0A\u5899\uFF0C\u5219\u540E\u9000\r\n				this.back(50);\r\n				this.turn(45);//\u5411\u5DE6\u8F6C60\u5EA6\r\n			}\r\n			else{//\u5982\u679C\u662F\u9000\u540E\u649E\u4E0A\u5899\uFF0C\u5219\u524D\u8FDB\r\n				this.ahead(50);	\r\n				this.turn(60);//\u5411\u5DE6\u8F6C60\u5EA6\r\n			}\r\n		},\r\n        onBulletMissed:function(){\r\n        	this.say(\"\u6253\u4E0D\u7740\u5427\uFF01\");\r\n        },\r\n		onDeath:function(){\r\n			this.say(\"\u6211\u771F\u7684\u8FD8\u60F3\u518D\u6D3B500\u5E74...\");\r\n		},\r\n		onRobotDeath:function(e){\r\n			this.say(\"\u8FD9\u662F\u600E\u4E48\u4E2A\u6B7B\u6CD5\uFF01\uFF1F\");\r\n		}		\r\n	});\r\n});'
				},
				/*{'_id':'net_002', 
					tid : 'Robot2',
					uid  : 'CodeTank',
					code : ' '
				},
				{'_id':'net_003', 
					tid : 'Robot3',
					uid  : 'CodeTank',
					code : ''
				},*/
				{'_id':'net_004', 
					tid : 'Robot',
					uid  : 'Cson',
					code : 'Jx().$package(function(J){\r\n    Robot = new J.Class({extend : tank.Robot},{\r\n		/**\r\n		*\u521D\u59CB\u5316\r\n		**/	\r\n		init:function(options){\r\n			this.constructor.superClass.init.call(this,options);\r\n			this.say(\"Yes, sir!\");\r\n		},\r\n		/**\r\n		*robot\u4E3B\u5FAA\u73AF\r\n		**/	\r\n		run:function(){\r\n			this.ahead(50);//\u5411\u524D\u8D7050\u50CF\u7D20\r\n			this.turnGun(360);//\u5927\u70AE\u5411\u5DE6\u8F6C360\u5EA6\r\n			this.back(50);//\u540E\u900050\u50CF\r\n			this.turnGun(-180);//\u5927\u70AE\u5411\u53F3\u8F6C180\u5EA6\r\n		},\r\n		/**\r\n		*\u770B\u5230\u5176\u4ED6robot\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onScannedRobot:function(e){\r\n			this.say(\"\u770B\u4F60\u5F80\u54EA\u513F\u8EB2\uFF01\");\r\n			if(this.energy>=5){\r\n				this.fire(1);//\u770B\u5230\u654C\u4EBA\u7684\u65F6\u5019\u5F00\u706B\r\n			}\r\n			this.back(50);//\u5F00\u706B\u540E\u5411\u540E\u900050\u50CF\u7D20\r\n		},\r\n		/**\r\n		*\u88AB\u5B50\u5F39\u51FB\u4E2D\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onHitByBullet:function(e){\r\n			this.say(\"\u54C7\uFF0C\u597D\u75DB\uFF01\",\"red\");\r\n			this.back(10);//\u88AB\u51FB\u4E2D\u65F6\u540E\u900050\u50CF\u7D20\r\n			this.turn(60);//\u5411\u5DE6\u8F6C60\u5EA6\r\n		},\r\n		/**\r\n		*\u548C\u5899\u78B0\u649E\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onHitWall:function(e){\r\n    		this.say(\"\u5BF9\u4E0D\u8D77\u5566\uFF0C\u4F1F\u5927\u7684\u5899\u5148\u751F\uFF01\");\r\n			var bearing=e.getBearing();\r\n			if(bearing<90&&bearing>-90){//\u5982\u679C\u662F\u8FCE\u9762\u649E\u4E0A\u5899\uFF0C\u5219\u540E\u9000\r\n				this.back(50);\r\n				this.turn(45);//\u5411\u5DE6\u8F6C60\u5EA6\r\n			}\r\n			else{//\u5982\u679C\u662F\u9000\u540E\u649E\u4E0A\u5899\uFF0C\u5219\u524D\u8FDB\r\n				this.ahead(50);	\r\n				this.turn(60);//\u5411\u5DE6\u8F6C60\u5EA6\r\n			}\r\n		},\r\n        onDeath:function(){\r\n        	this.say(\"\u867D\u7136\u6211\u6B7B\u4E86\uFF0C\u4F46\u662F\u6211\u8FD8\u6D3B\u5728\u4E3B\u4EBA\u7684\u5FC3\u4E2D\uFF01\",\"yellow\");\r\n        },\r\n		onRobotDeath:function(e){\r\n			this.say(\"onRobotDeath\u54E6\uFF01\",\"yellow\");\r\n		}		\r\n	});\r\n});'
				},
				{'_id':'net_005', 
					tid : 'Robot',
					uid  : 'Kinvix',
					code : 'Jx().$package(function(J){\r\n	Robot = new J.Class({extend : tank.Robot},{\r\n		/**\r\n		*\u521D\u59CB\u5316\r\n		**/	\r\n		init:function(options){\r\n			this.constructor.superClass.init.call(this,options);\r\n		},\r\n		/**\r\n		*robot\u4E3B\u5FAA\u73AF\r\n		**/	\r\n		run:function(){\r\n			this.setAhead(1000);\r\n			this.setTurn(3600);\r\n			this.execute();\r\n		},\r\n		/**\r\n		*\u770B\u5230\u5176\u4ED6robot\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onScannedRobot:function(e){\r\n    		if(this.energy>=5){  \r\n				this.fire(1);//\u770B\u5230\u654C\u4EBA\u7684\u65F6\u5019\u5F00\u706B 	\r\n			}\r\n		},\r\n		/**\r\n		*\u88AB\u5B50\u5F39\u51FB\u4E2D\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onHitByBullet:function(e){\r\n\r\n		},\r\n		/**\r\n		*\u548C\u5899\u78B0\u649E\u7684\u5904\u7406\u7A0B\u5E8F\r\n		**/	\r\n		onHitWall:function(e){\r\n    		var bearing=e.getBearing();\r\n			if(bearing<90&&bearing>-90){//\u5982\u679C\u662F\u8FCE\u9762\u649E\u4E0A\u5899\uFF0C\u5219\u540E\u9000\r\n				this.back(50);\r\n				this.turn(45);//\u5411\u5DE6\u8F6C60\u5EA6\r\n			}\r\n			else{//\u5982\u679C\u662F\u9000\u540E\u649E\u4E0A\u5899\uFF0C\u5219\u524D\u8FDB\r\n				this.ahead(50);	\r\n				this.turn(60);//\u5411\u5DE6\u8F6C60\u5EA6\r\n			}\r\n		},\r\n        onDeath:function(){\r\n    \r\n        },\r\n		onRobotDeath:function(e){\r\n		}		\r\n	});\r\n});'
				}
		],
		init : function(){
			this.dom.main = $D.id("netRobotList");
			this.getList();
		},
		getList : function(){
			var _this = this;
			var param = {};
			site.rpc('/api/tanks/network', param, function(data){  
				if (data.success){
					_this.list = data.data;
					_this.fillList();
					$E.notifyObservers(site.robotManager, 'robotListReady');
				}else{
					site.util.Alert.warning('拉取网络坦克出现了那么点点问题，改用静态数据');
					J.http.ajax('/data/network.json', {
						type: 'text',
						onSuccess: function(data){
							var response = JSON.parse(data.responseText);
							if(response.success){
								_this.list = response.data;
								_this.fillList();
							}else{
								_this.fillList();
							}
						},
						onTimeout: function(data){
							site.util.Alert.warning('拉取静态坦克数据也超时啦!');
						}
					})
				}
			});
				 
		},
		fillList : function(){ 
			this.dom.main.innerHTML = '';
			var list = this.list;

			for (var k = 0, l = list.length; k < l; k++){
				var tank = list[k];
				TankModel.add(tank);
				this.addToList(tank); 
			}


			
		},
		addToList : function(tank){ 
			var tankName = tank.uid + '.' + tank.tid;
			var node = $D.node('li', {
							'id' : 'tank_' + tank._id,
							'tid' : tank._id,
							'title' : tankName							
						});		
			/*var tag = targetDom.getAttribute('id');		
			var type = 2;
			if (tag == 'myRobotList'){
				type = 1;
			}else if (tag == 'netRobotList'){
				type = 2;
			}*/
			var str = 	'<a href="###" class="viewCode" cmd="collectCode" tid="'+ tank._id +'" report="netlist.addFav,tank.addFav">收藏</a>';		
			var html = '<a href="###">\
								<input id="checknetRobotList'+ tank._id +'" class="robotCheckInput" type="checkbox" inputType="robot" tid="'+ tank._id +'" />\
								<label class="robotCheckLabel" for="checknetRobotList'+ tank._id +'">'+ tankName + getBattleCount(tank) + '</label>\
							</a>'
							+ '<a href="###" class="viewCode" cmd="viewCode" param="2" tid="'+ tank._id +'" report="tank.view,netlist.view" >查看</a>'
							+ str;
			node .innerHTML = html;
			this.dom.main.appendChild(node);	
		}
	}
	/*
	 *	
	 */
	var TeamModel = {
		list : {}, //key(_id)[{ _id : , name:', members:[_id,_id,...]}]
		init : function(){
			
		},
		//获取本地最大的id索引
		getNewId : function(){
			/*if (this.list.
			var id = this.list*/
			var id = 0;	 
			for (var k in this.list){
				id = this.list[k]._id;	
			}
			return ++id;
		},
		add : function(team){
			if (this.list[team._id]){
				return false;	
			}
			this.list[team._id] = team;
		},
		get : function(id){
			return this.list[id];
		},
		//如果不存在，则尝试从网络获取
		getEx : function(id, callback){
			if (!id || !callback){
				return false;	
			}
			if (this.get(id)){
				callback(this.get(id));
				return true;	
			}
			var _this = this;
			var param = { _id : id };
			site.rpc('/api/team/get', param, function(data){
				if (data.code == 10000){
					site.util.Alert.warning('请先登录！');
					return false;// not login	
				} 
				if (data.success || data.code == 0){  
					var team = TeamModel.addToModel(data.data);// 用MyFavTeam已经存在的方法)//_this.fillMembers(tid, data.data.members || []);
					callback(team);
				}else{
					site.util.Alert.warning('获取战队信息失败！');
				}				
			});	
		},
		update : function(team){
			if (!this.list[team._id]){
				return false;	
			}
			this.list[team._id] = team;
		},
		checkName : function(name, tid){
			for (var k in this.list){
				var team = this.list[k];
				if ((!tid && team.name == name) || (team._id != tid && team.name == name)){
					return true;	
				} 
			}			  
			return false;
		},
		remove : function(id){
			if (!this.list[id]){
				return false;	
			}
			this.list[id] = null; 
			delete this.list[id];
		},
		isExist : function(id){
			return !!this.list[id];
		},
		
		addMember : function(id, memberId){
			if (!this.list[id]){
				return false;	
			}
			this.list[id].members = this.list[id].members || [];
			var arr = this.list[id].members;
			for (var k = 0, l = arr.length; k < l; k++){ 
				if ( arr[i] == memberId){
					return false;	
				}
			}
			this.list[id].members.push(memberId);
		},
		
		removeMember : function(id, memberId){
			if (!this.list[id]){
				return false;	
			}
			this.list[id].members = this.list[id].members || [];
			var arr = this.list[id].members;
			for (var k = 0, l = arr.length; k < l; k++){ 
				if ( arr[i] == memberId){
					arr.splice(i, 1);
					return true;	
				}
			}
			return false;
		},
		getList : function(){
			return this.list;	
		},
		//更新本地存储
		updateStore : function(){
			//更新本地存储
			J.localStorage.setItem('teamList', J.json.stringify(this.list));	
		},
		//由于拉取team相关的列表的返回对象都一样，这里提供功能的转换保存方法 
		addToModel : function(obj){
			var members = obj.members || [];
			var arr = [];
			for (var k = 0, l = members.length; k < l; k++){
				var tank = members[k];
				if (J.isUndefined(tank) || !tank){
					continue;	
				}	
				arr.push(tank._id);
				TankModel.add(tank);
			}
			var team = {
				_id : obj._id,
				name : obj.name,
				members : arr
			};
			TeamModel.add(team);
			return team;
			// //key(_id)[{ _id : , name:', members:[_id,_id,...]}]
		}
	} 
	/*
	 *	组队逻辑
	 */ 
	var Team = {
		dom : {},	 
		callback : null, //添加到战场回调
		rightList : [], //右边选中列表		
		init : function(){ 
			this.dom.main = $D.id('myTeamList');
			//this.getData();
			if (site.account.isLogin()){
				this.getData(); //
			}else{
				this.showInfo('请先登录!');	
			}
		},
		getData : function(){ 
			var user = site.account.getCurrentUser();
			if (!user){ 
				return false;	
			}
			var _this = this;
			var param = { uid : user.uid};
			site.rpc('/api/team/list', param, function(data){
				if (data.code == 10000){
					_this.showInfo('请先登录!');
					return false;// not login	
				}
				if (data.code != 0){ 
					_this.showInfo('拉取我的战队列表失败!');
					return false;
				} 			
				_this.fillList(data.data);
			});
		},
		showInfo : function(txt){ 
			this.dom.main.innerHTML = '<li class="loading">'+ txt +'</li>';
		},
		fillList : function(list){
			var html = '';
			this.dom.main.innerHTML = '';
			//var list = TeamModel.getList();
			for (var k in list){
				var team = this.parseTeam(list[k]);	//转换成标准的team								
				this.addTeamNode(team);
			}
			if (list.length == 0){
				this.showInfo('请先组建属于您自己的战队!');
			}
		},		
		//转换成标准的team
		parseTeam : function(obj){			
			var members = obj.members || [];
			var arr = [];

			for (var k = 0, l = members.length; k < l; k++){
				var tank = members[k];
				if (J.isUndefined(tank) || !tank){
					continue;	
				}				
				TankModel.add(tank);
				arr.push(tank._id);	
			}	

			var team = {
				_id : obj._id,
				name : obj.name,
				members : arr	
			};	
			TeamModel.add(team);
			return team;	
		},
		add : function(){
			if (!site.account.isLogin()){
				//alert('请先登录!');
				site.util.Alert.tips('请先登录!', 2); 
				return false;	
			} 
			var team = {
				name : 'TankTeam',
				members : []
			}
			this.showEditor('创建战队', team);
			 
		},
		edit : function(id){
			if (!site.account.isLogin()){
				site.util.Alert.tips('请先登录!', 2);//alert('请先登录!');
				return false;	
			}
			var team = TeamModel.get(id);
			if (!team){
				return false;	
			}   
			this.showEditor('编辑战队', team);
		},
		del :  function(id){
			if (!site.account.isLogin()){
				site.util.Alert.warning('请先登录!');
				return false;	
			}
			var team = TeamModel.get(id);
			if (!team){
				return false;	
			}  
			
			
			 
			var param = { _id : id}; 
			var _this = this;
			site.rpc('/api/team/delete', param, function(data){ 
				if (data.code == 10000){
					site.util.Alert.warning('登录过期,请先登录!');
					return false;// not login	
				}  
				if (data.success){ 
					site.util.Alert.warning('删除成功!'); 
					//_this.getList();
					TeamModel.remove(id);
					//更新本地存储
					TeamModel.updateStore();
					var dom = $D.id('teamList' + id);
					if (dom){
						dom.parentNode.removeChild(dom);	
					}
				}else{
					site.util.Alert.warning('删除失败，请重试'); 
				}
			});
			 
			
		},
		 
		showEditor : function(title, team){
			this.rightList = team.members || [];
			var arr = this.rightList; 
			
			var str = '';
			for(var i=0, l = arr.length; i < l; i++){ 
				var tank = TankModel.get(arr[i]);
				str += '<li cmd="RightTankItem" tid="'+ tank._id +'">'+ tank.uid + '.' + tank.tid +'</li>'
			}
			var html = '<div class="teamEditor" id="teamEditor">\
							<div class="teamNameLabel">\
								战队名称：<input type="text" class="edTeamNameTxt" id="edTeamNameTxt" value="'+ team.name +'" />\
							</div>\
							<div class="teamMember">\
								请选择成员(暂时只支持创建2成员或5成员战队)：\
							</div>\
							<div class="teamEditBox">\
								<div class="teamEditLeft" id="teamEditLeft"></div>\
								<div class="teamEditCenter"><div class="arrowLeft"></div><div class="arrowRight"></div></div>\
								<div class="teamEditRight"><ul class="left teamEditorTankList teamEditorTankList2"  id="teamEditRightList">'+ str +'</ul></div>\
							</div>\
							<div class="edTeamBottom"><a href="#" cmd="Ok" tid="'+ (team._id || '') +'" class="panelButton">确　定</a></div>\
						</div>';
			site.util.Openner.setTitle(title);
			site.util.Openner.setCmdCallback(this.onClick);
			site.util.Openner.setContent(html);
			site.util.Openner.show(); 
			
			
			
			this.initLeftList();   
		},
		//初始化创建对话框左边列表
		initLeftList : function(){
			var dom = $D.id('teamEditLeft');
			var html = '<div class="left teamEditorClassName" cmd="ShowChild" param="MyTank" txt="我的坦克">►我的坦克</div>\
						 <ul class="left teamEditorTankList memberCollapse" id="teamEditorMyTank">';
			var list = MyTank.getTankIdList();  
			for (var k = 0, l = list.length; k < l; k++){
				var tank = TankModel.get(list[k]);
				if (!tank){
					continue;
				}
				html += '<li cmd="LeftTankItem" param="'+ tank._id +'">'+ tank.tid +'</li>';
			}
			html += '</ul>';
			
			html += '<div class="left teamEditorClassName" cmd="ShowChild" param="MyFav" txt="我收藏的坦克">►我收藏的坦克</div>\
						 <ul class="left teamEditorTankList memberCollapse" id="teamEditorMyFav">';
			var list = MyCollect.getTankIdList();
			for (var k = 0, l = list.length; k < l; k++){
				var tank = TankModel.get(list[k]);
				if (!tank){
					continue;
				}
				html += '<li cmd="LeftTankItem" param="'+ tank._id +'">'+ tank.uid + '.' + tank.tid +'</li>';
			}
			html += '</ul>';
			
			dom.innerHTML = html;	
		},
		//转发代理
		onClick : function(cmd, target){
			var _this = Team, func = 'on' + cmd;			 
			if (_this[func]){
				_this[func](target);	
			}else{
				return false;	
			}             
		},
		//创建
		onOk : function(target){
			
			var dom = $D.id('teamEditor');
			var txtDom = $D.id('edTeamNameTxt');
			var mode=codeTank.getMode();
			var len=this.rightList.length;
			if (txtDom.value == ''){
				site.util.Alert.warning('请先输入队名！');	
				return false;
			} 
			if (len!=2&&len!=5){
				site.util.Alert.warning('队员数量必须为两个或五个！');	
				return false;
			} 
			var tid = target.getAttribute('tid');
			var team = {
				_id : tid || '',				
				name : txtDom.value,
				members :  J.json.stringify(this.rightList)	
			}
			if (TeamModel.checkName(team.name, tid)){
				site.util.Openner.warning('此队名已经存在!');
				return false;	
			}
			this.save(team); 	
		},
		save : function(team){			
			var _this = this;
			var isNew = team._id ? false : true;
			if (!isNew){//update		 
				site.rpc('/api/team/save', team, function(data){   
					if (data.code == 0){				 
						site.util.Alert.success(name + " 保存成功！");
						$D.id('teamName' + team._id).innerHTML = team.name;
						site.util.Openner.close();	
						_this.getData();
					}else if (data.code == 10002){
						site.util.Alert.warning('战队名称已经存在，请修改'); 
					}else{
						site.util.Alert.warning('保存失败，请重试！');	
					}
				});		
			}else{ 			
				site.rpc('/api/team/create', team, function(data){   
					if (data.code == 0){				 
						site.util.Alert.success(name + " 保存成功！");
						_this.addTeamNode(team);
						site.util.Openner.close();	
						_this.getData();
					}else if (data.code == 10002){
						site.util.Alert.warning('战队名称已经存在，请修改'); 
					}else{
						site.util.Alert.warning('保存失败，请重试！');	
					}
				});	
			} 
		},
		
		addTeamNode : function(team){ 
			var node = $D.node('li', { id : 'teamList' + team._id, title : team.name }); 						   			 
			node.innerHTML = '<a href="###">\
								<input id="team'+ team._id +'" class="robotCheckInput" type="checkbox" inputType="team" tid="'+ team._id +'" />\
								<label class="robotCheckLabel" for="team'+ team._id +'" id="teamName'+ team._id +'">'+ team.name +'</label>\
							   </a>\
							   <a href="###" class="viewCode" cmd="editTeam" tid="'+ team._id +'" report="team.edit,netteam.edit">编辑</a>\
							   <a href="###" class="viewCode" cmd="delTeam" tid="'+ team._id +'" report="team.del,netteam.del">删除</a>';
			this.dom.main.appendChild(node);
		},
		onDel : function(target){
			target.parentNode.parentNode.removeChild(target.parentNode);	
		},
		//加入战场
		addToWar : function(callback){
			if (!site.account.isLogin()){
				site.util.Alert.warning('请先登录!');
				return false;	
			}
			if (!callback){
				site.util.Alert.warning('缺少回调参数');
				return false;	
			}
			this.callback = callback;
			
			var domArr = $D.mini('.robotCheckInput', this.dom.main);
			var arr = [];	
			for (var k = 0, l = domArr.length; k < l; k++){
				var dom = domArr[k];
				if (!dom.checked){
					continue;	
				}  
				var tid = dom.getAttribute('tid');
				arr.push(tid);
				dom.checked = false;
			} 
			if (arr.length != 2){
				site.util.Alert.warning('目前只支持两个战队PK！');	
				return false;
			}	
			var str = '';
			for(var i=0, l = arr.length; i < l; i++){ 
				var team = TeamModel.get(arr[i]);
				str += '<li tid="'+ team._id +'">'+ team.name  
							+'<div class="radioBox">\
								<input type="radio" name="color'+ i +'" id="color1_'+ i +'" tid="'+ team._id +'" value="1" />红色\
								<input type="radio" name="color'+ i +'" id="color2_'+ i +'" tid="'+ team._id +'" value="2" />白色\
							</div></li>';
			}
			var html = '<div class="teamEditor" id="teamEditor">\
							<ul>'+ str +'</ul>\
							<div class="edTeamBottom"><a href="#" cmd="ColorOk" class="panelButton">确　定</a></div>\
						</div>';
			
			site.util.Openner.setTitle('分配坦克颜色');
			site.util.Openner.setCmdCallback(this.onClick);
			site.util.Openner.setContent(html);
			site.util.Openner.show(); 
		},
		onColorOk : function(){  
			var dom = $D.id('teamEditor');
			var domArr = $D.mini('input', dom);
			var obj = {};
			for (var k = 0, l = domArr.length; k < l; k++){
				var dom = domArr[k];
				if (!dom.checked){
					continue;	
				}  
				var tid = dom.getAttribute('tid');
				obj[tid] = dom.value;
			} 
			var count = 0, sum = 0;
			for (var k in obj){
				count++;
				sum += parseInt(obj[k]);	
			}	
			if (count < 2 || sum != 3){
				site.util.Alert.warning('请正确分配队伍颜色！');	
				return false;
			}
			this.callback(obj);	
			site.util.Openner.close();
		},
		//
		onShowChild : function(dom){
			var param = dom.getAttribute('param');
			var d = $D.id('teamEditor' + param);
			if (!d){
				return false;	
			}
			if ($D.hasClass(d, 'memberCollapse')){
				$D.removeClass(d, 'memberCollapse');
				dom.innerHTML = '▼' + dom.getAttribute('txt');
			}else{
				$D.addClass(d, 'memberCollapse');	
				dom.innerHTML = '►' + dom.getAttribute('txt');
			}
				
		},
		onLeftTankItem : function(dom){
			var tid = dom.getAttribute('param');
			var tank = TankModel.get(tid);
			if (tank && !this.checkRight(tid)){
				var node = $D.node('li', {
						cmd : 'RightTankItem',
						param :  tank._id
					});
				node.innerHTML = tank.uid + '.' + tank.tid;	
				$D.id('teamEditRightList').appendChild(node);
				this.addToRight(tid);
			}
		},
		onRightTankItem : function(dom){
			this.removeFromRight(dom.getAttribute('param'));
			dom.parentNode.removeChild(dom); 
		},
		addToRight : function(tid){ 
			this.rightList.push(tid);
		},
		removeFromRight : function(tid){
			for (var k = 0, l = this.rightList.length; k < l; k++){
				if (this.rightList[k] == tid){
					this.rightList.splice(k, 1);	
				}
			}
		},
		checkRight : function(tid){
			for (var k = 0, l = this.rightList.length; k < l; k++){
				if (this.rightList[k] == tid){
					return true;	
				}
			}
			return false;
		}		
	}
	/*
	 *	我的收藏列表
	 */ 
	var MyCollect = {
		dom : {}, 
		list : [], //只保存tank ID
		init : function(){
			this.dom.main = $D.id("myFavRobotList");			
			if (site.account.isLogin()){
				this.getList(); //
			}else{
				this.showInfo('请先登录!');	
			}
		},
		getList : function(){  
			var _this = this;
			var param = {};
			site.rpc('/api/fav/list', param, function(data){
				if (data.code == 10000){
					_this.showInfo('请先登录!');
					return false;// not login	
				}
				if (data.code != 0){
					site.util.Alert.warning('拉取我的收藏列表失败');
					_this.showInfo('拉取我的收藏列表失败!');
					return false;
				} 				
				_this.fillList(data.data);
			});
		},
		fillList : function(list){
			////我的坦克列表，数据格式：[{_id : '内部唯一编号', 'tid' : 'tank name', uid : 'user name', code :''}, ...]
			//var list = this.list || [];
			list = list || [];
 			this.dom.main.innerHTML = '';
			this.list = [];
			var frags = document.createDocumentFragment();
			for (var k = 0, l = list.length; k < l; k++){
				var obj = list[k];
				frags.appendChild(this.getNode(obj)); 
				var tank = obj;
				tank._id = tank._tid;
				delete tank['_tid'];
				TankModel.add(tank);	
				this.list.push(tank._id);//只保存_id			
			}
			if (list.length == 0){
				this.dom.main.innerHTML = '<li class="loading">请先收藏您喜欢的坦克!</li>';
			}else{
				this.dom.main.appendChild(frags);	
			}
		},
		getNode : function(obj){  
			var tankName = obj.uid + '.' + obj.tid;
			var node = $D.node('li', {
							'id' : 'tank_' + obj._id,
							'tid' : obj._tid,
							'title' : tankName							
						});
			if(obj.openSource == 0){
					var html = '<a href="###">\
								<input id="checkCollet'+ obj._tid +'" class="robotCheckInput" type="checkbox" inputType="robot" tid="'+ obj._tid +'" />\
								<label class="robotCheckLabel" for="checkCollet'+ obj._tid +'">'+ tankName + getBattleCount(obj) + '</label>\
							</a>\
							<cute href="###" class="viewCode"  param="2" tid="'+ obj._tid +'" report="mylist.view,tank.view" title="该坦克代码未开源，暂时不能查看">未开源</cute>\
							<a href="###" class="viewCode" cmd="delCollect" cid="'+ obj._id +'" report="mylist.del,tank.del">删除</a>';
			}else{			
				var html = '<a href="###">\
								<input id="checkCollet'+ obj._tid +'" class="robotCheckInput" type="checkbox" inputType="robot" tid="'+ obj._tid +'" />\
								<label class="robotCheckLabel" for="checkCollet'+ obj._tid +'">'+ tankName + getBattleCount(obj) + '</label>\
							</a>\
							<a href="###" class="viewCode" cmd="viewCode" param="2" tid="'+ obj._tid +'" report="mylist.view,tank.view">查看</a>\
							<a href="###" class="viewCode" cmd="delCollect" cid="'+ obj._id +'" report="mylist.del,tank.del">删除</a>';
			}
			node.innerHTML = html;
			return node;				
		},
		showInfo : function(txt){ 
			this.dom.main.innerHTML = '<li class="loading">'+ txt +'</li>';
		},
		del : function(cid){
			var _this = this;
			var param = { _id : cid}; 
			site.rpc('/api/fav/delete', param, function(data){ 
				if (data.code == 10000){
					site.util.Alert.warning('登录过期,请先登录!');
					return false;// not login	
				}  
				if (data.success){ 
					site.util.Alert.warning('删除成功!'); 
					//MyCollect.getList();
					var dom = $D.id('tank_'+cid);
					if (dom){
						var domArr = $D.mini('li', dom.parentNode);						
						dom.parentNode.removeChild(dom);
						if (domArr.length == 1){
							_this.dom.main.innerHTML = '<li class="loading">请先收藏您喜欢的坦克!</li>';
						}	
					}
				}else{
					site.util.Alert.warning('删除失败，请重试'); 
				}
			});
		},
		getTankIdList : function(){
			return this.list;	
		}
	}
	
	
	
	/*
	 *	查看网络坦克，当作收藏坦克模块
	 */ 
	
	var NetTank = {
		dom : {},	
		page : 0,
		limit : 20,	
		total : 0,
		skDefault : '请输入用户名',
		lock : false,  
		hasLoaded : false,
		init : function(){
					
			this.dom.main = $D.id('sideNetTankWrap');
			this.dom.content = $D.id('sideNetTankList');
			this.dom.pre = $D.id('sideNetTankOpPre');
			this.dom.next = $D.id('sideNetTankOpNext');
			this.dom.sText = $D.id('searchTank');
			this.dom.pageCount = $D.id('searchTankPage');
			
			$E.on($D.id('sideNetTankOpBox'), 'click', this.onClick);
			$E.on(this.dom.content, 'click', this.onClick);
			
			$E.on(this.dom.sText, 'focus', this.onFocus);
			$E.on(this.dom.sText, 'blur', this.onBlur);	
			$E.on(this.dom.sText, 'keydown', this.onKeydown);		
		},
		//提供给对外调用
		showList : function(){  
			if (this.hasLoaded){
				return false;
			}
			/*if (!site.account.isLogin()){
				this.setInfo(3);
				return false;	
			}*/  
			this.lock = false;			
			this.getList(0); 
		}, 
		//
		onClick : function(e){
			var target = e.target;
			var cmd = target.getAttribute('cmd');
			if (!cmd){
				return false;	
			}
			var _this = NetTank, func = 'on' + cmd;			 
			if (_this[func]){
				_this[func](target);	
			}else{
				return false;	
			}             
		},
		getList : function(page){ 
			if (page > this.total){
				return false;	
			}
			this.lock = true;
			this.setInfo(1);
			this.page = page;
			var _this = this;  
			
			var sk = this.dom.sText.value;
			sk = sk == this.skDefault ? '' : sk;
			
			var param = { start : (page * this.limit), limit : this.limit, q : sk};
			
			site.rpc('/api/tanks/find', param, function(data){
				_this.lock = false;
				if (data.code == 10000){
					_this.setInfo(3);
					return false;// not login	 
				}  
				if (data.success){ 
					_this.total = Math.floor(data.total/_this.limit); 
					_this.dom.pageCount.innerHTML = "["+(_this.page + 1) + '/' + (_this.total + 1)+"]";
					//console.log('total:'+ data.total + ', totalPage : '+_this.total)
					_this.checkBtn();
					_this.fillList(data.data); 
				}else{
					_this.setInfo(2); 
				}
			});
		},
		setInfo : function(flag){ 
		
			if (flag == 1){ //loading 
				var html = '<div class="sideLoading">Loading...</div>';	
				this.dom.content.innerHTML = html;
			}else if (flag == 2){
				var html = '<div class="sideLoading">\
								拉取数据失败，请<a href="#" cmd="Retry" param="'+ this.page +'">重试</a>\
							</div>';	
				this.dom.content.innerHTML = html;
			}else if (flag == 3){
				var html = '<div class="sideLoading">\
								请先登录!\
							</div>';	
				this.dom.content.innerHTML = html;
			}else if (flag == 4){
				var html = '<div class="sideLoading">\
								暂无数据!\
							</div>';	
				this.dom.content.innerHTML = html;
			}
		},
		fillList : function(list){  
			list = list || []; 
			if (list.length == 0){
				this.setInfo(4);
				return false;	
			} 
			this.hasLoaded = true;
			var html = '';
			for(var i = 0, l = list.length; i < l; i++){ 
				var tank = list[i];
				TankModel.add(tank);
				/*<a href="###">\
							<input id="check'+ tag + tank._id +'" class="robotCheckInput" type="checkbox" inputType="robot" robotId="'+ tank._id +'" />\
							<label class="robotCheckLabel" for="check'+ tag +  tank._id +'">'+ tankName +'</label>\
						</a>*/
				if(tank.openSource == 0){
				html += '<li tid="'+ tank._id +'">'
							+'<a href="###">\
								<input id="checkNetTank'+ tank._id +'" class="robotCheckInput" type="checkbox" inputType="robot" tid="'+ tank._id +'" /\>\
								<label class="robotCheckLabel" for="checkNetTank'+ tank._id +'">'+ tank.uid + '.' + tank.tid + getBattleCount(tank) + '</label>' 
							+'</a><cute href="#" class="sideOpBtn" tid="'+ tank._id +'" report="tank.view,nettank.view" title="该坦克代码未开源，暂时不能查看">未开源</cute>'
							+'<a href="#" cmd="Collect" class="sideOpBtn" tid="'+ tank._id +'" report="tank.addFav,nettank.addFav">收藏</a></li>';
				}else{
				html += '<li tid="'+ tank._id +'">'
							+'<a href="###">\
								<input id="checkNetTank'+ tank._id +'" class="robotCheckInput" type="checkbox" inputType="robot" tid="'+ tank._id +'" /\>\
								<label class="robotCheckLabel" for="checkNetTank'+ tank._id +'">'+ tank.uid + '.' + tank.tid + getBattleCount(tank) + '</label>' 
							+'</a><a href="#" cmd="ViewCode" class="sideOpBtn" tid="'+ tank._id +'" report="tank.view,nettank.view">查看</a>'
							+'<a href="#" cmd="Collect" class="sideOpBtn" tid="'+ tank._id +'" report="tank.addFav,nettank.addFav">收藏</a></li>';
				}
			}
			this.dom.content.innerHTML = html;	
			
		},
		
		onCollect : function(dom){ 
			var id = dom.getAttribute('tid');
			this.collect(id);
		},
		collect : function(id){ 
			favTank(id);
		},
		onViewCode : function(dom){
			var _id = dom.getAttribute('tid');
			var robot = TankModel.get(_id);
			if (robot){
				robot.getCode(function(code, obj){
					// tank.editTank(obj, 2);
					site.editor.edit(obj, 2);
				});	
			}
						
		},
		//翻页
		onIndex : function(){
			this.getList(0); 
			this.checkBtn();			
		},
		checkBtn : function(){
			if (this.page > 0){
				if ($D.hasClass(this.dom.pre, 'disable')){
					$D.removeClass(this.dom.pre, 'disable');
				}				
			}else{
				if (!$D.hasClass(this.dom.pre, 'disable')){
					$D.addClass(this.dom.pre, 'disable');
				}
			}
			if (this.page < this.total){
				if ($D.hasClass(this.dom.next, 'disable')){
					$D.removeClass(this.dom.next, 'disable');
				}
			}else{
				if (!$D.hasClass(this.dom.next, 'disable')){
					$D.addClass(this.dom.next, 'disable');
				}
			}
			
		},
		onPre : function(dom){
			if (this.lock || $D.hasClass(dom, 'disable')){
				return false;	
			}			
			var page = this.page - 1;
			page = page > 0 ? page : 0;
			this.getList(page);
			this.checkBtn(); 
		},
		onNext : function(dom){
			if (this.page > this.total || this.lock || $D.hasClass(dom, 'disable')){
				return false;	
			}
			var page = this.page + 1;
			page = page > this.total ? this.total : page;
			this.getList(page);
			this.checkBtn();
		},
		//search 
		onFocus : function(e){  
			var dom = e.target;
			var _this = NetTank;
			if (dom.value == _this.skDefault){
				dom.value = '';
				if ($D.hasClass(dom, 'gray')){
					$D.removeClass(dom, 'gray')
				}
			}
		},
		onBlur : function(e){
			var dom = e.target;
			var _this = NetTank;
			if (dom.value == ''){
				dom.value = _this.skDefault;
				if (!$D.hasClass(dom, 'gray')){
					$D.addClass(dom, 'gray')
				}
			}
		},
		onSearch : function(){ 
			this.getList(0);
		},
		onKeydown : function(e){ 
			if (e.keyCode === 13){
				NetTank.getList(0);
			}
		},
		onRefresh : function(){
			this.getList(0); 	
		}
		
	} 
	/*
	 * 网络战队
	 */
	
	var NetTeam = {
		dom : {},	
		page : 0,
		limit : 20,	
		total : 0,
		skDefault : '请输入用户名',
		lock : false,  
		hasLoaded : false,
		init : function(){
					
			this.dom.main = $D.id('sideNetTeamWrap');
			this.dom.content = $D.id('sideNetTeamList');
			this.dom.pre = $D.id('sideNetTeamOpPre');
			this.dom.next = $D.id('sideNetTeamOpNext');
			this.dom.sText = $D.id('searchTeam');
			this.dom.pageCount = $D.id('searchTeamPage');
			
			$E.on($D.id('sideNetTeamOpBox'), 'click', this.onClick);
			$E.on(this.dom.content, 'click', this.onClick);			
			$E.on(this.dom.sText, 'focus', this.onFocus);
			$E.on(this.dom.sText, 'blur', this.onBlur);	
			$E.on(this.dom.sText, 'keydown', this.onKeydown);		
		},
		//提供给对外调用
		showList : function(){
			if (this.hasLoaded){
				return false;	
			}
			/*if (!site.account.isLogin()){
				this.setInfo(3);
				return false;	
			}  */
			this.lock = false;			
			this.getList(0); 
		}, 
		//
		onClick : function(e){
			var target = e.target;
			var cmd = target.getAttribute('cmd');
			if (!cmd){
				return false;	
			}
			var _this = NetTeam, func = 'on' + cmd;			 
			if (_this[func]){
				_this[func](target);	
			}else{
				return false;	
			}             
		},
		getList : function(page){ 
			if (page > this.total){
				return false;	
			}
			this.lock = true;
			this.setInfo(1);
			this.page = page;
			var _this = this;  
			
			var sk = this.dom.sText.value;
			sk = sk == this.skDefault ? '' : sk;
			
			var param = { start : (page * this.limit), limit : this.limit, uid : sk};
			
			site.rpc('/api/team/find', param, function(data){
				_this.lock = false;
				if (data.code == 10000){
					_this.setInfo(3);
					return false;// not login	 
				}  
				if (data.success){ 
					_this.total = Math.floor(data.total/_this.limit); 
					_this.dom.pageCount.innerHTML = "["+(_this.page + 1) + '/' + (_this.total + 1)+"]";
					//console.log('total:'+ data.total + ', totalPage : '+_this.total)
					_this.checkBtn();
					_this.fillList(data.data); 
				}else{
					_this.setInfo(2); 
				}
			});
		},
		setInfo : function(flag){ 
		
			if (flag == 1){ //loading 
				var html = '<div class="sideLoading">Loading...</div>';	
				this.dom.content.innerHTML = html;
			}else if (flag == 2){
				var html = '<div class="sideLoading">\
								拉取数据失败，请<a href="#" cmd="Retry" param="'+ this.page +'">重试</a>\
							</div>';	
				this.dom.content.innerHTML = html;
			}else if (flag == 3){
				var html = '<div class="sideLoading">\
								请先登录!\
							</div>';	
				this.dom.content.innerHTML = html;
			}else if (flag == 4){
				var html = '<div class="sideLoading">\
								暂无数据!\
							</div>';	
				this.dom.content.innerHTML = html;
			}
		},
		fillList : function(list){  
			list = list || []; 
			if (list.length == 0){
				this.setInfo(4);
				return false;	
			} 
			this.hasLoaded = true;
			var html = '';
			for(var i = 0, l = list.length; i < l; i++){ 
				var team = list[i];  
				html += '<li tid="'+ team._id +'" id="netTeam'+ team._id +'">'
							+'<div class="sideContentItem"><a href="###">\
								<input id="checkNetTeam'+ team._id +'" class="robotCheckInput" inputtype="team" type="checkbox" tid="'+ team._id +'" /\>\
								<label class="robotCheckLabel" for="checkNetTeam'+ team._id +'">' + team.uid + ':' + team.name + '</label>'  
							+'<a href="#" cmd="ViewMember" class="sideOpBtn" tid="'+ team._id +'">成员</a>'
							+'<a href="#" cmd="Collect" class="sideOpBtn" tid="'+ team._id +'" report="netteam.addFav,team.addFav">收藏</a></div></li>';
			}  
			this.dom.content.innerHTML = html;	
			
		},
		
		onCollect : function(dom){ 
			var id = dom.getAttribute('tid');
			this.collect(id);
		},
		collect : function(id){
			var param = { tid : id };
			site.rpc('/api/favteam/create', param, function(data){
				if (data.code == 10000){
					site.util.Alert.warning('请先登录!');
					return false;// not login	
				}
				if (data.code == 10002){
					site.util.Alert.warning('已收藏过！'); 
					return false;
				}else if (data.code != 0){
					site.util.Alert.warning('收藏失败！'); 
					return false;
				}
				if (data.code == 0){
					site.util.Alert.success('收藏成功！'); 
					MyFavTeam.getList();
				}
				
			});	
		},
		onViewCode : function(dom){
			var _id = dom.getAttribute('tid');
			var robot = TankModel.get(_id);
			if (robot){
				robot.getCode(function(code, obj){
					// tank.editTank(obj, 2);
					site.editor.edit(obj, 2);
				});	
			}
						
		},
		//翻页
		onIndex : function(){
			this.getList(0); 
			this.checkBtn();			
		},
		checkBtn : function(){
			if (this.page > 0){
				if ($D.hasClass(this.dom.pre, 'disable')){
					$D.removeClass(this.dom.pre, 'disable');
				}				
			}else{
				if (!$D.hasClass(this.dom.pre, 'disable')){
					$D.addClass(this.dom.pre, 'disable');
				}
			}
			if (this.page < this.total){
				if ($D.hasClass(this.dom.next, 'disable')){
					$D.removeClass(this.dom.next, 'disable');
				}
			}else{
				if (!$D.hasClass(this.dom.next, 'disable')){
					$D.addClass(this.dom.next, 'disable');
				}
			}
			
		},
		onPre : function(dom){
			if (this.lock || $D.hasClass(dom, 'disable')){
				return false;	
			}			
			var page = this.page - 1;
			page = page > 0 ? page : 0;
			this.getList(page);
			this.checkBtn(); 
		},
		onNext : function(dom){
			if (this.page > this.total || this.lock || $D.hasClass(dom, 'disable')){
				return false;	
			}
			var page = this.page + 1;
			page = page > this.total ? this.total : page;
			this.getList(page);
			this.checkBtn();
		},
		//search 
		onFocus : function(e){  
			var dom = e.target;
			var _this = NetTank;
			if (dom.value == _this.skDefault){
				dom.value = '';
				if ($D.hasClass(dom, 'gray')){
					$D.removeClass(dom, 'gray')
				}
			}
		},
		onBlur : function(e){
			var dom = e.target;
			var _this = NetTank;
			if (dom.value == ''){
				dom.value = _this.skDefault;
				if (!$D.hasClass(dom, 'gray')){
					$D.addClass(dom, 'gray')
				}
			}
		},
		onSearch : function(){ 
			this.getList(0);
		},
		onKeydown : function(e){ 
			if (e.keyCode === 13){
				NetTeam.getList(0);
			}
		},
		onRefresh : function(){
			this.getList(0); 	
		},
		//查看成员
		onViewMember : function(dom){
			var tid = dom.getAttribute('tid');
			var node = $D.id('netTeamMember' + tid);
			if (node){
				if ($D.hasClass(node, 'memberCollapse')){
					$D.removeClass(node, 'memberCollapse')
				}else{
					$D.addClass(node, 'memberCollapse')
				}
				return true;
			}
			node = $D.node('div', {
				'id' : 'netTeamMember' + tid,
				'class' : 'anm sideContentItemEx'				
			});
			node.innerHTML = '<div class="sideTeamArr"></div>\
							 <div id="netTeamMemberBox' + tid + '" class="netTeamMemberBox"></div>';	
			$D.id('netTeam' + tid).appendChild(node); 
			this.getMembers(tid);
		},
		onGetMembers : function(dom){
			this.getMembers(dom.getAttribute('tid'));
		},
		//获取team成员信息：如果此战队已经存在，则直接读取，不存在则拉取，并保存在本地
		getMembers : function(tid){
			var dom = $D.id('netTeamMemberBox' + tid);
			dom.innerHTML = '<div class="sideTeaMembermInfo">Loading...</div>'; 
			 
			var team = TeamModel.get(tid);
			if (team){
				this.fillMembers(tid, team.members || []);
				return true;	
			}			
			var _this = this;
			var param = { _id : tid };
			site.rpc('/api/team/get', param, function(data){
				if (data.code == 10000){
					dom.innerHTML = '<div class="sideTeaMembermInfo">请先登录!</div>'; //'请先登录!';
					return false;// not login	
				} 
				if (data.success || data.code == 0){  
					var team = TeamModel.addToModel(data.data);//_this.fillMembers(tid, data.data.members || []);
					_this.fillMembers(tid, team.members || []);
				}else{
					dom.innerHTML = '<div class="sideTeaMembermInfo">获取数据失败,请<a href="#" cmd="GetMembers" tid="'+tid+'">重试</a>!</div>';
				}				
			});	
		},
		fillMembers : function(tid, list){
			//console.dir(list);
			var dom = $D.id('netTeamMemberBox' + tid);
			
			var html = '';
			for (var k = 0, l = list.length; k < l; k++){
				/*var tank = list[k];
				if (J.isUndefined(tank) || !tank){
					continue;	
				}
				TankModel.add(tank);*/
				var tank = TankModel.get(list[k]);
				html += '<div class="sideTeamMeamer"><div class="sideTeamMeamerName">' + tank.uid + '.' + tank.tid + 
							'</div><a href="#" class="sideOpBtn right" cmd="ViewCode" tid="'+ tank._id+'">查看</a></div>';	
			}
			if (list.length == 0 || html == ''){
				dom.innerHTML = '<div class="sideTeaMembermInfo">暂无成员数据！</div>';
				return false;	
			}			 
			html = html;
			dom.innerHTML = html;
		},
		onViewCode : function(dom){
			var _id = dom.getAttribute('tid'); 
			var robot = TankModel.get(_id);
			if (robot){
				robot.getCode(function(code, obj){
					// tank.editTank(obj, 0);
					site.editor.edit(obj, 0);
				});	
			}	
		}
		
	} 
	
	
	/*
	 *	我的收藏的战队
	 */ 
	var MyFavTeam = {
		dom : {}, 
		list : [],
		init : function(){
			this.dom.main = $D.id("myFavTeamList");			
			if (site.account.isLogin()){
				this.getList(); //
			}else{
				this.showInfo('请先登录!');	
			}
		},
		getList : function(){   
			var _this = this;
			var param = {};
			site.rpc('/api/favteam/list', param, function(data){
				if (data.code == 10000){
					_this.showInfo('请先登录!');
					return false;// not login	
				}
				if (data.code != 0){
					site.util.Alert.warning('拉取我的收藏的战队失败');
					_this.showInfo('拉取我的收藏的战队失败!');
					return false;
				}
				_this.list = data.data;				
				_this.fillList();
			});
		},
		fillList : function(list){
			////我的坦克列表，数据格式：[{_id : '内部唯一编号', 'tid' : 'tank name', uid : 'user name', code :''}, ...]
			var list = this.list || [];
 			this.dom.main.innerHTML = '';
			var frags = document.createDocumentFragment();
			for (var k = 0, l = list.length; k < l; k++){
				var obj = list[k];				
				frags.appendChild(this.getNode(obj));  
				obj._id = obj._tid; //这里强制转换favid为teamid，可以用标准的转换保存方法
				TeamModel.addToModel(obj);				
			}
			if (list.length == 0){
				this.dom.main.innerHTML = '<li class="loading">请先收藏您喜欢的战队!</li>';
			}else{
				this.dom.main.appendChild(frags);	
			}
		}, 
		//_id:fav Id, _tid:team Id
		getNode : function(obj){  
			var tankName = obj.uid + ':' + obj.name;
			var node = $D.node('li', {
							'id' : 'favteam_' + obj._id,
							'tid' : obj._tid,
							'title' : tankName							
						});		 	
			var html = '<div class="sideContentItem"><a href="###">\
								<input id="checkCollet'+ obj._tid +'" class="robotCheckInput" type="checkbox" inputType="team" tid="'+ obj._tid +'" />\
								<label class="robotCheckLabel" for="checkCollet'+ obj._tid +'">'+ tankName +'</label>\
							</a>\
							<a href="###" class="viewCode" cmd="viewFavTeamMember" tid="'+ obj._tid +'" cid="'+ obj._id +'">成员</a>\
							<a href="###" class="viewCode" cmd="delFavTeam" cid="'+ obj._id +'" report="favlist.del,tank.delFav">删除</a>\
							</div>';
			node.innerHTML = html;
			return node;				
		},
		showInfo : function(txt){ 
			this.dom.main.innerHTML = '<li class="loading">'+ txt +'</li>';
		},
		del : function(cid){
			var param = { _id : cid}; 
			var _this = this;
			site.rpc('/api/favteam/delete', param, function(data){ 
				if (data.code == 10000){
					site.util.Alert.warning('登录过期,请先登录!');
					return false;// not login	
				}  
				if (data.success){ 
					site.util.Alert.success('删除成功!'); 
					//_this.getList();
					var dom = $D.id('favteam_'+cid);
					if (dom){
						dom.parentNode.removeChild(dom);	
					}
				}else{
					site.util.Alert.warning('删除失败，请重试'); 
				}
			});
		},
		viewMembers : function(tid, cid){
			//var tid = dom.getAttribute('tid');
			var node = $D.id('favTeamMember' + tid);
			if (node){
				if ($D.hasClass(node, 'memberCollapse')){
					$D.removeClass(node, 'memberCollapse')
				}else{
					$D.addClass(node, 'memberCollapse')
				}
				return true;
			}
			node = $D.node('div', {
				'id' : 'favTeamMember' + tid,
				'class' : 'anm sideContentItemEx'				
			});
			node.innerHTML = '<div class="sideTeamArr"></div>\
							 <div id="favTeamMemberBox' + tid + '" class="netTeamMemberBox"></div>';	
			$D.id('favteam_' + cid).appendChild(node); 
			this.fillMembers(tid);
		},		 
		fillMembers : function(tid){ 
			var dom = $D.id('favTeamMemberBox' + tid);
			var team = TeamModel.get(tid);
			if (!team){
				return false;	
			}
			list = team.members || [];
			var html = '';
			for (var k = 0, l = list.length; k < l; k++){ 
				var tank = TankModel.get(list[k]);
				html += '<div class="sideTeamMeamer"><div class="sideTeamMeamerName">' + tank.uid + '.' + tank.tid + 
							'</div><a href="#" class="viewCode right" cmd="viewCode" tid="'+ tank._id+'">查看</a></div>';	
			}
			if (list.length == 0 || html == ''){
				dom.innerHTML = '<div class="sideTeaMembermInfo">暂无成员数据！</div>';
				return false;	
			}			 
			html = html;
			dom.innerHTML = html;
		}
	}
	
	
	
});
	
	

	
	
	
