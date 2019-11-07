<?php
//无论哪种语言
//不外乎以下几种
//顺序执行(由上而下,逐行执行)
//条件语句
//循环语句
//跳转语句  goto
//php中的条件语句
//if(){}else if{}else{}
$age = 100;
if($age > 18){
	echo "可以谈对象了";   //当第一个条件满足后,之后的条件就不再判定了
}else if($age > 25){      //elseif 与  else if 这两种格式都可以
	echo "可以结婚了";
}else{
	echo "可以生孩子了";
}
$user[0] = "js";
$user[1] = "php";
//写一个条件判定,0=js并且1=PHP的学生才能被录用
if($user[0]=="js"&&$user[1]=="php"){
	echo "Congradulations";
}else{
	echo "So sad";
}
//三元运算符
//表达式?表达式为true:为false;
//取两个数中的最大值
$a = 100;
$b = 150;
$c = $a>$b?$a:$b;
echo $c;
//switch条件分支语句
//可以让条件复杂的情况下,简化程序结构
$score = 100;
switch($score){
	case 100:
		echo "优秀";
		break;           //如果没有break,从第一个符合条件的开始,一直到后面的break
	case 80;
		echo "良好";
		break;
	case 60:
		echo "及格";
		break;
}
//循环语句
//for(初始表达式;循环条件表达式;每次循环执行的表达式){循环体}
$i = 0;
for (;;){
	//可以使用break结束循环
	if($i>=100){break;};
	echo "$i <br>";
	$i++;
}
//while循环
//while(循环条件){循环体}
//使用循环语句一定要注意结束条件,避免死循环
$i= 0;//初始化条件
while($i<100){
	echo $i;
	$i++;
}
//do{}while()
//循环体至少执行一次
$i = 0;
do{
	echo "$i <br>";
	$i++;
}while($i<0);
//数组遍历语句结构
//js的forEach
//遍历循环可以省略key部分
$users = array(
	'luxp' => "卢西奥",
	'why' => "王海安",
	'jt' => "江涛" 
);
foreach($users as $val){//  或者foreach($users as $key=>$val)
	echo "key :: $val <br>";
}
?>