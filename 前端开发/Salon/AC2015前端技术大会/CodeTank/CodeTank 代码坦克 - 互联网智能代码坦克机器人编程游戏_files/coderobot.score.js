Jx().$package("codeTank", function(J) {
	var $ = J.dom.id,
		$D = J.dom,
		$E = J.event;
	var modetype = null;

	var getUrlParam = function (name, href, noDecode) {
	    var re = new RegExp("(?:\\?|#|&)" + name + "=([^&]*)(?:$|&|#)", "i"),
	        m = re.exec(href);
	    var ret = m ? m[1] : "";
	    return !noDecode ? decodeURIComponent(ret) : ret
	};
	var scoreSaveCgi;

	if(getUrlParam("student",location.href) == "1"){
		scoreSaveCgi = "/api/score/student";
	}
	else{
		scoreSaveCgi = "/api/score/create";
	}

	var caculateTeamScore=function(robotList){//把team的robot提取出来，以team为单位加入robotlist
		var teamArr=[];
		var teamObj={};
		for(var i=0;i<robotList.length;i++){
			var r=robotList[i];
			var teamName= r.teamName;
			

			if(teamName){
				if(!teamObj[teamName]){
					var t=teamObj[teamName]={};
					t.name=teamName;
					t.totalScore=r.totalScore;
					t.survivalScore=r.survivalScore;
					t.bulletDmgScore=r.bulletDmgScore;
					t.bulletDmgBonusScore=r.bulletDmgBonusScore;
					t.ramDmgScore=r.ramDmgScore;
					t.ramDmgBonusScore=r.ramDmgBonusScore;
				}
				else{
					var t=teamObj[teamName];
					t.totalScore+=r.totalScore;
					t.survivalScore+=r.survivalScore;
					t.bulletDmgScore+=r.bulletDmgScore;
					t.bulletDmgBonusScore+=r.bulletDmgBonusScore;
					t.ramDmgScore+=r.ramDmgScore;
					t.ramDmgBonusScore+=r.ramDmgBonusScore;					
				}
				robotList.splice(i,1);
				i--;
			}
		}
		for(var name in teamObj){
			if(teamObj.hasOwnProperty(name)){
				robotList.push(teamObj[name]);
			}		
		}
	}

	var score={
		reset:function(robot){
			robot.survivalScore=0;//生存得分
			robot.bulletDmgScore=0;//伤害得分
			robot.bulletHurtList={};//子弹伤害过的机器人以及伤害值记录表
			robot.ramHurtList={};//撞击伤害过的机器人以及伤害值记录表
			robot.bulletDmgBonusScore=0;//子弹杀死敌人的格外奖励得分
			robot.ramDmgScore=0;//撞击敌人的得分
			robot.ramDmgBonusScore=0;//撞击杀死敌人的格外奖励得分
			robot.totalScore=0;
			
		},
		addSurvival:function(robotList,deadRobot){//其他敌人死亡一个则生存的机器人加50分生存得分
			for(var i=0,len=robotList.length;i<len;i++){
				if(!robotList[i].isExplode)
					robotList[i].survivalScore+=50;
			}
		},
		addBulletDmgScore:function(robot,damage){//对敌人的1点伤害计1点伤害得分
			robot.bulletDmgScore+=damage;
		},
		recordHurt:function(robot,hurtedrobotName,damage,isBullet){//记录robot对其他robot的伤害值
			var list;
			if (isBullet) list=robot.bulletHurtList;
			else list=robot.ramHurtList;
			var name=hurtedrobotName;
			if(list[name]){
				list[name]+=damage;
				return;
			}
			list[name]=damage;
		},
		addBulletDmgBonus:function(robot,killedRobotName){//子弹杀死一个敌人后，机器人获得对该敌人总伤害的20%作为格外奖励得分
			robot.bulletDmgBonusScore+=parseInt(robot.bulletHurtList[killedRobotName]*0.2);
		},
		addRamDmgScore:function(robot,damage){//撞击一个敌人造成的每点伤害得两分作为撞击得分

			robot.ramDmgScore+=damage*2;
		},
		addRamDmgBonus:function(robot,killedRobotName){//撞击杀死一个敌人后，机器人获得对该敌人总伤害的30%作为格外奖励得分

			robot.ramDmgBonusScore+=parseInt(robot.ramHurtList[killedRobotName]*0.3);
		},
		computeTotalScore: function(robot){
			return robot.totalScore = robot.survivalScore
										+robot.bulletDmgScore
										+robot.bulletDmgBonusScore
										+robot.ramDmgScore
										+robot.ramDmgBonusScore;
		},
		sortRobot: function(robotList){
			var robotRankList = J.array.bubbleSort(robotList, function(a, b){
				if(a.totalScore === null){
					score.computeTotalScore(a);
				}
				if(b.totalScore === null){
					score.computeTotalScore(b);
				}
				
				return b.totalScore - a.totalScore;
			});
			return robotRankList;
		},
		show:function(robotList){

			var scoreSection=$("robotScore");
			scoreSection.innerHTML="";
			var htmlArray = [];
			caculateTeamScore(robotList);
			for(var i=0,len=robotList.length;i<len;i++){
				this.computeTotalScore(robotList[i]);
			}
			var robotRankList = this.sortRobot(robotList);
			
			var saveList = [];
			htmlArray.push("<table>");
			var headContent='\
				<thead>\
					<tr>\
						<th class="rank" title="战斗排名">Rank</th>\
						<th class="name" title="坦克名字">Name</th>\
						<th class="totalScore" title="总分">Total Score</th>\
						<th class="survivalScore" title="幸存得分">Survival Score</th>\
						<th class="bulletDamage" title="子弹伤害得分">Bullet Damage</th>\
						<th class="bulletDamageBonus" title="子弹伤害奖励">Bullet Damage Bonus</th>\
						<th class="ramDamage" title="碰撞伤害得分">Ram Damage</th>\
						<th class="ramDamageBonus" title="碰撞伤害奖励">Ram Damage Bonus</th>\
					</tr>\
				</thead>';

			htmlArray.push(headContent);
			htmlArray.push("<tbody>");
			
			for(var i=0,len=robotRankList.length;i<len;i++){
				var robot=robotRankList[i];
				var formatNumber = J.format.number;
				var content='\
					<tr>\
						<td class="rank">'+(i+1)+'</td>\
						<td class="name" name="' + robot.name +'">'+robot.name+' <a class="shareScore" cmd="shareScore" href="javascript:void(0);">&lt;分享&gt;</a></td>\
						<td class="totalScore">'+formatNumber(robot.totalScore,'0')+'</td>\
						<td class="survivalScore">'+formatNumber(robot.survivalScore,'0')+'</td>\
						<td class="bulletDamage">'+formatNumber(robot.bulletDmgScore,'0')+'</td>\
						<td class="bulletDamageBonus">'+formatNumber(robot.bulletDmgBonusScore,'0')+'</td>\
						<td class="ramDamage">'+formatNumber(robot.ramDmgScore,'0')+'</td>\
						<td class="ramDamageBonus">'+formatNumber(robot.ramDmgBonusScore,'0')+'</td>\
					</tr>';
				htmlArray.push(content);
								
				var obj = {
					name : robot.name,
					total: robot.totalScore,
					survival: robot.survivalScore,
					bulletDamage: robot.bulletDmgScore,
					bulletDamageBonus: robot.bulletDmgBonusScore,
					ramDamage: robot.ramDmgScore,
					ramDamageBonus: robot.ramDmgBonusScore
				}
				saveList.push(obj);
			}
			if(len<10){
				for(i=0,len=10-len; i<len; i++){
					content='\
						<tr>\
							<td class="rank"></td>\
							<td class="name"></td>\
							<td class="totalScore"></td>\
							<td class="survivalScore"></td>\
							<td class="bulletDamage"></td>\
							<td class="bulletDamageBonus"></td>\
							<td class="ramDamage"></td>\
							<td class="ramDamageBonus"></td>\
						</tr>';
					htmlArray.push(content);
				}
			}
			htmlArray.push("</tbody>");
			htmlArray.push("</table>");
			scoreSection.innerHTML = htmlArray.join("");
			var tankMode = tank.getMode();
			if(tankMode !=="dev"){//开发模式不可以上传
				switch(tankMode){
					case "oneVSOne":
						modetype = 1;
						break;
					case "melee":
						modetype = 10;
						break;
					case "teamTwo":
						modetype = 2;
						break;
					case "teamFive":
						modetype = 5;
					    break;
				}
				if(modetype){
				this.save(saveList,tankMode,modetype);
				}
			}	
		},
		save : function(arr,mode,type){
			var _this = this;  
			var t = +new Date;
			var list = CryptoJS.AES.encrypt(J.json.stringify(arr), 'score' + t) + '';
			var param = { list: '[]', r : list, t: t, type : type };
			if(mode == "oneVSOne" || mode == "melee"){
				site.rpc(scoreSaveCgi, param, function(data){
				
					if (data.success || data.code == 0){
					//return false;	
					}else if (data.code == 10000){ 
						return false;// not login	
					}else{
						alert('保存积分失败');	
					}
				});
			}else if(mode == "teamTwo" || mode == "teamFive"){
				site.rpc('/api/score/teamcreate', param, function(data){
				
					if (data.success || data.code == 0){
					//return false;	
					}else if (data.code == 10000){ 
						return false;// not login	
					}else{
						alert('保存积分失败');	
					}
				});
			}
		}

	}
	this.score=score;
});
