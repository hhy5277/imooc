
Jx().$package('site.urlBattle', function(J){
    var packageContext = this;
    var $D = J.dom, $E = J.event;
    //社招 随机坦克数组
    var randomTanks = ["alloyteam.spinbot","alloyteam.ramFire","alloyteam.walls","alloyteam.tracker","alloyteam.crazy","alloyteam.fire","alloyteam.trackFire"];

    var viewRobotCode = function(name){
        var robot = site.robotManager.getTankByName(name);
        if(robot){
            robot.getCode(function(code, obj){
				site.editor.edit(obj, 2);
                site.sidebar.show();
			});
            return;
        }
        var ids = name.split('.');
        site.rpc('/api/tanks/find', { uid: ids[0], tid: ids[1], limit: 1, start: 0 }, function(response){
            if(response.success){
                site.robotManager.addTanks(response.data);
                viewRobotCode(name);
            }else{
                alert('读取坦克代码失败');
            }
        });
    }

    var loadRobotAndBattle = function(tanks){
        var notExists = [], notExistsCount = 0;
    	for (var i =0; i < tanks.length; i++ ){	
        	var robot = site.robotManager.getTankByName(tanks[i]);
        	if(robot){
        	    robot.getCode(function(code, robot){
                    eval(code);
                    site.addRobot("",robot.uid+'.'+robot.tid, robot.team);
        		});
    		}else{
                notExists.push(tanks[i]);
                notExistsCount++;
                var ids = tanks[i].split('.');
                site.rpc('/api/tanks/find', { uid: ids[0], tid: ids[1], limit: 1, start: 0 }, function(response){
                    notExistsCount--;
                    if(response.success){
                        site.robotManager.addTanks(response.data);
                    }else{
                        // alert('读取坦克代码失败');
                    }
                    if(notExistsCount <= 0){
                        loadRobotAndBattle(notExists);
                    }
                });
    		}	
    	}
	
    }

    var commands = {
        'view': function(tank){
            if(tank.indexOf('.') == -1){
                alert('坦克名字有误');
                return;
            }
            viewRobotCode(tank);
        },
        'battle': function(tanks){
            var t = localStorage.getItem("ftank");
            //社招题目
            if (tanks == "welcome2tencent") {
                if(!t){
                    var n = Math.floor(Math.random() * randomTanks.length);
                    tanks = randomTanks[n];
                    localStorage.setItem("ftank",tanks);
                }
                else{
                    tanks = t; 
                }
                var list = document.getElementById("netRobotList").getElementsByTagName("li");
             
                for(var j = 0,l = list.length ; j<l ; j++){
                    var title = list[j].getAttribute("title");
                    if(title != tanks){
                        list[j].style.display = "none";
                    }
                }
                window.tencentTankName = tanks;
            }

            // Mode.set('dev')
            var tanks = tanks.split(',');
            // if(tanks.length != 2){
            //     return;
            // }
            // codeTank.setMode('oneVSOne');
            codeTank.setMode('dev');
            J.dom.id('battleMode').value = codeTank.getMode();
            loadRobotAndBattle(tanks);
        }
    }

    var executeCMD = function(cmd, param){
        commands[cmd] && commands[cmd](param);
    }

    var analyseUrl = function(){
        var param = J.string.mapQuery();
        if(param.cmd && param.param){
            executeCMD(param.cmd, param.param);
        }
		if(param.cmd && param.mode){
			site.setting.Layer.setMode(param.mode);
		}
    }



    this.init = function(){
        $E.addObserver(site.robotManager, 'robotListReady', analyseUrl);
    }

});
