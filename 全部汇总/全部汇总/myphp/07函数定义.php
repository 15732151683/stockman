<?php
//php的函数定义
//关键字:function 
//函数定义形式
//funcname - 函数名
//$param1,$param2 - 形参 可以有若干个
//形参作为函数内部的变量名使用
//形参与返回值都可以省略
//形参可以设置默认值，例如$param1=3
//所有具有默认值的形参必须在
//return - 返回值，函数可以不定义返回值（不是每个函数都有返回值）
function funcname($param1=3, $param2=5) {
	$var = $param1 + $param2;
	return $var;
}
//函数的调用
//函数的代码只有在调用的时候才会调用
//调用时传递的参数称为实参，例如3，5
//当函数传入实参时，函数内部所有的形参变量都会赋值为实参
$var = funcname(3, 5);
echo $var."<br>";

//函数定义的位置
//函数可以在定义之前或者定义之后使用
//假设有一个函数名叫mysum
echo mysum(3,4,5);
function mysum($a, $b, $c) {
	return $a+$b+$c;
}
//局部变量
//定义在函数内部的变量为局部变量
//函数内部的局部变量只能在函数内部使用
//定义在函数外部(父域)的变量,也不能被函数在内部使用
//如果要在函数内部使用父域的变量,需要使用global关键字将该变量在函数内部声明为全局变量
$a = 10;
function caicai(){
	global $a;
	echo $a;//10
	$a = 20;    //20 已经变成一个全局变量,他的修改直接影响外部 
}
caicai();
echo "<br>";
echo $a;

//将一个函数定义在另一个函数内部
function myfun1(){
	function myfun2(){
		echo "hello world";
	}
}
myfun1();  //当这个函数执行的时候,myfun2才会被定义
//myfun2();
//匿名函数
//定义函数的时候没有命名,但是可以将一个函数赋值给变量
//定义匿名函数的时候,末尾一定要加上 ;   
$a = function(){
	echo "hello";
};
$a();
//闭包函数

?>