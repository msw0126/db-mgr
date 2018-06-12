$(function() {
	var move_width = (screen.width - 560) / 2;
	var move_height = (screen.height - 500) / 2;
	$("#alert_table").css('left', move_width + 'px');
	$("#alert_table").css('top', move_height + 'px');
	//点击取消事件
//	 cancle = false
	//触发文件上传
	$('.reader-right-content_ul').on('click', '.img_upload', function() {
		$('#files').click();
	});
	$('.reader-right-content_ul').on('click', '.img_uploads', function() {
		$('#files').click();
//		cancle=true
	});

	$('#files').change(function() {
		var formData = new FormData();
		var file = $('#files').val();
		var filename = file.replace(/.*(\/|\\)/, "");
		$(".table_name>.tableTitle").text(filename.split('.')[0])
		formData.append('project_id', proid);
		formData.append('component_id', $("#csv-SelfDefinedFeature").attr('data'));
		formData.append('file', document.getElementById('files').files[0]);
		var result = limitSize(document.getElementById('files').files[0].size);
		idx = file.lastIndexOf(".");
		if(idx!=-1){
			ext = file.substr(idx+1).toUpperCase();   
            ext = ext.toLowerCase( ); 
            if(ext!='csv'){
            	alert('请上传csv文件')
            }else{
            			if(result === false) {

		} else {
			var xhr;
			if(window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			} else {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xhr.upload.onprogress = function(evt) {}
			xhr.open('post', server + '/self_defined_feature/upload?'+timeStamp);

			xhr.onload = function(data) {
				var response_data = JSON.parse(data.currentTarget.response).detail;
				$('.files_name').text(filename);
//				robotx_stus = true;
				$('#fileName').val(data.detail);
				$(".edit_fields").show();
				$('.shadow').show();
				$("#alert_table").fadeIn();
				fields_list(response_data)
			};
			xhr.upload.addEventListener("progress", updateProgress, false);
			xhr.send(formData);
		}
            }
		}


	});

	function updateProgress(evt) {
		$('.files_name ').removeClass('img_upload');
		$('.c-csv-again').addClass('img_uploads').show();
		$('.c-csv').attr('id', '').addClass('c-csv-active');
		$('.files_name').next().addClass('c-csv-icon');
		if(evt.lengthComputable) {
			var monrod = evt.loaded / evt.total;
			if(monrod == 1) {
				monrod = 0.99;
			};
			$('.files_name').text(Math.round(monrod * 100) + "%");

		}
	};

	//数据类型下拉
	$(".table_fields").on('click', '.type_list', function() {
	var dataType = $(this).siblings('.type_list_val').find('li')
	var fields_value = $(this).text();
	var dataType_ul = $(this).siblings('.type_list_val');
		if(fields_value === 'numeric') {
			dataType.text('factor');
		} else {
			dataType.text('numeric');
		}
		if(dataType_ul.is(':hidden')){
			$(".type_list_val").hide()
			dataType_ul.show()
		}else{
			dataType_ul.hide()
		}
	});
	$(".table_fields").on('click', '.type_list_val li', function() {
		var dataType_ul = $(this).parent()
		dataType_ul.siblings('.type_list').find('span').text($(this).text());
		if(dataType_ul.is(':hidden')){
			$(".type_list_val").hide()
			dataType_ul.show()
		}else{
			dataType_ul.hide()
		}
	});
	//
	$(".table_fields").on('mouseover', 'i', function() {
		var tableFields = $(this).next();
		tableFields.slideDown();
	});
	$(".table_fields").on('mouseout', 'i', function() {
		var tableFields = $(this).next();
		tableFields.slideUp();
	});


//保存数据类型
$("#hive_table_save").click(function() {
	var data_obj = [];
	for(var i = 0; i < $(".table_fields .fields_one").length; i++) {
		var sample_data = '';
		for(var j = 0; j < $(".table_fields .sample_data").eq(i).find('li').not(':last-child').length; j++) {
			sample_data += $(".table_fields .sample_data").eq(i).find('li').eq(j).text() + '","' + $(".table_fields .sample_data").eq(i).find('li:last-child').text()
		}

		data_obj.push({
			"field": $(".table_fields .fields_one").eq(i).text(),
			"field_type": $(".table_fields .type_list").eq(i).children('span').text(),
			"sample_data": sample_data,
			"ori_type": $(".table_fields .fields_two").eq(i).find('input').val(),
            //我加的开始
			"date_format":$(".table_fields .fields_date").eq(i).find('.date_format').val(),
			"date_size":$(".table_fields .fields_date").eq(i).find('.date_size').val(),
			"selected":$(".table_fields .fields_sel").eq(i).find('input:first').prop("checked")
            //我加的结束
		})

	};

	$.ajax({
		type: 'post',
		url: server + '/self_defined_feature/save_field_type?'+timeStamp,
		data: {
			"project_id": proid,
			"component_id": $("#csv-SelfDefinedFeature").attr('data'),
			"field_types": data_obj,
		},
		success: function(data) {
			function success(){
				$(".shadow").hide();
				$("#alert_table").fadeOut();
				for(var i = 0; i < $('.SelfDefinedFeature').length; i++) {
					if($('.SelfDefinedFeature').eq(i).attr('compid') === $("#csv-SelfDefinedFeature").attr('data')) {
						$('.SelfDefinedFeature').eq(i).attr('tableName', $('.c-csv-active').text())
					}
				};
			}
			backInfo(data,success)
		},
		error: function(data) {
			layer.msg('接口请求失败');
		}
	})

});
//查看保存数据类型
$(".edit_fields").click(function() {
//	cancle=true
	var tableName = $(".files_name").text().split('.')[0]
	$.ajax({
		type: 'post',
		url: server + '/self_defined_feature/load_field_type?'+timeStamp,
		data: {
			project_id: proid,
			component_id: $("#csv-SelfDefinedFeature").attr('data'),
		},
		success: function(data) {
			function success(){
				$(".shadow").show();
				$("#alert_table").fadeIn();
				$(".table_name>.tableTitle").text(tableName)
				fields_list(dataBack(data).detail)
			}
			backInfo(data,success)
		},
		error: function(data) {
			layer.msg('接口请求失败');
		}
	})
})
//取消按钮
$("#hive_table_cancel").click(function() {
	$("#alert_table").fadeOut();
	$(".shadow").hide();
});
//保存组件
$(".c_save_reader").click(function() {
	if($('.c-csv-active').text() === "") {
		layer.alert('请上传文件!', {
			icon: 2,
			title: '提示'
		});
	} else {
		
		layer.alert('保存成功!', {
			icon: 1,
			title: '提示'
		});
	}
});
function fields_list(response_data) {
	$(".table_fields").html('');
		for(var i = 0; i < response_data.length; i++) {

            var sample_data = response_data[i].sample_data.split('","');
            var str = '';
            for (var j = 0; j < sample_data.length; j++) {
                str += "<li>" + sample_data[j] + "</li>"
            }
            var typeStr = '';
            //我加的开始
            var STR='';
            var data ='';
            //我加的结束
            if (response_data[i].field_type === 'numeric') {
                typeStr = '<div class="type_list"><span>numeric</span><em></em></div>' +
                    '<ul class="type_list_val"><li>factor</li></ul>';
                //start
				data= same_hidden_str(response_data[i],true);
                STR='<li class="fields_date">'+data+'</li>'
            } else if (response_data[i].field_type === 'date') {
                typeStr = '<div class="type_list"><span>date</span></div>'
				data=same_hidden_str(response_data[i],false);
                var differents = '';
                if (response_data[i].date_size === 'day') {
                    differents = ''
                } else {
                    differents = '<li><span>秒</span><input type="hidden" value="second"/></li>' +
                        '<li><span>分</span><input type="hidden" value="minute"/></li>' +
                        '<li><span>时</span><input type="hidden" value="hour"/></li>'
                }
                var dateStr = ''
                if (response_data[i].date_format === 'day') {
                    dateStr = '日'
                } else if (response_data[i].date_format === 'month') {
                    dateStr = '月'
                } else if (response_data[i].date_format === 'year') {
                    dateStr = '年'
                } else if (response_data[i].date_format === 'second') {
                    dateStr = '秒'
                } else if (response_data[i].date_format === 'minute') {
                    dateStr = '分'
                } else {
                    dateStr = '时'
                }

				STR= '<li class="fields_date">' +
                    '<div class="date_type_list">' +
                    '<span>' + dateStr + '</span><em></em>' +
                    '<input type="hidden" class="date_format" value="' + response_data[i].date_format + '"/>' +
                    '</div>' +
                    '<ul class="data_type_list_val">' +
                    differents+data+
                    '<li><span>日</span><input type="hidden" value="day"/></li>' +
                    '<li><span>月</span><input type="hidden" value="month"/></li>' +
                    '<li><span>年</span><input type="hidden" value="year"/></li>' +
                    '</ul>' +
                    '</li>' ;
                //end
			}
            else {
                typeStr ='<div class="type_list"><span>factor</span><em></em></div>' +
                    '<ul class="type_list_val"><li>numeric</li></ul>';
				//strat
                data= same_hidden_str(response_data[i],true);
                STR='<li class="fields_date">'+data+'</li>'
				//end

            }
            //strat
            var checkStr = '';

            if (response_data[i].selected == true) {
                checkStr = '<li class="fields_sel">' + '<input type="checkbox" name="Sselect" checked="' + response_data[i].selected + '"></li>';
            } else {
                checkStr = '<li class="fields_sel">' + '<input type="checkbox" name="Sselect"></li>';
                $("#all-Sselect").prop("checked",false);
            }
            //end






                $(".table_fields").append(
                    '<li>' +
                    '<ul>' + checkStr +
                    '<li class="fields_one" title="' + response_data[i].field + '">' + response_data[i].field + '</li>' +
                    '<li class="fields_two">' +
                    '<input type="hidden" value="' + response_data[i].ori_type + '"/>' +
                    typeStr +
                    '</li>' +

                    '<li class="fields_three"><i></i>' +
                    '<div class="sample_data">' +
                    '<div>' + response_data[i].field + '</div>' +
                    '<ul>' + str +
                    '</ul>' +
                    '</div>' +
                    '</li>' +STR+
                    '</ul>' +
                    '</li>'
                )
           
}

				 
		}
		$(".sample_data").css('left',parseInt($("#alert_table").css('left').replace('px',''))+450+'px')
		$(".sample_data").css('top',parseInt($("#alert_table").css('top').replace('px',''))+75+'px')

//start
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

    function same_hidden_str(fields,dataType){
        var str = '';
        if(dataType===true){
            str = '<input type="hidden" class="date_format" value="' + fields.date_format + '"/>'
        }else{
            str='';
        }
        return str+ '<input type="hidden" class="date_size" value="' + fields.date_size + '"/>'

    }
    //全选按钮自动选择
    $(document).on("change", "input[name='Sselect']", function () {
        var checkedNum=$("input[name='Sselect']:checked").length;

        var uncheckedNum = $("input[name='Sselect']").length;

        $("#all-Sselect").prop("checked",checkedNum==uncheckedNum);

    });
    //全选按钮与其他按钮关系
    $(document).on("change", "#all-Sselect", function () {

        $("input[name='Sselect']").prop("checked",$(this).prop("checked"));
    });
//end
})