$(function() {
	//让弹出框居中
	var move_width = ($('body').width() - 640) / 2;
	var move_height = ($('body').height() - 400) / 2;
	$("#alert_table").css('left', move_width + 'px');
	$("#alert_table").css('top', move_height + 'px');
	var exits = true;
	setTimeout(function() {
		$.ajax({
			type: 'post',
			url: server + '/component/load_hive_reader?'+timeStamp,
			async: false,
			data: {
				project_id: proid,
				component_id: $("#hive-main").attr("data"),
			},
			success: function(data) {
				function success(){
					if(dataBack(data).detail === null) {
						exits = false;
					} else {
						var datas = dataBack(data).detail;
						$("#hive_table_name").val(datas.table_name);
						$("#hive_table_name").attr('title',datas.table_name);
						$("#hive_name_new").val(datas.logic_name);
						$("#hive_name_new").attr('title',datas.logic_name);
						$(".table_name span").text(datas.table_name);
						$(".edit_table_fields").show();
						$(".search_table").hide();
						$(".hive_ul").hide();
						$("#hive_table_name").attr('readonly','readonly')
						console.log($('.hive'))
						for(var i in $(".hive")){
							if($(".hive").eq(i).attr('compid')==$("#hive-main").attr('data')){
								console.log($(".hive").eq(i))
								$(".hive").eq(i).attr('tablename',datas.table_name)
							}
						}
					}	
				}
				backInfo(data,success)
			},
			error: function(data) {
				layer.msg('接口请求失败');
			}
		})
	}, 10)
	//查询功能
	$(".search_table").click(function() {
		var save_layer = layer.load(1, {
			shade: [0.4, '#000'] //0.1透明度的白色背景
		});
		$.ajax({
			type: 'post',
			url: server + '/hive/list_table?'+timeStamp,
			data: {
				query_str: $('#hive_table_name').val()
			},
			success: function(data) {
				layer.close(save_layer);
				function success(){
					var data_talble = dataBack(data).detail;
					if(data_talble.length===0){
						alert('数据库中不存在该表')
					}else{
							$(".hive_ul").html('');
					for(var i = 0; i < data_talble.length; i++) {
						$(".hive_ul").append(
							'<li>' +
							'<div>' +
							'<span class="see_fields_type" title="'+data_talble[i]+'">' + data_talble[i] + '</span>' +
							'<p class="see_fields"><em></em><span>预览</span></p>' +
							'</div>' +
							'</li>'
						);
					};
					if($(".hive_ul").height()>200){
						$(".hive_ul").css({
							'overflow-y':'auto',
							'max-height':'200px',
							'overflow-x':'hidden'
						})
					}
					$(".hive_ul").slideToggle()	
					}
								
				}
				backInfo(data,success)
			},
			error: function(data) {
				layer.msg('接口请求失败');
			}
		});

	});
	$("#hive_table_name").on('input',function(){
		$(".hive_ul").slideUp();
	})
	//修改表数据类型
	$(".hive_ul").on('click', '.see_fields_type', function() {
		console.log('7777')
		//获取连接终点是否一致
		var target = ''
		for(var i=0;i<$(".hive").length;i++){
			if( $('.hive').eq(i).attr('compid')===$("#hive-main").attr('data')){
				target = $('.hive').eq(i).attr('target')
			}
		}	
		//获取表名是否一致
		var same_status = false;
//		for(var i = 0; i < $(".hive").length; i++) {
//			if($(this).text() === $('.hive').eq(i).attr('tablename') && $('.hive').eq(i).attr('target')===target) {
//				same_status = true;
//			}
//		}
		if(same_status === false) {
			var save_layer = layer.load(1, {
				shade: [0.4, '#000'] //0.1透明度的白色背景
			});
			$(".table_fields").html('');
			var _this = this;
			$.ajax({
				type: 'post',
				url: server + '/hive/structure?'+timeStamp,
				data: {
					table_name: $(this).text()
				},
				success: function(data) {
					layer.close(save_layer);
					function success(){
						console.log($("#search"))
						var fields = dataBack(data).detail;
						dataType(fields);
						$(".table_name>span").text($(_this).text());
						$(".shadow").show();
						$("#alert_table").fadeIn();
						$('.hive_ul').slideUp();	
						
					}
					backInfo(data,success)

				},
				error: function(data) {
					layer.msg('接口请求失败');
				}
			});
		}
//		else {
//			layer.alert('不能选择重复表', {
//				icon: 2,
//				title: '提示'
//			});
//		}

	});
	//查看表字段
	$(".hive_ul").on('click', '.see_fields', function() {
		$(".fields_table").html('');
		$.ajax({
			type: 'post',
			url: server + '/hive/structure?'+timeStamp,
			data: {
				table_name: $(this).prev().text()
			},
			success: function(data) {
				function success(){
					var fields = dataBack(data).detail;
					for(var i = 0; i < fields.length; i++) {
						$(".fields_table").append(
							'<li>' +
							'<ul>' +
							'<li class="one" title="' + fields[i].field + '">' + fields[i].field + '</li>' +
							'<li>' + fields[i].database_type + '</li>' +
							'</ul>' +
							'</li>'
						)
					}					
				}
				backInfo(data,success);
			},
			error: function(data) {
				layer.msg('接口请求失败');
			}
		})
		$("#fields").fadeIn();
		$("#fields_val").fadeIn();
	});

	//关闭表字段
	$('#close_fields').click(function() {
		$("#fields").fadeOut();
		$("#fields_val").fadeOut();
	});
	//重新选择表字段
	$("#hive_table_new").click(function() {
		$("#all-select").prop("checked",true);
		$("#hive_table_name").attr('readonly',false);
		$("#alert_table").fadeOut();
		$(".shadow").hide();
		$("#hive_table_name").val('');
		$("#hive_table_name").removeAttr('title');
		$("#hive_name_new ").val('');
		$("#hive_name_new").removeAttr('title');
		$(".edit_table_fields").hide();
		$(".search_table").show();
		for(var i = 0; i < $(".hive").length; i++) {
			if($('.hive').eq(i).attr('compid') === $("#hive-main").attr('data')) {
				$('.hive').eq(i).attr('tableName', '')
			}
		}
	});
	//数据类型下拉
	$(".table_fields").on('click', '.type_list', function() {
		 var field_type_select = $(this).next().find('li');
		if($(this).text() === 'numeric') {
			field_type_select.text('factor');
		} else {
			field_type_select.text('numeric');
		}
		if($(this).next().is(':hidden')){
			$(".type_list").next().hide()
			$(this).next().show()
		}else{
			$(this).next().hide()
		}
	});
	$(".table_fields").on('click', '.type_list_val li', function() {
		console.log('6666')
		 var select_ul = $(this).parent()
		select_ul.prev().find('span').text($(this).text());
		if(select_ul.is(':hidden')){
			select_ul.show()
		}else{
			select_ul.hide()
		}
	});
	//日期类型下拉
	$(".table_fields").on('click', '.date_type_list', function() {
//		$(this).next().slideToggle();
		if($(this).next().is(':hidden')){
			$(".date_type_list").next().hide()
			$(this).next().show()
		}else{
			$(this).next().hide()
		}
	});
	$(".table_fields").on('click', '.data_type_list_val li', function() {
		var date_ul = $(this).parent()
		date_ul.prev().find('span').text($(this).text());
		date_ul.prev().find('input').val($(this).find('input').val());
		if(date_ul.is(':hidden')){
			date_ul.show()
		}else{
			date_ul.hide()
		}
	});

     //全选按钮自动选择
	$(document).on("change", "input[name='select']", function () {
        var checkedNum=$("input[name='select']:checked").length;

		var uncheckedNum = $("input[name='select']").length;

		$("#all-select").prop("checked",checkedNum==uncheckedNum);

	});
    //全选按钮与其他按钮关系
    $(document).on("change", "#all-select", function () {

        $("input[name='select']").prop("checked",$(this).prop("checked"));
	});

    //保存表数据类型
	$("#hive_table_save").click(function() {
        var count=0;
        for(var i = 0; i < $(".table_fields>li").length; i++) {
			if($(".table_fields>li").eq(i).find('.fields_sel').find("input:first").prop("checked")==true){
            	count++;
			}
		}
		if(count>=2){
            $(".edit_table_fields").show();
            $(".search_table").hide();
            var structures = [];
            for(var i = 0; i < $(".table_fields>li").length; i++) {
                var field = $(".table_fields>li").eq(i).find('.fields_one').text();
                var field_type = ''
                if($(".table_fields>li").eq(i).find('.type_list>span').text() === '暂不支持此数据类型') {
                    field_type = 'null';
                } else {
                    field_type = $(".table_fields>li").eq(i).find('.type_list>span').text()
                }
                var database_type = $(".table_fields>li").eq(i).find('.database_type').val();
                var date_format = $(".table_fields>li").eq(i).find('.date_format').val();
                var ignore = $(".table_fields>li").eq(i).find('.ignore').val();
                var date_size = $(".table_fields>li").eq(i).find('.date_size').val();

                var selected = $(".table_fields>li").eq(i).find('.fields_sel').find("input:first").prop("checked");

                structures.push({
                    "field": field,
                    'field_type': field_type,
                    'database_type': database_type,
                    'date_format': date_format,
                    'ignore': ignore,
                    'date_size': date_size,
                    'selected':selected
                })
            }
            console.log(structures);
            //保存字段类型时添加转圈
            $("#alert_table").fadeOut();
			$(".img_load").show();
            $.ajax({
                type: 'post',
                url: server + '/io/save_field_type?'+timeStamp,
                data: {
                    project_id: proid,
                    component_id: $("#hive-main").attr("data"),
                    structures: structures
                },
                success: function(data) {
                    function success(){
                        $(".shadow").hide();
                        $("#alert_table").fadeOut();
                        $("#hive_table_name").attr('readonly', 'readonly');
                        if($("#hive_name_new ").val().length === 0) {
                            $("#hive_table_name").val($(".table_name>span").text());
                            $("#hive_table_name").attr('title',$(".table_name>span").text());
                            $("#hive_name_new ").val($(".table_name>span").text());
                            $("#hive_name_new ").attr('title',$(".table_name>span").text());
                        } else {
                            $("#hive_table_name").val($(".table_name>span").text());
                            $("#hive_table_name").attr('title',$(".table_name>span").text());
                        }
                    }
                    backInfo(data,success)
                    //保存字段类型时，添加转圈
                    $(".img_load").hide();
                },
                error: function(data) {
                    layer.msg('接口请求失败');
                }
            })
		}else{
			alert("不能少于2个字段");
		}



	});
	//组件保存
	$(".m_save_reader").click(function() {
		
		$.ajax({
			type: 'post',
			url: server + '/component/save_hive_reader?'+timeStamp,
			data: {
				project_id: proid,
				component_id: $("#hive-main").attr("data"),
				table_name: $("#hive_table_name").val(),
				logic_name: $("#hive_name_new ").val()
			},
			success: function(data) {
				function success(){
					layer.alert('保存成功!', {
						icon: 1,
						title: '提示'
					});		
					for(var i = 0; i < $(".hive").length; i++) {
						if($('.hive').eq(i).attr('compid') === $("#hive-main").attr('data')) {
							$('.hive').eq(i).attr('tableName', $("#hive_table_name").val())
						}
					}
				}
				backInfo(data,success)

			},
			error: function(data) {
				layer.msg('接口请求失败');
			}
		})
	});
	//查看保存数据类型
	$(".hive-right-content_ul").on('click', '.edit_table_fields', function(e) {
		e.stopPropagation();
		//		var save_layer = layer.load(1, {
		//	      shade: [0.4,'#000'] //0.1透明度的白色背景
		//	  });
		$(".hive_ul").css('display', 'none !important');
		$(".table_fields").html('');
		$.ajax({
			type: 'post',
			url: server + '/io/load_field_type?'+timeStamp,
			data: {
				project_id: proid,
				component_id: $("#hive-main").attr("data"),
			},
			success: function(data) {
				function success(){
					var fields = dataBack(data).detail;
					dataType(fields);
					$(".shadow").show();
					$("#alert_table").fadeIn();
					$(".hive_ul").css('display', 'none !important');					
				}
				backInfo(data,success);
			},
			error: function(data) {
				layer.msg('接口请求失败');
			}
		})
	});
	$("#hive_table_cancel").click(function() {
		$("#alert_table").fadeOut();
		$(".shadow").hide();
	})
	//数据类型封装函数
	function dataType(fields) {

		for(var i = 0; i < fields.length; i++) {
			if(fields[i].ignore === true) {
				var data = same_hidden_str(fields[i],true);
				var fieldsStr = same_field_str(fields[i]);
				$(".table_fields").append(
					fieldsStr+
					'<span class="error_type" title="' + fields[i].database_type + '">暂不支持此数据类型</span>' +
					data+
					'</div>' +
					'</li>' +
					'</ul>' +
					'</li>'
				);
				$(".type_list").css('width', 'auto');
			} else {
				 if(fields[i].field_type === 'date') {
						var data = same_hidden_str(fields[i],false);
						var fields_str = same_field_str(fields[i]);
						var differents = '';
						if(fields[i].date_size === 'day'){
							differents = ''
						}else{
							differents = '<li><span>秒</span><input type="hidden" value="second"/></li>' +
							'<li><span>分</span><input type="hidden" value="minute"/></li>' +
							'<li><span>时</span><input type="hidden" value="hour"/></li>' 
						}
						var dateStr = ''
						if(fields[i].date_format==='day'){
							dateStr='日'
						}else if(fields[i].date_format==='month'){
							dateStr='月'
						}else if(fields[i].date_format==='year'){
							dateStr='年'
						}else if(fields[i].date_format==='second'){
							dateStr='秒'
						}else if(fields[i].date_format==='minute'){
							dateStr='分'
						}else{
							dateStr='时'
						}
						$(".table_fields").append(
							fields_str+
							'<span>' + fields[i].field_type + '</span>' +
							data+
							'</div>' +
							'</li>' +

							'<li class="fields_three">' +
							'<div class="date_type_list">' +
							'<span>' + dateStr + '</span><em></em>' +
							'<input type="hidden" class="date_format" value="' + fields[i].date_format + '"/>' +
							'</div>' +
							'<ul class="data_type_list_val">' +
							differents+
							'<li><span>日</span><input type="hidden" value="day"/></li>' +
							'<li><span>月</span><input type="hidden" value="month"/></li>' +
							'<li><span>年</span><input type="hidden" value="year"/></li>' +
							'</ul>' +
							'</li>' +
							'</ul>' +
							'</li>'
						)
				} else { 
					var data = same_hidden_str(fields[i],true);
					var fields_str = same_field_str(fields[i]);
					var type = ''
					if(fields[i].field_type === 'factor'){
						type = "numeric"
					}else{
						type="factor"
					}
					var differentStr = '<span>' + fields[i].field_type + '</span><em></em>' 
					var	hide_ul = '<ul class="type_list_val">' +
						'<li>'+type+'</li>' +
						'</ul>' 
					$(".table_fields").append(
						fields_str+
						differentStr+
						data+
						'</div>' +
						hide_ul+
						'</li>' +
						'</ul>' +
						'</li>'
					)
				}

			}
		};
	};
	function same_hidden_str(fields,dataType){
		var str = '';
		if(dataType===true){
			str = '<input type="hidden" class="date_format" value="' + fields.date_format + '"/>' 
		}else{
			str=''; 			
		}
		return '<input type="hidden" class="database_type" value="' + fields.database_type + '"/>' +
				str+
				'<input type="hidden" class="ignore" value="' + fields.ignore + '"/>' +
				'<input type="hidden" class="date_size" value="' + fields.date_size + '"/>' 	

	}
	function same_field_str(fields){
		var str ='';
		if(fields.ignore==false){
            if(fields.selected==true){
                str =  '<li class="fields_sel">'+'<input type="checkbox" name="select" checked="'+fields.selected+'"></li>';
            }else{
                str = '<li class="fields_sel">'+'<input type="checkbox" name="select" ></li>';
                $("#all-select").prop("checked",false);
            }
		}else{
			str='<li class="fields_sel">'+'<input type="checkbox" name="select" disabled><img src="img/img/icon_e.png"/></li>';
		}

		return '<li>' +
				'<ul>' +
               str +
				'<li class="fields_one" title="'+fields.field+'">' + fields.field + '</li>' +
				'<li class="fields_two">' +
				'<div class="type_list">'

	}
})