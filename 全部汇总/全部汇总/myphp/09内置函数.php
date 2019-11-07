<?php
//内置函数就是PHP已经直接编译好的内部函数,执行效率比用户自定义函数要高,所以如果能使用内置函数尽量使用内置函数
//字符串的内置函数
//echo print print_r
/*trim ,  ltrim(去除左边的指定字符),rtrim(去除右边的指定的字符)
 *去除首尾空白或者首尾指定的字符
 * */
$string= " asdf ";
$string = trim($string);
echo "[$string]"."<br>";
$string = "|asdf?";
$string = ltrim($string, "?");
echo $string."<br>";

/*substr($string,start,length)
 * start为正时,从首处向末尾计算start位置
 * start为负时,从末尾向首处计算start位置
 */
$string = "abcdefg";
echo substr($string, 3)."<br>";
echo substr($string, -3)."<br>";
echo substr($string, 2,2)."<br>";
//在utf-8中,汉字占3个字节,Unicode占两个字节,用substr去截取,只能截取字节长度,而不是字符的长度,如果截取2个字节,对于中文来说,就不完整了,显示为乱码
$string = "欢迎来到蓝鸥";
echo substr($string, 0, 2)."<br>";
//如果要截取多字节字符,需要使用mb_substr
echo mb_substr($string, 0, 2)."<br>";


/*字符串的替换
 *str_replace
 * */
$string = "JavaScript是世界上最好的语言,JavaScript可以开发强大的电商平台";
//把JavaScript全部替换成php
echo str_replace("JavaScript","php",$string)."<br>";

/*怎么在网上显示一段js,即<script></script>
 *htmlspecialchars
 * 将HTML中的<>字符转换成&lt;&gt;
 * */
$string = "<script>alert(0)</script>";
echo $string;   //这样是输不出标签的
$string = htmlspecialchars($string);
echo $string."<br>"."哈哈哈哈哈";
	/*添加反斜杠(\),转义符*/
	$string = "I'm a girl";
	echo addslashes($string)."<br>";
	
/*md5 -- 生成一个32位散列字符串
 *sha1 -- 生成一个40位的散列字符串
 * */
$password = "1234567890";
echo md5($password)."<br>";
echo sha1($password)."<br>";
	//strlen  ----  字符串的长度
echo strlen(md5($password))."<br>";
echo strlen(sha1($password))."<br>";
	
/*将一个字符串分割成数组  explode
 * 将一个数组拼接成字符串
 * implode
 * 讲一个数组转换成json
 * json_encode
 * */
$string = "吃,喝,玩,乐";
$hobby = explode(",",$string);
var_dump($hobby);
echo implode($hobby,"|")."<br>";
echo json_encode($hobby)."<br>";


/*数组的操作
 * sort -- 数组的排序
 * 数组的堆栈操作
 * array_shift ----将数组的第一个元素移出,并返回该元素值,索引值会被让出来被别的占用;而直接删除,索引值是空着的,不被占用
 * array_unshift ----将一个元素从数组开始位置压入(就是在头部添加元素)
 * array_pop ----将一个元素从数组的末尾弹出,并返回该元素
 * array_push  ----从数组的末尾压入一个元素
 * */
$array = [1,5,3,9,6,2,1,0];
sort($array);
//var_dump($array);

$array = ["a","b","c"];
$str = array_shift($array);
var_dump($array);
echo $str."<br>";
array_unshift($array,"f");
var_dump($array);
echo "<br>";
array_pop($array);
var_dump($array);
echo "<br>";
array_push($array,"z");
var_dump($array);


$stack = ["red","yellow","green","black"];
$pop = array_pop($stack);
print_r($stack);
print_r($pop);
array_push($stack,"a","e","e");
print_r($stack);



$arrayt = array(
"one"=>"green",
"two"=>"red",
"three"=>"yellow",
"four"=>"black"
);
$shift = array_shift($arrayt);
print_r($arrayt);
print_r($shift);
?>