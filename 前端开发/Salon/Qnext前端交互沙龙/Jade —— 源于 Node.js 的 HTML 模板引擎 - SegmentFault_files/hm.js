(function(){var h={},mt={},c={id:"e23800c454aa573c0ccb16b52665ac26",dm:["segmentfault.com"],js:"tongji.baidu.com/hm-web/js/",etrk:[{id:"sfLogin",eventType:"onclick"}],icon:'',ctrk:true,align:1,nv:-1,vdur:1800000,age:31536000000,rec:0,rp:[],trust:0,vcard:0,qiao:0,lxb:0,conv:0,comm:0,apps:''};var p=!0,q=null,r=!1;mt.i={};mt.i.Fa=/msie (\d+\.\d+)/i.test(navigator.userAgent);mt.i.cookieEnabled=navigator.cookieEnabled;mt.i.javaEnabled=navigator.javaEnabled();mt.i.language=navigator.language||navigator.browserLanguage||navigator.systemLanguage||navigator.userLanguage||"";mt.i.Ha=(window.screen.width||0)+"x"+(window.screen.height||0);mt.i.colorDepth=window.screen.colorDepth||0;mt.cookie={};
mt.cookie.set=function(a,b,e){var d;e.H&&(d=new Date,d.setTime(d.getTime()+e.H));document.cookie=a+"="+b+(e.domain?"; domain="+e.domain:"")+(e.path?"; path="+e.path:"")+(d?"; expires="+d.toGMTString():"")+(e.Ta?"; secure":"")};mt.cookie.get=function(a){return(a=RegExp("(^| )"+a+"=([^;]*)(;|$)").exec(document.cookie))?a[2]:q};mt.o={};mt.o.Q=function(a){return document.getElementById(a)};mt.o.ra=function(a){var b;for(b="A";(a=a.parentNode)&&1==a.nodeType;)if(a.tagName==b)return a;return q};
(mt.o.W=function(){function a(){if(!a.A){a.A=p;for(var b=0,f=d.length;b<f;b++)d[b]()}}function b(){try{document.documentElement.doScroll("left")}catch(d){setTimeout(b,1);return}a()}var e=r,d=[],f;document.addEventListener?f=function(){document.removeEventListener("DOMContentLoaded",f,r);a()}:document.attachEvent&&(f=function(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",f),a())});(function(){if(!e)if(e=p,"complete"===document.readyState)a.A=p;else if(document.addEventListener)document.addEventListener("DOMContentLoaded",
f,r),window.addEventListener("load",a,r);else if(document.attachEvent){document.attachEvent("onreadystatechange",f);window.attachEvent("onload",a);var d=r;try{d=window.frameElement==q}catch(l){}document.documentElement.doScroll&&d&&b()}})();return function(b){a.A?b():d.push(b)}}()).A=r;mt.event={};mt.event.c=function(a,b,e){a.attachEvent?a.attachEvent("on"+b,function(d){e.call(a,d)}):a.addEventListener&&a.addEventListener(b,e,r)};
mt.event.preventDefault=function(a){a.preventDefault?a.preventDefault():a.returnValue=r};mt.m={};mt.m.parse=function(){return(new Function('return (" + source + ")'))()};
mt.m.stringify=function(){function a(a){/["\\\x00-\x1f]/.test(a)&&(a=a.replace(/["\\\x00-\x1f]/g,function(a){var d=e[a];if(d)return d;d=a.charCodeAt();return"\\u00"+Math.floor(d/16).toString(16)+(d%16).toString(16)}));return'"'+a+'"'}function b(a){return 10>a?"0"+a:a}var e={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};return function(d){switch(typeof d){case "undefined":return"undefined";case "number":return isFinite(d)?String(d):"null";case "string":return a(d);case "boolean":return String(d);
default:if(d===q)return"null";if(d instanceof Array){var f=["["],e=d.length,l,g,k;for(g=0;g<e;g++)switch(k=d[g],typeof k){case "undefined":case "function":case "unknown":break;default:l&&f.push(","),f.push(mt.m.stringify(k)),l=1}f.push("]");return f.join("")}if(d instanceof Date)return'"'+d.getFullYear()+"-"+b(d.getMonth()+1)+"-"+b(d.getDate())+"T"+b(d.getHours())+":"+b(d.getMinutes())+":"+b(d.getSeconds())+'"';l=["{"];g=mt.m.stringify;for(e in d)if(Object.prototype.hasOwnProperty.call(d,e))switch(k=
d[e],typeof k){case "undefined":case "unknown":case "function":break;default:f&&l.push(","),f=1,l.push(g(e)+":"+g(k))}l.push("}");return l.join("")}}}();mt.lang={};mt.lang.e=function(a,b){return"[object "+b+"]"==={}.toString.call(a)};mt.lang.Qa=function(a){return mt.lang.e(a,"Number")&&isFinite(a)};mt.lang.Sa=function(a){return mt.lang.e(a,"String")};mt.localStorage={};
mt.localStorage.F=function(){if(!mt.localStorage.f)try{mt.localStorage.f=document.createElement("input"),mt.localStorage.f.type="hidden",mt.localStorage.f.style.display="none",mt.localStorage.f.addBehavior("#default#userData"),document.getElementsByTagName("head")[0].appendChild(mt.localStorage.f)}catch(a){return r}return p};
mt.localStorage.set=function(a,b,e){var d=new Date;d.setTime(d.getTime()+e||31536E6);try{window.localStorage?(b=d.getTime()+"|"+b,window.localStorage.setItem(a,b)):mt.localStorage.F()&&(mt.localStorage.f.expires=d.toUTCString(),mt.localStorage.f.load(document.location.hostname),mt.localStorage.f.setAttribute(a,b),mt.localStorage.f.save(document.location.hostname))}catch(f){}};
mt.localStorage.get=function(a){if(window.localStorage){if(a=window.localStorage.getItem(a)){var b=a.indexOf("|"),e=a.substring(0,b)-0;if(e&&e>(new Date).getTime())return a.substring(b+1)}}else if(mt.localStorage.F())try{return mt.localStorage.f.load(document.location.hostname),mt.localStorage.f.getAttribute(a)}catch(d){}return q};
mt.localStorage.remove=function(a){if(window.localStorage)window.localStorage.removeItem(a);else if(mt.localStorage.F())try{mt.localStorage.f.load(document.location.hostname),mt.localStorage.f.removeAttribute(a),mt.localStorage.f.save(document.location.hostname)}catch(b){}};mt.sessionStorage={};mt.sessionStorage.set=function(a,b){if(window.sessionStorage)try{window.sessionStorage.setItem(a,b)}catch(e){}};
mt.sessionStorage.get=function(a){return window.sessionStorage?window.sessionStorage.getItem(a):q};mt.sessionStorage.remove=function(a){window.sessionStorage&&window.sessionStorage.removeItem(a)};mt.Y={};mt.Y.log=function(a,b){var e=new Image,d="mini_tangram_log_"+Math.floor(2147483648*Math.random()).toString(36);window[d]=e;e.onload=e.onerror=e.onabort=function(){e.onload=e.onerror=e.onabort=q;e=window[d]=q;b&&b(a)};e.src=a};mt.D={};
mt.D.xa=function(){var a="";if(navigator.plugins&&navigator.mimeTypes.length){var b=navigator.plugins["Shockwave Flash"];b&&b.description&&(a=b.description.replace(/^.*\s+(\S+)\s+\S+$/,"$1"))}else if(window.ActiveXObject)try{if(b=new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))(a=b.GetVariable("$version"))&&(a=a.replace(/^.*\s+(\d+),(\d+).*$/,"$1.$2"))}catch(e){}return a};
mt.D.ka=function(a,b,e,d,f){return'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="'+a+'" width="'+e+'" height="'+d+'"><param name="movie" value="'+b+'" /><param name="flashvars" value="'+(f||"")+'" /><param name="allowscriptaccess" value="always" /><embed type="application/x-shockwave-flash" name="'+a+'" width="'+e+'" height="'+d+'" src="'+b+'" flashvars="'+(f||"")+'" allowscriptaccess="always" /></object>'};mt.url={};
mt.url.l=function(a,b){var e=a.match(RegExp("(^|&|\\?|#)("+b+")=([^&#]*)(&|$|#)",""));return e?e[3]:q};mt.url.Pa=function(a){return(a=a.match(/^(https?:)\/\//))?a[1]:q};mt.url.ua=function(a){return(a=a.match(/^(https?:\/\/)?([^\/\?#]*)/))?a[2].replace(/.*@/,""):q};mt.url.S=function(a){return(a=mt.url.ua(a))?a.replace(/:\d+$/,""):a};mt.url.Oa=function(a){return(a=a.match(/^(https?:\/\/)?[^\/]*(.*)/))?a[2].replace(/[\?#].*/,"").replace(/^$/,"/"):q};
h.h={Da:"http://tongji.baidu.com/hm-web/welcome/ico",M:"hm.baidu.com/hm.gif",ca:"baidu.com",Aa:"hmmd",Ba:"hmpl",za:"hmkw",ya:"hmci",Ca:"hmsr",q:0,j:Math.round(+new Date/1E3),protocol:"https:"==document.location.protocol?"https:":"http:",Ra:0,ha:6E5,ia:10,O:1024,ga:1,r:2147483647,Z:"cc cf ci ck cl cm cp cw ds ep et fl ja ln lo lt nv rnd si st su v cv lv api tt u".split(" ")};
(function(){var a={p:{},c:function(a,e){this.p[a]=this.p[a]||[];this.p[a].push(e)},w:function(a,e){this.p[a]=this.p[a]||[];for(var d=this.p[a].length,f=0;f<d;f++)this.p[a][f](e)}};return h.k=a})();
(function(){function a(a,d){var f=document.createElement("script");f.charset="utf-8";b.e(d,"Function")&&(f.readyState?f.onreadystatechange=function(){if("loaded"===f.readyState||"complete"===f.readyState)f.onreadystatechange=q,d()}:f.onload=function(){d()});f.src=a;var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(f,n)}var b=mt.lang;return h.load=a})();
(function(){function a(){var a="";h.b.a.nv?(a=encodeURIComponent(document.referrer),window.sessionStorage?e.set("Hm_from_"+c.id,a):b.set("Hm_from_"+c.id,a,864E5)):a=(window.sessionStorage?e.get("Hm_from_"+c.id):b.get("Hm_from_"+c.id))||"";return a}var b=mt.localStorage,e=mt.sessionStorage;return h.P=a})();
(function(){var a=h.h,b=mt.D,e={init:function(){if(""!==c.icon){var d;d=c.icon.split("|");var f=a.Da+"?s="+c.id,e=("http:"==a.protocol?"http://eiv":"https://bs")+".baidu.com"+d[0]+"."+d[1];switch(d[1]){case "swf":d=b.ka("HolmesIcon"+a.j,e,d[2],d[3],"s="+f);break;case "gif":d='<a href="'+f+'" target="_blank"><img border="0" src="'+e+'" width="'+d[2]+'" height="'+d[3]+'"></a>';break;default:d='<a href="'+f+'" target="_blank">'+d[0]+"</a>"}document.write(d)}}};h.k.c("pv-b",e.init);return e})();
(function(){var a=mt.o,b=mt.event,e={aa:function(){b.c(document,"click",e.ma());for(var d=c.etrk.length,f=0;f<d;f++){var n=c.etrk[f],l=a.Q(decodeURIComponent(n.id));l&&b.c(l,n.eventType,e.na())}},na:function(){return function(a){(a.target||a.srcElement).setAttribute("HM_fix",a.clientX+":"+a.clientY);h.b.a.et=1;h.b.a.ep="{id:"+this.id+",eventType:"+a.type+"}";h.b.g()}},ma:function(){return function(a){var b=a.target||a.srcElement;if(b){var e=b.getAttribute("HM_fix"),l=a.clientX+":"+a.clientY;if(e&&
e==l)b.removeAttribute("HM_fix");else if(e=c.etrk.length,0<e){for(l={};b&&b!=document.body;)b.id&&(l[b.id]=""),b=b.parentNode;for(b=0;b<e;b++){var g=decodeURIComponent(c.etrk[b].id);l.hasOwnProperty(g)&&(h.b.a.et=1,h.b.a.ep="{id:"+g+",eventType:"+a.type+"}",h.b.g())}}}}}};h.k.c("pv-b",e.aa);return e})();
(function(){var a=mt.o,b=mt.event,e=mt.i,d=h.h,f=[],n={$:function(){c.ctrk&&(b.c(document,"mouseup",n.fa()),b.c(window,"unload",function(){n.B()}),setInterval(function(){n.B()},d.ha))},fa:function(){return function(a){a=n.sa(a);if(""!==a){var b=(d.protocol+"//"+d.M+"?"+h.b.X().replace(/ep=[^&]*/,"ep="+encodeURIComponent("["+a+"]"))).length;b+(d.r+"").length>d.O||(b+encodeURIComponent(f.join(",")+(f.length?",":"")).length+(d.r+"").length>d.O&&n.B(),f.push(a),(f.length>=d.ia||/t:a/.test(a))&&n.B())}}},
sa:function(b){if(0===d.ga){var f=b.target||b.srcElement,k=f.tagName.toLowerCase();if("embed"==k||"object"==k)return""}e.Fa?(f=Math.max(document.documentElement.scrollTop,document.body.scrollTop),k=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft),k=b.clientX+k,f=b.clientY+f):(k=b.pageX,f=b.pageY);var m=window.innerWidth||document.documentElement.clientWidth||document.body.offsetWidth;switch(c.align){case 1:k-=m/2;break;case 2:k-=m}k="{x:"+k+",y:"+f+",";f=b.target||b.srcElement;
return k=(b="a"==f.tagName.toLowerCase()?f:a.ra(f))?k+("t:a,u:"+encodeURIComponent(b.href)+"}"):k+"t:b}"},B:function(){0!==f.length&&(h.b.a.et=2,h.b.a.ep="["+f.join(",")+"]",h.b.g(),f=[])}};h.k.c("pv-b",n.$);return n})();
(function(){var a=mt.o,b=h.h,e=h.load,d=h.P;h.k.c("pv-b",function(){c.rec&&a.W(function(){for(var f=0,n=c.rp.length;f<n;f++){var l=c.rp[f][0],g=c.rp[f][1],k=a.Q("hm_t_"+l);if(g&&!(2==g&&!k||k&&""!==k.innerHTML))k="",k=Math.round(Math.random()*b.r),k=4==g?"http://crs.baidu.com/hl.js?"+["siteId="+c.id,"planId="+l,"rnd="+k].join("&"):"http://crs.baidu.com/t.js?"+["siteId="+c.id,"planId="+l,"from="+d(),"referer="+encodeURIComponent(document.referrer),"title="+encodeURIComponent(document.title),"rnd="+
k].join("&"),e(k)}})})})();(function(){var a=h.h,b=h.load,e=h.P;h.k.c("pv-b",function(){if(c.trust&&c.vcard){var d=a.protocol+"//trust.baidu.com/vcard/v.js?"+["siteid="+c.vcard,"url="+encodeURIComponent(document.location.href),"source="+e(),"rnd="+Math.round(Math.random()*a.r)].join("&");b(d)}})})();
(function(){function a(){return function(){h.b.a.nv=0;h.b.a.st=4;h.b.a.et=3;h.b.a.ep=h.G.va()+","+h.G.ta();h.b.g()}}function b(){clearTimeout(A);var a;y&&(a="visible"==document[y]);B&&(a=!document[B]);g="undefined"==typeof a?p:a;if((!l||!k)&&g&&m)u=p,t=+new Date;else if(l&&k&&(!g||!m))u=r,s+=+new Date-t;l=g;k=m;A=setTimeout(b,100)}function e(a){var k=document,b="";if(a in k)b=a;else for(var t=["webkit","ms","moz","o"],d=0;d<t.length;d++){var s=t[d]+a.charAt(0).toUpperCase()+a.slice(1);if(s in k){b=
s;break}}return b}function d(a){if(!("focus"==a.type||"blur"==a.type)||!(a.target&&a.target!=window))m="focus"==a.type||"focusin"==a.type?p:r,b()}var f=mt.event,n=h.k,l=p,g=p,k=p,m=p,v=+new Date,t=v,s=0,u=p,y=e("visibilityState"),B=e("hidden"),A;b();(function(){var a=y.replace(/[vV]isibilityState/,"visibilitychange");f.c(document,a,b);f.c(window,"pageshow",b);f.c(window,"pagehide",b);"object"==typeof document.onfocusin?(f.c(document,"focusin",d),f.c(document,"focusout",d)):(f.c(window,"focus",d),
f.c(window,"blur",d))})();h.G={va:function(){return+new Date-v},ta:function(){return u?+new Date-t+s:s}};n.c("pv-b",function(){f.c(window,"unload",a())});return h.G})();
(function(){var a=mt.lang,b=h.h,e=h.load,d={Ea:function(d){if((void 0===window._dxt||a.e(window._dxt,"Array"))&&"undefined"!==typeof h.b){var n=h.b.I();e([b.protocol,"//datax.baidu.com/x.js?si=",c.id,"&dm=",encodeURIComponent(n)].join(""),d)}},Ma:function(b){if(a.e(b,"String")||a.e(b,"Number"))window._dxt=window._dxt||[],window._dxt.push(["_setUserId",b])}};return h.la=d})();
(function(){function a(k){for(var b in k)if({}.hasOwnProperty.call(k,b)){var d=k[b];e.e(d,"Object")||e.e(d,"Array")?a(d):k[b]=String(d)}}function b(a){return a.replace?a.replace(/'/g,"'0").replace(/\*/g,"'1").replace(/!/g,"'2"):a}var e=mt.lang,d=mt.m,f=h.h,n=h.k,l=h.la,g={T:q,s:[],C:0,U:r,init:function(){g.d=0;g.T={push:function(){g.L.apply(g,arguments)}};n.c("pv-b",function(){g.oa();g.pa()});n.c("pv-d",g.qa);n.c("stag-b",function(){h.b.a.api=g.d||g.C?g.d+"_"+g.C:""});n.c("stag-d",function(){h.b.a.api=
0;g.d=0;g.C=0})},oa:function(){var a=window._hmt;if(a&&a.length)for(var b=0;b<a.length;b++){var d=a[b];switch(d[0]){case "_setAccount":1<d.length&&/^[0-9a-z]{32}$/.test(d[1])&&(g.d|=1,window._bdhm_account=d[1]);break;case "_setAutoPageview":if(1<d.length&&(d=d[1],r===d||p===d))g.d|=2,window._bdhm_autoPageview=d}}},pa:function(){if("undefined"===typeof window._bdhm_account||window._bdhm_account===c.id){window._bdhm_account=c.id;var a=window._hmt;if(a&&a.length)for(var b=0,d=a.length;b<d;b++)e.e(a[b],
"Array")&&"_trackEvent"!==a[b][0]&&"_trackRTEvent"!==a[b][0]?g.L(a[b]):g.s.push(a[b]);window._hmt=g.T}},qa:function(){if(0<g.s.length)for(var a=0,b=g.s.length;a<b;a++)g.L(g.s[a]);g.s=q},L:function(a){if(e.e(a,"Array")){var b=a[0];if(g.hasOwnProperty(b)&&e.e(g[b],"Function"))g[b](a)}},_trackPageview:function(a){if(1<a.length&&a[1].charAt&&"/"==a[1].charAt(0)){g.d|=4;h.b.a.et=0;h.b.a.ep="";h.b.J?(h.b.a.nv=0,h.b.a.st=4):h.b.J=p;var b=h.b.a.u,d=h.b.a.su;h.b.a.u=f.protocol+"//"+document.location.host+
a[1];g.U||(h.b.a.su=document.location.href);h.b.g();h.b.a.u=b;h.b.a.su=d}},_trackEvent:function(a){2<a.length&&(g.d|=8,h.b.a.nv=0,h.b.a.st=4,h.b.a.et=4,h.b.a.ep=b(a[1])+"*"+b(a[2])+(a[3]?"*"+b(a[3]):"")+(a[4]?"*"+b(a[4]):""),h.b.g())},_setCustomVar:function(a){if(!(4>a.length)){var d=a[1],e=a[4]||3;if(0<d&&6>d&&0<e&&4>e){g.C++;for(var t=(h.b.a.cv||"*").split("!"),s=t.length;s<d-1;s++)t.push("*");t[d-1]=e+"*"+b(a[2])+"*"+b(a[3]);h.b.a.cv=t.join("!");a=h.b.a.cv.replace(/[^1](\*[^!]*){2}/g,"*").replace(/((^|!)\*)+$/g,
"");""!==a?h.b.setData("Hm_cv_"+c.id,encodeURIComponent(a),c.age):h.b.Ga("Hm_cv_"+c.id)}}},_setReferrerOverride:function(a){1<a.length&&(h.b.a.su=a[1].charAt&&"/"==a[1].charAt(0)?f.protocol+"//"+window.location.host+a[1]:a[1],g.U=p)},_trackOrder:function(b){b=b[1];e.e(b,"Object")&&(a(b),g.d|=16,h.b.a.nv=0,h.b.a.st=4,h.b.a.et=94,h.b.a.ep=d.stringify(b),h.b.g())},_trackMobConv:function(a){if(a={webim:1,tel:2,map:3,sms:4,callback:5,share:6}[a[1]])g.d|=32,h.b.a.et=93,h.b.a.ep=a,h.b.g()},_trackRTPageview:function(b){b=
b[1];e.e(b,"Object")&&(a(b),b=d.stringify(b),512>=encodeURIComponent(b).length&&(g.d|=64,h.b.a.rt=b))},_trackRTEvent:function(b){b=b[1];if(e.e(b,"Object")){a(b);b=encodeURIComponent(d.stringify(b));var m=function(a){var b=h.b.a.rt;g.d|=128;h.b.a.et=90;h.b.a.rt=a;h.b.g();h.b.a.rt=b},l=b.length;if(900>=l)m.call(this,b);else for(var l=Math.ceil(l/900),t="block|"+Math.round(Math.random()*f.r).toString(16)+"|"+l+"|",s=[],u=0;u<l;u++)s.push(u),s.push(b.substring(900*u,900*u+900)),m.call(this,t+s.join("|")),
s=[]}},_setUserId:function(a){a=a[1];l.Ea();l.Ma(a)}};g.init();h.da=g;return h.da})();
(function(){function a(){"undefined"==typeof window["_bdhm_loaded_"+c.id]&&(window["_bdhm_loaded_"+c.id]=p,this.a={},this.J=r,this.init())}var b=mt.url,e=mt.Y,d=mt.D,f=mt.lang,n=mt.cookie,l=mt.i,g=mt.localStorage,k=mt.sessionStorage,m=h.h,v=h.k;a.prototype={K:function(a,b){a="."+a.replace(/:\d+/,"");b="."+b.replace(/:\d+/,"");var d=a.indexOf(b);return-1<d&&d+b.length==a.length},V:function(a,b){a=a.replace(/^https?:\/\//,"");return 0===a.indexOf(b)},z:function(a){for(var d=0;d<c.dm.length;d++)if(-1<
c.dm[d].indexOf("/")){if(this.V(a,c.dm[d]))return p}else{var e=b.S(a);if(e&&this.K(e,c.dm[d]))return p}return r},I:function(){for(var a=document.location.hostname,b=0,d=c.dm.length;b<d;b++)if(this.K(a,c.dm[b]))return c.dm[b].replace(/(:\d+)?[\/\?#].*/,"");return a},R:function(){for(var a=0,b=c.dm.length;a<b;a++){var d=c.dm[a];if(-1<d.indexOf("/")&&this.V(document.location.href,d))return d.replace(/^[^\/]+(\/.*)/,"$1")+"/"}return"/"},wa:function(){if(!document.referrer)return m.j-m.q>c.vdur?1:4;var a=
r;this.z(document.referrer)&&this.z(document.location.href)?a=p:(a=b.S(document.referrer),a=this.K(a||"",document.location.hostname));return a?m.j-m.q>c.vdur?1:4:3},getData:function(a){try{return n.get(a)||k.get(a)||g.get(a)}catch(b){}},setData:function(a,b,d){try{n.set(a,b,{domain:this.I(),path:this.R(),H:d}),d?g.set(a,b,d):k.set(a,b)}catch(e){}},Ga:function(a){try{n.set(a,"",{domain:this.I(),path:this.R(),H:-1}),k.remove(a),g.remove(a)}catch(b){}},Ka:function(){var a,b,d,e,f;m.q=this.getData("Hm_lpvt_"+
c.id)||0;13==m.q.length&&(m.q=Math.round(m.q/1E3));b=this.wa();a=4!=b?1:0;if(d=this.getData("Hm_lvt_"+c.id)){e=d.split(",");for(f=e.length-1;0<=f;f--)13==e[f].length&&(e[f]=""+Math.round(e[f]/1E3));for(;2592E3<m.j-e[0];)e.shift();f=4>e.length?2:3;for(1===a&&e.push(m.j);4<e.length;)e.shift();d=e.join(",");e=e[e.length-1]}else d=m.j,e="",f=1;this.setData("Hm_lvt_"+c.id,d,c.age);this.setData("Hm_lpvt_"+c.id,m.j);d=m.j==this.getData("Hm_lpvt_"+c.id)?"1":"0";if(0===c.nv&&this.z(document.location.href)&&
(""===document.referrer||this.z(document.referrer)))a=0,b=4;this.a.nv=a;this.a.st=b;this.a.cc=d;this.a.lt=e;this.a.lv=f},X:function(){for(var a=[],b=0,d=m.Z.length;b<d;b++){var e=m.Z[b],f=this.a[e];"undefined"!=typeof f&&""!==f&&a.push(e+"="+encodeURIComponent(f))}b=this.a.et;this.a.rt&&(0===b?a.push("rt="+encodeURIComponent(this.a.rt)):90===b&&a.push("rt="+this.a.rt));return a.join("&")},La:function(){this.Ka();this.a.si=c.id;this.a.su=document.referrer;this.a.ds=l.Ha;this.a.cl=l.colorDepth+"-bit";
this.a.ln=l.language;this.a.ja=l.javaEnabled?1:0;this.a.ck=l.cookieEnabled?1:0;this.a.lo="number"==typeof _bdhm_top?1:0;this.a.fl=d.xa();this.a.v="1.1.2";this.a.cv=decodeURIComponent(this.getData("Hm_cv_"+c.id)||"");1==this.a.nv&&(this.a.tt=document.title||"");var a=document.location.href;this.a.cm=b.l(a,m.Aa)||"";this.a.cp=b.l(a,m.Ba)||"";this.a.cw=b.l(a,m.za)||"";this.a.ci=b.l(a,m.ya)||"";this.a.cf=b.l(a,m.Ca)||""},init:function(){try{this.La(),0===this.a.nv?this.Ja():this.N(".*"),h.b=this,this.ea(),
v.w("pv-b"),this.Ia()}catch(a){var b=[];b.push("si="+c.id);b.push("n="+encodeURIComponent(a.name));b.push("m="+encodeURIComponent(a.message));b.push("r="+encodeURIComponent(document.referrer));e.log(m.protocol+"//"+m.M+"?"+b.join("&"))}},Ia:function(){function a(){v.w("pv-d")}"undefined"===typeof window._bdhm_autoPageview||window._bdhm_autoPageview===p?(this.J=p,this.a.et=0,this.a.ep="",this.g(a)):a()},g:function(a){var b=this;b.a.rnd=Math.round(Math.random()*m.r);v.w("stag-b");var d=m.protocol+"//"+
m.M+"?"+b.X();v.w("stag-d");b.ba(d);e.log(d,function(d){b.N(d);f.e(a,"Function")&&a.call(b)})},ea:function(){var a=document.location.hash.substring(1),d=RegExp(c.id),e=-1<document.referrer.indexOf(m.ca)?p:r,f=b.l(a,"jn"),g=/^heatlink$|^select$/.test(f);a&&(d.test(a)&&e&&g)&&(a=document.createElement("script"),a.setAttribute("type","text/javascript"),a.setAttribute("charset","utf-8"),a.setAttribute("src",m.protocol+"//"+c.js+f+".js?"+this.a.rnd),f=document.getElementsByTagName("script")[0],f.parentNode.insertBefore(a,
f))},ba:function(a){var b=k.get("Hm_unsent_"+c.id)||"",d=this.a.u?"":"&u="+encodeURIComponent(document.location.href),b=encodeURIComponent(a.replace(/^https?:\/\//,"")+d)+(b?","+b:"");k.set("Hm_unsent_"+c.id,b)},N:function(a){var b=k.get("Hm_unsent_"+c.id)||"";b&&((b=b.replace(RegExp(encodeURIComponent(a.replace(/^https?:\/\//,"")).replace(/([\*\(\)])/g,"\\$1")+"(%26u%3D[^,]*)?,?","g"),"").replace(/,$/,""))?k.set("Hm_unsent_"+c.id,b):k.remove("Hm_unsent_"+c.id))},Ja:function(){var a=this,b=k.get("Hm_unsent_"+
c.id);if(b)for(var b=b.split(","),d=function(b){e.log(m.protocol+"//"+decodeURIComponent(b).replace(/^https?:\/\//,""),function(b){a.N(b)})},f=0,g=b.length;f<g;f++)d(b[f])}};return new a})();var w=h.h,x=h.load;if(c.apps){var z=[w.protocol,"//ers.baidu.com/app/s.js?"];z.push(c.apps);x(z.join(""))}var C=h.h,D=h.load;if(c.conv&&"http:"===C.protocol){var E=["http://page.baidu.com/conversion_js.php?sid="];E.push(c.conv);D(E.join(""))}var F=h.h,G=h.load;
c.lxb&&G([F.protocol,"//lxbjs.baidu.com/lxb.js?sid=",c.lxb].join(""));var H=h.load,I=h.h.protocol;if(c.qiao){for(var J=[I+"//goutong.baidu.com/site/"],K=c.id,L=5381,M=K.length,N=0;N<M;N++)L=(33*L+Number(K.charCodeAt(N)))%4294967296;2147483648<L&&(L-=2147483648);J.push(L%1E3+"/");J.push(c.id+"/b.js");J.push("?siteId="+c.qiao);H(J.join(""))}
(function(){var a=mt.o,b=mt.event,e=mt.url,d=mt.m;try{if(window.performance&&performance.timing&&"undefined"!==typeof h.b){var f=+new Date,n=function(a){var b=performance.timing,d=b[a+"Start"]?b[a+"Start"]:0;a=b[a+"End"]?b[a+"End"]:0;return{start:d,end:a,value:0<a-d?a-d:0}},l=q;a.W(function(){l=+new Date});var g=function(){var a,b,g;g=n("navigation");b=n("request");g={netAll:b.start-g.start,netDns:n("domainLookup").value,netTcp:n("connect").value,srv:n("response").start-b.start,dom:performance.timing.domInteractive-
performance.timing.fetchStart,loadEvent:n("loadEvent").end-g.start};a=document.referrer;var k=q;b=q;if("www.baidu.com"===(a.match(/^(http[s]?:\/\/)?([^\/]+)(.*)/)||[])[2])k=e.l(a,"qid"),b=e.l(a,"click_t");a=k;g.qid=a!=q?a:"";b!=q?(g.bdDom=l?l-b:0,g.bdRun=f-b,g.bdDef=n("navigation").start-b):(g.bdDom=0,g.bdRun=0,g.bdDef=0);h.b.a.et=87;h.b.a.ep=d.stringify(g);h.b.g()};b.c(window,"load",function(){setTimeout(g,500)})}}catch(k){}})();
(function(){var a=h.h,b={init:function(){try{if("http:"===a.protocol){var b=document.createElement("IFRAME");b.setAttribute("src","http://boscdn.bpc.baidu.com/v1/holmes-moplus/mp-cdn.html");b.style.display="none";b.style.width="1";b.style.height="1";b.Na="0";document.body.appendChild(b)}}catch(e){}}},e=navigator.userAgent.toLowerCase();-1<e.indexOf("android")&&-1===e.indexOf("micromessenger")&&b.init()})();
(function(){var a=mt.lang,b=mt.event,e=mt.m;if(c.comm&&"undefined"!==typeof h.b){var d=function(a){if(a.item){for(var b=a.length,d=Array(b);b--;)d[b]=a[b];return d}return[].slice.call(a)},f=/swt|zixun|call|chat|zoos|business|talk|kefu|openkf|online|\/LR\/Chatpre\.aspx/i,n={click:function(){for(var a=[],b=d(document.getElementsByTagName("a")),b=[].concat.apply(b,d(document.getElementsByTagName("area"))),b=[].concat.apply(b,d(document.getElementsByTagName("img"))),e=0,g=b.length;e<g;e++){var k=b[e],
l=k.getAttribute("onclick"),k=k.getAttribute("href");(f.test(l)||f.test(k))&&a.push(b[e])}return a}},l=function(a,b){for(var d in a)if(a.hasOwnProperty(d)&&b.call(a,d,a[d])===r)return r},g=function(b,d){var g={n:"swt",t:"clk"};g.v=b;if(d){var k=d.getAttribute("href"),l=d.getAttribute("onclick")?""+d.getAttribute("onclick"):q,m=d.getAttribute("id")||"";f.test(k)?(g.sn="mediate",g.snv=k):a.e(l,"String")&&f.test(l)&&(g.sn="wrap",g.snv=l);g.id=m}h.b.a.et=86;h.b.a.ep=e.stringify(g);h.b.g();for(g=+new Date;500>=
+new Date-g;);},k,m="/zoosnet"+(/\/$/.test("/zoosnet")?"":"/"),v=function(b,d){if(k===d)return g(m+b,d),r;if(a.e(d,"Array")||a.e(d,"NodeList"))for(var e=0,f=d.length;e<f;e++)if(k===d[e])return g(m+b+"/"+(e+1),d[e]),r};b.c(document,"click",function(b){b=b||window.event;k=b.target||b.srcElement;var d={};for(l(n,function(b,e){d[b]=a.e(e,"Function")?e():document.getElementById(e)});k&&k!==document&&l(d,v)!==r;)k=k.parentNode})}})();
(function(){var a=mt.event,b=mt.m;if(c.comm&&"undefined"!==typeof h.b){var e=+new Date,d={n:"anti",sb:0,kb:0,clk:0},f=function(){h.b.a.et=86;h.b.a.ep=b.stringify(d);h.b.g()};a.c(document,"click",function(){d.clk++});a.c(document,"keyup",function(){d.kb=1});a.c(window,"scroll",function(){d.sb++});a.c(window,"unload",function(){d.t=+new Date-e;f()});a.c(window,"load",function(){setTimeout(f,5E3)})}})();})();
