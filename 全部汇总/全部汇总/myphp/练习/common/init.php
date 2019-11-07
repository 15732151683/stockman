<?php
//初始化
include "../conf/dbconfig.php";
include "../lib/mysqldriver1.class.php";
include "../model/model.class.php";
include "../model/student.model.php";
//include "../model/score.model.php";
$newdb = new MysqlDriver($host,$user,$password,$database);
?>