
var timer;                        //间隔计时器
var showDiv = document.getElementsByClassName('slide-wrap')[0];
var conDiv = document.getElementsByClassName('slide-con')[0];
var dots = document.getElementsByClassName('page')[0].getElementsByTagName('span');
var index = 0;                    //存储当前图片的下标
var dx = 0;
var item = conDiv.getElementByClassName('slide-item')[0];
/*修改分页器位置*/
function changePosi() {
	for(var i = 0; i < dots.length; i++){
		if(i == index){				//如果分页器的下标正好和图片的下标一样
			dots[i].className = 'cur';
		}else{
			dots[i].className = '';
		}
	}
	if(index == 5){
		dots[0].className = 'cur';
	}     
}
/*正向播放图片  每一张的变化*/
function play(){
	dx -= 50;
	//代表正好偏移完一整张
	if(dx % item.offsetWidth == 0){
		clearInterval(timer);             //清除计时器,停止播放
		//延迟一定时间,重新开启计时器
		setTimeout(function(){
			timer = setInterval(play, 10);//保证开启的是同一个计时器
		}, 2000);
			console.log(timer);
	}
}
/*自动播放*/
function autoplay(){
	if(index == 5){
		index = 0;
		conDiv.style.left = 0;                //改变下标值只是为了更改left的值,所以下标怎么改无所谓,带来的结果 left值才重要
		//马上回到第一张 然后继续正向播放
	}
	index++;
	//切换图片
	play();
	//修改分页器位置
	changePosi();
}
//循环自动播放
var t1 = setInterval(function(){
	autoplay();
}, 2000);
/*鼠标移入时暂停播放*/
showDiv.onmouseover = function(){
	clearInterval(t1);
}
/*鼠标移除时暂停播放*/
showDiv.onmouseout = function(){
	t1 = setInterval(function(){
	autoplay();
}, 2000);
}
//给分页器添加点击事件
for(var i = 0; i < dots.length; i++){
	dots[i].num = i;          //添加自定义属性  标记点的下标
	dots[i].onclick = function(){
		 index = this.num;              //this  当前触发标签事件的元素
		 play();
		 changePosi();
	}		
}