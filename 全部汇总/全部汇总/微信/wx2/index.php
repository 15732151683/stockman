<?php
//网页授权分为2种：主要是为了获取用户信息
//第一种：静默模式
//1.1静默模式下没有任何效果
//1.2使用场景，只用于已关注用户之间的传播
//1.3一般慎用

//第二种：弹窗模式
//2.1会有弹窗提示，用户必须点击授权才能进行之后的浏览，如果没有，则默认退出
//2.2使用场景：大规模的宣传（轻游戏，邀请函，简历）
//2.3首选


//微信授权的步骤：
/* 1（用户在弹窗页是，点击了确定，同意授权之后）获取code值，用于获得access_token(与之前的不同，只用于用户授权，过期期限是7200，无使用次数限制)
 * 2使用第一步的code，获得access_token和openid
 * 3使用access_token和openid获得用户信息（只限于使用弹窗模式）
 * */
$code = $_GET['code'];
echo $code;

require "../common.php";

//第二部获得access_token和openid
//
$api = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$appid}&secret={$secret}&code={$code}&grant_type=authorization_code";
$res = httpGet($api);
$arr = json_decode($res,true);
//print_r($arr);

$access_token = $arr["access_token"];//用户授权的唯一凭证
$openid = $arr["openid"];//当前授权用户的openID

//第三步：拉去用户信息
$api = "https://api.weixin.qq.com/sns/userinfo?access_token={$access_token}&openid={$openid}&lang=zh_CN";
$res = httpGet($api);
$arr = json_decode($res,true);
print_r($arr);
?>