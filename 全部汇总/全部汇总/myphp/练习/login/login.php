<?php
//首页 需要登录
//实现登录
session_start();
include "../common/init.php";
//include "../model/student.model.php";
if(!empty($_POST)){
	$studentModel = new StudentModel($newdb);
	//登录只需要根据提交的用户名查询该用户信息,而不需要查询所有的用户
	$data = $studentModel->getOne("*","username='{$_POST['username']}'");
	//用户存在不存在
	if(empty($data)){
		echo "用户不存在";
	}elseif($_POST['password']!=$data['password']){
		//如果用户存在,验证密码是否一致
		echo "用户名与密码不匹配";
	}else{
		//登陆成功
		$_SESSION['user'] = array(
			'username'=>$data['username'],
			'name'=>$data['name']
		);
		echo "登录成功,<a href=\"index.php\">返回首页</a>";
	}
}
?>