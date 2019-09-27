//AddDigg
function AddDigg(id) {
    var _ajax = new WLJS.AJAX("/ajax/digg.ashx?t=add&id=" + id, huiDiao);
    _ajax.PostMethod();
}
function huiDiao(result) {
    if (result == "0") { alert('网页代码站提示：操作失败！'); }
    else {
        WLJS.$("diggBtn").innerHTML = "谢谢支持！";
        WLJS.$("diggNum").innerHTML = result;
    }
}
//AddInfoDigg
function AddInfoDigg(id) {
    var _ajax = new WLJS.AJAX("/ajax/infodigg.ashx?t=add&id=" + id, InfohuiDiao);
    _ajax.PostMethod();
}
function InfohuiDiao(result) {
    if (result == "0") { alert('网页代码站提示：操作失败！'); }
    else {
        WLJS.$("diggBtn").innerHTML = "谢谢！";
        WLJS.$("diggNum").innerHTML = result;
    }
}

//URL
function selword(obj) {
    if (obj.checked) {                     //如果当前项被选中了
        WLJS.$("ck_pic").checked = false   //则不能选择第二组
        WLJS.$("t_pic").style.display = 'none';
        WLJS.$("t_name").style.display = '';
    }
}
function selpic(obj) {
    if (obj.checked) {                     //如果当前项被选中了
        WLJS.$("ck_word").checked = false  //则不能选择第一组
        WLJS.$("t_name").style.display = 'none';
        WLJS.$("t_pic").style.display = '';
    }
}
function addUrl() {
    var _name = WLJS.$("url_name").value;
    var _pic = WLJS.$("url_pic").value;
    var _url = WLJS.$("url_url").value;
    var _qq = WLJS.$("url_qq").value;
    var _pr = WLJS.$("url_pr").value;
    var _jj = WLJS.$("url_jianjie").value;
    var _type;
    if (WLJS.$("ck_word").checked) {
        _type = 0;        
    }
    else if(WLJS.$("ck_pic").checked){
        _type = 1;        
    }
    if (_type == "0") {
        if (_name == "") {
            alert("提示：请输入贵站名称！");
            WLJS.$("url_name").focus();
            return false;
        }
        else {_name = "word"; }
    }
    else if(_type == "1"){ 
        if (_pic == "http://" || _pic == "") {
            alert("提示：请输入贵站LOGO地址！");
            WLJS.$("url_pic").focus();
            return false;     
        }
    }
    else{
        alert("提示：必须选择一项！");        
        return false;    
    }
    if (_url == "http://" || _url == "") {
        alert("提示：请输入贵站链接！");
        WLJS.$("url_url").focus();
        return false;
    }
    if (_qq == "") {
        alert("提示：请输入您的QQ，为了方便我联系您！");
        WLJS.$("url_qq").focus();
        return false;
    }
    if (_pr == "") {
        alert("提示：请输入贵站PR，目前小于4的暂不链接！");
        WLJS.$("url_pr").focus();
        return false;
    }
    if (_jj == "") {
        alert("提示：您得告诉我贵站是干什么的！");
        WLJS.$("url_jianjie").focus();
        return false;
    }
    else {
        var _sendUrl = "/ajax/url.ashx?type=" + escape(_type) + "&pic=" + escape(_pic) + "&name=" + escape(_name) + "&url=" + escape(_url) + "&qq=" + escape(_qq) + "&jj=" + escape(_jj) + "&pr=" + escape(_pr);
        var _ajax = new WLJS.AJAX(_sendUrl, Return);
        _ajax.PostMethod();        
    }
}
function Return(result) {
    if (result == "0") { alert('提示：操作失败！'); }
    else {
        alert('提示：操作已成功，等待站长的审核！');
        WLJS.$("url_name").value = '';
        WLJS.$("url_pic").value = '';
        WLJS.$("url_url").value = '';
        WLJS.$("url_qq").value = '';
        WLJS.$("url_pr").value = '';
        WLJS.$("url_jianjie").value = '';
    }
}

//addMsg
function addMsg() {
    var _name = WLJS.$("msg_name").value;
    var _cont = WLJS.$("msg_cont").value;
    var _yz = WLJS.$("msg_yz").value;

    if (_name == "") {
        alert("提示：请输入您的昵称！");
        WLJS.$("msg_name").focus();
        return false;
    }
    else if (_cont == "") {
        alert("提示：请输入内容！");
        WLJS.$("msg_cont").focus();
        return false;
    }
    else if (_yz == "") {
        alert("提示：请输入验证码！");
        WLJS.$("msg_yz").focus();
        return false;
    }
    else {
        var _sendUrl = "/ajax/msg.ashx?name=" + escape(_name) + "&cont=" + escape(_cont) + "&yz=" + escape(_yz);
        var _ajax = new WLJS.AJAX(_sendUrl, ReturnMsg);
        _ajax.PostMethod(); 
    }
}
function ReturnMsg(result) {
    if (result == "0") { alert('提示：操作失败！'); }
    else if (result == "2") { alert('提示：您输入的验证码不正确！'); }
    else {
        alert('提示：留言成功！感谢您对本站的支持！');
        WLJS.$("msg_name").value = '';
        WLJS.$("msg_cont").value = '';
        WLJS.$("msg_yz").value = '';
        location.href = '/message/';
    }
}