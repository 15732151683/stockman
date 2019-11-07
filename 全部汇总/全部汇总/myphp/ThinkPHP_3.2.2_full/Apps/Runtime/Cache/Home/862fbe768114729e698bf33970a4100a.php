<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
	</head>
	<body>
		<!--编辑界面-->
		<form action="" method="post" enctype="multipart/form-data" name="regfrm">
			姓名:<input type="text" name="name" value="<?php echo ($data["name"]); ?>"/><br />
			性别:男<input type="radio" name="gender" value="male" <?php if(($data["sex"]) == "male"): ?>checked="checked"<?php endif; ?>/>
				女:<input type="radio" name="gender" value="female" <?php if(($data["sex"]) == "female"): ?>checked="checked"<?php endif; ?>/><br />
			院系:
			<select name="college">
				<?php if(is_array($college)): $k = 0; $__LIST__ = $college;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($k % 2 );++$k;?><option value="<?php echo ($vo); ?>" <?php if(($vo) == $data['college']): ?>selected<?php endif; ?>><?php echo ($vo); ?></option><?php endforeach; endif; else: echo "" ;endif; ?>
			</select><br /> 
			城市:
			<select name="city">
				<?php if(is_array($city)): $k = 0; $__LIST__ = $city;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($k % 2 );++$k;?><option value="<?php echo ($vo); ?>" <?php if(($vo) == $data['city']): ?>selected<?php endif; ?>><?php echo ($vo); ?></option><?php endforeach; endif; else: echo "" ;endif; ?>
			</select><br /> 
			年龄: <input type="text" name="age" value="<?php echo ($data["age"]); ?>"/><br />
			上传头像: <input type="file" name="file" value="" /><br />
			<!--提交按钮类型改成button,  不能是submit-->
			<input type="hidden" name="id" value="{}" />
			<input type="button" value="注册学生信息"/> 
		</form>
		<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
		<script type="text/javascript">
			//获取id值
			var str = location.search;
			console.log(str.split("id=")[1]);
			$(function(){
				$("input[type=button]").click(function(){
					var dataForm = new FormData(document.regfrm);
//					$.ajax({
//						type:"post",
//						url:"index.php?m=home&c=student&a=update",
//						data: dataForm,
//						async:true
//					});
				});
			});
		</script>
	</body>
</html>