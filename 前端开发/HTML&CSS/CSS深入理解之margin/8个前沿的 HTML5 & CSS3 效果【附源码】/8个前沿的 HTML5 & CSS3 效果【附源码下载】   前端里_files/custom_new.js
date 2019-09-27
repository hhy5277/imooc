/**
 * author: dream
 * update：2014/7/29
 * version：1.0.1
 */
$(function() {

    var Main = {
        init: function() {
            var jui = window.jui;
            // 设置百度图标分享标签标志
            if ($(".article-content").length) {
                $(".article-content img").attr("data-tag", "bdshare");
                this.bdshare();
            }
            this.doActions(jui);
            this.sideBarMove(jui);
            this.lazyLoad(jui);
            this.scrollTop();
            this.toolTip();
        },
        toolTip: function() {
            /*工具提示效果*/
            $(".feed-weixin").popover({
                placement: "right",
                trigger: "hover",
                container: "body",
                html: !0
            });
            $(".excerpt header small").each(function() {
                $(this).tooltip({
                    container: "body",
                    title: "此文有 " + $(this).text() + "张 图片"
                });
            });
            $(".article-tags a, .post-tags a").each(function() {
                $(this).tooltip({
                    container: "body",
                    placement: "bottom",
                    title: "查看关于 " + $(this).text() + " 的文章"
                });
            });
            $(".cat").each(function() {
                $(this).tooltip({
                    container: "body",
                    title: "查看关于 " + $(this).text() + " 的文章"
                });
            });
            $(".widget_tags a, .slinks a, .feed-weibo, .feed-tqq, .feed-rss").tooltip({
                container: "body"
            });
            $(".readers a, .widget_comments a").tooltip({
                container: "body",
                placement: "top"
            });
            $(".article-meta li:eq(1) a").tooltip({
                container: "body",
                placement: "bottom"
            });
            $(".post-edit-link").tooltip({
                container: "body",
                placement: "right",
                title: "去后台编辑此文章"
            });
        },
        lazyLoad: function(jui) {
            /*一些图片的延迟加载*/
            $(".content .avatar").lazyload({
                placeholder: jui.uri + "/images/avatar-default.png",
                event: "scrollstop"
            });
            $(".sidebar .avatar").lazyload({
                placeholder: jui.uri + "/images/avatar-default.png",
                event: "scrollstop"
            });
            $(".content .thumb").lazyload({
                placeholder: jui.uri + "/images/thumbnail.png",
                event: "scrollstop"
            });
            $(".sidebar .thumb").lazyload({
                placeholder: jui.uri + "/images/thumbnail.png",
                event: "scrollstop"
            });
            $(".content .wp-smiley").lazyload({
                event: "scrollstop"
            });
            $(".sidebar .wp-smiley").lazyload({
                event: "scrollstop"
            });
        },
        doActions: function(jui) {
            /*点赞等操作处理*/
            var islogin = false;
            if ($("body").hasClass("logged-in")) {
                islogin = true;
            }
            $(document).on("click", function(a) {
                var b, c, d, e, f;
                if (a = a || window.event, b = a.target || a.srcElement, c = $(b), !c.hasClass("disabled")) {
                    switch (c.parent().attr("data-event") && (c = $(c.parent()[0])), c.parent().parent().attr("data-event") && (c = $(c.parent().parent()[0])), d = c.attr("data-event")) {
                        case "like":
                            if (e = c.attr("data-pid"), !e || !/^\d{1,10}$/.test(e)) {
                                return;
                            }
                            if (!islogin) {
                                if (f = LS.get("_likes") || "", -1 !== f.indexOf("," + e + ",")) {
                                    return alert("你已赞！");
                                }
                                if (f) {
                                    if (f.length >= 160) {
                                        f = f.substring(0, f.length - 1);
                                        f = f.substr(1).split(",");
                                        f.splice(0, 1);
                                        f.push(e);
                                        f = f.join(",");
                                        LS.set("_likes", "," + f + ",");
                                    } else {
                                        LS.set("_likes", f + e + ",");
                                    }
                                } else {
                                    LS.set("_likes", "," + e + ",");
                                }
                            }
                            $.ajax({
                                url: jui.uri + "/actions/index.php",
                                type: "POST",
                                dataType: "json",
                                data: {
                                    key: "like",
                                    pid: e
                                },
                                success: function(a) {
                                    return a.error ? !1 : (c.toggleClass("actived"), c.find("span").html(a.response), void 0);
                                },
                                error: function() {}
                            });
                            break;
                        case "comment-user-change":
                            $("#comment-author-info").slideDown(300);
                            $("#comment-author-info input:first").focus();
                            break;
                        case "login":
                            $("#modal-login").modal("show");
                    }
                }
            });
        },
        scrollTop: function() {
            /*回到顶部功能*/
            $("body").append('<div class="rollto"><a href="javascript:;"></a></div>');
            $(document).on("click", '.rollto a', function() {
                $("html,body").animate({
                    scrollTop: 0
                });
            });
            $(window).scroll(function() {
                var a = $(".rollto");
                if (document.documentElement.scrollTop + document.body.scrollTop > 200) {
                    a.fadeIn();
                } else {
                    a.fadeOut();
                }
            });

        },
        bdshare: function() {
            /*百度分享*/
            window._bd_share_config = {
                "common": {
                    "bdSnsKey": {},
                    "bdText": "",
                    "bdMini": "2",
                    "bdMiniList": false,
                    "bdPic": "",
                    "bdStyle": "1",
                    "bdSize": "16"
                },
                "share": {
                    "bdSize": 32
                },
                "slide": [{
                    "bdImg": 0,
                    "bdPos": "right",
                    "bdTop": 100
                }],
                "image": {
                    "tag": "bdshare",
                    "viewList": ["tsina", "qzone", "tqq", "weixin", "renren", "tieba"],
                    "viewText": "分享到：",
                    // "viewPos": "bottom",
                    "viewSize": "32"
                }
            };
            var ele = document.createElement('script');
            ele.src = 'http://bdimg.share.baidu.com/static/api/js/share.js';
            (document.getElementsByTagName('head')[0]).appendChild(ele);
        },
        sideBarMove: function(jui) {
            /*侧栏浮动*/
            var elments, rollFirst, sheight, islogin, edit, txt1, txt2, txt3, cancel_edit, num, comm_array, wait, submit_val;
            $("body").append('<div class="rollto"><a href="javascript:;"></a></div>'), $(".content .avatar").lazyload({
                placeholder: jui.uri + "/images/avatar-default.png",
                event: "scrollstop"
            }), $(".sidebar .avatar").lazyload({
                placeholder: jui.uri + "/images/avatar-default.png",
                event: "scrollstop"
            }), $(".content .thumb").lazyload({
                placeholder: jui.uri + "/images/thumbnail.png",
                event: "scrollstop"
            }), $(".sidebar .thumb").lazyload({
                placeholder: jui.uri + "/images/thumbnail.png",
                event: "scrollstop"
            }), $(".content .wp-smiley").lazyload({
                event: "scrollstop"
            }), $(".sidebar .wp-smiley").lazyload({
                event: "scrollstop"
            }), elments = {
                sidebar: $(".sidebar"),
                footer: $(".footer")
            }, $(".feed-weixin").popover({
                placement: "right",
                trigger: "hover",
                container: "body",
                html: !0
            }), elments.sidebar && (rollFirst = elments.sidebar.find(".widget:eq(" + (Number(jui.roll[0]) - 1) + ")"), sheight = rollFirst.height(), rollFirst.on("affix-top.bs.affix", function() {
                var a, b, c;
                for (rollFirst.css({
                    top: 0
                }), sheight = rollFirst.height(), a = 1; a < jui.roll.length; a++)
                    b = Number(jui.roll[a]) - 1, c = elments.sidebar.find(".widget:eq(" + b + ")"), c.removeClass("affix").css({
                        top: 0
                    });
            }), rollFirst.on("affix.bs.affix", function() {
                var a, b, c;
                for (rollFirst.css({
                    top: 20
                }), a = 1; a < jui.roll.length; a++)
                    b = Number(jui.roll[a]) - 1, c = elments.sidebar.find(".widget:eq(" + b + ")"), c.addClass("affix").css({
                        top: sheight + 30
                    }), sheight += c.height() + 20;
            }), rollFirst.affix({
                offset: {
                    top: elments.sidebar.height(),
                    bottom: (elments.footer.height() || 0) + 10
                }
            })), $(".excerpt header small").each(function() {
                $(this).tooltip({
                    container: "body",
                    title: "此文有 " + $(this).text() + "张 图片"
                });
            });
        }
    };
    Main.init();



});