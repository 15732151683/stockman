<?php
/*
 * JSSDk允许微信内网页使用手机系统功能，如：拍照，地理定位，
 * 也可以使用微信本身功能，比图说，扫一扫，语音等
 * */
 $link = mysqli_connect(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB, SAE_MYSQL_PORT);
 if(mysqli_connect_errno($link)){
 	echo mysqli_connect_error($link);
 }
 require 'jssdk.php';
 $jssdk = new JSSDK("wx91c66d54135dd970","2f9d92d3c316b742f02e2a0b47c67bae",$link);
 $signPackage = $jssdk -> getSignPackage();
 var_dump($signPackage);
 
?>
<!DOCTYPE html>
<html lang="zh">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>Document</title>
	</head>
	<body>
		<h1>微信JSSDK测试页面</h1>
		<button id="choose">选择图片</button>
	</body>
	<!--引入微信JS文件-->
	<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" type="text/javascript" charset="utf-8"></script>
	<script>
//通过congig验证签名
wx.config({
	    debug: true,
	    appId: '<?php echo $signPackage["appId"];?>',
	    timestamp: <?php echo $signPackage["timestamp"];?>,
	    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
	    signature: '<?php echo $signPackage["signature"];?>',
	    jsApiList: [
	      	// 所有要调用的 API 都要加到这个列表中
	      	"onMenuShareTimeline",
      		"chooseImage",
      		"uploadImage",
      		"downloadImage",
    		]
  	});
  	//调用微信的js接口，wx.ready()
  	wx.ready(function(){
	    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	    //微信分享接口道朋友圈
	    wx.onMenuShareTimeline({
		    title: '震惊，闫广师哥竟然哭了，到底是道德的沦丧，还是...', // 分享标题
		    link: 'http://1.flystone.applinzi.com/demo/guide.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: 'http://1.flystone.applinzi.com/megalo_box.jpg', // 分享图标
		    success: function () {
		    // 用户确认分享后执行的回调函数
		    alert("分享成功");
		},
		cancel: function () {
		    // 用户取消分享后执行的回调函数
		    		alert("用户已经取消分享");
		    }
		});
		var choose = document.getElementById("choose");
		choose.onclick = function(){
			//选择图片
			wx.chooseImage({
				count: 4, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function (res) {
					//当点击完成按钮的回调
				var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					alert(localIds);
					//遍历选定的图片列表，并将其上传至微信服务器
					localIds.forEach(function(localId){
						wx.uploadImage({
							localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
							isShowProgressTips: 1, // 默认为1，显示进度提示
							success: function (res) {
							var serverId = res.serverId; // 返回图片的服务器端ID
							console.log(serverId);
							//下载到我们自己的服务器
							wx.downloadImage({
								serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function (res) {
								var localId = res.localId; // 返回图片下载后的本地ID
								var imgObj = document.createElement('img');
								imgObj.src = localId;
								document.getElementsByTagName('body')[0].appendChild(imgObj);
								}
							});
							
							}
						});
					});
				}
			});
		}
	})
	//接收验证config失败的信息
	wx.error(function(res){
	    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	    console.error(res);
	});
	//获取分享朋友圈接口 

	</script>
</html>