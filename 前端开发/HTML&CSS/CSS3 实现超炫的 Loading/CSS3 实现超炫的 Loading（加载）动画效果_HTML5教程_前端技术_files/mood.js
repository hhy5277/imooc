var aid = parent.document.getElementById("articleid").value;
function onsub(id) {
if ($.cookie('mood_' + aid)=='1'){
alert('^v^�������������ӵ����飬��ֻ�ܱ��һ�Ρ�\n^o^ȥ����������ݰɡ�');
}else {
$.ajax({type: 'get',url: '/ajaxservice.asp',data:'at=mood&id=' + aid + '&sid=' + id,success: function(data, textStatus) {location.href='mood.asp?id=' + aid;}});
}
}