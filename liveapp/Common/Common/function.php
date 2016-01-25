<?php
function is_mobile() {
	$_SERVER['ALL_HTTP'] = isset($_SERVER['ALL_HTTP']) ? $_SERVER['ALL_HTTP'] : '';
	$mobile_browser = '0';

	if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|iphone|ipad|ipod|android|xoom)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
		$mobile_browser++;
	}

	if ((isset($_SERVER['HTTP_ACCEPT'])) and (strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') !== false)) {
		$mobile_browser++;
	}

	if (isset($_SERVER['HTTP_X_WAP_PROFILE'])) {
		$mobile_browser++;
	}

	if (isset($_SERVER['HTTP_PROFILE'])) {
		$mobile_browser++;
	}

	$mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'],0,4));
	$mobile_agents = array('w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac','blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno','ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-','maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-','newt','noki','oper','palm','pana','pant','phil','play','port','prox','qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar','sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-','tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp','wapr','webc','winw','winw','xda','xda-');

	if (in_array($mobile_ua, $mobile_agents)) {
		$mobile_browser++;
	}

	if (strpos(strtolower($_SERVER['ALL_HTTP']), 'operamini') !== false) {
		$mobile_browser++;
	}
	// Pre-final check to reset everything if the user is on Windows
	if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'windows') !== false) {
		$mobile_browser = 0;
	}

	// But WP7 is also Windows, with a slightly different characteristic
	if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'windows phone') !== false) {
		$mobile_browser++;
	}

	if ($mobile_browser > 0) {
		return true;
	}else{
		return false;
	}
}

function is_weixin() { 
	if (strpos($_SERVER['HTTP_USER_AGENT'],'MicroMessenger') !== false) {
		return true;
	} else {
		return false;
	}
}

//以下方法为微信分享接口方法

function getSignPackage($appId,$appSecret,$url) {
	$jsapiTicket = getJsApiTicket($appId,$appSecret);
	//$url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	$timestamp = time();
	$nonceStr = createNonceStr();
	$url = str_replace('@','&',$url);
	// 这里参数的顺序要按照 key 值 ASCII 码升序排序
	$string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

	$signature = sha1($string);

	$signPackage = array(
	  "appId"     => $appId,
	  "nonceStr"  => $nonceStr,
	  "timestamp" => $timestamp,
	  "url"       => $url,
	  "signature" => $signature,
	  "rawString" => $string
	);
	return $signPackage; 
}

function createNonceStr($length = 16) {
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	$str = "";
	for ($i = 0; $i < $length; $i++) {
	  $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
	}
	return $str;
}

function getJsApiTicket($appId,$appSecret) {
	// jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
	$ticket = _ROOT_."/jsapi_ticket.json";
	//$data = json_decode(file_get_contents("jsapi_ticket.json"));
	$data = json_decode(file_get_contents($ticket));
	if ($data->expire_time < time()) {
	  $accessToken = getAccessToken($appId,$appSecret);
	  $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
	  $res = json_decode(httpGet($url));
	  $ticket = $res->ticket;
	  if ($ticket) {
		$data->expire_time = time() + 7000;
		$data->jsapi_ticket = $ticket;
		$fp = fopen($ticket, "w");
		fwrite($fp, json_encode($data));
		fclose($fp);
	  }
	} else {
	  $ticket = $data->jsapi_ticket;
	}

	return $ticket;
}

function getAccessToken($appId,$appSecret) {
	// access_token 应该全局存储与更新，以下代码以写入到文件中做示例
	$tokens = _ROOT_."/access_token.json";
	$data = json_decode(file_get_contents($tokens));
	if ($data->expire_time < time()) {
	  $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appId&secret=$appSecret";
	  $res = json_decode(httpGet($url));
	  $access_token = $res->access_token;
	  if ($access_token) {
		$data->expire_time = time() + 7000;
		$data->access_token = $access_token;
		$fp = fopen($tokens, "w");
		fwrite($fp, json_encode($data));
		fclose($fp);
	  }
	} else {
	  $access_token = $data->access_token;
	}
	return $access_token;
}

function httpGet($url) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_TIMEOUT, 500);
	curl_setopt($curl, CURLOPT_URL, $url);

	$res = curl_exec($curl);
	curl_close($curl);

	return $res;
}
?>