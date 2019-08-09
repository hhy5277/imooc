const { app, BrowserWindow,Menu } = require('electron')
app.on('ready', function(){
	Menu.setApplicationMenu(null)
	// 创建浏览器窗口
	let win = new BrowserWindow({
	  width: 800,
	  height: 700,
	  frame:false,
	  resizable:false
	})
	
	// 加载index.html文件
	win.loadFile('index.html')
})