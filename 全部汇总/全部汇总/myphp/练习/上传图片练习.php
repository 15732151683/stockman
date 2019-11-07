<!--创建一个表单,包含一个文件域,可以实现多图片上传-->
<form action="" method="post" enctype="multipart/form-data">
	<!--关于action,如果action是空的表明当前的上传地址是一致的？？？？？？-->
	<input type="file" name="file[]" multiple="multiple"/><br>
	<input type="submit" value="提交"/>
</form>
<?php
//预习闭包

//提交的情况下
if(!empty($_FILES)){//上传啦
	//1.只能上传jpg(jpeg),gif,png类型图片
	//如果有不符合要求的文件,输出提示:禁止此类文件
	//print_r($_FILES["file"]);
	//echo "<br>";
	$pics = [];
	//规定数据存储格式
	//$pics[0]=第一张图片的信息
	//$pics[0]["name"] = 第一张图片的名字
	//$pics[1]=第二张图片的信息
	foreach($_FILES["file"] as $key=>$val){
		//print_r($key);
		//echo "<br>";
		//print_r($val);
		//echo "<br>";
		for($i = 0; $i < count($val);$i++){
			//根据扩展名
			if($key == "type"){
				if($val[$i]!="image/jpeg" || $val[$i]!="image/gif" ||$val[$i]!="image/png"){
					echo "禁止${$val[$i]}文件,请重新选择";
					return;
				}
			}
			$pics[$i][$key] = $val[$i];
		}
	}
	print_r($pics);
	echo "<br>";
		
	foreach($picsArr["type"] as $val){
		if($val != "image/jpeg" || $val !="image/gif"){
			echo "禁止${val}文件,请重新选择";
			return;
		}
	};
//将file这个数组,分解成多个数组,每个数组包含一个完整的上传文件信息
//👇的不是全局变量
	foreach($picsArr["name"] as $val){
		$name[] = $val;
	};
	foreach($picsArr["type"] as $val){
		$type[] = $val;
	};
	foreach($picsArr["tmp_name"] as $val){
		$tmp_name[] = $val;
	};
	foreach($picsArr["error"] as $val){
		$error[] = $val;
	};
	foreach($picsArr["size"] as $val){
		$size[] = $val;
	};
}
?>