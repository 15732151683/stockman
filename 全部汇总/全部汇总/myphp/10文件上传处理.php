<?php
//文件上传处理
//$_FILES["tmp_name"]是一个临时的文件,当PHP程序结束后,他会被自动删除
//所以上传文件,需要在程序结束前,将临时文件拷贝到一个永久的路径,有两个方法:copy move_uploaded_file
//copy文件拷贝函数
//文件与文件夹是有权限控制的
//第一个参数是源文件,第二个参数是目标路径
//copy被move_uploaded_file取代
//move_uploaded_file只能拷贝经过上传的文件
copy("01.php","uploads/01.php");
//将上传的文件copy到uploads下
/*注意:  $_FILES  -- name: 是上传的文件名称可以放到第二个参数中
 *				---tmp_name:  是路径(临时路径),做第一个参数
 * */
if(!empty($_FILES)){
	//print_r($_FILES['files']);
	foreach($_FILES['files']["tmp_name"] as $key=>$val){
		move_uploaded_file($val,"uploads/".$_FILES["files"]["name"][$key]);
	};
}
?>
<form action="" method="post" enctype="multipart/form-data">
	<input type="file" name="files[]" id="file[]" value="" multiple="multiple"/><br>
	<input type="submit" value="提交"/>
</form>