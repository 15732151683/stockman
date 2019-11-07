document.getElementById("btn-start").onclick = function(){
	document.getElementsByClassName('welcome')[0].style.display = "none";
	startGame();
}

/*游戏开始*/
function startGame(){
	//随机题目
	randQ();
	//随机答案                   !!!!!!!!!!!!!!!!!!!!!!游戏开始也要随机答案
	randA();
	//计时开始
	timeReduce();
}
var texts = ["红", "黄","蓝", "绿", "黑"];
var  colors = ["red","gold", "green", "bule", "black"];
//存储答案
var answer;
/*随机生成一道题目*/
function randQ(){
	//随机一个字
	var txt = document.getElementById("txt");
	txt.innerHTML = texts[randNum(0,4)];
	//随机一种颜色
	var c = colors[randNum(0,4)];
	txt.style.color = c;       //随机颜色即为该题的答案文字
	switch (c){
		case "red":
			answer = "红";
			break;
		case "gold":
			answer = "黄";
			break;
		case "blue":
			answer = "蓝";
			break;	
		case "green":
			answer = "绿";
			break;
		case "black":
			answer = "黑";
			break;
		default:
			break;
	}
}
//给答案区域绑定点击事件
var ans = document.getElementsByClassName('answers')[0].getElementsByTagName('span');
for (var i = 0; i < ans.length; i++) {
	ans[i].onclick = function (){
		if(this.innerHTML == answer){
			//答对了,进入下一题
			//得分
			getScore();
			//再随机下一道题
			randQ();
			//随机答案区域的顺序和颜色
			randA();
			
		} else{
			//答错了
		}
	}
}
/*打乱数组的顺序*/
function sortArr(arr){
	for(var i = 0; i < arr.length; i++){
		//随机位置下标
		var n = randNum(0, arr.length - 1);/*PAY ATTENTION: /(ㄒoㄒ)/~~    是在下标内取一个随机数所以应该是[0, a.length -  1]   如果超出了范围,对应的取到数组内的元素就 undefined啦啦啦啦啦啦     */
		//当前位置和随机位置不同,则可互换
		if(i != n){
			var temp = arr[i];    //交换位置,借助第三方变量
			arr[i] = arr[n];	    // 既然封装了就一步到位,交换下标并没有什么卵用,交直接换元素(内容);    
			arr[n] = temp;
		}else{
			i--;
		}
	}
}
//随机答案位置和颜色
function randA(){
	//打乱顺序
	sortArr(texts);
	sortArr(colors);
	//赋值
	for(var i = 0; i < ans.length; i++){
		ans[i].innerHTML = texts[i];
		ans[i].style.color = colors[i];
	}
}

/*开始计时*/
function timeReduce(){
	var timeDiv = document.getElementsByClassName('progress')[0];
	var w = 150;
	var t = setInterval(function(){
		w -=0.5;
		timeDiv.style.width = w +'px';
		//游戏时间结束
		if(w <=0 ){
			//游戏结束
			gameOver();      
			clearInterval(t);//清除计时器   计时结束
		}
	}, 50)
}
/*游戏结束*/
function gameOver(){
	document.getElementsByClassName('end')[0].style.display = 'block';
	document.getElementById("restart").onclick = function(){
		//重新加载页面
		window.location.reload();
	}
}
/**随机*/
function randNum(x, y){
	return parseInt(Math.random()*(y - x +1)+x);
}
//得分
//统计分数
var n = 0;
function getScore(){
	n++;
	document.getElementById("score").innerHTML = n;
}
