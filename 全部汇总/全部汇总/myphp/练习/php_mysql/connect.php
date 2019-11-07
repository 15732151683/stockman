<?php
//数据库连接
$host = "127.0.0.1";
$user = "root";
$password = "";
$database = "register";//数据库名
//mysqli_connect- 链接mysql数据库
//若链接成功 就会返回一个资源
$link = mysqli_connect($host,$user,$password,$database);
//mysqli_connect_errno  -- 是否发生错误
//无发生错误,返回0
//mysqli_connect_error    --  错误具体描述
if(mysqli_connect_errno($link)){
	echo mysqli_connect_error($link);
}else{//链接成功
	//将编码设置为 uth8  否则输入中文是乱码
	mysqli_set_charset($link,"utf8");
}
?>