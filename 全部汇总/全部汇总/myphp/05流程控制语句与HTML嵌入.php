<?php
//html与PHP嵌套使用
//$a = [1,3,4];
//var_dump($a);
$users = array(
	0 => array('lll','男','28'),
	1 => array('uuu','男','22'),
	2 => array('kk','男','22')
);
var_dump($users);
?>
<table>
	<tr>
		<td>姓名</td>
		<td>性别</td>
		<td>年龄</td>
	</tr>
	<?php
		$i= 0;
		//for语句的第一部分
		//for(;$i<count($users)-1;$i++){
		//开发模板必须要用的
		foreach($users as $key => $val){
			?>
	
	<tr>
		<td><?=$val[0]?></td>
		<!--要简洁一点-->
		<td><?=$val[1]?></td>     
		<td><?=$users[$key][2]?></td>
	</tr>
	<?php
	//第二部分
	}
	?>
</table>
<script type="text/javascript">
	//👇是经典错误
	//错在混淆了浏览器与服务器之间的区别
	//js在浏览器端执行
	//php部分在服务器端执行
	//js的变量不能直接给PHP使用
	//前端的任何代码
	var tr=	document.getElementsByTagName("tr");
for(var i=1;i<=2;i++){
for(var j=0;j<tr[i].getElementsByTagName("th").length;j++){
	tr[i].getElementsByTagName("th")[j].innerHTML=(<?=$users[i][j]?>);
	
};
	
	
};
</script>