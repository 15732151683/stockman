<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>

	<head>
		<meta charset="UTF-8">
		<title></title>
	</head>

	<body>
		<!--注册yemian-->
		<!--学生姓名:
			性别:
			院系:使用下拉列表
			城市:使用下拉列表
			年龄:
			上传头像
		-->
		<!--??????-->
		<!--form表单的value值还是要用中文(正确信息的值)的呢,数据库用的是value值-->
		<form action="" method="post" enctype="multipart/form-data" name="regfrm">
			姓名:<input type="text" name="name"/><br />
			性别:男<input type="radio" name="gender" value="male"/>
				女<input type="radio" name="gender" value="female"/><br />
			院系:
			<select name="college">
				<!--volist是框架自定义的一种标签,当模板经过后台输出后,这一段标签就不存在了,这种标签称为模板标签-->
				<?php if(is_array($college)): $k = 0; $__LIST__ = $college;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($k % 2 );++$k;?><option value="<?php echo ($vo); ?>"><?php echo ($vo); ?></option><?php endforeach; endif; else: echo "" ;endif; ?>
			</select><br /> 
			城市:
			<select name="city">
				<?php if(is_array($city)): $k = 0; $__LIST__ = $city;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($k % 2 );++$k;?><option value="<?php echo ($vo); ?>"><?php echo ($vo); ?></option><?php endforeach; endif; else: echo "" ;endif; ?>
			</select><br /> 
			年龄: <input type="text" name="age" /><br />
			上传头像: <input type="file" name="file" value="" /><br />
			<!--提交按钮类型改成button,  不能是submit-->
			<input type="button" value="注册学生信息"/> 
		</form>
		<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
		<script type="text/javascript">
			$(function() {
				$("input[type=button]").click(function() {
					//要取消submit的默认事件，提交表单，刷新页面，虽然能提交表单数据到数据库，但是页面立即刷新后，在调试的时候根本找不到PHP文件,如果同时submit也绑定了ajax,那么数据库中会提交2条数据
//					event.preventDefault();
					var formData = new FormData(document.regfrm);
					$.ajax({
						type: "post",
						url: "index.php?m=home&c=student&a=add",
						async: true,
						dataType:"json",
						processData:false,
						contentType:false,
						data: formData,
						success:function(data){
							alert(data.result);
							alert(data.error);
						}
					});
				});
			});
		</script>
	</body>

</html>