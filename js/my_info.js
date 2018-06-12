$(function() {
	if(sessionStorage.getItem('user_info_id')) {
		$.ajax({
			type: 'get',
			url: urlstr + 'userMessageController/userMessageList?token='+token,
			data: {
				userId: sessionStorage.getItem('userId'),
				page: 1,
				rows: 9
			},
			success: function(data) {
				if(data.code == "000") {
					var my_info = data.pageInfo.list;
					$(".detail_content_title>div").remove();
					$(".detail_content_title>span").remove();
					$(".info_list").hide()
					$(".detail_content").show()
					$(".y-content").css('height', '805px');
					$(".title-second").show()
					var id = sessionStorage.getItem('user_info_id')
					for(var i = 0; i < my_info.length; i++) {
						if(id == my_info[i].id) {
							var message_content = JSON.parse(my_info[i].content)
							$(".detail_content_title").append('<div>' +
								'<span>' + my_info[i].title + '</span><a target="_blank" href="web/h5wf/index.html?projectID=' + message_content.projectId + '&projectName='+message_content.projectName+'">点击查看</a>' +
								'	</div>' +
								'	<span>' + formatDate_new(new Date(my_info[i].createTime)) + '</span>')
						}
					}
					$.ajax({
						type: 'get',
						url: urlstr + 'userMessageController/modifyStatus?token='+token,
						data: {
							id: id
						},
						success: function(data) {
							//								console.log(data)
						},
						error: function(data) {
							console.log(data)
						}
					});
					$(".detail_content button").click(function() {
						sessionStorage.removeItem("user_info_id")
						$(".info_list").show()
						$(".detail_content").hide()
						$(".y-content").css('height', '810px');
						$(".title-second").hide()
						user_info()
					});
				}else if(data.code=="110"){
        				location.href='login.html'
        			}

			},
			error: function(data) {
				console.log(data)
			}
		});
	} else {
		$(".y-content").css('height', '810px');
		$(".detail_content button").click(function() {
			$(".info_list").show()
			$(".detail_content").hide()
			$(".y-content").css('height', '810px');
			$(".title-second").hide()
			user_info()
		});
		user_info()
	}

	function user_info() {
		$.ajax({
			type: 'get',
			url: urlstr + 'userMessageController/userMessageList?token='+token,
			data: {
				userId: sessionStorage.getItem('userId'),
				page: 1,
				rows: 9
			},
			success: function(data) {
				if(data.code == "000") {
					page(data.pageInfo.pages)
					$(".my_info-list li").not(':first-child').remove()
					var my_info = data.pageInfo.list;
					if(my_info.length > 0) {
						$(".info-total p span").text(data.pageInfo.total+1);
						if(data.unReadSum>0){
							$(".info_num").css('display','inline-block')
							$(".info_num").text(data.unReadSum)
						}else{
							$(".info_num").hide()
						}
						
						for(var i = 0; i <my_info.length ; i++) {
							if(my_info[i].status == "0") {
								$(".my_info-list").append('<li>' +
									'<div class="my_info-title1"><i class="icon iconfont icon-xitongxiaoxi"></i><span>' + my_info[i].title + '</span><span class="my-info-tishi1"></span></div>' +
									'<div class="my_info-time1">' + formatDate(new Date(my_info[i].createTime)) + '</div>' +
									'<input type="hidden" value="' + my_info[i].id + '"/>' +
									'</li>')
							} else {
								$(".my_info-list").append('<li>' +
									'<div class="my_info-title"><i class="icon iconfont icon-xitongxiaoxi"></i><span>' + my_info[i].title + '</span><span class="my-info-tishi"></span></div>' +
									'<div class="my_info-time">' + formatDate(new Date(my_info[i].createTime)) + '</div>' +
									'<input type="hidden" value="' + my_info[i].id + '"/>' +
									'</li>')
							}
						}
						$(".my_info-list li").not(':first-child').click(function() {
							$(".detail_content_title>div").remove();
							$(".detail_content_title>span").remove();
							$(".info_list").hide()
							$(".detail_content").show()
							$(".y-content").css('height', '805px');
							$(".title-second").show()
							var id = $(this).children('input').val()
							for(var i = 0; i < my_info.length; i++) {
								if(id == my_info[i].id) {
									var message_content = JSON.parse(my_info[i].content)
//									console.log(message_content.projectName)
									$(".detail_content_title").append('<div>' +
										'<span>' + my_info[i].title + '</span><a target="_blank" href="web/h5wf/index.html?projectID=' + message_content.projectId + '&projectName='+message_content.projectName+'">点击查看</a>' +
										'	</div>' +
										'	<span>' + formatDate_new(new Date(my_info[i].createTime)) + '</span>')
								}
							}
							$.ajax({
								type: 'get',
								url: urlstr + 'userMessageController/modifyStatus?token='+token,
								data: {
									id: id
								},
								success: function(data) {
									//								console.log(data)
								},
								error: function(data) {
									console.log(data)
								}
							})
						});
					}

				}else if(data.code=="110"){
        				location.href='login.html'
        			} else {
//					$(".info_list").html("")
//					$(".info_list").append('<div class="card_null"><img class="card_img" src="img/pic_message_blank.png" alt="" /><span class="white_page">您还没有消息哦~</span></div> ')
//					$('.card_null').css('margin-top', '210px')
				}
			},
			error: function(data) {
				console.log(data)
			}
		});
	};
	$('.my_info-list>li:first-child').click(function(){
		window.open('http://pan.baidu.com/s/1hrJNo12');
	});
	//分页
	function page(page) {
		$('.M-box3').pagination({
			pageCount: page,
			jump: true,
			coping: true,
			prevContent: '<',
			nextContent: '>',
			callback: function(api) {
				$(".jump-ipt").after('<span class="span_add">页</span>');
				$(".jump-ipt").before('<p class="p_add">共<span class="span_add span_add1">' + page + '</span>页，到第</p>');
	    		$.ajax({
				type: 'get',
				url: urlstr + 'userMessageController/userMessageList?token='+token,
				data: {
					userId: sessionStorage.getItem('userId'),
					page: api.getCurrent(),
					rows: '9'
				},
			success: function(data) {
				if(data.code == "000") {
//					page(data.pageInfo.pages)
					$(".my_info-list li").not(':first-child').remove()
					var my_info = data.pageInfo.list;
					if(my_info.length > 0) {
						$(".info-total p span").text(data.pageInfo.total+1);
						if(data.unReadSum>0){
							$(".info_num").css('display','inline-block')
							$(".info_num").text(data.unReadSum)						
						}else{
							$(".info_num").hide()
						}
						for(var i = 0; i <my_info.length ; i++) {
							if(my_info[i].status == "0") {
								$(".my_info-list").append('<li>' +
									'<div class="my_info-title1"><i class="icon iconfont icon-xitongxiaoxi"></i><span>' + my_info[i].title + '</span><span class="my-info-tishi1"></span></div>' +
									'<div class="my_info-time1">' + formatDate(new Date(my_info[i].createTime)) + '</div>' +
									'<input type="hidden" value="' + my_info[i].id + '"/>' +
									'</li>')
							} else {
								$(".my_info-list").append('<li>' +
									'<div class="my_info-title"><i class="icon iconfont icon-xitongxiaoxi"></i><span>' + my_info[i].title + '</span><span class="my-info-tishi"></span></div>' +
									'<div class="my_info-time">' + formatDate(new Date(my_info[i].createTime)) + '</div>' +
									'<input type="hidden" value="' + my_info[i].id + '"/>' +
									'</li>')
							}
						}
						$(".my_info-list li").not(':first-child').click(function() {
							$(".detail_content_title>div").remove();
							$(".detail_content_title>span").remove();
							$(".info_list").hide()
							$(".detail_content").show()
							$(".y-content").css('height', '805px');
							$(".title-second").show()
							var id = $(this).children('input').val()
							for(var i = 0; i < my_info.length; i++) {
								if(id == my_info[i].id) {
									var message_content = JSON.parse(my_info[i].content)
//									console.log(message_content.projectName)
									$(".detail_content_title").append('<div>' +
										'<span>' + my_info[i].title + '</span><a target="_blank" href="web/h5wf/index.html?projectID=' + message_content.projectId + '&projectName='+message_content.projectName+'">点击查看</a>' +
										'	</div>' +
										'	<span>' + formatDate_new(new Date(my_info[i].createTime)) + '</span>')
								}
							}
							$.ajax({
								type: 'get',
								url: urlstr + 'userMessageController/modifyStatus?token='+token,
								data: {
									id: id
								},
								success: function(data) {
									//								console.log(data)
								},
								error: function(data) {
									console.log(data)
								}
							})
						});
					}else{
						$(".info_num").hide()
					}

				}else if(data.code=="110"){
        				location.href='login.html'
        			} else {
//					$(".info_list").html("")
//					$(".info_list").append('<div class="card_null"><img class="card_img" src="img/pic_message_blank.png" alt="" /><span class="white_page">您还没有消息哦~</span></div> ')
//					$('.card_null').css('margin-top', '210px')
				}
			},
				error: function(data) {
					console.log(data)
				}
			});  
			}
		});
		if(page > 1) {
			$(".jump-btn").attr("disabled", false);
			$(".jump-btn").css("color", '#858585');
			$(".jump-btn").hover(function() {
				$(this).css({
					background: '#2992f1',
					color: '#ffffff'
				});
			}, function() {
				$(this).css({
					background: '#eeeff3',
					color: '#858585'
				});
			});
		} else {
			$(".jump-btn").attr("disabled", true);
			$(".jump-btn").css("color", '#cbcbcb');
			$(".jump-btn").css("background", '#eeeff3');
			$(".jump-btn").hover(function() {
				$(this).css({
					background: '#eeeff3'
				});
			});
		};		
		$(".jump-ipt").after('<span class="span_add">页</span>');
		$(".jump-ipt").before('<p class="p_add">共<span class="span_add span_add1">' + page + '</span>页，到第</p>');
	};

	function formatDate(now) {
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		return year + "-" + add(month) + "-" + add(date) + "   "+ add(hour) + ":" + add(minute) + ":" + add(second);
	};

	function formatDate_new(now) {
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var second = now.getSeconds();
		return year + "-" + add(month) + "-" + add(date) + "   " + add(hour) + ":" + add(minute) + ":" + add(second);
	};
	//	return year + "-" + month + "-" + date + "   " + add(hour) + ":" + add(minute) + ":" + add(second);
	function add(mm) {
		if(mm < 10) {
			return "0" + mm
		} else {
			return mm
		}
	};
});