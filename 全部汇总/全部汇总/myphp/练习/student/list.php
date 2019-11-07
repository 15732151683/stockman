<?php
include "../common/init.php";//加载初始化文件
$studentModel = new StudentModel($newdb);
//include "../conf/dbconfig.php";
//include "mysqldriver.class.php";
//include "../php_mysql/connect.php";
//使用mysql对象实现
//将来账号密码什么的修改 只要在配置文件里面修改就OK啦,不用功能php文件修改
//$newdb = new MysqlDriver($host,$user,$password,$database);
//$sql ="SELECT * FROM regfrm";
//var_dump($datas);
//$countSql = "select count(stu_id) from regfrm";
//$countResult = mysqli_query($link, $countSql);
//$count = mysqli_fetch_array($countResult, MYSQLI_NUM);
//$total = $count[0];//count(id)在sql语句中是第一个字段,也就是下标为0
//$totalStudent = $newdb->selectOne("regfrm","count(*) as num","","","");
$totalStudent = $studentModel->getCount("");
print_r($totalStudent);
$pageSize = 5;
$allPages = ceil($totalStudent / $pageSize);
$pageIndex =(empty($_GET['pageIndex']))?1:$_GET['pageIndex'];
$start = ($pageIndex - 1)*$pageSize;
//所有的学生
//limit
$limit = array($start,$pageSize);
$datas = $newdb->select("regfrm","*","","",$limit);
//除了将学生信息传到前台,还要传递总页数,pagesize
$_datas = array(
	'data'=>$datas,
	'allPages'=>$allPages,
	'pageSize'=>$pageSize
);
//$sql ="SELECT * FROM regfrm limit $start, $pageSize";
//$result = mysqli_query($link, $sql);
//$datas = mysqli_fetch_all($result);
//$datas = $newdb->select("regfrm","*","","","");
echo json_encode($_datas);
//编辑页面的PHP

//删除页面的PHP
?>