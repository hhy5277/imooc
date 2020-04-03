define(function(require, exports, module){
	//引入依赖
    require('/static/lib/layer/1.6.0/layer.min.js');
    require('tab');
    var animateMp = require("./common/animate-achievement");
	var ceditor = require('ceditor');
	var commonInterface = require("/static/page/course/common/course_detail_common.js");
	var nanoscroll=require("/static/page/course/common/jquery.nanoscroller.js");
	var verifyCode = require('../common/verify-code.js');
	verifyCode.renderVerifyCodeBlock('.qa-pop .verify-code','/course/getcoursequestioncode');
	var store=require("store");
	//用来处理随屏滚动菜单的位置，需要在每次window.resize中，ace重新计算大小后重新赋值
	var targetT,targetL;
	//页面交互
	!function(){
		var ccl=store.get("ccl");
		if(ccl){
			ccl=ccl.split(",");
			//$("#js-aticle-container").width(ccl[0]||400);
			//$("#js-editor-container").width(ccl[1]||400);
		}
		$("#js-code-container").height($(window).height()-131).show();
		//course-left 下的导航随屏滚动
		$(".nano").nanoScroller();

		var fixedElem = $('.js-course-menu'),
			targetElem = $('.course-left');
		//随屏滚动以.course-left为准
			targetT = targetElem.offset().top;
			targetL = targetElem.offset().left;

		$(window).on('scroll',function(){
			var wt = $(window).scrollTop();
			//console.log(wt);
			if( wt >= targetT){
				fixedElem.css('position','fixed').css('left',targetL+'px');
			}else{
				fixedElem.css('position','absolute').css('left', 0);
			}
		});

	}();

	$(window).on("beforeunload",function(){
		store.set("ccl",$("#js-aticle-container").width()+","+$("#js-editor-container").width());
	});



	$("#js-toggle-width").click(function(){
		var $this=$(this),
			w,
			cw;
		//console.log(123214,$this.text());
		if($this.text()=="全屏"){
			$this.find("span").text("收起");
			$("#js-result-drag-wrap").hide();
			cw=$("#js-aticle-container").width();
			$("#js-result-container").css({
				left:cw,
				width:$(window).width()-cw
			});
		}
		else{
			$this.find("span").text("全屏");
			$("#js-result-drag-wrap").show();
			cw=$("#js-aticle-container").width()+$("#js-editor-container").width();
			$("#js-result-container").css({
				left:cw,
				width:$(window).width()-cw
			});
		}
	});
	$("#js-toggle-vsb").click(function(){
		//rewrite ^(/download/.*)/audio/(.*)\..*$ $1/mp3/#$2.ra  last;
		var $this=$(this),
			w,
			cw;
		//console.log(123214,$this.text());
		if($this.text()=="运行结果"){
			$this.find("span").text("收起结果");
			cw=$("#js-aticle-container").width();
			$("#js-result-container").css({
				left:cw,
				width:$(window).width()-cw
			}).show();
		}
		else{
			$this.find("span").text("运行结果");
			$("#js-result-container").hide();
		}
	});
    $('#js-result-container,#js-toggle-width').hover(function() {
        $("#js-toggle-width").css('visibility','visible');
    },function() {
        $("#js-toggle-width").css('visibility','hidden');
    });

	$("#js-editor-drag-wrap,#js-result-drag-wrap").hover(function(){
		$(this).find("div").show();
	},function(){
		$(this).find("div").hide();
	});



	var resizeTimer=null;
	$(window).on('resize',function(){
		//clearTimeout(resizeTimer);
		resizeWinow();
	});



 	//$('#bar').on('click',function(){
	//	$(window).scrollTop($(this).offset().top);
	//});

	var $tabA = $('#J_TabType').find('li a');
	var langArr = [];
	var extHash = {
		'js' : 'javascript',
		'py' : 'python'
	};
	$tabA.each(function(i, v){
		var ext = $(v).text().split('.')[1];
		if(extHash[ext]){
			langArr.push(extHash[ext]);
		} else {
			langArr.push(ext);
		}
	});

	//初始化
	var $elems    = $('#J_EditorTabs').find('.editor-item');
	var $resetBtn = $('#J_EditorReset');
	var css       = $('a[href="#editor-tabs-css"]').attr('href');
	//接口列表
	var APIs = {
		othersCode : '/course/otherscode',
		qas        : '/course/ajaxmediaques',
		saveques   : '/course/ajaxsaveques',
		viewCode   : '/course/viewquescode'
	};
	//问题主语言
	var mainLang = $('#J_CodeLang').attr('data-lang');

	//初始化
	var ceditor = ceditor.init($elems);



    $('#J_EditorTabs').fadeIn();//.tabs();
	$('.editor-btn').fadeIn();

	$('#J_TabType li:first-child').addClass('ui-tabs-active');
	//tab切换
	$('#J_TabType li').on('click',function(e){
        e.preventDefault();
		$(this).addClass('ui-tabs-active').siblings().removeClass('ui-tabs-active');
		$(".editor-item").addClass('visible-hid').eq($(this).index()).removeClass('visible-hid');
	})

	//处理编程区域多标签的情况,ljw add 20150803
	var mulitTab = (function(){
		var rObj = {};
		var $elem = $('.js-editor-tab'),
			$view = $elem.find('.editor-view'),//视口
			$scrollarea = $elem.find('ul'),//滚动区域
			$lbtn = $elem.find('.editor-left'),//左按钮
			$rbtn = $elem.find('.editor-right'),//右按钮
			outerW = 0,//滚动区域总宽度
			curIndex = 0;//当前在视口内最左侧的索引

		//用于存放标签对象的相关信息,数组内每个对象都有width,left
		//width 当前li的宽度，left 当前元素距离滚动区域最左侧的距离
		var infoarr = [];
		$scrollarea.find('li').each(function( i , n ){
			var obj = {};
			obj.index = i;
			obj.width = $(this).outerWidth(true);
			obj.left = $(this).position().left;
			infoarr.push(obj);
			outerW += obj.width;
		});
		$scrollarea.css('width',outerW+'px');
		//在每次窗口大小变化后，调用此方法重新计算
		rObj.resetCount = function(){
			if($elem.hasClass('js-hasop')){
				$elem.removeClass('js-hasop');
			}
			var viewW = $view.width();
			if(outerW>viewW){
				//当滚动区域的总宽度大于视口宽度时，显示左右按钮
				$elem.addClass('js-hasop');
				curIndex = $elem.find('.ui-tabs-active').index();
				$scrollarea.css('marginLeft',(-infoarr[curIndex].left)+'px');
			}else{
				curIndex = 0;
				$scrollarea.css('marginLeft',0+'px');
				return ;
			}
		};

		$lbtn.on('click',function(){
			if(curIndex === (infoarr.length-1)){
				return ;
			}else{
				$scrollarea.css('marginLeft',(-infoarr[++curIndex].left)+'px');
			}

		});
		$rbtn.on('click',function(){

			if(curIndex === 0 ){
				return ;
			}else{
				$scrollarea.css('marginLeft',(-infoarr[--curIndex].left)+'px');
			}

			//console.log(curIndex);
		});


		return rObj;
	})();

	//提交
	$('#J_Commit').on('click', function(){
		ceditor.commit(mainLang, function(data) {
            commonInterface.tabList&&commonInterface.tabList.mate.load();
            //animate mp;
            var chapterMp = data.data.media;
            var courseMp = data.data.course;
            var data = [];
            chapterMp && data.push({mp: chapterMp.mp.point, desc: chapterMp.mp.desc});
            courseMp && data.push({mp: courseMp.mp.point, desc: courseMp.mp.desc});
            animateMp(data);
        });
	});

   	//发疑问
   	//var WcodeData=window.WcodeData={};

   	$.each("qa,note".split(","),function(k,v){
   		commonInterface.remote[v].extendMethod("reset",function(){
   			$(".js-shot-code[data-type='"+v+"']").removeClass("shoted").attr("title","点击拍照保存代码");
   		});
   	});

   	//drag width
   	var drager={
   		init:function(){
   			//each has min width;
   			var blocks,
   				blocksSelector,
   				i,
   				len,
   				$el;
   			this.blocks=blocks=[];

				blocks.push({
					el:$('#js-aticle-container'),
					width:$('#js-aticle-container').width(),
					minWidth:parseInt($('#js-aticle-container').css("minWidth"))||320
				});
				blocks.push({
					el:$('#js-editor-container'),
					width:$('#js-editor-container').width(),
					minWidth:parseInt($('#js-editor-container').css("minWidth"))||400
				});
				blocks.push({
					el:$('#js-result-container'),
					width:$('#js-result-container').width(),
					minWidth:parseInt($('#js-result-container').css("minWidth"))||130
				});


   			$("#js-editor-drager,#js-result-drager")
   			.attr("unselectable","on")
            .css("user-select","none")
            .on("selectstart", false)
            .on("mousedown",$.proxy(this.start,this));
   			//console.dir(blocks);

   		},
   		start:function(e){
   			this.splitor=$(e.target).closest("#js-editor-drager").length&&1||2;
   			this.x=e.clientX;
   			$("#js-aticle-container,#js-editor-container,#js-result-container")
   			.attr("unselectable","on")
            .css("user-select","none")
            .on("selectstart.codedrager", false);
   			$(document).on("mousemove.codedrager",$.proxy(this.move,this));
   			$(document).on("mouseup.codedrager",$.proxy(this.stop,this));
            //iframe mask
            $("#js-result-container").append("<div class='js-result-drag-mask' style='position:absolute;top:0;left:0;right:0;bottom:0;z-index:911;'></div>")
   		},
   		move:function(e){
   			var dx=e.clientX-this.x,
   				blockLeft,
   				blockRight,
   				blockSub,
   				subWidth,
   				subLeft,
   				dir,
   				addLeft;
   			if(!dx) return ;

   			blockLeft=this.blocks[this.splitor-1];
   			blockRight=this.blocks[this.splitor];

   			if(dx>0){
   				blockSub=blockRight;
   				dir=1;
   			}
   			else{
   				blockSub=blockLeft;
   				dir=-1;
   			}
   			subWidth=blockSub.el.width();
   			dx=Math.abs(dx);
   			if(subWidth-dx<blockSub.minWidth){
   				dx=subWidth-blockSub.minWidth;
   			}
   			if(!dx){
   				return ;
   			}
   			this.x+=dir*dx;

   			blockLeft.el.css({
   				width:blockLeft.el.width()+dir*dx
   			});

   			blockRight.el.css({
   				left:parseInt(blockRight.el.css("left"))+dir*dx,
   				width:blockRight.el.width()-dir*dx
   			});
   		},
   		stop:function(e){
   			$(document).off("mousemove.codedrager");
   			$(document).off("mouseup.codedrager");
   			$("#js-aticle-container,#js-editor-container,#js-result-container")
   			.attr("unselectable","off")
            .css("user-select","")
            .off("selectstart.codedrager");
            $("#js-result-container").find(".js-result-drag-mask").remove();
			$(".editor-item").each(function(i,v){
				ace.edit(this).renderer.onResize();
			});
			mulitTab.resetCount();
   		}
   	}
	function resizeWinow(){
		var $w=$(window),
			w=$w.width(),
			h=$w.height(),
			aw,ew,rw;
		$('#js-code-container').height(h-131);//minus header
		if(w<1200){
			$("#js-result-container").hide();
			$("#js-result-drag-wrap").hide();
			$("#js-toggle-width").hide().find("span").text("全屏");
			$("#js-toggle-vsb").show().find("span").text("运行结果");
			aw=$("#js-aticle-container").width();
			ew=Math.max(400,w-aw);
			//aw=Math.max(320,w-ew);
			$("#js-aticle-container").css({
				width:aw
			});
			$("#js-editor-container").css({
				left:aw,
				width:ew
			});
			$("#js-result-container").css({
				left:aw+ew,
				width:0
			})
		}
		else{
			$("#js-result-container").show();
			$("#js-result-drag-wrap").show();
			$("#js-toggle-width").show().find("span").text("全屏");
			$("#js-toggle-vsb").hide().find("span").text("运行结果");
			aw = 400;
			rw = 130;
			ew = w-aw-rw;

			$("#js-aticle-container").css({
				width:aw
			});
			$("#js-editor-container").css({
				left:aw,
				width:ew
			});
			$("#js-result-container").css({
				left:aw+ew,
				width:rw
			})
		}
		//重置随屏滚动菜单的参考位置
		var targetElem = $('.course-left');
		targetT = targetElem.offset().top;
		targetL = targetElem.offset().left;
		//重新计算编辑器区域大小
		drager.init();
		$(".nano").nanoScroller();
		mulitTab.resetCount();
		$(window).trigger('scroll');
	}
	resizeWinow();



   	//function codeShotAnimate(target){
	//	if(!target) return ;
	//	var offset=$(target).offset(),
	//		pLeft=offset.left,
	//		pTop=offset.top,
	//		$source=$('#J_EditorTabs'),
	//		sourceOffset=$source.offset();
	//	$('#J_EditorTabs').clone().appendTo($('body')).css({
	//		position:'absolute',
	//		left:sourceOffset.left,
	//		width:$source.width(),
	//		top:sourceOffset.top,
	//		zIndex:9999999
	//	}).animate({left:pLeft,top:pTop,width:0,height:0,opacity:0},function(){
	//		$(this).remove()
	//	});
	//}
   	//$(".js-shot-code").click(function(){
   	//	var $this=$(this);
   	//	if(!$this.hasClass("shoted")){
   	//		$this.addClass("shoted").attr("title","点击取消");
   	//		var files=[];
		//	$.each(ceditor.editors,function(k,v){
		//		var file={
		//			filename:v.filename,
		//			lang:v.lang,
		//			content:v.getValue()
		//		};
		//		files.push(file);
		//	})
		//	var jsonData={
		//		lang :mainLang,
		//		files: files
		//	}
		//	//pageInfo.code[$(this).attr("data-type")]=jsonData;
   	//		commonInterface.remote[$this.attr("data-type")].set(jsonData);
   	//		codeShotAnimate($this);
   	//	}
   	//	else{
   	//		$this.removeClass("shoted").attr("title","点击拍照保存代码");
   	//		commonInterface.remote[$this.attr("data-type")].reset();
   	//	}
   	//});

	//截图开关
	$('.js-shot-code').on('click',function(){
		if($(this).hasClass('on')){
			$(this).removeClass('on');
		}else{
			$(this).addClass('on');
		}
	});

	//截图
	function shotPic(type){
		var files=[];
		$.each(ceditor.editors,function(k,v){
			var file={
				filename:v.filename,
				lang:v.lang,
				content:v.getValue()
			};
			files.push(file);
		});
		var jsonData={
			lang :mainLang,
			files: files
		};
		//pageInfo.code[$(this).attr("data-type")]=jsonData;
		commonInterface.remote[type].set(jsonData);
	}
	//发问答
	$('#js-discuss-submit').on('click',function(){
		var $v,
			c,
			content,
			txt,
			txtLength,
			data={},
			title,
			$this=$(this);

		//判断是否有需要截图
		if($('.qa-pop .js-shot-code').hasClass('on')){
			shotPic('qa');
		}else{
			commonInterface.remote.qa.reset();
		}

		if($this.hasClass("submit-loading")) return;
		title = $.trim($('#js-qa-title').val());
		if(title.length < 5 || title === $('#js-qa-title').attr('placeholder')) {
			layer.msg('问答标题不能少于5个字', 2, -1);
			return;
		}
		else if(title.length > 255) {
			layer.msg('问答标题不能大于255个字', 2, -1);
			return;
		}

		content=UE.getEditor("discuss-editor").getContent();
		content=$.trim(content);
		txt=$.trim(UE.getEditor("discuss-editor").getContentTxt());
		txtLength=txt.length;
		if(txtLength==0||txt=="请输入讨论内容..."){
			layer.msg('请输入讨论内容', 2, -1);
			return;
		}
		if(txtLength < 5){
			layer.msg('输入不能小于5个字符', 2, -1);
			return;
		}
		if(content.length >20000){
			layer.msg('输入不能超过20000个字', 2, -1);
			return;
		}
		//if(($v=$("#js-discuss-btm .verify-code")).length){
		//	c=$v.find("input").val();
		//	if(c.length==0){
		//		layer.msg("请输入验证码",2,-1);
		//		return ;
		//	}
		//	if(c.length!=4){
		//		layer.msg("请输入正确的验证码",2,-1);
		//		return ;
		//	}
		//	data.verify_code=c;
		//}
		var verifyVal = $.trim(verifyCode.getResult('.qa-pop .verify-code'));
		if(verifyVal.length==0){
			$('.qa-pop .verify-code').trigger('fail',"请输入验证码");
			return ;
		}else{
			data.verify = verifyVal;
			$('.qa-pop .verify-code').trigger('succ');
		}
		$.extend(data,postData);
		data.content = content;
		data.title = title;
		commonInterface.remote.qa.prev(data);
		$this.addClass("submit-loading").val("正在发布...");
		$.ajax({
			url:"/course/ajaxsaveques",
			data:data,
			type:"post",
			dataType:"json",
			success:function(data){
				if(data.result==0){
					layer.msg('发布成功!', 2, -1);
					commonInterface.tabList.qa.load();
					UE.getEditor("discuss-editor").setContent("");
					$('#js-qa-title').val("");
					commonInterface.remote.qa.reset();
					$('.qa-pop .pop-title span').click();
					//$("#js-discuss-btm .verify-code").remove();
				}
				//else if(data.result==-103001){
				else if(data.result==-103002){
						$('.qa-pop .verify-code').trigger('fail',data.msg);
					//verify code;
					//if($("#js-discuss-btm .verify-code").length) return ;
					//$("#js-discuss-btm").append([
					//	'<div class="verify-code l">',
					//	'<input type="text" maxlength="4" class="verify-code-ipt">',
					//	'<img src="/wenda/getverifycode?',Math.random(),'" >',
					//	'<span class="verify-code-around">看不清换一换</span>',
					//	'</div>'
					//].join(""));

				}
				else{
					layer.msg(data.msg, 2, -1);
				}
			},
			complete:function(){
				$this.removeClass("submit-loading").val("发布");
				//commonInterface.remote.qa.reset();
			}
		})
	});

	//发笔记
	$('#js-note-submit').on('click',function(){
		var $this=$(this),
			data={};
		if($this.hasClass("submit-loading")) return ;
		//判断是否有需要截图
		if($('.note-pop .js-shot-code').hasClass('on')){
			shotPic('note');
		}else{
			commonInterface.remote.note.reset();
		}

		if($('.publish-note-btns .verify-code-around').length!==0){
			var verifyVal = $.trim(verifyCode.getResult('.publish-note-btns .verify-code'));
			if(verifyVal.length==0){
				$('.publish-note-btns .verify-code').trigger('fail',"请输入验证码");
				return ;
			}else{
				$('.publish-note-btns .verify-code').trigger('succ');
				data.verify = verifyVal;
			}
		}

		data.content=$.trim($('#js-note-textarea').val());
		if(!data.content.length||data.content == $("#js-note-textarea").attr("placeholder")){
			layer.msg('请输入内容', 2, -1);
			return;
		}
		if(data.content.length>0 && data.content.length < 3){
			layer.msg('输入不能小于3个字符', 2, -1);
			return;
		}
		if(data.content.length > 1000){
			layer.msg('输入不能超过1000个字', 2, -1);
			return;
		}

		$.extend(data,postData);
		commonInterface.remote.note.prev(data);
		data.is_shared=$('#js-isshare').is(':checked')?1:0; //是否分享
		$this.addClass("submit-loading");
		$.ajax({
			url:"/course/addnote",
			type:"post",
			dataType:"json",
			data:data,
			success:function(data){
				$this.removeClass("submit-loading");
				if(data.result==0){
					layer.msg('发布成功', 2, -1);
					commonInterface.tabList.note.load();
					$('#js-note-limit').text(0);
					$('#js-note-textarea').val("").blur(); //blur to trigger fake placeholder
					commonInterface.remote.note.reset();
					$('.note-pop .verify-code').trigger('succ');
					$('.note-pop .verify-code').html('');
					$('.note-pop .pop-title span').click();

				}else if(data.data==1&&data.result==-1){
					verifyCode.renderVerifyCodeBlock('.publish-note-btns .verify-code','/course/getnotecode');
				}else if(data.result==-103002){
					$('.note-pop .verify-code').trigger('fail',data.msg);
					//verify code;
					//if($("#js-discuss-btm .verify-code").length) return ;
					//$("#js-discuss-btm").append([
					//	'<div class="verify-code l">',
					//	'<input type="text" maxlength="4" class="verify-code-ipt">',
					//	'<img src="/wenda/getverifycode?',Math.random(),'" >',
					//	'<span class="verify-code-around">看不清换一换</span>',
					//	'</div>'
					//].join(""));

				}
				else{
					layer.msg(data.msg, 2, -1);
				}
				//commonInterface.remote.note.success(data);

			}
		});
	});


	//tabs
	$(function(){
		//大图查看器
        function view(el){
            var src=$(el).attr("href");
            var mask=$('<div id="js-imgview-mask" class="imgview-mask"></div>').appendTo($('body')).fadeIn();
            var imgwrap=$('<div id="js-imgview" class="show-img"><img id="bigimage" class="imgplacHolder" src="/static/img/loading-small.gif"><a href="#" class="imgview-close" ></a></div>').appendTo($('body'));
            var img=new Image();
            img.onload=function(){
                var winHeight=$(window).height()-80, //sub
                    winWidth=$(window).width()-80,
                    h=this.height,
                    w=this.width,
                    ratio;
                if(h>winHeight||w>winWidth){
                    ratio=Math.min(winHeight/h,winWidth/w);
                    h=Math.round(h*ratio);
                    w=Math.round(w*ratio);
                }
                imgwrap.animate({
                    marginTop:-h/2,
                    marginLeft:-w/2,
                    width:w,
                    height:h
                },200,function(){
                    imgwrap.find("img").attr({
                        width:w,
                        height:h,
                        src:src
                    });
                });
            }
            img.src=src;
        }

        $(document).off("click.closeview").on("click.closeview",".imgview-close,#js-imgview-mask",function(e){
            e.preventDefault();
            $("#js-imgview-mask,#js-imgview").remove();
        });

        $.fn.viewPhoto=function(){
            $(this).click(function(e){
                var $el=$(e.target);
                if($el.is("img")&&$el.parent().is("a")){
                    view($el.parent());
                    e.preventDefault();
                }
            });
		};

		$('#J_CodeDescr').viewPhoto();
	});

	//重置代码

	$('#J_EditorReset').on('click', function(){
		ceditor._reset();
	});


	//任务提示

	$('#J_CodeQa').find('dt').on('click',function(){
		 $(this).siblings('dd').slideToggle()
	})

    //study time sender;
    if(OP_CONFIG.userInfo){
        !function(){
            //no actual mean to use delta time; use interval constant instead;
            var time=60,
                last=new Date().getTime();
            setInterval(function(){
                last=new Date().getTime();
                $.post("/course/ajaxmediauser",{mid:pageInfo.mid,time:time});
            },time*1000);

            $(window).on("beforeunload",function(){
                $.ajax({
                    url:"/course/ajaxmediauser",
                    method:"post",
                    async:false,
                    data:{mid:pageInfo.mid,time:(new Date().getTime()-last)/1000}
                })
            });
        }();
    }
	//侧栏展出，隐藏
	(function(){
		$('.section-list').on('click','.showsider',function(){
			$(this).css('display','none');
			$('.section-list').animate({'right':'0'},200);
		});
		$('.section-list').on('click','.hidesider',function(){
			$('.section-list').animate({'right':'-340px'},200,function(){
				$('.showsider').css('display','block');
			});
		});
	})();


});
