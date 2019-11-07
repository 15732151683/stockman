<?php
//即使使用的IP是同一台电脑的IP,使用
//http://localhost/与http://ip/仍会有跨域问题
//跨域问题是由浏览器的设置引起的
//跨域问题有2个解决方案
//1.后台输出特定的头部允许该服务器跨域访问
//2.前台使用jsonp请求
//前台传一个变量,这个变量的值是前台js中某个函数名
//根据前台传来的函数名,输出一个js的函数调用语句
//调用的参数就是一个json串
//这种方是称为jsonp
//jsonp的底层原理就是使用script标签的src属性加载接口

//$funcname = $_GET['callback'];
//$message = array("result"=>"ok");
//echo "$funcname(".json_encode($message).");";

//创建一个用户的数组
//二维数组(数据内容)
$users = array(
	"luxp"=>array("luxp",18,"男"),
	"caicai"=> array("caicai",30,"abnormal")
);
//约定传一个用户名过来
$username = $_GET["username"];
//默认的回调函数的参数名是callback  action是jsonp是指定的回调函数的参数名
$funcname = $_GET["action"];
//根据前端传来的username获得对应的用户名数据
$user = $users[$username];
echo "$funcname(".json_encode($user).");";
?>