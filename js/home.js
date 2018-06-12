$(function() {
	if(sessionStorage.token){
		$(".y-content").css('height','840px');
		$("#fenlei span").click(function() {
			$(this).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
		$("#fenlei_new span").click(function() {
			$(this).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
		$("#fenlei_new_home span").click(function() {
			$(this).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
		$("#fenlei_home span").click(function() {
			$(this).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
		$("#myModal_home").on("hidden.bs.modal", function() {
			$("#name_home").val("");
			$('.add-html textarea').val("");
			$("#fenlei_home span").eq(0).addClass('fenlei_span').siblings().removeClass('fenlei_span');
		});
        $("#my_test>div:last-child").click(function(){
        	$(".left-ul>li:first-child ul li:nth-child(2)").click();
        });
        $(".list-info>div span:nth-child(3)").click(function(){
        	$(".my_info_").click();
        });
        //清楚点击时候的缓存
        sessionStorage.removeItem('user_info_id');
        function add_info(){
        	$.ajax({
        		type:'get',
        		url:urlstr+'bizProTrainController/dictList?token=' + token+'&'+timeStamp,  
        		data:{
        			userId:sessionStorage.getItem('userId'),
        			status:'1'
        		},
        		success:function(data){
        			if(data.code=="000"){
//      				console.log(data.rows)
                       
                        sessionStorage.setItem('type_info',JSON.stringify(data.rows));
                        type_info_list  = JSON.parse(sessionStorage.getItem('type_info'));
						for(var i=0;i<type_info_list.length;i++){
							$(".home_list_select span:nth-child(1)").css('background',type_info_list[0].color);
							$(".home_list_select span:nth-child(2)").text(type_info_list[0].dictItemName);
							$(".home_list_select input:nth-child(4)").val(type_info_list[0].dictItemCode);
							$(".home_list_select input:nth-child(5)").val(type_info_list[0].color);
							$("#home_list").append('<li><span style="background:'+type_info_list[i].color+'"></span><span>'+type_info_list[i].dictItemName+'</span><input type="hidden" value="'+type_info_list[i].dictItemCode+'" /><input type="hidden" value="'+type_info_list[i].color+'"/></li>');
							$(".home_list_select1 span:nth-child(1)").css('background',type_info_list[0].color);
							$(".home_list_select1 span:nth-child(2)").text(type_info_list[0].dictItemName);
							$("#home_list1").append('<li><span style="background:'+type_info_list[i].color+'"></span><span>'+type_info_list[i].dictItemName+'</span><input type="hidden" value="'+type_info_list[i].dictItemCode+'" /><input type="hidden" value="'+type_info_list[i].color+'"/></li>');	
						};
					
						$("#home_list li").click(function(){
							$('.home_list_select span:nth-child(2)').text($(this).children('span:nth-child(2)').text());
							var bac_col =$(this).children('input:nth-child(4)').val();
							$('.home_list_select span:nth-child(1)').css('background',bac_col);
							$('.home_list_select input:nth-child(4)').val($(this).children('input:nth-child(3)').val());
							$('.home_list_select input:nth-child(5)').val($(this).children('input:nth-child(4)').val());
							$("#home_list").slideToggle();
						});

						$("#home_list1 li").click(function(){
							$('.home_list_select1 span:nth-child(2)').text($(this).children('span:nth-child(2)').text());
							var bac_col =$(this).children('input:nth-child(4)').val();
							$('.home_list_select1 span:nth-child(1)').css('background',bac_col);
							$('.home_list_select1 input:nth-child(4)').val($(this).children('input:nth-child(3)').val());
							$('.home_list_select1 input:nth-child(5)').val($(this).children('input:nth-child(4)').val());
							$("#home_list1").slideToggle();
						});                        
						projectTrainLists();

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
    	add_info() 
		$('.home_list_select').click(function(){
			$("#home_list").slideToggle();
		});
		$('.home_list_select1').click(function(){
			$("#home_list1").slideToggle();
		});
//  	$("#myModal_home input[type=button]").one('click',function(){
//  		
//  	})
		$("#myModal_home input[type=button]").click(function() {
			var trainCode = $(".home_list_select input:nth-child(4)").val();
			var trainName = $('#name_home').val();
			var trainType = "1";
			var creatorId = sessionStorage.getItem('userId');
			var remark = $('#myModal_home textarea').val();
			var creatorName = sessionStorage.getItem('name');
			var rolecode = "1";
			var color=$(".home_list_select input:nth-child(5)").val();
			var projectStatus = "1";
			if($('#name_home').val() == "" || $.trim($('#miaoshu_home').val()) == "") {
				if($('#name_home').val() == ""){
					$('#name_home').next().show();
					$('#name_home').keyup(function(){
						$(this).next().hide();
					});
				}else if($.trim($('#miaoshu_home').val()) == ""){
					$('#miaoshu_home').next().show();
					$('#miaoshu_home').keyup(function(){
						$(this).next().hide();
					});
				}
			} else {
				if(length_validate==false){
					
				}else{
					$.ajax({
						type: 'POST',
						url: urlstr + 'bizProTrainController/projectTrainAdd.do?token=' + sessionStorage.getItem('token')+'&'+timeStamp,
						dataType: 'json',
						async:false,
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify({
							'trainCode': trainCode,
							'trainName': trainName,
							'trainType': trainType,
							'creatorId': creatorId,
							'creatorName': creatorName,
							'remark': remark,
							'color':color,
							'projectStatus': projectStatus
						}), //提交json字符串数组，如果提交json字符串去掉[]
						success: function(data) {
							if(data.code == "000") {
								$("#myModal_home input[type=button]").attr("disabled",true);
								$(".main_card_null").remove();
								$(".card_img").remove();
								$("#myModal_home").modal('hide');
								$(".alert_success img").attr('src', 'img/green.png');
								$(".alert_content").html('添加成功！');
								$(".alert_success").show();
								setTimeout(function() {
									$(".alert_success").hide();
								}, 2000);
								projectTrainLists();
	
							}else if(data.code=="110"){
	        						location.href='login.html';
	        				}else {
									$("#myModal_home").modal('hide');
								$(".alert_success img").attr('src', 'img/error.png');
		
								$(".alert_content").html('添加失败！');
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
				}

			}
	
		});

		//新建项目
		$('.add_new').click(function(){
			$("#myModal_home").modal();
			$("#myModal_home input[type=button]").attr("disabled",false);
		});
		//获取项目列表数据
		function projectTrainLists() {
			var projectType = "";
			var projectName = "";
			var pageNo = '1';
			var pageSize = '10';
			$.ajax({
				type: 'POST',
				url: urlstr + 'bizProTrainController/projectTrainList.do?token=' + sessionStorage.getItem('token')+'&'+timeStamp,
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'projectType': projectType,
					'projectName': projectName,
					'pageNo': pageNo,
					'pageSize': pageSize,
					'userId':sessionStorage.getItem('userId')
				}),
				success: function(data) {
					var list_info = data;
					if(list_info.code == "000") {
						var pageInfo = list_info.pageInfo;
							//-----------------实验项目无数据---------------------
						if(pageInfo.length == 0) {
							$("#my_test div:last-child").css('color','#cbcbcb');
							$("#my_test div:last-child").hover(function(){
								$(this).css('text-decoration','none');
							});
							$("#my_test div:last-child").off('click');
							$(".add-cards").append('<div class="card_null"><img class="card_img" src="img/pic_project_blank.png" alt="" /><span class="white_page">您还没有创建实验项目，快去新建一个吧</span></div> ');
							$(".y-content").css('height', '840px');
							$(".add-cards").css("height",'250px');
							$(".main_card_null").click(function() {
								$("#myModal_home").modal();
							});
						} else {
							$(".mian-content-card").remove();
							$(".card_null").remove();
							$("#my_test div:last-child").css('color','#2992f1');
							$("#my_test div:last-child").hover(function(){
								$(this).css('text-decoration','underline');
							});		
							$("#my_test div:last-child").on('click');
							$(".add-cards").css("height",'285px');
								if(pageInfo.length < 4 ) {
									for(var i = 0; i <pageInfo.length; i++) {
										for(var j =0;j<type_info_list.length;j++){
											if(type_info_list[j].dictItemCode ==pageInfo[i].trainCode){
						//						addlist("", '', pageInfo[i], new Date(pageInfo[i].createDate), "", type_info_list[j].dictItemName)
												addcard("left-move", pageInfo[i], "", "", type_info_list[j].dictItemName);
											}
										}
									}
								} else {
									pageInfo =pageInfo.slice(0,4)
									for(var i = 0; i <pageInfo.length; i++) {
										for(var j =0;j<type_info_list.length;j++){
											if(type_info_list[j].dictItemCode ==pageInfo[i].trainCode){
						//						addlist("", '', pageInfo[i], new Date(pageInfo[i].createDate), "", type_info_list[j].dictItemName)
												addcard("left-move", pageInfo[i], "", "", type_info_list[j].dictItemName);
											}
											
										}
									}
								}							
							

	
							//--------------------------------修改页面---------------------------------
							$(".button-enter button:last-child").click(function() {
									 projectId = $(this).parent().siblings('.item_name').children("input").val();
									projectTrainDetailShow(projectId);
									$("#myModal_new_home").modal();
									$('#myModal_new_home input[type=button]').attr("disabled",false);
							});
								//---------------------配置你的databrain---------------
							$(".button-enter button:first-child").click(function() {
								var projectID = $(this).parent().siblings('.item_name').find('input').val();
								var send_info = pageInfo[$(this).parents(".mian-content-card").index()];
								sessionStorage.setItem('creatorId', send_info.creatorId);
								sessionStorage.setItem('projectStatus', send_info.projectStatus);
								sessionStorage.setItem('remark', send_info.remark);
								sessionStorage.setItem('trainCode', send_info.trainCode);
								sessionStorage.setItem('trainId', send_info.trainId);
								sessionStorage.setItem('trainName', send_info.trainName);
								sessionStorage.setItem('trainType', send_info.trainType);
								console.log($(this).parent().siblings('.item_name').text())
								var item_name = $(this).parent().siblings('.item_name').text()
								window.open('web/h5wf/index.html?projectID='+projectID+'&&name='+item_name+'');
							});
						}
	
					}else if(data.code=="110"){
        				location.href='login.html';
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
//		projectTrainLists()

		function addcard(leftmove, data, lili, span, traintype) {
			$(".add-cards").append('<div class="mian-content-card main-card-first ' + leftmove + '">'+
				'<img src="img/pic_top.png" alt="" /><div class="item_name">' + data.trainName + '<input type="hidden" value="' + data.trainId + '"/></div>'+
	
				'<p class="card-num"><span class="card_name">项目类型</span><span class="'+lili+'" style="background:'+data.color+'">' + traintype+ '</span><input type="hidden" value="' + data.trainCode + '"/></p>'+
				'<p class="card-time"><span class="card_name">创建人</span><span>' + data.creatorName + '</span></p>'+
				'<p class="card-people"><span class="card_name">创建时间</span>' + formatDate(new Date(data.createDate)) + '</p>'+
				'<div class="button-enter"><button>配置DataBrain</button><button><i class="icon iconfont icon-xiugai"></i><span>修改</span></button></div></div>')
		};
		function formatDate(now) {
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "年" + month + "月" + date + "日"
		};
        //获取消息列表
    	function user_info(){
			$.ajax({
				type:'get',
				url:urlstr+'userMessageController/userMessageList?token='+token+'&'+timeStamp,
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
							for(var i=0;i<my_info.length;i++){
								if(my_info[i].status=="0"){
									$(".list-ul").append('<li >'+
				    				'<div class="my_info-title1"><i class="icon iconfont icon-xitongxiaoxi"></i><span>'+my_info[i].title+'</span><span class="my-info-tishi1"></span></div>'+
				    				'<div class="my_info-time1">'+formatDate(new Date(my_info[i].createTime))+'</div>'+
				    				'<input type="hidden" value="'+my_info[i].id+'"/>'+
			    					'</li>')
								}else{
									$(".list-ul").append('<li>'+
				    				'<div class="my_info-title"><i class="icon iconfont icon-xitongxiaoxi"></i><span>'+my_info[i].title+'</span><span class="my-info-tishi"></span></div>'+
				    				'<div class="my_info-time">'+formatDate(new Date(my_info[i].createTime))+'</div>'+
				    				'<input type="hidden" value="'+my_info[i].id+'"/>'+
			    					'</li>')						
								}
							};
							$(".list-ul li").not(":first-child").click(function(){
								$(".my_info_").click();
								sessionStorage.setItem('user_info_id',$(this).children('input').val());
//								$(".my_info-list li").click()
								$(".detail_content_title>div").remove();
								$(".detail_content_title>span").remove();
								$(".info_list").hide();
								$(".detail_content").show();
								$(".y-content").css('height','805px');
								$(".title-second").show();
								var id =$(this).children('input').val();
								for(var i=0;i<my_info.length;i++){
									if(id==my_info[i].id){
										$(".detail_content_title").append('<div>'+
										'<span>'+my_info[i].title+'</span><a>点击查看</a>'+					
										'	</div>'+
										'	<span>'+formatDate_new(new Date(my_info[i].createTime))+'</span>')
									}
								}
								$.ajax({
									type:'get',
									url:urlstr+'userMessageController/ modifyStatus?token='+token+'&'+timeStamp,
									data:{
										id:id
									},
									success:function(data){
										
									},
									error:function(data){
										console.log(data)
									}
								})
							});					
						}
	
					}else if(data.code=="110"){
        				location.href='login.html';
        			}else{
						$(".info_list").html("");
						$(".info_list").append('<div class="card_null"><img class="card_img" src="img/pic_message_blank.png" alt="" /><span class="white_page">您还没有消息哦~</span></div> ');
						$('.card_null').css('margin-top','210px');
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
		//获取百度云链接
		$(".list-ul li:first-child").click(function(){
			window.open('http://pan.baidu.com/s/1hrJNo12');
		});
		user_info();
		function projectTrainDetailShow(projectId) {
			$.ajax({
				type: 'POST',
				url: urlstr + 'bizProTrainController/projectTrainDetail.do?token=' + sessionStorage.getItem('token')+'&'+timeStamp,
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					'trainId': projectId
				}),
				success: function(data) {
					if(data.code == "000") {
						$("#name_new_home").val(data.bizProjectTrain.trainName);
						$(".home_list_select1 span:nth-child(1)").css('background',data.bizProjectTrain.color);
                        for(var i=0;i<type_info_list.length;i++){
                        	if(type_info_list[i].dictItemCode==data.bizProjectTrain.trainCode){
                        		$(".home_list_select1 span:nth-child(2)").text(type_info_list[i].dictItemName);
                        	}
                        }
//						$(".home_list_select1 span:nth-child(2)").text()
						$(".home_list_select1 input:nth-child(4)").val(data.bizProjectTrain.trainCode);
						$(".home_list_select1 input:nth-child(5)").val(data.bizProjectTrain.color);
						$("#miaoshu_new_home").val(data.bizProjectTrain.remark);
						
	
					} else if(data.code == "100") {
						alert('projectID' + JSON.parse(data.result).projectId + '不存在');
					}else if(data.code=="110"){
        				location.href='login.html';
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

		//修改数据
		$('#myModal_new_home input[type=button]').click(function() {
//			console.log(length_validate_home)
			if(length_validate_home===false){
				
			}else{
				var trainId = projectId;
				var trainCode = $(".home_list_select1 input:nth-child(4)").val();
				var trainName = $('#name_new_home').val();
				var trainType = "1";
				var creator = sessionStorage.getItem('name');
				var remark = $('#miaoshu_new_home').val();
				var projectStatus = "1";
				$.ajax({
					type: 'POST',
					url: urlstr + 'bizProTrainController/projectTrainModify.do?token=' + sessionStorage.getItem('token')+'&'+timeStamp,
					dataType: 'json',
					async:false,
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify({
						'trainId': trainId,
						'trainCode': trainCode,
						'trainName': trainName,
						'trainType': trainType,
						'creator': creator,
						'color':$(".home_list_select1 input:nth-child(5)").val(),
						'remark': remark,
						'projectStatus': projectStatus
					}), //提交json字符串数组，如果提交json字符串去掉[]   
					success: function(data) {
						if(data.code == "000") {
							$("#myModal_new_home input[type=button]").attr("disabled",true);
	
							$("#myModal_new_home").modal('hide');
							$(".alert_success img").attr('src', 'img/green.png');
							$(".alert_content").html('修改成功！');
							$(".alert_success").show();
							setTimeout(function() {
								$(".alert_success").hide();
							}, 2000);
							projectTrainLists();
							projectId = "";
						}else if(data.code=="110"){
	        				location.href='login.html';
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
		function same_edit(i, pageInfo) {
			if(i > 0) {
				for(var j =0;j<type_info_list.length;j++){
					if(type_info_list[j].dictItemCode ==pageInfo[i].trainCode){
						addcard("left-move", pageInfo[i], "", "", type_info_list[j].dictItemName);
					}
				}				
			} else {
				for(var j =0;j<type_info_list.length;j++){
					if(type_info_list[j].dictItemCode ==pageInfo[i].trainCode){
						addcard("left-move", pageInfo[i], "", "", type_info_list[j].dictItemName);
					}
				}	
			}
		};
		//转化时间格式
		function formatDate(now) {
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes();
			var second = now.getSeconds();
			return year + "-" + add(month) + "-" + add(date) + "   " ;
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
		//新增分类
//		var type_info_list=JSON.parse(sessionStorage.getItem('type_info'));
//		console.log(type_info_list)
		//对项目名称进行验证
		var length_validate = true
		$('#name_home').blur(function(){
		      var pattern_char = /[A-Za-z0-9_-]/g;
		      var pattern_chin = /[\u4e00-\u9fa5]/g;
		      var count_char = $(this).val().match(pattern_char);
		      var count_chin = $(this).val().match(pattern_chin);
		      if(count_char !==null && count_chin !==null){
			      if(count_char.length  + count_chin.length*2>32){
			      	$(this).next().text('字符长度不超过32');
			      	$(this).next().show();
			      	length_validate = false;
			      }else{
			      	$(this).next().text('此项为必填');
			      	$(this).next().hide();
			      	length_validate = true;
			      }  	
		      }else{
		      	if(count_char !==null){
		      		if(count_char.length>32){
				      	$(this).next().text('字符长度不超过32');
				      	$(this).next().show();
				      	length_validate = false;
		      		}else{
		    	      	$(this).next().text('此项为必填');
			      		$(this).next().hide();
			      		length_validate = true;
		      		}
		      	}else{
		      		if(count_chin.length>16){
		      			$(this).next().text('字符长度不超过32');
				      	$(this).next().show();
				      	length_validate = false;
		      		}else{
		      			$(this).next().text('此项为必填');
			      		$(this).next().hide();
			      		length_validate = true;
		      		}
		      	}
		      }
		
		})
		//修改项目名称进行验证
		var length_validate_home = true;
		$('#name_new_home').blur(function(){
		      var pattern_char = /[A-Za-z0-9_-]/g;
		      var pattern_chin = /[\u4e00-\u9fa5]/g;
		      var count_char = $(this).val().match(pattern_char);
		      var count_chin = $(this).val().match(pattern_chin);
		      if(count_char !==null && count_chin !==null){
			      if(count_char.length  + count_chin.length*2>32){
			      	$(this).next().text('字符长度不超过32');
			      	$(this).next().show();
			      	length_validate_home = false;
			      }else{
			      	$(this).next().text('此项为必填');
			      	$(this).next().hide();
			      	length_validate_home = true;
			      }  	
		      }else{
		      	if(count_char !==null){
		      		if(count_char.length>32){
				      	$(this).next().text('字符长度不超过32');
				      	$(this).next().show();
				      	length_validate_home = false;
		      		}else{
		    	      	$(this).next().text('此项为必填');
			      		$(this).next().hide();
			      		length_validate_home = true;
		      		}
		      	}else{
		      		if(count_chin.length>16){
		      			$(this).next().text('字符长度不超过32');
				      	$(this).next().show();
				      	length_validate_home = false;
		      		}else{
		      			$(this).next().text('此项为必填');
			      		$(this).next().hide();
			      		length_validate_home = true;
		      		}
		      	}
		      }
		
		})
		
	}else{
		location.href='login.html';
	}
	
	var body_height = ($(window).height()-571)/2;
	$("#myModal_new_home .modal-dialog").css('margin-top',body_height);
	$("#myModal_home .modal-dialog").css('margin-top',body_height);
});