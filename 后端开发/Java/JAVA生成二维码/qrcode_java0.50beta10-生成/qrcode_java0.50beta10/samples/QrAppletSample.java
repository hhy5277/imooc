import java.applet.*;
import java.awt.*;
import java.awt.event.*;
import com.swetake.util.Qrcode;

public class QrAppletSample extends Applet {

    private Button buttonEncode;
    private TextField qrData;


    public void init(){
        buttonEncode = new Button("encode");
        qrData = new TextField("01234567");

        qrData.setBounds(0,150,180,20);
        buttonEncode.setBounds(0,180,60,20);

        EventHandler eh = new EventHandler();
        buttonEncode.addActionListener(eh);

        this.setLayout(null);
        this.add(buttonEncode);
        this.add(qrData);
    }

    public void start(){
        setBackground(java.awt.Color.white);

    }

    public void paint(Graphics gs){
	Qrcode x=new Qrcode();
	x.setQrcodeErrorCorrect('M');
	x.setQrcodeEncodeMode('B');
	x.setQrcodeVersion(7);
	byte[] d =qrData.getText().getBytes();
	if (d.length>0 && d.length <120){
	    boolean[][] s = x.calQrcode(d);

	    for (int i=0;i<s.length;i++){
		for (int j=0;j<s.length;j++){
		    if (s[j][i]) {
			gs.fillRect(j*3,i*3,3,3);
		    }
		}
	    }
	}


    }

    class EventHandler implements ActionListener {
	public void actionPerformed(ActionEvent e) {
            repaint();
        }
    }
}
