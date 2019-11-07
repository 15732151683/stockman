var canvas = document.getElementById("gc");
var ctx = canvas.getContext("2d");
/*游戏对象*/ //只出现一次
var game = {
	/*图片对象数组*/
	imgs: [],
	/*音频对象数组*/
	sounds: [],
	/*游戏的分数*/
	score: 0,
	/*游戏背景图*/
	bg: {
		x: 0,
		y: 0,
		w: canvas.width,
		h: canvas.height,
		scroll: function() {
			//整屏填充并且不失真
			var row = Math.ceil(canvas.height / 568); //行 向上取整
			var col = Math.ceil(canvas.width / 320); //列
			//循环滚动 重复绘制一份
			for(var i = -row; i < row; i++) {
				for(var j = 0; j < col; j++) {
					ctx.drawImage(game.imgs[0], 320 * j, 568 * i + this.y); //
				}
			}
			this.y++;
			if(this.y >= row * 568) {
				this.y = 0;
			}
		}
	},
	/*初始化游戏*/
	init: function() {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		this.load();
	},
	/*加载*/
	load: function() {
		//预加载
		this.loadImgs();
	},
	/*图片预加载*/
	loadImgs: function() {
		var imgArr = ["img/background.png", "img/herofly.png", "img/bomb.png", "img/bullet1.png", "img/bullet2.png", "img/enemy1.png", "img/enemy2.png", "img/enemy3.png", "img/prop.png"];

		var n = 0;
		for(var i = 0; i < imgArr.length; i++) {
			var img = new Image(); //对象
			this.imgs.push(img); //放到对象数组中
			img.onload = function() {
				n++;
				if(n == imgArr.length) {
					//音频预加载
					game.loadAudios();
				}
			}
			//图片加载好了之后附上地址属性
			img.src = imgArr[i];
		}
	},
	/*音频预加载*/
	loadAudios: function() {
		var audioArr = ["audio/game_music.mp3", "audio/game_over.mp3", "audio/bullet.mp3", "audio/enemy1_down.mp3", "audio/enemy2_down.mp3", "audio/enemy3_down.mp3", "audio/enemy2_out.mp3"];
		var m = 0;
		for(var i = 0; i < audioArr.length; i++) {
			var sound = new Audio(); //对象
			this.sounds.push(sound); //对象数组
			sound.onloadedmetadata = function() {
				m++;
				if(m == audioArr.length) {
					game.enter_game();
				}
			}
			sound.src = audioArr[i];
		}
	},
	/*进入游戏主界面*/
	enter_game: function() {
		//隐藏加载页面
		document.getElementById("loading").style.display = "none";
		//开启游戏背景音效
		this.sounds[0].loop = true;
		this.sounds[0].play();
		//游戏开始
		this.begin();
	},
	/*游戏开始*/
	begin: function() {
		//canvas动画  每次都清除画布重新画
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//游戏背景图滚动
		game.bg.scroll();
		//敌机来袭
		game.enemyAttack();
		//战机出现
		fighter.show();

		//战机开火
		window.requestAnimationFrame(game.begin);
	},
	/*结束*/
	over: function() {
		game.enemys = [];
		document.querySelector("#score>span").innerHTML = game.score;
		document.getElementById("end").style.display = "block";
	},
	/*再来一次*/
	oneMore: function(){
//		document.getElementById("end").style.display = "none";
//		game.begin();
		
		location.reload();
	},
	/*存储道具对象*/
	prop: null,
	/*存储所有的敌机对象*/
	enemys: [],
	/*敌机出现*/
	enemyAttack: attack
};
/*****************游戏初始化******************/
game.init();
document.getElementById("restart").onclick = game.oneMore;
document.getElementById("restart").addEventListener("touchstart", game.oneMore);
/*战机对象*/
var fighter = {
	w: 66,
	h: 82,
	x: canvas.width / 2 - 33, //????
	y: canvas.height - 100,
	//当前的帧数
	frames: 0,
	/*子弹类型: 单发0 双发1 连发2*/
	bulletType: 0,
	/*子弹的间隔*/
	interval: 0,
	/*发射频率*/
	f: 10,
	/*子弹库*/
	bullets: [],
	/*是否撞击*/
	isDown: false,
	/*控制爆炸动画*/
	d: 0,
	/*是否获取💣*/
	hasBomb: 0,
	/*是否获取道具*/
	getProp: false,
	/*道具时限*/
	time: 300,
	/*战机被击毁时 子弹是否被清除*/
	clear: false,
	/*出现*/
	show: function() {
		console.log(this.y);
		ctx.drawImage(game.imgs[1], this.frames * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
	},
	/*发射*/
	fire: function() {
		this.interval++; //  延缓时间
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
			//若子弹没有击中敌机  超出游戏界面
			if(this.bullets[i].y <= -this.bullets[i].h) {
				//超出顶部界面 移除该子弹
				this.bullets.splice(i, 1);
			}
		}
	},
	/*坠毁*/
	fallDown: function() {
		//执行爆炸动画
		this.d++;
		if(this.d == 10) {
			//帧数变化 执行爆炸动画
			this.frames++;
			this.d = 0;
		}
		if(this.frames == 5) {
			//战机被击毁, 游戏结束
			game.over();
		}
	},
};
/*子弹类*/
function Bullet(x, y, type, kill) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.kill = kill;
	var bulletImgs = [game.imgs[3], game.imgs[4], game.imgs[3]];
	//区分子弹类型
	switch(this.type) {
		case 2: //连发  改变发射频率
			fighter.f = 2;
			fighter.time--;
			if(fighter.time <= 0) {
				fighter.f = 20;
				fighter.time = 300;
			}
			this.w = 6;
			this.h = 14;
			this.x = fighter.x + 31;
			break;
		case 1: //双发
			fighter.f = 20;
			this.x = fighter.x + 9;
			this.w = 48;
			this.h = 14;
			break;
		case 0: //单发
		default: //默认单发模式
			fighter.f = 20;
			this.x = fighter.x + 31;
			this.w = 48;
			this.h = 14;
			break;
	}
	this.shoot = function() {
		this.y -= 5;
		ctx.drawImage(bulletImgs[this.type], this.x, this.y);
	}
}
/*控制战机*/
canvas.onmousedown = function(e) {
	var eve = window.event || e;
	var x = eve.clientX;
	var y = eve.clientY;
	if(x >= fighter.x && x <= fighter.x + fighter.w && y >= fighter.y && y <= fighter.y + fighter.h) {
		//当在战机范围下按下时
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
	console.log(111);
	var eve = window.event || e;
	var touch1 = eve.touches[0];
	var x = touch1.pageX;
	var y = touch1.pageY;
	console.log(x, y);
	if(x >= fighter.x && x <= fighter.x + fighter.w && y >= fighter.y && y <= fighter.y + fighter.h) {
		//当在战机范围下按下时
		canvas.addEventListener("touchmove", move, false);
	}
	eve.preventDefault();
});

//移动端  战机移动
function move(e) {
	console.log(222);
	var eve = window.event || e;
	var t = eve.touches[0];
	fighter.x = t.pageX - fighter.w / 2;
	fighter.y = t.pageY - fighter.h / 2;
}
/*敌机类*/
/*位置 大小 敌机类型 生命值 雪碧图的总帧数*/
function Enemy(x, y, w, h, type, hp, frames, v) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	//0小型 1中型 2大型
	this.type = type;
	this.hp = hp;
	//总帧数
	this.frames = frames;
	//当前绘制的帧数
	this.df = 0;
	this.v = v;
	//敌机是否被击中
	this.shot = false; // 默认没被击中
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
		//代表爆炸结束  应该从界面移除
		if(this.df == this.frames) {
			this.removed = true;
		}
	} else {
		//若未被击中
		this.y += this.v;
	}
	ctx.drawImage(this.enemyImgs[this.type], this.df * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
}
Enemy.prototype.wasShot = function() {
	//更改击中状态   表示被击中了
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
/*道具类*/
function Prop(x, y, w, h, type, v) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	//0炸弹 1双发 2菜菜连发
	this.type = type;
	this.v = v;
	this.show = function() {
		this.y += this.v;
		ctx.drawImage(game.imgs[8], this.type * this.w, 0, this.w, this.h, this.x, this.y, this.w, this.h);
	}
}

/*炸弹对象*/
/*敌机来袭*/
function attack() {
	//随机敌机出现概率,位置以及速度
	var n = rand(0, 500);
	//随机道具的类型
	var type = rand(0, 2);
	//随机位置
	var x1 = rand(0, canvas.width - 37); //小型
	var x2 = rand(0, canvas.width - 110); //大型
	var x3 = rand(0, canvas.width - 46); //中型
	//随即道具的位置
	var p1 = rand(0, canvas.width - 39); //道具
	if(n < 10) {
		var e1 = new Enemy(x1, -50, 37, 32, 0, 100, 5, 4);
		game.enemys.push(e1);
		if(n < 1) {
			//大型
			var e2 = new Enemy(x2, -120, 110, 164, 1, 500, 10, 2);
			game.enemys.push(e2);
		}
		if(n < 3) {
			//中型
			var e3 = new Enemy(x3, -60, 46, 64, 2, 300, 6, 3);
			game.enemys.push(e3);
		}
	}
	//遍历敌机数组 检测敌机与子弹,战机是否相碰
	for(var i = 0; i < game.enemys.length; i++) {
		for(var j = 0; j < fighter.bullets.length; j++) {
			//若敌机未被击中 检测
			if(game.enemys[i].shot == false) {
				//敌机与子弹碰撞检测
				if(crash(game.enemys[i], fighter.bullets[j])) {
					//敌机生命值减少
					game.enemys[i].hp -= fighter.bullets[j].kill;
					if(game.enemys[i].hp <= 0) {
						//表示敌机被击毁
						game.enemys[i].wasShot();
						//消失 从界面移除
					}
					//移除该子弹
					fighter.bullets.splice(j, 1); //???????
				}
			}
		}

		//敌机与战机
		if(crash(game.enemys[i], fighter)) {
			//标记战机被撞毁
			fighter.isDown = true;
			//战机不能再发射子弹
			fighter.clear = true;
			//game.over();
		}
		//正常飞过空域 没有相碰
		if(game.enemys[i].y > canvas.height) {
			//从数组中移除
			game.enemys.splice(i, 1);
		}
		//如果还存在 
		if(game.enemys[i]) {
			game.enemys[i].fly();

			if(game.enemys[i].removed) {
				game.score += game.enemys[i].s;
				game.enemys.splice(i, 1);
				i--; //循环变量递减
			}
		}
	}
	//战机发射子弹
	if(fighter.clear == false) {
		fighter.fire();
	} else {
		//战机坠毁
		fighter.fallDown();
		//清除所有子弹

	}
	//道具随机出现
	var m = rand(0, 100); //随机出现概率
	//表示当前战机未获取道具  则随机出现一个
	if(m < 5 && fighter.getProp == false) {
		game.prop = new Prop(p1, -70, 39, 68, type, 3);
		//状态置反  代表已经出现了一个道具了
		fighter.getProp = true;
	}
	//表示已空投该道具 则出现
	if(fighter.getProp) {
		game.prop.show();
		//超出之后 消失
		if(game.prop.y > canvas.height) {
			fighter.getProp = false;
		} //这里有个问题的呢呢呢呢呢呢呢
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
	if(fighter.bulletType == 1) {//双发
		fighter.time--;
		console.log(fighter.time);
		if(fighter.time <= 0) {
			fighter.bulletType = 0;
			fighter.time = 300;
		}
	}
	if(fighter.bulletType == 2) {//连发
		fighter.time--;
		if(fighter.time <= 0) {
			fighter.f = 20;
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
	//得分
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.font = "20px serif";
	ctx.fillText(game.score, 10, 40);
}
/*摧毁页面中所有的敌机*/
function killAll() {
	for(var i = 0; i < game.enemys.length; i++) {
		game.enemys[i].wasShot();
	}
	//	game.enemys.length = 0;  //或者👇
	//	game.enemys = [];
}
/*炸弹对象*/
var bomb = {
	x: canvas.width - 70,
	y: canvas.height - 60,
	w: 42,
	h: 36,
	show: function() {
		ctx.drawImage(game.imgs[2], this.x, this.y, this.w, this.h);
		ctx.beginPath();
		ctx.font = "20px serif";
		ctx.fillStyle = "#7e4a4b";
		ctx.fillText("x" + fighter.hasBomb, this.x + this.w, this.y + this.h / 2);
	}
};

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