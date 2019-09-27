function Print(_pic, _url) {
    document.write('<a href="' + _url + '" target=\"_blank\"><img src="' + _pic + '"></a>');
}
function PrintDIY(_cont) {
    document.write(_cont);
}
function PicAd(_ad) {
    switch (_ad) {
        //case "15data":
            //{srart:2013-10-22}{end:2013-11-22}
	    //Print("/themes/ad/15data.gif", "http://www.15data.com/?webdm");
            //break;
	case "wp":
            //{srart:2013-12-11}{end:2014-1-11}{$:260}qq:1272664933
	    Print("/themes/ad/wp_960x60.gif", "http://js.50bang.org/?formType=6127");
            break;
	case "webdm":
            //{srart:2010-05-20}{end:2010-06-20}
            //Print("/themes/ad/chuzu.gif", "http://www.webdm.cn");
	    Print("/themes/ad/anquan.jpg", "http://www.webdm.cn");
            break;
        case "duodi":
            //{srart:2010-05-20}{end:2010-06-20}
            Print("/themes/ad/duodi.png", "http://2013.dodi.cn/");
            break;
    }
}
function WritePicAd() {  
    //document.writeln("<div class=\"ipad-p\"><script type=\"text/javascript\">PicAd('wp');</script></div>");   
    //document.writeln("<div class=\"ipad-p\"><script type=\"text/javascript\">PicAd('webdm');</script></div>");    
}


