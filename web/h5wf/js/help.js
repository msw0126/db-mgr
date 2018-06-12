$(function(){
	var name = decodeURI(window.location.search.split('=')[1]);
	
	if(name!='undefined'){
		$("#help_title a").each(function(){
			$(this).removeClass('active')
			if($(this).attr('data-to')==name){
				$(this).addClass('active')
			}
		})
		
		jump(name)
	}
	//点击标题跳转到指定位置
	$('#help_title').on('click', 'li>a', function(e) {
		var target = e.target;
		var id = $(target).data("to");
		$("#help_title a").each(function(){
			$(this).removeClass('active')
		})
		$(this).addClass('active');
		jump(id)
	});	
	function jump(id){
		$('html,body').animate({
			scrollTop: $('#' + id).offset().top
		}, 500);
	}
})
