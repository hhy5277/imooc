
Jx().$package("site.setting",function(J){
    var packageContext = this;
    var $D = J.dom, $E = J.event;
    var canvas,
        battlegroundList,
        battlegroundSelect,

        isPlaySoundInput,
        isShowRadarInput,
        isShowMsgInput;

    var backgroundList = [
        { url: 'bg1.png', thumb: 'bg1_thumb.jpg' },
        { url: 'bg2.png', thumb: 'bg2_thumb.jpg', grid: 'bg_grid.png' },
        { url: 'bg3.jpg', thumb: 'bg3_thumb.jpg', grid: 'bg_grid.png' },
        { url: 'bg4.jpg', thumb: 'bg4_thumb.jpg', grid: 'bg_grid.png' },
        { url: 'bg5.jpg', thumb: 'bg5_thumb.jpg', grid: 'bg_grid.png' },
        { url: 'bg6.jpg', thumb: 'bg6_thumb.jpg', grid: 'bg_grid.png' }
    ];

    //根据config对象reset input
    var resetButton=function(){
        isPlaySoundInput.checked=codeTank.config.isPlaySound;
        isShowRadarInput.checked=codeTank.config.isShowRadar;
        isShowMsgInput.checked=codeTank.config.isShowMsg;
    }

    var setBattleground = function(value){
        var bg = backgroundList[value];
        var imgs = '';
        if(bg.grid){
            imgs = 'url(./style/battlefield/' + bg.grid +'),';
        }
        imgs += 'url(./style/battlefield/' + bg.url +')';
        canvas.style.backgroundImage = imgs;
    }

    var setInitBackground = function(){
        var value = localStorage['battleground'] || 3;
        // if(typeof value !== 'undefined'){
            // battlegroundSelect.value = value;
            setBattleground(value);
        // }

    }
    var backgroundListCreated = false;
    var createBackgroundList = function(){
        if(backgroundListCreated){
            return;
        }
        backgroundListCreated = true;
        var html = '';
        var tmpl = '\
<% for(var i = 0, bg; bg = backgroundList[i]; i++) { %>\
<span cmd="setBattleground" param="<%=i%>" \
style="background-image: url(./style/battlefield/<%=bg.thumb%>)"></span>\
<% } %>\
';
        html = J.string.template(tmpl, {backgroundList: backgroundList});
        battlegroundList.innerHTML = html;
    }
	 
	/*
	 *	处理画布大小设置类
	 */ 
	var GameSize  = {
		sizeList :  [ //这里的值是指canvas画布大小，外框要加margin
			{width : 600, height : 500},
			//{width : 800, height : 500},
			{width : 800, height : 600},
			{width : 900, height : 600},
			{width : 1000, height : 600},
			//{width : 1200, height : 600},
			{width : 1200, height : 700}
		],
		dom : {},		
		init : function(){
			if (!this.dom.main){
				this.dom.main = $D.id('battleSizeList');
				this.initList();
				var idx = localStorage['battleSize'] || 1;
				this.setCur(idx);	
			}			
		},
		initCanvas : function(){
			var idx = localStorage['battleSize'] || 1;
			this.resize(idx);
		},
		initList : function(){ 
			var html = '';
			for (var k = 0, l = this.sizeList.length; k < l; k++){
				var size = this.sizeList[k];
				html += '<li class="active" param="'+ k +'">'+ size.width + '×' + size.height +'</li>';	
			}
			this.dom.main.innerHTML = html;
			$E.on(this.dom.main, 'click', this.onClick);
			this.dom.btns = $D.mini('li', this.dom.main);
		},
		onClick : function(e){
			var target = e.target; 
			GameSize.setCur(target.getAttribute('param'));
            GameSize.save();
		},
		getSize : function(idx){
			return this.sizeList[idx];	
		},
		setCur : function(idx){
			if (gameObj.isStartBattle){
				alert('战斗中不能修改大小！');
				return false;	
			}
			if (!this.dom.btns){
				return false;	
			}
			if (this.dom.cur){
				$D.removeClass(this.dom.cur, 'cur');	
			}
			this.dom.cur = this.dom.btns[idx];
			$D.addClass(this.dom.cur, 'cur');
		},
		//保存设置
		save : function(){
			if (!this.dom.cur){
				return false;	
			}
			if (gameObj.isStartBattle){
				return false;	
			}
			var idx = this.dom.cur.getAttribute('param');
			this.resize(idx);
			///调用更新画布api，通知更新
			this.updateSave();
			
		},
		updateSave : function(){
			if (!this.dom.cur){
				return false;	
			}
			localStorage['battleSize'] = this.dom.cur.getAttribute('param');
		},
		//调整画布及外框
		resize : function(idx){
			var size = this.sizeList[idx] || this.sizeList[1];
			var dom = $D.id('leftMain'), canvas = $D.id('canvas');
			if (dom){
				$D.setStyle(dom, 'width', (size.width) + 'px');
				//$D.setStyle(dom, 'height', size.height + 'px');
				canvas.setAttribute('width', size.width);
				canvas.setAttribute('height', size.height);
				$D.setStyle(canvas, 'width', size.width + 'px');
				$D.setStyle(canvas, 'height', size.height + 'px');
				//更新canvas内部
				gameObj.setBattleFieldSize(size.width, size.height);
                gameObj.showSize();
			}
		},
		autoResize : function(w, h){			
			var idx = 0;
			for (var k = 0, l = this.sizeList.length; k < l; k++){
				var it = this.sizeList[k];
				if (w > it.width && h > it.height){
					idx = k;	
				}
			} 
			this.resize(idx);
			localStorage['battleSize'] = idx;
		}
	}
	/*
	 *	由于没有独立的layer模块，暂时放这里对布局进行管理
	 *  部分功能已经hack到html部分
	 */
	var Layer = { 
		mode : 'full', //full完整模式, battle战斗模式
		theme : 'default', //transparent 仅在iframe内有效,暂时只有透明和默认 
		setMode : function(mode){
			mode = mode || 'full';
			this.mode = mode; 
			//判断是否iframe
			if (mode == 'battle' && self != top){
				var ww = window.innerWidth, wh = window.innerHeight; 
				GameSize.autoResize(ww - 100, wh - 100);	//增加100的边距
			}
		},
		//设置主题，仅在iframe内有效,暂时只有透明和默认
		setTheme : function(theme){
			//判断是否iframe
			if (self == top){
				return false;	
			}
			theme = theme || 'full';
			this.theme = theme;
			var dom = document.body;//document.getElementById('codeTankWrapper');
			if (theme == 'transparent'){
				if (!$D.hasClass(dom, 'tranTransparent')){
					$D.addClass(dom, 'tranTransparent'); 
				} 
			}else{
				if ($D.hasClass(dom, 'tranTransparent')){
					$D.removeClass(dom, 'tranTransparent');
				}
			}
		}
	}
	this.Layer = Layer;
	
	
    this.show = function(){
        if(!site.panelManager.getPanel('robotSetting')){
            site.panelManager.createPanel('robotSetting', {
                className: 'robotSetting',
                title: '设置中心',
                titleText: 'SETTING',
                html: qtool.getTemplate('robotSetting'),
                onClose: resetButton,
                buttons: [
                    '关　闭'
                ]
            });

            isPlaySoundInput=$D.id("sound"),
            isShowRadarInput=$D.id("radar"),
            isShowMsgInput=$D.id("msgBox");
            
            battlegroundList = $D.id("battlegroundList");

            battlegroundSelect = $D.id('battleground');

            createBackgroundList();
            
            GameSize.init();

            qtool.bindCommands(battlegroundList, 'click', {
                'setBattleground': function(param, target, event){
                    localStorage['battleground'] = param;
                    setBattleground(param);
                }
            });

            $E.on(isPlaySoundInput,"click",function(){
                codeTank.config.isPlaySound=isPlaySoundInput.checked;
            });
            $E.on(isShowRadarInput,"click",function(){
                codeTank.config.isShowRadar=isShowRadarInput.checked;
            });
            $E.on(isShowMsgInput,"click",function(){
                codeTank.config.isShowMsg=isShowMsgInput.checked;
            });
        }
        site.panelManager.showPanel('robotSetting');
    }

    this.init = function(){

        canvas = $D.id('canvas');

        setInitBackground();
		
		GameSize.initCanvas();

    }

});
