<?php
	$image = imagecreatetruecolor(200,100); //创建一个画布 宽200，高100
	$bgcolor = imagecolorallocate($image,255,200,200); //定义一种颜色
	imagefill($image,0,0,$bgcolor); //将颜色填充到画布上
	
	//随机生成四个字母或数字
	for($i=0;$i<4;$i++){
		$randSize = mt_rand(30,40);
		$randAngle = mt_rand(-20,20);
		$x = mt_rand(10,20)+$i*200/4;
		$y = mt_rand(40,60);
		$randColor = imagecolorallocate($image,0,0,0);
		$string = "abcdefghijklmnopqrstuvwxyz123456789";
		$randString = mb_substr($string,mt_rand(0,strlen($string)-1),1,'utf-8');
		imagettftext($image,$randSize,$randAngle,$x,$y,$randColor,"fonts/STXINGKA.ttf",$randString); //向图像写入文本
	}
	
	//随机生成干扰点元素
	for($i=0;$i<400;$i++){
		$randColor = imagecolorallocate($image,mt_rand(50,200),mt_rand(50,200),mt_rand(50,200));
		imagesetpixel($image,rand(0,199),rand(0,99),$randColor);
	}

	//随机生成干扰线元素
	for($i=0;$i<3;$i++){
		$randColor = imagecolorallocate($image,mt_rand(80,220),mt_rand(80,220),mt_rand(80,220));
		imageline($image,rand(0,199),rand(0,99),rand(0,199),rand(0,99),$randColor);
	}
	
	header('content-type:image/png'); //向浏览器输出图片头信息，告诉浏览器以图片形式显示
	imagepng($image); //输出图片
	imagedestroy($image); //销毁图片，释放图片所占的内存空间，避免后台资源消耗过大
?>