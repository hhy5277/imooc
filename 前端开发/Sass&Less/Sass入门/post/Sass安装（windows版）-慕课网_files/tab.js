

define(function(require, exports, module){
	
	(function($){
		$.fn.tabs=function(){
		return this.each(function(){
			var target=$(this);
			var $tabHeader=target.find('ul:eq(0) li');
			var $tabContent=target.find('.tab-con');
			    $tabContent.hide();
				 $tabContent.eq(0).show();
			$tabHeader.eq(0).addClass('ui-tabs-active');
			$tabHeader.on('click',function(e){	
             e.preventDefault();
             $tabHeader.removeClass('ui-tabs-active');
             $tabContent.hide();
				 var index=$tabHeader.index($(this));
					$(this).addClass('ui-tabs-active');
					   $tabContent.eq(index).show()
			      })
			    })
			}
    })(window.jQuery)

});
