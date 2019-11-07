<?php
//数据库连接
	$link = mysqli_connect(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, SAE_MYSQL_PORT);
	mysqli_query($link, 'set names utf8');
	
	$act = $_GET["act"];
	switch ($act) {
		case 'sendScore':
			
		$score = $_GET['score'];
			$openid = $_GET['openid'];
			$nickname = $_GET['nickname'];
			$headimgurl = $_GET['headimgurl'];
		//1.先判断表中是否有当前用户(openID)
		//2.如果有，就拿本次提交的分数与表中的比较，如果这次提交分值的比较大，就进行更新，反之，不更新
		//3.如果没有，就进行插入
			$sql = "SELECT * FROM rank WHERE openid = '{$openid}'";
		
			$res = mysqli_query($link, $sql);
			if($res && mysqli_num_rows($res)){
				//echo "已存在";
				$arr = mysqli_fetch_assoc($res);//将res解析成关联数组
				if($score > $arr['score']){
					//echo "本次较大,可以储存";
					$sql = "UPDATE rank SET score='{$score}' WHERE openid='{$openid}'";
					$res = mysqli_query($link, $sql);
					if($res && mysqli_affected_rows($link)){
						//echo "更新成功";
						$data['status'] = 1;
						$data['errMsg'] = "更新成功";
						$data['score'] = $score;
						echo json_encode($data);//转成json字符串
					}else {
						//echo "更新失败";
						$data['status'] = 0;
						$data['errMsg'] = "更新失败";
						echo json_encode($data);//转成json字符串
					}
				}else {
					//echo "小，不需要";
					$data['status'] = 1;
					$data['errMsg'] = "数值比较小，无需更新";
					$data['score'] = $arr['score'];
					echo json_encode($data);//转成json字符串
				}
				
			}else {
				//echo "未存在";
				$sql = "INSERT INTO rank (score,openid,nickname,headimgurl) VALUES ('{$score}','{$openid}','{$nickname}','{$headimgurl}')";
				$res = mysqli_query($link, $sql);
				if($res && mysqli_insert_id($link)){
					//echo "插入成功";
					$data['status'] = 1;
					$data['errMsg'] = "插入成功";
					$data['score'] = $score;
					echo json_encode($data);//转成json字符串
				}else {
					//echo "插入失败";
					$data['status'] = 0;
					$data['errMsg'] = "插入失败";
					echo json_encode($data);//转成json字符串
				}
			}
			
			break;
		case 'getRank':
			$sql = "SELECT * FROM rank ORDER BY score DESC LIMIT 10";
			$res = mysqli_query($link, $sql);
			if($res && mysqli_num_rows($res)){
				$data['status'] = 1;
				$data['errMsy'] = "获取排行榜成功";
				while ($arr = mysqli_fetch_assoc($res)) {
					$arr2[] = $arr;
				}
				$data['data'] = $arr2;
				echo json_encode($data);
			}else {
				$data['status'] = 0;
				$data['errMsy'] = "获取排行榜失败";
				echo json_encode($data);
			}
			break;
		default:
			
			break;
	}
	
	
	
?>