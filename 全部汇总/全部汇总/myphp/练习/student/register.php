<?php
//链接数据库
error_reporting(E_ALL);
include "../lib/mysqldriver.class.php";
//实例化一个数据库类
$newdb = new MysqlDriver("127.0.0.1","root","","register");
include "../lib/upload.class.php";
if(!empty($_POST)){
	//notice,@是错误抑制符,
	@$name = $_POST['name'];
	$gender = $_POST['gender'];
	$college = $_POST['college'];
	$city = $_POST['city'];
	$age = $_POST['age'];
	//$funcname = $_POST['callback'];   //这是jsonp的方法
	if(!empty($_FILES)){
		//实例化
		$newUpload = new Upload("./","image/png",50000000);
		//要检测上传文件的类型否则黑客容易攻击的php也能上传
		//因为属性可以被外部直接访问
		//导致类的封装性失败
		//为了避免这种问题,我们需要控制属性与方法的可见性
		$pic= $newUpload->doUpload($_FILES['file']);
//		$result = move_uploaded_file($_FILES['file']['tmp_name'],"pic/".$_FILES['file']['name']);
		$error = "上传成功啦";
		if(!$pic){
			$error = $newUpload->error;
		}
	}
	$fields = array(
		'stu_id'=>'',
		'name'=>$name,
		'sex'=>$gender,
		'college'=>$college,
		'city'=>$city,
		'age'=>$age,
		'pic'=>$pic 
	);
//	function createInsertSql($fields,$table){
//		foreach($fields as $key=>$val){
//			//拼接字段部分
//			$_Fields[] = "`".$key."`";
//			//拼接字段值部分
//			$_Values[] = "'".$val."'";
//			$sql ="insert into ".$table." (".implode($_Fields,",").") values (".implode($_Values,",").")";
//		}
//		return $sql;
//	}
//	echo createInsertSql($fields,'regfrm');
	//写一个函数根据$fields拼接sql插入语句
	//$sql = "insert into `register`.`regfrm` (stu_id,name,sex,college,city,age,pic) values ('','$name','$gender','$college','$city','$age','$pic')";
	//执行mysql  ---   返回的是id
	$dataResult = $newdb->insert($fields,'regfrm');
	//$dataResult= mysqli_query($link, $sql);
	$message = array();
	if($dataResult){
		$message = array("result"=>"ok");
	}else{
		$message = array("result"=>"fail");
		echo mysqli_error($link);
	}
	//上传图片的错误信息
	$message['error'] = $error;
	echo json_encode($message);
}
?>