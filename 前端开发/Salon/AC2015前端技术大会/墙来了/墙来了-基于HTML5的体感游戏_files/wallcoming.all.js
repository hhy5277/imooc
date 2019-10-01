Vector2 = function(x, y) { this.x = x; this.y = y; };
 
Vector2.prototype = {
    copy : function() { return new Vector2(this.x, this.y); },
    length : function() { return Math.sqrt(this.x * this.x + this.y * this.y); },
    sqrLength : function() { return this.x * this.x + this.y * this.y; },
    normalize : function() { var inv = 1/this.length(); return new Vector2(this.x * inv, this.y * inv); },
    negate : function() { return new Vector2(-this.x, -this.y); },
    add : function(v) { return new Vector2(this.x + v.x, this.y + v.y); },
    subtract : function(v) { return new Vector2(this.x - v.x, this.y - v.y); },
    multiply : function(f) { return new Vector2(this.x * f, this.y * f); },
    divide : function(f) { var invf = 1/f; return new Vector2(this.x * invf, this.y * invf); },
    dot : function(v) { return this.x * v.x + this.y * v.y; },
    angle:function(){return Math.atan2(-this.y,this.x);},
    isZero:function(){return this.x==0&&this.y==0;}
};
 
Vector2.zero = new Vector2(0, 0);


/**
*
* name:cnGame.js    
*`author:cson
*`date:2012-2-7
*`version:1.5
*
**/ 
Jx().$package(function(J){
    var $D = J.dom;
    
    var cnGame = {
        /**
        *初始化
        **/
        init: function(id, options) {
            options = options || {};
            this.canvas = $D.id(id || "canvas");
            this.context = this.canvas.getContext('2d');
            this.title = $D.tagName('title')[0];
            this.size=options.size||[400,400];
            this.canvas.width =this.width= this.size[0];
            this.canvas.height =this.height= this.size[1];
            this.pos=this.getCanvasPos(this.canvas);
            this.fps=options.fps||60;
            this.tps=options.tps||60;
            this.bgColor=options.bgColor;
            this.spriteList=new J.cnGame.SpriteList();
            this.bgImageSrc=options.bgImageSrc;
            this.isScaleBg=options.isScaleBg;
            this.view=options.view||new J.cnGame.View();
        },
        setView:function(view){
            this.view=view;
        },
        setSize:function(width,height){
            this.size=[width,height];
            var canvas=this.canvas;
            canvas.width =this.width= this.size[0];
            canvas.height =this.height= this.size[1];
            canvas.style.width=canvas.width+"px";
            canvas.style.height=canvas.height+"px";
        },
        getSize:function(){
            return [this.width,this.height];
        },
        /**
         *获取canvas在页面的位置
         **/
        getCanvasPos:function(canvas) {
            var left = 0;
            var top = 0;
            while (canvas.offsetParent) {
                left += canvas.offsetLeft;
                top += canvas.offsetTop;
                canvas = canvas.offsetParent;
            }
            return new Vector2(left,top);
        },
        updateCanvasPos:function(){
            this.pos=this.getCanvasPos(this.canvas);  
        },
        /**
        *返回是否在canvas外
        **/
        isOutsideCanvas:function(elem){
            return elem.pos[0]+elem.size[0]<0||elem.pos[0]>this.canvas.width||elem.pos[1]+elem.size[1]<0||elem.pos[1]>this.canvas.height;
        },
        /**
        *清除画布
        **/
        clean: function() {
            this.context.clearRect(0,0,this.width, this.height);
        },
        /**
        *绘制画布背景色
        **/     
        drawBg:function(){
            var view=this.view;
            var s=view.size;
            var w=s[0];
            var h=s[1];
            var p=view.pos;
            var x=p[0];
            var y=p[1];

            var ctx=this.context;
          
            if(this.bgColor){
                ctx.save();
                this.view.apply(ctx);
                ctx.fillStyle=this.bgColor;
                ctx.translate(this.width/2,this.height/2);
                ctx.fillRect(-w/2,-h/2,s[0],s[1]);
                ctx.restore();
            }   
            else if(this.bgImageSrc){
                var img=this.loader.loadedImgs[this.bgImageSrc];
                if(img){
                    ctx.save();
                    this.view.apply(ctx);
                    ctx.translate(this.width/2,this.height/2);
                    if(this.isScaleBg){
                        ctx.drawImage(img,0,0,img.width,img.height,-this.width/2,-this.height/2,this.width,this.height);
                    }
                    else{
                        ctx.drawImage(img,0,0,img.width,img.height,-this.width/2,-this.height/2,img.width,img.height);
                    }
                    ctx.restore();
                }
            }
        }
    }
    J.cnGame=cnGame;
    
});
/**
*
*基本工具函数模块
*
**/
Jx().$package(function(J){
    var core=J.cnGame.core={};
    /**
    按id获取元素
    **/
    core.$ = function(id) {
        return document.getElementById(id);
    };
    /**
    按标签名获取元素
    **/
    core.$$ = function(tagName, parent) {
        parent = parent || document;
        return parent.getElementsByTagName(tagName);
    };
     /**
    按标签名创建元素
    **/
    core.$$$ = function(tagName) {
        return document.createElement(tagName);
    };
    /**
    按类名获取元素
    **/
    core.$Class = function(className, parent) {
        var arr = [], result = [];
        parent = parent || document;
        arr = core.$$("*");
        for (var i = 0, len = arr.length; i < len; i++) {
            if ((" " + arr[i].className + " ").indexOf(" " + className + " ") > 0) {
                result.push(arr[i]);
            }
        }
        return result;
    };
    /**
    事件绑定
    **/
    core.bindHandler = (function() {

        if (window.addEventListener) {
            return function(elem, type, handler,context) {
                elem.addEventListener(type, function(){
                    handler.apply(context,arguments);
                }, false);
            }
        }
        else if (window.attachEvent) {
            return function(elem, type, handler,context) {
                elem.attachEvent("on" + type, function(){
                    handler.apply(context,arguments);
                });
            }
        }
    })();
    /**
    事件解除
    **/
    core.removeHandler = (function() {
        if (window.addEventListener) {
            return function(elem, type, handler) {
                elem.removeEventListener(type, handler, false);
            }
        }
        else if (window.attachEvent) {
            return function(elem, type, handler) {
                elem.detachEvent("on" + type, handler);
            }
        }
    })();

    /**
    获取事件对象
    **/
    core.getEventObj = function(eve) {
        return eve || win.event;
    };
    /**
    获取事件目标对象
    **/
    core.getEventTarget = function(eve) {
        var eve = core.getEventObj(eve);
        return eve.target || eve.srcElement;
    };
    /**
    禁止默认行为
    **/
    core.preventDefault = function(eve) {
        if (eve.preventDefault) {
            eve.preventDefault();
        }
        else {
            eve.returnValue = false;
        }

    };
    /**
    是否为undefined
    **/
    core.isUndefined = function(elem) {
        return typeof elem === 'undefined';
    };
    /**
    是否为数组
    **/
    core.isArray = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Array]";
    };
    /**
    是否为Object类型
    **/
    core.isObject = function(elem) {
        return elem === Object(elem);
    };
    /**
    是否为字符串类型
    **/
    core.isString = function(elem) {
        return Object.prototype.toString.call(elem) === "[object String]";
    };
    /**
    是否为数值类型
    **/
    core.isNum = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Number]";
    };
    /**
    是否为function
    **/
   core.isFunction = function(elem) {
        return Object.prototype.toString.call(elem) === "[object Function]";
    };
    /**
    *复制对象属性
    **/
    core.extend = function(destination, source, isCover) {
        var isUndefined = core.isUndefined;
        (isUndefined(isCover)) && (isCover = true);
        for (var name in source) {
            if (isCover || isUndefined(destination[name])) {
                destination[name] = source[name];
            }

        }
        return destination;
    };

});

/**
*
*矩阵
*
**/
Jx().$package(function(J){
    var matrix=new J.Class({
        /**
        *初始化
        **/         
        init:function(options){
            this.matrix=[];
            this.setOptions(options);
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *矩阵相加
        **/
        add:function(mtx){
            var omtx=this.matrix;
            var newMtx=[];
            if(!mtx.length||!mtx[0].length||mtx.length!=omtx.length||mtx[0].length!=omtx[0].length){//如果矩阵为空，或行或列不相等，则返回
                return;
            }
            for(var i=0,len1=omtx.length;i<len1;i++){
                var rowMtx=omtx[i];
                newMtx.push([]);
                for(var j=0,len2=rowMtx.length;j<len2;j++){
                    newMtx[i][j]=rowMtx[j]+mtx[i][j];
                }
            }
            this.matrix=newMtx;
            return this;
        },
        /**
        *矩阵相乘
        **/
        multiply:function(mtx){
            var omtx=this.matrix;
            var mtx=mtx.matrix;
            var newMtx=[];
            //和数字相乘
            if(J.cnGame.core.isNum(mtx)){
                for(var i=0,len1=omtx.length;i<len1;i++){
                    var rowMtx=omtx[i];
                    newMtx.push([]);
                    for(var j=0,len2=rowMtx.length;j<len2;j++){
                        omtx[i][j]*=mtx;    
                    }
                }
                this.matrix=newMtx;
                return this;
            }
            //和矩阵相乘
            var sum=0;
            for(var i=0,len1=omtx.length;i<len1;i++){
                var rowMtx=omtx[i]; 
                newMtx.push([]);
                for(var m=0,len3=mtx[0].length;m<len3;m++){
                    for(var j=0,len2=rowMtx.length;j<len2;j++){
                        sum+=omtx[i][j]*mtx[j][m];  
                    }
                    newMtx[newMtx.length-1].push(sum);
                    sum=0;
                }
            }
            this.matrix=newMtx;
            return this;        
        },
        /**
        *2d平移
        **/
        translate2D:function(x,y){
            var changeMtx= new matrix({
                matrix:[
                   [1,0,0],
                   [0,1,0],
                   [x,y,1]
                ]
            });
            return this.multiply(changeMtx);
        },
        /**
        *2d缩放
        **/             
        scale2D:function(scale,point){//缩放比，参考点
            var sx=scale[0],sy=scale[1],x=point[0],y=point[1];

            var changeMtx= new matrix({
                matrix:[
                   [sx,0,0],
                   [0,sy,0],
                   [(1-sx)*x,(1-sy)*y,1]
                ]
            }); 
            return this.multiply(changeMtx);                
            
        },
        /**
        *2d对称变换
        **/                 
        symmet2D:function(axis){//对称轴
            var changeMtx;
            axis=="x"&&(changeMtx= new matrix({//相对于x轴对称
                matrix:[
                   [1,0,0],
                   [0,-1,0],
                   [0,0,1]
                ]
            }));                
            axis=="y"&&(changeMtx= new matrix({//相对于y轴对称
                matrix:[
                   [-1,0,0],
                   [0,1,0],
                   [0,0,1]
                ]
            }));    
            axis=="xy"&&(changeMtx= new matrix({//相对于原点对称
                matrix:[
                   [-1,0,0],
                   [0,-1,0],
                   [0,0,1]
                ]
            }));    
            axis=="y=x"&&(changeMtx= new matrix({//相对于y=x对称
                matrix:[
                   [0,1,0],
                   [1,0,0],
                   [0,0,1]
                ]
            }));    
            axis=="y=-x"&&(changeMtx= new matrix({//相对于y=-x对称
                matrix:[
                   [0,-1,0],
                   [-1,0,0],
                   [0,0,1]
                ]
            }));
            return this.multiply(changeMtx);                
        },
        /**
        *2d错切变换
        **/             
        shear2D:function(kx,ky){
            var changeMtx= new matrix({
                matrix:[
                   [1,kx,0],
                   [ky,1,0],
                   [0,0,1]
                ]
            }); 
            return this.multiply(changeMtx);
        },
        /**
        *2d旋转
        **/         
        rotate2D:function(angle,point){
            var x=point[0],y=point[1];
            var cos=Math.cos;
            var sin=Math.sin;
            var changeMtx= new matrix({
                matrix:[
                   [cos(angle),sin(angle),0],
                   [-sin(angle),cos(angle),0],
                   [(1-cos(angle))*x+y*sin(angle),(1-cos(angle))*y-x*sin(angle),1]
                ]
            }); 
            return this.multiply(changeMtx);
        },
        /**
        *3d平移
        **/
        translate3D:function(x,y,z){
            var changeMtx= new matrix({
                matrix:[
                   [1,0,0,0],
                   [0,1,0,0],
                   [0,0,1,0],
                   [x,y,z,1]
                ]
            });
            return this.multiply(changeMtx);
        },
        /**
        *3d缩放
        **/             
        scale3D:function(scale,point){//缩放比数组，参考点数组
            var sx=scale[0],sy=scale[1],sz=scale[2],x=point[0],y=point[1],z=point[2];           
            var changeMtx= new matrix({
                matrix:[
                   [sx,0,0,0],
                   [0,sy,0,0],
                   [0,0,sz,0],
                   [(1-sx)*x,(1-sy)*y,(1-sz)*z,1]
                ]
            }); 
            return this.multiply(changeMtx);                
            
        },          
        /**
        *3d旋转
        **/         
        rotate3D:function(angle,axis){
            var cos=Math.cos(angle);
            var sin=Math.sin(angle);
            var changeMtx; 

            axis=="x"&&(changeMtx=new matrix({
                            matrix:[
                               [1,0,0,0],
                               [0,cos,sin,0],
                               [0,-sin,cos,0],
                               [0,0,0,1]
                            ]
                        }));    

            axis=="y"&&(changeMtx=new matrix({
                            matrix:[
                               [cos,0,-sin,0],
                               [0,1,0,0],
                               [sin,0,cos,0],
                               [0,0,0,1]
                            ]
                        }));                        
            axis=="z"&&(changeMtx=new matrix({
                            matrix:[
                               [cos,sin,0,0],
                               [-sin,cos,0,0],
                               [0,0,1,0],
                               [0,0,0,1]
                            ]
                        }));                                    
            return this.multiply(changeMtx);
        } 
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Matrix=matrix;
});


/**
*
*Ajax模块
*
**/
/*
cnGame.register("cnGame.ajax", function(cg) {
    var activeXString; //为IE特定版本保留的activeX字符串
    var onXHRload = function(xhr, options) {
        return function(eve) {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.state < 300) || xhr.status == 304) {
                    var onSuccess = options.onSuccess;
                    onSuccess && onSuccess();
                }
                else {
                    var onError = options.onError;
                    onError && onError();

                }
            }
        }
    };
    /**
    *生成XMLHttpRequest对象
    **/
  /*  this.creatXHR = function() {
        if (!cg.core.isUndefined(XMLHttpRequest)) {
            return new XMLHttpRequest();
        }
        else if (!cg.core.isUndefined(ActiveXObject)) {
            if (!cg.core.isString(activeXString)) {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                for (var i = 0, len = versions.length; i < len; i++) {
                    try {
                        var xhr = new ActiveXObject(versions[i]);
                        activeXString = versions[i];
                        return xhr;
                    }
                    catch (e) {
                    }
                }
            }
            return new ActiveXObject(activeXString);
        }
    }
    /**
    *发送请求
    **/
    /*this.request = function(options) {
        var defaultObj = {
            type: "get"
        };
        cg.core.extend(defaultObj, options);
        var type = options.type;
        var xhr = this.creatXHR();

        cg.core.bindHandler(xhr, "readystatechange", function(eve) {//资源加载完成回调函数
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.state < 300) || xhr.status == 304) {
                    var onSuccess = options.onSuccess;
                    onSuccess && onSuccess();
                }
                else {
                    var onError = options.onError;
                    onError && onError();

                }
            }
        });

        var requestOpt = options.requestOpt;
        var url = options.url;

        if (type == "get") {//get请求数据处理
            if (url.indexOf("?") < 0) {
                url += "?";
            }
            else {
                url += "&";
            }

            for (name in requestOpt) {
                if (requestOpt.hasOwnProperty(name)) {
                    url += encodeURIComponent(name) + "=" + encodeURIComponent(requestOpt[name]) + "&";
                    url = url.slice(0, -1);
                    xhr.open(type, url, true);
                    xhr.send(null);
                }
            }
        }
        else if (type == "post") {//post请求数据处理
            var _requestOpt = {}
            for (name in requestOpt) {
                if (requestOpt.hasOwnProperty(name)) {
                    _requestOpt[encodeURIComponent(name)] = encodeURIComponent(requestOpt[name]);
                }
            }
            xhr.open(type, url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(_requestOpt);
        }
    }

});
*/
/**
*
*资源加载器
*
**/
Jx().$package(function(J){
    $E = J.event;

    var file_type = {}
    file_type["js"] = "js";
    file_type["json"] = "json";
    file_type["wav"] = "audio";
    file_type["mp3"] = "audio";
    file_type["ogg"] = "audio";
    file_type["png"] = "image";
    file_type["jpg"] = "image";
    file_type["jpeg"] = "image";
    file_type["gif"] = "image";
    file_type["bmp"] = "image";
    file_type["tiff"] = "image";

    /**
    *资源加载完毕的处理程序
    **/
    var resourceLoad = function(self, type) {
        return function() {
            
            type == "image" && (self.loadedImgs[this.srcPath] = this);
            type == "audio" && (self.loadedAudios[this.srcPath] = this);
            if(type == "error"){
                self.errorCount ++;
            }
            else{
                self.loadedCount ++;
            }
            $E.removeEventListener(this, "load", arguments.callee);//保证图片的onLoad执行一次后销毁
            $E.removeEventListener(this, "error", arguments.callee);
            $E.removeEventListener(this, "canplaythrough", arguments.callee);
            if(type){//不是无资源的直接调用resourceLoad
                self.loadedPercent = Math.floor((self.loadedCount+self.errorCount) / self.sum * 100);
                self.onLoad && self.onLoad(self.loadedPercent);
            }
            if (!type || self.loadedPercent === 100) {//如果没有资源需要加载或者资源已经加载完毕
                self.loadedCount = 0;
                self.errorCount = 0;
                self.loadedPercent = 0;
                type == "image" && (self.loadingImgs = {});
                type == "audio" && (self.loadingAudios = {});
                if (self.gameObj && self.gameObj.initialize) {
                    self.gameObj.initialize(self.startOptions);
                    if (J.cnGame.loop && !J.cnGame.loop.stop) {//结束上一个循环
                        J.cnGame.loop.end();
                    }
                    J.cnGame.loop = new J.cnGame.GameLoop(self.gameObj,{fps:J.cnGame.fps,tps:J.cnGame.tps}); //开始新游戏循环
                    J.cnGame.loop.start();
                }
            }
        }
    }
    /**
    *图像加载器
    **/
    var loader = {
        sum: 0,         //图片总数
        loadedCount: 0, //图片已加载数
        errorCount:0,   //错误数
        loadingImgs: {}, //未加载图片集合
        loadedImgs: {}, //已加载图片集合
        loadingAudios: {}, //未加载音频集合
        loadedAudios: {}, //已加载音频集合
        /**
        *动态加载
        **/        
        load:function(src,onLoad,onError){
            var suffix = src.substring(src.lastIndexOf(".") + 1);
            var type = file_type[suffix];
            var loaderContext = this; 
            if(type == "image"){
                this.loadImage(src,function(){
                    loaderContext.loadedImgs[this.srcPath]=this;
                    if(onLoad){
                        onLoad(this);
                    }
                },onError);
            }
            if(type == "audio"){
                this.loadAudio(src,function(){
                    loaderContext.loadedAudios[this.srcPath]=this;
                    if(onLoad){
                        onLoad(this);
                    }
                },onError);
            }
            if(type == "js"){
                this.loadJS(src,function(){
                    if(onLoad){
                        onLoad();
                    }
                },onError);
            }

        },
        loadImage:function(path,onLoad,onError){
            var img = new Image();
            $E.addOriginalEventListener(img, "load", onLoad);
            $E.addOriginalEventListener(img, "error", onError);
            img.src = path;
            img.srcPath = path; //没有经过自动变换的src      
        },
        loadAudio:function(path,onLoad,onError){   
            if(J.browser.ie && J.browser.ie < 9){
                return;
            }
            var audio=this.loadingAudios[path]=new Audio();
            $E.addOriginalEventListener(audio, "canplaythrough",onLoad);
            $E.addOriginalEventListener(audio, "error", onError);  
            audio.src=path;     
            audio.srcPath = path; //没有经过自动变换的src
            audio.load();    
        },
        loadJS:function(path,onLoad,onError){
            var head = J.cnGame.core.$$("head")[0];
            var script = document.createElement("script");
            head.appendChild(script);
            $E.addOriginalEventListener(script, "load",onLoad );
            $E.addOriginalEventListener(script, "error",onError );
            script.src = path;
        },
        /**
        *图像加载，之后启动游戏
        **/
        start: function(gameObj, options) {//options:srcArray,onload
            var loaderContext = this;
            options=options||{};
            var srcArr = options.srcArray;
            this.startOptions = options.startOptions; //游戏开始需要的初始化参数
            this.onLoad = options.onLoad;
            this.gameObj = gameObj;
            this.sum = 0;
            J.cnGame.spriteList.clean();
            if(!srcArr){//如果没有资源需要加载，直接执行resourceLoad回调
                resourceLoad(this)();
            }
            else if (J.isArray(srcArr) || J.isObject(srcArr)) {
                
                for (var i in srcArr) {
                    if (srcArr.hasOwnProperty(i)) {
                        loaderContext.sum++;
                        var path = srcArr[i];
                        if(J.isObject(path)){
                            load(path);

                        }else{
                            var suffix = srcArr[i].substring(srcArr[i].lastIndexOf(".") + 1);
                            var type = file_type[suffix];
                            if (type == "image") {
                                this.loadImage(path,resourceLoad(loaderContext, "image"),resourceLoad(loaderContext, "error"));
                            }
                            else if (type == "audio") {
                                this.loadAudio(path,resourceLoad(loaderContext, "audio"),resourceLoad(loaderContext, "error"));       
                            }
                            else if (type == "js") {//如果是脚本，加载后执行
                                this.loadJS(path,resourceLoad(loaderContext, "js"),resourceLoad(loaderContext, "error"));

                            }

                        }
                        
                    }
                }

            }
            if(!loaderContext.sum){//传入的是空对象
                resourceLoad(this)();
            }

        }
    };
    J.cnGame=J.cnGame||{};
    J.cnGame.loader = loader;
});
/**
*
*movableObj对象
*
**/
Jx().$package(function(J){
    var restrict360=function(angle){
        angle=angle%(Math.PI*2);
        if(angle<0){
            angle+=Math.PI*2;
        }
        return angle;
    }
    var angleToRadian=function(angle){
        return angle/180*Math.PI;
    }
    var radianToAngle=function(radian){
        return radian*180/Math.PI;
    }
    var movableObj=new J.Class({
        /**
        *初始化
        **/
        init:function(options){
            var postive_infinity=Number.POSITIVE_INFINITY;
            /**
            *默认值
            **/
            this.pos= new Vector2(0,0);
            this.imgStart= [0,0];
            this.imgSize= [32,32];
            this.size= [32,32];
            this.angle= 0;
            this.speed= [Vector2.zero,0];
            this.a= [Vector2.zero,0];
            this.maxSpeed=postive_infinity;
            this.maxAngleSpeed=postive_infinity;
            this.maxPos=[postive_infinity,postive_infinity];
            this.minPos=[-postive_infinity,-postive_infinity];
            this.alpha=1;
            options = options || {};
            this.setOptions(options);           
            
        },
        /**
        *返回X方向速度
        **/
        getSpeedX:function(){
            return this.speed[0].x;
        },
        /**
        *返回Y方向速度
        **/
        getSpeedY:function(){
            return -this.speed[0].y;
        },
        /**
        *返回参照物相对于该对象的角度
        **/
        getRelatedAngle:function(elem){
            v=elem.pos[1].subtract(this.pos[1])

            var dy=-v.sy;
            var dx=v.x;
            var heading=this.getHeading();
            var posAngle=Math.atan2(dy,dx);
            relatedAngle=posAngle- angleToRadian(heading);
            if(relatedAngle<-Math.PI) relatedAngle+=2*Math.PI;
            else if(relatedAngle>Math.PI) relatedAngle-=2*Math.PI;
            return radianToAngle(relatedAngle);

        },
        /**
        *获取某对象到该对象距离
        **/        
        getDistance:function(elem){
            return Math.sqrt((elem.pos.x-this.pos.x)*(elem.pos.x-this.pos.x)+(elem.pos.y-this.pos.y)*(elem.pos.y-this.pos.y));
        },       
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *移动一定距离
        **/
        move: function(v) {
            this.pos=this.pos.add(v);
            return this;

        },
        /**
        *移动到某处
        **/
        moveTo: function(pos) {
            this.pos.x = Math.min(Math.max(this.minPos.x, pos.x), this.maxPos.x);
            this.pos.y = Math.min(Math.max(this.minPos.y, pos.y), this.maxPos.y);
            return this;
        },
        /**
        *旋转一定角度
        **/
        rotate: function(da) {//要旋转的角度
            da = da || 0;
            var angle=this.angle||0;
            this.angle = angle+da;
            restrict360(this.angle);
            return this;
        },
        /**
        *旋转到一定角度
        **/
        rotateTo: function(angle) {
            this.angle = angle;
            return this;
        },
        /**
        *停止移动
        **/
        stop:function(){
            this.speed=[Vector2.zero,0];   
            this.a=[Vector2.zero,0];
            return this;
        },
        resetPos:function(){
            if(this.prePos)
                this.pos=this.prePos;
            if(this.preAngle)
                this.angle=this.preAngle;
        },
        /**
        *更新位置
        **/
        update: function(duration) {//duration:该帧历时 单位：秒

            this.prePos=this.pos;
            this.preSpeed=this.speed.slice();
            this.preAngle=this.angle;
           
            this.speed[0]=this.speed[0].add(this.a[0].multiply(duration));
            this.pos=this.pos.add(this.speed[0].multiply(duration));

            //角速度 
            this.speed[1] = this.speed[1] + this.a[1] * duration; 
            this.rotate(this.speed[1]*duration);

        }

    });  
    J.cnGame=J.cnGame||{};
    J.cnGame.MovableObj=movableObj;
});
/*
*
*canvas基本形状对象
*
**/
Jx().$package(function(J){

    /**
    *矩形对象
    **/
    var rect =new J.Class({extend : J.cnGame.MovableObj},{
        /**
        *初始化
        **/
        init: function(options) {

            this.style="Red";
            this.angle=0;
            this.isFill=true;
            rect.superClass.init.call(this,options);

        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *绘制矩形
        **/
        draw: function() {
            var cg=J.cnGame;
            var context = J.cnGame.context;
            context.save()
            var point=this.pos;//默认的相对点为sprite的中点
            cg.view.apply(context);
            context.translate(point.x,point.y);
            context.rotate(this.angle * -1);
            context.globalAlpha=this.alpha;
            if (this.isFill) {
                context.fillStyle = this.style;
                context.fillRect(-this.size[0]/2, -this.size[1]/2 , this.size[0], this.size[1]);
            }
            else {
                context.strokeStyle = this.style;
                context.strokeRect(-this.size[0]/2, -this.size[1]/2, this.size[0], this.size[1]);
            }
            context.restore();
            return this;
        },
        /**
        *改变一定尺寸
        **/
        resize: function(dSize) {
            this.size[0] += dSize[0];
            this.size[1] += dSize[1];
            return this;
        },
        /**
        *改变到一定尺寸
        **/
        resizeTo: function(size) {
            this.width = size[0];
            this.height = size[1];
            return this;
        },
        /**
        *返回是否在某对象左边
        **/
        isLeftTo:function(obj,isCenter){//isCenter:是否以中点为依据判断
            if(isCenter) return this.pos.x<obj.pos.x;
            return this.pos.x+this.size[0]/2<obj.pos.x-obj.size[0]/2;
        },
        /**
        *返回是否在某对象右边
        **/
        isRightTo:function(obj,isCenter){
            if(isCenter) return this.pos.x>obj.pos.x;
            return this.pos.x-this.size[0]/2>obj.pos.x+obj.size[0]/2;
        },
        /**
        *返回是否在某对象上边
        **/
        isTopTo:function(obj,isCenter){
            if(isCenter) return this.pos.y<obj.pos.y;
            return this.pos.y+this.size[1]/2<obj.pos.y-obj.size[0]/2;
        },
        /**
        *返回是否在某对象下边
        **/
        isBottomTo:function(obj,isCenter){
            if(isCenter) return this.pos.y>obj.pos.y;
            return this.pos.y-this.size[0]/2>obj.pos.y+obj.size[1]/2;
        },
        /**
        *点是否在矩形内
        **/            
        isInside:function(v){
            var pointX=v.x;
            var pointY=v.y;
            var x=this.pos.x;
            var y=this.pos.y;
            var right=x+this.size[0];
            var bottom=y+this.size[1];
            return (pointX >= x && pointX <= right && pointY >= y && pointY <= bottom);
        },
        /**
        *返回正矩形的相对于某点的四个顶点坐标
        **/
        getPoints:function(v){
            
            var leftTop=[],rightTop=[],leftBottom=[],rightBottom=[],pos=[];
            //相对于point的坐标
            pos.x=this.pos.x-v.x;
            pos.y=v.y-this.pos.y;

            //相对于point的四个顶点坐标
            leftTop=new Vector2(pos.x-this.size[0]/2,pos.y-this.size[1]/2);
            rightTop=new Vector2(pos.x+this.size[0]/2,pos.y-this.size[1]/2);
            leftBottom=new Vector2(pos.x-this.size[0]/2,pos.y+this.size[1]/2);
            rightBottom=new Vector2(pos.x+this.size[0]/2,pos.y+this.size[1]/2);

            return[leftTop,rightTop,rightBottom,leftBottom];
        },
        /**
        *返回相对于某点包含该sprite的矩形对象
        **/
        getRect: function() {  
            var point=this.pos;//默认的相对点为sprite的中点
            var points=this.getPoints(point);
            var pointsArr=[];
            var angle=this.angle;
            for(var i=0,len=points.length;i<len;i++){
                var thePoint=points[i];
                //相对于某点旋转后的顶点坐标
                var newX=thePoint.x*Math.cos(angle)-thePoint.y*Math.sin(angle);
                var newY=thePoint.x*Math.sin(angle)+thePoint.y*Math.cos(angle);
                //从相对于某点的坐标系转换为相对于canvas的位置
                newX+=point.x;
                newY=point.y-newY;
                pointsArr.push(new Vector2(newX,newY));//四个顶点旋转后的坐标
            }
            return new J.cnGame.shape.Polygon({pointsArr:pointsArr});
        }
    });
    /**
    *圆形对象
    **/
    var circle =new J.Class({extend : J.cnGame.MovableObj},{
        /**
        *初始化
        **/
        init: function(options) {
            /**
            *默认值对象
            **/
            this.r = 100;
            this.startAngle= 0;
            this.endAngle= Math.PI * 2;
            this.antiClock= false;
            this.style= "red";
            this.isFill= true;
            options = options || {};
            circle.superClass.init.call(this,options);
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *绘制圆形
        **/
        draw: function() {
            var context = J.cnGame.context;
            context.globalAlpha=this.alpha;
            context.beginPath();
        
            context.arc(this.pos.x, this.pos.y, this.r, this.startAngle, this.endAngle, this.antiClock);
            context.closePath();
            if (this.isFill) {
                context.fillStyle = this.style;
                context.fill();
            }
            else {
                context.strokeStyle = this.style;
                context.stroke();
            }

        },
        /**
        *将圆形改变一定大小
        **/
        resize: function(dr) {
            dr = dr || 0;
            this.r += dr;
            return this;

        },
        /**
        *将圆形改变到特定大小
        **/
        resizeTo: function(r) {
            r = r || this.r;
            this.r = r;
            return this;
        },
        /**
        *返回是否在某对象左边
        **/
        isLeftTo:function(obj,isCenter){
            if(isCenter) return this.pos.x<obj.pos.x;
            return this.pos.x+this.r<obj.pos.x-obj.r;
        },
        /**
        *返回是否在某对象右边
        **/
        isRightTo:function(obj,isCenter){
            if(isCenter) return this.pos.x>obj.pos.x;
            return this.pos.x-this.r>obj.pos.x+obj.r;
        },
        /**
        *返回是否在某对象上边
        **/
        isTopTo:function(obj,isCenter){
            if(isCenter) return this.pos.y<obj.pos.y;
            return this.pos.y+this.r<obj.pos.y-obj.r;
        },
        /**
        *返回是否在某对象下边
        **/
        isBottomTo:function(obj,isCenter){
            if(isCenter) return this.pos.y>obj.pos.y;
            return this.pos.y-this.r>obj.pos.y+obj.r;
        },
        /**
        *点是否在圆形内
        **/
        isInside: function(v) {
            var pointX=v.x;
            var pointY=v.y;
            var x=this.pos.x;
            var y=this.pos.y;
            var r=this.r;
            return (Math.pow((pointX - x), 2) + Math.pow((pointY - y), 2) < Math.pow(r, 2));
        }
    });
    /**
    *将圆形改变到特定大小
    **/
    var text =new J.Class({extend : J.cnGame.MovableObj},{
        /**
        *初始化
        **/
        init: function(options) {
            this.text="test";
            this.style="red";
            this.isFill=true;
            this.context=J.cnGame.context;
            options = options || {};
            text.superClass.init.call(this,options);
        },
        /**
        *绘制
        **/
        draw: function() {
            var context = this.context; 
            context.save();
            context.globalAlpha=this.alpha;
            (!J.isUndefined(this.font)) && (context.font = this.font);
            (!J.isUndefined(this.textBaseline)) && (context.textBaseline = this.textBaseline);
            (!J.isUndefined(this.textAlign)) && (context.textAlign = this.textAlign);
            (!J.isUndefined(this.maxWidth)) && (context.maxWidth = this.maxWidth);
            if (this.isFill) {
                context.fillStyle = this.style;
                this.maxWidth ? context.fillText(this.text, this.pos.x, this.pos.y, this.maxWidth) : context.fillText(this.text, this.pos.x, this.pos.y);
            }
            else {
                context.strokeStyle = this.style;
                this.maxWidth ? context.strokeText(this.text, this.pos.x, this.pos.y, this.maxWidth) : context.strokeText(this.text, this.pos.x, this.pos.y);
            }
            context.restore();
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        }
    });
    /*  线段  */
    var line=new J.Class({
        /**
        *初始化
        **/
        init: function(options) {   
            this.start=Vector2.zero;
            this.end=Vector2.zero; 
            this.style="red";
            this.lineWidth=1;
            this.alpha=1;
            this.context=J.cnGame.context;
            options = options || {};
            this.setOptions(options);
        },
        /**
        *判断线段和另一条线段是否相交
        **/
        isCross:function(newLine){
            var start=this.start;
            var end=this.end;
            var newStart=newLine.start;
            var newEnd=newLine.end;
            var point=[];
            if(start.x==end.x){//垂直
                if(newStart.y==newEnd.y){
                    if(((start.x-newStart.x)*(start.x-newEnd.x)<=0)&&((start.y-newStart.y)*(end.y-newStart.y)<=0))
                       // return true;
                    return [newStart.x,start.y];
                }
            }
            else if(start.y==end.y){//水平
                if(newStart.x==newEnd.x){
                    if(((start.y-newStart.y)*(start.y-newEnd.y)<=0)&&((start.x-newStart.x)*(end.x-newStart.x)<=0)){
                        //return true;
                        return [newStart.x,start.y];
                    }
                }
            }
            
            var k1=(end.y-start.y)/(end.x-start.x);//所在直线斜率
            var b1=end.y-end.x*k1;//所在直线截距
            
            var k2=(newEnd.y-newStart.y)/(newEnd.x-newStart.x);//新线段所在直线斜率
            var b2=newEnd.y-newEnd.x*k2;//新线段所在直线截距

            if(k1==k2){
                if(start.y==newStart.y){
                    return (start.x<newStart.x&&end.x>newStart.x)||(newStart.x<start.x&&newEnd.x>start.x);
                }
                else if(start.x==newStart.x){
                    return (start.y<newStart.y&&end.y>newStart.y)||(newStart.y<start.y&&newEnd.y>start.y);
                }
            }
          
            //这里线段A的端点在线段B上，还不算相交
            if(((newStart.x*k1+b1-newStart.x)*(newEnd.x*k1+b1-newEnd.y))<=0&&((start.x*k2+b2-start.y)*(end.x*k2+b2-end.y))<=0){     
                var pointX=(b1-b2)/(k2-k1);     
                return new Vector2(Math.round(pointX),Math.round(k2*pointX+b2));   
            }
            return false;
            
        },
        /**
        *绘制
        **/
        draw: function() {
            var ctx=J.cnGame.context;
            var start=this.start;
            var end=this.end;
            
            ctx.save();
            ctx.strokeStyle = this.style;
            ctx.lineWidth = this.lineWidth;
            ctx.globalAlpha=this.alpha;
            ctx.beginPath(); 
            ctx.lineTo(start.x,start.y);
            ctx.lineTo(end.x,end.y);
            ctx.closePath();  
            ctx.stroke();
            ctx.restore();
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        }
    });
    
    /*  多边形 */
    var polygon=new J.Class({
        init:function(options){
            this.pointsArr=[];//所有顶点数组
            this.style="black";
            this.lineWidth=1;
            this.alpha=1;
            this.isFill=true;
            options=options||{};
            this.setOptions(options);  
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *判断某点是否在多边形内(射线法)
        **/
        isInside:function(point){
            var lines=this.getLineSegs();

            var count=0;//相交的边的数量
            var lLine=new Line({start:new Vector2(point.x,point.y),end:new Vector2(-9999,point[1])});//左射线
            var crossPointArr=[];//相交的点的数组
            for(var i=0,len=lines.length;i<len;i++){
                var crossPoint=lLine.isCross(lines[i]);
                if(crossPoint){
                    for(var j=0,len2=crossPointArr.length;j<len2;j++){
                        //如果交点和之前的交点相同，即表明交点为多边形的顶点
                        if(crossPointArr[j].x==crossPoint.x&&crossPointArr[j].y==crossPoint.y){
                            break;  
                        }
                        
                    }
                    if(j==len2){
                        crossPointArr.push(crossPoint); 
                        count++;
                    }
                    
                }
            }
            if(count%2==0){//不包含
                return false;
            }
            return true;//包含
        },
        /**
        *获取多边形的线段集合
        **/
        getLineSegs:function(){
            var pointsArr=this.pointsArr.slice();//点集合
            pointsArr.push(pointsArr[0]);
            var lineSegsArr=[];
            for(var i=0,len=pointsArr.length;i<len-1;i++){
                var point=pointsArr[i];
                var nextPoint=pointsArr[i+1];
                var newLine=new line({start:new Vector2(point.x,point.y),end:new Vector2(nextPoint[0],nextPoint[1])});
                lineSegsArr.push(newLine);
            }
            return lineSegsArr;
            
        },
        /**
        *返回多边形各个点坐标
        **/
        getPoints:function(){
            return this.pointsArr.slice();
        },
        /**
        *绘制
        **/
        draw:function(){
            var ctx=J.cnGame.context;
            ctx.save();
            ctx.globalAlpha=this.alpha;
            ctx.beginPath();
            
            for(var i=0,len=this.pointsArr.length;i<len-1;i++){
                var start=this.pointsArr[i];
                var end=this.pointsArr[i+1];
                ctx.lineTo(start.x,start.y);
                ctx.lineTo(end.x,end.y);        
            }
            ctx.closePath();
            if(this.isFill){
                ctx.fillStyle = this.style;
                ctx.fill(); 
            }
            else{
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = this.style;
                ctx.stroke();   
            }  
            ctx.restore();
        }  
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.shape=J.cnGame.shape||{};
    J.cnGame.shape.Polygon=polygon;
    J.cnGame.shape.Line = line;
    J.cnGame.shape.Text = text;
    J.cnGame.shape.Rect = rect;
    J.cnGame.shape.Circle = circle;
});

/**
*
*事件模块
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var eventManager={
        /**
        *订阅
        **/
        subscribe:function(target,evtName,func,context){
            var newFunc;
            var targetEvts=target.events=target.events||{};
            targetEvts[evtName]=targetEvts[evtName]||[];
            if(!J.isArray(func)){
               func=[func]; 
            }
            for(var i=0,len=func.length;i<len;i++){
                (newFunc=function(){func[arguments.callee.i].apply(context,arguments);}).i=i;
                newFunc.oriFunc=func[i];
                targetEvts[evtName].push(newFunc);
            }
        },
        /**
        *通知
        **/
        notify:function(target,evtName,evtObj){
            var evtsArr;
            //if(evtName=="hitWall")
            if(target.events&&(evtsArr=target.events[evtName])){
                for(var i=0,len=evtsArr.length;i<len;i++){
                    if(cg.core.isFunction(evtsArr[i])){
                        evtsArr[i](evtObj);
                    }
                }
            }   
        },
        remove:function(target,evtName,func){
            if(target.events){
                var evtsArr=target.events[evtName];
                if(evtsArr){
                    for(var i=0,len=evtsArr.length;i<len;i++){
                        if(evtsArr[i].oriFunc===func){
                            evtsArr.splice(i,1);
                            return;
                        }
                    }
                }
            }
        }
    };
    J.cnGame=J.cnGame||{};
    J.cnGame.eventManager=eventManager;
});

/**
*
*输入记录模块
*
**/
Jx().$package(function(J){
    var input={};                                     
    input.mouse={};
    input.mouse.x = 0;
    input.mouse.y = 0;
    var m=[];
    m[0]= m[1] ="left";
    m[2]="right";
    /**
    *鼠标按下触发的处理函数
    **/
    var mousedown_callbacks = {};
    /**
    *鼠标松开触发的处理函数
    **/
    var mouseup_callbacks = {};
    /**
    *鼠标移动触发的处理函数
    **/
    var mousemove_callbacks = [];
    
    /**
    *记录鼠标在canvas内的位置
    **/
    var recordMouseMove = function(eve) {
        var pageX, pageY, x, y;
        eve = eve||window.event;
        pageX = eve.pageX || eve.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
        pageY = eve.pageY || eve.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
        if(J.cnGame.pos){
            J.cnGame.input.mouse.x = pageX - J.cnGame.pos.x;
            J.cnGame.input.mouse.y = pageY - J.cnGame.pos.y;
        }
        for (var i = 0, len = mousemove_callbacks.length; i < len; i++) {
            mousemove_callbacks[i]();
        }
    }
    /**
    *记录鼠标按键
    **/
    var recordMouseDown=function(eve){
        eve = eve||window.event;
        var pressed_btn=m[eve.button];
        if(pressed_btn=="left"){//左键按下
            J.cnGame.input.mouse.left_pressed=true;
        }
        else if(pressed_btn=="right"){//右键按下
            J.cnGame.input.mouse.right_pressed=true;
        }
        var callBacksArr=mousedown_callbacks[pressed_btn];
        if(callBacksArr&&callBacksArr.length){
            for (var i = 0, len = callBacksArr.length; i < len; i++) {
                callBacksArr[i]();
            }   
        }
    }
    /**
    *记录鼠标松开的键
    **/
    var recordMouseUp=function(eve){
        
        eve = J.cnGame.core.getEventObj(eve);
        var pressed_btn=m[eve.button];
        if(pressed_btn=="left"){//左键松开
            J.cnGame.input.mouse.left_pressed=false;
        }
        else if(pressed_btn=="right"){//右键松开
            btn=J.cnGame.input.mouse.right_pressed=false;
        }
        var callBacksArr=mouseup_callbacks[pressed_btn];
        if(callBacksArr&&callBacksArr.length){
            for (var i = 0, len = callBacksArr.length; i < len; i++) {
                callBacksArr[i]();
            }   
        }
    }
    $E.addOriginalEventListener(window, "mousemove", recordMouseMove);
    $E.addOriginalEventListener(window, "mousedown", recordMouseDown);
    $E.addOriginalEventListener(window, "mouseup", recordMouseUp);
    
    

    /**
    *绑定鼠标按下事件
    **/
    input.onMouseDown = function(buttonName, handler) {
        buttonName = buttonName || "all";
        if (J.isUndefined(mousedown_callbacks[buttonName])) {
            mousedown_callbacks[buttonName] = [];
        }
        mousedown_callbacks[buttonName].push(handler);
    };
    /**
    *绑定鼠标松开事件
    **/
    input.onMouseUp = function(buttonName, handler) {
        buttonName = buttonName || "all";
        if (J.isUndefined(mouseup_callbacks[buttonName])) {
            mouseup_callbacks[buttonName] = [];
        }
        
        mouseup_callbacks[buttonName].push(handler);
    };
    /**
    *绑定鼠标松开事件
    **/
    input.onMouseMove = function(handler) {  
        mousemove_callbacks.push(handler);
    };
    

    /**
    *被按下的键的集合
    **/
    var pressed_keys = {};
    /**
    *要求禁止默认行为的键的集合
    **/
    var preventDefault_keys = {};
    /**
    *键盘按下触发的处理函数
    **/
    var keydown_callbacks = {};
    /**
    *键盘弹起触发的处理函数
    **/
    var keyup_callbacks = {};


    /**
    *键盘按键编码和键名
    **/
    var k = [];
    k[8] = "backspace"
    k[9] = "tab"
    k[13] = "enter"
    k[16] = "shift"
    k[17] = "ctrl"
    k[18] = "alt"
    k[19] = "pause"
    k[20] = "capslock"
    k[27] = "esc"
    k[32] = "space"
    k[33] = "pageup"
    k[34] = "pagedown"
    k[35] = "end"
    k[36] = "home"
    k[37] = "left"
    k[38] = "up"
    k[39] = "right"
    k[40] = "down"
    k[45] = "insert"
    k[46] = "delete"

    k[91] = "leftwindowkey"
    k[92] = "rightwindowkey"
    k[93] = "selectkey"
    k[106] = "multiply"
    k[107] = "add"
    k[109] = "subtract"
    k[110] = "decimalpoint"
    k[111] = "divide"

    k[144] = "numlock"
    k[145] = "scrollock"
    k[186] = "semicolon"
    k[187] = "equalsign"
    k[188] = "comma"
    k[189] = "dash"
    k[190] = "period"
    k[191] = "forwardslash"
    k[192] = "graveaccent"
    k[219] = "openbracket"
    k[220] = "backslash"
    k[221] = "closebracket"
    k[222] = "singlequote"

    var numpadkeys = ["numpad1", "numpad2", "numpad3", "numpad4", "numpad5", "numpad6", "numpad7", "numpad8", "numpad9"]
    var fkeys = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"]
    var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    for (var i = 0; numbers[i]; i++) { k[48 + i] = numbers[i] }
    for (var i = 0; letters[i]; i++) { k[65 + i] = letters[i] }
    for (var i = 0; numpadkeys[i]; i++) { k[96 + i] = numpadkeys[i] }
    for (var i = 0; fkeys[i]; i++) { k[112 + i] = fkeys[i] }


    /**
    *记录键盘按下的键
    **/
    var recordPress = function(eve) {
        eve = eve||window.event;
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = true;
        if (keydown_callbacks[keyName]) {
            for (var i = 0, len = keydown_callbacks[keyName].length; i < len; i++) {
                keydown_callbacks[keyName][i]();

            }

        }
        if (keydown_callbacks["allKeys"]) {
            for (var i = 0, len = keydown_callbacks["allKeys"].length; i < len; i++) {
                keydown_callbacks["allKeys"][i]();

            }
        }
        if (preventDefault_keys[keyName]) {
            eve.preventDefault();
        }
    }
    /**
    *记录键盘松开的键
    **/
    var recordUp = function(eve) {
        eve = eve||window.event;
        var keyName = k[eve.keyCode];
        pressed_keys[keyName] = false;
        if (keyup_callbacks[keyName]) {
            for (var i = 0, len = keyup_callbacks[keyName].length; i < len; i++) {
                keyup_callbacks[keyName][i]();

            }
        }
        if (keyup_callbacks["allKeys"]) {
            for (var i = 0, len = keyup_callbacks["allKeys"].length; i < len; i++) {
                keyup_callbacks["allKeys"][i]();

            }
        }
        if (preventDefault_keys[keyName]) {
            J.cnGame.core.preventDefault(eve);
        }
    }
    $E.addOriginalEventListener(window, "keydown", recordPress);
    $E.addOriginalEventListener(window, "keyup", recordUp);

    /**
    *判断某个键是否按下
    **/
    input.isPressed = function(keyName) {
        return !!pressed_keys[keyName];
    };
    /**
    *禁止某个键按下的默认行为
    **/
    input.preventDefault = function(keyName) {
        if (J.isArray(keyName)) {
            for (var i = 0, len = keyName.length; i < len; i++) {
                arguments.callee.call(input, keyName[i]);
            }
        }
        else {
            preventDefault_keys[keyName] = true;
        }
    }
    /**
    *绑定键盘按下事件
    **/
    input.onKeyDown = function(keyName, handler,context) {
        keyName = keyName || "allKeys";
        if (J.isUndefined(keydown_callbacks[keyName])) {
            keydown_callbacks[keyName] = [];
        }
        keydown_callbacks[keyName].push(function(){
            handler.apply(context,arguments)
        });

    }
    /**
    *绑定键盘弹起事件
    **/
    input.onKeyUp = function(keyName, handler) {
        keyName = keyName || "allKeys";
        if (J.isUndefined(keyup_callbacks[keyName])) {
            keyup_callbacks[keyName] = [];
        }
        keyup_callbacks[keyName].push(handler);

    }
    /**
    *清除键盘按下事件处理程序
    **/
    input.clearDownCallbacks = function(keyName) {
        if (keyName) {
            keydown_callbacks[keyName] = [];
        }
        else {
            keydown_callbacks = {};
        }

    }
    /**
    *清除键盘弹起事件处理程序
    **/
    input.clearUpCallbacks = function(keyName) {
        if (keyName) {
            keyup_callbacks[keyName] = [];
        }
        else {
            keyup_callbacks = {};
        }
    };

    J.cnGame=J.cnGame||{};
    input.key=k;
    J.cnGame.input=input;
});

/**
*
*碰撞检测
*
**/
Jx().$package(function(J){
    var collision={};

    /**
    *矩形和矩形间的碰撞
    **/
    collision.col_Between_Rects = function(rectObjA, rectObjB) {
        return ((rectObjA.x+rectObjA.width >= rectObjB.x && rectObjA.x+rectObjA.width <= rectObjB.right || rectObjA.x >= rectObjB.x && rectObjA.x <= rectObjB.right) && (rectObjA.y+rectObjA.height >= rectObjB.y && rectObjA.y+rectObjA.height <= rectObjB.y+rectObjB.height || rectObjA.y <= rectObjB.y+rectObjB.height && rectObjA.y+rectObjA.height >= rectObjB.y));
    };
    /**
    *圆形和圆形间的碰撞
    **/
    collision.col_between_Circles = function(circleObjA, circleObjB) {
        return (Math.pow((circleObjA.x - circleObjB.x), 2) + Math.pow((circleObjA.y - circleObjB.y), 2) < Math.pow((circleObjA.r + circleObjB).r, 2));

    };
    /**
    *多边形间的碰撞
    **/
    collision.col_between_Polygons=function(polygonA , polygonB){
        var linesA=polygonA.getLineSegs();
        var linesB=polygonB.getLineSegs();
        
        for(var i=0,len=linesA.length;i<len;i++){
            for(var j=0,len2=linesB.length;j<len2;j++){
                if(linesA[i].isCross(linesB[j])){
                    return true;    
                }
            }
        }
        return false;
    };
    /**
    *多边形和线段间的碰撞
    **/        
    collision.col_Line_Polygon=function(line,polygon){
        var lines=polygon.getLineSegs();
        for(var i=0,len=lines.length;i<len;i++){
            if(line.isCross(lines[i])){
        
                return true;
            }
        }
        return false;
    };

    /**
    *旋转矩形间的碰撞
    **/  


    //获取该矩形上的垂直的两个轴
    var getTwoAxis=function(rectPointsArr){
        var p0=rectPointsArr[0];
        var p1=rectPointsArr[1];
        var p2=rectPointsArr[2];
        axis1=[p0,p1];
        axis2=[p1,p2];
        return [axis1,axis2];
    };
    //获取该矩形上的四条边
    var getFourLines=function(rectPointsArr){
        var p0=rectPointsArr[0];
        var p1=rectPointsArr[1];
        var p2=rectPointsArr[2];
        var p3=rectPointsArr[3];
        var l1=[p0,p1];
        var l2=[p1,p2];
        var l3=[p2,p3];
        var l4=[p3,p0];
        return [l1,l2,l3,l4];

    }
    var getTYPoing=function(p,axis){//获取点在轴上的投影点
        //顶点在轴上的投影
        var x=((p.x*axis.x+p.y*axis.y)/(axis.x*axis.x+axis.y*axis.y))*axis.x;
        var y=((p.x*axis.x+p.y*axis.y)/(axis.x*axis.x+axis.y*axis.y))*axis.y;
        return new Vector2(x,y);
    };
    var getLineTYToAxis=function(line,axis){//线到轴的投影
    
        var a=new Vector2(axis[1].x-axis[0].x,axis[1].y-axis[0].y);//轴向量
        var p0=line[0];//线的一个顶点0
        var p1=line[1];//线的一个顶点1
        var pt0=getTYPoing(p0,a);
        var pt1=getTYPoing(p1,a);
        return [pt0,pt1];
        
    };
    var isLineOverlap=function(l1,l2){//判断线段是否重叠
        
        var l1p1=l1[0],l1p2=l1[1],l2p1=l2[0],l2p2=l2[1];
        if(l1p1.x!=l2p1.x){//非垂直X轴的两线段
            if((l1p1.x-l2p1.x)*(l1p1.x-l2p2.x)<0||(l1p2.x-l2p1.x)*(l1p2.x-l2p2.x)<0||(l2p1.x-l1p1.x)*(l2p1.x-l1p2.x)<0||(l2p2.x-l1p1.x)*(l2p2.x-l1p2.x)<0){
                return true;
            }
        }
        else{
            if((l1p1.y-l2p1.y)*(l1p1.y-l2p2.y)<0||(l1p2.y-l2p1.y)*(l1p2.y-l2p2.y)<0||(l2p1.y-l1p1.y)*(l2p1.y-l1p2.y)<0||(l2p2.y-l1p1.y)*(l2p2.y-l1p2.y)<0){
                return true;
            }           
        }
        return false;
    }
    var detectAxisCollision=function(axis,lineArr){//矩形的轴和另一个矩形要比较的四个边
        
        for(var i=0,len=lineArr.length;i<len;i++){
            var tyLine=getLineTYToAxis(lineArr[i],axis);//获取线段在轴上的投影线段 [[a,b],[a1,b1]]
            var tyAxis=getLineTYToAxis(axis,axis);
            
            if(isLineOverlap(tyLine,tyAxis)){
                return true;
            }
        }
        return false;
    };

    collision.rotateRectCollisionDetect=function(r1,r2){
        var rect1=r1.getRect();
        var rect2=r2.getRect();

        var linesArr1=getFourLines(rect1.pointsArr);//矩形1的四个边
        var linesArr2=getFourLines(rect2.pointsArr);//矩形2的四个边

        
        if(detectAxisCollision(linesArr2[0],linesArr1)&&detectAxisCollision(linesArr2[1],linesArr1)&&detectAxisCollision(linesArr1[0],linesArr2)&&detectAxisCollision(linesArr1[1],linesArr2)){
            return true;
        }
        return false;
    };


    J.cnGame=J.cnGame||{};
    J.cnGame.collision=collision;
});

/**
*
*帧动画
*
**/
Jx().$package(function(J){

    var cg=J.cnGame;
    /**
    *帧的增量
    **/
    var path = 1;
    /**
    *获取帧集合
    **/
    var caculateFrames = function() {
        var frames = [];
        var size = this.size;
        var beginPos = this.beginPos;
        var frameSize = this.frameSize;
        var direction = this.direction;


        /* 保存每一帧的精确位置 */
        if (direction == "right") {
            for (var y = beginPos[1]; y < size[1] ; y += frameSize[1]) {
                for (var x = beginPos[0]; x < size[0]; x += frameSize[0]) {
                    var frame = {};
                    frame.startPos=[];
                    frame.startPos[0] = x;
                    frame.startPos[1] = y;
                    frames.push(frame);
                }
            }
        }
        else {
            for (var x = beginPos[0]; x < size[0]; x += frameSize[0]) {
                for (var y = beginPos[1]; y < size[1]; y += frameSize[1]) {
                    var frame = {};
                    frame.startPos=[];
                    frame.startPos[0] = x;
                    frame.startPos[1] = y;
                    frames.push(frame);
                }
            }
        }

        return frames;

    }
    /**
    *包含多帧图像的大图片
    **/
    spriteSheet =new J.Class({
        /**
        *初始化
        **/
        init: function(options) {
            /**
            *默认值
            **/
            this.id="0";
            this.size=[400,40];
            this.pos=options.pos;
            this.frameSize= [40, 40];//每帧尺寸
            this.frameDuration= 100;//每帧持续时间
            this.direction= "right", //从左到右
            this.beginPos=[0,0];//截取图片的起始位置
            this.loop= false;//是否循环播放
            this.bounce= false;//是否往返播放
            this.scale=1;//缩放比
            this.currentIndex = 0;                  //目前帧索引
            this.context=J.cnGame.context;//使用的上下文对象，默认是框架的context
            this.onFinish = null;           //播放完毕后的回调函数
            this.now = new Date().getTime();            //当前时间
            this.last = new Date().getTime();       //上一帧开始时间
            options = options || {};
            J.extend(this, options);
            this.image = J.cnGame.loader.loadedImgs[this.src]; //图片对象
            this.frames = caculateFrames.call(this);    //帧信息集合
        },
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },
        /**
        *更新帧
        **/
        update: function() {

            this.now = new Date().getTime();
            var frames = this.frames;
            if ((this.now - this.last) >= this.frameDuration) {//如果间隔大于等于帧间间隔，则update
                var currentIndex = this.currentIndex;
                var length = this.frames.length;
                this.last = this.now;

                if (currentIndex >= length - 1) {
                    if (this.loop) {    //循环
                        return frames[this.currentIndex = 0];
                    }
                    else if (!this.bounce) {//没有循环并且没有往返滚动，则停止在最后一帧
                        this.onFinish && this.onFinish();
                        return frames[currentIndex];
                    }
                }
                if ((this.bounce) && ((currentIndex >= length - 1 && path > 0) || (currentIndex <= 0 && path < 0))) {   //往返
                    path *= (-1);
                }
                this.currentIndex += path;

            }
            return frames[this.currentIndex];
        },
        /**
        *跳到特定帧
        **/
        index: function(index) {
            this.currentIndex = index;
            return this.frames[this.currentIndex];
        },
        /**
        *获取现时帧
        **/
        getCurrentFrame: function() {
            return this.frames[this.currentIndex];
        },
        /**
        *在特定位置绘制该帧
        **/
        draw: function() {

            var currentFrame = this.getCurrentFrame();
            var width = this.frameSize[0];
            var height = this.frameSize[1];
            var context=this.context;
            context.save()
            var point=this.pos;//默认的相对点为sprite的中点
            cg.view.apply(context);
            context.translate(point.x,point.y);
            context.rotate(this.angle * -1);

            this.context.drawImage(this.image, currentFrame.startPos[0], currentFrame.startPos[1], width, height,-width/2,-height/2, width*this.scale, height*this.scale);
     
            context.restore();
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.SpriteSheet = spriteSheet;

});

/**
*
*sprite对象
*
**/
Jx().$package(function(J){

    var postive_infinity = Number.POSITIVE_INFINITY;
    var spriteList=[];
    var cg=J.cnGame;

    var sprite = new J.Class({extend : J.cnGame.shape.Rect},{
        /**
        *初始化
        **/
        init: function(options) {
            sprite.superClass.init.call(this,options);
            this.context=options.context||J.cnGame.context;
            this.spriteSheetList = {};

            if (this.src) { //传入图片路径
                this.setCurrentImage(this.src);
            }
            else if (this.spriteSheet) {//传入spriteSheet对象
                this.addAnimation(this.spriteSheet);
                this.setCurrentAnimation(this.spriteSheet);
            }

        },
        /*      
        *添加动画
        **/
        addAnimation: function(spriteSheet) {
            spriteSheet.relatedSprite=this;
            this.spriteSheetList[spriteSheet.id] = spriteSheet;
        },
        /**
        *设置当前显示动画
        **/
        setCurrentAnimation: function(id) {//可传入id或spriteSheet
            if (!this.isCurrentAnimation(id)) {
                if (J.isString(id)) {
                    this.spriteSheet = this.spriteSheetList[id];
                    if(this.spriteSheet){
                        this.size=[this.spriteSheet.frameSize[0],this.spriteSheet.frameSize[1]];
                        this.image = null;
                    }
                }
                else if (J.isObject(id)) {
                    this.spriteSheet = id;
                    if(this.spriteSheet){
                        var frameSize=this.spriteSheet.frameSize;
                        this.size=[frameSize[0],frameSize[1]];
                        this.addAnimation(id);
                        this.image = this.imgStart = null;
                    }
                }
            }

        },
        /**
        *判断当前动画是否为该id的动画
        **/
        isCurrentAnimation: function(id) {
            var spriteSheet=this.spriteSheet;
            if (J.isString(id)) {
                return (spriteSheet && spriteSheet.id === id);
            }
            else if (J.isObject(id)) {
                return spriteSheet === id;
            }
        },
        /**
        *设置当前显示图像
        **/
        setCurrentImage: function(src) {
      
            var image = J.cnGame.loader.loadedImgs[src];
            if (!this.isCurrentImage(src)) {
                this.image = image;
                this.spriteSheet = null;
            }
        },
        /**
        *判断当前图像是否为该src的图像
        **/
        isCurrentImage: function(src) {
            var image = this.image;
            if(image&&src){
                if (J.isString(src)) {
                    return (image.srcPath === src );
                }
                else{
                    return image==src;
                }
                
            }
            return false;       
        },
        /**
        *跳到特定帧
        **/
        index:function(index){
            var spriteSheet=this.spriteSheet;
            spriteSheet&&spriteSheet.index(index);      
        },

        /**
        *更新位置和帧动画
        **/
        update: function(duration) {//duration:该帧历时 单位：秒
    
            sprite.superClass.update.call(this,duration);

            if (this.spriteSheet) {//更新spriteSheet动画

                this.spriteSheet.pos = this.pos;
                this.spriteSheet.update();
            }
        },
        /**
        *绘制出sprite
        **/
        draw: function() {
            var context = this.context;
            var halfWith;
            var halfHeight;

            if (this.spriteSheet) {
                this.spriteSheet.pos = this.pos.copy();
                this.spriteSheet.angle=this.angle;
                this.spriteSheet.draw();
            }
            else if (this.image) {
            
                context.save()
                var img=this.image;
                var point=this.pos;//默认的相对点为sprite的中点
                halfWith = this.size[0] / 2;
                halfHeight = this.size[1] / 2;
                cg.view.apply(context);
                context.translate(point.x,point.y);
                context.rotate(this.angle * -1);
                context.globalAlpha=this.alpha;
                context.drawImage(this.image, 0, 0, img.width,img.height,-halfWith,-halfHeight, this.size[0], this.size[1]);
                context.restore();
            }
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Sprite = sprite;

});
/**
 *
 *Sprite列表
 *
**/
Jx().$package(function(J){
    var SpriteList=new J.Class({
        init:function(){
            this.list=[];
        },
        get:function(index){//传入索引或条件函数
            if(J.isUndefined(index)){
                return this.list.slice();
            }
            if(J.isNumber(index)){
                return this.list[index];
            }
            else if(J.isFunction(index)){
                
                var arr=[];
                for(var i=0,len=this.list.length;i<len;i++){
                    if(index(this.list[i])){
                        arr.push(this.list[i]);
                    }
                }
                return arr;
            }
        },
        add: function(sprite) {
            this.list.push(sprite);
        },
        remove: function(sprite) {//传入sprite或条件函数
            for (var i = 0, len = this.list.length; i < len; i++) {
                if (this.list[i] === sprite||(J.cnGame.core.isFunction(sprite)&&sprite(this.list[i]))) {
                    this.list.splice(i, 1);
                    i--;
                    len--;
                }
            }
        },
        clean: function() {
            for (var i = 0, len = this.list.length; i < len; i++) {
                this.list.pop();
            }
        },
        sort: function(func) {
            this.list.sort(func);
        },
        getLength:function(){
            return this.list.length;
        },
        update:function(duration){
            for (var i = 0;i < this.list.length; i++) {
                if(this.list[i]&&this.list[i].update){
                    this.list[i].update(duration);
                }
            }
        },
        draw:function(){
            for (var i = 0;i < this.list.length; i++) {
                if(this.list[i]&&this.list[i].draw){
                    this.list[i].draw();
                }
            }               
            
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.SpriteList=SpriteList;
});
/**
 *
 *动画
 *
**/
Jx().$package(function(J){

    // function bezier(points, pos) {
    //     var n = points.length,
    //     r = [],
    //     i,
    //     j
    //     for (i = 0; i < n; ++i) {
    //         r[i] = [points[i][0], points[i][1]]
    //     }
    //     for (j = 1; j < n; ++j) {
    //         for (i = 0; i < n - j; ++i) {
    //             r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
    //             r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
    //         }
    //     }
    //     return [r[0][0], r[0][1]];
    // };
    var list=[];//动画队列
    /**
    *动画类
    **/  
    var Animation=new J.Class({
        /**
        *初始化
        **/            
        init:function(options){
            this.targetElem=null;    //目标对象  
            this.propertyName="";//属性名
            this.duration=0;    //变化耗时
            this.onFinished=null;//完成动画的回调
            this.tweenFun=Animation.tweenObj.linear;                    //使用的缓动方法，默认为匀速线性运动
            this.setOptions(options);
            this.from=parseFloat(this.from||0);   //初始值
            this.to=parseFloat(this.to||0);                            //目标值
            this.changeDistance=this.to-this.from;                     //变化距离

        },   
        /**
        *设置移动参数
        **/
        setOptions: function(options) { 
            J.cnGame.core.extend(this, options);
        },

        /**
        *动画更新
        **/            
        update:function(){
          
            var time=Date.now()-this.startTime;//历时
            var p=time/this.duration;
            if(p>=1){//完成动画
               this.onFinished&&this.onFinished.call(this);
               Animation.remove(this);
               return; 
            }
          
            var currentValue=this.changeDistance*this.tweenFun(time/this.duration)+this.from;  
            this.targetElem[this.propertyName]=currentValue;
            
        
        }
    });
    J.extend(Animation,{
         /**
          *添加动画
         **/            
        add:function(animation){
            list.push(animation);
            animation.startTime=Date.now();//设置初始时间
        },
        /**
        *移除动画
        **/
        remove:function(animation){
            for(var i=0;i<list.length;i++){
                if(list[i]===animation){
                    list.splice(i,1);
                    return;
                }
            }                
        },
        /**
        *更新队列中的动画
        **/ 
        update:function(){
            for(var i=0;i<list.length;i++){
                list[i].update();
            }
        },
        /**
        *缓动函数对象
        **/ 
        tweenObj:{
            linear:function(p){//传入运行时间占总运行时间的百分比
                return p;
            },
            cubic: {
                easeIn: function(p){
                    return p*p*p;
                },
                easeOut: function(p){
                    return (p-=1)*p*p+1;
                },
                easeInOut: function(p){
                    if ((p/2) < 1){
                        return p*p*p/2;
                    }
                    return ((p-=2)*p*p + 2)/2;
                }
            }                
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Animation=Animation;
});

/**
*
*游戏循环
*
**/
Jx().$package(function(J){

    var timeId;
    var delay;
    var requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.oRequestAnimationFrame
    || function(callback) {
        setTimeout(callback, delay);
    };
    var drawLastTime;
    var updateLastTime;
    var isDraw=function(){
        var frameDuration=1000/this.fps;
        if(!drawLastTime) drawLastTime=Date.now();
        else if(Date.now()-drawLastTime>=Math.floor(turnDuration)) {    
            return true;
        }
        else return false;
    }
    /**
    *循环方法
    **/
    var loop = function() {
        var self = this;
        var sumFPS=0;
        var sumTPS=0;
        var fpsCount=0;
        var tpsCount=0;
        var sumUpdateTime=0;
        var sumDrawTime=0;
        self.avgTPS=self.tps;
        self.avgFPS=self.fps;


        return function() {

            self.interval = 1000 / self.tps;
            var now = Date.now();
            var tpsDuration = (now - updateLastTime); //帧历时
            updateLastTime = now;
            
            ////console.log(duration);
            if(self.pause){
                updateLastTime=now;
                drawLastTime=now;
            }
            else if (!self.pause && !self.stop) {

                if(sumUpdateTime>=1000){
                    self.avgTPS = tpsCount;//计算平均tps
                    tpsCount=0;
                    sumUpdateTime=0;
                }
                sumUpdateTime+=tpsDuration;
                tpsCount++;

                J.cnGame.updateCanvasPos();
                
                if (self.gameObj.update) {//调用游戏对象的update
                    self.gameObj.update(tpsDuration / 1000);
                }

                var Animation = J.cnGame.Animation;
                //动画队列更新
                Animation.update();
                //更新所有sprite
                J.cnGame.spriteList.update(1/self.tps); 
                
                var fpsDuration = (now - drawLastTime); //帧历时
             
                if(self.fps==self.tps||fpsDuration>=1000/self.fps){
               
                    if(sumDrawTime>1000){
                        sumDrawTime=0;
                        self.avgFPS=fpsCount;
                        fpsCount=0;
                    }
                    sumDrawTime+=fpsDuration;
                    fpsCount++;
    

                    J.cnGame.clean();
                    J.cnGame.drawBg();//绘制背景色
                    if (self.gameObj.draw) {
                        self.gameObj.draw(fpsDuration / 1000);
                    }
                    J.cnGame.spriteList.draw();  
                    drawLastTime=now;
                }
    
                if (tpsDuration > self.interval) {//修正delay时间
                    delay = Math.max(1, self.interval - (tpsDuration - self.interval));
                }
                else{
                    delay=self.interval;
                }
            }
        
            if(self.tps==60) {
                timeId = requestAnimationFrame(arguments.callee);
            }
            else {
                timeId = window.setTimeout(arguments.callee, delay); 
            }
        }
    };
    /**
    *游戏循环构造函数
    **/
    var gameLoop =new J.Class({
        /**
        *初始化
        **/
        init: function(gameObj, options) {
            /**
            *默认对象
            **/
            var defaultObj = {
                tps: 60,
                fps:60
            };
            options = options || {};
            options = J.extend(defaultObj, options);
            this.gameObj = gameObj;
            this.avgFPS=this.fps = options.fps;
            this.avgTPS=this.tps = options.tps;
            this.interval = delay = 1000 / this.tps;
            this.pause = false;
            this.stop = true;
        },

        /**
        *开始循环
        **/
        start: function() {
            if (this.stop) {        //如果是结束状态则可以开始
                this.stop = false;
                drawLastTime=updateLastTime=Date.now();
                if(this.tps==60){
                   requestAnimationFrame(loop.call(this));
                }
                else{
                    window.setTimeout(loop.call(this),delay);
                }
                
            }
        },  
        /**
        *继续循环
        **/
        runLoop: function() {
            this.pause = false;
        },
        /**
        *暂停循环
        **/
        pauseLoop: function() {
            this.pause = true;
        },
        /**
        *停止循环
        **/
        end: function() {
            this.stop = true;
            window.clearTimeout(timeId);
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.GameLoop = gameLoop;
});

/**
*
*地图
*
**/
/*Jx().$package(function(J){
    /**
    *层按zIndex由小到大排序
    **/                            
  /*  var sortLayers=function(layersList){
        layersList.sort(function(layer1,layer2){
            if (layer1.zIndex > layer2.zIndex) {
                return 1;
            }
            else if (layer1.zIndex < layer2.zIndex) {
                return -1;
            }
            else {
                return 0;
            }                
        });     
    }
    /**
    *层对象
    **/                            
  /*  var layer = new J.Class({
        
        /**
        *初始化
        **/
       /* init: function(id,mapMatrix,options) {
            /**
            *默认对象
            **/ 
          /*  var defaultObj = {
                cellSize: [32, 32],   //方格宽，高
                x: 0,                 //layer起始x
                y: 0                  //layer起始y

            };  
            options = options || {};
            options = J.extend(defaultObj, options);
            this.id=options.id;
            this.mapMatrix = mapMatrix;
            this.cellSize = options.cellSize;
            this.x = options.x;
            this.y = options.y;
            this.row = mapMatrix.length; //有多少行
            this.width=this.cellSize[0]* mapMatrix[0].length;
            this.height=this.cellSize[1]* this.row;
            this.spriteList=new J.cnGame.SpriteList();//该层上的sprite列表
            this.imgsReference=options.imgsReference;//图片引用字典：{"1":{src:"xxx.png",x:0,y:0},"2":{src:"xxx.png",x:1,y:1}}
            this.zIindex=options.zIndex;
        },
        /**
        *添加sprite
        **/         
      /*  addSprites:function(sprites){
            if (J.isArray(sprites)) {
                for (var i = 0, len = sprites.length; i < len; i++) {
                    arguments.callee.call(this, sprites[i]);
                }
            }
            else{
                this.spriteList.add(sprites);
                sprites.layer=this;
            }               
            
        },
        /**
        *获取特定对象在layer中处于的方格的值
        **/
       /* getPosValue: function(x, y) {
            if (J.isObject(x)) {
                y = x.y;
                x = x.x;
            }
            var isUndefined = J.isUndefined;
            y = Math.floor(y / this.cellSize[1]);
            x = Math.floor(x / this.cellSize[0]);
            if (!isUndefined(this.mapMatrix[y]) && !isUndefined(this.mapMatrix[y][x])) {
                return this.mapMatrix[y][x];
            }
            return undefined;
        },
        /**
        *获取特定对象在layer中处于的方格索引
        **/
     /*   getCurrentIndex: function(x, y) {
            if (J.isObject(x)) {
                y = x.y;
                x = x.x;
            }
            return [Math.floor(x / this.cellSize[0]), Math.floor(y / this.cellSize[1])];
        },
        /**
        *获取特定对象是否刚好与格子重合
        **/
       /* isMatchCell: function(x, y) {
            if (J.isObject(x)) {
                y = x.y;
                x = x.x;
            }
            return (x % this.cellSize[0] == 0) && (y % this.cellSize[1] == 0);
        },
        /**
        *设置layer对应位置的值
        **/
     /*   setPosValue: function(x, y, value) {
            this.mapMatrix[y][x] = value;
        },
        /**
        *更新层上的sprite列表
        **/         
       /* update:function(duration){
            this.spriteList.update(duration);
            
        },
        /**
        *根据layer的矩阵绘制layer和该layer上的所有sprite
        **/
    /*    draw: function() {
            var mapMatrix = this.mapMatrix;
            var beginX = this.x;
            var beginY = this.y;
            var cellSize = this.cellSize;
            var currentRow;
            var currentCol
            var currentObj;
            var row = this.row;
            var img;
            var col;
            for (var i = beginY, ylen = beginY + row * cellSize[1]; i < ylen; i += cellSize[1]) {   //根据地图矩阵，绘制每个方格
                currentRow = (i - beginY) / cellSize[1];
                col=mapMatrix[currentRow].length;
                for (var j = beginX, xlen = beginX + col * cellSize[0]; j < xlen; j += cellSize[0]) {
                    currentCol = (j - beginX) / cellSize[0];
                    currentObj = this.imgsReference[mapMatrix[currentRow][currentCol]];
                    if(currentObj){
                        currentObj.x = currentObj.x || 0;
                        currentObj.y = currentObj.y || 0;
                        img = J.cnGame.loader.loadedImgs[currentObj.src];
                        //绘制特定坐标的图像
                        J.cnGame.context.drawImage(img, currentObj.x, currentObj.y, cellSize[0], cellSize[1], j, i, cellSize[0], cellSize[1]); 
                    }
                }
            }
            //更新该layer上所有sprite
            this.spriteList.draw();

        }
    });
    
    
    
    /**
    *地图对象
    **/
   /* var map = new J.Class({
        /**
        *初始化
        **/
       /* init: function(options) {
            /**
            *默认对象
            **/
           /* var defaultObj = {
                layers:[],
                x:0,
                y:0,
                width:100,
                height:100

            };
            options = options || {};
            options = J.extend(defaultObj, options);
            this.layers=options.layers;
            this.x=options.x;
            this.y=options.y;
            this.width=options.width;
            this.height=options.height;
            this.enviroment=options.enviroment;//地形layer
        },
        /**
        *添加layer
        **/
      /*  addLayer:function(layers){
            if (J.isArray(layers)) {
                for (var i = 0, len = layers.length; i < len; i++) {
                    arguments.callee.call(this, layers[i]);
                }
            }
            else{
                layers.x=this.x;
                layers.y=this.y;
                this.layers.push(layers);
                sortLayers(this.layers);
            }
            
        },
        /**
        *获取某个layer
        **/         
        /*getLayer:function(id){
            for (var i = 0, len = this.layers.length; i < len; i++) {
                if(this.layers[i].id==id){
                    return  this.layers[i];
                }
            }           
        },
        /**
        *更新所有layer
        **/
       /* update:function(duration){
            for(var i=0,len=this.layers.length;i<len;i++){
                this.layers[i].x=this.x;
                this.layers[i].y=this.y;
                this.layers[i].update(duration);                
            }               
        },          
        /**
        *绘制所有layer
        **/
       /* draw:function(){
            for(var i=0,len=this.layers.length;i<len;i++){
                this.layers[i].draw();              
            }               
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.Layer = layer;
    J.cnGame.Map = map;

});

/**
*
*map2
*
**/
/*Jx().$package(function(J){

    var cg=J.cnGame;

    var MapElement=new J.Class({extend : J.cnGame.Sprite},{
        init:function(options){
            
            options.coor=options.coor||[0,0];
            options.cols=options.cols||3;
            options.rows=options.rows||3;
            options.gridSize= options.gridSize||[32,32];

            var coor=options.coor;
            var gridSize=options.gridSize;
            var gw=gridSize[0];
            var gh=gridSize[1];
            options.size=[options.cols*gw,options.rows*gh];
            options.pos= new Vector2(coor[0]*gw+options.size[0]/2,coor[1]*gh+options.size[1]/2);
      
            MapElement.superClass.init.call(this,options);
        },
        isInnerElement:function(coor){
            var c1=this.coor;
            var c2=coor;
            var rows=this.rows;
            var cols=this.cols;

            if(c2[0]>=c1[0]&&c2[0]<=c1[0]+cols-1&&c2[1]>=c1[1]&&c2[1]<=c1[1]+rows-1){
                return true;
            }
            return false;
                
        }
    });

    var Map2=new J.Class({
        init:function(options){
            this.gridSize=options.gridSize||[32,32];
            this.elemList=[];
        },
        add:function(elem){
            elem.gridSize=this.gridSize;
            elem.map=this;
            this.elemList.push(elem);
        },
        getInnerElement:function(v){
            var x=v.x;
            var y=v.y;
            var gridSize=this.gridSize;
            var xi=Math.floor(x/gridSize[0]);
            var yi=Math.floor(y/gridSize[1]);
            var elemList=[];
            for(var i=0,len=this.elemList.length;i<len;i++){
                var elem=this.elemList[i];
                if(elem.isInnerElement([xi,yi])){
                    elemList.push(elem);
                }
            }
            return elemList;
        },
        remove:function(elem){
            for(var i=0,len=this.elemList.length;i<len;i++){
                if(this.elemList[i]==elem){
                    this.elemList.splice(i,1);   
                    return;   
                }
               
            }

        },
        update:function(duration){
            for(var i=0;i<this.elemList.length;i++){
                this.elemList[i].update(duration);
            }            
        },
        draw:function(){
            for(var i=0;i<this.elemList.length;i++){
                this.elemList[i].draw();
            }
        }
    });
    J.cnGame=J.cnGame||{};
    J.cnGame.MapElement = MapElement;  
    J.cnGame.Map2 = Map2;    
});

*/

/**
*
*障碍物范围
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var BlockRange=new J.Class({extend:cg.shape.Rect},{
        init:function(options){
            options=options||{};
            this.pos=options.pos||[0,0];
            this.size=options.size||[32,32];
            BlockRange.superClass.init.call(this,options);
            this.layerElement=options.layerElement;//所在元素
            this.layerElement=options.layerElement;
           
        },
        draw:function(){//blockrange绘制 测试使用
            var cg=J.cnGame;
            var context = cg.context;
            context.save()
            var point=this.pos;
            context.translate(point.x,point.y);
            context.fillStyle = this.style;
            context.fillRect(-this.size[0]/2, -this.size[1]/2 , this.size[0], this.size[1]);
            context.restore();
            return this;
        },
        isInnerRange:function(point){
            var l=this.layerElement;
            var x=point[0],y=point[1];
            var bx=l.pos.x+this.pos[0],by=l.pos.y+this.pos[1];
            var bw=this.size[0],bh=this.size[1];
            if(x>bx&&x<bx+bw&&y>by&&y<by+bh){
                return true;
            }
            return false;
        },
        isCollideWithBlock:function(r){
            //修复为全局位置 全局位置下进行障碍物和对象的碰撞检测
            var le=this.layerElement;
            var lw=le.size[0],lh=le.size[1];
            var newRange=this.clone();
            newRange.pos=newRange.pos.add(new Vector2(-lw/2,-lh/2)).add(this.layerElement.pos);
            return cg.collision.rotateRectCollisionDetect(newRange,r);
        },
        clone:function(){
            return new BlockRange({
                pos:this.pos.copy(),
                size:this.size.slice()
            });
        }
    });
    cg.BlockRange=BlockRange;
});
/**
*
*层元素
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var LayerElement=new J.Class({extend:cg.Sprite},{
        init:function(options){
            options=options||{};
            options.blockRanges=options.blockRanges||[];
            options.pos=options.pos||[0,0];
            options.size=options.size||[32,32];
            LayerElement.superClass.init.call(this,options);

            var src=options.src;
            var self=this;
            this.src=src;
            this.zIndex=options.zIndex;
           
            cg.loader.loadImage(src,function(){
                self.image=this;
            });
        },
        addBlockRange:function(br){
            this.blockRanges.push(br);
        },
        draw:function(){
            if(!this.image) return;
            var img=this.image;
            var x=this.pos.x;
            var y=this.pos.y;
            var w=this.size[0];
            var h=this.size[1];
            var ctx=cg.context;
            ctx.save();
            cg.view.apply(ctx);
            ctx.translate(x,y);
            ctx.drawImage(img,0,0,img.width,img.height,-w/2,-h/2,w,h);
            ctx.translate(-w/2,-h/2);
            //this.drawBlockRanges(); //测试使用
            ctx.restore();
            //layerElement.superClass.draw.call(this);

        },
        drawBlockRanges:function(){
            var brs=this.blockRanges;
            for(var i=0,l=brs.length;i<l;i++){
                brs[i].draw();
            }
        },
        isInnerBlockRange:function(point){
            var brs=this.blockRanges;
            for(var j=0,l=brs.length;j<l;j++){
                var br=brs[j];
                if(br.isInnerRange(point)){
                    return true;
                }
            }
            return false;
        },
        isCollideWithBlock:function(r){
            var brs=this.blockRanges;
            for(var j=0,l=brs.length;j<l;j++){
                var br=brs[j];
                if(br.isCollideWithBlock(r)){
                    return true;
                }
            }
            return false;
        }
    });
    cg.LayerElement=LayerElement;
});
/**
*
*层
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var Layer=new J.Class({
        init:function(options){
            options=options||{};
            this.layerElements=options.layerElements||[];
            this.size=options.size||[100,100];
            this.zIndex=options.zIndex||0;
            this.stage=options.stage;
        },
        addLayerElement:function(le){
            this.layerElements.push(le);        
        },
        draw:function(){
            var le=this.layerElements;
            for(i=0,l=le.length;i<l;i++){
                le[i].draw();
            }            
        },
        isInnerBlockRange:function(point){
            var les=this.layerElements;

            for(var i=0,l=les.length;i<l;i++){
                var le=les[i];
                if(le.isInnerBlockRange(point)){//返回层元素
                    return le;
                }
            }
            return false;
        },
        removeLayerElement:function(le){
            var les=this.layerElements;
            for(var i=0,l=les.length;i<l;i++){
                if(les[i]==le){
                    les.splice(i,1);
                    return;
                }
            }
        },
        isCollideWithBlock:function(r){
            var les=this.layerElements;

            for(var i=0,l=les.length;i<l;i++){
                var le=les[i];
                if(le.isCollideWithBlock(r)){//返回层元素
                    return le;
                }
            }
            return false;
        }
    });
    cg.Layer=Layer;
});
/**
*
*舞台
*
**/
Jx().$package(function(J){
    var cg=J.cnGame;
    var Stage=new J.Class({
        init:function(options){
            options=options||{};
            this.layers=options.layers||[];
        },
        addLayer:function(l){
            this.layers.push(l);
        },
        draw:function(){
            this.sortLayers();
            var ls=this.layers;
            for(var i=0,l=ls.length;i<l;i++){
                ls[i].draw();
            }
        },
        sortLayers:function(){
            this.layers.sort(function(a,b){
                var  az=a.zIndex,bz=b.zIndex;
                if(az>bz) return 1;
                else if(az==bz) return 0;
                else return -1;
            });
        },
        getLayer:function(layerIndex){
            var ly=this.layers;
            for(var i=0,l=ly.length;i<l;i++){
                if(ly[i].zIndex==layerIndex){
                    return ly[i];
                }
            }
        },
        isInnerBlockRange:function(point,layerIndex){
            var layer=this.getLayer(layerIndex);
            return layer&&layer.isInnerBlockRange(point);
        },
        isCollideWithBlock:function(r,layerIndex){
            var layer=this.getLayer(layerIndex);
            return layer&&layer.isCollideWithBlock(r);
        },
        removeLayerElement:function(le,layerIndex){
            var l=this.getLayer(layerIndex);
            l.removeLayerElement(le);
        }
    });

    cg.Stage=Stage;
});

/**
*
*场景
*
**/
Jx().$package(function(J){

    var cg=J.cnGame;
    var view = new J.Class({

        /**
        *初始化
        **/
        init: function(options) {
            this.size=cg.size.slice();
            this.pos=new Vector2(cg.width/2,cg.height/2);
        },
        /**
        *使player的位置保持在场景中点之前的移动背景
        **/
        translate: function(pos) {
            this.pos=pos;
        },
        apply:function(ctx){
            var s=this.size;
            var pos=this.pos;
            //view距离初始位置的距离
            var dx=pos.x-cg.width/2;
            var dy=pos.y-cg.height/2;
            ctx.translate(-dx,-dy);
        },
        draw:function(){
            var ctx=this.context;
            var p=this.pos;

            var s=this.size;
            ctx.save();
            ctx.translate(p.x,p.y,-s[0]/2,-s[1]/2);
            ctx.draw();
            ctx.restore();
        },
        /**
        *判断对象是否在view内
        **/
        isPartlyInsideView:function(sprite){
            var spriteRect=sprite.getRect();
            var viewRect=this.getRect();
            return J.cnGame.collision.col_Between_Rects(spriteRect,viewRect);
            
        },
        /**
        *使坐标相对于view
        **/
        applyInView:function(func){ 
            J.cnGame.context.save();
            J.cnGame.context.translate(-this.x, -this.y);
            func();
            J.cnGame.context.restore();
        },
        /**
        *返回包含该view的矩形对象
        **/
        getRect: function() {
            return new J.cnGame.shape.Rect({ x: this.x, y: this.y, width: this.width, height: this.height });
        }

    });
    J.cnGame=J.cnGame||{};
    J.cnGame.View = view;
});

/**
*
*UI类
*
**//*
cnGame.register("cnGame.ui", function(cg) {
    /*  点击回调    */                                
    /*var clickCallBacks={};
    
    var recordClick=function(){
            
        
    }
    /*  按钮  */
   /* var button=cg.class(function(options){
        this.init(options);
        cg.core.bindHandler(cg.canvas,"click",recordClick);
        
    }).methods({
        init:function(options){
            
            this.setOptions(options);           
                        
        },
        onClick:function(){
            
        },
        setOptions:function(options){
            cg.core.extend(this,options);
            
        }
        
        
    });
                                      
});*/


Jx().$package('WallComing', function(J){
	var $D = J.dom,
		$A = J.array,
		$E = J.event;

	var VIModule = {
		init: function() {
			this.video = document.getElementById('video');
			this.screenCtx = $D.id('screen').getContext('2d');
			this.compareCtx = $D.id('compare').getContext('2d'); 
			this.photoContent = $D.id('photo_content');
			this.captureRange = $D.id('captureRange');
			this.canvasW = 1024;
			this.canvasH = 768;
			this.len = 1024*768*4;
			this.rate = 30;
			this.range = 40;
			this.photoSrc = [];
			this.bgTimeout = null;

			var logoUrl = "images/wc_logo.png";
			this.logo = J.cnGame.loader.loadedImgs[logoUrl];

		},

		addSense: function(sense){
			this.sense = this.sense || [];
			this.sense.push(sense);
		},

		update:function(){	
			this.drawVideo();
		},

		reset:function(){
			this.photoSrc = [];
		},

		//获取每帧图像并与背景比较
		drawVideo: function(){
			var beginWall = WallComing.wcmain.wallManager.beginWall;
			if(beginWall){
				this.catched = false;
				this.draw();
				this.calculate();
			}else if(!this.catched){
				this.catchPhoto();
				this.catched = true;
			}
		},

		//在canvas上画视频图像
		draw:function(){
			this.screenCtx.save();
			this.screenCtx.scale(-1, 1);
			this.screenCtx.drawImage(this.video, -this.canvasW, 0, this.canvasW, this.canvasH);
			this.screenCtx.restore();
		},

		//捕捉并显示背景
		captureBg:function(){
			if(!this.bgTimeout){
				this.capturing = true;
				this.draw();
				var lastData = this.screenCtx.getImageData(0, 0, this.canvasW, this.canvasH),
					self = this,
					start = +new Date();
				var delayClock = false;
				this.bgTimeout = setInterval(function(){
					self.draw();					 
					if(delayClock){
						var currentData = self.screenCtx.getImageData(0, 0, self.canvasW, self.canvasH),
						now = +new Date();
						if(!self.diffrence(lastData, currentData)){
							if(now - start >= 1000){
								self.baseData = currentData;
								$E.notifyObservers(self, "endCapture");
								self.capturing = false;
								clearInterval(self.bgTimeout);
								self.bgTimeout = null;
							}
						}else{
							//debugger;
							start = now;
							lastData = currentData;
						}
					}else{
						setTimeout(function(){
							delayClock = true;
						},2000);
					}
				}, 1000 / 60);
			}
		},

		//手动截取
		captureNow:function(){
			delayClock = true;
			if(this.bgTimeout){
				this.baseData = this.screenCtx.getImageData(0, 0, this.canvasW, this.canvasH);
				$E.notifyObservers(this, "endCapture");
				this.capturing = false;
				clearInterval(this.bgTimeout);
				this.bgTimeout = null;
			}
		},

		//两帧图像间是否有差异（帧间差法）
		diffrence:function(lastBaseData, currentBaseData){
			var	lastBaseD = lastBaseData.data,
			currentBaseD = currentBaseData.data,
			//range = captureRange.value,
			range = 30,
			grayL,
			grayC,
			leftC = 195,
			widthC = 620,
			width = currentBaseData.width,
			height = currentBaseData.height,
			i,
			j,
			k,
			diff = 0;

			//console.log("阈值为:" + range);

			// for (var i = 0, len = this.len; i < len; i = i + 4) {
			// 	grayL = lastBaseD[i]*0.3 + lastBaseD[i + 1]*0.59 + lastBaseD[i + 2]*0.11,
			// 	grayC = currentBaseD[i]*0.3 + currentBaseD[i + 1]*0.59 + currentBaseD[i + 2]*0.11;

			// 	if(grayL - grayC > range){
			// 		return true;
			// 	}
			// }

			for(j = 0; j < height - 1; j += 1){
				for(i = 0; i < width - 1; i += 1){
					if(i >= 195 && i <= 815){
						k = 4 * (width * j + i);
						grayL = lastBaseD[k]*0.3 + lastBaseD[k + 1]*0.59 + lastBaseD[k + 2]*0.11,
						grayC = currentBaseD[k]*0.3 + currentBaseD[k + 1]*0.59 + currentBaseD[k + 2]*0.11;

						if(grayL - grayC > range){
							diff += 1;
						}
					}
				}
			}

			if(diff >= 1500){
				return true;
			}else {
				return false;
			}

		},

		//前景检测（背景差法）
		processCompare: function(screenData) {
			//var now = +new Date();
			//this.filtering(baseData, 3);
			//this.filtering(screenData, 3);

			var baseD = this.baseData.data,
			screenD = screenData.data,
			grayB,
			grayR;

			for (var i = 0, len = this.len; i < len; i += 4) {
				grayB = baseD[i]*0.3 + baseD[i + 1]*0.59 + baseD[i + 2]*0.11,
				grayS = screenD[i]*0.3 + screenD[i + 1]*0.59 + screenD[i + 2]*0.11;

				if(Math.abs(grayS - grayB) > this.range){
					screenD[i] = 0;
					screenD[i + 1] = 191;
					screenD[i + 2] = 243;
					screenD[i + 3] = 175;
				}else {
					screenD[i + 3] = 0;
				}
			}

			// for (var i = 0, len = this.len; i < len; i += 4) {
			// 	if(Math.abs(baseD[i] - screenD[i]) > this.range || Math.abs(baseD[i + 1] - screenD[i + 1]) > this.range || Math.abs(baseD[i + 2] - screenD[i + 2]) > this.range){
			// 		screenD[i] = 0;
			// 		screenD[i + 1] = 0;
			// 		screenD[i + 2] = 250;
			// 		screenD[i + 3] = 175;
			// 	}else {
			// 		screenD[i + 3] = 0;
			// 	}
			// }

			//this.swell(screenData, 3);
			//this.corrosion(screenData, 3);
			////console.log((+new Date())-now);
			this.compareCtx.putImageData(screenData, 0, 0);
		},

		/*动态背景检测*/
		processCompareSense: function(screenData) {
			this.lastData = this.lastData || screenData;
			var baseD = this.lastData.data,
			screenD = screenData.data,
			grayB,
			grayR;

			var compareData = this.compareCtx.getImageData(0,0,1024,768);

			for (var i = 0, len = this.len; i < len; i += 4) {
				grayB = baseD[i]*0.3 + baseD[i + 1]*0.59 + baseD[i + 2]*0.11,
				grayS = screenD[i]*0.3 + screenD[i + 1]*0.59 + screenD[i + 2]*0.11;
				var condition = baseD[i] - screenD[i] + baseD[i+1] - screenD[i+1] + screenD[i+2] - screenD[i+2];
				var c = compareData.data;
				if(condition > 10){
					c[i] = 255;
					c[i + 1] = 255;
					c[i + 2] = 255;
					c[i + 3] = 175;
				}else {
					c[i] = 0;
					c[i + 1] = 0;
					c[i + 2] = 0;
					c[i + 3] = 0;
				}
			}
			this.compareCtx.putImageData(compareData, 0, 0);
			this.lastData = screenData;
		},


		processCompareS: function(screenData){
			this.binarization(screenData);
			var resultData = this.swell(screenData),
			resultD = resultData.data;
			for (var i = 0, len = this.len; i < len; i += 4) {
				if(resultD[i] != 0){
					resultD[i] = 0;
					resultD[i + 1] = 0;
					resultD[i + 2] = 250;
					resultD[i + 3] = 175;
				}
			}
			this.compareCtx.putImageData(resultData, 0, 0);
		},

		//清空显示的canvas
		clearCompare:function(){
			this.compareCtx.clearRect(0, 0, this.canvasW, this.canvasH);
		},
		clearScreen:function(){
			this.screenCtx.clearRect(0, 0, this.canvasW, this.canvasH);
		},

		//图像二值化
		binarization: function(screenData){
			var baseD = this.baseData.data,
			screenD = screenData.data,
			grayB,
			grayR;

			for (var i = 0, len = this.len; i < len; i += 4) {
				grayB = baseD[i]*0.3 + baseD[i + 1]*0.59 + baseD[i + 2]*0.11,
				grayS = screenD[i]*0.3 + screenD[i + 1]*0.59 + screenD[i + 2]*0.11;

				if(Math.abs(grayS - grayB) > this.range){
					screenD[i] = 1;
				}else {
					screenD[i] = 0;
				}
			}


			// for (var i = 0, len = this.len; i < len; i += 4) {
			// 	if(Math.abs(baseD[i] - screenD[i]) > this.range || Math.abs(baseD[i + 1] - screenD[i + 1]) > this.range || Math.abs(baseD[i + 2] - screenD[i + 2]) > this.range){
			// 		screenD[i] = 1;
			// 	}else {
			// 		screenD[i] = 0;
			// 	}
			// }

		},

		//图像去噪(均值滤波)
		filtering: function(imgdata){
			var data = imgdata.data,
			width = imgdata.width,
			height = imgdata.height,
			w = 4*width,
			i,
			j,
			k,
			l,
			sum;

			for(j = 1; j < height - 1; j += 1){
				for(i = 1; i < width - 1; i += 1){
					k = 4 * (width * j + i);
					sum = 0;
					sum += data[k] + data[k - 4] + data[k + 4];
					sum += (data[k] + data[k - 4] + data[k + 4]);
					l = k - w;
					sum += data[l] + data[l - 4] + data[l + 4];
					l = k + w;
					sum += data[l] + data[l - 4] + data[l + 4];
					data[k] = sum / 9;
				}
			}
		},

		//图像腐蚀（细化边缘）
		corrosion: function(imgdata){
			var data = imgdata.data,
			width = imgdata.width,
			height = imgdata.height,
			w = 4*width,
			i,
			j,
			k,
			l,
			sum;

			var result = this.screenCtx.createImageData(width, height);

			for(j = 1; j < height - 1; j += 1){
				for(i = 1; i < width - 1; i += 1){
					k = 4 * (width * j + i);
					if(data[k] == 0){
						result[k] = result[k - 4] = result[k + 4] = 0;
						l = k - w;
						result[l] = result[l - 4] = result[l + 4] = 0;
						l = k + w;
						result[l] = result[l - 4] = result[l + 4] = 0;
					}
				}
			}

			return result;
		},

		//图像膨胀（填充缝隙）
		swell: function(imgdata){
			var data = imgdata.data,
			width = imgdata.width,
			height = imgdata.height,
			w = 4*width,
			i,
			j,
			k,
			l,
			sum;

			var resultData = this.screenCtx.createImageData(width, height),
			resultD = resultData.data;

			for(j = 1; j < height - 1; j += 1){
				for(i = 1; i < width - 1; i += 1){
					k = 4 * (width * j + i);
					if(data[k] != 0){
						resultD[k] = resultD[k - 4] = resultD[k + 4] = 1;
						l = k - w;
						resultD[l] = resultD[l - 4] = resultD[l + 4] = 1;
						l = k + w;
						resultD[l] = resultD[l - 4] = resultD[l + 4] = 1;
					}
				}
			}

			return resultData;
		},

		//定格快照
		catchPhoto: function(){
			//拍照
			this.screenCtx.drawImage(this.logo, 10, 658);
			var src = this.screenCtx.canvas.toDataURL(),
			li = document.createElement("li"),
			img = new Image(),
			self=this;
			li.appendChild(img);
			img.onload = function(){
				self.photoContent.appendChild(li);
			}
			this.photoSrc.push(src);
			img.src = src;

			//定格
			var compareData = this.compareCtx.getImageData(0, 0, this.canvasW, this.canvasH),
			compareD = compareData.data;
			for(var i = 0, len = this.len; i < len; i = i + 4) {
				if(compareD[i + 3] != 0){
					compareD[i] = 218;
					compareD[i + 1] = 29;
					compareD[i + 2] = 91;
					compareD[i + 3] = 200;
				}
			}

			this.compareCtx.putImageData(compareData, 0, 0);
		},

		//当前帧图像处理
		calculate: function() {
			this.processCompare(this.screenCtx.getImageData(0, 0, this.canvasW, this.canvasH));
		}, 

		//像素检测
		compareAlpha:function(srcImageData, targetImageData){
			//console.log(srcImageData.data.length / 4, targetImageData.data.length / 4);
			var diffcount = 0;
			var invokeCount = 0;
			var validCount = 0;
			var passCount = 0;
			// for(var i = 0; i < srcImageData.data.length; i = i + 4){
			// 	if(srcImageData.data[i+3]  == 175){
			// 		validCount ++;
			// 		// var diff = Math.abs(srcImageData.data[i+3] - targetImageData.data[i+3]);
			// 		// if( diff < 100 && diff > 50){
			// 		// 	diffcount ++;
			// 		// }
			// 	}

			// 	if(srcImageData.data[i+3] > 0){
			// 		invokeCount ++;
			// 	}
			// }

			// for(var i = 0; i < targetImageData.data.length; i = i + 4){
			// 	////console.log(targetImageData.data[i+3]);
			// 	if(targetImageData.data[i+3] > 250){
			// 		invokeCount ++;
			// 	}
			// 	if(targetImageData.data[i+3] == 51){
			// 		validCount ++;
			// 	}
			// }

			for(var i = 0; i < srcImageData.data.length - 120 * 1024 * 4; i = i + 4){
				var sd = srcImageData.data,
				td = targetImageData.data;
				if(sd[i+3]  == 175){
					validCount ++;
					////console.log(td[i+3]);
					var diff = Math.abs(sd[i+3] - td[i+3]);
					if( diff < 81 && diff > 69){
						diffcount ++;
					}	
					else{
						td[i] = 255;
					}					
					if( diff == 124){
						passCount ++;
					}
				}

				if(sd[i+3] > 0){
					invokeCount ++;
				}
			}	
			//console.log('valid count:', validCount);
			//console.log('pass count:', passCount);
			//console.log('invokeCount:', invokeCount);
			//console.log('diffcount:', diffcount, diffcount/invokeCount);
			return {
				invokeCount: invokeCount,
				rate : diffcount/invokeCount
			}
		}
	}

	var createSenseRegion = function(activeCtx, region){
		/**
		 * region event: 对一个区域进行Sense检测
		 *  	moveIn  ： 捕获有效数据进入
		 *  	moveOut ： 捕获有效数据离开
		 *  	hover   ： 捕获有效数据停留
		 *  	left    ： 捕获有效数据向左运动
		 *  	right   ： 捕获有效数据向右运动
		 *  	up      ： 捕获有效数据向上运动
		 *  	down　  ： 捕获有效数据向下运动
		 *  	
		 * region定义： rect(left, top, width, height)
		 * 
		 * @type {Object}
		 */
		var Sense = {
			/**
			 * activeCtx  绘制有效区域canvas的context
			 */
			init: function(activeCtx, region){
				this.video = document.getElementById('video');
				this.activeCtx = activeCtx || $D.id('compare').getContext('2d'); 
				this.threshold = 0.3;
				this.step = 3;    //每step帧处理一次, 标准总的60帧,raf
				this.isPaused = false;
				this.canvasW = 1024;
				this.canvasH = 768;
				this.hoverCount = 0;
				this.moveCount = 0;
				this.moveDirection = 0;  //取值1, -1(right/down , left/up);
				this.orientation = 'h';
				// this.region = {
				// 	left:0,
				// 	top:500,
				// 	width: 800,
				// 	height:258
				// }
				this.region = region;
				this.frameCount = 0;
				this.lastActiveCheck = {
					max: 0,
					min: 0,
					valid: 0, 
					total: 0
				}

				this.hoverOption ={
					base: 0.2,     //valid rate > base 开始hover检测
					checkCount: 6  //连续达到base的检测次数到达checkCount抛出hover事件
				}

				this.moveOption = {
					base: 0.05,   //valid rate
					checkCount: 2 //连续保持checkCount次运动趋势变化，则抛出相应的move事件
				}
				//测试
				// var image = new Image(),
				// 	_this = this;
				// image.src = 'images/region.png';
				// image.onload = function(){
				// 	var i = -20;
				// 	setInterval(function(){
				// 		_this.activeCtx.clearRect(0,0, _this.canvasW, _this.canvasH);
				// 		i++;
				// 		_this.orientation == 'v'? _this.activeCtx.drawImage(image,0,i*30) : _this.activeCtx.drawImage(image,i*30,0);
				// 		if(i == 35){
				// 			//i = -20;
				// 			Sense.stopTrack();
				// 		}
				// 	}, 100);
				// 	Sense.startTrack();
				// }			
			},

			setOrientation: function(orientation){
				this.orientation = orientation;
			},

			stopTrack: function(){
				this.isPaused = true;
			},

			startTrack: function(){
				// var _this = this;
				// WallComing.Util.rafLoop(function(){
				// 	_this.process();
				// });
				// this.isPaused = false;
			},

			resumeTrack: function(){
				this.isPaused = false;
			},

			process: function(){
				if(this.isPaused){
					return;
				}
				// //监控处理，抛出相应的事件
				// this.frameCount ++;

				// //每隔this.step帧处理一次
				// if(this.frameCount % this.step != 0){
				// 	return;
				// }

				//console.log('process');

				var regionStep = 10;
				this._checkRegion(this.activeCtx, this.region, regionStep, this.orientation);
				//this.stopTrack();
			},

			/**
			 * [_checkRegion description]
			 * @param  {[type]} activeCtx   [description]
			 * @param  {[type]} region      [description]
			 * @param  {[type]} regionStep  [description]
			 * @param  {[type]} orientation 检测方向
			 *                              h 水平方向
			 *                              v 垂直方向
			 * @return {[type]}             [description]
			 */
			_checkRegion: function(activeCtx, region, regionStep, orientation){
				orientation = orientation || 'h';
				this.orientation = orientation;
				if(orientation == 'h'){
					var num = region.width / regionStep;
					// //console.log('num:', num);
					var rs = [];
					for(var i = 0; i < num; i ++){
						var r = {
							left : i * regionStep + region.left,
							top : region.top,					
							width : regionStep,
							height : region.height
						}
						var active = this._countActive(activeCtx, r);
						rs.push(active);
					}

					var check = this._analysisActiveArray(rs);
					this.notify(check);
					this.lastActiveCheck = check;
				}else if(orientation == 'v'){
					var num = region.height / regionStep;
					//console.log('num:', num);
					var rs = [];
					for(var i = 0; i < num; i ++){
						var r = {
							left : region.left,
							top : region.top + i * regionStep,					
							width : region.width,
							height : regionStep
						}
						var active = this._countActive(activeCtx, r);
						rs.push(active);
					}

					var check = this._analysisActiveArray(rs);
					this.notify(check);
					this.lastActiveCheck = check;
				}		
			},

			_countActive: function(activeCtx, region){
				////console.log(region);
				var ts = +new Date();
				var data = activeCtx.getImageData(region.left, region.top, region.width, region.height).data;
				var length = data.length;
				var activeCount = 0;

				for( var i = 0; i < length; i = i + 4){

					if(data[i+3] > 0){
						activeCount ++;

					}
				}
				var te = +new Date();
				var result = {
					total: region.width * region.height,
					active: activeCount,
					activeRate: activeCount/(region.width*region.height*1.0),
					cost:te-ts
				}
				////console.log(result);
				return result;
			},

			_analysisActiveArray: function(activeArr){
				var total = activeArr.length;
				var regionThreshold = this.threshold;
				var max = 0, min = total, validCount = 0;

				for(var i = 0; i < total; i ++ ){
					if(activeArr[i].activeRate > regionThreshold){
						validCount ++;
						max = max < i ? i : max;
						min = min > i ? i : min;
					}
				}

				var result = {
					max: max,
					min: min,
					valid: validCount,
					total: total
				}
				return result;
			},

			_resetMoveData : function(){
				this.moveCount = 0;
				this.moveDirection = 0;
			},

			notify: function(check){
				// //console.log(check);
				if(this.lastActiveCheck.valid == 0 && check.valid > 0){
					$E.notifyObservers(this, 'moveIn');
				}else if(this.lastActiveCheck.valid > 0 && check.valid == 0){
					$E.notifyObservers(this, 'moveOut');
					this.hoverCount = 0;
				}
				if(check.valid > (check.total * this.hoverOption.base)){
					this.hoverCount ++;
					if(this.hoverCount == this.hoverOption.checkCount){
						$E.notifyObservers(this, 'hover');
					}
				}

				//console.log(check.max, check.min);
				// if(check.max == this.lastActiveCheck.max && check.min == this.lastActiveCheck.min){
				// 	this._resetMoveData();
				// }else if(check.valid > (check.total * this.moveOption.base) && (
				// 	check.max < this.lastActiveCheck.max || check.min < this.lastActiveCheck.min)){
				// 	if(this.moveDirection == -1 || this.moveDirection == 0){
				// 		this.moveDirection = -1;
				// 		this.moveCount ++;
				// 		if(this.moveCount == this.moveOption.checkCount){
				// 			this.orientation == 'h' ? $E.notifyObservers(this, 'left') : $E.notifyObservers(this, 'up');
				// 		}
				// 	}else{
				// 		this._resetMoveData();
				// 	}
				// }else if(check.valid > (check.total * this.moveOption.base) && (
				// 	check.max > this.lastActiveCheck.max || check.min > this.lastActiveCheck.min)){
				// 	if(this.moveDirection == 1 || this.moveDirection == 0){
				// 		this.moveDirection = 1;
				// 		this.moveCount ++;
				// 		if(this.moveCount == this.moveOption.checkCount){
				// 			this.orientation == 'h' ? $E.notifyObservers(this, 'right') : $E.notifyObservers(this, 'down');
				// 		}
				// 	}else{
				// 		this._resetMoveData();
				// 	}

				// }
				// else{
				// 	this._resetMoveData();
				// }

				if(check.min == this.lastActiveCheck.min){
					this._resetMoveData();
				}else if(check.valid > (check.total * this.moveOption.base) && (check.min < this.lastActiveCheck.min)){
					if(this.moveDirection == -1 || this.moveDirection == 0){
						this.moveDirection = -1;
						this.moveCount ++;
						if(this.moveCount == this.moveOption.checkCount){
							this.orientation == 'h' ? $E.notifyObservers(this, 'left') : $E.notifyObservers(this, 'up');
						}
					}else{
						this._resetMoveData();
					}
				}else if(check.valid > (check.total * this.moveOption.base) && (check.min > this.lastActiveCheck.min)){
					if(this.moveDirection == 1 || this.moveDirection == 0){
						this.moveDirection = 1;
						this.moveCount ++;
						if(this.moveCount == this.moveOption.checkCount){
							this.orientation == 'h' ? $E.notifyObservers(this, 'right') : $E.notifyObservers(this, 'down');
						}
					}else{
						this._resetMoveData();
					}

				}
				else{
					this._resetMoveData();
				}
			}
		}

		Sense.init(activeCtx, region);
		return Sense;
	}


	this.createSenseRegion = createSenseRegion;
	this.VIModule = VIModule;
});


;Jx().$package('WallComing.Util', function(J){
	var $D = J.dom,
		$  = J.dom.mini,
		$E = J.event;

	/**
	 * 创建帧动画对象，传入的函数，将在下一帧绘制时执行，所以函数只执行
	 * 一次
	 * 在不支持requestAnimationFrame的情况下，使用定时器模拟，fps 60
	 * 使用示例：
	 * @example
	 *         var raf = requestAnimationFrame;
	 *         raf(function(){
	 *              //处理代码
	 *         }, {});
	 * 
	 */
	var requestAnimationFrame = window.requestAnimationFrame 		|| 
								window.webkitRequestAnimationFrame  || 
								window.mozRequestAnimationFrame 	|| 
								window.oRequestAnimationFrame		|| 
								window.msRequestAnimationFrame 		||
								function(callback, element){
									window.setTimeout(callback, 1000 / 60);
								};

	/**
	 * 通过帧动画对象循环调用func
	 * @param {function} func 按帧循环调用的函数
	 */
	var rafLoop = function(func){
		var raf = requestAnimationFrame;
		raf(function() {
			func();
			raf(arguments.callee, {});
		}, {});
	}

	//授权提示tip
	var PermissionTips = {
		init: function(){
			this.el = $D.id('permissionTips');
		},

		show: function(){
			this.el.style.top = "0";
			//this.el.style.display="block";
		},

		hide: function(){
			this.el.style.opacity = "0";
			this.el.style.display="none";
		}
	}

	//开门提示（手）
	var OpenDoorTips = {
		init : function(){
			this.left = $D.id('leftHand');
			this.right = $D.id('rightHand');
			this.bindEvents();
		},

		show: function(){
			this.left.style.display = "block";
			this.right.style.display = "block";
		},

		hide: function(){
			this.left.style.display = "none";
			this.right.style.display = "none";
		},

		bindEvents : function(){
			var self=this;
			var func = function(){
			
				var mainLeft = document.getElementById("mainLeft"),
					mainRight = document.getElementById("mainRight");

				//开门动画结束
		        $E.on(mainRight,'webkitAnimationEnd',function(){
					CaptureTips.show();	

					WallComing.VIModule.clearScreen();
					WallComing.VIModule.clearCompare();
				});

		        $D.addClass(mainLeft, 'mainLeftGo');
		        $D.addClass(mainRight, 'mainRightGo');

		        WallComing.wcmain.soundManager.play("door", true, 1, false);

		        $E.off(self.left, 'click', arguments.callee);
		        $E.off(self.right, 'click', arguments.callee);
		      
		        clearInterval(WallPrepare.sense);

		        
			}
			this.func = func;
			var zhBtn=$D.id('zh');
			var enBtn=$D.id('en');
			var rankBtn=$D.id('doorRankBtn');
			var helpBtn=$D.id('helpBtn');


			$E.on(zhBtn,'click',function(){
				rankBtn.innerHTML="排行榜";
				zhBtn.className="selected";
				enBtn.className="";
				LanguageManager.changeLanguage("zh");//语言选择
			});
			$E.on(enBtn,'click',function(){
				rankBtn.innerHTML="Ranking";
				enBtn.className="selected";
				zhBtn.className="";
				LanguageManager.changeLanguage("en");//语言选择
			});
			$E.on(rankBtn,'click',function(){
				WallComing.rank.show();
			});
			$E.on(this.left, 'click', func);
			$E.on(this.right, 'click', func);
		}
	};

	//捕捉背景提示
	var CaptureTips = {
		init: function(){
			this.bg = $D.id('captureBg');
			this.captureRange = $D.id('captureRange');
			this.bindEvents();		
		},

		show: function(){
			$D.addClass(this.bg, 'active');
		//	setTimeout(function(){
				WallComing.VIModule.captureBg();
		//	}, 1000);
		},

		hide: function(){
			$D.removeClass(this.bg, 'active');
		},

		full: function(){
			$D.addClass(this.bg, 'full');
		},

		normal: function(){
			$D.removeClass(this.bg, 'full');
		},


		bindEvents:function(){
			var self = this;

			$E.addObserver(WallComing.VIModule, 'endCapture', function(){
				self.full();
			});

			$E.on(this.bg, 'click', function(e){
				var targetId = e.target.id;
				if(targetId == 'captureOk'){
					if($D.hasClass(self.bg, 'active')){
						self.hide();
						self.normal();
						$E.notifyObservers(WallComing.Util, 'endCapture');
					}
				}else if(targetId == 'reCapture'){
					self.normal();
				//	setTimeout(function(){
					WallComing.VIModule.captureBg();
				//	},3000);
				}else if(targetId == 'captureNow'){
					WallComing.VIModule.captureNow();
				}
			});

			$E.on(document, "keyup", function(e){
				if(e.keyCode == '72'){
					if($D.getStyle(self.captureRange, 'display') == 'none' && $D.hasClass(self.bg, 'active') && !$D.hasClass(self.bg, 'full')){
						self.captureRange.style.display = 'block';
					}else{
						self.captureRange.style.display = 'none';
					}
				}
			});
		}
	};

	var WallPrepare = {
		init: function(){
			if(this.detect()){
				this.isPermission = false;
				PermissionTips.init();
				OpenDoorTips.init();
				CaptureTips.init();
				this.requestPermission();
				PermissionTips.show();
			}else{
				//do something if the browser doesn't support the getUserMeida
				LanguageManager.config["zh"].permissionTips="无法使用摄像头！";
				LanguageManager.config["en"].permissionTips="Camera is unavailable！";
				LanguageManager.permissionTips.innerHTML = this.config[LanguageManager.currentLanguage].permissionTips;

			}
		},

		//检测是否支持视频接口
		detect: function(){
			return !!navigator.getUserMedia || !!navigator.webkitGetUserMedia || false;
		},

		//请求用户授权摄像头
		requestPermission: function(){
			//this.onSuccess();
			if(navigator.getUserMedia) {
				// opera users (hopefully everyone else at some point)
				navigator.getUserMedia({
					video: true,
					audio: true
				}, this.onSuccess, this.onError);
			} else if(navigator.webkitGetUserMedia) {
				// webkit users
				navigator.webkitGetUserMedia({
					video: true
				}, this.onSuccess, this.onError);
			}
		},

		//授权成功
		onSuccess: function(stream){
			//console.log('requestPermission Success');
			this.isPermission = true;
			PermissionTips.hide();
			var video = document.getElementById('video');
			if(stream){
				if(navigator.webkitGetUserMedia) {
					video.src = webkitURL.createObjectURL(stream);
				} else {
					video.src = stream;
				}
			}



			var vim = WallComing.VIModule;
			vim.init();
			var mainLeft = $D.id('mainLeft');
			if($D.hasClass(mainLeft, 'mainLeftGo')){

			}else{
				var sense;
				var track = function(){
					sense = setInterval(function(){
						vim.screenCtx.drawImage(video,0,0,1024,768);
						var screenData = vim.screenCtx.getImageData(0,0,1024,768);
						vim.processCompareSense(screenData);
						openDoorSense.process();
					},1000 / 25 );
					var openDoorSense = WallComing.createSenseRegion('', {
						left: 0,
						top: 184,
						width: 500,
						height: 400
					});

					$E.addObserver(openDoorSense, 'left', function(){
						//console.log('-------------------------------Aha, Left Move');
						OpenDoorTips.func();
						openDoorSense.stopTrack();
						
					});

					$E.addObserver(openDoorSense, 'right', function(){
						//console.log('-------------------------------Aha, Right Move');
					});
					WallPrepare.sense = sense;
				}
				//console.log('get Permission');
				if(WallComing.gameObj.isLoaded){
					//console.log('loaded track');
					track();
				}else{
					//console.log('wait for load');
					$E.addObserver(WallComing.gameObj, 'load', function(){
						//console.log('load track');
						track();
					});
				}				

				if(!WallComing.gameObj.isLoaded){
					//没有加载完显示loading
					$D.id("loading").style.display = "block";
				}else{
					//加载完后显示开门提示
					$D.id('compare').style.left='0px';
				}
				
			}
			// WallPrepare.sense = {};
			
		},

		//出错
		onError: function(){
			//console.log('requestPermission Error');
			$E.notifyObservers(WallPrepare, 'getPermissionError');
		}
	}

	var LanguageManager = {
		init: function(){
			this.permissionTips = $('#permissionTips p')[0];
			this.reCapture = $D.id('reCapture');
			this.captureOk = $D.id('captureOk');
			this.captureNow = $D.id('captureNow');

			var captureTips = $D.id('captureTips');
			this.captureTipsInfo1 = captureTips.children[0];
			this.captureTipsInfo2 = captureTips.children[1];

			this.continueBtn = $D.id('continueBtn');
			this.reCaptureBtn = $D.id('recaptureBtn');
			this.pauseRestart = $D.id('pauseRestartBtn');

			this.score = $('.total-score-title')[0];
			this.photo = $D.id('photosBtn');
			this.restart = $D.id('restartBtn');

			this.rank1=$D.id('pauseRankBtn');

			this.nameInputTitle=$D.id("nameInputTitle");

			this.scoreRankTitle=$D.id("scoreRankTitle");
			this.rankBtn=$D.id("rankBtn");

			this.confirmName=$D.id("confirmName");

			this.wallProcessAreaTitle=$D.id("wallProcessAreaTitle");
			this.totalScoreTitle=$D.id("totalScoreTitle");
			this.pAboutBtn=$D.id("pAboutBtn");
			this.aboutBtn=$D.id("aboutBtn");

			this.currentLanguage=this.currentLanguage||"zh";

			this.helpBtn=$D.id("helpBtn");
			this.pHelpBtn=$D.id("pHelpBtn");


		},

		config: {
			'en': {
				permissionTips: 'click to active',
				reCapture: 'ReCapture',
				captureOk: 'Ok',
				captureNow:'Capture Now',
				captureTipsInfo1: 'Game Ready',
				captureTipsInfo2: 'Please go outside the camera range',
				continueBtn: 'Resume',
				reCaptureBtn:'Capture',
				pauseRestart: "Restart",
				score: 'Score:',
				photo: 'Photos',
				restart: 'Restart',
				rank:'Ranking',
				nameInputTitle:"Please input your name:",
				scoreRankTitle:"Score ranking:",
				confirmName:"OK",
				wallProcessAreaTitle:"Through:",
				totalScoreTitle:"Score:",
				about:"About",
				help:"Help"

			},

			'zh': {
				permissionTips: '点击允许使用摄像头:)',
				reCapture: '重新截取',
				captureOk: '截取成功',
				captureNow: '手动截取',
				captureTipsInfo1:'游戏准备',
				captureTipsInfo2:'请离开摄像头捕捉范围',
				continueBtn: '继续游戏',
				reCaptureBtn:'重新截取',
				pauseRestart: "重新开始",
				score:'得&nbsp;分：',
				photo: '查看相册',
				restart: '重新开始',
				rank:'排行榜',
				nameInputTitle:"请输入你的昵称:",
				scoreRankTitle:"分数排名：",
				confirmName:"确定",
				wallProcessAreaTitle:"通过：",
				totalScoreTitle:"总分：",
				about:"关于",
				help:"帮助"
			}
		},

		changeLanguage : function(language){
			this.currentLanguage=language;

			this.permissionTips.innerHTML = this.config[language].permissionTips;
			this.reCapture.innerHTML = this.config[language].reCapture;
			this.captureOk.innerHTML = this.config[language].captureOk;
			this.captureNow.innerHTML = this.config[language].captureNow;
			this.captureTipsInfo1.innerHTML = this.config[language].captureTipsInfo1;
			this.captureTipsInfo2.innerHTML = this.config[language].captureTipsInfo2;
			this.continueBtn.innerHTML = this.config[language].continueBtn;
			this.reCaptureBtn.innerHTML = this.config[language].reCaptureBtn;
			this.pauseRestart.innerHTML = this.config[language].pauseRestart;

			this.score.innerHTML = this.config[language].score;

			this.photo.innerHTML = this.config[language].photo;
			this.restart.innerHTML = this.config[language].restart;
			this.rank1.innerHTML=this.config[language].rank;

			this.nameInputTitle.innerHTML=this.config[language].nameInputTitle;
			this.scoreRankTitle.innerHTML=this.config[language].scoreRankTitle;

			this.rankBtn.innerHTML=this.config[language].rank;
			this.confirmName.innerHTML=this.config[language].confirmName;
			this.wallProcessAreaTitle.innerHTML=this.config[language].wallProcessAreaTitle;
			this.totalScoreTitle.innerHTML=this.config[language].totalScoreTitle;

			this.aboutBtn.innerHTML=this.pAboutBtn.innerHTML=this.config[language].about;

			this.helpBtn.innerHTML=this.pHelpBtn.innerHTML=this.config[language].help;

		}
	}

	this.CaptureTips = CaptureTips;
	this.OpenDoorTips = OpenDoorTips;
	this.PermissionTips = PermissionTips;
	this.requestAnimationFrame = requestAnimationFrame;
	this.rafLoop = rafLoop;
	this.WallPrepare = WallPrepare;
	this.LanguageManager = LanguageManager;
});

Jx().$package("WallComing.photo", function(J){
	var $D = J.dom,
		$E = J.event,
        $H = J.http,
        $VI = WallComing.VIModule;

	var pfx = (function () {
          
        var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};
        
        return function ( prop ) {
            if ( typeof memory[ prop ] === 'undefined' ) {
                
                var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
                
                memory[ prop ] = null;
                for ( var i in props ) {
                    if ( style[ props[i] ] !== undefined ) {
                        memory[ prop ] = props[i];
                        break;
                    }
                }
            
            }
            
            return memory[ prop ];
        };

    })();

    //设置元素的css
    var css = function ( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = pfx(key);
                if ( pkey !== null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };

    var bezier = function(points, pos) {
        var n = points.length,
        	r = [],
        	i,
        	j;

        for (i = 0; i < n; i++) {
            r[i] = [points[i][0], points[i][1]];
        }
        for (j = 1; j < n; j++) {
            for (i = 0; i < n - j; ++i) {
                r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0];
                r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1];
            }
        }
        return r[0][1];
    }

    var easings = {
        easeOut: function (t) {
            return Math.sin(t * Math.PI / 2);
        }

        , easeOutStrong: function (t) {
            return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t);
        }

        , easeIn: function (t) {
            return t * t;
        }

        , easeInStrong: function (t) {
            return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
        }

        , easeOutBounce: function(pos) {
            if ((pos) < (1/2.75)) {
                return (7.5625*pos*pos);
            } else if (pos < (2/2.75)) {
                return (7.5625*(pos-=(1.5/2.75))*pos + .75);
            } else if (pos < (2.5/2.75)) {
                return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
            } else {
                return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
            }
        }

        , easeInBack: function(pos){
            var s = 1.70158;
            return (pos)*pos*((s+1)*pos - s);
        }

        , easeOutBack: function(pos){
            var s = 1.70158;
            return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
        }

        , bounce: function (t) {
            if (t < (1 / 2.75)) {
                return 7.5625 * t * t;
            }
            if (t < (2 / 2.75)) {
                return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
            }
            if (t < (2.5 / 2.75)) {
                return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
            }
            return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
        }

        , bouncePast: function (pos) {
            if (pos < (1 / 2.75)) {
                return (7.5625 * pos * pos);
            } else if (pos < (2 / 2.75)) {
                return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
            } else if (pos < (2.5 / 2.75)) {
                return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
            } else {
                return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
            }
        }

        , swingTo: function(pos) {
            var s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
        }

        , swingFrom: function (pos) {
            var s = 1.70158;
            return pos * pos * ((s + 1) * pos - s);
        }

        , elastic: function(pos) {
            return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
        }

        , spring: function(pos) {
            return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
        }

        , blink: function(pos, blinks) {
            return Math.round(pos*(blinks||5)) % 2;
        }

        , pulse: function(pos, pulses) {
            return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
        }

        , wobble: function(pos) {
            return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
        }

        , sinusoidal: function(pos) {
            return (-Math.cos(pos*Math.PI)/2) + 0.5;
        }

        , flicker: function(pos) {
            var pos = pos + (Math.random()-0.5)/5;
            return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
        }

        , mirror: function(pos) {
            if (pos < 0.5){
                return easings.sinusoidal(pos*2);
            }else {
                return easings.sinusoidal(1-(pos-0.5)*2);
            }
        }

    };

    //动画主体函数
    var animation = function(opt) {
      	var frameRate = opt.frameRate || 60,
      		change = opt.change,
    		ease = opt.ease || "linear",
    		from = opt.from,
    		to = opt.to,
    		duration = opt.duration || 800,
    		complete = opt.complete,
            callback = opt.callback;

        //bezier变化
		if(ease == 'bezier'){
    	   var points = opt.points;
        }

        var start = +new Date();

        var timeout;

        function run(){
            var now = +new Date(),
            	delta = now - start,
            	proportion;

            if (delta > duration) {
            	delta = duration;
            }

            if(ease == 'bezier'){
            	proportion = bezier(points, delta/duration);
  	        }else {
  	        	proportion = delta/duration;
  	        }

  	        change(proportion);

            if(delta == duration){
            	clearTimeout(timeout);
                complete && complete();
                callback && callback();
            }
        }


		timeout = setInterval(run, 1000/frameRate);

        return {
        	stop : function(){
          		clearTimeout(timeout);
          	}
        };
    }

    //动画队列
    var createAniQueue = function(){
        var queue = [],
            isRunning = false,//是否有正在进行的动画
            currentAni = null;//当前动画

        var add = function(opt, clear){
            opt.callback = function(){
                dqueue();
            }

            if(clear){
                stop(); 
            }

            queue.push(opt);
            if(!isRunning){
                dqueue();
                isRunning = true;
            }    
        };

        //开始下一个动画
        var dqueue = function(){
            if(queue.length > 0){
                ani = animation(queue.shift());
            }else {
                isRunning = false;
                ani = null;
            }
        };

        //停止动画，并清空队列
        var stop = function(){
            if(isRunning){
                ani.stop();
                isRunning = false;
                queue = [];
            }
        };

        return {
            add : add,
            stop : stop
        };
    }

    var index = 1;

    var uploadUrl = 'http://wc.alloyteam.com/upload/base64';

    var upload = [];

    var isShow = false;

    var firstInit = true;

    var wrapper = $D.id("photo_slider_wrapper"),
        goback = wrapper.firstElementChild,
        prev = $D.id("prev"),
        next = $D.id("next"),
        photoContent = $D.id("photo_content"),
        photo_count = $D.id("photo_count");

    var count,
        slideWidth;

    var timeout;

    var width = 701,
        height = 466;

    var left = -width;

    var init = function(){
        if(!isShow){
            isShow = true;
        }else{
            wrapper.style.display = 'block';
            return;
        }

        count = $D.tagName("img", photoContent).length,
        slideWidth = count*width;

        timeout = null;

        if(count > 1){
            var first = photoContent.firstElementChild,
                last = photoContent.lastElementChild;
            photoContent.insertBefore(last.cloneNode(true), first);
            photoContent.appendChild(first.cloneNode(true));
            $D.setStyle(photoContent, 'width', slideWidth + 2*width + 'px');
            $D.setStyle(photoContent, 'left', -width + 'px');
        }

        photo_count.innerHTML = "1/" + count;	    

	    if(firstInit){
            firstInit = false;

    	    $E.on(goback, "click", function(e){
    	    	wrapper.style.display = 'none';
                WallComing.share.hide();
    	    });


        	$E.on(next, "click", function(e){
    	    	if(count > 1){
    	    		timeout && timeout.stop();

    	    		index = index%count;

    		    	var from = left,
    		    		to = -(++index)*width;

                    photo_count.innerHTML = index + "/" + count;

    		    	if(to > from){
    		    		to -= slideWidth;
    		    	}

    		    	timeout = animation({
    		    		from : from,
    		    		to : to,
    		    		change : function(proportion){
    				    	left = from + (to - from)*proportion;
    				    	left %= slideWidth;
    				    	$D.setStyle(photoContent, 'left', left + 'px');
    				    },
                        ease:'bezier',
                        points:[[0,0], [0, 0.96], [0.12, 0.98], [1, 1]]
    		    	});
    		    }
    	    });

    	    $E.on(prev, "click", function(e){
    			if(count > 1){
    	    		timeout && timeout.stop();

                    index--;

    		    	var from = left,
    		    		to = -index*width;


                    index = (index<1)? count : index;
                    photo_count.innerHTML = index + "/" + count;

    		    	if(to < from){
    		    		to += slideWidth;
    		    	}

    		    	timeout = animation({
    		    		from : from,
    		    		to : to,
    		    		change : function(proportion){
    				    	left = from + (to - from)*proportion;
    				    	left = (left>(-width))? (left - slideWidth) : left; 
    				    	$D.setStyle(photoContent, 'left', left + 'px');
    				    },
                        ease:'bezier',
                        points:[[0,0], [0, 0.96], [0.12, 0.98], [1, 1]]
    		    	});
    		    }
    	    });
        }

        wrapper.style.display = 'block';
	}

	var reset = function(){
		photo_content.innerHTML = "";
        upload = [];
        isShow = false;
        index = 1;
        left = -width;
	}

    var uploadImg = function(callback){
        var _index = index;
        if(upload[_index]){
            callback(upload[_index]);
        }else{
            $H.ajax(uploadUrl,{
                'method' : 'POST',
                'data': JSON.stringify({base64: $VI.photoSrc[index - 1]}),
                'contentType': 'application/json',
                'onSuccess' : function(o){
                    //console.log("上传成功");
                    var data = JSON.parse(o.responseText);
                    if(data.recode == 0){
                        upload[_index] = data.result;
                        callback(data.result);
                    }else{
                        //console.log("上传出错");
                        callback();
                    }
                },
                'onError' : function(){
                    //console.log("上传出错");
                    callback();
                }
            });
        }
    }

	this.init = init;
	this.reset = reset;
    this.uploadImg = uploadImg;
});
Jx().$package("WallComing.rank", function(J){
	var $D = J.dom,
		$E = J.event;

	var wrapper = $D.id("rank_wrapper"),
		goback = wrapper.firstElementChild,
		rankPanel = $D.id("rankPanel"),
		rankList = $D.id("rankList"),
		rankArrStatus = false,
		rankArr,
		//rankArr = localStorage.rank? JSON.parse(localStorage.rank) : [],
		topCount = 30;

	var rankingTmpl = '\
		<% for(var i = 0; i < count; i++) { \
			var item = rankArr[i];\
		%>\
		<tr>\
		<td><%=formatNumber(i + 1, "00")%></td>\
		<td><%=item.name%></td>\
		<td><%=item.score%></td>\
		</tr>\
		<% } %>\
    ';

	//初始化rank
	var init = function(){
		//createList();
		$E.on(goback, "click", hide);	
	};

	//显示排行榜
	var show = function(){
		$D.addClass(wrapper, 'active');
	};

	//隐藏排行榜
	var hide = function(){
		$D.removeClass(wrapper, 'active');
	};

	//分数排行,总分排行
	var scoreRank = function(score, callback){
	//	for(var i = 0, len =rankArr.length; i < len; i++){
	//		if(score >= rankArr[i].score){
	//			break;
	//		}
	//	}
	//	return i + 1;
	J.http.ajax('myranking.php?' + (+new Date),{
			method:'POST',
			data:{
				readRankingOK:1,
				score:score
			},
			onSuccess: function(data){
				rankAll = JSON.parse(data.responseText);
				//var len = rankArr.length;
				callback(rankAll);
			}
		
		});
	};
	

	//更新排行榜
	var update = function(item){	
	//	createList();
		var len = rankArr.length;
		for(var i = 0; i < len; i++){
			if(item.name == rankArr[i].name){
				if(item.score >= rankArr[i].score){
					rankArr.splice(i, 1, item);
				//	createList();
				//	save();
					
					return;
				}else{
					return;
				}
			}else if(item.score >= rankArr[i].score){//后来者居上
				rankArr.splice(i, 0, item);
				i++;
				len++;
				break;
			}
		}

		if(i < len){
			while(i < len){
				if(rankArr[i].name == item.name){
					rankArr.splice(i, 1);
					break;
				}
				i++;
			}
		}else{
			rankArr.push(item);
		}

	
	
	//	save();
		
	};

	//存储榜单
	var save = function(){
	//	localStorage.setItem("rank",JSON.stringify(rankArr));
	};
	var  interval = 60;
	//创建排行榜
	//数据库读取排行榜
	var createList = function(){
		J.http.ajax('readranking.php?' + (+new Date),{
			method:'POST',
			data:{
				readRankingOK:1,
				score:-1
					},
			onSuccess: onRanking
		});
	};
	//操纵JSON生成排行榜
//	var loadRanking = function(){
//		J.http.ajax('ranking.json?' + (+new Date), {
//			type: 'text',
//			onSuccess: onRanking,
//			onTimeout: function(data){
//				setTimeout(loadRanking, interval * 1000);
//			}
//		})
//		
//	};
	var onRanking = function(data){
		rankArr = JSON.parse(data.responseText);
		
	//	setTimeout(createList, interval * 1000);

		var count = rankArr.length > 100 ? 100 : rankArr.length;
		var ranktmp = J.string.template(rankingTmpl, {count: count, rankArr: rankArr, formatNumber: J.format.number});
		rankList.innerHTML = ranktmp;
	};

	this.init = init;
	this.show = show;
	this.hide = hide;
	this.scoreRank = scoreRank;
	this.update = update;
	this.createList = createList;
});

Jx().$package("WallComing.share",function(J){
    var packageContext = this;
    var $D = J.dom,
        $E = J.event,
        $A = J.string,
        $P = WallComing.photo;

    var sinaBtn = $D.id("sinaBtn"),
        tencentBtn = $D.id("tencentBtn"),
        sharePanel = $D.id("sharePanel"),
        wbName = $D.id("wbName"),
        shareText = $D.id("shareText"),
        countInfo = $D.id("countInfo"),
        shareNow = $D.id("shareNow"),
        sharing = $D.id("sharing"),
        close = $D.id("share_close"),
        success = $D.id("share_success"),
        fail = $D.id("share_fail");

    var apiCallQueue = [],
        apiReady = false;


    var defaultText = [
        "#体感游戏墙来了#我刚刚玩了体感游戏《墙来了》，太刺激了！这是我在游戏过程中拍的照片，大家来一起加入吧！体验网址： http://WC.AlloyTeam.com",
        "#体感游戏墙来了#太好玩了，是腾讯@AlloyTeam 使用#HTML5#技 术开发的，跟大家分享一下我在游戏中拍摄的照片^_-！体验网址： http://WC.AlloyTeam.com",
        "快来玩@AlloyTeam 的#体感游戏墙来了#吧，不仅可以让男生更帅 、女生更美、提高人品，还可以改善夫妻关系、家庭和谐！看我在游 戏中拍的照片cool不？体验网址：http://WC.AlloyTeam.com",
        "腾讯创意马拉松#的一等奖作品：@AlloyTeam 的#体感游戏墙来了#上线测试啦：http://WC.AlloyTeam.com ，帅哥与美女、孩子与父 母，各种玩家、基友组合搭配一起来吧，感受各种风情万种的“墙” ！轻松享受你的周末吧！，游戏体验让每个人都能从头到脚全身心的 感受轻松和快乐！看我玩的怎么样！",
        "腾讯@AlloyTeam 的#体感游戏墙来了#是HTML5开发的多人全身互 动音乐#体感游戏#。它伴随着动感十足的音乐伸展身体，以各种不可 思议且完全超 出你想象力的姿势，来完成游戏场景中动作感十足，充 满挑战与互动 的动作。大家看看我在游戏中拍的照片吧！体验网址：  http://WC.AlloyTeam.com",
        "大家看我在#体感游戏墙来了#[ @AlloyTeam ]中拍的照片好玩不 ^_-！体验网址：http://WC.AlloyTeam.com"
    ];

    var shareName,
        text;

    var isShow = false;

    var loginStatus = {};

    var num = 280;

    var timeout;

    var isAmg = false;

    this.isReady = function(){
        return apiReady;
    };

    this.logout = function(){
        if(loginStatus.sina){
            //console.log("登出");
            this.api('sina', 'logout', null);
            loginStatus.sina = false;
            var img = new Image();
            img.onload = function(){
                delete img;
            }
            img.src = 'http://weibo.com/logout.php';
        }

        if(loginStatus.tencent){
            //console.log("登出");
            this.api('tencent', 'logout', null);
            loginStatus.tencent = false;
            var img = new Image();
            img.onload = function(){
                delete img;
            }
            img.src = 'http://t.qq.com/logout.php';
        }
    };

    var checkShareText = function(){
        var newValue = shareText.value.replace(/[^\x00-\xff]/g, "**");
        if(newValue.length >= 0){
            if (newValue.length > num) {
                countInfo.innerHTML = "已经超过<b class='warnColor'>" + parseInt((newValue.length - num)/2) + "</b>个字";
            }else{
                countInfo.innerHTML = "您还可以输入<span>" + parseInt((num-newValue.length)/2) + "</span>个字";
            }
        }   
    }

    var trimText = function(text) {
        return text.replace(/^\s*/g, "").replace(/\s*$/g, "");
    }

    var show = function(name){
        shareName = name;
        loginStatus[name] = true;
        if(name == "sina"){
            wbName.innerHTML = "新浪";
        }else if(name == "tencent"){
            wbName.innerHTML = "腾讯";
        }
        if(!isShow){
            shareText.value = isAmg? '#image#' + defaultText[Math.floor(Math.random()*defaultText.length)] : defaultText[Math.floor(Math.random()*defaultText.length)];
            timeout = setInterval(checkShareText, 100);
            $D.addClass(sharePanel, 'active');
            isShow = true;
        }
    }

    this.hide = function(){
        isShow = false;
        $D.removeClass(sharePanel, 'active');
        $D.removeClass(sharing, "active");
        clearInterval(timeout);
    }

    //上传后回调
    var uploadCallback = function(url){
        if(url){  
            if(shareName == 'tencent'){
                packageContext.api('tencent', 'postWithPic', {
                    content: text,
                    pic_url: url
                }, onShareCallback);
            }else if(shareName == 'sina'){
                packageContext.api('sina', 'postWithPic', {
                    status: text,
                    url: url
                }, onShareCallback);
            }
        }else{
            showResult("fail");
        }
    }

    var showResult = function(result){
        $D.removeClass(sharing, "active");
        if(result == "success"){
            if(!$D.hasClass(success, "active")){
                $D.addClass(success, "active");
                setTimeout(function(){
                    $D.removeClass(success, "active");
                }, 1000);
            }
        }else if(result == "fail"){
            if(!$D.hasClass(fail, "fail")){
                $D.addClass(fail, "active");
                setTimeout(function(){
                    $D.removeClass(fail, "active");
                }, 1000);
            }
        }
    }

    //分享回调
    var onShareCallback = function(success, response) {
        if (success) {
            //console.log("分享成功！");
            packageContext.hide();
            showResult("success");
        } else {
            //console.log("分享失败！");
            //console.log(success, response);
            showResult("fail");
        }
    }

    this.init = function(){
        var params = $A.mapQuery(window.location.href);
        if(params.flag){
            isAmg = true;
        }

        var self = this;

        $E.on(sinaBtn, "click", function(){
            self.api('sina', 'isLogin', null, function(status){
                if(status){
                    //console.log("登录");
                    show('sina');
                }else{
                    //console.log("未登录");
                    self.api('sina', 'login', null, function(){
                        //console.log("登录");
                        show('sina');
                    });
                }       
            });
        });

        
        $E.on(tencentBtn, "click", function(){
            self.api('tencent', 'isLogin', null, function(status){
                if(status){
                    //console.log("登录");
                    show('tencent');
                }else{
                    //console.log("未登录");
                    self.api('tencent', 'login', null, function(){
                        //console.log("登录");
                        show('tencent');
                    });
                }       
            });
        });

        $E.on(shareNow, 'click', function(){
            $D.addClass(sharing, "active");
            text = shareText.value;
            $P.uploadImg(uploadCallback);
        });

        $E.on(shareText, "change", checkShareText);

        $E.on(close, 'click', this.hide);
    };

    this.apiReady = function(apiCall){
        if(apiReady){
            return false;
        }
        apiReady = true;
        this.api = apiCall; //重置 api 方法, 指向最终调用
        for(var i = 0, q; q = apiCallQueue[i]; i++) {
            this.api.apply(this, q);
        }
        apiCallQueue = [];
    };

    /**
     * 分享的 api 调用, 所支持的命令和参数请看 share.api.js
     * @param  {String}   target   分享到哪, e.g. tencent/sina
     * @param  {String}   cmd      tencent: post, postWithPic, follow
     *                             sina: post, follow
     * @param  {Object}   param    [description]
     * @param  {Function} callback [description]
     * @return {[type]}
     */
    this.api = function(target, cmd, param, callback){
        // 这个方法只有在 apiReady 之后才可用, 并且 api ready 之后会被覆盖
        // 因此执行这个方法的时候, 必然是 没有 ready的, 把请求缓存起来
        apiCallQueue.push(Array.prototype.slice.call(arguments));
    };
});

Jx().$package('WallComing.shareApi', function(J){
    var packageContext = this;
    var $D = J.dom,
        $E = J.event;

    // sina
    var SINA_APP_KEY = '3690433065';
    var SINA_API_ROOT = 'https://api.weibo.com/2';
    var SINA_API_MAP = {
        'isLogin': {
            exec: function(param, callback){
                callback && callback(WB2.checkLogin());
            }
        },
        'login': {
            exec: function(param, callback){
                WB2.login(callback);
            }
        },
        'logout':{
            exec: function(param, callback){
                WB2.logout();
            }
        },
        'post' : {
            url: '/statuses/update.json',
            method: 'post',
            param: {
                source: SINA_APP_KEY,
                status: ''
            }
        },
        'postWithPic' : {//新浪微博的 带图api 不好用....
            url: '/statuses/upload_url_text.json',
            method: 'post',
            param: {
                source: SINA_APP_KEY,
                status: '',
                url:''
            }
        },
        'follow': {
            url: '/friendships/create.json',
            method: 'post',
            param: {
                source: SINA_APP_KEY,
                screen_name: ''
            }
        }
    }

    var requireSina = function(cmd, param, callback){
        var apiObj = SINA_API_MAP[cmd];

        if(!apiObj){
            throw new Error('no such api');
        }else if(apiObj.exec){
            apiObj.exec(param, callback);
            return;
        } else if(apiObj.param){
            param = J.extend({}, apiObj.param, param);
        }

        var postCMD = function(W){
            W.parseCMD(apiObj.url, function(sResult, bStatus){
                callback && callback(bStatus, sResult);
            },
            param,
            {
                method: apiObj.method || 'get'
            });
        };

        WB2.login(function(){
            WB2.anyWhere(postCMD);
        });
    }

    // tencent
    var TENCENT_APP_KEY = '801198560';
    var TENCENT_API_MAP = {
        'isLogin': {
            exec: function(param, callback){
                callback && callback(T.loginStatus());
            }
        },
        'login': {
            exec: function(param, callback){
                T.login(callback);
            }
        },
        'logout': {
            exec: function(param, callback){
                T.logout();
            }
        },
        'post' : {
            url: '/t/add',
            method: 'post',
            param: {
                content: ''
            }
        },
        'postWithPic' : {
            url: '/t/add_pic_url',
            method: 'post',
            param: {
                content: '',
                pic_url: ''
            }
        },
        'follow': {
            url: '/friends/add',
            method: 'post',
            param: {
                name: ''
            }
        }
    }

    var requireTencent = function(cmd, param, callback){
        var apiObj = TENCENT_API_MAP[cmd];

        if(!apiObj){
            throw new Error('no such api');
        }else if(apiObj.exec){
            apiObj.exec(param, callback);
            return;
        }else if(apiObj.param){
            param = J.extend({}, apiObj.param, param);
        }

        var postCMD = function(){
            T.api(apiObj.url, param, 'json', apiObj.method)
            .success(function (response) {
                callback && callback(true, response);
            })
            .error(function (code, message){
                callback && callback(false, code);
            });
        };

        T.login(postCMD);
        
    }

    // logic
    var apiCount = 2;
    var apiReady = function(){
        if(--apiCount <= 0){
            WallComing.share.apiReady(apiCall);
        }
    }

    var apiCall = function(target, cmd, param, callback){
        if(target === 'tencent'){
            requireTencent(cmd, param, callback);
        }else if(target === 'sina'){
            requireSina(cmd, param, callback);
        }
    }

    this.init = function(){
        apiCount = 2;
        var url = 'http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=' + SINA_APP_KEY;
        J.http.loadScript(url, {
            onSuccess: function(){
                apiReady(); 
            }
        });

        url = 'http://mat1.gtimg.com/app/openjs/openjs.js';
        J.http.loadScript(url, {
            onSuccess: function(){
                T.init({
                    appkey: TENCENT_APP_KEY,
                    callbackurl: 'http://codetank.alloyteam.com/loginsuccess.html',
                    autoclose:true
                });
                apiReady();
            }
        });
    }

});

Jx().$package("WallComing",function(J) {
	var config={
		srcObj:{
			"loading":"images/loading1.png",
			"start_left":"images/start_left.jpg",
			"start_right":"images/start_right.jpg",
			"rank_bg":"images/rank_bg.jpg",
			"ranklist_bg":"images/ranklist_bg.png",
			"pause_win":"images/pause_win.png",
			"wc_logo":"images/wc_logo.png",
			"close":"images/close.png",
			"1":"images/1.png",
			"2":"images/2.png",
			"3":"images/3.png",
			"w1":"images/w1.png",
			"w2":"images/w2.png",
			"w3":"images/w3.png",
			"w4":"images/w4.png",
			"w5":"images/w5.png",
			"w6":"images/w6.png",
			"w7":"images/w7.png",
			"w8":"images/w8.png",
			"w9":"images/w9.png",
			"w10":"images/w10.png",
			"w11":"images/w11.png",
			"w12":"images/w12.png",
			"w13":"images/w13.png",
			"w14":"images/w14.png",
			"w15":"images/w15.png",
			"w16":"images/w16.png",
			"w17":"images/w17.png",
			"b0":"images/b0.jpg",
			"b1":"images/b1.jpg",
			"end_win":"images/end_win.png",
			"congratulation":"images/congratulation.png",
			"failed":"images/failed.png",
			"beijing":"images/beijing.jpg",
			"back":"images/back.png",
			"left":"images/left.png",
			"right":"images/right.png",
			"perfect":"images/perfect.png",
			"cool":"images/cool.png",
			"good":"images/good.png",
			"bad":"images/bad.png",
			"perfect_count":"images/perfect_count.png",
			"cool_count":"images/cool_count.png",
			"good_count":"images/good_count.png",
			"bad_count":"images/bad_count.png",
			"button":"images/button.png",
			"camera_nw":"images/camera_nw.png",
			"click_nw":"images/click_nw.png",
			"hand":"images/hand.png",
			"pause_icon":"images/pause_icon.png",
			"pause_restart":"images/pause_restart.png",
			"photos_nw":"images/photos_nw.png",
			"recapture":"images/recapture.png",
			"red":"images/red.png",
			"restart_nw":"images/restart_nw.png",
			"resume":"images/resume.png",
			"share_success":"images/share_success.png",
			"share_fail":"images/share_fail.png",
			"sina":"images/sina.png",
			"tencent":"images/tencent.png",
			"mls":"images/mls.png",


			"audio_start":"audios/start.mp3",
			"audio_play":"audios/play.mp3",
			"audio_perfect":"audios/perfect.wav",
		    "audio_cool":"audios/cool.wav",
			"audio_good":"audios/good.wav",
			"audio_bad":"audios/bad.wav",
			"audio_success":"audios/success.wav",
			"audio_button":"audios/button.mp3",
		    "audio_door":"audios/door.mp3"
			

			
		},
		score:{
			perfect:100,
			cool:60,
			good:30,
			bad:0
		}
	};
	this.config=config;

});
/*
 * 
 * by Cson
 *
 */
Jx().$package("WallComing.wcclass",function(J) {
	var cg=J.cnGame,
	input=cg.input,
	$D = J.dom,
	$E = J.event,
	$A =cg.Animation,
	config=WallComing.config,
	srcObj=config.srcObj,
	SpriteSheet=cg.SpriteSheet;

    function bezier(points, pos) {
        var n = points.length,
        r = [],
        i,
        j
        for (i = 0; i < n; ++i) {
            r[i] = [points[i][0], points[i][1]]
        }
        for (j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
                r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
            }
        }
        return [r[0][0], r[0][1]];
    };


	var Wall=new J.Class({extend:cg.Sprite},{
		init:function(options){
			var self=this;
			Wall.superClass.init.call(this,options);
			this.z=options.z;
			this.speedZ=options.speedZ||0;
			this.speed=options.speed||Vector2.zero;
			this.ori_z=this.z;
			this.ori_x=this.pos.x;//z为0的时候的坐标
			this.ori_y=this.pos.y;
			this.center=options.center;
			this.za=options.za;
			this.size=[this.image.width,this.image.height];
			this.speed=[Vector2.zero,0];
			this.hasMovedDuration=0;
			this.moveSumDuration=5;
			//this.center.y+=300;
			this.maxZ=500;
			this.alpha=1;
			//消失渐变动画
			this.hideAnimation=new $A({
				targetElem:this,
				propertyName:"alpha",
				duration:1000,
				from:1,
				to:0,
				tweenFun:$A.tweenObj.cubic.easeOut,
				onFinished:function(){
					self.remove();
				}
			});

			$E.addObserver(this,"stopMove",function(){
				self.onStopMove();
			})
		},
		onStopMove:function(){
			this.disappear();
		},
		update:function(duration){
			if(this.isDisappear) return;
			var za=this.za;
			var center=this.center;
			var scale=(center.x+this.z)/center.x;
			this.scale=scale;
			this.speedZ=this.speedZ+za*duration;
			//this.z+=this.speedZ*this.scale*duration;
			this.hasMovedDuration+=duration;
			this.z=bezier([[0,this.ori_z],[this.moveSumDuration*0.6,this.ori_z+0.28*this.maxZ],[this.moveSumDuration*0.94,this.ori_z+0.17*this.maxZ],[this.moveSumDuration,this.maxZ]],this.hasMovedDuration/this.moveSumDuration)[1];
	
			Wall.superClass.update.call(this,duration);

			if(this.z>=this.maxZ) $E.notifyObservers(this,"stopMove",this);

			if((this.moveSumDuration-this.hasMovedDuration)<0.2) window.beginWall=false;
			// .6,.28,.89,.2
		},
		draw:function(){
			var w=this.size[0],h=this.size[1],center=this.center,scale=this.scale,x=this.pos.x,y=this.pos.y;

			var x=(x - center.x) * scale + center.x;
			var y=(y - center.y) * scale + center.y;
			var s=[ w * scale , h * scale ];
			var img=this.image;
			var ctx=cg.context;

			ctx.save();
			cg.view.apply(ctx);
			ctx.translate(x,y+80);
			ctx.globalAlpha=this.alpha;
			ctx.rotate(this.angle*-1);
			ctx.drawImage(img,0,0,img.width,img.height,-s[0]/2,-s[1]/2,s[0],s[1]);
			ctx.restore();

		},
		disappear:function(){
			if(this.isDisappear) return;

			$A.add(this.hideAnimation);
			this.isDisappear=true;
			
		},
		remove:function(){
			WallComing.gameObj.spriteList.remove(this);
		}
	});

	this.Wall=Wall;
});

/*
 * 
 * by Cson
 *
 */
Jx().$package("WallComing.wcmain", function(J) {
	var cg=J.cnGame,
	srcObj=WallComing.config.srcObj,
	$D=J.dom,
	$E=J.event;


	this.init=function(){
		var self=this;

		//分数管理初始化
		scoreManager.init();
		//动态背景管理初始化
		backGroundManager.init();
		//弹出效果管理初始化
		popEffectManager.init();
		//结束窗口管理初始化
		endWinManager.init();
		//墙体管理初始化
		wallManager.init();
		//碰撞管理初始化
		collisionDectManager.init();
		//声音管理初始化
		soundManager.init();
		//暂停窗口
		pauseWinManager.init();
		//呼吸线
		WallComing.effects.ShiningLine.init();
		//窗口resize管理
		//winResizeManager.init();
		//排行榜
		WallComing.rank.init();
		//关于
		aboutWinManager.init();
		//分享
		WallComing.shareApi.init();
		WallComing.share.init();
		//帮助
		helpWinManager.init();

		WallComing.VIModule.init();
		WallComing.Util.WallPrepare.init();
		// $E.addObserver(WallComing.gameObj,"restart",function(){
		// 	self.reset();
		// })
	};

	this.reset=function(){
		backGroundManager.reset();
		scoreManager.reset();
		wallManager.reset();
		soundManager.reset();
		collisionDectManager.reset();
	};


	//动态背景管理
	var backGroundManager={
		init:function(){
			var self=this;
			this.elem=$D.id("");
			this.bgArr=["b0","b1"];
			this.bgIndex=0;
			this.bgChangeDuration=0.5;
			this.bgt=0;
			this.line=$D.id("line");

			$E.addObserver(WallComing.gameObj,"startGame",function(){
				$D.setStyle(self.line,"display","block");
			});


		},
		reset:function(){
			this.bgt=0;
			this.bgIndex=0;
			$D.setStyle(this.line,"display","none");
		},
		update:function(duration){
	
			var bgt=this.bgt+=duration,
			bgIndex=this.bgIndex,
			bgArr=this.bgArr,
			bgChangeDuration=this.bgChangeDuration;

			if(bgt>=bgChangeDuration) {

				this.bgt=0;
				this.bgIndex++;
				if(this.bgIndex==2) this.bgIndex=0;	
				cg.canvas.className=this.bgArr[this.bgIndex];	
			}	


		},
		draw:function(){
			var url=srcObj[this.bgArr[this.bgIndex]];
			var bgImg=cg.loader.loadedImgs[url];

			//半透背景绘制
			cg.context.save();
			cg.context.globalAlpha=0;
			cg.context.drawImage(bgImg,0,0,bgImg.width,bgImg.height,0,0,bgImg.width,bgImg.height);
			cg.context.restore();
				
		}
	};
	//弹出效果管理
	var popEffectManager={
		init:function(){
			var self=this;

			$E.addObserver(collisionDectManager,"collisionCheck",function(type){
				self.show(type);
			});
		},
		show:function(type){
			//alert(type);
			var target=$D.id(type);
			target.className="";
			setTimeout(function(){
				target.className=type;
			},0);		
			_gaq.push(['_trackEvent', 'score', 'gain', type]);	
		}
	};

	//结束弹窗管理
	var aboutWinManager={
		init:function(){
			var self=this;
			this.aboutBtn=$D.id("aboutBtn");
			this.win=$D.id("aboutWin");
			this.closeAboutBtn=$D.id("closeAboutBtn");
			//关闭视频浮层提示
			this.closeTips=$D.id("closeTips");
			this.permissionTips=$D.id("permissionTips");
			
			$E.on(this.aboutBtn,"click",function(){
				self.show();
			});
			$E.on(this.closeAboutBtn,"click",function(){
				self.hide();
			});

			$E.on(this.closeTips,"click",function(){
				self.hideTips();
			});

			
		},
		show:function(){
			$D.setStyle(this.win,"display","block");		
		},
		hide:function(){
			$D.setStyle(this.win,"display","none");
							
		},
		hideTips:function(){
			$D.setStyle(this.permissionTips,"display","none");
		}

	};
	//结束弹窗管理
	var endWinManager={
		init:function(){
			var self=this;
			var confirmflg = false;
			this.ls=J.localStorage;
			this.wrap=$D.id("winWrap");
			this.endTotalScore=$D.id("endTotalScore");
			this.nameInputPannel=$D.id("nameInputPannel");

			this.restartBtn=$D.id("restartBtn");
			this.photosBtn=$D.id("photosBtn");
			this.rankBtn=$D.id("rankBtn");

			this.perfectCount=$D.id("perfectCount");
			this.coolCount=$D.id("coolCount");
			this.goodCount=$D.id("goodCount");
			this.badCount=$D.id("badCount");

			this.nameInput=$D.id("nameInput");
			this.confirmName=$D.id("confirmName");
			this.scoreRank=$D.id("scoreRank");


			this.nameValueMaxLength=10;
			
			var saveName = this.ls.getItem("userName");
			if(saveName){
				this.nameInput.value=saveName;
			}
			else{
				this.nameInput.value="Guest_001";
			}

			$E.addObserver(WallComing.gameObj,"gameEnd",function(type){
				setTimeout(function(){
					self.show("endWin",type);
				},1000);
			});
			//重新开始
			$E.addOriginalEventListener(this.restartBtn,"click",function(){
				//if(self.nameInputPannel.style.visibility=="visible"){
				//	var saveName = self.ls.getItem("userName");
				//	if (!saveName) saveName="Guest_001";
				//	WallComing.rank.update({
				//		"name":saveName,
				//		"score":parseInt(scoreManager.getTotalScore())
				//	});
				//}

				self.hide("endWin");
				//允许提交分数
				confirmflg = false;
				$E.notifyObservers(WallComing.gameObj,"restart");
			});
			$E.addOriginalEventListener(this.photosBtn,"click",function(){
				WallComing.photo.init();
			});

			//提交分数
		
			$E.addOriginalEventListener(this.confirmName,"click",function(){
				if(!confirmflg){
				var nameValue=J.string.encodeHtmlSimple(self.nameInput.value);
				var nameValueMaxLength=self.nameValueMaxLength;
				
				if(nameValue.length>nameValueMaxLength) {
					alert("昵称请少于"+nameValueMaxLength+"个字！");
					return;
				}
				//J.string.encodeHtmlSimple()
				self.ls.setItem("userName",nameValue);

				//提交后台入数据库
				var totalScoreEnd = parseInt(scoreManager.getTotalScore());
				
					J.http.ajax('ranking.php',{
						method:'POST',
						data:{
							totalScoreEnd:totalScoreEnd,
							nameValue:nameValue
						},
						onSuccess: function(){
							$D.setStyle(self.nameInputPannel,"visibility","hidden");
							alert(nameValue+"，恭喜您的分数提交成功!");
						},
						type:'text'
					})
					confirmflg = true;
					return true;
				}else{
					alert("请勿重复提交分数！");
					return false;
				}				
				//更新排行榜数据
				//WallComing.rank.update({
				//	"name":nameValue,
				//	"score":parseInt(self.endTotalScore.innerHTML)
				//});

				//$D.setStyle(self.nameInputPannel,"visibility","hidden");
			});
			$E.addOriginalEventListener(this.rankBtn,"click",function(){
				//显示排行榜
				WallComing.rank.createList();
				WallComing.rank.show();
			});
			$E.addOriginalEventListener(this.nameInput,"click",function(){
				//点击文字全选
				self.nameInput.select();
			});			


		},
		show:function(winId,type){

			var ls=J.localStorage;
			var win=$D.id(winId);
			var title=$D.id("end-title");
			var totalScoreText=this.endTotalScore;
			totalScoreText.innerHTML=scoreManager.getTotalScore();
			$D.setStyle(self.nameInputPannel,"visibility","visible");

			if(type=="failed"){
				title.className="end-failed";
			}
			else{
				title.className="end-congratulation";
			}

			$D.setStyle(win,"display","block");
			$D.setStyle(this.wrap,"display","block");
			soundManager.pause("play");
			soundManager.play("success",true,1,true);

			this.perfectCount.innerHTML="X "+collisionDectManager.perfectCount;
			this.coolCount.innerHTML="X "+collisionDectManager.coolCount;
			this.goodCount.innerHTML="X "+collisionDectManager.goodCount;
			this.badCount.innerHTML="X "+collisionDectManager.badCount;
			//			var self = this;
			WallComing.rank.scoreRank(scoreManager.getTotalScore(), function(score){
				self.scoreRank.innerHTML= score+1;
			});
			//this.scoreRank.innerHTML= WallComing.rank.scoreRank(scoreManager.getTotalScore());



		},
		hide:function(winId){
			var win=$D.id(winId);
			$D.setStyle(win,"display","none");	
			$D.setStyle(this.wrap,"display","none");		
		}

	}
	//暂停窗口
	var	pauseWinManager={
		init:function(){
			var self=this;
			var gameObj=WallComing.gameObj;
			this.wrap=$D.id("winWrap");		
			this.continueBtn=$D.id("continueBtn");	
			this.pauseRankBtn=$D.id("pauseRankBtn");
			this.recaptureBtn=$D.id("recaptureBtn");
			this.pauseRestartBtn=$D.id("pauseRestartBtn");
			this.pauseBtn=$D.id("pauseBtn");//游戏左上角那个
			this.pauseProxy=$D.id("pauseProxy");//游戏左上角那个
			this.pauseAboutBtn=$D.id("pAboutBtn");

			$E.addObserver(gameObj,"startGame",function(){
				if(self.hasBindPauseClick) return;

				$E.addOriginalEventListener(self.pauseBtn,"click",function(e){
					if(!WallComing.VIModule.capturing&&!gameObj.gameEnd)
						self.isShow?$E.notifyObservers(gameObj,"gameContinue"):$E.notifyObservers(gameObj,"gamePause");
				});
				$E.addOriginalEventListener(window,"keydown",function(e){
					if(!WallComing.VIModule.capturing&&!gameObj.gameEnd&&e.keyCode=="27")//Esc pressed
						self.isShow?$E.notifyObservers(gameObj,"gameContinue"):$E.notifyObservers(gameObj,"gamePause");
					_gaq.push(['_trackEvent', 'game', 'click', 'pause']);
				});
				$E.addOriginalEventListener(self.pauseProxy,"click",function(e){
					if(!WallComing.VIModule.capturing&&!gameObj.gameEnd)
						self.isShow?$E.notifyObservers(gameObj,"gameContinue"):$E.notifyObservers(gameObj,"gamePause");
					_gaq.push(['_trackEvent', 'game', 'click', 'pause']);
				});
				self.hasBindPauseClick=true;

			});

			$E.addOriginalEventListener(this.continueBtn,"click",function(){
				$E.notifyObservers(gameObj,"gameContinue");
			});
			$E.addOriginalEventListener(this.pauseRankBtn,"click",function(){
				WallComing.rank.createList();
				WallComing.rank.show();
			});
			$E.addOriginalEventListener(this.pauseAboutBtn,"click",function(){
				aboutWinManager.show();
			});	
			$E.addOriginalEventListener(this.recaptureBtn,"click",function(){

				WallComing.Util.CaptureTips.show();
				self.hide();
			});
			$E.addOriginalEventListener(this.pauseRestartBtn,"click",function(){
				$E.notifyObservers(gameObj,"restart");
				self.hide();
			});

			$E.addObserver(gameObj,"gamePause",function(){
				self.onPause();
			});
			$E.addObserver(gameObj,"gameContinue",function(){
				self.onContinue();
			});
			$E.addObserver(WallComing.time,"timeEnd",function(){
				$D.setStyle(self.pauseBtn,"display","block");
			});
			$E.addObserver(gameObj,"restart",function(){
				$D.setStyle(self.pauseBtn,"display","none");
			})




		},
		onPause:function(){
			this.show();
		},
		onContinue:function(){
			this.hide();
		},
		show:function(){
			var win=$D.id("pauseWin");
			$D.setStyle(win,"display","block");
			$D.setStyle(this.wrap,"display","block");
			this.isShow=true;

		},
		hide:function(){
			var win=$D.id("pauseWin");
			$D.setStyle(win,"display","none");	
			$D.setStyle(this.wrap,"display","none");
			this.isShow=false;			
		}
	}
	//帮助窗口
	var helpWinManager={
		init:function(){
			var self=this;
			this.win=$D.id("helpWin");
			this.helpBtn=$D.id("helpBtn");
			this.closeHelpBtn=$D.id("closeHelpBtn");
			this.pHelpBtn=$D.id("pHelpBtn");
			$E.addOriginalEventListener(this.helpBtn,"click",function(){
				self.show();
			});
			$E.addOriginalEventListener(this.pHelpBtn,"click",function(){
				self.show();
			});
			$E.addOriginalEventListener(this.closeHelpBtn,"click",function(){
				self.hide();
			})
		},
		show:function(){
			var self=this;
			$D.setStyle(self.win,"display","block");
		},
		hide:function(){
			var self=this;
			$D.setStyle(self.win,"display","none");
		}
	}




	//分数管理
	var scoreManager={
		//初始化
		init:function(){
			var self=this;
			this.totalScore=0;
			this.totalScoreElem=$D.id("totalScore");
			this.totalScoreValue=$D.id("totalScoreValue");
			this.life=5;
			this.lifeElem=$D.id("life");
			this.lifeArr=$D.tagName("span",this.lifeElem);
			// this.lifeValue=$D.id("lifeValue");

			this.scoreElemArr=$D.tagName("p",$D.id("popEffectWrap"));


			$E.addObserver(collisionDectManager,"collisionCheck",function(type){
				self.addScore(type);
				if(type=="bad") self.hurtLife();
				soundManager.play(type,false,1,false);
			});
			$E.addObserver(WallComing.gameObj,"startGame",function(){
				$D.setStyle(self.totalScoreElem,"display","block");
				$D.setStyle(self.lifeElem,"display","block");
			})

		},
		reset:function(){
			this.totalScore=0;
			this.totalScoreValue.innerHTML=0;

			this.life=5;
			var lifeArr=this.lifeArr;
			for(var i=0,l=lifeArr.length;i<l;i++){
				$D.setStyle(lifeArr[i],"display","block");
			}

			// this.lifeValue.className="life-value life5";
			$D.setStyle(this.totalScoreElem,"display","none");
			$D.setStyle(this.lifeElem,"display","none");
		},
		addScore:function(type){	
			var scoreElemArr=this.scoreElemArr;
			var score=WallComing.config.score[type];
			this.totalScore+=score;
			this.totalScoreValue.innerHTML=this.totalScore;

			for(var i=0,l=scoreElemArr.length;i<l;i++){
				scoreElemArr[i].innerHTML=this.totalScore;
			}

		},
		hurtLife:function(){
			this.life-=1;
			//$D.setStyle(this.lifeValue,"width",this.life*30+"px");
			// this.lifeValue.className="life-value life"+this.life;
			$D.setStyle(this.lifeArr[this.life],"display","none");

			if(this.life==0){
				$E.notifyObservers(WallComing.gameObj,"gameEnd","failed");
			}
		},
		getTotalScore:function(totalScore){
			return this.totalScore;
		},
		resetScore:function(){
			this.totalScore=0;
		}
	};

	//墙体管理
	var wallManager={
		init:function(){
			var self=this;
			this.wallIndex=0;
			this.wallArr=["w1","w2","w3","w4","w5","w6","w7","w8","w9","w10","w11","w12","w13","w14","w15","w16","w17"];

			this.wallt=0;
			this.wallDuration=2;//墙出现的间隔时间
			this.wallProcessAreaValue=$D.id("wallProcessAreaValue");

			$E.addObserver(this,"wallStop",function(){
				self.onWallStop();
			});
			this.beginWall=true;
		},
		reset:function(){
			this.wallt=0;
			this.wallIndex=0;
			this.wall=null;
			this.beginWall=true;
		},
		onWallStop:function(){
			this.removeWall(this.wall);
			this.wall=null;
		},
		removeWall:function(wall){
			this.beginWall=false;
			this.wall=null;
			// if(wall)
			// 	WallComing.gameObj.spriteList.remove(wall);

		},
		createWall:function(){
			var centerPoint=[cg.size[0]/2,cg.size[1]/2];
			var Wall=WallComing.wcclass.Wall;
			var wallArr=this.wallArr;
			var wallIndex=this.wallIndex;
			var self=this;

			var wall = new Wall({
				src:srcObj[wallArr[wallIndex]],
				size:[200,150],
				pos:new Vector2(
					centerPoint[0],
					centerPoint[1]
				),
				center:new Vector2(
					centerPoint[0],
					centerPoint[1]
				),
				za:0,
				z:-250
			});
			$E.addObserver(wall,"stopMove",function(){
				if(self.wall) $E.notifyObservers(self,"wallStop",wall);
			});

			WallComing.gameObj.spriteList.add(wall);
			this.wall=wall;

			this.wallProcessAreaValue.innerHTML=(this.wallIndex+1) + "/" + this.wallArr.length;


		},
		update:function(duration){
			if(this.wall) return;
			var wallIndex=this.wallIndex;
			var wallDuration=this.wallDuration;
			var wallt=this.wallt+=duration;


			if(wallt>wallDuration){
				this.wallIndex++;
				if(this.wallIndex==this.wallArr.length){ 
					$E.notifyObservers(WallComing.gameObj,"gameEnd","congratulations");
					return;
				}
				else{
					this.beginWall=true;
					this.createWall();
					this.wallt=0;
				}
			}
		}
	}

	//人影和墙的碰撞检测管理
	var collisionDectManager={
		init:function(){
			var self=this;
			this.bgCanvas=$D.id("canvas");
			this.personCanvas=$D.id("compare");
			this.bgCtx=this.bgCanvas.getContext("2d");
			this.personCtx=this.personCanvas.getContext("2d");

			this.perfectCount=0;	
			this.coolCount=0;
			this.goodCount=0;
			this.badCount=0;

			$E.addObserver(wallManager,"wallStop",function(){
				var imgData1=self.personCtx.getImageData(195,50,620,650);
				var imgData2=self.bgCtx.getImageData(195,50,620,650);

				self.check(imgData1,imgData2);
			});

		},
		check:function(imgData1,imgData2){
			WallComing.effects.ShiningLine.shock();
			//检测
			var r=WallComing.VIModule.compareAlpha(imgData1,imgData2);

			if(r.rate < 0.25 && r.invokeCount > 20000){// orgin 0.2
				$E.notifyObservers(this,"collisionCheck","perfect");
				this.perfectCount++;		
			}
			else if(r.rate < 0.4 && r.invokeCount > 20000){//origin 0.3
				$E.notifyObservers(this,"collisionCheck","cool");
				this.coolCount++;		
			}else if(r.rate < 0.5 && r.invokeCount > 20000){//Good orgin 0.4
				$E.notifyObservers(this,"collisionCheck","good");
				this.goodCount++;
			}else{//Fail
				$E.notifyObservers(this,"collisionCheck","bad");	
				this.badCount++;
			}	

		},
		reset:function(){
			this.perfectCount=0;	
			this.coolCount=0;
			this.goodCount=0;
			this.badCount=0;			
		}
	};

	//声音管理
	var audioOpenStatus = true;
	var soundManager={
		init:function(){
			var self=this;
			var gameObj=WallComing.gameObj;
			this.currentAudio = null;
			//关闭全局声音
			this.gameAudio = $D.id("gameAudio");
			this.clickAudio = $D.id("clickAudio");

			$E.on(this.clickAudio, "click", function(){
				var audioStatus = $D.hasClass(self.gameAudio, "openAudio");
				if(audioStatus){
					//audioOpenStatus = false;
					self.sing();
					$D.removeClass(self.gameAudio,"openAudio");
				}else{
					//audioOpenStatus = true;
					self.silent();
					$D.addClass(self.gameAudio,"openAudio");
				}
			});


			$E.addObserver(gameObj,"gamePause",function(){
				self.pause();
			});
			$E.addObserver(gameObj,"gameContinue",function(){
				self.resume();
			});
		},
		reset:function(){
			//this.currentAudio = null;
		},
		play:function(newAudio, stop, volume,isLoop){

			var audio = cg.loader.loadedAudios[srcObj["audio_"+newAudio]];
			if(stop){
				if(this.currentAudio)
					this.stop(this.currentAudio);

				this.currentAudio=audio;
			}

			isLoop&&(audio.loop=true);
			if(audioOpenStatus){
				audio.volume = volume;
			}
			audio.play();

		},
		silent:function(){
			audioOpenStatus = false;
			for(name in srcObj){
				if(name.indexOf("audio_") > -1){
					cg.loader.loadedAudios[srcObj[name]].volume = 0;
				}
			}

		},
		sing:function(){
			audioOpenStatus = true;
			for(name in srcObj){
				if(name.indexOf("audio_") > -1){
					cg.loader.loadedAudios[srcObj[name]].volume = 1;
				}
			}

		},
		stop:function(){

			this.currentAudio.pause();
			this.currentAudio.currentTime=0;	

		},
		pause:function(){
			this.currentAudio&&this.currentAudio.pause();		
		},
		resume:function(){

			this.currentAudio.play();

		}

	};

	var winResizeManager={
		init:function(){
			var self=this;
			this.outerWrap=$D.id("outerWrap");
			this.onResize();

			$E.addOriginalEventListener(window,"resize",function(){
				self.onResize();
			});
			$E.addOriginalEventListener(window,"unload",function(){
				self.onUnLoad();
			});

		},
		onResize:function(){
			this.updateWrapSize();
			//if(window.innerWidth<cg.width||window.innerHeight<cg.height){
			var pw=window.innerWidth/cg.width;
			var ph=window.innerHeight/cg.height;
			var p = (pw <= ph) ? pw : ph;
			$D.setStyle(this.outerWrap,"-webkit-transform","scale("+p+")");
			// }	
			// else{
			// 	$D.setStyle(this.outerWrap,"-webkit-transform","scale(1)");
			// }

		},
		onUnLoad:function(){
			WallComing.share.logout();//清空微博登录态
		},
		updateWrapSize:function(){
			$D.setStyle(this.outerWrap,"width",window.innerWidth+"px");
			$D.setStyle(this.outerWrap,"height",window.innerHeight+"px");
		}
	}

	this.helpWinManager=helpWinManager;
	this.winResizeManager=winResizeManager;
	this.pauseWinManager=pauseWinManager;
	this.soundManager=soundManager;
	this.collisionDectManager=collisionDectManager;
	this.wallManager=wallManager;
	this.scoreManager=scoreManager;
	this.popEffectManager=popEffectManager;
	this.backGroundManager=backGroundManager;
});


/*
 * 
 * by Cson
 *
 */
Jx().$package("WallComing",function(J) {
	var $D = J.dom,
		$E = J.event,
		$U = WallComing.Util,
		cg=J.cnGame,
		$A = cg.Animation,
		bg,
		player,
		config=WallComing.config,
		srcObj=config.srcObj,
		Wall=WallComing.wcclass.Wall,
		Sp=cg.Sprite,
		SL=cg.SpriteList,
		wcmain=WallComing.wcmain,
		backGroundManager=wcmain.backGroundManager,
		popEffectManager=wcmain.popEffectManager,
		wallManager=wcmain.wallManager,
		soundManager=wcmain.soundManager;
		TextManager=WallComing.TextManager;


	//初始化框架
	J.cnGame.init("canvas", { size:[1024,768],isScaleBg:false,fps:60,tps:60});

	//开始倒计时
	var startTime = function(){
		WallComing.time.start();
		wcmain.soundManager.play("start", true, 1, true);
		$E.removeObserver($U, 'endCapture', startTime);
		$E.addObserver($U, 'endCapture', function(){
			$E.notifyObservers(gameObj,"gamePause");
		});
		$D.id('compare').style.left='0px';
		
	}

	//游戏逻辑管理对象
	var gameObj={
		initialize:function(){
			var self=this;
			this.gameEnd=true;
			//精灵列表
			this.spriteList=new SL();

			$E.addObserver($U, 'endCapture', startTime);

			$E.addObserver(WallComing.time, 'timeEnd',function(){

				$E.notifyObservers(gameObj,"gameContinue");
				//建造第一道墙
				wallManager.createWall();
				//重新开始游戏
				$E.addObserver(self,"restart",function(){
					self.restart();
				});
				//结束游戏
				$E.addObserver(self,"gameEnd",function(){
					self.endGame();
				});
				//暂停游戏
				$E.addObserver(self,"gamePause",function(){
					cg.loop.pauseLoop();
				});
				//继续游戏
				$E.addObserver(self,"gameContinue",function(){
					// WallComing.VIModule.stop();
					$U.CaptureTips.hide();
					cg.loop.runLoop();
				});
				//背景音乐播放
				soundManager.play("play",true,1,true);
				//开始游戏事件通知
				$E.notifyObservers(self,"startGame");		
				self.gameEnd=false;	
				//$D.id("main").style.display="none";
			});

			// //页面主程序初始化
			// WallComing.wcmain.init();
			

			//加载完毕
			this.isLoaded = true;
			$D.id("loading").style.display="none";
			$D.id("leftHand").style.display="block";
			$D.id("rightHand").style.display="block";

			$E.notifyObservers(this,"load");	


				// if($U.WallPrepare.isPermission){
			// 	//用户已授权摄像头
			// 	$D.id('compare').style.left='0px';
			// }

		},
		endGame:function(){
			this.gameEnd=true;
		},
		cleanStage:function(){
			this.spriteList=new SL();
		},
		restart:function(){
			WallComing.share.logout();//清空微博登录态
		
	        WallComing.wcmain.reset();
	        soundManager.play("start",true,1,true);
	        this.gameEnd=true;
	    
	        WallComing.VIModule.clearCompare();
	        WallComing.time.reset();
	        WallComing.time.start();
	      
	        WallComing.photo.reset();	

	        this.cleanStage();	
	        WallComing.VIModule.reset();
		},
		update:function(duration){
		
			if(this.gameEnd) return;

			//精灵更新
			var spriteList=this.spriteList;
			spriteList.update(duration);
			//动态背景更新
			backGroundManager.update(duration);
			//墙体管理更新
			wallManager.update(duration);

			WallComing.VIModule.update();
			$A.update();

		},
		draw:function(){
			if(this.gameEnd) return;
			//动态背景绘制
			backGroundManager.draw();
			//绘制
			this.spriteList.draw();	
		}
	}
	this.gameObj=gameObj;

});

Jx().$package("WallComing.score", function(J) {

	var $D = J.dom;
	var $E = J.event;
	var self=this;

});
Jx().$package("WallComing.time", function(J) {
	var pai2 = Math.PI * 2;
	var index = 0; //Ä¿Ç°¶ÁÈ¡×ÖÄ¸µÄË÷Òý
	var center; //canvasÖÐµã×ø±ê
	var timeId1;
	var timeId2;
	var timeId3;
	var $D=J.dom;

	var tween = {
		linear: function(t, b, v) {
			return v * t + b;
		}
	}
	var Point = function(opt) {
			this.init(opt);
		}

	this.start = function(callback) {

		TextManager.init("time_canvas", "text_canvas", "rgb(2,220,246)",callback);
		TextManager.changeStr("321 ");
	
	}

	Point.prototype = (function() {
		var dirArr = [1, -1];
		return {
			init: function(opt) {
				var oriParam = this.resetOnZValue(opt.oriPos, opt.oriRadius);
				var currentParam = this.resetOnZValue(opt.pos, opt.oriRadius);

				this.oriPos = oriParam[0]; //³õÊ¼Î»ÖÃ
				this.oriRadius = oriParam[1]; //³õÊ¼°ë¾¶
				this.pos = currentParam[0]; //ÏÖÊ±Î»ÖÃ
				this.radius = currentParam[1]; //ÏÖÊ±°ë¾¶
				this.speed = opt.speed || 0; //ËÙ¶È
				this.angleZ = 0;
				this.angleX = 0;
				this.wcchar = opt.wcchar; //ËùÊôµÄ×ÖÄ¸
			},
			setPos: function(pos) {
				this.pos = pos;
			},
			setDetail: function(newDetail) { //ÉèÖÃÐ¡ÇòÑÕÉ«ÐÅÏ¢
				this.detail = newDetail;
			},
			setOnBack: function(func) {
				this.onBack = func;
			},
			resetOnZValue: function(pos, radius) {
				var z = pos[2];
				var halfWidth = center[0];
				var scale = (halfWidth + z) / halfWidth;
				var newPos = [];
				var newRadius;
				newPos[0] = center[0] + (pos[0] - center[0]) * scale; //¼ÆËãÊÜzÖáÓ°ÏìºóÐ¡ÇòµÄÎ»ÖÃÖµºÍ³ß´ç
				newPos[1] = center[1] - (center[1] - pos[1]) * scale;
				newPos[2] = z;
				newRadius = radius * scale;
				return [newPos, newRadius]; //·µ»ØÐ¡ÇòÊÜXÖáÓ°ÏìºóÐÂµÄ×ø±êºÍ³ß´ç
			},
			randomMove: function() {
				this.angleZ = Math.random() * pai2;
				this.angleX = Math.random() * pai2;
				this.startTime = (new Date()).getTime();
			},
			move: function() {
				var t = (new Date()).getTime() - this.startTime;
				if(this.isRandom) { //Ëæ»úÒÆ¶¯	
					var zSpeed = this.speed * Math.sin(this.angleZ);
					var xySpeed = this.speed * Math.cos(this.angleZ);
					var xSpeed = xySpeed * Math.cos(this.angleX);
					var ySpeed = -xySpeed * Math.sin(this.angleX);
					this.pos[0] = tween.linear(t, this.oriPos[0], xSpeed);
					this.pos[1] = tween.linear(t, this.oriPos[1], ySpeed);
					this.pos[2] = -Math.abs(tween.linear(t, this.oriPos[2], zSpeed));

					var halfWidth = center[0];
					var scale = (halfWidth + this.pos[2]) / halfWidth;
					this.radius = Math.min(20, Math.max(0, this.oriRadius * scale));
					(this.radius > 50) && (this.radius = 0);
				} else { //¸´Î»
					if(t >= this.moveDuration) {
						this.pos[0] = this.oriPos[0];
						this.pos[1] = this.oriPos[1];
						this.pos[2] = this.oriPos[2];
						var halfWidth = center[0];
						var scale = (halfWidth + this.pos[2]) / halfWidth;
						this.radius = Math.max(0, this.oriRadius * scale);
						(this.radius > 50) && (this.radius = 0);
						this.onBack && this.onBack.call(this); //¸´Î»Íê³ÉµÄ»Øµ÷º¯Êý
						return;
					}
					this.pos[0] = tween.linear(t, this.fromPos[0], this.dx / this.moveDuration);
					this.pos[1] = tween.linear(t, this.fromPos[1], this.dy / this.moveDuration);
					this.pos[2] = tween.linear(t, this.fromPos[2], this.dz / this.moveDuration);
					var halfWidth = center[0];
					var scale = (halfWidth + this.pos[2]) / halfWidth;
					this.radius = Math.max(0, this.oriRadius * scale);
					(this.radius > 50) && (this.radius = 0);

				}
			},
			moveBack: function(duration) {
				this.moveDuration = duration;
				this.dx = this.oriPos[0] - this.pos[0];
				this.dy = this.oriPos[1] - this.pos[1];
				this.dz = this.oriPos[2] - this.pos[2];
				this.fromPos = []; //¿ªÊ¼¸´Î»Ê±Ð¡ÇòµÄÎ»ÖÃ
				this.fromPos[0] = this.pos[0];
				this.fromPos[1] = this.pos[1];
				this.fromPos[2] = this.pos[2];
				this.startTime = (new Date()).getTime();

			},
			draw: function(screenCtx) { //»æÖÆÐ¡Çò
				var detail = this.detail;
				screenCtx.fillStyle = "rgba(" + detail[0] + "," + detail[1] + "," + detail[2] + "," + detail[3] / 255 + ")";

				// screenCtx.arc(this.pos[0],this.pos[1],this.radius,0,Math.PI*2,true);
				screenCtx.fillRect(this.pos[0], this.pos[1], this.radius, this.radius, -this.radius / 2, -this.radius / 2, this.radius, this.radius);

				screenCtx.fill();


			}
		}

	})();

	/*	×ÖÄ¸	*/
	var Char = function(charText, scale, textCtx) {
			this.init(charText, scale, textCtx);

		}
	Char.prototype = (function() {
		return {
			init: function(charText, scale, textCtx) {
				var textWidth = textCanvas.width;
				var textHeight = textCanvas.height;
				var screenWidth = screenCanvas.width;
				var screenHeight = screenCanvas.height;
				this.scale = scale || 1;
				this.charText = charText; //×ÖÄ¸ÎÄ±¾
				this.data = textCtx.getImageData(0, 0, textWidth, textHeight).data; //×ÖÄ¸ÏñËØÊý¾Ý
				this.pointsArr = []; //Ð¡ÇòµÄ¼¯ºÏ
				this.backNum = 0; //¸´Î»Ð¡ÇòµÄ¸öÊý
				for(var i = 0; i < textHeight; i++) {
					for(var j = 0; j < textWidth; j++) {

						var data = this.data;
						var r = data[((textWidth * i) + j) * 4];
						var g = data[((textWidth * i) + j) * 4 + 1];
						var b = data[((textWidth * i) + j) * 4 + 2];
						var o = data[((textWidth * i) + j) * 4 + 3];
						var newDetail = [r, g, b, o];

						if(o > 128) {
							//newDetail[3]=255;
							var randomX = Math.random() * screenWidth;
							var randomY = Math.random() * screenHeight;
							var randomZ = Math.random() * 600 - 300;
							//Éú³ÉÐÂµã
							var newPoint = new Point({
								oriPos: [this.scale + j * this.scale * 2, this.scale + i * this.scale * 2, 0],
								pos: [randomX, randomY, randomZ],
								oriRadius: this.scale,
								speed: 1.9,
								wcchar: this
							});
							//¸´Î»ºóµÄ»Øµ÷º¯Êý	
							newPoint.setOnBack(function() {
								var count = this.wcchar.pointsArr.length;
								var charObj = this.wcchar;
								this.isBack = true;
								charObj.backNum++;
								if(charObj.backNum == count) {
									timeId1 = window.setTimeout(function() {
										charObj.randomMovePoints(); //¸´Î»ºóËæ»úÒÆ¶¯
									}, 1000);
									timeId2 = window.setTimeout(function() {
										TextManager.loadText(++index);
									}, 2000);
								}
							});

							newPoint.setDetail(newDetail);
							this.pointsArr.push(newPoint);
						}
					}
				}
			},
			/*	Ëæ»úÒÆ¶¯Ð¡Çò	*/
			randomMovePoints: function() {
				for(var i = 0, len = this.pointsArr.length; i < len; i++) {
					this.pointsArr[i].randomMove();
					this.pointsArr[i].isRandom = true;
				}
			},
			/*	¸´Î»Ð¡Çò	*/
			moveBackPoints: function(duration) {
				for(var i = 0, len = this.pointsArr.length; i < len; i++) {
					this.pointsArr[i].moveBack(duration);
					this.pointsArr[i].isRandom = false;
				}

			},
			/*	ÒÆ¶¯ËùÓÐÐ¡Çò	*/
			moveAllPoints: function() {
				for(var i = 0, len = this.pointsArr.length; i < len; i++) {
					this.pointsArr[i].move();
				}
			},
			/*	»æÖÆËùÓÐÐ¡Çò	*/
			drawAllPoints: function(screenCtx) {
				for(var i = 0, len = this.pointsArr.length; i < len; i++) {
					this.pointsArr[i].draw(screenCtx);
				}
			}

		};
	})();

	this.reset=function(){
		$D.addClass($D.id("canvasWrap"), 'hidden');			
	};


	var TextManager = (function() {
		return {
			init: function(screenId, textId, textColor,callback) {
				mainCanvas=document.getElementById("canvas");
				screenCanvas = document.getElementById(screenId);
				textCanvas = document.getElementById(textId);
				center = [screenCanvas.width / 2, screenCanvas.height / 2]; //canvasÖÐµã×ø±ê	
				this.screenCtx = screenCanvas.getContext("2d");
				this.textCtx = textCanvas.getContext("2d");
				this.textColor = textColor;
				this.charArr = [];
				this.callback=callback;
				TextManager.update()();
			},
			/*	¸Ä±ä×Ö·û´®	*/
			changeStr: function(text) {
				this.text = text;
				index = 0;
				this.charArr = [];
				this.loadText(index);
			},
			/*	¶ÁÈ¡ÎÄ±¾	*/
			loadText: function(index) {
				var textCtx = this.textCtx;
				var charText = this.text[index]; //µ±Ç°¶ÁÈ¡µÄ×ÖÄ¸ÎÄ±¾
				if(!charText) {
					return;
				}
				textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
				textCtx.fillStyle = this.textColor;
				textCtx.font = 'normal 20px Helvetica';
				textCtx.fillText(charText, 11, 19);


				var newChar = new Char(charText, 15, textCtx); //½¨Á¢ÐÂµÄ×ÖÄ¸¶ÔÏó
				newChar.moveBackPoints(400);
				this.charArr.push(newChar);
				if(index == 3) {

					$D.removeClass($D.id("canvasWrap"), 'hidden');		
			
					// TextManager = null;
					// screenCanvas = null;
					// textCanvas = null;
					clearTimeout(timeId1);
					clearTimeout(timeId2);
					clearTimeout(timeId3);

					$E.notifyObservers(WallComing.time, 'timeEnd');
					// Jx().cnGame.loader.start(WallComing.gameObj, {
					// 	srcArray: WallComing.config.srcObj
					// });
					//资源加载
					//Jx().cnGame.init("canvas", { size:[1024,768],isScaleBg:false,fps:60,tps:60});
					this.charArr = [];
				}
			},
			/*	Ö¡¸üÐÂºÍ»æÖÆ	*/
			update: function() {
				var self = this;
				return function() {
					var screenCtx = self.screenCtx;
					screenCtx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
					screenCtx.fillStyle = "transparent";
					screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
					//screenCtx.drawImage(0,0,screenCanvas.width,screenCanvas.height);
					for(var i = 0, len = self.charArr.length; i < len; i++) {
						self.charArr[i].moveAllPoints();
						self.charArr[i].drawAllPoints(screenCtx);
					}
					timeId3 = window.setTimeout(arguments.callee, 30);
				}

			}


		}
	})();

});

;
Jx().$package('WallComing.effects', function(J) {
	var $D = J.dom,
		$E = J.event;
	var init = function(){};
	var ShiningLine = {
		speed:{
			FAST:'1.5s',
			NORMAL: '3s',
			SLOW: '6s'
		},
		init: function(){
			this.el = $D.id('line');
			$D.addClass(this.el, 'shining');
		},
		/**
		 * default: ShiningLine.speed.NORMAL
		 */
		setSpeed: function(sp){
			this.el.style['-webkit-animation-duration'] = sp;
		},

		/**
		 * time 时间后移除shock效果
		 */
		shock: function(time){
			var time = time || 1500;
			$D.addClass(this.el, 'shock');
			$E.notifyObservers(this, 'onStartShock');
			var _this = this;
			setTimeout(function(){
				$D.removeClass(_this.el,'shock');
				$E.notifyObservers(_this, 'onEndShock');
			},time);
		}

	}

	var StartAnimation = {
		init: function(){
			this.el = $D.id('alloy');
			$D.addClass(this.el, 'start');
			var logo = $D.id('logo');
			var permissionTips = $D.id('permissionTips');
			var gameWrapper = $D.id('gameWrapper');
			$E.on(this.el, 'webkitAnimationEnd', function(){
				$D.addClass(logo, 'start');
			});


			var self=this;
			setTimeout(function(){
				if(self.isStart) return;
				permissionTips.style.display = 'block';
				gameWrapper.style.display = 'block';
				WallComing.wcmain.init();
				self.isStart=true;
			},4000);
			$E.on(logo, 'webkitAnimationEnd', function(){
				setTimeout(function(){
					StartAnimation.el.style.opacity = 0;
				}, 500);
				setTimeout(function(){
					if(self.isStart) return;
					permissionTips.style.display = 'block';
					gameWrapper.style.display = 'block';
					WallComing.wcmain.init();
					self.isStart=true;
				}, 1500);
			})
		}
	}

	this.StartAnimation=StartAnimation;
	this.ShiningLine = ShiningLine;
	this.init = init;
});

