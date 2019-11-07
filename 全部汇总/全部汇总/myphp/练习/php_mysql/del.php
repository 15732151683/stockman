<?php
include "connect.php";
//删除
$sql = "delete from news where nvshen_id=".$_GET['id'];
mysqli_query($link,$sql);
//mysqli_affected_rows  --   对update及delete语句来说,当update或者delete成功时,返回被修改的条数或者被删除的条数
if(mysqli_affected_rows($link)>0){
	echo "删除成功";
}else{
	echo "删除失败";
}
?>
<a href="list.php">返回列表页面</a>