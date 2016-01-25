/*
 * name : TouchAPP
 * version : 1.1.0
 * date : 2015/01/23
 * author : shusiwei
 */
var APP = (function () {
	var Application,
		AppGallery,
		AppLoader,
		LoadProcess,
		AppSwiper,
		VertSwiper,
		VertEffect,
		WechatAPI,
		AppPagination,
		SwipeGuider,
		HorizTipser,
		PoweredInfo,
		SlideSwiper,
		SlidePagination,
		SlideLoader,
		HorizEffect,
		ToolBar,
		ToolBarEffect,
		MusicPlayer,
		ShareTipser,
		PopupBox,
		AjaxForm,
		BindSwt,
		ContactBar,
		ColorConvert,
		StaticMap,
		DynamicMap,
		LocationMarker,
		ZoomControl,
		LocationControl,
		TrafficControl;
	/* ==================================================
	 * @constructor(*) APP主程序[Application]
	 * @param(param:json *) 模块参数
	 *   + (loader:json *) APP加载器 (具体参数参照模块注释说明)
	 *   + (swiper:json *) 滑动过渡器 (具体参数参照模块注释说明)
	 *   + (wechat:json *) 微信分享 (具体参数参照模块注释说明)
	 * @param(handler:json *) 事件处理
	 *   - (onAppInit:function *) APP初始化并返回程序组件
	 *   - (onAppLoad:function *) APP加载
	 *   - (onTransformEnd:function *) 页面过渡完成
	 *   - (onSwipeStart:function *) 纵向滑动开始
	 *   - (onSwipeMove:function *) 纵向滑动移动
	 *   - (onSwipeEnd:function *) 纵向滑动结束
	 *   - (onSlideStart:function *) 横向滑动开始
	 *   - (onSlideMove:function *) 横向滑动移动
	 *   - (onSlideEnd:function *) 横向滑动结束
	 * ================================================== */
	Application = function(param, handler) {
		var that = this;

		this.handler = {
			onAppInit : Lib.isFunction(handler.onAppInit) ? handler.onAppInit : function() {},
			onAppLoad : Lib.isFunction(handler.onAppLoad) ? handler.onAppLoad : function() {},
			onTransformEnd : Lib.isFunction(handler.onTransformEnd) ? handler.onTransformEnd : function() {},
			onSwipeStart : Lib.isFunction(handler.onSwipeStart) ? handler.onSwipeStart : function() {},
			onSwipeMove : Lib.isFunction(handler.onSwipeMove) ? handler.onSwipeMove : function() {},
			onSwipeEnd : Lib.isFunction(handler.onSwipeEnd) ? handler.onSwipeEnd : function() {},
			onSlideStart : Lib.isFunction(handler.onSlideStart) ? handler.onSlideStart : function() {},
			onSlideMove : Lib.isFunction(handler.onSlideMove) ? handler.onSlideMove : function() {},
			onSlideEnd : Lib.isFunction(handler.onSlideEnd) ? handler.onSlideEnd : function() {}
		},
		this.module = {},
		this.module.gallery = new AppGallery(param.gallery, function(coverList) {
			if (Lib.isArray(coverList)) param.loader.img.push(coverList);

			that.module.loader = new AppLoader(param.loader);
			that.module.swiper = new AppSwiper(param.swiper);
			that.module.wechat = new WechatAPI(param.wechat);

			that._time = that.module.swiper._time,
			that._size = that.module.loader._length - 1; // 页面总数，从0开始;

			// 初始装载此APP，加载页面开始！
			that.initialize();
		})
	}
	Application.prototype = {
		/* -----------------------------------------------
		 * @module 初始化装载
		 * ----------------------------------------------- */
		initialize : function() {
			var that = this;
			this.onTap = {
				// 定义事件
				start : function(event) {
					that.swipeStart(event, this);
				},
				move : function(event) {
					that.swipeMove(event, this);
				},
				end : function(event) {
					that.swipeEnd(event, this);
				},
				cancel : function(event) {
					that.swipeCancel(event, this);
				}
			};
			// 回调外部组件
			this.component = this.handler.onAppInit();
			// 开始加载
			this.module.loader.initialize(function() {
				that.module.wechat.bindTipser();
				that.handler.onAppLoad();
				Lib.bind(Lib.ele.page.first, Lib.tapstart, that.onTap.start);
			});
		},
		/* -----------------------------------------------
		 * @module 获取滑动参数
		 * ----------------------------------------------- */
		getSwipe : function(x, y) {
			// 定方触摸类型
			var swipeType,
				xVal = Math.abs(x),
				yVal = Math.abs(y),
				swipeX,
				swipeY;

			// X轴模式
			if (x < 0) {
				swipeX = Lib.val.swipe.typeX = 'swipeLeft';
			} else if (x > 0) {
				swipeX = Lib.val.swipe.typeX = 'swipeRight';
			} else {
				swipeX = undefined;
			}

			// Y轴模式
			if (y < 0) {
				swipeY = Lib.val.swipe.typeY = 'swipeDown';
			} else if (y > 0) {
				swipeY = Lib.val.swipe.typeY = 'swipeUp';
			} else {
				swipeY = undefined;
			}

			// 定义各触摸模式
			if (!swipeX && !swipeY) {
				swipeType = undefined;
			} else if (swipeX && !swipeY) {
				swipeType = swipeX;
			} else if (!swipeX && swipeY) {
				swipeType = swipeY;
			} else if (swipeX && swipeY) {
				if (swipeX == 'swipeLeft') {
					if (xVal > yVal) {
						swipeType = 'swipeLeft';
					} else {
						if (y > 0) {
							swipeType = 'swipeUp';
						} else {
							swipeType = 'swipeDown';
						}
					}
				} else {
					if (xVal > yVal) {
						swipeType = 'swipeRight';
					} else {
						if (y > 0) {
							swipeType = 'swipeUp';
						} else {
							swipeType = 'swipeDown';
						}
					}
				}
			}

			// 返回最终的触摸模式
			return swipeType;
		},
		/* -----------------------------------------------
		 * @module 滑屏开始
		 * ----------------------------------------------- */
		swipeStart : function(e, target) {
			//e.preventDefault();
			e.stopPropagation();

			Lib.ele.page.now = target,
			Lib.val.page.now = Lib.index(target);

			// 执行外部事件
			this.handler.onSwipeStart();
			this.handler.onSlideStart();

			// 绑定Move事件
			Lib.bind(target, Lib.tapmove, this.onTap.move);

			// 绑定End事件
			Lib.bind(target, Lib.tapend, this.onTap.end);

			// 绑定Cancel事件
			Lib.bind(target, Lib.tapcancel, this.onTap.cancel);

			// 读取初始坐标
			Lib.val.xy.sx = Lib.isMobile ? e.touches[0].pageX : e.pageX;
			Lib.val.xy.sy = Lib.isMobile ? e.touches[0].pageY : e.pageY;
		},
		/* -----------------------------------------------
		 * @module 滑屏移动
		 * ----------------------------------------------- */
		swipeMove : function(e, target) {
			e.preventDefault();
			e.stopPropagation();

			// 读取移动中的坐标
			Lib.val.xy.mx = Lib.isMobile ? e.targetTouches[0].pageX : e.pageX,
			Lib.val.xy.my = Lib.isMobile ? e.targetTouches[0].pageY : e.pageY,

			// 移动中获取的回弹距离
			Lib.val.bounce.nowX = Lib.val.xy.sx - Lib.val.xy.mx,
			Lib.val.bounce.nowY = Lib.val.xy.sy - Lib.val.xy.my,
			Lib.val.swipe.type = this.getSwipe(Lib.val.bounce.nowX, Lib.val.bounce.nowY);

			this.handler.onSwipeMove();

			switch (Lib.val.swipe.typeY) {
				case 'swipeDown':
				case 'swipeUp':
					this.onSwipe({
						'swipe' : Lib.val.swipe.typeY,
						'bounce' : Lib.val.bounce.nowY,
						'type' : 'move'
					});
					break;
			}

			if (!target.classList.contains('noSwipeX')) {
				switch (Lib.val.swipe.type) {
					case 'swipeLeft':
					case 'swipeRight':
						this.handler.onSlideMove({
							'swipe' : Lib.val.swipe.type,
							'bounce' : Lib.val.bounce.nowX,
							'type' : 'move'
						});
						this.clearSwipe(false);
						break;
				}
			}

			Lib.val.xy.mx = Lib.val.xy.my = 0;
		},
		/* -----------------------------------------------
		 * @module 滑屏结束
		 * ----------------------------------------------- */
		swipeEnd : function(e, target) {
			//e.preventDefault();
			e.stopPropagation();

			// 移除绑定Move事件
			Lib.unbind(target, Lib.tapmove, this.onTap.move);

			// 移除绑定End事件
			Lib.unbind(target, Lib.tapend, this.onTap.end);

			// 移除绑定Cancel事件
			Lib.unbind(target, Lib.tapcancel, this.onTap.cancel);

			this.handler.onSwipeEnd();

			/*
			//读取触结束时的坐标
			Lib.val.xy.ex = Lib.isMobile ? e.changedTouches[0].pageX : e.pageX;
			Lib.val.xy.ey = Lib.isMobile ? e.changedTouches[0].pageY : e.pageY;
			*/
			switch (Lib.val.swipe.typeY) {
				case 'swipeDown':
				case 'swipeUp':
					this.onSwipe({
						'swipe' : Lib.val.swipe.typeY,
						'bounce' : Lib.val.bounce.nowY,
						'type' : 'end'
					});
					break;
			}

			if (!target.classList.contains('noSwipeX')) {
				switch (Lib.val.swipe.type) {
					case 'swipeLeft':
					case 'swipeRight':
						this.handler.onSlideEnd({
							'swipe' : Lib.val.swipe.type,
							'bounce' : Lib.val.bounce.nowX,
							'type' : 'end'
						});
						this.clearSwipe(false);
						break;
				}
			}

			// 重置swipe值
			Lib.val.xy.sx = Lib.val.xy.sy = 0,
			Lib.val.swipe.type = Lib.val.swipe.typeX = Lib.val.swipe.typeY = undefined;

			/*
			Lib.val.xy.ex = Lib.val.xy.ey = 0,
			*/
		},
		/* -----------------------------------------------
		 * @module 滑屏取消
		 * ----------------------------------------------- */
		swipeCancel : function(e, target) {
			e.preventDefault();
			e.stopPropagation();

			// 移除绑定Move事件
			Lib.unbind(target, Lib.tapmove, this.onTap.move);

			// 移除绑定End事件
			Lib.unbind(target, Lib.tapend, this.onTap.end);

			// 移除绑定Cancel事件
			Lib.unbind(target, Lib.tapcancel, this.onTap.cancel);

			// 重置swipe值
			Lib.val.xy.sx = Lib.val.xy.sy = Lib.val.xy.mx = Lib.val.xy.my = 0,
			Lib.val.swipe.type = Lib.val.swipe.typeX = Lib.val.swipe.typeY = undefined;

			// 清除未完成滑动的前后page
			this.clearSwipe(false);
		},
		/* -----------------------------------------------
		 * @module 执行页面滑动
		 * ----------------------------------------------- */
		onSwipe : function(param) {
			// 定义各种变量
			var absBounce = Math.abs(param.bounce),
				nextRestPageEle, // 下一个复位节点
				prevRestPageEle, // 上一个复位节点
				nextGroupStatus; // 下一个图组的状态

			// 获取下一个节点
			if (param.swipe == 'swipeUp') {
				if (Lib.val.page.now == this._size) {
					Lib.ele.page.next = Lib.ele.page.first;
				} else {
					Lib.ele.page.next = Lib.next(Lib.ele.page.now);
				}
			} else if (param.swipe == 'swipeDown') {
				if (Lib.val.page.now == 0) {
					Lib.ele.page.next = Lib.ele.page.last;
				} else {
					Lib.ele.page.next = Lib.prev(Lib.ele.page.now);
				}
			}

			// 根据nextObj得到下个加载页
			Lib.val.page.next = Lib.index(Lib.ele.page.next);

			// 改变zIndex值，以达到覆盖效果
			Lib.ele.page.now.style.zIndex = 1;
			Lib.ele.page.next.style.zIndex = 2;

			// 执行动画，如果过渡完成则继续后续操作
			if (this.module.swiper.swipe({
				'swipeType' : param.type,
				'swipe' : param.swipe,
				'absBounce' : absBounce,
				'nextGroupStatus' : this.module.loader._collection[Lib.val.page.next]['status'] // 取得下一页的图片组状态
			})) {
				this.swipeComplete();
			}
		},
		/* -----------------------------------------------
		 * @module 滑动结束
		 * ----------------------------------------------- */
		swipeComplete : function() {
			// 重定义this
			var that = this;

			// 执行外部事件
			this.handler.onTransformEnd();

			// 移除绑定Start事件
			Lib.unbind(Lib.ele.page.now, Lib.tapstart, this.onTap.start);

			// 翻页
			if ('pagination' in this.module.swiper) this.module.swiper.pagination.turn(Lib.val.page.next);

			if ('guider' in this.module.swiper) this.module.swiper.guider.hide(Lib.val.page.now);

			// 加载下一页的组图
			if (this.module.loader._nextGroup < this.module.loader._length) this.module.loader.load(this.module.loader._nextGroup);

			// 完成上一屏事件
			setTimeout(function() {
				// 清除未完成滑动的前后page
				that.clearSwipe(true);

				// 为下一个page重新绑定tapstart事件
				Lib.bind(Lib.ele.page.next, Lib.tapstart, that.onTap.start);

			}, this._time);
		},
		/* -----------------------------------------------
		 * @module 清除未完成的滑动
		 * ----------------------------------------------- */
		clearSwipe : function(isRest) {
			var currentEle = null,
				beforePageEle = null,
				afterPageEle = null,
				nowPageIndex;

			//根据status确定需要重置的对象
			if (isRest) {
				currentEle = Lib.ele.page.next;
			} else {
				currentEle = Lib.ele.page.now;

				// 重置当前滑动距离
				Lib.val.bounce.nowY = 0;
			}

			nowPageIndex = Lib.index(currentEle);

			// 获取前后节点
			if (nowPageIndex == 0) {
				beforePageEle = Lib.ele.page.last;
				afterPageEle = Lib.next(currentEle);
			} else if (nowPageIndex == this._size) {
				beforePageEle = Lib.prev(currentEle);
				afterPageEle = Lib.ele.page.first;
			} else {
				beforePageEle = Lib.prev(currentEle);
				afterPageEle = Lib.next(currentEle);
			}

			// 重置样式位置
			if (beforePageEle) {
				beforePageEle.style[Lib.transform] = 'translateY(-100%)';
				beforePageEle.style.zIndex = 0;
				beforePageEle.style.opacity = 1;
			}
			if (afterPageEle) {
				afterPageEle.style[Lib.transform] = 'translateY(100%)';
				afterPageEle.style.zIndex = 0;
				afterPageEle.style.opacity = 1;
			}

			// 根据rest判断transition样式
			if (isRest) {
				if (beforePageEle) beforePageEle.style[Lib.transition] = 'none';
				if (afterPageEle) afterPageEle.style[Lib.transition] = 'none';
			} else {
				if (beforePageEle) beforePageEle.style[Lib.transition] = this._time +'ms cubic-bezier(.68,.18,.25,.89)';
				if (afterPageEle) afterPageEle.style[Lib.transition] = this._time +'ms cubic-bezier(.68,.18,.25,.89)';
				currentEle.style[Lib.transition] = this._time +'ms cubic-bezier(.68,.18,.25,.89)';
				currentEle.style[Lib.transform] = 'translateY(0)';
			}
		}
	}

	/* ==================================================
	 * @constructor(*) 微杂志展示[Module]
	 * @param(param:json *) 模块参数
	 *   + (item:array *) 需要展示的微杂志的ID
	 *   + (callback:funtion * (coverList)) 请求展示的微杂志封面URL并执行回调，开始APP的加载
	 * ================================================== */
	AppGallery = function(param, callback) {
		if (Lib.isJSON(param) && Lib.isArray(param.item)) {
			this.initialize(param.item, callback);
		} else {
			if (Lib.isFunction(callback)) callback();
		}
	}
	AppGallery.prototype = {
		initialize : function(item, callback) {
			var wrap = document.createElement('div'),
				galleryBox = document.createElement('div'),
				titleBox = document.createElement('div'),
				logoBtn = document.createElement('a'),
				shareBtn = document.createElement('a'),
				shareText = document.createTextNode('分享'),

				listBox = document.createElement('div'),
				listTit = document.createElement('h3'),
				listTitSpan = document.createElement('span'),
				listTitB = document.createElement('b'),
				listTitEm = document.createElement('em'),
				bText = document.createTextNode('推荐杂志'),
				emText = document.createTextNode('Recommend Magazine'),

				listWrap = this._listWrap = document.createElement('ul');

			wrap.className = 'app-gallery page';

			galleryBox.className = 'app-gallery-box';
			titleBox.className = 'app-gallery-title';
			logoBtn.className = 'app-gallery-logo icon';
			logoBtn.href = 'http://app.hithinktank.com/';
			shareBtn.className = 'openShareBtn';
			shareBtn.appendChild(shareText);

			listBox.className = 'app-gallery-list';
			listWrap.className = 'clearfix';

			titleBox.appendChild(logoBtn);
			titleBox.appendChild(shareBtn);

			listTitB.appendChild(bText);
			listTitSpan.appendChild(listTitB);
			listTitEm.appendChild(emText);

			listTit.appendChild(listTitSpan);
			listTit.appendChild(listTitEm);

			listBox.appendChild(listTit);
			listBox.appendChild(listWrap);

			galleryBox.appendChild(titleBox);
			galleryBox.appendChild(listBox);

			wrap.appendChild(galleryBox);

			Lib.ele.content.appendChild(wrap);

			Lib.dom(this.getData(item, callback));
		},
		getData : function(item, callback) {
			var that = this,
				url = 'http://liveapp2015.hithinktank.com/',
				coverList = [];

			$.ajax({
				url : url,
				type : 'POST',
				dataType : 'json',
				data : {
					a : 'getlistinfo',
					item : item.toString()
				},
				success : function(data) {
					if (data.status == 1) {
						var list = data.list;
						for (var key in list) {
							var li = document.createElement('li'),
								a = document.createElement('a'),
								img = document.createElement('img');

							a.href = url + '?c=show&id=' + list[key].id;
							coverList.push(list[key].cover);
							img.dataset.lazy = true;

							a.appendChild(img);
							li.appendChild(a);
							that._listWrap.appendChild(li);
						}

						if (Lib.isFunction(callback)) callback(coverList);
					}
				}
			})
		}
	}

	/* ==================================================
	 * @constructor(*) APP加载器[Module]
	 * @param(param:json) 参数
	 *   - (img:array) 图片资源初始数组集,后期将被销毁
	 *   - (color:json) 页面背景色
	 *     - (index : hexcolor) 页面背景色
	 *   - (dir:string['img/']) 图像目录
	 *   - (loop:booblean[false]) 组图循环加载
	 *   - (thread:number[2]) 组片加载方式：1为单线程,2为多线程,推荐为2
	 *   - (first:number[2]) 首次下载图组数量，不得超过图组总数，必须大于0的整数
	 *   + (process:json) 加载进度器参数
	 *     - (wrap:element[Lib.ele.container]) 外包围DOM
	 *     - (time:millisecond[300]) 动画过渡时间
	 *     - (color:hexcolor) 载入器背景色
	 * ================================================== */
	AppLoader = function(param){
		this._temp = param.img,
		this._color = Lib.isJSON(param.color) ? param.color : {},
		this._dir = Lib.isString(param.dir) ? param.dir : 'img/',
		this._loop = Lib.isBoolean(param.loop) ? param.loop : false,
		this._thread = Lib.isNumber(param.thread) ? param.thread : 2,
		this._first = Lib.isNumber(param.first) ? param.first : 2,
		this._collection = [],
		this._length = Lib.ele.page.all.length, // 组图总数
		this._imgIndex = 0, // 起始图索引,默认为0
		this._nextGroup = 0, // 下一组图组索引,默认为0
		this._loadSize = 0, // 加载队列中的图片数量
		this._processVal = 0, // 加载进度百分值
		this._lastSize = 0,  // 剩余加载队列中的图片数量
		this._timer = undefined, // 执行查检组图状态的setInterval
		this._time = 100, // 执行查检组图状态的间隔时间
		this.processer = new LoadProcess(param.process);
	}
	AppLoader.prototype = {
		/* -----------------------------------------------
		 * @module 初始化装载
		 * ----------------------------------------------- */
		initialize : function(callback){
			this.initialLoad = callback;
			// 正式遍历page节点
			for (var i = 0; i < this._length; i++) {
				/*
				 * 为资源的DOM添加样式,方便后续append()方法赋值
				 * 如果page有使用背景图,则此page的index则为0,子节点同步+1
				 * 如果page没有背景图,那么此page的子节点从0开始
				*/
				var thisPage = Lib.ele.page.all[i];

				if (this._color[i] && Lib.isHexColor(this._color[i])) thisPage.style.backgroundColor = this._color[i];

				if (thisPage.dataset.lazy === 'true') {
					thisPage.dataset.lazy = i +'-0';
					this.each(thisPage, i, 1);
				} else {
					this.each(thisPage, i, 0);
				}

				// 定义首次加载的图片数量
				if (i <= this._first) this._loadSize = this._lastSize += this._temp[i].length;

				// 将json拉入到图片组集合中
				this._collection.push({
					'page': i,
					'status': false,
					'group': this._temp[i]
				});
			}

			// 消毁图片原始数组
			delete this._temp;

			// 开始加载图片,从0（this._nextGroup默认为0）开始
			this.load(this._nextGroup);
		},
		/* -----------------------------------------------
		 * @module 遍历lazy节点,重新改变样式名称
		 * ----------------------------------------------- */
		each : function(_page, i, val) {
			var lazyNodes = _page.querySelectorAll('[data-lazy="true"]');
			for (var j = 0; j < lazyNodes.length; j++) {
				lazyNodes[j].dataset.lazy = i + '-' + (j + val);
			}
		},
		/* -----------------------------------------------
		 * @module 加载页面图片组
		 *   - (group:index) 图片组index,一般等同于页面index
		 * ----------------------------------------------- */
		load : function(group) {
			// 重定义this
			var that = this;
			/*
			 * 使用onLoad()方法开始加载图片
			 * 先进行图片的加载；
			 * 加载过程中会改变组图的'status'值,并返回给check()方法
			 * 当返回回来的值为true时,check()方法会停止,并给出后续操作
			 */
			this.onLoad(group);

			/*
			 * 隔时请求组图的'status'值开始
			 * 返回false时再次执行
			 * 返回true时停止执行,并进行后续操作
			 */
			this._timer = setInterval(function() {
				// check组图状态
				// 成功返回true
				if (that.check(group)) {
					// 清除定时器
					clearInterval(that._timer);

					// 当组图为0时,显示第一屏的真实页面内容
					if (group == that._first) that.initialLoad();

					// 如果loop为true,则加载所有后续组图,否则则使用first的预设值预先加一定数量的图组
					if (that._loop) {
						if (that._nextGroup < that._length) that.load(that._nextGroup);
					} else {
						if (that._nextGroup <= that._first) that.load(that._nextGroup);
					}
				// 返回false
				} else {
					// 再次check组图状态
					that.check(group);
				}
			}, this._time);
		},
		/* -----------------------------------------------
		 * @module 检查图组状态
		 * ----------------------------------------------- */
		check : function(group) {
			return this._collection[group]['status'];
		},
		/* -----------------------------------------------
		 * @module 请求图组信息
		 * ----------------------------------------------- */
		onLoad : function(group) {
			// 初始化图片组变量
			var _collection = this._collection[group], // 根据group来取得组图数组
				_page = _collection['page'], // 根据数据,得到page值,一般而方page值等于参数group;
				_status = _collection['status'], // 根据数据,得到组图状态
				_groupImg = _collection['group'], // 根据数据,得到图片合集
				_groupImgSize = _lastImgGroupSize = _groupImg.length; // 根据得到的图片合集,得到该组中的图片数量,关以此判断后绪操作是否把该组中的所有图片全部加载完成

			// 非自动加载的组队列则使用自己的组图数为队列图片数
			if (group > this._first) this._loadSize = this._lastSize = _groupImgSize;

			if (_status == false && _groupImgSize > 0) {
				this.processer.progress(this._processVal);

				// 根据不同的加载模式来进行不同的加载操作
				switch (this._thread) {
					case 1 :
						// 开始加载图片;
						this.start(0, _collection, _page, _groupImg);
						break;
					case 2 :
						for (var i = 0; i < _groupImgSize; i++) {
							this.start(i, _collection, _page, _groupImg);
						}
						break;
				}
			} else {
				_collection['status'] = true;
				this._nextGroup += 1;
			}
		},
		/* -----------------------------------------------
		 * @module 图片加载开始
		 * ----------------------------------------------- */
		start : function(index, _c, _p, _i) {
			// 重定义this
			var that = this,
				imgUrl = this._dir + _i[index], // 取出当前图片组中的第一条数据,并定义变量;
				imgIndex,
				thisImg = document.createElement('img'); // 开始加载图片

			thisImg.src = imgUrl;

			// 根据不同的加载方式得到不同的索引值,并提供组success方法使用
			switch (this._thread) {
				case 1 :
					imgIndex = this._imgIndex;
					break;
				case 2 :
					imgIndex = index;
					break;
			}

			// 判断图片状态,并重新检查所有数组中的图片
			if (thisImg.complete) {
				// 调用缓存,执行返回操作,并设定页面dom的值
				this.success(imgUrl, imgIndex, _c, _p, _i);
			} else {
				// 加载完成,并设定页面dom的值
				thisImg.onload = function() {
					that.success(imgUrl, imgIndex, _c, _p, _i);
				}
				thisImg.onerror = function() {
					// 加载错误,重新加载
					that.start(index, _c, _p, _i);
				}
			}
		},
		/* -----------------------------------------------
		 * @module 图片加载完成
		 * ----------------------------------------------- */
		success :  function(url, index, _c, _p, _i) {
			this.append(url, _p, index);

			// 更新数组,从update()方法获取_lastImgGroupSize;
			var lastGroupSize = this.update(_i);

			// 根据最新数量做不同执行
			if (lastGroupSize > 0 && this._thread == 1) {
				// 继续加载下一张
				this.start(0, _c, _p, _i);
			} else if (lastGroupSize == 0) {
				// 重置图片的初始请求索引
				this._imgIndex = 0;

				// 更新页面状态
				_c['status'] = true;

				// 更新下一图组索引
				this._nextGroup++;
			}

		},
		/* -----------------------------------------------
		 * @module 为lazy节点赋值
		 * ----------------------------------------------- */
		append : function(url, group, index) {
			// 设定变量
			var elemLazyIndex = group +'-'+ index,
				thisElem = document.querySelector('[data-lazy="'+ elemLazyIndex +'"]'),
				elemType = thisElem.nodeName.toLowerCase();

			// 设置url
			if (elemType === 'img') {
				thisElem.setAttribute('src', url);
			} else {
				thisElem.style.backgroundImage = 'url('+ url +')';
			}
		},
		/* -----------------------------------------------
		 * @module 更新组图参数
		 * ----------------------------------------------- */
		update : function(_i) {
			// 更新组图片数量
			if (this._thread === 1) {
				// 更新当前图片索引
				this._imgIndex++;

				// 删除当前图片数组
				_i.splice(0, 1);
				thatImgGroupArray = _i[0];

				// 定义最新的组图个数
				_lastImgGroupSize = _i.length;
			} else if (this._thread === 2) {
				// 定义最新的组图个数
				_lastImgGroupSize--;
			}

			// 更新加载值
			this._lastSize--;

			// 更新下载进度
			var loadProcess = (this._loadSize - this._lastSize) / this._loadSize;
			this._processVal = loadProcess.toFixed(4) * 100;

			// 更新加载进度
			this.processer.progress(this._processVal);

			if (this._lastSize === 0) this._processVal = 0;

			// 返回最终的组图片个数,方便success()方法调用
			return _lastImgGroupSize;
		}
	}

	/* ==================================================
	 * @constructor(*) 加载进度器[Module]
	 * @param(param:json) 参数
	 *   - (wrap:element[Lib.ele.container]) 外包围DOM
	 *   - (time:millisecond[300]) 动画过渡时间
	 *   - (color:hex color) 载入器背景色
	 * ================================================== */
	LoadProcess = function(param) {
		if (!Lib.isJSON(param)) param = {};

		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.container,
		this._time = Lib.isNumber(param.time) ? param.time : 300,
		this._color = Lib.isString(param.color) ? param.color : undefined,
		this._bout = 0;

		// 执行初始化装载
		this.initialize();
	}
	LoadProcess.prototype = {
		/* -----------------------------------------------
		 * @module 初始化
		 * ----------------------------------------------- */
		initialize : function() {

			var progreDot = this._progreDot = document.createElement('b'), // 进度顶点
				progreLine = this._progreLine = document.createElement('s'), // 进度条
				progreBar = this._progreWrap = document.createElement('i'), // 进度条外层
				processer = this._process = document.createElement('div'); // 加载器外层

			this._progreLine.style[Lib.transition] = 'width ' + this._time + 'ms linear';
			this._progreLine.style.width = 0;

			processer.className= 'app-loader';
			if (this._color) processer.style.backgroundColor = this._color;

			// 将子节点放入加载器
			progreLine.appendChild(progreDot);
			progreBar.appendChild(progreLine);
			processer.appendChild(progreBar);

			// 在外包围DOM中置入加载器
			this._wrap.appendChild(processer);

			// 显示页面层
			Lib.ele.content.style.display = 'block';
		},
		/* -----------------------------------------------
		 * @module 加载进度更新
		 * @param(value:number) 进度值
		 * ----------------------------------------------- */
		progress : function(value) {
			if (value == 0) {
				this.start();
			} else if (value == 100) {
				this.complete();
			} else {
				this.process(value);
			}
		},
		/* -----------------------------------------------
		 * @module 加载加始
		 * ----------------------------------------------- */
		start : function() {
			$(this._process).fadeIn(this._time);
			this._progreLine.style[Lib.transition] = 'width ' + this._time + 'ms linear';
			this._progreLine.style.width = 0;
		},
		/* -----------------------------------------------
		 * @module 加载完成
		 * ----------------------------------------------- */
		complete : function() {
			// 重定义this
			var that = this;

			// 进度100
			this._progreLine.style.width = '100%';
			setTimeout(function() {
				$(that._process).fadeOut(this._time, function() {
					if (that._bout == 0) that._process.classList.add('mini');
					that._bout++;
					that._progreLine.style[Lib.transition] = 'none';
					that._progreLine.style.width = 0;
				})
			}, this._time)

		},
		/* -----------------------------------------------
		 * @module 加载中进度
		 * @config(value:number) 进度值,progress()中传值
		 * ----------------------------------------------- */
		process : function(value) {
			this._progreLine.style.width = value + '%';
		}
	}

	/* ==================================================
	 * @constructor(*) 页面滑动过渡[Module]
	 * @param(param:json) 参数
	 *   + (swiper:json *) 滑动器参数
	 *     - (effect:string['rotateX']) 滑动效果(translate/scale/cover/rotateX/push)
	 *     - (time:millisecond[400]) 滑动过渡时间
	 *     - (maxBounce:string[Lib.val.bounce.y]) 滑动回弹值
	 *   + (pagination:json) 分页参数
	 *     - (wrap:element[Lib.ele.container]) 分页外包围DOM
	 *     - (full:boolean[false]) 是否启用全高度分页
	 * ================================================== */
	AppSwiper = function(param) {
		if (!Lib.isJSON(param)) param = {};
		var swiper = Lib.isJSON(param.swiper) ? param.swiper : {}
			pagination = param.pagination,
			guider = param.guider,
			size = Lib.ele.page.all.length - 1;

		this._time = Lib.isNumber(swiper.time) ? swiper.time : 400
		// 实例化swiper
		this.initialize({
			'effect' : Lib.isString(swiper.effect) ? swiper.effect : 'rotateX',
			'time' : this._time,
			'maxBounce' : Lib.isNumber(swiper.maxBounce) ? swiper.maxBounce : Lib.val.bounce.y,
			'size' : size
		});

		// 如果分布参数为true,则创建分页
		if (Lib.isJSON(pagination)) {
			// 初始化翻页
			this.pagination = new AppPagination({
				'wrap' : pagination.wrap,
				'full' : pagination.full,
				'size' : size
			});
		}

		// 上滑提示
		if (Lib.isJSON(guider)) {
			this.guider = new SwipeGuider({
				'wrap' : guider.wrap,
				'time' : guider.time,
				'hide' : guider.hide,
				'text' : guider.text,
				'bottom' : guider.bottom,
				'last' : size
			});
		}
	}
	AppSwiper.prototype = {
		/* --------------------------------------------------
		 * @module 初始化页面滑动过渡
		 * @param(param:json) 参数
		 *   - (effect:string) 滑动效果
		 *   - (time:millisecond) 滑动过渡时间
		 *   - (maxBounce:string) 滑动回弹值
		 * -------------------------------------------------- */
		initialize : function(param) {
			this.swiper = new VertSwiper(param);
		},
		swipe : function(val) {
			return this.swiper.swipe(val);
		}
	}

	/* ==================================================
	 * @constructor 垂直滑动器[Module]
	 * @param(param:json) 参数
	 *   - (effect:string) 过渡效果
	 *   - (time:millisecond) 滑动过渡时间
	 *   - (maxBounce:number) 滑动回弹值
	 * ================================================== */
	VertSwiper = function(param) {
		this._effect = param.effect,
		this._time = param.time,
		this._maxBounce = param.maxBounce,
		this._firstPage = Lib.ele.page.first,
		this._lastPage = Lib.ele.page.last,
		this._pageSize = param.size;

		// 实例化一个垂直滑动效果(继承到此垂直滑动器)
		this.swiper = new VertEffect(this._effect);
	}
	VertSwiper.prototype = {
		/* --------------------------------------------------
		 * @module 根据swipe.status返回状态,为true时将在过渡中执行复位
		 * -------------------------------------------------- */
		checkSwipe : function() {
			var _s = this._swipe,
				_st = this._swipeStatus,
				_ps = this._pageSize,
				_fp = this._firstPage,
				_lp = this._lastPage,
				_n = this._now,
				_np = this._nowPage;

			if (_s != _st) {
				if (_n != _ps) {
					this._nextRestPageEle = Lib.next(_np);
				} else {
					this._nextRestPageEle = _fp;
				}
				if (_n != 0) {
					this._prevRestPageEle = Lib.prev(_np);
				} else {
					this._prevRestPageEle = _lp;
				}

				// 更新状态
				Lib.val.swipe.status = _s;

				// 返回true
				return true;
			} else {
				// 返回false
				return false;
			}
		},
		/* --------------------------------------------------
		 * @module 防止卡屏
		 * -------------------------------------------------- */
		restore : function(status) {
			if (status) {
				if (this._nextRestPageEle) {
					this._nextRestPageEle.style[Lib.transform] = 'translateY(100%)';
				}
				if (this._prevRestPageEle) {
					this._prevRestPageEle.style[Lib.transform] = 'translateY(-100%)';
				}
			}
		},
		/* --------------------------------------------------
		 * @module 滑动完成后续
		 * -------------------------------------------------- */
		after : function() {
			if (!this._isSwipe) {
				this._nowPage.style.zIndex = 2;
				this._nextPage.style.zIndex = 1;
			} else if (this._isSwipe && this._now == this._pageSize && this._swipe == 'swipeUp') {
				Lib.val.loop = true;
			}
		},
		/* --------------------------------------------------
		 * @module 计算滑动样式值
		 * -------------------------------------------------- */
		calculate : function() {
			// 执行转换
			this.swiper(this.getValue(), this._nowPage, this._nextPage);

			// 滑动停止时返回滑动结果
			if (this._swipeType == 'end') {
				return this._isSwipe;
			}
		},
		getValue : function() {
			var _abs = this._absBounce,
				_mxb = this._maxBounce,
				_ph = this._pageHeight,
				_st = this._swipeType,
				_sw = this._swipe,
				_ngs = this._nextGroupStatus,
				_at = this._time,
				_nrp = this._nextRestPageEle,
				_prp = this._prevRestPageEle,
				_n = this._now,
				_nop = this._nowPage,
				_nxp = this._nextPage;

			var	nowBounce = _abs / 5,
				nextBounce = _abs / 2,
				nowScaleVal = (_ph - _abs * 0.25) / _ph,
				nowRotateX = (_abs / _ph / 8) * 90,
				nowOpacityVal = (_ph - _abs) / _ph,
				nextShdowRange = _abs / 2, // 阴影范围
				nextShdowDegree = (_ph - (_ph - _abs)) / _ph, // 阴影颜色深度
				nowBounceVal, // 当前纵向回弹值
				nowRotateXVal, // 当前rotateX值
				nextBounceVal, // 下一个纵向回弹值
				transitionVal, // 过渡值
				nextShdowVal; // 下一个阴影值

			switch (_st) {
				case 'move' :
					if (_sw == 'swipeUp') {
						nowBounceVal = - nowBounce + 'px';
						nowRotateXVal = - nowRotateX;
						nextBounceVal = _ph - nextBounce + 'px';
					} else if (_sw == 'swipeDown') {
						nowBounceVal = nowBounce + 'px';
						nowRotateXVal = nowRotateX;
						nextBounceVal = -_ph + nextBounce + 'px';
					}
					transitionVal = '0ms linear';
					nextShdowVal = '0 0 '+ nextShdowRange +'px rgba(0,0,0,'+ nextShdowDegree +')';
					break;
				case 'end' :
					switch (_abs > _mxb) {
						case true :
							switch (_sw) {
								case 'swipeUp' :
									nowBounceVal = '-30%';
									nowRotateXVal = -20;
									break;
								case 'swipeDown' :
									nowBounceVal = '30%';
									nowRotateXVal = 20;
									break;
							}
							nextBounceVal = 0;
							nowOpacityVal = 0;

							this._isSwipe = true;
							break;
						case false :
							nowBounceVal = 0;
							switch (_sw) {
								case 'swipeUp' :
									nextBounceVal = '100%';
									break;
								case 'swipeDown' :
									nextBounceVal = '-100%';
									break;
							}
							nowScaleVal = 1;
							nowRotateXVal = 0;
							nowOpacityVal = 1;
							break;
					}
					transitionVal = _at +'ms cubic-bezier(.68,.18,.25,.89)';
					nextShdowVal = 'none';
					break;
			}

			// 取得下一页的图片组状态
			if (_sw == 'swipeUp' && !_ngs) {
				nextBounceVal = '100%';
				if (_st == 'end') {
					nowBounceVal = 0;
					nowScaleVal = 1;
					nowRotateXVal = 0;
					nowOpacityVal = 1;
					nextShdowVal = 'none';

					this._isSwipe = false;
				}
			}

			// 第一屏特殊处理
			if (_n == 0 && _sw == 'swipeDown' && !Lib.val.loop) {
				nextBounceVal = '-100%';
				if (_st == 'end') {
					nowBounceVal = 0;
					nowScaleVal = 1;
					nowRotateXVal = 0;
					nowOpacityVal = 1;
					nextShdowVal = 'none';

					this._isSwipe = false;
				}
			}

			// 以json形式返回最终的过渡参数值
			return {
				'now' : nowBounceVal,
				'next' : nextBounceVal,
				'tran' : transitionVal,
				'scale' : nowScaleVal,
				'rota' : nowRotateXVal,
				'alpha' : nowOpacityVal,
				'shadow' : nextShdowVal,
				'swipe' : _sw
			};
		},
		/* --------------------------------------------------
		 * @module 滑动执行
		 * @param(param:json) 过渡效果
		 *   - (swipeType.string) 滑动类型
		 *   - (swipe.string) 滑动方向
		 *   - (absBounce.number) 当前滑动距离
		 *   - (nextGroupStatus.number) 下一组图片加载状态
		 * -------------------------------------------------- */
		swipe : function(param) {
			this._swipeType = param.swipeType,
			this._swipe = param.swipe,
			this._absBounce = param.absBounce,
			this._nextGroupStatus = param.nextGroupStatus,
			this._isSwipe = false,
			this._swipeStatus = Lib.val.swipe.status,
			this._now = Lib.val.page.now,
			this._pageHeight = Lib.val.size.height,
			this._nowPage = Lib.ele.page.now,
			this._nextPage = Lib.ele.page.next;

			// 实时根据状态重置位置
			this.restore(this.checkSwipe());

			// 实时取回计算结果
			var result = this.calculate();

			// 当没有真正实现过渡时,还原zIndex值,以达到重新覆盖效果
			if (this._swipeType == 'end') {
				// 滑动停止时运行
				this.after();
				// 返回结果
				return result;
			}
		}
	}

	/* ==================================================
	 * @constructor 垂直滑动效果库[Library]
	 * @param(effect:string) 过渡效果
	 * ================================================== */
	VertEffect = function(effect) {
		var mode;

		switch (effect) {
			case 'rotateX':
				mode = this.rotateX;
				break;
			case 'translate':
				mode = this.translate;
				break;
			case 'scale':
				mode = this.scale;
				break;
			case 'cover':
				mode = this.cover;
				break;
			case 'push':
				mode = this.push;
				break;
		}

		return mode;
	}
	VertEffect.prototype = {
		/* --------------------------------------------------
		 * @module 纵向X轴翻转过渡
		 * @param(_value:json) 样式值
		 * @param(_nop:element) 当前元素
		 * @param(_nxp:element) 下一个元素
		 * -------------------------------------------------- */
		rotateX : function(_value, _nop, _nxp) {
			_nop.style[Lib.transition] = _nxp.style[Lib.transition] = _value.tran;
			_nop.style[Lib.transform] = 'translateY('+ _value.now +') scale('+ _value.scale +') perspective('+ Lib.val.size.winWidth +'px) rotateX('+ _value.rota +'deg)';
			_nop.style.opacity = _value.alpha;
			_nxp.style[Lib.transform] = 'translateY('+ _value.next +')';
			_nxp.style.boxShadow = _value.shadow;
		},
		/* --------------------------------------------------
		 * @module 纵向同步过渡
		 * @param(_value:json) 样式值
		 * @param(_nop:element) 当前元素
		 * @param(_nxp:element) 下一个元素
		 * -------------------------------------------------- */
		translate : function(_value, _nop, _nxp) {
			_nop.style[Lib.transition] = _nxp.style[Lib.transition] = _value.tran;
			_nop.style[Lib.transform] = 'translateY('+ _value.now +')';
			_nxp.style[Lib.transform] = 'translateY('+ _value.next +')';
			_nxp.style.boxShadow = _value.shadow;
		},
		/* --------------------------------------------------
		 * @module 纵向缩放同步过渡
		 * @param(_value:json) 样式值
		 * @param(_nop:element) 当前元素
		 * @param(_nxp:element) 下一个元素
		 * -------------------------------------------------- */
		scale : function(_value, _nop, _nxp) {
			_nop.style[Lib.transition] = _nxp.style[Lib.transition] = _value.tran;
			_nop.style[Lib.transform] = 'translateY('+ _value.now +') scale('+ _value.scale +')';
			_nxp.style[Lib.transform] = 'translateY('+ _value.next +')';
			_nxp.style.boxShadow = _value.shadow;
		},
		/* --------------------------------------------------
		 * @module 纵向覆盖过渡
		 * @param(_value:json) 样式值
		 * @param(_nop:element) 当前元素
		 * @param(_nxp:element) 下一个元素
		 * -------------------------------------------------- */
		cover : function(_value, _nop, _nxp) {
			_nop.style[Lib.transition] = _nxp.style[Lib.transition] = _value.tran;
			if (Lib.val.page.now === 0 && Lib.val.loop === false && _value.swipe === 'swipeDown') {
				_nop.style[Lib.transform] = 'translateY('+ _value.now +')';
			}
			_nxp.style[Lib.transform] = 'translateY('+ _value.next +')';
			_nxp.style.boxShadow = _value.shadow;
		},
		push : function(_value, _nop, _nxp) {
			var nowVal;
			if (_value.next === '100%' || _value.next === '-100%') {
				nowVal = _value.now;
			} else {
				switch (_value.swipe) {
					case 'swipeUp' :
						nowVal = '-' + (Lib.val.size.height - parseInt(_value.next)) + 'px';
						break;
					case 'swipeDown' :
						nowVal =  (Lib.val.size.height + parseInt(_value.next)) + 'px';
						break;
				}
			}
			_nop.style[Lib.transition] = _nxp.style[Lib.transition] = _value.tran;
			_nop.style[Lib.transform] = 'translateY(' + nowVal + ')';
			_nxp.style[Lib.transform] = 'translateY('+ _value.next +')';
			_nxp.style.boxShadow = _value.shadow;
		}
	}

	/* ==================================================
	 * @constructor(*) 微信API[Module]
	 * @param(param:json) 参数
	 *   + (share:json) 分享
	 *     - (hide:boolean[false]) 是否隐藏功能选项
	 *     - (title:string) 内容标题
	 *     - (url:string) 页面URL地址
	 *     - (desc:string) 内容描述
	 *     - (img:string['img/cover.jpg']) 封面图片URL地址
	 *     - (width:number[240]) 图片宽度
	 *     - (height:number[240]) 图片高度
	 *   + (tips:json) 分享提示
	 *     - (wrap:element) 提示外包围DOM
	 *     - (time:millisecond) 过渡时长
	 *     - (btn:element) 显示提示的按钮DOM
	 * ================================================== */
	WechatAPI = function(param) {
		var param = Lib.isJSON(param) ? param : {},
			share = Lib.isJSON(param.share) ? param.share : {},
			tips = param.tips,
			imgSrc = Lib.isString(share.img) ? share.img : 'img/cover.jpg';

		this._hide = Lib.isBoolean(share.hide) ? share.hide : false,
		this._title = Lib.isString(share.title) ? share.title : document.title,
		this._url = Lib.isString(share.url) ? share.url : window.location.href,
		this._desc = Lib.isString(share.desc) ? share.desc : document.querySelector('meta[name="description"]').content,
		this._width = Lib.isNumber(share.width) ? share.width : 240,
		this._height = Lib.isNumber(share.height) ? share.height : 240,
		this._cover = document.createElement('img');
		this._cover.src = imgSrc;

		if (Lib.isJSON(tips) && (Lib.isElement(tips.btn) || Lib.isNodelist(tips.btn))) {
			// 实例化一个分享提示
			this.tipser = new ShareTipser({
				'wrap' : tips.wrap,
				'time' : tips.time,
				'btn' : tips.btn
			});
		}

		this.initialize();
	}
	WechatAPI.prototype = {
		initialize : function() {
			var that = this,
				url = window.location.href.replace(/&/g, '@');

			$.ajax({
				url : 'http://liveapp2015.hithinktank.com/',
				type : 'GET',
				data : {
					a : 'getjssdk',
					url : url
				},
				dataType : 'json',
				success : function(data) {
					wx.config({
						debug : false,
						appId : data.appId,
						timestamp : data.timestamp,
						nonceStr : data.nonceStr,
						signature : data.signature,
						jsApiList : ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'showOptionMenu', 'hideOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem']
					});

					wx.ready(function() {
						wx.onMenuShareAppMessage({
							title: that._title,
							desc: that._desc,
							link: that._url,
							imgUrl: that._cover.src,
							type: 'link',
							dataUrl: '',
							success: function() {},
							cancel: function() {}
						});

						wx.onMenuShareTimeline({
							title: that._title,
							link: that._url,
							imgUrl: that._cover.src,
							success: function() {},
							cancel: function() {}
						});

						wx.onMenuShareQQ({
							title: that._title,
							desc: that._desc,
							link: that._url,
							imgUrl: that._cover.src,
							success: function() {},
							cancel: function() {}
						});

						wx.onMenuShareWeibo({
							title: that._title,
							desc: that._desc,
							link: that._url,
							imgUrl: that._cover.src,
							success: function() {},
							cancel: function() {}
						});

						if (that._hide) {
							wx.hideAllNonBaseMenuItem();
						} else {
							wx.hideAllNonBaseMenuItem();
							wx.showMenuItems({
								menuList: [
									'menuItem:share:appMessage',
									'menuItem:share:timeline',
									'menuItem:share:qq',
									'menuItem:share:weiboApp',
									'menuItem:favorite',
									'menuItem:share:facebook'
								]
							});
						}
					});
				}
			});


		},
		bindTipser : function() {
			var openShareBtn = document.querySelectorAll('.openShareBtn');
			if (openShareBtn.length > 0) {
				if (this.tipser) {
					this.tipser.bindEvent(openShareBtn);
				} else {
					this.tipser = new ShareTipser({
						'btn' : document.querySelectorAll('.openShareBtn')
					})
				}
			}
		}
	}

	/* --------------------------------------------------
	 * @constructor APP分页[Component]
	 * @param(param:json) 参数
	 *   - (wrap:element) 分页外包围DOM
	 *   - (full:boolean) 是否启用全高度分页
	 * -------------------------------------------------- */
	AppPagination = function(param) {
		this._wrap = Lib.isElement(pagination.wrap) ? pagination.wrap : Lib.ele.container,
		this._full = Lib.isBoolean(pagination.full) ? pagination.full : false,
		this._length = Lib.ele.page.all.length,
		this._pages = null;

		// 创建分页
		this.initialize();
	}
	AppPagination.prototype = {
		/* --------------------------------------------------
		 * @module 创建分页
		 * -------------------------------------------------- */
		initialize : function() {
			var pagerWrap = this._pagerWrap = document.createElement('div');
				pagerWrap.className = 'app-pagination';

			if (this._full) pagerWrap.style.height = '100%';

			for (var i = 0; i < this._length; i++) {
				var dot = document.createElement('i');
				pagerWrap.appendChild(dot);

				if (this._full) {
					var dotHeight = 100 / this._length + '%';
					dot.style.margin = 0;
					dot.style.height = dotHeight;
				}
			}

			this._wrap.appendChild(pagerWrap);
			this._pages = pagerWrap.querySelectorAll('i');

			// 默认从第0页开始
			this.turn(0);
		},
		/* --------------------------------------------------
		 * @module 翻页
		 * @param(index:number) 页面索引值
		 * -------------------------------------------------- */
		turn : function(index) {
			for (var i = 0; i < this._pages.length; i++) {
				if (i == index) {
					this._pages[i].className = 'current';
				} else {
					if (this._pages[i].classList.contains('current')) {
						this._pages[i].removeAttribute('class');
					}
				}
			}
		}
	}

	/* ==================================================
	 * @constructor 上滑提示[Component]
	 * @param(param:json) 参数
	 *   - (wrap:element[Lib.ele.container]) 外包围DOM
	 *   - (hide:number[2]) 是否自动隐藏提示(0:永不自动隐藏/1:过首屏自动隐藏/2:过末屏自动隐藏)
	 *   - (time:millisecond[300]) 自动隐藏隔时
	 * ================================================== */
	SwipeGuider = function(param) {
		if (!Lib.isJSON(param)) param = {};

		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.container,
		this._time = Lib.isNumber(param.time) ? param.time : 300,
		this._hide = Lib.isNumber(param.hide) ? param.hide : 2,
		this._text = Lib.isBoolean(param.text) || Lib.isString(param.text) ? param.text : null,
		this._bottom = Lib.isNumber(param.bottom) ? param.bottom : null,
		this._last = param.last - 1,
		this._isHide = false;

		// 执行初始化装载
		this.initialize();
	}
	SwipeGuider.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			var upIcon = document.createElement('b'),
				guider = this._guider = document.createElement('div');

			upIcon.className = 'icon';
			guider.className = 'app-swipe-guider';
			guider.appendChild(upIcon);

			if (this._text) {
				var textWrap = document.createElement('s'),
					text;
				if (this._text === true) {
					text = document.createTextNode('向上滑动');
				} else {
					text = document.createTextNode(this._text);
				}

				textWrap.appendChild(text);
				guider.appendChild(textWrap);
			}

			if (this._bottom) guider.style.bottom = this._bottom + 'px';

			this._wrap.appendChild(guider);
		},
		/* --------------------------------------------------
		 * @module 显示
		 * -------------------------------------------------- */
		show : function() {
			$(this._guider).fadeIn(this._time);
		},
		/* --------------------------------------------------
		 * @module 隐藏
		 * -------------------------------------------------- */
		hide : function(i) {
			// 重定义this
			var that = this;

			if (((this._hide == 1 && i == 0) || (this._hide == 2 && i == this._last)) && !this._isHide) {
				// 渐隐
				$(this._guider).fadeOut(this._time, function() {
					that._wrap.removeChild(that._guider);
				})

				// 设置隐藏状态为true
				this._isHide = true;
			}
		}
	}

	/* ==================================================
	 * @constructor 横屏提示[Component]
	 * @param(param:json) 参数
	 *   - (wrap:element) 外包围DOM
	 *   - (time:millisecond) 过渡时长
	 * ================================================== */
	HorizTipser = function(param) {
		// 非移动设备停止运行
		if (!Lib.isMobile) return false;
		if (!Lib.isJSON(param)) param = {};

		this._wrap = Lib.isElement(param.wrap) ? param.wrap : document.body,
		this._time = Lib.isNumber(param.time) ? param.time : 300,
		this._timer = undefined;

		// 执行初始化装载
		this.initialize();
	}
	HorizTipser.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			// 重定义this
			var that = this;

			var textWrap = this._textWrap = document.createElement('span');
			var text = document.createTextNode('请使用竖屏模式浏览 :)');
				textWrap.appendChild(text);

			var tipser = this._tipser = document.createElement('div');
				tipser.className = 'app-horiz-tipser';
				tipser.style[Lib.transition] = 'opacity ' + this._time + 'ms linear';

			tipser.appendChild(textWrap);
			this._wrap.appendChild(tipser);

			// 绑定事件
			this.bindEvent();

			// 初始切换
			this.toggle();
		},
		/* --------------------------------------------------
		 * @module 绑定事件
		 * -------------------------------------------------- */
		bindEvent : function() {
			// 重定义this
			var that = this;

			// 如果是移动设备,则启动感应浮动
			if (Lib.isMobile) {
				setInterval(function() {
					that._textWrap.style[Lib.transform] = 'translate('+ (Lib.val.gs.beta * 0.1) +'px,'+ (Lib.val.gs.gamma * 0.1) +'px)';
				}, 100)
			}

			Lib.bind(window, Lib.resize, function(event) {
				that.toggle(event);
			});
		},
		/* --------------------------------------------------
		 * @module 切换状态
		 * -------------------------------------------------- */
		toggle : function(e) {
			// 重定义this
			var that = this,
				orientation = window.orientation;

			switch (orientation) {
				case 90:
				case -90:
					this.fade('landscape');
					break;
				case 0:
				case 180:
					this.fade('portrait');
					break;
			}
		},
		fade : function(mode) {
			clearTimeout(this._timer);

			Lib.val.size.winWidth = Lib.val.size.nowWidth = Lib.width();
			Lib.val.size.height = Lib.height();

			switch (mode) {
				case 'landscape' :
					this._tipser.style.opacity = 1;
					this._tipser.style.zIndex = 3;

					Lib.toggleFilter(Lib.ele.container, 'in');
					break;

				case 'portrait' :
					this._tipser.style.opacity = 0;
					this._timer = setTimeout(function() {
						that._tipser.style.zIndex = -1;
					}, this._time)

					Lib.toggleFilter(Lib.ele.container, 'out');
					break;
			}
		}
	}

	/* ==================================================
	 * @constructor 版权链接[Component]
	 * @param(param:json) 参数
	 *   - (wrap:element[Lib.ele.page.last]) 外包围DOM
	 *   - (url:string[http://app.hithinktank.com/]) 链接地址
	 *   - (text:string[powered by ]) 版权文字
	 *   - (domain:string[hithinktank.com]) 域名
	 * ================================================== */
	PoweredInfo = function(param) {
		if (!Lib.isJSON(param)) param = {};

		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.page.last,
		this._url = Lib.isString(param.url) ? param.url : 'http://app.hithinktank.com/',
		this._text = Lib.isString(param.text) ? param.text : 'powered by ',
		this._domain = Lib.isString(param.domain) ? param.domain : 'hithinktank.com';

		// 执行初始化装载
		this.initialize();
	}
	PoweredInfo.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			var poweBar = this.poweBar = document.createElement('div');
				poweBar.className = 'app-powered-info';

			var poweText = document.createTextNode(this._text);
			var poweBtn = this._poweBtn = document.createElement('a');
				poweBtn.className = 'poweredBtn';
			var poweBtnText = document.createTextNode(this._domain);

			poweBtn.appendChild(poweBtnText);
			poweBar.appendChild(poweText);
			poweBar.appendChild(poweBtn);

			this._wrap.appendChild(poweBar);

			this.bindEvent();
		},
		/* --------------------------------------------------
		 * @module 绑定事件
		 * -------------------------------------------------- */
		bindEvent : function() {
			var that = this;

			Lib.bind(this._poweBtn, Lib.tap, function() {
				window.location.href = that._url;
			});
		}
	}

	/* ==================================================
	 * @constructor 幻灯片滑动过渡[Component]
	 * @param(param:json) 参数
	 *   - (page:number) 当前page的索引值
	 *   - (size:number) slide的数量，如果填写则自动创建slide，创建时只支持内容为图片，否则将取出HTML里面的slide
	 *   - (style:string) 附加的样式名
	 *   - (loadTime:millisecond) 单张加载时长
	 *   - (swipeTime:millisecond) 滑动动画时长
	 *   - (effect:string) 过渡效果
	 *   - (maxBounce:number[Lib.val.bounce.x]) 滑动回弹值
	 *   - (rotate:number) 旋转角度
	 * ================================================== */
	SlideSwiper = function(param) {
		this._page = Lib.ele.page.all[param.page],
		this._length = Lib.isNumber(param.size) && param.size > 0 ? param.size : false,
		this._create = this._length ? true : false,
		this._style = param.style,
		this._loadTime = param.loadTime,
		this._effect = param.effect,
		this._maxBounce = Lib.isNumber(param.maxBounce) ? param.maxBounce : Lib.val.bounce.x,
		this._rotate = param.rotate,
		this._loadTimers = [], // 全组slide的加载计时器,会存入到此数组
		this._loadTimer, // 当前slide的加载计时器
		this._swipeTimer; // 滑动计时器

		// 当过渡效果为side时,那么则为并排模式
		if (this._effect == 'side') {
			this._byside = true,
			this._loaderTime = this._loadTime;
		} else {
			this._byside = false,
			this._loaderTime = (this._length + 1) * this._loadTime;
		}

		switch (this._effect) {
			case 'card':
				this._swipeTime = 600;
				break;
			case 'cover':
				this._swipeTime = 800;
				break;
			case 'flipY':
				this._swipeTime = 1000;
				break;
			case 'push':
				this._swipeTime = 1000;
				break;
			case 'side':
				this._swipeTime = 400;
				break;
		}

		// 执行初始化装载
		this.initialize();
	}
	SlideSwiper.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			switch (this._create) {
				case true :
					this._slides = [];
					var wrap = this._wrap = document.createElement('div');

					for (var i = 0; i < this._length; i++) {
						var slide = document.createElement('div'),
							img = document.createElement('img');

						img.dataset.lazy = 'true';
						slide.className = 'slide';
						slide.appendChild(img);

						this._slides.push(slide);
						wrap.appendChild(slide);
					}

					this._page.appendChild(wrap);
					break;

				case false :
					this._wrap = this._page.querySelector('.slide-wrap'), // 获取外包围DOM
					this._slides = this._wrap.querySelectorAll('.slide'), // 获取slide节点列表
					this._length = this._slides.length; // 计算slide节点数量
					break;
			}

			var prevSlideGuider = this._prevSlideGuider = document.createElement('b'),
				nextSlideGuider = this._nextSlideGuider = document.createElement('b');

			this._wrap.classList.add(this._effect);
			this._wrap.classList.add(this._style);
			prevSlideGuider.className = 'slide-guider prev icon';
			nextSlideGuider.className = 'slide-guider next icon';

			this._width = Lib.css(this._wrap.parentNode, 'width');

			this._page.appendChild(prevSlideGuider);
			this._page.appendChild(nextSlideGuider);

			this.loader = new SlideLoader(this._effect);
			this.swiper = new HorizEffect(this._effect);
			this.pagination = new SlidePagination({
				'wrap' : this._page,
				'byside' : this._byside,
				'style' : this._style,
				'slide' : this._slides
			});
		},
		/* --------------------------------------------------
		 * @module 装载
		 * -------------------------------------------------- */
		load : function(callback) {
			var that = this;
			this._page.classList.add('noSwipeX');

			// 清空内容
			this._wrap.innerHTML = '';

			// 加载
			this.loader({
				'width' : this._width
			});

			// 得到新的slide
			this._slides = this._wrap.querySelectorAll('.slide');

			// 翻向第一页
			this.pagination.turn(0, false);

			// 后续操作
			this._loadTimer = setTimeout(function() {
				// 重新绑定事件
				that._page.classList.remove('noSwipeX');

				$(that._prevSlideGuider).fadeIn(this._loadTime);
				$(that._nextSlideGuider).fadeIn(this._loadTime);
			}, this._loaderTime);

			if (Lib.isFunction(callback)) callback();
		},
		/* --------------------------------------------------
		 * @module 滑动
		 * -------------------------------------------------- */
		swipe : function(param) {
			var that = this,
				status = this.swiper(param.swipe, param.bounce, param.type, this._width);

			switch (param.type) {
				case 'move' :
					if (this._swipeTimer) clearTimeout(this._swipeTimer);
					break;
				case 'end' :
					if (status) {
						this._page.classList.add('noSwipeX');
						// 后续操作
						this._swipeTimer = setTimeout(function() {
							// 重新绑定事件
							that._page.classList.remove('noSwipeX');
						}, this._swipeTime)
					}
					break;
			}
		},
		/* --------------------------------------------------
		 * @module 退出
		 * -------------------------------------------------- */
		quit : function(callback) {
			// 清除未完成的计时器
			while (this._loadTimers.length) {
				clearTimeout(this._loadTimers[0]);
				this._loadTimers.splice(0, 1);
			}
			clearTimeout(this._loadTimer);

			if (this._byside) {
				this._wrap.style[Lib.transform] = 'translateX(0)';
			} else {
				for (var i = 0; i < this._length; i++) {
					this._slides[i].removeAttribute('style');
					this._slides[i].style[Lib.transition] = this._swipeTime + 'ms cubic-bezier(.68,.18,.25,.89)';
				}
			}

			$(this._prevSlideGuider).fadeOut(this._loadTime);
			$(this._nextSlideGuider).fadeOut(this._loadTime);

			if (Lib.isFunction(callback)) callback();
		},
		/* --------------------------------------------------
		 * @module 重置zIndex值
		 * @param(list:nodeList) 需要重置的节点列表
		 * @param(length:number) 节点的总数
		 * -------------------------------------------------- */
		zIndexRest : function(list, length) {
			for (var i = 0; i < length; i++) {
				if (i == 0) {
					list[i].style.zIndex = 0;
				} else {
					list[i].style.zIndex = length - i;
				}
			}
		}
	}

	/* ==================================================
	 * @constructor 幻灯片分页[Component]
	 * @param(param:json) 参数
	 *   - (wrap:element) 当前分页的外包围DOM
	 *   - (byside:boolean) 是否为并列slide
	 *   - (style:string) 样式名
	 *   - (maxBounce:nodeList) slide节点列表
	 *   - (now:number[0]) 当前分页索引
	 * ================================================== */
	SlidePagination = function(param) {
		this._wrap = param.wrap,
		this._byside = param.byside,
		this._style = param.style,
		this._slides = param.slide,
		this._size = this._slides.length,
		this._now = 0;

		this.initialize();
	}
	SlidePagination.prototype = {
	 	/* --------------------------------------------------
		 * @module 创建分页
		 * -------------------------------------------------- */
		initialize : function() {
			var pagination = document.createElement('div');
				pagination.className = 'slide-pagination ' + this._style;

			for (var i = 0; i < this._size; i++) {
				this._slides[i].dataset.index = i;
				var dot = document.createElement('i');
				pagination.appendChild(dot);
			}

			this._wrap.appendChild(pagination);
			this._dots = pagination.querySelectorAll('i');
		},
		/* --------------------------------------------------
		 * @module 翻页
		 * @param(index:number) slide索引值
		 * @param(mode:boolean) 翻页类型,装载为false,滑动为true
		 * -------------------------------------------------- */
		turn : function(index, mode) {
			if (this._byside) {
				this._now = index;
			} else {
				if (mode) {
					if (index == 0) {
						this._now = 1;
					} else if (index >= this._size - 1) {
						this._now = 0;
					} else {
						this._now = parseInt(index) + 1;
					}
				} else {
					this._now = 0;
				}
			}

			for (var i = 0; i < this._size; i++) {
				if (i == this._now) {
					this._dots[i].className = 'current';
				} else {
					if (this._dots[i].classList.contains('current')) {
						this._dots[i].classList.remove('current');
					}
				}
			}
		}
	 }

	/* ==================================================
	 * @constructor slide装载效果库[Library]
	 * @param(effect:string) 装载效果
	 * ================================================== */
	SlideLoader = function(effect) {
		var mode;

		switch (effect) {
			case 'card' :
				mode = this.onCard;
				break;
			case 'cover' :
				mode = this.onCover;
				break;
			case 'flipY' :
				mode = this.onFlipY;
				break;
			case 'push' :
				mode = this.onPush;
				break;
			case 'side' :
				mode = this.onSide;
				break;
			default :
				mode = this.onCard;
				break;
		}

		return mode;
	}
	SlideLoader.prototype = {
		/* --------------------------------------------------
		 * @module 旋转卡片
		 * -------------------------------------------------- */
		onCard : function() {
			var that = this,
				_s = this._slides,
				_w = this._wrap,
				_l = this._length,
				_t = this._loadTime,
				_r = this._rotate;

			for (var i = 0; i < _l; i++) {
				(function(i) {
					var delay = _t * (i + 1),
						j = _l - i - 1,
						piece = _s[j].cloneNode(true);

					_w.insertBefore(piece,_w.firstChild);
					piece.style.zIndex = i;
					piece.style[Lib.transition] = _t + 'ms cubic-bezier(.68,.18,.25,.89)';

					that._loadTimers.push(setTimeout(function() {
						piece.style[Lib.transform] = 'translate(-50%,-50%) rotate('+ _r * j +'deg)';
						piece.style.opacity = 1;
					}, delay))
				})(i)
			}
		},
		/* --------------------------------------------------
		 * @module 书页
		 * -------------------------------------------------- */
		onCover : function() {
			var that = this,
				_s = this._slides,
				_w = this._wrap,
				_l = this._length,
				_t = this._loadTime;

			for (var i = 0; i < _l; i++) {
				(function(i) {
					var delay = _t * (i + 1),
						j = _l - i - 1,
						piece = _s[j].cloneNode(true);

					_w.insertBefore(piece, _w.firstChild);
					piece.style.zIndex = i;
					piece.style[Lib.transition] = _t + 'ms cubic-bezier(.68,.18,.25,.89)';

					that._loadTimers.push(setTimeout(function() {
						piece.style[Lib.transform] = 'perspective(500px) rotateY(0)';
						piece.style.opacity = 1;
					}, delay))
				})(i)
			}
		},
		/* --------------------------------------------------
		 * @module Y轴翻转
		 * -------------------------------------------------- */
		onFlipY : function() {
			var that = this,
				_s = this._slides,
				_w = this._wrap,
				_l = this._length,
				_t = this._loadTime;

			for (var i = 0; i < _l; i++) {
				(function(i) {
					var delay = _t * (i + 1),
						j = _l - i - 1,
						piece = _s[j].cloneNode(true);

					_w.insertBefore(piece, _w.firstChild);
					piece.style.zIndex = i;
					piece.style[Lib.transition] = _t + 'ms cubic-bezier(.68,.18,.25,.89)';

					that._loadTimers.push(setTimeout(function() {
						piece.style[Lib.transform] = 'translate(0,0)';
						piece.style.opacity = 1;
						setTimeout(function() {
							if (j != 0) piece.style.opacity = 0;
							piece.style[Lib.transition] = 'none';
						}, that._loadTime * 2)
					}, delay))
				})(i)
			}
		},
		/* --------------------------------------------------
		 * @module 推
		 * -------------------------------------------------- */
		onPush : function() {
			var that = this,
				_s = this._slides,
				_w = this._wrap,
				_l = this._length,
				_t = this._loadTime;

			for (var i = 0; i < _l; i++) {
				(function(i) {
					var delay = _t * (i + 1),
						j = _l - i - 1,
						piece = _s[j].cloneNode(true);

					_w.insertBefore(piece, _w.firstChild);
					piece.style.zIndex = i;
					piece.style[Lib.transition] = _t + 'ms cubic-bezier(.68,.18,.25,.89)';

					that._loadTimers.push(setTimeout(function() {
						piece.style[Lib.transform] = 'translate(0,0)';
						piece.style.opacity = 1;
					}, delay))
				})(i)
			}
		},
		/* --------------------------------------------------
		 * @module 并列
		 * -------------------------------------------------- */
		onSide : function(param) {
			this._wrap.style.width = param.width * this._length + 'px';
			this._wrap.style[Lib.transform] = 'translateX(0)';

			var _s = this._slides,
				_w = this._wrap,
				_l = this._length,
				_t = this._loadTime;

			for (var i = 0; i < _l; i++) {
				var j = _l - i - 1,
					piece = _s[j].cloneNode(true);

				_w.insertBefore(piece, _w.firstChild);
				piece.style.width = param.width + 'px';
			}
		}
	}

	/* ==================================================
	 * @constructor 水平滑动效果库[Library]
	 * @param(effect:string) 装载效果
	 * ================================================== */
	HorizEffect = function(effect) {
		var mode;

		switch (effect) {
			case 'card' :
				mode = this.onCard;
				break;
			case 'cover' :
				mode = this.onCover;
				break;
			case 'flipY' :
				mode = this.onFlipY;
				break;
			case 'push' :
				mode = this.onPush;
				break;
			case 'side' :
				mode = this.onSide;
				break;
			default :
				mode = this.onCard;
				break;
		}

		return mode;
	}
	HorizEffect.prototype = {
		/* --------------------------------------------------
		 * @module 旋转卡片
		 * -------------------------------------------------- */
		onCard : function(swipe, bounce, type) {
			var that = this,
				slides = this._wrap.querySelectorAll('.slide'),
				slidesLength = slides.length,
				firstSlide = slides[0],
				nowIndex = firstSlide.dataset.index,
				outClass,
				rotate;

			// 根据swipe类型判断移动范围
			switch (swipe) {
				case 'swipeLeft' :
					outClass = 'cardXLeft';
					break;
				case 'swipeRight' :
					outClass = 'cardXRight';
					break;
			}

			// 执行动画
			firstSlide.classList.add(outClass);

			// 后续操作
			setTimeout(function() {
				//移除样式
				firstSlide.classList.remove(outClass);
				// 移动到最后
				that._wrap.insertBefore(firstSlide, null);

				// 重置zIndex
				that.zIndexRest(slides, slidesLength);

				for (var i = 0; i < slidesLength; i++) {
					if (i == 0) {
						rotate = that._rotate * (slidesLength - 1);
					} else {
						rotate = that._rotate * (i - 1);
					}
					slides[i].style[Lib.transform] = 'translate(-50%,-50%) rotate('+ rotate +'deg)';
				}
			}, this._swipeTime)

			// 翻页
			if(type == 'end'){
				this.pagination.turn(nowIndex, true);
				return true;
			}
		},
		/* --------------------------------------------------
		 * @module 书页
		 * -------------------------------------------------- */
		onCover : function(swipe, bounce, type) {
			var that = this,
				slides = this._wrap.querySelectorAll('.slide'),
				slidesLength = slides.length,
				firstSlide = slides[0],
				nowIndex = firstSlide.dataset.index,
				outClass;

			// 根据swipe类型判断移动范围
			switch (swipe) {
				case 'swipeLeft' :
					outClass = 'fadeOutLeft';
					break;
				case 'swipeRight' :
					outClass = 'fadeOutRight';
					break;
			}

			// 执行动画
			firstSlide.classList.add(outClass);

			// 后续操作
			setTimeout(function() {
				//移除样式
				firstSlide.classList.remove(outClass);
				// 移动到最后
				that._wrap.insertBefore(firstSlide, null);

				// 重置zIndex
				that.zIndexRest(slides, slidesLength);
			}, this._swipeTime)

			// 翻页
			if(type == 'end'){
				this.pagination.turn(nowIndex, true);
				return true;
			}
		},
		/* --------------------------------------------------
		 * @module Y轴翻转
		 * -------------------------------------------------- */
		onFlipY : function(swipe, bounce, type) {
			var that = this,
				slides = this._wrap.querySelectorAll('.slide'),
				slidesLength = slides.length,
				firstSlide = slides[0],
				nextSlide = slides[1],
				nowIndex = firstSlide.dataset.index,
				outClass,
				inClass;

			switch (swipe) {
				case 'swipeLeft' :
					outClass = 'flipYOutLeft';
					inClass = 'flipYInLeft';
					break;
				case 'swipeRight' :
					outClass = 'flipYOutRight';
					inClass = 'flipYInRight';
					break;
			}

			// 执行动画
			firstSlide.classList.add(outClass);
			nextSlide.classList.add(inClass);

			setTimeout(function() {
				// 改变层级
				firstSlide.style.zIndex = 0;
				nextSlide.style.zIndex = slidesLength - 1;

				//改变透明度
				firstSlide.style.opacity = 0;
				nextSlide.style.opacity = 1;
			}, this._swipeTime / 4)

			setTimeout(function() {
				// 清除样式
				firstSlide.classList.remove(outClass);
				nextSlide.classList.remove(inClass);

				// 移动到最后
				that._wrap.insertBefore(firstSlide, null);

				// 重置zIndex
				that.zIndexRest(slides, slidesLength);
			}, this._swipeTime)

			// 翻页
			if(type == 'end'){
				this.pagination.turn(nowIndex, true);
				return true;
			}
		},
		/* --------------------------------------------------
		 * @module 推
		 * -------------------------------------------------- */
		onPush : function(swipe, bounce, type) {
			var that = this,
				slides = this._wrap.querySelectorAll('.slide'),
				slidesLength = slides.length,
				firstSlide = slides[0],
				nowIndex = firstSlide.dataset.index,
				outClass;

			// 根据swipe类型判断移动范围
			switch (swipe) {
				case 'swipeLeft' :
					outClass = 'fadeOutLeft';
					break;
				case 'swipeRight' :
					outClass = 'fadeOutRight';
					break;
			}

			// 执行动画
			firstSlide.classList.add(outClass);

			// 后续操作
			setTimeout(function() {
				//移除样式
				firstSlide.classList.remove(outClass);
				// 移动到最后
				that._wrap.insertBefore(firstSlide, null);

				// 重置zIndex
				that.zIndexRest(slides, slidesLength);
			}, this._swipeTime)

			// 翻页
			if(type == 'end'){
				this.pagination.turn(nowIndex, true);
				return true;
			}
		},
		/* --------------------------------------------------
		 * @module 并列
		 * -------------------------------------------------- */
		onSide : function(swipe, bounce, type, width) {
			var nowIndex = this.pagination._now,
				nextIndex,
				t,
				status = Math.abs(bounce) >= this._maxBounce;

			switch (swipe) {
				case 'swipeLeft' :
					nextIndex = nowIndex - 1;
					break;
				case 'swipeRight' :
					nextIndex = nowIndex + 1;
					break;
			}

			if (nextIndex >= this._length) {
				nextIndex = this._length - 1;
			} else if (nextIndex < 0) {
				nextIndex = 0;
			}

			switch (type) {
				case 'move' :
					this._wrap.style[Lib.transition] = '0ms linear';
					t = (nowIndex * -width) - bounce + 'px';
					break;
				case 'end':
					this._wrap.style[Lib.transition] = this._swipeTime + 'ms cubic-bezier(.68,.18,.25,.89)';
					switch (status) {
						case true :
							t = nextIndex * -width + 'px';
							// 翻页
							this.pagination.turn(nextIndex, true);
							// 添加禁用样式
							this._page.classList.add('noSwipeX');

							if (nextIndex > 0 || nextIndex < this._length) this.pagination.turn(nextIndex, true);
							break;
						case false :
							t = nowIndex * -width + 'px';
							break;
					}
					break;
			}

			this._wrap.style[Lib.transform] = 'translateX('+ t +')';

			return status;
		}
	}

	/* ==================================================
	 * @constructor 工具栏[Component]
	 * @param(param:json) 参数
	 *   - (radius:number[65]) 围绕弧度
	 *   - (time:number[5000]) 工具自动收回时间
	 *   - (btns:array[string] ['tel','swt','reserve','music']) 工具名称（'tel'/'swt'/'reserve'/'music'/'share'/'url'）
	 *   - (offset:number[8]) 定位模式(1/2/3/4/6/7/8/9)
	 *   - (float:boolean[true]) 是否开启重力感应浮动
	 *   - (url:string) 查看更多时跳转的URL地址，不包括'http://'
	 *   - (effect:string[flower]) 控件效果('flower','stretch')
	 *   - (wrap:element[Lib.ele.container]) 外包围DOM
	 *   + (music:json) 音乐播放器参数
	 *     - (src:string) 源地址
	 *     - (auto:boolean) 是否自动播放
	 *     - (loop:boolean) 是否循环
	 *     - (status:boolean) 初始状态
	 *     - (wrap:element) 外包围DOM,必须为null(无须定义)
	 * ================================================== */
	ToolBar = function(param) {
		if (!Lib.isJSON(param)) param = {};

		this._r = Lib.isNumber(param.radius) ? param.radius : 65,
		this._time = Lib.isNumber(param.time) ? param.time : 5000,
		this._btns = Lib.isArray(param.btns) ? param.btns : ['tel', 'swt', 'reserve', 'music', 'share'],
		this._n = this._btns.length - 1,
		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.container,
		this._music = Lib.isJSON(param.music) ? param.music : null,
		this._offset = Lib.isNumber(param.offset) ? param.offset : 8,
		this._float = Lib.isBoolean(param.float) ? param.float : true,
		this._url = Lib.isString(param.url) ? param.url : null,
		this._effect = Lib.isString(param.effect) ? param.effect : 'flower',
		this._timer,
		this._controls = new ToolBarEffect(this._effect);
		// 执行初始化装载
		this.initialize();
	}
	ToolBar.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			ToolBar.prototype.load = this._controls.init,
			ToolBar.prototype.unfold = this._controls.unfold;

			this.load();
		},
		/* --------------------------------------------------
		 * @module 绑定事件
		 * -------------------------------------------------- */
		bindEvent : function() {
			var that = this,
				urlBtn = Lib.inNodelist(this._tools, 'url');

			Lib.bind(this._ctrlBtn, Lib.tap, function() {
				that.toggle();
			});

			if ((Lib.isElement(urlBtn) || Lib.isNodelist(urlBtn) || Lib.isArray(urlBtn)) && this._url) {
				Lib.bind(urlBtn, Lib.tap, function() {
					window.location.href = 'http://' + that._url;
				})
			}

			if (this._music) {
				this.singer = new MusicPlayer({
					'src' : this._music.src,
					'auto' : this._music.auto,
					'loop' : this._music.loop,
					'status' : this._music.status,
					'wrap' : null,
					'ctrlBtn' : this._bar.querySelector('dd.music')
				});
			}
		},
		/* --------------------------------------------------
		 * @module 收起
		 * -------------------------------------------------- */
		shrink : function() {
			for (var i = 0; i <= this._n; i++) {
				this._tools[i].removeAttribute('style');
			}
		},
		/* --------------------------------------------------
		 * @module 切换状态
		 * -------------------------------------------------- */
		toggle : function() {
			this._bar.classList.toggle('unfold');
			if (this._bar.classList.contains('unfold')) {
				this.unfold();
			} else {
				this.shrink();
			}
		}
	}

	/* ==================================================
	 * @constructor 工具栏效果集[Library]
	 * @param(effect:string) 效果名称
	 * ================================================== */
	ToolBarEffect = function(effect) {
		var controls = {};

		switch (effect) {
			case 'flower' :
			default :
				controls = {
					init : this.flowerInit,
					unfold : this.flowerUnfold
				}
				break;

			case 'stretch' :
				controls = {
					init : this.stretchInit,
					unfold : this.stretchUnfold
				}
				break;
		}

		return controls;
	}
	ToolBarEffect.prototype = {
		flowerInit : function() {
			// 重定义this
			var that = this,
				bar = this._bar = document.createElement('dl'),
				ctrlBtn = this._ctrlBtn = document.createElement('dt'),
				em = document.createElement('em'),
				i = document.createElement('i'),
				bX = document.createElement('b'),
				bY = document.createElement('b'),
				offset;

			switch (this._offset) {
				case 1 :
					offset = 'leftTop';
					break;
				case 2 :
					offset = 'centerTop';
					break;
				case 3 :
					offset = 'rightTop';
					break;
				case 4 :
					offset = 'leftMiddle';
					break;
				case 6 :
					offset = 'rightMiddle';
					break;
				case 7 :
				default :
					offset = 'leftBottom';
					break;
				case 8 :
					offset = 'centerBottom';
					break;
				case 9 :
					offset = 'rightBottom';
					break;
			}
			switch (this._offset) {
				case 1 :
				case 3 :
				case 7 :
				case 9 :
				default :
					this._angleX = 90;
					this._angleY = 180;
					break;
				case 2 :
				case 8 :
					this._angleX = 180;
					this._angleY = 180;
					break;
				case 4 :
				case 6 :
					this._angleX = 180;
					this._angleY = 180;
					break;
			}

			bar.className = 'app-tool-bar effect-flower ' + offset;

			ctrlBtn.appendChild(em);
			ctrlBtn.appendChild(i);
			ctrlBtn.appendChild(bX);
			ctrlBtn.appendChild(bY);

			bar.appendChild(ctrlBtn);

			for (var i = 0; i < this._btns.length; i++) {
				var str = this._btns[i],
					firStr = str.slice(0, 1),
					upStr = firStr.toUpperCase(),
					lowStr = str.slice(1),
					btnStr = 'open' + upStr + lowStr + 'Btn';

				var tool = document.createElement('dd'),
					toolBtn = document.createElement('b'),
					toolIco = document.createElement('i');

				tool.className = str;
				toolBtn.className = btnStr;
				toolIco.className = 'icon';

				if (this._music && str == 'music') {
					var muteIco = document.createElement('em');
					toolBtn.appendChild(muteIco);
					tool.classList.add('pause');
				}

				toolBtn.appendChild(toolIco);
				tool.appendChild(toolBtn);

				bar.appendChild(tool);
			}
			this._wrap.appendChild(bar);
			this._tools = this._bar.querySelectorAll('dd');

			this.bindEvent();

			// 如果是移动设备,则启动感应浮动
			if (Lib.isMobile && this._float) {
				setInterval(function() {
					that._bar.style[Lib.transform] = 'translate('+ (Lib.val.gs.gamma * 0.2) + 'px,'+ (Lib.val.gs.beta * 0.2) + 'px)';
				}, 100)
			}
		},
		stretchInit : function() {
			// 重定义this
			var that = this,
				bar = this._bar = document.createElement('dl'),
				ctrlBtn = this._ctrlBtn = document.createElement('dt'),
				o1 = document.createElement('b'),
				o2 = document.createElement('b'),
				offset;

			switch (this._offset) {
				case 1 :
					offset = 'leftTop';
					break;
				case 3 :
					offset = 'rightTop';
					break;
				case 7 :
				default :
					offset = 'leftBottom';
					break;
				case 9 :
					offset = 'rightBottom';
					break;
			}

			bar.className = 'app-tool-bar effect-stretch ' + offset;

			o1.appendChild(o2);
			ctrlBtn.appendChild(o1);

			bar.appendChild(ctrlBtn);

			for (var i = 0; i < this._btns.length; i++) {
				var str = this._btns[i],
					firStr = str.slice(0, 1),
					upStr = firStr.toUpperCase(),
					lowStr = str.slice(1),
					btnStr = 'open' + upStr + lowStr + 'Btn';

				var tool = document.createElement('dd'),
					toolBtn = document.createElement('b'),
					toolIco = document.createElement('i');

				tool.className = str;
				toolBtn.className = btnStr;
				toolIco.className = 'icon';

				if (this._music && str == 'music') {
					var muteIco = document.createElement('em');
					toolBtn.appendChild(muteIco);
					tool.classList.add('pause');
				}

				toolBtn.appendChild(toolIco);
				tool.appendChild(toolBtn);

				bar.appendChild(tool);
			}
			this._wrap.appendChild(bar);
			this._tools = this._bar.querySelectorAll('dd');

			this.bindEvent();

			// 如果是移动设备,则启动感应浮动
			if (Lib.isMobile && this._float) {
				setInterval(function() {
					that._bar.style[Lib.transform] = 'translate('+ (Lib.val.gs.gamma * 0.2) + 'px,'+ (Lib.val.gs.beta * 0.2) + 'px)';
				}, 100)
			}
		},
		/* --------------------------------------------------
		 * @module 展开
		 * -------------------------------------------------- */
		flowerUnfold : function() {
			for (var i = 0; i <= this._n; i++) {
				var delay = 100 * i,
					translateX,
					translateY,
					x,
					y;

				switch (this._offset) {
					case 4 :
					case 6 :
						translateX = Math.floor(this._r * Math.sin(this._angleX / this._n * i * (Math.PI / this._angleY))),
						translateY = Math.floor(this._r * Math.cos(this._angleX / this._n * i * (Math.PI / this._angleY)));
						break;
					default :
						translateX = Math.floor(this._r * Math.cos(this._angleX / this._n * i * (Math.PI / this._angleY))),
						translateY = Math.floor(this._r * Math.sin(this._angleX / this._n * i * (Math.PI / this._angleY)));
						break;
				}

				switch (this._offset) {
					case 1 :
						x = translateX,
						y = translateY;
						break;
					case 2 :
						x = - translateX,
						y = translateY;
						break;
					case 3 :
						x = - translateX,
						y = translateY;
						break;
					case 4 :
						x = translateX,
						y = translateY;
						break;
					case 6 :
						x = - translateX,
						y = translateY;
						break;
					case 7 :
						x = translateX,
						y = - translateY;
						break;
					case 8 :
					default :
						x = translateX,
						y = - translateY;
						break;
					case 9 :
						x = - translateX,
						y = - translateY;
						break;
				}

				this._tools[i].style[Lib.transitionDelay] = delay +'ms';
				this._tools[i].style[Lib.transform] = 'translate('+ x + 'px,'+ y + 'px)';
			}
		},
		/* --------------------------------------------------
		 * @module 展开
		 * -------------------------------------------------- */
		stretchUnfold : function() {
			for (var i = 0; i <= this._n; i++) {
				var delay = 100 * i,
					translateY,
					y;

				translateY = Math.floor(this._r * (i + 1));

				switch (this._offset) {
					case 1 :
					case 3 :
						y = translateY;
						break;

					case 7 :
					case 9 :
					default :
						y = - translateY;
						break;
				}

				this._tools[i].style[Lib.transitionDelay] = delay +'ms';
				this._tools[i].style[Lib.transform] = 'translateY('+ y + 'px)';
			}
		}
	}

	/* ==================================================
	 * @constructor 音乐播放器[Component]
	 * @param(param:json) 参数
	 *   - (src.string['music/music.mp3']) 源地址
	 *   - (auto:boolean[false]) 是否自动播放
	 *   - (loop:boolean[true]) 是否循环
	 *   - (status:boolean[false]) 初始状态
	 *   - (wrap:element[Lib.ele.container]) 外包围DOM
	 *   - (offset:number[2]) 控件所在4宫格的位置
	 * ================================================== */
	MusicPlayer = function(param) {
		this._src = Lib.isString(param.src) ? param.src : 'music/music.mp3',
		this._autoPlay = Lib.isBoolean(param.auto) ? param.auto : false,
		this._loop = Lib.isBoolean(param.auto) ? param.loop : true,
		this._status = Lib.isBoolean(param.status) ? param.status : false,
		this._offset = Lib.isNumber(param.offset) ? param.offset : 2,
		this._wrap = param.wrap,
		this._bout = 0;

		if (!this._wrap || Lib.isElement(this._wrap)) {
			this._ctrlBtn = param.ctrlBtn;
		} else {
			this._wrap = Lib.ele.container;
		}

		// 执行初始化装载
		this.initialize();
	}
	MusicPlayer.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			this._audio = new Audio(),
			this._audio.src = this._src,
			this._audio.autoplay = this._autoPlay,
			this._audio.loop = this._loop,
			this._audio.load();

			if (this._wrap) {
				var ctrlBtn = this._ctrlBtn = document.createElement('div'),
					icon = document.createElement('i'),
					muteLine = document.createElement('em');

				ctrlBtn.className = 'app-music-player pause';
				icon.className = 'icon';

				ctrlBtn.appendChild(icon);
				ctrlBtn.appendChild(muteLine);
				this._wrap.appendChild(ctrlBtn);

				this.setOffset();
			}

			this.bindEvent();
		},
		/* --------------------------------------------------
		 * @module 设定按钮位置
		 * -------------------------------------------------- */
		setOffset : function() {
			var offset;
			switch (this._offset) {
				case 1 :
					offset = 'leftTop';
					break;
				case 2 :
				default :
					offset = 'rightTop';
					break;
				case 3 :
					offset = 'leftBottom';
					break;
				case 4 :
					offset = 'rightBottom';
					break;
			}

			this._ctrlBtn.classList.add(offset);
		},
		/* --------------------------------------------------
		 * @module 绑定事件
		 * -------------------------------------------------- */
		bindEvent : function() {
			var that = this;

			Lib.bind(this._ctrlBtn, Lib.tap, function() {
				that.toggle();
			});

			return this;
		},
		/* --------------------------------------------------
		 * @module 切换歌曲
		 * -------------------------------------------------- */
		toggle : function() {
			// 根据样式确定执行事件
			if (this._ctrlBtn.classList.contains('pause')) {
				this._audio.play();
				this._bout++;
				this._status = true;
			} else {
				this._audio.pause();
				this._status = false;
			}

			// 移除样式
			this._ctrlBtn.classList.toggle('pause');
		}
	}

	/* ==================================================
	 * @constructor 分享提示[Component]
	 * @param(param:json) 参数
	 *   - (wrap:element[document.body]) 外包围DOM
	 *   - (time:millisecond[300]) 过渡时长
	 *   - (btn:element) 显示提示的按钮
	 * ================================================== */
	ShareTipser = function(param) {
		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.wrapper;
		this._time = Lib.isNumber(param.time) ? param.time : 300,
		this._btn = param.btn;

		// 执行初始化装载
		this.initialize();
	}
	ShareTipser.prototype = {
		initialize : function() {
			// 定义提示包围层
			var tipser = this._tipser = document.createElement('div');
				tipser.className = 'app-share-tipser';
				tipser.style[Lib.transition] = 'opacity ' + this._time + 'ms linear';

			// 定义揭示文字
			var detail = document.createElement('i');
				detail.className = 'icon';

			// 插入提示文字
			tipser.appendChild(detail);
			// 插入揭示提示包围层
			this._wrap.appendChild(tipser);

			// 绑定事件
			this.bindEvent();
		},
		bindEvent : function(ele) {
			// 重定义this
			var that = this;

			if (ele) {
				Lib.bind(ele, Lib.tap, function() {
					that.toggle('in');
				});
			} else {
				// 绑定控制显示按钮
				Lib.bind(this._btn, Lib.tap, function() {
					that.toggle('in');
				});

				// 绑定控制隐藏按钮
				Lib.bind(this._tipser, Lib.tap, function() {
					that.toggle('out');
				});
			}
		},
		toggle : function(type) {
			var that = this;

			if (type == 'in') {
				this._tipser.style.opacity = 1;
				this._tipser.style.zIndex = 2;
			} else if (type == 'out') {
				this._tipser.style.opacity = 0;
				this._timer = setTimeout(function() {
					that._tipser.style.zIndex = -1;
				}, this._time)
			}
			// 背景模糊
			Lib.toggleFilter(Lib.ele.container, type);
		}
	}

	/* ==================================================
	 * @constructor 弹出框[Component]
	 * ================================================== */
	PopupBox = function(style){
		this._time = 400,
		this._maxHeight = Lib.val.size.height - 40,
		this._width = Lib.val.size.nowWidth - 40,
		this._style = style;
		this.initialize();
	}
	PopupBox.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			var popup = this._popup = document.createElement('div'),
				wrap = this._wrap = document.createElement('div'),
				closeBtn = this._closeBtn = document.createElement('b'),
				closeX = document.createElement('i'),
				closeY = document.createElement('i'),
				mask = this._mask = document.createElement('b'),
				container = this._container = document.createElement('div'),
				content = this._content = document.createElement('div');

			mask.className = 'popup-mask';
			container.className = 'popup-container';
			closeBtn.className = 'popup-close';
			content.className = 'popup-content';
			wrap.className = 'popup-wrap';
			popup.className = 'app-popup';

			if (Lib.isString(this._style)) popup.classList.add(this._style);

			closeBtn.appendChild(closeX);
			closeBtn.appendChild(closeY);
			container.appendChild(content);
			wrap.appendChild(closeBtn);
			wrap.appendChild(container);
			popup.appendChild(mask);
			popup.appendChild(wrap);

			this.bindEvent();
		},
		/* --------------------------------------------------
		 * @module 事件绑定
		 * -------------------------------------------------- */
		bindEvent : function() {
			var that = this;

			Lib.bind(this._closeBtn, Lib.tap, function(){
				that.toggle('out');
			});

			Lib.bind(this._mask, Lib.tap, function(){
				that.toggle('out');
			});
		},
		/* --------------------------------------------------
		 * @module 显示
		 * @param(target:element *) 触发弹出的按钮
		 * @param(content:element/string  *) 弹出时显示的内容
		 * @param(callback:function *) 弹出完成后的回调函数
		 * -------------------------------------------------- */
		show : function(target, content, callback) {
			this._styles = {
				'width' : Lib.css(target,'width') + 'px',
				'height' : Lib.css(target,'height') + 'px',
				'left' : Lib.left(target) + 'px',
				'top' : Lib.top(target) + 'px',
				'borderRadius' : Lib.css(target,'borderRadius') + 'px',
				'boxShadow' : 'none',
				'margin' : 0
			};

			this._content.style.opacity = 0;
			this._content.style.width = this._width - 20 + 'px';
			this._content.style.margin = 10 + 'px';

			if (Lib.isElement(content)) {
				this._content.appendChild(content);
			} else {
				this._content.innerHTML = content;
			}

			Lib.ele.body.appendChild(this._popup);

			var noxHeight = $(this._content).height() + 20;

			this.toggle('in', noxHeight, callback);
		},
		/* --------------------------------------------------
		 * @module 显示切换
		 * @param(mode:string('in'/'out') *) 切换类型
		 * @param(boxHeight:number *) 内容层实际高度
		 * @param(callback:function *) 弹出完成后的回调函数
		 * -------------------------------------------------- */
		toggle : function(mode, boxHeight, callback) {
			var that = this,
				height = boxHeight > this._maxHeight ? this._maxHeight : boxHeight;

			if (mode == 'in') {
				this._wrap.style[Lib.animation] = 'flipYInLeft ' + (this._time * 2) + 'ms ease both';
				this._wrap.style.borderRadius = this._container.style.borderRadius = this._styles.borderRadius;
				this._wrap.style.boxShadow = this._styles.boxShadow;
				this._wrap.style.opacity = 0;
				this._wrap.style.width = this._styles.width;
				this._wrap.style.height = this._styles.height;
				this._wrap.style.left = this._styles.left;
				this._wrap.style.top = this._styles.top;
				this._wrap.style.margin = this._styles.margin;

				this._content.style.height = height - 20 + 'px';

				Lib.toggleFilter(Lib.ele.container, mode);
				this.enlarge(height, callback);
			} else if (mode == 'out'){
				this._wrap.classList.remove('show');
				this._wrap.style[Lib.animation] = 'flipYOutRight ' + (this._time * 2) + 'ms ease both';
				$(this._content).animate({
					'opacity' : 0
				}, this._time / 2, function() {
					$(that._wrap).animate({
						'opacity' : 0,
						'width' : that._styles.width,
						'height' : that._styles.height,
						'left' : that._styles.left,
						'top' : that._styles.top,
						'margin' : that._styles.margin
					}, that._time, function() {
						Lib.ele.body.removeChild(that._popup);

						that._content.removeAttribute('style');
						that._container.removeAttribute('style');
						that._wrap.removeAttribute('style');

						Lib.toggleFilter(Lib.ele.container, mode);
					})
				})
			}
		},
		/* --------------------------------------------------
		 * @module 弹出显示动画
		 * @param(height:number *) 内容层实际高度
		 * @param(callback:function *) 弹出完成后的回调函数
		 * -------------------------------------------------- */
		enlarge : function(height, callback) {
			var that = this;

			$(this._wrap).animate({
				'opacity' : 1,
				'boxShadow' : '0 0 10px rgba(0,0,0,0.5)',
				'width' : that._width + 'px',
				'height' : height + 'px',
				'left' : 50 + '%',
				'top' : 50 + '%',
				'marginLeft' : - that._width / 2 + 'px',
				'marginTop' : - height / 2  + 'px'
			}, this._time, function() {
				that._wrap.classList.add('show');
				$(that._content).animate({
					'opacity' : 1
				}, that._time, function() {
					if (callback && Lib.isFunction(callback)) {
						callback();
					}
				})
			})
		}
	}

	/* ==================================================
	 * @constructor AJAX表单[Component]
	 * @param(param:json) 参数
	 *   + (ele:json) 元素参数
	 *     - (ele:[string:'input'/'select'/'textarea']) 元素标签类型
	 *     - (title:string) 项目名称
	 *     - (notice:string) 验证不通过时的提示语,require为false时无意义
	 *     + (verify:json *) 元素验证参数
	 *       - (require:[boolean/regex]) 是否为必须项,为true时验证是否为空,为regex时根据正则表达式进行验证
	 *       - (mode:string) 正则表达式的所需的模式
	 *     + (prop:json) 元素参数,下标应该为JS中的属性名称如:maxLength
	 *   - (wrap:element/string) 外包围DOM,当使用弹框模式时使用sting,其中一定要有'<s data-type="placeholder"></s>'字符,此字符元素位置代表表单位置,
	 *   - (style:string) 附加样式名
	 *   - (text:string[提交]) 提交按钮字符
	 *   - (reset:boolean[true]) 是否有重置按钮
	 *   - (inited:function) 表单装载完成后的后续操作
	 *   + (request:json *) AJAX所需要的参数
	 *     - (action:json) 提交动作的URL地址
	 *     - (method:json) 提交动作的方法
	 *     - (data:json) 跟随url的参数
	 *     - (dataType:json) 返回的数据类型
	 *   - (submit:function) 点击提交后返回新的request.data
	 *   - (popup:json) 弹框模式的参数
	 *     - (btn:element) 引用弹出层里的按钮
	 *     - (done:function) 如果是弹出模式,看情况执行弹出回调
	 * ================================================== */
	AjaxForm = function(param) {
		this._options = {
			'yd' : ['儿保科', '妇科', '妇保科', '儿科', '产科', '口腔科', '美容科', '乳腺科', '月子中心', '内科', '体检科'],
			'wz' : ['国医堂', '针灸推拿科', '康复医学科', '口腔科', '妇科', '泌尿科', '肾病科', '体检科', '中医皮肤科', '中医科', '内科', '外科'],
			'sg' : ['口腔科', '美容科', '眼科', '妇科', '男科', '中医科', '内科', '外科', '皮肤科'],
			'ba' : ['整形美容科', '激光美容科', '口腔科', '眼科', '妇科', '产科', '男科', '皮肤科', '外科', '内科', '耳鼻喉科', '乳腺科', '中医肝病科', '体检科', '检验科']
		},
		this._element = param.element,
		this._wrap = param.wrap,
		this._style = param.style,
		this._text = Lib.isString(param.text) ? param.text : '提交',
		this._reset = Lib.isBoolean(param.reset) ? param.reset : true,
		this.inited = Lib.isFunction(param.inited) ? param.inited : function() {},
		this._request = param.request,
		this.returnXhr = param.submit;

		if (Lib.isJSON(param.popup)) {
			this.onPopup = param.popup.done;
			this._btn = param.popup.btn
			this._popupStyle = param.popup.style
		}

		this.initialize();
	}
	AjaxForm.prototype = {
		/* --------------------------------------------------
		 * @module 初始化
		 * -------------------------------------------------- */
		initialize : function() {
			var form = this._form = document.createElement('form');
				form.className = 'app-ajax-form';
				box = document.createElement('div');
				box.className = this._style;

			for (var i = 0; i < this._element.length; i++) {
				var nowEle = this._element[i],
					eleProp = Lib.isJSON(nowEle.prop) ? nowEle.prop : {},
					dl = document.createElement('dl'),
					dt = document.createElement('dt'),
					title = document.createTextNode(nowEle.title + '：'),
					dd = document.createElement('dd'),
					label,
					ele,
					arrow,
					options;

				switch (nowEle.tag){
					case 'select' :
						ele = document.createElement('select'),
						arrow = document.createElement('i');

						if (Lib.isString(eleProp.option) && eleProp.option in this._options) {
							options = this._options[eleProp.option];
						} else if (Lib.isArray(eleProp.option)) {
							options = eleProp.option;
						}

						ele.options.add(new Option(eleProp.value, ''));
						for (k = 0; k < options.length; k++) {
							ele.options.add(new Option(options[k], options[k]));
						}

						break;

					case 'input' :
						switch (eleProp.type) {
							case 'text':
							case 'number':
							case 'email':
							case 'url':
							case 'date':
							case 'file':
								ele = document.createElement('input');
								if (Lib.isString(eleProp.value)) ele.placeholder = eleProp.value;
								break;

							case 'hidden':
								ele = document.createElement('input');
								if (Lib.isString(eleProp.value)) ele.value = eleProp.value;
								dl.style.display = 'none';
								break;

							case 'checkbox' :
								ele = [];
								for (var j = 0; j < eleProp.option.length; j++) {
									var input = document.createElement('input');

									input.className = 'icon';
									input.value = eleProp.option[j];
									ele.push([input, eleProp.option[j]]);
								}
								break;

							case 'radio' :
								ele = [];
								for (var j = 0; j < eleProp.option.length; j++) {
									var input = document.createElement('input');

									input.className = 'icon';
									input.value = eleProp.option[j];
									ele.push([input, eleProp.option[j]]);
								}
								break;

							case 'button':
								ele = document.createElement('input');
								if (Lib.isString(eleProp.value)) ele.value = eleProp.value;
								break;
						}

						break;

					case 'textarea' :
						ele = document.createElement('textarea');

						dl.style.height = dd.style.height = 70 + 'px';
						if (Lib.isString(eleProp.value)) ele.placeholder = eleProp.value;
						break;
				}

				if (Lib.isArray(ele)) {
					for (var l = 0; l < ele.length; l++) {
						for (var key in eleProp) {
							if (key === 'value' || key === 'option') continue;
							ele[l][0][key] = eleProp[key];
						}

						label = document.createElement('label');
						text = document.createTextNode(ele[l][1]);

						label.appendChild(ele[l][0]);
						label.appendChild(text);
						dd.appendChild(label);
					}
				} else {
					for (var key in eleProp) {
						if (key === 'value' || key === 'option') continue;
						ele[key] = eleProp[key];
					}
					dd.appendChild(ele);

					if (nowEle.tag === 'select') dd.appendChild(arrow);
				}


				if (nowEle.verify.require) {
					var requireDot = document.createElement('b');
						dot = document.createTextNode('*');

					requireDot.appendChild(dot);
					dt.appendChild(requireDot);
				}

				dt.appendChild(title);
				dl.appendChild(dt);
				dl.appendChild(dd);
				box.appendChild(dl);
			}

			var submitBox = document.createElement('dl'),
				submitBtn = this._submitBtn = document.createElement('input');

			submitBtn.type = 'button';
			submitBtn.value = this._text;
			submitBox.appendChild(submitBtn);

			if (this._reset) {
				var resetBtn = document.createElement('input');
					resetBtn.type = 'reset';
					resetBtn.value = '重置';
				submitBox.appendChild(resetBtn);
			}

			box.appendChild(submitBox);
			form.appendChild(box);

			this.onInited();
		},
		onInited : function() {
			this.inited();
			this.bindEvent();
		},
		/* --------------------------------------------------
		 * @module 事件绑定
		 * -------------------------------------------------- */
		bindEvent : function() {
			var that = this;

			if (Lib.isElement(this._wrap) && !this._btn) {
				this._wrap.appendChild(this._form);
			} else if (this._btn) {
				this.popup = new PopupBox(this._popupStyle);
				var insertEle;

				if (Lib.isString(this._wrap)){
					var customEle = document.createElement('div'),
						placeholder;

					customEle.className = 'custom-content'
					customEle.innerHTML = this._wrap;
					placeholder = customEle.querySelector('[data-type="placeholder"]');
					customEle.replaceChild(this._form, placeholder);

					insertEle = customEle;
				} else if (!this._wrap && this._btn) {
					insertEle = this._form;
				}

				Lib.bind(this._btn, Lib.tap, function() {
					that.popup.show(this, insertEle, function() {
						if (Lib.isFunction(that.onPopup)) {
							that.onPopup();
						}
					});
				});
			}

			Lib.bind(this._submitBtn, Lib.tap, function() {
				that.getValue();
			});
		},
		getValue : function () {
			var data = {};

			for (var i = 0; i < this._element.length; i++) {
				var nowEle = this._element[i],
					tag = nowEle.tag,
					prop = nowEle.prop,
					name = prop.name,
					type = prop.type,
					ele,
					value;

				if (tag === 'input' && type === 'checkbox') {
					ele = this._form.querySelectorAll('[name="' + name + '"]');
					value = [];
					for (var j = 0; j < ele.length; j++) {
						if (ele[j].checked) value.push(ele[j].value);
					}
					value = value.toString();
				} else {
					if (tag === 'input' && type === 'radio') {
						ele = this._form.querySelector('[name="' + name + '"]:checked');

						if (Lib.isElement(ele)) {
							value = ele.value;
						} else {
							value = undefined;
						}
					} else {
						ele = this._form.querySelector('[name="' + name + '"]'),
							value = ele.value;
					}
				}

				data[prop.name] = this.verify(nowEle, tag, value, ele, type, name);

				if (data[prop.name]) {
					continue;
				} else {
					return false;
				}
			}
			this.getURL(data);
		},
		verify : function(nowEle, tag, value, ele, type, name) {
			var notice = nowEle.notice,
				verify = nowEle.verify,
				require = verify.require,
				mode = verify.mode,
				prop = nowEle.prop,
				pattern;

			if (require) {
				if (require === true) {
					if (!value || value == '' || value == prop.value) {
						alert(notice);
						if (Lib.isElement(ele)) ele.focus();
						return false;
					}
				} else if (require && require !== true) {
					// 如果是联系电话，根据值长度进行不同类型的检测
					if (mode) {
						switch (mode) {
							case 'tel' :
								if (value.length == 11) {
									pattern = new RegExp(require.mobile);
								} else {
									pattern = new RegExp(require.tel);
								}
								break;
						}
					} else {
						pattern = new RegExp(require);
					}

					if (!pattern.test(value)) {
						alert(notice);
						if (Lib.isElement(ele)) ele.focus();

						return false;
					}
				}
			}

			return value;
		},
		/* --------------------------------------------------
		 * @module 取回URL
		 * -------------------------------------------------- */
		getURL : function(data) {
			var lastData = Lib.isJSON(this._request.data) ? this._request.data : {};

			for (var key in data) {
				lastData[key] = data[key];
			}

			delete data;

			this.returnXhr({
				'url' : this._request.action,
				'type' : Lib.isString(this._request.method.toUpperCase()) ? this._request.method.toUpperCase() : 'GET',
				'data' : lastData,
				'dataType' : Lib.isString(this._request.dataType) ? this._request.dataType : 'json'
			});
		}
	}

	/* ==================================================
	 * @constructor 商务通绑定[Component]
	 * @param(mode:string['boai','yd','sg','wz']) 医院类型
	 * ================================================== */
	BindSwt = function(mode) {
		this._telBtn = document.querySelectorAll('.openTelBtn'),
		this._swtBtn = document.querySelectorAll('.openSwtBtn'),
		this._reserveBtn = document.querySelectorAll('.openReserveBtn');

		this.bindEvent(mode);
	}
	BindSwt.prototype = {
		openTel : function(tel) {
			ga('send','pageview','/tel/');
			window.location.href = 'tel:' + tel;
		},
		openSwt : function() {
			ga('send','pageview','/swt/');
			openZoosUrl('chatwin');
		},
		openReserve : function(url) {
			ga('send','pageview','/yuyue/');
			window.location.href = 'http://' + url;
		},
		/* --------------------------------------------------
		 * @module 事件绑定
		 * -------------------------------------------------- */
		bindEvent : function(mode) {
			var that = this,
				info;

			switch (mode) {
				case 'boai' :
					info = {
						'tel' : '075525890396',
						'url' : 'm.boai.com/jiuyi/guahao/'
					}
					break;
				case 'yd' :
					info = {
						'tel' : '075588808888',
						'url' : 'wap.woman91.com/yuyue/'
					}
					break;
				case 'sg' :
					info = {
						'tel' : '075582473398',
						'url' : 'm.sg91.net/plus/wap/yuyue.php'
					}
					break;
				case 'wz' :
					info = {
						'tel' : '075526719191',
						'url' : 'wap.wz16.net/plus/wap/diy.php'
					}
					break;

				case 'shyd' :
					info = {
						'tel' : '4006770366',
						'url' : 'm.yodak.net/yy.php'
					}
					break;
			};

			// 绑定电话事件
			Lib.bind(this._telBtn, Lib.tap, function() {
				that.openTel(info.tel);
			});
			// 绑定商务通事件
			Lib.bind(this._swtBtn, Lib.tap, function() {
				that.openSwt();
			});
			// 绑定预约事件
			Lib.bind(this._reserveBtn, Lib.tap, function() {
				that.openReserve(info.url);
			});
		}
	}

	/* ==================================================
	 * @constructor 联系方式控件[Component]
	 * @param(param:json) 医院类型
	 *   - (wrap:element/number) 外包围DOM
	 *   - (btns:array[['tel', 'swt', 'share']]) 外包围DOM（'tel'/'swt'/'reserve'/'share'/'url'）
	 *   - (info:json) 外包围DOM
	 *     - (addr:string) 联系地址
	 *     - (tel:tel) 联系电话（格式为：0755-88808888）
	 *     - (url:url) 主页网址（不带'http://'）
	 *   - (style:srting['circle']) 外包围DOM
	 *   - (color:json) 外包围DOM
	 *     - (text:hex) 文字描述的颜色
	 *     - (link:hex) 文字链接的颜色
	 *     - (btn:hex) 按钮的颜色
	 *     - (icon:hex) 按钮上图标的颜色
	 *     - (tit:hex) 按钮上文字的颜色
	 *     - (bdr:hex) 按钮边框（如果有）的颜色
	 *   - (top:number) 盒子的TOP值
	 *   - (link:url) 了解更多按钮的连接
	 * ================================================== */
	ContactBar = function(param) {
		var info = Lib.isJSON(param.info) ? param.info : param;

		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.page.all[param.wrap],
		this._btns = Lib.isArray(param.btns) && param.btns.length != 0 ? param.btns : ['tel', 'swt', 'share'],
		this._info = [['地址', info.addr], ['电话', info.tel], ['网址', info.url], ['QQ', info.qq]],
		this._style = Lib.isString(param.style) ? param.style : 'circle',
		this._color = Lib.isJSON(param.color) ? param.color : {},
		this._rgb = {},
		this._icon = Lib.isString(param.icon) ? param.icon : 'default',
		this._top = Lib.isNumber(param.top) ? Lib.getScaleVal(param.top) : undefined,
		this._link = Lib.isString(param.link) ? param.link : '#',
		this._init = new ContactStyle(this._style),
		this._btnIcon = [];

		for (var key in this._color) {
			if (this._color[key]) {
				this._color[key] = this._color[key] && Lib.isHexColor(this._color[key]) ? this._color[key] : '#ffffff';
			} else {
				this._color[key] = '#ffffff';
			}
		}

		switch (this._icon) {
			case 'default' :
			default :
				this._iconUrl = '/Public/app/img/global/icon.png';
		}

		this.initialize();
	}
	ContactBar.prototype = {
		initialize : function() {
			var contactBox = document.createElement('div'),
				btnBox = this._btnBox = document.createElement('div');

			contactBox.className = 'app-contact ' + this._style;
			if (this._top) contactBox.style.top = this._top + 'px';
			btnBox.className = 'btn-box';

			for (var i = 0; i < this._info.length; i++) {
				var titleStr = this._info[i][0]
					textStr = this._info[i][1];

				if (Lib.isString(textStr) && textStr != '') {
					var p = document.createElement('p'),
						b = document.createElement('b'),
						title = document.createTextNode(titleStr + '：'),
						text = document.createTextNode(textStr);

					p.style.color = this._color.text;

					b.appendChild(title);
					p.appendChild(b);

					if (i == 1) {
						var a = document.createElement('a');

						a.href = 'tel:' + textStr;
						a.style.color = this._color.link;

						a.appendChild(text);
						p.appendChild(a);
					} else if (i == 2) {
						var a = document.createElement('a');

						a.href = 'http://' + textStr + '/';
						a.style.color = this._color.link;

						a.appendChild(text);
						p.appendChild(a);
					} else {
						p.appendChild(text);
					}

					contactBox.appendChild(p);
				}
			}

			this._init(btnBox, this._btns, function(url, icons) {
				new ColorConvert({
					'url' : url,
					'icons' : icons
				})
			});

			contactBox.appendChild(btnBox);
			this._wrap.appendChild(contactBox);

			this.bindEvent();
		},
		getIcon : function(wrap, name, hex) {
			var w,
				h,
				x,
				y;

			switch (this._icon) {
				case 'default' :
				default :

					switch (this._style) {
						case 'circle' :
							y = 400;

							switch (name) {
								case 'tel' :
									w = 52,
									h = 52,
									x = 0;

									break;

								case 'swt' :
									w = 52,
									h = 52,
									x = 52;

									break;

								case 'reserve' :
									w = 52,
									h = 52,
									x = 104;

									break;

								case 'share' :
									w = 52,
									h = 52,
									x = 156;

									break;

								case 'url' :
									w = 52,
									h = 52,
									x = 208;

									break;
							}

							break;

						case 'rect' :
							y = 452;

							switch (name) {
								case 'tel' :
									w = 32,
									h = 32,
									x = 0;

									break;

								case 'swt' :
									w = 32,
									h = 32,
									x = 32;

									break;

								case 'reserve' :
									w = 32,
									h = 32,
									x = 64;

									break;

								case 'share' :
									w = 32,
									h = 32,
									x = 96;

									break;

								case 'url' :
									w = 32,
									h = 32,
									x = 128;

									break;
							}

							break;
					}

					break;
			}

			return {
				'wrap' : wrap,
				'w' : w,
				'h' : h,
				'x' : - x,
				'y' : - y,
				'hex' : hex
			}
		},
		bindEvent : function() {
			var that = this,
				urlBtn = this._btnBox.querySelector('.openUrlBtn');

			if (Lib.isElement(urlBtn)) {
				Lib.bind(urlBtn, Lib.tap, function() {
					window.location.href = 'http://' + that._link;
				})
			}
		}
	}

	/* ==================================================
	 * @constructor 联系方式控件样式[Library]
	 * @param(style:string) 样式名称
	 * ================================================== */
	ContactStyle = function(style) {
		var init;

		switch (style) {
			case 'circle' :
			default :
				init = this.circleInit;
				break;

			case 'rect' :
				init = this.rectInit;
				break;
		}

		return init;
	}
	ContactStyle.prototype = {
		circleInit : function(box, btns, callback) {
			var length = btns.length,
				btnWidth = (100 / length) + '%';

			for (var i = 0; i < length; i++) {
				var str = this._btns[i],
					firStr = str.slice(0, 1),
					upStr = firStr.toUpperCase(),
					lowStr = str.slice(1),
					btnStr = 'open' + upStr + lowStr + 'Btn',
					textStr;

				switch (str) {
					case 'tel' :
						textStr = '电话咨询';
						break;

					case 'swt' :
						textStr = '在线咨询';
						break;

					case 'reserve' :
						textStr = '在线预约';
						break;

					case 'share' :
						textStr = '我要分享';
						break;

					case 'url' :
						textStr = '了解更多';
						break;
				}

				var dl = document.createElement('dl');
					dt = document.createElement('dt'),
					dd = document.createElement('dd'),
					text = document.createTextNode(textStr);

				dl.style.width = btnWidth;

				dt.className = btnStr;
				dt.style.borderColor = this._color.bdr;

				dd.style.color = this._color.tit;

				dd.appendChild(text);

				dl.appendChild(dt);
				dl.appendChild(dd);
				box.appendChild(dl);

				this._btnIcon.push(this.getIcon(dt, str, this._color.icon));
			}

			if (Lib.isFunction(callback)) callback(this._iconUrl, this._btnIcon);
		},
		rectInit : function(box, btns, callback) {
			var length = btns.length,
				btnWidth = (100 / length) + '%';

				if (length >= 3) {
					btnWidth = (100 / 3) + '%';
				} else {
					box.style.margin = '0 16%';
				}

			for (var i = 0; i < length; i++) {
				var str = this._btns[i],
					firStr = str.slice(0, 1),
					upStr = firStr.toUpperCase(),
					lowStr = str.slice(1),
					btnStr = 'open' + upStr + lowStr + 'Btn',
					textStr;

				switch (str) {
					case 'tel' :
						textStr = '电话咨询';
						break;

					case 'swt' :
						textStr = '在线咨询';
						break;

					case 'reserve' :
						textStr = '在线预约';
						break;

					case 'share' :
						textStr = '我要分享';
						break;

					case 'url' :
						textStr = '了解更多';
						break;
				}

				var span = document.createElement('span'),
					em = document.createElement('em'),
					a = document.createElement('a'),
					b = document.createElement('b'),
					text = document.createTextNode(textStr);

				span.style.width = btnWidth;

				a.className = btnStr;
				b.style.color = this._color.tit;
				a.style.backgroundColor =  this._color.btn;

				b.appendChild(text);
				a.appendChild(b);

				em.appendChild(a);
				span.appendChild(em);
				box.appendChild(span);

				this._btnIcon.push(this.getIcon(a, str, this._color.icon));
			}

			if (Lib.isFunction(callback)) callback(this._iconUrl, this._btnIcon);
		}
	}

	/* ==================================================
	 * @constructor 图片色彩转换[Library]
	 * @param(param:json) 医院类型
	 *   - (url:srting) 图片的地址
	 *   - (icons:json) 图标的参数
	 *     - (w:hex) 图标宽度
	 *     - (h:hex) 图标高度
	 *     - (x:hex) X偏移
	 *     - (y:hex) Y偏移
	 *     - (hex:hex) 图标的颜色
	 * ================================================== */
	ColorConvert = function(param, icons) {
		this.initialize(param.url, param.icons);
	}
	ColorConvert.prototype = {
		initialize : function(url, icons) {
			var that = this,
				iconImg = this._iconImg = new Image();
				iconImg.src = url;

			iconImg.onload = function() {
				that._width  = iconImg.width;
				that._height  = iconImg.height;
				that.drawIcon(icons);
			}
		},
		drawIcon : function(icons) {
			var that = this;
			for (var i = 0; i < icons.length; i++) {
				icons[i].rgb = Lib.HexToRGB(icons[i].hex);

				(function(data, img, width, height) {
					var canvas = document.createElement('canvas');

						canvas.width = data.w;
						canvas.height = data.h;

						canvas.style[Lib.transform] = 'scale(0.5)';

					var ctx = canvas.getContext('2d');
						ctx.drawImage(img, data.x, data.y, width, height);

					var pixels = ctx.getImageData(0, 0, data.w, data.h);

					that.convert(pixels, data.wrap, canvas, ctx, data.rgb);
				})(icons[i], this._iconImg, this._width, this._height)
			}
		},
		convert : function(pixels, wrap, canvas, ctx, rgb) {
			var n = 0,
				w = pixels.width,
				h = pixels.height,
				newData = ctx.createImageData(w, h);
			for(var y = 0; y < h; y++){
				for(var x = 0; x < w; x++){
					n = ((y * w) + x) * 4; /* data序号n与x,y,w的关系 */
					t = ((y * w) + x) * 4; /* 分割后，y,x,w都变大了一倍 */
					newData.data[t] =  rgb.r;
					newData.data[t + 1] =  rgb.g;
					newData.data[t + 2] =  rgb.b;
					newData.data[t + 3] =  pixels.data[n + 3];
				}
			}

			ctx.putImageData(newData, 0, 0);
			wrap.appendChild(canvas);
		}
	}

	/* ==================================================
	 * @constructor 静态地图[Component]
	 * @param(param:json) 参数
	 *   - (wrap:element/number) 外包围DOM
	 *   - (style:string) 附加样式名
	 *   - (zoom:number) 地图层级
	 *   - (top:number) 地图容器位置
	 *   - (height:number) 地图容器高度
	 *   + (coord:json *) 位置坐标
	 *     - (name:string) 终点位置名称
	 *     - (lng:longitude) 地图坐标经度
	 *     - (lat:latitude) 地图坐标纬度
	 *   + (dynamic:json) 动态地图
	 * ================================================== */
	StaticMap = function(param) {
		this._style = param.style && Lib.isString(param.style) && param.style != '' ? param.style : undefined,
		this._coord = param.coord,
		this._zoom = param.zoom,
		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.page.all[param.wrap],
		this._top = Lib.isNumber(param.top) ? Lib.getScaleVal(param.top) : undefined,
		this._height = Lib.isNumber(param.height) ? Lib.getScaleVal(param.height) : undefined,
		this._id = Math.random();

		var dynamic = Lib.isJSON(param.dynamic) ? param.dynamic : null;

		if (Lib.isJSON(dynamic)) {
			this.dynamicMap = new DynamicMap({
				'style' : this._style,
				'endX' : this._coord.lng,
				'endY' : this._coord.lat,
				'endAddr' : this._coord.name,
				'zoom' : Lib.isNumber(dynamic.zoom) ? dynamic.zoom : param.zoom,
				'key' : dynamic.key,
				'emptyAddr' : dynamic.emptyAddr,
				'region' : dynamic.region,
				'wrap' : dynamic.wrap
			});
		}

		// 创建各各元素
		this.create();
	}
	StaticMap.prototype = {
		/* --------------------------------------------------
		 * @module 创建地图容器
		 * -------------------------------------------------- */
		create : function() {
			// 创建包围层
			var wrapBox = this._mapWrap = document.createElement('div'),
				// 创建地图层
				conBox = this._container = document.createElement('div');

			wrapBox.className = 'app-static-map';
			conBox.className = 'con';

			if (this._style) wrapBox.classList.add(this._style);
			if (this._top) wrapBox.style.top = this._top + 'px';
			if (this._height) wrapBox.style.height = this._height + 'px';

			// 插入地图层/展示按钮层
			wrapBox.appendChild(conBox);

			if (this.dynamicMap) {
				// 创建显示动态地图按钮
				var showBtn = this._showBtn = document.createElement('b');
					showBtn.className = 'showBtn';

				wrapBox.appendChild(showBtn);
			}

			// 在wrap元素中插入地图包围层
			this._wrap.appendChild(wrapBox);

			// 装载地图
			this.initialize();
		},
		/* --------------------------------------------------
		 * @module 装载地图
		 * -------------------------------------------------- */
		initialize : function() {
			var _map = new BMap.Map(this._container),
				_ep = new BMap.Point(this._coord.lng, this._coord.lat),
				_eo = new LocationMarker({
					'point' : _ep,
					'text' : this._coord.name,
					'mode' : 'end',
					'heading' : Lib.val.gs.heading
				});

			// 设定层级及坐标
			_map.centerAndZoom(_ep, this._zoom);
			// 添加标注
			_map.addOverlay(_eo);

			// 绑定事件
			this.bindEvent();
		},
		/* --------------------------------------------------
		 * @module 绑定事件
		 * -------------------------------------------------- */
		bindEvent : function() {
			// 重定义this
			var that = this;

			// 绑定显示按钮事件
			if (this.dynamicMap) {
				Lib.bind(this._showBtn, Lib.tap, function() {
					that.dynamicMap.popup();
				});
			}
		}
	}

	/* ==================================================
	 * @constructor 动态地图[Component]
	 * @param(param:json) 参数
	 *   - (style:string) 附加样式名
	 *   - (endX:longitude) 地图坐标经度
	 *   - (endY:latitude) 地图坐标纬度
	 *   - (zoom:number[18]) 地图层级
	 *   - (key:string['AB01W4B6xtmWXpRkICT50rkh']) 百度地图API密钥
	 *   - (emptyAddr:string['输入您的出发地']) 当没有取到GPS位置时的文字
	 *   - (endAddr:string['未知位置']) 终点位置名称
	 *   - (region:string['深圳']) 区域
	 *   - (wrap:element[Lib.ele.body]) 外包围DOM
	 * ================================================== */
	DynamicMap = function(param) {
		this._style = param.style,
		this._endX = param.endX,
		this._endY = param.endY,
		this._endAddr = param.endAddr,
		this._zoom = Lib.isNumber(param.zoom) ? param.zoom : 18,
		this._key = Lib.isString(param.key) ? param.key : 'AB01W4B6xtmWXpRkICT50rkh',
		this._emptyAddr = Lib.isString(param.emptyAddr) ? param.emptyAddr : '输入您的出发地',
		this._region = Lib.isString(param.region) ? param.region : '深圳',
		this._wrap = Lib.isElement(param.wrap) ? param.wrap : Lib.ele.body,

		this._isLoad = false; // 真实地图是否被下载,执行显示会被改为true
	}
	DynamicMap.prototype = {
		/* --------------------------------------------------
		 * @module 弹出地图
		 * -------------------------------------------------- */
		popup : function() {
			// 根据装载状态决定是否需要重新装载
			if (!this._isLoad) {
				// 开始创建地图
				this.create();
			} else {
				// 显示地图
				this.toggle('in');
			}
		},
		/* --------------------------------------------------
		 * @module 创建地图容器
		 * -------------------------------------------------- */
		create : function() {
			// 创建包围层
			var wrapBox = this._mapWrap = document.createElement('div');
				wrapBox.className = 'app-dynamic-map';
				if (Lib.isString(this._style)) wrapBox.classList.add(this._style);

			// 创建地图层
			var conBox = this._container = document.createElement('div');
				conBox.className = 'con';

			// 创建隐藏层
			var hideBox = document.createElement('div');
				hideBox.className = 'hide';

			// 定义关闭按钮
			var hideMapBtn = this._hideMapBtn = document.createElement('b');
				hideMapBtn.className = 'showOut';
			// 定义关闭图标
			var hideMapBtnIconX = document.createElement('i'),
				hideMapBtnIconY = document.createElement('i');

			// 插入关闭图标
			hideMapBtn.appendChild(hideMapBtnIconX);
			hideMapBtn.appendChild(hideMapBtnIconY);
			// 插入关闭按钮到隐藏层
			hideBox.appendChild(hideMapBtn);

			// 隐藏层/地图层插入到包围层
			wrapBox.appendChild(conBox);
			wrapBox.appendChild(hideBox);

			// 包围层插入到body
			this._wrap.appendChild(wrapBox);

			// 开始装载控件
			this.initialize();
		},
		/* --------------------------------------------------
		 * @module 装载地图及控件
		 * -------------------------------------------------- */
		initialize : function() {
			// 百度地图API功能
			var _map = new BMap.Map(this._container),
				_ep = new BMap.Point(this._endX, this._endY);

			// 创建控件
			var _eo = new LocationMarker({
					'point' : _ep,
					'text' : this._endAddr,
					'mode' : 'end',
					'heading' : Lib.val.gs.heading
				}), // 添加标注
				_z = new ZoomControl(), // 创建缩放控件
				_t = new TrafficControl(), // 创建交通工具控件
				_arg = {
					'eo' : _eo,
					'z': _z,
					't' : _t
				}, // 地理位置参数
				_l = new LocationControl(Lib.val.gs.heading, _arg); // 创建定位工具控件

			//设置中心并设置层级
			_map.centerAndZoom(_ep, this._zoom);
			// 定位工具控件添加到地图当中
			_map.addOverlay(_eo);
			_map.addControl(_z);
			_map.addControl(_t);
			_map.addControl(_l);

			// 定义控件公共变量
			_map._emptyAddr = this._emptyAddr,
			_map._endAddr = this._endAddr,
			_map._ep = _ep,
			_map._key = this._key,
			_map._region = this._region;

			// 更新装载状态
			this._isLoad = true;

			// 绑定事件
			this.bindEvent();

			// 首次显示地图
			this.toggle('in');
		},
		/* --------------------------------------------------
		 * @module 绑定事件
		 * -------------------------------------------------- */
		bindEvent : function() {
			// 重定义this
			var that = this;

			// 绑定隐藏按钮事件
			Lib.bind(this._hideMapBtn, Lib.tap, function() {
				that.toggle('out');
			});
		},
		/* --------------------------------------------------
		 * @module 切换地图显示状态
		 * @param(mode:string(in/out))  切换类型
		 * -------------------------------------------------- */
		toggle : function(mode) {
			// 重定义this
			var that = this;

			// 背景模糊
			Lib.toggleFilter(Lib.ele.container, mode);

			// 显示&隐藏
			if (mode == 'out') {
				that._mapWrap.classList.remove('show');
			} else if (mode == 'in') {
				that._mapWrap.classList.add('show');
			}
		}
	}
	/* ==================================================
	 * @constructor 地图自定义标注[Component]
	 * @param(param:json) 参数
	 *   - (point:point) 坐标
	 *   - (text:string) 标注名称
	 *   - (mode:string(end,start)) 标注类型
	 *   - (heading:boolean) 指北针参数
	 * ================================================== */
	LocationMarker = function(param) {
		this._point = param.point,
		this._text = param.text,
		this._mode = this._style = param.mode,
		this._heading = param.heading;
	}

	/* --------------------------------------------------
	 * @prototype 继承自BMap.Overlay
	 * -------------------------------------------------- */
	LocationMarker.prototype = new BMap.Overlay();

	/* --------------------------------------------------
	 * @module 装载
	 * -------------------------------------------------- */
	LocationMarker.prototype.initialize = function(map) {
		// 赋值地图对象,方便后面调用
		this._map = map;

		if (this._mode == 'start') {
			// 标记盒子
			var mapMaker = this._mapMaker = document.createElement('div');
			mapMaker.className = 'mapNavi ' + this._style;
			mapMaker.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

			// 标记
			var marker = document.createElement('i');
			// 根据是否有指北针,为标记定义不同的样式(如果有指北针,则初始化指针角度)
			if (this._heading) {
				marker.className = 'mapIcon compass';
				marker.style[Lib.transform] = 'rotate('+ Lib.val.gs.heading +'deg)';
			} else {
				marker.className = 'mapIcon dot';
			}
			mapMaker.appendChild(marker);

			// 定位的精准度范围圈
			var circle = document.createElement('b');
			mapMaker.appendChild(circle);
		} else {
			// 标记盒子
			var mapMaker = this._mapMaker = document.createElement('div');
			mapMaker.className = 'mapMaker ' + this._style;
			mapMaker.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

			// 标记
			var marker = document.createElement('i');
			marker.className = 'mapIcon';
			mapMaker.appendChild(marker);

			// 圆点
			var dot = document.createElement('s');
			marker.appendChild(dot);

			// 阴影
			var shadow = document.createElement('b');
			shadow.className = 'mapIcon';
			mapMaker.appendChild(shadow);

			// 文字标注
			var label = document.createElement('span');
			mapMaker.appendChild(label);
			label.appendChild(document.createTextNode(this._text));
		}

		map.getPanes().labelPane.appendChild(mapMaker);
		return mapMaker;
	}

	/* --------------------------------------------------
	 * @module 绘制标注
	 * -------------------------------------------------- */
	LocationMarker.prototype.draw = function() {
		var offset = this._map.pointToOverlayPixel(this._point);
		if (this._mode == 'start') {
			this._mapMaker.style.left = offset.x - 8 + 'px';
			this._mapMaker.style.top  = offset.y - 8 + 'px';
		} else {
			this._mapMaker.style.left = offset.x - 10 + 'px';
			this._mapMaker.style.top  = offset.y - 25 + 'px';
		}
	}

	/* ==================================================
	 * @constructor 地图定义绽放控件[Component]
	 * ================================================== */
	ZoomControl = function() {
		// 默认停靠位置和偏移量
		this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT,
		this.defaultOffset = new BMap.Size(8, 8);
	}

	/* --------------------------------------------------
	 * @prototype 继承于BMap.Control
	 * -------------------------------------------------- */
	ZoomControl.prototype = new BMap.Control();

	/* --------------------------------------------------
	 * @module 创建控件容器
	 * -------------------------------------------------- */
	ZoomControl.prototype.initialize = function(map) {
		this._map = map;

		// 创建控制栏
		var zoomCtrlBar =  document.createElement('div');
		zoomCtrlBar.className = 'map-zoom-ctrl-bar';

		// 创建放大按钮
		var zoomIn = this._zoomIn = document.createElement('b');
		// 设置样式
		zoomIn.className = 'zoomIn';
		// 创建放大图标
		var zoomInIconX = document.createElement('i');
		zoomIn.appendChild(zoomInIconX);
		// 创建放大按钮图标
		var zoomInIconY = document.createElement('i');
		zoomIn.appendChild(zoomInIconY);

		// 创建缩小按钮按钮
		var zoomOut = this._zoomOut = document.createElement('b');
		// 设置样式
		zoomOut.className = 'zoomOut';
		// 创建缩小按钮图标
		var zoomOutIcon = document.createElement('i');
		zoomOut.appendChild(zoomOutIcon);

		// 插入按钮到控制栏
		zoomCtrlBar.appendChild(zoomIn);
		zoomCtrlBar.appendChild(zoomOut);

		// 添加控件到地图中
		map.getContainer().appendChild(zoomCtrlBar);

		// 初始缩放控件的可用状态
		this.restStatus();

		// 绑定事件
		this.bindEvent();

		// 将控制栏返回
		return zoomCtrlBar;
	}

	/* --------------------------------------------------
	 * @module 重置控件状态
	 * -------------------------------------------------- */
	ZoomControl.prototype.restStatus = function() {
		// 得到当前地图的层级,并初始缩放控件的可用状态
		var curZoom = this._map.getZoom();
		if (curZoom >= 18) {
			this._zoomIn.classList.add('disable');
		}
		if (curZoom <= 3) {
			this._zoomOut.classList.add('disable');
		}
	}

	/* --------------------------------------------------
	 * @module 绑定事件
	 * -------------------------------------------------- */
	ZoomControl.prototype.bindEvent = function() {
		// 重定义this
		var that = this;
		// 绑定放大事件
		Lib.bind(this._zoomIn, Lib.tapstart, function() {
			var nowZoom = that._map.getZoom();
			if (!this.classList.contains('disable')) {
				that._map.setZoom(nowZoom + 1);
				nowZoom++;

				that.updataZoom(nowZoom);
			}
		});

		// 绑定缩小事件
		Lib.bind(this._zoomOut, Lib.tapstart, function() {
			var nowZoom = that._map.getZoom();
			if (!this.classList.contains('disable')) {
				that._map.setZoom(nowZoom - 1);
				nowZoom--;

				that.updataZoom(nowZoom);
			}
		});
	}

	/* --------------------------------------------------
	 * @module 更新缩放状态
	 * -------------------------------------------------- */
	ZoomControl.prototype.updataZoom = function(zoom) {
		if (zoom >= 18) {
			this._zoomIn.classList.add('disable');
		} else {
			if (this._zoomIn.classList.contains('disable')) {
				this._zoomIn.classList.remove('disable');
			}
		}

		if (zoom <= 3) {
			this._zoomOut.classList.add('disable');
		} else {
			if (this._zoomOut.classList.contains('disable')) {
				this._zoomOut.classList.remove('disable');
			};
		}

		var thisCircle = this._map.container.querySelector('.start b');
		if (thisCircle) {
			var acu = thisCircle.dataset.acu,
				curPixel = acu / Math.pow(2, (18 - zoom));
			thisCircle.style.width = thisCircle.style.height = curPixel + 'px';
		}
	}

	/* ==================================================
	 * @constructor 地图定位控件[Component]
	 * @param(heading:boolean) 设备是否丰硕指北针
	 * @param(param:json) 参数
	 *   - (t:TrafficControl) 交通控件
	 *   - (z:ZoomControl) 绽放控件
	 *   - (eo:LocationMarker)) 结束位置标注
	 * ================================================== */
	LocationControl = function(heading, param) {
		// 默认停靠位置和偏移量
		this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT,
		this.defaultOffset = new BMap.Size(8, 86),
		this._heading = heading,

		this._t = param.t,
		this._z = param.z,
		this._eo = param.eo;
	}

	/* --------------------------------------------------
	 * @prototype 继承于BMap.Control
	 * -------------------------------------------------- */
	LocationControl.prototype = new BMap.Control();

	/* --------------------------------------------------
	 * @module 装载
	 * -------------------------------------------------- */
	LocationControl.prototype.initialize = function(map) {
		this._map = map;

		// 定义获取位置控制按钮
		var getLocaBtn = this._getLocaBtn = document.createElement('b');
		getLocaBtn.className = 'get';
		// 定义获取位置控制按钮图标
		var getLocaBtnIcon = document.createElement('i');
		getLocaBtnIcon.className = 'mapIcon';
		// 添加获取位置控制按钮图标
		getLocaBtn.appendChild(getLocaBtnIcon);

		// 定义终点控制按钮
		var endLocaBtn = this._endLocaBtn = document.createElement('b');
		endLocaBtn.className = 'end';
		// 定义终点控制按钮图标
		var endLocaBtnIcon = document.createElement('i');
		endLocaBtnIcon.className = 'mapIcon';
		// 添加终点控制按钮图标
		endLocaBtn.appendChild(endLocaBtnIcon);

		// 定义起点控制按钮
		var startLocaBtn = this._startLocaBtn = document.createElement('b');
		startLocaBtn.className = 'start';
		startLocaBtn.style.display = 'none';

		// 定义起点控制按钮图标
		var startLocaBtnIcon = document.createElement('i');
		if (this._heading) {
			// 如果有指北针,则设定图标为指针
			startLocaBtn.classList.add('compass');
			startLocaBtnIcon.className = 'mapIcon';

			// 添加加载定时器,执行方向跟随
			var headingTimer = setInterval(function() {
				startLocaBtnIcon.style[Lib.transform] = 'rotate('+ Lib.val.gs.heading +'deg)';
			}, 50)
		} else {
			// 如果没有指北针,则添加小圆点
			var startLocaBtnDot = document.createElement('s');
			startLocaBtnIcon.appendChild(startLocaBtnDot);
		}
		// 添加起点控制按钮图标
		startLocaBtn.appendChild(startLocaBtnIcon);

		// 创建控制栏
		var LocationCtrlBar = document.createElement('div');
		LocationCtrlBar.className = 'map-location-ctrl-bar';

		// 将各按钮置入控制栏
		LocationCtrlBar.appendChild(getLocaBtn);
		LocationCtrlBar.appendChild(endLocaBtn);
		LocationCtrlBar.appendChild(startLocaBtn);

		// 添加控件到地图中
		map.getContainer().appendChild(LocationCtrlBar);

		// 绑定事件
		this.bindEvent();

		// 首次获取当前位置坐标
		this.getLocation();

		// 将控制栏返回
		return LocationCtrlBar;
	}

	/* --------------------------------------------------
	 * @module 绑定事件
	 * -------------------------------------------------- */
	LocationControl.prototype.bindEvent = function() {
		// 重定义this
		var that = this;

		// 绑定重新获取位置
		Lib.bind(this._getLocaBtn, Lib.tapstart, function() {
			if (!this.classList.contains('disable')) {
				that.getLocation();
			}
		});

		// 绑定移动到医院
		Lib.bind(this._endLocaBtn, Lib.tapstart, function() {
			that._map.panTo(that._map._ep);
		});

		// 绑定移动到当前位置
		Lib.bind(this._startLocaBtn, Lib.tapstart, function() {
			that._map.panTo(that._map._sp);
		});
	}

	/* --------------------------------------------------
	 * @module 获取定位信息
	 * -------------------------------------------------- */
	LocationControl.prototype.getLocation =  function() {
		// 重定义this
		var that = this;

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				that.getPosition(position);
			}, function(error) {
				that.showError(error);
			}, {
					'enableHighAccuracy' : true,
					'timeout' : 5000
				}
			);
		} else {
			alert('对不起,您的浏览器不支持位置信息！');
		}

		that._getLocaBtn.classList.add('disable');

		// 清除roadInputBar样式
		this._t._addrInput.value = '定位中…';
		this._t._roadInputBar.classList.add('ing');
	}

	/* --------------------------------------------------
	 * @module 获取位置信息
	 * -------------------------------------------------- */
	LocationControl.prototype.getPosition = function(position) {
		// 重定义this
		var that = this;

		var lng = position.coords.longitude, // 经度
			lat = position.coords.latitude, // 纬度
			acu = position.coords.accuracy, // 精准度,单位米
			url = 'http://api.map.baidu.com/geoconv/v1/?coords='+ lng +','+ lat +'&from=1&to=5&ak='+ that._map._key;
		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'jsonp',
			success: function(data) {
				if (data.result.length == 0) {
					alert('转换坐标信息失败,请重试');
				} else {
					var startX = data.result[0].x,
						startY = data.result[0].y;

					that._map._sp = new BMap.Point(startX, startY);
					that._startLocaBtn.style.display = 'block';
					that._getLocaBtn.classList.remove('disable');

					// 如果曾经被定位过,则先移除以前的覆盖物
					if (that._map._GPSStatus) {
						// 如果有指南针,则清除指北针计时器
						if (Lib.val.gs.heading) clearInterval(that._headingTimer);
						// 清除所有覆盖物
						that._map.clearOverlays();
						// 重新添加标注
						that._map.addOverlay(that._eo);
					}

					// 将标注添加到地图中
					// 添加标注
					var startOverlay = new LocationMarker({
						'point' : that._map._sp,
						'text' : '您的位置',
						'mode' : 'start',
						'heading' : Lib.val.gs.heading
					});
					that._map.addOverlay(startOverlay);

					// 获取start标签DOM
					var starMarker = startOverlay.domElement;

					// 如果有指北针,则开启方向跟随
					if (Lib.val.gs.heading) {
						var compassMarker = starMarker.querySelector('i');
						// 添加加载定时器,执行方向跟随
						that._headingTimer = setInterval(function() {
							compassMarker.style[Lib.transform] = 'rotate('+ Lib.val.gs.heading +'deg)';
						}, 50)
					}
					// 根据地图层级改变圆圈大小
					that.updateCircle(starMarker, acu);

					// 创建直线对象
					var polyline = new BMap.Polyline([that._map._ep, that._map._sp],  {strokeColor:'blue', strokeWeight:1, strokeOpacity:0.5});
					// 将直线对象添加到地图中
					that._map.addOverlay(polyline);

					// 2秒后的操作
					setTimeout(function() {
						// 两秒后绽绽放至合适视野
						that._map.setViewport([that._map._ep, that._map._sp]);

						// 根据地图层级改变圆圈大小
						that.updateCircle(starMarker, acu);

						// 两秒后移动到定位位置
						//that._map.panTo(that._map._sp);
					}, 2000);

					// 根据得到的坐标读取实际的物理地址
					var	curGc = new BMap.Geocoder();
					curGc.getLocation(that._map._sp, function(rs) {
						var addComp = rs.addressComponents,
							addr = (addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);

						//为输入框输入位置信息/设置GPSAddr值
						that._t._addrInput.value = that._map._GPSAddr = addr;
						// 设定roadToolBar样式
						that._t._roadInputBar.classList.remove('ing');
					});

					// 设定GPS状态
					that._map._GPSStatus = true;
				}
			}
		})
	}

	/* --------------------------------------------------
	 * @module 定位错误信息
	 * -------------------------------------------------- */
	LocationControl.prototype.showError = function(error) {
		// 重定义this
		var that = this;
		/*
		switch(error.code) {
			case error.PERMISSION_DENIED:
				alert('您未允许浏览器请求位置信息');
				break;
			case error.POSITION_UNAVAILABLE:
				alert('位置信息不可用');
				break;
			case error.TIMEOUT:
				alert('请求位置信息超时');
				break;
			case error.UNKNOWN_ERROR:
				alert('请求位置时发生未知错误');
				break;
		}
		*/

		// 设定GPS状态
		that._map._GPSStatus = false;
		that._getLocaBtn.classList.remove('disable');
		that._startLocaBtn.style.display = 'none';

		// 设定手动输入提示
		that._t._addrInput.value = that._map._emptyAddr;
		// 设定roadToolBar样式
		that._t._roadInputBar.classList.remove('ing');
	}

	/* --------------------------------------------------
	 * @module 更新圆圈状态
	 * -------------------------------------------------- */
	LocationControl.prototype.updateCircle = function(marker, accuracy) {
		var nowZoom = this._map.getZoom(),
			curPixel = accuracy / Math.pow(2, (18 - nowZoom)),
			thisCircle = marker.querySelector('b');

		thisCircle.style.width = thisCircle.style.height = curPixel + 'px';
		thisCircle.dataset.acu = accuracy;

		this._z.updataZoom(nowZoom);
	}

	/* ==================================================
	 * @constructor 地图交通控件[Component]
	 * ================================================== */
	TrafficControl = function() {
		// 默认停靠位置和偏移量
		this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT,
		this.defaultOffset = new BMap.Size(0, 8);
	}

	/* --------------------------------------------------
	 * @prototype 继承于BMap.Control
	 * -------------------------------------------------- */
	TrafficControl.prototype = new BMap.Control();

	/* --------------------------------------------------
	 * @module 装载
	 * -------------------------------------------------- */
	TrafficControl.prototype.initialize = function(map) {
		// 继承map
		this._map = map;

		// 交通控件栏
		var trafficCtrlBar = document.createElement('div');
			trafficCtrlBar.className = 'map-traffic-bar';

		// 定义位置输入栏
		var roadInputBar = this._roadInputBar = document.createElement('div');
			roadInputBar.className = 'roadInputBar';

		// 定义输入状态图标
		var positionIcon = document.createElement('i'),
			roadLineIcon = document.createElement('i');
			positionIcon.className = roadLineIcon.className = 'mapIcon';

		// 定义地址输入框
		var addrInput = this._addrInput = document.createElement('input');
			addrInput.className = 'addr';
			addrInput.value = '定位中…';
			addrInput.type = 'text';

		// 插入输入状态图标
		roadInputBar.appendChild(positionIcon);
		roadInputBar.appendChild(roadLineIcon);

		// 插入地址输入框
		roadInputBar.appendChild(addrInput);

		// 定义路线搜索栏
		var roadSearchBar = document.createElement('div');
			roadSearchBar.className = 'roadSearchBar';

		// 定义公车按钮
		var busBtn = this._busBtn = document.createElement('b');
			busBtn.className = 'bus';

		// 定义公车图标及文字
		var busBtnIcon = document.createElement('i');
			busBtnIcon.className = 'mapIcon';
		var busBtnText = document.createTextNode('公交');

		// 插入公车图标及文字
		busBtn.appendChild(busBtnIcon);
		busBtn.appendChild(busBtnText);

		// 定义自驾图标及文字
		var carBtn = this._carBtn = document.createElement('b');
			carBtn.className = 'car';

		// 定义自驾按钮
		var carBtnIcon = document.createElement('i');
			carBtnIcon.className = 'mapIcon';
		var carBtnText = document.createTextNode('自驾');

		// 插入自驾图标及文字
		carBtn.appendChild(carBtnIcon);
		carBtn.appendChild(carBtnText);

		// 插入公车/自驾按钮
		roadSearchBar.appendChild(busBtn);
		roadSearchBar.appendChild(carBtn);

		// 插入地址输入框/路线搜索栏
		trafficCtrlBar.appendChild(roadInputBar);
		trafficCtrlBar.appendChild(roadSearchBar);

		// 添加控件到地图中
		map.getContainer().appendChild(trafficCtrlBar);

		// 绑定事件
		this.bindEvent();

		// 将控制栏返回
		return trafficCtrlBar;
	}

	/* --------------------------------------------------
	 * @module 绑定事件
	 * -------------------------------------------------- */
	TrafficControl.prototype.bindEvent = function() {
		// 重定义this
		var that = this;

		// 绑定路线查找事件
		Lib.bind(this._busBtn, Lib.tapstart, function() {
			that.seeRoadLine('bus');
		});
		Lib.bind(this._carBtn, Lib.tapstart, function() {
			that.seeRoadLine('car');
		});

		// 绑定出发地输入事件
		Lib.bind(this._addrInput, 'focus', function(e) {
			that.inputEvent(e);
		});
		Lib.bind(this._addrInput, 'blur', function(e) {
			that.inputEvent(e);
		});
	}

	/* --------------------------------------------------
	 * @module 输入事件
	 * -------------------------------------------------- */
	TrafficControl.prototype.inputEvent = function(e) {
		var addrVal = this._addrInput.value,
			eventType = e.type;
		if (eventType == 'focus') {
			if (addrVal == '' || addrVal == this._map._emptyAddr || addrVal == this._map._GPSAddr || addrVal == '定位中…') this._addrInput.value = '';
		} else if (eventType == 'blur') {
			if (addrVal == '') {
				if (this._map._GPSStatus) {
					this._addrInput.value = this._map._GPSAddr;
				} else {
					this._addrInput.value = this._map._emptyAddr;
				}
			}
		}
	}

	/* --------------------------------------------------
	 * @module 前往路线
	 * -------------------------------------------------- */
	TrafficControl.prototype.seeRoadLine = function(type) {
		var addrInputVal = this._addrInput.value,
			addrStatus;
		if (addrInputVal == this._map._emptyAddr || addrInputVal == '' || addrInputVal == '定位中…') {
			addrStatus = false;
		} else {
			addrStatus = true;
		}

		if (addrStatus) {
			if (this._map._GPSAddr) {
				if (addrInputVal == this._map._GPSAddr) {
					if (type == 'car') {
						this.roadLine(true, BMAP_MODE_DRIVING, this._map._sp, '您的位置', this._map._ep);
					} else if (type == 'bus') {
						this.roadLine(true, BMAP_MODE_TRANSIT, this._map._sp, '您的位置', this._map._ep);
					};
				} else {
					if (type == 'car') {
						this.roadLine(false, BMAP_MODE_DRIVING, 0, addrInputVal, this._map._ep);
					} else if (type == 'bus') {
						this.roadLine(false, BMAP_MODE_TRANSIT, 0, addrInputVal, this._map._ep);
					};
				}
			} else {
				if (type == 'car') {
					this.roadLine(false, BMAP_MODE_DRIVING, 0, addrInputVal, this._map._ep);
				} else if (type == 'bus') {
					this.roadLine(false, BMAP_MODE_TRANSIT, 0, addrInputVal, this._map._ep);
				};
			}
		} else {
			alert('请'+ this._map._emptyAddr);
		}
	}

	/* --------------------------------------------------
	 * @module 显示路线图
	 * @param(gps:boolean) 是否存在GPS
	 * @param(mode:(公交:BMAP_MODE_TRANSIT、驾车:BMAP_MODE_DRIVING、步行:BMAP_MODE_WALKING、导航:BMAP_MODE_NAVIGATION)*) 导航模式
	 * @param(s:point) 起点坐标
	 * @param(sn:string) 起点名称
	 * @param(e:point) 终点坐标
	 * -------------------------------------------------- */
	TrafficControl.prototype.roadLine = function(gps, mode, s, sn, e) {
		var createRoad = new BMap.RouteSearch(),
			start;

		if (gps) {
			start = {
				latlng : s,
				name : sn
			}
		} else {
			start = {
				name : sn
			}
		}

		createRoad.routeCall(start, {
			latlng : e,
			name : this._map._endAddr
		}, {
			mode : mode,
			region : this._map._region
		});
	}

	return {
		version : '1.1.0',
		Application : Application,
		SwipeGuider : SwipeGuider,
		HorizTipser : HorizTipser,
		PoweredInfo : PoweredInfo,
		SlideSwiper : SlideSwiper,
		ToolBar : ToolBar,
		MusicPlayer : MusicPlayer,
		ShareTipser : ShareTipser,
		PopupBox : PopupBox,
		AjaxForm : AjaxForm,
		BindSwt : BindSwt,
		ContactBar : ContactBar,
		StaticMap : StaticMap,
		DynamicMap : DynamicMap,
		WechatAPI : WechatAPI
	};
})();
