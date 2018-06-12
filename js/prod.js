$(function() {
	if(sessionStorage.token){
	$("#fenlei1 span").click(function() {
		$(this).addClass('fenlei_span').siblings().removeClass('fenlei_span')
	});
	//------------------------------搜索功能-----------------------------------------
		$(".shiyan-search input").focus(function(){
			$(this).parent().css('border-color','#2992f1');
			$(this).siblings().css('color','#2992f1');
		});
		$(".shiyan-search input").blur(function(){
			$(this).parent().css('border-color','#dcdde2');
			$(this).siblings().css('color','#cdd1d7');
		});
		var prodCode = ""
		$(".shiyan-search span").click(function() {
			var trainName = $(".shiyan-search input").val();
			projectTrainList("", trainName);
		});
		//分类功能
		var type_prod_list = JSON.parse(sessionStorage.getItem('type_info'));
		for(var i=0;i<type_prod_list.length;i++){
			if(type_prod_list[i].dictItemName=="反欺诈"){
				$(".lei-list li:nth-child(2)").append(''+type_prod_list[i].dictItemName+'<input type="hidden" value="'+type_prod_list[i].dictItemCode+'"/>')
			}else{
				$(".lei-list").append('<li>'+type_prod_list[i].dictItemName+'<input type="hidden" value="'+type_prod_list[i].dictItemCode+'"/></li>')
			};
			$(".project_list_select span:nth-child(1)").css('background',type_prod_list[0].color)
			$(".project_list_select span:nth-child(2)").text(type_prod_list[0].dictItemName)
			$(".project_list_select input:nth-child(3)").text(type_prod_list[0].dictItemCode)
			$(".project_list_select input:nth-child(4)").text(type_prod_list[0].color)
			$("#project_type_list").append('<li><span style="background:'+type_prod_list[i].color+'"></span><span>'+type_prod_list[i].dictItemName+'</span><input type="hidden" value="'+type_prod_list[i].dictItemCode+'" /><input type="hidden" value="'+type_prod_list[i].color+'"/></li>')
			$(".project_list_select1 span:nth-child(1)").css('background',type_prod_list[0].color)
			$(".project_list_select1 span:nth-child(2)").text(type_prod_list[0].dictItemName)
			$("#project_type_list1").append('<li><span style="background:'+type_prod_list[i].color+'"></span><span>'+type_prod_list[i].dictItemName+'</span><input type="hidden" value="'+type_prod_list[i].dictItemCode+'" /><input type="hidden" value="'+type_prod_list[i].color+'"/></li>')		
		};			
        $('.lei-list li').click(function(){
			$(this).addClass('fenlei').siblings().removeClass('fenlei')			        	
//      	console.log($(this).index())
            if($(this).index()==0){
            	prodCode=""
            }else{
            	prodCode = $(this).children('input').val()
            }
        	projectTrainList(prodCode, "");
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
					'pageSize': pageSize,
					'isProduct':'y'
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
						'trainName': trainName,
						'isProduct':'y'
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
				'<li class="shiyan-li_fourth proid_fourth"><span></span></li>' +
				'<li class="shiyan-li_five"><span>' + formatDate(d) + '</span><span class="border_tro_right"></span></li>' +
				'<li class="shiyan-li_six"><ul><li><div><em class="em_study"></em><span>学习</span></div></li>' +
				'<li ><div><em class="em_edit"></em><span>修改</span></div></li>' +
				'<li><div><em class="em_dele"></em><span>删除</span></div></li>'+
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
		function edit_del(pageInfo) {
			//---------------删除功能------------------------
			$(".shiyan-li_six li:last-child").click(function() {
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
			})
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
		};
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
		//类型选择
		$("#project_type_list1 li").click(function() {
			$('.project_list_select1 span:nth-child(2)').text($(this).children('span:nth-child(2)').text());
			var bac_col = $(this).children('input:nth-child(4)').val();
			$('.project_list_select1 span:nth-child(1)').css('background', bac_col);
			$('.project_list_select1 input:nth-child(4)').val($(this).children('input:nth-child(3)').val());
			$('.project_list_select1 input:nth-child(5)').val($(this).children('input:nth-child(4)').val());
			$("#project_type_list1").slideToggle();
		});	
		$('.project_list_select1').click(function() {
			$("#project_type_list1").slideToggle();
		});
		//删除表数据
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
	//------------------------改变状态信息-------------------------------------
	function projectProdChangeState(prodId, prodStatus) {
		$.ajax({
			type: 'POST',
			url: urlstr + 'bizProjectProdController/projectProdChangeState.do?token=' + sessionStorage.getItem('token'),
			dataType: 'json',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify({
				'prodId': prodId,
				'prodStatus': prodStatus
			}),
			success: function(data) {
				if(data.code == "000") {
					sessionStorage.setItem('success', '000')
				} else {
					sessionStorage.removeItem('success')
				}
			},
			error: function(textStatus, errorThrown) {
				console.log(textStatus);
			}
		});

	}

	function has(pageInfo) {
		$('.prod-li_six li:first-child').click(function() {
			var projectID = $(this).parents('li').eq(1).find('.shiyan-li_first input').val()
			var send_info = pageInfo[$(this).parents('li').eq('1').index() - 1]
//			console.log(send_info)
//			sessionStorage.setItem('creator', send_info.creator)
			sessionStorage.setItem('projectStatus', send_info.prodStatus)
			sessionStorage.setItem('remark', send_info.remark)
			sessionStorage.setItem('trainCode', send_info.prodCode)
			sessionStorage.setItem('trainId', send_info.prodId)
			sessionStorage.setItem('trainName', send_info.prodName)
			sessionStorage.setItem('trainType', send_info.prodType)
			window.open('web/h5wf/index.html?projectID='+projectID+'')

		})
		$(".input_hidden").each(function() {
			if($(this).val() == "0") {
				$(this).parents('li').eq(2).addClass('shixiao_action')
				$(this).siblings('span:first-child').removeClass('icon-failure').addClass('icon-duihao')
			} else {}
		})
		$('.status_change').click(function() {
			if($(this).find('input').val() == "0") {
				var id = $(this).parents('li').eq(1).find('.shiyan-li_first input').val()
				projectProdChangeState(id, 1)
				if(sessionStorage.getItem('success')) {
					$(this).find('input').val("1")
					$(this).parents('li').eq(1).removeClass('shixiao_action')
					$(this).find('span:nth-child(1)').removeClass('icon-youxiao').addClass('icon-shixiao')
					$(this).find('span:nth-child(2)').text('失效')
					$(this).parents('.shiyan-ul-ul').find('.prod-seven span:first-child').text('正常')
					$("#myModal_new").modal('hide')
					$(".alert_success img").attr('src','img/green.png')
					$(".alert_content").html('解禁成功！')
					$(this).parents('.shiyan-ul-ul').find('.prod-li_first').removeClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.prod-li_fourth span').removeClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.prod-li_five span').removeClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.prod-seven span').removeClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.shiyan-li_second').removeClass('ban_background')
					$(".alert_success").show()
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
				} else {
					$(".alert_success img").attr('src','img/error.png')
					$(".alert_content").html('解禁失败！')
					$(".alert_success").show()
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
				}

			} else {
				var id = $(this).parents('li').eq(1).find('.shiyan-li_first input').val()
				projectProdChangeState(id, 0)
				if(sessionStorage.getItem('success')) {
					$(this).find('input').val("0")
					$(this).parents('li').eq(1).addClass('shixiao_action')
					$(this).find('span:nth-child(1)').removeClass('icon-shixiao').addClass('icon-youxiao')
					$(this).find('span:nth-child(2)').text('正常')
					$(this).parents('.shiyan-ul-ul').find('.prod-seven span:first-child').text('失效')
					$(this).parents('.shiyan-ul-ul').find('.prod-li_first').addClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.prod-li_fourth span').addClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.prod-li_five span').addClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.prod-seven span').addClass('ban_color')
					$(this).parents('.shiyan-ul-ul').find('.shiyan-li_second').addClass('ban_background')
					$(".alert_success img").attr('src','img/green.png')
					$(".alert_content").html('禁用成功！')
					$(".alert_success").show()
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);

				} else {
					$(".alert_success img").attr('src','img/error.png')
					$(".alert_content").html('禁用失败！')
					$(".alert_success").show()
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
				}

			}
		})
	
		
	}

	}else{
		location.href='login.html'
	}
	
})