define("common:widget/ui/image-lazy-loader/image-lazy-loader.js",function(t,e,o){var n=t("common:widget/lib/tangram/base/base.js"),i=t("common:widget/ui/image-lazy-loader/base.js"),a=window,r=document,m="scroll",s="touchmove",l="resize",d="data-src",g=100;t("common:widget/lib/tangram/fx/fadeIn/fadeIn.js");var c=function(t){var e=this,o=t.container?n.g(t.container):r;e.containers=n.lang.toArray(o),e.option={imgCls:"lazy-load-img",autoDestroy:!0,isCheckAttr:"data-is-check",imgAttr:["width","height","style"]},e.imageEls=[],e.remainEls=[],t=t||{},n.object.extend(e.option,t),e._init()};c.prototype={_init:function(){var t=this;t._filterItems(),0!=t._getItemsLength()&&t._initLoadEvent()},_filterItems:function(){var t=this;t.imageEls=n.lang.toArray(n.q(t.option.imgCls))},_initLoadEvent:function(){var t=this,e=t.option.autoDestroy,o=function(){t._loadItems(),e&&0==t._getItemsLength()&&t.destroy()};loadLazyImg=function(){setTimeout(o,g)},n.event.on(a,m,loadLazyImg),n.event.on(a,s,loadLazyImg),n.event.on(a,l,loadLazyImg),t._loadFn=loadLazyImg,t._getItemsLength()&&n.dom.ready(o)},_loadItems:function(){var t=this;t.imageEls=n.array.filter(t.imageEls,t._loadImg,t)},_loadImg:function(t){var e=this,o=d,a=n.dom.getAttr(t,o);if(!a)return!1;if(i.inDocument(t)){if(!i._checkElemInViewport(t,e.containers))return!0;e._loadImgSrc(t,a)}else;},_loadImgSrc:function(t,e){var o=this,i=d;e&&t.src!=e&&(t.onload=function(){var e=this;if(!e.src.match(/exp_loading\.gif/i)){if(n.dom.getAttr(e,o.option.isCheckAttr))for(var i=null,a=o.option.imgAttr,r=a.length-1;r>=0;r--)i=n.dom.getAttr(e,"data-"+a[r]),i&&(n.dom.setAttr(e,a[r],i),e.removeAttribute("data-"+a[r]),i=null);n.fx.fadeIn(t,{duration:800}),n.dom.removeClass(t,o.option.imgCls),e.onload=null}},t.src=e,t.removeAttribute(i))},_getItemsLength:function(){var t=this;return t.imageEls.length},destroy:function(){var t=this,e=t._loadFn;n.event.un(a,m,e),n.event.un(a,s,e),n.event.un(a,l,e)}},o.exports=c});
;define("common:widget/ui/sug/sug.js",function(t,e,i){var o=t("common:widget/lib/tangram/base/base.js"),a=t("common:widget/ui/cookie/cookie.js"),n=t("common:widget/lib/tangram/ui/Suggestion/Suggestion.js"),s=t("common:widget/ui/log/log.js");t("common:widget/lib/tangram/ui/Suggestion/coverable/coverable.js"),t("common:widget/lib/tangram/ui/Suggestion/data/data.js"),t("common:widget/lib/tangram/ui/Suggestion/fixWidth/fixWidth.js"),t("common:widget/lib/tangram/ui/Suggestion/input/input.js"),window.closeSug=function(){var t=new Date;t.setDate(t.getDate()+1),a.set("EXP_HIDESUG","1",{expires:t}),i.exports.sug.hide(),e.sug.dispose()},e.init=function(t,e,a){var g=new n({fixWidth:!1,getData:function(t){var i=this,n=[],g=e||"getSug";o.ajax.get("/asyncreq?method="+g+"&word="+encodeURIComponent(t),function(e,g){if(g&&g.length>0){var c=o.json.parse(o.trim(g));if(c.sugList&&c.sugList.length>0&&o.array.each(c.sugList,function(e){n.push({type:"word",content:e.word.replace(t,"<b>"+t+"</b>"),value:e.word,href:"/search?word="+encodeURIComponent(e.word)})}),c.tagList&&c.tagList.length>0){s.send(location.href,1010,{pos:"sug",locate:"show"});var r="<div class='sug-tag'><img src='#{picUrl}'></img><div class='sug-content'><h2><span class='i-tag' title='标签'></span>#{title}</h2><strong>共#{count}篇经验</strong></div></div>";o.array.each(c.tagList,function(e){var i=o.string.format(r,{href:"/tag/"+e.tagId,title:e.tagTitle?e.tagTitle.replace(t,"<b>"+t+"</b>"):"",picUrl:F.context("hi")+e.picEnc+".jpg",count:e.expCount});n.push({type:"tag",content:i,value:e.tagTitle,href:"/tag/"+e.tagId})})}a||(i.appendHTML="<a id='sug-close' class='sug-close' onclick='javascript:parent.closeSug(this);'>关闭</a>"),i.setData(t,n)}})},view:function(t){return a?{left:t.left+1,top:t.top,width:t.width}:{left:t.left-8,top:t.top+6,width:510}},onconfirm:function(t){if(!a){var e="",i="";t.data.item?(e=t.data.item.href,s.send(location.href,1010,{pos:"sug",locate:"click",type:t.data.item.type})):(i=this.getTargetValue(),i=o.string.trim(i),e="/search?word="+encodeURIComponent(i)),location.href=e}}});g.render(t),i.exports.sug=g}});