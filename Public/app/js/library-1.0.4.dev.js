/*
 * name : TouchAPP library
 * version : 1.0.4
 * date : 2014/12/29
 * author : shusiwei
 */
var Lib = (function() {
	var isMobile = 'ontouchstart' in window || 'ondeviceorientation' in window && 'onorientationchange' in window ? true : false,
		event = {
			tapstart : isMobile ? 'touchstart' : 'mousedown',
			tapmove : isMobile ? 'touchmove' : 'mousemove',
			tapend : isMobile ? 'touchend' : 'mouseup',
			tapcancel : 'touchcancel',
			tap : 'click',
			resize : isMobile ? 'orientationchange' : 'resize'
		},
		style = {
			transform : undefined,
			transition : undefined,
			transitionDelay : undefined,
			filter : undefined,
			animation : undefined
		},
		value = {
			'gs' : {
				'alpha' : null, // 方向扭转
				'beta' : null, // 前后扭转
				'gamma' : null, // 两侧扭转
				'heading' : undefined, // 指北针指向
				'accuracy' : undefined // 指北针精度
			},

			'size' : {
				'height' : 0, // 窗口调高度
				'winWidth' : 0, // 窗口宽度
				'nowWidth' : undefined, // 当前宽度
				'scale' : undefined // 窗口比例
			},

			'xy' : {
				'sx' : 0, // TouchStart的Y点，默认为0
				'mx' : 0, // TouchMove的Y点，默认为0
				'ex' : 0, // TouchEnd的Y点，默认为0
				'sy' : 0, // TouchStart的Y点，默认为0
				'my' : 0, // TouchMove的Y点，默认为0，非常用
				'ey' : 0 // TouchEnd的Y点，默认为0，非常用
			},

			'bounce' : {
				'x' : 50, // 横向滑动回弹溢出X值
				'y' : 100, // 竖向滑动回弹溢出Y值
				'nowX' : 0, // 更新后的横向滑动回弹溢出X值
				'nowY' : 0 // 更新后的竖向滑动回弹溢出Y值
			},

			'swipe' : {
				'type' : undefined, // 触摸类型
				'typeX' : undefined, // X轴触摸类型
				'typeY' : undefined, // Y轴触摸类型
				'status' : undefined // 方向切换类型
			},

			'page' : {
				'now' : 0, // 当前页面的索引，默认为0
				'next' : 0, // 下一页面的索引，默认为0
			},

			'regex' : {
				'uname' : /^[\u4E00-\u9FA5\a-zA-Z]{2,15}$/g,
				'phone' : {
					'mobile' : /^13[0-9]{9}|15[012356789][0-9]{8}|18[0-9][0-9]{8}|147[0-9]{8}|17[0678][0-9]{8}$/g,
					'tel' : /^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$/g,
				},
				'email' : /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/g
			},

			'loop' : false, // 页面滑动次数，默认为0
			'os' : undefined
		},
		element = {
			'wrapper' : document.querySelector('.app-wrapper'), // 页面整体封装容器
			'container' : document.querySelector('.app-container'), // 页面整体封装容器
			'content' : document.querySelector('.app-page-content'), // DOM:页面封闭容器
			'filter' : document.querySelectorAll('.filter'), // 横屏时调用style.filter的DOM
			'body' : document.body, // 横屏时调用style.filter的DOM

			'page' : {
				'all' : document.querySelectorAll('.page'), // page节点DOM
				'first' : document.querySelector('.page:first-child'), // 第一页DOM
				'now' : null, // 当前页DOM
				'next' : null, // 下一页DOM
				'last' : document.querySelector('.page:last-child') // 最后一页DOM
			}
		},
		type = {
			isJSON : function(obj) {
				return typeof(obj) === 'object' && Object.prototype.toString.call(obj) === '[object Object]' && !obj.length;
			},

			isArray : function(obj) {
				return typeof(obj) === 'object' && Object.prototype.toString.call(obj) === '[object Array]';
			},

			isElement : function(obj) {
				return typeof(obj) === 'object' && Object.prototype.toString.call(obj).indexOf('HTML') >= 0 && obj.nodeType === 1;
			},

			isNumber : function(obj) {
				return typeof(obj) === 'number';
			},

			isString : function(obj) {
				return typeof(obj) === 'string';
			},

			isBoolean : function(obj) {
				return typeof(obj) === 'boolean';
			},

			isFunction : function(obj) {
				return typeof(obj) === 'function';
			},

			isNodelist : function(obj) {
				return typeof(obj) === 'object' && Object.prototype.toString.call(obj).indexOf('NodeList') >= 0;
			},
			inArray : function(array, str) {
				var length = array.length;

				for (var i = 0; i < length; i++) {
					if (array[i] === str) return true;
				}

				return false;
			},
			isHexColor : function(hex) {
				var regex = /^([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

				if (regex.test((hex.indexOf('#') > -1) ? hex.substring(1) : hex)) {
					return true;
				} else {
					return false;
				}
			}
		},
		get = {
			// 获取兄弟元素,jquery替代方法.siblings()
			getSiblingNodes : function(ele) {
				var siblingsNodes = [],
					prevNode = ele.previousSibling;
				while (prevNode) {
					if (prevNode.nodeType === 1) {
						siblingsNodes.push(prevNode);
					}
					prevNode = prevNode.previousSibling;
				}
				siblingsNodes.reverse();

				var nextNode = ele.nextSibling;
				while (nextNode) {
					if (nextNode.nodeType === 1) {
						siblingsNodes.push(nextNode);
					}
					nextNode = nextNode.nextSibling;
				}

				return siblingsNodes;
			},
			// 获取上一个兄弟元素,jquery替代方法.prev()
			getPrevNode : function(ele) {
				var prevNode = ele.previousSibling,
					i = 0;
				while (i < 1 && prevNode) {
					if (prevNode.nodeType !== 1) {
						prevNode = prevNode.previousSibling;
					} else if (prevNode.nodeType === 1) {
						i++;
					}
				}

				return prevNode;
			},
			// 获取下一个兄弟元素,jquery替代方法.next()
			getNextNode : function(ele) {
				var nextNode = ele.nextSibling,
					i = 0;
				while (i < 1 && nextNode) {
					if (nextNode.nodeType !== 1) {
						nextNode = nextNode.nextSibling;
					} else if (nextNode.nodeType === 1) {
						i++;
					}
				}

				return nextNode;
			},
			// 获取窗口宽度,jquery替代方法$(window).width();
			getWindowWidth : function() {
				var windowWidth = 0;
				if (type.isNumber(window.innerWidth)) {
					windowWidth = window.innerWidth;
				} else {
					if (document.documentElement && document.documentElement.clientWidth) {
						windowWidth = document.documentElement.clientWidth;
					} else {
						if (document.body && document.body.clientWidth) {
							windowWidth = document.body.clientWidth;
						}
					}
				}
				return windowWidth;
			},
			// 获取窗口高度,jquery替代方法$(window).height();
			getWindowHeight : function() {
				var windowHeight = 0;
				if (type.isNumber(window.innerHeight)) {
					windowHeight = window.innerHeight;
				} else {
					if (document.documentElement && document.documentElement.clientHeight) {
						windowHeight = document.documentElement.clientHeight;
					} else {
						if (document.body && document.body.clientHeight) {
							windowHeight = document.body.clientHeight;
						}
					}
				}
				return windowHeight;
			},
			// 获取元素索引值,jquery替代方法.index()
			getIndex : function(ele) {
				// 定义一个数组，用来存ele的前面的兄弟元素
				var prevNodesArray = [];

				// 取出前面的节点
				var prevNode = ele.previousSibling;
				// 判断有没有上一个哥哥元素，如果有则往下执行
				while (prevNode) {
					if (prevNode.nodeType === 1) {
						prevNodesArray.push(prevNode);
					}
					// 最后把上一个节点赋给prevNode
					prevNode = prevNode.previousSibling;
				}

				// 最后的索引值为所有前节点的合
				return prevNodesArray.length;
			},
			getStyle : function(ele, attr) {
				if (ele.currentStyle) {
					return parseInt(ele.currentStyle[attr]);
				} else {
					return parseInt(getComputedStyle(ele, false)[attr]);
				}
			},
			getOffsetTop : function(ele) {
				var eleTop = ele.offsetTop,
					eleParent = ele.offsetParent;

				while(eleParent) {
					eleTop += eleParent.offsetTop;
					eleParent = eleParent.offsetParent;
				}

				return eleTop;
			},
			getOffsetLeft : function(ele) {
				var eleLeft = ele.offsetLeft,
					eleParent = ele.offsetParent;

				while(eleParent) {
					eleLeft += eleParent.offsetLeft;
					eleParent = eleParent.offsetParent;
				}

				return eleLeft;
			},
			getOS : function() {
				var ua = navigator.userAgent;
				if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
					value.os = 'Android';
				} else if (ua.indexOf('iPhone') > -1) {
					value.os = 'iOS';
				} else if (ua.indexOf('Windows Phone') > -1) {
					value.os = 'WP';
				}
			},
			refreshDOM : function(callback) {
				element.page.all = document.querySelectorAll('.page');
				element.page.first = document.querySelector('.page:first-child');
				element.page.last = document.querySelector('.page:last-child');

				if (Lib.isFunction(callback)) callback();

				return element.page.all.length;
			},
			getQueryString : function(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
					r = window.location.search.substr(1).match(reg);

				if (r != null) return unescape(r[2]); return null;
			},
			inNodelist : function(nodelist, style) {
				var length = nodelist.length,
					ele = [];

				for (var i = 0; i < length; i++) {
					if (type.inArray(nodelist[i].classList, style)) ele.push(nodelist[i]);
				}

				return ele;
			},
			getScaleVal : function(top) {
				return (top / 100) * (value.size.height * value.size.scale);
			},
			HexToRGB : function (hex) {
				var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			RGBToHex : function(rgb) {
				var hex = '#',
					rgbLowerStr = rgb.toLowerCase(),
					rgbStr = rgbLowerStr.indexOf('rgb') >-1 ? rgb.slice(4, -1) : rgb,
					rgb = rgbStr.split(',');

				for (var i = 0; i < rgb.length; i++) {
					var value = Number(rgb[i]).toString(16);
					if(value == 0) {
						value += value;
					}
					hex += value;
				}

				return hex;
			}
		},
		func = {
			insertAfter : function(newEle, targetEle) {
				var parent = targetEle.parentNode;
				if (parent.lastChild == targetEle) {
					// 如果最后的节点是目标元素，则直接添加。因为默认是最后
					parent.appendChild(newEle);
				} else {
					parent.insertBefore(newEle, targetEle.nextSibling);
					//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
				}
			},
			bindEvent : function(ele, event, handler) {
				if (type.isNodelist(ele) || type.isArray(ele)) {
					for (var i = 0; i < ele.length; i++) {
						ele[i].addEventListener(event, handler, false);
					};
				} else {
					ele.addEventListener(event, handler, false);
				}
			},
			removeEvent : function(ele, event, handler) {
				if (type.isNodelist(ele)) {
					for (var i = 0; i < ele.length; i++) {
						ele[i].removeEventListener(event, handler, false);
					};
				} else {
					ele.removeEventListener(event, handler, false);
				}
			},
			moveData : function(newItem, oldItem) {
				localStorage.setItem(newItem, localStorage.getItem(oldItem));
				localStorage.removeItem(oldItem);
			},
			setData : function(name, value) {
				localStorage.setItem(name, value);
			},
			getData : function(name) {
				return localStorage.getItem(name);
			},
			delData : function(name) {
				localStorage.removeItem(name);
			},
			clearData : function() {
				localStorage.clear();
			},
			/*
			 * 重力感应函数
			 */
			orientationHandler : function(e) {
				value.gs.alpha = e.alpha,
				value.gs.beta = e.beta,
				value.gs.gamma = e.gamma,
				value.gs.heading = e.webkitCompassHeading,
				value.gs.accuracy = e.webkitCompassAccuracy;
			},
			/*
			 * 使用resizeWindow方法改变窗口
			 */
			resizeWindow : function() {
				value.size.winWidth = get.getWindowWidth();
				value.size.height = get.getWindowHeight();

				if (!isMobile) {
					if (value.size.winWidth > value.size.height) {
						var scale = 64 / 101;
						value.size.nowWidth = value.size.height * scale;
					} else {
						var scale = 101 / 64;
						value.size.nowWidth = value.size.height / scale;
					}

					element.wrapper.style.height = '100%';
					element.wrapper.style.width = value.size.nowWidth  + 'px';
				} else {
					value.size.nowWidth = value.size.winWidth;
				}

				value.size.scale = Lib.val.size.nowWidth / Lib.val.size.height;
			},
			/*
			 * ele添加滤镜
			 * mode:为'in'是为添加,为'out'时为移除
			 */
			toggleFilter : function(element, mode, callback) {
				if (mode == 'in') {
					if (type.isElement(element)) {
						element.classList.add('filter');
					} else if (type.isNodelist(element)){
						for (var i = 0; i < element.length; i++) {
							element[i].classList.add('filter');
						}
					} else if (type.isArray(element)) {
						for (var i = 0; i < element.length; i++) {
							func.toggleFilter(element[i], mode)
						}
					} else {
						return false
					}
				} else if (mode == 'out') {
					if (type.isElement(element)) {
						element.classList.remove('filter');
					} else if (type.isNodelist(element)){
						for (var i = 0; i < element.length; i++) {
							element[i].classList.remove('filter');
						}
					} else if (type.isArray(element)) {
						for (var i = 0; i < element.length; i++) {
							func.toggleFilter(element[i], mode)
						}
					} else {
						return false;
					}
				} else {
					return false;
				}

				if (Lib.isFunction(callback)) callback();
			},
			/*
			 * 加载动画,通过改变ele的background-position来造成动画的假象
			 * ele:动画对象(element)
			 * x:偏移单位(int)
			 * x:最大偏移数(int)
			 * speend:动画速度(int,单位毫秒)
			 */
			loaderAnimate : function(ele, x, max, speend) {
				// 图片加载动画
				var runTime = 0,
					newX,
					timer;

				// 动画执行函数
				function startAnimate() {
					timer = setInterval(function() {
						// 如果运行到最大偏移量，则回到0，重新开始
						if (newX < max) {
							runTime++;
						} else {
							runTime = 0;
						}

						// 得到最的偏移量
						newX = runTime * x;
						// 改变backgroundPosition以达到动画效果
						ele.style.backgroundPosition = - newX + 'px 0';
					}, speend)
				}

				// 开始执行动画
				startAnimate();

				// 返回定时器，方便外部完成后清除
				return timer;
			}
		};


	// 判断CSS3样式是否带有webkit前缀
	['','webkit'].forEach(function(prefix) {
		var _transform = prefix + (prefix ? 'T': 't') + 'ransform',
			_transition = prefix + (prefix ? 'T': 't') + 'ransition',
			_transitionDelay = prefix + (prefix ? 'T': 't') + 'ransitionDelay',
			_filter = prefix + (prefix ? 'F': 'f') + 'ilter',
			_animation = prefix + (prefix ? 'A': 'a') + 'nimation';

		if (_transform in document.body.style) style.transform = _transform;
		if (_transition in document.body.style) style.transition = _transition;
		if (_transitionDelay in document.body.style) style.transitionDelay = _transitionDelay;
		if (_filter in document.body.style) style.filter = _filter;
		if (_animation in document.body.style) style.animation = _animation;
	});

	return {
		version : '1.0.4',
		isMobile : isMobile,
		tapstart : event.tapstart,
		tapmove : event.tapmove,
		tapend : event.tapend,
		tapcancel : event.tapcancel,
		tap : event.tap,
		resize : event.resize,
		transform : style.transform,
		transition : style.transition,
		transitionDelay : style.transitionDelay,
		filter : style.filter,
		animation : style.animation,
		val : value,
		ele : element,
		isJSON : type.isJSON,
		isArray : type.isArray,
		isElement : type.isElement,
		isNumber : type.isNumber,
		isString : type.isString,
		isBoolean : type.isBoolean,
		isFunction : type.isFunction,
		isNodelist : type.isNodelist,
		inArray : type.inArray,
		isHexColor : type.isHexColor,
		sibling : get.getSiblingNodes,
		prev : get.getPrevNode,
		next : get.getNextNode,
		width : get.getWindowWidth,
		height : get.getWindowHeight,
		index : get.getIndex,
		css : get.getStyle,
		top : get.getOffsetTop,
		left : get.getOffsetLeft,
		os : get.getOS,
		dom : get.refreshDOM,
		request : get.getQueryString,
		inNodelist : get.inNodelist,
		getScaleVal : get.getScaleVal,
		HexToRGB : get.HexToRGB,
		RGBToHex : get.RGBToHex,
		after : func.insertAfter,
		bind : func.bindEvent,
		unbind : func.removeEvent,
		moveData : func.moveData,
		setData : func.setData,
		getData : func.getData,
		delData : func.delData,
		clearData : func.clearData,
		orientationHandler : func.orientationHandler,
		resizeWindow : func.resizeWindow,
		toggleFilter : func.toggleFilter,
		loaderAnimate : func.loaderAnimate
	};
})();
/*
 * 禁用body默认事件
 */
Lib.bind(Lib.ele.body, Lib.tapmove, function(e) {
	e.preventDefault();
	e.stopPropagation();
});

/*
 * 如果为移动设备，那么window将监听deviceorientation事件
 */
if (Lib.isMobile) {

	Lib.bind(window, 'deviceorientation', Lib.orientationHandler);
	Lib.bind(window, 'load', Lib.os);

} else {
	Lib.bind(window, 'resize', Lib.resizeWindow);
}
Lib.bind(window, 'load', Lib.resizeWindow);

// /* GA */
// (function(i, s, o, g, r, a, m) {
// 	i["GoogleAnalyticsObject"] = r;
// 	i[r] = i[r] || function() {
// 	    (i[r].q = i[r].q || []).push(arguments);
// 	}, i[r].l = 1 * new Date();
// 	a = s.createElement(o), m = s.getElementsByTagName(o)[0];
// 	a.async = 1;
// 	a.src = g;
// 	m.parentNode.insertBefore(a, m);
// })(window, document, "script", "http://www.google-analytics.com/analytics.js", "ga");
// ga("create", "UA-54603365-2", "auto");
// ga("send", "pageview");
