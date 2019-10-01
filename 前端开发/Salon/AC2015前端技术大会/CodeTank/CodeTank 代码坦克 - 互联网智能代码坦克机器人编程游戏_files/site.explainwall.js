Jx().$package("site.explainWall",function(J){
    var packageContext = this;
    var $D = J.dom,
    $E = J.event;

    this.translateObj={
    	"ahead":["前进了","往前走了","向前跑过了"],
        "scanned":["发现了","看到了","的雷达扫描到了"],
        "hitRobot":["撞击了","碰到了"],
        "win":["比赛结束了,再来一局吧！"],
        "hitByBullet":["被击中了","被打中了一下"]
    };
    this.wordColorObj={
        "scanned":"red",
        "hitRobot":"green",
        "win":"yellow",
        "hitByBullet":"orange"
    }
    this.cmdToWord=function(cmd){
    	var wordArr=this.translateObj[cmd.cmdName];
        var color=this.wordColorObj[cmd.cmdName];
    	var index=Math.floor(Math.random()*wordArr.length);
    	return "<p>" + cmd.tankName + "<span style='color:"+color+"'>" + wordArr[index] + "</span>" + cmd.cmdParam +"</p>";
    }

    this.ActionCommand=new J.Class({
    	init:function(options){
    		this.tankName=options.tankName;
	    	this.cmdName=options.cmdName;
	    	this.cmdParam=options.cmdParam;
	    }
    });
  
    this.init=function(){
        var self=this;
    	this.elem=$D.id("explainWall");
        this.lastTime=0;
        this.showDuration=1000;

        $E.addObserver(codeTank.event,"eventTrigger",function(e){
            var now=Date.now();
            var tankName=e.tankName;
            var eventName=e.eventName;
            var eventParam=e.eventParam;
           
            if((now-self.lastTime>self.showDuration&&!self.isSameCommand(tankName,eventName,eventParam))||eventName=="win"){
               self.add(e.tankName,e.eventName,e.eventParam);
               self.lastTime=now;

               self.preTankName=tankName
               self.preCmdName=eventName
               self.preCmdParam=eventParam;
            }
        });
    };
    this.isSameCommand=function(tankName,cmdName,cmdParam){
        return tankName==this.preTankName&&cmdName==this.preCmdName&&cmdParam==this.preCmdParam;
    };
    this.addWord=function(word){
    	var e=this.elem;
    	var liArr=$D.tagName("li",e);
    	var newWord=$D.node("li");
    	newWord.innerHTML=word;
    	if(!liArr.length) e.appendChild(newWord);
    	else e.insertBefore(newWord,liArr[0]);
    }
    //添加一条解说
    this.add=function(tankName,cmdName,cmdParam){
        var command=new this.ActionCommand({
            tankName:tankName,
            cmdName:cmdName,
            cmdParam:cmdParam
        })
        var word=this.cmdToWord(command);
        this.addWord(word);
    }
});