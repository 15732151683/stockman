<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
	</head>
	<body>
		<table>
			<tr>
				<th>商品名称</th>
				<th>购买数量</th>
				<th>单价</th>
			</tr>
			<?php if(is_array($students)): $k = 0; $__LIST__ = $students;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($k % 2 );++$k;?><tr>
					<td><?php echo ($vo["name"]); ?></td>
					<td><?php echo ($_SESSION['cart'][$vo['stu_id']]); ?></td>
					<td><?php echo ($vo["sex"]); ?></td>
				</tr><?php endforeach; endif; else: echo "" ;endif; ?>
		</table>
	</body>
</html>