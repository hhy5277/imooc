var aid = parent.document.getElementById("articleid").value;
function onsub(id) {
if ($.cookie('mood_' + aid)=='1'){
alert('^v^我们体谅您复杂的心情，但只能表达一次。\n^o^去看看别的内容吧。');
}else {
$.ajax({type: 'get',url: '/ajaxservice.asp',data:'at=mood&id=' + aid + '&sid=' + id,success: function(data, textStatus) {location.href='mood.asp?id=' + aid;}});
}
}