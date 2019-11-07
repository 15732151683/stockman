<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
	</head>
	<body>
		<!--scores - 学生成绩管理系统
			1.需要添加学生的成绩 - 每个学生有5个课程: js  php java python c++
			2.学生成绩列表,显示一行一个学生的成绩
		-->
		<form action="index.php" method="post" name="score"><br />
			<table>js:</table><input type="text" name="js" id="js" value="" /><br />
			<table>php:</table><input type="text" name="php" id="php" value="" /><br />
			<table>java:</table><input type="text" name="java" id="java" value="" /><br />
			<table>python:</table><input type="text" name="python" id="python" value="" /><br />
			<table>c++:</table><input type="text" name="c++" id="c++" value="" /><br />
			<input type="button" value="提交成绩"/> 
		</form>
		<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
		<script type="text/javascript">
			$(function() {
				$("input[type=button]").click(function() {
					//要取消submit的默认事件，提交表单，刷新页面，虽然能提交表单数据到数据库，但是页面立即刷新后，在调试的时候根本找不到PHP文件
//					event.preventDefault();
					var formData = new FormData(document.score);
					$.ajax({
						type: "post",
						url: "index.php?m=home&c=score&a=add",
						async: true,
						dataType:"json",
						processData:false,
						contentType:false,
						data: formData
					});
				});
			});
		</script>
	</body>
</html>