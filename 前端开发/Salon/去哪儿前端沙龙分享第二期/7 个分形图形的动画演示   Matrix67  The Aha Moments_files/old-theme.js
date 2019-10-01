jQuery(document).ready(function($){
	
	var $body = $('body');
	$('#notice').on('click', '#theme-toggle', fadeBody);
	
	function fadeBody() {
		$body.fadeOut(1000,toggleClass);
	}
	
	function toggleClass() {
		if ($body.hasClass('old-theme')) {
			$('#notice').html('<aside id="notice">这是一篇旧文，点击<a id="theme-toggle">此处</a>以旧主题模式浏览。</aside>');
			$body.removeClass('old-theme');
			$('.floor-number').remove();
		} else {
			$('#notice').html('<a id="theme-toggle">关闭旧主题浏览模式</a>');
			$body.addClass('old-theme');
			
			var floorCount = 1;
			$('.comment-text').each(function () {
				$(this).prepend('<span class="floor-number">楼层：' + floorCount + '楼 | ' + '</span>');
				floorCount ++;
			});
			
			$('#comments li:nth-child(1) .floor-number').text('楼层: 沙发 | ');
			$('#comments li:nth-child(2) .floor-number').text('楼层: 板凳 | ');
			$('#comments li:nth-child(3) .floor-number').text('楼层: 地毯 | ');
			$('#comments li:nth-child(4) .floor-number').text('楼层: 地板 | ');
			$('#comments li:nth-child(5) .floor-number').text('楼层: 地下室 | ');
			$('#comments li:nth-child(6) .floor-number').text('楼层: 地基 | ');
			$('#comments li:nth-child(7) .floor-number').text('楼层: 地壳 | ');
			$('#comments li:nth-child(8) .floor-number').text('楼层: 地幔 | ');
			$('#comments li:nth-child(9) .floor-number').text('楼层: 地核 | ');
			$('#comments li:nth-child(13) .floor-number').text('楼层: 12a楼 | ');
			$('#comments li:nth-child(42) .floor-number').text('楼层: Answer to Life, the Universe, and Everything | ');
					
			
		}
		
				
		$('body').fadeIn(1000);
	}
});