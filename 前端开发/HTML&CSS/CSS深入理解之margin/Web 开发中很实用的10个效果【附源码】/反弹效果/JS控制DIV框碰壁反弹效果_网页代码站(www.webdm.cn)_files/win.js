(function() {
    window._alert = window.alert;
//    window._confirm = window.confirm;
    window.alertPrototype_timer = [];
    window.alertPrototype = function(msg, autoClose, mask, baseId, callback) {
        if (window.event) { window.event.cancelBubble = true; }
        var msie = /msie/i.test(navigator.appVersion);
        var closeTime = autoClose;
        var hasMask = mask;
        var _baseId = baseId ? 'appstore_' + baseId : 'appstore_alert';
        var _marinTop = 200;
        var _preScrollTop = document.documentElement.scrollTop + 0;
        var getCover = function() {
            if (document.getElementById(_baseId + 'cv')) {
                return document.getElementById(_baseId + 'cv');
            } else {
                var c = document.createElement('div');
                c.id = _baseId + 'cv';
                c.className = 'alertmask';
                c.style.width = Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth) + 'px';
                c.style.height = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight) + 'px';
                c.innerHTML = ''; 
                return c;
            }
        };
        var getPanel = function() {
            if (document.getElementById(_baseId + 'pn')) {
                return document.getElementById(_baseId + 'pn');
            } else {
                var p = document.createElement('div');
                p.id = _baseId + 'pn';
                p.className = 'alertpn';
                var p_inner = document.createElement('div');
                var p_inner_inner = document.createElement('div');
                p_inner.className = 'inner';
                p_inner_inner.className = 'inner_inner';
                p_inner.innerHTML = '<span class="til">网页代码站(webdm.cn)提示您：</span>';
                var a_close = document.createElement('a');
                a_close.className = 'close';
                a_close.innerHTML = 'x';
                a_close.onclick = fnCancel;
                p_inner.appendChild(a_close);
                p_inner.appendChild(p_inner_inner);
                var m = document.createElement('div');
                m.id = _baseId + 'pn_msg';
                m.className = 'alertpn_msg';
                var btnctn = document.createElement('div');
                btnctn.className = 'btnctn';
                var b = document.createElement('a');
                b.innerHTML = '<span>确 定</span>';
                b.href = 'javascript:void(0);';
                b.id = _baseId + 'pn_btn';
                btnctn.appendChild(b);
                p.msg = m;
                p.btn = b;
                p.btn.onclick = fnOk;
                if (_baseId == 'appstore_confirm') {
                    var c = document.createElement('a');
                    c.innerHTML = '<span>取 消</span>';
                    c.href = 'javascript:void(0);';
                    c.id = _baseId + 'pn_cancel';
                    btnctn.appendChild(c);
                    p.cancel = c;
                    p.cancel.onclick = fnCancel;
                }
                p_inner_inner.appendChild(m);
                p_inner_inner.appendChild(btnctn);
                p.appendChild(p_inner);
                return p;
            }
        };
        var _fnClose = function() {
            panel.style.display = 'none';
            if (hasMask) {
                cover.style.display = 'none';
                document.documentElement.style.overflow = '';
                if (msie) { document.body.style.overflow = ''; }
            }
        };
        var fnOk = function() {
            _fnClose();
            if (callback) { callback(true); }
            return true;
        };
        var fnCancel = function() {
            _fnClose();
            if (callback) { callback(false); }
            return false;
        };
        var fnOpenPanel = function() {
            panel.style.top = _preScrollTop + _marinTop + 'px';
            if (document.getElementById(_baseId + 'pn')) {
                panel.style.display = 'block';
            } else {
                document.body.insertBefore(panel, document.body.firstChild);
            }
        };
        var fnOpenMask = function() {
            cover.style.top = _preScrollTop + 'px';
            if (document.getElementById(_baseId + 'pn')) {
                cover.style.display = 'block';
            } else {
                document.body.insertBefore(cover, document.body.firstChild);
            }
            document.documentElement.style.overflow = 'hidden';
            if (msie) { document.body.style.overflow = 'hidden'; }
        };
        if (hasMask) { var cover = getCover(); fnOpenMask(); }
        var panel = getPanel();
        panel.msg.innerHTML = msg;
        if (autoClose > 0) { window.clearTimeout(alertPrototype_timer[0]); alertPrototype_timer[0] = window.setTimeout(fnOk, autoClose * 1000); }
        window.clearTimeout(alertPrototype_timer[1]);
        alertPrototype_timer[1] = window.setTimeout(function() {
            document.documentElement.scrollTop = _preScrollTop;
            fnOpenPanel();
        }, 0);
        return false;
    };
    window.alert = function(msg) { alertPrototype(msg, 0, true, 'alert'); };
    window.msg = function(msg) { alertPrototype(msg, 3, false, 'msg'); };
//    window.confirm = function(msg, callback) { alertPrototype(msg, 0, true, 'confirm', callback); };
})();