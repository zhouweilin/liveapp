var Maker = (function() {

	var _URL_ = 'http://liveapp2015.hithinktank.com/',
		CreateMag,        //class1
		CreatePage,       //class2 增加杂志页面
		AddEle,           //class3 增加新页面元素
		Config,           //class4 配置属性
		SavePreview,      //class5 保存和预览
		Init,             //class6 在杂志预览页面执行 （通过iframe预览）
		List,   		  //class7 在杂志首页执行（列出所有杂志）
		Controller,       //object8 ( -ResizeEle[:class], -AddAnim[:calss], -ReConfig[:class])
		Component,        //object9 ( -Layer[:class], -Form[:class], -ImgAndBg[:class],  -Uploader[:class])
		Kit;              //工具集（用来扩展Lib）


		Kit = {

			fn : {
				easyTab : function(opts, blocks, style, callback){
            "use strict";
						$.each(opts, (i, ele) => {
							$(ele).on('click', function(){
								$(this).addClass(style).siblings().removeClass(style);
								blocks.eq(i).css('display','block').siblings().css('display', 'none');
								if($.isFunction(callback)){
									callback(blocks.eq(i));
								}
							});
						});
				}
			},
			cfg : {
				img_classes : {
					'scenery'  : '风景',
					'festival' : '节日'
				},
				bg_classes : {
					'scenery'  : '风景',
					'festival' : '节日'
				},
				music_classes : {
					'exciting' : '兴奋',
					'popular' : '流行',
					'warm' : '温暖'
				},
				images_data : null,
				pageBg_data : null,
				music_data : null
			},

			ele : {
				txt : {
					tBgColor : $('.textBgColor'),
					tBgColor_show : $('.textBgColor').next('input')
				},
				imgAnim :{
					type :$('.img-config .conf-anim-type'),
					duration : $('.img-config .duration'),
					delay : $('.img-config .delay')
				},
				textAnim : {
					type : $('.ele-config .conf-anim-type'),
					duration : $('.ele-config .duration'),
					delay : $('.ele-config .delay')
				},

				slider : {
					textSlider : $('.ele-config .conf-slider'),
					imgSlider : $('.img-config .conf-slider')
				}
			},

			value : {
				prev_w : 320
			}
		};


 	/**
	 ++++++++++++++++++++++++++++++
 	 * class1 微杂志页面编辑页
 	 * CreateMag : class
 	 *
 	 ++++++++++++++++++++++++++++++
	 */
 	CreateMag = function(appid){
 		this._appid = appid;
 		this.infoConf = $('.mag-info-config').get(0);
 		this.groupIn = this.infoConf.querySelector('select[data-info=group]');
 		this.authorIn = this.infoConf.querySelector('input[data-info=author]');
 		this.bgBox = $(Lib.elecol.pageConf).find('.img-box');//更换主题背景
		this._magMusic = $('.mag-music audio');
		this._magMusicName = $('.mag-music').next();

 		this.createPage = new CreatePage();
 	};
 	CreateMag.prototype = {
 	 	initial : function(){
 	 		var _this = this;

 	 		this.createPage.initial(function(){
 	 			_this.createData();
 	 		});

			new Component.ImgAndBg();

			this.ctrlMusic();
			this.getList('images');
			this.getList('pageBg');
			this.getList('music');
 	 		this.saveMag();
 	 	},
 	 	createData : function(){
 	 		if(!this._appid){
 	 			localStorage.clear();

 	 			this._appid = Lib.makeAppid();
 	 			this.infoConfig();
 	 			localStorage.setItem('app-id', this._appid);
 	 		}else{
 	 			this.getMagData(this._appid);
 	 		}
 	 	},
 	 	addOptions : function(ele){
 	 		$.ajax({
 	 			url : _URL_,
 	 			type : 'POST',
 	 			dataType : 'json',
 	 			data : {
 	 				a : 'company'
 	 			},
 	 			success : function(data) {
 	 				for (var key in data) {
 	 					ele.options.add(new Option(data[key].name, data[key].id));
 	 				}
 	 				value = ele.value;

					//根据医院编号，选择select的默认显示值
					if(localStorage.type){
						$(ele).find('option').each(function(){
								if($(this).val() == localStorage.type){
									$(this).attr('selected','selected');
								}
						});
					}
 	 			}
 	 		});
 	 	},


 	 	//请求本杂志的数据
 	 	getMagData : function(appid, callback){
 	 		var _this = this;

 	 		localStorage.clear();

 	 		(function(){
 	 			$.ajax({
 	 				url : _URL_,
 	 				dataType : 'json',
 	 				type : 'POST',
 	 				data : {
 	 					a : 'getinfo',
 	 					appid : appid
 	 				},
 	 				success : function(data){

 	 					_this.insertPages(data);
						Lib.elecol.eleIndex = data.ele_index;
 	 				}
 	 			});

 	 		}());
 	 	},
		setInfo : function(){
			  //如果不是新建杂志，则获取并显示杂志作者
				if(localStorage.author){
					this.authorIn.value = localStorage.author;
				}

				//获取音乐并显示
				if(localStorage.url){
					this._magMusic.attr('src', localStorage.url);
					this._magMusicName.html(localStorage.music_name);
				}
		},

 	 	//从localStorage里边获取page
 	 	insertPages : function(data){

 	 		//把数据写入本地存储
			for(var key in data){
				localStorage[key] = data[key];
			}

 	 		var pages = decodeURI(localStorage['app_con']).split('|');

			this.setInfo();

 	 		for(var i = 0; i < pages.length; i++){
 	 			var  newLi = $('<li draggable="true"></li>'),
 		       	 newPageWrap = $('<div class="page-wrap"></div>'),
 		       	 newPage = $(pages[i]),
 		       	 pageEdit = $('<div class="page-edit">' +
						 '<i class="page-index">' + (i + 1) + '</i>' +
						 '<i class="page-del" title="删除该页"><b class="icon iconfont">&#xe639;</b><strong class="strongD">删除该页</strong></i>' +
						 '<i class="page-copy" title="复制该页"><b class="icon iconfont">&#xe693;</b><strong class="strongD">复制该页</strong></i>' +
						 '</div>');
		        newPageWrap.append(newPage);
		        newLi.append(newPageWrap);
		        newLi.append(pageEdit);

 		        if(i === 0){
 		        	var reg1 = /\([^\)]+\)/g,
 		       		 	reg2 = /[\(|\)]/g,
 		       		 	src = '',
 		       			img = $('<img src="" />');

 		        	newLi.addClass('cur');
 		        	$(Lib.elecol.pageList).find('li').replaceWith(newLi);

							newPage.find('.anim').each(function(){
								$(this).removeClass($(this).data('anim'));
							});
 		        	$(Lib.elecol.preview).find('.page').replaceWith(newPage.clone(true));
 		        	Lib.elecol.corrEle = Lib.elecol.listPage = $(Lib.elecol.pageList).find('.page').eq(0);
 		        	Lib.elecol.activeEle = Lib.elecol.viewPage = $(Lib.elecol.preview).find('.page');
							Lib.elecol.viewPage.find('.anim').each(function(){
								var _this = $(this),
										delay = $(this).data('delay') ? $(this).data('delay') : 0;

								setTimeout(function(){
									_this.addClass(_this.data('anim'));
								}, delay*1000);
							});

							if(newPage.css('backgroundImage') !== 'none'){
								src = newPage.css('backgroundImage').match(reg1).toString().replace(reg2, "");
							}
 		        	img.attr('src', src);
 		        	this.bgBox.append(img);
 		        }else{
 		        	$(Lib.elecol.pageList).append(newLi);
 		        }
 	 		}

			this.infoConfig();

 	 		this.createPage.addEle.pageBg();
 	 	},
		infoConfig : function(){
			this.addOptions(this.groupIn);
		},
		empty : function (inputs) {
			for(var i = 0; i < inputs.length; i++){
					 if(!inputs[i].value){
						 alert(inputs[i].dataset.notice);
						 return false;
 					 }
			}
			return true;
		},

		//音乐播放控制
		ctrlMusic :function(){
			var magM = $('.mag-music'),
			    audio = this._magMusic.get(0);
			magM.on('click', function(){
				if(!audio.paused){
					audio.pause();
					$(this).css('backgroundPosition', '0 -33px');
				}else{
					audio.play();
					$(this).css('backgroundPosition', '0 -68px');
				}
			});

			this._magMusic.on('ended', function(){
				magM.css('backgroundPosition', '0 0');
			});
		},

		//获取背景和音乐列表
		getList : function(type){
			$.ajax({
				url : _URL_ + '?c=show&a=getImgs',
				type : 'post',
				data : {
					type : type
				},
				dataType : 'json',
				success : function(data){
					Kit.cfg[type + '_data'] = data;
				}
			});
		},
		saveMag : function(){
			var saveBtn = $('.saveMag'),
				_this = this;

			saveBtn.on('click',function(){
				var group = _this.groupIn.value,
					author = _this.authorIn.value,
					preview = new SavePreview(),
					app_con = encodeURI(preview.getAllPages().join('|')),
					_appid = _this._appid,
					shareImg = localStorage.share_img ? localStorage.share_img : _this.defCover(parseInt(group)),
					page = preview.getAllPages().length,
					eleIndex = Lib.elecol.eleIndex,
					title = localStorage.title ? localStorage.title : Lib.elecol.defTitle,
					des = localStorage.des ? localStorage.des : Lib.elecol.defDes,
					music_url = _this._magMusic.attr('src'),
					music_name = _this._magMusicName.html();

					var empty = _this.empty([_this.groupIn, _this.authorIn]);

					if(!empty){
						return;
					}

					$.ajax({
						url : _URL_,
						type : 'POST',
						dataType : 'json',
						data : {
							a : 'liveinto',
							type : group,
							title :title,
							des : des,
							app_con : app_con,
							appid : _appid,
							shareimg : shareImg,
							page : page,
							ele_index : eleIndex,
							author : author,
							music_url : music_url,
							music_name : music_name
						},
						success : function(data){
							if(data.status === 1){
								alert('保存成功！');
							}else if(data.status === -2){
								alert('数据未变动，无需重复保存！');
							}
						}
					});
			});

		},
		defCover : function(group){
			var url = '';
			switch(group){
				case 1:
					url = '/Public/images/dcover/yd.png';
				break;

				case 2:
					url = '/Public/images/dcover/ba.png';
				break;

				case 3:
					url = '/Public/images/dcover/sg.png';
				break;

				case 4:
					url = '/Public/images/dcover/wz.png';
				break;

				default :
					url = '/Public/images/dcover/gp.png';
				break;
			}

			return url;
		}
 	 };

 	/**
	 ++++++++++++++++++++++++++++++
	 * calss2
 	 * + createPage[:class](AddEle) 添加新的微杂志页面
 	 *  -addPage[:fn]* 核心方法，新加页面
 	 *  -switchPage[:fn]* 核心方法，切换页面
 	 *
 	 ++++++++++++++++++++++++++++++
	*/
 	CreatePage = function(){

 		//实现单例
 		if(CreatePage.unique !== undefined){
 			return CreatePage.unique;
 		}

 		CreatePage.unique = this;

 		this.addBtn = document.querySelector('#add');
 		this.pageIndex = 1;
 		this.preview = $(Lib.elecol.preview);
 		this.pageList = $(Lib.elecol.pageList);
 		this.bgBox = $(Lib.elecol.pageConf).find('.img-box');
 	};

 	CreatePage.prototype = {
 		initial : function(handler){

 			this.addEle = new AddEle();
 			var _this = this;

 		    //页面初始时，创建第一页
 		    var $li0 = $(Lib.elecol.pageList).find('li'),
 		        //page0 = document.createElement('div'),
 		        $firstPage = $('<div class="page curPage" data-id="page1" ></div>'),
 		        pageEdit = $('<div class="page-edit">' +
 		        				'<i class="page-index">' + this.pageIndex + '</i>' +
				 		        '<i class="page-del" title="删除该页">' +
				 		        	'<b class="icon iconfont">&#xe639;</b>' +
				 		       		'<strong class="strongD">删除该页</strong>' +
				 		        '</i>' +
				 		        '<i class="page-copy" title="复制该页">' +
				 		        	'<b class="icon iconfont">&#xe693;</b>' +
				 		        	'<strong class="strongD">复制该页</strong>' +
				 		        '</i>' +
 		       				'</div>');

 		    //设置当前的
 		    $li0.addClass('cur');
 		    $li0.find('.page-wrap').append($firstPage);
 		    $li0.append(pageEdit);
 		    $(Lib.elecol.preview).append($firstPage.clone(true));

 		    if(Lib.isFunction(handler)){
 		    	handler.call(this);
 		    }

 		    //更新当前编辑页面对象
 		   	this.renewCurPage();

 		    Lib.bind(this.addBtn, 'click', function(){
 		    	_this.addPage(_this);
 		    });

 		    //切换页面
 			Lib.bind(Lib.elecol.pageList, 'click',function(e){
				var tar = $(e.target);
 				_this.switchPage.call(_this, e);
 				_this.delPage.call(_this, e);

				if(tar.hasClass('page-copy')){
				    _this.copyPage.call(_this, tar);
				};
				_this.switchBg();
 			});

 			//初始化元素创建类
 			this.addEle.initialize();

 			//执行拖曳函数
 			this.dragPage();
 		},

 		switchBg:function(){

 			var imgEle = this.bgBox.find('img'),
 			    bgImage=$('.page-config .card .img-uploader .img-box');//xintianjia

 				if(imgEle && imgEle.length!==0){
 					return;
 		    }else{
 		    	bgImage.css({'backgroundImage':'none'})
 		    };
 		},

 		//点击增页按钮，新建一页
 		addPage : function(object){

 		    Lib.elecol.pageList.querySelector('.cur').classList.remove('cur');
 		    object.pageIndex = Lib.elecol.pageList.querySelectorAll('li').length;

 		    //移除样式名curPage
 		    $('.curPage').removeClass('curPage');

 		    //创建新页
 		    var newLi = $('<li draggable="true" class="cur"></li>'),
 		        newPageWrap = $('<div class="page-wrap"></div>'),
 		        newPage = $('<div class="page curPage" data-id="page'+ (object.pageIndex + 1) + '"></div>'),
 		        pageEdit = $('<div class="page-edit">' +
						'<i class="page-index">' + (object.pageIndex + 1) + '</i>' +
						'<i class="page-del" title="删除该页"><b class="icon iconfont" style="z-Index:-3;">&#xe639;</b><strong class="strongD">删除该页</strong></i>' +
						'<i class="page-copy" title="复制该页"><b class="icon iconfont">&#xe693;</b><strong class="strongD">复制该页</strong></i>' +
						'</div>'),
 		        imgEle = object.bgBox.find('img');

 		   if(imgEle){
 		   		imgEle.remove();
 		   }
 		    newPageWrap.append(newPage);
 		    newLi.append(newPageWrap);
 		    newLi.append(pageEdit);

 		    $(Lib.elecol.pageList).append(newLi);

 		    //用新page替换掉预览界面中的page
 			$(Lib.elecol.preview).find('.page').replaceWith(newPage.clone(true));
 			$(Lib.elecol.preview).find('.page').addClass('curTar');
 		   	object.renewCurPage();
 		   	object.pageIndex ++;
 		},
 		renewCurPage : function(listPage, viewPage){
 			Lib.elecol.listPage = listPage ? listPage : document.querySelector('.page-wrap .curPage');
 		  Lib.elecol.viewPage = viewPage ? viewPage : document.querySelector('.maker-preview .curPage');
 		},

 		//pageList中进行编辑页面切换
 		switchPage : function(e){
 		    var curPage = null,
 		        aCur = $('.curPage'),
 		        wrap = $(Lib.elecol.configWrap),
 		        pageConfig = wrap.find('.page-config'),
 		        imgEle = this.bgBox.find('img'),
 		        src = '',
				tar = Lib.get.getTar($(e.target), 'page');


 		    if(tar && tar.length !== 0 ){
				curPage = tar;
 		    }else{
 		    	return;
 		    }

 		    aCur.removeClass('curPage');
 		    $(Lib.elecol.pageList).find('.cur').removeClass('cur');
 		    if(!pageConfig.hasClass('active')){
 		    	pageConfig.addClass('active').siblings().removeClass('active');
 		    }
 		    curPage.addClass('curPage').parents('li').addClass('cur');





			this.setActivePage(curPage);
 		  	Lib.fn.setSrc('bg', this.bgBox, curPage);
 		  	// Lib.fn.setSrc('bg', this.bgBox2, curPage);

 		  	this.renewCurPage();
 		},
		setActivePage : function(curPage){
			var activePage = null;
			curPage.find('.anim').each(function(i, ele){
				var anim = ele.dataset.anim;
				$(ele).removeClass(anim);
			});

			$(Lib.elecol.preview).find('.page').replaceWith(curPage.clone(true));
			activePage = $(Lib.elecol.preview).find('.page');

			activePage.find('.anim').each(function(i, ele){
				var dataset = ele.dataset,
					delay = dataset.delay ? dataset.delay : 0;

				setTimeout(function(){
					$(ele).addClass(dataset.anim);
				}, delay*1000);
			});

			activePage.addClass('curTar');
		},

 		//删除页面
 		delPage : function(e){
 			var eTar = $(e.target),
 				Lis = this.pageList.find('li');

			if(eTar.hasClass('page-del')){
				var parentLi = eTar.parents('li');
				if(confirm('确认删除？')){
					this.reSortPage(parentLi, Lis, 'del');
					parentLi.remove();
				}
			}
 		},
		copyPage : function(tar){
			var copyed = tar.parents('li'),
					Lis = this.pageList.find('li');

			 if(confirm('确认复制？')){
				 this.reSortPage(copyed, Lis, 'copy');
			 };
		},
 		reSortPage : function(remli, lis, operate){
	 			var isLast = (lis.length == (remli.index() + 1)),
	 				index = remli.index(),
	 				isCur = remli.hasClass('cur'),
	 				prevLi = remli.prev(),
	 				nextLi = remli.next()
					pageConfig = $(Lib.elecol.configWrap).find('.page-config');
				switch (operate) {
					case 'del':
							if(!isLast){
								this.reSetCurPage(isCur, nextLi);
								lis.each(function(){
									var num = $(this).index();
									if(num > index){
										var page = $(this).find('.page').get(0),
											txtIndex = $(this).find('.page-index');
										page.dataset.id = 'page' + num;
										txtIndex.text(num);
									}
								});
							}else{
								this.reSetCurPage(isCur, prevLi);
							}
					break;
					case 'copy':
							this.enClone(remli, isCur, index);

						  lis.each(function(i, li){
								if(i > index){
									$(li).find('.page').get(0).dataset.id = 'page' + (i + 2);
									$(li).find('.page-index').html(i + 2);
								}
							});
					break;
			  }

				if(!pageConfig.hasClass('active')){
 		    	pageConfig.addClass('active').siblings().removeClass('active');
 		    }

				this.renewCurPage();
 		},
	    enClone : function(remli, isCur, index){
			var clone = remli.clone(true);
			clone.find('.page').get(0).dataset.id = 'page' + (index + 2);
			clone.find('.page-index').html(index + 2);

			if(isCur){
				remli.removeClass('cur').find('.page').removeClass('curPage');
			}else{
				remli.siblings('li.cur').removeClass('cur').find('.page')
				.removeClass('curPage');
				clone.addClass('cur').find('.page').addClass('curPage');
			}
			clone.insertAfter(remli);
			this.setActivePage(clone);
		},
 		reSetCurPage : function(isCur, sibling){
 			if(isCur){
 				sibling.addClass('cur');
 				sibling.find('.page').addClass('curPage');

 				this.preview.find('.page').replaceWith(sibling.find('.page').clone(true));
 				this.renewCurPage(sibling.find('.page'), this.preview.find('.page'));
 			}
 		},

 		//拖曳改变页面顺序
 		dragPage : function(){
 			var list = this.pageList;

 			list.on('drag',function(e){
 			});

 			list.on('dragstart', function(e){
 				// console.log(e.target);
 			});

 			list.on('dragover', function(e){
 				// console.log(e.target)
 			});

 			list.on('dragenter', function(e){
 				// console.log(e.target);
 			});

 			list.on('dragleave', function(e){
 				// console.log(e.target);
 			});

 			list.on('drop', function(e){
 				// console.log('drop');
 			});

 			list.on('dragend', function(){
 				// console.log('end');
 			});

 		}
 	};

 	/**
	 ++++++++++++++++++++++++++++++
 	 *class3  添加新页面元素,内容输入及移动
 	 *
 	 *
	 ++++++++++++++++++++++++++++++
 	*/
 	AddEle = function(){

 		//实现单例
 		if( AddEle._unique !== undefined ){
 			return AddEle._unique;
 		}

 		AddEle._unique = this;

 		//通用属性
 		this.maker = $('#maker-newEle');
 		this._addText = $('#maker-newEle .new-text');
 		this._addImg = $('#maker-newEle .new-img');
 		this.bgBox = $(Lib.elecol.pageConf).find('.img-box');
 		this._imgWrap = $(Lib.elecol.imgConf).find('.img-box');
 		this._simuWrap = $(Lib.elecol.simuWrap);
 		this._delBtn = this._simuWrap.find('.maker-tools-del');
 		this._levelUp = this._simuWrap.find('.maker-tools-levelUp');
		this._levelDown = this._simuWrap.find('.maker-tools-levelDown');
		this._form  = new Component.Form();
		//this._imgAddBg= new Component.ImgAndBg();//hyltj
 	};

 	AddEle.prototype = {
 		initialize : function(){

 			this.newText();
 			this.moveEle();
 			this.textInput();
 		// 	this.newImg();
 			this.changeImg();
 			this.bindTool();

 			this.configer = new Config();//属性配置
 			this.configer.initial();

 			//定义元素大小实例对象（单例）
 			this.reSize = new Controller.ResizeEle();

 			//添加动画实例对象（单例）
 			this.addAnim = new Controller.AddAnim();

			//获取配置
			this.reConfig = new Controller.ReConfig();
 			this.addAnim.initial();
			this._form.initial();
			this.pageBg();//hyltj
 		},

 		//新建文本
 		newText : function(){
 			var tBtn = this._addText,
 				_this = this;
 			tBtn.click(function(){
 				$('.curTar').removeClass('curTar');
 				var pageId = $(Lib.elecol.viewPage).data('id'),

 			 //初始化元素并设置索引值
 			  newObj = $('<div class="curTar createdEle anim" data-id="ele' + Lib.elecol.eleIndex + '" data-anim="normal"><div class="text">请输入内容</div></div>');

 				_this.insertEle(newObj);

 				//更新当前操作元素对象
 				Lib.elecol.activeEle = newObj;
 				Lib.elecol.corrEle = $(Lib.elecol.pageList).find('.curTar');

 				_this.switchEdit('.ele-config');
 				$(Lib.elecol.confEle.inputer).html('请在此输入文本');

 				//显示元素的坐标
 				_this.showLoc(newObj);

 				Lib.elecol.eleIndex ++ ;
 			});
 		},
 		//把新建的元素插入当前编辑的page
 		insertEle : function(newobj){

 			var $listPage = $(Lib.elecol.listPage),
 				$viewPage = $(Lib.elecol.viewPage);

 			$viewPage.append(newobj);
			newobj.css('left', (Kit.value.prev_w - newobj.width())/2);
			newobj.css('top', (Kit.value.prev_w - newobj.height())/2);//hyltj
 			$listPage.append(newobj.clone(true));
 		},
 		bindTool : function(){
 			var _this = this;

 			this._delBtn.on('click',function(){
 				_this.configer.delEle.call(_this);
 			});

 			this._levelUp.on('click', function(){
 				_this.configer.changeLev.call(_this, 'up');
 			});

 			this._levelDown.on('click', function(){
 				_this.configer.changeLev.call(_this, 'down');
 			});
 		},
 		//根据当前目标切换编辑区域
 		switchEdit : function(configType){

 			var wrap = $(Lib.elecol.configWrap),
 				editer = wrap.find(configType);

 			if(!editer.hasClass('active')){
 				editer.addClass('active').siblings().removeClass('active');
 			}

 			return editer;
 		},
 		//内容输入与同步
 		textInput : function(){
 			var _input = $(Lib.elecol.confEle.inputer),
 				_curTar = null,
 				_corrTar = null,
 				_this = this;

 			_input.on('keydown',function(e){
 				e.stopPropagation();
 			});

 			_input.on('keyup',function(e){

 				var $this = $(this),
 					txt = $this.html(),
 					curEle = $(Lib.elecol.activeEle),
 					corrEle = $(Lib.elecol.corrEle);

 				if(!curEle.hasClass('page')){
 					_curTar = curEle.children('div');
 					_corrTar = corrEle.children('div');
 				}

 				txt = _this.replaceTxt(txt);

 				_curTar.html(txt);
 				_corrTar.html(txt);
 			});
 		},
 		replaceTxt : function(txt){
 			var reg = /div/g;
 			if(txt.match(reg)){
 				txt = txt.replace(reg, 'p');
 			}

 			return txt;
 		},
 		moveEle : function(){
 			var _this = this,
 				mEve = _this.mouseEve(),
 				keyEve  = _this.keyEvent();

			$(Lib.elecol.preview).on('click', function(e){
				if(e.target.nodeName === 'A'){
					e.preventDefault();
				}

			});
 			$(Lib.elecol.preview).on('mousedown', mEve.down);
 			$(document).on('keydown', keyEve.down);
 		},
 		//定位对象
 		mouseEve : function(){

 			var pos = {
	                startX: 0,
	                startY: 0,
	                moveX: 0,
	                moveY: 0,
	                dvalX: 0,
	                dvalY: 0
            	},
            	_this = this,
            	mEve = {
	                down: function (e) {
	                    var tarEle = null,
						    viewPage = $(Lib.elecol.viewPage);

							if(e.target.nodeName === 'INPUT'){
								e.preventDefault();
							}

	               	    viewPage.find('.resize-btn').remove();
	                    $('.curTar').removeClass('curTar');

	                   	tarEle = _this.getTarEle(e.target);
	                   	_this.switchFn(tarEle);
						_this.reConfig.initial(tarEle);

	                   	if(!$(Lib.elecol.activeEle).hasClass('page')){

	                   		_this.reSize.execute(Lib.elecol.activeEle);
	                   		Lib.elecol.tempAnim = tarEle.data('anim');

	                   		pos.startX = e.pageX - parseInt($(Lib.elecol.activeEle).css('left'));
	                   		pos.startY = e.pageY - parseInt($(Lib.elecol.activeEle).css('top'));
	                   	}

	                    $(document).on('mousemove',mEve.move);
	                    $(document).on('mouseup',mEve.up);
	                },
	                move: function (e) {
	                	e.preventDefault();
	                    pos.moveX = e.pageX;
	                    pos.moveY = e.pageY;
	                    pos.dvalX = pos.moveX - pos.startX;
	                    pos.dvalY = pos.moveY - pos.startY;

	                    if(!$(Lib.elecol.activeEle).hasClass('page')){
	                    	_this.setStyle({
	                    		top : pos.dvalY,
	                    		left : pos.dvalX
	                    	});
	                    	$(Lib.elecol.confEle.locX).val(pos.dvalX);
	                    	$(Lib.elecol.confEle.locY).val(pos.dvalY);
	                    }
	                },
	                up: function (e) {
	                	$(document).off('mousemove', mEve.move);
	                	$(document).off('moveup', mEve.up);
	                }
            	};
            	return mEve;
 		},
 		getTarEle : function(target){
 			var tarEle = null;

 			if((target.nodeName == 'P') && target.nodeType === 1  ){
 				tarEle = $(target).parents('.createdEle');

 			}else if($(target).hasClass('createdEle')){
 				tarEle = $(target);

 			}else if($(target).hasClass('createdImg') || (target.nodeName == 'IMG')){
 				if((target.nodeName == 'IMG')){
 					tarEle = $(target).parent();

 				}else if($(target).hasClass('createdImg')){
 					tarEle = $(target);
 				}
 			}else {
 				if($(target).hasClass('text')){
 					tarEle = $(target).parent();

 				}else if($(target).hasClass('page')){
 					tarEle = $(target);
 					tarEle.addClass('curTar');
 				}else if(target.nodeName === 'INPUT' || target.nodeName === 'A'){
					tarEle = $(target).parent();
				}
 			}

 			return tarEle;
 		},
 		switchFn : function(tarEle){
 			var $listEle = $(Lib.elecol.listPage).find('.createdEle'),
	        	$listImg = $(Lib.elecol.listPage).find('.createdImg'),
	        	url;

			if(tarEle.hasClass('createdEle')){

				//是文本元素，切换到文本编辑
				this.switchEdit('.ele-config');
				this.changeEle(this, tarEle, $listEle);

			}else if(tarEle.hasClass('page')){

				//是page元素，切换到页面编辑
	    		this.switchEdit('.page-config');
	    		this.renewCurEle(tarEle, $(Lib.elecol.listPage));

			}else if(tarEle.hasClass('createdImg')){
				url = tarEle.find('img').attr('src');

				//是图片，切换到图片编辑
				this.switchEdit('.img-config');
				this.switchImgSrc(this._imgWrap, url);
				this.changeEle(this, tarEle, $listImg);

				tarEle.css('height',tarEle.find('img').css('height'));
			}

 		},
 		setStyle : function(json){
 			var activeEle = $(Lib.elecol.activeEle),
	        	corrEle = $(Lib.elecol.corrEle);

		    activeEle.css(json);
		    corrEle.css(json);
 		},
 		showLoc : function(obj){
 			var locX  = $(Lib.elecol.confEle.locX),
 				locY = $(Lib.elecol.confEle.locY),
 				_obj = $(obj);

 			locX.val(parseInt(_obj.css('left')));
 			locY.val(parseInt(_obj.css('top')));

 			// var eLocX = $('.ele-config .locX'),
 			// 	eLocY = $('.ele-config .locY'),
 			// 	imgLocX = $('.img-config .locX'),
 			// 	imgLocY = $('.img-config .locY'),
 			// 	locX=null,
 			// 	locY=null,
 			// 	_obj = $(obj);

 			// if(obj.hasClass('createdImg').length!==0){
 			// 	locX=imgLocX;
				// locY=imgLocY;
				// console.log(locX+'locXText')
 			// }else if(obj.hasClass('createdEle').length!==0){
 			// 	locX=eLocX;
				// locY=eLocY;
				// console.log(locX+'locYImg')
 			// };

 		},
 		changeEle : function(object, tarEle, listEle){
 			var _inputer = $(Lib.elecol.confEle.inputer);
 			if(!tarEle.hasClass('curTar')){
        		tarEle.addClass('curTar');

        		listEle.each(function(){
    				if($(this).data('id') === tarEle.data('id')){
    					object.renewCurEle(tarEle, $(this));
    				}
        		});

        		if(tarEle.hasClass('createdEle')){
        			_inputer.html(tarEle.children('.text').html());
        		}
        	}
 		},
 		renewCurEle : function(tar,corr){
 			Lib.elecol.activeEle = tar;
 			Lib.elecol.corrEle = corr;
 		},
 		keyEvent : function(){
 			var curLoc = {
                left: 0,
                top: 0
	            },
	            _this = this,
	            keyEve = {
	                down: function (e) {
	                    e.stopPropagation();
	                    var activeEle = $(Lib.elecol.activeEle);
	                    curLoc.left = parseInt(activeEle.css('left'));
	                    curLoc.top = parseInt(activeEle.css('top'));

	                    switch (e.keyCode) {
	                        case 37 :
	                            curLoc.left = Math.ceil(curLoc.left) - 1;
	                            _this.setStyle({
	                            	left : curLoc.left
	                            });
	                            break;
	                        case 38 :
	                            curLoc.top = Math.ceil(curLoc.top) - 1;
	                            _this.setStyle({
	                            	top : curLoc.top
	                            });
	                            break;
	                        case 39 :
	                            curLoc.left = Math.floor(curLoc.left) + 1;
	                            _this.setStyle({
	                            	left : curLoc.left
	                            });
	                            break;
	                        case 40 :
	                            curLoc.top = Math.floor(curLoc.top) + 1;
	                            _this.setStyle({
	                            	top : curLoc.top
	                            });
	                            break;
	                        default :
	                        	return;
	                    }

	                    _this.showLoc($(Lib.elecol.activeEle));
	                }
	            };

           return keyEve;
 		},
 		//设置和更换页面背景
 		pageBg : function(){
 			var pageConf = $(Lib.elecol.pageConf),
 				box = pageConf.find('.img-box'),
 				date = new Date(),
 				data = {
 					appid : localStorage.appid,
 					sec : date.getSeconds()
 				},
 				fileBtn = pageConf.find('input[name=page]');//更换背景

				this.setBgColor();
 				this.changePageBg(fileBtn, box, data);
 		},
		//设置page的背景颜色
		setBgColor : function(){
			var colorIn = $('.bg-color').find('.pageColor'),//input[type=color]
				colorSh = $('.bg-color').find('input[type=text]'),
				box = $(Lib.elecol.pageConf).find('.img-box'),
				_this=this;

			this.configer.getColor(colorIn, colorSh, function(tmp){
				 var eles = [$(Lib.elecol.viewPage), $(Lib.elecol.listPage), box];

				 	$(eles).each(function(){
						$(this).css({
							backgroundColor : tmp
						});
					});

			});
		},

 		//上传背景
 		changePageBg : function(fileBtn, box, data){
 			var name = fileBtn.attr('name'),
 				figure = box.get(0),
 				_this =this;

 			fileBtn.on('change', function(){
 				var file = this.files[0],
 					activePage = $(Lib.elecol.viewPage) || Lib.elecol.activeEle,
 					corrPage = $(Lib.elecol.listPage) || Lib.elecol.corrEle;
 				//var appid = localStorage.appid;
				if (file) {
					var fileType = file.type;

					if (fileType == 'image/png' || fileType == 'image/jpeg') {
						var imgForm = new FormData(),
							xhr = new XMLHttpRequest();

						imgForm.append(name, file);

						xhr.addEventListener('loadstart', function(evt) {
							     Lib.upload.start(evt, figure, 'img');

						}, false);

						xhr.upload.addEventListener('progress', function(evt) {
							Lib.upload.progress(evt, figure);
						}, false);

						xhr.addEventListener('load', function(evt) {
							var url = Lib.upload.complete(evt, figure, 'img');

							activePage.css('backgroundImage', 'url('+ url +')');
							corrPage.css('backgroundImage', 'url(' + url + ')');
						

						}, false);

						xhr.addEventListener('error', Lib.upload.failed, false);
						xhr.addEventListener('abort', Lib.upload.canceled, false);

						Lib.upload.change({
							url : _URL_ + '?a=upfile&app='+ data.appid +'&dir='+ name +'&index='+ data.sec,
							form : imgForm,
							xhr : xhr
						});

					} else {
						alert('不支持的文件类型，请重新选择！');
					}
				}
 			});
 		},

		//上传图片
		uploadImg :function(fileBtn, box, callback){
			var name = fileBtn.attr('name'),
 				  figure = box.get(0),
 				 _this = this;

 			fileBtn.on('change', function(){
 				var file = this.files[0],
 					activePage = $(Lib.elecol.viewPage) || Lib.elecol.activeEle,
 					corrPage = $(Lib.elecol.listPage) || Lib.elecol.corrEle,
 					appid = localStorage.appid;

				if (file) {
					var fileType = file.type;

					if (fileType == 'image/png' || fileType == 'image/jpeg') {
						var imgForm = new FormData(),
							xhr = new XMLHttpRequest();

						imgForm.append(name, file);
						xhr.addEventListener('loadstart', function(evt) {
							Lib.upload.start(evt, figure, 'img');
						}, false);

						xhr.upload.addEventListener('progress', function(evt) {
							Lib.upload.progress(evt, figure);
						}, false);

						xhr.addEventListener('load', function(evt) {
							var url = Lib.upload.complete(evt, figure, 'img');

							if(Lib.isFunction(callback)){
								callback.call(_this, activePage, corrPage, url);
							}
						}, false);

						xhr.addEventListener('error', Lib.upload.failed, false);
						xhr.addEventListener('abort', Lib.upload.canceled, false);

						Lib.upload.change({
							url : _URL_ + '?a=upfile&app='+ appid +'&dir='+ name,
							form : imgForm,
							xhr : xhr
						});

					} else {
						alert('不支持的文件类型，请重新选择！');
					}
				}
 			});
		},

		//当前对象是img时，更换右边编辑器图片为当前图片
		switchImgSrc : function(wrap, url){

			var img  = wrap.find('img');

			if(img.length === 0){
				img = $('<img src="">');
				img.attr('src', url);
				wrap.append(img);
			}else{
				img.attr('src', url);
			}
		},

		//更换当前图片对象图片
		changeImg : function(){

			var fileBtn  = $(Lib.elecol.imgConf).find('input[name=img]');

			this.uploadImg(fileBtn, this._imgWrap, function(activePage, corrPage, url){
				var activeEle = Lib.elecol.activeEle,
					corrEle = Lib.elecol.corrEle;

				activeEle.find('img').attr('src', url);
				corrEle.find('img').attr('src', url);
			});
		}
 	};



/**
 ++++++++++++++++++++++++++++++++++
 *class4
 * Config[:class](SliderController) 属性配置
 *  -initial[:fn]*  核心，初始化函数
 ++++++++++++++++++++++++++++++++++
 */

	Config = function(){

		//实现单例
		if(Config.unique !== undefined){
			return Config.unique;
		}
		Config.unique = this;
	};

	Config.prototype={
		initial : function(){

			this.conSwitch();
			this.composing();
			this.cfg_fontStyle();
			this.setBorder();
			// this.setBorder2();
			this.setColor();

			this.slider = new SliderController();//透明、圆角等调整
			this.slider.initial();
		},
		conSwitch : function(){
			var  opts = document.querySelectorAll('.maker-config-wrap .ele-config .opts span'),
				 tabs = document.querySelectorAll('.maker-config-wrap .ele-config .tabs .card');

			this.tabSwitch(opts, tabs, 'active');
		},
		tabSwitch : function(opts, tabs, cname){//文本与动画切换
			var $opts  = $(opts),
				$tabs = $(tabs);
			$opts.click(function(){
				$(this).addClass(cname).siblings().removeClass(cname);
				$tabs.eq($(this).index()).addClass(cname).siblings().removeClass(cname);

			});
		},
		composing : function(){//文字对齐方式
			var align = $(Lib.elecol.confEle.align),
				btns = align.find('span'),
				_this = this;
			btns.each(function(){
				$(this).on('click',function(){
					var alignType = $(this).data('align');

					$(this).addClass('selected').siblings().removeClass('selected');
					_this.setStyle({
						textAlign : alignType
					});
				});
			});
		},

		//给当前编辑对象设置json中的样式
		setStyle : function(json){
			if(!$(Lib.elecol.activeEle).hasClass('page')){
				var activeEle = $(Lib.elecol.activeEle),
				  	corrEle = $(Lib.elecol.corrEle);

				if(activeEle.has('input').length === 0){//不包含input的情况
					if(activeEle.has('a').length === 0){//1.不包含a
						if(activeEle.has('img').length === 0){//2.不包含img
							activeEle.css(json);
							corrEle.css(json);
						}else{
							activeEle.children('img').css(json);
							corrEle.children('img').css(json);
						}
					}else{
						//如果包含a标签，则给a标签添加样式
						activeEle.children('a').css(json);
						corrEle.children('a').css(json);
					}
				}else{
					//如果包含input标签，则给input标签添加样式
					activeEle.children('input').css(json);
					corrEle.children('input').css(json);
				}
			}
		},
		//调用设置字体大小和字体样式的函数
		cfg_fontStyle : function(){

			var fStyle = $(Lib.elecol.confEle.fontStyle),
			  	btns  = fStyle.find('span'),
				  input = $(document.querySelector('.fontSize')),
				  lineIn = $('.lineHeight'),
				  _this = this;

			btns.on('click',function(){
				var $this = $(this),
					style = $this.data('style');
				if($this.hasClass('selected') ){
					$this.removeClass('selected');
					_this.unSetFont(style);
				}else{

					$this.addClass('selected');
					_this.setFont(style);
				}
			});

			this.setSize(input);
		},

		//设置字体大小
		setSize : function(input){
			var kEve = this.keyEvent({
					kUp : function(val){

						val = this.getNum(val, {
								min : 12,
								max : 64
							});

						this.setStyle({
							fontSize : val,
							lineHeight : val + 4 + 'px'
						});
					}
				}, input);

			input.on('keydown', kEve.down);
		},

		/**
		 * getNum : 把input中输入的字符串转换成数值，并返回
		 *
		 * @val[string/number]* input输入的值，作为参数传进来
		 * @json[json]
		 *	-min[number]* val最小值[default:0]
		 * 	-max[number]* val的最大值[default:100]
		 * @callback(val)[function] 回调函数,用于自定义val的值，并返回给当前函数
		 *
		 */
		getNum : function(val, json, callback){
			var min  = Lib.isNumber(json.min) ? json.min : 0,
				max = Lib.isNumber(json.max) ? json.max : 100,
				_this = this;
			val = parseInt(val);

			if(isNaN(val) || val < min){
				val = min;
			}else{
				if(val > max){
					val = max;
				}
			}

			if(Lib.isFunction(callback)){
				val = callback.call(_this, val);
			}

			return val;
		},
		setFont : function(style){
			switch(style){
				case 'bold' :
					this.setStyle({
						fontWeight : style
					});
				break;

				case 'underline' :
					this.setStyle({
						textDecoration : style
					});
				break;

				case 'italic' :
					this.setStyle({
						fontStyle : style
					});
				break;
			}
		},
		unSetFont : function(style){
			switch(style){
				case 'bold' :
					this.setStyle({
						fontWeight : 'normal'
					});
				break;

				case 'underline' :
					this.setStyle({
						textDecoration : 'none'
					});
				break;

				case 'italic' :
					this.setStyle({
						fontStyle : 'normal'
					});
				break;
			}
		},
		keyEvent : function(json, input){
			var _this = this,

				//keydown时的回调函数
				kDown = Lib.isFunction(json.kDown) ? json.kDown : function(){},

				//keyup时的回调函数
				kUp = Lib.isFunction(json.kUp) ? json.kUp : function(){},
				kEve = {
					tar : '',
					corr : '',
					down : function(e){
						kEve.tar =  $(Lib.elecol.activeEle);
						kEve.corr = $(Lib.elecol.corrEle);
						if(_this.isNumKey(e.keyCode)){

							kDown();
							$(document).on('keyup', kEve.up);
						}
					},
					up : function(e){
						var val = input.val();

						kUp.call(_this, val);
						$(document).off('keyup', kEve.up);
					}
				};

			return kEve;
		},
	    isNumKey : function(keyCode){
	    	return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
	    },
	    setBorder : function(){
	    	var cfg_border =  $('.conf-border'),
	    		_this = this;

	    	$.each(cfg_border,function(i, ele){
	    		var type = cfg_border.find('select'),
	    			borderInput = cfg_border.find('.border-width'),
	    		    borderInput1 = cfg_border.find('.border-width1');

	    		//_this.getBorderType(type, borderInput1);
	    		_this.getBorderWidth(borderInput1);
	    		_this.getBorderType(type, borderInput);
	    		_this.getBorderWidth(borderInput);
	    	});
	    },

	    // setBorder2 : function(){
	    // 	var cfg_border =  $('.conf-border'),
	    // 		type = cfg_border.find('select'),
	    // 		borderInput = cfg_border.find('input');

	    // 		this.getBorderType(type, borderInput);
	    // 		this.getBorderWidth(borderInput);
	    // },

	    // setBorder2 : function(){
	    // 	// var cfg_border =  $('.conf-border'),
	    // 	// 	type = cfg_border.find('select'),
	    // 	// 	borderInput = cfg_border.find('input');

	    // 	// 	this.getBorderType(type, borderInput);
	    // 	// 	this.getBorderWidth(borderInput);
	    // 	var _this=this;
	    // 		 window.addEventListener("click",function(){
	    //        		var cfg_border =  $('.conf-border'),
		   //  		type = cfg_border.find('select'),
		   //  		borderInput = cfg_border.find('input');

		   //  		_this.getBorderType(type, borderInput);
		   //  		_this.getBorderWidth(borderInput);
		   //  		console.log(borderInput+'inputer');
	    //     	},false)
	    // },
	    getBorderType : function(type, borderInput){
	    	var _this = this;
	    	type.on('change',function(){

	    		var _type = $(this).find('option:selected').val();

	    		_this.setStyle({
	    			borderStyle : _type,
	    			borderWidth : borderInput.val()
	    		});
	    	});
	    },
	    getBorderWidth : function(borderInput){
	    	var kEve = this.keyEvent({
		    		kUp : function(val){
		    			val = this.getNum(val,{
		    				min : 1,
		    				max : 10
		    			});
		    			this.setStyle({
		    				borderWidth : val
		    			});
		    		}
		    	},borderInput);

	    	borderInput.on('keydown', kEve.down);
	    },
	    setColor : function(){
	    	var fontColor = $('.font-color').find('.color'),
    		    fontColor_show = fontColor.next('input'),
    		    borderColor = $('.border-color').find('.borderColor'),
    		    borderColor_show = borderColor.next('input'),
				tBgColor = $('.textBgColor'),
				tBgColor_show = tBgColor.next('input');

	    	this.getColor(fontColor, fontColor_show, function(tmp){
	    		this.setStyle({
	    			color : tmp
	    		});
	    	});

	    	this.getColor(borderColor, borderColor_show, function(tmp){
	    		this.setStyle({
	    			borderColor : tmp
	    		});
	    	});

			this.getColor(tBgColor, tBgColor_show, function(tmp){
				this.setStyle({
					backgroundColor : tmp
				});
			});
	    },
	    getColor : function(type, show, callback){
	    	var _this = this;
	    	type.on('change',function(){
	    		var tmp = $(this).val();

	    		if(Lib.isFunction(callback)){
	    			callback.call(_this, tmp);
	    		}
	    		show.val(tmp);
	    	});

	    	show.on('change',function(){
	    		if(_this.isHex($(this).val())){

	    			var tmp = $(this).val();

	    			callback.call(_this, tmp);
	    			type.val(tmp);
	    		}
	    	});
	    },

	    //16进制色值验证，为6位则返回true
	    isHex : function(val){
	    	var reg = /^([0-9a-fA-f]{6})$/;

	    	if(reg.test((val.indexOf('#') > -1) ? val.substring(1) : val)){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    },

	    //改变当前目标层级
	    changeLev : function(type, callback){
	    	var activeEle = $(Lib.elecol.activeEle),
	    		zIndex = activeEle.css('zIndex');

	    	if(zIndex == 'auto') zIndex = 0;

	    	switch(type){
	    		case 'up':
	    			zIndex = parseInt(zIndex) + 1;
	    		break;
	    		case 'down' :
	    			if(zIndex <= 0){
	    				zIndex = 0;
	    			}else{
	    				zIndex -= 1;
	    			}
	    		break;
	    	}

	    	if(!activeEle.hasClass('.page')){
	    		this.setStyle({
	    			zIndex : zIndex
	    		});
	    	}

	   		if(Lib.isFunction(callback)) callback();
	    },

	    //删除当前非page元素
	    delEle : function(fn){
	    	var activeEle = $(Lib.elecol.activeEle),
	    		corrEle = $(Lib.elecol.corrEle),
	    		src = '',
	    		_url = '';

	    	if(!activeEle.hasClass('page')){
	     		activeEle.remove();
	    		corrEle.remove();
	    	}

	    	Lib.elecol.activeEle = Lib.elecol.viewPage;
	    	Lib.elecol.corrEle = Lib.elecol.listPage;

	    	$(Lib.elecol.activeEle).addClass('curTar');
	    	this.switchEdit('.page-config');

	    	if(Lib.isFunction(fn)){
	    		fn();
	    	}
	    }

	};


	/**
	 ++++++++++++++++++++++++++++++++++
	 * SliderController[:class] 进度条及控制
	 *
	 *
	 ++++++++++++++++++++++++++++++++++
	 */
	function SliderController(){
	    var _this = this;

	    this._slider = $('.conf-slider');
	    this._rate = 0;
	    this._maxVal = 0;
	    this._prop = '';
	    this._curVal = 0;
	    this._kEve = true;  //判断当前的事件是鼠标事件[false]还是键盘事件[true]

	}

	SliderController.prototype = {
	    initial : function(){

	        var _this = this;
	        this._slider.each(function(){

	        	var bar = $(this).find('span'),
	        	    coner = $(this).find('i'),
	        	    disper = $(this).find('input'),
	        	    iDw = bar.width() - coner.width(),
	        	    mEve = _this.mouseEve(coner, iDw, disper);

	        	coner.on('mousedown',mEve.down);

	        	_this.inputCon(disper, coner, iDw);
	        });
	    },
	    mouseEve : function(coner, iDw, disper){
	    	var loc = {
	    			startX : 0,
	    			moveX : 0,
	    			dVal : 0
	    		},
	    		_this = this,
	    		mEve = {
		    		down : function(e){
		    			_this._kEve = false;    //鼠标事件，设为false
		    		    var left = parseInt(coner.css('left'));
		    		    _this._prop = coner.data('prop');
		    		    _this._maxVal = coner.data('maxval');

		    		    loc.startX = e.pageX - left;

		    		    $(document).on('mousemove',mEve.move);
		    		    $(document).on('mouseup', mEve.up);
		    		},
		    		move : function(e){
		    		    e.preventDefault();

		    		    loc.moveX = e.pageX;
		    		    loc.dVal = loc.moveX - loc.startX;

		    		    if( loc.dVal < 0 ){
		    		        loc.dVal = 0;
		    		    }else if( loc.dVal > iDw ){
		    		        loc.dVal = iDw;
		    		    }

		    		    coner.css('left', loc.dVal);

		    		    _this._rate = loc.dVal / iDw;

		    		    //根据this._prop中不同的prop给当前目标设定相应的属性
		    		    _this.setProp();

		    		    //在相应的input中显示当前的值
		    		    if(_this._curVal > 1){
		    		    	disper.val(parseInt(_this._curVal));
		    		    }else{
		    		    	if(_this._prop === 'opacity'){
		    		    		disper.val(parseInt((1 - _this._curVal) * 100));
		    		    	}else{
		    		    		disper.val(parseInt(( _this._curVal) * 100));
		    		    	}
		    		    }

		    		},
		    		up : function(e){
		    		    e.preventDefault();

		    		    Lib.unbind( document, Lib.tapmove,  mEve.move );
		    		    $(document).off('mousemove', mEve.move);
		    		   	$(document).off('mouseup',mEve.up );
		    		}
	    		};

	    	return mEve;
	    },

	    //输入控制相应的属性变化，并控制slider的进度条
	    inputCon : function(inputer, coner, iDw){

	    	var keyEve = this.keyEvent(inputer, coner, iDw);

	    	//当对应的input获取焦点时，绑定keydown事件
	    	inputer.on('keydown', keyEve.down);
	    },

	    //input的输入事件
	    keyEvent : function(inputer, coner, iDw){
	    	var _this =  this,
	    		keyEve = {
		    		down : function(e){

		    			//键盘事件，设为true
		    			_this._kEve = true;

		    			//更新_prop 中的属性值
		    			if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) ){

		    				_this._prop = coner.data('prop');
		    				_this._maxVal = coner.data('maxval');
		    				$(document).on('keyup', keyEve.up);
		    			}
		    		},
		    		up : function(e){

		    			_this._curVal = (_this._prop == 'opacity') ? 1 - inputer.val()/100 : inputer.val();

		    			var _left = parseInt((1 - inputer.val() / _this._maxVal) * iDw);

		    			if(_left > iDw){
		    				_left = iDw;
		    			}

		    			coner.css('left', _left);

		    			//设置属性
		    			_this.setProp();
		    			//移除keyup事件
		    			$(document).off('keyup', keyEve.up);
		    		}
	    		};

	    	return keyEve;
	    },
	    //根据_prop设置相应的属性值
	    setProp : function(){

	    	switch(this._prop){
	    		case 'transform':

	    			//this._curVal的值，以便在后期调用或改变
	    			this._curVal = this._kEve ? this._curVal : this._rate * this._maxVal;
	    		    this.setStyle({transform : 'rotate('+ this._curVal +'deg)' });
	    		    break;
	    		case  'borderRadius' :

	    			this._curVal = this._kEve ? this._curVal : this._rate * this._maxVal;
	    		    this.setStyle({
	    		    	borderRadius : this._curVal + 'px'
	    		    });
	    		    break;
	    		case  'boxShadow' :

	    			this._curVal = this._kEve ? this._curVal : this._rate * this._maxVal;
	    		    this.setStyle({
	    		    	boxShadow : '0px 0px ' + this._curVal + 'px rgba(0,0,0, 1)'
	    		    });

	    		    break;
	    		case  'opacity' :

	    			this._curVal = this._kEve ? this._curVal : this._rate ;

	    		    this.setStyle({
	    		    	opacity : 1 - this._curVal
	    		    });

	    		    break;
	    	}
	    },
	    setStyle : function(json){

	    	var activeEle = $(Lib.elecol.activeEle),
	    		corrEle = $(Lib.elecol.corrEle);

	    	if(!activeEle.hasClass('page')){
	    		if(activeEle.has('img').length!==0){
	    			activeEle.find('img').css(json);
	    			corrEle.find('img').css(json);
	    		}else{
	    			activeEle.css(json);
	    			corrEle.css(json);
	    		}

	    	}
	    }

	};


	/**
	 ++++++++++++++++++++++++++++++++++
	 * class5
	 * SavePreview[:] constructor 保存和预览
	 *
	 *
	 ++++++++++++++++++++++++++++++++++
	*/
	SavePreview = function(){
		this._prevBtn = $(Lib.elecol.previewBtn);
		this._appid = localStorage.getItem('appid');

	};

	SavePreview.prototype = {

		initialize : function(){

			this.preview();

		},
		preview : function(){
			var prevBtn = this._prevBtn,
				_this = this,
				makerWrap = $('.maker-config-wrapper');
				dynamicSimulator = $('.preview-simulator-wrap'),
				previewSimulator = dynamicSimulator.find('.preview-simulator'),
				dynamicHide = dynamicSimulator.find('.preview-hide-btn'),
				qrcodeBox = $('.preview-qrcode-box'),
				sbool = 1;

			prevBtn.on('click',function(){
				var appid = localStorage.getItem('appid');

				window.open('/?c=admin&a=preview', 'preview');
				if(sbool){
					$(qrcodeBox).qrcode({
							'width' : 160,
							'height' : 160,
							'text' : _URL_ + '?c=admin&a=mobileview&appid=' + appid
					});
				}

				sbool = false;

				_this.getAllPages();
				Lib.toggleFilter([makerWrap], 'in', function(){
					// staticSimulator.fadeOut(200);
					dynamicSimulator.fadeIn(200);
				});
			});

			dynamicHide.on('click',function() {
				Lib.toggleFilter([makerWrap], 'out', function() {
					dynamicSimulator.fadeOut(300);
					// staticSimulator.fadeIn(300);
				});
			});

		},
		getAllPages : function(){

			var pages = Lib.elecol.pageList.querySelectorAll('.page'),
				pageCol = [];

			for(var i = 0, page; page = pages[i ++ ];){
				pageCol.push(page.outerHTML);
			}

			Lib.setData('allPages', pageCol);

			return pageCol;
		}

	}

	animColl =  function () {
		content = $(Lib.getData('allPages'));
		allPages = content.filter('.page');
		elesAnimSet = [];

		allPages.each(function(){
			var animSet = [],
					eles = $(this).find('.anim');

			eles.each(function(){
				var type = $(this).data('anim'),
						eleAnim = {
							index : $(this).data('id'),
							type : type
						};

				animSet.push(eleAnim);
				$(this).removeClass(type);
			});

			elesAnimSet.push(animSet);
		});

		return {
			con : content,
			pages : allPages,
			elesAnimSet : elesAnimSet
		}
	}

	/**
	 ++++++++++++++++++++++++++++++++++
	 * class6
	 * Init[:calss] 在杂志预览页调用
	 *
	 *
	 ++++++++++++++++++++++++++++++++++
	*/
	Init = function(appid) {
		this._appid = appid;
		this._cfg = {
			component : {},
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
						img : localStorage.shrare_img
					}
				},
				music : {
					src : '/magazine/boai/attract/music/b.mp3'
				},
				type : localStorage['type']
			},
			handler : {},
			other : {
				bg : {
					color : Lib.getData('app-' + this._appid + '-other-bg-color')
				},
				site : {
					type : JSON.parse(Lib.getData('app-' + this._appid + '-type'))
				}
			}
		};

		this.initialize(function() {
			Lib.dom();
		});
	};

	Init.prototype = {
		initialize : function(callback) {

			var anims = animColl();

			$(Lib.ele.content).append(anims.con);

			$(Lib.ele.content).find('.page').each(function(i, ele){
				$(ele).find('.anim').each(function(){
					$(this).removeClass($(this).data('anim'));
					$(this).css({
						animationDelay : 0 + 's'
					});
				});
			});

			if (Lib.isFunction(callback)) callback();

			this.getModule(this._cfg);
		},
		getModule : function(cfg) {
			cfg.module.swiper.pagination = {
				enable : true
			}
			cfg.module.swiper.guider = {
				text : null,
				bottom : 15
			}

			this.getComponent(cfg);
		},
		getComponent : function(cfg) {

			this.getHandler(cfg);
		},
		getHandler : function(cfg) {
			var timer = [];
			cfg.handler.onAppLoad = function() {

				$(Lib.ele.page.first).find('.anim').each(function(){
					var type = $(this).data('anim'),
							delay = $(this).data('delay') ? $(this).data('delay') : 0,
							_this = $(this),
							atom = null;

					atom = setTimeout(function(){
									_this.addClass(type);
								}, delay*1000);
					timer.push(atom);
				});
			};
			cfg.handler.onTransformEnd = function() {
				for(var i = 0; i <timer.length; i++ ){
						clearTimeout(timer[i]);
				}

				$(Lib.ele.page.now).find('.anim').each(function(){
					var type = $(this).data('anim');
					$(this).removeClass(type);
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

			};
			cfg.handler.onSwipeStart = function() {

			};

			//创建预览微杂志
			this.createApp(cfg);
		},
		createApp : function(cfg) {
			this._data = encodeURI(JSON.stringify(cfg));
			var App = new APP.Application(cfg.module, cfg.handler);
		}

	};


	/**
	++++++++++++++++++++++++++
	* List[:class] class7 杂志列表
	*
	*
	++++++++++++++++++++++++++
	*/
	List = function(page) {
		this._manageBtn = document.querySelector('.app-list-header a.manage');
		this._exitBtn = document.querySelector('.app-list-header a.exit');
		this._createBtn = document.querySelector('.app-list-header a.create');
		this._wrap = document.querySelector('.app-list-wrapper');
		this._listWrap = document.querySelector('.app-list-box ul');
		this._uid = undefined;

		this._magList = {
			yd : $('section.yd ul'),
			ba : $('section.ba ul'),
			wz : $('section.wz ul'),
			sg : $('section.sg ul'),
			gp : $('section.gp ul')
		}

		this.bindEvent();
		this.initialize(page);
	};

	List.prototype = {

		initialize : function(page) {
			var that = this;

			$.ajax({
				url : _URL_,
				type : 'POST',
				dataType : 'json',
				data : {
					a : 'getlist',
					page : page
				},
				success : function(data) {
					if (data.status == -2) {
						alert('没有更多了');
					} else {
						that._uid = data.uid;
						for (var key in data.list) {
							// that.append(data.list[key]);
							that.insertItem(data.list[key]);
						}
						page++;
					}
				}
			});

			this.tabSwitchExc();
		},
		tabSwitchExc : function(){
			var opts = $('.mag-nav a'),
				tabs = $('.mag-list section'),
				sel  = 'selected';

			this.tabSwitch(opts, tabs, sel);
		},
		tabSwitch : function(opts, tabs, sel,callback){
			var _this = this;
			opts.each(function(){
				$(this).on('click', function(){
					$(this).addClass(sel).siblings().removeClass(sel);
					tabs.eq($(this).index()).addClass(sel).siblings().removeClass(sel);

					if(Lib.isFunction(callback)){
						callback.call(_this);
					}
				});
			});
		},
		append : function(data) {
		},
		insertItem : function(data){

			var qrCode = $('<span></span>'),
				newLi = $('<li>'+
								'<div class="box">'+
								'<div class="mag-img">'+
									'<img src="" alt="">'+
									'<div class="mag-edit">'+
										'<div class="mag-edit-wrap">'+
											// '<b></b>'+
											'<i>'+
												'<em class="icon iconfont" style="z-Index:0">&#xe60b;</em><strong class="strongD">更换封面</strong>'+
												'<input type="file" name="cover"/>'+
											'</i>'+
											'<a class="mag-edit-btn" href="javascript:;"><em class="icon iconfont" style="z-Index:0">&#xe60a;</em><strong class="strongD">编辑</strong></a>'+
											// '<a class="mag-edit-preview"href="javascript:;">预览</a>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="mag-info">'+
									'<h3 contenteditable="true"></h3>'+
									'<p contenteditable="true"></p>'+
									'<div class="mag-data clearfix">'+
										'<time class="FL"></time>'+
										'<span class="FR"><b></b></span>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</li>'),
				authorShow = newLi.find('.mag-data b'),
				author = data.author ? data.author : '旧版杂志',
				edit = newLi.find('.mag-edit-btn'),
				newH3 = newLi.find('h3'),
				newBox = newLi.find('.mag-img').get(0),
				newImg = newLi.find('.mag-img img'),
				newP = newLi.find('.mag-info p'),
				newTime = newLi.find('time'),
				newFileBtn = newLi.find('input[type=file]'),
				logoType,
				href;

			//获取对应的杂志链接地址
			// if (data.url){
			// 	href = '/?c=admin&a=add&appid='+ data.appid;
			// } else {
			// 	href = '/?c=admin&a=config&appid='+ data.appid;
			// }

			href = '/?c=admin&a=config&appid='+ data.appid;
			if (this._uid == data.mid || this._uid == 1) {
				edit.on('click',function(){
					window.location.href = href;
				});
			}

			//显示作者
			authorShow.html('作者：' + author);

			//生成二维码
			qrCode.qrcode({
				width: 150,
				height: 150,
				text : _URL_ + '?c=admin&a=mobileview&appid=' + data.appid
			});

			qrCode.insertBefore(newFileBtn.parent('i'));

			//封面图片（即微信分享图片）
			newImg.attr('src', data.share_img);

			//更改封面
			this.changeCover(newFileBtn, newBox, data);

			//分享描述
			newP.text(data.des);
			this.changeDes(newP, data.appid);

			//赋值杂志标题
			newH3.text(data.title);
			this.changeTitle(newH3, data.appid);

			//时间
			newTime.text(data.add_time);
			switch (parseInt(data.type)) {
				case 1:
					logoType = 'yd';
					break;
				case 2:
					logoType = 'ba';
					break;
				case 3:
					logoType = 'sg';
					break;
				case 4:
					logoType = 'wz';
					break;
				case 5:
					logoType = 'gp';
					break;
				case 99:
					logoType = 'otr';
					break;
			}

			if(this._magList[logoType]){
				this._magList[logoType].append(newLi);
			}

		},
 		unixToDate : function(unix){
 			var now = new Date(parseInt(unix) * 1000);
   			return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
 		},
 		changeTitle : function(title, appid){
 			title.on('blur',function(){
 				var txt = $(this).text();
 				$.ajax({
 					url : _URL_,
 					type : 'POST',
 					dataType : 'json',
 					data : {
 						a : 'changeTitle',
 						title : txt,
 						appid : appid
 					},
 					success : function(msg){
 						// console.log(msg);
 					}
 				});
 			});
 		},
 		changeDes : function(desBox, appid){
 			desBox.on('blur', function(){
 				var txt = $(this).text();

 				$.ajax({
 					url : _URL_,
 					type : 'POST',
 					dataType : 'json',
 					data : {
 						a : 'changeDes',
 						des : txt,
 						appid : appid
 					},
 					success : function(msg){
 						// console.log(msg);
 					}
 				});

 			});
 		},
 		changeCover : function(inputFileBtn, newBox, data){
 			var name = inputFileBtn.attr('name'),
 				figure = newBox;

 			inputFileBtn.on('change',function(){

 				var file = this.files[0];

				if (file) {
					var fileType = file.type;

					if (fileType == 'image/png' || fileType == 'image/jpeg') {
						var imgForm = new FormData(),
							xhr = new XMLHttpRequest();

						imgForm.append(name, file);

						xhr.addEventListener('loadstart', function(evt) {
							Lib.upload.start(evt, figure, 'img');
						}, false);

						xhr.upload.addEventListener('progress', function(evt) {
							Lib.upload.progress(evt, figure);
						}, false);

						xhr.addEventListener('load', function(evt) {

							$.ajax({
								url : _URL_,
								dataType : 'json',
								type : 'POST',
								data : {
									a : 'changeCover',
									appid : data.appid,
									shareimg : Lib.upload.complete(evt, figure, 'img')
								},
								success : function(msg){
									console.log(msg);
								}
							});

						}, false);

						xhr.addEventListener('error', Lib.upload.failed, false);
						xhr.addEventListener('abort', Lib.upload.canceled, false);

						Lib.upload.change({
							url : _URL_ + '?a=upfile&app='+ data.appid +'&dir='+ name +'&index='+ data.id,
							form : imgForm,
							xhr : xhr
						});
					} else {
						alert('不支持的文件类型，请重新选择！');
					}
				}
 			});
 		},
		bindEvent : function() {
			this._manageBtn.addEventListener('click', function() {
				localStorage.clear();
				window.location.href = '/?c=admin&a=manage';
			}, false);

			this._exitBtn.addEventListener('click', function() {
				localStorage.clear();
				window.location.href = '/?a=user_exit';
			}, false);

			// this._addBtn.addEventListener('click', function() {
			// 	localStorage.clear();
			// 	window.location.href = '/?c=admin&a=add';
			// }, false);

			this._createBtn.addEventListener('click', function() {
				localStorage.clear();
				window.location.href = '/?c=admin&a=config';
			}, false)
		}
	};

	/**
	 ++++++++++++++++++++++++++++++
	 * object 8
	 * + Controller[json : object](控制器)
	 *  + ResizeEle[:class](AddEle) 调整元素大小类
	 *  + AddAnim[:class](AddEle, Config)   动画效果类
	 *
	 ++++++++++++++++++++++++++++++
	 */

	 Controller = (function(){

			var ResizeEle, //调整元素大小
				AddAnim,  //加动画效果
				ReConfig, //class 切换元素时，获取当前元素的所有配置信息，并显示;

			/**
			+++++++++++++++++++++++++++++++++++
			*  ResizeEle[class](AddEle) 调整元素大小
			*
			+++++++++++++++++++++++++++++++++++
			*/
			ResizeEle = function(){//调整元素大小

				//实现单例
				if(Controller.unique !== undefined){
					return Controller.unique;
				}
				Controller.unique = this;

				this.add = new AddEle();
			};

			ResizeEle.prototype = {
				initial : function(){

				},
				execute : function(ele){

					 if(ele.hasClass('createdImg')){

						this.reSizeImg(ele);

					 }else if(ele.hasClass('createdEle')){

						this.reSizeText(ele);

					 }

				},
				reSizeImg : function(ele, add, callback){
					var reSizeBtn = $('<i class="resize-btn"></i>'),
						mEve;

					ele.append(reSizeBtn);

					mEve = this.mouseEve(ele, this.changeImgSize);
					mEve.down(reSizeBtn);

					if(Lib.isFunction(callback)){
						callback();
					}
				},
				reSizeText : function(ele, callback){
					var reSizeBtn = $('<i class="resize-btn resize-left"></i><i class="resize-btn resize-right"></i>'),
						mEve,
						initHeight = ele.height(),
						btnHeight = 0;

					ele.append(reSizeBtn);

					btnHeight = reSizeBtn.height();
					reSizeBtn.css('top', parseInt((initHeight - btnHeight)/2));

					mEve = this.mouseEve(ele, this.changTextSize, this.reLocTextBtn);
					mEve.down(reSizeBtn);

					if(Lib.isFunction(callback)){
						callback();
					}
				},
				changTextSize : function(ele, dx, add){
					var initWidth = ele.width(),
						curWidth = 0,
						initLeft = parseInt(ele.css('left')),
						corrEle = $(Lib.elecol.corrEle);

					// console.log(ele);
					curWidth = initWidth + dx;
					// if(!(ele.has('input').length === 0)){
					// 	var inputEle = ele.children('input'),
					// 	    sInputW = inputEle.width();
					// 	inputEle.width(sInputW + dx);
					// }

					add.setStyle({
						width : curWidth,
						left : initLeft - dx/2
					});
				},

				changeImgSize : function(ele, dx, add){
					var initWidth = ele.width(),
						initHeight = ele.height(),
						corrEle = $(Lib.elecol.corrEle),
						curWidth = 0,
						curHeight = 0,
						initLeft = parseInt(ele.css('left')),
						initTop = parseInt(ele.css('top'));

					curWidth = initWidth + dx;
					// curHeight = initHeight + dx;
					curHeight = ele.children('img').height();

					add.setStyle({
						width : curWidth,
						height : curHeight,
						left : initLeft - dx/2,
						top : initTop - dx/2
					});

				},

				//当前目标的高度变化后，重定位控制按钮到垂直中间
				reLocTextBtn : function(ele){
					var curHeight = ele.height(),
						btn = ele.find('.resize-btn'),
						btnHeight = btn.height();

					btn.css('top',parseInt((curHeight - btnHeight)/2));
				},

				//调整元素的大小
				mouseEve : function(ele, afterMove, afterUp){
					var _this = this,
						add = this.add,
						startX = 0,
						dX = 0,
						btn = null,
						mEve = {
							down : function(reSizeBtn){

								reSizeBtn.each(function(){
									$(this).on('mousedown', function(e){
										e.stopPropagation();
										startX = e.pageX;
										btn = $(this);

										$(document).on('mousemove', mEve.move);
										$(document).on('mouseup', mEve.up);
									});
								});
							},
							move : function(e){
								e.preventDefault();
								dX =(e.pageX - startX)*2;

								if(btn.hasClass('resize-left')){
									dX = -dX;
								}

								if(Lib.isFunction(afterMove)){
									afterMove.call(_this, ele, dX, add);
								}

								startX = e.pageX;
							},
							up : function(){

								if(Lib.isFunction(afterUp)){
									afterUp.call(_this, ele);
								}

								$(document).off('mousemove', mEve.move);
								$(document).off('mouseup', mEve.up);

							}
						};

					return mEve;
				}

			};

			/**
			++++++++++++++++++++++++++++++++
			*  AddAnim[class](AddEle, Config) 加动画效果
			*
			++++++++++++++++++++++++++++++++
			*/
			AddAnim = function(){

				//实现单例
				if(AddAnim.unique !== undefined){
					return AddAnim.unique;
				}
				AddAnim.unique = this;

				this.config = new Config();
				this.addEle = new AddEle();

				//获取所有动作名称
				this.allType = this.allAnimType();
			}

			AddAnim.prototype = {

				initial : function(){

					this.conSwitch();
					this.toggleAnim();
				},
				conSwitch : function(){
					var imgConf = $(Lib.elecol.imgConf),
						opts = imgConf.find('.opts span'),
						tabs = imgConf.find('.tabs .card');

					this.config.tabSwitch(opts, tabs, 'active');
				},

				//设置动画延迟和持续时间
				setDelayAndDuration : function(delayIn, durationIn){
						var delayE = 	this.config.keyEvent({
														kUp : function(val){
																delayE.tar.attr('data-delay', val);
																delayE.corr.attr('data-delay', val);

														}
													},delayIn),
							 durationE = this.config.keyEvent({
													 kUp : function(val){

															 durationE.tar.attr('data-duration', val).css({
																	 animationDuration : val + 's',
																	 webkitAnimationDuration : val + 's'
															 });

															 durationE.corr.attr('data-duration', val).css({
																 animationDuration : val + 's',
																 webkitAnimationDuration : val + 's'
															 });
													 }
							 },durationIn);

					delayIn.on('keydown', delayE.down);
					durationIn.on('keydown', durationE.down);
				},

				//切换动画效果
				toggleAnim : function(){
					var animBoxs = $(Lib.elecol.configWrap).find('.conf-anim-type'),
						_this = this;
					animBoxs.each(function(){
						var parent = $(this).parent().next();
								delayIn = parent.find('.delay'),
								durationIn = parent.find('.duration');

					 //调用延迟方法
						_this.setDelayAndDuration.call(_this, delayIn, durationIn);

						$(this).on('click', 'span', function(){
							var activeEle = $(Lib.elecol.activeEle),
								corrEle = $(Lib.elecol.corrEle),
								type = $(this).data('anim'),
								temp = Lib.elecol.tempAnim;

							if(temp){
								activeEle.removeClass(temp);
								corrEle.removeClass(temp);
							}

							$(this).addClass('active').siblings().removeClass('active');

							activeEle.addClass(type);
							corrEle.addClass(type);

							activeEle.get(0).dataset.anim = corrEle.get(0).dataset.anim = Lib.elecol.tempAnim = type;

						});
					});
				},

				//获取所有动画效果
				allAnimType : function(){
					var allType = [],
						spans = $(Lib.elecol.imgConf).find('.conf-anim-type span');
					spans.each(function(){
						allType.push($(this).data('anim'));
					});

					return allType;
				}
			}

			/**
			++++++++++++++++++++++++++++++++
			*  ReConfig[class] 获取当前元素的所有配置信息，并显示;
			*
			*
			++++++++++++++++++++++++++++++++
			*/
			ReConfig = function(ele){

				//实现单例
				if(ReConfig.unique !== undefined){
					return ReConfig.unique;
				}
				ReConfig.unique = this;

				this.eleData = null;
			}

			ReConfig.prototype = {
				initial : function (ele) {
					var style=null,conf={},anim={};//hyltj

					if(ele.has('input').length!== 0){
						style=ele.find('input').get(0).style
					}else if(ele.has('a').length!== 0){
						style=ele.find('a').get(0).style
					}else if(ele.has('img').length!== 0){
						style=ele.find('img').get(0).style;
					}else{
						style=ele.get(0).style;
					};
					conf = {
						//位置
						left : ele.get(0).style.left,
						top : ele.get(0).style.top,

						//边框
						borderType : style.borderStyle ? style.borderStyle : 'none',
						borderWidth : style.borderWidth ? parseInt(style.borderWidth) : '1',
						borderColor : style.borderColor ? Lib.RGBToHex(style.borderColor) : '#000000',

						//排版
						align : style.textAlign ? style.textAlign : 'center',

						//字体风格
						fontWeight : style.fontWeight ? style.fontWeight : 'normal',
						textDecoration : style.textDecoration ? style.textDecoration : 'none',
						fontStyle : style.fontStyle ? style.fontStyle : 'normal',

						//字体样式
						fontSize : style.fontSize ? parseInt(style.fontSize) : 12,
						lineHeight : style.lineHeight ? parseInt(style.lineHeight) : 16,
						color : style.color ? Lib.RGBToHex(style.color) : '#000000',

						//文本背景
						tBg : style.backgroundColor ? Lib.RGBToHex(style.backgroundColor) : '#000000',

						//透明度
						opacity : style.opacity,

						//旋转角度
						rotate : style.transform ,

						// 阴影
						shadow : style.boxShadow ,

						//圆角
						radius : style.borderRadius

					},
					anim = {
						type : ele.data('anim'),
						delay : ele.data('delay'),
						duration : ele.data('duration')
					};

					this.reLoc({
						left : parseInt(conf.left),
						top : parseInt(conf.top)
					});

					this.reBorder({
						type : conf.borderType,
						width : conf.borderWidth,
						color : conf.borderColor
					});

					this.reAlign({
						align : conf.align
					});

					this.reFontStyle({
						weight : conf.fontWeight,
						decoration : conf.textDecoration,
						em : conf.fontStyle
					});

					this.reFont({
						size : conf.fontSize,
						lineH : conf.lineHeight,
						color : conf.color,
						tBg : conf.tBg
					});

					this.reCtrl(ele, {
						opacity : conf.opacity,
						rotate : conf.rotate,
						shadow : conf.shadow,
						radius : conf.radius
					});

					//获取动画效果配置
					this.reAnim(ele);
				},

				reCtrl : function(ele, val){
					var opa = val.opacity ? parseFloat(val.opacity).toFixed(2) : 1,
						rot = val.rotate ? val.rotate : 0,
						rad = val.radius ? parseInt(val.radius) : 0,
						sha = val.shadow ? val.shadow : 0;


					rot = rot ? parseInt(rot.substring(rot.indexOf('(') + 1, rot.indexOf(')'))) : rot;
					sha = sha ? parseInt(sha.substring(sha.lastIndexOf(' ')) + 1) : sha;

					if(ele.hasClass('createdEle')){//文本
						Kit.ele.slider.textSlider.each(function(i, ele){
							var bar = $(ele).find('span'),
							    point = $(ele).find('i'),
							    sh = $(ele).find('input'),
							    max = point.data('maxval'),
							    bw = bar.width() - point.width();


							switch(point.data('prop')){
								case 'opacity':
									sh.val(opa * 100);
									point.css({left : parseInt((1 - opa) * bw) });
								break;

								case 'boxShadow':
									sh.val(sha);
									point.css({ left : parseInt(sha/max * bw) });
								break;

								case 'borderRadius':
									sh.val(rad);
									point.css({ left : parseInt(rad/max * bw) });
								break;

								case 'transform':
									sh.val(rot);
									point.css({ left : parseInt(rot/max * bw) });
								break;
							}

						});
					}else if(ele.hasClass('createdImg')){//图片

						Kit.ele.slider.imgSlider.each(function(i, ele){
							var bar = $(ele).find('span'),
							    point = $(ele).find('i'),
							    sh = $(ele).find('input'),
							    max = point.data('maxval'),
							    bw = bar.width() - point.width();

							switch(point.data('prop')){
								case 'opacity':
									sh.val(opa * 100);
									point.css({left : parseInt((1 - opa) * bw) });
								break;

								case 'boxShadow':
									sh.val(sha);
									point.css({ left : parseInt(sha/max * bw) });
								break;

								case 'borderRadius':
									sh.val(rad);
									point.css({ left : parseInt(rad/max * bw) });
								break;

								case 'transform':
									sh.val(rot);
									point.css({ left : parseInt(rot/max * bw) });
								break;
							}
						});
					}

				},
				reAnim : function(ele){
					var dataset = ele.get(0).dataset,
						type = dataset.anim ? dataset.anim : 'normal',
						duration = dataset.duration ? dataset.duration : 1,
						delay = dataset.delay ? dataset.delay : 0;
					if(ele.hasClass('createdEle')){
						this.reSetAnim({
						  ele : 'textAnim',
							type : type,
							delay : delay,
							duration : duration
						})

					}else if(ele.hasClass('createdImg')){
						this.reSetAnim({
						  ele : 'imgAnim',
							type : type,
							delay : delay,
							duration : duration
						})
					}
				},

				/*
				* + val : json
				*  - ele : string ['imgAnim', 'textAnim']
				*	 - type : string
				*  - duration : number
				*  - delay : number
				*/
				reSetAnim : function(val){
					Kit.ele[val.ele].type.find('span').each(function(i, ele){
						if($(ele).data('anim') === val.type){
							$(ele).addClass('active').siblings().removeClass('active');
						}
					});

					Kit.ele[val.ele].duration.val(val.duration);
					Kit.ele[val.ele].delay.val(val.delay);
				},
				/**
				*  + val[:json] 位置
				*		 -left[:number] left值
				*    -top[:number]  top值
				*/
				reLoc : function(val){
					var loc = $('.conf-loc'),
						locX = loc.find('.locX'),
						locY = loc.find('.locY');
					locX.val(val.left);
					locY.val(val.top);
				},

				reBorder : function(val){

						var type =$('.border-type'),
							width = $('.border-width'),
							bColor = $('.border-color'),
							borderColor = $('.borderColor'),
							colorShow = bColor.find('input[type=text]');

						//边框类型
						$.each(type.find('option'), function(i, n){
							if($(this).val() === val.type){
								$(this).attr('selected', 'selected');
							}
						});
						//边框宽度
						width.val(val.width);

						//边框色值
						borderColor.val(val.color);
						colorShow.val(val.color);
				},

				/**
				*  + val[:json] 排版
				*		 -align[:string(center)]
				*/
				reAlign : function(val){
					var align = $('.conf-align');
					$.each(align.find('span'), function(i, ele){
						if($(this).data('align') === val.align){
							$(this).addClass('selected').siblings().removeClass('selected');
						}
					});
				},

			/**
			*  + val[:json] 字体风格
			*		 -weight[:string]
			*    -decoration[:string]
			*		 -em[:string]
			*/
				reFontStyle : function(val){
						var fontStyle = $('.conf-fontStyle');

						$.each(fontStyle.children('span'), function(i, ele){
								for(var key in val){
									// console.log(val[key]);
									(function(_this,k){
											if(_this.data(k)){
													if(_this.data(k) === val[k]){
															_this.addClass('selected');
													}else{
															_this.removeClass('selected');
													}
											}
									})($(this), key);
								}
						});
				},

				/**
				*  + val[:json] 字体样式
				*		 -size[:number(12)] 字体大小
				*    -lineH[:number(20)] 行高
				*		 -color[:string(#000000)] 色值
				*    -tBg[:string(#000000)]背景颜色
				*/
				reFont : function(val){
						var fsize = $('.conf-font .fontSize'),
							lineH = $('.lineHeight'),
							fcolor = $('.font-color input[type=color]'),
							fcShow = $('.font-color input[type=text]'),
							tBgColor = Kit.ele.txt.tBgColor,
							tBgColor_show = Kit.ele.txt.tBgColor_show;

						fsize.val(val.size);
						lineH.val(val.lineH);
						fcolor.val(val.color);
						fcShow.val(val.color);

						//背景
						tBgColor.val(val.tBg);
						tBgColor_show.val(val.tBg);
				}
			}

			return {
				ResizeEle : ResizeEle,
				AddAnim : AddAnim,
				ReConfig : ReConfig
			};
	 })();


	 Component = (function(win){

		  	"use strict";

			var Layer,    //com[class1]  弹出层
				Form,       //com[calss2]  创建表单元素
				ImgAndBg,   //com[class3]  添加图片或设置背景 这里将使用部分ES6
				Uploader;   //com[class4]  上传文件组件

			Layer = function(){

				if(Layer.unique !== undefined){
					return Layer.unique;
				}
				Layer.unique = this;

				this.layer = null;
				this._masker = null;
			}

			Layer.prototype = {
				  initial : function(){},

					/** 创建弹窗层
					*  + opts : json
					*   - width : number[0]
					*   - height : number[0]
					*   - title : string['']  //弹窗标题
					*   - content : node['']  //需要插入的主体内容
					*   - popupClass : string['']
					*   - maskerClass : string['']
					*   - beforeShow : function
					*   - onShow : function
					*   -confirmCallback : function
					*/
				  createPopup : function(opts){
							var popup = $('<div class="layer-popup">' +
							'<div class="layer-popup-wrap"><div class="layer-popup-content"></div></div>' +
							'<span class="layer-popup-confirm">确认</span>' +
							'<span class="layer-popup-cancel">取消</span>' +
							'</div>'),
							content = popup.find('.layer-popup-content'),

							options = {
								width : Lib.isNumber(opts.width) ? opts.width : 0,
								height : Lib.isNumber(opts.height) ? opts.height : 0,
								title : Lib.isString(opts.title) ? opts.title : '',
								content : opts.content ? opts.content : null,
								popupClass : Lib.isString(opts.popupClass) ? opts.popupClass : '',
								maskerClass : Lib.isString(opts.maskerClass) ? opts.maskerClass : '',
								beforeShow : opts.beforeShow,
								onShow : opts.onShow,
								confirmCallback : opts.confirmCallback
							},

							title = null;

							if(options.title){
								title = $('<h2 class="layer-popup-title">' + options.title  + '</h2>');
								title.insertBefore(content);
								// popup.find('.layer-popup-wrap').append(title);
							}

							if(options.content){
								content.append($(options.content));
							}

							if(options.width){
								popup.css({
									  width: options.width,
										marginLeft : - options.width/2
								});
							}

							if(options.height){
								popup.css({
									height : options.height,
									marginTop : - options.height/2
								});
							}


							if(options.popupClass){
								popup.addClass(options.popupClass);
							}

							this._popup = popup;

							//防止出现多个弹窗
							if($('body .layer-masker').length !== 0){
								alert('请先关闭当前弹窗！');
								return;
							}

							if(Lib.isFunction(options.beforeShow)){
								options.beforeShow.call(this);
							}

							this.createMasker(options.maskerClass, 300, function(){
								  this._masker.append(this._popup);
							});
							this._popup.fadeIn(300);


							$('body').append(this._masker);

							this._popup.on('click', function(e){
								e.stopPropagation();
							});

							if(Lib.isFunction(options.onShow)){
								options.onShow.call(new Form());
							}

							this.removeLayer({
								cancelBtn : this._popup.find('.layer-popup-cancel'),
								confirmBtn : this._popup.find('.layer-popup-confirm'),
								target : this._masker
							}, options.confirmCallback);
					},
				  createMsg : function(){},
				  createTips : function(){},

					/** 移除弹窗
					* + opts[:json]
					*  - cancelBtn : node(null)
					*  - confirmBtn : node(*)
					*  - target : node(*)
					*/
					removeLayer : function(opts, confirmCallback){
							var options = {
										cancelBtn : opts.cancelBtn ? opts.cancelBtn : null,
				            confirmBtn : opts.confirmBtn,
										target : opts.target
									},
									_this = this;

							if(options.cancelBtn){
								options.cancelBtn.on('click',function(){
									  _this.removeContent(300, options.target);
								});
							}

							options.confirmBtn.on('click', function(){
								 if(Lib.isFunction(confirmCallback)){
									   confirmCallback.call(_this);
								 }
							});

							$(document).on('click',function(){
								  _this.removeContent(300, options.target);
							});
					},
					removeContent : function(speed, node){
						 node.fadeOut(speed, function(){
							   $(this).remove();
						 })
					},

					/*
					*  -classname : string
				  *  -speed : number
					*/
					createMasker : function(classname, speed, callback){
						 var masker = $('<div class="layer-masker"></div>'),
						     _this = this;
						 speed = Lib.isNumber(speed) ?  speed : 300;
						 if(Lib.isString(classname)){
							   masker.addClass(classname);
						 }else{
							   if(classname){
									 console.error('classname必须为字符串');
								 }
						 }

						 this._masker = masker;

						 this._masker.fadeIn(speed, function(){
							 		if(Lib.isFunction(callback)){
										callback.call(_this);
									};
						 });
					}
			}

			Form = function () {

				if(Form.unique !== undefined){
					return Form.unique;
				}

				Form.unique = this;
				this.showN=new AddEle();//hyltj

				//一些预定义的属性
				this._inputContent = null;   //文本输入框的弹窗
				this._btnContent = null;     //提交按钮配置弹窗
				this._telContent = null;     //手机配置弹窗
				this._linkContent = null;    //链接配置弹窗

				this.newFormBtn = $('.new-form-btn');
				this.newOpts = $('.new-form-opts');
				this.layer = new Layer();
			}

			Form.prototype = {
				initial : function(){
					this.excuteEve();
				},
				excuteEve : function(){

					this.newOpts.on('click', e => {
						e.stopPropagation();

						this[e.target.dataset.opt](function(){
							this.hideOpts();
						});
					});

					this.newFormBtn.on('click', e => {
						e.stopPropagation();

						if($('body .layer-masker').length !== 0){
							alert('请先关闭当前弹窗！');
							return;
						}
						if(this.newOpts.css('display') === 'none'){
							this.newOpts.fadeIn(200);
						}else{
							this.hideOpts();
						}
					});

					$(document).on('click', e => {
						this.hideOpts();
					});
				},
				insertIntoPage : function(ele){
						let viewPage = $(Lib.elecol.viewPage),
							  listPage = $(Lib.elecol.listPage);
						listPage.append(ele);

						ele.css('left', (Kit.value.prev_w - ele.width())/2);
						ele.css('top', (Kit.value.prev_w - ele.height())/2);//hyltj
						viewPage.append(ele.clone(true));
				},
				// showLoc : function(obj){//显示初始的坐标值  hyltj
		 	// 		var locX  = $(Lib.elecol.confEle.locX),
		 	// 			locY = $(Lib.elecol.confEle.locY),
		 	// 			_obj = $(obj);

		 	// 		locX.val(parseInt(_obj.css('left')));
		 	// 		locY.val(parseInt(_obj.css('top')));
		 	// 	},
				hideOpts : function(){
					this.newOpts.fadeOut(300);
				},
				switchEr : function(eles){//提交按钮选项
					$.each(eles, function(i, ele){
							$(ele).on('click',function(){
								//console.log('hahah')
								$(this).addClass('selected').siblings().removeClass('selected');
							});
					});
				},
				setHtml : function(input, eleWrap, str){
						input.on('keyup',function(e){
							e.stopPropagation();

							var ele = eleWrap.find('span.selected'),
								  val = $(this).val() || str;
							 ele.html(val);
						});
				},
				// switchEdit : function(configType){//插入对象相对应属性函数  hyltj
		 	// 		var wrap = $(Lib.elecol.configWrap),
		 	// 			editer = wrap.find(configType);

		 	// 		if(!editer.hasClass('active')){
		 	// 			editer.addClass('active').siblings().removeClass('active');
		 	// 		}

		 	// 		return editer;
		 	// 	},
				setInput : function(){
					let pholder = this._inputContent.find('input[type=text]').val() || '请输入您的姓名',
					    type = this._inputContent.find(':radio:checked').val(),
							inputer = $('<div class="curTar createdEle anim form-text" data-id="ele' + Lib.elecol.eleIndex + '" data-anim="normal"> '+
									'<input type="text" id="' + type + '" name="'+ type +'" placeholder="' + pholder + '"/>' +
							'</div>'),
							exist = document.querySelector('#' + type + '');

							if(!exist){
									this.insertIntoPage(inputer);
									this.showN.showLoc(inputer);//hyltj
									this.showN.switchEdit('.ele-config');//hyltj
									Lib.elecol.eleIndex ++;
									return true;
							}else {
								alert('请不要重复添加已有表单元素！');
							}

							return false;
				},
				newInput : function(callback){
					let _this = this;

					this.layer.createPopup({
						title : '表 &nbsp; 单',
						content : this.inputCon(),
						confirmCallback : function(){
							let confirm = _this.setInput();

							//这里的this指的是Layer
							if(confirm){
								this.removeContent(300, this._masker);
							}
						}
					});

					this.excuteCb(callback);
				},
				setBtnCon : function(){
					let btnCon = this._btnContent;
					this.switchEr(btnCon.find('span'));
					this.setHtml(btnCon.find('input'), btnCon, '提交');
					this.showN.showLoc(btnCon);//hyltj
					this.showN.switchEdit('.ele-config');//hyltj
				},
				setBtn : function(){

					let btnCon = this._btnContent,
							type = null,
							html = null,
							btn = null;

					type = btnCon.find('span.selected').data('type');
					html = btnCon.find('span.selected').html() || '提交';

					btn = $('<div class="curTar createdEle anim form-btn" data-id="ele' + Lib.elecol.eleIndex + '" data-anim="normal"> '+
							'<a href="javascript:;" id="btn" data-type="'+ type +'">' + html + '</a>' +
					'</div>');

					if(!document.querySelector('#btn')){
							this.insertIntoPage(btn);
							this.showN.showLoc(btn);//hyltj
							this.showN.switchEdit('.ele-config');//hyltj
							Lib.elecol.eleIndex ++;

							return true;
					}else {
						alert('请不要重复添加已有表单元素！');
					}

					return false;
				},
				newBtn : function(callback){
					let _this = this;

					this.layer.createPopup({
						title : '按 &nbsp; 钮',
						content : this.btnCon(),
						onShow : this.setBtnCon,
						confirmCallback : function(){
 								let confirm = _this.setBtn();

								if(confirm){
									this.removeContent(300, this._masker);
								}
						}
					});

					this.excuteCb(callback)
				},
				setTelCon : function(){
						let telCon = this._telContent;
						this.switchEr(telCon.find('span'));
						this.setHtml(telCon.find('input'), telCon, '075525890396');
						this.showN.showLoc(telCon);//hyltj
						this.showN.switchEdit('.ele-config');//hyltj
				},
				setTel : function(){
					 let select = this._telContent.find('span.selected'),
					 		 type = select.data('type'),
							 html = select.html(),
							 tel = $('<div class="curTar createdEle anim tel" data-id="ele' + Lib.elecol.eleIndex + '" data-anim="normal"> '+
		 										'<a href="tel:' + html + '" data-type="'+ type +'">' + html + '</a>' +
		 								'</div>');
								tel.width();
								this.insertIntoPage(tel);
								this.showN.showLoc(tel);//hyltj
								this.showN.switchEdit('.ele-config');//hyltj
								Lib.elecol.eleIndex ++;
				},
				newTel : function(callback){
					let _this = this;

					this.layer.createPopup({
						title : '联系电话',
						content : this.telCon(),
						onShow : this.setTelCon,
						confirmCallback : function(){
							_this.setTel();
							this.removeContent(300, this._masker);
						}
					});

					this.excuteCb(callback);
				},
				setLinkCon : function(){
					let linkCon = this._linkContent,
							urlInput = linkCon.find('.link-url'),
							txtInput = linkCon.find('.link-txt'),
							linkTag = linkCon.find('a');

					urlInput.on('blur', e => {
						e.stopPropagation();
						let url = urlInput.val() || 'http://www.boai.com';
						linkTag.attr('href', url);
					});

					txtInput.on('keyup', e => {
						e.stopPropagation();
						let txt = txtInput.val() || '博爱';
						linkTag.html(txt);
					});
				},
				setLink : function(){
					let linkTag = this._linkContent.find('a'),
						url = linkTag.attr('href'),
						txt = linkTag.html(),
						link = $('<div class="curTar createdEle anim link" data-id="ele' + Lib.elecol.eleIndex + '" data-anim="normal"> '+
											 '<a href="' + url + '" >'+ txt + '</a>' +
									 '</div>');

						this.insertIntoPage(link);
						this.showN.showLoc(link);//hyltj
						this.showN.switchEdit('.ele-config');//hyltj
						Lib.elecol.eleIndex ++;
				},
				newLink : function(callback){
					let  _this = this;
					this.layer.createPopup({
						title : '链接',
						content : this.linkCon(),
						onShow : this.setLinkCon,
						confirmCallback : function(){
							_this.setLink();

							this.removeContent(300, this._masker);
						}
					});

					this.excuteCb(callback)
				},
				excuteCb : function(callback){
					if(Lib.isFunction(callback)){
						callback.call(this);
					}
				},
			    inputCon : function(){
					var inputCon = $('<div class="form-input"><input type="text" placeholder="请输入信息" /></div>' +
					'<div class="form-input-type">'+
						'<input type="radio" checked name="input-type" value="name">姓名' +
						'<input type="radio" name="input-type" value="tel">电话' +
						'<input type="radio" name="input-type" value="email">邮箱' +
					'</div>');

					this._inputContent = inputCon;

					return inputCon;
				},
				btnCon : function(){
					var btnCon = $('<div class="form-btn-type">' +
							'<span class="form-btn-yd selected" data-type="yd">提交</span>' +
							'<span class="form-btn-ba" data-type="ba">提交</span>' +
							'<span class="form-btn-wz" data-type="wz">提交</span>' +
							'<span class="form-btn-sg" data-type="sg">提交</span>' +
						'</div>' +
						'<div class="form-btn-value"><input type="text" placeholder="提交"></div>');

					this._btnContent = btnCon;
					return btnCon;
				},
				telCon : function(){
					var telCon = $('<div class="tel-type">' +
							'<span class="tel-yd selected" data-type="yd">075588808888</span>' +
							'<span class="tel-ba" data-type="ba">075525890396</span>' +
							'<span class="tel-wz" data-type="wz">075526719191</span>' +
							'<span class="tel-sg" data-type="sg">075582473398</span>' +
						'</div>' +
						'<div class="tel-value"><input type="text" placeholder="075597654321"></div>');

					this._telContent = telCon;
					return telCon;
				},
				linkCon : function(){
					var linkCon = $('<div class="link-cont">' +
									'<p>链接网址：<input type="text" class="link-url" placeholder="http://www.boai.com"></p>' +
									'<p>链接文字：<input type="text" class="link-txt" placeholder="博爱"></p>' +
							'</div>' +
						  '<div class="link-demo"><a href="http://www.boai.com">博爱</a></div>');

					this._linkContent = linkCon;
					return linkCon;
				}
			}

			//通过弹窗新增图片和背景组件
			ImgAndBg =  function(){

				if(ImgAndBg.unique !== undefined ){
					return ImgAndBg.unique;
				}
				ImgAndBg.unique = this;

				this._addImgBtn = $('.new-img');//触发添加图片按钮
				this._addBgBtn = $('.new-pageBg');//触发添加背景图片按钮
				this._addMusic = $('.new-music');//触发添加音乐按钮
				this._magMusic = $('.mag-music audio');//音乐播放按钮
				this._magMusicName = $('.mag-music').next();//
				this._layer =new Layer();
				this._layout = null;
				this._selectedLi = null;
				this._addEle = new AddEle();
				this._uploader = new Uploader();
				this._loadBox = null;

				this.initial();
			}

			ImgAndBg.prototype = {
				initial : function(){
					this.openList();
				},
				openList : function(){
					this.musicList();
					this.pageBgList();
					this.imgList();
				},
				ctlMusic : function(){
					let aSpan = this._layout.find('.popup-layout-right span');
					aSpan.each((i, ele) => {
						let audio = $(ele).find('audio').get(0);

						$(ele).on('click', (e) => {
							//音乐播放、暂停控制
							if(!audio.paused){
								audio.pause();
								$(ele).css('backgroundPosition', '0 -33px');
							}else {
								audio.play();
								$(ele).css('backgroundPosition', '0 -68px');
							}
						});

						//当前歌曲播放结束，则把背景还原
						$(audio).on('ended', function(){
							$(ele).css('backgroundPosition', '0 0');
						});
					});
				},
				musicList : function(){
					let _this = this,
					    magM = $('.mag-music');
					this._addMusic.on('click', (e) => {
							e.stopPropagation();
					    let musics = Kit.cfg.music_data,
							    aList = null;
							aList = this.createList(Kit.cfg.music_classes, musics, 'music');

							this._layer.createPopup({
								width : 700,
								height : 500,
								title : '音 &nbsp; 乐 ',
								popupClass : 'music-list',
								content : this.setLayout(Kit.cfg.music_classes, aList),
								beforeShow : function(){
									_this.uploadMusic();
								},
								onShow : function(){
								   	//console.log(_this._layout.find('.popup-layout-right span'));
								  	_this.ctlMusic();
								},
								confirmCallback : function(){
									var sLi = _this._selectedLi;
									if(sLi){
										  _this._magMusic.attr('src', sLi.find('audio').attr('src'));
											_this._magMusicName.html(sLi.find('i').html());
											magM.css('backgroundPosition', '0 0');
											alert('音乐修改成功！');
											this.removeContent(300, this._masker);
									}else{
										alert('请选择一首歌或上传一首歌！');
									}
								}
							});
					});
				},
				imgList : function(){//image弹窗选择图片框
					let _this = this;

					//图片列表弹窗
					this._addImgBtn.on('click', (e) => {//触发添加图片按钮事件
						e.stopPropagation();

						let imgs = Kit.cfg.images_data,
							aList = null;

						aList = this.createList(Kit.cfg.img_classes, imgs);//创建imgage

						this._layer.createPopup({
							width: 700,
							height : 500,
							title : '图 &nbsp; 片',
							popupClass : 'images-list',
							content : this.setLayout(Kit.cfg.img_classes, aList),
							beforeShow : function(){
								_this.uploadImg();
							},
							onShow : function(){},
							confirmCallback : function(){
								if(_this._selectedLi){
									_this.insertEle('images', _this._selectedLi);
									this.removeContent(300, this._masker);
								}else{
									alert('请选择一张图片！');
								}
							}
						});
					});
				},
				pageBgList : function(){
					let _this = this;

					//页面背景弹窗
					this._addBgBtn.on('click', (e) => {
						e.stopPropagation();

						let imgs = Kit.cfg.pageBg_data,
							  aList = null;
						aList = this.createList(Kit.cfg.bg_classes, imgs);
						this._layer.createPopup({
							width: 700,
							height : 500,
							title : '页面背景',
							popupClass : 'pageBg-list',
							content : this.setLayout(Kit.cfg.bg_classes, aList),
							beforeShow : function(){
								_this.uploadPageBg();
							},
							onShow : function(){},
							confirmCallback : function(){
								if(_this._selectedLi){
									_this.insertEle('pageBg', _this._selectedLi);
									this.removeContent(300, this._masker);
								}else{
									alert('请选择一张图片！');
								}
							}
						});
					});
				},
				uploadMusic : function(){
					let wrap = this._loadBox,
					    appid = localStorage.appid,
							_this = this;

					this._uploader.upFile({
						wrap : wrap,
						inputer : wrap.find('input[type=file]'),
						url : _URL_ + '?a=upfile&app=' + appid + '&dir=src',
						name : 'src',
						percentType : 1,
						endCallback : function(e, data){
							if(data){

								_this._magMusic.attr('src', data.url);
								_this._magMusicName.html(data.file.name);
								_this._magMusic.parent('span').css('backgroundPosition', '0 0');

								alert('音乐修改成功！');

								_this._layer.removeContent(300, _this._layer._masker);
							}

						}
					});
				},
				uploadImg : function(){
					let wrap = this._loadBox,
							appid = localStorage.appid,
							_this = this;

					this._uploader.upFile({
						wrap : wrap,
						inputer : wrap.find('input[type=file]'),
						url : _URL_ + '?a=upfile&app=' + appid + '&dir=img',
						name : 'img',
						percentType : 2,
						endCallback : function(e, data){
							_this.insertEle('images', data.url);
							_this._layer.removeContent(300, _this._layer._masker);
						}
					});
				},
				uploadPageBg : function(){
					let wrap = this._loadBox,
							appid = localStorage.appid,
							_this = this;

					this._uploader.upFile({
						wrap : wrap,
						inputer : wrap.find('input[type=file]'),
						url : _URL_ + '?a=upfile&app='+ appid +'&dir=page',
						name : 'page',
						percentType : 1,
						endCallback : function(e, data){
							_this.insertEle('pageBg', data.url);
							_this._layer.removeContent(300, _this._layer._masker);
						}
					});
				},

				/*
				* type* : string['images','pageBg']
				* imgLink* : string/obj
				*/

				insertEle : function(type, imgLink){
					let url = '',
					    lPage = $(Lib.elecol.listPage),
						vPage = $(Lib.elecol.viewPage);
						var img=$('<img src="" />'),
							rPage=$('.img-uploader .img-box');

					if(Lib.isString(imgLink)){
						url = imgLink;
					}else{
						url = imgLink.children('img').attr('src');
					}

					if(type === 'images'){

						let imgBox = $('<div data-id="img'+ Lib.elecol.eleIndex +'"  class="createdImg anim" data-anim="normal"></div>'),
							img = $('<img src="' + url + '">'),
							clone = null;

						imgBox.append(img);
						clone = imgBox.clone(true);
						vPage.append(imgBox.addClass('curTar'));

						imgBox.css('left', (Kit.value.prev_w - imgBox.width())/2);
						imgBox.css('top', (Kit.value.prev_w - imgBox.height())/2);
						imgBox.css({/*'height':img.css('width'),*/'width':img.css('width')});
						lPage.append(clone);
						this._addEle.switchEdit('.img-config');//图片对应属性显示
						this._addEle.showLoc(imgBox)
						this._addEle.switchImgSrc(this._addEle._imgWrap, url);
						this._addEle.renewCurEle(imgBox, clone);

					  Lib.elecol.eleIndex ++;
					}else if(type === 'pageBg'){
						lPage.css('backgroundImage', 'url(' + url + ')');
						vPage.css('backgroundImage', 'url(' + url + ')');
						rPage.css('backgroundImage', 'url(' + url + ')');
						// img.attr('src', src);
						// rPage.append(img)
					}

				},

				/**
				* classes : json
			  * +imgs : array
				*/
				createList : function(classes, imgs, kind){//创建image函数
					let aList = {};

					for(let type in classes ){
						let list = $('<ul class="' + type + '"></ul>');

						imgs.map((item, i) => {
							if(item.img_class === type){
								let itemWrap = $('<li></li>'),
								    atom = $('<img data-class="' + item.img_class + '" src="' + item.img_url + '"/>');
								if(kind === 'music'){
								    atom = $('<div class="' + item.img_class + '">' +
														'<span><audio src="' + item.img_url + '"></audio></span>' +
														'<i>' + item.img_caption + '</i>' +
														'</div>');
								}
								itemWrap.append(atom);
								list.append(itemWrap);
								// imgs.splice(i, 1);
							}
						});

						aList[type] = list;
					}

					return aList;
				},

				/**
				*  classes : json
				*  aList : json
				*/
				setLayout : function(classes, aList){
					let layout = $('<div class="popup-layout">' +
								'<div class="popup-layout-left"><ul></ul>' +
								'<div class="popup-upload"><input type="file"/><em>上 &nbsp; 传</em></div></div>' +
								'<div class="popup-layout-right"></div>' +
							  '</div>'),
							left = layout.find('.popup-layout-left'),
							right = layout.find('.popup-layout-right'),
							optList = left.find('ul'),
							_this = this;

					if(Lib.isJSON(classes)){
							for(let clas in classes){
								let opt = $('<li class="opt ' + clas + '">'+ classes[clas] +'</li>'),
									  block = $('<div class="block" data-class="' + clas + '"></div>');
								optList.append(opt);
								right.append(block);
							}
					}

					right.find('.block').each((i, ele) => {

						let type = $(ele).data('class');
						$(ele).append(aList[type]);
					});

					left.find('.opt').first().addClass('selected');
					right.find('.block').first().css('display','block').find('li').each((i, li) => {
						$(li).on('click', (e) =>{
							$(li).addClass('selected').siblings().removeClass('selected');
							_this._selectedLi = $(li);
						});
					});

					Kit.fn.easyTab(left.find('.opt'), right.find('.block'), 'selected', (block) => {
						_this._selectedLi = null;
						//切换
							block.siblings().find('.selected').removeClass('selected');
							block.find('li').each((i, li)=>{
								$(li).on('click', (e) =>{
									$(li).addClass('selected').siblings().removeClass('selected');
									_this._selectedLi = $(li);
								});
							});
					});
					this._layout = layout;
					this._loadBox = layout.find('.popup-upload');

					return layout;
				}
			}

			win.Layer = new Layer();

			Uploader = function(){

					if(Uploader.unique !== undefined){
						return Uploader.unique;
					}

					Uploader.unique = this;

					this._loadBar = null;
					this._upRate = null;
					this._percentType = null;
					this._rate = 0;
				}

 			Uploader.prototype = {
					initial : function(){},

					/*
					*  + param : json
					*   - inputer* : jquery selector or object
					*	  - wrap*    : jquery selector or object
					*   - startCallback : function (e)
					*   - progressCallback : funtcion (e)
					*   - endCallback : function (e)
					*   - url* : string 提交链接
					*   - name* : string 后台接收参数名，即传的键
					*   - percentType : number[0,1,2] 0:无，1：进度条，2：百分比
					*/
					upFile : function(param){
						var callbacks = {
						    	startCallback : $.isFunction(param.startCallback) ? param.startCallback : function(){},
						    	progressCallback : $.isFunction(param.progressCallback) ? param.progressCallback : function(){},
						    	endCallback : $.isFunction(param.endCallback) ? param.endCallback : function(){}
						    },
								_this = this;

						param.inputer.on('change', function(){
							var file = this.files[0],
								xhr = new XMLHttpRequest(),
								form = new FormData();

								//如果是上传音乐，则限制为MP3格式
								if(param.name === 'src'){
									if(file.type !== 'audio/mp3'){
										alert('请上传MP3格式的音乐！');
										return;
									}
								}

								//上传文件的不能大于2M
								if( file.size/(1024*1024) > 2){
									alert('上传的文件不能大于2M！');
									return;
								}

								form.append(param.name, file);

								//上传开始
								xhr.addEventListener('loadstart', (e) => {
									var type = param.percentType ? param.percentType : 1;
									_this.loadStart(type, param.wrap);
									callbacks.startCallback.call(_this, e);
								});

  							//上传进度
								xhr.upload.addEventListener('progress', (e) => {
									var rate = _this.loadProgress(e);
									callbacks.progressCallback.call(_this, e, rate);
								}, false);


								//上传结束
								xhr.addEventListener('loadend', (e) => {
									var data = JSON.parse(e.srcElement.responseText),
									     url = data.url,
									     name = data.file.name;
									_this.removeBar();
									callbacks.endCallback.call(_this, e, data);
								});

								xhr.open('POST', param.url);
								xhr.send(form);
						});
					},
					removeBar : function(){
						var _this = this;

						if(this._loadBar){
							this._loadBar.fadeOut(200, function(){
								_this._loadBar.remove();
							});
						}
					},
					loadProgress : function(e){
						var rate = null;

						if(e.lengthComputable){
							rate =Math.round((e.loaded * 100)/e.total);
						}

						this._rate = rate;

						if(this._percentType == 1){
							this._upRate.css({
								width : rate + '%'
							});
						}else if(this._percentType == 2){
							this._upRate.html(rate + '%');
						}

						return rate;
					},
					loadStart : function(percentType, wrap){
						var bar = null;

						switch(parseInt(percentType)){
							case 0 :  //不显示进度条
								return;
							    break;
							case 1 : //进度条的形式显示进度
							    bar = $('<div class="upload-bar">' +
							    	'<span class="upload-bar-wrap rectangle">' +
							    	'<i class="upload-bar-per scroll"></i>' +
							    	'</span></div>');
							    break;
							case 2 : //百分比形式显示进度
								bar = $('<div class="upload-bar">' +
									  '<span class="upload-bar-wrap round">' +
									  '<i class="upload-bar-per text"></i>' +
									  '</span></div>');
								break;
							default :
							     bar = $('<div class="upload-bar">' +
							    	'<span class="upload-bar-wrap rectangle">' +
							    	'<i class="upload-bar-per scroll"></i>' +
							    	'</span></div>');
						}

						this._percentType = percentType;
						if(bar){
							wrap.append(bar);
							this._loadBar = bar;
							this._upRate = bar.find('.upload-bar-per');
						}
					}
				}

			return {
				Layer : Layer,
				Form : Form,
				ImgAndBg : ImgAndBg,
				Uploader : Uploader
			}
	 })(window);

	return {
		CreateMag : CreateMag,
		CreatePage :　CreatePage,
		Config : Config,
		Init : Init,
		List : List,
		SavePreview : SavePreview,
		Kit : Kit
	}
})();
