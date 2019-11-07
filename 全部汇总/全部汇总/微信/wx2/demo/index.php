<?php
	require "../common.php";
	//在用户授权后，获得code
	$code = $_GET["code"];
	//echo $code;
	//获取access_token和openid
	$api = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$appid}&secret={$secret}&code={$code}&grant_type=authorization_code";
	$res = httpGet($api);
	$arr = json_decode($res,true);
	//print_r($arr);
	$access_token = $arr["access_token"];
	$openid = $arr["openid"];
	
	//拉取用户信息
	$api = "https://api.weixin.qq.com/sns/userinfo?access_token={$access_token}&openid={$openid}&lang=zh_CN";
	$res = httpGet($api);
	$arr = json_decode($res,trun);
	//print_r($arr);
?>
<!DOCTYPE html>
<html lang="zh">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="X-UA-Compatible" content="ie=edge" />
	<title>Document</title>
	<style type="text/css">
		.btn{
			display: block;
			width:135px;
			height: 55px;
			background-color: cornflowerblue;
			color:#fff;
			text-decoration: none;
			line-height: 55px;
			text-align: center;
			border-radius: 5px;
			font-size: 25px;
			font-weight: 500;
		}
	</style>
</head>
<body>
	<a class="btn" href="javascript:void(0)">开始游戏</a>
	<button class="rank">获取排行榜</button>
	<table border="1px" cellspacing="" cellpadding="">
		<thead>
			<tr>
				<th>名次</th>
				<th>昵称</th>
				<th>头像</th>
				<th>历史最高分</th>
			</tr>
		</thead>
		<tbody class="list">
			<tr>
				<td>1</td>
				<td>哈哈</td>
				<td><img style="width: 50px;" src=""/></td>
				<td>100分</td>
			</tr>
		</tbody>
	</table>
</body>
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript">
	var btn = $(".btn");
	btn.on("click",function () {
		var score = rand(1000,10000);
		var openid = "<?php echo $openid ?>";
		var nickname = "<?php echo $arr['nickname'] ?>";
		var headimgurl = "<?php echo $arr['headimgurl'] ?>";
		//console.log(score,openid,nickname,headimgurl);
		$.ajax({
			url:"handle.php?act=sendScore",
			data:{
				score:score,
				openid:openid,
				nickname:nickname,
				headimgurl:headimgurl
			},
			success:function (data) {
				//console.log(data);
				var obj = JSON.parse(data);
				console.log(obj);
				if(obj.status == 1){
					alert("最高分数为"+obj.score);
				}
			}
		});
	})
	var rank = $(".rank");
	var list = $(".list");
	rank.on("click",function () {
		$.ajax({
			
			url:"handle.php?act=getRank",
			dataType:'json',
			success:function (obj) {
				//console.log(data);
				if(obj.status==1){
					list.html("");
					var data = obj.data;
					data.forEach(function (item,index) {
						var els = $(`<tr>
				<td>${index+1}</td>
				<td>${item.nickname}</td>
				<td><img style="width: 50px;" src="${item.headimgurl}"/></td>
				<td>${item.score}</td>
			</tr>`);
						list.append(els);
					})
				}
			}
		});
	})
	
	function rand (min,max) {
		return parseInt(Math.random()*(max-min+1)+min);
	}
</script>
</html>