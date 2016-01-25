var Lib = (function() {
		var _type = {
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
					var length = array.length
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
			_set = {

			},
			_get = {
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
				//tar[:object]:事件作用对象，classname[:string]: 样式名(基于jquery)
				getTar : function(tar, classname){
					var target = '';
					if(tar.hasClass(classname)){

						target = tar
					}else if(tar.parents('.' + classname)){
						target = tar.parents('.' + classname);
					}

					return target;
				},
				// 获取窗口宽度,jquery替代方法$(window).width();
				getWindowWidth : function() {
					var windowWidth = 0;
					if (_type.isNumber(window.innerWidth)) {
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
					if (_type.isNumber(window.innerHeight)) {
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
				getPath : function(url) {
					var domain = 'http://' + window.location.host + '/',
						path = url.substr(domain.length);

					return path;
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
						if (_type.inArray(nodelist[i].classList, style)) ele.push(nodelist[i]);
					}

					return ele;
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
				},
				getSrc : function(url){
					var reg1 = /\([^\)]+\)/g,
						reg2 = /[\(|\)]/g,
						src = '';
					src = url.match(reg1).toString().replace(reg2,'');

					return src;
				}
			},
			upload = {
				change : function(param) {

					if (param.box) {
						$(param.box).fadeOut(200, function() {
							$(this).remove();
							param.xhr.open('POST', param.url);
							param.xhr.send(param.form);
						})
					} else {
						param.xhr.open('POST', param.url);
						param.xhr.send(param.form);
					}
				},
				start : function(evt, box, nodeType) {
					var progressBar = document.createElement('div'),
						progress = document.createElement('em'),
						nodeEle = box.querySelector(nodeType);

					progressBar.className = 'uploader-progress-bar';
					progress.style.width = 0;

					if (nodeEle){
						_func.toggleFilter([nodeEle], 'in', function(){
							progressBar.appendChild(progress);
							box.appendChild(progressBar);
						});
					} else {
						progressBar.appendChild(progress);
						box.appendChild(progressBar);
					}
				},
				progress : function(evt, box) {
					var progressBar = box.querySelector('.uploader-progress-bar'),
						progressLine = progressBar.querySelector('em'),
						progress;

					if (evt.lengthComputable) {
						progress = Math.round(evt.loaded * 100 / evt.total);
					} else {
						progress = Math.round(evt.loaded * 100 / evt.total);
					}

					progressLine.style.width = progress + '%';
				},
				complete : function(evt, box, nodeType, callback) {
					var url = JSON.parse(evt.target.responseText).url,
						oldNodeEle = $(box).find(nodeType),
						newNodeEle = $('<img src="' + url + '">'),
						progressBar = $(box).find('.uploader-progress-bar');

					progressBar.fadeOut(200, function() {
							$(this).remove();

							if (oldNodeEle ) {
									oldNodeEle.fadeOut(200, function() {
										oldNodeEle.remove();
									});
									$(box).append(newNodeEle);
									$(newNodeEle).fadeIn(200, function() {
										if (_type.isFunction(callback)) callback(url);
									});
							} else {
								$(box).append(newNodeEle);
								$(newNodeEle).fadeIn(200, function() {
									if (_type.isFunction(callback)) callback(url);
								});

							}
						})

					return url;
				},
				failed : function(evt, box) {
					var oldImg = box.querySelector('img');

					if (oldImg) {
						_func.toggleFilter([oldImg], 'out', function() {
							alert('图片上传失败！');
						});
					} else {
						alert('图片上传失败！');
					}
				},
				canceled : function(evt, box) {
					var oldImg = box.querySelector('img');

					if (oldImg) {
						_func.toggleFilter([oldImg], 'out', function() {
							alert('图片上传取消！');
						});
					} else {
						alert('图片上传取消！');
					}
				}
			},
			_func = {
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
					if (_type.isNodelist(ele)) {
						for (var i = 0; i < ele.length; i++) {
							ele[i].addEventListener(event, handler, false);
						};
					} else {
						ele.addEventListener(event, handler, false);
					}
				},
				removeEvent : function(ele, event, handler) {
					if (_type.isNodelist(ele)) {
						for (var i = 0; i < ele.length; i++) {
							ele[i].removeEventListener(event, handler, false);
						};
					} else {
						ele.removeEventListener(event, handler, false);
					}
				},
				setSrc : function(eleType, wrap, curTar){
					var src = '';
					switch(eleType){
						case 'bg' :
							var  imgEle = wrap.find('img');
							if(curTar.css('backgroundImage') && curTar.css('backgroundImage') !== 'none'){
								src = _get.getSrc(curTar.css('backgroundImage'));
								if(!imgEle || imgEle.length == 0){
									imgEle = $('<img src="">');
									imgEle.attr('src', src);
									wrap.append(imgEle);
								}else{
									imgEle.attr('src', src);
								}
							}else{
								var color = curTar.css('backgroundColor') ? _get.RGBToHex(curTar.css('backgroundColor')) : '#ffffff';

								if(curTar.css('backgroundColor') && curTar.css('backgroundColor') !== 'none'){
									wrap.css({
										backgroundColor : curTar.css('backgroundColor')
									}).children('img').remove();
								}

								_elecol.confEle.pageColor.val(color);
							  _elecol.confEle.pageColor_show.val(color);
							}
						break;
					}
				},
				moveData : function(newItem, oldItem) {
					var oldData = localStorage.getItem(oldItem);
					if (oldData != 'null') localStorage.setItem(newItem, oldData);
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
				makeAppid : function() {
					var date = new Date(),
						appid = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + date.getMinutes().toString() + date.getSeconds().toString() + date.getSeconds().toString();

					return appid;
				},
				/*
				 * ele添加滤镜
				 * mode:为'in'是为添加,为'out'时为移除
				 */
				toggleFilter : function(element, mode, callback) {
					if (mode == 'in') {
						if (_type.isElement(element)) {
							element.classList.add('filter');
						} else if (_type.isNodelist(element)){
							for (var i = 0; i < element.length; i++) {
								element[i].classList.add('filter');
							}
						} else if (_type.isArray(element)) {
							for (var i = 0; i < element.length; i++) {
								_func.toggleFilter(element[i], mode)
							}
						} else {
							return false
						}
					} else if (mode == 'out') {
						if (_type.isElement(element)) {
							element.classList.remove('filter');
						} else if (_type.isNodelist(element)){
							for (var i = 0; i < element.length; i++) {
								element[i].classList.remove('filter');
							}
						} else if (_type.isArray(element)) {
							for (var i = 0; i < element.length; i++) {
								_func.toggleFilter(element[i], mode)
							}
						} else {
							return false;
						}
					} else {
						return false;
					}

					if (_type.isFunction(callback)) callback();
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
				},

				//把json字符串转换为json
				strToJson : function(str){
					var json = (new Function('return' + str))();

					return json;
				},

				/**
				* 把新的配置信息添加到元素的data-config属性中,返回合并后的配置json
				*
				*/
				mergeData : function(ele, json){

					var data = $(ele).get(0).dataset;
					console.log(data);
					json = _type.isJSON(json) ? json : {};
					data = _func.strToJson(data);
					data = _func.mergeJson(data, json);
					$(ele).get(0).dataset.config = JSON.stringify(data);

					return data;
				},

				//把json2 合并到json1
				mergeJson : function(json1, json2){

					for(var key in json2){
						json1[key] = json2[key];
					}
					return json1;
				}
			},
			_elecol = {
				pageList : document.querySelector('.maker-pages-thumb ul'),
				preview : document.querySelector('.maker-preview'),
				configWrap : document.querySelector('.maker-config-wrap'),
				pageConf : document.querySelector('.page-config'),
				imgConf : document.querySelector('.img-config'),
				simuWrap : document.querySelector('.maker-simulator-wrap'),
				bgBox : document.querySelector('.page-config .img-box'),
				imgBox : document.querySelector('.img-config .img-box'),
				viewPage : null,
				listPage : null,
				activeEle : null,
				corrEle : null,
				tempAnim : '',
				eleIndex : 0,
				confEle : {
					inputer : document.querySelector('.inputer'),
					locX : $('.locX'),
					locY : $('.locY'),
					slider : document.querySelectorAll('.conf-slider'),
					align :$('.conf-align'),
					fontStyle : document.querySelector('.conf-fontStyle'),
					//border : $('.conf-border'),
					infoConf : document.querySelector('.mag-info-config'),
					pageColor : $('.pageColor'),
					pageColor_show : $('.pageColor').next('input')
				},
				previewBtn : document.querySelector('button.preview'),
				defTitle : '点此更换杂志分享标题',
				defDes : '点此更换杂志分享描述'
			};

	return {
		isJSON : _type.isJSON,
		isArray : _type.isArray,
		isElement : _type.isElement,
		isNumber : _type.isNumber,
		isString : _type.isString,
		isBoolean : _type.isBoolean,
		isFunction : _type.isFunction,
		isNodelist : _type.isNodelist,
		isHexColor : _type.isHexColor,
		getSrc : _get.getSrc,
		path : _get.getPath,
		request : _get.getQueryString,
		HexToRGB : _get.HexToRGB,
		RGBToHex : _get.RGBToHex,
		upload : upload,
		bind : _func.bindEvent,
		unbind : _func.removeEvent,
		setData : _func.setData,
		getData : _func.getData,
		delData : _func.delData,
		clearData : _func.clearData,
		makeAppid : _func.makeAppid,
		toggleFilter : _func.toggleFilter,
		loaderAnimate : _func.loaderAnimate,
		fn : _func,
		elecol : _elecol,
		get : _get,
		set : _set
	};
})();
