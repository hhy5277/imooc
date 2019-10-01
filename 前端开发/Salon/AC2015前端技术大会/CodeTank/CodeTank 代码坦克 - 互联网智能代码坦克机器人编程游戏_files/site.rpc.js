Jx().$package("site",function(J){
    var packageContext = this;

    var CGI_ROOT = 'http://codetank.server.alloyteam.com';
    var ACCOUNT_ROOT = 'http://account.alloyteam.com';

    // ACCOUNT_ROOT = 'http://localhost:4000';

    var CGI_ROOT_LIST = [
        'http://codetank.server.alloyteam.com'
    ];
    var query = J.string.mapQuery();
    if(query.debug == 'server'){
        CGI_ROOT = 'http://localhost:4000';

        CGI_ROOT_LIST = [
            'http://localhost:4000'
        ];
    }
    
	
    var CGI_MAP = {
        '/account/signin': {
            url: ACCOUNT_ROOT + '/api/login',
            method: 'POST',//default GET
            param: {}//default param
        },
        '/account/signup': {
            url: ACCOUNT_ROOT + '/api/signup',
            method: 'POST'
        },
        '/account/isLogin': {
            url: ACCOUNT_ROOT + '/api/isLogin'
        },
        '/account/logoff': {
            url: ACCOUNT_ROOT + '/api/logoff'
        },
        '/api/ranking/top': {
            
        },
        '/api/ranking/student': {
            
        },
		'/api/ranking/team': {
            
        },
		//tank相关
		'/api/tanks/get': {
            method: 'GET',
            param : {} //tid : true
        },
        '/api/tanks/find': {
            method: 'GET',
			param : {} //tid : true
        },
		'/api/tanks/list': {
            method: 'GET'
        },
		'/api/tanks/create': {
            method: 'POST',
			param : {} //tid, uid, name , code : all in true
        },
		'/api/tanks/delete': {
            method: 'POST', 
			param : {} //tid : true
        },
		'/api/tanks/save': {
            method: 'POST',
			param : {} //tid:true, name:false , code:false
        },
		'/api/tanks/network': {
            method: 'GET',
			param : {}  
        },
		'/api/tanks/all': {
            method: 'GET',
			param : {}  
        },
        '/api/score/student':{
            method: 'POST',
            param : {} //list:true
        },
		'/api/score/create': {
            method: 'POST',
			param : {} //list:true
        },
		'/api/score/teamcreate': {
            method: 'POST',
			param : {} //list:true
        },
		'/api/fav/list': {
            method: 'GET',
			param : {}  
        },
		'/api/fav/create': {
            method: 'POST',
			param : {} //list:true
        },
		'/api/fav/delete': {
            method: 'POST',
			param : {} //list:true
        },
		 '/api/team/find': {
            method: 'GET',
			param : {} //tid : true
        }, 
		 '/api/team/list': {
            method: 'GET',
			param : {} //tid : true
        }, 
		'/api/team/create': {
            method: 'POST',
			param : {} //tid, uid, name , code : all in true
        },
		'/api/team/delete': {
            method: 'POST', 
			param : {} //tid : true
        },
		'/api/team/save': {
            method: 'POST',
			param : {} //tid:true, name:false , code:false
        },
		 '/api/team/get': {
            method: 'GET',
			param : {} // 
        }, 
		'/api/favteam/list': {
            method: 'GET',
			param : {}  
        },
		'/api/favteam/create': {
            method: 'POST',
			param : {} //list:true
        },
		'/api/favteam/delete': {
            method: 'POST',
			param : {} //list:true
        }
    };
	
    var apiWindow = null,
        hasCreate = false,
        waitingQueue = [],
        requestQueue = {},
        requestIncreaseId = 1;

    var cgiRoot = CGI_ROOT;
    
    // var cgiRoot = (function(){
    //     var index = Number(localStorage.cgiIndex);
    //     if(isNaN(index)){
    //         index = Math.ceil(Math.random() * 10) % CGI_ROOT_LIST.length;
    //     }
    //     localStorage.cgiIndex = index;
    //     site.report('server.use.' + index);
    //     return CGI_ROOT_LIST[index] || CGI_ROOT;
    // })();

    // var createApiFrame = function(){
    //     if(hasCreate){
    //         return;
    //     }
    //     hasCreate = true;
    //     var apiFrame = document.createElement('iframe');
    //     apiFrame.id = 'apiFrame';
    //     apiFrame.name = 'apiFrame';
    //     apiFrame.style.cssText = 'position: absolute;left: -9999px;top: -9999px;width: 1px;height: 1px;overflow: hidden;';
    //     apiFrame.src = cgiRoot + '/api.html';
    //     $E.on(apiFrame, 'load', function(){
    //         apiFrame.loaded = true;
    //         clearTimeout(apiFrameTimer);
    //         apiWindow = apiFrame.contentWindow;
    //         var oURL = CGI_ROOT_LIST[localStorage.cgiIndex] || '';
    //         for(var i = 0, item; item = waitingQueue[i]; i++) {
    //             if(oURL){
    //                 item.requestUrl = item.requestUrl.replace(oURL, cgiRoot);
    //             }
    //             apiWindow.postMessage(JSON.stringify(item), cgiRoot);
    //         };
    //         waitingQueue = [];
    //     });
    //     var apiFrameTimer = setTimeout(function(){
    //         if(!apiFrame.loaded){
    //             site.util.Alert.warning('oh no~ 似乎server挂了, 现在切换到后备server');
    //             document.body.removeChild(apiFrame);
    //             hasCreate = false;
    //             //use back server
    //             cgiRoot = CGI_ROOT;
    //             createApiFrame();
    //             site.report('server.down.' + localStorage.cgiIndex);
    //             site.report('server.usebackup');
    //         }
    //     }, 25000);
    //     document.body.appendChild(apiFrame);
    // }

    // this.CORSAjax = function(url, options){
    //     options.requestUrl = url;
    //     options.requestId = requestIncreaseId++;
    //     requestQueue[options.requestId] = options;
    //     // 因为用代理来发请求, 需要这里做超时逻辑
    //     // options.timer = setTimeout(function(){
    //     //     var o={};
    //     //     o.uri=url;
    //     //     o.arguments=options.arguments;
    //     //     // alert('timeout: '+url);
    //     //     options.onTimeout(o);
    //     // }, options.timeout);
    //     if(apiWindow){
    //         apiWindow.postMessage(JSON.stringify(options), cgiRoot);
    //     }else{
    //         waitingQueue.push(options);
    //         createApiFrame();
    //     }
    // }

    // $E.on(window, 'message', function(e){
    //     if(J.browser.ie){
    //         e = e._event;
    //     }
    //     if(e.origin !== cgiRoot){
    //         return;
    //     }
    //     var response = JSON.parse(e.data);
    //     var requestObj = requestQueue[response.requestId];
    //     clearTimeout(requestObj.timer);
    //     if(requestObj[response.responseCb]){
    //         requestObj[response.responseCb].call(requestObj.context || window, response);
    //     }


    // }, false);

    this.require = function(url, options){
        
        if(options.method === 'GET' && options.data){
            options.contentType || (options.contentType = 'application/json');
            var time = +new Date;
            url += url.indexOf('?') > -1 ? ('&' + time) : ('?' + time);
            var param = J.string.toQueryString(options.data);
            param && (url += '&' + param);
        }else{
            options.contentType || (options.contentType = 'application/x-www-form-urlencoded');
            options.arguments = options.data;
            options.data = J.string.toQueryString(options.data);
        }
        J.http.ajax(url, options);
        // this.CORSAjax(url, options);
    }
	
	/*
	 * api调用入口，用arguments模拟多态
	 * rpc(cmd)
	 * rpc(cmd, callback)
	 * rpc(cmd, callback, context)
	 * rpc(cmd, param, callback)
	 * rpc(cmd, param, callback, context)
	 */
    this.rpc = function(cmd, param, callback, context,errorCallback){		
		if (arguments.length == 0){
			return false;	
		}
		var cmd = arguments[0];			
        var apiObj = CGI_MAP[cmd],
            param, callback, context, param2;
		
		if (typeof arguments[1] == 'function'){
			callback = arguments[1];	
		}else if( typeof arguments[1] != 'undefined'){
			param = arguments[1];	
			callback = arguments[2];
		}
		if (arguments.length > 2 && typeof arguments[arguments.length - 1] != 'function'){
			context = arguments[arguments.length - 1];
		}
		
        if(!apiObj){
            throw new Error('no such cmd: ' + cmd);
        }
        if(apiObj.param){
            param = J.extend({}, apiObj.param, param);
        }
        if(!param){
            param = {};
        }
	
	
		var isaccount;
		isaccount = site.account ||(parent.site && parent.site.account);
		if(isaccount){
			var currentUser = isaccount.getCurrentUser();
			if(currentUser){
				param.cuid = currentUser.uid;
				param.accessToken = currentUser.accessToken;
			}
		}
		
		// if(apiObj.urlParam){
		//     cmd += '/' + param[apiObj.urlParam];
		//     delete param[apiObj.urlParam];
		// }
		context = context || window;
		var url = apiObj.url ? apiObj.url : (cgiRoot + cmd);
		this.require(url, {
			method: apiObj.method || 'GET',
			withCredentials: true,
			data: param,
			onSuccess: function(response){
				var data = JSON.parse(response.responseText);
				if (callback){
					callback.call(context, data, param);
				}
			},
            onError:function(){
                if (errorCallback) {
                    // 保证传回 errorCallback，否则报错
                    errorCallback();
                }
            },
			timeout: 30000,
			onTimeout: function(response){
				var data = { success: false, code: 100 };
				if (callback){
					callback.call(context, data, param);
				}
			}
		});
	}

	/**
	 * 调用跨域的 api
	 * @param  {[type]} api   [description]
	 * @param  {[type]} param [description]
	 * @return {[type]}       [description]
	 */
	this.api = function(options){
		options.apiCall = true;
		if(apiWindow){
			apiWindow.postMessage(JSON.stringify(options), cgiRoot);
		}else{
			waitingQueue.push(options);
			createApiFrame();
		}
	}

});
