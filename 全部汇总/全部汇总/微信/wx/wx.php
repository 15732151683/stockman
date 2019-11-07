<?php
require "common.php";

function getApi($appid,$secret){
	$api = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$appid}&secret={$secret}";
	//$res = file_get_contents($api);
	$res = httpGet($api);
	$arr = json_decode($res,true);
//	echo $res;
	$token = $arr["access_token"];
	return $token;
}
//echo getApi($appid, $secret);


/*
 * 第一步：先判断表中是否已存过token信息
 * 第二部：如果没有，通过API获取最新token，并插入
 * 第三部：如果有，查看表中token是否已过期，（如果当前时间-表中时间>7200，表示已过期）
 * 第四步：如果过期了，通过API来获取最新token，并更新
 * */
 
 function refreshToken($link,$appid,$secret){
 	$sql = "SELECT * FROM token";
	$res = mysqli_query($link, $sql);
	if($res && mysqli_num_rows($res)){
		echo "已存过";
		$now = time();
		$row = mysqli_fetch_assoc($res);
		if($now - $row["date"] > 7200){
			echo "已过期";
			$token = getApi($appid, $secret);
			$date = time();
			$sql = "UPDATE token SET token = '{$token}',date={$date}";
			$res = mysqli_query($link, $sql);
			if($res && mysqli_affected_rows($link)){
				echo "更新成功";
				return $token;
			}else{
				echo "更新失败";
			}
		}else{
			echo "没有过期";
			return $row["token"];
		}
	}else{
		echo "没存过";
		$token = getApi($appid, $secret);
		$date = time();
		$sql = "INSERT INTO token (token,date) VALUES ('{$token}',{$date})";
		$res = mysqli_query($link, $sql);
		if($res && mysqli_insert_id($link)){
			echo "插入成功";
			return $token;
		}else{
			echo "插入失败";
		}
	}
 }
// refreshToken($link, $appid, $secret);
 
?>






//<?php
//	//一般使用测试账号，因为权限多
//	require "common.php";
//	
//	function getApi($appid,$secret){
//		//
//		$api = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$appid}&secret={$secret}";
//		//$res = file_get_contents($api);
//		$res = httpGet($api);
//		
//		$arr = json_decode($res,true);
//		//echo $res;
//		$token = $arr["access_token"];
//		return $token;
//	
//	}
//	//echo getApi($appid,$secret);
//	
//	
//	
//	
//	
//	
//	
//	
//	/*第一步：先判断表中是否已存过token信息
//	 * 第二步：如果没有，就通过api获取最新的token，并插入
//	 * 第三步：如果有，查看表中token是否过期，（如果当前时间-表中时间>7200s，表示已经过期）
//	 * 第四步：如果过期了，通过API来获取最新的token，并更新
//	 */
//	function refreshToken($link,$appid,$secret){
//		$sql = "SELECT * FROM token";
//		
//		$res = mysqli_query($link,$sql);
//		//var_dump($res);
//		//var_dump(mysqli_num_rows($res));
//		if($res && mysqli_num_rows($res)){
//			echo ",已存过";
//			$now = time();
//			$row = mysqli_fetch_assoc($res);
//			if($now - $row["date"] > 7200){
//				echo "已过期";
//				$token = getApi($appid,$secret);
//				$date = time();
//				$sql = "UPDATE token SET token = '{$token}',date={$date}";
//				$res = mysqli_query($link,$sql);
//				if($res && mysqli_affected_rows($link)){
//					echo "更新成功";
//                  return $token;
//				}else {
//					echo "更新失败";
//				}
//			}else {
//				echo "没过期";
//             	return $row["token"];
//			}
//		}else {
//			echo ",没存过";
//			$token = getApi($appid,$secret);
//			$date = time();
//			$sql = "INSERT INTO token (token,date) VALUES ('{$token}',{$date})";
//			//echo $sql;
//			$res = mysqli_query($link,$sql);
//			if($res && mysqli_insert_id($link)){
//				echo ",插入成功";
//				return $token;
//			}else {
//				echo ",插入失败";
//			}
//		}
//	}
//	refreshToken($link,$appid,$secret);
//?>