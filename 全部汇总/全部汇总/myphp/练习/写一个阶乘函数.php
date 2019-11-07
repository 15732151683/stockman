<?php
//输入一个正整数,返回他的阶乘
function jiechen($a){
	$result = 1;     //内部变量
	for($i = $a;$i >=1;$i--){
		$result*=$i;
	}
	return $result;    //👇这句话不再执行,return后面的代码不执行
	return $result+1;
}
echo jiechen(0);
?>