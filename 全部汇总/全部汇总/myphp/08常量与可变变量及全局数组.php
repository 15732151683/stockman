<?php
//常量
//常量就是在程序执行过程保持不变
//定义一个常量,常量前面不需要$
//常量可以直接在函数内部使用
define("constVar", 10);
echo constVar;
function sum($a){
	return $a + constVar;
}
//echo sum(1);
//可变变量
$hello = "hello world";
$var = "hello";
//首先取出$var的值为hello, 然后hello与最前面一个$结合为$hello,就能取出该变量的值啦
echo $$var;   //输出hello world
//可变变量也可以使用在函数
$a = function(){echo "A";};
$b = "a";
//$b = a => $$b = $a;
$$b();
//超全局数组
//$_SERVER - 这个数组里面包含的是当前服务器运行脚本的一些信息,比如客户端的IP,运行的脚本的文件名
//$_SESSION与$_COOKIE  -   这个用于登录身份验证与访问信息保存
//$_GET,$_POST,$_FILES
//$_GET传参  --  通过url加上问号,参数以键值对形式拼接,多个参数用&隔开,对这种传参方式,后台使用$_GET数组接受
//$_GET数组的键名为url上对应的参数名
//print_r($_SERVER);
//print_r($_GET);

//$_POST  -  接受使用post方式提交的数据
//print_r($_POST);
//$_FILES - 接受上传的文件
//$_FILES - 一个二维数组,第一维的键名就是表单文件域的name值,  第二维有:name - 上传的文件的原来的文件名,type - 上传的文件的类型,  tmp_name - 文件上传后,在服务器上的临时文件路径(注意是服务器上哦),  size--文件大小,error -  上传的错误信息,如果上传没有发生错误,改值为0
print_r($_FILES);
//$_GET, $_POST,$FILES是接受前台传递数据的三种方法,这三个可以同时存在
?><a href="?param1=1&param2=2&param3=3">链接</a>
<!--上传file,一定要把enctype 改一改-->
<form action="" method="post" enctype="multipart/form-data">
	<!--name值为键名,输入框里面的文本为键值-->
	<input type="text" name="param1"/></br>
	<input type="text" name="param2"/></br>
	<!--复选框 name一致,并且为数组-->
	<input type="checkbox" name="param3[]" value="val1" />
	<input type="checkbox" name="param3[]" value="val2" /></br>
	<input type="file" name="file[]" multiple="multiple"/></br>
	<!--<input type="file" name="file" multiple="multiple"/></br>-->
	<input type="submit" name="submit" value="提交"/>
</form>