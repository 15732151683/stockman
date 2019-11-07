var index = 7;     //第几张图
var timer;         //声明间隔计时器
var timer2;
var timer3;
var wrap = document.getElementsByClassName('wrap')[0];
var imgs = document.getElementsByClassName('wrap')[0].getElementsByTagName('img');
var bots = document.getElementsByClassName('bots')[0].getElementsByTagName('span');
//r-btn:1️⃣图片们的透明度 2️⃣bots的相对应
document.getElementById("r-btn").onclick = function (){
	autoplay();
	dotsPosition();
}
document.getElementById("l-btn").onclick = function (){
	index++;
//	if(){}
	play();
	dotsPosition();
	console.log(index);
}
function play(){                                         //要修改
	clearInterval(timer);
	timer = setInterval(function(){
		imgs[index].style.opacity = 0;
	}, 50);
}
//左边的play
function playl(){
	clearInterval(timer);
	timer = setInterval(function(){
		imgs[index].style.opacity = 1;
	}, 50);
}
function autoplay(){
	index--;
	if(index == 0){            //看见了第一张图  重载-->恢复到没有任何操作  onclicK index = 0
		window.location.reload();
		index = 6;
	}
	play();
}
//bots的相对应
function dotsPosition(){
	for(var i =  0; i < bots.length; i++){
		if(i+index == 7){
			bots[i].className = 'cur';
		}else{
			bots[i].className = '';
		}
	}
}
//自动播放
timer2 = setInterval(function(){
	setTimeout(function(){
		autoplay();
		dotsPosition();
	}, 1000);
},2050);
//onmouseover时 不播放
wrap.onmouseover = function (){
	clearInterval(timer2);
	clearTimeout(timer3);
}
//onmouseout时  重新播放
wrap.onmouseout = function (){
	timer2 = setInterval(function(){
	setTimeout(function(){
		autoplay();
		dotsPosition();
	}, 1000);
},2050);
	timer3 = setTimeout(function(){
		autoplay();
		dotsPosition();
	}, 1000);
}
