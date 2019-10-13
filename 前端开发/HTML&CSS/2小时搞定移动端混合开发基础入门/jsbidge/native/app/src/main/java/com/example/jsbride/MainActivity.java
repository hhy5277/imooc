package com.example.jsbride;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.EditText;

import java.util.Date;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private  Button showBtn;
    private EditText editText;
    private Button refreshBtn;
    private MainActivity self = this;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        editText = findViewById(R.id.editText);
        showBtn = findViewById(R.id.showBtn);
        refreshBtn = findViewById(R.id.refreshBtn);

        WebView.setWebContentsDebuggingEnabled(true);
        webView.loadUrl("http://192.168.1.2:8080/?timestamp=" + new Date().getTime());
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient(){
            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                if(message.startsWith("jsbridge://")) {
                    return super.onJsAlert(view, url, message, result);
                }

                String text = message.substring(message.indexOf("=")+1);
                self.showNativeDialog(text);

                result.confirm();
                return  true;
            }
        });

        showBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String inputValue = editText.getText().toString();
                self.showWebDialog(inputValue);
            }
        });

        refreshBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                webView.loadUrl("http://192.168.1.2:8080/?timestamp=" + new Date().getTime());
            }
        });
    }

    private void showWebDialog(String text){
        String jsCode = String.format("window.showWebDialog('%s')",text);
        webView.evaluateJavascript(jsCode,null);
    }

    private  void showNativeDialog(String text){
        new AlertDialog.Builder(this).setMessage(text).create().show();
    }
}
