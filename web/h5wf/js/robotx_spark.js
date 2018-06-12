var list_verise = '';
var container_table_ID = '';
var h = 0;
var u = 0;
var difference = null;
//让弹出框居中
var move_width = ($('body').width() - 900) / 2
$(".robot-main").css('left', move_width + 'px')
$(".run").click(function() {
	runParameter($("#robotx-main-spark").attr('data'))
	$("#runContent").fadeIn()
	$("#shadowBody").show()
})
//设置表间关系拖拽
var robotx = jsPlumb.getInstance({
	DragOptions: {
		cursor: "pointer",
		zIndex: 11
	},
	ConnectionOverlays: [
		["Arrow", {
			location: 1,
			visible: true,
			width: 11,
			length: 11,
			direction: 1,
			id: "arrow_forwards"
		}],
	],
	Container: "robot_main_two"
});
robotx.importDefaults({
	ConnectionsDetachable: true,
	ReattachConnections: true
});
//端点样式设置
//基本连接线样式
var connectorPaintStyle_robotx = {
	stroke: "#3cf",
	strokeWidth: 2,
	outlineColor: "blue",
	outlineWidth: 2
};
// 鼠标悬浮在连接线上的样式
var connectorHoverStyle_robotx = {
	stroke: "#f08aa5",
	strokeWidth: 2,
	outlineColor: "blue",
	outlineWidth: 2
};
var hollowCircle_robotx = {
	endpoint: ["Dot", {
		cssClass: "endpointcssClass"
	}], //端点形状
	connectorStyle: connectorPaintStyle_robotx,
	connectorHoverStyle: connectorHoverStyle_robotx,
	paintStyle: {
		fill: "#3cf",
		radius: 4,
	}, //端点的颜色样式
	isSource: true, //是否可拖动（作为连接线起点）
	connector: ["Flowchart", {
		stub: 30,
		gap: 0,
		cornerRadius: 2,
		alwaysRespectStubs: true,
		midpoint: 0.5
	}],
	isTarget: false, //是否可以放置（连接终点）
	maxConnections: -1
};

jQuery(document).ready(function() {
	$('.robot-main').css('top', ($(window).height() - 600) / 2 + 'px');
	//		setLeftMenu(metadata);
	//监听新的连接
	robotx.bind("connection", function(connInfo) {
		//源表和目标表之间只能有一条连线
		var exits = $('#' + connInfo.targetId).attr('souid').indexOf($('#' + connInfo.sourceId).attr('data'))
		if(exits != -1 && exits != undefined) {
			robotx.detach(connInfo.connection);
			return
		} else {
			init(connInfo)
			init_robotx(connInfo.connection);
		}
	});
	robotx.bind("dblclick", function(conn) {
		init_robotx(conn)
	});
});

$(function() {
	var souid = $("#robotx-main-spark").attr('souid');
	var souid_arr = souid.split(',');
	var tablenameArr = []
	for(var index = 0; index < souid_arr.length; index++) {
		for(var i = 0; i < $(".hive").length; i++) {
			if(souid_arr[index] === $(".hive").eq(i).attr('compid')) {
				if($(".hive").eq(i).attr('tableName') == 'undefined') {
					layer.alert('hiveReader组件请选择表', {
						icon: 2,
						title: '提示'
					});
					return
				} else {
					tablenameArr.push($(".hive").eq(i).attr('tableName'));
				}
			}
		}
	};
	var repeatResult = isRepeat(tablenameArr);
	var repeatCompid = ''
	if(repeatResult != false) {
		for(var index = 0; index < souid_arr.length; index++) {
			for(var i = 0; i < $(".hive").length; i++) {
				if(souid_arr[index] === $(".hive").eq(i).attr('compid')) {

					if($(".hive").eq(i).attr('tableName') == repeatResult) {
						repeatCompid += $(".hive").eq(i).attr('compid') + '组件，';
					}
				}
			}
		};
		repeatCompid = repeatCompid.substring(repeatCompid.length - 1, 0)
		layer.alert(repeatCompid + '表重复', {
			icon: 2,
			title: '提示'
		});
		$("#m_robot_configure").css('pointer-events', 'none');
		return
	} else {
		$("#m_robot_configure").css('pointer-events', 'auto');
	}

	function isRepeat(arr) {
		var hash = {};
		for(var i in arr) {
			if(hash[arr[i]]) {
				return arr[i];

			}
			hash[arr[i]] = true;
		}
		return false;
	}

})
//robotx表关联的字段勾选
$('#robot_main_two_fields_bottom').on('click', '.robotx_glzds>label', function() {
	var RelatedList = $(this).parent().find('ul')
	// if(RelatedList.is(':hidden')) {
	// 	$('.robotx_glzd').hide();
	RelatedList.show();

	// } else {
	// 	RelatedList.hide();
	// }
});

$(document).on("input propertychange", ".robotx_glzds>label>input", function() {
	var str = $.trim($(this).val());
	if(str === '') {
		$(this).parent().parent().find(".robotx_glzd").show();
	} else {
		// 以下是匹配某些列的内容，如果是匹配全部列的话就把find()和.parent()去掉即可
		$(this).parent().parent().find(".robotx_glzd").find("li").each(function() {
			if($(this).text().indexOf(str) >= 0) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
		//$(".list-content").refresh(); //重新刷新列表把隐藏的dom结构去掉。
	}
});
$(document).on("click", ".robotx_glzds>label>i", function() {
	$(this).parent().parent().find(".robotx_glzd").find("li").show();
});
// $(document).on("click",".robotx_glzds>label",function () {
// 	 $(this).parent().find(".robotx_glzd").find("li").show();
// });
//关联字段下拉列表点击事件
$(document).on('click', '.robotx_glzd>li', function() {
	var list_text_filds = $(this).text();
	var Related_value = $(this).parent().prev();
	var RelatedList = $(this).parent();
	var dataType = $(this).parent().parent().next();
	Related_value.html('<input type="text" class="input70" value="' + list_text_filds + '" title="' + list_text_filds + '">' + '<i></i>');
	var list_text_filds_index = $(this).parent().parent().parent().parent().index();
	var list_old_text_filds = $('.top-second>p').eq(1).find('span').eq(list_text_filds_index - 1).text();
	for(var i = 0; i < $('#robot_main_two>li').length; i++) {
		if($('#robot_main_two>li').eq(i).attr('data') == $('#robot_main_two_fields_bottom').attr('data')) {
			var robotx_list_id_ch = $('#robot_main_two>li').eq(i).attr('id');
			for(var j = 0; j < $('#' + robotx_list_id_ch + '>ul>.robot-list-conetnt').length; j++) {
				if($('#' + robotx_list_id_ch + '>ul>.robot-list-conetnt').eq(j).text() == list_old_text_filds) {
					$('#' + robotx_list_id_ch + '>ul>.robot-list-conetnt').eq(j).attr('ys', '0');
				};
			};
		};
		if(i + 1 == list_text_filds_index) {
			$('.top-second>p').eq(1).find('span').eq(i).text(list_text_filds);
		};
	};
	RelatedList.hide();
	if(dataType.text() == 'date' && list_text_filds === 'date' && $('.top_three>ul>li').eq(1).find('i').hasClass('add-background')) {
		$('.top_three_input').attr('disabled', false);

	} else {
		$('.top_three_input').attr('disabled', true);
		$('.top_three_input').val('')
	}
	for(var i = 0; i < $('#robot_main_two>li').length; i++) {
		if($('#robot_main_two>li').eq(i).attr('data') == $('#robot_main_two_fields_bottom').attr('data')) {
			var robotx_list_id_ch = $('#robot_main_two>li').eq(i).attr('id');
			for(var j = 0; j < $('#' + robotx_list_id_ch + '>ul>.robot-list-conetnt').length; j++) {
				if($('#' + robotx_list_id_ch + '>ul>.robot-list-conetnt').eq(j).text() == list_text_filds) {
					$('#' + robotx_list_id_ch + '>ul>.robot-list-conetnt').eq(j).attr('ys', '1');
				};
			};
		}
	};
});

//获取隐藏tab_id
var mod_hide_id = '';
var modelCounter = 1;
//设置svg初始值
var svg_content = null
//页面下拉框
$('.c_nav_list-robot').click(function() {
	$(this).next().toggle();
});
$('#c_nav_list_robox>li').click(function() {
	$('#c_robot_tag').text($(this).text());
	$('#c_nav_list_robox').hide();
	$('.robot-main-footer').fadeIn();
});
//隐藏字段框
$(document).on('click', '.hidden_aut', function() {
	$(this).parent().fadeOut();
	$(this).parent().parent().removeClass('robot-main-change');
	$('.robot-main-footer').fadeIn();
	$("#robot_main_two_parent").css('width', '100%')
	$("#robot_main_two_parent").css('overflow', 'hidden');
	$("#robot_main_two").css('width', '96%');
});

//渲染两张表之间的关联和主键
$('#robotx_save1').click(function() {
	u = 0;
	var rightList = $(this).parent().parent();
	var robot_main_two_fields_bottom = false;
	var robot_main_two_fields_bottom_data = [];
	for(var i = 0; i < $('#robot_main_two_fields_bottom>li').length; i++) {

		if($('#robot_main_two_fields_bottom>li').eq(i).children('ul').children('li').eq(2).find('span').hasClass('add-background')) {
			robot_main_two_fields_bottom = true;
			robot_main_two_fields_bottom_data.push($('#robot_main_two_fields_bottom>li').eq(i).children('ul').children('li').eq(0).text());
		} else {};
	};
	robot_main_two_fields_bottom_data = robot_main_two_fields_bottom_data.join(',');
	if(robot_main_two_fields_bottom == true) {
		//		var fileName_robotx1 = sessionStorage.getItem($('#robot_main_two_fields_bottom').attr('data'));
		//		var fileName_robotx2 = JSON.parse(fileName_robotx1).data[0].fileName;
	};
	var type_table = '';
	if($('.top_three>ul>li').eq(1).find('i').hasClass('add-background')) {
		u++;
		type_table = 'BACKWARD';
		for(var i = 0; i < $('#robot_main_two>li').length; i++) {
			if($('#robot_main_two_fields_bottom').attr('data') == $('#robot_main_two>li').eq(i).attr('data')) {
				$('#robot_main_two>li').eq(i).attr('ns', $('.top_three_input').val());
			};
		};
	} else if($('.top_three>ul>li').eq(0).find('i').hasClass('add-background')) {
		u++;
		type_table = 'FORWARD';
	};

	if(u == 0) {
		layer.alert('请勾选与目标表关系!', {
			icon: 2,
			title: '提示'
		});
		return false;
	}
	var liList = $("#robot_main_two_fields_bottom>li").not(':first-child')
	var nullLength = 0
	for(var i = 0; i < liList.length; i++) {
		if(liList.eq(i).find('input').val() == "") {
			nullLength++
		}
	}
	if(nullLength > 1) {
		layer.alert('关联字段不能为空', {
			icon: 2,
			title: '提示'
		});
		return;
	} else {
		robotx_save_two();
		rightList.fadeOut();
	}

	$("#robot_main_two_parent").removeClass('robot-main-change');
	$('.robot-main-footer').fadeIn();
	$("#robot_main_two").css('width', '96%')
});
$(".robtx_help").click(function() {
	if($('.robotx_tips').is(':hidden')) {
		$('.robotx_tips').slideDown();
	} else {
		$('.robotx_tips').slideUp();
	};
})
$(document).on('click', '#robotx_tips_close', function() {
	$('.robotx_tips').slideUp();
});
//与目标表关系选择
$(document).on('click', '.top_three>ul>li>i', function() {
	var relation = $(this);
	var relationProportion = $(this).next().text();
	$('.top_three>ul>li>i').removeClass('add-background');
	if(relation.hasClass('add-background')) {
		relation.removeClass('add-background');
	} else {
		relation.addClass('add-background');
		//勾选与容器表配置字段下面选框
		if($(this).next().text() == '1:1') {
			$('.top_three_input').attr('disabled', true);
			$('.top_three_input').val('')
			for(var i = 0; i < $('#robot_main_two>li').length; i++) {
				if($('#robot_main_two>li').eq(i).attr('data') == $('#robot_main_two_fields_bottom').attr('data')) {
					$('#robot_main_two>li').eq(i).attr('ns', '');
				};
			};
		} else {
			for(var i = 1; i < $('#robot_main_two_fields_bottom>li').length; i++) {
				if($('#robot_main_two_fields_bottom>li').eq(i).find('ul').children('li').eq(1).find('label').find('input').val() == 'date') {
					$('.top_three_input').attr('disabled', false);
				};
			};

		};
		for(var i = 0; i < $('#robot_main_two>li').length; i++) {
			if($('#robot_main_two>li').eq(i).attr('data') == $('#robot_main_two_fields_bottom').attr('data')) {
				if($(this).next().text() == '1:1') {
					$('#robot_main_two>li').eq(i).attr('n1', 'forward');
				} else {
					$('#robot_main_two>li').eq(i).attr('n1', 'backward');
				}
			};
		};
	};
});

//点击问号。
$(document).on('click', '')
//结果展示搜索
$('.robot-main-three-top-search-content>input').on('input propertychange', function() {
	var result = $(this).val();
	$('.robot-main-three-content-content>ul').children('li').show();
	if(result == '') {
		$('.robot-main-three-content-content>ul').children('li').show();
	} else {
		for(var i = 0; i < $('.robot-main-three-content-content>ul>li').length; i++) {
			if($('.robot-main-three-content-content>ul').children('li').eq(i).children('ul').children('li').eq(0).text().indexOf(result) == -1 && $('.robot-main-three-content-content>ul').children('li').eq(i).children('ul').children('li').eq(1).text().indexOf(result) == -1 && $('.robot-main-three-content-content>ul').children('li').eq(i).children('ul').children('li').eq(2).text().indexOf(result) == -1) {
				$('.robot-main-three-content-content>ul').children('li').eq(i).hide();
			};
		};
	}
});
//下一步
var count_click = 1
$(".robot-success").click(function() {
	if($('#guide_three').hasClass('div-checked')) {
		save_load_gif($(this), true);
		var if_robotx_dis = 'Y';
		save_load_gif($(this), false);
		layer.alert('保存成功!', {
			icon: 1,
			title: '提示'
		});
		$('.robot-main-two-ec').each(function() {
			robotx.detachAllConnections($(this));
		});
		$(".robot-main-one").show();
		$(".robot-main-two").hide();
		$('.robot-main-three').hide();
		$("#guide_one").removeClass('div-checked');
		$("#guide_one span").removeClass('div-checked-span').removeClass('guideones').text('1');
		$("#guide_two").removeClass('div-checked');
		$("#guide_two span").removeClass('div-checked-span').removeClass('guideones').text('2');
		$("#guide_three").removeClass('div-checked');
		$("#guide_three span").removeClass('div-checked-span').removeClass('guideones').text('3');
		$('#guide_four').removeClass('div-checked');
		$('#guide_four span').removeClass('div-checked-span').removeClass('guideones').text('4');

		$(".robot-main-two-fields").hide();
		$(".robot-main").fadeOut();
		$('.robot-success').text('下一步');

		robotx_stus = false;
		robotx_stuss = false;

	} else if($('#guide_two').hasClass('div-checked')) {
		$('#robot_main_two').html('');
		$(".robot-main-one").hide();
		$(".robot-main-two").show();
		$('.robot-main-three').hide();
		$("#guide_two").removeClass('div-checked');
		$("#guide_two span").removeClass('div-checked-span').addClass('guideones').text('');
		$("#guide_three").addClass('div-checked');
		$("#guide_three span").addClass('div-checked-span');

		$(".robot-main-two-fields").hide();
		if(robotx_data_exits === true && robotx_stus == false && robotx_stuss == false && relation_status === true) {
			addpoint();
			robotx_load_two()
		} else {
			if($(".robot-main-fields .add-background").length == 0) {
				$(".robot-fail").click();
				layer.alert('请勾选主键!', {
					icon: 1,
					title: '提示'
				});
				return
			};
			addpoint();
		};

	} else if($('#guide_four').hasClass('div-checked')) {
		save_load_gif($(this), true);
		var if_robotx_dis = 'Y';
		$('.robot-main-two-ec').each(function() {
			robotx.detachAllConnections($(this));
		});
		$(".robot-main-one").show();
		$(".robot-main-two").hide();
		$('.robot-main-three').hide();
		$("#guide_one").removeClass('div-checked');
		$("#guide_one span").removeClass('div-checked-span').removeClass('guideones').text('1');
		$("#guide_two").removeClass('div-checked');
		$("#guide_two span").removeClass('div-checked-span').removeClass('guideones').text('2');
		$("#guide_three").removeClass('div-checked');
		$("#guide_three span").removeClass('div-checked-span').removeClass('guideones').text('3');
		$('#guide_four').removeClass('div-checked');
		$('#guide_four span').removeClass('div-checked-span').removeClass('guideones').text('4');

		$(".robot-main-two-fields").hide();
		$(".robot-main").fadeOut();
		$('.robot-success').text('下一步');

	};
});
//上一步
$(".robot-fail").click(function() {
	if($('#guide_one').hasClass('div-checked')) {
		$('.robot-main').fadeOut();
	} else if($('#guide_two').hasClass('div-checked')) {
		$(".robot-main-one").show();
		$(".robot-main-two").hide();
		$('.robot-main-three').hide();
		$("#guide_two").removeClass('div-checked');
		$("#guide_two span").removeClass('div-checked-span').removeClass('guideones').text('2');
		$('#guide_one').addClass('div-checked');
		$('#guide_one span').addClass('div-checked-span').removeClass('guideones').text('1');;
		$(".robot-main-one-edit-left img").show();
		$('#robot_main_one_left_p').show();
		$("#robot_one_right_p").show();
		$(".robot-main-div-selected").remove();
		$('.robot-main-p-selected').remove();
		$(".robot-main-fields").remove();
		$(".robot-fail").html('取&nbsp;&nbsp;消');
	} else if($('#guide_three').hasClass('div-checked')) {
		$(".robot-main-one").show();
		$(".robot-main-two").hide();
		$('.robot-main-three').hide();
		$("#guide_three").removeClass('div-checked');
		$("#guide_three span").removeClass('div-checked-span').removeClass('guideones').text('3');
		$('#guide_two').addClass('div-checked');
		$('#guide_two span').addClass('div-checked-span').removeClass('guideones').text('2');;
	} else if($('#guide_four').hasClass('div-checked')) {
		$(".robot-main-one").hide();
		$(".robot-main-two").show();
		$('.robot-main-three').hide();
		$("#guide_four").removeClass('div-checked');
		$("#guide_four span").removeClass('div-checked-span').removeClass('guideones').text('4');
		$("#guide_three").addClass('div-checked');
		$("#guide_three span").addClass('div-checked-span').removeClass('guideones').text('3');
		$('.robot-success').text('下一步');
	};
});
//双击模型打开字段
$(document).on('dblclick', '#robot_main_two>li', function() {
	list_verise = $(this).attr('id');
	var content_title = $(this).find('.robot-list-title').text();
	$(".robot-main-two-fields").hide();
	$(".robot-main-three-fields").show();
	$('.robot-main-three-fields-bottom').show();
	$('.robot-main-two-fields-three').hide();
	$(".robot-main-two").addClass('robot-main-change');
	$(".robot-main-footer").hide();
	$(".robot-main-three-fields-bottom>p").html(content_title + '表字段配置');
	$('#robot_main_three_fields_bottom>li').not(':first-child').remove();
	var robot_right_list_length = $(this).children('ul').children('.robot-list-conetnt').length;
	for(var i = 0; i < robot_right_list_length; i++) {
		var robot_right_list_text = $(this).children('ul').find('.robot-list-conetnt').eq(i).text();
		var robot_right_list_text_type = $(this).children('ul').find('.robot-list-conetnt').eq(i).attr('data_type');
		console.log($(this).children('ul').find('.robot-list-conetnt').eq(i))
		if(robot_right_list_text_type !== 'date') {
			robot_right_list_text_type = '<label>' + robot_right_list_text_type + '</label>'
			//      	'<ul class="robotx_sjlx" ><li>numeric</li><li>date</li><li>factor</li></ul>'
		} else {
			robot_right_list_text_type = '<label>' + robot_right_list_text_type + '</label>'
		}
		$('#robot_main_three_fields_bottom').append('<li>' +
			'<ul>' +
			'<li class="firlds-kuan" title="' + robot_right_list_text + '">' + robot_right_list_text + '</li>' +
			'<li class="firlds-kuan robotx_sjlxs">' + robot_right_list_text_type + '</li>' +
			'</ul>' +
			'</li>');
	};

});
//保存
var robotx_json_data = [];

//将两张表数据保存在全局变量中
var robotx_spark_container = [];
var robotx_spark_relation = [];
var robotx_data_exits = false;
//robotx第一页中选择主键中的头部分代码
var headeOne = '<ul class="robot-main-fields"><li class="robot-fields-title"><ul><li class="robot-fields-name">字段名</li><li class="robot-fields-key">主键</li></ul></li></ul>';
//渲染选择主键相同部分
function headeOne_list(container_table, add) {
	if(container_table === undefined) {} else {
		return '<li><ul><li class="robot-fields-name" title="' + container_table.field + '" data="' + container_table.field + '" data_type="' + container_table.field_type + '" data_format="' + container_table.date_format + '">' + container_table.field + '</li><li class="robot-fields-select-key icon iconfont icon-duihao1 ' + add + '"></li></ul></li>';

	}

};
//已选择的容器表代码
function containerTable(container_id, tableName, list) {
	return ' <div class="robot-main-div-selected" commid="' + container_id + '">' +
		'<ul class="robot-main-one-table-list robot-main-ul-selected">' +
		'<li class="robot-list-title" title="' + tableName + '">' + tableName + '</li>' +
		list +
		'</ul>' +
		'</div>' +
		'<p class="robot-main-p-selected">已选择<span title="' + tableName + '">' + tableName + '</span>作为容器表</p>';
};
//将表信息添加到页面中
function feildsSame(return_info) {
	var format = '';
	if(return_info.field_type != 'date') {
		format = '';
	} else {
		format = return_info.date_format;
	}
	return '<li class="robot-list-conetnt" title="' + return_info.field + '" data_type="' + return_info.field_type + '" data_format="' + format + '" >' + return_info.field + '</li>'
};
//第二页容器表
function ContainerTwo(robotx_content_id, robotx_contian_commid, robot_main_two_list, tableName, left, top) {
	var str = '';
	var className = '';
	var firstClass = '';
	var heightValue = '130';
	if(tableName === '容器表') {
		str = '<i></i>';
		className = 'robotx_content_id';
		firstClass = 'robot-list-titles';
		heightValue = '147'
	}
	return '<li id="' + robotx_content_id + '" class="' + className + ' robot-main-two-ec jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected" style="position:absolute; left:' + left + 'px;top:' + top + 'px;height:' + heightValue + 'px;" data="' + robotx_contian_commid + '" n1="" souid="" >' +
		'<ul class="robot-main-one-table-list">' +
		'<li class="' + firstClass + ' robot-list-title">' + str + tableName + '</li>' +
		robot_main_two_list +
		'</ul>' +
		'</li>';
}
//第二页表字段
function ContainerFields(new_return, value) {
	if(new_return === undefined) {

	} else {
		var className = '';
		var classList = 'robot-list-conetnt robot-list-conetnts'
		if(value === 'true') {
			className = 'robot-list-conetnt-i';
			classList = 'robot-list-conetnt'

		} else if(value === 'falseTrue') {
			classList = 'robot-list-conetnt'
		}
		return '<li class="' + classList + '" data_type="' + new_return.field_type + '" data_format="' + new_return.date_format + '"><span class="' + className + '"></span>' + new_return.field + '</li>'
	}

}
//年月日时分秒
function time(value) {
	if(value == 'year') {
		$('#data_time').text('年');
	} else if(value == 'month') {
		$('#data_time').text('月');
	} else if(value == 'day') {
		$('#data_time').text('日');
	} else if(value == 'hour') {
		$('#data_time').text('时');
	} else if(value == 'minute') {
		$('#data_time').text('分');
	} else if(value == 'second') {
		$('#data_time').text('秒');
	};
};
//点击进入robot
$("#m_robot_configure").click(function() {
	$(".robot-main-footer").show()
	var souid = $("#robotx-main-spark").attr('souid');
	var souid_arrs = souid.split(',');
	souid_arr = [];
	for(var i = 0; i < souid_arrs.length; i++) {
		if(souid_arr.indexOf(souid_arrs[i]) == -1) souid_arr.push(souid_arrs[i]);
	};
	var length_status = false
	if(souid_arrs.length < 2) {
		length_status = true
	}
	var souid_status = false;
	for(var j = 0; j < souid_arr.length; j++) {
		if(souid_arr[j] === '') {
			souid_status = true;
		}
	}
	var robotx_status = false;
	for(var index = 0; index < souid_arr.length; index++) {
		for(var i = 0; i < $(".hive").length; i++) {
			if(souid_arr[index] === $(".hive").eq(i).attr('compid')) {
				if($(".hive").eq(i).attr('tableName') == 'undefined') {
					robotx_status = true;
				}
			}
		}
	}
	if(robotx_status === true || souid_status === true || length_status === true) {
		if(robotx_status === true) {
			layer.alert('hiveReader组件请选择表', {
				icon: 2,
				title: '提示'
			});
		};
		if(souid_status === true) {
			layer.alert('选择hivereader组件与之相连', {
				icon: 2,
				title: '提示'
			});
		};
		if(length_status === true) {
			layer.alert('请至少连接两个HiveReader组件', {
				icon: 2,
				title: '提示'
			});
		};

	} else {
		//查看组件是否已存在
		$.ajax({
			type: "post",
			url: server + '/robotx_spark/check_configuration?' + timeStamp,
			async: false,
			data: {
				project_id: proid,
				component_id: $("#robotx-main-spark").attr('data'),
				inputs: souid_arr,
			},
			success: function(data) {
				function success() {
					if(dataBack(data).detail === null || dataBack(data).detail === 'changed' || dataBack(data).detail === 'null') {
						robotx_data_exits = false;
					} else {
						robotx_spark_container = dataBack(data).detail.container;
						robotx_spark_relation = dataBack(data).detail.relations;
						robotx_data_exits = true;
						robotx_stuss = false;
						if(robotx_spark_relation.length === 0) {
							relation_status = false;
						} else {
							relation_status = true;

						}
					};
				}

				backInfo(data, success)
			},
			error: function() {
				layer.msg('接口请求失败');
			}
		});
		$(".robot-main").fadeIn();
		$('#robot_one').html('');

		//csv文件信息
		//表中文名
		tablechinese = [];
		tablechinese_ori = [];
		return_info = [];
		for(var i = 0; i < souid_arr.length; i++) {
			$.ajax({
				type: 'post',
				async: false,
				url: server + '/component/load_hive_reader?' + timeStamp,
				data: {
					project_id: proid,
					component_id: souid_arr[i],
				},
				success: function(data) {
					function success() {
						tablechinese.push(dataBack(data).detail.logic_name);
						tablechinese_ori.push(dataBack(data).detail.table_name)
					}
					backInfo(data, success)
				},
				error: function(data) {
					layer.msg('接口请求失败');
				}
			});
			$.ajax({
				type: 'post',
				async: false,
				url: server + '/io/load_field_type?' + timeStamp,
				data: {
					project_id: proid,
					component_id: souid_arr[i],
				},
				success: function(data) {
					function success() {
						return_info[i] = [];
						for(var h = 0; h < dataBack(data).detail.length; h++) {
							if(dataBack(data).detail[h].ignore === false) {
								return_info[i].push(dataBack(data).detail[h])
							}
						}
					};
					backInfo(data, success)
				},
				error: function(data) {
					layer.msg('接口请求失败');
				}
			})
		};
		//将表信息添加到页面中
		for(var i = 0; i < tablechinese.length; i++) {
			$("#robot_one").append('<li id="table_' + i + '" style="margin-left:28px;">' +
				'<ul class="robot-main-one-table-list">' +
				'<li style="display:none" >' + souid_arr[i] + '</li>' +
				'<li class="robot-list-title" title="' + tablechinese[i] + '">' + tablechinese[i] + '</li>' +
				'</ul>' +
				'</li>');
			for(var j = 0; j < return_info[i].length; j++) {
				var fields = feildsSame(return_info[i][j])
				$("#robot_one #table_" + i + " ul").append(fields);
			};

		};
		//load第一部分
		console.log(robotx_data_exits)
		console.log(robotx_stus)
		console.log(robotx_stuss)
		if(robotx_data_exits === true && robotx_stus == false && robotx_stuss == false) {
			console.log('第一部分')
			$(".robot-main-one-edit-left img").hide();
			$('#robot_main_one_left_p').hide();
			$("#robot_one_right_p").hide();
			$(".robot-main-div-selected").remove();
			$('.robot-main-p-selected').remove();
			$(".robot-main-fields").remove();
			//容器表数据
			var container_table = [];
			for(var i = 0; i < souid_arr.length; i++) {
				if(souid_arr[i] === robotx_spark_container.container_id) {
					container_table.push({
						'tableName': tablechinese[i],
						'componentId': souid_arr[i],
						'tableFields': return_info[i]
					})
				}
			}
			console.log(container_table)
			var robotx_one_session_list = '';
			for(var i = 0; i < container_table[0].tableFields.length; i++) {
				var str = '<li class="robot-list-conetnt" title="' + container_table[0].tableFields[i].field + '">' + container_table[0].tableFields[i].field + '</li>';
				robotx_one_session_list = robotx_one_session_list + str;
			};
			//将容器表load到第一个页面上左方的选中区
			var str = containerTable(robotx_spark_container.container_id, container_table[0].tableName, robotx_one_session_list);
			$('.robot-main-one-edit-left').append(str);
			//渲染上右方的容器表详细数据
			var robotx_one_session_list_right1 = '';
			var robotx_one_session_list_right2 = '';
			$('.robot-main-one-edit-right').append(headeOne);
			if(container_table[0].tableFields.length === robotx_spark_container.key_fields.length) {
				for(var i = 0; i < container_table[0].tableFields.length; i++) {
					if(container_table[0].tableFields[i].field === robotx_spark_container.key_fields[i]) {
						var str = headeOne_list(container_table[0].tableFields[i], 'add-background')
						$('.robot-main-fields').append(str);
					} else {
						var str = headeOne_list(container_table[0].tableFields[i], '')
						$('.robot-main-fields').append(str);

					}
				};
			} else {
				var new_container = $.extend(true, [], container_table[0]);
				for(var i = 0; i < new_container.tableFields.length; i++) {
					for(var j = 0; j < robotx_spark_container.key_fields.length; j++) {
						if(new_container.tableFields[i].field === robotx_spark_container.key_fields[j]) {
							var str = headeOne_list(new_container.tableFields[i], 'add-background')
							$('.robot-main-fields').append(str);
							new_container.tableFields.splice(i, 1)
						}
					}
					var str = headeOne_list(new_container.tableFields[i], '')
					$('.robot-main-fields').append(str);

				};
			}
			//最多可选择的主键个数
			MainKey()

			$("#guide_one").removeClass('div-checked');
			$("#guide_one span").removeClass('div-checked-span').addClass('guideones').text('');
			$("#guide_two").addClass('div-checked');
			$("#guide_two span").addClass('div-checked-span');
			$(".robot-fail").text('上一步');
		};
		//设置csv页面可拖拽
		//拖拽设置
		$("#robot_one>li").draggable({
			scope: "plant",
			helper: "clone"
		});
		$(".robot-main-one-edit-left").droppable({
			scope: "plant",
			drop: function(event, ui) {
				robotx_stuss = true;
				if($('.robot-main-one-edit-left').find('.robot-main-div-selected') != null && $('.robot-main-one-edit-left').find('.robot-main-div-selected') != undefined && $('.robot-main-one-edit-left').find('.robot-main-div-selected').length != 0) {
					mod_hide_id = $('.robot-main-one-edit-left').find('.robot-list-title').text();
					robotx_stuss = true;
					robotx_stus = true;
					CreateTable(ui, $(this));
				} else {
					robotx_stuss = true;
					robotx_stus = true;
					CreateTable(ui, $(this));
				};
			}
		});
		//选择主键函数
		function MainKey() {
			$(".robot-main-fields>li").not(':first-child').each(function() {
				var count = 0
				$(this).find('.robot-fields-select-key').click(function() {

					robotx_stuss = true;
					robotx_stus = false;
					count++
					if(count % 2 !== 0) {
						if($(".add-background").length >= 5) {
							layer.alert('您最多可选四个主键！', {
								icon: 2,
								title: '提示'
							});
							count = 0
						} else {
							$(this).addClass('add-background');
						}
					} else {
						$(this).removeClass('add-background');
					}

				})
			});
		}
		//首次进入robotx界面操作
		//csv文件拖拽进选取操作
		function CreateTable(ui, selector) {
			var modelId = $(ui.draggable).attr("id");
			var id = modelId + "_model_" + modelCounter++;
			$(".robot-main-one-edit-left img").hide();
			$('#robot_main_one_left_p').hide();
			$("#robot_one_right_p").hide();
			$(".robot-main-div-selected").remove();
			$('.robot-main-p-selected').remove();
			$(".robot-main-fields").remove();
			//将表添加到选中区域
			var str = containerTable($(ui.draggable).find('li').eq(0).text(), $(ui.draggable).find('.robot-list-title').text(), '');
			$(selector).append(str);
			for(var i = 0; i < $(ui.draggable).find('.robot-list-conetnt').length; i++) {
				$('.robot-main-div-selected ul').append('<li class="robot-list-conetnt" title="' + $(ui.draggable).find('.robot-list-conetnt').eq(i).text() + '">' + $(ui.draggable).find('.robot-list-conetnt').eq(i).text() + '</li>');
			};
			//将数添加到右边勾选主键框
			var csv_componentID = $(ui.draggable).find('li:first-child').text();
			var index = null;
			for(var i = 0; i < souid_arr.length; i++) {
				if(souid_arr[i] === csv_componentID) {
					index = i;
				};
			};
			$(".robot-main-one-edit-right").append(headeOne);
			for(var i = 0; i < return_info[index].length; i++) {
				var str = headeOne_list(return_info[index][i], '');
				$(".robot-main-fields").append(str);
			};
			$("#guide_one").removeClass('div-checked');
			$("#guide_one span").removeClass('div-checked-span').addClass('guideones').text('');
			$("#guide_two").addClass('div-checked');
			$("#guide_two span").addClass('div-checked-span');
			$(".robot-fail").text('上一步');

			if(mod_hide_id != '') {
				$('#' + mod_hide_id + '').show();
			} else {

			};
			if($(selector).children().length > 0) {
				$("#robot_one>li").draggable({
					scope: "plant"
				});
			};
			//最多可选择的主键个数
			MainKey()
		};
	}

});
$('.icon-guanbi').click(function() {
	$(".robot-main-one").show();
	$(".robot-main-two").hide();
	$('.robot-main-three').hide();
	$("#guide_one").removeClass('div-checked');
	$("#guide_one span").removeClass('div-checked-span').removeClass('guideones').text('1');
	$("#guide_two").removeClass('div-checked');
	$("#guide_two span").removeClass('div-checked-span').removeClass('guideones').text('2');
	$("#guide_three").removeClass('div-checked');
	$("#guide_three span").removeClass('div-checked-span').removeClass('guideones').text('3');
	$('#guide_four').removeClass('div-checked');
	$('#guide_four span').removeClass('div-checked-span').removeClass('guideones').text('4');

	$(".robot-main-two-fields").hide();
	$(".robot-main").fadeOut();
	$('.robot-success').text('下一步');
})

//添加表信息到配置页面
function addpoint() {
	//设置表间关系拖拽
	robotx = jsPlumb.getInstance({
		DragOptions: {
			cursor: "pointer",
			zIndex: 11
		},
		ConnectionOverlays: [
			["Arrow", {
				location: 1,
				visible: true,
				width: 11,
				length: 11,
				direction: 1,
				id: "arrow_forwards"
			}],
		],
		Container: "robot_main_two"
	});
	robotx.importDefaults({
		ConnectionsDetachable: true,
		ReattachConnections: true
	});
	//监听新的连接
	robotx.bind("connection", function(connInfo) {
		//源表和目标表之间只能有一条连线
		var exits = $('#' + connInfo.targetId).attr('souid').indexOf($('#' + connInfo.sourceId).attr('data'))
		if(exits != -1 && exits != undefined) {
			robotx.detach(connInfo.connection);
			return
		} else {
			init(connInfo)
			init_robotx(connInfo.connection);
		}
	});
	robotx.bind("dblclick", function(conn) {
		init_robotx(conn)
	});
	$('#robot_main_two').html('');
	var robot_main_fields = $('.robot-main-fields').children('li').length;
	var robot_main_two_list = '';
	var robotx_content_id = 'robotx_content_id1';
	var robotx_contian_commid = $('.robot-main-div-selected').attr('commid');
	var primary_key = [];
	//渲染第一页容器表
	for(var k = 1; k < robot_main_fields; k++) {
		var str_primary_key = $('.robot-main-fields').children('li').eq(k).children('ul').children('.robot-fields-select-key').hasClass('add-background');
		var str_text_type = $('.robot-main-fields').children('li').eq(k).children('ul').children('.robot-fields-name').attr('data');
		var str_text = $('.robot-main-fields').children('li').eq(k).children('ul').children('.robot-fields-name').text();
		if(str_primary_key) {
			h++;
			var str_data_type_name = $('.robot-main-fields').children('li').eq(k).children('ul').children('.robot-fields-name').attr('data_type');
			var format = $('.robot-main-fields').children('li').eq(k).children('ul').children('.robot-fields-name').attr('data_format');
			var str = '<li class="robot-list-conetnt" data="' + str_text_type + '" ys="1" data_type="' + str_data_type_name + '" data_format="' + format + '" title="' + str_text + '"><span class="robot-list-conetnt-i"></span>' + str_text + '</li>';
			primary_key.push(str_text);
		} else {
			var str = '<li class="robot-list-conetnt" title="' + str_text + '" data_type="' + str_text_type + '" ys="0" ><span></span>' + str_text + '</li>';
		};
		robot_main_two_list = robot_main_two_list + str;
	};
	//保存容器表
	var container_table_name = '';
	for(var i = 0; i < tablechinese.length; i++) {
		if($(".robot-main-ul-selected .robot-list-title").text() === tablechinese[i]) {
			container_table_name = tablechinese_ori[i]
		}
	}
	$.ajax({
		type: 'post',
		url: server + '/robotx_spark/save_container?' + timeStamp,
		data: {
			project_id: proid,
			component_id: $("#robotx-main-spark").attr('data'),
			container_id: $(".robot-main-div-selected").attr('commid'),
			key_fields: primary_key,
			table_name: container_table_name,
		},
		success: function(data) {
			function success() {}
			backInfo(data, success)
		},
		error: function(data) {
			layer.msg('接口请求失败');
		}
	});
	//第二页容器表
	var robotx_fina_html = ContainerTwo(robotx_content_id, robotx_contian_commid, robot_main_two_list, '容器表', '276', '170');
	$('#robot_main_two').append(robotx_fina_html);
	robotx.addEndpoint(robotx_content_id, {
		anchors: "RightMiddle"
	}, hollowCircle);
	robotx.addEndpoint(robotx_content_id, {
		anchors: "LeftMiddle"
	}, hollowCircle);
	robotx.addEndpoint(robotx_content_id, {
		anchors: "TopCenter"
	}, hollowCircle);
	robotx.addEndpoint(robotx_content_id, {
		anchors: "BottomCenter"
	}, hollowCircle);
	robotx.repaintEverything();
	//表可拖拽
	//	$("#" + robotx_content_id).draggable({
	//		containment: "parent",
	//		scroll: true,
	//		drag: function(event, ui) {
	//			robotx.repaintEverything();
	//		},
	//		stop: function() {
	//			robotx.repaintEverything();
	//		}
	//	});

	//除容器表以外的其他表
	var mo_x = 0;
	var mo_y = 5;
	for(var i = 0; i < tablechinese.length; i++) {
		if($('.robotx_content_id').attr('data') == $('#robot_one>li').eq(i).children('ul').children('li').eq(0).text()) {

		} else {
			var robot_contion_list_commid = $('#robot_one').children('li').eq(i).children('ul').children('li').eq(0).text();
			var modelId = 'table';
			var idss = modelId + "_model_" + robot_contion_list_commid;
			var mian_l = $('.robot-main').css('left');

			$('#robot_main_two').append('<li id="' + idss + '" class="robot-main-two-ec jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected" style="position:absolute; left:' + mo_x + 'px;top:' + mo_y + 'px;" data="' + robot_contion_list_commid + '" n1="" ns="" gl="">' +
				'<ul class="robot-main-one-table-list">' +
				'<li class="robot-list-title" title="' + tablechinese[i] + '">' + tablechinese[i] + '</li>' +
				'</ul>' +
				'</li>');
			for(var j = 0; j < return_info[i].length; j++) {
				$("#" + idss + " ul").append('<li class="robot-list-conetnt" data_type="' + return_info[i][j].field_type + '" data_format="' + return_info[i][j].date_format + '" title="' + return_info[i][j].field + '">' + return_info[i][j].field + '</li>');
			};

			mo_x += 276;
			if((i > 1 && (i + 1) % 3 == 0) || i == 4) {
				mo_y += 174;
				mo_x = 0;
			};
			if(i == 3) {
				mo_x += 276;
			};
			robotx.addEndpoint(idss, {
				anchors: "RightMiddle"
			}, hollowCircle_robotx);
			robotx.addEndpoint(idss, {
				anchors: "LeftMiddle"
			}, hollowCircle_robotx);
			robotx.addEndpoint(idss, {
				anchors: "TopCenter"
			}, hollowCircle_robotx);
			robotx.addEndpoint(idss, {
				anchors: "BottomCenter"
			}, hollowCircle_robotx);
			robotx.repaintEverything();
			//			$("#" + idss).draggable({
			//				containment: "parent",
			//				scroll: true,
			//				drag: function(event, ui) {
			//					robotx.repaintEverything();
			//				},
			//				stop: function() {
			//					robotx.repaintEverything();
			//				}
			//			});
		}
	};
};
//设置连线时触发的事件
var relation_table = {};

function init(conn) {
	var sourceName = $("#" + conn.sourceId).attr("data");
	var targetName = $("#" + conn.targetId).attr("compid");
	var sou = $("#" + conn.targetId).attr("souid");
	if(sou == '' || sou == undefined) {
		$("#" + conn.targetId).attr("souid", sourceName);
	} else {
		$("#" + conn.targetId).attr('souid', sou + ',' + sourceName);
	};

};

function init_robotx(conn) {
	$("#robot_main_two").css('width', '538px');
	$(".robot-main-two-fields").show();
	$(".robot-main-three-fields").hide();
	$('.robot-main-two-fields-top,.robot-main-two-fields-bottom').show();
	$(".robot-main-two").addClass('robot-main-change');
	$(".robot-main-footer").hide();
	$(".robot-main-two-fields-bottom>p").html('从下表中勾选与容器表关联的字段并配置字段类型');
	$(".robot-fields-footer button:first-child").show();
	$('#robot_main_two_fields_bottom>li').not(':first-child').remove();
	$('.top-second').find('p').eq(1).find('span').remove();
	$('.top-second').find('p').eq(0).text($('#' + conn.sourceId).children('ul').children('.robot-list-title').text());
	$('#robot_main_two_fields_bottom').attr('data', $('#' + conn.sourceId).attr('data'));
	$('.top_three').attr('data', $('#' + conn.sourceId).attr('data'));
	$('#data_time').text('');
	$('.top_three>ul>li>i').removeClass('add-background');
	var conn_length = $('#' + conn.sourceId).children('ul').children('.robot-list-conetnt').length;
	var conn_lengths = $('#' + conn.targetId).children('ul').children('.robot-list-conetnt').length;
	var l = 0;
	$('.top-first').find('p').eq(1).find('span').remove();
	relation_table = {
		'source_id': $('#' + conn.sourceId).attr('data'),
		'target_id': $('#' + conn.targetId).attr('data')
	};
	for(var i = 0; i < conn_lengths; i++) {
		var str_conn_texts = $('#' + conn.targetId).children('ul').children('.robot-list-conetnt').eq(i).text();
		var str_conn_texts_type = $('#' + conn.targetId).children('ul').children('.robot-list-conetnt').eq(i).attr('data');
		if($('#' + conn.targetId).children('ul').children('.robot-list-conetnt').eq(i).children('span').hasClass('robot-list-conetnt-i')) {
			var str = '<span>' + str_conn_texts + '</span>';
			var str_fina_robotx = '';
			var date_str = '';
			$('.top-first').find('p').eq(1).append(str);
			$('.top-second').find('p').eq(1).append('<span></span>');
			for(var j = 0; j < conn_length; j++) {
				var str_conn_text = $('#' + conn.sourceId).children('ul').children('.robot-list-conetnt').eq(j).text();
				var str_conn_text_type = $('#' + conn.sourceId).children('ul').children('.robot-list-conetnt').eq(j).attr('data_type');
				var strr = '<li title="' + str_conn_text + '">' + str_conn_text + '</li>'
				str_fina_robotx = str_fina_robotx + strr;
				if(str_conn_text_type == 'date') {
					var strr = '<li title="' + str_conn_text + '">' + str_conn_text + '</li>'
					date_str = date_str + strr;
				};
			};
			var str_conn_texts_data_type = '';
			if($('#' + conn.targetId).children('ul').children('.robot-list-conetnt').eq(i).attr('data_type') == 'null') {
				str_conn_texts_data_type = '';
			} else {
				str_conn_texts_data_type = $('#' + conn.targetId).children('ul').children('.robot-list-conetnt').eq(i).attr('data_type');
				if(str_conn_texts_data_type === 'date') {
					var data_type = $('#' + conn.targetId).children('ul').children('.robot-list-conetnt').eq(i).attr('data_format')
					time(data_type);
				}
			};
			//load表间关系以及连线时触发的表关系
			function fieldsRelation(str_conn_texts, date_str, str_conn_texts_data_type, fieldsName) {
				return '<li>' +
					'<ul>' +
					'<li class="firlds-kuans" title="' + str_conn_texts + '">' + str_conn_texts + '</li>' +
					'<li class="firlds-kuans robotx_glzds"><label><input type="text" class="input70" value="' + fieldsName + '"><i></i></label>' +
					'<ul class="robotx_glzd">' +
					'<li></li>' +
					date_str +
					'</ul>' +
					'</li>' +
					'<li class="fields-skin" data_type="' + str_conn_texts_data_type + '">' + str_conn_texts_data_type + '</li>' +
					'</ul>' +
					'</li>';
			};
			if($('#' + conn.targetId).children('ul').children('.robot-list-conetnt').eq(i).attr('data_type') == 'date') {
				var strr = fieldsRelation(str_conn_texts, date_str, str_conn_texts_data_type, '');
				$('#robot_main_two_fields_bottom').append(strr);
			} else {
				var strr = fieldsRelation(str_conn_texts, str_fina_robotx, str_conn_texts_data_type, '');
				$('#robot_main_two_fields_bottom').append(strr);
			}
		};
	};
	//load robotx配置页面
	if(robotx_data_exits === true && robotx_stus == false && robotx_stuss == false && relation_status === true) {
		for(var j = 0; j < robotx_spark_relation.length; j++) {
			if(robotx_spark_relation[j].source == $("#robot_main_two_fields_bottom").attr('data')) {
				//将关联数据添加到第二个选框中
				for(var i = 0; i < robotx_spark_relation[j].join.length; i++) {
					var robot_key_fields = $("#robot_main_two_fields_bottom>li").not(':first-child');
					for(var m = 0; m < robot_key_fields.length; m++) {
						var list_one = robot_key_fields.eq(m).children('ul').children('li:first-child')
						var list_two = robot_key_fields.eq(m).children('ul').children('li:nth-child(2)')
						for(var h = 0; h < robotx_spark_relation[j].join.length; h++) {
							if(list_one.text() === robotx_spark_relation[j].join[h].tg_field) {
								list_two.find('label').html('<input type="text" class="input70" value="' + robotx_spark_relation[j].join[h].sc_field + '" title="' + robotx_spark_relation[j].join[h].sc_field + '"><i></i>')
							}
						}
					}
				}
				//				load日月年
				var idArr = $("#robot_main_two>li").map(function() {
					return $(this).attr('id')
				});
				var containerId = '';
				for(var g = 0; g < idArr.length; g++) {
					if(idArr[g].substr(0, 17) == 'robotx_content_id') {
						containerId = g;
					}
				}
				var ContainerFieldsList = $("#robot_main_two>li").eq(containerId).find('li').not(':first-child');
				for(var w = 0; w < ContainerFieldsList.length; w++) {
					if(ContainerFieldsList.eq(w).attr('ddata_type') !== 'null') {
						time(ContainerFieldsList.eq(w).attr('data_type'))
					}
				}
				//				if(robotx_spark_relation[j].source === $(".top_three").attr('data')){
				if(robotx_spark_relation[j].rel_type === 'BACKWARD') {
					$('.top_three>ul>li').eq(1).find('i').addClass('add-background');
					$('.top_three>ul>li').eq(0).find('i').removeClass('add-background');
					$('.top_three_input').attr('disabled', true);
					for(var i = 1; i < $('#robot_main_two_fields_bottom>li').length; i++) {
						if($('#robot_main_two_fields_bottom>li').eq(i).find('ul').children('li').eq(1).find('label').find('input').val() == 'date') {
							$('.top_three_input').attr('disabled', false);
						}
					};
				} else {
					$('.top_three_input').attr('disabled', true);
					$('.top_three>ul>li').eq(0).find('i').addClass('add-background');
					$('.top_three>ul>li').eq(1).find('i').removeClass('add-background');

				};
				$(".top_three_input").val(robotx_spark_relation[j].interval)
				//				}

			} else {
				//判断是否是新加入的表
				//				$("#data_time").text('');
				if(difference.length > 0) {
					$('.top_three_input').val('');
					$('.top_three_input').attr('disabled', true)
					$("#robot_main_two_fields_bottom>li").not(':first-child').remove();
					var target_list = $("#" + conn.targetId).find('.robot-list-conetnt');
					var source_list = $("#" + conn.sourceId).find('.robot-list-conetnt');
					var source_list_val = '';
					var sourceArr = [];
					for(var q = 0; q < source_list.length; q++) {
						source_list_val += '<li>' + source_list.eq(q).text() + '</li>';
						sourceArr.push(source_list.eq(q).text())
					}
					for(var index_ = 0; index_ < target_list.length; index_++) {
						if(target_list.eq(index_).children('span').hasClass('robot-list-conetnt-i')) {
							if(target_list.eq(index_).attr('data_type') === 'date') {
								var listStr = '';
								for(var m = 0; m < sourceArr.length; m++) {
									if(sourceArr[m] === 'date') {
										listStr = '<li>date</li>';
									}
								}
								var str = fieldsRelation(target_list.eq(index_).text(), listStr, target_list.eq(index_).attr('data_type'), '');
								$("#robot_main_two_fields_bottom").append(str);
								var date_type = target_list.eq(index_).attr('data_type');
								time(date_type);
							} else {
								var str = fieldsRelation(target_list.eq(index_).text(), source_list_val, target_list.eq(index_).attr('data_type'), '');
								$("#robot_main_two_fields_bottom").append(str);
							}
						}

					}
				}

			}

		}

	}

	var menu = document.getElementById("right_key");
	for(var i = 0; i < $("#robot_main_two>svg").length; i++) {
		var svg = $("#robot_main_two>svg")[i];
		right_key(menu, svg);
	};
	robotx.bind("click", function(conn) {});
	$("#dele").click(function() {
		//		robotx.detach(conn );
		//		svg_content.remove();
		//		menu.style.display = "none";
	});

};
//robotx表配置连线右键删除
function right_key(menu, svg) {
	svg.oncontextmenu = function(e) {
		var e = e || window.event;
		//鼠标点的坐标
		var oX = e.clientX;
		var oY = e.clientY;
		//菜单出现后的位置
		svg_content = this
		menu.style.display = "block";
		menu.style.left = oX + "px";
		menu.style.top = oY + "px";
		menu.style.zIndex = 13;
		//阻止浏览器默认事件
		return false; //一般点击右键会出现浏览器默认的右键菜单，写了这句代码就可以阻止该默认事件。
	};
	document.onclick = function(e) {
		var e = e || window.event;
		menu.style.display = "none";
	};
	menu.onclick = function(e) {
		var e = e || window.event;
		e.cancelBubble = true;
	};
};

//robotx保存第一部分
function robotx_save_one() {
	var robot_one_data = [];
	var robot_one_data_filds = [];
	var robot_one_data_filds_addbac = '';
	var robot_one_data_text_addbac = '';
	for(var i = 1; i < $('.robot-main-fields>li').length; i++) {
		var robot_one_data_filds_text = $('.robot-main-fields').children('li').eq(i).children('ul').children('li').eq(0).text();
		var robot_one_data_text_type = $('.robot-main-fields').children('li').eq(i).children('ul').children('li').eq(0).attr('data');
		var type_name = $('.robot-main-fields').children('li').eq(i).children('ul').children('li').eq(0).attr('data_type');
		if($('.robot-main-fields').children('li').eq(i).children('ul').children('li').eq(1).hasClass('add-background')) {
			robot_one_data_filds_addbac = 1;
		} else {
			robot_one_data_filds_addbac = 0;
		};
		if($('.robot-main-fields').children('li').eq(i).children('ul').children('li').eq(2).hasClass('add-background')) {
			robot_one_data_text_addbac = 1;
		} else {
			robot_one_data_text_addbac = 0;
		};

		robot_one_data_filds.push({
			robot_one_data_filds_addbac: robot_one_data_filds_addbac,
			robot_one_data_filds_text: robot_one_data_filds_text,
			robot_one_data_text_addbac: robot_one_data_text_addbac,
			robot_one_data_text_type: robot_one_data_text_type,
			type: 'one',
			type_name: type_name,
			name: $('.robot-main-ul-selected').children('.robot-list-title').text()
		});
	};
	robot_one_data.push({
		contcaion_id: $('.robot-main-div-selected').attr('commid'),
		contcaion_name: $('.robot-main-ul-selected').children('.robot-list-title').text(),
		data: robot_one_data_filds
	});
};

function robotx_save_two() {
	var _robotx_list = robotx.getAllConnections();
	var _robotx_connects = [];
	var source_table_contant = '';
	$.each(robotx.getAllConnections(), function(idx, connection) {
		source_table_contant = connection.sourceId;
		_robotx_connects.push({
			ConnectionId: connection.id,
			PageSourceId: connection.sourceId, //连线起点块级元素ID
			PageTargetId: connection.targetId, //连线终点块级元素ID
			PageSourceIds: $(connection.source).attr('data'),
			PageTargetIds: $(connection.target).attr('data'),
			//          SourceHtml: connection.source.innerHTML,
			//          TargetHtml: connection.target.innerHTML,
			//          type:$(connection.source).attr('n1'),
			//          type_input:$(connection.source).attr('ns'),
			//           gl_list:$(connection.source).attr('gl'),
			anchors: $.map(connection.endpoints, function(endpoint) {
				return [
					[endpoint.anchor.x,
						endpoint.anchor.y,
						endpoint.anchor.orientation[0],
						endpoint.anchor.orientation[1],
						endpoint.anchor.offsets[0],
						endpoint.anchor.offsets[1]
					]
				];
			})

		});
	});
	var robotx_blocks = [];
	$(".robot-main-two-ec").each(function(idx, elem) {
		var $elem = $(elem);
		robotx_blocks.push({
			BlockIdd: $elem.attr('id'),
			BlockId: $elem.attr('data'),
			BlockName: $elem.find('.robot-list-title').text(),
			//          BlockContent: $elem.html(),
			BlockX: parseInt($elem.css("left"), 0),
			BlockY: parseInt($elem.css("top"), 0),
			//          type:$elem.attr('n1'),
			//          type_input:$elem.attr('ns'),
			//          gl_list:$elem.attr('gl'),
		});
	});
	var tg_field = [];
	var robotx_rr = [];

	for(var i = 0; i < $("#robot_main_two_fields_bottom>li").not(':first').length; i++) {
		var labelText = $("#robot_main_two_fields_bottom>li").not(':first').eq(i).children('ul').children('li:nth-child(2)').find('label').find('input').val()

		if(labelText === '') {} else {
			tg_field.push($("#robot_main_two_fields_bottom>li").not(':first').eq(i).children('ul').children('li:first-child').text())
			robotx_rr.push(labelText)
		}

	}
	for(var j = 0; j < $('#robot_main_two>li').length; j++) {
		if($('#robot_main_two_fields_bottom').attr('data') == $('#robot_main_two>li').eq(j).attr('data')) {
			$('#robot_main_two>li').eq(j).attr('gl', robotx_rr);

		}
	};
	var join_arr = [];
	for(var i = 0; i < tg_field.length; i++) {
		join_arr.push({
			'sc_field': robotx_rr[i],
			'tg_field': tg_field[i]
		})
	}
	var target_table_name = '';
	var source_table_name = '';
	for(var i = 0; i < souid_arr.length; i++) {
		if($(".robotx_content_id").attr('data') === souid_arr[i]) {
			target_table_name = tablechinese[i]
		}
		if($("#" + source_table_contant).attr('data') === souid_arr[i]) {
			source_table_name = tablechinese[i]
		}
	}
	var type_table = '';
	if($('.top_three>ul>li').eq(1).find('i').hasClass('add-background')) {
		u++;
		type_table = 'BACKWARD';
		for(var i = 0; i < $('#robot_main_two>li').length; i++) {
			if($('#robot_main_two_fields_bottom').attr('data') == $('#robot_main_two>li').eq(i).attr('data')) {
				$('#robot_main_two>li').eq(i).attr('ns', $('.top_three_input').val());
			};
		};
	} else if($('.top_three>ul>li').eq(0).find('i').hasClass('add-background')) {
		u++;
		type_table = 'FORWARD';
	};
	$.ajax({
		type: 'post',
		url: server + '/robotx_spark/save_relation?' + timeStamp,
		data: {
			project_id: proid,
			component_id: $("#robotx-main-spark").attr('data'),
			source: relation_table.source_id,
			target: relation_table.target_id,
			rel_type: type_table,
			join: join_arr,
			interval: $('.top_three_input').val(), //[30]
			source_table_name: source_table_name,
			target_table_name: target_table_name,
		},
		success: function(data) {
			function success() {
				$(".robot-success").text('保存');
			}
			backInfo(data, success)
		},
		error: function(data) {
			layer.msg('接口请求失败');
		}

	});
	var data = {
		'connection': _robotx_connects,
		'blocks': robotx_blocks
	};
	$.ajax({
		type: 'post',
		url: server + '/robotx_spark/save_xml?' + timeStamp,
		data: {
			project_id: proid,
			component_id: $("#robotx-main-spark").attr('data'),
			xml: JSON.stringify(data),
		},
		success: function(data) {
			function success() {}
			backInfo(data, success)
		},
		error: function(data) {
			layer.msg('接口请求失败');
		}
	});

	//  sessionStorage.setItem('robotx_spark_two',"{" + '"robotx_two":' + JSON.stringify(_robotx_connects) + ',"block":' + JSON.stringify(robotx_blocks) + "}");
};

function robotx_load_two() {
	connection_table = [];
	blocks_table = [];
	$.ajax({
		type: 'post',
		url: server + '/robotx_spark/load_xml?' + timeStamp,
		async: false,
		data: {
			project_id: proid,
			component_id: $("#robotx-main-spark").attr('data')
		},
		success: function(data) {
			function success() {
				if(dataBack(data).detail === "") {

				} else {
					connection_table = dataBack(dataBack(data).detail).connection;
					blocks_table = dataBack(dataBack(data).detail).blocks;
				}
			}
			backInfo(data, success)
		},
		error: function(data) {
			layer.msg('接口请求失败');
		}
	});
	var hive_arr = [];
	for(var i = 0; i < blocks_table.length; i++) {
		hive_arr.push(blocks_table[i].BlockId)
	};
	difference = hive_arr
		.filter(x => souid_arr.indexOf(x) == -1)
		.concat(souid_arr.filter(x => hive_arr.indexOf(x) == -1));
	for(var j = 0; j < connection_table.length; j++) {
		var final_anchors = [];
		var ConnectionId = connection_table[j].ConnectionId;
		var PageSourceId = connection_table[j].PageSourceId;
		var PageTargetId = connection_table[j].PageTargetId;
		var d = connection_table[j];
		for(var i = 0; i < 2; i++) {
			var ds = d['anchors'][i];
			var dstr = ds.join(',');
			var darry = dstr.split(',');
			var dataIntArr = [];
			dataIntArr = darry.map(function(data) {
				return +data;
			});
			final_anchors.push(dataIntArr);
		};
		//用jsPlumb添加锚点
		robotx.connect({
			source: PageSourceId,
			target: PageTargetId,
			anchors: final_anchors,
			endpoint: ["Dot", {
				radius: 4
			}], //端点形状
			connectorStyle: connectorPaintStyle,
			connectorHoverStyle: connectorHoverStyle,
			paintStyle: {
				stroke: "#3cf",
				strokeWidth: 2,
				outlineColor: "blue",
				outlineWidth: 2
			},
			hoverPaintStyle: {
				stroke: "#f08aa5",
				strokeWidth: 2,
				outlineColor: "blue",
				outlineWidth: 2
			},
			connector: ["Flowchart", {
				stub: 30,
				gap: 0,
				cornerRadius: 2,
				alwaysRespectStubs: true,
				midpoint: 0.5
			}],
			maxConnections: 10,
			isSource: true,
			isTarget: true,
			deleteEndpointsOnDetach: true
		});
		robotx.addEndpoint(PageSourceId, {
			anchors: "TopCenter"
		}, hollowCircle_robotx);
		robotx.addEndpoint(PageSourceId, {
			anchors: "RightMiddle"
		}, hollowCircle_robotx);
		robotx.addEndpoint(PageSourceId, {
			anchors: "BottomCenter"
		}, hollowCircle_robotx);
		robotx.addEndpoint(PageSourceId, {
			anchors: "LeftMiddle"
		}, hollowCircle_robotx);
		robotx.addEndpoint(PageTargetId, {
			anchors: "TopCenter"
		}, hollowCircle);
		robotx.addEndpoint(PageTargetId, {
			anchors: "RightMiddle"
		}, hollowCircle);
		robotx.addEndpoint(PageTargetId, {
			anchors: "BottomCenter"
		}, hollowCircle);
		robotx.addEndpoint(PageTargetId, {
			anchors: "LeftMiddle"
		}, hollowCircle);
	};

}