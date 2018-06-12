$(function() {
	var load_algorithm;
	var loadStatus = false;
	var loadaLgorithmValue = '';

	setTimeout(function() {
		if($("#learn-main").attr('souid') === "") {
			layer.alert('请选择相应组件进行连接', {
				icon: 2,
				title: '提示'
			});
			return
		}
		//查看组件是否load
		load()
		//获取建模列表
		$.ajax({
			type: 'get',
			url: server + '/algorithm/list?' + timeStamp,
			success: function(data) {
				function success() {
					var detail = dataBack(data).detail;
					for(var i = 0; i < detail.length; i++) {
						$("#algorithm").append('<li>' + detail[i].chinese + '<input type="hidden" value=' + detail[i].name + '></li>')
					}
					if(loadStatus === true) {
						for(var i = 0; i < $("#algorithm>li").length; i++) {
							if($("#algorithm>li").eq(i).find('input').val() === loadaLgorithmValue) {
								$("#gbm").text($("#algorithm>li").eq(i).text())
							}
						}
						$("#gbm").next().val(loadaLgorithmValue);
					} else {
						$("#gbm").text(detail[0].chinese);
						$("#gbm").next().val(detail[0].name)
					}
				};
				backInfo(data, success)
			}
		});
		var line_type = $("#learn-main").attr('souid').substring(0, 6);
		//获取数据渲染
		function appendUl(fields) {
			for(var i = 0; i < fields.length; i++) {
				$('#c_data_learn_id_list').append('<li>' + fields[i].field + '</li>');
				$('#c_data_learn_target_list').append('<li>' + fields[i].field + '</li>');
			}
		}
		if(line_type === 'RobotX') {

			//获取robotx数据
			$.ajax({
				type: 'post',
				url: server + '/robotx_spark/container_fields?' + timeStamp,
				data: {
					project_id: proid,
					component_id: $("#learn-main").attr('souid'),
				},
				success: function(data) {
					function success() {
						var fields = dataBack(data).detail
						appendUl(fields);
					};
					backInfo(data, success)
				}
			})
		} else if(line_type === 'HiveRe') {
			//获取hivereader数据
			$.ajax({
				type: 'post',
				url: server + '/io/load_field_type?' + timeStamp,
				data: {
					project_id: proid,
					component_id: $("#learn-main").attr('souid'),
				},
				success: function(data) {
					function success() {
						var fields = dataBack(data).detail;
						appendUl(fields)
					}
					backInfo(data, success)
				}
			})
		} else {
			//获取特征组合的数据
			$.ajax({
				type: 'post',
				url: server + '/feature_combine/continaer_fields?' + timeStamp,
				data: {
					project_id: proid,
					component_id: $("#learn-main").attr('souid'),
				},
				success: function(data) {
					function success() {
						var fields = dataBack(data).detail;
						appendUl(fields)
					}
					backInfo(data, success)
				}
			})
		}

	}, 10);

	//根据算法模式切换高级参数
	var algorithmStatus = true;
	//切换参数设置
	$('.right-heads>ul>li').click(function() {
		var index_lea = $(this).index();
		var _index_text = $('#gbm').text();
		$("#algorithmNameT").html(_index_text);
		$("#algorithmEName").val($('#gbm').next().val())
		if(index_lea == 0) {
			$('#learn-main>.right-content>ul').eq(0).show();
			$('#learn-main>.right-content>ul').eq(1).hide();
			$(".c_save_learn_algorithm").hide();
			$("#nameHH").hide();
		} else {
			$('#learn-main>.right-content>ul').eq(0).hide();
			$('#learn-main>.right-content>ul').eq(1).show();
			$(".c_save_learn_algorithm").show();
			$("#nameHH").show();
			$("#algorithm_list").html('');
			if(loadStatus === true && $("#gbm").next().val() === loadaLgorithmValue) {
				load()
				success_list(load_algorithm, 'true');
			} else {    
				$.ajax({
					type: 'post',
					url: server + '/algorithm/list_params?' + timeStamp,
					data: {
						algorithm: $("#gbm").next().val()
					},
					success: function(data) {
						function success() {
							var algorithmParams = dataBack(data).detail;
							success_list(algorithmParams, 'false')
						}
						backInfo(data, success)
					}
				})
			}

		};
	});
	function load(){
			$.ajax({
				type: 'post',
				url: server + '/atom_learn/load?' + timeStamp,
				async: false,
				data: {
					project_id: proid,
					input_comp_id: $("#learn-main").attr('souid'),
					atom_learn_id: $("#learn-main").attr('data')
				},
				success: function(data) {
					function success() {
						var load_data = dataBack(data).detail;
						if(load_data === 'changed' || load_data === 'null' || load_data === null) {
	
						} else {
							loadStatus = true;
							$("#c_data_learn_id").val(load_data.id);
							$("#c_data_learn_id").css('color', "#858585");
							$("#c_data_learn_target").css('color', "#858585");
							$("#c_data_learn_target").val(load_data.target);
							load_algorithm = load_data.params;
							loadaLgorithmValue = load_data.algorithm;
						}
					}
					backInfo(data, success)
				}
			});			
		};
	//分类对应的下拉列表
	$('.c_nav_list_metric').click(function() {
		if(index_learn_metric == 0) {
			if($('#metric_classification').is(':hidden')) {
				$('#metric_classification').show();
				$('#metric_regression').hide();
			} else {
				$('#metric_classification').hide();
			};
		} else {
			if($('#metric_regression').is(':hidden')) {
				$('#metric_classification').hide();
				$('#metric_regression').show();
			} else {
				$('#metric_regression').hide();
			};
		};
	});
	//是否离散化
	$("#algorithm_list").on('click', '.discre>i', function() {
		if($(this).hasClass('metric-i-active')) {
			$(this).removeClass('metric-i-active');
		} else {
			$(this).addClass('metric-i-active');
		};
	});
	$('.c-learn-newadd').click(function() {
		var strs = '<div class="c-learn-miss">' +
			'<input type="text">' +
			'<div class="c-add-close"></div>' +
			'</div>';
		$('.c-learn-newadd').before(strs);
	});
	$(document).on('click', '.c-add-close', function() {
		$(this).parent().remove();
	});
	//下拉选择
	$('.c_nav_list').click(function() {
		//隐藏全部下拉，避免UI重复
		$('#c_learn_lib_list').hide();
		$('#c_learn_data_list').hide();
		$(this).next().show();
	});
	//下拉选择加载
	$(document).on('click', '#learn-main>.right-content>ul>li>ul>li', function() {
		var _this_text = $(this).text();
		var value = $(this).find('input').val();
		$(this).parent().parent().find('.c_nav_list').find('input').val(_this_text);
		$(this).parent().parent().find('input').css('color', '#858585');
		$(this).parent().parent().find('em').text(_this_text);
		$(this).parent().parent().find('em').next().val(value);
		$(this).parent().parent().find('em').css('color', '#858585');
		$(this).parent().hide();
		$(this).parent().next().hide();

	});

	//保存高级参数
	var params = [];
	$(".c_save_learn_algorithm").click(function() {
		$(".c_save_learn span").remove();
		params = [];
		if(algorithmStatus !== false) {
			if($('.discre')) {
				for(var i = 0; i < $('.discre').length; i++) {
					if($(".discre").eq(i).find('i').hasClass('metric-i-active')) {
						params.push({
							'name': $(".discre").eq(i).find('i').attr('id'),
							'values': 'true'
						});
					} else {
						params.push({
							'name': $(".discre").eq(i).find('i').attr('id'),
							'values': 'false'
						});
					}
				}
			}
			var algorithmList = $("#algorithm_list>li").not('.discre');
			for(var i = 0; i < algorithmList.length; i++) {
				params.push({
					'name': algorithmList.eq(i).find('input').attr('id'),
					'values': algorithmList.eq(i).find('input').val()
				})
			}
			if($("#c_data_learn_id").val() === '点击选择数据' || $("#c_data_learn_target").val() === '点击选择数据') {
				alert('请选择变量')
				if($("#c_data_learn_id").val() === '点击选择数据') {
					$("#c_data_learn_id").parent().siblings('.error_learn').show()
				}
				if($("#c_data_learn_target").val() === '点击选择数据') {
					$("#c_data_learn_target").parent().siblings('.error_learn').show()
				}
			} else {
				$.ajax({
					type: 'post',
					url: server + '/atom_learn/save?' + timeStamp,
					data: {
						project_id: proid,
						atom_learn_id: $("#learn-main").attr('data'),
						input_comp_id: $("#learn-main").attr('souid'),
						id: $("#c_data_learn_id").val(),
						target: $("#c_data_learn_target").val(),
						algorithm: $("#gbm").next().val(),
						params: params,
					},
					success: function(data) {
						function success() {
							loadStatus = true;
							loadaLgorithmValue = $("#gbm").next().val();
							alertSuccess()
						};
						backInfo(data, success)
					}
				})
			}

		}

	});


    $("#learn-main>.right-content>ul>li>div>input").one("focus",function(){
    	if($(this).val()=="点击选择数据"){
            $(this).val("");
		}
		$(this).css("color","#000");
	});
    $("#learn-main>.right-content>ul>li>div>input").on("click",function(){
        $(this).parent().parent().find("ul").find("li").show();
    });
    $(document).on('click', '#learn-main>.right-content>ul>li>div>i', function() {
    	$(this).parent().parent().find("ul").find("li").show();
	});


    var input=$("#learn-main>.right-content>ul>li>.c_nav_list>input");
    input.on("input propertychange", function() {
        var str = $.trim($(this).val());
        if(str === ''){
            $(this).parent().parent().find(".onther_ul").show();
        }else{
            // 以下是匹配某些列的内容，如果是匹配全部列的话就把find()和.parent()去掉即可
            $(this).parent().parent().find(".onther_ul").find("li").each(function(){
                if($(this).text().indexOf(str)>=0){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
            //$(".list-content").refresh(); //重新刷新列表把隐藏的dom结构去掉。
        }
	});

    // //模糊搜索
    // $("#c_data_learn_id").on("input propertychange", function() {
    //
    //     var str = $.trim($("#c_data_learn_id").val());
    //     if(str === ''){
    //         $(this).parent().parent().find("#c_data_learn_id_list").show();
    //     }else{
    //         // 以下是匹配某些列的内容，如果是匹配全部列的话就把find()和.parent()去掉即可
    //         $(this).parent().parent().find("#c_data_learn_id_list").find("li").each(function(){
    //         	if($(this).text().indexOf(str)>=0){
    //         		$(this).show();
		// 		}else{
    //         		$(this).hide();
		// 		}
		// 	});
    //         //$(".list-content").refresh(); //重新刷新列表把隐藏的dom结构去掉。
    //     }
    // });
    // $("#c_data_learn_target").on("input propertychange", function() {
    //
    //     var str = $.trim($("#c_data_learn_target").val());
    //     if(str === ''){
    //         $(this).parent().parent().find("#c_data_learn_target_list").show();
    //     }else{
    //         // 以下是匹配某些列的内容，如果是匹配全部列的话就把find()和.parent()去掉即可
    //         $(this).parent().parent().find("#c_data_learn_target_list").find("li").each(function(){
    //             if($(this).text().indexOf(str)>=0){
    //                 $(this).show();
    //             }else{
    //                 $(this).hide();
    //             }
    //         });
    //         //$(".list-content").refresh(); //重新刷新列表把隐藏的dom结构去掉。
    //     }
    // });



	//保存数据
	$('.c_save_learn').click(function() {
		if($("#c_data_learn_id").val() === '点击选择数据' || $("#c_data_learn_target").val() === '点击选择数据') {
			if($("#c_data_learn_id").val() === '点击选择数据') {
				$("#c_data_learn_id").parent().siblings('.error_learn').show()
			}
			if($("#c_data_learn_target").val() === '点击选择数据') {
				$("#c_data_learn_target").parent().siblings('.error_learn').show()
			}
		} else {
			$.ajax({
				type: 'post',
				url: server + '/atom_learn/save_with_default?' + timeStamp,
				data: {
					project_id: proid,
					atom_learn_id: $("#learn-main").attr('data'),
					input_comp_id: $("#learn-main").attr('souid'),
					id: $("#c_data_learn_id").val(),
					target: $("#c_data_learn_target").val(),
					algorithm: $("#gbm").next().val()
				},
				success: function(data) {
					function success() {
						alertSuccess()
					};
					backInfo(data, success)
				}
			})
		}

	});

	function description(data) {
		var str_description = ''
		if(data.type!='boolean'){
			var max = '';
			if(data.check.max==null){
				max = '+∞'
			}else{
				max = data.check.max
			}
			var str = '类型'+data.type+'；范围['+data.check.min+','+max+']';
			if(data.description === '') {
				str_description = '<div><em></em><span>' +str + '<span></div>'
			} else {
				str_description = '<div><em></em><span>' + data.description+'；'+str + '<span></div>'
			}
			return str_description
		}else{
			return str_description
		}
		
	}

	function success_list(algorithmParams, statusLoad) {
		for(var i = 0; i < algorithmParams.length; i++) {
			//			if(algorithmParams[i].description===''){
			//				algorithmParams[i].description='暂无描述'
			//			}
			if(algorithmParams[i].type === "boolean") {
				var class_sample = '';
				if(algorithmParams[i].default === 'true') {
					class_sample = 'metric-i-active';
				}
				$("#algorithm_list").append(
					'<li class="discre" >' +
					' <label>' + algorithmParams[i].chinese + '</label>' +
					description(algorithmParams[i]) +
					'<i id="' + algorithmParams[i].name + '" class=' + class_sample + '></i>' +
					'</li>'
				)
			} else {
				var str = '';
				if(typeof algorithmParams[i].default === 'number') {
					if(statusLoad === 'true') {
						str = algorithmParams[i].value
					} else {
						str = algorithmParams[i].default
					}

				} else {
					if(statusLoad === 'true') {
						str = algorithmParams[i].value.replace(/\s/g, "")
					} else {
						str = algorithmParams[i].default.replace(/\s/g, "")
					}

				}

				$("#algorithm_list").append(
					' <li>' +
					'<label>' + algorithmParams[i].chinese + '</label>' +
					description(algorithmParams[i]) +
					'<input type="text" id="' + algorithmParams[i].name + '" value="' + str + '">' +
					'<input type="hidden" value=' + algorithmParams[i].type + ' name="' + algorithmParams[i].multiple + '" max="' + algorithmParams[i].check.max + '" decimal="' + algorithmParams[i].check.decimal + '" min="' + algorithmParams[i].check.min + '" length=' + algorithmParams[i].check.max_num + '>' +
					'</li>'
				)
			}
		};
		$("#algorithm_list>li>div>span").each(function() {
			var left_width = $(this).parent().prev().width() + 28
			if($(this).width() > left_width ||$(this).width()>150) {
				$(this).css('left', -left_width + 'px')

			} else {
				$(this).css('left', '-110px')
			}

		})
		//校验高级参数
		var algorithmList = $("#algorithm_list>li").not('.discre');
		algorithmList.each(function() {
			$(this).find('input[type=text]').blur(function() {
				//失去焦点正确时错误提示隐藏
				var _this = $(this)

				function errorHide() {

					_this.parent().find('.error').remove();
					algorithmStatus = true;
				}
				//失去焦点添加错误提示
				function errorShow(str) {
					errorHide();
					_this.parent().append('<span class="error">' + str + '<span>');
					algorithmStatus = false;
				}
				//判断格式是正确
				var myreg = /^-?\d+(\.\d+)?(,-?\d+(\.\d+)?)*,?$/
				//判断multiple是否正确
				var multiple = $(this).next().attr('name');
				var valueArr = $(this).val().split(',');
				var dataType = $(this).next().attr('value');
				var doublue = $(this).val().indexOf('.');
				var max = $(this).next().attr('max');
				var min = $(this).next().attr('min');
				var max_num = $(this).next().attr('length');
				var decimal = $(this).next().attr('decimal');

				function transform_check(v, min, max, parse_method, label) {
					errorHide()
					try {
						v = parse_method(v);
					} catch(error) {
						errorShow('格式不正确')
						return "can not transform to " + label
					}
					if(min !== undefined && v < min) {
						if(max=='null'){
							errorShow('最小值为'+min)
							return
						}
						errorShow('最大值为'+max+'，最小值为'+min)
						return "should between " + min + " and " + max;
					}
					if(max !== undefined && v > max) {
						errorShow('最大值为'+max+'，最小值为'+min)
						return "should between " + min + " and " + max;
					}
					return null
				}

				function checkInt(v) {
					v0 = eval(v)
					v1 = parseInt(v);
					v2 = parseFloat(v);

					if(v2 != v1) {
						throw Error()
					}
					if(v.split(".").length > 1) {
						throw Error()
					}
					return v1
				}

				function checkDouble(v) {
					v1 = eval(v)
					v1 = parseFloat(v)
					if(v.split(".").length > 2) {
						throw Error()
					}
					return v1;
				}
				    var check = {
				        "min" : min,
				        "max" : max,
				        "decimal" : decimal,
				        "max_num":max_num
				    }
				check_value($(this).val(),dataType,multiple,check)
				function check_value(value, vtype, multiple, check) {
					errorHide()
					value = value.trim();
					value = value.split(",");

					if(value.length > 1 && (!multiple)) {
						errorShow('不能为空')
						return "can not accept multiple value"
					}

					min = check.min;
					max = check.max;
					decimal = check.decimal;
					max_num = null;
					if(check.max_num=='undefined'){
						max_num = 1
					}else{
						max_num = check.max_num;
					}
					if(vtype === 'double' && decimal == 'undefined') {
						decimal = 3;
					}
					if(multiple && value.length > max_num) {
						errorShow('最多可输入'+max_num+'项')
						return "can only accept " + max_num + " values"
					}

					validations = {
						"int": checkInt,
						"double": checkDouble
					}

					for(var i = 0; i < value.length; i++) {
						v = value[i].trim();
						trans_res = transform_check(v, min, max, validations[vtype], vtype)
						if(trans_res !== null) return trans_res;
						if(vtype === "double") {
							v = parseFloat(v);
							v1 = parseFloat(v.toFixed(decimal));
							errorHide()
							if(v1 !== v) {
								errorShow('最多保留'+decimal+'位小数')
								return "float格式错误"
							}
						}
					}
					return
				}

			})
		})
	};
	//点击显示参数描述
	//	$("#algorithm_list").on('click','li>div>em',function(){
	//		if($(this).next().is(':hidden')){
	////		var tops = $('.right-content').scrollTop().toString()
	////			$(".right-content").css('overflow','inherit')
	////			$('.right-content').css({
	////				'position':'relative',
	////				'top':-tops+'px',
	////				'width':'226px'
	////			})
	////			$("#algorithm_list>li>div>span").hide()
	//			$(this).next().css('display','inline-block')
	//		}else{
	////			$(".right-content").css('overflow','auto')
	//			$(this).next().css('display','none')
	////			$('.right-content').css({
	////				'position':'relative',
	////				'top':'0px',
	////				'width':'232px'
	////			})
	//		}
	//	})
	//
	$(".run").click(function() {
		runParameter($("#learn-main").attr('data'))
		$("#runContent").fadeIn()
		$("#shadowBody").show()
	});
	//点击算法名跳转到帮助文档指定位置
	$("#algorithmNameT").click(function(){
		window.open('help.html?algorithm='+$(this).next().val()+'');
	})
});