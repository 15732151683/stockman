<?php
//php+mysql
//php如果需要操作MySQL,首先需要与MySQL服务器建立链接
//检查php是否支持mysql
//phpinfo();
$host = "127.0.0.1";
$user = "root";
$password = "";
$database = "nvshen";//数据库名
//mysqli_connect- 链接mysql数据库
//若链接成功 就会返回一个资源
$link = mysqli_connect($host,$user,$password,$database);
//mysqli_connect_errno  -- 是否发生错误
//无发生错误,返回0
//mysqli_connect_error    --  错误具体描述
if(mysqli_connect_errno($link)){
	echo mysqli_connect_error($link);
}else{
	echo "链接成功";
	//将编码设置为 uth8  否则输入中文是乱码
	mysqli_set_charset($link,"utf8");
}
//提交成功后 根据前端传来的参数 拼接
//关于主键(primary key),主键不能有重复的值 问题所在:在sql语句中直接指定了一个固定的id值,这种情况下就只能插入第一条,后面无法继续插入,所以一般我们不去人为的设定主键,而是将该字段设置为自增长;若没有设置为自增长,虽然在sql语句里面没有指定固定的值,但是,该主键因为没有设定自增长,所以他的值一直等于 0;!!!!!!!!!!!当删除一条记录的时候,表中其他记录的主键值不会变化,被删除的主键值会被一直保留着!!!!!!!!!!!
if(!empty($_POST)){
	$sql = "insert into `nvshen`.`nvshen` (name,age) values ('$_POST['name']','$_POST['age']')";
}
//执行
mysqli_query($link,$sql);
if(mysqli_errno($link)){
	echo mysqli_error($link);
}else{
	echo "执行成功";
}
?>
<!--女神表需要姓名与年龄-->
<form action="" method="post">
	女神姓名:<input type="text" name="name"/><br />
	女神年龄: <input type="text" name="age"/><br />
	<input type="submit" name="submit" value="提交" />
</form>