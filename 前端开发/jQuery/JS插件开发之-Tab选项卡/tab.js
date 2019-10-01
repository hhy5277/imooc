;(function  ($) {
	var Tab = function(tab) {
		var _this_ = this;
		this.tab = tab;

		//默认配置参数
		this.config = {
			//鼠标触发类型 是click 还是 mouseover
			"triggerType":"mouseover",//click",
			"effect":"fade",//内容切换效果
			"invoke":2,//默认第几个tab
			"auto":false//5000  是否自动切换 指定了时间就是自动切换 切换时间间隔就是指定的时间
		};
		if(this.getConfig()){
			$.extend(this.config, this.getConfig());
		}
		//保存tab标签列表、保存对应的内容列表
		this.tabItems = this.tab.find('ul.tab-nav li');
		this.contentItems = this.tab.find('div.content-wrap div.content-item');

		var config = this.config;
		if(config.triggerType==="click"){
			this.tabItems.bind(config.triggerType,  function() {
				_this_.invoke($(this));
			});
		}else if(config.triggerType==="mouseover" || config.triggerType!=="click"){
			this.tabItems.mouseover(function() {
				_this_.invoke($(this));
			});
		}

		if(config.auto){

			this.timer = null;
			this.loop = 0;

			this.autoPlay();

			this.tab.hover(function  () {
				window.clearInterval(_this_.timer);;
			},function  () {
				_this_.autoPlay();
			});
		}

		if(config.invoke>1){

			this.invoke(this.tabItems.eq(config.invoke-1));
		}
	};
	Tab.prototype = {
		autoPlay:function(){
			var _this_ =  this;
			tabItems = this.tabItems;
			tabLength = tabItems.size();
			config = this.config;

			this.timer = window.setInterval(function() {
				_this_.loop++;

				if(_this_.loop >= tabLength){
					_this_.loop = 0;
				}

				tabItems.eq(_this_.loop).trigger(config.triggerType);

			},config.auto);
		},
		//事件驱动函数
		invoke:function(currentTab) {
			var _this_ = this;

			/**
			选中状态添加actived
			切换tab内容，根据配置参数的effect是default还是fade
			*/	
			var index = currentTab.index();
			currentTab.addClass('actived').siblings().removeClass('actived');

			var effect = this.config.effect;
			var conItems = this.contentItems;
			if(effect ==="default" || effect !=="fade"){
				conItems.eq(index).addClass('current').siblings().removeClass('current');
			}else if(effect ==="fade"){
				conItems.eq(index).fadeIn().siblings().fadeOut();

			}

			//注意：如果配置了自动切换 要把当前的loop值设置为当前tab的index
			if(this.config.auto){
				_this_.loop = index;
			}
		},
		//获取配置参数的方法
		getConfig:function() {
			//获取tab elem节点上的data-config
			var config = this.tab.attr('data-config');
			if(config && config!=""){
				return $.parseJSON(config);
			}else{
				return null;
			}
		}
	};

	Tab.init = function  (tabs) {
		var _this_ = this;

		tabs.each( function() {
			new _this_($(this));
		});
	};

	$.fn.extend({
		tab:function() {
			this.each(function() {
				new Tab($(this));
			});
			return this;
		}
	});
	

	window.Tab = Tab;
})(jQuery);