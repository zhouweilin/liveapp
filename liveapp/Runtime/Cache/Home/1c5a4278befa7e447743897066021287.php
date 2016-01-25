<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html lang="zh-cn">
<head>
<meta charset="utf-8">
<link href="/Public/css/global.css" rel="stylesheet" type="text/css">
<title>微杂志管理</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>

<body>
<div class="app-list-wrapper" data-mid="<?php echo ($mid); ?>">
	<header class="app-list-header">
		<a href="http://www.hithinktank.com/" target="_blank" class="logo"></a>
		<a href="javascript:;" class="exit">退出登录</a>
		<a href="javascript:;" class="add">添加一个微杂志</a>
		<a href="javascript:;" class="create">创建一个微杂志</a>
		<a href="javascript:;" class="manage">用户管理</a>
	</header>
	<div class="app-list-box">
		<ul></ul>
	</div>
</div>
<script src="/Public/js/jquery-2.1.1.min.js"></script>
<script src="/Public/js/plugin/jquery.scrollbar-3.1.11.min.js"></script>
<script src="/Public/js/plugin/jquery.qrcode.min.js"></script>
<script src="/Public/js/appmaker.lib-1.0.0.dev.js"></script>
<script src="/Public/js/appmaker-1.0.0.dev.js"></script>
<script>
	window.onload = function () {
		var list = new Maker.List(1);
		$(".app-list-box").mCustomScrollbar({
			theme : 'dark',
			scrollInertia : 50
		});
	}
</script>
</body>
</html>