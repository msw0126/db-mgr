$(function() {
	var pageShowNumber = 1;
	var pageType = 'list';
	//获取我的数据列表信息
	var pageNum = '';
	function getListData(pageIndex,pageNum,status){
		$.ajax({
			url: server + '/mydata/list_table',
			type: 'post',
			async:false,
			data: {
				index: pageIndex,
				page_num: pageNum
			},
			success: function(data) {
				var datas = JSON.parse(data).detail;
				addDataToTable(datas,status);
				
			},
			error: function(data) {
				layer.msg('接口请求失败');
			}
		});
		
	};
	getListData(1,12,true);
	//将数据添加到表
	function addDataToTable(dataArr,status){
		var datas = [...dataArr];
		datas.pop();
		$(".dataInfo").html("");
		for(var i = 0; i < datas.length; i++) {
			$(".dataInfo").append(
				'<li>' +
				' <ul class="dataInfoTitle">' +
				' <li class="dataFileName"><input type="checkbox" class="select" id="awesome' + i + '" />' +
				'<label for="awesome' + i + '"></label><em class="iconFile"></em><span class="tableName" title="'+datas[i].file_name+'">' + datas[i].file_name + '</span><p class="operation"><em class="delete"></em></p></li>' +
				' <li class="dataField">' + datas[i].field_num + '</li>' +
				'<li class="dataSize">' + datas[i].file_size + '</li>' +
				'<li class="dataTime">' + datas[i].craet_time + '</li>' +
				'<li class="dataPerson">' + datas[i].creat_user + '</li>' +
				'</ul>' +
				' </li>'
			)
		};
		if(status===true){
			pageNum = dataArr[dataArr.length-1].sum_index;
			page(pageNum);
		}
		
	};
	
	//选择数据
	$(".selectFile").on('click', function() {
		console.log('77777')
		$("#realFiles").click();
	});
	$(".selectedFile button").click(function() {
		$("#realFiles").click();
	});
	$("#realFiles").change(function() {
		var filename = $("#realFiles").val().replace(/.*(\/|\\)/, "");
		$(".selectFile").hide();
		$(".selectedFile span").text(filename)
		$(".selectedFile span").attr("title",filename)
		$(".selectedFile").show();
		$("#newName").val("");
		var idx = $('#realFiles').val().lastIndexOf(".");
		var ext = $('#realFiles').val().substr(idx + 1).toLowerCase();
		$('#newName').removeClass('errorBorder');
		$("#reName .error").hide();
		$("#file .error").hide();
		if(ext != 'csv') {
			$("#file .error").show();
			$('.selectedFile').addClass('errorBorder');
			$("#file .error").text('数据表格式错误,请重新选择');
		}else{
			$("#file .error").hide();
			$('.selectedFile').removeClass('errorBorder');
			$("#newName").val(filename.split('.')[0].replace("(",'').replace(")",''));
		}
	});
	//重命名校验
	function validateInput(value){
		let conditionOne = /^(?![0-9]+$)(?![_]+$)[0-9A-Za-z_]{1,50}$/;
		if(conditionOne.test(value) === false) {
			return false
		}
	};
	$('#newName').blur(function(){
		var validataStatus = validateInput($(this).val());
		if(validataStatus===false){
			$("#newName").next().text('英文、数字、下划线，但不能全为数字');
			$("#newName").next().show();
			$("#newName").addClass('errorBorder');
		}
	});
	//上传数据
	$(".upload").click(function() {
		if($("#realFiles").val()===''){
			$("#file .error").html('请选择文件');
			$("#file .error").show();
			return
		};
		if($("#newName").val()===""){
			$("#reName .error").html('此项不能为空');
			$("#reName .error").show();
			$("#newName").addClass('errorBorder');
			return
		};
		if($("#reName .error").is(':hidden')===false){
			return
		}
		var validateStatus = validateInput($("#newName").val());
		if(validateStatus===false){
			$("#newName").next().text('英文、数字、下划线，但不能全为数字');
			$("#newName").next().show();
			$("#newName").addClass('errorBorder');
			return
		}
		var formData = new FormData();
		formData.append('file', document.getElementById('realFiles').files[0]);
		formData.append('filename', $("#newName").val());
		var xhr;
		if(window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhr.upload.onprogress = function(evt) {}
		xhr.open('post', server + '/mydata/csv_upload?');
		xhr.onreadystatechange = function () {
		   if (xhr.status==500) {
		   	layer.msg('接口请求失败');
		   		$(".alertArea").hide();
		   		$("#shadow").hide();
		   		$("#uploadFile").show();
		   		$("#uploading").hide();
		   		$('.selectedFile').hide();
				$(".selectFile").show();
				$("#realFiles").val("");
		  　　}
		}
		xhr.onload = function(data) {
			var response_data = JSON.parse(data.currentTarget.response);
			if(response_data.detail==null && response_data.error_code){
				$("#uploadFile").show();
				$("#uploading").hide();
				$("#reName .error").show();
				$("#reName .error").text('您的表名已存在,请修改表名');
				$("#newName").addClass('errorBorder');
				$()
				return
			}else{
				$(".alertArea").hide();
				$("#alert_table").fadeIn();
				fields_list(response_data.detail);
				$("#uploadFile").show();
				$("#uploading").hide();
				$('.selectedFile').hide();
				$(".selectFile").show();
				
			}		
		};
		xhr.upload.addEventListener("progress", updateProgress, false);
		xhr.send(formData);
	});
	//进度条
	function updateProgress(evt) {
		if(evt.lengthComputable) {
			var monrod = evt.loaded / evt.total;
			if(monrod == 1) {
				monrod = 0.99;
			};
			$("#uploadFile").hide();
			$("#uploading").show();
			$(".progress span").css('width', Math.round(monrod * 100) + "%");
		}
	};
	//取消
	$('.cancel').click(function(){
		$(".alertArea").hide();
		$("#shadow").hide();
		$('.selectedFile').hide();
		$(".selectFile").show();
		$("#realFiles").val("");
		$("#newName").removeClass('errorBorder');
		$("#reName .error").hide();
		$("#file .error").hide();
	});
	//显示上传文件框
	$(".uploadButton").click(function(){
		$(".alertArea").show();
		$("#shadow").show();
		$("#newName").val("");
	});
	//监听重命名文本框内容
	$("#newName").on('input',function(){
		$("#reName .error").hide();
		$("#newName").removeClass('errorBorder');
	});
	//显示文件详细信息
	function fields_list(response_data) {
		console.log(response_data)
		$(".table_fields").html('');
		for(var i = 0; i < response_data.length; i++) {

			var sample_data = response_data[i].sample_data.split('","');
			var str = '';
			for(var j = 0; j < sample_data.length; j++) {
				str += "<li>" + sample_data[j] + "</li>"
			}
			var typeStr = '';
			//我加的开始
			var STR = '';
			var data = '';
			//我加的结束
			if(response_data[i].field_type === 'numeric') {
				typeStr = '<div class="type_list"><span>numeric</span><em></em></div>' +
					'<ul class="type_list_val"><li>factor</li></ul>';
				//start
				data = same_hidden_str(response_data[i], true);
				STR = '<li class="fields_date">' + data + '</li>'
			} else if(response_data[i].field_type === 'date') {
				typeStr = '<div class="type_list"><span>date</span></div>'
				data = same_hidden_str(response_data[i], false);
				var differents = '';
				if(response_data[i].date_size === 'day') {
					differents = ''
				} else {
					differents = '<li><span>秒</span><input type="hidden" value="second"/></li>' +
						'<li><span>分</span><input type="hidden" value="minute"/></li>' +
						'<li><span>时</span><input type="hidden" value="hour"/></li>'
				}
				var dateStr = ''
				if(response_data[i].date_format === 'day') {
					dateStr = '日'
				} else if(response_data[i].date_format === 'month') {
					dateStr = '月'
				} else if(response_data[i].date_format === 'year') {
					dateStr = '年'
				} else if(response_data[i].date_format === 'second') {
					dateStr = '秒'
				} else if(response_data[i].date_format === 'minute') {
					dateStr = '分'
				} else {
					dateStr = '时'
				}

				STR = '<li class="fields_date">' +
					'<div class="date_type_list">' +
					'<span>' + dateStr + '</span><em></em>' +
					'<input type="hidden" class="date_format" value="' + response_data[i].date_format + '"/>' +
					'</div>' +
					'<ul class="data_type_list_val">' +
					differents + data +
					'<li><span>日</span><input type="hidden" value="day"/></li>' +
					'<li><span>月</span><input type="hidden" value="month"/></li>' +
					'<li><span>年</span><input type="hidden" value="year"/></li>' +
					'</ul>' +
					'</li>';
				//end
			} else {
				typeStr = '<div class="type_list"><span>factor</span><em></em></div>' +
					'<ul class="type_list_val"><li>numeric</li></ul>';
				//strat
				data = same_hidden_str(response_data[i], true);
				STR = '<li class="fields_date">' + data + '</li>'
				//end

			}
			//strat
			var checkStr = '';

			if(response_data[i].selected == true) {
				checkStr = '<li class="fields_sel">' + '<input type="checkbox" name="select" checked="' + response_data[i].selected + '"></li>';
			} else {
				checkStr = '<li class="fields_sel">' + '<input type="checkbox" name="select"></li>';
				$("#all-Sselect").prop("checked", false);
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
				'</li>' + STR +
				'</ul>' +
				'</li>'
			)

		}

	};
    function same_hidden_str(fields,dataType){
        var str = '';
        if(dataType===true){
            str = '<input type="hidden" class="date_format" value="' + fields.date_format + '"/>'
        }else{
            str='';
        }
        return str+ '<input type="hidden" class="date_size" value="' + fields.date_size + '"/>'

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
	//查看数据前三行
	$(".table_fields").on('mouseover', 'i', function() {
		var tableFields = $(this).next();
		tableFields.slideDown();
	});
	$(".table_fields").on('mouseout', 'i', function() {
		var tableFields = $(this).next();
		tableFields.slideUp();
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
    //取消按钮
	$("#hive_table_cancel").click(function() {
		$("#alert_table").fadeOut();
		$("#shadow").hide();
		$("#realFiles").val("");
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
		$("#alert_table").fadeOut();
		$(".img_load").show();
		$.ajax({
			type: 'post',
			url: server + '/mydata/csv_into_hive?'+timeStamp,
			data: {
				"filename": $("#newName").val(),
				"username": sessionStorage.getItem('name'),
				"field_types": data_obj,
			},
			success: function(data) {
				if(JSON.parse(data).error_code){
					$(".img_load").hide();
					$("#shadow").hide();
				}
				function success(){
					$("#shadow").hide();
//					$("#alert_table").fadeOut();
					$("#realFiles").val("");
					getListData(1,12,true)
					$(".img_load").hide();
				}
				backInfo(data,success)
			},
			error: function(data) {
				$(".img_load").hide();
					$("#shadow").hide();
				layer.msg('接口请求失败');
			}
		})
	
	});
    //分页
    	function page(page) {
			$('.M-box3').pagination({
				pageCount: page,
				jump: true,
				coping: true,
				prevContent: '<',
				nextContent: '>',
				callback: function(api) {
					pageShowNumber = api.getCurrent();
					if(pageType ==="search"){
						var datas = {
							filename:$('.srarchValue').val(),
							index:api.getCurrent(),
							page_num:12
						};
						searchData(datas,false);
						return;
					}else{
						getListData(api.getCurrent(),12,false);
						return;
					}
					$(".jump-ipt").after('<span class="span_add">页</span>');
					$(".jump-ipt").before('<p class="p_add">共<span class="span_add span_add1">' + page + '</span>页，到第</p>');
					
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
	//搜索按钮转换
	$(".searchIcon").click(function(){
		$(".searchIcon").hide();
		$(".searchArea").css('display','inline-block');
	});
	$(document).click(function(e){
	  var _con = $('.top');   // 设置目标区域
	  if(!_con.is(e.target) && _con.has(e.target).length === 0){
	  	if($(".searchArea").css('display')==='inline-block'&&$('.srarchValue').val()===''){
	  		$('.searchArea').css('display','none');
	  		$(".searchIcon").show();
	  		$(".searchArea input").val("");
//	  		getListData(pageShowNumber,12,true);
	  		getListData(1,12,true);
	  	}    	
	  };
	});
	//显示clean按钮
	$(".srarchValue").on('input',function(){
		if($(this).val()==="")
			$(this).prev().hide();
		else
			$(this).prev().show();
	});
	//搜索数据
	function searchData(datas,status){
		$.ajax({
			type:'post',
			url:server+'/mydata/search_table',
			data:datas,
			success:function(data){
				if(JSON.parse(data).detail===null){
					$(".dataInfo").html("");
					$(".dataInfo").append(
						'<p class="tableNoExit">暂无搜索结果</p>'
					)
					$(".M-box3").hide();
				}else{
					addDataToTable(JSON.parse(data).detail,status);
					$(".M-box3").show();
				}
			},
			error:function(){
				layer.msg('接口请求失败');
			}
		})
	};
	$("#searchTable").click(function(){
		var validateStatus = validateInput($('.srarchValue').val());
		if(validateStatus===false){
			$(".dataInfo").html("");
			$(".dataInfo").append(
				'<p class="tableNoExit">暂无搜索结果</p>'
			)
			$(".M-box3").hide();
//			return;
		}
		var datas = {
			filename:$(this).prev().val(),
			index:1,
			page_num:12
		};
		pageType = 'search';
		searchData(datas,true)
	});
	//清空搜索输入
	$(".clean").click(function(){
		$(this).next().val("");
		$(".searchIcon").css('display','inline-block');
		$(".searchArea").hide();
//		getListData(pageShowNumber,12,true);
		$(".M-box3").show();
		getListData(1,12,true);
		$(this).hide();
	});
	//全选全不选
	$("#deleteAll").click(function(){
		if($(this).is(':checked')){
			for(var i=0;i<$(".dataInfo>li").length;i++){
				$(".dataInfo>li").eq(i).find('input').prop('checked',true);
			};
		}else{
			for(var i=0;i<$(".dataInfo>li").length;i++){
				$(".dataInfo>li").eq(i).find('input').prop('checked',false)
			};
		}
		
	});
	$(".dataInfo").on('click','input',function(){
		var length = [];
		for(var i=0;i<$(".dataInfo>li").length;i++){
			if($(".dataInfo>li").eq(i).find('input').is(':checked')){
				length.push($(".dataInfo>li").eq(i));
			}
		};
		if(length.length<$(".dataInfo>li").length){
			$("#deleteAll").prop('checked',false)
		}else{
			$("#deleteAll").prop('checked',true)
		}
	});
	$(document).on("change", "input[name='select']", function () {
        var checkedNum=$("input[name='select']:checked").length;

		var uncheckedNum = $("input[name='select']").length;

		$("#all-select").prop("checked",checkedNum==uncheckedNum);

	});
    //全选按钮与其他按钮关系
    $(document).on("change", "#all-select", function () {

        $("input[name='select']").prop("checked",$(this).prop("checked"));
	});
	//关闭删除提示框
	$(".deleteTop i").click(function(){
		$("#deleteArea").hide();
		$("#shadow").hide();
	});
	$(".cancelDelete").click(function(){
		$("#deleteArea").hide();
		$("#shadow").hide();
	});
	//确定删除表
	var deleteData = [];
	$(".confirmDelete").click(function(){
		deleteTable(deleteData)
	})
	//删除表方法
	function deleteTable(files){
		//删除表示添加转圈
		$("#alert_table").fadeOut();
		$(".img_load").show();
		$.ajax({
			url:server+'/mydata/delete_table',
			type:"post",
			data:{
				filenames:files
			},
			success:function(data){
				$("#deleteArea").hide();
				$("#shadow").hide();
//				getListData(pageShowNumber,12);
				getListData(1,12,true);
				//删除表时添加转圈
				$(".img_load").hide();
			},
			error:function(){
				layer.msg('接口请求失败');
			}
		})
	};
	//删除单个记录
	$(".dataInfo").on('click','.delete',function(){
		$("#deleteArea").show();
		$("#shadow").show();
		deleteData = [{"filename":$(this).parent().parent().find('.tableName').text()}];
	});
	//批量删除
	$('.deleteAll').click(function(){
		for(var i=0;i<$(".dataInfo>li").length;i++){
			if($(".dataInfo>li").eq(i).find('input').is(':checked')){
				deleteData.push({"filename":$(".dataInfo>li").eq(i).find('.tableName').text()});
			}
		};
		if(deleteData.length===0)return;
		$("#deleteArea").show();
		$("#shadow").show();
	});
});