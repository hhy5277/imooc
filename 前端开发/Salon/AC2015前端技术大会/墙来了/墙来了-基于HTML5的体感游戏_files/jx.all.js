﻿/**    
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * http://code.google.com/p/j-et/
 *
 * @version    1.0
 * @author    Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

/**    
 * @description
 * Package: Jx
 *
 * Need package:
 * no.
 * 
 */

/**
 * 1.[JET core]: JET 微内核
 */
;(function(tn){
    var version = "1.0.%Version%",
        mark = "JxMark",
        topNamespace = tn,
        undefined,
        
        // 将顶级命名空间中可能存在的 Jx 对象引入
        Jx = topNamespace.Jx,
        
        VERSIONS = {},
        PACKAGES = {},
        
        DEBUG = {
            NO_DEBUG: 0,
            SHOW_ALL: 1
        },
        
        option = {
            debug: 1
        },
        
        /**
         * @ignore
         */
        out = function(msg,tag,type){
            msg = String(msg);
            //type = type||"";
            //type = (typeof type == "undefined")?0:type;
            if(option.debug){
                if(this.console){
                    if(this.console.out){
                        this.console.out(msg,tag,type);
                    }else{
                        alert(msg+" - 消息类型["+type+"]");
                    }
                    
                }
            }
            return msg;
        };

    try{
        // 判断Jx名字空间是否已经存在
        if(typeof Jx === "undefined" || (Jx.mark && Jx.mark === mark)){
            
            // 如果已经有Jx对象则记录已有的信息
            if(Jx){
                VERSIONS = Jx.VERSIONS;
                PACKAGES = Jx.PACKAGES;
            }
            
            /**
             * 【Jx 对象原型】
             * Jx
             * @class 
             * @constructor Jx
             * @global
             * 
             * @since version 1.0
             * @description Jx 对象原型的描述
             * 
             * @param {Number} ver 要使用的 Jx 的版本号，当前是1.0
             * @param {Boolean} isCreateNew 是否创建一个新的 Jx 实例，默认为 false 不创建新的 Jx 实例，只返回同一版本在全局中的唯一一个实例，注意：除非特殊需要，否则一般不要创建新的 Jx 实例
             * @return {Object} 返回对应版本的 Jx 对象
             * 
             * @example
             * //代码组织方式一(传统)：
             * var J = new Jx();
             * J.out(J.version);    //输出当前Jx的版本
             * 
             * @example
             * //代码组织方式二(推荐)：
             * Jx().$package(function(J){
             *     J.out(J.version);    //输出当前Jx的版本
             * };
             * //注：此种方式可以利用匿名函数来防止变量污染全局命名空间，尤其适合大型WebApp的构建！
             * 
             * @example
             * //范例：
             * Jx().$package("tencent.alloy", function(J){
             *     var $ = J.dom.id,
             *     $D = J.dom,
             *     $E = J.event,
             *     $H = J.http;
             *     this.name = "腾讯Q+ Web";
             *     J.out(this.name);
             * };
             * 
             */
            Jx = function(ver, isCreateNew){
                var J = this;

                var instanceOf = function(o, type) {
                    return (o && o.hasOwnProperty && (o instanceof type));
                };

                if(isCreateNew){
                    // 如果是第一次执行则初始化对象
                    if ( !( instanceOf(J, Jx) ) ) {
                        J = new Jx(ver);
                    } else {
                        J._init();
                    }
                }else{
                    if(ver){
                        ver = String(ver);
                        try{
                            if(Jx.VERSIONS[ver]){
                                J = Jx.VERSIONS[ver];
                            }else{
                                J = Jx.VERSIONS[Jx.DEFAULT_VERSION];
                                throw new Error("没有找到 JET version " + ver + ", 所以返回默认版本 JET version " + Jx.DEFAULT_VERSION + "!");
                            }
                        }catch(e){
                            //J.out(e.fileName+";"+e.lineNumber+","+typeof e.stack+";"+e.name+","+e.message, 2);
                            J.out("A.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
                        }
                    }else{
                        J = Jx.VERSIONS[Jx.DEFAULT_VERSION];
                    }
                }
                return J;
            };
            
            Jx.prototype = {
                /**
                 * 当前 Jx 的版本号，此版本是 1.0 <br/>
                 * Version 1.0
                 * 
                 * @description {Num} 当前 Jx 的版本号！
                 * @constant
                 * @type Number
                 */
                version: version,
                
                DEBUG: DEBUG,
                
                /**
                 * Jx 配置
                 * @ignore
                 */
                option: option,
                
                /**
                 * Jx 的初始化方法
                 * initialize method
                 * 
                 * @private
                 * @param {Object} o config 对象
                 */
                _init: function(){
                    this.constructor = Jx;
                    //return true;
                },
            
                /**
                 * 创建一个命名空间，创建的命名空间将会在 window 根命名空间下。
                 * Create a new namespace, the top namespace is window.
                 * 
                 * @since version 1.0
                 * @description 可以一次性连续创建命名空间
                 * 
                 * @param {String} name 命名空间名称
                 * @returns {Object} 返回对最末命名空间的引用
                 * 
                 * @example
                 * //在全局环境中创建tencent.alloy名字空间, $namespace完成的操作相当于在全局环境中执行如下语句：
                 * //var tencent = {};
                 * //tencent.alloy = {};
                 * 
                 * J.$namespace("tencent.alloy");
                 * 
                 * //注：Jx的$namespace方法与其他JS框架的namespace的方法不同，其他框架如YUI是在其YAHOO对像下创
                 * //建命名空间，而Jx的$namespace测试直接在顶级命名空间window的下边直接创建命名空间。
                 * 
                 */
                $namespace: function(name) {
                    // Handle "", null, undefined, false
                    if ( !name ) {
                        return topNamespace;
                    }

                    name = String(name);

                    var i,
                        ni,
                        nis = name.split("."),
                        ns = topNamespace;

                    for(i = 0; i < nis.length; i=i+1){
                        ni = nis[i];
                        ns[ni] = ns[ni] || {};
                        ns = ns[nis[i]];
                    }

                    return ns;
                },
    
                /**
                 * 创建一个 Javascript 代码包
                 * 
                 * @param {String} name 要创建的包的名字空间
                 * @param {Function} func 要创建的包的包体
                 * @returns {Mixed} 返回任何自定义的变量
                 * 
                 * @example
                 * //创建一个匿名package包：
                 * Jx().$package(function(J){
                 *     //这时上下文对象this指向全局window对象
                 *     alert("Hello world! This is " + this);
                 * };
                 * 
                 * @example
                 * //创建一个名字为tencent.kinvix的package包：
                 * Jx().$package("tencent.kinvix", function(J){
                 *     //这时上下文对象this指向window对象下的tencent.kinvix对象
                 *     alert("Hello world! This is " + this);
                 * };
                 * 
                 * 
                 * 
                 */
                $package: function(){
                    var name = arguments[0],
                        func = arguments[arguments.length-1],
                        ns = topNamespace,
                        returnValue;
                        if(typeof func === "function"){
                            // handle name as ""
                            if(typeof name === "string"){
                                ns = this.$namespace(name);
                                if( Jx.PACKAGES[name] ){
                                    //throw new Error("Package name [" + name + "] is exist!");
                                }else{
                                    Jx.PACKAGES[name] = {
                                        isLoaded: true,
                                        returnValue: returnValue    // undefined as default
                                    };
                                }
                                ns.packageName = name;
                            }else if(typeof name === "object"){
                                ns = name;
                            }
                            
                            returnValue = func.call(ns, this);
                            typeof name === "string" && (Jx.PACKAGES[name].returnValue = returnValue);
                        }else{
                            throw new Error("Function required");
                        }
    
                },
                
                /**
                 * 检查一个 Javascript 模块包是否已经存在
                 * 
                 * @param {String} name 包名
                 * @return {Object} 如果已加载则返回包对象，否则返回 undefined
                 * 
                 * @example
                 * //创建一个匿名package包：
                 * Jx().$package(function(J){
                 *     // 输出undefined
                 *     J.out(J.checkPackage("tencent.kinvix"));
                 * };
                 * 
                 * 
                 * @example
                 * //创建一个名字为tencent.kinvix的package包：
                 * Jx().$package("tencent.kinvix", function(J){
                 *     //这时上下文对象this指向window下的tencent.kinvix对象
                 *     alert("Hello world! This is " + this);
                 * };
                 * 
                 * Jx().$package(function(J){
                 *     // J.checkPackage("tencent.kinvix")结果返回的将是tencent.kinvix的引用
                 *     var kinvix = J.checkPackage("tencent.kinvix");
                 *     if(kinvix){
                 *         J.out("tencent.kinvix包已加载...");
                 *     }
                 * };
                 * 
                 */
                checkPackage: function(name){
                    return Jx.PACKAGES[name];
                },
                
                /**
                 * 标准化 Javascript 的核心输出方法，注意：在不同的Javascript嵌入宿主中会覆盖此方法！
                 * 
                 * @method out
                 * @function
                 * 
                 * @param {String} msg 要输出的信息
                 * @param {Number} type 输出信息的类型
                 * @return {String} msg 返回要输出的信息
                 * 
                 * @example
                 * //创建一个匿名package包：
                 * Jx().$package(function(J){
                 *     // 向Jx的控制台输出信息,在不同的js宿主中具体实现细节会不同,但不会影响out方法的使用;
                 *     J.out("Hello, world!");
                 * };
                 * 
                 */
                out: out,
                
                /**
                 * 我就是传说中的debug哥！
                 * 
                 * @method debug
                 * @function
                 * 
                 * @see 想知道我到底是谁吗?请参考J.console.debug
                 */
                debug: function(){},
                profile : function(){},
                warn : function(){},
                error : function(){},
                
                startTime: +new Date(),
                
                /**
                 * 关于 Jx
                 * 
                 * @return {String} 返回 Jx 的 about 信息
                 */
                about: function(){
                    return this.out("JET (Javascript Extend Tools)\nversion: " + this.version + "\n\nCopyright (c) 2009, All rights reserved.");
                },
                
                /**
                 * Jx 对象转化为字符串的方法
                 * 
                 * @ignore
                 * @return {String} 返回 Jx 对象串行化后的信息
                 */
                toString: function(){
                    return "JET version " + this.version + " !";
                }
            };

            /**
             * Jx 版本库对象
             * 
             * @ignore
             * @type Object
             */
            Jx.VERSIONS = VERSIONS;
            
            /**
             * 记录加载的包的对象
             * 
             * @ignore
             * @type Object
             */
            Jx.PACKAGES = PACKAGES;

            /**
             * 创建一个当前版本 Jx 的实例
             * 
             * @ignore
             * @type Object
             */
            Jx.VERSIONS[version] = new Jx(version, true);
        
            /**
             * Jx 默认版本的版本号，默认将会是最后一个加载的Jx版本
             * 
             * @constant
             * @type Number
             */
            Jx.DEFAULT_VERSION = version;
            /**
             * Jx 对象验证标记
             * 
             * @ignore
             * @description 用于验证已存在的Jx对象是否是本框架某子版本的Jx对象
             * @type String
             */
            Jx.mark = mark;
            
            // 让顶级命名空间的 Jx 对象引用新的 Jx 对象
            topNamespace.Jet = topNamespace.Jx = Jx;
        }else{
            throw new Error("\"Jx\" name is defined in other javascript code !!!");
        }
    }catch(e){
        // 微内核初始化失败，输出出错信息
        out("JET 微内核初始化失败! " + "B.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 1);
    }
})(this);


/**
 * 2.[Javascript core]: 常用工具函数扩展
 */
Jx().$package(function(J){
    var isUndefined,
        isNull,
        isNumber,
        isString,
        isBoolean,
        isObject,
        isArray,
        isArguments,
        isFunction,
        $typeof,
        
        $return,
        $try,
        
        emptyFunc,
        
        checkJSON,
        random,
        extend,
        clone,
        now,
        timedChunk,

        getLength,


        rebuild,
        pass,
        bind,
        bindNoEvent,

        

        
        Class;

    /**
     * 判断变量的值是否是 undefined
     * Determines whether or not the provided object is undefined
     * 
     * @method isUndefined
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的值是 undefined 时返回 true
     */
    isUndefined = function(o) {
        return typeof(o) === "undefined";
    };
        
    /**
     * 判断变量的值是否是 null
     * Determines whether or not the provided object is null
     * 
     * @method isNull
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的值是 null 时返回 true
     */
    isNull = function(o) {
        return o === null;
    };
    
    /**
     * 判断变量的类型是否是 Number
     * Determines whether or not the provided object is a number
     * 
     * @memberOf Jx.prototype
     * @name isNumber
     * @function
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 number 时返回 true
     */
    isNumber = function(o) {
        return (o === 0 || o) && o.constructor === Number;
    };
    
    /**
     * 判断变量的类型是否是 Boolean
     * Determines whether or not the provided object is a boolean
     * 
     * 
     * @method isBoolean
     * @memberOf Jx.prototype
     * 
     * @static
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 boolean 时返回 true
     */
    isBoolean = function(o) {
        return (o === false || o) && (o.constructor === Boolean);
    };
    
    /**
     * 判断变量的类型是否是 String
     * Determines whether or not the provided object is a string
     * 
     * 
     * @method isString
     * @memberOf Jx.prototype
     * 
     * @static
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 string 时返回 true
     */
    isString = function(o) {
        return (o === "" || o) && (o.constructor === String);
    };
    
    /**
     * 判断变量的类型是否是 Object
     * Determines whether or not the provided object is a object
     * 
     * 
     * @method isObject
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 object 时返回 true
     */
    isObject = function(o) {
        return (o && (o.constructor === Object)) || (String(o)==="[object Object]");
    };
    
    /**
     * 判断变量的类型是否是 Array
     * Determines whether or not the provided object is a array
     * 
     * 
     * @method isArray
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 array 时返回 true
     */
    isArray = function(o) {
        return (o && (o.constructor === Array)) || (Object.prototype.toString.call(o)==="[object Array]");
    };
    
    /**
     * 判断变量的类型是否是 Arguments
     * Determines whether or not the provided object is a arguments
     * 
     * 
     * @method isArguments
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 arguments 时返回 true
     */
    isArguments = function(o) {
        return o && o.callee && isNumber(o.length) ? true : false;
    };
    
    /**
     * 判断变量的类型是否是 Function
     * Determines whether or not the provided object is a function
     * 
     * 
     * @method isFunction
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 function 时返回 true
     */
    isFunction = function(o) {
        return o && (o.constructor === Function);
    };
    
    /**
     * 判断变量类型的方法
     * Determines the type of object
     * 
     * 
     * @method $typeof
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {String} 返回变量的类型，如果不识别则返回 other
     */
    $typeof = function(o) {
        if(isUndefined(o)){
            return "undefined";
        }else if(isNull(o)){
            return "null";
        }else if(isNumber(o)){
            return "number";
        }else if(isBoolean(o)){
            return "boolean";
        }else if(isString(o)){
            return "string";
        }else if(isObject(o)){
            return "object";
        }else if(isArray(o)){
            return "array";
        }else if(isArguments(o)){
            return "arguments";
        }else if(isFunction(o)){
            return "function";
        }else{
            return "other";
        }
        
    };
    /**
     * @ignore
     */
    checkJSON = function(){
        
        return true;
    };
    
    /**
     * 生成随机数的方法
     * 
     * @method random
     * @memberOf Jx.prototype
     * 
     * @param {Number} min 生成随机数的最小值
     * @param {Number} max 生成随机数的最大值
     * @return {Number} 返回生成的随机数
     */
    random = function(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    
    
    
    /**
     * 克隆一个对象
     * 
     * @method clone
     * @memberOf Jx.prototype
     * 
     * @param {Object} o 要克隆的对象
     * @return {Object} 返回通过克隆创建的对象
     * 
     * @example
     * Jx().$package(function(J){
     *     var objA = {name: "Kinvix"};
     *     // 克隆一个 objA 对象，并存入 objB 中。
     *     var objB = J.clone(objA);
     * };
     */
    clone = function(o){
        /**
         * @ignore
         */
        var tempClass = function(){};
        tempClass.prototype = o;
        
        // 返回新克隆的对象
        return (new tempClass());
    };

    

    

    
    
    
    /**
     * 生成一个返回值是传入的 value 值的函数
     * 
     * @method $return
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} value 要返回的值
     * @return {Mixed} 返回一个返回值是 value 的函数
     */
    $return = function(result){
        return J.isFunction(result) ? result : function(){
                return result;
            };
    };
    
    /**
     * 从第一个函数开始try，直到尝试出第一个可以成功执行的函数就停止继续后边的函数，并返回这个个成功执行的函数结果
     * 
     * @method $try
     * @memberOf Jx.prototype
     * 
     * @param {Function} fn1, fn2, .... 要尝试的函数
     * @return {Mixed} 返回第一个成功执行的函数的返回值
     * 
     * @example
     * Jx().$package(function(J){
     *     // 按顺序执行 funcA, funcB, funcC，当中途有一个 func 的执行结果返回 true 则不再往下执行，并返回成功执行的 func 的返回值；
     *     J.$try(funcA, funcB, funcC);
     * };
     */
    $try = function(){
        var i,
            l = arguments.length,
            result;
            
        for(i = 0; i < l; i++){
            try{
                result = arguments[i]();
                // 如果上边语句执行成功则执行break跳出循环
                break;
            }catch(e){
                J.out("C.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
        }
        return result;
    };
    
    /**
     * 对一个对象或数组进行扩展
     * 
     * @method extend
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} beExtendObj 被扩展的对象或数组
     * @param {Mixed} extendObj1, extendObj2, .... 用来参照扩展的对象或数组
     * @return {Mixed} 返回被扩展后的对象或数组
     * 
     * @example
     * Jx().$package(function(J){
     *     // 用 objB 和objC 扩展 objA 对象；
     *     J.extend(objA, objB, objC);
     * };
     * 
     */
    extend = function(beExtendObj, extendObj1, extendObj2){
        var a = arguments,
            i,
            p,
            beExtendObj,
            extendObj;
            
        if(a.length === 1){
            beExtendObj = this;
            i=0;
        }else{
            beExtendObj = a[0] || {};
            i=1;
        }
        
        for(; i<arguments.length; i++){
            extendObj = arguments[i];
            for(p in extendObj){
                var src = beExtendObj[p],
                    obj = extendObj[p];
                if ( src === obj ){
                    continue;
                }
                
                if ( obj && isObject(obj) && !isArray(obj) && !obj.nodeType && !isFunction(obj)){
                    src = beExtendObj[p] || {};//2010-12-28
                    beExtendObj[p] = extend( src, 
                        // Never move original objects, clone them
                        obj || ( obj.length != null ? [ ] : { } ));

                // Don't bring in undefined values
                }else if ( obj !== undefined ){
                    beExtendObj[p] = obj;
                }
            }
        }

        return beExtendObj;
    };
    
    
    /*
    extend = function(beExtendObj, target, extendObj2) {
        
        // copy reference to target object
        var target = arguments[0] || {}, 
        i = 2, 
        length = arguments.length, 
        options;
    
    
        target = arguments[1] || {};


    
        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !J.isFunction(target) ){
            target = {};
        }
        // extend jQuery itself if only one argument is passed
        if ( length == i ) {
            target = this;
            --i;
        }
    
        for ( ; i < length; i++ ){
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ){
                // Extend the base object
                for ( var name in options ) {
                    var src = target[ name ], 
                        copy = options[ name ];
    
                    // Prevent never-ending loop
                    if ( target === copy ){
                        continue;
                    }
                    // Recurse if we're merging object values
                    if ( copy && typeof copy === "object" && !copy.nodeType ){
                        target[ name ] = extend( target, 
                            // Never move original objects, clone them
                            src || ( copy.length != null ? [ ] : { } )
                        , copy );
    
                    // Don't bring in undefined values
                    }else if ( copy !== undefined ){
                        target[ name ] = copy;
                    }
                }
            }
        }
        // Return the modified object
        return target;
    };
    */
    
    /**
     * 获取当前时间的函数
     * 
     * @method now
     * @memberOf Jx.prototype
     * 
     * 
     * 
     * @example
     * alert(J.now());
     * 
     */
    now = function(){
        return +new Date;
    }
    
    
    /**
     * 通用分时处理函数
     * 
     * @method timedChunk
     * @memberOf Jx.prototype
     * 
     * 
     * 
     * @example
     * Jx().$package(function(J){
     * };
     * 
     */
    timedChunk = function(items, process, context, isShift, callback) {
        var todo = items.concat(), delay = 25;
        if(isShift){
            todo = items;
        }
 
        window.setTimeout(function() {
            var start = +new Date();
 
            do {
                process.call(context, todo.shift());
            } while(todo.length > 0 && (+new Date() - start < 50));
 
            if(todo.length > 0) {
                window.setTimeout(arguments.callee, delay);
            } else if(callback) {
                callback(items);
            }
 
        }, delay);
    }
    

    
    /**
     * 获取对象自身具有的属性和方法的数量
     * 
     * @method getLength
     * @memberOf Jx.prototype
     * 
     * @param {Object} obj 要获取的对象
     * @return {Number} 返回对象自身具有属性和方法的数量
     */
    getLength = function(obj) {
        var p,
            count = 0;
        for(p in obj){
            if(obj.hasOwnProperty(p)){
                count++;
            }
        }
        return count;
    };
    
    /**
     * 一个空函数函数
     * 
     * @memberOf Jx.prototype
     */
    emptyFunc = function(){};
    


        
    /**
     * 函数的重构方法
     * 
     * 
     * @private
     * @memberOf Jx.prototype
     * @param {Object} option 选项对象
     * @return {Function} 返回重构后的函数的执行结果
     */
    rebuild = function(func, option){
        option = option || {};
        
        func.$$rebuildedFunc = func.$$rebuildedFunc || function(){
            var self2 = this,
                scope,
                args,
                returns;
            scope = option.contextObj || self2;
            args = Array.prototype.slice.call(arguments, 0);

            if(args !== undefined){
                args = args.concat(option.arguments);
            }
            if(option.event === false){
                args = args.slice(1);
            }

            return func.apply(scope, args);
        };

        return func.$$rebuildedFunc;
    };
    
    /**
     * 给函数传入参数并执行
     * 
     * @memberOf Jx.prototype
     * @param {Mixed} args 参数列表
     * @return {Mixed} 返回函数执行结果
     * 
     * @example
     * Jx().$package(function(J){
     *     // 将"a"、"b"两个字符串传入funcA函数并执行
     *     funcA.pass("a","b");
     * };
     * 
     */
    pass = function(func, var_args) {
        var slice = Array.prototype.slice;
        var a = slice.call(arguments, 1);
        return function(){
            var context = this;
            return func.apply(context, a.concat(slice.call(arguments)));
        };
    };
    /*
    pass = function(func){
        var args = Array.prototype.slice.call(arguments, 1);
        return rebuild(func, {contextObj: null, arguments: args});
    };
    */
    
    /*
     * 给函数绑定一个上下文对象再执行
     * 
     * @memberOf Jx.prototype
     * @param {Object} contextObj 要绑定的上下文对象
     * @param {Mixed} args 参数列表
     * @return {Mixed} 返回函数执行结果
     * 
     * @example
     * Jx().$package(function(J){
     *     // 以 contextObjB 对象为上下文对象 this 来执行funcA函数
     *     funcA.bind(contextObjB);
     * };
     * 
     */
    /*
    bind = function(func, contextObj){
        var args = Array.prototype.slice.call(arguments, 2);
        //args = [this].extend(args);
        return rebuild(func, {contextObj: contextObj, arguments: args});
    };
    */
    
    /**
     * 将一个函数绑定给一个对象作方法，返回的函数将总被传入{@code obj} as {@code this}
     * 
     * @memberOf Jx.prototype
     * @param {Function} func 要绑定的函数
     * @param {Object} contextObj 要绑定的对象
     * @param {Mixed} args 参数列表，长度任意
     * @return {Function} 返回一个被绑定this上下文对象的函数
     * 
     * @example
     * Jx().$package(function(J){
     *   funcB = J.bind(funcA, obj, a, b)
     *   funcB(c, d) // 相当于执行 funcA.call(obj, a, b, c, d)
     * };
     */
    
    bind = function(func, context, var_args) {
        var slice = Array.prototype.slice;
        var a = slice.call(arguments, 2);
        return function(){
            return func.apply(context, a.concat(slice.call(arguments)));
        };
    };
    


    
    

    
    
    /**
     * 创建Class类的类
     * Class
     * @class 
     * @memberOf Jx
     * @param {Object} option = {extend: superClass} 在option对象的extend属性中指定要继承的对象，可以不写
     * @param {Object} object 扩展的对象
     * @return {Object} 返回生成的日期时间字符串
     * 
     * @example
     * Jx().$package(function(J){
     *     var Person = new J.Class({
     *      init : function(name){
     *          this.name = name;
     *          alert("init");
     *      },
     *      showName : function(){
     *          alert(this.name);
     *  
     *      }
     *  
     *  });
     *  
     *  // 继承Person
     *     var Person2 = new J.Class({extend : Person}, {
     *      init : function(name){
     *          this.name = name;
     *          alert("init");
     *      },
     *      showName : function(){
     *          alert(this.name);
     *  
     *      }
     *  
     *  });
     *     
     * };
     * 
     */
    Class = function(){
        var length = arguments.length;
        var option = arguments[length-1];
        
        option.init = option.init || function(){};
        
        // 如果参数中有要继承的父类
        if(length === 2){
            /**
             * @ignore
             */
            var superClass = arguments[0].extend;
            
            /**
             * @ignore
             */
            var tempClass = function() {};
            tempClass.prototype = superClass.prototype;
            
            /**
             * @ignore
             */
            var subClass = function() {
                this.init.apply(this, arguments);
            }
            
            // 加一个对父类原型引用的静态属性
            subClass.superClass = superClass.prototype;
            //subClass.superClass = superClass;
            /**
             * @ignore
             */
            subClass.callSuper = function(context,func){
                var slice = Array.prototype.slice;
                var a = slice.call(arguments, 2);
                var func = subClass.superClass[func];
                //var func = subClass.superClass.prototype[func];
                if(func){
                    func.apply(context, a.concat(slice.call(arguments)));
                }
            };
            
            // 指定原型
            subClass.prototype = new tempClass();
            
            // 重新指定构造函数
            subClass.prototype.constructor = subClass;
            
            J.extend(subClass.prototype, option);
            
            /**
             * @ignore
             */
            subClass.prototype.init = function(){
                // 调用父类的构造函数
                // subClass.superClass.init.apply(this, arguments);
                // 调用此类自身的构造函数
                option.init.apply(this, arguments);
            };
            
            return subClass;
            
        // 如果参数中没有父类，则单纯构建一个类
        }else if(length === 1){
            /**
             * @ignore
             */
            var newClass = function() {
                // 加了return，否则init返回的对象不生效
                return this.init.apply(this, arguments);
            }
            newClass.prototype = option;
            return newClass;
        }
        
        
    };
    
    var Chunk = new Class({
        init : function(items, process, context, isShift, callback) {
            var todo = items.concat(), delay = 25;
            if(isShift){
                todo = items;
            }
            //this.timeout;
             this.timeout = window.setTimeout(function() {
                var start = +new Date();
     
                do {
                    process.call(context, todo.shift());
                } while(todo.length > 0 && (+new Date() - start < 50));
     
                if(todo.length > 0) {
                    this.timeout = window.setTimeout(arguments.callee, delay);
                } else if(callback) {
                    callback(items);
                }
     
            }, delay);
        },
        stop : function(){
            clearTimeout(this.timeout);
        }
    
    });
    /*
    Class = function(obj){
        var tempClass = function() {
            this.init.apply(this, arguments);
        }
        tempClass.prototype = obj;
        return tempClass;
    };
    */
    
    
    
    
    
    J.isUndefined = isUndefined;
    J.isNull = isNull;
    J.isNumber = isNumber;
    J.isString = isString;
    J.isBoolean = isBoolean;
    J.isObject = isObject;
    J.isArray = isArray;
    J.isArguments = isArguments;
    J.isFunction = isFunction;
    J.$typeof = $typeof;
    
    J.$return = $return;
    J.$try = $try;
    
    J.emptyFunc = emptyFunc;
    
    J.clone = clone;

    J.getLength = getLength;
    J.checkJSON = checkJSON;
    J.random = random;
    J.extend = extend;
    
    J.now = now;
    J.timedChunk = timedChunk;
    
    
    J.rebuild = rebuild;
    J.pass = pass;
    J.bind = bind;
    J.bindNoEvent = bindNoEvent;
    

    
    J.Class = Class;
    J.Chunk = Chunk;
    


});

/**
 * 4.[Browser part]: dom 扩展包
 */
Jx().$package(function(J){
    var $D,
        $B,
        id,
        name,
        tagName,
        getText,
        getAttributeByParent,
        node,
        setClass,
        getClass,
        hasClass,
        addClass,
        removeClass,
        toggleClass,
        replaceClass,
        createStyleNode,
        setStyle,
        getStyle,
        setCssText,
        getCssText,
        addCssText,
        show,
        isShow,
        recover,
        hide,
        
        
        
        getScrollHeight,
        getScrollWidth,
        getClientHeight,
        getClientWidth,
        getOffsetHeight,
        getOffsetWidth,
        
        getScrollLeft,
        getScrollTop,
        getClientXY,
        setClientXY,
        getXY,
        setXY,
        getRelativeXY,
        getPosX,
        getPosY,
        getWidth,
        getHeight,
        
        getSelection,
        getSelectionText,
        getTextFieldSelection,
        
        contains,
        getHref,
    
        getDoc,
        _getDoc=null,
        getWin,
        w,
        getDocumentElement,
        DocumentElement,
        getDocHead,
        HeadElement;
    /**
     * dom 名字空间
     * 
     * @namespace
     * @name dom
     * @type Object
     */
    J.dom = J.dom || {};
    $D = J.dom;
    $B = J.browser;
    
        

    // find targeted window and @TODO create facades
    w = ($D.win) ? ($D.win.contentWindow) : $D.win  || window;
    $D.win = w;
    $D.doc = w.document;
    
    // feature detection 必须对已创建的对象检测
    var hasClassListProperty = document && Object.prototype.hasOwnProperty.call(document.documentElement,'classList');

    /**
     * 获取DocumentElement
     * 
     * @memberOf dom
     * 
     * @return {HTMLElement} documentElement
     * 
     */
    getDocumentElement = function(){
        if(DocumentElement) {
            return DocumentElement;
        }
        if(document.compatMode === 'CSS1Compat'){
            DocumentElement= document.documentElement;
        }else{
            DocumentElement= document.body;
        }
        return DocumentElement;
        
    };
    
    /**
     * 获取元素所属的根文档
     * 
     * @memberOf dom
     * @return {HTMLElement} document
     * 
     */
    getDoc = function(element) {
        if(element) {
            element = element || window.document;
            _getDoc= (element["nodeType"] === 9) ? element : element["ownerDocument"]
                || $D.doc;
            return _getDoc;        
        }else {
            if(_getDoc) {
                return _getDoc;
            }
            else {
                element = element || window.document;
                _getDoc= (element["nodeType"] === 9) ? element : element["ownerDocument"]
                    || $D.doc;
                return _getDoc;
            }            
        }

    };
    
    /**
     * 获取元素所属的 window 对象
     * returns the appropriate window.
     * 
     * @memberOf dom
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The window for the given element or the default window. 
     */
    getWin = function(element) {
        var doc = getDoc(element);
        return (element.document) ? element : doc["defaultView"] ||
            doc["parentWindow"] || $D.win;
    };
    
    /**
     * 获取文档的头节点
     * returns the head of the doc
     * 
     * @memberOf dom
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The window for the given element or the default window. 
     */
    getDocHead = function() {
        if(!HeadElement){        
           var doc = getDoc();
           HeadElement = doc.getElementsByTagName('head') ? doc.getElementsByTagName('head')[0] : doc.documentElement;
        }
        return HeadElement;
    };
    
    /**
     * 
     * 根据 id 获取元素
     * 
     * @method id
     * @memberOf dom
     * 
     * @param {String} id 元素的 id 名称
     * @param {Element} doc 元素所属的文档对象，默认为当前文档
     * @return {Element} 返回元素
     * 
     * @example
     * 
     * 
     */
    id = function(id, doc) {
        return getDoc(doc).getElementById(id);
    };
    
    /**
     * 
     * 根据 name 属性获取元素
     * 
     * @memberOf dom
     * 
     * @param {String} name 元素的 name 属性
     * @param {Element} doc 元素所属的文档对象，默认为当前文档
     * @return {Element} 返回元素
     */
    name = function(name, doc) {
        var el = doc;
        return getDoc(doc).getElementsByName(name);
    };
    
    /**
     * 
     * 根据 tagName 获取元素
     * 
     * @memberOf dom
     * 
     * @param {String} tagName 元素的 tagName 标签名
     * @param {Element} doc 元素所属的文档对象，默认为当前文档
     * @return {Element} 返回元素
     */
    tagName = function(tagName, el) {
        var el = el || getDoc();
        return el.getElementsByTagName(tagName);
    };
    
    /**
     * 获取元素中的文本内容
     * Returns the text content of the HTMLElement. 
     * 
     * @memberOf dom
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getText = function(element) {
        var text = element ? element[TEXT_CONTENT] : '';
        if (text === UNDEFINED && INNER_TEXT in element) {
            text = element[INNER_TEXT];
        } 
        return text || '';
    };
    
    
    /**
     * 从起始元素查找某个属性，直到找到，或者到达顶层元素位置
     * Returns the text content of the HTMLElement. 
     * 
     * @memberOf dom
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getAttributeByParent = function(attribute, startNode,  topNode){
        var jumpOut = false;
        var el = startNode;
        var result;
        do{
            result = el.getAttribute(attribute);
            // 如果本次循环未找到result
            if(J.isUndefined(result) || J.isNull(result)){
                // 如果本次循环已经到了监听的dom
                if(el === topNode){
                    jumpOut = true;
                }
                // 如果本次循环还未到监听的dom，则继续向上查找
                else {
                    el = el.parentNode;
                }
            }
            // 如果找到了result
            else{
                jumpOut = true;
            }
        }
        while(!jumpOut);
        
        return result;
    };
    
    
    /** 
     * 生成一个 DOM 节点
     * Generates an HTML element, this is not appended to a document
     * 
     * @memberOf dom
     * 
     * @param type {string} the type of element
     * @param attr {string} the attributes
     * @param win {Window} optional window to create the element in
     * @return {HTMLElement} the generated node
     */
    node = function(type, attrObj, win){
        var p,
            w = win || $D.win,
            d = document,
            n = d.createElement(type);
        var mapObj = {
            "class":function(){
                n.className = attrObj["class"];
            },
            "style":function(){
                setCssText(n, attrObj["style"]);
            }
        }
        for (p in attrObj) {
            if(mapObj[p]){
                mapObj[p]();
            }else{
                n.setAttribute(p, attrObj[p]);
            }
        }

        return n;
    };
    
    


    /**
     * 获取文档的 scroll 高度，即文档的实际高度
     * Returns the height of the document.
     * 
     * @method getDocumentHeight
     * @memberOf dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Number} The height of the actual document (which includes the body and its margin).
     */
    getScrollHeight = function(el) {
        var scrollHeight;
        if(el){
            scrollHeight = el.scrollHeight;
        }else{
            scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        }
        return scrollHeight || 0;
    };
    
    /**
     * 获取文档的 scroll 宽度，即文档的实际宽度
     * Returns the width of the document.
     * 
     * @method getDocumentWidth
     * @memberOf dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Number} The width of the actual document (which includes the body and its margin).
     */
    getScrollWidth = function(el) {
        var scrollWidth;
        if(el){
            scrollWidth = el.scrollWidth;
        }else{
            scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        }
        return scrollWidth || 0;
    };

    /**
     * 获取当前视窗的高度
     * Returns the current height of the viewport.
     * 
     * @method getClientHeight
     * @memberOf dom
     * @return {Number} The height of the viewable area of the page (excludes scrollbars).
     */
    getClientHeight = function(el) {
        //var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.clientHeight; // IE, Gecko
    };
    
    /**
     * 获取元素的client宽度
     * Returns the current width of the viewport.
     * @method getClientWidth
     * @memberOf dom
     * @param {Element} el 要获取client宽度的元素
     * @return {Number} 宽度值.
     */
    
    getClientWidth = function(el) {
        //var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.clientWidth; // IE, Gecko
    };
    
    
    /**
     * 获取当前视窗的高度
     * Returns the current height of the viewport.
     * 
     * @method getOffsetHeight
     * @memberOf dom
     * @return {Number} The height of the viewable area of the page (excludes scrollbars).
     */
    getOffsetHeight = function(el) {
        var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.offsetHeight; 
    };
    
    /**
     * 获取元素的client宽度
     * Returns the current width of the viewport.
     * @method getOffsetWidth
     * @memberOf dom
     * @param {Element} el 要获取client宽度的元素
     * @return {Number} 宽度值.
     */
    getOffsetWidth = function(el) {
        var name = J.browser.engine.name;
        el = el || getDocumentElement();
        return el.offsetWidth;
    };
    
    /**
     * 获取当前文档的左边已卷动的宽度
     * Returns the left scroll value of the document 
     * @method getDocumentScrollLeft
     * @memberOf dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Number}  The amount that the document is scrolled to the left
     */
    getScrollLeft = function(el) {
        var scrollLeft;
        if(el){
            scrollLeft = el.scrollLeft;
        }else{
            scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        }
        return scrollLeft || 0;
    };

    /**
     * 获取当前文档的上边已卷动的宽度
     * Returns the top scroll value of the document 
     * @method getDocumentScrollTop
     * @memberOf dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Number}  The amount that the document is scrolled to the top
     */
    getScrollTop = function(el) {
        var scrollTop;
        if(el){
            scrollTop = el.scrollTop;
        }else{
            scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }
        return scrollTop || 0;
    };

    
    /**
     * 
     * 设置元素的class属性
     * 
     * @method setClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    setClass = function(el, className){
        el.className = className;
    };
    
    /**
     * 
     * 获取元素的class属性
     * 
     * @method getClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    getClass = function(el){
        return el.className;
    };

    /**
     * 
     * 判断元素是否含有 class
     * @function
     * @method hasClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    hasClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className) {
                    return false;
                }
                return el.classList.contains(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className) {
                    return false;
                }
                return -1 < (' ' + el.className + ' ').indexOf(' ' + className + ' ');
            };
        }
    }();

    /**
     * 
     * 给元素添加 class
     * @function
     * @method addClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    addClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className || hasClass(el, className)) {
                    return;
                }
                el.classList.add(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className || hasClass(el, className)) {
                    return;
                }
                el.className += ' ' + className;
            };
        }
    }();

    /**
     * 
     * 给元素移除 class
     * @function
     * @method addClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    removeClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className || !hasClass(el, className)) {
                    return;
                }
                el.classList.remove(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className || !hasClass(el, className)) {
                    return;
                }
                el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
            };
        }
    }();
    
    /*
    removeClass2 = function(el, className){
        replaceClass(el, className, "");
    };
    */
    
    
    /**
     * 
     * 对元素 class 的切换方法，即：如果元素用此class则移除此class，如果没有此class则添加此class
     * 
     * @function
     * @method toggleClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} className class 名称
     */
    toggleClass = function(){
        if (hasClassListProperty) {
            return function (el, className) {
                if (!el || !className) {
                    return;
                }
                el.classList.toggle(className);
            };
        } else {
            return function (el, className) {
                if (!el || !className) {
                    return;
                }
                hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
            };
        }
    }();

    /**
     * 
     * 替换元素 oldClassName 为 newClassName
     * 
     * @method toggleClass
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} oldClassName 被替换的 class 名称
     * @param {String} newClassName 要替换成的 class 名称
     */
    replaceClass = function(el, oldClassName, newClassName){
        removeClass(el, oldClassName);
        addClass(el, newClassName);
        //el.className = (" "+el.className+" ").replace(" "+oldClassName+" "," "+newClassName+" ");
    };
    /*
    replaceClass2 = function(el, oldClassName, newClassName){
        var i,
            tempClassNames = el.className.split(" ");
            
        for(i=0; i<tempClassNames.length; i++){
            if(tempClassNames[i] === oldClassName){
                tempClassNames[i] = newClassName;
            }
        }
        //J.out(tempClassNames);

        el.className = tempClassNames.join(" ");
    };
    */
    
    /**
     * 
     * 创建 style 标签
     * 
     * @method setStyle
     * @memberOf dom
     * 
     * @param 样式内容，支持string和object
     * @param {String} id 样式标签的 id
     */
    createStyleNode = function(styles, id){
        var styleNode = $D.node('style', {
            'id': id || '',
            'type': 'text/css'
        });

        $D.getDocHead().appendChild(styleNode);

        var stylesType = typeof(styles);
        if(stylesType == "string"){     //参数是文本
            if(styleNode.styleSheet){    //IE
                styleNode.styleSheet.cssText = styles;
            }else{
                var tn = document.createTextNode(styles);
                styleNode.appendChild(tn);
            }
        }else if(stylesType == "object"){   //参数是对象
            var i = 0,
                styleSheet = document.styleSheets[document.styleSheets.length-1];
            for(selector in styles){
                if(styleSheet.insertRule){
                    var rule = selector + "{" + styles[selector] + "}";
                    styleSheet.insertRule(rule, i++);
                }else {                  //IE
                    styleSheet.addRule(selector, styles[selector], i++);
                }
            }
        }

        return styleNode;
    };
    
    /**
     * 
     * 设置元素的样式，css 属性需要用驼峰式写法，如：fontFamily
     * 
     * @method setStyle
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} styleName css 属性名称
     * @param {String} value css 属性值
     */
    setStyle = function(el, styleName, value){
        if(!el){
            return;
        }
        
        var name = J.browser.name;
        if(styleName === "float" || styleName === "cssFloat"){
            if(name === "ie"){
                styleName = "styleFloat";
            }else{
                styleName = "cssFloat";
            }
        }
        
        //J.out(styleName);
        
        if(styleName === "opacity" && name === "ie" && J.browser.ie<9){
            var opacity = value*100;
            
            /*
            if(el.style.filter.alpha){
                
                el.style.filter.alpha.opacity = opacity;
                J.debug("filter alpha!")
            }else{
                addCssText(el,'filter:alpha(opacity="' + opacity + '")');
            }*/
            //addCssText(el,'filter:alpha(opacity="' + opacity + '")');
            //J.out(">>>el.style.filter.alpha.opacity: "+el.style.filter.alpha.opacity);
            el.style.filter = 'alpha(opacity="' + opacity + '")';

            if(!el.style.zoom){
                el.style.zoom = 1;
            }

            return;
        }
        el.style[styleName] = value;
    };
    
    

    
    /**
     * 
     * 获取元素的当前实际样式，css 属性需要用驼峰式写法，如：fontFamily
     * 
     * @method getStyle
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} styleName css 属性名称
     * @return {String} 返回元素样式
     */
    getStyle = function(el, styleName){
        if(!el){
            return;
        }
        
        var win = getWin(el);
        var name = J.browser.name;
        //J.out(name);
        if(styleName === "float" || styleName === "cssFloat"){
            if(name === "ie"){
                styleName = "styleFloat";
            }else{
                styleName = "cssFloat";
            }
        }
        if(styleName === "opacity" && name === "ie" && J.browser.ie<9){
            var opacity = 1,
                result = el.style.filter.match(/opacity=(\d+)/);
            if(result && result[1]){
                opacity = result[1]/100;
            }
            return opacity;
        }
        
        if(el.style[styleName]){
            return el.style[styleName];
        }else if(el.currentStyle){
            //alert(el.currentStyle[styleName]);
            return el.currentStyle[styleName];
        }else if(win.getComputedStyle){
            //J.out(win.getComputedStyle(el, null));
            return win.getComputedStyle(el, null)[styleName];
        }else if(document.defaultView && document.defaultView.getComputedStyle){
            styleName = styleName.replace(/([/A-Z])/g, "-$1");
            styleName = styleName.toLowerCase();
            var style = document.defaultView.getComputedStyle(el, "");
            return style && style.getPropertyValue(styleName);
        }

    };

    /**
     * 
     * 给元素添加cssText
     *  
     * @method addCssText
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} cssText css 属性
     */
    addCssText = function(el, cssText){
        el.style.cssText += ';' + cssText;
    };
    
    /**
     * 
     * 给元素设置cssText
     *  
     * @method setCssText
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} cssText css 属性
     */
    setCssText = function(el, cssText){
        el.style.cssText = cssText;
    };
    /**
     * 
     * 获取元素的cssText
     *  
     * @method getCssText
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    getCssText = function(el){
        return el.style.cssText;
    };
    
    /**
     * 
     * 显示元素
     * 
     * @method show
     * @memberOf dom
     * 
     * @param {Element} el 元素
     * @param {String} displayStyle 强制指定以何种方式显示，如：block，inline，inline-block等等
     */
    show = function(el, displayStyle){
        var display;
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(_oldDisplay){
            display = _oldDisplay;
        }else{
            display = getStyle(el, "display");
        }

        if(displayStyle){
            setStyle(el, "display", displayStyle);
        }else{
            if(display === "none"){
                setStyle(el, "display", "block");
            }else{
                setStyle(el, "display", display);
            }
        }
    };
    
    /**
     * 
     * 判断元素是否是显示状态
     * 
     * @method isShow
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    isShow = function(el){
        var display = getStyle(el, "display");
        if(display === "none"){
            return false;
        }else{
            return true;
        }
    };
    
    /**
     * 
     * 还原元素原来的display属性
     * 
     * @method recover
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    recover = function(el){
        var display;
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(_oldDisplay){
            display = _oldDisplay;
        }else{
            display = getStyle(el, "display");
        }
        if(display === "none"){
            setStyle(el, "display", "");
        }else{
            setStyle(el, "display", display);
        }
    };
    
    /**
     * 
     * 隐藏元素
     * 
     * @method hide
     * @memberOf dom
     * 
     * @param {Element} el 元素
     */
    hide = function(el){
        var display = getStyle(el, "display");
        var _oldDisplay = el.getAttribute("_oldDisplay");
        
        if(!_oldDisplay){
            if(display === "none"){
                el.setAttribute("_oldDisplay", "");
            }else{
                el.setAttribute("_oldDisplay", display);
            }
        }
        setStyle(el, "display", "none");
    };
    
    
    
    /**
     * 获取对象坐标
     *
     * @method getClientXY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return Array [left,top]
     * @type Array
     */
    getClientXY = function(el) {
        var _t = 0,
            _l = 0;

        if (el) {
            //这里只检查document不够严谨, 在el被侵染置换(jQuery做了这么恶心的事情)
            //的情况下, el.getBoundingClientRect() 调用回挂掉
            if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) { // 顶IE的这个属性，获取对象到可视范围的距离。
                //现在firefox3，chrome2，opera9.63都支持这个属性。
                var box = {left:0,top:0,right:0,bottom:0};//
                try{
                    box=el.getBoundingClientRect();
                }catch(ex){
                    return [0,0];
                }
                var oDoc = el.ownerDocument;
                
                var _fix = J.browser.ie ? 2 : 0; //修正ie和firefox之间的2像素差异
                
                _t = box.top - _fix + getScrollTop(oDoc);
                _l = box.left - _fix + getScrollLeft(oDoc);
            } else {//这里只有safari执行。
                while (el.offsetParent) {
                    _t += el.offsetTop;
                    _l += el.offsetLeft;
                    el = el.offsetParent;
                }
            }
        }
        return [_l, _t];
    };
    
    /**
     * 设置dom坐标
     * 
     * @method setClientXY
     * @memberOf dom
     
     * @param {HTMLElement} el
     * @param {string|number} x 横坐标
     * @param {string|number} y 纵坐标
     */
    setClientXY = function(el, x, y) {
        x = parseInt(x) + getScrollLeft();
        y = parseInt(y) + getScrollTop();
        setXY(el, x, y);
    };

    /**
     * 获取对象坐标
     * 
     * @method getXY
     * @memberOf dom
     *
     * @param {HTMLElement} el
     * @return Array [top,left]
     */
    getXY = function(el) {
        var xy = getClientXY(el);

        xy[0] = xy[0] + getScrollLeft();
        xy[1] = xy[1] + getScrollTop();
        return xy;
    }

    /**
     * 设置dom坐标
     * @method setXY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @param {string|number} x 横坐标
     * @param {string|number} y 纵坐标
     */
    setXY = function(el, x, y) {
        var _ml = parseInt(getStyle(el, "marginLeft")) || 0;
        var _mt = parseInt(getStyle(el, "marginTop")) || 0;

        setStyle(el, "left", parseInt(x) - _ml + "px");
        setStyle(el, "top", parseInt(y) - _mt + "px");
    };
    
    /**
     * 获取对象相对一个节点的坐标
     *
     * @method getRelativeXY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @param {HTMLElement} relativeEl 
     * @return Array [top,left]
     * 
     */
    getRelativeXY = function(el, relativeEl) {
        var xyEl = getXY(el);
        var xyRelativeEl = getXY(relativeEl);
        var xy=[];
        
        xy[0] = xyEl[0] - xyRelativeEl[0];
        xy[1] = xyEl[1] - xyRelativeEl[1];
        return xy;
    }
    
    var parseCssPx = function(value){
        if(!value || value == 'auto') return 0;
        else return parseInt(value.substr(0, value.length-2));
    }
    /**
     * 获取x坐标的简便方法
     *
     * @method getPosX
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getPosX = function(el){
        return parseCssPx($D.getStyle(el, 'left'));
    }
    /**
     * 获取y坐标的简便方法
     *
     * @method getPosY
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getPosY = function(el){
        return parseCssPx($D.getStyle(el, 'top'));
    }
    /**
     * 获取宽度的简便方法
     *
     * @method getWidth
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getWidth = function(el){
        return parseCssPx($D.getStyle(el, 'width'));
    }
    /**
     * 获取高度的简便方法
     *
     * @method getHeight
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String}
     * 
     */
    getHeight = function(el){
        return parseCssPx($D.getStyle(el, 'height'));
    }
    
    /**
     * 获取选择的文本
     *
     * @method getSelectionText
     * @memberOf dom
     * 
     * @param {Window} win
     * @return {String} 返回选择的文本
     */
    getSelectionText = function(win) {
        win = win || window;
        var doc = win.document;
        if (win.getSelection) {
            // This technique is the most likely to be standardized.
            // getSelection() returns a Selection object, which we do not document.
            return win.getSelection().toString();
        }else if (doc.getSelection) {
            // This is an older, simpler technique that returns a string
            return doc.getSelection();
        }else if (doc.selection) {
            // This is the IE-specific technique.
            // We do not document the IE selection property or TextRange objects.
            return doc.selection.createRange().text;
        }
    
    };


    /**
     * FireFox 下获取 input 或者 textarea 中选中的文字
     *
     * @method getTextFieldSelection
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String} 返回选择的文本
     */
    getTextFieldSelection = function(el) {
        if (el.selectionStart != undefined && el.selectionEnd != undefined) {
            var start = el.selectionStart;
            var end = el.selectionEnd;
            return el.value.substring(start, end);
        }else{
            return ""; // Not supported on this browser
        }
    
    };
    
    /**
     * 判断一个节点是否是某个父节点的子节点, 
     * 默认不包含parent === child的情况
     * @memberOf dom
     * @name contains
     * @function
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     * @param {Boolean} containSelf 指示是否包括parent等于child的情况
     * @return {Boolean} 包含则返回true
     */
    contains = function(parent, child, containSelf){
        if(!containSelf && parent === child){
            return false;
        }
        if(parent.compareDocumentPosition){//w3c
            var res = parent.compareDocumentPosition(child);
            if(res == 20 || res == 0){
                return true;
            }
        }else{
            if(parent.contains(child)){//ie
                return true;
            }
        }
        return false;
    };
    
    /**
     * 取一个a标签的href的绝对路径
     * @method getFullHref
     * @memberOf dom
     * 
     * @param {HTMLElement} el
     * @return {String} 返回一个完整的url
     */
    getHref = function(el){
        var result;
        if($B.ie && $B.ie<=7){
            result=el.getAttribute('href',4);
        }else{
            result=el.href;
        }
        return result || null;
    };
    
    
    
    var scripts = tagName("script");
    for(var i=0; i<scripts.length; i++){
        
        if(scripts[i].getAttribute("hasJx")=="true"){
            //J.out("hasJx: "+(scripts[i].getAttribute("hasJx")=="true"));
            J.src = scripts[i].src;
        }
    }
    if(!J.src){
        J.src = scripts[scripts.length-1].src;
    }
    
    J.filename = J.src.replace(/(.*\/){0,}([^\\]+).*/ig,"$2");
    //J.out(J.src+" _ "+J.filename)
    J.path = J.src.split(J.filename)[0];
    
    
    $D.getDoc = getDoc;
    
    $D.id = id;
    $D.name = name;
    $D.tagName = tagName;
    $D.getText = getText;
    $D.getAttributeByParent = getAttributeByParent;
    $D.node = node;
    $D.setClass = setClass;
    $D.getClass = getClass;
    $D.hasClass = hasClass;
    
    $D.addClass = addClass;
    $D.removeClass = removeClass;
    $D.toggleClass = toggleClass;
    $D.replaceClass = replaceClass;
    
    $D.createStyleNode = createStyleNode;
    $D.setStyle = setStyle;
    $D.getStyle = getStyle;
    
    $D.setCssText = setCssText;
    $D.getCssText = getCssText;
    $D.addCssText = addCssText;
    
    $D.show = show;
    $D.isShow = isShow;
    $D.recover = recover;
    $D.hide = hide;
    
    
    $D.getScrollLeft = getScrollLeft;
    $D.getScrollTop = getScrollTop;
    $D.getScrollHeight = getScrollHeight;
    $D.getScrollWidth = getScrollWidth;
    
    $D.getClientHeight = getClientHeight;
    $D.getClientWidth = getClientWidth;
    
    $D.getOffsetHeight = getOffsetHeight;
    $D.getOffsetWidth = getOffsetWidth;
    
    $D.getClientXY = getClientXY;
    $D.setClientXY = setClientXY;
    
    $D.getXY = getXY;
    $D.setXY = setXY;
    $D.getRelativeXY = getRelativeXY;
    $D.getPosX = getPosX;
    $D.getPosY = getPosY;
    $D.getWidth = getWidth;
    $D.getHeight = getHeight;
    $D.getSelection = getSelection;
    $D.getSelectionText = getSelectionText;
    
    $D.getTextFieldSelection = getTextFieldSelection;
    
    $D.getDocumentElement = getDocumentElement;
    $D.getDocHead = getDocHead;
    
    $D.contains = contains;
    $D.getHref = getHref;
    
});

/**
 * 3.[Browser part]: Browser 资料分析包
 */
Jx().$package(function(J){
    J.browserOptions = {
        adjustBehaviors: true,
        htmlClass: true
    };
    //J.query = J.string.mapQuery(window.location.search);
    J.host = window.location.host;
    
    // 设置 domain
    // document.domain = 'kdv.cn';
    
    
    var pf = navigator.platform.toLowerCase(),
        ua = navigator.userAgent.toLowerCase(),
        plug = navigator.plugins,
        
        platform,
        browser,
        engine,

        toFixedVersion,
        s;
    
    /**
     * @ignore
     * @param String ver
     * @param Number floatLength
     * @return Number 
     */
    toFixedVersion = function(ver, floatLength){
        ver= (""+ver).replace(/_/g,".");
        floatLength = floatLength || 1;
        ver = String(ver).split(".");
        ver = ver[0] + "." + (ver[1] || "0");
        ver = Number(ver).toFixed(floatLength);
        return ver;
    };
    
    /**
     * platform 名字空间
     * 
     * @namespace
     * @name platform
     * @type Object
     */
    platform = {
        getPlatform:function(){
            return pf;
        },
        
        /**
         * 操作系统的名称
         * 
         * @property name
         * @memberOf platform
         */
        name: (window.orientation != undefined) ? 'iPod' : (pf.match(/mac|win|linux/i) || ['unknown'])[0],
        
        version: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * iPod touch
         * Mozilla/5.0 (iPod; U; CPU iPhone OS 3_0 like Mac OS X; zh-cn) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPod: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) version/4.0.4 Mobile/7B367 Safari/531.21.10
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPad:0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0_1 like Mac OS X; zh-cn) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A400 Safari/528.16
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        iPhone:0,
        
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * Mozilla/5.0 (Linux; U; Android 2.0; en-us; Droid Build/ESD20) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        android:0,
        
        
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        win: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        linux: 0,
        
        /**
         * 操作系统的版本号，如果是0表示不是此操作系统
         * 
         * 
         * @description {Num} 操作系统的版本号，如果是0表示不是此操作系统
         * @constant
         * @type Number
         */
        mac: 0,
        
        /**
         * 设置浏览器类型和版本
         * 
         * @ignore
         * @private
         * @memberOf browser
         * 
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
    };
    
    platform[platform.name] = true;
    
    // 探测操作系统版本
    (s = ua.match(/windows ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/windows nt ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/linux ([\d.]+)/)) ? platform.set("linux",toFixedVersion(s[1])) :
    (s = ua.match(/mac ([\d.]+)/)) ? platform.set("mac",toFixedVersion(s[1])):
    (s = ua.match(/ipod ([\d.]+)/)) ? platform.set("iPod",toFixedVersion(s[1])):
    (s = ua.match(/ipad[\D]*os ([\d_]+)/)) ? platform.set("iPad",toFixedVersion(s[1])):
    (s = ua.match(/iphone ([\d.]+)/)) ? platform.set("iPhone",toFixedVersion(s[1])):
    (s = ua.match(/android ([\d.]+)/)) ? platform.set("android",toFixedVersion(s[1])) : 0;
    
    /**
     * browser 名字空间
     * 
     * @namespace
     * @name browser
     */
    browser = {
        /**
         * @namespace
         * @name features
         * @memberOf browser
         */
        features: 
        /**
         * @lends browser.features
         */    
        {
            /**
             * @property xpath
             */
            xpath: !!(document.evaluate),
            
            /**
             * @property air
             */
            air: !!(window.runtime),
            
            /**
             * @property query
             */
            query: !!(document.querySelector)
        },
        
        /**
         * 获取浏览器的插件信息
         * 
         */
        getPlugins: function(){
            return plug;
        },
        
        /**
         * @namespace
         * @name plugins
         * @memberOf browser
         */
        plugins: 
        /**
         * @lends browser.plugins
         */    
        {
            flash: (function(){
                //var ver = "none";
                var ver = 0;
                if (plug && plug.length) {
                    var flash = plug['Shockwave Flash'];
                    if (flash && flash.description) {
                        ver = toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
                    }
                } else {
                    var startVer = 13;
                    while (startVer--) {
                        try {
                            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
                            ver = toFixedVersion(startVer);
                            break;
                        } catch(e) {}
                    }
                }
                
                return ver;
            })()
        },
        
        
        
        /**
         * 获取浏览器的userAgent信息
         * 
         * @memberOf browser
         */
        getUserAgent: function(){
            return ua;
        },
        
        /**
         * 用户使用的浏览器的名称，如：chrome
         * 
         * 
         * @description {String} 用户使用的浏览器的名称，如：chrome
         * @type Number
         */
        name: "unknown",
        
        /**
         * 浏览器的版本
         * @property version
         * @memberOf browser
         */
        version: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        ie: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        firefox: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        chrome: 0,
        
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        opera: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        safari: 0,
        
        /**
         * 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * 
         * 
         * @description {Number} 用户使用的浏览器的版本号，如果是0表示不是此浏览器
         * @type Number
         */
        mobileSafari: 0,
        
        /**
         * 用户使用的是否是adobe 的air内嵌浏览器
         */
        adobeAir: 0,
        
        /**
         * 是否支持css3的borderimage
         * 
         * @description {boolean} 检测是否支持css3属性borderimage
         */
        //borderimage: false,
        
        /**
         * 设置浏览器类型和版本
         * 
         * @ignore
         * @private
         * @memberOf browser
         * 
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
    };
    
    // 探测浏览器并存入 browser 对象
    (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",toFixedVersion(s[1])):
    (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",toFixedVersion(s[1])) :
    (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",toFixedVersion(s[1])) :
    (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",toFixedVersion(s[1])) :
    (s = ua.match(/adobeair\/([\d.]+)/)) ? browser.set("adobeAir",toFixedVersion(s[1])) :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",toFixedVersion(s[1])) : 0;

    //mobile safari 判断，可与safari字段并存
    (s = ua.match(/version\/([\d.]+).*mobile.*safari/)) ? browser.set("mobileSafari",toFixedVersion(s[1])) : 0;
    if(platform.iPad) browser.set('mobileSafari', '0.0');
    
    //browser.set("borderimage",browser.firefox>3 || browser.safari || browser.chrome);
    
    if(browser.ie){
        if(!document.documentMode) document.documentMode=Math.floor(browser.ie);
        else if(document.documentMode!==Math.floor(browser.ie)) browser.set("ie",toFixedVersion(document.documentMode));
    }
    
    //J.out(browser.name);
    //J.out(browser.ua);
    
    //!!navigator.userAgent.match(/Apple.*Mobile.*Safari/);
    
    /**
     * engine 名字空间
     * 
     * @namespace
     * @name engine
     * @memberOf browser
     */
    engine = {
        /**
         * 浏览器的引擎名字
         * 
         * @memberOf browser.engine
         */
        name: 'unknown',
        
        /**
         * 浏览器的引擎版本
         * 
         * @memberOf browser.engine
         */
        version: 0,
        
        /**
         * trident 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         */
        trident: 0,
        
        /**
         * gecko 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         * 
         */
        gecko: 0,
        
        /**
         * webkit 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         */
        webkit: 0,
        
        /**
         * presto 引擎的版本，0表示非此引擎
         * 
         * @memberOf browser.engine
         * @property presto
         */
        presto: 0,
        
        /**
         * 设置浏览器引擎的类型和版本
         * @ignore
         * @memberOf browser.engine
         */
        set: function(name, ver){
            this.name = name;
            this.version = ver;
            this[name] = ver;
        }
        
    };
    
    /*
    // 探测浏览器的内核并存入 browser.engine 对象
    (s = (!window.ActiveXObject) ? 0 : ((window.XMLHttpRequest) ? 5 : 4)) ? engine.set("trident", s):
    (s = (document.getBoxObjectFor == undefined) ? 0 : ((document.getElementsByClassName) ? 19 : 18)) ? engine.set("gecko",s) :
    (s = (navigator.taintEnabled) ? false : ((browser.features.xpath) ? ((browser.features.query) ? 525 : 420) : 419)) ? engine.set("webkit", s) :
    (s = (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925))) ? engine.set("presto", s) : 0;
    */
    
    // 探测浏览器的内核并存入 browser.engine 对象
    
    (s = ua.match(/trident\/([\d.]+)/)) ? engine.set("trident",toFixedVersion(s[1])):
    (s = ua.match(/gecko\/([\d.]+)/)) ? engine.set("gecko",toFixedVersion(s[1])) :
    (s = ua.match(/applewebkit\/([\d.]+)/)) ? engine.set("webkit",toFixedVersion(s[1])) :
    (s = ua.match(/presto\/([\d.]+)/)) ? engine.set("presto",toFixedVersion(s[1])) : 0;
    
    if(browser.ie){
        if(browser.ie == 6){
            engine.set("trident", toFixedVersion("4"));
        }else if(browser.ie == 7 || browser.ie == 8){
            engine.set("trident", toFixedVersion("5"));
        }
    }
    
    
    /**
     * 调整浏览器行为
     * 
     * @ignore
     */
    var adjustBehaviors = function() {
        // ie6 背景图片不能被缓存的问题
        if (browser.ie && browser.ie < 7) {
            try {
                document.execCommand('BackgroundImageCache', false, true);
            }catch(e){
                //J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
        }
    }
    
    if(J.browserOptions.adjustBehaviors){
         adjustBehaviors();
    }
    
    var filterDot = function(string){
        //return J.string.replaceAll(string, "\.", "_");
        return String(string).replace(/\./gi,"_");
    };
    
    // 给html标签添加不同浏览器的参数className
    var addHtmlClassName = function() {
        var htmlTag = document.documentElement;
        var htmlClassName = [htmlTag.className];
        htmlClassName.push('javascriptEnabled');
        htmlClassName.push(platform.name);
        htmlClassName.push(platform.name + filterDot(platform.version));
        htmlClassName.push(browser.name);
        htmlClassName.push(browser.name + filterDot(browser.version));
        if(document.documentMode){
            htmlClassName.push('documentMode_' + document.documentMode);
        }
        htmlClassName.push(engine.name);
        htmlClassName.push(engine.name + filterDot(engine.version));
        
        if(browser.plugins.flash){
            htmlClassName.push("flash");
            htmlClassName.push("flash" + filterDot(browser.plugins.flash));
        }
        if(typeof(window['webTop']) != 'undefined' && window['webTop']) {
             htmlClassName.push("webTop");
        }
        htmlTag.className = htmlClassName.join(' ');
       
    }

    
    if(J.browserOptions.htmlClass){
        addHtmlClassName();
    }
    
    J.platform = platform;
    J.browser = browser;
    J.browser.engine = engine;
});

/**
 * 5.[Browser part]: event 扩展包
 */
Jx().$package(function(J){
    var $E,
        addEventListener,
        addOriginalEventListener,
        removeEventListener,
        removeOriginalEventListener,
        customEvent,
        customEventHandlers=[],
        onDomReady,
        isDomReady,
        Publish,
        addObserver,
        addObservers,
        notifyObservers,
        removeObserver,
        standardizeEvent,
        packageContext=this;
    /**
     * event 名字空间
     * 
     * @namespace
     * @name event
     */
    J.event = J.event || {};
    
    $E = J.event;
    /*
         经典的彩蛋必备代码:老外称之为 Tweetable Konami code
        [上上下下左右左右BA]
        var k=[];
        addEventListener("keyup",function(e){ 
           k.push(e.keyCode);
           if(k.toString().indexOf("38,38,40,40,37,39,37,39,66,65")>=0){      
               cheat();
           }
        },true);
        
        什么不知道 Konami Code? 只能说明你没童年了 - -!
        http://en.wikipedia.org/wiki/Konami_Code
     */
    //az
    /**
     * standardize the ie event
     * @ignore
     */
    standardizeEvent = function(e, element){
        if(!e){
            e = window.event;
        }
        var element = element || e.srcElement;
        var eventDocument = document,
            doc = eventDocument.documentElement,
            body = eventDocument.body;
        /**
         * @ignore
         */
        var event = 
        /**
         * @ignore
         */
        {
            _event: e,// In case we really want the IE event object
            
            type: e.type,           // Event type
            target: e.srcElement,   // Where the event happened
            currentTarget: element, // Where we're handling it
            relatedTarget: e.fromElement ? e.fromElement : e.toElement,
            eventPhase: (e.srcElement == element) ? 2 : 3,

            // Mouse coordinates
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            layerX: e.offsetX,
            layerY: e.offsetY,
            pageX: e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0),
            pageY: e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0),
            wheelDelta: e.wheelDelta,
            
           // Key state
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            //原有的charCode
            charCode: e.keyCode,
            
            //keyCode
            keyCode: e.keyCode,
            /*
             * keyCode 值附表：
             * ===============================
             * 
             * 1.主键盘区字母和数字键的键码值
             * 按键   键码
             * 0    48
             * 1    49
             * 2    50
             * 3    51
             * 4    52
             * 5    53
             * 6    54
             * 7    55
             * 8    56
             * 9    57
             * 
             * A    65
             * B    66
             * C    67
             * D    68
             * E    69
             * F    70
             * G    71
             * H    72
             * I    73
             * J    74
             * K    75
             * L    76
             * M    77
             * N    78
             * O    79
             * P    80
             * Q    81
             * R    82
             * S    83
             * T    84
             * U    85
             * V    86
             * W    87
             * X    88
             * Y    89
             * Z    90
             * 
             * 
             * 3.控制键键码值
             * 按键           键码
             * BackSpace    8
             * Tab          9
             * Clear        12
             * Enter        13
             * Shift        16
             * Control      17
             * Alt          18
             * Cape Lock    20
             * Esc          27
             * Spacebar     32 
             * Page Up      33
             * Page Down    34
             * End          35
             * Home         36
             * Left Arrow   37
             * Up Arrow     38
             * Right Arrow  39
             * Down Arrow   40
             * Insert       45
             * Delete       46
             * 
             * Num Lock     144
             * 
             * ;:           186
             * =+           187
             * ,<           188
             * -_           189
             * .>           190
             * /?           191
             * `~           192
             * 
             * [{           219
             * \|           220
             * }]           221
             * ’"           222
             * 
             * 2.功能键键码值
             * F1   112
             * F2   113
             * F3   114
             * F4   115
             * F5   116
             * F6   117
             * F7   118
             * F8   119
             * F9   120
             * F10  121
             * F11  122
             * F12  123
             * 
             * 2.数字键盘上的键的键码值
             * 按键   键码
             * 0    96
             * 1    97
             * 2    98
             * 3    99
             * 4    100
             * 5    101
             * 6    102
             * 7    103
             * 8    104
             * 9    105
             * 
             * *    106
             * +    107
             * Enter108
             * -    109
             * .    110
             * /    111
             * 
             */
            /**
             * @ignore
             */
            stopPropagation: function(){
                this._event.cancelBubble = true;
            },
            /**
             * @ignore
             */
            preventDefault: function(){
                this._event.returnValue = false;
            }
        }
        /*
         *  relatedTarget 事件属性返回与事件的目标节点相关的节点。
         *  对于 mouseover 事件来说，该属性是鼠标指针移到目标节点上时所离开的那个节点。
         *  对于 mouseout 事件来说，该属性是离开目标时，鼠标指针进入的节点。
         *  对于其他类型的事件来说，这个属性没有用。
         *  az 2011/3/11
         */
        var eventType = e.type.toLowerCase();
        if(eventType == 'mouseover'){
            event.relatedTarget = e.fromElement;
        }else if(eventType == 'mouseout'){
            event.relatedTarget = e.toElement;
        }
        
        if(!J.isUndefined(e.button)){
            var v = e.button;
            var btnCodeMap = {
                0: -1,//取消原来的值
                1: 0,//左键
                2: 2,//右键
                3: -1,//取消原来的值
                4: 1//中键
            };
            /*
             * ie 的鼠标按键值
             * 0 没按键 
             * 1 按左键 
             * 2 按右键 
             * 3 按左右键 
             * 4 按中间键 
             * 5 按左键和中间键 
             * 6 按右键和中间键 
             * 7 按所有的键
             */
            if(!J.isUndefined(btnCodeMap[v])){
                event.button = btnCodeMap[v];
            }else{
                event.button = v;
            }
        }
        return event;
    };
    
    // From: David Flanagan.
    
    // In IE 5 and later, we use attachEvent( ) and detachEvent( ), with a number of
    // hacks to make them compatible with addEventListener and removeEventListener.
    if (J.browser.ie/*document.attachEvent*/) {//这里不能用特性判断, 否则opera也会使用这个方法绑定事件
        //ie都用这个方法是因为ie9对标准的addEventListener支持不完整
        /**
         * 兼容ie的写法
         * @ignore
         */
        addEventListener = function(element, eventType, handler,options) {
            if(customEvent["on"+eventType]){
                customEvent["on"+eventType](element, eventType, handler,options);
                return;
            }
            addOriginalEventListener(element, eventType, handler);
        };
        /**
         * @ignore
         */
        addOriginalEventListener = function(element, eventType, handler) {
            if ($E._find(arguments) != -1){
                return;
            }
            /**
             * @ignore
             */
            var wrappedEvent = function(e){
                
                var event = standardizeEvent(e, element);

                if (Function.prototype.call){
                    handler.call(element, event);
                }else {
                    // If we don't have Function.call, fake it like this.
                    element._currentHandler = handler;
                    element._currentHandler(event);
                    element._currentHandler = null;
                }
            };
    
            // Now register that nested function as our event handler.
            element.attachEvent("on" + eventType, wrappedEvent);
    

            var h = {
                element: element,
                eventType: eventType,
                handler: handler,
                wrappedEvent: wrappedEvent
            };
    

            var d = element.document || element;
            // Now get the window associated with that document.
            var w = d.parentWindow || window;
    
            // We have to associate this handler with the window,
            // so we can remove it when the window is unloaded.
            var id = $E._uid();  // Generate a unique property name
            if (!w._allHandlers) w._allHandlers = {};  // Create object if needed
            w._allHandlers[id] = h; // Store the handler info in this object
    
            // And associate the id of the handler info with this element as well.
            if (!element._handlers) element._handlers = [];
            element._handlers.push(id);
    
            // If there is not an onunload handler associated with the window,
            // register one now.
            if (!w._onunloadEventRegistered) {
                w._onunloadEventRegistered = true;
                w.attachEvent("onunload", $E._removeAllEvents);
            }
        };
        
        /**
         * 兼容ie的写法
         * @ignore
         */
        removeEventListener = function(element, eventType, handler) {
            if(customEvent["off"+eventType]){
                customEvent["off"+eventType](element, eventType,handler);
                return;
            }
            if(arguments.length == 3){
                removeOriginalEventListener(element, eventType, handler);
            }else{
                removeOriginalEventListener(element, eventType);
            }
        };
        /**
         * @ignore
         */
        removeOriginalEventListener = function(element, eventType, handler) {
            // Find this handler in the element._handlers[] array.
            var handlersIndex = $E._find(arguments);
            if (handlersIndex == -1) return;  // If the handler was not registered, do nothing
            // Get the window of this element.
            var d = element.document || element;
            var w = d.parentWindow || window;
            for(var j=0; j<handlersIndex.length; j++){
                var i = handlersIndex[j];
                // Look up the unique id of this handler.
                var handlerId = element._handlers[i];
                // And use that to look up the handler info.
                var h = w._allHandlers[handlerId];
                // Using that info, we can detach the handler from the element.
                element.detachEvent("on" + h.eventType, h.wrappedEvent);
                // Remove one element from the element._handlers array.
                element._handlers[i]=null;
                element._handlers.splice(i, 1);
                // And delete the handler info from the per-window _allHandlers object.
                delete w._allHandlers[handlerId];
            }
            if(element._handlers && element._handlers.length==0){
                element._handlers=null;
            }
        };
    
        // A utility function to find a handler in the element._handlers array
        // Returns an array index or -1 if no matching handler is found
        $E._find = function(args) {
            var element = args[0],
                eventType = args[1],
                handler = args[2],
                handlers = element._handlers;
                
            if (!handlers){
                return -1;  // if no handlers registered, nothing found
            }
    
            // Get the window of this element
            var d = element.document || element;
            var w = d.parentWindow || window;
    
            var handlersIndex = [];

            if(args.length === 3){
                // Loop through the handlers associated with this element, looking
                // for one with the right type and function.
                // We loop backward because the most recently registered handler
                // is most likely to be the first removed one.
                for(var i = handlers.length-1; i >= 0; i--) {
                    var handlerId = handlers[i];        // get handler id
                    var h = w._allHandlers[handlerId];  // get handler info
                    // If handler info matches type and handler function, we found it.
                    if (h.eventType == eventType && h.handler == handler){
                        handlersIndex.push(i);
                        return handlersIndex;
                    }
                }
            }else if(args.length === 2){
                
                for(var i = handlers.length-1; i >= 0; i--) {
                    var handlerId = handlers[i];        // get handler id
                    var h = w._allHandlers[handlerId];  // get handler info
                    // If handler info matches type and handler function, we found it.
                    if (h.eventType == eventType){
                        handlersIndex.push(i);
                    }
                }
                if(handlersIndex.length>0){
                    return handlersIndex;
                }
                
            }else if(args.length === 1){

                for(var i = handlers.length-1; i >= 0; i--) {
                    handlersIndex.push(i);
                }
                if(handlersIndex.length>0){
                    return handlersIndex;
                }
            }
            
            
            
            
            
            
            return -1;  // No match found
        };
    
        $E._removeAllEvents = function( ) {
            // This function is registered as the onunload handler with
            // attachEvent. This means that the this keyword refers to the
            // window in which the event occurred.
            var id,
                w = this;
    
            // Iterate through all registered handlers
            for(id in w._allHandlers) {
                // It would throw a refused access error
                // so I catch it. by azrael.
//                try{
//                    J.out('RemoveEvent: ' + id, 'RemoveAllEvents');
                    // Get handler info for this handler id
                    var h = w._allHandlers[id];
                    // Use the info to detach the handler
                    h.element.detachEvent("on" + h.eventType, h.wrappedEvent);
                    h.element._handlers=null;
                    // Delete the handler info from the window
                    delete w._allHandlers[id];
//                }catch(e){
//                    J.out('RemoveEventError: ' + e, 'RemoveAllEvents');
//                }
            }
        }
    
        // Private utility to generate unique handler ids
        $E._counter = 0;
        $E._uid = function(){
            return "h" + $E._counter++;
        };
    }
    // In DOM-compliant browsers, our functions are trivial wrappers around
    // addEventListener( ) and removeEventListener( ).
    else if (document.addEventListener) {
        /**
         * 
         * 添加事件监听器
         * 
         * @method addEventListener
         * @memberOf event
         * 
         * @param element 元素
         * @param eventType 事件类型，不含on
         * @param handler 事件处理器
         * @return {Element} 返回元素
         */
        addEventListener = function(element, eventType, handler, options) {
            //var id = $E._uid( );  // Generate a unique property name
            if(customEvent["on"+eventType]){
                customEvent["on"+eventType](element, eventType, handler, options);
                return;
            }
            addOriginalEventListener(element, eventType, handler);
        };
        /**
         * @ignore
         */
        addOriginalEventListener = function(element, eventType, handler) {
            var isExist = false;
            if(!element){
                J.out('targetModel undefined:'+eventType+handler);
            }
            if(!element._eventTypes){
                element._eventTypes = {};
            }
            if (!element._eventTypes[eventType]){
                element._eventTypes[eventType] = [];
            }
            element.addEventListener(eventType, handler, false);
            
            var handlers= element._eventTypes[eventType];
            for(var i=0; i<handlers.length; i++){
                if(handlers[i] == handler){
                    isExist = true;
                    break;
                }
            }
            if(!isExist){
                handlers.push(handler);
            }
        };
        
        /**
         * 
         * 移除事件监听器
         * 
         * @memberOf event
         * @method removeEventListener
         * 
         * @param element 元素
         * @param eventType 事件类型，不含on
         * @param handler 事件处理器
         * @return {Element} 返回元素
         */
        removeEventListener = function(element, eventType, handler) {
            if(customEvent["off"+eventType]){
                customEvent["off"+eventType](element, eventType,handler);
                return;
            }
            if(arguments.length == 3){
                removeOriginalEventListener(element, eventType, handler);
            }else{
                removeOriginalEventListener(element, eventType);
            }
        };
        /**
         * @ignore
         */
        removeOriginalEventListener = function(element, eventType, handler) {
            if(eventType){
                if(arguments.length == 3){//修复传入了第三个参数,但是第三个参数为 undefined 的问题
                    if(handler){
                        element.removeEventListener(eventType, handler, false);
                        if(element._eventTypes && element._eventTypes[eventType]){
                            var handlers = element._eventTypes[eventType];
                            for(var i=0; i<handlers.length; i++){
                                if(handlers[i] === handler){
                                    handlers[i]=null;
                                    handlers.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    }else{
//                        J.out('removeEventListener: handler is undefined. \n caller: '+ removeEventListener.caller);
                        //J.out('removeEventListener: handler is undefined. \n element: '+ element + ', eventType:' + eventType);
                    }
                }else{
                    
                    if(element._eventTypes && element._eventTypes[eventType]){
                        var handlers = element._eventTypes[eventType];
                        
                        for(var i=0; i<handlers.length; i++){
                            element.removeEventListener(eventType, handlers[i], false);
                        }
                        element._eventTypes[eventType] = [];
                    }
                    
                }
            }else{
                if(element._eventTypes){
                    var eventTypes = element._eventTypes;
                    for(var p in eventTypes){
                        var handlers = element._eventTypes[p];
                        for(var i=0; i<handlers.length; i++){
                            element.removeEventListener(p, handlers[i], false);
                        }
                    }
                    eventTypes = {};
                }
            }
            
        };
    }
    customEvent = {
        "ondrag" : function(element, eventType, handler){
            var _oldX,
                _oldY,
                isMove=false,
                orientMousedownEvent;
            var onElMousedown = function(e){
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                var touch;
                orientMousedownEvent = e;
                if(J.browser.mobileSafari){
                    //console.info("touchstart");
                    e.stopPropagation();
                    touch = e.touches[0];
                    _oldX= touch.pageX;
                    _oldY= touch.pageY;
                }else{
                    //TODO 这里阻止了事件冒泡,可能会有问题
                    e.stopPropagation();
                    e.preventDefault();
                    _oldX= e.clientX;
                    _oldY= e.clientY;
                }
                isMove=false;
                if(J.browser.mobileSafari){
                    $E.addEventListener(document, "touchmove", onElMousemove);
                    $E.addEventListener(element, "touchend", onElMouseup);
                }else{
                    $E.addEventListener(document, "mousemove", onElMousemove);
                }
//                J.out('onElMousedown: '+e.target.id );
            };
            var onElMousemove = function(e){
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                var x,y,touch;
                e.stopPropagation();
                if(J.browser.mobileSafari){
                    //console.info("touchmove");
                    touch = e.changedTouches[0];
                    x= touch.pageX;
                    y= touch.pageY;
                }else{
                    x = e.clientX;
                    y = e.clientY;
                }
                if(Math.abs(_oldX-x)+Math.abs(_oldY-y)>2) {
//                    J.out("customdrag");
                    //console.info("customdrag");
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(document, "touchmove", onElMousemove);
                        $E.removeEventListener(element, "touchend", onElMouseup);
                    }else{
                        $E.removeEventListener(document, "mousemove", onElMousemove);
                    }
                    if(!isMove){
                        handler.call(element,e);
                        isMove=true;
                    }
                }else{
                    //console.info( Math.abs(_oldX-x)+Math.abs(_oldY-y)>2 )
                }
            };
            var onElMouseup = function(e){
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                /*
                var x,y,touch;
                if(J.browser.mobileSafari){
                    touch = e.touches[0];
                    _oldX= touch.pageX;
                    _oldY= touch.pageY;
                }else{
                    x = e.clientX;
                    y = e.clientY;
                }
                if(Math.abs(_oldX-x)+Math.abs(_oldY-y)<2) {
                    isMove=false;
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(document, "touchmove", onElMousemove);
                    }else{
                        $E.removeEventListener(document, "mousemove", onElMousemove);
                    }
                }else{
                    
                }
                */
                //console.info("touch end");
                if(J.browser.mobileSafari){
                    $E.removeEventListener(document, "touchmove", onElMousemove);
                    if(!isMove){
                        //console.info("not draging");
                        /*
                        var point = e.changedTouches[0];
                        target = document.elementFromPoint(point.pageX,point.pageY); 
                        if(target.tagName=="IFRAME"){
                            return;
                        }else{
                        }
                        // Create the fake event
                        ev = document.createEvent('MouseEvents');
                        ev.initMouseEvent('click', true, true, e.view, 1,
                            point.screenX, point.screenY, point.clientX, point.clientY,
                            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                            0, null);
                        ev._fake = true;
                        target.dispatchEvent(ev);
                        */
                    }else{
                        e.stopPropagation();
                        e.preventDefault();
                        //console.info("is draging");
                    }
                }else{
                    $E.removeEventListener(document, "mousemove", onElMousemove);
                    //if(!isMove){
                        //@TODO fire the event
                    //}
                }
            };
            if(J.browser.mobileSafari){
                $E.addEventListener(element, "touchstart", onElMousedown);
            }else{
                $E.addEventListener(element, "mousedown", onElMousedown);
                $E.addEventListener(element, "mouseup", onElMouseup);
            }
//            J.out('element: ' + element.id);
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[onElMousedown,onElMouseup]});
        },
        "offdrag" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(element, "touchstart",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "touchend",customEventHandlers[i].actions[1]);
                    }else{
                        $E.removeEventListener(element, "mousedown",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "mouseup",customEventHandlers[i].actions[1]);
                    }
                    customEventHandlers.splice(i,1);
                    break;
                }
            }
        },
        "oncustomclick" : function(element, eventType, handler, options){//@ longTouchable 是否触发长按事件 add by ip
            var _oldX,
                _oldY,
                isMove=false,
                isClicked = false,
                timeStamp=0,
                longTouchTimer,
                options= options?options:{},
                longtouchable = options.longtouchable,
                mouseButton = -1;
            var onElMousedown = function(e){
//                //console.log('1: ' + e.button);
                timeStamp = e.timeStamp;
                isMove = false;
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                var touch;
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    _oldX = touch.pageX;
                    _oldY = touch.pageY;
                }else{
                    _oldX = e.clientX;
                    _oldY = e.clientY;
                }
                isClicked = false;
                if(longtouchable){
                    longTouchTimer = setTimeout(function(){
                        if(isMove || isClicked){
                            return;
                        }
                        var clickTime = 2000;//TODO (new Date()).getTime() - timeStamp;
                        //console.info('setTimeout',clickTime);
                        if(J.browser.mobileSafari){
                            $E.removeEventListener(element, "touchmove",onElMouseMove);
                            $E.removeOriginalEventListener(element, "touchend",onElClick);
                        }else{
                            $E.removeEventListener(element, "mousemove",onElMouseMove);
                            $E.removeOriginalEventListener(element, "click",onElClick);
                        }
                        handler.call(element,e,clickTime);
                    },1000);
                }
                if(J.browser.mobileSafari){
                    $E.addEventListener(element, "touchmove", onElMouseMove);
                    $E.addOriginalEventListener(element, "touchend", onElClick);
                }else{
                    $E.addEventListener(element, "mousemove", onElMouseMove);
                    $E.addOriginalEventListener(element, "click", onElClick);
                }
//                e.preventDefault();
//                e.stopPropagation();
            };    
            var onElMouseup = function(e){
                mouseButton = e.button;
//                //console.log('2: ' + e.button);
                if(!J.browser.mobileSafari && e.button !== 0){//非左键点击直接return
                    return;
                }
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    var x = touch.pageX;
                    var y = touch.pageY;
                }
            };
            var onElMouseMove = function(e){
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    var x = touch.pageX;
                    var y = touch.pageY;
                }else{
                    var x = e.clientX;
                    var y = e.clientY;
                }
                isMove = Math.abs(_oldX-x)+Math.abs(_oldY-y) > 1;
                if(isMove){
                    clearTimeout(longTouchTimer);
                    longTouchTimer = null;
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(element, "touchmove",onElMouseMove);
                        $E.removeOriginalEventListener(element, "touchend",onElClick);
                    }else{
                        $E.removeEventListener(element, "mousemove",onElMouseMove);
                        $E.removeOriginalEventListener(element, "click",onElClick);
                    }
                }
            }
            var onElClick = function(e){
                //console.info('clicked');
                clearTimeout(longTouchTimer);
                longTouchTimer = null;
                isClicked = true;
                if(!J.browser.mobileSafari && mouseButton !== 0){//非左键点击直接return
                    return;
                }
                var touch;
                var clickTime = 0;//e.timeStamp - timeStamp;
                if(J.browser.mobileSafari){
                    touch = e.changedTouches[0];
                    var x = touch.pageX;
                    var y = touch.pageY;
                }else{
                    var x = e.clientX;
                    var y = e.clientY;
                }
                if(Math.abs(_oldX-x)+Math.abs(_oldY-y)<1) {
                    isMove=false;
//                    J.out("this is a customclick","click");
                    //console.info('customclick');
//                  if(eventType=="click"){
                        handler.call(element,e,clickTime);
//                  }
                }else{
                    //console.info('not customclick');
                }
            };
            if(J.browser.mobileSafari){
                $E.addEventListener(element, "touchstart", onElMousedown);
            }else{
                $E.addEventListener(element, "mousedown", onElMousedown);
                $E.addEventListener(element, "mouseup", onElMouseup);
            }
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[onElMousedown,onElMouseMove,onElMouseup,onElClick]});
        },
        "offcustomclick" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    if(J.browser.mobileSafari){
                        $E.removeEventListener(element, "touchstart",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "touchmove",customEventHandlers[i].actions[1]);
                        $E.removeOriginalEventListener(element, "touchend",customEventHandlers[i].actions[3]);
                    }else{
                        $E.removeEventListener(element, "mousedown",customEventHandlers[i].actions[0]);
                        $E.removeEventListener(element, "mousemove",customEventHandlers[i].actions[1]);
                        $E.removeEventListener(element, "mouseup",customEventHandlers[i].actions[2]);
                        $E.removeOriginalEventListener(element, "click",customEventHandlers[i].actions[3]);
                    }
                    customEventHandlers.splice(i,1);
                    break;
                }
            }
        },
        "oncontextmenu" : function(element, eventType, handler){
            if(J.browser.ie == 9){
                /**
                 * @ignore
                 */
                var wrappedEvent = function(e){
                    var event = standardizeEvent(e, element);
                    handler.call(element, event);
                };
                element.attachEvent('oncontextmenu', wrappedEvent);
                customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[wrappedEvent]});
            }else{
                $E.addOriginalEventListener(element, eventType, handler);
            }
        },
        "offcontextmenu" : function(element, eventType, handler){
            if(J.browser.ie == 9){
                for(var i in customEventHandlers){
                    if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                        element.detachEvent('oncontextmenu', customEventHandlers[i].actions[0]);
                        customEventHandlers.splice(i,1);
                        break;
                    }
                }
            }else{
                $E.removeOriginalEventListener(element, eventType, handler);
            }
        },
        "onmousewheel" : function(element, eventType, handler){
            if(J.browser.firefox){
                var wrappedEvent = function(e){
                    e.wheelDelta = -40*e.detail;
                    handler.call(element, e);
                };
                $E.addOriginalEventListener(element, "DOMMouseScroll", wrappedEvent);
                customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[wrappedEvent]});
            }else{
                $E.addOriginalEventListener(element, "mousewheel" , handler);
            }
        },
        "offmousewheel" : function(element, eventType, handler){
            if(J.browser.firefox){
                for(var i in customEventHandlers){
                    if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                        $E.removeOriginalEventListener(element, "DOMMouseScroll", customEventHandlers[i].actions[0]);
                        customEventHandlers.splice(i,1);
                        break;
                    }
                }
            }else{
                $E.removeOriginalEventListener(element, "mousewheel", handler);
            }
        },
        "onmouseenter" : function(element, eventType, handler){
            var onElMouseEnter = function(e){
                var s = e.relatedTarget;
                if(!s){//relatedTarget为null, 鼠标浏览器外移进来
                    handler.call(this, e);
                }else if(this.compareDocumentPosition){//非ie
                    var res = this.compareDocumentPosition(s);
                    if(!(s == this || res == 20 || res == 0)){
                        handler.call(this, e);
                    }
                }else{
                    if(!(s == this || this.contains(s))){
                        handler.call(this, e);
                    }
                }
            };
                        
            $E.addEventListener(element, "mouseover", onElMouseEnter);
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler, actions: [onElMouseEnter]});
        },
        "offmouseenter" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    $E.removeEventListener(element, "mouseover",customEventHandlers[i].actions[0]);
                    customEventHandlers.splice(i, 1);
                    break;
                }
            }
        },
        "onmouseleave" : function(element, eventType, handler){
            var onElMouseLeave = function(e){
                var s = e.relatedTarget;
                if(!s){//relatedTarget为null, 鼠标移到浏览器外了
                    handler.call(this, e);
                }else if(this.compareDocumentPosition){//非ie
                    var res = this.compareDocumentPosition(s);
                    if(!(res == 20 || res == 0)){
                        handler.call(this, e);
                    }
                }else{
                    if(!this.contains(s)){
                        handler.call(this, e);
                    }
                }
            };
            $E.addEventListener(element, "mouseout", onElMouseLeave);
            customEventHandlers.push({"element":element,"eventType":eventType,handler:handler, actions: [onElMouseLeave]});
        },
        "offmouseleave" : function(element, eventType,handler){
            for(var i in customEventHandlers){
                if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                    $E.removeEventListener(element, "mouseout",customEventHandlers[i].actions[0]);
                    customEventHandlers.splice(i, 1);
                    break;
                }
            }
        },
        "oninput" : function(element, eventType, handler){
            if(J.browser.ie){
                /**
                 * @ignore
                 */
                var wrappedEvent = function(e){
                    if(e.propertyName.toLowerCase() == "value"){
                        var event = standardizeEvent(e, element);
                        handler.call(element, event);
                    }
                };
                element.attachEvent("onpropertychange", wrappedEvent);
                customEventHandlers.push({"element":element,"eventType":eventType,handler:handler,"actions":[wrappedEvent]});
                if(J.browser.ie==9){ //fix ie9 bug, can not fire when characters are deleted
                    $E.addOriginalEventListener(element, "change" , handler);
                }
            }else{
                $E.addOriginalEventListener(element, "input" , handler);
            }
        },
        "offinput" : function(element, eventType, handler){
            if(J.browser.ie){
                for(var i in customEventHandlers){
                    if(customEventHandlers[i].handler==handler&&customEventHandlers[i].element==element&&customEventHandlers[i].eventType==eventType){
                        element.detachEvent("onpropertychange", customEventHandlers[i].actions[0]);
                        customEventHandlers.splice(i,1);
                        break;
                    }
                }
                if(J.browser.ie==9){
                    $E.removeOriginalEventListener(element, "change" , handler);
                }
            }else{
                $E.removeOriginalEventListener(element, "input", handler);
            }
        }
        
    }
    
    
    
    
    
    
    
    
    /**
     * 
     * 文档加载完成时事件监听器
     * 
     * @method onDomReady
     * @memberOf event
     * 
     * @param element 元素
     * @param eventType 事件类型，不含on
     * @param handler 事件处理器
     */
    onDomReady = function( f ) {
        // If the DOM is already loaded, execute the function right away
        if ( onDomReady.done ) {
            return f();
        }
    
        // If we’ve already added a function
        if ( onDomReady.timer ) {
            // Add it to the list of functions to execute
            onDomReady.ready.push( f );
        } else {
            // 初始化onDomReady后要执行的function的数组
            onDomReady.ready = [ f ];
            
            // Attach an event for when the page finishes  loading,
            // just in case it finishes first. Uses addEvent.
            $E.on(window, "load", isDomReady);
    
            //  Check to see if the DOM is ready as quickly as possible
            onDomReady.timer = window.setInterval( isDomReady, 300 );
        }
    }
    
    /**
     * 
     * 判断文档加载是否完成
     * 
     * @method isDomReady
     * @memberOf event
     * 
     * @param element 元素
     * @param eventType 事件类型，不含on
     * @param handler 事件处理器
     */
    // Checks to see if the DOM is ready for navigation
    isDomReady = function() {
        // If we already figured out that the page is ready, ignore
        if ( onDomReady.done ) {
            return true;
        }
    
        // Check to see if a number of functions and elements are
        // able to be accessed
        if ( document && document.getElementsByTagName && document.getElementById && document.body ) {
            // Remember that we’re now done
            onDomReady.done = true;
            
            // If they’re ready, we can stop checking
            window.clearInterval( onDomReady.timer );
            onDomReady.timer = null;
    
            // Execute all the functions that were waiting
            for ( var i = 0; i < onDomReady.ready.length; i++ ){
                onDomReady.ready[i]();
            }

            onDomReady.ready = null;
            
            return true;
        }
    }
    
    
    
    
    /**
     * 创建一个消息源发布者的类
     * Publish
     * @class 
     * @return {Object} 返回生成的消息源
     * @memberOf event
     * @constructor
     * @example
     * Jx().$package(function(J){
     *     var onMsg = new J.Publish();
     *  var funcA = function(option){
     *      alert(option);
     *  };
     *  // 注册一个事件的观察者
     *     onMsg.subscribe(funcA);
     *     var option = "demo";
     *     onMsg.deliver(option);
     *     onMsg.unsubscribe(funcA);
     *     onMsg.deliver(option);
     *     
     * };
     * 
     */
    Publish = function(){
        this.subscribers = [];
    };
    
    /**
     * 注册观察者
     * @memberOf event.Publish.prototype
     * @function
     * @param {Function} func 要注册的观察者
     * @return {Function} 返回结果
     */
    Publish.prototype.subscribe = function(func){
        var alreadyExists = J.array.some(this.subscribers, function(el){
            return el === func;
        });
        if(!alreadyExists){
            this.subscribers.push(func);
        }
        return func;
    };
    
    /**
     * 触发事件
     * @memberOf event.Publish.prototype
     * @param {Mixed} msg 要注册的观察者
     * @return {Function} 返回结果
     */
    Publish.prototype.deliver = function(msg){
        J.array.forEach(this.subscribers, function(fn){
            fn(msg);
        });
    };
    
    /**
     * 注销观察者
     * @memberOf event.Publish.prototype
     * @param {Function} func 要注销的观察者
     * @return {Function} 返回结果
     */
    Publish.prototype.unsubscribe = function(func){
        this.subscribers = J.array.filter(this.subscribers, function(el){
            return el !== func;
        });
        return func;
    };
    
    
    
    
    
    
    
    
    /**
     * 
     * 为自定义Model添加事件监听器
     * 
     * @method addObserver
     * @memberOf event
     * 
     * @param targetModel 目标 model，即被观察的目标
     * @param eventType 事件类型，不含on
     * @param handler 观察者要注册的事件处理器
     */
    addObserver = function(targetModel, eventType, handler){
        var handlers,
            length,
            index,
            i;
        if(handler){
            
        
            // 转换成完整的事件描述字符串
            eventType = "on" + eventType;
            
            // 判断对象是否含有$events对象
            if(!targetModel._$events){
                targetModel._$events={};
            }
            
            // 判断对象的$events对象是否含有eventType描述的事件类型
            if(!targetModel._$events[eventType]){
                //若没有则新建
                targetModel._$events[eventType] = [];
            }else if(targetModel._$events[eventType].length == 0){
                //bug: ie会有引用泄漏的问题, 如果数组为空, 则重新创建一个
                targetModel._$events[eventType] = [];
            }
        
            handlers = targetModel._$events[eventType];
            length = handlers.length;
            index = -1;
        
            // 通过循环，判断对象的handlers数组是否已经含有要添加的handler
            for(i=0; i<length; i++){
                
                var tempHandler = handlers[i];

                if(tempHandler == handler){
                    index = i;
                    break;
                }        
            }
            // 如果没有找到，则加入此handler
            if(index === -1){
                handlers.push(handler);
                //alert(handlers[handlers.length-1])
            }
        }else{
            J.out(">>> 添加的观察者方法不存在："+targetModel+eventType+handler);
        }
    };
    /**
     * 
     * 批量为自定义Model添加事件监听器
     * 
     * @method addObservers
     * @memberOf event
     * 
     * @param obj 目标 model，即被观察的目标
     *     obj = { targetModel : {eventType:handler,eventType2:handler2...} , targetModel2: {eventType:handler,eventType2:handler2...}  }
     */
    addObservers = function(obj){
        //TODO 这里的代码是直接复制addObserver的（为避免太多函数调用耗费栈）
        var t=obj['targetModel'];
        var m=obj['eventMapping'];
        for(var i in m){
            addObserver(t,i,m[i]);
        }
    
    };
    /**
     * 
     * 触发自定义Model事件的监听器
     * 
     * @method notifyObservers
     * @memberOf event
     * 
     * @param targetModel 目标 model，即被观察目标
     * @param eventType 事件类型，不含on
     * @param options 触发的参数对象
     * @return {Boolean} 
     */
    notifyObservers = function(targetModel, eventType, argument){/*addInvokeTime(eventType);*/
        var handlers,
            i;
            
        eventType = "on" + eventType;
        var flag = true;
        if(targetModel._$events && targetModel._$events[eventType]){
            handlers = targetModel._$events[eventType];
            if(handlers.length > 0){
                // 通过循环，执行handlers数组所包含的所有函数function
                for(i=0; i<handlers.length; i++){
                    if(handlers[i].apply(targetModel, [argument]) === false){
                        flag = false;
                    }
                }
                //return flag;
            }
        }else{
            // throw new Error("还没有定义 [" + targetModel + "] 对象的: " + eventType + " 事件！");
            //return false;
        }
        return flag;
    };
    
    
    /**
     * 
     * 为自定义 Model 移除事件监听器
     * 
     * @method removeObserver
     * @memberOf event
     * 
     * @param targetModel 目标 model，即被观察的目标
     * @param eventType 事件类型，不含on
     * @param handler 观察者要取消注册的事件处理器
     */
    // 按照对象和事件处理函数来移除事件处理函数
    removeObserver = function(targetModel, eventType, handler){
        var i,
            j,
            flag = false,
            handlers,
            length,
            events = targetModel._$events;
        if(handler){
            
            if(events){
                eventType = "on" + eventType;
                handlers = events[eventType];
                
                if(handlers){
                    length = handlers.length;
                    for(i=0; i<length; i++){
                        //由==修改为===
                        if(handlers[i] == handler){
                            handlers[i] = null;
                            handlers.splice(i, 1);
                            flag = true;
                            break;
                        }    
                    }
                }
                
                
            }
        }else if(eventType){
            if(events){
                eventType = "on" + eventType;
                handlers = events[eventType];
                if(handlers){
                    length = handlers.length;
                    for(i=0; i<length; i++){
                        handlers[i] = null;
                    }
                    delete events[eventType];
                    flag = true;
                }
                
            }
            
        }else if(targetModel){
            if(events){
                for(i in events){
                    delete events[i];
                }
                delete targetModel._$events;
                flag = true;
            }
        }
        return flag;
    };
    
    $E.addEventListener = addEventListener;
    $E.removeEventListener = removeEventListener;
    $E.addOriginalEventListener = addOriginalEventListener;
    $E.removeOriginalEventListener = removeOriginalEventListener;
    // alias
    $E.on = $E.addEventListener;
    $E.off = $E.removeEventListener;
    
    $E.onDomReady = onDomReady;
    
    $E.Publish = Publish;
    
    // Model 事件方法
    $E.addObserver = addObserver;
    $E.addObservers = addObservers;
    $E.notifyObservers = notifyObservers;
    $E.removeObserver = removeObserver;
});

/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jx!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/** 
 * @description
 * Package: jx.array
 *
 * Need package:
 * jx.core.js
 * 
 */

/**
 * 4.[Javascript core]: array 数组处理
 */
Jx().$package(function(J){
    
    /**
     * array 名字空间
     * 
     * @namespace
     * @name array
     */
    J.array = J.array || {};
    var $A = J.array,
        // javascript1.6扩展
        indexOf,
        lastIndexOf,
        forEach,
        filter,
        some,
        map,
        every,
        // javascript1.8扩展
        reduce,
        reduceRight,
        
        // JET扩展
        toArray,
        remove,
        replace,
        bubbleSort,
        binarySearch,
        
        //集合的操作
        contains,
        uniquelize,
        intersect,
        minus,
        union;
    
    
    
    /**
     * 正向查找数组元素在数组中的索引下标
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Object} obj 要查找的数组的元素
     * @param {Number} fromIndex 开始的索引编号
     * 
     * @return {Number}返回正向查找的索引编号
     */
    indexOf = Array.prototype.indexOf 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.indexOf.apply(arguments[0], args);
        }
        : function (arr, obj, fromIndex) {
    
            if (fromIndex == null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, arr.length + fromIndex);
            }
            for (var i = fromIndex; i < arr.length; i++) {
                if (arr[i] === obj){
                    return i;
                }
            }
            return -1;
        };
    
    
        
    /**
     * 反向查找数组元素在数组中的索引下标
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Object} obj 要查找的数组元素
     * @param {Number} fromIndex 开始的索引编号
     * 
     * @return {Number}返回反向查找的索引编号
     */
    lastIndexOf = Array.prototype.lastIndexOf 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.lastIndexOf.apply(arguments[0], args);
        }
        : function (arr, obj, fromIndex) {
            if (fromIndex == null) {
                fromIndex = arr.length - 1;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, arr.length + fromIndex);
            }
            for (var i = fromIndex; i >= 0; i--) {
                if (arr[i] === obj){
                    return i;
                }
            }
            return -1;
        };
    
    

    
    
    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     */
    forEach = Array.prototype.forEach 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.forEach.apply(arguments[0], args);
        }
        : function(arr, fun /*, thisp*/) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    fun.call(thisp, arr[i], i, arr);
                }
            }
        };
    
    /**
     * 用一个自定义函数来过滤数组
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 过滤函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Array}返回筛选出的新数组
     */
    filter = Array.prototype.filter 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.filter.apply(arguments[0], args);
        }
        : function(arr, fun) {
            var len = arr.length;
            if (typeof fun != "function") {
              throw new TypeError();
            }
            var res   = [];
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    var val = arr[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, arr)) {
                        res.push(val);
                    }
                }
            }
            return res;
        };
    
    
    


    
    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数，如果有任意一个或多个数组成员使得函数执行结果返回 true，则最终返回 true，否则返回 false
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    some = Array.prototype.some 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.some.apply(arguments[0], args);
        }
        : function(arr, fun /*, thisp*/) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
    
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr && fun.call(thisp, arr[i], i, arr)) {
                    return true;
                }
            }
    
            return false;
        };
    

    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数，并把函数的返回结果以映射的方式存入到返回的数组中
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Array}返回映射后的新数组
     */
    map = Array.prototype.map 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.map.apply(arguments[0], args);
        }
        : function(arr, fun /*, thisp*/) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var res   = new Array(len);
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    res[i] = fun.call(thisp, arr[i], i, arr);
                }
            }
    
            return res;
        };
    
    
    /**
     * 遍历数组，把每个数组元素作为第一个参数来执行函数，如果所有的数组成员都使得函数执行结果返回 true，则最终返回 true，否则返回 false
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    every = Array.prototype.every 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.every.apply(arguments[0], args);
        }
        : function(arr, fun) {
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr && !fun.call(thisp, arr[i], i, arr)) {
                    return false;
                }
            }
            return true;
        };
    
    
    
    
    
    /**
     * 对该数组的每项和前一次调用的结果运行一个函数，收集最后的结果。
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.8_Reference:Objects:Array:reduce
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    reduce = Array.prototype.reduce 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.reduce.apply(arguments[0], args);
        }
        : function(arr, fun /*, initial*/){
            var len = arr.length >>> 0;
            if (typeof fun != "function"){
                throw new TypeError();
            }
            // no value to return if no initial value and an empty array
            if (len == 0 && arguments.length == 2){
                throw new TypeError();
            }
            var i = 0;
            if (arguments.length >= 3){
                var rv = arguments[2];
            }
            else{
                do{
                    if (i in arr){
                      rv = arr[i++];
                      break;
                    }
                
                    // if array contains no values, no initial value to return
                    if (++i >= len){
                        throw new TypeError();
                    }
                }
                while (true);
            }
            
            for (; i < len; i++){
                if (i in arr){
                    rv = fun.call(null, rv, arr[i], i, arr);
                }
            }
            
            return rv;
        };
    
    
    
    /**
     * 同上，但从右向左执行。
     * 
     * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.8_Reference:Objects:Array:reduceRight
     * @memberOf array
     * @function
     * 
     * @param {Array} arr 要执行操作的数组
     * @param {Function} fun 要执行的函数
     * @param {Object} contextObj 执行函数时的上下文对象，可以省略
     * 
     * @return {Boolean}
     */
    reduceRight = Array.prototype.reduceRight 
        ? function(){
            var args = Array.prototype.slice.call(arguments, 1);
            return Array.prototype.reduceRight.apply(arguments[0], args);
        }
        : function(arr, fun /*, initial*/){
            var len = arr.length >>> 0;
            if (typeof fun != "function"){
                throw new TypeError();
            }
            // no value to return if no initial value, empty array
            if (len == 0 && arguments.length == 2){
                throw new TypeError();
            }
            var i = len - 1;
            if (arguments.length >= 3){
                var rv = arguments[2];
            }
            else{
                do{
                    if (i in arr){
                        rv = arr[i--];
                        break;
                    }
            
                    // if array contains no values, no initial value to return
                    if (--i < 0){
                        throw new TypeError();
                    }
                }
                while(true);
            }
            
            for (; i >= 0; i--){
                if (i in arr){
                    rv = fun.call(null, rv, arr[i], i, arr);
                }
            }
            
            return rv;
        };

    
    
    
    /**
     * 将任意变量转换为数组的方法
     * 
     * @memberOf array
     * @param {Mixed} o 任意变量
     * @return {Array} 返回转换后的数组
     */
    toArray = function(o){
        var type = J.$typeof(o);
        return (type) ? ((type != 'array' && type != 'arguments') ? [o] : o) : [];
    };
    
    
    
    
    /**
     * 从数组中移除一个或多个数组成员
     * 
     * @memberOf array
     * @param {Array} arr 要移除的数组成员，可以是单个成员也可以是成员的数组
     * @return {Boolean} 找到并移除, 返回 true
     */
    remove = function(arr, members){
        var members = toArray(members),
            i,
            j,
            flag = false;
        for(i=0; i<members.length; i++){
            for(j=0; j<arr.length; j++){
                if(arr[j] === members[i]){
                    arr.splice(j,1);
                    flag = true;
                }
            }
        }
        return flag;
    };
    
    /**
     * 替换一个数组成员
     * 
     * @memberOf array
     * @param {Object} oldValue 当前数组成员
     * @param {Object} newValue 要替换成的值
     * @return {Boolean} 如果找到旧值并成功替换则返回 true，否则返回 false
     */
    replace = function(arr, oldValue, newValue){
        var i;
        for(i=0; i<arr.length; ij++){
            if(arr[i] === oldValue){
                arr[i] = newValue;
                return true;
            }
        }
        return false;
    };
    
    /**
     * 冒泡排序,默认从小到大排序
     * @memberOf array
     * @param {Array} arr 需要排序的数组
     * @param {Function} compareFunc 比较方法, 传入两个参数 a,b, 若返回 大于0 则表示 a > b, 小于 0 则 a < b
     *  可选, 默认返回 a - b的结果
     * @return {Array} 排序后的数组
     * @example
     * 
     * bubbleSort([3,5,6,2], function(a, b){
     *  return a - b;
     * });
     * 
     */
    bubbleSort = function(arr, compareFunc) {
        compareFunc = compareFunc || function(num1, num2){
            return num1 - num2;
        };
        //数组长度
        var n = arr.length;
        //交换顺序的临时变量
        var temp;//
        //交换标志
        var exchange;
        //最多做n-1趟排序
        for (var time=0; time<n-1; time++){
            exchange = false;
            for (var i=n-1; i>time; i--) {
                if (compareFunc(arr[i], arr[i - 1]) < 0) {
                //if (arr[i] < arr[i - 1]) {
                    exchange = true;
                    temp = arr[i - 1];
                    arr[i - 1] = arr[i];
                    arr[i] = temp;
                }
            }
            //若本趟排序未发生交换，提前终止算法
            if (!exchange) {
                break;
            }
        }
        return arr;
    };
    
    /**
     * 二叉搜索
     * @memberOf array
     * @param {Array} arr 源数组
     * @param {Object} item 查找的目标
     * @param {Function} compareFunc 比较方法, 传入两个参数 a,b, 若返回 大于0 则表示 a > b, 小于 0 则 a < b
     * @return {Number} item 所处的 index
     * 
     */
    binarySearch = function(arr, item, compareFunc){
        var start = 0;
        var end = arr.length;
        var current = Math.floor(arr.length/2);
        while(end != current){
            if(compareFunc(item, arr[current]) > 0){
                start = current + 1;
            }
            else{
                end = current;
            };
    
            current = Math.floor((start + end) / 2);
        };
        return current;
    };
    
    /**
     * 判断arr是否包含元素o
     * @memberOf array
     * @name contains
     * @function
     * @param {Array} arr
     * @param {Obejct} o
     * @return {Boolean}
     */
    contains = function(arr, o){
        return (indexOf(arr, o) > -1);
    };
    
    /**
     * 唯一化一个数组
     * @memberOf array
     * @param {Array} arr
     * @return {Array} 由不重复元素构成的数组
     */
    uniquelize = function(arr){
        var result = [];
        for(var i = 0, len = arr.length; i < len; i++){
            if(!contains(result, arr[i])){
                result.push(arr[i]);
            }
        }
        return result;
    };
    
    /**
     * 求两个集合的交集
     * a ∩ b
     * @memberOf array
     * @param {Array} a
     * @param {Array} b
     * @return {Array} a ∩ b
     */
    intersect = function(a, b){
        var result = [];
        for(var i = 0, len = a.length; i < len; i++){
            if(contains(b, a[i])){
                result.push(a[i]);
            }
        }
        return result;
    };
    
    /**
     * 求两个集合的差集
     * a - b
     * @memberOf array
     * @param {Array} a
     * @param {Array} b
     * @return {Array} a - b
     */
    minus = function(a, b){
        var result = [];
        for(var i = 0, len = a.length; i < len; i++){
            if(!contains(b, a[i])){
                result.push(a[i]);
            }
        }
        return result;
    };
    
    /**
     * 求两个集合的并集
     * a U b
     * @memberOf array
     * @param {Array} a
     * @param {Array} b
     * @return {Array} a U b
     */
    union = function(a, b){
        return uniquelize(a.concat(b));
    };
    
    $A.indexOf = indexOf;
    $A.lastIndexOf = lastIndexOf;
    $A.forEach = forEach;
    $A.filter = filter;
    $A.some = some;
    $A.map = map;
    $A.every = every;
    $A.reduce = reduce;
    $A.reduceRight = reduceRight;

    $A.toArray = toArray;
    $A.remove = remove;
    $A.replace = replace;
    $A.bubbleSort = bubbleSort;
    $A.binarySearch = binarySearch;
    
    $A.contains = contains;
    $A.uniquelize = uniquelize;
    $A.intersect = intersect;
    $A.minus = minus;
    $A.union = union;
    
});









/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jx!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/** 
 * @description
 * Package: Jx.string
 * 
 * Need package:
 * Jx.core.js
 * 
 */


/**
 * 3.[Javascript core]: String 字符串处理
 */
Jx().$package(function(J){
    
    /**
     * string 名字空间
     * 
     * @namespace
     * @name string
     */
    J.string = J.string || {};
    var $S = J.string,
        toString,
        template,
        isURL,
        parseURL,
        buildURL,
        mapQuery,
        test,
        contains,
        trim,
        clean,
        camelCase,
        hyphenate,
        capitalize,
        escapeRegExp,
        toInt,
        toFloat,
        toSingleLine,
        toHtml,
        toTitle,
        toQueryPair,
        toQueryString,
        
        hexToRgb,
        rgbToHex,
        stripScripts,
        substitute,
        replaceAll,
        
        byteLength,
        cutRight,
        cutByBytes,
        isNumber,
        isEmail,
        
        encodeHtmlSimple,
        decodeHtmlSimple,
        decodeHtmlSimple2,
        encodeHtmlAttributeSimple,
        encodeHtmlAttribute,
        encodeHtml,
        encodeScript,
        encodeHrefScript,
        encodeRegExp,
        encodeUrl,
        encodeUriComponent,
        vaildTencentUrl,
        vaildUrl,
        getCharWidth;
        
    
    /**
     * 将任意变量转换为字符串的方法
     * 
     * @method toString
     * @memberOf string
     * 
     * @param {Mixed} o 任意变量
     * @return {String} 返回转换后的字符串
     */
    toString = function(o){
        return (o + "");
    };
    
    var cache = {};
      
    /**
     * 多行或单行字符串模板处理
     * 
     * @method template
     * @memberOf string
     * 
     * @param {String} str 模板字符串
     * @param {Object} obj 要套入的数据对象
     * @return {String} 返回与数据对象合成后的字符串
     * 
     * @example
     * <script type="text/html" id="user_tmpl">
     *   <% for ( var i = 0; i < users.length; i++ ) { %>
     *     <li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
     *   <% } %>
     * </script>
     * 
     * Jx().$package(function(J){
     *  // 用 obj 对象的数据合并到字符串模板中
     *  J.template("Hello, {name}!", {
     *      name:"Kinvix"
     *  });
     * };
     */
    template = function(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            template(document.getElementById(str).innerHTML) :
          
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
        
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };



    
    

    /**
     * 判断是否是一个可接受的 url 串
     * 
     * @method isURL
     * @memberOf string
     * 
     * @param {String} str 要检测的字符串
     * @return {Boolean} 如果是可接受的 url 则返回 true
     */
    isURL = function(str) {
        return isURL.RE.test(str);
    };
        
    /**
     * @ignore
     */
    isURL.RE = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;


    /**
     * 分解 URL 为一个对象，成员为：scheme, user, pass, host, port, path, query, fragment
     * 
     * @method parseURL
     * @memberOf string
     * 
     * @param {String} str URL 地址
     * @return {Object} 如果解析失败则返回 null
     */
    parseURL = function(str) {
        var ret = null;

        if (null !== (ret = parseURL.RE.exec(str))) {
            var specObj = {};
            for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
                var curSpec = parseURL.SPEC[i];
                specObj[curSpec] = ret[i + 1];
            }
            ret = specObj;
            specObj = null;
        }

        return ret;
    };


    /**
     * 将一个对象（成员为：scheme, user, pass, host, port, path, query, fragment）重新组成为一个字符串
     * 
     * @method buildURL
     * @memberOf string
     * 
     * @param {Object} obj URl 对象
     * @return {String} 如果是可接受的 url 则返回 true
     */
    buildURL = function(obj) {
        var ret = '';

        // prefix & surffix
        var prefix = {},
            surffix = {};

        for (var i = 0, j = parseURL.SPEC.length; i < j ; i ++) {
            var curSpec = parseURL.SPEC[i];
            if (!obj[curSpec]) {
                continue;
            }
            switch (curSpec) {
            case 'scheme':
                surffix[curSpec] = '://';
                break;
            case 'pass':
                prefix[curSpec] = ':';
            case 'user':
                prefix['host'] = '@';
                break;
            //case 'host':
            case 'port':
                prefix[curSpec] = ':';
                break;
            //case 'path':
            case 'query':
                prefix[curSpec] = '?';
                break;
            case 'fragment':
                prefix[curSpec] = '#';
                break;
            }

            // rebuild
            if (curSpec in prefix) {
                ret += prefix[curSpec];
            }
            if (curSpec in obj) {
                ret += obj[curSpec];
            }
            if (curSpec in surffix) {
                ret += surffix[curSpec];
            }
        }

        prefix = null;
        surffix = null;
        obj = null;

        return ret;
    };
    
    /**
     * @ignore
     */
    parseURL.SPEC = ['scheme', 'user', 'pass', 'host', 'port', 'path', 'query', 'fragment'];
    parseURL.RE = /^([^:]+):\/\/(?:([^:@]+):?([^@]*)@)?(?:([^/?#:]+):?(\d*))([^?#]*)(?:\?([^#]+))?(?:#(.+))?$/;
    
    /**
     * 将 uri 的查询字符串参数映射成对象
     * 
     * @method mapQuery
     * @memberOf string
     * 
     * @param {String} uri 要映射的 uri
     * @return {Object} 按照 uri 映射成的对象
     * 
     * @example
     * Jx().$package(function(J){
     *  var url = "http://web.qq.com/?qq=4765078&style=blue";
     *  // queryObj 则得到一个{qq:"4765078", style:"blue"}的对象。
     *  var queryObj = J.mapQuery(url);
     * };
     */
    mapQuery = function(uri){
        //window.location.search
        var i,
            key,
            value,
            uri = uri && uri.split('#')[0] || window.location.search, //remove hash
            index = uri.indexOf("?"),
            pieces = uri.substring(index + 1).split("&"),
            params = {};
        if(index === -1){//如果连?号都没有,直接返回,不再进行处理. az 2011/5/11
            return params;
        }
        for(i=0; i<pieces.length; i++){
            try{
                index = pieces[i].indexOf("=");
                key = pieces[i].substring(0,index);
                value = pieces[i].substring(index+1);
                if(!(params[key] = unescape(value))){
                    throw new Error("uri has wrong query string when run mapQuery.");
                }
            }
            catch(e){
                //J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
        }
        return params;
    };
    
    /**
     * 
     * test的方法
     * 
     * @memberOf string
     * 
     * @param {String, RegExp} regex 正则表达式，或者正则表达式的字符串
     * @param {String} params 正则的参数
     * @return {Boolean} 返回结果
     */
    test = function(string, regex, params){
        return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(string);
    };

    /**
     * 判断是否含有指定的字符串
     * 
     * @memberOf string
     * @name contains
     * @function
     * @param {String} string 是否含有的字符串
     * @param {String} separator 分隔符，可选
     * @return {Boolean} 如果含有，返回 true，否则返回 false
     */
    contains = function(string1, string2, separator){
        return (separator) ? (separator + string1 + separator).indexOf(separator + string2 + separator) > -1 : string1.indexOf(string2) > -1;
    };

    /**
     * 清除字符串开头和结尾的空格
     * 
     * @memberOf string
     * 
     * @return {String} 返回清除后的字符串
     */
    trim = function(string){
        return String(string).replace(/^\s+|\s+$/g, '');
    };

    /**
     * 清除字符串开头和结尾的空格，并把字符串之间的多个空格转换为一个空格
     * 
     * @memberOf string
     * 
     * @return {String} 返回清除后的字符串
     */
    clean = function(string){
        return trim(string.replace(/\s+/g, ' '));
    };

    /**
     * 将“-”连接的字符串转换成驼峰式写法
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    camelCase = function(string){
        return string.replace(/-\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
    };
    
    /**
     * 将驼峰式写法字符串转换成“-”连接的
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    hyphenate = function(string){
        return string.replace(/[A-Z]/g, function(match){
            return ('-' + match.charAt(0).toLowerCase());
        });
    };

    /**
     * 将字符串转换成全大写字母
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    capitalize = function(string){
        return string.replace(/\b[a-z]/g, function(match){
            return match.toUpperCase();
        });
    };

    /**
     * 转换 RegExp 正则表达式
     * 
     * @memberOf string
     * 
     * @return {String} 返回转换后的字符串
     */
    escapeRegExp = function(string){
        return string.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    };

    /**
     * 将字符串转换成整数
     * 
     * @memberOf string
     * 
     * @return {Number} 返回转换后的整数
     */
    toInt = function(string, base){
        return parseInt(string, base || 10);
    };

    /**
     * 将字符串转换成浮点数
     * 
     * @memberOf string
     * @param {Sring} string 要转换的字符串
     * @return {Number} 返回转换后的浮点数
     */
    toFloat = function(string){
        return parseFloat(string);
    };
    
    /**
     * 将带换行符的字符串转换成无换行符的字符串
     * 
     * @memberOf string
     * @param {Sring} str 要转换的字符串
     * @return {Sring} 返回转换后的字符串
     */
    toSingleLine = function(str){
        return String(str).replace(/\r/gi,"")
                            .replace(/\n/gi,"");
    };
    
    /**
     * 将字符串转换成html源码
     * 
     * @memberOf string
     * @param {Sring} str 要转换的字符串
     * @return {Sring} 返回转换后的html代码字符串
     */
    toHtml = function(str){
        return String(str).replace(/&/gi,"&amp;")
                            .replace(/\\/gi,"&#92;")
                            .replace(/\'/gi,"&#39;")
                            .replace(/\"/gi,"&quot;")
                            .replace (/</gi,"&lt;")
                            .replace(/>/gi,"&gt;")
                            .replace(/ /gi,"&nbsp;")
                            .replace(/\r\n/g,"<br />")
                            .replace(/\n\r/g,"<br />")
                            .replace(/\n/g,"<br />")
                            .replace(/\r/g,"<br />");
    };
    
    
    
    /**
     * 将字符串转换成用于title的字符串
     * 
     * @memberOf string
     * @param {Sring} str 要转换的字符串
     * @return {Number} 返回转换后的in title字符串
     */
    toTitle = function(str){
        return String(str).replace(/\\/gi,"\\")
                            .replace(/\'/gi,"\'")
                            .replace(/\"/gi,"\'");
    };

    
    
    
    

    /**
     * 将颜色 Hex 写法转换成 RGB 写法
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    hexToRgb = function(string, array){
        var hex = string.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        return (hex) ? hex.slice(1).hexToRgb(array) : null;
    };

    /**
     * 将颜色 RGB 写法转换成 Hex 写法
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    rgbToHex = function(string, array){
        var rgb = string.match(/\d{1,3}/g);
        return (rgb) ? rgb.rgbToHex(array) : null;
    };

    /**
     * 脱去script标签
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    stripScripts = function(string, option){
        var scripts = '';
        var text = string.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
            scripts += arguments[1] + '\n';
            return '';
        });
        if (option === true){
            $exec(scripts);
        }else if($type(option) == 'function'){
            option(scripts, text);
        }
        return text;
    };
    
    /**
     * 。。。。
     * 
     * @memberOf string
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    toQueryPair = function(key, value) {
        return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
    };
    
    /**
     * 。。。。
     * 
     * @memberOf string
     * @param {Object} obj 要转换成查询字符串的对象
     * @return {String} 返回转换后的查询字符串
     */
    toQueryString = function(obj){
        var result=[];
        for(var key in obj){
            result.push(toQueryPair(key, obj[key]));
        }
        return result.join("&");
    };



    /**
     * 。。。。
     * 
     * @memberOf string
     * @return {String} 返回转换后的字符串
     */
    substitute = function(string, object, regexp){
        return string.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
            if (match.charAt(0) == '\\') return match.slice(1);
            return (object[name] != undefined) ? object[name] : '';
        });
    };
    
    /**
     * 全局替换指定的字符串
     * 
     * @memberOf string
     * @return {String} 返回替换后的字符串
     */
    replaceAll = function(string, reallyDo, replaceWith, ignoreCase) {
        if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
            return string.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
        } else {
            return string.replace(reallyDo, replaceWith);
        }
    };
    
    /**
     * 计算字符串的字节长度
     * 
     * @memberOf string
     * @param {String} string
     * @param {Number} n 指定一个中文的字节数, 默认为2
     * @return {Number} 返回自己长度
     */
    byteLength = function(string,n){
        n= n||2;
        return string.replace(/[^\x00-\xff]/g,({2:"aa",3:"aaa"})[n]).length;
    };
    /**
     * 按字符按给定长度裁剪给定字符串
     * @memberOf string
     * @param {String} string
     * @param {Number} n 
     * @return {String} 
     */
    cutRight = function(string, n){
        return string.substring(0, (string.length - n));
    };
    /**
     * 按字节按给定长度裁剪给定字符串
     * @memberOf string
     * @param {String} string
     * @param {Number} n 
     * @return {String} 
     */
    cutByBytes = function(string,n) {
        var s= string;
        while(byteLength(s)>n) {
            s= cutRight(s,1);
        }
        return s;
    };
    /**
     * 判断给定字符串是否是数字
     * @memberOf string
     * @name isNumber
     * @function
     * 
     * @param {String} string
     * @param {Number} n 
     * @return {String} 
     */
    isNumber = function(string){
        if (string.search(/^\d+$/) !== -1){
            return true;
        }
        else{
            return false;
        }
    };
    /**
     * 判断一个字符串是否是邮箱格式
     * @memberOf string
     * @param {String} emailStr
     * @return {Boolean}
     */
    isEmail = function(emailStr){
        if (emailStr.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1){
            return true;
        }
        else{
            return false;
        }
    };
    
    
    
    
    /*
    JS安全API v1.1
    Created By Web Application Security Group of TSC
    UpDate: 2007-12-08
    */

    
    /**
     * html正文编码, 对需要出现在HTML正文里(除了HTML属性外)的不信任输入进行编码
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtmlSimple = function(sStr){
        sStr = sStr.replace(/&/g,"&amp;");
        sStr = sStr.replace(/>/g,"&gt;");
        sStr = sStr.replace(/</g,"&lt;");
        sStr = sStr.replace(/"/g,"&quot;");
        sStr = sStr.replace(/'/g,"&#39;");
        return sStr;
    };
    
    /**
     * html正文解码, 对HtmlEncode函数的结果进行解码
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var decodeHtmlSimple = function(sStr){
        sStr = sStr.replace(/&amp;/g,"&");
        sStr = sStr.replace(/&gt;/g,">");
        sStr = sStr.replace(/&lt;/g,"<");
        sStr = sStr.replace(/&quot;/g,'"');
        sStr = sStr.replace(/&#39;/g,"'");
        return sStr;
    };
    
    var decodeHtmlSimple2 = function(sStr){
        sStr = sStr.replace(/&amp;/g,"&");
        sStr = sStr.replace(/&gt;/g,">");
        sStr = sStr.replace(/&lt;/g,"<");
        sStr = sStr.replace(/\\\\"/g,'"');
        sStr = sStr.replace(/\\\\'/g,"'");
        return sStr;
    };
    
    /**
     * html属性编码：对需要出现在HTML属性里的不信任输入进行编码
        注意:
        (1)该函数不适用于属性为一个URL地址的编码.这些标记包括:a/img/frame/iframe/script/xml/embed/object...
        属性包括:href/src/lowsrc/dynsrc/background/...
        (2)该函数不适用于属性名为 style="[Un-trusted input]" 的编码
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtmlAttributeSimple = function(sStr){
        sStr = sStr.replace(/&/g,"&amp;");
        sStr = sStr.replace(/>/g,"&gt;");
        sStr = sStr.replace(/</g,"&lt;");
        sStr = sStr.replace(/"/g,"&quot;");
        sStr = sStr.replace(/'/g,"&#39;");
        sStr = sStr.replace(/=/g,"&#61;");
        sStr = sStr.replace(/`/g,"&#96;");
        return sStr;
    };

    
    
    
    /**
     * 用做过滤直接放到HTML里的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtml = function(sStr) { 
        return sStr.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function(r){ 
            return "&#"+r.charCodeAt(0)+";";
        }).replace(/ /g, "&nbsp;").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />"); 
    };
    
    /**
     * 用做过滤HTML标签里面的东东 比如这个例子里的&lt;input value="XXXX"&gt;  XXXX就是要过滤的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHtmlAttribute = function(sStr) { 
        return sStr.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g, function(r){ 
            return "&#"+r.charCodeAt(0)+";";
        }); 
    };
    
    /**
     * 用做过滤直接放到HTML里js中的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeScript = function(sStr) {
        sStr+="";//确保为String
        return sStr.replace(/[\\"']/g, function(r){ 
            return "\\"+r; 
        }).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
    };
    
    
    
    /**
     * 用做过滤直接放到<a href="javascript:XXXX">中的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeHrefScript = function(sStr) {
        return encodeHtml(encodeUrl(escScript(sStr)));
    };
    
    /**
     * 用做过滤直接放到正则表达式中的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeRegExp = function(sStr) {
        return sStr.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g, function(a,b){
            return "\\"+a;
        });
    };
    
    /**
     * 用做过滤直接URL参数里的  比如 http://show8.qq.com/abc_cgi?a=XXX  XXX就是要过滤的
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeUrl = function(sStr) {
        return escape(sStr).replace(/\+/g, "%2B");
    };
    
    /**
        对需要出现在一个URI的一部分的不信任输入进行编码 
        例如:
        <a href="http://search.msn.com/results.aspx?q1=[Un-trusted-input]& q2=[Un-trusted-input]">Click Here!</a>
        以下字符将会被编码: 
        除[a-zA-Z0-9.-_]以外的字符都会被替换成URL编码
     *
     * @memberOf string
     * @param {String} sStr
     * @return {String} 
     */
    var encodeUriComponent = function(sStr){
        sStr = encodeURIComponent(sStr);
        sStr = sStr.replace(/~/g,"%7E");
        sStr = sStr.replace(/!/g,"%21");
        sStr = sStr.replace(/\*/g,"%2A");
        sStr = sStr.replace(/\(/g,"%28");
        sStr = sStr.replace(/\)/g,"%29");
        sStr = sStr.replace(/'/g,"%27");
        sStr = sStr.replace(/\?/g,"%3F");
        sStr = sStr.replace(/;/g,"%3B");
        return sStr;
    };
    
    /**
    url转向验证
    描述：对通过javascript语句载入（或转向）的页面进行验证，防止转到第三方网页和跨站脚本攻击
    返回值：true -- 合法；false -- 非法
    例：
    合法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.qq.com
        http://xxx.qq.com/hi/redirect.html?url=a.html
        http://xxx.qq.com/hi/redirect.html?url=/a/1.html
    非法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.baidu.com
        http://xxx.qq.com/hi/redirect.html?url=javascript:codehere
        http://xxx.qq.com/hi/redirect.html?url=//www.qq.com
     *
     * @memberOf string
     * @param {String} sUrl
     * @return {String} 
     */
    var vaildTencentUrl = function(sUrl){
        return (/^(https?:\/\/)?[\w\-.]+\.(qq|paipai|soso|taotao)\.com($|\/|\\)/i).test(sUrl)||(/^[\w][\w\/\.\-_%]+$/i).test(sUrl)||(/^[\/\\][^\/\\]/i).test(sUrl) ? true : false;
    };
    

    /**
     * 验证给定字符串是否是url, 如果是url 则返回正常的url
     * 
     * @memberOf string
     * @param {String} sUrl
     * @return {String} 
     */
    var vaildUrl = function(url){ 
        var url=encodeURI(url).replace(/(^\s*)|(\s*$)/g, ''),
            protocolReg=/(^[a-zA-Z0-9]+[^.]):/,
            domainReg=/^[\S.]+\.[\S.]+$/,
            domainendReg=/[\w.]+\/(\S*)/,
            jsReg=/;$/,
            jpReg=/^[\s*]*javascript[\s*]*:/;
            
        if((!protocolReg.test(url)) && (!domainReg.test(url))){
            url="";
        }else{
            if(!protocolReg.test(url)){
                url="http://"+url;
            }
            if(!domainendReg.test(url)){
                url=url+"/";
                
            }
            //如果是js为协议就清空
            if(jpReg.test(url)){
                url="";
            }
        }
        
        return url;
    };
    
    
    /**
     * 获取字符实际宽度
     * @memberOf string
     * @param {String} str 需要计算的字符串
     * @param {Number} fontsize 字体大小，可以不填
     * @return {Number}
     */
    var getCharWidth = function(str,fontsize) {
        var d= document.createElement("div");
        d.style.visibility= "hidden";
        d.style.width= "auto";
        if(fontsize) {
            d.style.fontSize= fontsize + "px";
        }
        d.style.position= "absolute";
        d.innerHTML= J.string.encodeHtmlSimple(str);
        document.body.appendChild(d);
        var width= d.offsetWidth;
        document.body.removeChild(d);
        return width;
    };
    
    /**
     * 按给定宽度裁剪字符串
     * @memberOf string
     * @param {String} str 
     * @param {Number} fontsize 字体大小
     * @param {Number} width 限定的宽度
     * @return {Number}
     */
    var cutByWidth = function(str,fontsize,width) {
        for(var i=str.length;i>=0;--i)
        {
            str=str.substring(0, i);
            if(getCharWidth(str, fontsize)<width)
            {
                return str;
            }
        }
        return '';
    };
    $S.cutByWidth = cutByWidth;
    $S.toString = toString;
    $S.template = template;
    $S.isURL = isURL;
    $S.parseURL = parseURL;
    $S.buildURL = buildURL;
    $S.mapQuery = mapQuery;
    $S.test = test;
    $S.contains = contains;
    $S.trim = trim;
    $S.clean = clean;
    $S.camelCase = camelCase;
    $S.hyphenate = hyphenate;
    $S.capitalize = capitalize;
    $S.escapeRegExp = escapeRegExp;
    $S.toInt = toInt;
    $S.toFloat = toFloat;
    $S.toSingleLine = toSingleLine;
    
    $S.toHtml = toHtml;
    $S.toTitle = toTitle;
    $S.toQueryPair = toQueryPair;
    $S.toQueryString = toQueryString;
    
    $S.hexToRgb = hexToRgb;
    $S.rgbToHex = rgbToHex;
    $S.stripScripts = stripScripts;
    $S.substitute = substitute;
    $S.replaceAll = replaceAll;
    
    $S.byteLength = byteLength;
    $S.cutRight = cutRight;
    
    $S.isNumber = isNumber;
    $S.isEmail = isEmail;
    
    $S.cutByBytes = cutByBytes;
    
    //html正文编码：对需要出现在HTML正文里(除了HTML属性外)的不信任输入进行编码
    $S.encodeHtmlSimple = encodeHtmlSimple;
    
    //html正文解码：对HtmlEncode函数的结果进行解码
    $S.decodeHtmlSimple = decodeHtmlSimple;
    $S.decodeHtmlSimple2 = decodeHtmlSimple2;
    
    
    /*
    html属性编码：对需要出现在HTML属性里的不信任输入进行编码
    注意:
    (1)该函数不适用于属性为一个URL地址的编码.这些标记包括:a/img/frame/iframe/script/xml/embed/object...
    属性包括:href/src/lowsrc/dynsrc/background/...
    (2)该函数不适用于属性名为 style="[Un-trusted input]" 的编码
    */
    $S.encodeHtmlAttributeSimple = encodeHtmlAttributeSimple;
    
    //用做过滤HTML标签里面的东东 比如这个例子里的<input value="XXXX">  XXXX就是要过滤的
    $S.encodeHtmlAttribute = encodeHtmlAttribute;
    
    //用做过滤直接放到HTML里的
    $S.encodeHtml = encodeHtml;
    
    //用做过滤直接放到HTML里js中的
    $S.encodeScript = encodeScript;
    
    //用做过滤直接放到<a href="javascript:XXXX">中的
    $S.encodeHrefScript = encodeHrefScript;
    
    //用做过滤直接放到正则表达式中的
    $S.encodeRegExp = encodeRegExp;
    
    //用做过滤直接URL参数里的  比如 http://show8.qq.com/abc_cgi?a=XXX  XXX就是要过滤的
    $S.encodeUrl = encodeUrl;
    
    /*
    对需要出现在一个URI的一部分的不信任输入进行编码 
    例如:
    <a href="http://search.msn.com/results.aspx?q1=[Un-trusted-input]& q2=[Un-trusted-input]">Click Here!</a>
    以下字符将会被编码: 
    除[a-zA-Z0-9.-_]以外的字符都会被替换成URL编码
    */
    $S.encodeUriComponent = encodeUriComponent;
    
    /*
    url转向验证
    描述：对通过javascript语句载入（或转向）的页面进行验证，防止转到第三方网页和跨站脚本攻击
    返回值：true -- 合法；false -- 非法
    例：
    合法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.qq.com
        http://xxx.qq.com/hi/redirect.html?url=a.html
        http://xxx.qq.com/hi/redirect.html?url=/a/1.html
    非法的值
        http://xxx.qq.com/hi/redirect.html?url=http://www.baidu.com
        http://xxx.qq.com/hi/redirect.html?url=javascript:codehere
        http://xxx.qq.com/hi/redirect.html?url=//www.qq.com
    */
    $S.vaildTencentUrl = vaildTencentUrl;
    
    $S.vaildUrl = vaildUrl;
    
    $S.getCharWidth = getCharWidth;

    
    












});









/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jx!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/** 
 * @description
 * Package: jet.http
 *
 * Need package:
 * jet.core.js
 * 
 */

/**
 * 1.[Browser part]: http 包,含有ajax,comet,loadScript,loadCss封装
 */
Jx().$package(function(J){
    var $=J.dom.id,
        $D=J.dom,
        $E=J.event,
        ajax,
        comet,
        load,
        loadCss,
        loadScript,
        formSend;
    
    // 兼容不同浏览器的 Adapter 适配层
    if(typeof window.XMLHttpRequest === "undefined"){
        /**
         * @ignore
         */
        window.XMLHttpRequest = function(){
            return new window.ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >=0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
        };
    }
    
    /**
     * http 名字空间
     * 
     * @namespace
     * @name http
     */
    J.http = J.http || {};

    /**
     * 这是Ajax对象名字空间的一个方法
     * 
     * @memberOf http
     * @method  ajax
     * 
     * @param {String} uri 要加载的数据的uri
     * @param {Object} option 配置对象，如：isAsync,data,arguments,onSuccess,onError,onComplete,onTimeout,timeout,contentType,type
     * @return {Object} ajax 返回一个ajax对象，可以abort掉
     */
    ajax = function(uri, option){
        var httpRequest,
            httpSuccess,
            timeout,
            isTimeout = false,
            isComplete = false;
        
        option = {
            method: (option.method || "GET").toUpperCase(),
            data: option.data || null,
            arguments: option.arguments || null,

            onSuccess: option.onSuccess || function(){},
            onError: option.onError || function(){},
            onComplete: option.onComplete || function(){},
            //尚未测试
            onTimeout: option.onTimeout || function(){},

            isAsync: option.isAsync || true,
            timeout: option.timeout || 30000,
            contentType: option.contentType,
            type: option.type || "xml"
        };
        if(option.data && typeof option.data === "object"){
            option.data = J.string.toQueryString(option.data);
        }

        uri = uri || "";
        timeout = option.timeout;
        
        httpRequest = new window.XMLHttpRequest();

        /**
         * @ignore
         */
        httpSuccess = function(r){
            try{
                return (!r.status && location.protocol == "file:")
                    || (r.status>=200 && r.status<300)
                    || (r.status==304)
                    || (navigator.userAgent.indexOf("Safari")>-1 && typeof r.status=="undefined");
            }catch(e){
                //J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
            }
            return false;
        }
        
        /**
         * @ignore
         */
        httpRequest.onreadystatechange=function (){
            if(httpRequest.readyState==4){
                if(!isTimeout){
                    var o={};
                        o.responseText = httpRequest.responseText;
                        o.responseXML = httpRequest.responseXML;
                        o.data= option.data;
                        o.status= httpRequest.status;
                        o.uri=uri;
                        o.arguments=option.arguments;
                        if(option.type === 'json'){
                            try{
                                o.responseJSON = J.json.parse(httpRequest.responseText);
                            }catch(e){
                            }
                        }
                    if(httpSuccess(httpRequest)){
                        option.onSuccess(o);
                    }else{
                        option.onError(o);
                    }
                    option.onComplete(o);
                }
                isComplete = true;
                //删除对象,防止内存溢出
                httpRequest=null;
            }
        };
        
        if(option.method === "GET"){
            if(option.data){
                uri += (uri.indexOf("?")>-1?"&":"?") + option.data;
                option.data = null;
            }
            httpRequest.open("GET", uri, option.isAsync);
            httpRequest.setRequestHeader("Content-Type",option.contentType || "text/plain;charset=UTF-8");
            httpRequest.send();
        }else if(option.method === "POST"){
            httpRequest.open("POST", uri, option.isAsync);
            httpRequest.setRequestHeader("Content-Type",option.contentType || "application/x-www-form-urlencoded;charset=UTF-8");
            httpRequest.send(option.data);
        }else{
            httpRequest.open(option.method, uri, option.isAsync);
            httpRequest.send();
        }
        
        window.setTimeout(function(){
            var o;
            if(!isComplete){
                isTimeout = true;
                o={};
                o.uri=uri;
                o.arguments=option.arguments;
                option.onTimeout(o);
                option.onComplete(o);
            }
        }, timeout);    
        
        return httpRequest;
    };

    
    /**
     * comet方法
     * 
     * @memberOf http
     * @method  comet
     * @param {String} uri uri地址
     * @param {Object} option 配置对象
     * @return {Object} 返回一个comet dom对象
     */
    comet = function(uri, option){

        uri = uri || "";
        option = {
            method : option.method || "GET",
            data : option.data || null,
            arguments : option.arguments || null,
            callback : option.callback || function(){},
            onLoad : option.onLoad || function(){},

            contentType: option.contentType ? option.contentType : "utf-8"
        };

        var connection;
        if(J.browser.ie){
            var htmlfile = new ActiveXObject("htmlfile");
            htmlfile.open();
            htmlfile.close();
            var iframediv = htmlfile.createElement("div");
            htmlfile.appendChild(iframediv);
            htmlfile.parentWindow._parent = self;
            iframediv.innerHTML = '<iframe id="_cometIframe" src="'+uri+'?callback=window.parent._parent.'+option.callback+'"></iframe>';
            
            connection = htmlfile.getElementById("_cometIframe");
        
        }
        else{
            connection = $D.node("iframe");
            connection.setAttribute("id", "_cometIframe");
            connection.setAttribute("src", uri+'?callback=window.parent._parent.'+option.callback);
            connection.style.position = "absolute";
            connection.style.visibility = "hidden";
            connection.style.left = connection.style.top = "-999px";
            connection.style.width = connection.style.height = "1px";
            document.body.appendChild(connection);
            self._parent = self;
        };

        $E.on(connection,"load", option.onLoad);

        return connection;
        
    };
    

    
    
    
    
    /**
     * 这是load方法
     * 
     * @memberOf http
     * @method load
     * 
     * @param {String} type 一个配置对象
     * @param {Object} option 一个配置对象
     * @return {Object} ajax 返回一个ajax对象
     */
    load = function(type, uri, option){
        var node,
            linkNode,
            scriptNode,
            id,
            head = document.getElementsByTagName("head") ? document.getElementsByTagName("head")[0] : document.documentElement,
            timer,
            isTimeout = false,
            isComplete = false,
            option = option || {},
            isDefer = option.isDefer || false,
            query = option.query || null,
            arguments = option.arguments || null,
            
            onSuccess = option.onSuccess || function(){},
            onError = option.onError || function(){},
            onComplete = option.onComplete || function(){},
            purge,
            //尚未测试
            onTimeout = option.onTimeout || function(){},

//          timeout = option.timeout ? option.timeout : 10000,
            timeout = option.timeout, //az 2011-2-21 修改为默认不需要超时
            charset = option.charset ? option.charset : "utf-8",
            win = option.win || window,
            o,
            
            getId;

        uri = uri || "";
        if(query !== null){
            uri = uri + "?" + query;
        }
        /**
         * @ignore
         */
        getId = function(){
            return load.Id++;
        };
        id = getId();
        
        /**
         * @ignore
         */
        purge = function(id){
            var el=$("jet_load_" + id)
            if(el){
                head.removeChild(el);
            }
        };

        /**
         * Generates a link node
         * @method _linkNode
         * @param uri {string} the uri for the css file
         * @param win {Window} optional window to create the node in
         * @return {HTMLElement} the generated node
         * @private
         */
        linkNode = function(uri, win, charset) {
            var c = charset || "utf-8";
            return $D.node("link", {
                        "id":       "jet_load_" + id,
                        "type":     "text/css",
                        "charset":  c,
                        "rel":      "stylesheet",
                        "href":     uri
                    }, win);
        };
        
        /**
         * Generates a script node
         * @method _scriptNode
         * @param uri {string} the uri for the script file
         * @param win {Window} optional window to create the node in
         * @return {HTMLElement} the generated node
         * @private
         */
        scriptNode = function(uri, win, charset, isDefer) {
            var c = charset || "utf-8";
            var node = $D.node("script", {
                        "id":       "jet_load_" + id,
                        "type":     "text/javascript",
                        "charset":  c,
                        "src":      uri
                    }, win);
            if(isDefer){
                node.setAttribute("defer", "defer");
            }
            
            return node;
        };
        
        
        
        if(type === "script"){
            node = option.node || scriptNode(uri, win, charset, isDefer);
        }else if(type === "css"){
            node = option.node || linkNode(uri, win, charset);
        }
        

        if(J.browser.engine.trident && parseInt(J.browser.ie)<9){
            /**
             * @ignore
             */
            node.onreadystatechange = function() {
                var rs = this.readyState;
                if (rs === "loaded" || rs === "complete") {
                    /**
                     * @ignore
                     */
                    node.onreadystatechange = null;

                    if(!isTimeout){
                        isComplete = true;
                        window.clearTimeout(timer);
                        timer = null;
                        o={};
                        o.id = id;
                        o.uri = uri;
                        o.arguments = arguments;
                        onSuccess(o);
                        onComplete(o);
                        //if(type === "script"){
                            //purge(id);
                        //}
                    }
                }
            };

        // webkit prior to 3.x is no longer supported
        }else if(J.browser.engine.webkit){
            // Safari 3.x supports the load event for script nodes (DOM2)
            $E.on(node, "load", function(){
                var o;
                if(!isTimeout){
                    isComplete = true;
                    window.clearTimeout(timer);
                    timer = null;
                    o={};
                    o.id = id;
                    o.uri = uri;
                    o.arguments = arguments;
                    onSuccess(o);
                    onComplete(o);
                    if(type === "script"){
                        purge(id);
                    }
                }
            });


        // FireFox and Opera support onload (but not DOM2 in FF) handlers for
        // script nodes.  Opera, but not FF, supports the onload event for link
        // nodes.
        }else{ 
            /**
             * @ignore
             */
            node.onload = function(){
                var o;
                //J.out("else:"+J.browser.engine.name);
                if(!isTimeout){
                    isComplete = true;
                    window.clearTimeout(timer);
                    timer = null;
                    o={};
                    o.id = id;
                    o.uri = uri;
                    o.arguments = option.arguments;
                    onSuccess(o);
                    onComplete(o);
                    
                    if(type === "script"){
                        purge(id);
                    }
                }
            };
            /**
             * @ignore
             */
            node.onerror = function(e){
                var o;
                //J.out("else:"+J.browser.engine.name);
                if(!isTimeout){
                    isComplete = true;
                    window.clearTimeout(timer);
                    timer = null;
                    o={};
                    o.id = id;
                    o.uri = uri;
                    o.arguments = arguments;
                    o.error = e;
                    onError(o);
                    onComplete(o);
                    //if(type === "script"){
                        purge(id);
                    //}
                }
            };
        }
        
        
        if(option.node){
            if(type === "script"){
                node.src = uri;
            }else if(type === "css"){
                node.href = uri;
            }
        }else{
            head.appendChild(node);
        }
       
        
        if(type === "script"){
            if(timeout){
                timer = window.setTimeout(function(){
                    var o;
                    if(!isComplete){
                        isTimeout = true;
                        o = {};
                        o.uri = uri;
                        o.arguments = arguments;
                        onTimeout(o);
                        onComplete(o);
                        purge(id);
                    }
                }, timeout);
            }
        }
        /**
         * @ignore
         */
        var func = function(node){
            this._node = node;
            this._head = head;
        };
        func.prototype={
            /**
             * @ignore
             */
            abort:function(){
                this._node.src="";
                this._head.removeChild(this._node);
                delete this._node;
            }
            
        };
        return new func(node);
    };
    load.Id=0;
    
    /**
     * 加载CSS
     * 
     * @memberOf http
     * @method loadCss
     * 
     * @param {String} uri 要加载的css的uri
     * @param {Object} option 配置对象，如：isDefer,query,arguments,onSuccess,onError,onComplete,onTimeout,timeout,charset
     * @return {Object} ajax 返回一个ajax对象
     */
    loadCss = function(uri, option){
        return load("css", uri, option);
    };
    
    /**
     * 加载Javascript
     * 
     * @memberOf http
     * @method loadScript
     * 
     * @param {String} uri 要加载的js脚本的uri
     * @param {Object} option 配置对象，如：isDefer,query,arguments,onSuccess,onError,onComplete,onTimeout,timeout,charset
     * @return {Element} 返回控制对象，可以abort掉
     */
    loadScript = function(uri, option){
        return load("script", uri, option);
    };
    
    
    
    /**
     * TODO 这里的form send需要改造，建立一个iframe池，来处理并发问题
     */
    /**
     * @description formSend的iframe池，目前定为长度为2
     * @type {Object}
     */
    var divEl;
    var formSendIframePool = {
        /**
         * @example
         * [[divElement,formElement,iframeElement],[divElement,formElement,iframeElement],,,]
         */
        _iframes: [],
        _tick: 0,
        /**
         * 顺序返回一个iframe
         */
        _select: function() {
            this._tick++;
            return  this._iframes[(this._tick-1)%this._len];
        },
        /**
         * @description 初始化
         * @argument {Number} len the number of iframes in poll
         */
        init: function(len) {
            if(this._isInit==true) {
                return;
            }
            this._len= len;
            var bodyEl=document.body;
            for(var i=0;i<len;i++) {
                divEl = $D.node("div",{
                    "class": "RPCService_hDiv"
                });
                $D.hide(divEl);
                divEl.innerHTML = '<iframe id="RPCService_hIframe_'+i+'" name="RPCService_hIframe_'+i+'" src="'+alloy.CONST.MAIN_URL+'domain.html"></iframe>';  
                bodyEl.appendChild(divEl);
                //not have a iframe yet
                this._iframes[i]=[divEl,null,"RPCService_hIframe_"+i];
            }
            this._isInit= true;
        },
        /**
         * @description 使用的入口
         * @argument {Element} iframeEL
         */
        take: function(formEl) {
            var doms= this._select();
            //if iframe exist
            if(doms[1]) {
                doms[0].removeChild(doms[1]);
            }
            formEl.setAttribute("target",doms[2]);
            doms[1]= formEl;
            doms[0].appendChild(formEl);
        }
    };
    /**
     * 使用form请求数据
     * @memberOf http
     * @param {String} url 
     * @param {Object} option 请求参数
     */
    formSend = function(url, option){
        formSendIframePool.init(2);
        var opt = {
            method: option.method || "GET",
            enctype: option.enctype || "",  //"multipart/form-data",
            data: option.data || {},  //表单项 
            //尚未测试
            onSuccess: option.onSuccess || function(){},   //iframe 载入成功回调,区别与获取数据成功
            onError: option.onError || function(){},      //iframe 载入失败回调
            onComplete: option.onComplete || function(){},
            
            onTimeout: option.onTimeout || function(){},
            timeout: option.timeout ? option.timeout : 10000
        };
        var formEl = $D.node("form",{
                    "class": "RPCService_form",
                    method: opt.method,
                    action: url+"?t=" + (new Date().getTime()),
                    enctype: opt.enctype
                })
         
        if(Object.prototype.toString.call(opt.data).indexOf("String")>-1) {
            var inputEl=$D.node("input");
            inputEl.type="text";
            inputEl.name=opt.data;
            formEl.appendChild(inputEl);            
        }else {
            for(var p in opt.data){
                var inputEl=$D.node("input");
                inputEl.type="text";
                inputEl.name=p;
                inputEl.setAttribute("value",opt.data[p]);
                formEl.appendChild(inputEl);
            }
        }
        formSendIframePool.take(formEl);            
        formEl.submit();
        
        /* 
          iframe事件未处理，当载入成功会自动调用回调函数     
          var iframeEl = $D.id("RPCService_hIframe");
          $E.on(iframeEl, "load", opt.onSuccess); 
          oFrm.onload = oFrm.onreadystatechange = function() {   
             if (this.readyState &amp;&amp; this.readyState != 'complete') return;   
             else {   
                 onComplete();   
             }  
        */
    };
    
    
    
    J.http.ajax = ajax;
    J.http.comet = comet;
    J.http.load = load;
    J.http.loadCss = loadCss;
    J.http.loadScript = loadScript;
    J.http.formSend = formSend;
});




/**
 * format 扩展包
 */
Jx().$package(function(J){
    
    /**
     * number 名字空间
     * 
     * @namespace
     * @name format
     * @type Object
     */
    J.format = J.format || {};
    
    /**
     * 让日期和时间按照指定的格式显示的方法
     * @method date
     * @memberOf format
     * @param {String} format 格式字符串
     * @return {String} 返回生成的日期时间字符串
     * 
     * @example
     * Jx().$package(function(J){
     *     var d = new Date();
     *     // 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
     *     J.format.date(d, "YYYY-MM-DD hh:mm:ss");
     * };
     * 
     */
    var date = function(date, formatString){
        /*
         * eg:formatString="YYYY-MM-DD hh:mm:ss";
         */
        var o = {
            "M+" : date.getMonth()+1,    //month
            "D+" : date.getDate(),    //day
            "h+" : date.getHours(),    //hour
            "m+" : date.getMinutes(),    //minute
            "s+" : date.getSeconds(),    //second
            "q+" : Math.floor((date.getMonth()+3)/3),    //quarter
            "S" : date.getMilliseconds()    //millisecond
        }
    
        if(/(Y+)/.test(formatString)){
            formatString = formatString.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
    
        for(var k in o){
            if(new RegExp("("+ k +")").test(formatString)){
                formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return formatString;
    };
    
    /**
     * @memberOf format
     * @method number
     * 格式化数字显示方式
     * @param num 要格式化的数字
     * @param pattern 格式
     * @example 
     * J.format.number(12345.999,'#,##0.00');
     *  //out: 12,34,5.99
     * J.format.number(12345.999,'0'); 
     *  //out: 12345
     * J.format.number(1234.888,'#.0');
     *  //out: 1234.8
     * J.format.number(1234.888,'000000.000000');
     *  //out: 001234.888000
     */  
    var number = function(num, pattern) {
        var strarr = num ? num.toString().split('.') : ['0'];
        var fmtarr = pattern ? pattern.split('.') : [''];
        var retstr = '';
    
        // 整数部分
        var str = strarr[0];
        var fmt = fmtarr[0];
        var i = str.length - 1;
        var comma = false;
        for (var f = fmt.length - 1; f >= 0; f--) {
            switch (fmt.substr(f, 1)) {
                case '' :
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    break;
                case '0' :
                    if (i >= 0)
                        retstr = str.substr(i--, 1) + retstr;
                    else
                        retstr = '0' + retstr;
                    break;
                case ',' :
                    comma = true;
                    retstr = ',' + retstr;
                    break;
            }
        }
        if (i >= 0) {
            if (comma) {
                var l = str.length;
                for (; i >= 0; i--) {
                    retstr = str.substr(i, 1) + retstr;
                    if (i > 0 && ((l - i) % 3) == 0)
                        retstr = ',' + retstr;
                }
            } else
                retstr = str.substr(0, i + 1) + retstr;
        }
    
        retstr = retstr + '.';
        // 处理小数部分
        str = strarr.length > 1 ? strarr[1] : '';
        fmt = fmtarr.length > 1 ? fmtarr[1] : '';
        i = 0;
        for (var f = 0; f < fmt.length; f++) {
            switch (fmt.substr(f, 1)) {
                case '' :
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    break;
                case '0' :
                    if (i < str.length)
                        retstr += str.substr(i++, 1);
                    else
                        retstr += '0';
                    break;
            }
        }
        return retstr.replace(/^,+/, '').replace(/\.$/, '');
    };
    
    J.format.date = date;
    J.format.number = number;
    
});

/** 
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jx!
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/** 
 * @description
 * Package: jet.cookie
 *
 * Need package:
 * jet.core.js
 * 
 */


/**
 * cookie类
 * 
 * @namespace J.cookie
 */
Jx().$package(function(J){
    var domainPrefix = window.location.host;
    
    /**
     * cookie 名字空间
     * @namespace 
     * @name cookie
     */
    J.cookie = 
    /**
     * @lends cookie
     */ 
    {
        
        /**
         * 设置一个cookie
         * 
         * @param {String} name cookie名称
         * @param {String} value cookie值
         * @param {String} domain 所在域名
         * @param {String} path 所在路径
         * @param {Number} hour 存活时间，单位:小时
         * @return {Boolean} 是否成功
         */
        set : function(name, value, domain, path, hour) {
            if (hour) {
                var today = new Date();
                var expire = new Date();
                expire.setTime(today.getTime() + 3600000 * hour);
            }
            window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
            return true;
        },
    
        /**
         * 获取指定名称的cookie值
         * 
         * @param {String} name cookie名称
         * @return {String} 获取到的cookie值
         */
        get : function(name) {
            var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
            // var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*?)(?:;|$)");
            var m = window.document.cookie.match(r);
            return (!m ? "" : m[1]);
            // document.cookie.match(new
            // RegExp("(?:^|;+|\\s+)speedMode=([^;]*?)(?:;|$)"))
        },
    
        /**
         * 删除指定cookie,复写为过期
         * 
         * @param {String} name cookie名称
         * @param {String} domain 所在域
         * @param {String} path 所在路径
         */
        remove : function(name, domain, path) {
            window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
        }
    };

});

Jx().$package(function(J){
    /**
     * localStorage 名字空间
     * @namespace 
     * @name localStorage
     */
    J.localStorage = 
    /**
     * @lends localStorage
     */ 
    {
        
        /**
         * 设置一个localStorage
         * @param {String} name
         * @param {String} value
         */
        setItem : function(name, value) {
            if(this.isSupports()){
                window.localStorage.setItem(name,value);
            }
        },
        /**
         * 根据名字读取值
         * @param {String} name
         * @return {String}
         */
        getItem : function(name) {
            if(this.isSupports()){
                return window.localStorage.getItem(name);
            }
            return null;
        },
        /**
         * 根据名字移除值
         * @param {String} name
         */
        removeItem : function(name) {
            if(this.isSupports()){
                window.localStorage.removeItem(name);
            }
        },
        /**
         * 清空 localStorage
         */
        clear : function(){
            if(this.isSupports()){
                window.localStorage.clear();
            }
        },
        /**
         * 判断是否支持 localStorage
         */
        isSupports : function(){
            return ('localStorage' in window)&&window['localStorage']!== null;
        }
    };

});

/** 
 * @description
 * Package: jet.mini
 *
 * Need package:
 * jet.core.js
 * 
 */
 
Jx().$package(function(J){

    
/**
 * "mini" Selector Engine
 * Copyright (c) 2009 James Padolsey
 * -------------------------------------------------------
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 * -------------------------------------------------------
 * Version: 0.01 (BETA)
 */


var mini = (function(){
    
    var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
        exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
        exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
        exprNodeName = /^([\w\*\-_]+)/,
        na = [null,null];
    
    function _find(selector, context) {
        
        /*
         * This is what you call via x()
         * Starts everything off...
         */
        
        context = context || document;
        
        var simple = /^[\w\-_#]+$/.test(selector);
        
        if (!simple && context.querySelectorAll) {
            return realArray(context.querySelectorAll(selector));
        }
        
        if (selector.indexOf(',') > -1) {
            var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
            for(; sIndex < len; ++sIndex) {
                ret = ret.concat( _find(split[sIndex], context) );
            }
            return unique(ret);
        }
        
        var parts = selector.match(snack),
            part = parts.pop(),
            id = (part.match(exprId) || na)[1],
            className = !id && (part.match(exprClassName) || na)[1],
            nodeName = !id && (part.match(exprNodeName) || na)[1],
            collection;
            
        if (className && !nodeName && context.getElementsByClassName) {
            
            collection = realArray(context.getElementsByClassName(className));
            
        } else {
            
            collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));
            
            if (className) {
                collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
            }
            
            if (id) {
                var byId = context.getElementById(id);
                return byId?[byId]:[];
            }
        }
        
        return parts[0] && collection[0] ? filterParents(parts, collection) : collection;
        
    }
    
    function realArray(c) {
        
        /**
         * Transforms a node collection into
         * a real array
         */
        
        try {
            return Array.prototype.slice.call(c);
        } catch(e) {
            var ret = [], i = 0, len = c.length;
            for (; i < len; ++i) {
                ret[i] = c[i];
            }
            return ret;
        }
        
    }
    
    function filterParents(selectorParts, collection, direct) {
        
        /**
         * This is where the magic happens.
         * Parents are stepped through (upwards) to
         * see if they comply with the selector.
         */
        
        var parentSelector = selectorParts.pop();
        
        if (parentSelector === '>') {
            return filterParents(selectorParts, collection, true);
        }
        
        var ret = [],
            r = -1,
            id = (parentSelector.match(exprId) || na)[1],
            className = !id && (parentSelector.match(exprClassName) || na)[1],
            nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
            cIndex = -1,
            node, parent,
            matches;
            
        nodeName = nodeName && nodeName.toLowerCase();
            
        while ( (node = collection[++cIndex]) ) {
            
            parent = node.parentNode;
            
            do {
                
                matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
                matches = matches && (!id || parent.id === id);
                matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));
                
                if (direct || matches) { break; }
                
            } while ( (parent = parent.parentNode) );
            
            if (matches) {
                ret[++r] = node;
            }
        }
        
        return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;
        
    }
    
    
    var unique = (function(){
        
        var uid = +new Date();
                
        var data = (function(){
         
            var n = 1;
         
            return function(elem) {
         
                var cacheIndex = elem[uid],
                    nextCacheIndex = n++;
         
                if(!cacheIndex) {
                    elem[uid] = nextCacheIndex;
                    return true;
                }
         
                return false;
         
            };
         
        })();
        
        return function(arr) {
        
            /**
             * Returns a unique array
             */
            
            var length = arr.length,
                ret = [],
                r = -1,
                i = 0,
                item;
                
            for (; i < length; ++i) {
                item = arr[i];
                if (data(item)) {
                    ret[++r] = item;
                }
            }
            
            uid += 1;
            
            return ret;
    
        };
    
    })();
    
    function filterByAttr(collection, attr, regex) {
        
        /**
         * Filters a collection by an attribute.
         */
        
        var i = -1, node, r = -1, ret = [];
        
        while ( (node = collection[++i]) ) {
            if (regex.test(node[attr])) {
                ret[++r] = node;
            }
        }
        
        return ret;
    }
    
    return _find;
    
})();




    /*
     * ////////////////////////////////////////////////////////////////
     * 
     * Adapter to JET
     * 
     * ////////////////////////////////////////////////////////////////
     */
    /**
     * 一个据说比jq还快的筛选器，可以满足日常99%的筛选需要
     * @function
     * @memberOf dom
     * @name mini
     * 
     * @param {String} query string 筛选器语法
     * @returns {Element} 返回筛选出的dom元素
     * 
     * @example
     * //创建一个匿名package包：
     * Jx().$package(function(J){
     *  //这时上下文对象this指向全局window对象
     *  var lists = J.dom.mini(".list");
     * };
     * 
     */
    J.dom.mini = mini;



});

/** 
 * JET (Javascript Extend Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * 
 *
 * @version 1.0
 * @author  Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

/** 
 * @description
 * Package: jet.json
 *
 * Need package:
 * jet.core.js
 * 
 */

/**
 * [Javascript core part]: JSON 扩展
 */
 
 
Jx().$package(function(J){
    var JSON = window['JSON'] || {};

    /**
     * @namespace
     * @name json
     */

    
    
    
    
/*
    http://www.JSON.org/json2.js
    2009-08-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

"use strict";

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

/*
if (!this.JSON) {
    this.JSON = {};
}
*/

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }
    // if (typeof Date.prototype.toJSON !== 'function') {
    // if (typeof Date.prototype.toJSON !== 'function' && false) {
        // /** 
         // * @ignore
         // */
        // Date.prototype.toJSON = function (key) {

            // return isFinite(this.valueOf()) ?
                   // this.getUTCFullYear()   + '-' +
                 // f(this.getUTCMonth() + 1) + '-' +
                 // f(this.getUTCDate())      + 'T' +
                 // f(this.getUTCHours())     + ':' +
                 // f(this.getUTCMinutes())   + ':' +
                 // f(this.getUTCSeconds())   + 'Z' : null;
        // };
        // /** 
         // * @ignore
         // */
        // String.prototype.toJSON =
        // /** 
         // * @ignore
         // */
        // Number.prototype.toJSON =
        // /** 
         // * @ignore
         // */
        // Boolean.prototype.toJSON = function (key) {
            // return this.valueOf();
        // };

    // }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        /**
         * 把给定object转换成json字符串
         * 
         * @name stringify
         * @memberOf json
         * @function
         * @param {Object} value
         * @return {String}
         */
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        /**
         * 把给定json字符串转换成对象
         * @function 
         * @name parse
         * @memberOf json
         * @param {String} text
         * @return {Object}
         */
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

    
    J.json = JSON;


});



















