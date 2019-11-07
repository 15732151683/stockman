/*构造函数*/
function Drag(sel){	
	this.ele = document.querySelector(sel);
	var _this = this;//记录在构造函数中的-这个对象
	this.ele.onmousedown = function(e){
		_this.mouseDown(e);
	};
}
Drag.prototype = {
	//
	mouseDown: function(e){
		var eve = window.event || e; 
		//记录在document对象中
		document.ele = this.ele;
		//将位置记录在元素的属性中
		this.ele.dx= eve.clientX - this.ele.offsetLeft;
		this.ele.dy = eve.clientY - this.ele.offsetTop;
		document.onmousemove = this.mouseMove;
		document.onmouseup = this.mouseUp;	
	},
	mouseMove: function(ele){
		var eve = window.event;
		this.ele.style.left = eve.clientX - this.ele.dx + "px";
		this.ele.style.top = eve.clientY - this.ele.dy + "px";
	},
	mouseUp: function(){
		document.onmousemove = null;
		document.onmouseup = null;
	}
}
