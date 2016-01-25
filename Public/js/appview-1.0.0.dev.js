

var ReadApp = function(type, content, shareImg, music_url, mode) {
	this.app_con = $(decodeURI(content).split('|')),
	this._cfg = {
		component : {
			music : {
				src : music_url,
				wrap : true,
				enable : true,
				loop : true
			}
		},
		module : {
			loader : {
				process : {}
			},
			swiper : {
				swiper : {
					effect : 'translate',
					time : 400
				},
				pagination : {
					enable : true
				},
				guider : {
					text : null,
					bottom : 15
				}
			},
			wechat : {
				share : {
					img : shareImg
				}
			},
			type : type
		},
		handler : {},
		other : {}
	};

	this.initialize(function(){
		Lib.dom();
	});
};
ReadApp.prototype = {
	initialize : function(callback) {

		var pageCon = $(Lib.ele.content);

		for(var i = 0; i < this.app_con.length; i++){
			pageCon.append($(this.app_con)[i]);
		}

		pageCon.find('.page').each(function(i, ele){
			$(ele).find('.anim').each(function(){
				$(this).removeClass($(this).data('anim'));
				$(this).css({
					animationDelay : 0 + 's'
				});
			});
		});

		if (Lib.isFunction(callback)) callback();

		this.getHandler(this._cfg);
	},
	getHandler : function(cfg) {
		var component = {},
				timer = [],
				_this = this;

		cfg.handler.onAppInit =  function() {
			component.music = new APP.MusicPlayer(_this._cfg.component.music);

			return component;
		}

		cfg.handler.onAppLoad = function(){
			$(Lib.ele.page.first).find('.anim').each(function(){
				var type = $(this).data('anim'),
							delay = $(this).data('delay'),
							_this = $(this),
							atom = null;

					atom = setTimeout(function(){
									_this.addClass(type);
								}, delay*1000);
					timer.push(atom);
			});
		}

		cfg.handler.onTransformEnd = function() {
			for(var i = 0; i <timer.length; i++ ){
					clearTimeout(timer[i]);
			}
			$(Lib.ele.page.now).find('.anim').each(function(i, ele){
				var type = $(ele).data('anim');
				$(ele).removeClass(type);
			});

			$(Lib.ele.page.next).find('.anim').each(function(){
				var type = $(this).data('anim'),
							delay = $(this).data('delay') ? $(this).data('delay') : 0,
							_this = $(this),
							atom = null;

					atom = setTimeout(function(){
									_this.addClass(type);
								}, delay*1000);
					timer.push(atom);
			});

		}

		cfg.handler.onSwipeStart = function(){
			if(component.music._bout == 0){
				component.music.toggle();
			}
		}

		this.createApp(cfg);
	},
	createApp : function(cfg) {
		var App = new APP.Application(cfg.module, cfg.handler);
	}
}
