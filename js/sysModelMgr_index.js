$(function(){
    AjaxLoad();
//  $(".tpl-content").css('height','805px')
    $(".y-content").css('height','922px');
    //清楚点击时候的缓存
    sessionStorage.removeItem('user_info_id');
    //删除模型
//  $(document).on('click','.del',function(){
//       models_id = $(this).attr('data');
//      $('#myModal_alert_new1').modal()
//      $("#myModal_alert_new1 .confirm_content span").text($(this).parent().parent().find('.list-1 span').text())
//
//
//  });
//		$("#myModal_alert_new1 .queding").click(function(){
//	      $.ajax({
//	         type:"get",
//	          url:urlstr+'pmmlController/del?id='+models_id,
//	          success:function(data){
////	              var data = JSON.parse(data);
//	              if( data.code == '000' ){
//	                 $('#'+models_id).remove();
//					$(".alert_success img").attr('src', 'img/green.png')
//					$(".alert_content").html('删除成功')
//					$(".alert_success").show()
//					setTimeout(function() {
//						$(".alert_success").hide();
//					}, 2000);	
//					$('#myModal_alert_new1').modal('hide');
//					AjaxLoad();
//	              }else{
//					$(".alert_success img").attr('src', 'img/error.png')
//					$(".alert_content").html('删除失败')
//					$(".alert_success").show()
//					setTimeout(function() {
//						$(".alert_success").hide();
//					}, 2000);	
//					$('#myModal_alert_new1').modal('hide')	                  
//	              };
//
//	          },error:function(){
//					$(".alert_success img").attr('src', 'img/error.png')
//					$(".alert_content").html('请求失败')
//					$(".alert_success").show()
//					setTimeout(function() {
//						$(".alert_success").hide();
//					}, 2000);	
//	          }
//	      });			
//		});
    //查看模型详情
    $('#tpl_cont_list').on('click','.look',function(){
//      var models_id = $(this).attr('data');
        var models_id = $(this).parent().parent().find('.list-1 span').text();
        window.open('same/details.html?id='+models_id); 
    });
	function AjaxLoad(){
	    $.ajax({
	        type:"get",
	        url:urlstr+'pmmlController/getList',
	        data:{
	        	page:1,
	        	rows:10,
	        	userId:sessionStorage.getItem('userId')
	        },
	        success:function(data){
	//         var data = JSON.parse(data);
	           if(data.code=="000"){
	           	if(data.resultList.length>0){
		           	$('#tpl_cont_list').html("")
		           page(data.pageCount)
		            for( var i = 0 ; i <data.resultList.length ; i ++ ){
		                var tsr = ' <li id="'+ data.resultList[i].id +'">'+
		                    '<ul>'+
		                        '<li class="list-1">'+
		                            '<span>'+ data.resultList[i].modelName +'</span>'+
		                        '</li>'+
		                        '<li class="list-2">'+
		                            '<span>'+ data.resultList[i].algorithm +'</span>'+
		                        '</li>'+
		                        '<li class="list-4">'+
		                            '<span>'+ formatDate(new Date(data.resultList[i].createTime)) +'</span>'+
		                        '</li>'+
		                        '<li class="list-5">'+
		                            '<div class="look" data="'+ data.resultList[i].id +'">'+
		                                '<em class="look-icon"></em>'+
		                                '<span>查看</span>'+
		                            '</div>'+
		                        '</li>'+
//		                        '<li class="list-6">'+
//		                            '<div class="del" data="'+ data.resultList[i].id +'">'+
//		                                '<em class="del-icon"></em>'+
//		                                '<span>删除</span>'+
//		                            '</div>'+
//		                        '</li>'+
//		                        '<li class="list-7">'+
//		                            '<div>'+
//		                                '<em class="down-icon"></em>'+
//		                                '<span>下载</span>'+
//		                            '</div>'+
//		                        '</li>'+
		                    '</ul>'+
		                '</li>';
		                $('#tpl_cont_list').append(tsr);
		                $("#tpl_cont_list .card_null").remove();
		                 $(".tpl-cont-list-head").show();
		                 $(".y-content").css('height','922px');
		            };            		
	           	}
      	
	           }else if(data.code==="119"){
//	           	 $('#tpl_cont_list').append('')
				$("#tpl_cont_list").append('<div class="card_null"><img class="card_img" src="img/pic_model_blank.png" alt="" /><span class="white_page">您还没有模型~</span></div> ');
	           	 $(".card_null").css('margin-top','153px');
	           	 $(".y-content").css('height','805px');
	           	 $(".tpl-cont-list-head").hide();
					$(".tpl-content .M-box3").hide();
	           }
	
	        },
	        error:function(){
					$(".alert_success img").attr('src', 'img/error.png')
					$(".alert_content").html('请求失败')
					$(".alert_success").show()
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
	        }
	    });
	};
	//分页
	function page(page){
		$('.M-box3').pagination({
			pageCount: page,
			jump: true,
			coping: true,
			prevContent: '<',
			nextContent: '>',
			callback: function(api) {
				var datas = {
					page: api.getCurrent(),
					rows: '10',
					userId:sessionStorage.getItem('userId')
				};
				$(".jump-ipt").after('<span class="span_add">页</span>');
				$(".jump-ipt").before('<p class="p_add">共<span class="span_add span_add1">' + page + '</span>页，到第</p>');
			    $.ajax({
			        type:"get",
			        url:urlstr+'pmmlController/getList',
			        data:datas,
			        success:function(data){
			//         var data = JSON.parse(data);
			           if(data.code=="000"){
			           	if(data.resultList.length>0){
				           	$('#tpl_cont_list').html("");
				            for( var i = 0 ; i <data.resultList.length ; i ++ ){
				                var tsr = ' <li id="'+ data.resultList[i].id +'">'+
				                    '<ul>'+
				                        '<li class="list-1">'+
				                            '<span>'+ data.resultList[i].modelName +'</span>'+
				                        '</li>'+
				                        '<li class="list-2">'+
				                            '<span>'+ data.resultList[i].algorithm +'</span>'+
				                        '</li>'+
				                        '<li class="list-4">'+
				                            '<span>'+ formatDate(new Date(data.resultList[i].createTime)) +'</span>'+
				                        '</li>'+
				                        '<li class="list-5">'+
				                            '<div class="look" data="'+ data.resultList[i].id +'">'+
				                                '<em class="look-icon"></em>'+
				                                '<span>查看</span>'+
				                            '</div>'+
				                        '</li>'+
//				                        '<li class="list-6">'+
//				                            '<div class="del" data="'+ data.resultList[i].id +'">'+
//				                                '<em class="del-icon"></em>'+
//				                                '<span>删除</span>'+
//				                            '</div>'+
//				                        '</li>'+
//				                        '<li class="list-7">'+
//				                            '<div>'+
//				                                '<em class="down-icon"></em>'+
//				                                '<span>下载</span>'+
//				                            '</div>'+
//				                        '</li>'+
				                    '</ul>'+
				                '</li>';
				                $('#tpl_cont_list').append(tsr);
				                $("#tpl_cont_list .card_null").remove();
				                 $(".tpl-cont-list-head").show();
				                 $(".y-content").css('height','922px');
				            };            		
			           	}
		      	
			           }else if(data.code==="119"){
		//	           	 $('#tpl_cont_list').append('')
						$("#tpl_cont_list").append('<div class="card_null"><img class="card_img" src="img/pic_model_blank.png" alt="" /><span class="white_page">您还没有模型~</span></div> ');
			           	 $(".card_null").css('margin-top','153px');
			           	 $(".y-content").css('height','805px');
			           	 $(".tpl-cont-list-head").hide();
						$(".tpl-content .M-box3").hide();
			           }
			
			        },
			        error:function(){
							$(".alert_success img").attr('src', 'img/error.png')
							$(".alert_content").html('请求失败')
							$(".alert_success").show()
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
});

