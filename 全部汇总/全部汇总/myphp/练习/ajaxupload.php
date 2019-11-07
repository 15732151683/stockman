<?php
//if(!empty($_FILES)){
	//$_FILES['表单中的name值']
//	$result = move_uploaded_file($_FILES["file"]["tmp_name"],"../uploads/".$_FILES["file"]["name"]);//复制成功与否的布尔值
//	if($result){//如果move_uploaded_file成功了
//		$message = array("result"=>"../uploads/".$_FILES["file"]["name"]);
//		//输出一个图片标签
//		echo "<img src = \"".$message['result']."\">";  //返回的是字符串(文本),所以有变量的话,用拼接的方式
//	}else{
//			$message = '';
//	}
//}
//使用JSON输出
if(!empty($_FILES)){//提交了文件
	$result = move_uploaded_file($_FILES["file"]["tmp_name"],"../uploads/".$_FILES["file"]["name"]);  //复制到uploads里面,成功了的话会返回true,用result接收一下
	if($result){//如果上传到uploads里面成功啦
		$message = array("result"=>"../uploads/".$_FILES["file"]["name"]);  //就是前端要用的路径啦
		//输出json形式数据
		echo json_encode($message['result']);//把路径转为json格式
	}else{
		$message = array("result"=>"传个图片路径都传不上去的咩ㄟ( ▔, ▔ )ㄏ");
	}
}
?>