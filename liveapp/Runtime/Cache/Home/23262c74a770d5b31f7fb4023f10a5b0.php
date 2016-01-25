<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>创建微杂志</title>
	<link href="/Public/css/global.css" rel="stylesheet" type="text/css">
</head>
<body>
<nav class="maker-nav fz">
	<a href="/?c=admin">首页</a>
	<b class="current">基本配置</b>
	<b>详细配置</b>
	<button type="button" class="clearData">清除临时数据</button>
</nav>
<div class="maker-create-wrapper">
	<div class="create-wrap">
		<header>
			<b class="icon create">
				<i></i>
			</b>
			<h2>创建微杂志</h2>
		</header>
		<article>
			<div class="app-cfg">
				<ul>
					<li>
						<span>
							<b>*</b>
							杂志名称：
						</span>
						<label>
							<input data-mode="app" data-notice="填写杂志名称" type="text" name="name">
						</label>
					</li>
					<li>
						<span>
							<b>*</b>
							杂志页数：
						</span>
						<label>
							<input data-mode="app" data-notice="填写杂志页数" type="number" name="page" min="3">
						</label>
						<s>杂志页数至少要求3页</s>
					</li>
					<li>
						<span>
							<b>*</b>
							杂志封面：
						</span>
						<figure data-cover="cover" class="cover">
							<input data-mode="app" data-notice="上传杂志封面" type="file" name="cover" single accept="image/png,image/jpeg">
							<a class="uploadBtn" href="javascript:;">
								<i></i>
								<i></i>
							</a>								
						</figure>
						<s>尺寸为320*505,支持JPG/PNG</s>
					</li>
					<li>
						<span>
							<b>*</b>
							杂志标题：
						</span>
						<label>
							<input data-mode="module-wechat-share" data-notice="填写杂志标题" type="text" name="title">
						</label>
						<s>微信分享里显示的标题</s>
					</li>
					<li>
						<span>
							<b>*</b>
							分享封面：
						</span>
						<figure data-cover="img" class="share">
							<input data-mode="module-wechat-share" data-notice="上传分享封面" type="file" name="img" single accept="image/png,image/jpeg">
							<a class="uploadBtn" href="javascript:;">
								<i></i>
								<i></i>
							</a>								
						</figure>
						<s>微信分享时显示的封面，尺寸为320*320,支持JPG/PNG</s>
					</li>
					<li>
						<span>
							<b>*</b>
							分享描述：
						</span>
						<label>
							<textarea data-mode="module-wechat-share" data-notice="填写分享描述" name="desc"></textarea>
						</label>
						<s>微信分享里显示的描述</s>
					</li>
					<li>
						<span>
							<b>*</b>
							电脑端跳转：
						</span>
						<label>
							<input data-mode="app" data-notice="填写PC端跳转地址" type="text" name="pcurl">
						</label>
						<s>电脑端打开时跳转的页面地址，不需要输入“http://”</s>
					</li>
					<li>
						<span>
							<b>*</b>
							移动端跳转：
						</span>
						<label>
							<input data-mode="app" data-notice="填写移动端跳转地址" type="text" name="wapurl">
						</label>
						<s>移动端非微信打开时跳转的页面地址，不需要输入“http://”</s>
					</li>
					<li>
						<span>
							<b>*</b>
							归属分类：
						</span>
						<label>
							<select data-mode="app" name="type"></select>
							<i></i>
						</label>
						<s>微杂志的所属分类</s>
					</li>
				</ul>
			</div>
		</article>
		<footer>
			<input type="button" class="nextBtn" value="下一步">
		</footer>
	</div>
</div>
<script src="/Public/js/jquery-2.1.1.min.js"></script>
<script src="/Public/js/plugin/jquery.scrollbar-3.1.11.min.js"></script>
<script src="/Public/js/appmaker.lib-1.0.0.dev.js"></script>
<script src="/Public/js/appmaker-1.0.0.dev.js"></script>
<script>
	var maker;
	window.onload = function () {
		maker = new Maker.Create(Lib.request('appid'));
		$(".maker-create-wrapper").mCustomScrollbar({
			theme : 'dark',
			scrollInertia : 50
		});
	}
</script>
</body>
</html>