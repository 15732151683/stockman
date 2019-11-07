<?php
if(empty($_COOKIE['status'])){
	setcookie("status",1);
	$_status = 1;
}else{
	$status = $_COOKIE['status'];
	$status++;
	@$_status++;
	setcookie("status",$status);
	//过期时间以秒计算time()表示当前时间
	setcookie("name","cuihua",time()+24*3600);
	
}
var_dump($_COOKIE);
echo "_status=".$_status;
?>