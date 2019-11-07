
<!--首先建立一个表单,使用POST方法
	表单包含以下字段:
	用户名,用户性别(男,女),用户年龄,爱好(多选),简介
	对后台的要求,如果没有填写用户名,输出,请填写完整,最后将用户填写的信息,使用table表格输出-->
	<form action="" method="post">
		用户名:<input type="text" name="user" placeholder="用户名" required="required"/><br>
		性别:<input type="tetx" name="sex" id="sex" placeholder="性别"/><br>
		年龄:<input type="text" name="age" id="age" placeholder="年龄"/><br>
		兴趣爱好:<input type="checkbox" name="hobby" id="hobby" value=""/>movie
		<input type="checkbox" name="hobby[]" value="book" />book
		<input type="checkbox" name="hobby[]" value="game" />game
		<input type="checkbox" name="hobby[]" value="sing" />sing <br />
		<textarea name="intro" rows="20" cols="40"></textarea><br />
		<input type="submit" value="提交"/>
	</form>
	
<?php
	//使用empty判断是否为空
	//判定用户是否提交了biaodan
	print_r($_POST);
	if(!empty($_POST)){
		if(empty($_POST["user"])){
			echo "请输入用户名";
			echo "<br>";
		}else{
			?>
			<table>这里是信息综合
				<tr>
					<td>用户名</td>
					<td>性别</td>
					<td>年龄</td>
					<td>兴趣爱好</td>
					<td>介绍</td>
				</tr>
				<tr>
					<td><?=$_POST["user"]?></td>
					<td><?=$_POST["sex"]?></td>
					<td><?=$_POST["age"]?></td>
					<td><?php
						foreach($_POST["hobby"] as $val){
							echo $val."  ";
						}
						?>
					</td>
					<td><?=$_POST["intro"]?></td>
				</tr>
			</table>
			<?php
		}
	}
?>