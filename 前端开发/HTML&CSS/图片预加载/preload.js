(function ($) {
	function Preload (imgs,options) {
		this.imgs = (typeof imgs ==='string')?[imgs]:imgs;
		this.opts = $.extend({}, Preload.DEFAULTS,options);

		if(this.opts.order === 'ordered'){
			this._ordered();
		}else{
			this._unordered();
			
		}
	}
	Preload.DEFAULTS = {
		order:'unordered',//无序预加载
		each:null,//没张图片加载完成后执行
		all:null//所有图片加载完成后执行
	};
	Preload.prototype._ordered = function  () {
		var imgs = this.imgs,
		len = imgs.length,
		count = 0,
		opts = this.opts;

		load () ;


		function load () {
		var imgObj = new Image();

		$(imgObj).on('load error', function() {
			opts.each && opts.each(count);
			if(count>=len){
				//所有图片已经加载完成
				opts.all && opts.all();
			}else{
				load () ;
			}
			count++;
		});

		imgObj.src = imgs[count];
	}
	},
	Preload.prototype._unordered = function  () {
		var imgs = this.imgs,
		len = imgs.length,
		count = 0,
		opts = this.opts;
		$.each(imgs,function (i,src) {
			if(typeof src !='string') return;
			var imgObj = new Image();
			$(imgObj).on('load error', function() {
				opts.each && opts.each(count);
				if(count>=len-1){
					opts.all && opts.all();
				}
				count++;
				
			});

			imgObj.src = src;
		});

	
	};

	$.extend({
		preload:function  (imgs,opts) {
			new Preload(imgs,opts);
		}
	});
	
})(jQuery);