<?php
include "../student/mysqldriver.class.php";
$newdb = new MysqlDriver("localhost","root","","score");
$totalStudent = $newdb->selectOne("score","count(*) as num","","","");
$pageSize = 5;
$allPages = ceil($totalStudent['num'] / $pageSize);
$pageIndex =(empty($_GET['pageIndex']))?1:$_GET['pageIndex'];
$start = ($pageIndex - 1)*$pageSize;
$limit = array($start,$pageSize);
$datas = $newdb->select("score","*","","",$limit);
$_datas = array(
	'data'=>$datas,
	'allPages'=>$allPages,
	'pageSize'=>$pageSize
);
echo json_encode($_datas);
?>