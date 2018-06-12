$(function() {
	$("#position_div").click(function() {
		if($("#role_select").css('display')=='none'){
			$("#role_select").slideDown()
			$(this).children('i').removeClass('icon-icon-weixialashi').addClass('icon-icon-xialakuang')			
		}else{
			$("#role_select").slideUp()
			$("#position_div ").children('i').removeClass('icon-icon-xialakuang').addClass('icon-icon-weixialashi')
		}
	});
	$("#role_select li").click(function() {
		$("#position_div span").text($(this).children().text())
		$("#role_select").slideUp()
		$("#position_div span").css('color','#383838')
		$("#position_div ").children('i').removeClass('icon-icon-xialakuang').addClass('icon-icon-weixialashi')
	});
	$("#position_div").blur(function(){
		$("#role_select").slideUp()
		$("#position_div ").children('i').removeClass('icon-icon-xialakuang').addClass('icon-icon-weixialashi')
		
	});
	$("#usertype_div").click(function() {
		if($("#position_select").css('display')=='none'){
			$("#position_select").slideDown()
			$(this).children('i').removeClass('icon-icon-weixialashi').addClass('icon-icon-xialakuang')
		}else{
			$("#position_select").slideUp()
			$(this).children('i').removeClass('icon-icon-xialakuang').addClass('icon-icon-weixialashi')
		}

	});
	$("#position_select li").click(function() {
		$("#usertype_div span").text($(this).children().text())
		$("#usertype_div input").val($(this).children('input').val())
		$("#position_select").slideUp()
		$("#usertype_div span").css('color','#383838')
		$("#usertype_div").children('i').removeClass('icon-icon-xialakuang').addClass('icon-icon-weixialashi')
	});
	$("#usertype_div").blur(function() {
		$('#position_select').slideUp()
		$(this).children('i').removeClass('icon-icon-xialakuang').addClass('icon-icon-weixialashi')
	});
	$("#sign_one_title").addClass('add_after')
	$("#sign_two_title").addClass('add_after_none')
	$("#sign_two_title").addClass('add_after_none1')
	var width = $("#sign_main_top").width() / 3
	$("#sign_main_top div").css('width', width)
var first1,sec1,third1,four1,five1;
//    判断是否所有的输入有值
    function isDisable_new(params1,params2,params3,params4,params5){
        if(params1 && params2 && params3 && params4 && params5){
            $('#first_sub').prop({
                disabled: false
            });
            $('#first_sub').addClass('sign_wrond')
        }else{
            $('#first_sub').prop({
                disabled: true
            });
            $('#first_sub').removeClass('sign_wrond')
        }
    }
    isDisable_new(first1,sec1,third1,four1,five1)
    $('#sign_form input').on('input',function(){
        if($(this).attr('id') == 'real_name'){
            if($(this).val().length>0){
            	var myreg = /^[\u4e00-\u9fa5a-zA-Z]+$/;
				if(myreg.test($("#real_name").val())) {
					
					$(this).next().text('此项为必填')
					$(this).next().hide()
					first1 = $(this).val();
//					validate_email()

				} else {
					first = undefined
					$(this).next().text('请输入中文或英文')
					$(this).next().show()
	
				}
            	
            }else{
            	console.log($(this).next())
            	first1 = undefined
            }
        }else if($(this).attr('id') == 'company_name'){
            if($(this).val().length>0){
            	
            	var myreg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				if(myreg.test($("#company_name").val())) {
					$(this).next().text('此项为必填')
					$(this).next().hide()
					sec1 = $(this).val();
				} else {
					sec1 = undefined
					$(this).next().text('请输入中英文数字或下划线')
					$(this).next().show()
	
				}
            
            } else{
            	sec1 = undefined
            }
        }else if($(this).attr('id') == 'address'){
            if($(this).val().length>0){
            	third1 = $(this).val();
            	var myreg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				if(myreg.test($("#address").val())) {
					$(this).next().text('此项为必填')
					$(this).next().hide()
					third1 = $(this).val();
				} else {
					sec1 = undefined
					$(this).next().text('请输入中英文数字或下划线')
					$(this).next().show()
	
				}
            }else{
            	third1=undefined
            }
        }
        isDisable_new(first1,sec1,third1,four1,five1)
    });
    $("#role_select li ").click(function(){
		if($("#position_div").children('span').text()=="请选择您的职位"){
			$("#position_div").siblings('span').show()
			$("#position_div").focus(function(){
				$(this).siblings('span').hide()
			})
		}else {
			$("#position_div").siblings('span').hide()
			four1 = $("#position_div").children('span').text();
		}
		 isDisable_new(first1,sec1,third1,four1,five1)
   });
    $("#position_select li ").click(function(){
		if($("#usertype_div").children('span').text()=="请选择您的账号类型"){
			$("#usertype_div").siblings('span').show()
			$("#usertype_div").focus(function(){
				$(this).siblings('span').hide()
			})
		}else {
			$("#usertype_div").siblings('span').hide()
			five1 = $("#usertype_div").children('span').text();
		}
		 isDisable_new(first1,sec1,third1,four1,five1)
   });
	$("#first_sub").click(function() {
			$(this).parent().hide()
			$("#sign_one_title").removeClass('title-sel add_after')
			$("#sign_one_title span:first-child").removeClass('title-num-sel')
			$("#sign_one_title span:nth-child(2)").removeClass('title-con-sel')
			$("#sign_two_title span:first-child").addClass('title-num-sel')
			$("#sign_two_title span:nth-child(2)").addClass('title-con-sel')
			$("#sign_two_title").addClass('title-sel add_after add_before')
			$("#sign_two_title").removeClass('add_after_none')
			$("#sign_two_title").removeClass('add_after_none1')
			$("#sign_form_two").show()
	});
	$("#button_pre").click(function() {
			$("#sign_form_two").hide()
			$("#sign_form").show()
			$("#sign_one_title").addClass('title-sel add_after')
			$("#sign_two_title").removeClass('title-sel add_after add_before')
			$("#sign_one_title span:first-child").addClass('title-num-sel')
			$("#sign_one_title span:nth-child(2)").addClass('title-con-sel')
			$("#sign_two_title span:first-child").removeClass('title-num-sel')
			$("#sign_two_title span:nth-child(2)").removeClass('title-con-sel')
			$("#sign_two_title").addClass('add_after_none')
			$("#sign_two_title").addClass('add_after_none1')			
	});
	  
		$("#email").on("blur",function(){
			$.ajax({
				type:'post',
				url:urlstr+'sysAuthLogController/userJudge',
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data:JSON.stringify({email:$(this).val()}),
				success:function(data){
					if(data.code=="000"){
						$("#send_vaildate").prop("disabled", false);
						first = $("#email").val();
						$("#email").next().text('此项为必填')
						$("#email").next().hide()	
						vaildate_email()
					}else if(data.code=="122"){
						$("#send_vaildate").prop("disabled", true);
						$("#email").next().text('该邮箱已存在')
						$("#email").next().show()
//						$("#send_vaildate").prop({disabled: true})
						$("#email").on('input',function(){
							$("#send_vaildate").prop("disabled", false);
						})
					}else if(data.code=="121"){
						$("#send_vaildate").prop("disabled", true);
						$("#email").next().text('信息正在审核中')
						$("#email").next().show()
//						$("#send_vaildate").prop({disabled: true})
						$("#email").on('input',function(){
							$("#send_vaildate").prop("disabled", false);
						})					
					}
				},
				error:function(data){
					console.log(data)
				}
			})
		});   
	function vaildate_email(){
		$("#send_vaildate").click(function(){
       	 $("#send_vaildate").prop("disabled", true);
         $("#send_vaildate").text('60秒后重新发送');
         var a=60;
        IntervalName= setInterval(function() {
            if(a > 1) {
                a--;
                $("#send_vaildate").text(a + 's后重新发送')
            } else {
                $("#send_vaildate").text('重新发送')
                clearInterval(IntervalName);
                $("#send_vaildate").prop("disabled", false);
            }
        }, 1000)
		var address = $("#email").val();
		var type = "1";
		$.ajax({
			type: 'POST',
			url: urlstr + 'sysVerifyCodeController/getCode',
			dataType: 'json',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify({
				'address': address,
				'type': type
			}), //提交json字符串数组，如果提交json字符串去掉[]   
			success: function(data) {
				if(data.code == '000') {

			        
				} else {
					$(".alert_success img").attr('src', 'img/error.png')
					$(".alert_content").html('发送验证码失败')
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
	});	
	};
   

	var first,sec,third,four,five;
//    判断是否所有的输入有值
    function isDisable(params1,params2,params3,params4,params5){
        if(params1 && params2 && params3 && params4 && params5){
            $('#second_sub').prop({
                disabled: false
            });
             $('#second_sub').addClass('sign_wrond')
        }else{
            $('#second_sub').prop({
                disabled: true
            });
            $('#second_sub').removeClass('sign_wrond')
        }
    }
    isDisable(first,sec,third,four,five)
    $('#sign_form_two input').on('input',function(data){
        if($(this).attr('id') == 'email'){
			if($(this).val().length == 0) {
				first = undefined
				$(this).parent().find('span').show()
				$(this).focus(function() {
					$(this).parent().find('span').hide()
				})
			} else {
				var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if(myreg.test($("#email").val())) {
					
					$(this).parent().find('span').text('此项为必填')
					$(this).parent().find('span').hide()
//					validate_email()

				} else {
					first = undefined
					$(this).parent().find('span').text('请输入有效的E_mail')
					$(this).parent().find('span').show()
	
				}
			};
        }else if($(this).attr('id') == 'validate'){
        	if($(this).val().length>0){
        		sec = $(this).val();
        	}else{
        		sec = undefined
        	}
            
        }else if($(this).attr('id') == 'user_password'){
			if($(this).val().length == 0) {
				third = undefined
				$(this).parent().find('span').show()
//				$(this).focus(function() {
//					$(this).parent().find('span').hide()
//				})
			} else {
				$(this).blur(function(){
					if($(this).val().length < 8) {
						third = undefined
						$(this).parent().find('span').text('密码长度不小于8')
						$(this).parent().find('span').show()
					} else {
						var myreg = /^[^ ]+$/;
						if(myreg.test($("#user_password").val())) {
							$(this).parent().find('span').text('此项为必填')
							$(this).parent().find('span').hide()
							third = $(this).val();
						} else {
							third = undefined
							$(this).parent().find('span').text('不能包含空格')
							$(this).parent().find('span').show()
						}
						
					}				
				})

			}
        }else if($(this).attr('id') == 'password_again'){
            
			if($(this).val().length == 0) {
				$(this).parent().find('span').show()
//				$(this).focus(function() {
//					$(this).parent().find('span').hide()
//				});
				four = undefined
			} else {
				$(this).blur(function(){
					if($(this).val() === $("#user_password").val()) {
						$(this).parent().find('span').text('此项为必填')
						$(this).parent().find('span').hide()
						four = $(this).val();
					} else {
						four = undefined
						$(this).parent().find('span').text('两次密码输入不一致')
						$(this).parent().find('span').show()
					}				
				});

			};
        }else if($(this).attr('id') == 'phone'){
            
			if($(this).val().length == 0) {
				five = undefined
				$(this).parent().find('span').show()
				$(this).focus(function() {
					$(this).parent().find('span').hide()
				})
			} else {
				var myreg = /^1(3|4|5|7|8)\d{9}$/;
				if(myreg.test($("#phone").val())) {
					$(this).parent().find('span').text('此项为必填')
					$(this).parent().find('span').hide()
					five = $(this).val();
				} else {
					five = undefined
					$(this).parent().find('span').text('请输入有效的手机号码')
					$(this).parent().find('span').show()
				}
			};
        }
        isDisable(first,sec,third,four,five)
   });
	$("#second_sub").click(function() {
			var param = {
				'realName': $('#real_name').val(),
				'company': $('#company_name').val(),
				'position':$("#position_div span").text(),
				'userType':$("#usertype_div  input").val(),
				'address': $('#address').val(),
				'password': $('#user_password').val(),
				'mobile': $('#phone').val(),
				'email': $('#email').val(),
				'emailVerifyCode': $('#validate').val(),
			}
			$.ajax({
				type: 'POST',
				url: urlstr + 'sysAuthLogController/register',
				dataType: 'json',
				async:false,
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify(param),
				success: function(data) {
					if(data.code == '000') {
						$("#sign_form_two").hide()
						$("#sign_success").show()
						$("#sign_three_title").addClass('title-sel add_before')
						$("#sign_two_title").removeClass('title-sel add_after add_before')
						$("#sign_three_title span:first-child").addClass('title-num-sel')
						$("#sign_three_title span:nth-child(2)").addClass('title-con-sel')
						$("#sign_two_title span:first-child").removeClass('title-num-sel')
						$("#sign_two_title span:nth-child(2)").removeClass('title-con-sel')
					} else if(data.code == '122') {
						$(".alert_success img").attr('src', 'img/error.png')
						$(".alert_content").html('用户已存在')
						$(".alert_success").show()
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
					} else {
						$(".alert_success img").attr('src', 'img/error.png')
						$(".alert_content").html('验证码错误')
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
		
	});
})