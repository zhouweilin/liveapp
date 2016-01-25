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
		SendForm,
		MusicPlayer;

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
		};


		this.module = {};
		this.module.gallery = new AppGallery(param.gallery, function(coverList) {
			that.module.loader = new AppLoader(param.loader, param.type);
			that.module.swiper = new AppSwiper(param.swiper);
			that.module.wechat = new WechatAPI(param.wechat);

			that._time = that.module.swiper._time,
			that._size = that.module.loader._length - 1; // 页面总数，从0开始;

			// 初始装载此APP，加载页面开始！
			that.initialize();
		});

		this._sendForm = new SendForm(param.type);
		this._sendForm.initial();

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
				// that.module.wechat.bindTipser();
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
				'nextGroupStatus' : true// this.module.loader._collection[Lib.val.page.next]['status'] // 取得下一页的图片组状态
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
			// if (this.module.loader._nextGroup < this.module.loader._length) this.module.loader.load(this.module.loader._nextGroup);

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
				url = 'http://liveapp.hithinktank.com/',
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
	AppLoader = function(param, type){
		this._length = Lib.ele.page.all.length; // 组图总数
		this.processer = new LoadProcess({
								type : 1,
								hosType : type
							});
	}
	AppLoader.prototype = {
		initialize : function(onAppLoad){
			var _this = this;

			this.processer.progress(function(){
				onAppLoad();
			});
		}
	}

	/* ===================================
	 *
	 * @constructor(*) 加载进度器[Module]
	 * @param:json 参数
	 *   - type : number[1]
	 * ====================================*/
	LoadProcess = function(param) {
		param  = Lib.isJSON(param) ? param : {};
		this._type = Lib.isNumber(param.type) ? param.type : 1;
		this._hosType = param.hosType;

		this._wrap = $(Lib.ele.container);
		this._process = null;
		this._proWrap = null;
		this._proLine = null;

		// 执行初始化装载
		this.initialize();
	}
	LoadProcess.prototype = {
		initialize : function() {
			this.initPro(this._type, this._hosType);
		},
		// initPro : function(type){
		// 	var processer = $('<div class="app-loader"></div>'),
		// 	    proLine = null,
		// 	    proWrap = null;
		// 	 switch(type){
		// 	 	case 0 :

		// 	 		proWrap = $('<div class="bar"><s><b></b></s></div>');
		// 	 	break;
		// 	 	case 1 :
		// 	 		proWrap = $('<div class="circle criba"><s>0%</s></div>');
		// 	 	break;
		// 	 }

		// 	processer.append(proWrap);
		// 	$(this._wrap).append(processer);

		// 	this._process = processer;
		// 	this._proLine = proWrap.find('s');
		// 	this._proWrap = proWrap;
		// },
		initPro : function(type, type1){
			var processer = $('<div class="app-loader "></div>'),
			    proLine = null,
			    proWrap = null,
			    logoType = null,
			    bgColor = null,
			    pImg = null;
			 switch(type){
			 	case 0 :
			 		proWrap = $('<div class="bar "><s><b></b></s></div>');
			 	break;

			 	case 1 :
			 		if(type1==1){
			 			logoType = 'criyd';
			 			bgColor = 'app-loaderyd';
			 		}else if(type1==2){
			 			logoType = 'criba';
			 			bgColor = 'app-loaderba';
			 		}else if(type1==3){
			 			logoType = 'crisg';
			 			bgColor = 'app-loadersg';
			 		}else if(type1==4){
			 			logoType = 'criwz';
			 			bgColor = 'app-loaderwz';
			 		}else if(type1==5){
			 			logoType = 'crigp';
			 			bgColor = 'app-loadergp';
			 		};
			 		proWrap = $('<div class="circle"><s>0%</s></div>');
			 		pImg=$('<i class="bgImg"></i>')
			 		pImg.addClass(logoType);
			 		proWrap.append(pImg);
			 		processer.addClass(bgColor);
			 	break;
			 }
			processer.append(proWrap);
			$(this._wrap).append(processer);

			this._process = processer;
			this._proLine = proWrap.find('s');
			this._proWrap = proWrap;
		},
		progress : function(onComplete) {
			var val = 0,
			    _this = this,
					timer = null;

			setTimeout(function(){
					timer =	setInterval(function(){
											if(val <= 100){
												switch(_this._type){
													case 0:
													_this._proLine.css({
														width : val + '%'
													});
													break;
													case 1:
													_this._proLine.html(val + '%');
													break;
												}
												val += 4;
											}else{
												_this.complete(onComplete);
												clearInterval(timer);
												return;
											}
						},80);

			}, 1000);

		},
		complete : function(onComplete) {
			var _this = this;

			var sX = $(Lib.ele.container).width()/320,
					sY = $(Lib.ele.container).height()/505;
			$(Lib.ele.content).css({
				transform : 'scale(' + sX  + ',' + sY	+ ')'
			});
			this._process.fadeOut(500, function() {
				if(Lib.isFunction(onComplete)){
					onComplete();
				}
				_this._process.remove();
			});
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

	SendForm = function(type){

		  this._type = type;
			this._sendBtn = $('#btn');
			this._formEle = {
				username : $('#name'),
				userTel : $('#tel'),
				userEmail : $('#email'),
				order_date : $('#date')
			};
			this._reg = {
				name : Lib.val.regex.uname,
				mobile : Lib.val.regex.phone.mobile,
				tel : Lib.val.regex.phone.tel,
				email : Lib.val.regex.email
			}

	}
  SendForm.prototype = {
		initial : function(){
			this.sendInfo(this._type);
		},
		sendInfo : function(type){
				var url = this.getApiLink(type),
					  _this = this;
			this._sendBtn.on('click',function(){
					var formData = _this.getFormData();

					if(formData){
							$.ajax({
								url : url,
								type : 'POST',
								data : {
									name : formData.name,
									tel : formData.tel,
									app_name : formData.app_name,
									email : formData.email,
									order_time : formData.order_time,
									source : formData.source
								},
								dataType : 'jsonp',
								success : function(data){
								//  console.log(data);
								 _this.setMsg(data);
								}
							});
					 }
			});
		},
		getApiLink : function(type){
			var url = '';
			switch (type) {
			  case '1': //远东
					url = 'http://www.woman91.com/plus/wxjk/weizazhijiekouname.php';
					break;

				case '2'://博爱
					url = 'http://www.boai.com/plus/wxjk/weizazhijiekouname.php';
					break;

				case '3'://曙光
					url = 'http://www.sg91.net/plus/wxjk/weizazhijiekou.php';
					break;
				case '4'://五洲
					url =  'http://www.wz16.net/plus/wxjk/weizazhijiekouname.php';
					break;

				case '5'://集团
					url = 'http://www.woman91.com/plus/wxjk/weizazhijiekouname.php';
					break;

				default:
				  url = 'http://www.woman91.com/plus/wxjk/weizazhijiekouname.php';
			}

			return url;
		},
		getFormData : function(){
			var formEle = this._formEle,
			    formData = {
						name : '',   //用户名 *
						tel : '',    //用户电话 *
						email : '',  //用户邮箱
						app_name : '',  //杂志名称
						order_time : '', //预约时间
						source : ''      //科室
					};

			formData.app_name = document.title;

			for(var key in formEle){
				var ele = formEle[key],
						reg_name = this._reg.name,
						reg_mobile = this._reg.mobile,
						reg_tel = this._reg.tel,
						reg_email = this._reg.email;

				switch (ele.attr('id')) {
					case 'name':
						if(!ele.val().match(reg_name)){
							alert('请正确填写您的姓名！');
							return false;
						}else{
							formData.name = ele.val();
						}
						break;

					case 'tel' :
						console.log(ele.val());
						if(!ele.val().match(reg_mobile) && !ele.val().match(reg_tel)){
							alert('请正确填写您的手机号/电话！');
							return false;
						}else {
							formData.tel = ele.val();
						}
					  break;

					case 'email' :
					  if(!ele.val().match(reg_email)){
							alert('请正确填写您的邮箱！');
							return false;
						}else{
							formData.email = ele.val();
						}
					}
			}

			return formData;
		},
		setMsg : function(data){
			  console.log(data.msg);
				switch (parseInt(data.status)) {
				 case 1 :
					 alert('提交成功，我们的客服人员将与您联系！');
					 break;

				 case 2 :
					alert('您已经提交成功，不需要重复提交！');
					break;

				 case -1 :
				 alert('出错了，请稍后再试！');
				 break;
				}
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

						wx.error(function(res){
							
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
			this._wrap = param.wrap ? param.wrap : Lib.ele.container,
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

	return {
		version : '2.0.0',
		Application : Application,
		SwipeGuider : SwipeGuider,
		MusicPlayer : MusicPlayer
	};
})();
