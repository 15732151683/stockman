<?php
//删除
include "mysqldriver.class.php";
//实例化数据驱动库
$newdb = new MysqlDriver("localhost","root","","register");
//找到对象的删除方法
//分析他需要哪些参数
$id = $_GET['id'];
$newdb->delete("regfrm","id=".$id);
echo "删除成功";
?>