<?php
//index.php 需要登录
session_start();
if(empty($_SESSION['user'])){
	?>
	<!--登录的提交方式使用POST方式,因为使用get方式,则可以通过url查看到密码,而浏览器通常会有浏览记录,当用户在公共场所登录,有可能导致密码泄露-->
	<form action="login.php" method="post">
		用户名:<input type="text" name="username" id="username" value=""><br />
		密码: <input type="password" name="password" id="password" value="" /><br />
		<input type="submit" value="立即登录"/>
	</form>
<?php
} 
else{
	?>
	欢迎<?=$_SESSION['user']['username']?>访问网站
<?php }
?>