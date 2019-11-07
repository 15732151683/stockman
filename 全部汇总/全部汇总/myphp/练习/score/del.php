<?php
//删除
include "mysqldriver.class.php";
$newdb = new MysqlDriver("localhost","root","","score");
$id = $_GET['id'];
$newdb->delete("score","id=".$id);
echo "学号".$id."的学生成绩删除成功";
?>