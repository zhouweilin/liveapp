<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>配置轻应用</title>
	<link href="/Public/css/global.css" rel="stylesheet" type="text/css">
</head>
<body>
<nav class="maker-nav fz">
	<a href="/?c=admin">首页</a>
	<a href="javascript:history.go(-1);">基本配置</a>
	<b class="current">详细配置</b>
	<button type="button" class="preview">预览</button>
</nav>
<div class="maker-config-wrapper">
	<aside class="maker-pages-list">
		<div class="maker-pages-thumb">
			<ul></ul>
		</div>
		<a href="javascript:;" class="add">
			<b>
				<i></i>
				<i></i>
			</b>
			增加一页
		</a>
	</aside>
	<div class="maker-simulator-wrap">
		<div class="maker-simulator">
			<h1></h1>
			<div class="maker-preview"></div>
		</div>
	</div>
	<aside class="maker-config-wrap">
		<div class="app-basic-config">
			<dl class="bg-cfg" data-show="true">
				<dt><b><i></i><i></i></b>色彩选项</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>背景颜色：</span>
							<label>
								<input type="button" data-sort="other" data-mode='bg' name="color">
								<b>
									<em></em>
								</b>
							</label>
							<s>页面的背景颜色</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="loader-cfg">
				<dt><b><i></i><i></i></b>组图加载设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>是否循环加载：</span>
							<label>
								<select data-sort="module" data-mode='loader' name="loop">
									<option value="false" selected>否</option>
									<option value="true">是</option>
								</select>
								<i></i>
							</label>
							<s>图片是否循环加载，推荐为“否”</s>
						</li>
						<li class="clearfix">
							<span>组图加载方式：</span>
							<label>
								<select data-sort="module" data-mode='loader' name="thread">
									<option value="2" selected>多线程</option>
									<option value="1">单线程</option>
								</select>
								<i></i>
							</label>
							<s>图片的加载方式，推荐为“多线程”</s>
						</li>
						<li class="clearfix">
							<span>首次下载页数：</span>
							<label>
								<input type="number" data-sort="module" data-mode='loader' name="first" min="1" value="2">
							</label>
							<s>首次下载的页数，不得超过页面总数，必须大于0，默认为“2”</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="process-loader-cfg">
				<dt><b><i></i><i></i></b>加载器设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>动画过渡时间：</span>
							<label>
								<input type="number" data-sort="module" data-mode='process-loader' name="time" min="100" max="1000" value="300">
							</label>
							<s>加载进度条过渡时间，单位：毫秒，默认为“300”</s>
						</li>
						<li class="clearfix">
							<span>加载器背景色：</span>
							<label>
								<input type="button" data-sort="module" data-mode='process-loader' name="color">
								<b>
									<em></em>
								</b>
							</label>
							<s>加载器的背景颜色</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="swiper-swiper-cfg">
				<dt><b><i></i><i></i></b>滑动器设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>滑动效果：</span>
							<label>
								<select data-sort="module" data-mode='swiper-swiper' name="effect">
									<option value="translate">联动式叠加</option>
									<option value="scale">联动式缩放</option>
									<option value="cover" selected>固定式叠加</option>
									<option value="rotateX">联动式变形缩放</option>
									<option value="push">推出</option>
								</select>
								<i></i>
							</label>
							<s>竖向滑动页面的效果，默认为“固定式叠加”</s>
						</li>
						<li class="clearfix">
							<span>动画过渡时间：</span>
							<label>
								<input data-sort="module" data-mode='swiper-swiper' type="number" name="time" min="100" max="1000" value="300">
							</label>
							<s>页面滑动手指结束的动画运行时间，不宜过长，单位：毫秒，默认为“300”</s>
						</li>
						<li class="clearfix">
							<span>滑动回弹值：</span>
							<label>
								<input data-sort="module" data-mode='swiper-swiper' type="number" name="maxBounce" min="10" value="50" max="100">
							</label>
							<s>页面滑动手指结束时，如果页面大于此值时交执行翻页，否则页面将还原，单位为像素，必须不小于10，默认为“50”</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="swiper-pagination-cfg">
				<dt><b><i></i><i></i></b>页面分页设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>启用页面分页：</span>
							<label>
								<select name="enable" data-sort="module" data-mode='swiper-pagination'>
									<option value="true">启用</option>
									<option value="false" selected>不启用</option>
								</select>
								<i></i>
							</label>
							<s>不启用分页将不显示分页标识，默认为“启用”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>分页标识高度：</span>
							<label>
								<select name="full" data-sort="module" data-mode='swiper-pagination'>
									<option value="false" selected>自动</option>
									<option value="true">满屏</option>
								</select>
								<i></i>
							</label>
							<s>当启用页面分页时，分页标识是否按屏幕高度进行适配，默认为“自动”</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="swiper-guider-cfg">
				<dt><b><i></i><i></i></b>上滑提示设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>显示上滑提示：</span>
							<label>
								<select name="enable" data-sort="module" data-mode='swiper-guider'>
									<option value="true">显示</option>
									<option value="false" selected>不显示</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上显示上滑提示，默认为“显示”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>隐藏上滑提示：</span>
							<label>
								<select name="hide" data-sort="module" data-mode='swiper-guider'>
									<option value="0">永不隐藏</option>
									<option value="1">翻至第二页隐藏</option>
									<option value="2" selected>翻至末页隐藏</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上显示上滑提示，默认为“翻至末页隐藏”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>显示提示文字：</span>
							<label>
								<select name="text" data-sort="module" data-mode='swiper-guider'>
									<option value="false" selected>不显示</option>
									<option value="true">显示</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上显示上滑提示文字</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>控件位置：</span>
							<label>
								<input type="number" data-sort="module" data-mode='swiper-guider' name="bottom" min="10" max="100" value="15">
							</label>
							<s>控件与页面底部的距离，单位：像素，默认为"15"</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="gallery-cfg">
				<dt><b><i></i><i></i></b>杂志展示</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>启用展示：</span>
							<label>
								<select name="enable" data-sort="module" data-mode='gallery'>
									<option value="true">启用</option>
									<option value="false" selected>不启用</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上启用音乐，默认为“不启用”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>杂志项目：</span>
							<label>
								<input type="button" data-sort="module" data-mode='gallery' name="item" value="选择杂志项目…">
							</label>
							<s>音乐文件的源地址，推荐保持在1M以内</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="map-cfg">
				<dt><b><i></i><i></i></b>地图设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>启用地图：</span>
							<label>
								<select name="enable" data-sort="component" data-mode='map'>
									<option value="true">启用</option>
									<option value="false" selected>不启用</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上显示地图，默认为“不显示”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>地图所属页面：</span>
							<label>
								<select name="wrap" data-sort="component" data-mode='map' data-page="max"></select>
								<i></i>
							</label>
							<s>地图放置在第几页，默认为“最后一页”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>坐标位置名称：</span>
							<label>
								<input name="coord-name" data-sort="component" data-mode='map' type="text">
							</label>
							<s>地图显示的坐标名称</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>坐标经度：</span>
							<label>
								<input name="coord-lng" data-sort="component" data-mode='map' type="text">
							</label>
							<s>坐标的纬经度</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>坐标纬度：</span>
							<label>
								<input name="coord-lat" data-sort="component" data-mode='map' type="text">
							</label>
							<s>坐标的纬度</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>地图层级经度：</span>
							<label>
								<select data-mode='map' name="zoom" data-sort="component">
									<option value="1">1级</option>
									<option value="2">2级</option>
									<option value="3">3级</option>
									<option value="4">4级</option>
									<option value="5">5级</option>
									<option value="6">6级</option>
									<option value="7">7级</option>
									<option value="8">8级</option>
									<option value="9">9级</option>
									<option value="10">10级</option>
									<option value="11">11级</option>
									<option value="12">12级</option>
									<option value="13">13级</option>
									<option value="14">14级</option>
									<option value="15">15级</option>
									<option value="16">16级</option>
									<option value="17">17级</option>
									<option value="18" selected>18级</option>
								</select>
								<i></i>
							</label>
							<s>地图初始层级，层级越大显示的位置越详细</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>附加样式名：</span>
							<label>
								<input name="style" data-sort="component" data-mode='map' type="text">
							</label>
							<s>地图的CSS附加样式名，必须为英文开头的英文数字混合形式，默认不用填写</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>地图上边距：</span>
							<label>
								<input name="top" data-sort="component" data-mode="map" type="number" value="35" min="0" max="200">
							</label>
							<s>地图相对于上一元素的位置，单位为相对于设备屏幕宽度的百分比，默认为“35”%的屏幕宽度</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>地图高度：</span>
							<label>
								<input name="height" data-sort="component" data-mode="map" type="number" value="40" min="1" max="100">
								<i></i>
							</label>
							<s>地图的高度，单位为相对于设备屏幕宽度的百分比，默认为“40”%的屏幕宽度</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>支持动态地图：</span>
							<label>
								<select name="dynamic" data-sort="component" data-mode='map'>
									<option value="true">支持</option>
									<option value="false" selected>不支持</option>
								</select>
								<i></i>
							</label>
							<s>是否让地图显示弹出动态地图</s>
						</li>
					</ul>
					<p>附加链接：<a href="http://api.map.baidu.com/lbsapi/getpoint/" target="_blank">百度地图坐标拾取系统</a></p>
				</dd>
			</dl>
			<dl class="music-cfg">
				<dt><b><i></i><i></i></b>音乐设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>启用音乐：</span>
							<label>
								<select name="enable" data-sort="component" data-mode='music'>
									<option value="true">启用</option>
									<option value="false" selected>不启用</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上启用音乐，默认为“不启用”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>音乐源：</span>
							<label>
								<div class="audioWrap">
									<div class="audioBox"></div>
									<em class="fileBtn">
										<input type="file" data-sort="component" data-mode='music' name="src" accept="audio/mp3,audio/mpeg">
										<s class="uBox"></s>
										<s class="uLine"></s>
										<s class="uArrow"></s>
									</em>
								</div>
							</label>
							<s>音乐文件的源地址，推荐保持在1M以内</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>是否循环：</span>
							<label>
								<select name="loop" data-sort="component" data-mode='music'>
									<option value="true">循环</option>
									<option value="false" selected>不循环</option>
								</select>
								<i></i>
							</label>
							<s>音乐是否循环播放</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>控件位置：</span>
							<label>
								<select name="offset" data-sort="component" data-mode='music'>
									<option value="1">左上角</option>
									<option value="2" selected>右上角</option>
									<option value="3">左下角</option>
									<option value="4">右下角</option>
								</select>
								<i></i>
							</label>
							<s>控件所处的4宫格式布局的位置</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="toolbar-cfg">
				<dt><b><i></i><i></i></b>控件设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>启用控件：</span>
							<label>
								<select name="enable" data-sort="component" data-mode="toolbar">
									<option value="true">启用</option>
									<option value="false" selected>不启用</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上启用控件，默认为“不启用”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>自动收回时间：</span>
							<label>
								<input name="time" data-sort="component" data-mode="toolbar" type="number" value="5000" min="1000" max="10000">
							</label>
							<s>控件自动收回的时间，单位：毫秒</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>运动距离：</span>
							<label>
								<input name="radius" data-sort="component" data-mode="toolbar" type="number" value="65" min="30" max="300">
							</label>
							<s>按钮的运动距离，半径/直径，单位：像素</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>控件样式：</span>
							<label>
								<select name="effect" data-sort="component" data-mode='toolbar'>
									<option value="flower" selected>圆形展开</option>
									<option value="stretch">竖向展开</option>
								</select>
								<i></i>
							</label>
							<s>控件的样式风格</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>控件项目：</span>
							<label><input type="checkbox" data-sort="component" data-mode="toolbar" name="btns" value="tel">电话</label>
							<label><input type="checkbox" data-sort="component" data-mode="toolbar" name="btns" value="swt">咨询</label>
							<label><input type="checkbox" data-sort="component" data-mode="toolbar" name="btns" value="reserve">预约</label>
							<label><input type="checkbox" data-sort="component" data-mode="toolbar" name="btns" value="music">音乐</label>
							<label><input type="checkbox" data-sort="component" data-mode="toolbar" name="btns" value="share">分享</label>
							<label><input type="checkbox" data-sort="component" data-mode="toolbar" name="btns" value="url">链接</label>
							<s>启用音乐时必须对音乐进行设置</s>
							<s>* 链接地址为您设置的WAP地址</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>控件位置：</span>
							<label>
								<select name="offset" data-sort="component" data-mode='toolbar'>
									<option value="1">左上角</option>
									<option value="2">顶部</option>
									<option value="3">右上角</option>
									<option value="4">左侧</option>
									<option value="6">右侧</option>
									<option value="7" selected>左下角</option>
									<option value="8">底部</option>
									<option value="9">右下角</option>
								</select>
								<i></i>
							</label>
							<s>控件所处的九宫格式布局的位置</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>重力感应：</span>
							<label>
								<select name="float" data-sort="component" data-mode='toolbar'>
									<option value="true" selected>开启</option>
									<option value="false">关闭</option>
								</select>
								<i></i>
							</label>
							<s>使用移动设备的重力感觉调整控件位置</s>
						</li>
					</ul>
				</dd>
			</dl>
			<dl class="contact-cfg">
				<dt><b><i></i><i></i></b>联络工具设置</dt>
				<dd>
					<ul>
						<li class="clearfix">
							<span>联络工具：</span>
							<label>
								<select name="enable" data-sort="component" data-mode="contact">
									<option value="true">显示</option>
									<option value="false" selected>不显示</option>
								</select>
								<i></i>
							</label>
							<s>是否在页上显示联络工具，默认为“显示”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>联络项目：</span>
							<label><input type="checkbox" data-sort="component" data-mode="contact" name="btns" value="tel">电话咨询</label>
							<label><input type="checkbox" data-sort="component" data-mode="contact" name="btns" value="swt">在线咨询</label>
							<label><input type="checkbox" data-sort="component" data-mode="contact" name="btns" value="reserve">在线预约</label>
							<label><input type="checkbox" data-sort="component" data-mode="contact" name="btns" value="share">我要分享</label>
							<label><input type="checkbox" data-sort="component" data-mode="contact" name="btns" value="url">了解更多</label>
							<s>了解更多按钮将跳转到先前设置的WAP地址</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>联系地址：</span>
							<label>
								<input name="addr" data-sort="component" data-mode="contact" type="text">
							</label>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>联系电话：</span>
							<label>
								<input name="tel" data-sort="component" data-mode="contact" type="text">
							</label>
							<s>联系电话，格式为：0755-88808888</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>主页网址：</span>
							<label>
								<input name="url" data-sort="component" data-mode="contact" type="text">
							</label>
							<s>所要展示的URL地址，无需'http://'</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>样式风格：</span>
							<label>
								<select name="style" data-sort="component" data-mode="contact">
									<option value="circle" selected>圆形</option>
									<option value="rect" selected>长条形</option>
								</select>
								<i></i>
							</label>
							<s>工具条的样式风格</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>文字颜色：</span>
							<label>
								<input type="button" name="color" data-sort="component" data-mode="contact" data-info="text">
								<b>
									<em></em>
								</b>
							</label>
							<s>文字描述的颜色</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>文字链接颜色：</span>
							<label>
								<input type="button" name="color" data-sort="component" data-mode="contact" data-info="link">
								<b>
									<em></em>
								</b>
							</label>
							<s>文字链接的颜色</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>按钮颜色：</span>
							<label>
								<input type="button" name="color" data-sort="component" data-mode="contact" data-info="btn">
								<b>
									<em></em>
								</b>
							</label>
							<s>按钮的颜色</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>按钮图标颜色：</span>
							<label>
								<input type="button" name="color" data-sort="component" data-mode="contact" data-info="icon">
								<b>
									<em></em>
								</b>
							</label>
							<s>按钮上的图标的颜色</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>按钮文字颜色：</span>
							<label>
								<input type="button" name="color" data-sort="component" data-mode="contact" data-info="tit">
								<b>
									<em></em>
								</b>
							</label>
							<s>按钮上的文字的颜色</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>按钮边框颜色：</span>
							<label>
								<input type="button" name="color" data-sort="component" data-mode="contact" data-info="bdr">
								<b>
									<em></em>
								</b>
							</label>
							<s>按钮边框（如果有）的颜色</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>图标风格：</span>
							<label>
								<select name="icon" data-sort="component" data-mode="contact">
									<option value="default" selected>默认图标</option>
								</select>
								<i></i>
							</label>
							<s>工具条的图标风格</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>所属页面：</span>
							<label>
								<select name="wrap" data-sort="component" data-mode="contact" data-page="max"></select>
								<i></i>
							</label>
							<s>工具条放置在第几页，默认为“最后一页”</s>
						</li>
						<li data-parent="enable" class="clearfix">
							<span>上边距：</span>
							<label>
								<input name="top" data-sort="component" data-mode="contact" type="number" value="35" min="0" max="200">
							</label>
							<s>工具条相对于上一元素的位置，单位为相对于设备屏幕宽度的百分比，默认为“35”%的屏幕宽度</s>
						</li>
					</ul>
				</dd>
			</dl>
		</div>
	</aside>
</div>
<div class="preview-simulator-wrap">
	<div class="preview-hide-btn">
		<i></i>
		<i></i>
	</div>
	<a class="preview-qrcode-btn" href="javascript:;"></a>
	<div class="preview-qrcode-box">
		<span>手机预览前请先保存数据</span>
	</div>
	<a class="cfg-save-btn" href="javascript:;">保存</a>
	<div class="preview-simulator">
		<iframe name="preview" width="320" height="505" frameborder="0"></iframe>
	</div>
</div>
<script src="/Public/js/jquery-2.1.1.min.js"></script>
<script src="/Public/js/plugin/jquery.easing.min.js"></script>
<script src="/Public/js/plugin/jquery.scrollbar-3.1.11.min.js"></script>
<script src="/Public/js/plugin/jquery.sortable.min.js"></script>
<script src="/Public/js/plugin/jquery.colorpicker.js"></script>
<script src="/Public/js/plugin/jquery.qrcode.min.js"></script>
<script src="/Public/js/appmaker.lib-1.0.0.dev.js"></script>
<script src="/Public/js/appmaker-1.0.0.dev.js"></script>
<script>
var maker;
window.onload = function() {
	maker = new Maker.Config({
		'appid' : localStorage.getItem('app-id'),
		'number' : localStorage.getItem('app-' + localStorage.getItem('app-id') + '-page')
	});
	$(".maker-pages-list").mCustomScrollbar({
		theme : 'dark',
		scrollInertia : 50
	});
	$(".app-basic-config").mCustomScrollbar({
		theme : 'dark',
		scrollInertia : 50
	});
}
</script>
</body>
</html>