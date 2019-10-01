clouda.define("mbaas/account",function(o){var i=clouda.lightapp,n=clouda.mbaas.account={},o=clouda.mbaas||{},e=clouda.DelegateClass,t=clouda.kuangForReady,l=(clouda.runtimeError,clouda.installPlugin,clouda.cloudaBLight),a=(new e("device","login","login"),null);o.LOGIN_TYPE={WEIBO:"sinaweibo",QQ:"qqdenglu",KAIXIN:"kaixin",QQWEIBO:"qqweibo",RENREN:"renren"};var c=!1,r=clouda.lib.utils.stat,d=function(o){var i={client_id:clouda.lightapp.ak,redirect_uri:o.redirect_uri,scope:o.scope||"basic",login_mode:o.login_mode||0,login_type:o.login_type||void 0,mobile:o.mobile||void 0,display:"mobile",response_type:"code",state:o.state||void 0};return 1===i.login_mode&&(i.confirm_login=1),2===i.login_mode&&(i.force_login=1),i.disable_third_login=0===o.disable_third_login?o.disable_third_login:1,o.authorize_url&&(i.authorize_url=o.authorize_url),o.ak&&(i.ak=o.ak),i},u=function(o){var i="https://openapi.baidu.com/oauth/2.0/authorize",n=o.ak||clouda.lightapp.ak;o.authorize_url&&(i=o.authorize_url);var e=i+"?response_type=code&client_id="+n+"&redirect_uri="+encodeURIComponent(o.redirect_uri);return o.login_mode&&(e+="&login_mode="+o.login_mode),o.login_type&&(e+="&login_type="+o.login_type),o.scope&&(e+="&scope="+o.scope),o.state&&(e+="&state="+o.state),o.display&&(e+="&display="+o.display),o.force_login&&(e+="&force_login="+o.force_login),o.confirm_login&&(e+="&confirm_login="+o.confirm_login),o.mobile&&(e+="&mobile="+o.mobile),o.return_callback&&(e+="&return_callback="+encodeURIComponent(location.origin)),e+="&disable_third_login="+o.disable_third_login};n.login=function(o){function i(){n.return_callback=1;var i=u(n);document.querySelector("#cloudaLoginFrame")?a=document.querySelector("#cloudaLoginFrame"):(a=document.createElement("iframe"),a.id="cloudaLoginFrame"),a.src=i,a.style.position="absolute",a.style.top="0px",a.style.left="0px",a.scrolling="no",a.style.border="none",a.style.backgroundColor="#fff",a.style.display="none",a.style.zIndex="99999",document.body.appendChild(a),c||window.addEventListener("message",function(i){var n=i.data;"return_callback"===n&&(clouda.mbaas.account.closeLoginDialog(),o.onfail()),"show_login"===n&&(a.style.display="block"),c=!0},!1);var e=top.innerWidth>=top.document.body.offsetHeight?top.innerWidth:top.document.body.offsetHeight;a.style.width=top.innerWidth+"px",a.style.height=e+"px",a.onload=function(){a.style.width=top.innerWidth+"px",a.style.height=e+"px"}}if(r({api:"account.login"}),!o.redirect_uri)return console.error("missing redirect_uri"),!1;var n=d(o);if(!o.onsuccess||!o.onfail){var e=u(n);return clouda.RUNTIME==clouda.RUNTIMES.KUANG&&"function"==typeof BLightApp.isLogin?clouda.PLATFORM===clouda.PLATFORMS.IOS&&clouda.RUNTIME_VERSION<"6.4"?void(location.href=e):void l("isLogin",JSON.stringify({}),function(o){if("0"!=o.isLogin&&o.isLogin)location.href=e;else{n.tpl="dev";var i=clouda.lib.utils.regcallback(function(){location.href=e},function(){});BLightApp.bdLogin(JSON.stringify(n),i.s,i.f)}},function(){location.href=e}):clouda.RUNTIME===clouda.RUNTIMES.LIGHTSDK?void clouda.lightsdk(function(o){return o.isLogin?void(location.href=e):void clouda.lightsdk(function(){location.href=e},function(){},"device.account","login",{})},function(){location.href=e},"device.account","isLogin",{}):void(location.href=e)}if(!Boolean(o.force_h5)&&clouda.RUNTIME===clouda.RUNTIMES.KUANG&&BLightApp&&"function"==typeof BLightApp.login){var t=clouda.lib.utils.regcallback(o.onsuccess,o.onfail);BLightApp.login(JSON.stringify(n),t.s,t.f)}else clouda.RUNTIME===clouda.RUNTIMES.LIGHTSDK?clouda.lightsdk(function(o){return o.isLogin?void i():void clouda.lightsdk(function(){i()},function(){},"device.account","login",{})},function(){location.href=e},"device.account","isLogin",{}):i()},n.closeLoginDialog=function(){a&&document.body.contains(a)&&document.body.removeChild(a)},n.bdLogin=function(o){if(r({api:"account.bdLogin"}),!clouda.STATUS.SUCCESS)return void t("clouda.mbaas.account.bdLogin",arguments);if(!o.onsuccess||!o.onfail||"function"!=typeof o.onsuccess||"function"!=typeof o.onfail||!o.tpl)return i.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,o),!1;var n={};if(n.u=o.u?encodeURIComponent(o.u):"",n.uid=o.uid||"",n.regtype=o.regtype||"",n.from=o.from||"",n.bd_page_type=o.bd_page_type||"",n.pu=o.pu||"",n.tn=o.tn||"",n.tpl=o.tpl,n.login_type=o.login_type||"",n.mobile=o.mobile||"",n.sms="sms"==n.login_type?1:0,clouda.RUNTIME===clouda.RUNTIMES.KUANG&&BLightApp&&"function"==typeof BLightApp.bdLogin){var e=clouda.lib.utils.regcallback(o.onsuccess,o.onfail);return void BLightApp.bdLogin(JSON.stringify(n),e.s,e.f)}if(clouda.RUNTIME===clouda.RUNTIMES.LIGHTSDK)return void clouda.lightsdk(o.onsuccess,o.onfail,"device.account","login",{});if("undefined"!=typeof uix_bridge){var e=clouda.lib.utils.regcallback(o.onsuccess,o.onfail);return void uix_bridge.bdLogin(JSON.stringify(o),e.s,e.f)}var l="http://wappass.baidu.com/passport/",a=l+"?login&smsLoginLink=1&sms="+n.sms+"&adapter=2&u="+n.u+"&uid="+n.uid+"&pu="+n.pu+"&regtype="+n.regtype+"&from="+n.from+"&bd_page_type="+n.bd_page_type+"&tn="+n.tn+"&tpl="+n.tpl;if(o.extra_params){var c=o.extra_params;for(var d in c)c.hasOwnProperty(d)&&(a=a+"&"+d+"="+c[d])}return void(1==o.noReplace?location.href=a:location.replace(a))},n.checkSupport=function(o){var i={};clouda.RUNTIME===clouda.RUNTIMES.NUWA?i["native"]=0:clouda.RUNTIME===clouda.RUNTIMES.KUANG?i["native"]=BLightApp&&"function"==typeof BLightApp.login?1:0:clouda.RUNTIME===clouda.RUNTIMES.WEB&&(i["native"]=0),i.web=1,o(i)}});
;clouda.define("mbaas/pay",function(){var o=clouda.lightapp,a=clouda.mbaas.pay={},i=(clouda.mbaas||{},clouda.DelegateClass),r=clouda.kuangForReady,n=(clouda.runtimeError,clouda.installPlugin,clouda.cloudaBLight),d=(new i("lightpay","init"),new i("lightpay","dopay"),["lecai.com","cloudaapi.duapp.com"]),e=clouda.lib.utils.stat;a.init=function(a,i){if(e({api:"pay.init"}),!a)return o.error(ErrCode.UNKNOW_INPUT,ErrCode.UNKNOW_INPUT,i),!1;if("number"==typeof a&&(a=String(a)),!clouda.STATUS.SUCCESS)return void r("clouda.mbaas.pay.init",arguments);if(clouda.RUNTIME===clouda.RUNTIMES.KUANG&&BLightApp&&"function"==typeof BLightApp.initpay){var n=clouda.lib.utils.regcallback(function(){i.onsuccess(clouda.STATUS.SUCCESS)},i.onfail);return BLightApp.initpay(n.s,n.f,a),!1}clouda.RUNTIME===clouda.RUNTIMES.NUWA},a.doPay=function(a){if(e({api:"pay.doPay"}),a.hideLoading||(a.hideLoading=!1),a.orderInfo||o.error(ErrCode.PAY_ERROR,ErrCode.UNKNOW_INPUT,a),clouda.PLATFORM===clouda.PLATFORMS.IOS&&clouda.RUNTIME_VERSION>="6.7"&&clouda.RUNTIME_VERSION<"6.8"&&navigator.userAgent.match(/baiduboxapp/i)){var i=clouda.lib.utils.regcallback(a.onsuccess,a.onfail);return location.href="baiduboxapp://dopay?action=dopay&hideLoadingDialog="+(a.hideLoading?1:0)+"&successcallback="+encodeURIComponent(i.s)+"&failcallback="+encodeURIComponent(i.f)+"&orderinfo="+a.orderInfo+"&minver=5.3.0.0",!1}if(!clouda.STATUS.SUCCESS)return void r("clouda.mbaas.pay.doPay",arguments);if(clouda.RUNTIME===clouda.RUNTIMES.KUANG&&BLightApp&&"function"==typeof BLightApp.dopay){var i=clouda.lib.utils.regcallback(a.onsuccess,a.onfail);if(clouda.PLATFORM===clouda.PLATFORMS.IOS){for(var n=a.safari?!0:!1,c=0,u=d.length;u>c;c++)if(-1!==location.origin.indexOf(d[c])){n=!0;break}if(n){if(clouda.RUNTIME_VERSION>"5.3.5"){var t={ExternalURL:"http://baifubao.baidu.com/jump?uri=/api/0/pay/0/wapdirect/0&"+a.orderInfo};BLightApp.dopay(i.s,i.f,a.orderInfo,a.hideLoading,JSON.stringify(t))}else BLightApp.dopay(i.s,i.f,a.orderInfo,a.hideLoading);return}}return BLightApp.dopay(i.s,i.f,a.orderInfo,a.hideLoading),!1}return clouda.RUNTIME===clouda.RUNTIMES.LIGHTSDK?void clouda.lightsdk(function(o){a.onsuccess(o.replace(/;$/,""))},function(o){a.onfail(o.error_info.replace(/;$/,""))},"device.pay","dopay",a):1==a.noLogin?(location.href="http://baifubao.baidu.com/jump?uri=/api/0/pay/0/wapdirect&"+a.orderInfo,!1):1==a.coin_trans_type?(location.href="http://baifubao.baidu.com/jump?uri=/api/0/pay/0/waptransfer/0?"+a.orderInfo,!1):(location.href="http://baifubao.baidu.com/jump?uri=/api/0/pay/0/wap/0/cashdesk/0&"+a.orderInfo,!1)},a.doPolymerPay=function(o){var a=o.sdk_orderInfo||o.orderInfo,i=(o.h5_orderInfo||o.orderInfo,function(o){for(var a,i,r={},n=o.split("&"),d=0,e=n.length;e>d;d++)tmp=n[d].split("="),a=tmp[0],i=tmp[1],a&&(r[a]=decodeURIComponent(i));return r});if(clouda.RUNTIME===clouda.RUNTIMES.KUANG&&"function"==typeof BLightApp.doPolymerPay){var r=i(a);return void n("doPolymerPay",JSON.stringify(r),o.onsuccess,o.onfail)}var d="https://zhifu.baidu.com/proxy/req/newcashier?";return void(location.href=d+o.h5_orderInfo)},a.checkSupport=function(o){var a={};clouda.RUNTIME===clouda.RUNTIMES.NUWA?a["native"]=1:clouda.RUNTIME===clouda.RUNTIMES.KUANG?a["native"]=BLightApp&&"function"==typeof BLightApp.dopay?1:0:clouda.RUNTIME===clouda.RUNTIMES.WEB&&(a["native"]=0),a.web=1,o(a)}});