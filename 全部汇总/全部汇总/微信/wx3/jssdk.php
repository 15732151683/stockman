<?php
class JSSDK {
  private $appId;
  private $appSecret;

  public function __construct($appId, $appSecret,$link) {
    $this->appId = $appId;
    $this->appSecret = $appSecret;
	$this->_link = $link;
  }

  public function getSignPackage() {
    $jsapiTicket = $this->getJsApiTicket();

    // 注意 URL 一定要动态获取，不能 hardcode.
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

    $timestamp = time();
    $nonceStr = $this->createNonceStr();

    // 这里参数的顺序要按照 key 值 ASCII 码升序排序
    $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

    $signature = sha1($string);

    $signPackage = array(
      "appId"     => $this->appId,
      "nonceStr"  => $nonceStr,
      "timestamp" => $timestamp,
      "url"       => $url,
      "signature" => $signature,
      "rawString" => $string
    );
    return $signPackage; 
  }

  private function createNonceStr($length = 16) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $str = "";
    for ($i = 0; $i < $length; $i++) {
      $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $str;
  }

//private function getJsApiTicket() {
//  // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
//  $data = json_decode($this->get_php_file("jsapi_ticket.php"));
//  if ($data->expire_time < time()) {
//    $accessToken = $this->getAccessToken();
//    // 如果是企业号用以下 URL 获取 ticket
//    // $url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=$accessToken";
//    $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
//    $res = json_decode($this->httpGet($url));
//    $ticket = $res->ticket;
//    if ($ticket) {
//      $data->expire_time = time() + 7000;
//      $data->jsapi_ticket = $ticket;
//      $this->set_php_file("jsapi_ticket.php", json_encode($data));
//    }
//  } else {
//    $ticket = $data->jsapi_ticket;
//  }
//
//  return $ticket;
//}

  private function getJsApiTicket(){
  	//判断ticket是否存储，如果如则进行插入。反之判断是否过期，如果过期，则更新之，反之直接返回表中的ticket
  	$accessToken = $this -> getAccessToken();
  	$url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
  	$sql = "SELECT * FROM ticket WHERE id=1";
	echo $sql;
	$res = mysqli_query($this->_link, $sql);
	if($res && mysqli_num_rows($res)){
		echo "已存过";
		$data = mysqli_fetch_assoc($res);
		if(time() - $data['date'] > 7000){
			echo "已过期";
			$res = json_decode($this->httpGet($url),true);
			$ticket = $res['ticket'];
			$date = time();
			$sql = "UPDATE ticket SET ticket='{$ticket}',date={$date} WHERE id=1";
			$res = mysqli_query($this->_link, $sql);
			if($res && mysqli_affected_rows($this->_link)){
				echo "更新成功";
				return $ticket;
			}
		}else{
			echo "未过期";
			return $data['ticket'];
		}
	}else{
		echo "未存过";
		$date = time();
		$res = json_decode($this -> httpGet($url),true);
		$ticket = $res['ticket'];
		$sql = "INSERT INTO ticket (ticket,date) VALUES ('{$ticket}',{$date})";
		$res = mysqli_query($this->_link, $sql);
		if($res && mysqli_insert_id($this->_link)){
			echo "插入成功";
			return $ticket;
		}
	}
  }

//private function getAccessToken() {
//  // access_token 应该全局存储与更新，以下代码以写入到文件中做示例
//  $data = json_decode($this->get_php_file("access_token.php"));
//  if ($data->expire_time < time()) {
//    // 如果是企业号用以下URL获取access_token
//    // $url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=$this->appId&corpsecret=$this->appSecret";
//    $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
//    $res = json_decode($this->httpGet($url));
//    $access_token = $res->access_token;
//    if ($access_token) {
//      $data->expire_time = time() + 7000;
//      $data->access_token = $access_token;
//      $this->set_php_file("access_token.php", json_encode($data));
//    }
//  } else {
//    $access_token = $data->access_token;
//  }
//  return $access_token;
//}
  private function getAccessToken(){
  	//判断access_token是否存储，如果如则进行插入。反之判断是否过期，如果过期，则更新之，反之直接返回表中的token
  	$url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
  	$sql = "SELECT * FROM token WHERE tokenid=1";
	$res = mysqli_query($this->_link, $sql);
	if($res && mysqli_num_rows($res)){
		echo "已存过";
		$data = mysqli_fetch_assoc($res);
		if(time() - $data['date'] > 7000){
			echo "已过期";
			$res = json_decode($this->httpGet($url),true);
			$token = $res['access_token'];
			$date = time();
			$sql = "UPDATE token SET token='{$token}',date={$date} WHERE id=1";
			$res = mysqli_query($this->_link, $sql);
			if($res && mysqli_affected_rows($this->_link)){
				echo "更新成功";
				return $token;
			}
		}else{
			echo "未过期";
			return $data['token'];
		}
	}else{
		echo "位存过";
		$date = time();
		$res = json_decode($this -> httpGet($url),true);
		$token = $res['access_token'];
		$sql = "INSERT INTO token (token,date) VALUES ('{$token}',{$date})";
		$res = mysqli_query($this->_link, $sql);
		if($res && mysqli_insert_id($this->_link)){
			echo "插入成功";
			return $token;
		}
	}
  }

  private function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。
    // 如果在部署过程中代码在此处验证失败，请到 http://curl.haxx.se/ca/cacert.pem 下载新的证书判别文件。
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, true);
    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
  }

  private function get_php_file($filename) {
    return trim(substr(file_get_contents($filename), 15));
  }
  private function set_php_file($filename, $content) {
    $fp = fopen($filename, "w");
    fwrite($fp, "<?php exit();?>" . $content);
    fclose($fp);
  }
}

