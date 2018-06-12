$(document).ready(function() {

});
$(function() {
	if($.cookie("rmbUser") == "true") {
		$('.login_p span:first-child').addClass('title-sel')
		$(".login_name").val($.cookie("userName"));
		$(".login_pwd").val($.cookie("passWord"));
		var counts = 0
		$(".login_p").click(function() {
			counts++
			if(counts % 2 !== 0) {
				$(".login_right").removeClass('title-sel')
			} else {
				$(".login_right").addClass('title-sel')
			}

		})
	}else{
		var count = 0
		$(".login_p").click(function() {
			count++
			if(count % 2 !== 0) {
				$(".login_right").addClass('title-sel')
			} else {
				$(".login_right").removeClass('title-sel')
			}

		})
	}
	$(document).keyup(function(event) {
		if(event.keyCode == 13) {
			loginajax();
		}
	});
	$('.login_button').click(function() {
		if($(".login_name").val().length==0 || $(".login_pwd").val().length==0){
			$(".error").text('请输入用户名和密码')
			$(".error").css('display', 'block');
			$(".login").css('height', '305px')
			$(".login_user_change").css('margin-top', '6px')
			$("#login_psw").css('margin-top', '20px')
		}else{
			$(".error").css('display', 'none');
			$(".error").text('用户名或密码错误，请重新输入')
			loginajax();
			
		}
		})
		//登录接口
	function loginajax() {
		if($('.login_p span:first-child').hasClass('title-sel')) {
			var userName = $(".login_name").val();
			var passWord = $(".login_pwd").val();
			$.cookie("rmbUser", "true", {
				expires: 7
			}); // 存储一个带7天期限的 cookie 
			$.cookie("userName", userName, {
				expires: 7
			}); // 存储一个带7天期限的 cookie 
			$.cookie("passWord", passWord, {
				expires: 7
			}); // 存储一个带7天期限的 cookie 
		} else {
			$.cookie("rmbUser", "false", {
				expires: -1
			});
			$.cookie("userName", '', {
				expires: -1
			});
			$.cookie("passWord", '', {
				expires: -1
			});
		}
		var userName = $("input[name=login_name]").val();
		var userPwd = $("input[name=login_pwd]").val();
		$.ajax({
			type: 'POST',
			url: urlstr + 'sysAuthLogController/login.do',
			dataType: 'json',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify({
				'userName': userName,
				'userPwd': userPwd
			}),
			success: function(data) {
				if(data.code == "000") {
//					console.log(data.userInfo)
					sessionStorage.setItem('token', data.token)
					var userInfo = data.userInfo
					sessionStorage.setItem('name', userInfo.userName)
					sessionStorage.setItem('userId', userInfo.userId)
					sessionStorage.setItem('nickname', userInfo.userNickName)
					sessionStorage.setItem('menuList', JSON.stringify(userInfo.menuList))
					sessionStorage.setItem('roleList', JSON.stringify(userInfo.roleList))
					sessionStorage.setItem('userType',userInfo.userType)
					location.href = 'index.html'
				} else {
					$(".error").css('display', 'block');
					$(".login").css('height', '305px')
					$(".login_user_change").css('margin-top', '6px')
					$("#login_psw").css('margin-top', '20px')

				}
			},
			error: function(textStatus, errorThrown) {
				$(".alert_success img").attr('src', 'img/error.png');
				$(".alert_content").html('接口请求失败');
				$(".alert_success").show();
				setTimeout(function() {
					$(".alert_success").hide();
				}, 2000);
			}
		});
	}

})