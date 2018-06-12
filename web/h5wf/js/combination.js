$(function() {
	setTimeout(function() {
		var souid_arr = $("#csv-combination").attr('souid').split(',');
		if(souid_arr.length<2){
			layer.alert('请选择相应组件进行连接', {
				icon: 2,
				title: '提示'
			});
		}else{
		var component_robotx = '';
		var robotx_spark_id = '';
		var self_defined_feature_id = '';
		for(var i = 0; i < souid_arr.length; i++) {
			if(souid_arr[i].substring(0, 11) === "RobotXSpark") {
				component_robotx = souid_arr[i];
				robotx_spark_id = souid_arr[i]
			} else {
				self_defined_feature_id = souid_arr[i]
			}
		};

		//获取csv自定义特征字段
		var csv_return_info = []
		$.ajax({
			type: 'post',
			url: server + '/self_defined_feature/load_field_type?'+timeStamp,
			data: {
				project_id: proid,
				component_id: self_defined_feature_id,
			},
			async: false,
			success: function(data) {
				function success(){
					csv_return_info = dataBack(data).detail;
				};
				backInfo(data,success)
			},
			error: function(data) {
				layer.msg('接口请求失败');
			}
		});
		//获取robotx_spark特征字段
		var return_info;
		$.ajax({
			type: 'post',
			url: server + '/feature_combine/robotx_spark_key_fields?'+timeStamp,
			data: {
				project_id: proid,
				component_id: component_robotx,
			},
			async: false,
			success: function(data) {
				function success(){
					var datas = dataBack(data).detail;
					return_info = datas
					var csv_str = '';
					for(var i = 0; i < csv_return_info.length; i++) {
						csv_str += '<li title="' + csv_return_info[i].field + '">' + csv_return_info[i].field + '</li>'
					}
					for(var j = 0; j < datas.length; j++) {
						$(".reader-right-content_ul").append(
							'<li>' +
							'<ul>' +
							'<li class="list" title="' + datas[j] + '">' + datas[j] + '</li>' +
							'<li class="list_second">' +
							'<div class="list_sel"><span >选择关联键</span><em></em></div>' +
							'<ul class="list_val">' +
							'<li></li>' + csv_str +
							'</ul>' +
							'</li>' +
							'</ul>' +
							'</li>'
						)
					}
				};
				backInfo(data,success)

			},
			error: function(data) {
				layer.msg('接口请求失败');
			}

		});	
				var select_list = $(".reader-right-content_ul>li").not(':first-child');
		//查看组件是否已保存
		$.ajax({
			type: 'post',
			url: server + '/feature_combine/load_relation?'+timeStamp,
			data: {
				project_id: proid,
				component_id: $("#csv-combination").attr('data'),
				robotx_spark_id: robotx_spark_id,
				self_defined_feature_id: self_defined_feature_id,
			},
			success: function(data) {
				function success(){
					if(dataBack(data).detail===null){
					}else {
						var datas = dataBack(data).detail;
						for(var i = 0; i < datas.length; i++) {
							for(var j=0;j<select_list.length;j++){
								if( select_list.eq(j).find('.list').text()===datas[i].robotx_field){
									select_list.eq(j).find('.list_sel>span').css('color', '#383838')
									select_list.eq(j).find('.list_sel>span').text(datas[i].self_defined_field)									
								}
							}
						}
					};					
				}
				backInfo(data,success)
			},
			error: function(daat) {
				layer.msg('接口请求失败');
			}
		})
		}


		//关联键列表显示隐藏
		$(".reader-right-content_ul").on('click', '.list_sel', function() {
			var Association_ul = $(this).next()
			if(Association_ul.is(':hidden')){
				$(".list_val").hide()
				Association_ul.show()
			}else{
				Association_ul.hide()
			}
		})
		//将下拉列表选中项添加到输入框中
		$(".reader-right-content_ul").on('click', ".list_val>li", function() {
			var fields_selected = $(this).parent().prev().find('span');
			var fields_list = $(this).parent();
			fields_selected.text($(this).text())
			fields_selected.attr('title', $(this).text())
//			fields_list.slideToggle();
			if(fields_list.is(':hidden')){
				fields_list.show()
			}else{
				fields_list.hide()
			}
			fields_selected.css('color', '#383838')
		});
		//保存
		$(".c_save_reader").click(function() {
			var connections = [];
			for(var i = 0; i < select_list.length; i++) {
				if(select_list.eq(i).find('.list_sel>span').text()==='' ||select_list.eq(i).find('.list_sel>span').text()==="选择关联键"){
					
				}else{
					connections.push({
						'robotx_field': select_list.eq(i).find('.list').text(),
						'self_defined_field': select_list.eq(i).find('.list_sel>span').text()
					})					
				}

			}
			var second_name = [];
			var no_select = [];
			var null_arr = [];
			for(var h = 0; h < $(".list_sel span").length; h++) {
				if($(".list_sel span").eq(h).text() === "选择关联键") {
					no_select.push($(".list_sel span").eq(h).text())
				}
				if($(".list_sel span").eq(h).text() === "") {
					null_arr.push($(".list_sel span").eq(h).text())
				} else {
					second_name.push($(".list_sel span").eq(h).text())

				}

			}
			var nary = second_name.sort();
			var same_alert = null;
			for(var i = 0; i < second_name.length; i++) {
				if(second_name[i] == second_name[i + 1]) {
					same_alert = false;
				}

			};
			if(null_arr.length === select_list.find('.list').length || no_select === select_list.find('.list').length) {

				layer.alert('至少选择一个关联键！', {
					icon: 2,
					title: '提示'
				});

			}else if(same_alert === false) {
				layer.alert('同一关联键不可对应多个主键！', {
					icon: 2,
					title: '提示'
				});
			} else {
				$.ajax({
					type: 'post',
					url: server + '/feature_combine/save_relation?'+timeStamp,
					data: {
						project_id: proid,
						component_id: $("#csv-combination").attr('data'),
						robotx_spark_id: robotx_spark_id,
						self_defined_feature_id: self_defined_feature_id,
						connections: connections,
					},
					success: function(data) {
						function success(){
							layer.alert('保存成功！', {
								icon: 1,
								title: '提示'
							});							
						}
						backInfo(data,success)
					},
					error: function(data) {
						layer.msg('接口请求失败');
					}
				})
			}

		})
	}, 10);
	//	运行参数配置
	$(".run").click(function(){
		runParameter($("#csv-combination").attr('data'))
		$("#runContent").fadeIn()
		$("#shadowBody").show()
	})
})