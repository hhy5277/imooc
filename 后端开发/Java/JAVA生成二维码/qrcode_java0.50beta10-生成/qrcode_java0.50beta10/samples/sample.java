import com.swetake.util.Qrcode;

/**
 *QRcode���饹�饤�֥����sample
 *
 *��������ǡ����Ȥ���QRcode��
 *�ƥ����Ȥǽ��Ϥ��ޤ�
 */
class Sample{
public static void main(String[] args){

    Qrcode x=new Qrcode();
    x.setQrcodeErrorCorrect('M');   //���顼������٥�M
    x.setQrcodeEncodeMode('B');     //8bit byte �⡼��
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
