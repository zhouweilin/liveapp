<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html lang="zh-cn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<meta name="format-detection" content="telephone=no" />
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<link href="/Public/app/css/global.css" rel="stylesheet" type="text/css">
<link href="/Public/app/css/map.css" rel="stylesheet" type="text/css">
</head>

<body>
<div class="app-wrapper">
	<div class="app-container">
		<div class="app-page-content"></div>
	</div>
</div>
<script src="http://api.map.baidu.com/api?type=quick&ak=AB01W4B6xtmWXpRkICT50rkh&v=1.0"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script src="/Public/js/jquery-last.js"></script>
<script src="/Public/js/appmaker-1.0.0.dev.js"></script>
<script src="/Public/app/js/library-1.0.4.dev.js"></script>
<script src="/Public/app/js/application-last.js"></script>
<script>
var App;
window.onload = function() {
	App = new Maker.Init(localStorage.getItem('app-id'));
}
</script>
</body>
</html>