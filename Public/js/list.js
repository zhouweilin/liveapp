

//加载更多优惠
var defPage = 1;

function loadMore(id){
	var container = $('.content');
	var loader = $('.loader');
	var loaderText = $('.loader em');
	var moreTxt = $('.ajaxBtn .txt');
   
	defPage++;
	url = '/?c=show&a=addlist&id='+ id +'&p='+ defPage;

	$.ajax({
		type: "GET",
		url: url,
		beforeSend:function(){
			$(moreTxt).fadeOut(200);
			$(loaderText).text('正在努力加载…');
			$(loader).fadeIn(200);
		},
		success: function(data) {
			if(data){
				var result=$(data);
				$(container).append(result);
			}else{
				$(moreTxt).text('已经是最后一页了');
				$(loader).fadeOut();
			}
		},
		complete:function(){
			setTimeout(function(){
				$(loader).fadeOut(200);
			},500);
			setTimeout(function(){
				$(moreTxt).fadeIn(200);
			},500);	
		}
	});
}


