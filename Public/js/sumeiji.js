$(function(){
     var f5Swiper = $('.f5Con div').swiper({
        mode:'horizontal',
        loop : true
        });
    $('.f5Con .prevBtn').on('click', function(e){
        e.preventDefault();
        f5Swiper.swipePrev();
    });
    $('.f5Con .nextBtn').on('click', function(e){
        e.preventDefault();
        f5Swiper.swipeNext();
    });

    var f6Swiper = $('.f6Box div').swiper({
        mode:'horizontal',
        loop : true
        });
    $('.f6Box .prevBtn').on('click', function(e){
        e.preventDefault();
        f6Swiper.swipePrev();
    });
    $('.f6Box .nextBtn').on('click', function(e){
        e.preventDefault();
        f6Swiper.swipeNext();
    });

    var f7Swiper = $('.f7Con div').swiper({
        mode:'horizontal',
        loop : true
        });
    $('.f7Con .prevBtn').on('click', function(e){
        e.preventDefault();
        f7Swiper.swipePrev();
    });
    $('.f7Con .nextBtn').on('click', function(e){
        e.preventDefault();
        f7Swiper.swipeNext();
    });
    $('.nav_tit li').on('click', function(){
        $(this).addClass('active').siblings().removeClass('active');
    })
    //焦点和失焦
    $('.fastApp ul li').on('focusin',function(){
        $('.footer').css({'display': 'none'});
    });
    $('.fastApp ul li').on('focusout',function(){
        $('.footer').css({'display': 'block'});
    }); 
});
/*!
 * NAME：定义Body
 */
var __body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
/*!
 * NAME：滚动页面至某处
 * 调用方法：onclick="pageScroll(place)"
 * place(string),要滚至位置的盒子(ID,'.class'),可以为数字，如 10
 * adjust(int),位置微调，可以为负值如 -125
 */
function pageScroll(place,adjust){
    var adjustVal = !isNaN(adjust) ? adjust : 0;
    if(isNaN(place)){
        var placeOffsetTop = $(place).offset().top + adjustVal;
    }else{
        var placeOffsetTop = place;
    }
    if(jQuery.easing.jswing){
        __body.animate({scrollTop:placeOffsetTop},1000,'easeInOutQuart');
    }else{
        __body.animate({scrollTop:placeOffsetTop},1000);
    }
    return false;
};