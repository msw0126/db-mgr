$(function() {
			var name = decodeURI(window.location.search.split('&&')[1].split('=')[1])
				document.title =  name
				//左侧导航切换
//				$('.one-list>li').click(function() {
//					console.log('7777')
//					if($(this).children('ul').is(':hidden')) {
//						$('.one-list>li').find('ul').hide();
//						$(this).children('ul').show();
//						$('.one-list>li').children('div').children('i').removeClass('index-list-jt-avtive');
//						$(this).children('div').children('i').addClass('index-list-jt-avtive');
//					} else {
//						$('.one-list>li').children('ul').hide();
//						$('.one-list>li').children('div').children('i').removeClass('index-list-jt-avtive');
//						$('.nav-lists>li').children('div').children('i').removeClass('index-list-jt-avtive');
//					};
//				});
				$('.one-list>li').click(function() {
					var ul_hidden = $(this).parent().next()
					if(ul_hidden.is(':hidden')) {
						$('.one-list>li').find('ul').hide();
						ul_hidden.show();
						$('.one-list>li').children('div').children('i').removeClass('index-list-jt-avtive');
						$(this).children('div').children('i').addClass('index-list-jt-avtive');
					} else {
						ul_hidden.hide();
						$('.one-list>li').children('div').children('i').removeClass('index-list-jt-avtive');
						$('.nav-lists>li').children('div').children('i').removeClass('index-list-jt-avtive');
					};
				});
				$('.nav-lists>li').click(function() {
					if($(this).children('ul').is(':hidden')) {
						$('.nav-lists>li').children('ul').hide();
						$(this).children('ul').show();
						$('.nav-lists>li').children('div').children('i').removeClass('index-list-jt-avtive');
						$(this).children('div').children('i').addClass('index-list-jt-avtive');
					} else {
						$('.nav-lists>li').children('ul').hide();
						$('.nav-lists>li').children('div').children('i').removeClass('index-list-jt-avtive');
					};
					if($(this).text() == 'gbm') {
						console.log(1);
					};
					return false;
				});
				$('.nav-listss>li').click(function() {
					return false;
				});

				//计算中间宽度
				function width() {
					var wind_width = $(window).width();
					$('.index-content').width(wind_width - 466);
					$('.content-center-sub').css('margin-left', (wind_width - 854) / 2 + 'px');
				}
				width()
				window.onresize = function() {
					width()
				}
			});