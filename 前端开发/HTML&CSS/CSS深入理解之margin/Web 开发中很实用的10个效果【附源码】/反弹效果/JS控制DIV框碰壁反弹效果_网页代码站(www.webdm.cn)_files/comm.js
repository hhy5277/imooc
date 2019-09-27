//runCode
function runDm(obj) {
    var win = window.open();
    win.document.open();
    win.document.write(obj.value);
    win.document.close();
}

//saveCode
function saveDm(obj) {
    var win = window.open('', '', 'top=10000,left=10000');
    win.document.write(obj.value)
    win.document.execCommand('SaveAs', '', '网页代码站代码下载.htm')
    win.close();
}


//copyCode
function copyDm(obj) {
    obj.select();
    js = obj.createTextRange();
    js.execCommand("Copy");
    alert('代码已经被成功复制！');
    //ymPrompt.succeedInfo({ title: '网页代码站', message: '恭喜您！代码已经被成功复制！' });
}


//addmark
function addMark() {
    if (document.all) {
        window.external.addFavorite('http://www.webdm.cn/', '网页代码站(WebDm)_最专业的网页代码下载网站,致力为中国站长提供有质量的网页代码！');
    }
    else if (window.sidebar) {
        window.sidebar.addPanel('网页代码站(WebDm)_最专业的网页代码下载网站,致力为中国站长提供有质量的网页代码！', 'http://www.webdm.cn/', "");
    }
}

//sethome
function setHome() {
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage('http://www.webdm.cn/');

    }
    else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            }
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        prefs.setCharPref('browser.startup.homepage', 'http://www.webdm.cn/');
    }
}

//SELECT SEARCH TYPE
function setSearchType(type) {
    if (type == 'title') {
        document.getElementById("webdm-search-type").value = "按标题搜索";
    }
    else if (type == 'content') {
        document.getElementById("webdm-search-type").value = "按内容搜索";
    }
    document.getElementById("headSel").style.display = 'none';
    document.getElementById("webdm-search-cont").value = '';
    document.getElementById("webdm-search-cont").focus();
}

function ltrim(s) { return s.replace(/^(\s*|　*)/, ""); }
function rtrim(s) { return s.replace(/(\s*|　*)$/, ""); }
function trim(s) { return ltrim(rtrim(s)); }

//doSearch
function doSearch() {
    var key = document.getElementById("searchinput").value; 
    if (key.replace(/[\/_]/g, ' ') == '' || key == '想找什么代码？输入关键词试试...') {
        alert('请您输入要搜索的关键字！');
        document.getElementById("searchinput").value = '';
        document.getElementById("searchinput").focus();
        return false;
    }
    else {
        window.open("/search.html?key=" + escape(key));
    }
}
//keySearch
function keySearch(_key){
    window.open("/search.html?key=" + escape(_key));
}

//defaulr-tab
function setTab(m, n) {
    var menu = document.getElementById("tab" + m).getElementsByTagName("li");
    var div = document.getElementById("tablist" + m).getElementsByTagName("div");   
    var showdiv = [];
    for (i = 0; j = div[i]; i++) {
        if ((" " + div[i].className + " ").indexOf(" tablist ") != -1) {
            showdiv.push(div[i]);
        }
    }
    for (i = 0; i < menu.length; i++) {
        menu[i].className = i == n ? "hover" : "";
        showdiv[i].style.display = i == n ? "block" : "none";
    }
}
function setTabb(m, n) {
    var menu = document.getElementById("tab" + m).getElementsByTagName("li");
    var div = document.getElementById("tablistt" + m).getElementsByTagName("div");
    var showdiv = [];
    for (i = 0; j = div[i]; i++) {
        if ((" " + div[i].className + " ").indexOf(" tablistt ") != -1) {
            showdiv.push(div[i]);
        }
    }
    for (i = 0; i < menu.length; i++) {
        menu[i].className = i == n ? "hover" : "";
        showdiv[i].style.display = i == n ? "block" : "none";
    }
}

function killErrors() {
    return true;
}
window.onerror = killErrors;


//old
function oldUrl() {
    document.write("<a href=\"/info/i_2.html\" target=\"_blank\">信息资讯</a>");
}
//t_Banner
function t_Banner() {
    document.write("<iframe src=\"/themes/ad/yun_236_60.htm\" class=\"adCss\" marginheight=\"0\" marginwidth=\"0\" frameborder=\"0\" scrolling=\"no\" style=\"width:236px;height:60px;\"></iframe>");
}

