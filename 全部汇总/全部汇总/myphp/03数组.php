<?php
//在JS里面分为数组与对象,在PHP中统一称为数组
//数组
$array = [1,2,3,4,5];//数组的下标是数字,php称为数字数组
//定义了一个数组,包含两个元素,下标分别是one,two,php将下标是字符串类型的数组称为关联数组
$array = array(
	'one' => "周一",
	'two' => "周二"
);
//获取数组的某个键值
echo $array['one']."<br>"; //输出键名为one的值
echo $array['two']."<br>"; //输出键名为two的值
//如何打印数组的信息
//print_r(),var_dump()
//1.print_r
print_r($array)."<br>";
var_dump($array)."<br>";//var_dump除了打印数组的结构,还会输出对应的类型信息
//获得数组的长度
//count()
echo count($array)."<br>";
//如何向数组添加元素
$array[0] = "hello world";
//相当于0-10之间的被删除了,但是下标还是10的呢
//$array[10] = "kaoa";
echo count($array)."<br>";
print_r($array)."<br>";
//一个数组可以同时包含数字数组与关联数组
//关联数组的元素数量不能影响数字数组的下标
$newArray = [];
print_r($newArray);
echo "<br>";
//如果不指定下标,会按照数组当前最大下标值+1设定
$newArray[] = 1;//下标为0
$newArray[] = 2;//下标为1   0+1
$newArray[] = 4;//下标为2   1+1
print_r($newArray);
echo "<br>";
$newArray[10] = 12;
$newArray["three"] = 13;//不影响数字下标
print_r($newArray);
echo "<br>";
$newArray[] = 5;//下标为11   10+1
///////////二维数组////////////
$newArray = array();  //=[]
$newArray[] = array(1,2,3); //数组的元素还是数组
$newArray[] = array(4,5,6);
var_dump($newArray);
echo "<br>";
//有两个用户,每个用户有3个属性: name,age,sex
//请用数组的方式表示
$user = array();
//第一个用户
$user[0] = array(
	"name" => "ciacia",
	"age" => 28,
	"sex" => "male"
);
$user[1] = array(
	"name" => "菜菜",
	"age" => 28,
	"sex" => "female"
);
var_dump($user);
?>