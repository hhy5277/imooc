define(function(require, exports, module) {
	//window.onerror=function(){return true;}
	require('ace');
	//var Drag = require('drag');
	/*var _page = 'editor-tabs-html';
	var _css = 'editor-tabs-css';
	var _js = 'editor-tabs-javascript';
	var css = $('a[href="#' + _css + '"]').text();
	var js = $('a[href="#' + _js + '"]').length > 0 ? $('a[href="#' + _js + '"]').text() : undefined;*/
	var APIs = {
		commit: '/course/codesubmit'
	};
    var sid = pageInfo.mid;
    if (OP_CONFIG.userinfo && OP_CONFIG.userinfo.uid) {
        sid += '_' + OP_CONFIG.userinfo.uid;
    } else {
        sid += '-' + Math.round(Math.random()*1e7);
    }
    var saveURI = '/course/savecode';
    var runURI = 'http://codeweb.imooc.com/';
    var phpRunURI = 'http://docker.imooc.com/';
    var dockerRunURI = 'http://docker.imooc.com/run/viewresult?file=';
	var javaRunURI = 'http://javaweb.imooc.com/';
        var csharpRunURI = 'http://csharp.imooc.com/run/viewresult?srcfile=';
        //var csharpRunURI = 'http://csharp.imooc.com/';
	var CodeEditor = function(elems) {
		this.elems = elems;
		this.editors = [];
		this.defaults = [];
		this.files = [];
		this.temp = '';
		this.runNow = true;
		this.wHeight = $(window).height();
		this.wWidth = $(window).width();
		this.initialization()
	}
	CodeEditor.prototype = {
		initialization: function() {
			var that = this;
			this.lastFile = null;
			$.each(that.elems, function(i, v) {
				var editor = ace.edit(v),
					lang = $(v).attr('data-lang');
				if (lang==='c' || lang === 'cpp') {
					lang = 'c_cpp';
				}
				editor.setTheme("ace/theme/tomorrow_night");
				editor.getSession().setMode("ace/mode/" + lang);

				editor.session.setUseWrapMode(true);
                                editor.session.setWrapLimitRange(null, null);

				editor.renderer.setShowPrintMargin(false);
                                // editor.renderer.setPrintMarginColumn(100);

				editor.setFontSize('14px');
				editor.lang = lang;//$(v).attr('data-lang');
				editor.setHighlightActiveLine(false);
				editor.filename = $(v).attr('data-filename');
				that.defaults.push(editor.getValue());
				var file = {
					filename: $(v).attr('data-filename'),
					lang: $(v).attr('data-lang'),
					content: editor.getValue()
				};
				that.files.push(file);
				that.editors.push(editor);
				var timer;
				editor.on('change', function(e) {
					file.content = editor.getValue();
					that.lastFile = file;
					if (timer) {
						clearTimeout(timer)
					}
					timer = setTimeout(t, 500)
				});
				function t() {
					if (that.runNow) {
						that.runCode()
					}
				}
			});
			setTimeout(function() {
				that.showViewport()
			}, 100)
		},
		showViewport: function() {
			var that = this;
			var viewPortElement = $('<iframe name="Consoleframe" id="J_Console" frameborder="0" width="100%" height="100%"></iframe>');
			viewPortElement.appendTo($('#viewPort-content'));
			this.runCode()

		},
		runCode: function() {
			var that = this;
			var iframeHtml;
			var  frameShow =function(data,isContent){
				var iframe = window.frames['Consoleframe'],
					iframedocument;
				if(!isContent) {
					if(data.errno === 0 && data.file) {
					//console.log(runURI + data.file)
						//$(iframe).attr('src', runURI + data.file);
						//$(iframe).attr('src', 'http://www.imooc.com');
						//$('#J_Console').attr('src',(data.cat !== 'java' ? runURI : javaRunURI) + data.file);
                                                var exe_uri = '';
                                                if(data.cat == 'java'){
                                                    exe_uri = javaRunURI;
                                                }else if(data.cat == 'csharp'){
                                                    exe_uri = csharpRunURI;
                                                }else if(data.cat == 'php'){
                                                    exe_uri = dockerRunURI;
                                                }else{
                                                    exe_uri = runURI;
                                                }
                                                
                                                $('#J_Console').attr('src', exe_uri + data.file);
					}
					return ;
				}

			    iframedocument = iframe.document ? iframe.document : iframe.contentDocument;
				iframedocument.open();
				//aata=!nopre?("<pre>"+iframeHtml+"</pre>"):iframeHtml;
				iframedocument.write(data);
				iframedocument.close()
			}


			if(that.files[0].lang=='php' && that.files.length == 1){ //php
			    var filename = that.files[0].filename;
			    //$.post('/code/update', { lang: 'php', filename:filename, sid:sid, content:that.files[0].content }, function(data) {
			    $.post(saveURI, { lang: 'php', code:that.files[0].content, sid:sid, filename:filename }, function(data) {
					 if(data && data.result_type){
			    		 $('#J_Console').attr('src', 'http://php.mukewang.com/'+sid+'/'+filename+'?rnd='+Math.random());
			    	}else{
                                        data.cat = 'php';
			    		frameShow(data);
			    	}
            	});
			}
			else if(that.files[0].lang=='python' && that.files.length == 1){ //python
				$.post(saveURI, { lang: 'python', code:that.files[0].content , sid:sid, filename:that.files[0].filename}, function(data) {
				 frameShow(data);
				//html += '检测结果：'+data.result+'</p>';
				});
			}
			else if(that.files[0].lang=='ruby' && that.files.length == 1){ //python
				$.post(saveURI, { lang: 'ruby', code:that.files[0].content , sid:sid, filename:that.files[0].filename}, function(data) {
				 frameShow(data);
				//html += '检测结果：'+data.result+'</p>';
				});
			}
			else if(that.files[0].lang=='sass' && that.files.length == 1){ //python
				$.post(saveURI, { lang: 'sass', code:that.files[0].content , sid:sid, filename:that.files[0].filename}, function(data) {
				 frameShow(data);
				//html += '检测结果：'+data.result+'</p>';
				});
			}
			else if(that.files[0].lang=='c' && that.files.length == 1){ //c
				 $.post(saveURI, { lang: 'c', code:that.files[0].content , sid:sid, filename:that.files[0].filename}, function(data) {
				  frameShow(data)
				 });
			 }
			else if(that.files[0].lang=='cpp' && that.files.length == 1){ //c
				 $.post(saveURI, { lang: 'cpp', code:that.files[0].content , sid:sid, filename:that.files[0].filename}, function(data) {
				  frameShow(data)
				 });
			 }
			else if(that.files[0].lang=='c' && that.files.length > 1){//多个c文件
				var xdata,
					suc = 0,
					len = that.files.length;
				$.each(that.files, function(i, v) {
					$.post(saveURI, { lang: 'c', code:v.content , sid:sid, filename:v.filename}, function(data) {
						suc++;
						if(i==0){
							xdata = data;
						}
						if(len === suc && xdata) {
							frameShow(xdata);
						}
					});
				});
				//$.post(saveURI, { lang: 'c', code:that.files[0].content , sid:sid, filename:that.files[0].filename}, function(data) {
				//		  frameShow(xdata)
				//});
			}
			else if(that.files[0].lang=='javascript' && that.files.length == 1){ //php
				$.post(saveURI, { lang: 'javascript', code:that.files[0].content }, function(data) {
				  	frameShow(data)
					//html += '检测结果：'+data.result+'</p>';
				});
		   	}

            else if(that.files[0].lang=='php' && that.files.length > 1){
				var  currentHtml='';
                                var res_save_arr = [];
                                var count = 0;
				$.each(that.files, function(i, v) {
					if (v.lang == 'php') {
						//$.post('/code/update', { lang: 'php', filename:v.filename, sid:sid, code:v.content }, function(data) {
                                                //$('#J_Console').attr('src', 'http://php.mukewang.com/'+sid+'/'+v.filename+'?rnd='+Math.random());
						//html += '检测结果：'+data.result+'</p>';
                                                $.post(saveURI, { lang: 'php', filename:v.filename, sid:sid, code:v.content }, function(data) {
                                                    res_save_arr.push(data);
                                                    count++;
                                                    if(count == that.files.length){//dockerRunURI
                                                        //$('#J_Console').attr('src', dockerRunURI+res_save_arr[0].file); //默认必须是index.php
                                                        for (var i = 0; i < res_save_arr.length; i++) {
                                                            if (res_save_arr[i].file.indexOf("index") != -1) { 
                                                                $('#J_Console').attr('src', dockerRunURI+res_save_arr[i].file); //默认必须是index.php
                                                            }
                                                        }
                                                    }
						});
					}
					else if(v.lang=='javascript'){
						 currentHtml += '<script>	window.onerror=function(){return true;};try {'+v.content+'} catch(err) {　document.writeln("Error name: " + err.name)　document.writeln("Error message: " + err.message)}</script>'
					}
					else if(v.lang=='css'){
						currentHtml += '<style>' + v.content + '</style>'
					}
					else if(v.lang=='python'){
						$.post(saveURI, { lang: 'python', code:v.content }, function(data) {
							currentHtml+=data.data;
							frameShow(currentHtml)
                                                        //html += '检测结果：'+data.result+'</p>';
						});
					}
				});               
			}
			else if(that.files[0].lang=='java' && that.files.length == 1){ //c
				$.post(saveURI, { lang: 'java', code:that.files[0].content, filename:that.files[0].filename, sid:sid }, function(data) {
					data.cat = 'java';
					frameShow(data)
				});
			}
                        else if(that.files[0].lang=='csharp' && that.files.length == 1){ //c 
				$.post(saveURI, { lang: 'csharp', code:that.files[0].content, filename:that.files[0].filename, sid:sid }, function(data) {
					data.cat = 'csharp';
					frameShow(data)
				});
			}
			else if(that.files[0].lang == 'html' && that.files.length == 2 && that.files[1].lang === 'php') {
			    var filename = that.files[1].filename;
			    //$.post('/code/update', { lang: 'php', filename:filename, sid:sid, content:that.files[0].content }, function(data) {

				if(that.lastFile && that.lastFile.lang == 'html') {
			    frameShow(that.files[0].content, 1);
				}
				else {
					$.post(saveURI, { lang: 'php', code:that.files[1].content, sid:sid, filename:filename }, function(data) {
						if(data && data.result_type){
							$('#J_Console').attr('src', 'http://php.mukewang.com/'+sid+'/'+filename+'?rnd='+Math.random());
						}
						else if (data.errno === 0 && data.file) {
							frameShow(that.files[0].content, 1);
						}
					});
				}

			}
			else if(that.files[0].lang=='html'){
				var linkRegHead="<\\s*link[^>]*?href=([\'\"])\\s*",
					linkRegTail="\\s*\\1[^>]*?>",
					scriptRegHead="<\\s*script[^>]*?src=([\'\"])\\s*",
					scriptRegTail="\\s*\\1[\\s\\S]*?<\\/script>";

				$.each(that.files, function(i, v) {
					var regstyle,regscript;
					if (v.lang == 'html'){  //only on html file and place first?
						iframeHtml=v.content
					}else if (v.lang == 'css') {
						regstyle=new RegExp(linkRegHead+v.filename+linkRegTail);
						if(regstyle.test(iframeHtml)){
							iframeHtml=iframeHtml.replace(regstyle,"<style>"+v.content+"</style>");
						}
						else{
							//iframeHtml=iframeHtml.replace(/<\/head>/i,"<style>"+v.content+"</style>$&");
						}
					}else if(v.lang=='javascript') {
						//禁止页面控制台报错
						regscript=new RegExp(scriptRegHead+v.filename+scriptRegTail);
						if(regscript.test(iframeHtml)){
							iframeHtml=iframeHtml.replace(regscript,"<script>"+v.content+"</script>");
						}
						else{
							//iframeHtml=iframeHtml.replace(/<\/body>/i,"<script>"+v.content+"</script>$&");
						}
					}
			   	});
				frameShow(iframeHtml,1)
			 }
			else if(that.files.length == 1){ //single file : go
				 $.post(saveURI, { lang: that.files[0].lang, code:that.files[0].content , sid:sid, filename:that.files[0].filename}, function(data) {
				  frameShow(data)
				 });
			 }
		},
		_reset: function() {
			var that = this;
			var mid=$("#reset_mid").attr('rel');
            var step=$("#reset_step").attr('rel');

            $.ajax({
				type: "POST",
				url: '/course/resetcode',
                data: {'mid':mid,'step':step},
                dataType: 'json',
                success: function(res) {
                    if(res.result == 0){
						var data = {};
						var len = res.data.length;
						while(len--) {
							data[res.data[len].filename] = res.data[len];
						}
						
						$.each(that.editors, function(i, v) {
							if (data[v.filename]) {
								v.setValue(data[v.filename].content);
							}
						});
                    }
				}
            });
		},
		commit: function(lang,callback) {
			var sucMsg = [
					'做的漂亮。',
					'偶巴，好厉害。',
					'成功了，让编程来的更猛烈些吧。',
					'不错，兄台我看好你！',
					'Nice，官人你这是年薪过百万的节奏啊！',
					'God，你离成神已经不远了！',
					'提交正确。',
					'这题你都能过，无法直视你的双眸。',
					'好，让我们一起愉快的玩耍吧。'
				],
				msgLength = sucMsg.length;
				$('#J_EditorCommit').on('click', '#J_Close,#J_CodeCancel', function(e){
					e.preventDefault();
					$('#J_EditorCommit').animate({'height':0},function(){
						$(this).html('').css({'height':'','display':'none'})
					})
					//$('#J_EditorCommit').slideDown();
				});

			var stepMsgTimer;
				function set(data){
					var $el = $('#step-message');
					if (!$el.length) {
						$('.editor-btn').after('<div id="step-message" class="step-message"><i class="icon-point" ></i><span></span></div>')
						$el = $('#step-message');
					}	
					clearTimeout(stepMsgTimer);
					$el.find('span').text((data.msg || '') + '，再试试！');
					if (!$el.is(':visible')) {
						$el.fadeIn();
					}
					stepMsgTimer = setTimeout(function(){ $el.fadeOut('fast');}, 5e3);
				}

			return function(lang,callback){
				var params = {};
                                var filelen = this.files.length;
				params.mid = pageInfo.mid;
				params.eid = pageInfo.eid;
				params.step = pageInfo.step;
				params.lang = lang;
				params.files = this.files;
                                
                                //console.log(this.files);
                                if(lang=="PHP" && filelen > 1){//多文件先拿php测试
                                    $.each(this.files, function(i, v) {
                                        //console.log(lang,v.filename,sid,v.content);
                                        $.post(saveURI, { lang: lang, filename:v.filename, sid:sid, code:v.content,filelen:filelen}, function(data) {
                                        });
                                    }); 
                                }

				$.post(APIs.commit, params, function(data) {
					var tip;
					callback&&callback(data);
					if (pageInfo.stepTotal > 1 && pageInfo.step < pageInfo.stepTotal) {
						if (data.result === 0 || data.result === -201) {
							window.location.href = '/code/' + pageInfo.mid + '?step=' + (pageInfo.step + 1);
						} 	
						else {
							set(data);
						}
						return ;
					}
					else if (pageInfo.stepTotal > 1 && pageInfo.step === pageInfo.stepTotal) {
						if(data.result === 0 || data.result === -201) {
							$('.step-current').addClass('step-finished').removeClass('step-current')
							.siblings('.task-finished-bar').css({width: '100%'});
						}
					}
					if(data.result === -200) {
						if(pageInfo.next_mid==0){
							$('#J_EditorCommit').html('<p class="fail"><span class="status icon-point"></span>' + data.msg + ' <a class="operate faColor" id="J_CodeCancel">再试试</a>! <a class="operate suColor" id="J_CodeNext" href="' + data.data.next + '"> 返回课程</a></p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>')
						}else{
							$('#J_EditorCommit').html('<p class="fail"><span class="status icon-point"></span>' + data.msg + '，<a class="operate faColor" id="J_CodeCancel">再试试</a>！直接进入<a class="operate suColor" href="' + data.data.next + '">下一节</a></p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>');
						}
					}
					else if (data.result === 0) {
						if(pageInfo.next_mid==0){
							if(pageInfo.isfinished) {
								$('#J_EditorCommit').html('<p class="success"><span class="status icon-tick2"></span> 恭喜你,通过了本次课程 <a class="operate suColor" id="J_CodeNext" href="' + data.data.next + '">返回课程</a></p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>')
							}
							else {
								$('#J_EditorCommit').html('<p class="success"><span class="status icon-tick2"></span>代码提交成功，课程持续更新中，敬请期待！<a class="operate suColor" id="J_CodeNext" href="' + data.data.next + '">返回课程</a></p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>')
							}
						}else{
							tip = sucMsg[Math.floor(Math.random() * msgLength)];
							$('#J_EditorCommit').html('<p class="success"><span class="status icon-tick2"></span>' + tip + '<a class="operate suColor" id="J_CodeNext" href="' + data.data.next + '">下一节</a>吧。</p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>')
						}
					}
					else if(data.result === -201) {
						if(pageInfo.next_mid==0){
							if(pageInfo.isfinished) {
								$('#J_EditorCommit').html('<p class="success"><span class="status icon-tick2"></span> 恭喜你,通过了本次课程 <a class="operate suColor" id="J_CodeNext" href="' + data.data.next + '">返回课程</a></p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>')
							}
							else {
								$('#J_EditorCommit').html('<p class="success"><span class="status icon-tick2"></span> 代码提交成功，课程持续更新中，敬请期待！ <a class="operate suColor" id="J_CodeNext" href="' + data.data.next + '">返回课程</a></p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>')
							}
						}else{
							$('#J_EditorCommit').html('<p class="success"><span class="status icon-tick2"></span>代码提交成功，进入 <a class="operate suColor" id="J_CodeNext" href="' + data.data.next + '">下一节</a>！</p><a href="javascript:;" class="close  icon-close" id="J_Close"></a>')
						}
					}
					$('#J_EditorCommit').fadeIn();
				});
			}
		}()
	};
	module.exports = {
		init: function(elems) {
			return new CodeEditor(elems)
		}
	}
});
