/*!* jQuery Form Plugin* version: 2.95 (30-JAN-2012)* @requires jQuery v1.3.2 or later** Examples and documentation at: http://malsup.com/jquery/form/* Dual licensed under the MIT and GPL licenses:*	http://www.opensource.org/licenses/mit-license.php*	http://www.gnu.org/licenses/gpl.html*/;(function($) {$.fn.ajaxSubmit = function(options) {if (!this.length) {log('ajaxSubmit: skipping submit process - no element selected');return this;}var method, action, url, $form = this;if (typeof options == 'function') {options = { success: options };}method = this.attr('method');action = this.attr('action');url = (typeof action === 'string') ? $.trim(action) : '';url = url || window.location.href || '';if (url) {url = (url.match(/^([^#]+)/)||[])[1];}options = $.extend(true, {url:  url,success: $.ajaxSettings.success,type: method || 'GET',iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'}, options);var veto = {};this.trigger('form-pre-serialize', [this, options, veto]);if (veto.veto) {log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');return this;}if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {log('ajaxSubmit: submit aborted via beforeSerialize callback');return this;}var traditional = options.traditional;if ( traditional === undefined ) {traditional = $.ajaxSettings.traditional;}var qx,n,v,a = this.formToArray(options.semantic);if (options.data) {options.extraData = options.data;qx = $.param(options.data, traditional);}if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {log('ajaxSubmit: submit aborted via beforeSubmit callback');return this;}this.trigger('form-submit-validate', [a, this, options, veto]);if (veto.veto) {log('ajaxSubmit: submit vetoed via form-submit-validate trigger');return this;}var q = $.param(a, traditional);if (qx) {q = ( q ? (q + '&' + qx) : qx );}	if (options.type.toUpperCase() == 'GET') {options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;options.data = null;}else {options.data = q;}var callbacks = [];if (options.resetForm) {callbacks.push(function() { $form.resetForm(); });}if (options.clearForm) {callbacks.push(function() { $form.clearForm(options.includeHidden); });}if (!options.dataType && options.target) {var oldSuccess = options.success || function(){};callbacks.push(function(data) {var fn = options.replaceTarget ? 'replaceWith' : 'html';$(options.target)[fn](data).each(oldSuccess, arguments);});}else if (options.success) {callbacks.push(options.success);}options.success = function(data, status, xhr) { var context = options.context || options;for (var i=0, max=callbacks.length; i < max; i++) {callbacks[i].apply(context, [data, status, xhr || $form, $form]);}};var fileInputs = $('input:file:enabled[value]', this);var hasFileInputs = fileInputs.length > 0;var mp = 'multipart/form-data';var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);var fileAPI = !!(hasFileInputs && fileInputs.get(0).files && window.FormData);log("fileAPI :" + fileAPI);var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;if (options.iframe !== false && (options.iframe || shouldUseFrame)) {if (options.closeKeepAlive) {$.get(options.closeKeepAlive, function() {fileUploadIframe(a);});}else {fileUploadIframe(a);}}else if ((hasFileInputs || multipart) && fileAPI) {options.progress = options.progress || $.noop;fileUploadXhr(a);}else {$.ajax(options);}this.trigger('form-submit-notify', [this, options]);return this;function fileUploadXhr(a) {var formdata = new FormData();for (var i=0; i < a.length; i++) {if (a[i].type == 'file')continue;formdata.append(a[i].name, a[i].value);}$form.find('input:file:enabled').each(function(){var name = $(this).attr('name'), files = this.files;if (name) {for (var i=0; i < files.length; i++)formdata.append(name, files[i]);}});if (options.extraData) {for (var k in options.extraData)formdata.append(k, options.extraData[k])}options.data = null;var s = $.extend(true, {}, $.ajaxSettings, options, {contentType: false,processData: false,cache: false,type: 'POST'});s.data = null;var beforeSend = s.beforeSend;s.beforeSend = function(xhr, o) {o.data = formdata;if(xhr.upload) {xhr.upload.onprogress = function(event) {o.progress(event.position, event.total);};}if(beforeSend)beforeSend.call(o, xhr, options);};$.ajax(s);}function fileUploadIframe(a) {var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;var useProp = !!$.fn.prop;if (a) {if ( useProp ) {for (i=0; i < a.length; i++) {el = $(form[a[i].name]);el.prop('disabled', false);}} else {for (i=0; i < a.length; i++) {el = $(form[a[i].name]);el.removeAttr('disabled');}};}if ($(':input[name=submit],:input[id=submit]', form).length) {alert('Error: Form elements must not have name or id of "submit".');return;}s = $.extend(true, {}, $.ajaxSettings, options);s.context = s.context || s;id = 'jqFormIO' + (new Date().getTime());if (s.iframeTarget) {$io = $(s.iframeTarget);n = $io.attr('name');if (n == null)$io.attr('name', id);elseid = n;}else {$io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');$io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });}io = $io[0];xhr = {aborted: 0,responseText: null,responseXML: null,status: 0,statusText: 'n/a',getAllResponseHeaders: function() {},getResponseHeader: function() {},setRequestHeader: function() {},abort: function(status) {var e = (status === 'timeout' ? 'timeout' : 'aborted');log('aborting upload... ' + e);this.aborted = 1;$io.attr('src', s.iframeSrc);xhr.error = e;s.error && s.error.call(s.context, xhr, e, status);g && $.event.trigger("ajaxError", [xhr, s, e]);s.complete && s.complete.call(s.context, xhr, e);}};g = s.global;if (g && ! $.active++) {$.event.trigger("ajaxStart");}if (g) {$.event.trigger("ajaxSend", [xhr, s]);}if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {if (s.global) {$.active--;}return;}if (xhr.aborted) {return;}sub = form.clk;if (sub) {n = sub.name;if (n && !sub.disabled) {s.extraData = s.extraData || {};s.extraData[n] = sub.value;if (sub.type == "image") {s.extraData[n+'.x'] = form.clk_x;s.extraData[n+'.y'] = form.clk_y;}}}var CLIENT_TIMEOUT_ABORT = 1;var SERVER_ABORT = 2;function getDoc(frame) {var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;return doc;}var csrf_token = $('meta[name=csrf-token]').attr('content');var csrf_param = $('meta[name=csrf-param]').attr('content');if (csrf_param && csrf_token) {s.extraData = s.extraData || {};s.extraData[csrf_param] = csrf_token;}function doSubmit() {var t = $form.attr('target'), a = $form.attr('action');form.setAttribute('target',id);if (!method) {form.setAttribute('method', 'POST');}if (a != s.url) {form.setAttribute('action', s.url);}if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {$form.attr({encoding: 'multipart/form-data',enctype:  'multipart/form-data'});}if (s.timeout) {timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);}function checkState() {try {var state = getDoc(io).readyState;log('state = ' + state);if (state.toLowerCase() == 'uninitialized')setTimeout(checkState,50);}catch(e) {log('Server abort: ' , e, ' (', e.name, ')');cb(SERVER_ABORT);timeoutHandle && clearTimeout(timeoutHandle);timeoutHandle = undefined;}}var extraInputs = [];try {if (s.extraData) {for (var n in s.extraData) {extraInputs.push($('<input type="hidden" name="'+n+'">').attr('value',s.extraData[n]).appendTo(form)[0]);}}if (!s.iframeTarget) {$io.appendTo('body');io.attachEvent ? io.attachEvent('onload', cb) : io.addEventListener('load', cb, false);}setTimeout(checkState,15);form.submit();}finally {form.setAttribute('action',a);if(t) {form.setAttribute('target', t);} else {$form.removeAttr('target');}$(extraInputs).remove();}}if (s.forceSync) {doSubmit();}else {setTimeout(doSubmit, 10);}var data, doc, domCheckCount = 50, callbackProcessed;function cb(e) {if (xhr.aborted || callbackProcessed) {return;}try {doc = getDoc(io);}catch(ex) {log('cannot access response document: ', ex);e = SERVER_ABORT;}if (e === CLIENT_TIMEOUT_ABORT && xhr) {xhr.abort('timeout');return;}else if (e == SERVER_ABORT && xhr) {xhr.abort('server abort');return;}if (!doc || doc.location.href == s.iframeSrc) {if (!timedOut)return;}io.detachEvent ? io.detachEvent('onload', cb) : io.removeEventListener('load', cb, false);var status = 'success', errMsg;try {if (timedOut) {throw 'timeout';}var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);log('isXml='+isXml);if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == '')) {if (--domCheckCount) {log('requeing onLoad callback, DOM not available');setTimeout(cb, 250);return;}}var docRoot = doc.body ? doc.body : doc.documentElement;xhr.responseText = docRoot ? docRoot.innerHTML : null;xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;if (isXml)s.dataType = 'xml';xhr.getResponseHeader = function(header){var headers = {'content-type': s.dataType};return headers[header];};if (docRoot) {xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;}var dt = (s.dataType || '').toLowerCase();var scr = /(json|script|text)/.test(dt);if (scr || s.textarea) {var ta = doc.getElementsByTagName('textarea')[0];if (ta) {xhr.responseText = ta.value;xhr.status = Number( ta.getAttribute('status') ) || xhr.status;xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;}else if (scr) {var pre = doc.getElementsByTagName('pre')[0];var b = doc.getElementsByTagName('body')[0];if (pre) {xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;}else if (b) {xhr.responseText = b.textContent ? b.textContent : b.innerText;}}}else if (dt == 'xml' && !xhr.responseXML && xhr.responseText != null) {xhr.responseXML = toXml(xhr.responseText);}try {data = httpData(xhr, dt, s);}catch (e) {status = 'parsererror';xhr.error = errMsg = (e || status);}}catch (e) {log('error caught: ',e);status = 'error';xhr.error = errMsg = (e || status);}if (xhr.aborted) {log('upload aborted');status = null;}if (xhr.status) {status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';}if (status === 'success') {s.success && s.success.call(s.context, data, 'success', xhr);g && $.event.trigger("ajaxSuccess", [xhr, s]);}else if (status) {if (errMsg == undefined)errMsg = xhr.statusText;s.error && s.error.call(s.context, xhr, status, errMsg);g && $.event.trigger("ajaxError", [xhr, s, errMsg]);}g && $.event.trigger("ajaxComplete", [xhr, s]);if (g && ! --$.active) {$.event.trigger("ajaxStop");}s.complete && s.complete.call(s.context, xhr, status);callbackProcessed = true;if (s.timeout)clearTimeout(timeoutHandle);setTimeout(function() {if (!s.iframeTarget)$io.remove();xhr.responseXML = null;}, 100);}var toXml = $.parseXML || function(s, doc) {if (window.ActiveXObject) {doc = new ActiveXObject('Microsoft.XMLDOM');doc.async = 'false';doc.loadXML(s);}else {doc = (new DOMParser()).parseFromString(s, 'text/xml');}return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;};var parseJSON = $.parseJSON || function(s) {return window['eval']('(' + s + ')');};var httpData = function( xhr, type, s ) {var ct = xhr.getResponseHeader('content-type') || '',xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,data = xml ? xhr.responseXML : xhr.responseText;if (xml && data.documentElement.nodeName === 'parsererror') {$.error && $.error('parsererror');}if (s && s.dataFilter) {data = s.dataFilter(data, type);}if (typeof data === 'string') {if (type === 'json' || !type && ct.indexOf('json') >= 0) {data = parseJSON(data);} else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {$.globalEval(data);}}return data;};}};$.fn.ajaxForm = function(options) {if (this.length === 0) {var o = { s: this.selector, c: this.context };if (!$.isReady && o.s) {log('DOM not ready, queuing ajaxForm');$(function() {$(o.s,o.c).ajaxForm(options);});return this;}log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));return this;}return this.ajaxFormUnbind().bind('submit.form-plugin', function(e) {if (!e.isDefaultPrevented()) {e.preventDefault();$(this).ajaxSubmit(options);}}).bind('click.form-plugin', function(e) {var target = e.target;var $el = $(target);if (!($el.is(":submit,input:image"))) {var t = $el.closest(':submit');if (t.length == 0) {return;}target = t[0];}var form = this;form.clk = target;if (target.type == 'image') {if (e.offsetX != undefined) {form.clk_x = e.offsetX;form.clk_y = e.offsetY;} else if (typeof $.fn.offset == 'function') {var offset = $el.offset();form.clk_x = e.pageX - offset.left;form.clk_y = e.pageY - offset.top;} else {form.clk_x = e.pageX - target.offsetLeft;form.clk_y = e.pageY - target.offsetTop;}}setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);});};$.fn.ajaxFormUnbind = function() {return this.unbind('submit.form-plugin click.form-plugin');};$.fn.formToArray = function(semantic) {var a = [];if (this.length === 0) {return a;}var form = this[0];var els = semantic ? form.getElementsByTagName('*') : form.elements;if (!els) {return a;}var i,j,n,v,el,max,jmax;for(i=0, max=els.length; i < max; i++) {el = els[i];n = el.name;if (!n) {continue;}if (semantic && form.clk && el.type == "image") {if(!el.disabled && form.clk == el) {a.push({name: n, value: $(el).val(), type: el.type });a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});}continue;}v = $.fieldValue(el, true);if (v && v.constructor == Array) {for(j=0, jmax=v.length; j < jmax; j++) {a.push({name: n, value: v[j]});}}else if (v !== null && typeof v != 'undefined') {a.push({name: n, value: v, type: el.type});}}if (!semantic && form.clk) {var $input = $(form.clk), input = $input[0];n = input.name;if (n && !input.disabled && input.type == 'image') {a.push({name: n, value: $input.val()});a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});}}return a;};$.fn.formSerialize = function(semantic) {return $.param(this.formToArray(semantic));};$.fn.fieldSerialize = function(successful) {var a = [];this.each(function() {var n = this.name;if (!n) {return;}var v = $.fieldValue(this, successful);if (v && v.constructor == Array) {for (var i=0,max=v.length; i < max; i++) {a.push({name: n, value: v[i]});}}else if (v !== null && typeof v != 'undefined') {a.push({name: this.name, value: v});}});return $.param(a);};$.fn.fieldValue = function(successful) {for (var val=[], i=0, max=this.length; i < max; i++) {var el = this[i];var v = $.fieldValue(el, successful);if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {continue;}v.constructor == Array ? $.merge(val, v) : val.push(v);}return val;};$.fieldValue = function(el, successful) {var n = el.name, t = el.type, tag = el.tagName.toLowerCase();if (successful === undefined) {successful = true;}if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||(t == 'checkbox' || t == 'radio') && !el.checked ||(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||tag == 'select' && el.selectedIndex == -1)) {return null;}if (tag == 'select') {var index = el.selectedIndex;if (index < 0) {return null;}var a = [], ops = el.options;var one = (t == 'select-one');var max = (one ? index+1 : ops.length);for(var i=(one ? index : 0); i < max; i++) {var op = ops[i];if (op.selected) {var v = op.value;if (!v) {v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;}if (one) {return v;}a.push(v);}}return a;}return $(el).val();};$.fn.clearForm = function(includeHidden) {return this.each(function() {$('input,select,textarea', this).clearFields(includeHidden);});};$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function() {var t = this.type, tag = this.tagName.toLowerCase();if (re.test(t) || tag == 'textarea' || (includeHidden && /hidden/.test(t)) ) {this.value = '';}else if (t == 'checkbox' || t == 'radio') {this.checked = false;}else if (tag == 'select') {this.selectedIndex = -1;}});};$.fn.resetForm = function() {return this.each(function() {if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {this.reset();}});};$.fn.enable = function(b) {if (b === undefined) {b = true;}return this.each(function() {this.disabled = !b;});};$.fn.selected = function(select) {if (select === undefined) {select = true;}return this.each(function() {var t = this.type;if (t == 'checkbox' || t == 'radio') {this.checked = select;}else if (this.tagName.toLowerCase() == 'option') {var $sel = $(this).parent('select');if (select && $sel[0] && $sel[0].type == 'select-one') {$sel.find('option').selected(false);}this.selected = select;}});};$.fn.ajaxSubmit.debug = false;function log() {if (!$.fn.ajaxSubmit.debug) return;var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');if (window.console && window.console.log) {window.console.log(msg);}else if (window.opera && window.opera.postError) {window.opera.postError(msg);}};})(jQuery);

(function($){
	$.fn.preview = function(){
		var xOffset = 10;
		var yOffset = 20;
		var w = $(window).width();
		$(this).each(function(){
			$(this).hover(function(e){
				if(/.png$|.gif$|.jpg$|.bmp$/.test($(this).attr("src"))){
					$("body").append("<div id='preview'><div><img src='"+$(this).attr('src')+"' /><p>"+$(this).attr('alt')+"</p></div></div>");
				}else{
					$("body").append("<div id='preview'><div><p>"+$(this).attr('alt')+"</p></div></div>");
				}
				$("#preview").css({
					position:"absolute",
					padding:"4px",
					border:"1px solid #f3f3f3",
					backgroundColor:"#eeeeee",
					top:(e.pageY - yOffset) + "px",
					zIndex:1000
				});
				$("#preview > div").css({
					padding:"5px",
					backgroundColor:"white",
					border:"1px solid #cccccc"
				});
				$("#preview > div > p").css({
					textAlign:"center",
					fontSize:"12px",
					padding:"8px 0 3px",
					margin:"0"
				});
				if(e.pageX < w/2){
					$("#preview").css({
						left: e.pageX + xOffset + "px",
						right: "auto"
					}).fadeIn("fast");
				}else{
					$("#preview").css("right",(w - e.pageX + yOffset) + "px").css("left", "auto").fadeIn("fast");	
				}
			},function(){
				$("#preview").remove();
			}).mousemove(function(e){
				$("#preview").css("top",(e.pageY - xOffset) + "px")
				if(e.pageX < w/2){
					$("#preview").css("left",(e.pageX + yOffset) + "px").css("right","auto");
				}else{
					$("#preview").css("right",(w - e.pageX + yOffset) + "px").css("left","auto");
				}
			});						  
		});
	};
})(jQuery);

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

jQuery(function() {
	jQuery.fn.manhuaHtmlArea = function(options) {
		var defaults = {
			Event : "click",	//响应的事件
			Left : 0,			//表情层显示偏移元素左边的位置
			Top : 22,			//表情层显示偏移元素上边的位置
			id : "content"  	//内容插件表单的ID
		};
		var options = jQuery.extend(defaults,options);
		var bid = parseInt(Math.random()*100000);	
		jQuery("body").prepend("<div id='showAddFacePic"+bid+"'class='addons layer-emotions'><b class='tri-b'></b><b class='tri-t'></b><div class='layer-tab clearfix'><a id='close"+bid+"' class='close' href='javascript:void(0)'></a><span>常用表情</span></div><div class='layer-content'><ul id='emotions"+bid+"' class='emotions clearfix'><li><img src='/style/images/faces/smilea.gif' addFacesPic='[呵呵]' alt='呵呵' title='呵呵'/></li><li><img src='/style/images/faces/tootha.gif' addFacesPic='[嘻嘻]' alt='嘻嘻' title='嘻嘻'/></li><li><img src='/style/images/faces/laugh.gif' addFacesPic='[哈哈]' alt='哈哈' title='哈哈'/></li><li><img src='/style/images/faces/tza.gif' addFacesPic='[可爱]' alt='可爱' title='可爱'/></li><li><img src='/style/images/faces/kl.gif' addFacesPic='[可怜]' alt='可怜' title='可怜'/></li><li><img src='/style/images/faces/kbsa.gif' addFacesPic='[挖鼻屎]' alt='挖鼻屎' title='挖鼻屎'/></li><li><img src='/style/images/faces/cj.gif' addFacesPic='[吃惊]' alt='吃惊' title='吃惊'/></li><li><img src='/style/images/faces/shamea.gif' addFacesPic='[害羞]' alt='害羞' title='害羞'/></li><li><img src='/style/images/faces/zy.gif' addFacesPic='[挤眼]' alt='挤眼' title='挤眼'/></li><li><img src='/style/images/faces/bz.gif' addFacesPic='[闭嘴]' alt='闭嘴' title='闭嘴'/></li><li><img src='/style/images/faces/bs2.gif' addFacesPic='[鄙视]' alt='鄙视' title='鄙视'/></li><li><img src='/style/images/faces/lovea.gif' addFacesPic='[爱你]' alt='爱你' title='爱你'/></li><li><img src='/style/images/faces/sada.gif' addFacesPic='[泪]' alt='泪' title='泪'/></li><li><img src='/style/images/faces/heia.gif' addFacesPic='[偷笑]' alt='偷笑' title='偷笑'/></li><li><img src='/style/images/faces/qq.gif' addFacesPic='[亲亲]' alt='亲亲' title='亲亲'/></li><li><img src='/style/images/faces/sb.gif' addFacesPic='[生病]' alt='生病' title='生病'/></li><li><img src='/style/images/faces/mb.gif' addFacesPic='[太开心]' alt='太开心' title='太开心'/></li><li><img src='/style/images/faces/ldln.gif' addFacesPic='[懒得理你]' alt='懒得理你' title='懒得理你'/></li><li><img src='/style/images/faces/yhh.gif' addFacesPic='[右哼哼]' alt='右哼哼' title='右哼哼'/></li><li><img src='/style/images/faces/zhh.gif' addFacesPic='[左哼哼]' alt='左哼哼' title='左哼哼'/></li><li><img src='/style/images/faces/x.gif' addFacesPic='[嘘]' alt='嘘' title='嘘'/></li><li><img src='/style/images/faces/cry.gif' addFacesPic='[衰]' alt='衰' title='衰'/></li><li><img src='/style/images/faces/wq.gif' addFacesPic='[委屈]' alt='委屈' title='委屈'/></li><li><img src='/style/images/faces/t.gif' addFacesPic='[吐]' alt='吐' title='吐'/></li><li><img src='/style/images/faces/k.gif' addFacesPic='[打哈气]' alt='打哈气' title='打哈气'/></li><li><img src='/style/images/faces/bba.gif' addFacesPic='[抱抱]' alt='抱抱' title='抱抱'/></li><li><img src='/style/images/faces/angrya.gif' addFacesPic='[怒]' alt='怒' title='怒'/></li><li><img src='/style/images/faces/yw.gif' addFacesPic='[疑问]' alt='疑问' title='疑问'/></li><li><img src='/style/images/faces/cza.gif' addFacesPic='[馋嘴]' alt='馋嘴' title='馋嘴'/></li><li><img src='/style/images/faces/88.gif' addFacesPic='[拜拜]' alt='拜拜' title='拜拜'/></li><li><img src='/style/images/faces/sk.gif' addFacesPic='[思考]' alt='思考' title='思考'/></li><li><img src='/style/images/faces/sweata.gif' addFacesPic='[汗]' alt='汗' title='汗'/></li><li><img src='/style/images/faces/sleepya.gif' addFacesPic='[困]' alt='困' title='困'/></li><li><img src='/style/images/faces/sleepa.gif' addFacesPic='[睡觉]' alt='睡觉' title='睡觉'/></li><li><img src='/style/images/faces/money.gif' addFacesPic='[钱]' alt='钱' title='钱'/></li><li><img src='/style/images/faces/sw.gif' addFacesPic='[失望]' alt='失望' title='失望'/></li><li><img src='/style/images/faces/cool.gif' addFacesPic='[酷]' alt='酷' title='酷'/></li><li><img src='/style/images/faces/hsa.gif' addFacesPic='[花心]' alt='花心' title='花心'/></li><li><img src='/style/images/faces/hatea.gif' addFacesPic='[哼]' alt='哼' title='哼'/></li><li><img src='/style/images/faces/gza.gif' addFacesPic='[鼓掌]' alt='鼓掌' title='鼓掌'/></li><li><img src='/style/images/faces/dizzya.gif' addFacesPic='[晕]' alt='晕' title='晕'/></li><li><img src='/style/images/faces/bs.gif' addFacesPic='[悲伤]' alt='悲伤' title='悲伤'/></li><li><img src='/style/images/faces/crazya.gif' addFacesPic='[抓狂]' alt='抓狂' title='抓狂'/></li><li><img src='/style/images/faces/h.gif' addFacesPic='[黑线]' alt='黑线' title='黑线'/></li><li><img src='/style/images/faces/yx.gif' addFacesPic='[阴险]' alt='阴险' title='阴险'/></li><li><img src='/style/images/faces/nm.gif' addFacesPic='[怒骂]' alt='怒骂' title='怒骂'/></li><li><img src='/style/images/faces/hearta.gif' addFacesPic='[心]' alt='心' title='心'/></li><li><img src='/style/images/faces/unheart.gif' addFacesPic='[伤心]' alt='伤心' title='伤心'/></li></ul></div></div>");	
		var $btn = jQuery(this);
		var $biaoqing = jQuery("#showAddFacePic"+bid);	
		var $emotions = jQuery("#emotions"+bid+" li img");
		var $close = jQuery("#close"+bid);
		var $input = jQuery("#"+options.id);
		//表情点击事件
		$emotions.die().click(function(){
			 $biaoqing.hide();
			 $input.die().insertContent(jQuery(this).attr("addFacesPic"));			 
		});		
		//关闭表情层
		$close.click(function(){
			 $biaoqing.hide();			 	 
		});
		$biaoqing.hover(function(){$biaoqing.show();},function(){$biaoqing.hide();	});
		//选择表情按钮触发事件
		$btn.live(options.Event,function(e){						
		  var iof = jQuery(this).offset();
		  var w = jQuery(this).width();
		  var h = jQuery(this).height();
		  $biaoqing.css({ "left" : iof.left+options.Left,"top" : iof.top+options.Top });
		  $biaoqing.show();		  
		});			
	};
	
	//代替表情内容
	jQuery.fn.extend({
		replaceContent : function(content){
		content = content.replace("[呵呵]","<img src='/style/images/faces/smilea.gif' addFacesPic='[呵呵]' alt='呵呵' title='呵呵'/>").replace("[嘻嘻]","<img src='/style/images/faces/tootha.gif' addFacesPic='[嘻嘻]' alt='嘻嘻' title='嘻嘻'/>").replace("[哈哈]","<img src='/style/images/faces/laugh.gif' addFacesPic='[哈哈]' alt='哈哈' title='哈哈'/>").replace("[可爱]","<img src='/style/images/faces/tza.gif' addFacesPic='[可爱]' alt='可爱' title='可爱'/>").replace("[可怜]","<img src='/style/images/faces/kl.gif' addFacesPic='[可怜]' alt='可怜' title='可怜'/>").replace("[挖鼻屎]","<img src='/style/images/faces/kbsa.gif' addFacesPic='[挖鼻屎]' alt='挖鼻屎' title='挖鼻屎'/>").replace("[吃惊]","<img src='/style/images/faces/cj.gif' addFacesPic='[吃惊]' alt='吃惊' title='吃惊'/>").replace("[害羞]","<img src='/style/images/faces/shamea.gif' addFacesPic='[害羞]' alt='害羞' title='害羞'/>").replace("[挤眼]","<img src='/style/images/faces/zy.gif' addFacesPic='[挤眼]' alt='挤眼' title='挤眼'/>").replace("[闭嘴]","<img src='/style/images/faces/bz.gif' addFacesPic='[闭嘴]' alt='闭嘴' title='闭嘴'/>").replace("[鄙视]","<img src='/style/images/faces/bs2.gif' addFacesPic='[鄙视]' alt='鄙视' title='鄙视'/>").replace("[爱你]","<img src='/style/images/faces/lovea.gif' addFacesPic='[爱你]' alt='爱你' title='爱你'/>").replace("[泪]","<img src='/style/images/faces/sada.gif' addFacesPic='[泪]' alt='泪' title='泪'/>").replace("[偷笑]","<img src='/style/images/faces/heia.gif' addFacesPic='[偷笑]' alt='偷笑' title='偷笑'/>").replace("[亲亲]","<img src='/style/images/faces/qq.gif' addFacesPic='[亲亲]' alt='亲亲' title='亲亲'/>").replace("[生病]","<img src='/style/images/faces/sb.gif' addFacesPic='[生病]' alt='生病' title='生病'/>").replace("[太开心]","<img src='/style/images/faces/mb.gif' addFacesPic='[太开心]' alt='太开心' title='太开心'/>").replace("[懒得理你]","<img src='/style/images/faces/ldln.gif' addFacesPic='[懒得理你]' alt='懒得理你' title='懒得理你'/>").replace("[右哼哼]","<img src='/style/images/faces/yhh.gif' addFacesPic='[右哼哼]' alt='右哼哼' title='右哼哼'/>").replace("[左哼哼]","<img src='/style/images/faces/zhh.gif' addFacesPic='[左哼哼]' alt='左哼哼' title='左哼哼'/>").replace("[嘘]","<img src='/style/images/faces/x.gif' addFacesPic='[嘘]' alt='嘘' title='嘘'/>").replace("[衰]","<img src='/style/images/faces/cry.gif' addFacesPic='[衰]' alt='衰' title='衰'/>").replace("[委屈]","<img src='/style/images/faces/wq.gif' addFacesPic='[委屈]' alt='委屈' title='委屈'/>").replace("[吐]","<img src='/style/images/faces/t.gif' addFacesPic='[吐]' alt='吐' title='吐'/>").replace("[打哈气]","<img src='/style/images/faces/k.gif' addFacesPic='[打哈气]' alt='打哈气' title='打哈气'/>").replace("[抱抱]","<img src='/style/images/faces/bba.gif' addFacesPic='[抱抱]' alt='抱抱' title='抱抱'/>").replace("[怒]","<img src='/style/images/faces/angrya.gif' addFacesPic='[怒]' alt='怒' title='怒'/>").replace("[疑问]","<img src='/style/images/faces/yw.gif' addFacesPic='[疑问]' alt='疑问' title='疑问'/>").replace("[馋嘴]","<img src='/style/images/faces/cza.gif' addFacesPic='[馋嘴]' alt='馋嘴' title='馋嘴'/>").replace("[拜拜]","<img src='/style/images/faces/88.gif' addFacesPic='[拜拜]' alt='拜拜' title='拜拜'/>").replace("[思考]","<img src='/style/images/faces/sk.gif' addFacesPic='[思考]' alt='思考' title='思考'/>").replace("[汗]","<img src='/style/images/faces/sweata.gif' addFacesPic='[汗]' alt='汗' title='汗'/>").replace("[困]","<img src='/style/images/faces/sleepya.gif' addFacesPic='[困]' alt='困' title='困'/>").replace("[睡觉]","<img src='/style/images/faces/sleepa.gif' addFacesPic='[睡觉]' alt='睡觉' title='睡觉'/>").replace("[钱]","<img src='/style/images/faces/money.gif' addFacesPic='[钱]' alt='钱' title='钱'/>").replace("[失望]","<img src='/style/images/faces/sw.gif' addFacesPic='[失望]' alt='失望' title='失望'/>").replace("[酷]","<img src='/style/images/faces/cool.gif' addFacesPic='[酷]' alt='酷' title='酷'/>").replace("[花心]","<img src='/style/images/faces/hsa.gif' addFacesPic='[花心]' alt='花心' title='花心'/>").replace("[哼]","<img src='/style/images/faces/hatea.gif' addFacesPic='[哼]' alt='哼' title='哼'/>").replace("[鼓掌]","<img src='/style/images/faces/gza.gif' addFacesPic='[鼓掌]' alt='鼓掌' title='鼓掌'/>").replace("[晕]","<img src='/style/images/faces/dizzya.gif' addFacesPic='[晕]' alt='晕' title='晕'/>").replace("[悲伤]","<img src='/style/images/faces/bs.gif' addFacesPic='[悲伤]' alt='悲伤' title='悲伤'/>").replace("[抓狂]","<img src='/style/images/faces/crazya.gif' addFacesPic='[抓狂]' alt='抓狂' title='抓狂'/>").replace("[黑线]","<img src='/style/images/faces/h.gif' addFacesPic='[黑线]' alt='黑线' title='黑线'/>").replace("[阴险]","<img src='/style/images/faces/yx.gif' addFacesPic='[阴险]' alt='阴险' title='阴险'/>").replace("[怒骂]","<img src='/style/images/faces/nm.gif' addFacesPic='[怒骂]' alt='怒骂' title='怒骂'/>").replace("[心]","<img src='/style/images/faces/hearta.gif' addFacesPic='[心]' alt='心' title='心'/>").replace("[伤心]","<img src='/style/images/faces/unheart.gif' addFacesPic='[伤心]' alt='伤心' title='伤心'/>");
		jQuery(this).html(content);
		}		
	})	
	//插入光标处的插件
	jQuery.fn.extend({  
		insertContent : function(myValue, t) {  
			var $t = jQuery(this)[0];  
			if (document.selection) {  
				this.focus();  
				var sel = document.selection.createRange();  
				sel.text = myValue;  
				this.focus();  
				sel.moveStart('character', -l);  
				var wee = sel.text.length;  
				if (arguments.length == 2) {  
				var l = $t.value.length;  
				sel.moveEnd("character", wee + t);  
				t <= 0 ? sel.moveStart("character", wee - 2 * t	- myValue.length) : sel.moveStart("character", wee - t - myValue.length);  
				sel.select();  
				}  
			} else if ($t.selectionStart || $t.selectionStart == '0') {  
				var startPos = $t.selectionStart;  
				var endPos = $t.selectionEnd;  
				var scrollTop = $t.scrollTop;  
				$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos,$t.value.length);  
				this.focus();  
				$t.selectionStart = startPos + myValue.length;  
				$t.selectionEnd = startPos + myValue.length;  
				$t.scrollTop = scrollTop;  
				if (arguments.length == 2) { 
					$t.setSelectionRange(startPos - t,$t.selectionEnd + t);  
					this.focus(); 
				}  
			} else {                              
				this.value += myValue;                              
				this.focus();  
			}  
		}  
	})  
});

/*
*Jquery 简单的图片弹出插件
*需要jquery1.4或者以上版本支持
*By 甘强 2011/04/05
*1.0版
*插件官方地址：http://www.skygq.com/2011/04/05/jquery-popimage/
*/
;(function($){
//	计算popImage的根路径
	var root;
	$('script').each(function(a, tag) {
		miuScript = $(tag).get(0).src.match(/(.*)jquery\.popImage(\.mini)?\.js$/);
		if (miuScript !== null) {
			root = miuScript[1];
		}
	});
//	加载css样式
	var css_href ='/style/popImage.css';
	var styleTag = document.createElement("link");
	styleTag.setAttribute('type', 'text/css');
	styleTag.setAttribute('rel', 'stylesheet');
	styleTag.setAttribute('href', css_href);
	$("head")[0].appendChild(styleTag);
	$.fn.popImage = function(options){
		var s = $.extend({}, $.fn.popImage.defaultSettings, options || {});
		if ($("#popImage_cache").length == 0){
			$("<div id='popImage_cache'></div><div class='popImage_close'></div>").appendTo("body");
		}
		var item_num = $("#popImage_cache img").length;
		return this.each(function(index){
			var $$ = $(this),
			iw = $$.outerWidth(),
			ih = $$.outerHeight(),
			imgUrl = this[s.tagName],
			index = item_num + index,
			this_id = "slide" + index;

			$('<img src="'+imgUrl+'" class="popImage_cached '+this_id+'" title="点击关闭"/>').appendTo("#popImage_cache").hide();
			$$.click(function(e){
				var animate_image = $('#popImage_cache .'+this_id),
				w_w = $(window).width(),
				w_h = $(window).height(),
				st = $(window).scrollTop();
				$('.popImage_close').hide();
				e.preventDefault();
				position = $$.offset(),
				o_h = animate_image.height(),
				o_w = animate_image.width();

				var t = st + (w_h - o_h)/2,
				l = (w_w - o_w)/2;

				animate_image.css({'left':position.left, 'top':position.top,'height':ih,'width':iw});
				$('.popImage_cached').hide();
				animate_image.show().fadeTo(0,0.9);
				animate_image.animate({'left':l,'top':t,'height':o_h,'width':o_w,'opacity':1},s.timeOut,function(){
					var position2 = animate_image.offset();
					$('.popImage_close').css({'left':position2.left+o_w-6, 'top':position2.top-15}).show();
				});
			});
			$('.popImage_close,.popImage_cached').bind('click',function(a){
				$('.popImage_close').hide();
				$('.popImage_cached').fadeOut(400);
				a.preventDefault();
			});
		});
	};
	$.fn.popImage.defaultSettings = {
		"tagName":"href",
		"timeOut":"600"
	};
})(jQuery);

jQuery.fn.jmp3 = function(passedOptions) {
    var options = {
        "playerpath": "http://pics.sc.chinaz.com/",
        "filepath": "",
        "backcolor": "",
        "forecolor": "ffffff",
        "width": "25",
        "repeat": "no",
        "volume": "50",
        "autoplay": "false",
        "showdownload": "true",
        "showfilename": "true"
    };
    if (passedOptions) {
        jQuery.extend(options, passedOptions);
        playerpath = options.playerpath
    };
    var playerpath = options.playerpath;
    return this.each(function() {
        var _container=jQuery(this).prev();
		if (!_container.is('.container')) return false;
		var filename = options.filepath + jQuery(this).html();
        var mp3html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
        mp3html += 'width="' + options.width + '" height="20" ';
        mp3html += 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">';
        mp3html += '<param name="movie" value="' + playerpath + 'singlemp3player.swf?';
        mp3html += 'showDownload=' + options.showdownload + '&file=' + filename + '&autoStart=' + options.autoplay;
        mp3html += '&backColor=' + options.backcolor + '&frontColor=' + options.forecolor;
        mp3html += '&repeatPlay=' + options.repeat + '&songVolume=' + options.volume + '" />';
        mp3html += '<param name="wmode" value="transparent" />';
        mp3html += '<embed wmode="transparent" width="' + options.width + '" height="20" ';
        mp3html += 'src="' + playerpath + 'singlemp3player.swf?';
        mp3html += 'showDownload=' + options.showdownload + '&file=' + filename + '&autoStart=' + options.autoplay;
        mp3html += '&backColor=' + options.backcolor + '&frontColor=' + options.forecolor;
        mp3html += '&repeatPlay=' + options.repeat + '&songVolume=' + options.volume + '" ';
        mp3html += 'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
        mp3html += '</object>';
        if (options.showfilename == "false") {
            jQuery(this).html("")
        };
		if (_container.is('.container')){
        _container.prepend(mp3html + "&nbsp;");
		}
    })
};