/**    
 * CODETANK 
 * Copyright (c) 2012, Tencent AlloyTeam, All rights reserved.
 * http://CodeTank.AlloyTeam.com/
 *
 * @version		1.0
 * @author		TAT.Kinvix
 *
 *  .d8888b.                888      88888888888               888   TM   
 * d88P  Y88b               888      ''''888''''               888      
 * 888    888               888          888                   888      
 * 888         .d88b.   .d88888  .d88b.  888  8888b.  88888b.  888  888 
 * 888        d88""88b d88" 888 d8P  Y8b 888     "88b 888 "88b 888 .88P 
 * 888    888 888  888 888  888 88888888 888 .d888888 888  888 888888K  
 * Y88b  d88P Y88..88P Y88b 888 Y8b.     888 888  888 888  888 888 "88b 
 *  "Y8888P"   "Y88P"   "Y88888  "Y8888  888 "Y888888 888  888 888  888 
 * 
 */

Jx().$package("site.panelManager",function(J){
    var packageContext = this;

    var panelList = {};

    var masker = null;

    


    /*
     *	codeTank.config = {
     *		title: 'SETTING',
     *		titleText: '系统设置',
			panelId: 'setting',
     *		buttons: [
     *		{
     *			text: '关　闭',
     *		 	cmd: 'closePopupPanel'
     *		}
     *		]
     *	} 
     * 
     */
    var PopupPanel = new J.Class({
    	init: function(option){
    		var el = this.el = J.dom.node('div', {
    			'class': 'popupPanel ' + (option.className || '')
    		});
    		this._masker = 'mask' in option ? option.mask : true;
    		this._onClose = option.onClose || false;
    		var rData = {
    			title: option.title || option.titleText,
    			titleText: option.titleText,
    			panelId: option.panelId,
    			buttons: option.buttons || false,
                footerText: option.footerText || false,
    			html: option.html || ''
    		};
    		
    		if(this._masker && !masker){
    			masker = J.dom.node('div', { 'class': 'maskCover'});
    			document.body.appendChild(masker);
    		}
    		qtool.render(el, 'popupPanelTmpl', rData);
    		document.body.appendChild(el);
    	},
    	show: function(){
    		if(this._masker){
    			J.dom.show(masker);
    		}
    		J.dom.show(this.el);
    	},
    	hide: function(){
    		J.dom.hide(this.el);
    		if(this._masker){
    			J.dom.hide(masker);
    		}
    		this._onClose && this._onClose();
    	}
    });

/*********************************************************************************
//  公有方法
/*********************************************************************************/

    this.createPanel = function(id, config){
    	config.panelId = id;
    	if(config.buttons){
    		var buttons = [];
    		for(var i = 0, btn; btn = config.buttons[i]; i++) {
    		    if(J.isString(btn)){
    		    	btn = {
    		    		text: btn,
    		    		cmd: 'closePopupPanel'
    		    	}
    		    }
    		    if(!btn.cmd){
    		    	btn.cmd = 'closePopupPanel';
    		    }
    		    buttons.push(btn);
    		}
    		config.buttons = buttons;
    	}
    	panelList[id] = new PopupPanel(config);
    	return panelList[id];
    }


    this.showPanel = function(id, config){
    	if(!panelList[id]){
    		this.createPanel(id, config);
    	}
    	panelList[id].show();
    	return panelList[id];
    }

    this.hidePanel = function(id){
    	if(panelList[id]){
    		panelList[id].hide();
    	}
    }

    this.getPanel = function(id){
    	return panelList[id];
    }

    this.init = function(){
    	
    }



});