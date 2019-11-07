<?php
/**
  * wechat php test
  */
//接收用户的消息或事件，并返回信息
//接收用户发送的xml数据
$xml = file_get_contents("php://input");
//将xml解析成对象
$obj = simplexml_load_string($xml);
//用户向谁发的
$toUserName = $obj -> ToUserName;
//用户自己的id
$fromUserName = $obj -> FromUserName;
//用户发过来的信息类型（文本信息，音频，事件推送）
$msgType = $obj -> MsgType;
//文本信息内容
$content = $obj -> Content;
//获取推送事件的类型
$event = $obj -> Event;
//获取事件的key
$eventKey = $obj -> EventKey;




if($content == '叫爸爸'){
	//返回一个文本信息
	$xml = <<<AAA
	<xml> 
	<ToUserName><![CDATA[$fromUserName]]></ToUserName>
	<FromUserName><![CDATA[$toUserName]]></FromUserName>
	<CreateTime>$time</CreateTime> 
	<MsgType><![CDATA[text]]></MsgType> 
	<Content><![CDATA[爸爸]]></Content> 
	</xml>
AAA;
	echo $xml;
}else if($event == 'CLICK' && $eventKey == "V1001_TODAY_MUSIC"){
	$xml = <<<AAA
	<xml> 
	<ToUserName><![CDATA[$fromUserName]]></ToUserName>
	<FromUserName><![CDATA[$toUserName]]></FromUserName>
	<CreateTime>$time</CreateTime> 
	<MsgType><![CDATA[text]]></MsgType> 
	<Content><![CDATA[点一下，玩一年]]></Content> 
	</xml>
AAA;
	echo $xml;
}else if($content == "图文消息"){
	//返回图文消息
	$time = time();
	echo <<<AAA
	<xml>
	<ToUserName><![CDATA[$fromUserName]]></ToUserName>
	<FromUserName><![CDATA[$toUserName]]></FromUserName>
	<CreateTime>$time</CreateTime>
	<MsgType><![CDATA[news]]></MsgType>
	<ArticleCount>2</ArticleCount>
	<Articles>
	<item>
	<Title><![CDATA[《Megalo box》热映中]]></Title> 
	<Description><![CDATA[哔哩哔哩独播]]></Description>
	<PicUrl><![CDATA[http://flystone.applinzi.com/megalo_box.jpg]]></PicUrl>
	<Url><![CDATA[https://www.bilibili.com/bangumi/media/md79472/]]></Url>
	</item>
	<item>
	<Title><![CDATA[菜鸡直播中]]></Title>
	<Description><![CDATA[菜鸡一号已经上线]]></Description>
	<PicUrl><![CDATA[http://flystone.applinzi.com/1.png]]></PicUrl>
	<Url><![CDATA[https://www.huya.com/15427574]]></Url>
	</item>
	</Articles>
	</xml>
AAA;

}








//define your token
define("TOKEN", "ShiTianShu");
$wechatObj = new wechatCallbackapiTest();
$wechatObj->valid();


class wechatCallbackapiTest
{
	public function valid()
    {
        $echoStr = $_GET["echostr"];

        //valid signature , option
        if($this->checkSignature()){
        	echo $echoStr;
        	exit;
        }
    }

    public function responseMsg()
    {
		//get post data, May be due to the different environments
		$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];

      	//extract post data
		if (!empty($postStr)){
                /* libxml_disable_entity_loader is to prevent XML eXternal Entity Injection,
                   the best way is to check the validity of xml by yourself */
                libxml_disable_entity_loader(true);
              	$postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
                $fromUsername = $postObj->FromUserName;
                $toUsername = $postObj->ToUserName;
                $keyword = trim($postObj->Content);
                $time = time();
                $textTpl = "<xml>
							<ToUserName><![CDATA[%s]]></ToUserName>
							<FromUserName><![CDATA[%s]]></FromUserName>
							<CreateTime>%s</CreateTime>
							<MsgType><![CDATA[%s]]></MsgType>
							<Content><![CDATA[%s]]></Content>
							<FuncFlag>0</FuncFlag>
							</xml>";             
				if(!empty( $keyword ))
                {
              		$msgType = "text";
                	$contentStr = "Welcome to wechat world!";
                	$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
                	echo $resultStr;
                }else{
                	echo "Input something...";
                }

        }else {
        	echo "";
        	exit;
        }
    }
		
	private function checkSignature()
	{
        // you must define TOKEN by yourself
        if (!defined("TOKEN")) {
            throw new Exception('TOKEN is not defined!');
        }
        
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        		
		$token = TOKEN;
        // 将token、timestamp、nonce三个参数进行字典序排序 
		$tmpArr = array($token, $timestamp, $nonce);
        // use SORT_STRING rule
		sort($tmpArr, SORT_STRING);
        // 将三个参数字符串拼接成一个字符串进行sha1加密
		$tmpStr = implode( $tmpArr );
		$tmpStr = sha1( $tmpStr );
		//开发者获得加密后的字符串可与signature对比，标识该请求来源于微信


		if( $tmpStr == $signature ){
			return true;
		}else{
			return false;
		}
	}
}

?>