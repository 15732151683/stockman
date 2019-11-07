<?php
//定义一个整型的变量
$var = 10;
//浮点型的
$var = 10.0;
//负数
$var = -8;
//字符串
//字符串需要放置在双引号或者单引号里面
$str = "abc";
$str = 'abc';
//如果字符串里包含双引号或者单引号,需要使用转义字符
$str = "大家说\"程序员收入高\"";
echo $str."<br>";
//如果不使用转义符,那么外层的引号与内层的引号应该不相同
$str = '大家说"程序员收入高"';
echo $str."<br>";
//单引号与双引号的区别
$hello = "欢迎来到蓝鸥";
echo "$hello"."<br>"; //双引号中的变量会被解析
echo '$hello'; //单引号中的变量不会被解析
?>
<div></div>
<script type="text/javascript">
	var str =' <?=$str?>';  //虽然可以混编,但是最好js的变量名不要和PHP的相同,否则引用变量的时候容易出错,若相同的话,需要用单引号
	document.querySelector("div").innerText = str;
</script>