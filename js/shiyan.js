$(function() {
	if(sessionStorage.token) {
		$("#fenlei span").click(function() {
			$(this).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
		$("#fenlei_new span").click(function() {
			$(this).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
		$("#fenlei_new ").click(function() {
			$(this).addClass('fenlei').siblings().removeClass('fenlei');
		});
		$("#type_status li span").click(function() {
			$(this).addClass('fenlei_span').parent().siblings().children('span').removeClass('fenlei_span');
		});
		$("#type_status_edit li span").click(function() {
			$(this).addClass('fenlei_span').parent().siblings().children('span').removeClass('fenlei_span');
		});
        //清楚点击时候的缓存
        sessionStorage.removeItem('user_info_id');
		//将颜色添加到列表中
		function add_list_type() {
			$.ajax({
				type: 'get',
				url: urlstr + 'bizProTrainController/dictList?token=' + token,
				data: {
					userId: sessionStorage.getItem('userId'),
					status: '1'
				},
				success: function(data) {
					sessionStorage.setItem('type_info', JSON.stringify(data.rows))
					type_info_list = data.rows;
					$(".lei-list li").not('.exit').remove();
					$("#project_type_list li").remove();
					$("#project_type_list1 li").remove();
					for(var i = 0; i < type_info_list.length; i++) {
						if(type_info_list[i].dictItemName !== "反欺诈") {
							$(".lei-list").append('<li>' + type_info_list[i].dictItemName + '<input type="hidden" value="' + type_info_list[i].dictItemCode + '"/></li>');
//							$(".lei-list li:nth-child(2)").hide();

						} else {
//							$(".lei-list li:nth-child(2)").hide();
							$(".lei-list li:nth-child(2)").html('' + type_info_list[i].dictItemName + '<input type="hidden" value="' + type_info_list[i].dictItemCode + '"/>');
						};
						$(".project_list_select span:nth-child(1)").css('background', type_info_list[0].color);
						$(".project_list_select span:nth-child(2)").text(type_info_list[0].dictItemName);
						$(".project_list_select input:nth-child(4)").val(type_info_list[0].dictItemCode);
						$(".project_list_select input:nth-child(5)").val(type_info_list[0].color);
						$("#project_type_list").append('<li><span style="background:' + type_info_list[i].color + '"></span><span>' + type_info_list[i].dictItemName + '</span><input type="hidden" value="' + type_info_list[i].dictItemCode + '" /><input type="hidden" value="' + type_info_list[i].color + '"/></li>');
						//			$(".project_list_select1 span:nth-child(1)").css('background',type_info_list[0].color)
						//			$(".project_list_select1 span:nth-child(2)").text(type_info_list[0].dictItemName)
						$("#project_type_list1").append('<li><span style="background:' + type_info_list[i].color + '"></span><span>' + type_info_list[i].dictItemName + '</span><input type="hidden" value="' + type_info_list[i].dictItemCode + '" /><input type="hidden" value="' + type_info_list[i].color + '"/></li>');
					};
					if($(".lei-list").width() > 750) {
						$('.lei-list').css("width", "750px");
						$("#edit_type").addClass('length_change');
						$(".shiyan-header>div:first-child>span").addClass('length_change')
					};
					$("#project_type_list li").click(function() {
						$('.project_list_select span:nth-child(2)').text($(this).children('span:nth-child(2)').text());
						var bac_col = $(this).children('input:nth-child(4)').val();
						$('.project_list_select span:nth-child(1)').css('background', bac_col);
						$('.project_list_select input:nth-child(4)').val($(this).children('input:nth-child(3)').val());
						$('.project_list_select input:nth-child(5)').val($(this).children('input:nth-child(4)').val());
						$("#project_type_list").slideToggle();
					});
					$("#project_type_list1 li").click(function() {
						$('.project_list_select1 span:nth-child(2)').text($(this).children('span:nth-child(2)').text());
						var bac_col = $(this).children('input:nth-child(4)').val();
						$('.project_list_select1 span:nth-child(1)').css('background', bac_col);
						$('.project_list_select1 input:nth-child(4)').val($(this).children('input:nth-child(3)').val());
						$('.project_list_select1 input:nth-child(5)').val($(this).children('input:nth-child(4)').val());
						$("#project_type_list1").slideToggle();
					});					
					var projectType;
					$('.lei-list li').click(function() {
						$(this).addClass('fenlei').siblings().removeClass('fenlei');
						projectType = $(this).children('input').val();
						if($(this).index() == 0) {
							projectType = "";
						}
						projectTrainList(projectType, "", "1", "10");
					});				
				},
				error: function(data) {
					console.log(data);
				}
			})
		};
		add_list_type();
			//新建项目下拉
		$('.project_list_select').click(function() {
			$("#project_type_list").slideToggle();
		});

		$('.project_list_select1').click(function() {
			$("#project_type_list1").slideToggle();
		});
		//自定义颜色
		$('#choose').spectrum({
			change: function(color) {
				$(".choose1").text(color.toHexString());	
				$(".type_select span:first-child").css('background', color.toHexString());
			}
		});
		$('#choose1').spectrum({
			change: function(color) {
				$(".choose1").text(color.toHexString());
				$(".type_select span:first-child").css('background', color.toHexString());
			}
		});
		//-----------------------新增功能-----------------------------
		$(".shiyan-add").click(function() {
			$("#myModal").modal();
			$("#myModal input[type=button]").attr("disabled", false);
		});
		$("#myModal").on("hidden.bs.modal", function() {
			$("#name").val("");
			$('.add-html textarea').val("");
			$("#fenlei span").eq(0).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
		$("#myModal_type").on("hidden.bs.modal", function() {
			$("#type_name").val("");
			$('#type_code').val("");
			$("#type_status li:first-child>span").addClass('fenlei_span').parent().siblings().children('span').removeClass('fenlei_span');
			$(".choose1").html('#000000');
			$('.tishi').hide();
			$(".type_select span:first-child").css('background', '#000000');
		});
		$("#myModal_type_edit").on("hidden.bs.modal", function() {
			$('.tishi').hide();
			type_name_validate_edit=true;
			code_check_edit=true;
		});
		$("#myModal input[type=button]").click(function() {
			var trainCode = $('.project_list_select input:nth-child(4)').val();
			var colors = $('.project_list_select input:nth-child(5)').val();
			var trainName = $('#name').val();
			var trainType = "1";
			var creatorId = sessionStorage.getItem('userId');
			var remark = $('#myModal textarea').val();
			var creatorName = sessionStorage.getItem('name');
			var rolecode = "1";
			var projectStatus = "1";
			if($('#name').val() == "" || $.trim($('#miaoshu').val()) == "") {
				if($('#name').val() == "") {
					$('#name').next().show();
					$('#name').keyup(function() {
						$(this).next().hide();
					})
				} else if($.trim($('#miaoshu').val()) == "") {
					$('#miaoshu').next().show();
					$('#miaoshu').keyup(function() {
						$(this).next().hide();
					})
				}
			} else {
				if(length_validate == false) {

				} else {
					$.ajax({
						type: 'POST',
						url: urlstr + 'bizProTrainController/projectTrainAdd.do?token=' + token,
						dataType: 'json',
						async: false,
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify({
							'trainCode': trainCode,
							'trainName': trainName,
							'trainType': trainType,
							'creatorId': creatorId,
							'creatorName': creatorName,
							'color': colors,
							'remark': remark,
							'projectStatus': projectStatus
						}), //提交json字符串数组，如果提交json字符串去掉[]
						success: function(data) {
							if(data.code == "000") {
								$("#myModal input[type=button]").attr("disabled", true);
								$(".main_card_null").remove();
								$(".card_img").remove();
								$("#myModal").modal('hide');
								projectTrainList("", "", "1", "10", page());
								$(".alert_success img").attr('src', 'img/green.png');
								$(".alert_content").html('添加成功！');
								$(".alert_success").show();
								setTimeout(function() {
									$(".alert_success").hide();
								}, 2000);
							} else if(data.code == "110") {
								location.href = 'login.html';
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

			}

		});
		//编辑分类
		$("#edit_type").click(function() {
			add_info();
		});
		function add_info() {
			$.ajax({
				type: 'get',
				url: urlstr + 'dictController/getList?token=' + token+'&timestamp='+timestamp,
				data: {
					page: '1',
					rows: '10',
					userId: sessionStorage.getItem('userId')
//					status: '1'
				},
				success: function(data) {
					if(data.code == "000") {
						$('.project_type-ul>li').not(':first-child').remove();
						$("#project_list").hide();
						$(".card_null").remove();
						$("#project_type").show();
						$(".title-second").show();
						$(".main-content-p button").show();
						var type_info = data.resultList;
//						sessionStorage.setItem('type_info', JSON.stringify(data.rows));
						for(var i = type_info.length - 1; i >= 0; i--) {
							$('.project_type-ul').append('<li class=" ">' +
								'<ul class="project-ul-ul">' +
								'<li class="shiyan-li_first project-li_first"><span>' + type_info[i].dictItemName + '</span><input type="hidden" value="' + type_info[i].id + '"></li>' +
								'<li class=" project-li_second"><span>' + type_info[i].dictItemCode + '</span></li>' +
								'<li class="shiyan-li_fourth project-li_fourth"><span></span><input type="hidden" value="' + type_info[i].status + '"/></li>' +
								'<li class="shiyan-li_five project-li_five"><span style="background:' + type_info[i].color + '"></span><span class="border_tro_right"></span></li>' +
								'<li class=" project-li_six">' +
								'<ul>' +
								'<li>' +
								'<div><em class="em_edit"></em><span>修改</span></div>' +
								'</li>' +
								'<li>' +
								'<div><em class="em_dele"></em><span>删除</span></div>' +
								'</li>' +
								'</ul>' +
								'</li>' +
								'</ul>' +
								'</li>')
						}
						$(".project-li_fourth").each(function() {
							//				      		console.log($(this))
							if($(this).children('input').val() == "1") {
								$(this).children('span').text('正常');
							} else {
								$(this).children('span').text('失效');
								$(this).parent().parent().addClass('role_li_shixiao');
								//				      			$(this).parent().children('li:span>first-child').addClass('ban_color')
								$(this).parent().children('li').children("span:first-child").addClass('ban_color');

								$(this).parent().find('.project-li_five span:first-child').addClass('ban_background');
							}
						});
						edit_type();
						delete_type();

					} else if(data.code == "110") {
						location.href = 'login.html';
					}
				},
				error: function(data) {
					$(".alert_success img").attr('src', 'img/error.png');
					$(".alert_content").html('接口请求失败');
					$(".alert_success").show();
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
				}
			});
		};
		//修改功能
		function edit_type() {
			$(".project-li_six li:first-child").click(function() {
				$("#myModal_type_edit").modal();
				var id = $(this).parents('.project-ul-ul').find('.project-li_first input').val();
				sessionStorage.setItem('edit_id_type', id);
				$.ajax({
					type: 'get',
					url: urlstr + 'dictController/get?token=' + token+'&timestamp='+timestamp,
					data: {
						id: id
					},
					success: function(data) {
						if(data.code == "000") {
							$("#type_name_edit").val(data.DicItem.dictItemName);
							$("#type_code_edit").val(data.DicItem.dictItemCode);
							sessionStorage.setItem('type_name_edit_val',$("#type_name_edit").val());
							sessionStorage.setItem('type_code_edit_val',$("#type_code_edit").val());
							if(data.DicItem.status == "1") {
								$("#type_status_edit li:first-child span").addClass('fenlei_span').parent().siblings().children('span').removeClass('fenlei_span');
							} else {
								$("#type_status_edit li:nth-child(2) span").addClass('fenlei_span').parent().siblings().children('span').removeClass('fenlei_span');
							}
							$(".type_select span:first-child").css('background', data.DicItem.color);
							$(".choose1").html(data.DicItem.color.substring(0, 7));
							//				      					$(".choose1").text()
							//	      					$("#myModal_type_edit").append('<input type="hidden" value="'+id+'"/>')
							$("#myModal_type_edit").modal();
							$("#type_sub_edit").attr("disabled", false);
						} else if(data.code == "110") {
							location.href = 'login.html';
						}
					},
					error: function(data) {
						$(".alert_success img").attr('src', 'img/error.png');
						$(".alert_content").html('接口请求失败');
						$(".alert_success").show();
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
					}
				})
			});
		};
		$("#type_sub_edit").click(function() {
			if(code_check_edit===false || type_name_validate_edit===false || status_type_edit===false){
				
			}else{
				var status = '';
				$("#type_status_edit li").each(function() {
					if($(this).children('span').hasClass('fenlei_span')) {
						status = $(this).children('input').val();
					}
				})
				$.ajax({
					type: 'post',
					url: urlstr + 'dictController/modify?token=' + token+'&timestamp='+timestamp,
					dataType: 'json',
					async: false,
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify({
						id: sessionStorage.getItem('edit_id_type'),
						userId: sessionStorage.getItem('userId'),
						status: status,
						color: $(".choose1").html(),
						dictItemCode: $('#type_code_edit').val(),
						dictItemName: $("#type_name_edit").val(),
						remark: "",
						dictItemOrder: "",
						dictEntryCode: "02",
						tenantId:sessionStorage.getItem('edit_id_type')
					}),
					success: function(data) {
						if(data.code == "000") {
							$("#type_sub_edit").attr("disabled", true);
							$("#myModal_type_edit").modal('hide');
							add_info();
							sessionStorage.removeItem('edit_id_type');
						} else if(data.code == "122") {
							$(".alert_success img").attr('src', 'img/error.png');
							$(".alert_content").html('该记录已存在');
							$(".alert_success").show();
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);
						} else if(data.code == "110") {
							location.href = 'login.html';
						}
					},
					error: function(data) {
						$(".alert_success img").attr('src', 'img/error.png');
						$(".alert_content").html('接口请求失败');
						$(".alert_success").show();
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
					}
	
				})				
			}

		});
		//失效判断数据是否存在
		var status_type_edit = true;
		$("#type_status_edit>li:nth-child(2)").click(function(){
			$.ajax({
				type: 'POST',
				url: urlstr + 'bizProTrainController/projectTrainList.do?token=' + token,
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userId': sessionStorage.getItem('userId'),
					'trainCode': $("#type_code_edit").val(),
//					'trainName': trainName,
					'pageNo': 1,
					'pageSize': 10
				}),
				success: function(data) {
					var list_info = data;
					if(list_info.code == "000") {
						if(list_info.pageInfo.length>0){
							status_type_edit = false;
							$("#type_status_edit").next().next().show();
						}else{
							status_type_edit = true;
							$("#type_status_edit").next().next().hide();
						}
					} else if(data.code == "110") {
						location.href = 'login.html';
					};

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
		});	
		$("#type_status_edit>li:nth-child(1)").click(function(){
			status_type_edit = true;
			$("#type_status_edit").next().next().hide();
		});
		//修改验证
		//验证名称
		var type_name_validate_edit = true;
		$("#type_name_edit").blur(function() {
			if($(this).val().length == 0) {
				$(".tishi").eq(2).show();
				$(".tishi").eq(2).text('此项为必填');
				type_name_validate_edit = false;
			} else {
				if(sessionStorage.getItem('type_name_edit_val')===$(this).val()){
					type_name_validate_edit = true;
					$(".tishi").eq(2).hide();
					$(".tishi").eq(2).text('此项为必填');
				}else{
					$.ajax({
						url:urlstr + 'dictController/verify?token=' + token+'&timestamp='+timestamp,
						type:'post',
						dataType: 'json',
						async: false,
						contentType: 'application/json;charset=UTF-8',
						data:JSON.stringify({
							dictItemName: $(this).val(),
							userId: sessionStorage.getItem('userId')
						}),
						success:function(data){
							if(data.code==="000"){
								type_name_validate_edit = true;
								$(".tishi").eq(2).hide();
								$(".tishi").eq(2).text('此项为必填');
								sessionStorage.removeItem('type_name_edit_val');
							}else if(data.code==="122"){
								$(".tishi").eq(2).show();
								$(".tishi").eq(2).text('该记录已存在');
								type_name_validate_edit = false;
							}
							
						},
						error:function(){
							type_name_validate_edit = false;
							$(".alert_success img").attr('src', 'img/error.png');
							$(".alert_content").html('接口请求失败');
							$(".alert_success").show();
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);						
						}
						
					});				
				}


			}

		});
		//验证编码		
		var code_check_edit = true;
		$("#type_code_edit").blur(function() {
			if($(this).val().length == 0) {
				$(".tishi").eq(3).show();
				$(".tishi").eq(3).text('此项为必填');
				code_check_edit = false;
			} else {
				var en_name = /^[A-Za-z0-9]+$/;
				if(en_name.test($('#type_code_edit').val())) {
					if(sessionStorage.getItem('type_code_edit_val')===$(this).val()){
						code_check_edit = true;
						$(".tishi").eq(3).hide();
						$(".tishi").eq(3).text('此项为必填');					
					}else{
						$.ajax({
							url:urlstr + 'dictController/verify?token=' + token+'&timestamp='+timestamp,
							type:'post',
							dataType: 'json',
							async: false,
							contentType: 'application/json;charset=UTF-8',
							data:JSON.stringify({
								dictItemCode: $(this).val(),
								userId: sessionStorage.getItem('userId')
							}),
							success:function(data){
								if(data.code==="000"){
									code_check_edit = true;
									$(".tishi").eq(3).hide();
									$(".tishi").eq(3).text('此项为必填');
									sessionStorage.removeItem('type_code_edit_val')
								}else if(data.code==="122"){
									code_check_edit = false;
									$(".tishi").eq(3).show();
									$(".tishi").eq(3).text('该记录已存在');							
								}
							},
							error:function(){
								code_check_edit = false;
								$(".alert_success img").attr('src', 'img/error.png');
								$(".alert_content").html('接口请求失败');
								$(".alert_success").show();
								setTimeout(function() {
									$(".alert_success").hide();
								}, 2000);							
							}
							
						});					
					}

				} else {
					code_check_edit = false;
					$(".tishi").eq(3).show();
					$(".tishi").eq(3).text('编码格式为英文和数字');
				}

			}

		});		
		//删除数据
		function delete_type() {
			$(".project-li_six li:nth-child(2)").click(function() {
//				$("#myModal_alert1").modal();
				 var ids = $(this).parents('.project-ul-ul').find('.project-li_first input').val();
				 sessionStorage.setItem('ids',ids);
				var content = $(this).parents('.project-ul-ul').find('.project-li_first span').text();
				
					$.ajax({
						type: 'POST',
						url: urlstr + 'bizProTrainController/projectTrainList.do?token=' + token,
						dataType: 'json',
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify({
							'userId': sessionStorage.getItem('userId'),
							'trainCode': $(this).parent().parent().parent().find('.project-li_second span').text(),
							'pageNo': 1,
							'pageSize': 10
						}),
						success: function(data) {
							var list_info = data;
							console.log(data)
							if(list_info.code == "000") {
								if(list_info.pageInfo.length>0){
									$("#myModal_alert1").modal();
								   $("#myModal_alert1 .submit_button").hide();
								   $("#myModal_alert1 .confirm_tishi span:nth-child(1)").text('警告');
								   $("#myModal_alert1 .modal-dialog").css('height','165px');
								   $("#myModal_alert1 .modal-content").css('height','165px');
								   $(".confirm_content1").html('<img src="img/icon_warning_03.png" alt="" />您还有相关实验项目，不能删除该分类！');
								}else{
									$("#myModal_alert1").modal();
								   $("#myModal_alert1 .submit_button").show();
								   $("#myModal_alert1 .confirm_tishi span:nth-child(1)").text('提示');
								   $("#myModal_alert1 .modal-dialog").css('height','193px');
								   $("#myModal_alert1 .modal-content").css('height','193px');
								   $(".confirm_content1").html('您正在删除' + content + '分类，您确定该操作吗？');									
								}
							} else if(data.code == "110") {
								location.href = 'login.html';
							};
		
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
				
				
			});

		};
//		function dele_true(ids) {
			$("#myModal_alert1 .queding").click(function() {
				$.ajax({
					type: 'get',
					url: urlstr + 'dictController/del?token=' + token+'&timestamp='+timestamp,
					data: {
						id: sessionStorage.getItem('ids')
					},
					success: function(data) {
						if(data.code == "000") {
							$("#myModal_alert1").modal('hide');
							add_info();
							$(".alert_success img").attr('src', 'img/green.png');
							$(".alert_content").html('删除成功');
							$(".alert_success").show();
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);
							sessionStorage.removeItem('ids')
						} else if(data.code == "110") {
							location.href = 'login.html';
						}
					},
					error: function(data) {
						$(".alert_success img").attr('src', 'img/error.png');
						$(".alert_content").html('接口请求失败');
						$(".alert_success").show();
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
					}
				})
			});
//		}
		//新增分类
		$("#type_sub").click(function() {
			if($("#type_name").val().length == 0 || $("#type_code").val().length == 0 ) {
				if($("#type_name").val().length == 0) {
					$(".tishi").eq(0).show();
					$(".tishi").eq(0).text('此项为必填');
				} else if($("#type_code").val().length == 0) {
					$(".tishi").eq(1).show();
					$(".tishi").eq(1).text('此项为必填');
				}
			} else {
				if(type_name_validate==false || code_check===false){
					
				}else{
					var status = '';
					$("#type_status li").each(function() {
						if($(this).children('span').hasClass('fenlei_span')) {
							status = $(this).children('input').val();
						}
					});
					$.ajax({
						type: 'post',
						url: urlstr + 'dictController/add?token=' + token+'&timestamp='+timestamp,
						dataType: 'json',
						async: false,
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify({
							userId: sessionStorage.getItem('userId'),
							status: status,
							color: $(".choose1").text().substring(0, 7),
							dictItemCode: $('#type_code').val(),
							dictItemName: $("#type_name").val(),
							remark: "",
							dictItemOrder: "",
							dictEntryCode: "02"
						}),
						success: function(data) {
							if(data.code == "000") {
								$("#type_sub").attr("disabled", true);
								$("#myModal_type").modal('hide');
								add_info()
							} else if(data.code == "122") {
								$(".alert_success img").attr('src', 'img/error.png');
								$(".alert_content").html('该记录已存在');
								$(".alert_success").show();
								setTimeout(function() {
									$(".alert_success").hide();
								}, 2000);
								//							$("#myModal_type").modal('hide')
							} else if(data.code == "110") {
								location.href = 'login.html';
							}
	
						},
						error: function(data) {
							$(".alert_success img").attr('src', 'img/error.png');
							$(".alert_content").html('接口请求失败');
							$(".alert_success").show();
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);
						}
	
					});				
				}

			}

		});
		//验证名称
		var type_name_validate = false;
		$("#type_name").blur(function() {
			if($(this).val().length == 0) {
				$(".tishi").eq(0).show();
				$(".tishi").eq(0).text('此项为必填');
				type_name_validate = false;
			} else {
				$.ajax({
					url:urlstr + 'dictController/verify?token=' + token+'&timestamp='+timestamp,
					type:'post',
					dataType: 'json',
					async: false,
					contentType: 'application/json;charset=UTF-8',
					data:JSON.stringify({
						dictItemName: $(this).val(),
						userId: sessionStorage.getItem('userId')
					}),
					success:function(data){
						if(data.code==="000"){
							type_name_validate = true;
							$(".tishi").eq(0).hide();
							$(".tishi").eq(0).text('此项为必填');
						}else if(data.code==="122"){
							$(".tishi").eq(0).show();
							$(".tishi").eq(0).text('该记录已存在');
							type_name_validate = false;
						}
						
					},
					error:function(){
						type_name_validate = false;
						$(".alert_success img").attr('src', 'img/error.png');
						$(".alert_content").html('接口请求失败');
						$(".alert_success").show();
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);						
					}
					
				});

			}

		});
		//验证编码		
		var code_check = false;
		$("#type_code").blur(function() {
			if($(this).val().length == 0) {
				$(".tishi").eq(1).show();
				$(".tishi").eq(1).text('此项为必填');
				code_check = false;
			} else {
				var en_name = /^[A-Za-z0-9]+$/;
				if(en_name.test($('#type_code').val())) {
					$(".tishi").eq(1).hide();
					$(".tishi").eq(1).text('此项为必填');
					if($())
					$.ajax({
						url:urlstr + 'dictController/verify?token=' + token+'&timestamp='+timestamp,
						type:'post',
						dataType: 'json',
						async: false,
						contentType: 'application/json;charset=UTF-8',
						data:JSON.stringify({
							dictItemCode: $(this).val(),
							userId: sessionStorage.getItem('userId')
						}),
						success:function(data){
							if(data.code==="000"){
								code_check = true;
								$(".tishi").eq(1).hide();
								$(".tishi").eq(1).text('此项为必填');
							}else if(data.code==="122"){
								code_check = false;
								$(".tishi").eq(1).show();
								$(".tishi").eq(1).text('该记录已存在');							
							}
						},
						error:function(){
							type_name_validate = false;
							$(".alert_success img").attr('src', 'img/error.png');
							$(".alert_content").html('接口请求失败');
							$(".alert_success").show();
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);							
						}
						
					});
				} else {
					code_check = false;
					$(".tishi").eq(1).show();
					$(".tishi").eq(1).text('编码格式为英文和数字');
				}

			}

		});

		$(".main-content-p button").click(function() {
			$("#myModal_type").modal();
			$("#type_sub").attr('disabled', false);
		});
		//编辑分类返回
		$(".type-back").click(function() {
//			location.reload();
			user_info()
			add_list_type()
			$(".list_projrctMgr").click()
			$('.project_type-ul>li').not(':first-child').remove();
			$("#project_list").show();
//			$(".card_null").remove();
			$("#project_type").hide();
			$(".title-second").hide();
			$(".main-content-p button").hide();
			$(".lei-list li:first-child").addClass('fenlei').siblings().removeClass('fenlei');
			projectTrainList("", "", "1", "10");
			//自定义颜色
			$('#choose').spectrum({
				change: function(color) {
					$(".choose1").text(color.toHexString());	
					$(".type_select span:first-child").css('background', color.toHexString());
				}
			});
			$('#choose1').spectrum({
				change: function(color) {
					$(".choose1").text(color.toHexString());
					$(".type_select span:first-child").css('background', color.toHexString());
				}
			});
		});
    	function user_info(){
			$.ajax({
				type:'get',
				url:urlstr+'userMessageController/userMessageList?token='+token,
				data:{
					userId:sessionStorage.getItem('userId'),
					page:1,
					rows:10
				},
				success:function(data){
					if(data.code=="000"){
						$(".my_info-list li").remove();
						var my_info = data.pageInfo.list.splice(0,6);
						if(my_info.length>0){
							
							if(data.unReadSum>0){
								$(".info_num").css('display','inline-block');
								$(".info_num").text(data.unReadSum);
							}else{
								$(".info_num").hide();
							}
						}
	
					}else if(data.code=="110"){
        				location.href='login.html';
        			}
				},
				error:function(data){
					$(".alert_success img").attr('src', 'img/error.png');
					$(".alert_content").html('接口请求失败');
					$(".alert_success").show();
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
				}
			});		
		};
		user_info();
		//------------------------------搜索功能-----------------------------------------
		$(".shiyan-search input").focus(function() {
			$(this).parent().css('border-color', '#2992f1');
			$(this).siblings().css('color', '#2992f1');
		});
		$(".shiyan-search input").blur(function() {
			$(this).parent().css('border-color', '#dcdde2');
			$(this).siblings().css('color', '#cdd1d7');
		});
		var trainName = "";
		$(".shiyan-search span").click(function() {
			trainName = $(".shiyan-search input").val();
			projectTrainList("", trainName, "1", "10");

		});
		//---------------------获取列表数据---------------------------
		function projectTrainList(trainType, trainName, pageNo, pageSize) {
			$.ajax({
				type: 'POST',
				url: urlstr + 'bizProTrainController/projectTrainList.do?token=' + token,
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'userId': sessionStorage.getItem('userId'),
					'trainCode': trainType,
					'trainName': trainName,
					'pageNo': pageNo,
					'pageSize': pageSize
				}),
				success: function(data) {
					var list_info = data;
					if(list_info.code == "000") {
						page(data.pageCountPage, trainType, trainName);
						$(".shiyan-ul>li").not(":nth-child(1)").remove();
						var pageInfo = list_info.pageInfo;
//						console.log(pageInfo)
						if(pageInfo.length == 0) {
							$(".shiyan-search input").val("");
							$(".M-box3").hide();
							$(".shiyan-main .card_null").remove();
							$(".y-content").css('height', '805px');
							if(trainType || trainName) {
								$(".shiyan-main").append('<div class="card_null"><img class="card_img" src="img/pic_search_blank.png" alt="" /><span class="white_page">暂无数据哦~</span></div> ');
								$('.card_null').css('margin-top', '110px');
							} else {
								$(".shiyan-main").append('<div class="card_null"><img class="card_img" src="img/pic_project_blank.png" alt="" /><span class="white_page">您还没有创建实验项目，快去新建一个吧</span></div> ');
								$('.card_null').css('margin-top', '110px');
							}
						} else {
							$(".shiyan-search input").val("");
							$(".M-box3").show();
							$(".shiyan-main").find('.card_null').remove();
							$(".y-content").css('height', '1158px');
								//							var rigth_data = []
							type_info_list = JSON.parse(sessionStorage.getItem('type_info'));
							for(var i = 0; i < pageInfo.length; i++) {
								//								addlist("", '', pageInfo[i], new Date(pageInfo[i].createDate), "", "贷前")
								for(var j = 0; j < type_info_list.length; j++) {
									if(type_info_list[j].dictItemCode == pageInfo[i].trainCode) {
										//										rigth_data.push(i)
										addlist("", '', pageInfo[i], new Date(pageInfo[i].createDate), "", type_info_list[j].dictItemName);
									}
								}

							};
							edit_del(pageInfo);
							return pageInfo.length;
						}

					} else if(data.code == "110") {
						location.href = 'login.html';
					};

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
		};
		projectTrainList("", "", "1", "10");
		//分页
		function page(page, trainType, trainName) {
			$('.M-box3').pagination({
				pageCount: page,
				jump: true,
				coping: true,
				prevContent: '<',
				nextContent: '>',
				callback: function(api) {
					var data = {
						pageNo: api.getCurrent(),
						pageSize: '10',
						userId: sessionStorage.getItem('userId'),
						'trainCode': trainType,
						'trainName': trainName

					};
					$(".jump-ipt").after('<span class="span_add">页</span>');
					$(".jump-ipt").before('<p class="p_add">共<span class="span_add span_add1">' + page + '</span>页，到第</p>');
					//              if( trainName ||projectType ){
					//              	projectTrainList(projectType,trainName,api.getCurrent(),'10',"")
					//              }else{
					//              	projectTrainList("","",api.getCurrent(),'10',"")
					//              }
					$.ajax({
						type: 'POST',
						url: urlstr + 'bizProTrainController/projectTrainList.do?token=' + sessionStorage.getItem('token'),
						dataType: 'json',
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify(data),
						success: function(data) {
							var list_info = data;
							if(list_info.code == "000") {
								//	                        page(data.pageCountPage)
								$(".shiyan-ul>li").not(":nth-child(1)").remove();
								var pageInfo = list_info.pageInfo;
								if(pageInfo.length == 0) {
									$(".shiyan-search input").val("");
									$(".M-box3").hide();
									$(".shiyan-main .card_null").remove();
									$(".y-content").css('height', '805px');
									if(trainType || trainName) {
										$(".shiyan-main").append('<div class="card_null"><img class="card_img" src="img/pic_search_blank.png" alt="" /><span class="white_page">暂无数据哦~</span></div> ');
										$('.card_null').css('margin-top', '110px');
									} else {
										$(".shiyan-main").append('<div class="card_null"><img class="card_img" src="img/pic_project_blank.png" alt="" /><span class="white_page">您还没有创建实验项目，快去新建一个吧</span></div> ');
										$('.card_null').css('margin-top', '110px');
									}
								} else {
									$(".shiyan-search input").val("");
									$(".M-box3").show();
									$(".shiyan-main").find('.card_null').remove();
									$(".y-content").css('height', '1158px');
										//							var rigth_data = []
										
									type_info_list = JSON.parse(sessionStorage.getItem('type_info'));
									for(var i = 0; i < pageInfo.length; i++) {
										//								addlist("", '', pageInfo[i], new Date(pageInfo[i].createDate), "", "贷前")
										for(var j = 0; j < type_info_list.length; j++) {
											if(type_info_list[j].dictItemCode == pageInfo[i].trainCode) {
												//										rigth_data.push(i)
												addlist("", '', pageInfo[i], new Date(pageInfo[i].createDate), "", type_info_list[j].dictItemName);
											}
										}

									};
									edit_del(pageInfo);
									return pageInfo.length;
								}

							} else if(data.code == "110") {
								location.href = 'login.html';
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
		}

		//-------------------------添加列表信息------------------------------------
		function addlist(classli, lili, data, d, zdy, trainType) {
			$(".shiyan-ul ").append('<li class=" ' + zdy + '">' +
				'<ul class="shiyan-ul-ul">' +
				'<li class="shiyan-li_first"><span>' + data.trainName + '</span><input type="hidden" value="' + data.trainId + '"/></li>' +
				'<li class="shiyan-li_second ' + classli + '" style="background:' + data.color + '"><span>' + trainType + '</span><input class="trainType" type="hidden" value="' + data.trainCode + '"/></li>' +
				'<li class="shiyan-li_fourth"><span></span></li>' +
				'<li class="shiyan-li_five"><span>' + formatDate(d) + '</span><span class="border_tro_right"></span></li>' +
				'<li class="shiyan-li_six"><ul><li><div><em class="em_study"></em><span>学习</span></div></li>' +
				'<li ><div><em class="em_edit"></em><span>修改</span></div></li>' +
				'<li><div><em class="em_dele"></em><span>删除</span></div></li>'+
				'<li><div><em class="em_up"></em><span>提交</span></div></li>' +
				'</ul></li>' +
				
				'</ul></li>')
		};
		//------------------------时间戳转换为时间--------------------------------
		function formatDate(now) {
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "-" + month + "-" + date + "   " + add(hour) + ":" + add(minute) + ":" + add(second);
		};

		function add(mm) {
			if(mm < 10) {
				return "0" + mm
			} else {
				return mm
			}
		};
		//--------------------------------修改数据-----------------------------
		function projectTrainDetailShow(projectId) {
			$.ajax({
				type: 'POST',
				url: urlstr + 'bizProTrainController/projectTrainDetail.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				async: false,
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'trainId': projectId
				}),
				success: function(data) {
					if(data.code == "000") {
						$("#name_new").val(data.bizProjectTrain.trainName);
						$(".project_list_select1 span:first-child").css('background', data.bizProjectTrain.color);
						$(".project_list_select1 input:nth-child(4)").val(data.bizProjectTrain.trainCode);
						$(".project_list_select1 input:nth-child(5)").val(data.bizProjectTrain.color);
						for(var i = 0; i < type_info_list.length; i++) {
							if(type_info_list[i].dictItemCode == data.bizProjectTrain.trainCode) {
								$(".project_list_select1 span:nth-child(2)").text(type_info_list[i].dictItemName);
							}
						}
						$(".new_form textarea").val(data.bizProjectTrain.remark);
						edit(projectId);

					} else if(data.code == "100") {
						alert('projectID' + JSON.parse(data.result).projectId + '不存在');
					} else if(data.code == "110") {
						location.href = 'login.html';
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

		function edit(projectId) {
			$("#myModal_new input[type=button]").attr("disabled", false);
			$('#myModal_new input[type=button]').click(function() {
				if(length_validate_new === false) {

				} else {
					var trainId = projectId;
					var trainCode = $(".project_list_select1 input:nth-child(4)").val();
					var color = $(".project_list_select1 input:nth-child(5)").val();
					var trainName = $('#name_new').val();
					var trainType = "1";
					var creator =  sessionStorage.getItem('name');
					var remark = $('.new_form textarea').val();
					var projectStatus = "1";
					$.ajax({
						type: 'POST',
						url: urlstr + 'bizProTrainController/projectTrainModify.do?token=' + sessionStorage.getItem('token'),
						dataType: 'json',
						async: false,
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify({
							'trainId': trainId,
							'trainCode': trainCode,
							'trainName': trainName,
							'trainType': trainType,
							'creator': creator,
							'remark': remark,
							'color': color,
							'projectStatus': projectStatus
						}), //提交json字符串数组，如果提交json字符串去掉[]   
						success: function(data) {
							if(data.code == "000") {
								$("#myModal_new input[type=button]").attr("disabled", true);
								$("#myModal_new").modal('hide');
								$(".alert_success img").attr('src', 'img/green.png');
								$(".alert_content").html('修改成功！');
								$(".alert_success").show();
								setTimeout(function() {
									$(".alert_success").hide();
								}, 2000);
								projectTrainList("", "", "1", "10");
								projectId = "";
							} else if(data.code == "110") {
								location.href = 'login.html';
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

		};
		function edit_del(pageInfo) {
			
			//---------------删除功能------------------------
			$(".shiyan-li_six li:nth-child(3)").click(function() {
				projectId = $(this).parents('li').eq(1).find('.shiyan-li_first input').val();
				$("#myModal_alert").modal();
				$('.confirm_content span').text($(this).parents('li').eq(1).find('.shiyan-li_first').text());
			});
			//------------------修改功能--------------------------
			$(".shiyan-li_six li:nth-child(2)").click(function() {
				var projectId = $(this).parents('li').eq(1).find('.shiyan-li_first input').val();
				projectTrainDetailShow(projectId);
				$("#myModal_new").modal();
			});
			//------------点击进入databrain-------------------
			$(".shiyan-li_six li:nth-child(1)").click(function() {
				var projectID = $(this).parents('li').eq(1).find('.shiyan-li_first input').val();
				var send_info = pageInfo[$(this).parents('li').eq("1").index() - 1];
				sessionStorage.setItem('creatorId', send_info.creatorId);
				sessionStorage.setItem('projectStatus', send_info.projectStatus);
				sessionStorage.setItem('remark', send_info.remark);
				sessionStorage.setItem('trainCode', send_info.trainCode);
				sessionStorage.setItem('trainId', send_info.trainId);
				sessionStorage.setItem('trainName', send_info.trainName);
				sessionStorage.setItem('trainType', send_info.trainType);
//				console.log($(this))
				var name =$(this).parent().parent().siblings('.shiyan-li_first').text()
//				console.log(name)
				window.open('web/h5wf/index.html?projectID=' + projectID + '&&name='+name+'');
			});
			//提交项目到生产
			$(".shiyan-li_six li:nth-child(4)").click(function(){
				var trainId = $(this).parents('li').eq(1).find('.shiyan-li_first input').val();
				$('#myModal_alert_up').modal();
				$('#myModal_alert_up .confirm_content span').text(trainId)
				$("#myModal_alert_up .queding").attr('itemId',trainId);
			});
	};
	//提交数据到生产项目
	$("#myModal_alert_up .queding").click(function(){
		var trainId = $(this).attr('itemId');
		$.ajax({
			type:'post',
			url:urlstr + 'bizProTrainController/projectTrainModify.do?token=' + sessionStorage.getItem('token'),
			dataType: 'json',
			async: false,
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify({
				'trainId': trainId,
				'isProduct':'y'
			}),
			success:function(data){
				if(data.code=='000'){
					$("#myModal_alert_up").modal('hide');
					projectTrainList('','','1','10')
				}
			}
		});
	})
		//-----------------删除表数据--------------------------

		$("#myModal_alert .queding").click(function() { 
			$.ajax({
				type: 'POST',
				url: urlstr + 'bizProTrainController/projectTrainDel.do?token=' + sessionStorage.getItem('token'),
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'trainId': projectId
				}),
				success: function(data) {
					if(data.code === "000") {
						if($(".shiyan-ul>li").length - 2 == 0) {
							$(".shiyan-main").append('<div class="card_null"><img class="card_img" src="img/pic_project_blank.png" alt="" /><span class="white_page">您还没有创建实验项目，快去新建一个吧</span></div> ');
							$(".card_null").css('margin-top', '110px');
							$(".y-content").css('height', '805px');
							$(".M-box3").hide();
						}
						projectTrainList("","","1","10")
						$("#myModal_alert").modal('hide');
						$(".alert_success img").attr('src', 'img/green.png');
						$(".alert_content").html('删除成功！');
						$(".alert_success").show();
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
						$(".shiyan-li_first").each(function() {
							if($(this).children('input').val() == projectId) {
								$(this).parent().parent().remove();

							}
						})
					} else if(data.code == "110") {
						location.href = 'login.html';
					} else {
						$(".alert_success img").attr('src', 'img/error.png');
						$(".alert_content").html('删除失败！');
						$(".alert_success").show();
						setTimeout(function() {
							$(".alert_success").hide();
						}, 2000);
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

		});
		var body_height = ($(window).height() - 528) / 2;
		$("#myModal .modal-dialog").css('margin-top', body_height);
		$("#myModal_new .modal-dialog").css('margin-top', body_height);
		$("#myModal_type .modal-dialog").css('margin-top', body_height);
		$("#myModal_type_edit .modal-dialog").css('margin-top', body_height);
			//分类功能
		$(".project-li_six ul li:first-child").click(function() {
			$("#myModal_type_edit").modal();
		});

		//对项目名称进行验证
		var length_validate = true;
		$('#name').blur(function() {
				var pattern_char = /[A-Za-z0-9_-]/g;
				var pattern_chin = /[\u4e00-\u9fa5]/g;
				var count_char = $(this).val().match(pattern_char);
				var count_chin = $(this).val().match(pattern_chin);
				if(count_char !== null && count_chin !== null) {
					if(count_char.length + count_chin.length * 2 > 32) {
						$(this).next().text('字符长度不超过32');
						$(this).next().show();
						length_validate = false;
					} else {
						$(this).next().text('此项为必填');
						$(this).next().hide();
						length_validate = true;
					}
				} else {
					if(count_char !== null) {
						if(count_char.length > 32) {
							$(this).next().text('字符长度不超过32');
							$(this).next().show();
							length_validate = false;
						} else {
							$(this).next().text('此项为必填');
							$(this).next().hide();
							length_validate = true;
						}
					} else {
						if(count_chin.length > 16) {
							$(this).next().text('字符长度不超过32');
							$(this).next().show();
							length_validate = false;
						} else {
							$(this).next().text('此项为必填');
							$(this).next().hide();
							length_validate = true;
						}
					}
				}

			})
			//对修改时项目名称进行验证
		var length_validate_new = true;
		$('#name_new').blur(function() {
			var pattern_char = /[A-Za-z0-9_-]/g;
			var pattern_chin = /[\u4e00-\u9fa5]/g;
			var count_char = $(this).val().match(pattern_char);
			var count_chin = $(this).val().match(pattern_chin);
			if(count_char !== null && count_chin !== null) {
				if(count_char.length + count_chin.length * 2 > 32) {
					$(this).next().text('字符长度不超过32');
					$(this).next().show();
					length_validate_new = false;
				} else {
					$(this).next().text('此项为必填');
					$(this).next().hide();
					length_validate_new = true;
				}
			} else {
				if(count_char !== null) {
					if(count_char.length > 32) {
						$(this).next().text('字符长度不超过32');
						$(this).next().show();
						length_validate_new = false;
					} else {
						$(this).next().text('此项为必填');
						$(this).next().hide();
						length_validate_new = true;
					}
				} else {
					if(count_chin.length > 16) {
						$(this).next().text('字符长度不超过32');
						$(this).next().show();
						length_validate_new = false;
					} else {
						$(this).next().text('此项为必填');
						$(this).next().hide();
						length_validate_new = true;
					}
				}
			}

		});

	} else {
		location.href = 'login.html';
	}

})