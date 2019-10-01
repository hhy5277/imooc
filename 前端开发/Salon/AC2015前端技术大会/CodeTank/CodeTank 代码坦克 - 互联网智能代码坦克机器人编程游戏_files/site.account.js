/**
 * 登录面板
 * @author azrael
 */
Jx().$package("site.account",function(J){
    var packageContext = this;
    var $E = J.event;
    var $D = J.dom;

    var currentUser;

    var accountContainer,

        loginPanel,
        loginButton,
        loginUidField,
        loginPwdField,

        signupPanel,
        signupButton,
        signupUidField,
        signupPwdField,
        signupConfirmPwdField,
        signupEmailField;

    var lockLoginPanel = false;
    var lockSingupPanel = false;

    var uidReg = /^[a-z][\w\d]{2,}$/i;
    var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

    var loginPanelCommends = {
        'closePopupPanel': function(param, target, event){
            event.stopPropagation();
            if(lockLoginPanel){
                return;
            }
            hideLoginPanel();
        },
        'login': function(param, target, event){
            event.preventDefault();
            if(lockLoginPanel){
                return;
            }
            var uid = loginUidField.value;
            var pwd = loginPwdField.value;
            var loginUidTips = loginUidField.nextSibling;
            var loginPwdTips = loginPwdField.nextSibling;
            if(uid.length < 3){
                loginUidTips.innerHTML = '用户名长度最少 3 位';
                $D.addClass(loginUidTips, 'tips-show');
                loginUidField.focus();
                loginUidTips.isError = true;
                return;
            }
            if(!uidReg.test(uid)){
                loginUidTips.innerHTML = '用户名必须以字母开头';
                $D.addClass(loginUidTips, 'tips-show');
                loginUidField.focus();
                loginUidTips.isError = true;
                return;
            }
            if(pwd.length < 6){
                loginPwdTips.innerHTML = '密码长度最少 6 位'
                $D.addClass(loginPwdTips, 'tips-show');
                loginPwdField.focus();
                loginPwdTips.isError = true;
                return;
            }

            lockLoginPanel = true;
            packageContext.login(uid, pwd);
        }
    };

    var inputCommends = {
        'validate': function(param, target, event){
            var tips = target.nextSibling;
            if(tips && tips.isError){
                tips.isError = false;
                $D.removeClass(tips, 'tips-show');
            }
        }
    };

    var accountContainerCommends = {
        'login': function(param, target, event){
            showLoginPanel();
        },
        'signup': function(param, target, event){
            //showSignupPanel();
            gotoSignUpPage();
        },
        'logout': function(param, target, event){
            event.preventDefault();
            if(confirm('确定要退出吗?')){
                //J.cookie.remove('ct.uid');
                //J.cookie.remove('ct.token');
                if(currentUser){
                    /*site.rpc('/account/logoff', {uid: currentUser.uid, accessToken: currentUser.accessToken});*/
                    $.ajax({
						url : 'http://account.alloyteam.com/api/logout',
						xhrFields: {
					      withCredentials: true
					   }
					})
					.always(function(){
						setTimeout(function(){
		                    location.reload();
		                }, 200);
					});
                }
            }
        }
    };

    var signupPanelCommends = {
        'closePopupPanel': function(param, target, event){
            event.stopPropagation();
            if(!lockSingupPanel){
                hideSignupPanel();
            }
        },
        'signup': function(param, target, event){
            event.preventDefault();
            if(lockSingupPanel){
                return;
            }
            var uid = signupUidField.value,
                pwd = signupPwdField.value,
                pwd2 = signupConfirmPwdField.value,
                email = signupEmailField.value,

                uidTips = signupUidField.nextSibling,
                pwdTips = signupPwdField.nextSibling,
                pwd2Tips = signupConfirmPwdField.nextSibling,
                emailTips = signupEmailField.nextSibling;


            if(uid.length < 3){
                uidTips.innerHTML = '用户名长度最少 3 位';
                $D.addClass(uidTips, 'tips-show');
                signupUidField.focus();
                uidTips.isError = true;
                return;
            }
            if(!uidReg.test(uid)){
                uidTips.innerHTML = '用户名必须以字母开头';
                $D.addClass(uidTips, 'tips-show');
                signupUidField.focus();
                uidTips.isError = true;
                return;
            }/*else{
                $D.removeClass(uidTips, 'tips-show');
                uidTips.isError = false;
            }*/
            if(pwd.length < 6){
                pwdTips.innerHTML = '密码长度最少 6 位'
                $D.addClass(pwdTips, 'tips-show');
                signupPwdField.focus();
                pwdTips.isError = true;
                return;
            }/*else{
                $D.removeClass(pwdTips, 'tips-show');
                pwdTips.isError = false;
            }*/
            if(pwd2.length < 6){
                pwd2Tips.innerHTML = '密码长度最少 6 位'
                $D.addClass(pwd2Tips, 'tips-show');
                signupConfirmPwdField.focus();
                pwd2Tips.isError = true;
                return;
            }
            if(pwd2 !== pwd){
                pwd2Tips.innerHTML = '两次输入的密码不一致'
                $D.addClass(pwd2Tips, 'tips-show');
                signupConfirmPwdField.focus();
                pwd2Tips.isError = true;
                return;
            }/*else{
                $D.removeClass(pwd2Tips, 'tips-show');
                pwd2Tips.isError = false;
            }*/
            if(!email){
                emailTips.innerHTML = '请输入邮箱';
                $D.addClass(emailTips, 'tips-show');
                signupEmailField.focus();
                emailTips.isError = true;
                return;
            }
            if(!emailReg.test(email)){
                emailTips.innerHTML = '邮箱格式不正确';
                $D.addClass(emailTips, 'tips-show');
                signupEmailField.focus();
                emailTips.isError = true;
                return;
            }/*else{
                $D.removeClass(emailTips, 'tips-show');
                emailTips.isError = false;
            }*/

            packageContext.signup(uid, pwd, email);
        }
    };

    var clearSignupFileds = function(){
        signupUidField.value = '';
        signupPwdField.value = '';
        signupConfirmPwdField.value = '';
        signupEmailField.value = '';
    }
    var timeoutId = 0;
    var checkQqLogin = function(){
        if( localStorage.getItem('codeTankQqLogin') == 'success' ){
            localStorage.removeItem('codeTankQqLogin');
            loginPanel.style.display = 'none';
            loginSuccess();
        }
        timeoutId = setTimeout(checkQqLogin,500);
    }

    var showLoginPanel = this.showLoginPanel = function(){

        /*if(!loginPanel){
            loginPanel = site.panelManager.showPanel('loginPanel', {
                className: 'accountPanel loginPanel',
                title: '登录',
                titleText: 'Sign in',
                html: qtool.getTemplate('loginPanel')
            });

            loginUidField = $D.id('loginUid');
            loginPwdField = $D.id('loginPwd');

            qtool.bindCommands(loginPanel.el, 'keydown', inputCommends);
            qtool.bindCommands(loginPanel.el, 'click', loginPanelCommends);
        }
        site.panelManager.showPanel('loginPanel');
        loginUidField.focus();*/
        if( !loginPanel ){
        	var iframe = document.createElement('iframe');
        	loginPanel = iframe;
	        loginPanel.style.top  = '50%';
	        loginPanel.style.left  = '50%';
	        loginPanel.style.zIndex  = 10000;
	        loginPanel.style.width  = '265px';
	        loginPanel.style.height  = '347px';
	        loginPanel.style.position  = 'fixed';
	        loginPanel.style.borderStyle = 'none';
	        loginPanel.style.borderRadius = '5px';
	        loginPanel.style.margin  = '-260px 0 0 -136px';
	        document.body.appendChild(loginPanel);
	        window.addEventListener('message',function(e){
	        	if( e.data.data == 'success' ){
	        		loginSuccess();
                }
                else if( e.data == 'close' ){
                    loginPanel.style.display = 'none';
                }
	        });
            timeoutId = setTimeout(checkQqLogin,500);
        }
        loginPanel.src = 'http://account.alloyteam.com/page/ptlogin?from=codetank&redirect=' + encodeURIComponent('http://codetank.alloyteam.com/loginProxy.html');
        loginPanel.style.display = 'block';
    }

    var hideLoginPanel = function(){
        site.panelManager.hidePanel('loginPanel');
    }

    /*var showSignupPanel = function(){
        if(!signupPanel){
            signupPanel = site.panelManager.showPanel('signupPanel', {
                className: 'accountPanel signupPanel',
                title: '注册',
                titleText: 'Sign up',
                html: qtool.getTemplate('signupPanel')
            });

            signupUidField = $D.id('signupUid');
            signupPwdField = $D.id('signupPwd');
            signupConfirmPwdField = $D.id('signupConfirmPwd');
            signupEmailField = $D.id('signupEmail');

            qtool.bindCommands(signupPanel.el, 'keydown', inputCommends);
            qtool.bindCommands(signupPanel.el, 'click', signupPanelCommends);
        }
        site.panelManager.showPanel('signupPanel');
        signupUidField.focus();
    }*/
    var gotoSignUpPage = function(){
        location.href = 'http://account.alloyteam.com/page/register?from=codetank&redirect=' +  encodeURIComponent(location.href);
    }

    var hideSignupPanel = function(){
        site.panelManager.hidePanel('signupPanel');
    }
    var getUserInfo = function(){
    	//获取用户详细信息
		$.ajax({
			url : 'http://account.alloyteam.com/api/public/user/info',
			xhrFields: {
		      withCredentials: true
		   }
		})
		.done(function(data){
			if(data.success && (data.status == 0) ){
                currentUser = {uid: data.user.uid, accessToken: ''};
                accountContainer.innerHTML = '<div class="accountInfo"><span>' + currentUser.uid 
            	+ ', 你好！</span><div class="right btn btn-info siteButton" cmd="logout">注销</div></div>';
                $D.show(accountContainer);
        		$E.notifyObservers(packageContext, 'loginSuccess', currentUser);
            }else{
            	//登录态过期什么的
            	$E.notifyObservers(packageContext, 'guestReady');
            }
		})
		.fail(function(){
			$E.notifyObservers(packageContext, 'guestReady');
		});
    }

    var loginSuccess = function(){
        clearTimeout( timeoutId );
    	getUserInfo();
        //J.cookie.set('ct.uid', currentUser.uid, window.location.host, '/', 24 * 7);
        //J.cookie.set('ct.token', currentUser.accessToken, window.location.host, '/', 24 * 7);
        
        /*accountContainer.innerHTML = '<div class="accountInfo"><span>' + currentUser.uid 
            + ', 你好！</span><div class="right btn btn-info siteButton" cmd="logout">注销</div></div>';*/
        //$D.show(accountContainer);
        //$E.notifyObservers(packageContext, 'loginSuccess', currentUser);
    }

    var checkLogin = function(){
        /*var uid = J.cookie.get('ct.uid');
        var accessToken = J.cookie.get('ct.token');

        if(uid && accessToken){//带cookie登录态
            //去后台验证
            site.rpc('/account/isLogin', {uid: uid, accessToken: accessToken}, function(data){
                //var data = response.data;
                if(data.success && data.isLogin){
                    currentUser = {uid: uid, accessToken: accessToken};
                    loginSuccess();
                }else{//登录态过期什么的
                    $E.notifyObservers(packageContext, 'guestReady');
                }
            },null,function(){
                $E.notifyObservers(packageContext, 'guestReady');
            });
        }else{
            $E.notifyObservers(packageContext, 'guestReady');
        }*/
        getUserInfo();
    };

    var onGuestReady = function(){
        $D.show(accountContainer);
    };

    this.init = function(){
        
        accountContainer = $D.id('accountContainer');
        qtool.bindCommands(accountContainer, 'click', accountContainerCommends);



        $E.addObserver(window, 'systemReady', checkLogin);
        $E.addObserver(packageContext, 'guestReady', onGuestReady);
    }

    this.login = function(uid, pwd){
        site.rpc('/account/signin', {
                uid: uid,
                pwd: pwd
            }, function(data){
                lockLoginPanel = false;
               // var data = response.data;
                if(data.success){
                    currentUser = data.data;
                    hideLoginPanel();
                    loginSuccess();
                }else if(data.code === 100){
                    alert('登录超时了，请稍候重试');
                }else{
                    alert('登录失败，请确认你的用户名和密码是否正确');
                }
        });
    }

    this.isLogin = function(){
        return !!currentUser;
    }

    this.getCurrentUser = function(){
        return currentUser;
    }
    
    this.signup = function(uid, pwd, email){
        site.rpc('/account/signup', {
                uid: uid,
                pwd: pwd,
                email: email
            }, function(data){
                lockSingupPanel = false;
               // var data = response.data;
                if(data.success){
                    alert('注册成功咯');
                    hideSignupPanel();
                    clearSignupFileds();
                }else if(data.code === 100){
                    alert('网络超时了，请稍候重试');
                }else if(data.code === 10002){
                    alert('这个用户名已经名花有主了呢');
                    signupUidField.focus();
                }else{
                    alert('注册失败，请稍候重试');
                }
        });
    }

});