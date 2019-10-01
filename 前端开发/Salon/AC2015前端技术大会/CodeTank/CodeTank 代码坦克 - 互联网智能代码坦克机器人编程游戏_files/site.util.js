
Jx().$package("site.util",function(J){
    var packageContext = this;
    var $D = J.dom, $E = J.event;
    /*
	 *	浮层
	 	示例：
		site.util.Openner.setTitle('创建团队'); //设置浮层标题
		site.util.Openner.setCmdCallback(this.onClick); //设置浮层cmd点击回调函数，格式：this.cmdCallback(cmd, target, e);
		site.util.Openner.setContent(html); //设置浮层内容
		site.util.Openner.show(); //显示
		site.util.Openner.close()//关闭
	 */
	var Openner = {
		dom : {}, 
		cmdCallback : null,
		callback : null, //关闭回调
		init: function(){ 
			this.dom.container = $D.id('openWin'); 
			this.dom.mask = $D.id('maskCover');  
			this.dom.title = $D.id('openHeaderTitle'); 
			this.dom.content = $D.id('openContent'); 
			this.dom.tips = $D.id('openTips');
			$E.on(this.dom.container, 'click', this.onClick);
			
		}, 
		onClick : function(e){
			
			var _this = Openner;
			var target = e.target;
			var href = target.getAttribute('href');
			if (href && href == '#'){
				e.preventDefault();
			}
			var cmd = target.getAttribute('cmd');
			if (!cmd){
				return false;	
			}	
			if (cmd == 'OpenClose'){
				Openner.onClose();	
			}else{
				if (_this.cmdCallback){
					_this.cmdCallback(cmd, target, e); 
				}
			}
		},
		close: function(){	 
			$D.hide(this.dom.container);
			$D.hide(this.dom.mask);
			if (this.callback){
				this.callback();
				this.callback = null;	
			}
			if (this.cmdCallback){
				this.cmdCallback = null;	
			}
		},
		setCallback : function(callback){
			this.callback = callback;
		},
		setCmdCallback : function(callback){
			this.cmdCallback = callback;
		},
		onClose : function(){
			this.close();
		}, 
		setTitle: function(txt){
			this.dom.title.innerHTML = txt;
		},
		setContent: function(content){
			this.dom.content.innerHTML = content;
		},
		//callback关闭回调
		show: function(callback){ 
			this.callback = callback;
			$D.show(this.dom.container);
			$D.show(this.dom.mask);
			var w = $D.getClientWidth(document.body),
				h = parent.document.documentElement.clientHeight, 
				ow = $D.getClientWidth(this.dom.container),
				oh = $D.getClientHeight(this.dom.container);
			var l = w > ow ? (w - ow)/2 : 0,
				t = h > oh ? (h - oh)/2 : 0;	  
			t = t + document.documentElement.scrollTop;  
			$D.setStyle(this.dom.container, 'left', l+'px');
			$D.setStyle(this.dom.container, 'top', t+'px');			
		},
		showEx : function(param){
			if (!param){
				this.show();
				return false;	
			}
			if (param.title){
				this.setTitle(param.title);	
			}
			if (param.content){
				this.setContent(param.content);	
			}			
			this.cmdCallback = param.clickCallback;
			this.show(param.closeCallback);			
		},
		//在标题中间：提示
		tips : function(txt){
			if ($D.hasClass(this.dom.tips, 'warning')){
				$D.removeClass(this.dom.tips, 'warning');	
			}
			var _this = this;
			this.dom.tips.innerHTML = txt;
			$D.show(this.dom.tips);
			setTimeout(function(){
				$D.hide(_this.dom.tips);
				_this.dom.tips.innerHTML = '';
			}, 2000);
		},
		//在标题中间：警告
		warning :  function(txt){
			if (!$D.hasClass(this.dom.tips, 'warning')){
				$D.addClass(this.dom.tips, 'warning');	
			}
			var _this = this;

			this.dom.tips.innerHTML = txt;
			$D.show(this.dom.tips);
			setTimeout(function(){
				$D.hide(_this.dom.tips);
				_this.dom.tips.innerHTML = '';
			}, 2000);
		}
	};
	Openner.init();
    this.Openner = Openner;
	
	
	
	/*
	 *	系统alert
	 	示例：
		site.util.Alert.tips('创建团队'); 
	 */
	var Alert = {
		dom : {}, 
		cmdCallback : null,
		callback : null, //关闭回调
		init: function(opt){ 
			this.dom.container = $D.id('alertTips'); 
			this.dom.mask = $D.id('maskCover2');    
			this.dom.content = $D.id('alertTipsContent');  
			this.dom.close = $D.id('alertTipsClose'); 
			ClickProxy.call(this, {target:['alertTips']});
		}, 
		/*onClick : function(e){
			
			var _this = Alert;
			var target = e.target;
			var href = target.getAttribute('href');
			if (href && href == '#'){
				e.preventDefault();
			}
			var cmd = target.getAttribute('cmd');
			if (!cmd){
				return false;	
			}	
			if (cmd == 'Close'){
				_this.onClose();	
			}else{
				if (_this.cmdCallback){
					_this.cmdCallback(cmd, target, e); 
				}
			}
		},*/
		onClose : function(){
			this.close();
		},
		//param : {hasClose : false, hasBtn: false, isAutoClose: true, callback : function(result){result.code:1 : ok, 0 cancel}}
		/*
		 site.util.Alert.tips('请先登录!', 2); 
		 txt:显示文本
		 type:0，没有icon，1成功，3警告
		 param : {hasClose : false, //是否有关闭按钮
		 		 hasBtn: false, //是否有确定取消按钮
				 isAutoClose: true, //是否自动关闭
				 callback : function(result){  //回调
					 result.code:1 : ok, 0 cancel
				}}
		 */
		tips : function(txt, type, param){
			type = type || 0;
			param = param || {};
			if (param.hasClose){
				$D.show(this.dom.close);	
			}else{
				$D.hide(this.dom.close);
			}
			if (param.hasBtn){
				if (!$D.hasClass(this.dom.container, 'alertTipsEx')){
					$D.addClass(this.dom.container, 'alertTipsEx');
				}
			}else{
				if ($D.hasClass(this.dom.container, 'alertTipsEx')){
					$D.removeClass(this.dom.container, 'alertTipsEx');
				}
			}
			/*if (isWarning){
				if (!$D.hasClass(this.dom.content, 'iconWarning')){
					$D.addClass(this.dom.content, 'iconWarning');
				}
			}else{
				if ($D.hasClass(this.dom.content, 'iconWarning')){
					$D.removeClass(this.dom.content, 'iconWarning');
				}
			}*/
			if (type == 1){ //suc
				this.dom.content.className = 'alertTipsContent iconSuc';	
			}else if (type == 2){ //warning
				this.dom.content.className = 'alertTipsContent iconWarning';	
			}else{
				this.dom.content.className = 'alertTipsContent';	
			}
			this.callback = param.callback;
			this.dom.content.innerHTML = txt;
			var _this = this;
			param.isAutoClose = J.isUndefined(param.isAutoClose) ? true : param.isAutoClose;
			if (param.isAutoClose){  //默认自动关闭
				setTimeout(function(){
					_this.close();
				},2000);
			}
			//isWarning
			this.show();
		},
		success : function(txt, param){
			this.tips(txt, 1, param);
		},
		warning : function(txt, param){
			this.tips(txt, 2, param);
		},
		close: function(retcode){	 
			retcode = retcode || 0;
			$D.hide(this.dom.container);
			//$D.hide(this.dom.mask);
			if (this.callback){
				this.callback({retcode : retcode});
				this.callback = null;	
			} 
		},
		onOk : function(){
			this.close(1);
		},
		onClose : function(){
			this.close(0);
		}, 
		//callback关闭回调
		show: function(){ 
			$D.show(this.dom.container);
			//$D.show(this.dom.mask);
			var w = $D.getClientWidth(document.body),
				h = parent.document.documentElement.clientHeight, 
				ow = $D.getClientWidth(this.dom.container),
				oh = $D.getClientHeight(this.dom.container);
			var l = w > ow ? (w - ow)/2 : 0,
				t = h > oh ? (h - oh)/2 : 0;	  
			t = t + document.documentElement.scrollTop;  
			$D.setStyle(this.dom.container, 'left', l+'px');
			$D.setStyle(this.dom.container, 'top', t+'px');			
		}		 
	};
	Alert.init();
    this.Alert = Alert;
	
	/*
	 *	页面点击代理父类
	 *  使用方法: ClickProxy.call(this, {target:[], type: ''});
	 */
	function ClickProxy(initParam){
		var _classThis = this; 
		//设置页面区域代理
        var setClickProxy = function(target, type){
			type = type || 'id';			
			if (type == 'class'){
				var domArr = Jx().dom.mini('.' + target);
				for (var k in domArr){					
					var dom = domArr[k];
					if (dom){
						Jx().event.on(dom, 'click', onViewClick);  
					}
				}	
			}else{
				var idArr = target;;
				for (var k in idArr){ 
					var id = idArr[k];
					var dom = Jx().dom.id(idArr[k]);
					if (dom){
						Jx().event.on(dom, 'click', onViewClick);  
					}
				}	
			}
            
        }
		 //页面代理响应
        var onViewClick = function(e){ 
			var target = getEventTarget(e);			  
			if (!target){
				return false;	
			} 
			var href = target.getAttribute('href'); 
            if(href && /#$/g.test(href) ){ 
                e.preventDefault();
            } 
             var cmd = target.getAttribute('cmd') || '';  
			var _this = _classThis, func = 'on' + cmd; 
			 
			if (_this[func]){
				_this[func](target);	
			}else{
				return false;	
			}             
        } 
		var getEventTarget = function(e, property){
			var t = e.target, 
				l = 3,
				p = property || 'cmd';
			while(t && l-- > 0){
				if(t==document){
					return null;
				}
				if(t.getAttribute(p)){ 
					return t;
				}else{
					t = t.parentNode;
				}
			}
			return null;
		} 
		setClickProxy(initParam.target, initParam.type); 
	}
	this.ClickProxy = ClickProxy;

});
