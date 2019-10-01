;Jx().$package('qtool', function(J){
    var packageContext = this;

    var DELAY_STATUS = {
        NORMAL: 0,
        ID_EXIST: 1,
        ID_NOT_EXIST: 2
    };

    var timerList = {};
    /**
     * @param {String} id @optional
     * @param {Number} time @optional
     * @param {Function} func
     * @param {Function} onClearFunc @optional
     * @example
     * 1. delay('id01', 1000, func)
     * 2. delay(1000, func)
     * 3. delay(func) === delay(0, func)
     */
    this.delay = function(id, time, func, onClearFunc/*TODO 未实现*/){
        var argu = arguments;
        var flag = DELAY_STATUS.NORMAL;
        if(argu.length === 1){
            func = id;
            time = 0;
            id = null;
        }else if(argu.length === 2){
            func = time;
            time = id;
            id = null;
        }
        time = time || 0;
        if(id && time){
            if(id in timerList){
                window.clearTimeout(timerList[id]);
                flag = DELAY_STATUS.ID_EXIST;
            }
            var wrapFunc = function(){
                timerList[id] = 0;
                delete timerList[id];
                func.apply(window, [id]);
            };
            var timer = window.setTimeout(wrapFunc, time);
            timerList[id] = timer;
        }else{
            window.setTimeout(func, time);
        }
        return flag;
    }
    
    this.clearDelay = function(id){
        if(id in timerList){
            window.clearTimeout(timerList[id]);
            timerList[id] = 0;
            delete timerList[id];
            return DELAY_STATUS.NORMAL;
        }
        return DELAY_STATUS.ID_NOT_EXIST;
    }
    
    var intervalerList = {};
    
    /**
     * 定时循环执行传入的func
     */
    this.loop = function(id, time, func){
        var argu = arguments;
        var flag = DELAY_STATUS.NORMAL;
        if(argu.length == 2){
            func = time;
            time = id;
        }
        time = time || 0;
        if(id && time){
            if(id in intervalerList){
                window.clearInterval(intervalerList[id]);
                flag = DELAY_STATUS.ID_EXIST;
            }
            var wrapFunc = function(){
                func.apply(window, [id]);
            };
            var intervaler = window.setInterval(wrapFunc, time);
            intervalerList[id] = intervaler;
        }else{
            setInterval(func, time);
        }
        return flag;
    }
    
    this.clearLoop = function(id){
        if(id in intervalerList){
            window.clearInterval(intervalerList[id]);
            intervalerList[id] = 0;
            delete intervalerList[id];
            return DELAY_STATUS.NORMAL;
        }
        return DELAY_STATUS.ID_NOT_EXIST;
    }
    
    
    
    this.debounce = function(time, func, immediate){
        var lastExecTime;
        return function(){
            if(!lastExecTime || (+new Date - lastExecTime > time)){
                immediate ? func() : setTimeout(func, time);
                lastExecTime = +new Date;
            }
        };
    }
    
    /**
     * shot of getElementById
     */
    this.get = function(id){
        return document.getElementById(id);
    }
    
    var templateList = {};
    
    /**
     * 获取页面的一个 html 模板
     * @param {String} tmplId 模板的 dom id
     * @return {function} 模版方法
     */
    this.getTemplate = function(tmplId){
        var tmpl;
        if(typeof qtemplate !== 'undefined'){
            tmpl = qtemplate.get(tmplId);
        }
        if(!tmpl){
            tmpl = templateList[tmplId];
        }
        if(!tmpl){
            var tmplNode = document.getElementById(tmplId);
            tmpl = tmplNode.innerHTML;//J.string.template(tmplNode.innerHTML);
            tmplNode.parentNode.removeChild(tmplNode);
            templateList[tmplId] = tmpl;
        }
        if(!tmpl){
            throw new Error('no such template. [id="' + tmplId + '"]');
        }
        return tmpl;
    }
    
    /**
     * 获取点击的事件源, 该事件源是有 cmd 属性的 默认从 event.target 往上找三层,找不到就返回null
     * 
     * @param {Event}
     *            event
     * @param {Int}
     *            level 指定寻找的层次
     * @param {String}
     *            property 查找具有特定属性的target,默认为cmd
     * @param {HTMLElement} parent 指定查找结束点, 默认为document.body
     * @return {HTMLElement} | null
     */
    this.getActionTarget = function(event, level, property, parent){
        var t = event.target,
            l = level || 3,
            s = level !== -1,
            p = property || 'cmd',
            end = parent || document.body;
        if(t === end){
            return t.getAttribute(p) ? t : null;
        }
        while(t && (t !== end) && (s ? (l-- > 0) : true)){
            if(t.getAttribute(p)){
                return t;
            }else{
                t = t.parentNode;
            }
        }
        return null;
    }
    /**
     * @example
     * bindCommands(cmds);
     * bindCommands(el, cmds);
     * bindCommands(el, 'click', cmds);
     * 
     * function(param, target, event){
     * }
     */
    this.bindCommands = function(targetElement, eventName, commends, commendName){
        var defaultEvent = 'click';
        if(arguments.length === 1){
            commends = targetElement;
            targetElement = document.body;
            eventName = defaultEvent;
        }else if(arguments.length === 2){
            commends = eventName;
            eventName = defaultEvent;
        }
        if(!targetElement._commends){
            targetElement._commends = {};
        }
        if(targetElement._commends[eventName]){//已经有commends 就合并
            J.extend(targetElement._commends[eventName], commends);
            return;
        }
        targetElement._commends[eventName] = commends;
        commendName = commendName || 'cmd';
        if(!targetElement.getAttribute(commendName)){
            targetElement.setAttribute(commendName, 'void');
        }
        J.event.on(targetElement, eventName, function(e){
            var target = packageContext.getActionTarget(e, -1, commendName, this.parentNode);
            if(target){
                var cmd = target.getAttribute(commendName);
                var param = target.getAttribute('param');
                if(target.href && target.getAttribute('href').indexOf('#') === 0){
                    e.preventDefault();
                }
                if(this._commends[eventName][cmd]){
                    this._commends[eventName][cmd](param, target, e);
                }
            }
        });
    }
    
    /**
     *  @param {Mixed} targetId, target dom or dom id
     *  @param {String} tmplId template dom id
     *  @param {Object} data
     *  @param {Number} position @optional the index to insert, -1 to plus to last
     */
    this.render = function(target, tmplId, data, position){
        data = data || {};
        var tabTmpl = (typeof tmplId === 'function') ? tmplId : this.getTemplate(tmplId);
        var html = '';//tabTmpl(data);
        if(J.isFunction(tabTmpl)){
           html = tabTmpl(data);
        }else{
           html = J.string.template(tabTmpl, data);
        }
        html = J.string.trim(html);
        if(!html){
            return;
        }
        if(typeof target === 'string'){
            target = this.get(target);
        }
        if(position === 'front'){
            position = 0;
        }else if(position === 'tail'){
            position = -1;
        }
        if(!J.isUndefined(position) && target.childElementCount){
            var tempNode = document.createElement('div');
            tempNode.innerHTML = html;
            var nodes = tempNode.childNodes; //include text node
            var fragment = document.createDocumentFragment();
            while(nodes[0]){
                fragment.appendChild(nodes[0]);
            }
            if(position === -1 || position >= target.childElementCount){
                target.appendChild(fragment);
            }else{
                target.insertBefore(fragment, target.children[position]);
            }
            delete tempNode;
        }else{
            target.innerHTML = html;
        }
    }

    
});