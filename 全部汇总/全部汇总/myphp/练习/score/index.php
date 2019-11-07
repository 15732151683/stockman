<?php
error_reporting(E_ALL);
include "../common/init.php";
include "../model/score.model.php";
//$scoreModel = new ScoreModel($newdb);
$newdb = new MysqlDriver("127.0.0.1","root","","score");
include "../lib/upload.class.php";
if(!empty($_POST)){
	$js = $_POST['js'];
	$php = $_POST['php'];
	$java = $_POST['java'];
	$python = $_POST['python'];
	$c = $_POST['c++'];
}
$fields = array(
	'js'=>$js,
	'php'=>$php,
	'java'=>$java,
	'python'=>$python,
	'c'=>$c
);
$dataResult = $newdb->insert($fields,'score');
$totalStudent = $newdb->selectOne("score","count(*) as num","","","");
$datas = $newdb->select("score","*","","","");
$message = array();
if($dataResult){
	$message = array("result"=>"ok");
}else{
	$message = array("result"=>"fail");
	echo mysqli_error($link);
}
echo json_encode($datas);
?>