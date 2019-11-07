<?php
//编辑
//编辑与添加的表单的区别,就是编辑表单会有默认值,默认值就是原来数据记录中的值,所以要编辑一定先要和获取原来的数据
//链接数据库
include "connect.php";
//当用户点击编辑链接时,id值会一起传过来,根据该id值可以提取到当前的记录
$sql = "select * from nvshen where nvshen = ".$_GET['id'];
echo $sql;
$result = mysqli_query($link,$sql);
//mysqli_fetch_all  --  从查询结果对象中返回全部记录
//mysqli_fetch_array   ---从查询结果对象中返回一条记录,指针指向下一条
//MYSQLI_ASSOC  -- 常量,返回的是数组,键名是表的字段名
//MYSQLI_NUM  --  返回的是一个数字数组,数字顺序就是字段在表中的顺序
$data = mysqli_fetch_array($result,MYSQLI_ASSOC);

?>
<form action="" method="post">
	女神姓名:<input type="text" name="name" value="<?=$data['name']?>"/><br />
	女神年龄: <input type="text" name="age" value="<?=$data['age']?>"/><br />
	<input type="submit" name="submit" value="修改"/>
</form>