<?php
	require "wx.php";
	$token = refreshToken($link, $appid, $secret);
	//echo $token;
	//获取已关注公众号的用户列表，列表中存储的是openid
	//openid每个人都不一样
	//openid是由微信用户的微信号加密而成
	//openid对每个公众号都是不同的
//	$getUserListApi = "https://api.weixin.qq.com/cgi-bin/user/get?access_token={$token}";
//	$res = httpGet($getUserListApi);
//	$arr = json_decode($res,true);
//	var_dump($arr);


//	$getUserInfoApi = "https://api.weixin.qq.com/cgi-bin/user/info?access_token={$token}&openid=oHSC90ZmKSmSejGQUpyj1sJG-i_Q&lang=zh_CN";
//	$res = httpGet($getUserInfoApi);
//	$arr =json_decode($res,true);
//	var_dump($arr);
//	$nickname = $arr['nickname'];
//	echo $nickname;
//	$img = $arr['headimgurl'];
//	echo "<img src ='{$img}'>";

//	$data = '{"action":"long2short","long_url":"https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=%E5%BE%AE%E4%BF%A1&oq=%25E5%25BE%25AE%25E4%25BF%25A1%25E5%2585%25AC%25E5%2585%25B1%25E5%258F%25B7%25E5%25B9%25B3%25E5%258F%25B0&rsv_pq=da8e2db00002b166&rsv_t=d4eeG66WAAAYoz2HK0cwnH3C%2BAPEMB2xLo8irESPwulboDf%2BaXgRQDlTxXU&rqlang=cn&rsv_enter=1&rsv_sug3=6&rsv_sug1=6&rsv_sug7=100&rsv_sug2=0&inputT=1731&rsv_sug4=3346&rsv_sug=1"}';
//	$long2short = "https://api.weixin.qq.com/cgi-bin/shorturl?access_token={$token}";
//	$res = httpPost($data, $long2short);
//	$arr = json_decode($res,true);
//	var_dump($arr);
	
	$createMenu = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token={$token}";
	$data = <<<AAA
	 {
     "button":[
     {    
          "type":"click",
          "name":"今日歌曲",
          "key":"V1001_TODAY_MUSIC"
      },
      {
           "name":"菜单",
           "sub_button":[
           {    
               "type":"view",
               "name":"搜索",
               "url":"http://www.soso.com/"
            },
//          {
//               "type":"miniprogram",
//               "name":"wxa",
//               "url":"http://mp.weixin.qq.com",
//               "appid":"wx286b93c14bbf93aa",
//               "pagepath":"pages/lunar/index"
//           },
            {
               "type":"click",
               "name":"赞一下我们",
               "key":"V1001_GOOD"
            }]
       }]
 }
AAA;
$res = httpPost($data, $createMenu);
echo $res;
?>