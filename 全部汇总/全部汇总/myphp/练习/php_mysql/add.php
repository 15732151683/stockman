<?php
//添加操作
//引入连接数据库文件
//include  --  把一个文件加载到当前目录  include 后面是导入文件的路径
include "connect.php";
//添加界面
if(!empty($_POST)){
	$name = $_POST['name'];
	$age= $_POST['age'];
	$sql = "insert into nvshen (name,age) values ('$name','$age')";
}
//执行
mysqli_query($link,$sql);
if(mysqli_errno($link)){
	echo mysqli_error($link);
}else{
	echo "执行成功";
}

if(!empty($_GET)){
	$ns_name = $_GET['ns_name'];
	$ns_age = $_GET['ns_age'];
	$funcname = $_GET['callback'];
	$ns_sql = "insert into nvshen (name,age) values ('$ns_name','ns_age')";
}
//执行
mysqli_query($link,$ns_sql);
if(mysqli_errno($link)){
	echo mysqli_error($link);
}else{
	echo "数据库添加成功";
}
$return = array("message"=>$message);
encho json_encode($return);
?>

<!--女神表需要姓名与年龄-->
<!--<form action="" method="post">
	女神姓名:<input type="text" name="name"/><br />
	女神年龄: <input type="text" name="age"/><br />
	<input type="submit" name="submit" value="提交" />
</form>-->