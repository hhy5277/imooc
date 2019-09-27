var barurl = location.href.replace(/<(script)[\S\s]*?\1>|<\/?(a|img)[^>]*>/gi, "");
document.write('<link href="http://img.chinaz.com/max-templates/passport/styles/topbar.css" type="text/css" rel="Stylesheet" /><link href="http://img.chinaz.com/max-templates/default/styles/dialog.css" type="text/css" rel="Stylesheet" />');
var barhtml = '';
barhtml = '<div class="userbar">';
	barhtml += '<a href="http://my.chinaz.com/accounts/login.html?returnurl=' + barurl + '" target="_top">立即登录</a>\
	<a href="http://my.chinaz.com/accounts/register.html?returnurl=http%3A%2F%2Fmy.chinaz.com%2Faccounts%2Flogin.html")>注册新帐号</a>';
barhtml += '</div>';
if(document.getElementById('chinaz_topbar')){
	document.getElementById('chinaz_topbar').innerHTML = barhtml;
}
	