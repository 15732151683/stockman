<?php
	//运算
	//PHP是一种脚本语言,所以他是弱类型的语言,也就是定义变量的时候可以不用预先声明变量的类型,并且在程序执行过程中,变量类型会随着他的值发生变化
	//数字类型的运算
	//+,-,*,/
	//取模:将余数取整(舍去法) %
	$num= 5;
	echo $num %3;
	echo "<br>";
	//现在假设有10个数
	//每四个数排一行
	for($i= 1;$i<=10;$i++){
		echo "*";
		if($i%4==0){
			echo "<br>";
		}
	}
	echo "<br>";
	//字符串运算符  .  实现字符串的拼接
	$str1 = "hello";
	$str2 = "world";
	$str3 = $str1.$str2;
	echo $str3."<br>";
	//数组的拼接  +
	//注意:  如果2个数组做加运算,第一个数组的元素会覆盖第二个数组中的具有相同下标的元素
	$array1 = [1,2,3,4,5];
	$array2 = [3,4,5,6,7,8];
	$array = $array1 + $array2;
	var_dump($array);
	//数字与字符串的运算
	echo "<br>";
	$str = "asd"; //字符串类型
	echo gettype($str);
	$int= 100;  //整数类型
	echo "<br>";
	echo gettype($int);
	//进行加减运算
	//总结:   当一个字符串与数字进行运算时,字符串首先转换为数字类型,其值由字符串构成决定
	//该例中  asd  会被转换成  0
	//但  100asd 会被转换成100   10a0asd会被转换成10
	//如果一个字符串完全是由数字组成,其值就为数字值
	$str = "10a0asd"; 
	echo "<br>";
	echo $str+$int;  
	echo "<br>";
	echo $str - $int;   
	//布尔值
	//true 与 false 不分大小写
	$var = true;
	$var = True;
	$var = false;
	$var = False;
	//布尔值与数字计算
	//true相当于1
	//false相当于0
	$int = 1;
	$var = true;
	echo "<br>";
	echo $int + $var;  //2
	//null值
	//当一个变量被设为null,表明它没有值
	//null 被转换为0
	$var = null;
	echo "<br>";
	echo $int + $var;  //1
	/*不同类型之间的条件判定*/
	//   ><  >=   <=   ! == === != !==
	//数字与字符串的条件判定
	$str = "caicai";
	$int = 0;
	//0 =="0"
	if($int == $str){
		echo "<br>";
		echo "==";
	}else{
		echo "!=";
	}
	//如果要严格比较两个变量,那么需要使用全等符,全等符不仅需要两个变量值相等,并且要求两个变量类型一致 
	if($int === $str){
		echo "==";
	}else{
		echo "<br>";
		echo "!=";
	}
	//一个字符串在条件判断为true
	//一个空值的字符串在条件判断里为false
	//null值为false
	//一个数字为true,特例:0为false
	//一个为0值字符串为false,即"0"
	//empty()包含了上面的判定规则,
	//如果一个变量的布尔值为false,empty返回true
	$variable = 0;
	if(empty($variable)){
		echo "<br>";
		echo "true,为空,布尔值为false";
	}else{
		echo "<br>";
		echo "false,不为空";
	}
	//empty()经常与isset()放在一起
	//isset一个变量已定义并且有值为true
	//针对未定义的变量
	if(empty($var111)){
		echo "<br>";
		echo "true";
	}else{
		echo "<br>";
		echo "false";
	}
	echo "<br>";
	if(isset($var111)){
		echo "true";
	}else{
		echo "false";
	}
	//针对0  empty - true   isset - true
	//针对 "0"  empty  - true    isset- true
	//针对  true  empty-false   isset -  true
	//针对 null empty-true   isset -  false
	//针对 "" empty-true   isset -  true
	//总结:  empty 判定一个变量结果是否为true,取决于变量是否未定义,或者值为0,"0",false,null,"";
	//总结:  isset只要变量已定义并且值不为null,返回的是true
	echo "<br>"; 
	$var = "";
	if(empty($var)){
		echo "true";
	}else{
		echo "false";
	}
	if(isset($var)){
		echo "true";  
	}else{
		echo "false";
	}
?>