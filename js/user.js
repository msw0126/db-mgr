$(function() {
	if(sessionStorage.token) {
		$('.user_role_select').click(function(){
			$("#user_role").slideToggle();
		});
		$("#user_role li").click(function(){
			$('.user_role_select span').text($(this).children('span').text());
			$('.user_role_select input').val($(this).children('input').val());
			$("#user_role").slideToggle();
		});
		$('.user_role_select1').click(function(){
			$("#user_role1").slideToggle();
		});
		$("#user_role1 li").click(function(){
			$('.user_role_select1 span').text($(this).children('span').text());
			$('.user_role_select1 input').val($(this).children('input').val());
			$("#user_role1").slideToggle();
		});
        //清楚点击时候的缓存
        sessionStorage.removeItem('user_info_id');
		$(".user_status").click(function() {
			$(this).addClass('role_checked').siblings().removeClass('role_checked');
		});
		$("#status li span").click(function(){
			$(this).addClass('fenlei_span').parent().siblings().children('span').removeClass('fenlei_span');
		});
		$("#myModal_user").on("hidden.bs.modal", function() {
			$("#user_nick_name").val('');
			$("#username").val('');
			$("#mobile").val('');
			$("#email").val('');
			$(".tishi").css('display', 'none');
			$(".yanzheng").css('display', 'none');
			$(".star").css('color', '#e7e7eb');
			$(".user_role_title span").text('数据科学家');
			$(".user_role_title input").val('data_science');
		});
		$("#myModal_user_changePwd").on("hidden.bs.modal", function() {
			$(this).find('input').not('input[type=button]').val("")
				// $(".user_role_title span").text('数据科学家')
		});
		//--------------------------搜索-------------------------
		$(".shiyan-search input").focus(function(){
			$(this).parent().css('border-color','#2992f1')
			$(this).siblings().css('color','#2992f1')
		});
		$(".shiyan-search input").blur(function(){
			$(this).parent().css('border-color','#dcdde2')
			$(this).siblings().css('color','#cdd1d7')
		});
		$(".user-key .icon-sousuo").click(function() {
				var same_data = $(".shiyan-search input").val()
				userList("", same_data);
	    });
		$(".role li").each(function(){
			$(this).children('span:first-child').click(function(){
				var userTypes = '';
				if($(this).hasClass('role_checked')){
					$(this).removeClass('role_checked');
				}else{
					$(this).addClass('role_checked');
				}
				if($(".role li .role_checked").length==0 || $(".role li .role_checked")==3){
					userTypes="data_science,IT_engineer,biz_data"
				}else{
					var userarr = []
					for(var i=0;i<$(".role li .role_checked").length;i++){
						userarr.push($(".role li .role_checked").eq(i).siblings('input').val());
					}
//					console.log(userarr)
					userTypes=userarr.join(',')
				}
                userList(userTypes, "");
			})
		});
		
			//------------------------列表信息-----------------------------
		function userList(userTypes, mobile) {
			var pageNo = "1"
			var pageSize = "10"
			var username = "";
			var usernickname = "";
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysUserController/userList.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userName': username,
					'userNickName': usernickname,
					'mobile': mobile,
					'userType': userTypes,
					'pageNo': pageNo,
					'pageSize': pageSize
				}),
				success: function(data) {
					if(data.code == "000") {
						page(data.userCountPage,userTypes,mobile)
						$(".y-content").css('height', '1158px');
						$(".shiyan-ul>li").not(":nth-child(1)").remove();
						var userlist = data.userList;
						if(userTypes || mobile) {
							$(".shiyan-main img").remove();
							$(".shiyan-main .card_null").remove();
							if(userlist.length == 0) {
								$(".M-box3").hide()
								$(".shiyan-main").append('<div class="card_null"><img class="card_img" src="img/pic_search_blank.png" alt="" /><span class="white_page">暂无数据哦~</span></div>');
								$(".y-content").css('height', '805px');
								$('.card_null').css('margin-top','110px')
							} else {
								$(".M-box3").show()
								$(".shiyan-main .card_null").remove();
							}
						}
						for(var i = 0; i < userlist.length; i++) {
							if(userlist[i].userType == 'data_science') {
								userlist[i].userType = '数据科学家';
							} else if(userlist[i].userType == 'IT_engineer') {
								userlist[i].userType = 'IT工程师';
							} else if(userlist[i].userType == 'admin') {
								userlist[i].userType = '管理员';
							}else {
								userlist[i].userType = '数据业务人员';
							};
							if(userlist[i].userStatus == "1") {
								addlist("","", userlist[i], '正常', userlist[i].userType, "", '失效','img/icon_sx.png');

							} else {
								addlist('role_li_shixiao','ban_color', userlist[i], '失效', userlist[i].userType, "", '正常','img/icon_yx.png');
							};
							
							if($(".shiyan-ul-ul").eq(i).find('.role_li_first').text()=='admin' && $(".shiyan-ul-ul").eq(i).find('.role_li_five>span').text()=='管理员'){
								
								$(".shiyan-ul-ul").eq(i).find('.role_li_six>ul>li:last-child').remove()
							}
						}
						
                        $(".role_li_six li:nth-child(3)").hover(function(){
                        	if($(this).find('em').css('background-image')=='url("http://127.0.0.1:8020/web_data/img/icon_sx.png")'){
                        		$(this).find('em').css('background','url("img/icon_sx_clk.png") no-repeat')
                        	}else{
                        		$(this).find('em').css('background','url("img/icon_yx_clk.png") no-repeat')
                        	}
                        },function(){
                        	if($(this).find('em').css('background-image')=='url("http://127.0.0.1:8020/web_data/img/icon_sx_clk.png")'){
                        		$(this).find('em').css('background','url("img/icon_sx.png") no-repeat')
                        	}else{
                        		$(this).find('em').css('background','url("img/icon_yx.png") no-repeat')
                        	}                    	
                        })
						same();
					}

				},
				error: function(textStatus, errorThrown) {
					console.log(textStatus);
				}
			});

		}
		userList();
		//分页
		function page(page,userTypes,mobile){
			$('.M-box3').pagination({
			pageCount:page,
			jump: true,
			coping: true,
			prevContent: '<',
			nextContent: '>',
			callback:function(api){
			  	var data={
			  		'pageNo': api.getCurrent(),
					'pageSize': '10',
					'mobile': mobile,
					'userType': userTypes
			  	};
  				$(".jump-ipt").after('<span class="span_add">页</span>');
				$(".jump-ipt").before('<p class="p_add">共<span class="span_add span_add1">' + page + '</span>页，到第</p>');
				$.ajax({
					type: 'POST',
					url: urlstr + 'sysUserController/userList.do?token=' + sessionStorage.getItem('token'),
					dataType: 'json',
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify(data),
					success: function(data) {
						if(data.code == "000") {
							sessionStorage.user_page=data.userCountPage;
							$(".y-content").css('height', '1158px');
							$(".shiyan-ul>li").not(":nth-child(1)").remove();
							var userlist = data.userList;
							if(userTypes) {
								$(".shiyan-main img").remove();
								if(userlist.length == 0) {
									$(".M-box3").hide()
									$(".shiyan-main").append('<div class="card_null"><img class="card_img" src="img/pic_search_blank.png" alt="" /><span class="white_page">暂无数据哦~</span></div>');
									$(".y-content").css('height', '805px');
									$('.card_null').css('margin-top','110px')
								} else {
									$(".M-box3").show()
									$(".shiyan-main .card_null").remove();
								}
							}
							for(var i = 0; i < userlist.length; i++) {
								if(userlist[i].userType == 'data_science') {
									userlist[i].userType = '数据科学家';
								} else if(userlist[i].userType == 'IT_engineer') {
									userlist[i].userType = 'IT工程师';
								}else if(userlist[i].userType == 'admin') {
									userlist[i].userType = '管理员';
								} else {
									userlist[i].userType = '数据业务人员';
								};
								if(userlist[i].userStatus == "1") {
									addlist("","", userlist[i], '正常', userlist[i].userType, "", '失效','img/icon_sx.png');
	
								} else {
									addlist('role_li_shixiao','ban_color', userlist[i], '失效', userlist[i].userType, "", '正常','img/icon_yx.png');
								};
							}
							same();
						}
	
					},
					error: function(textStatus, errorThrown) {
						console.log(textStatus);
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
				$(".jump-btn").css({
					'color':'#cbcbcb',
					'background':'#eeeff3'
				});
				$(".jump-btn").hover(function() {
					$(this).css({
						background: '#eeeff3'
					});
				});
			};
			$(".jump-ipt").after('<span class="span_add">页</span>');
			$(".jump-ipt").before('<p class="p_add">共<span class="span_add span_add1">' + page + '</span>页，到第</p>');
    }
		function addlist(classli,lili, data, userStatus, userType, more, shixiao,shixiao_icon) {
			$(".shiyan-ul ").append('<li class="' + classli + ' ' + more + '">' +
				'<ul class="shiyan-ul-ul">' +
				'<li class="shiyan-li_first role_li_first '+lili+'"><span>' + data.userName + '</span><input class="hidden_userid" type="hidden" value="' + data.userId + '"/></li>' +
				'<li class="shiyan-li_fourth role_li_fourth">' +
				'<span class="'+lili+'">' + data.mobile + '</span>' +
				'</li>' +
				'<li class="shiyan-li_five role_li_five">' +
				'<span class="'+lili+'">' + userType + '</span>' +
				'</li>' +
				'<li class="shiyan-li_second role_li_second ">' +
				'<span class="'+lili+'">' + userStatus + '</span>' +
				'<input class="hidden_status" type="hidden" value="' + data.userStatus + '"/>' +
				'<span class="border_tro_right1"></span>'+
				'</li>' +
				'<li class="shiyan-li_six role_li_six">' +
				'<ul>' +
				'<li>' +
				'<div>' +
				'<em class="user_edit"></em>' +
				'<span>修改</span>' +
				'</div>' +
				'</li>' +
				'<li>' +
				'<div class="css_pwd">' +
				'<em class="user_em_pwd"></em>' +
				'<span>重置密码</span>' +
				'</div>' +
				'</li>' +
				'<li class="user_status_change">' +
				'<div>' +
//				'<span class="icon iconfont '+shixiao_icon+'"></span>' +
				'<em class="user_shixiao" style="background: url('+shixiao_icon+') no-repeat;"></em>' +
				'<span class="status_text">' + shixiao + '</span>' +
				'</div>' +
				'</li>' +
				'<li>' +
				'<div>' +
				'<em class="user_em_dele"></em>' +
				'<span>删除</span>' +
				'</div>' +
				'</li>' +
				'</ul>' +
				'</li>' +
				'</ul>' +
				'</li>');
		}

		//----------------------------添加信息------------------------
		$(".shiyan-add").click(function() {
			$("#myModal_user").modal();
		})
		$("#user_sub").click(function() {
			if($("#username").val().length !== 0) {
				var en_name = /^[A-Za-z_]+$/;
				if(en_name.test($('#username').val())) {
					$(".tishi").eq(0).hide()
					$.ajax({
						type: 'POST',
						url: urlstr + 'sysUserController/userNameCheck.do?token=' + sessionStorage.getItem('token'),
						dataType: 'json',
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify({
							'userName': $('#username').val()
						}), //提交json字符串数组，如果提交json字符串去掉[]   
						success: function(data) {
							if(data.code == "000") {
								$('.tishi').eq(2).addClass('yanzheng')

							} else {
								$('.tishi').eq(2).removeClass('yanzheng')
								var username = $("#username").val();
//								var usernickname = $("#user_nick_name").val();
								var mobile = $("#mobile").val();
								var email = $("#email").val();
								var rolecode = $('#myModal_user .user_role_select input').val();
								var userType = $('#myModal_user .user_role_select input').val();
								var userStatus='';
								$("#status li").each(function(){
									if($(this).children('span').hasClass('fenlei_span')){
										userStatus = $(this).children().siblings('input').val()
									}
								})
								$.ajax({
									type: 'POST',
									url: urlstr + 'sysUserController/userAdd.do?token=' + sessionStorage.getItem('token'),
									dataType: 'json',
									contentType: 'application/json;charset=UTF-8',
									data: JSON.stringify({
										'userName': username,
										'userNickName': "",
										'mobile': mobile,
										'email': email,
										'userType': userType,
										'userStatus': userStatus,
										'rolecode': rolecode
									}),
									success: function(data) {
										
										if(data.code == "000") {
											$("#myModal_user").modal('hide');
											userList();
											$("#username").val("");
											$("#user_nick_name").val("");
											$("#mobile").val("");
											$("#email").val("");
										}

									},
									error: function(textStatus, errorThrown) {
										console.log(textStatus);
									}
								});

							}
						},
						error: function(textStatus, errorThrown) {
							console.log(textStatus);
						}
					});

				} else {
					$(".tishi").eq(0).text('用户名格式为英文')
					$(".tishi").eq(0).show()
					$(".tishi").eq(0).hide()
				}

			} else {
				if($("#username").val().length == 0) {
					$(".tishi").eq(0).show()
					$(".star").eq(0).css('color', 'red')

				}
			}

		})

		function same() {
			//------------------------删除信息----------------------------

			$(".role_li_six li:last-child").click(function() {
				$("#myModal_alert_new").modal()
				id = $(this).parents('li').eq(1).find('.hidden_userid').val()
				$(".confirm_content ").text("您正在删除人员" + $(this).parents('li').eq(1).find('.role_li_first').text() + "，您确定该操作吗？")
			})

			//----------------------修改信息-----------------------------
			$(".role_li_six li:nth-child(1)").click(function() {
					$("#myModal_user_new").modal()
					var id = $(this).parents('li').eq(1).find('.hidden_userid').val()
					userDetailshow(id)
				})
				//-------------------修改密码-------------------------
			$(".role_li_six li:nth-child(2)").click(function() {
					$("#myModal_user_changePwd").modal()
					var id = $(this).parents('li').eq(1).find('.hidden_userid').val()
					userDetailpwd(id)
				})
				//------------------------修改状态---------------------------
			$(".role_li_six li:nth-child(3)").click(function() {
				var id = $(this).parents('li').eq(1).find('.hidden_userid').val()
				var status = $(this).parents('li').eq(1).find('.hidden_status').val()
				if(status == "1") {
					$(this).parents('li').eq(1).addClass('role_li_shixiao')
					$(this).parents('li').eq(1).find('.role_li_second span:first-child').html('失效')
					$(this).parents('li').eq(1).find('.role_li_second input').val('0')
					$(this).find('div>em').css('background','url("img/icon_yx_clk.png") no-repeat')
					$(this).hover(function(){
						$(this).find('div>em').css('background','url("img/icon_yx_clk.png") no-repeat')
					},function(){
						$(this).find('div>em').css('background','url("img/icon_yx.png") no-repeat')
					})
					$(this).find('.status_text').text('正常')
					$(this).parents('.shiyan-ul-ul').find('.role_li_first').addClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.role_li_fourth span').addClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.role_li_five span').addClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.role_li_second span').addClass('ban_color')
					userChangeStatus(id, "0")
					$(".alert_success img").attr('src', 'img/green.png')
					$(".alert_content").html('禁用成功')
					$(".alert_success").show()
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);

				} else {
					$(this).parents('li').eq(1).removeClass('role_li_shixiao')
					$(this).parents('li').eq(1).find('.role_li_second span:first-child').html('正常')
					$(this).parents('li').eq(1).find('.role_li_second input').val('1')
					$(this).find('div>em').css('background','url("img/icon_sx_clk.png") no-repeat')
					$(this).hover(function(){
						$(this).find('div>em').css('background','url("img/icon_sx_clk.png") no-repeat')
					},function(){
						$(this).find('div>em').css('background','url("img/icon_sx.png") no-repeat')
					})
					$(this).find('.status_text').text('失效')
					$(this).parents('.shiyan-ul-ul').find('.role_li_first').removeClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.role_li_fourth span').removeClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.role_li_five span').removeClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.role_li_second span').removeClass('ban_color')
					userChangeStatus(id, "1")
					$(".alert_success img").attr('src', 'img/green.png')
					$(".alert_content").html('解禁成功')
					$(".alert_success").show()
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
				}
			})
		}
		//-------------------------------------刪除数据---------------------------

		$("#myModal_alert_new .queding").click(function() {
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysUserController/userDel.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userId': id
				}), //提交json字符串数组，如果提交json字符串去掉[]   
				success: function(data) {
					if(data.code == "000") {
						$(".alert_success img").attr('src', 'img/green.png')
						$(".alert_content").html('删除成功！')
						$(".alert_success").show()
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
						$("#myModal_alert_new").modal('hide')
						$(".role_li_first ").each(function() {
							if($(this).children('input').val() == id) {
								$(this).parent().parent().remove()
							}
						})
					} else {
						$(".alert_success img").attr('src', 'img/error.png')
						$(".alert_content").html('删除失败！')
						$(".alert_success").show()
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
					}

				},
				error: function(textStatus, errorThrown) {
					console.log(textStatus);
				}
			});

		})

		//------------------------修改数据------------------------------
		function userDetailshow(userId) {
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysUserController/userDetail.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userId': userId
				}), //提交json字符串数组，如果提交json字符串去掉[]   
				success: function(data) {
					sessionStorage.removeItem('user_ID')
					if(data.code == "000") {
						var userlist = data.sysUser
						$("#username1").val(userlist.userName)
						$("#user_nick_name1").val(userlist.userNickName)
						$("#mobile1").val(userlist.mobile)
						$("#email1").val(userlist.email)
						if(userlist.userType == 'data_science') {
							$(".user_role_select1 span").text('数据科学家')
							$(".user_role_select1 input").val('data_science')
						} else if(userlist.userType == 'IT_engineer') {
							$(".user_role_select1 span").text('IT工程师')
							$(".user_role_select1 input").val('IT_engineer')
						} else {
							$(".user_role_select1 span").text('数据业务人员')
							$(".user_role_select1 input").val('biz_data')
						}
						sessionStorage.setItem('user_ID', userId)
					}
				},
				error: function(textStatus, errorThrown) {
					console.log(textStatus);
				}
			});
		}

		$('#user_sub1').click(function() {
			var username = $("#username1").val()
//			var usernickname = $("#user_nick_name1").val()
			var mobile = $("#mobile1").val()
			var email = $("#email1").val()
			var rolecode = $('.user_role_select1 input').val(),
				userType = $('.user_role_select1 input').val()
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysUserController/userModify.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userId': sessionStorage.user_ID,
					'userName': username,
					'userNickName': "",
					'mobile': mobile,
					'email': email,
					'rolecode': rolecode,
					'userType': userType

				}), //提交json字符串数组，如果提交json字符串去掉[]   
				success: function(data) {
					if(data.code == "000") {
						$(".role_li_first").each(function() {
							if($(this).children('input').val() == sessionStorage.user_ID) {
								if(userType == 'data_science') {
									$(this).parent().find('.role_li_five span:last-child').text("数据科学家")
								} else if(userType == 'IT_engineer') {
									$(this).parent().find('.role_li_five span:last-child').text("IT工程师")
								} else {
									$(this).parent().find('.role_li_five span:last-child').text("数据业务人员")
								}
								$(this).children('span').text(username)
								$(this).parent().find('.role_li_fourth span:last-child').text(mobile)
							}
						})
						$(".alert_success img").attr('src', 'img/green.png')
						$("#myModal_user_new").modal('hide')
						$(".alert_content").html('修改成功')
						$(".alert_success").show()
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
					} else {
						$(".alert_success img").attr('src', 'img/error.png')
						$(".alert_content").html('修改失败！')
						$(".alert_success").show()
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
					}

				},
				error: function(textStatus, errorThrown) {
					console.log(textStatus);
				}
			});

		})

		//--------------验证用户名是否已存在--------------
		function checkName(username) {
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysUserController/userNameCheck.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userName': username
				}), //提交json字符串数组，如果提交json字符串去掉[]   
				success: function(data) {
					if(data.code == "000") {
						$('.tishi').eq(0).addClass('yanzheng')
						$('.tishi').eq(0).text('姓名已存在')

					} else {
						$('.tishi').eq(0).removeClass('yanzheng')
                        $('.tishi').eq(0).text('此项为必填')
					}
				},
				error: function(textStatus, errorThrown) {
					console.log(textStatus);
				}
			});
		}
		//--------------------------重置密码时使用的信息------------
		function userDetailpwd(userId) {
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysUserController/userDetail.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userId': userId
				}), //提交json字符串数组，如果提交json字符串去掉[]   
				success: function(data) {
					if(data.code == "000") {
						$("#cz_username").val(data.sysUser.userName)
					} else {

					}
				},
				error: function(textStatus, errorThrown) {
					console.log(textStatus);
				}
			});
		}
		//--------------------修改密碼-----------------------
		$("#user_pwd").click(function() {
			var data = $("input[name=password]").map(function() {
				return $(this).val()
			})

			if(data[0] == data[1]) {
				var userName = $("#cz_username").val()
				var userNewPwd = $("#password").val()
				var userOrderPwd = $("#old_pwd").val()
				$.ajax({
					type: 'POST',
					url: urlstr + 'sysAuthLogController/changePwd.do?token=' + sessionStorage.getItem('token'),
					dataType: 'json',
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify({
						'userName': userName,
						'userNewPwd': userNewPwd,
						'userOrderPwd': userOrderPwd
					}), //提交json字符串数组，如果提交json字符串去掉[]   
					success: function(data) {
						if(data.code == '000') {
							$("#myModal_user_changePwd").modal('hide')
							$("#cz_username").val('')
							$("input[name=password]").val('')
							$("#old_pwd").val('')
							$(".alert_success img").attr('src', 'img/green.png')
							$(".alert_content").html('修改成功！')
							$(".alert_success").show()
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);
						} else {
							$(".movess").addClass('yanzheng')
							$("#old_pwd").val('')
							$(".alert_success img").attr('src', 'img/error.png')
							$(".alert_content").html('修改失败！')
							$(".alert_success").show()
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);
						}

					},
					error: function(textStatus, errorThrown) {
						console.log(textStatus);
						$("#cz_username").val('')
						$("input[name=password]").val('')
						$("#old_pwd").val('')
					}
				});
			} else {
				$(".moves").addClass('yanzheng')
				$("input[name=password]").val('')
			}

		})
		$("input[name=password]").keyup(function() {
			$(".moves").removeClass('yanzheng')
		})
		$("#old_pwd").keyup(function() {
				$(".movess").removeClass('yanzheng')
			})
			//---------------------------------改變状态----------------
		function userChangeStatus(userId, userStatus) {
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysUserController/userChangeStatus.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userId': userId,
					'userStatus': userStatus
				}), //提交json字符串数组，如果提交json字符串去掉[]   
				success: function(data) {
					if(data.code == "000") {
						//				$(".alert_success").html('禁用成功')
						//				$(".alert_success").show()
						//				setTimeout(function(){$(".alert_success").hide();}, 1000);
					} else {

					}
				},
				error: function(textStatus, errorThrown) {
					console.log(textStatus);
				}
			});
		}
		//-------------------------表单验证--------------------------

		$("#username").blur(function() {
			if($(this).val().length == 0) {
				$(".tishi").eq(1).show()
				$(".star").eq(1).css('color', 'red')
			} else {
				var en_name = /^[A-Za-z_]+$/;
				if(en_name.test($('#username').val())) {
					$(".tishi").eq(0).hide()
					$(".tishi").eq(0).text('此项为必填')
					checkName($(this).val())

				} else {
					$(".tishi").eq(0).text('用户名格式为英文')
					$(".tishi").eq(0).show()
				}

			}

		});
		$("#username").keyup(function() {
			$('.tishi').removeClass('yanzheng')
			$(".tishi").eq(0).hide()
			$(".star").eq(0).hide()
				//			$(".yanzheng").eq(1).hide()

		})
//		$("#user_nick_name").keyup(function() {
//				$('.tishi').eq(0).removeClass('yanzheng')
//				if($(this).val().length == 0) {
//					$(" .tishi").eq(0).show()
//					$(".star").eq(0).css('color', 'red')
//				} else {
//					$(".tishi").eq(0).hide()
//					$(".star").eq(0).css('color', '#e7e7eb')
//				}
//			})
			//		$("#username1").keyup(function() {
			//			$('.tishi').eq(1).removeClass('yanzheng')
			//			if($(this).val().length == 0) {
			//				$("#myModal_user_new .tishi").eq(0).show()
			//				$("#myModal_user_new .star").eq(0).css('color', 'red')
			//			} else {
			//				$("#myModal_user_new .tishi").eq(0).hide()
			//				$("#myModal_user_new .star").eq(0).css('color', '#e7e7eb')
			//			}
			//		})
			//		$("#username").blur(function() {
			//			var en_name = /^[A-Za-z_]+$/;
			//			if(en_name.test($('#username').val())) {
			//				$(".tishi").eq(2).hide()
			//			} else {
			//				$(".tishi").eq(2).text('用户名格式为英文')
			//				$(".tishi").eq(2).show()
			//			}
			//		})
		$("#username").keyup(function() {
			if($(this).val().length == 0) {
				$(".tishi").eq(1).text('此项为必填')
				$(".tishi").eq(1).show()
				$(".star").eq(1).css('color', 'red')

			} else {
				$(".tishi").eq(1).hide()
				$(".star").eq(1).css('color', '#e7e7eb')
			}
		})

		//		$("#user_nick_name1").keyup(function() {
		//			if($(this).val().length == 0) {
		//				$("#myModal_user_new .tishi").eq(2).show()
		//				$("#myModal_user_new .star").eq(1).css('color', 'red')
		//
		//			} else {
		//				$("#myModal_user_new .tishi").eq(2).hide()
		//				$("#myModal_user_new .star").eq(1).css('color', '#e7e7eb')
		//			}
		//		})
		var add_user_height = ($(window).height() - 564) / 2
		$("#myModal_user .modal-dialog").css('margin-top', add_user_height)
		$("#myModal_user_new .modal-dialog").css('margin-top', add_user_height)
		var change_pas = ($(window).height() - 471) / 2
		$("#myModal_user_changePwd .modal-dialog").css('margin-top', change_pas)
	} else {
		location.href = 'login.html'
	}

})

//$("#mobile").keyup(function() {
//	if($(this).val().length > 10) {
//		if(!(/^1(3|4|5|7|8)\d{9}$/.test($(this).val()))) {
//			$(this).next().show()
//		} else {
//			$(this).next().hide()
//		}
//	}
//})
//$("#email").keyup(function() {
//	var re = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
//	if(re.test($(this).val())) {
//		$(this).next().hide()
//	} else {
//		$(this).next().show()
//	}
//
//})