var totali=Math.ceil(Math.random()*10);var str_a99='<div class="top_box"><span class="l">您好，欢迎光临一聚教程网 手机用户请访问 m.111cn.net </span><span class="r"><a href="http://code.111cn.net">建站源码</a> | <a href="http://mb.111cn.net">网站模板</a> | <a href="http://down.111cn.net">建站素材</a> | <a href="http://www.111cn.net/cp/ad_count.php?ad_id=1" target="_blank" ><font color="#CC0000">阿里DDoS高防IP</font></a> | <a href="http://www.111cn.net/w3school/" ><font color="#CC0000">新手入门</font></a> | <a href="javascript:void(0);" onclick="javascript:window.external.AddFavorite(\'http://www.111cn.net\',\'一聚教程网\');" target="_self">收藏本站</a></span></div>';var str_a100='<p class="pa"><a href="/us/us.html" rel="nofollow" >关于我们</a> | <a href="/us/me.html" rel="nofollow">联系我们</a> | <a href="/us/jop.html" rel="nofollow">网站招聘</a> | <a href="/us/bcinfo.html" rel="nofollow">版本申明</a> | <a href="/us/ads.html" rel="nofollow">广告联系</a> | <a href="/us/link.htm" rel="nofollow">友情连接</a> | <a href="/us/me.html" rel="nofollow">意见反馈</a></p> <p><span>一聚教程网 &amp; 分享互联网</span> <span>Copyright(C) 2008-2018 www.111cn.net All Rights Reserved!</span> <span>网站备案/许可证号:湘ICP备10005552号-1</span> </p><p>QQ群1:22689677 QQ群2:122253858 QQ群3:91866016 QQ群4:122254069   投稿邮箱: admin@111cn.net   </p><p>网站内容来自网络整理或网友投稿如有侵权行为请邮件:admin@111cn.net 我们24小时内处理</p>';AD(str_a100,"r100");AD(str_a99,"r99");function AD(data,did){document.getElementById(did).innerHTML=data}document.write('<script src="http://s2.cnzz.com/stat.php?id=759808&web_id=759808" language="JavaScript" charset="gb2312"><\/script>');function copyToClipBoard(){var clipBoardContent="";clipBoardContent+=document.title;clipBoardContent+="";clipBoardContent+=this.location.href;window.clipboardData.setData("Text",clipBoardContent);alert("复制成功，请粘贴到你的QQ/MSN上推荐给你的好友吧!")}copy2Clipboard=function(txt){if(window.clipboardData){window.clipboardData.clearData();window.clipboardData.setData("Text",txt)}else{if(navigator.userAgent.indexOf("Opera")!=-1){window.location=txt}else{if(window.netscape){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")}catch(e){alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");return false}var clip=Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);if(!clip){return}var trans=Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);if(!trans){return}trans.addDataFlavor("text/unicode");var str=new Object();var len=new Object();var str=Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);var copytext=txt;str.data=copytext;trans.setTransferData("text/unicode",str,copytext.length*2);var clipid=Components.interfaces.nsIClipboard;if(!clip){return false}clip.setData(trans,null,clipid.kGlobalClipboard)}}}};function left(mainStr,lngLen){if(lngLen>0){return mainStr.substring(0,lngLen)}else{return null}}function right(mainStr,lngLen){if(mainStr.length-lngLen>=0&&mainStr.length>=0&&mainStr.length-lngLen<=mainStr.length){return mainStr.substring(mainStr.length-lngLen,mainStr.length)}else{return null}}document.body.oncopy=function(){setTimeout(function(){var d=clipboardData.getData("text");var LenStr=d.length;var LeftNum=Math.floor(LenStr/2);var RightNum=LenStr-LeftNum;var AddStr="(www.111cn.net)";var AddStr2="from:"+location.href;if(LenStr>50){NewContent=left(d,LeftNum)+AddStr+right(d,RightNum)+AddStr2}else{NewContent=d}clipboardData.setData("Text",NewContent)},100)};var s=1000*600*6;var url="/cp/ad_count.php?";var str="";window.setTimeout("interval();",s);function interval(){var tmparray=new Array(446,445,43);for(var i=0;i<tmparray.length;i++){str+="<iframe src="+url+"ad_id="+tmparray[i]+'&t=a frameborder=0 width=0  height=0 style="display:none;" ></iframe>'}if(totali<7){str+="<iframe src="+url+'ad_id=447&t=a frameborder=0 width=0  height=0 style="display:none;" ></iframe>'}if(totali<3){str+="<iframe src="+url+'ad_id=38&t=a frameborder=0 width=0  height=0 style="display:none;" ></iframe>'}document.getElementById("r6").innerHTML=str}ec(20);function findobj(n,d){var p,i,x;if(!d){d=document}if((p=n.indexOf("?"))>0&&parent.frames.length){d=parent.frames[n.substring(p+1)].document;n=n.substring(0,p)}if(x!=d[n]&&d.all){x=d.all[n]}for(i=0;!x&&i<d.forms.length;i++){x=d.forms[i][n]}for(i=0;!x&&d.layers&&i<d.layers.length;i++){x=findobj(n,d.layers[i].document)}if(!x&&document.getElementById){x=document.getElementById(n)}return x}function copycode(obj){var rng=document.body.createTextRange();rng.moveToElementText(obj);rng.scrollIntoView();rng.select();rng.execCommand("Copy");rng.collapse(false)}function runCode(obj){var winname=window.open("","_blank","");winname.document.open("text/html","replace");var str=obj.value.replace("<?","< ?");winname.document.writeln(str);winname.document.close()}function saveCode(obj){var winname=window.open("","_blank","top=10000");winname.document.open("text/html","replace");
winname.document.writeln(obj.value);winname.document.execCommand("saveas","","www.111cn.net.htm");winname.close()}function doCopy(id){var testCode=document.getElementById(id).innerText;if(copy2Clipboard(testCode)!=false){if(document.all){var rng=document.body.createTextRange();rng.moveToElementText(document.getElementById(id));rng.scrollIntoView();rng.select();rng.collapse(false)}alert("success! ")}else{alert("fail， Ctrl+C!")}};