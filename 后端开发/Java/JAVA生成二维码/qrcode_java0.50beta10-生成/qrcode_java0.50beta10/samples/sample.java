import com.swetake.util.Qrcode;

/**
 *QRcodeクラスライブラリ用sample
 *
 *第一引数をデータとしたQRcodeを
 *テキストで出力します
 */
class Sample{
public static void main(String[] args){

    Qrcode x=new Qrcode();
    x.setQrcodeErrorCorrect('M');   //エラー訂正レベルM
    x.setQrcodeEncodeMode('B');     //8bit byte モード
    boolean[][] matrix = x.calQrcode(args[0].getBytes());

    for (int i=0;i<matrix.length;i++){
	for (int j=0;j<matrix.length;j++){
	    if (matrix[j][i]) {
		System.out.print("@");
	    } else {
		System.out.print(" ");
	    }
	}
	System.out.print("\n");
    }

}
}
