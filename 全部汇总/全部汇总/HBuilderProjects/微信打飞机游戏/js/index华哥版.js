/*****************游戏对象****************/
var game = {
	
	
	/*再来一次*/
	oneMore: function() {
		//document.getElementById("end").style.display = "none";
		location.reload();
	}
};
/*****游戏初始化*****/
game.init();


/******************战机对象******************/
var fighter = {
	x: canvas.width / 2 - 33,
	y: canvas.height - 100,
	w: 66,
	h: 82,
	//当前绘制帧数
	frames: 0,
	/*子弹类型: 单发0 双发1 连发2*/
	bulletType: 0,
	/*子弹的间隔*/
	interval: 0,
	/*发射频率*/
	f: 20,
	/*子弹库*/
	bullets: [],
	/*是否撞机*/
	isDown: false,
	/*控制动画的时长*/
	d: 0,
	/*是否获取炸弹💣*/
	hasBomb: 0,
	/*是否获取道具*/
	getProp: false,
	/*道具的使用时限*/
	time: 300,
	/*发射*/
	fire: function() {
		this.interval++;
		//控制发射频率
		if(this.interval == this.f) {
			var bullet = new Bullet(this.x, this.y, this.bulletType, 100);
			this.bullets.push(bullet);
			game.sounds[2].play();
			this.interval = 0;
		}
		for(var i = 0; i < this.bullets.length; i++) {
			if(this.bullets[i]) {
				this.bullets[i].shoot();
			}
			//若子弹没有击中敌机 超出游戏界面
			if(this.bullets[i].y <= -this.bullets[i].h) {
				//移除该子弹
				this.bullets.splice(i, 1);
			}
		}
	}
};
/******************子弹类******************/
function Bullet(x, y, type, kill) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.kill = kill;

	var bulletImgs = [game.imgs[3], game.imgs[4], game.imgs[3]];
	//区别子弹类型
	switch(this.type) {
		case 2: //连发
			fighter.f = 2;
			this.x = fighter.x + 31;
			this.w = 6;
			this.h = 14;
			break;
		case 1: //双发
			this.x = fighter.x + 9;
			this.w = 48;
			this.h = 14;
			break;
		case 0: //单发
		default: //默认单发
			fighter.f = 20;
			this.x = fighter.x + 31;
			this.w = 6;
			this.h = 14;
			break;
	}

	this.shoot = function() {
		this.y -= 3;
		cxt.drawImage(bulletImgs[this.type], this.x, this.y);
	}
}

/******************敌机类******************/
/* 位置 大小 敌机类型 生命值 绘制总帧数*/
function Enemy(x, y, w, h, type, hp, frames, v) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	//0小型  1大型  2中型
	this.type = type;
	this.hp = hp;
	//总帧数
	this.frames = frames;
	this.v = v;
	//当前绘制的帧数
	this.df = 0;
	//是否被击中
	this.shot = false;
	//是否该被移除
	this.removed = false;
	switch(this.type) {
		case 0:
			this.s = 300;
			break;
		case 1:
			this.s = 1000;
			break;
		case 2:
			this.s = 500;
			break;
		default:
			break;
	}
	this.enemyImgs = [game.imgs[5], game.imgs[6], game.imgs[7]];

}
//飞行
Enemy.prototype.fly = function() {
	//若被击中
	if(this.shot) {
		this.df++;
		//代表敌机已爆炸 应该从界面移除
		if(this.df == this.frames) {
			this.removed = true;
		}
	} else {
		//若未被击中
		this.y += this.v;
	}
	cxt.drawImage(this.enemyImgs[this.type], this.df * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
}
//被击中
Enemy.prototype.wasShot = function() {
	//更改状态 表示被击中
	this.shot = true;
	//坠毁音效
	switch(this.type) {
		case 0:
			game.sounds[3].play();
			break;
		case 1:
			game.sounds[4].play();
			break;
		case 2:
			game.sounds[5].play();
			break;
		default:
			break;
	}
}

/******************道具类******************/
function Prop(x, y, w, h, type, v) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	//0炸弹 1双发 2连发
	this.type = type;
	this.v = v;
	this.show = function() {
		this.y += this.v;
		cxt.drawImage(game.imgs[8], this.type * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
	}
}

/******************炸弹对象******************/
var bomb = {
	x: canvas.width - 70,
	y: canvas.height - 60,
	w: 42,
	h: 36,
	show: function() {
		cxt.drawImage(game.imgs[2], this.x, this.y, this.w, this.h);
		cxt.beginPath();
		cxt.font = "20px serif";
		cxt.textBaseline = "middle";
		cxt.fillStyle = "#7e4a4b";
		cxt.fillText("x" + fighter.hasBomb, this.x + this.w, this.y + this.h / 2);
	}
};

/***敌机来袭***/
function attack() {
	//随机敌机出现的概率,位置以及速度
	var n = rand(0, 300);
	//随机道具的类型
	var type = rand(0, 2);
	//随机位置
	var x1 = rand(0, canvas.width - 37); //小型
	var x2 = rand(0, canvas.width - 110); //大型
	var x3 = rand(0, canvas.width - 46); //中型
	var p1 = rand(0, canvas.width - 39); //道具
	if(n < 5) {
		//小型
		var e1 = new Enemy(x1, -50, 37, 32, 0, 100, 5, 4);
		game.enemys.push(e1);
		if(n < 1) {
			//大型
			var e2 = new Enemy(x2, -120, 110, 164, 1, 500, 10, 2);
			game.enemys.push(e2);
		}
		if(n < 2) {
			//中型
			var e3 = new Enemy(x3, -60, 46, 64, 2, 300, 6, 3);
			game.enemys.push(e3);
		}
	}
	//遍历敌机数组  检测敌机与子弹,战机是否相碰
	for(var i = 0; i < game.enemys.length; i++) {
		for(var j = 0; j < fighter.bullets.length; j++) {
			//若敌机未被击中 检测
			if(game.enemys[i].shot == false) {
				//敌机与子弹
				if(crash(game.enemys[i], fighter.bullets[j])) {
					//敌机生命值减少
					game.enemys[i].hp -= fighter.bullets[j].kill;
					if(game.enemys[i].hp <= 0) {
						//表示敌机被击毁
						game.enemys[i].wasShot();
					}
					//移除该子弹
					fighter.bullets.splice(j, 1)
				}
			}
		}
		//敌机与战机
		if(crash(game.enemys[i], fighter)) {
			//标记战机被撞毁
			fighter.isDown = true;
			//战机不能再发射子弹
			fighter.clear = true;
			fighter.getProp = false;
		}
		//正常飞过空域
		if(game.enemys[i].y > canvas.height) {
			//从数组中移除
			game.enemys.splice(i, 1);
		}
		//表示敌机正常情况下
		if(game.enemys[i]) {
			game.enemys[i].fly();

			if(game.enemys[i].removed) {
				//得分
				game.score += game.enemys[i].s;

				game.enemys.splice(i, 1);
				i--; //循环变量递减
			}
		}
	}
	//战机发射子弹
	if(fighter.isDown == false) {
		fighter.fire();
	} else {
		fighter.fallDown();
	}
	//道具随机出现
	var m = rand(0, 100); //随机出现概率
	//表示当前战机未获取道具 则随机出现一个
	if(m < 5 && fighter.getProp == false) {
		game.prop = new Prop(p1, -70, 39, 68, type, 3);
		//状态置反 标记已出现了一个道具
		fighter.getProp = true;
	}
	//表示已空投该道具 则出现
	if(fighter.getProp) {
		game.prop.show();
		//超出之后 消失
		if(game.prop.y > canvas.height) {
			fighter.getProp = false;
		}
		//战机是否碰到道具
		if(fighter.isDown == false && crash(game.prop, fighter)) {
			fighter.getProp = false;
			switch(game.prop.type) {
				case 0: //炸弹
					fighter.hasBomb++;
					break;
				case 1: //双发
					fighter.bulletType = 1;
					break;
				case 2: //连发
					fighter.bulletType = 2;
					break;
				default:
					break;
			}
		}
	}
	//判断子弹类型
	if(fighter.bulletType == 1) { //双发
		fighter.time--;
		if(fighter.time <= 0) {
			fighter.bulletType = 0;
			fighter.time = 300;
		}
	}
	if(fighter.bulletType == 2) { //连发
		fighter.time--;
		if(fighter.time <= 0) {
			fighter.bulletType = 0;
			fighter.time = 300;
		}
	}
	if(fighter.hasBomb > 0) {
		bomb.show();
		document.onkeydown = function(e) {
			var eve = window.event || e;
			if(eve.keyCode == 32) {
				if(fighter.isDown == false && fighter.hasBomb > 0) {
					fighter.hasBomb--;
					killAll();
				}
			}
		}
	}
	cxt.beginPath();
	cxt.fillStyle = "goldenrod";
	cxt.fillText(game.score, 30, 20);
}
/*摧毁页面中所有的敌机*/
function killAll() {
	for(var i = 0; i < game.enemys.length; i++) {
		game.enemys[i].wasShot();
	}
}

/*控制战机*/
canvas.onmousedown = function(e) {
	var eve = window.event || e;
	var x = eve.clientX;
	var y = eve.clientY;
	if(x >= fighter.x && x <= fighter.x + fighter.w && y >= fighter.y && y <= fighter.y + fighter.h) {
		//当在战机范围上按下时
		document.onmousemove = function(e) {
			var eve = window.event || e;
			fighter.x = eve.clientX - fighter.w / 2;
			fighter.y = eve.clientY - fighter.h / 2;
		}
		document.onmouseup = function() {
			document.onmousemove = null;
		}
	}
}
canvas.addEventListener("touchstart", function(e) {
	var eve = window.event || e;
	var touch1 = eve.touches[0];
	var x = touch1.pageX;
	var y = touch1.pageY;
	console.log(x, y);
	if(x >= fighter.x && x <= fighter.x + fighter.w && y >= fighter.y && y <= fighter.y + fighter.h) {
		canvas.addEventListener("touchmove", move, false);
	}
	eve.preventDefault();
});

function move(e) {
	var eve = window.event || e;
	var t = eve.touches[0];
	fighter.x = t.pageX - fighter.w / 2;
	fighter.y = t.pageY - fighter.h / 2;
}

document.getElementById("restart").onclick = game.oneMore;
document.getElementById("restart").addEventListener("touchstart", game.oneMore);

function rand(x, y) {
	return Math.floor(Math.random() * (y - x + 1) + x);
}

function crash(obj1, obj2) {
	if(obj1 && obj2) {
		var l1 = obj1.x;
		var r1 = l1 + obj1.w;
		var t1 = obj1.y;
		var b1 = t1 + obj1.h;

		var l2 = obj2.x;
		var r2 = l2 + obj2.w;
		var t2 = obj2.y;
		var b2 = t2 + obj2.h;
		if(l1 > r2 || r1 < l2 || t1 > b2 || b1 < t2) {
			return false;
		} else {
			return true;
		}
	}
}