/*	配置	*/
Jx().$package("codeTank",function(J){
	var config={
		robot_size:[38,38],//robot尺寸
		gun_size:[54,20],//炮管尺寸
		bullet_size:[15,3],//子弹尺寸
		radar_size:[16,22],//雷达尺寸
		wall_hit:function(speed){return Math.abs(speed) * 0.5;},//撞墙的能量损耗
		robot_hit:6,//撞到其他robot的能量损耗
		fire_hurt:1,//发射子弹的能量损耗
		energy:100,//robot生命值
		gain:function(power){return 3*power;},//击中敌人获得的能量
		hurt:function(power){//被击中的能量损耗
			var hurt=4*power;
			if(power>1){
				hurt+=2 * (power - 1);
			}
			return hurt;
		},
		power_scope:[1,3],//子弹的能量范围
		heat_add:function(power){return (3+(power/5)).toFixed(1);},//子弹发射的大炮热量增加计算
		cold_rate:0.1,//大炮冷却速率
		bullet_speed:12,//子弹速度
		robot_speed:8,//robot速度
		robot_rotate_speed:Math.PI/30,//robot旋转速度
		gun_rotate_speed:Math.PI/30,//gun旋转速度
		radar_rotate_speed:Math.PI/30,//radar旋转速度
		robot_max_speed:8,//机器人最大速度
		scan_style:"rgba(101,224,235,0.1)",
		/*	资源	*/
		srcObj:{
			explode:"style/game/boom.png"//爆炸动画
		},
		uiObj:{
			classicBody:"style/tank/classic/body.png",//robot躯体
			classicGun:"style/tank/classic/gun.png",//gun躯体
			classicRadar:"style/tank/classic/radar.png",//radar躯体	
			classicBullet:"style/tank/classic/bullet.png",//bullet躯体

			redBody:"style/tank/red/body.png",//robot躯体
			redGun:"style/tank/red/gun.png",//gun躯体
			redRadar:"style/tank/red/radar.png",//radar躯体	
			redBullet:"style/tank/red/bullet.png",//bullet躯体

			orangeBody:"style/tank/orange/body.png",//robot躯体
			orangeGun:"style/tank/orange/gun.png",//gun躯体
			orangeRadar:"style/tank/orange/radar.png",//radar躯体	
			orangeBullet:"style/tank/orange/bullet.png",//bullet躯体

			yellowBody:"style/tank/yellow/body.png",//robot躯体
			yellowGun:"style/tank/yellow/gun.png",//gun躯体
			yellowRadar:"style/tank/yellow/radar.png",//radar躯体	
			yellowBullet:"style/tank/yellow/bullet.png",//bullet躯体

			greenBody:"style/tank/green/body.png",//robot躯体
			greenGun:"style/tank/green/gun.png",//gun躯体
			greenRadar:"style/tank/green/radar.png",//radar躯体	
			greenBullet:"style/tank/green/bullet.png",//bullet躯体

			indigoBody:"style/tank/indigo/body.png",//robot躯体
			indigoGun:"style/tank/indigo/gun.png",//gun躯体
			indigoRadar:"style/tank/indigo/radar.png",//radar躯体	
			indigoBullet:"style/tank/indigo/bullet.png",//bullet躯体

			blueBody:"style/tank/blue/body.png",//robot躯体
			blueGun:"style/tank/blue/gun.png",//gun躯体
			blueRadar:"style/tank/blue/radar.png",//radar躯体	
			blueBullet:"style/tank/blue/bullet.png",//bullet躯体

			purpleBody:"style/tank/purple/body.png",//robot躯体
			purpleGun:"style/tank/purple/gun.png",//gun躯体
			purpleRadar:"style/tank/purple/radar.png",//radar躯体	
			purpleBullet:"style/tank/purple/bullet.png",//bullet躯体

			goldBody:"style/tank/gold/body.png",//robot躯体
			goldGun:"style/tank/gold/gun.png",//gun躯体
			goldRadar:"style/tank/gold/radar.png",//radar躯体	
			goldBullet:"style/tank/gold/bullet.png",//bullet躯体

			whiteBody:"style/tank/white/body.png",//robot躯体
			whiteGun:"style/tank/white/gun.png",//gun躯体
			whiteRadar:"style/tank/white/radar.png",//radar躯体	
			whiteBullet:"style/tank/white/bullet.png"//bullet躯体		
		},
		eventPriority:{
			"scannedRobot":10,
			"bulletMissed":60,
			"bulletHit":50,
			"hitWall":30,
			"bulletHitBullet":50,
			"hitByBullet":40,
			"hitRobot":20,
			"death":100,
			"win":100,
			"robotDeath":70
		},
		isPlaySound:true,
		isShowRadar:true,
		isShowMsg:true
	};
	var pf=Jx().platform;
	if(!pf.iPad&&!pf.iPhone){
		var srcObj=config.srcObj;
		srcObj.gun="audio/gun.wav";//火炮射击音效
		srcObj.robotDeath="audio/robot_death.wav";//坦克被击毙爆炸音效
		srcObj.bulletExplode="audio/bullet_explode.wav";//炮弹爆炸音效
		srcObj.hitRobot="audio/hit_robot.wav";
		srcObj.hitWall="audio/hit_wall.wav";
	}
	this.config = config;
});