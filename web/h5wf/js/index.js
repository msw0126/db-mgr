/**
 *模型分析
 */
//运行参数配置页面宽高
var left = (screen.width - 560) / 2
var tops = (screen.height - 620) / 2
var clickNum = 0
var statusShow = false;
$("#runContent").css('left', left + 'px')
$("#runContent").css('top', tops + 'px')
$("#runContent_content>li>span").hover(function() {
	$(this).next().next().show()
}, function() {
	$(this).next().next().hide()
})
var going = true;
var robotx_stus = false;
var robotx_stuss = false;
var robotx_xml = '';
var setime = '';
var timer = '';
var shadowShow = true;
var app_id = '';
//xml魔板
var xml = '';
//sourceID
var souid = [];
/**模型计数器*/
var modelCounter = 0;
/**
 * 初始化一个jsPlumb实例
 */
var instance = jsPlumb.getInstance({
	DragOptions: {
		cursor: "pointer",
		zIndex: 1000
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
	Container: "container"
});
instance.importDefaults({
	ConnectionsDetachable: true,
	ReattachConnections: true
});
//端点样式设置
//基本连接线样式
var connectorPaintStyle = {
	stroke: "#3cf",
	strokeWidth: 2,
	outlineColor: "blue",
	outlineWidth: 2
};
// 鼠标悬浮在连接线上的样式
var connectorHoverStyle = {
	stroke: "#f08aa5",
	strokeWidth: 2,
	outlineColor: "blue",
	outlineWidth: 2
};
var hollowCircle = {
	endpoint: ["Dot", {
		cssClass: "endpointcssClass"
	}], //端点形状
	connectorStyle: connectorPaintStyle,
	connectorHoverStyle: connectorHoverStyle,
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
	isTarget: true, //是否可以放置（连接终点）
	maxConnections: -1,
};
var hollowCircle_none_end = {
	endpoint: ["Dot", {
		cssClass: "endpointcssClass"
	}], //端点形状
	connectorStyle: connectorPaintStyle,
	connectorHoverStyle: connectorHoverStyle,
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

$(function() {
	loadJson();
	//查询当前执行任务
	$.ajax({
		url: server + '/executor/current_exec?' + timeStamp,
		type: 'get',
		data: {
			project_id: proid,
		},
		success: function(data) {
			function success() {
				var datas = dataBack(data).detail;
				if(typeof datas === 'string') {
					$("#executor_button").show();
					$('#shadowBody').show();
					Timed_Access(datas)
					timer = window.setInterval(function() {
						Timed_Access(datas)
					}, 10000);
				} else if(datas === null) {
					$("#executor_button").hide();
				} else if(typeof datas === 'object') {
					$("#executor_button").show();
					failedExit = false;
					for(var j = 0; j < datas.length; j++) {
						executor(datas[j])
						Timed_Access_Result(datas[j].task_status, datas[j].component_id)
					}
				}

			}
			backInfo(data, success)
		},
		error: function(data) {
			layer.msg('接口请求失败');
		}
	})
	var index_sourceID = [];
	//声明需要删除的元素的ID
	// var modl_id = '';
	$('#container').click(function() {
		$(".context-menu").remove();
	})
	$('#container').on('click', '.writer', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.reader', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.hive', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.SelfDefinedFeature', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.learn', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.act', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.test', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.maintain', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.robotx', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.robotx_spark', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.combination', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	$('#container').on('click', '.pmml', function() {
		modl_id = $(this).attr('id');
		$(".context-menu").remove();
	});
	//保存按钮
	$('#c-save').click(function() {
		saveAjax()
	});
	function saveAjax(){
				going = true;
		save();
		var save_layer = layer.load(1, {
			shade: [0.4, '#000'] //0.1透明度的白色背景
		});
		$.ajax({
			url: server + '/xml/save?' + timeStamp,
			type: 'POST',
			data: {
				xml: dist_final_xml,
				project_id: proid,
			},
			success: function(data) {
				layer.close(save_layer);

				function success() {
					if(going == true) {
						layer.alert('保存成功', {
							icon: 1,
							title: '提示'
						});
					} else {

					};
				};
				backInfo(data, success)
			}
		});
	}
	//执行按钮
	$('#c_dos').click(function() {
		//		clearInterval(setime);
		going = false;
		ImplementFn('FULL_EXECUTION', '');
		$("#executor_button").show()
	});
	//继续执行按钮
	$("#c_dos_continue").click(function() {
		ImplementFn('CONT_EXECUTION', '');
		$("#executor_button").show()
	});
	//load
	//退出页面  
	$('#exit_html').click(function() {
		layer.confirm('您确定关闭此网站吗？', {
			btn: ['确定', '取消'] //按钮
		}, function() {
			window.close()
		});
	});
	//导入右侧菜单
	$('#container').on('dblclick', '.hive', function() {
		//		robotx_stus = true;
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		$('#index_right').load('hive.html', function() {
			$('.right-main').attr('data', modl_id);
		});
	});
	$('#container').on('dblclick', '.SelfDefinedFeature', function() {
//		robotx_stus = true;
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		var tablename = $(this).attr('tablename');
		$('#index_right').load('SelfDefinedFeature.html', function() {
			$('.right-main').attr('data', modl_id);
			if(tablename === 'undefined' || tablename === undefined) {
				$('.c-csv-again').hide();
			} else {
				$('.files_name').text(tablename)
				$('.files_name ').removeClass('img_upload');
				$('.c-csv-again').addClass('img_upload').show();
				$('.c-csv').attr('id', '').addClass('c-csv-active');
				$('.files_name').next().addClass('c-csv-icon');
				$('.edit_fields').css('display', 'block');
			}

		});
	});
	$('#container').on('dblclick', '.robotx_spark', function() {
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		var souid = $(this).attr('souid');
		$('#index_right').load('robotx_spark.html', function() {
			$('.right-main').attr('data', modl_id);
			$('.right-main').attr('souid', souid);
		});
	});
	$('#container').on('dblclick', '.combination', function() {
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		var souid = $(this).attr('souid');

		$('#index_right').load('combination.html', function() {
			$('.right-main').attr('data', modl_id);
			$('.right-main').attr('souid', souid);
		});
	});
	$('#container').on('dblclick', '.learn', function() {
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		var souid = $(this).attr('souid');
		$('#index_right').load('learn.html', function() {
			$('.right-main').attr('data', modl_id);
			$('.right-main').attr('souid', souid);
		});
	});
	$('#container').on('dblclick', '.act', function() {
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		var souid = $(this).attr('souid');
		$('#index_right').load('act.html', function() {
			$('.right-main').attr('data', modl_id);
			$('.right-main').attr('souid', souid);
		});
	});
	$('#container').on('dblclick', '.test', function() {
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		var souid = $(this).attr('souid');
		$('#index_right').load('test.html', function() {
			$('.right-main').attr('data', modl_id);
			$('.right-main').attr('souid', souid);
		});
	});
	$('#container').on('dblclick', '.exported', function() {
		$('#index_right').html('');
		modl_id = $(this).attr('compid');
		var souid = $(this).attr('souid');
		for(var i=0;i<$(".learn").length;i++){
			if($(".learn").eq(i).attr('compid')===souid){
				if($(".learn").eq(i).attr('status')==='SUCCEEDED'){
					$('#index_right').load('exported.html', function() {
						$('.right-main').attr('data', modl_id);
						$('.right-main').attr('souid', souid);
					});
				}else{
					alert('learn组件为执行成功')
				}
			}else if(souid===""){
				alert('未连接learn组件')
			}
		}

		
	});
	//阻止浏览器自带的右键菜单
	$(document).on("contextmenu", "div", function() {
		return false;
	});
	//鼠标右键菜单栏
	function MouseKeyRight(tops, lefts, commpid, type, fatname, Package, souid, statu,tablename) {
		var top = lefts + 70,
			left = tops + 40
		var str = ''
		if(Package === 'hive' || Package === 'SelfDefinedFeature') {

			return '<div class="context-menu" style="left:' + top + "px; top: " + left + 'px; width: 100px; height: 73px; z-index: 3;" compid="' + commpid + '" type="' + type + '" fatname="' + fatname + '"status="'+statu+'" tablename="'+tablename+'">' +
				'<div class="context-menu-item"><div class="context-menu-text">参数</div><div class="context-menu-icon properties-icon"></div></div>' +

				'<div class="context-menu-item"><div class="context-menu-text">删除</div><div class="context-menu-icon icon-remove"></div></div>'+
                '<div class="context-menu-item"><div class="context-menu-text" style="letter-spacing: 4px;">数据预览</div><div class="context-menu-icon icon-wacth"></div></div>' +
				'</div>';

				'<div class="context-menu-item"><div class="context-menu-text">删除</div><div class="context-menu-icon icon-remove"></div></div></div>';

		}else if(Package === 'robotx_spark'){
			str = '<div class="context-menu-item"><div class="context-menu-text">删除</div><div class="context-menu-icon icon-remove"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text">数据预览</div><div class="context-menu-icon icon-wacth"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text">执行</div><div class="context-menu-icon icon-execture"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text" style="letter-spacing: 7px;">下载生成字典</div><div class="context-menu-icon icon-load"></div></div>' +
				'</div>';
			return '<div class="context-menu" style="left:' + top + "px; top: " + left + 'px; width: 150px; height: 123px; z-index: 3;" compid="' + commpid + '" type="' + type + '" souid="' + souid + '" fatname="' + fatname + '"status="'+statu+'">' +
				'<div class="context-menu-item"><div class="context-menu-text">参数</div><div class="context-menu-icon properties-icon"></div></div>' + str
		} if(Package === 'learn'){
			str = '<div class="context-menu-item"><div class="context-menu-text">删除</div><div class="context-menu-icon icon-remove"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text">查看报告</div><div class="context-menu-icon icon-wacth"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text">执行</div><div class="context-menu-icon icon-execture"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text">导出</div><div class="context-menu-icon icon-load"></div></div>' +
				'</div>';
			return '<div class="context-menu" style="left:' + top + "px; top: " + left + 'px; width: 150px; height: 122px; z-index: 3;" compid="' + commpid + '" type="' + type + '" souid="' + souid + '" fatname="' + fatname + '"status="'+statu+'">' +
				'<div class="context-menu-item"><div class="context-menu-text">参数</div><div class="context-menu-icon properties-icon"></div></div>' + str
		}else {
			str = '<div class="context-menu-item"><div class="context-menu-text">删除</div><div class="context-menu-icon icon-remove"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text">查看报告</div><div class="context-menu-icon icon-wacth"></div></div>' +
				'<div class="context-menu-item"><div class="context-menu-text">执行</div><div class="context-menu-icon icon-execture"></div></div>' +
				'</div>';
			return '<div class="context-menu" style="left:' + top + "px; top: " + left + 'px; width: 150px; height: 98px; z-index: 3;" compid="' + commpid + '" type="' + type + '" souid="' + souid + '" fatname="' + fatname + '"status="'+statu+'">' +
				'<div class="context-menu-item"><div class="context-menu-text">参数</div><div class="context-menu-icon properties-icon"></div></div>' + str

		}
	}
	$(document).on("mousedown", ".hive", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				fatname = $(this).attr('id'),
				statu=$(this).attr('status'),

				Package = 'hive';
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package,statu);

			$(this).after(str);
			return false;
		} else {
			$(".context-menu").remove();
		}

	}), $(document).on("mousedown", ".SelfDefinedFeature", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				fatname = $(this).attr('id'),
				Package = "SelfDefinedFeature",
				tablename = $(this).attr('tablename'), 
                statu=$(this).attr("status");
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package,"",statu,tablename);

			$(this).after(str);
			return false;
		} else if(e.which == 1) {
			$(".context-menu").remove();
		}

	}), $(document).on("mousedown", ".robotx_spark", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				souid = $(this).attr('souid'),
				fatname = $(this).attr('id'),
				Package = 'robotx_spark',

                statu=$(this).attr("status");
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package, souid,statu);

			$(this).after(str);
			return false;
		} else if(e.which == 1) {
			$(".context-menu").remove();
		};
	}), $(document).on("mousedown", ".combination", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				souid = $(this).attr('souid'),
				fatname = $(this).attr('id'),
				Package = 'combination',

                statu=$(this).attr("status");
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package, souid,statu);

			$(this).after(str);
			return false;
		} else if(e.which == 1) {
			$(".context-menu").remove();
		};
	}), $(document).on("mousedown", ".learn", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				souid = $(this).attr('souid'),
				fatname = $(this).attr('id'),
				Package = 'learn',

                statu=$(this).attr("status");
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package, souid,statu);

			$(this).after(str);
			return false;
		} else if(e.which == 1) {
			$(".context-menu").remove();
		};
	}), $(document).on("mousedown", ".act", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				souid = $(this).attr('souid'),
				fatname = $(this).attr('id'),
				Package = 'act',

                statu=$(this).attr("status");
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package, souid,statu);

			$(this).after(str);
			return false;
		} else if(e.which == 1) {
			$(".context-menu").remove();
		};
	}), $(document).on("mousedown", ".test", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				souid = $(this).attr('souid'),
				fatname = $(this).attr('id'),
				Package = 'test',

                statu=$(this).attr("status");
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package, souid,statu);

			$(this).after(str);
			return false;
		} else if(e.which == 1) {
			$(".context-menu").remove();
		};
	}), $(document).on("mousedown", ".exported", function(e) {
		if(3 == e.which) {
			$(".context-menu").remove();
			var tops = $(this).offset().top,
				lefts = $(this).offset().left,
				commpid = $(this).attr('compid'),
				type = $(this).attr('modeltype'),
				souid = $(this).attr('souid'),
				fatname = $(this).attr('id'),
				Package = 'exported',

                statu=$(this).attr("status");
			var str = MouseKeyRight(tops, lefts, commpid, type, fatname, Package, souid,statu);

			$(this).after(str);
			return false;
		} else if(e.which == 1) {
			$(".context-menu").remove();
		};
	}), $(document).mousedown(function(e) {
		if(2 == e.button) {
			$(".context-menu").remove();
		} else if(0 == e.button) {
			//      $(".context-menu").remove();    
		};
	});
	//查看参数
	$(document).on('click', '.context-menu-item', function() {
		var fareth = $(this).parent().attr('type');
		var modl_ids = $(this).parent().attr('compid');
		var souids = $(this).parent().attr('souid');
		var modl_idss = $(this).parent().attr('fatname');
        var status=$(this).parent().attr("status");
        var tablename = $(this).parent().attr('tablename');
		var enname = $(this).parent().attr('enname');
		if($(this).find('.context-menu-text').text() == '参数') {
			if(fareth == 'robotx_spark') {
				$('#index_right').html('');
				$('#index_right').load('robotx_spark.html', function() {
					$('.right-main').attr('data', modl_ids);
					$('.right-main').attr('souid', souids);
					$("input[name='componentID']").val(modl_id);
					$("input[name='projectID']").val(proid);
				});
				$(".context-menu").remove();
			} else if(fareth == 'learn') {
				$('#index_right').html('');
				$('#index_right').load('learn.html', function() {
					$('.right-main').attr('data', modl_ids);
					$('.right-main').attr('souid', souids);
				});
				$(".context-menu").remove();
			} else if(fareth == 'act') {
				$('#index_right').html('');
				$('#index_right').load('act.html', function() {
					$('.right-main').attr('data', modl_ids);
					$('.right-main').attr('souid', souids);
				});
				$(".context-menu").remove();
			} else if(fareth == 'test') {
				$('#index_right').html('');
				$('#index_right').load('test.html', function() {
					$('.right-main').attr('data', modl_ids);
					$('.right-main').attr('souid', souids);
				});
				$(".context-menu").remove();
			} else if(fareth === "hive") {
				$('#index_right').html('');
				$('#index_right').load('hive.html', function() {
					$('.right-main').attr('data', modl_ids);
				});
				$(".context-menu").remove();
			} else if(fareth === "SelfDefinedFeature") {
				console.log(tablename)
				$('#index_right').html('');
				$('#index_right').load('SelfDefinedFeature.html', function() {
					$('.right-main').attr('data', modl_ids);
					if(tablename === 'undefined' || tablename === undefined) {
						$('.c-csv-again').hide();
					} else {
						$('.files_name').text(tablename)
						$('.files_name ').removeClass('img_upload');
						$('.c-csv-again').addClass('img_upload').show();
						$('.c-csv').attr('id', '').addClass('c-csv-active');
						$('.files_name').next().addClass('c-csv-icon');
						$('.edit_fields').css('display', 'block');
					}

				});
				$(".context-menu").remove();
			} else if(fareth === "combination") {
				$('#index_right').html('');
				$('#index_right').load('combination.html', function() {
					$('.right-main').attr('data', modl_ids);
					$('.right-main').attr('souid', souids);
				});
				$(".context-menu").remove();
			}else if(fareth === "exported") {
				$('#index_right').html('');
				
				for(var i=0;i<$(".learn").length;i++){
					if($(".learn").eq(i).attr('compid')===souids){
						if($(".learn").eq(i).attr('status')==='SUCCEEDED'){
							$('#index_right').load('exported.html', function() {
								$('.right-main').attr('data', modl_ids);
								$('.right-main').attr('souid', souids);
							});
						}else{
							alert('learn组件为执行成功')
						}
					}else{
						alert('未连接learn组件')
					}
				}
				$(".context-menu").remove();
			};
		} else if($(this).find('.context-menu-text').text() == '删除') {
			var modl_id = modl_idss;
			removeElement(modl_id);
			$(".context-menu").remove();
		}else if($(this).find('.context-menu-text').text() == '数据预览'){
            if(fareth==='hive'){
                $(".context-menu").remove();
                window.open('../h5wf/report_old.html?project_id=' + proid + '&component_id=' + modl_ids)
		    }else if(fareth==='robotx_spark'){

                if(status=="SUCCEEDED"){
                    $(".context-menu").remove();
                    window.open('../h5wf/report.html?project_id=' + proid + '&component_id=' + modl_ids)
                }else{
                    // $(this).find('.context-menu-text').parent().addClass("failed");
                    $(this).find('.context-menu-text').parent().css("background-color","red");
                    $(".context-menu").remove();
                    layer.msg('该任务未执行完');
                }
		    }else if(fareth==='SelfDefinedFeature'){
                $(".context-menu").remove();
                window.open('../h5wf/report_old.html?project_id=' + proid + '&component_id=' + modl_ids)
			}
		}else if($(this).find('.context-menu-text').text() == '查看报告') {
			if(fareth==='learn'){
                if(status=="SUCCEEDED"){
                    $(".context-menu").remove();
                    window.open('../h5wf/learnRerport.html?project_id=' + proid + '&component_id=' + modl_ids)
                }else{
                    // $(this).find('.context-menu-text').parent().addClass("failed");
                    $(this).find('.context-menu-text').parent().css("background-color","red");
                    $(".context-menu").remove();
                    layer.msg('该任务未执行完');
				}
			}else if(fareth==='act'){
                if(status=="SUCCEEDED"){
                    $(".context-menu").remove();
					window.open('../h5wf/actReport.html?project_id=' + proid + '&component_id=' + modl_ids)
                }else{
                    $(".context-menu").remove();
                    $(this).find('.context-menu-text').parent().css("background-color","red");
                    // $(this).find('.context-menu-text').parent().addClass("failed");
                    layer.msg('该任务未执行完');
                }
			}else if(fareth==='test'){
                if(status=="SUCCEEDED"){
                    $(".context-menu").remove();
					window.open('../h5wf/testReport.html?project_id=' + proid + '&component_id=' + modl_ids)
                }else{
                    $(".context-menu").remove();
                    // $(this).find('.context-menu-text').parent().addClass("failed");
                    $(this).find('.context-menu-text').parent().css("background-color","red");
                    layer.msg('该任务未执行完');
                }
			}else if(fareth==='combination'){
				$(".context-menu").remove();
				window.open('../h5wf/report.html?project_id=' + proid + '&component_id=' + modl_ids)
			}

		} else if($(this).find('.context-menu-text').text() == '下载') {
			$(".context-menu").remove();
			window.open(robotXdwon_ajax + '?projectID=' + proid + '&componentID=' + modl_ids + '');
		} else if($(this).find('.context-menu-text').text() == '执行') {
			$("#executor_button").show();
			ImplementFn('SING_EXECUTION', modl_ids)
		}else if($(this).find('.context-menu-text').text() == '下载生成字典'){
			if(status=="SUCCEEDED"){
                $(".context-menu").remove();
                window.open(server + '/robotx_spark/download_dict?project_id=' + proid + '&component_id=' + modl_ids)
//              location.href = server + '/robotx_spark/download_dict?project_id=' + proid + '&component_id=' + modl_ids
            }else{
                // $(this).find('.context-menu-text').parent().addClass("failed");
                $(this).find('.context-menu-text').parent().css("background-color","red");
                $(".context-menu").remove();
                layer.msg('该任务未执行完');
            }
			
		}else if($(this).find('.context-menu-text').text() == '导出'){
			if(status=="SUCCEEDED"){
                $(".context-menu").remove();
               window.open(server + '/deploy/export?project_id=' + proid + '&component_id=' + modl_ids)
           }else{
                $(this).find('.context-menu-text').parent().css("background-color","red");
                $(".context-menu").remove();
                layer.msg('该任务未执行完');
            }
			
		};
	});

});
/**
 * 设置左边菜单
 * @param Data
 */
function setLeftMenu() {

	//拖拽设置
	var compid = '';
	$(".leftMenu li").draggable({
		helper: "clone",
		scope: "plant"
	});
	//画布  plant连接标签与画布
	$("#container").droppable({
		scope: "plant",
		drop: function(event, ui) {
			//      	ui包括被托拽的原标签，以及画布中的位置
			var compid = '';
			$.ajax({
				type: 'post',
				url: server + '/component/get_id?' + timeStamp,
				async: false,
				data: {
					project_id: proid,
					component_type: ui.draggable.attr("name"),
				},
				success: function(data) {
					function success() {
						compid = dataBack(data).detail;
					};
					backInfo(data, success)

				},
				error: function(data) {
					layer.msg('接口请求失败');
				}
			})
			//与下面函数相关联
			CreateModel(ui, $(this), compid);
			instance.repaintEverything();
		}
	});
}
/**
 * 添加模型
 * @param ui
 * @param selector
 */
function CreateModel(ui, selector, compid) {
	//获取组件id
	var modelId = ui.draggable.attr("id");
	var id = modelId + "_model_" + Math.floor(Math.random() * 9000) + 1000;
	//  var ids = modelId + "_model_" + compid;
	//获取组件类型
	var type = ui.draggable.attr("type");
	var iconEle = '<label id="running">执行中</label>' +
		'<label id="pending">等待执行</label>' +
		'<div class="proess-show-go"></div>' +
		'<div class="proess-show-pending"></div>' +
		'</div>' +
		'<div class="proesss" style="display:none;">' +
		'<div class="proess-show-ok"></div>' +
		'</div></div><div class="assembly_tab"><img src="img/icon_fail.png" /></div></div>';
	if(type == 'hive') {
		$(selector).append('<div class="hive model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="">' +
			'<img class="content-img" src="img/type.service.png" />' +
			'<span class="content-text">HiveReader' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="assembly_tab"><img src="img/icon_fail.png" /></div>' +
			'</div>');
	} else if(type == 'SelfDefinedFeature') {
		$(selector).append('<div class="SelfDefinedFeature model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="">' +
			'<img class="content-img" src="img/type.service.png" />' +
			'<span class="content-text">csv自定义特征' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="assembly_tab"><img src="img/icon_fail.png" /></div>' +
			'</div>');
	} else if(type == 'robotx_spark') {
		$(selector).append('<div class="robotx_spark model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="">' +
			'<img class="content-img" src="img/type.business.rule.png" />' +
			'<span class="content-text">RobotxSpark' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="proess_bj" style="display:none;">' +
			'<div class="proess" style="display:none;">' +
			iconEle);
	} else if(type == 'combination') {
		$(selector).append('<div class="combination model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="">' +
			'<img class="content-img" src="img/type.business.rule.png" />' +
			'<span class="content-text">特征组合' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="proess_bj" style="display:none;">' +
			'<div class="proess" style="display:none;">' +
			iconEle);
	} else if(type == 'learn') {
		$(selector).append('<div class="learn model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="" >' +
			'<img class="content-img" src="img/type.learn.png" />' +
			'<span class="content-text">Atom建模学习' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="proess_bj" style="display:none;">' +
			'<div class="proess" style="display:none;">' +
			iconEle);
	} else if(type == 'act') {
		$(selector).append('<div class="act model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="">' +
			'<img class="content-img" src="img/type.act.png" />' +
			'<span class="content-text">Atom建模预测' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="proess_bj" style="display:none;">' +
			'<div class="proess" style="display:none;">' +
			iconEle);
	} else if(type == 'test') {
		$(selector).append('<div class="test model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="">' +
			'<img class="content-img" src="img/type.test.png" />' +
			'<span class="content-text">Atom建模测试' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="proess_bj" style="display:none;">' +
			'<div class="proess" style="display:none;">' +
			iconEle);
	}else if(type == 'exported') {
		$(selector).append('<div class="exported model jtk-endpoint-anchor ui-draggable ui-draggable-handle jtk-connected jtk-draggable" compid= "' + compid + '" id="' + id +
			'" modelType="' + type + '" souid="">' +
			'<img class="content-img" src="img/type.test.png" />' +
			'<span class="content-text">导出模型' + compid.replace(/[^0-9]/ig, "") + '</span>' +
			'<div class="proess_bj" style="display:none;">' +
			'<div class="proess" style="display:none;">' 
			);
	};
	var left = parseInt(ui.offset.left - $(selector).offset().left + 272);
	var top = parseInt(ui.offset.top - $(selector).offset().top + 48);
	$("#" + id).css("position", "absolute").css("left", left).css("top", top);
	//让csv类似组件不可作为连接终点
	if(id.substring(0, 4) === 'hive' || id.substring(0, 18) === "SelfDefinedFeature") {
		//添加连接点
		instance.addEndpoint(id, {
			anchors: "RightMiddle"
		}, hollowCircle_none_end);
		instance.addEndpoint(id, {
			anchors: "LeftMiddle"
		}, hollowCircle_none_end);
		instance.addEndpoint(id, {
			anchors: "TopCenter"
		}, hollowCircle_none_end);
		instance.addEndpoint(id, {
			anchors: "BottomCenter"
		}, hollowCircle_none_end);
	} else {
		//添加连接点
		instance.addEndpoint(id, {
			anchors: "RightMiddle"
		}, hollowCircle);
		instance.addEndpoint(id, {
			anchors: "LeftMiddle"
		}, hollowCircle);
		instance.addEndpoint(id, {
			anchors: "TopCenter"
		}, hollowCircle);
		instance.addEndpoint(id, {
			anchors: "BottomCenter"
		}, hollowCircle);
	}

	//注册实体可draggable
	instance.repaintEverything();
	$("#" + id).draggable({
		containment: "parent",
		drag: function(event, ui) {
			instance.repaintEverything();
		},
		stop: function() {
			instance.repaintEverything();
		}

	});

}
//删除节点
function removeElement(obj) {
	var element = $('#' + obj + '');
	layer.confirm('确定删除该模型？', {
		btn: ['确定', '取消'] //按钮
	}, function() {
		var _this_commpid = element.attr("compid"),
			_this_commpid_length = $(document).find(".model").length;
		$.ajax({
			type: 'post',
			url: server + '/component/delete',
			data: {
				project_id: proid,
				component_id: _this_commpid
			},
            beforeSend:function(){
                $(".img_load").show();
			},
			success: function(data) {
				function success() {
					var datas = dataBack(data);
					if(datas.detail === null) {
						layer.alert('删除成功', {
							icon: 1,
							title: '提示'
						});
                        $(".img_load").hide();
						for(var i = 0; i < _this_commpid_length; i++) {
							var _this_commpids = $(document).find(".model").eq(i).attr("souid");
							if(_this_commpids == undefined) {
								_this_commpids = '';
							};
							if(-1 != _this_commpids.indexOf(_this_commpid)) {
								var right = "," + _this_commpid,
									left = _this_commpid + ",";
								if(-1 != _this_commpids.indexOf(right) && -1 != _this_commpids.indexOf(left)) {
									var _this_commpidss = _this_commpids.replace("," + _this_commpid, "");
									$(document).find(".model").eq(i).attr("souid", _this_commpidss)
								} else if(-1 != _this_commpids.indexOf(right) && -1 == _this_commpids.indexOf(left)) {
									var _this_commpidss = _this_commpids.replace("," + _this_commpid, "");
									$(document).find(".model").eq(i).attr("souid", _this_commpidss)
								} else if(-1 == _this_commpids.indexOf(right) && -1 != _this_commpids.indexOf(left)) {
									var _this_commpidss = _this_commpids.replace(_this_commpid + ",", "");
									$(document).find(".model").eq(i).attr("souid", _this_commpidss)
								} else if(-1 == _this_commpids.indexOf(right) && -1 == _this_commpids.indexOf(left)) {
									var _this_commpidss = _this_commpids.replace(_this_commpid, "");
									$(document).find(".model").eq(i).attr("souid", _this_commpidss)
								};
							}
						}
						instance.remove(element);
					}
				}
				backInfo(data, success)
			}
		})
	});

}
//显示右侧栏
//test 保留序列数据
function save() {
	//线
	var list = instance.getAllConnections();
	var connects = [];
	$.each(instance.getAllConnections(), function(idx, connection) {
		connects.push({
			ConnectionId: connection.id,
			PageSourceId: connection.sourceId, //连线起点块级元素ID
			PageTargetId: connection.targetId, //连线终点块级元素ID
			PageSourceIds: $(connection.source).attr('compid'),
			PageTargetIds: $(connection.target).attr('compid'),
			SourceText: connection.source.innerText,
			TargetText: connection.target.innerText,
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
	//保存组件
	var blocks = [];
	$(".model").each(function(idx, elem) {
		var $elem = $(elem);
		var BlockNames = '';
		var BlockSouids = '';
		if($elem.hasClass('hive') || $elem.hasClass('SelfDefinedFeature')) {
			BlockNames = $elem.attr('tableName')
		} else {
			BlockSouids = $elem.attr('souid')
		}
		blocks.push({
			BlockIdd: $elem.attr('id'),
			BlockId: $elem.attr('compid'),
			BlockType: $elem.attr('modeltype'),
			BlockContent: $elem.html(),
			BlockName: BlockNames,
			BlockSouid: BlockSouids,
			BlockX: parseInt($elem.css("left"), 10),
			BlockY: parseInt($elem.css("top"), 10),
		});

	});
	//将组件与线添加到对象中
	var serliza = "{" + '"connects":' + JSON.stringify(connects) + ',"block":' + JSON.stringify(blocks) + "}";
	var serliza_fo = JSON.parse(serliza);
	var dist_xml = '';
	var xml_del = [];
	//对操作区已有组件进行遍历
	function Block(serliza_fo, name) {
		var str = '<step>' +
			'<name>' + serliza_fo.BlockIdd + '</name>' +
			'<type>' + serliza_fo.BlockType + '</type>' +
			'<description/>' +
			'<GUI>' +
			'<xloc>' + serliza_fo.BlockX + '</xloc>' +
			'<yloc>' + serliza_fo.BlockY + '</yloc>' +
			'</GUI>' +
			'</step>' +
			'</' + name + '>';
		if(name === 'HiveReader' || name === 'SelfDefinedFeature') {
			return '<' + name + ' componentID="' + serliza_fo.BlockId + '" type="' + serliza_fo.BlockType + '" tableName="' + serliza_fo.BlockName + '">' + str

		} else {
			return '<' + name + ' componentID="' + serliza_fo.BlockId + '" type="' + serliza_fo.BlockType + '" souid="' + serliza_fo.BlockSouid + '">' + str
		}
	};
	for(var i = 0; i < serliza_fo.block.length; i++) {
		if(serliza_fo.block[i].BlockType == 'hive') {
			var str = Block(serliza_fo.block[i], 'HiveReader')
			dist_xml = dist_xml + str;
		} else if(serliza_fo.block[i].BlockType == 'SelfDefinedFeature') {
			var str = Block(serliza_fo.block[i], 'SelfDefinedFeature');
			dist_xml = dist_xml + str;
		} else if(serliza_fo.block[i].BlockType == 'combination') {
			var str = Block(serliza_fo.block[i], 'Combination');
			dist_xml = dist_xml + str;
		} else if(serliza_fo.block[i].BlockType == 'robotx_spark') {
			var str = Block(serliza_fo.block[i], 'RobotXSpark');
			dist_xml = dist_xml + str;
		} else if(serliza_fo.block[i].BlockType === 'learn') {
			var str = Block(serliza_fo.block[i], 'AtomLearn');
			dist_xml = dist_xml + str;

		} else if(serliza_fo.block[i].BlockType === 'act') {
			var str = Block(serliza_fo.block[i], 'AtomAct');
			dist_xml = dist_xml + str;

		} else if(serliza_fo.block[i].BlockType === 'test') {
			var str = Block(serliza_fo.block[i], 'AtomAct');
			dist_xml = dist_xml + str;

		} else if(serliza_fo.block[i].BlockType === 'exported') {
			var str = Block(serliza_fo.block[i], 'ExportModel');
			dist_xml = dist_xml + str;

		}

	};
	var data_frederick = '';
	//保存完之后直接刷新页面，连线存在
	for(var i = 0; i < serliza_fo.connects.length; i++) {
		//连线数据拼接
		var str_xml_lin = '';
		if(xml_del.length == 0) {
			str_xml_lin = '<sequenceFlow  id="' + serliza_fo.connects[i].ConnectionId + '" name="' + serliza_fo.connects[i].ConnectionId + '" sourceRef="' + serliza_fo.connects[i].PageSourceId + '"  targetRef="' + serliza_fo.connects[i].PageTargetId + '"  anchors_1="' + serliza_fo.connects[i].anchors[0] + '" anchors_2="' + serliza_fo.connects[i].anchors[1] + '" sourceRefs="' + serliza_fo.connects[i].PageSourceIds + '" targetRefs="' + serliza_fo.connects[i].PageTargetIds + '" ></sequenceFlow>';
		} else {
			for(var u = 0; u < xml_del.length; u++) {
				//				if(xml_del[u] != serliza_fo.connects[i].PageSourceIds && xml_del[u] != serliza_fo.connects[i].PageTargetIds && serliza_fo.connects[i].PageSourceIds != 'replace' && serliza_fo.connects[i].PageTargetIds != 'replace') {
				str_xml_lin = '<sequenceFlow  id="' + serliza_fo.connects[i].ConnectionId + '" name="' + serliza_fo.connects[i].ConnectionId + '" sourceRef="' + serliza_fo.connects[i].PageSourceId + '"  targetRef="' + serliza_fo.connects[i].PageTargetId + '"  anchors_1="' + serliza_fo.connects[i].anchors[0] + '" anchors_2="' + serliza_fo.connects[i].anchors[1] + '" sourceRefs="' + serliza_fo.connects[i].PageSourceIds + '" targetRefs="' + serliza_fo.connects[i].PageTargetIds + '" ></sequenceFlow>';
				//				} else {
				//					serliza_fo.connects[i].PageSourceIds = 'replace';
				//					serliza_fo.connects[i].PageTargetIds = 'replace';
				//					for(var v = 0; v < serliza_fo.connects.length; v++) {
				//						if(serliza_fo.connects[v].PageSourceIds == xml_del[u] || serliza_fo.connects[v].PageTargetIds == xml_del[u]) {
				//							serliza_fo.connects[v].PageSourceIds = 'replace';
				//							serliza_fo.connects[v].PageSourceIds = 'replace';
				//						}
				//
				//					}
				//				};
			};
		}
		dist_xml = dist_xml + str_xml_lin;
	};
	//最后完整的xml
	dist_final_xml = '<process  id="process1492584165209" name="process1492584165209">' + dist_xml + '</process>';
	$('#data_val').attr('data', dist_xml);
	if(dist_xml == '') {
		layer.msg('内容为空。');
		return false;
	};
	//保存robotx组件操作区
	//  robotx_xml = "{" + '"robotx_one":' + sessionStorage.getItem('robotx_one') + ',"robotx_two":' + sessionStorage.getItem('robotx_two') +',"robotx_spark_one":'+sessionStorage.getItem('robotx_spark_one')+',"robotx_spark_two":'+sessionStorage.getItem('robotx_spark_two')+ "}";
	

};

//执行调用方法
function ImplementFn(status, executeId) {
	save();
	$.ajax({
		type: 'post',
		url: server + '/executor/execute?' + timeStamp,
		data: {
			project_id: proid,
			xml: dist_final_xml,
			execution_type: status,
			execute_id: executeId,
		},
		success: function(data) {
			function success() {
				var datas = dataBack(data).detail;
				if(datas === null) {
					alert('没有需要执行的组件')
				} else {
					layer.alert('任务提交成功！', {
						icon: 1,
						title: '提示'
					});
					$('#shadowBody').show();
					Timed_Access(datas);
					timer = window.setInterval(function() {
						Timed_Access(datas)
					}, 10000);

				}
			};
			backInfo(data, success)
		},
		error: function() {
			layer.msg('接口请求失败');
		}
	});

};
//执行过程中查询状态
function executor(arr) {
	if(arr.start_time === null) {
		arr.start_time = '无'
	} else {
		arr.start_time = arr.start_time.replace(/-/g, '/')
	}
	if(arr.end_time === null) {
		arr.end_time = '无'
	} else {
		arr.end_time = arr.end_time.replace(/-/g, '/')
	}
	if(arr.error_code === null) {
		arr.error_code = '无'
	}
	if(arr.has_log === false || arr.has_log === null) {
		arr.has_log = '无'
	} else {
		arr.has_log = '<a >查看明细</a>'
	}
	if(arr.detail === null) {
		arr.detail = '无'
	} else {
		if(arr.detail.length > 34) {
			arr.detail = arr.detail + '<span>>></span>'
		} else {
			arr.detail = arr.detail
		}

	}
	if(arr.task_status === "RUNNING" && arr.application_id !== null) {
		$("#stop_button").show();
		app_id = arr.application_id
	}
	$("#executor_list").append(
		'<li>' +
		'<ul>' +
		'<li class="componentsName">' + arr.component_id + '</li>' +
		'<li class="componentsStatus">' + arr.task_status + '</li>' +
		'<li class="startTime">' + arr.start_time + '</li>' +
		'<li class="endTime">' + arr.end_time + '</li>' +
		'<li class="error_code">' + arr.error_code + '</li>' +
		'<li class="detail_info">' + arr.detail + '</li>' +
		'<li class="detail_log">' + arr.has_log + '</li>' +
		'</ul>' +
		'</li>'
	);
	//点击查看详细信息
	$(".detail_info").on('click', 'span', function() {
		var texts = $(this).parent().text().replace(/\n/g, '<br>')
		texts = texts.substring(0, texts.length - 2)
		$('#detail_two').html(texts);
		$("#detail").fadeIn();
	});

}
//停止执行
$("#stop_button").click(function() {
	$.ajax({
		type: 'get',
		url: server + '/executor/stop_all',
		data: {
			project_id: proid
		},
		success: function(data) {
			function success() {
				var datas = dataBack(data).detail;
				if(datas===null){
					layer.alert('停止成功，稍后会显示在页面中', {
						icon: 1,
						title: '提示'
					});	
				}
				$("#stop_button").hide()
			};
			backInfo(data, success)
		}
	})
})
//点击关闭详细信息
$("#close_new").click(function() {
	$("#detail").fadeOut();
})
//点击查看明细log
$("#executor_list").on('click', 'a', function() {
	var modl_ids = $(this).parent().parent().find('.componentsName').text();
	window.open('../h5wf/log.html?project_id=' + proid + '&component_id=' + modl_ids)
})
//查询状态接口
function Timed_Access(TaskId) {
// statusShow = false;
	var ssstr = '';
	$.ajax({
		url: server + '/executor/status',
		type: "get",
		data: {
			project_id: proid,
			task_id: TaskId
		},
		success: function(data) {
			function success() {
				$('#shadowBody').show();
				$("#executor_list>li").not(':first-child').remove();
				var datas = dataBack(data).detail;
				failedExit = false;
				for(var i = 0; i < datas.detail.length; i++) {
					Timed_Access_Result(datas.detail[i].task_status, datas.detail[i].component_id)
					executor(datas.detail[i])
				};
				shadowShow = false;
				if(datas.status == 'SUCCEEDED') {
					layer.confirm('任务执行完毕！', {
						btn: '确定' //按钮
					},function(){
						layer.closeAll();
					});
					window.clearInterval(timer);
					
						$('#shadowBody').hide();
						
					
					$("#stop_button").hide()
				} else if(datas.status == 'FAILED') {
					layer.confirm('任务执行失败！', {


						btn: '确定' //按钮
					}, function() {
						layer.closeAll();
					});
					window.clearInterval(timer);
					$('#shadowBody').hide();
					$("#stop_button").hide()
//					
				}
			};
			backInfo(data, success)

		},
		error: function() {
			layer.msg('接口请求失败');
		}
	});
};
////查看正在执行时候的状态

$("#executor_button").click(function() {
	clickNum++
	if(clickNum % 2 !== 0) {
		$('#executor').fadeIn()
//		$("#shadowBody").show()
		$(this).css('background', '#9DD7EA')
//		statusShow = true
	} else {
//		statusShow = false;
//		if(shadowShow === true) {
//			$("#shadowBody").hide()
//		}
		$('#executor').fadeOut()
		$("#executor_button").css('background', '#3cf')
	}

})
$("#executor_button").dblclick(function() {
	return
})
$("#close").click(function() {
	clickNum = 0
	
//		$("#shadowBody").hide()
	
	$('#executor').fadeOut()
	$("#executor_button").css('background', '#3cf')
})
//任务执行结果
function Timed_Access_Result(taskStatus, key) {
	var container_item = $('#container').children('.model');
	for(var i = 0; i < container_item.length; i++) {
		if(key == container_item.eq(i).attr('compid')) {
			container_item.eq(i).children('.proess_bj').css('opacity', '0.85').css('background', '#fff').show();
			container_item.eq(i).children('.proess_bj').children('.proess').find('.proess-show-go').show();
			container_item.eq(i).children('.proess_bj').children('.proess').find('.proess-show-pending').hide();
			container_item.eq(i).children('.proess_bj').children('.proess').find('#running').show();
			container_item.eq(i).children('.proess_bj').children('.proess').find('#pending').hide();
			container_item.eq(i).children('.proess_bj').children('.proess').show();
			container_item.eq(i).find('.proess_bj').find('.proesss').hide();
			container_item.eq(i).find('.assembly_tab').hide();

            container_item.eq(i).children('.context-menu-item').eq(2).css("background-color","red");
		};
	};
	if(taskStatus === "SUCCEEDED") {
//		if(failedExit === false) {
			for(var i = 0; i < container_item.length; i++) {
				if(key == container_item.eq(i).attr('compid')) {
                    container_item.eq(i).attr('status',taskStatus);
                    container_item.eq(i).children('.context-menu-item').eq(2).css("background","#fff");
					container_item.eq(i).find('.proess_bj').find('.proess').hide();
					container_item.eq(i).find('.proess_bj').find('.proesss').show();
					container_item.eq(i).find('.proess_bj').css({
						'opacity': 1,
						'background': 'none'
					});
				};
			};
//		}

} else if(taskStatus === 'KILLED') {
		failedExit = true;
		for(var i = 0; i < container_item.length; i++) {
			if(key == container_item.eq(i).attr('compid')) {
				container_item.eq(i).find('.proess_bj').css('opacity', '0');
				container_item.eq(i).find(".assembly_tab").find('img').attr('src', 'img/icon_stop.png')
				container_item.eq(i).find(".assembly_tab").show();


			};
		};
} else if(taskStatus === 'FAILED') {
		failedExit = true;
		for(var i = 0; i < container_item.length; i++) {
			if(key == container_item.eq(i).attr('compid')) {
				container_item.eq(i).find('.proess_bj').css('opacity', '0');
				container_item.eq(i).find(".assembly_tab").show();
			};
		};

	} else if(taskStatus === 'PENDING') {
//		if(failedExit === false) {
			for(var i = 0; i < container_item.length; i++) {
				if(key == container_item.eq(i).attr('compid')) {
					container_item.eq(i).children('.proess_bj').css('opacity', '0.85').css('background', '#fff').show();
					container_item.eq(i).children('.proess_bj').children('.proess').find('.proess-show-go').hide();
					container_item.eq(i).children('.proess_bj').children('.proess').find('.proess-show-pending').show();
					container_item.eq(i).children('.proess_bj').children('.proess').find('#running').hide();
					container_item.eq(i).children('.proess_bj').children('.proess').find('#pending').show();
					container_item.eq(i).children('.proess_bj').children('.proess').show();
					container_item.eq(i).find('.proess_bj').find('.proesss').hide();
					container_item.eq(i).find('.assembly_tab').hide();
				}
			}
//		} else {
//			for(var i = 0; i < container_item.length; i++) {
//				if(key == container_item.eq(i).attr('compid')) {
//					container_item.eq(i).find('.proess_bj').css({
//						'opacity': 0,
//						'background': '#fff'
//					});
//				}
//			}
//		}

	}

}

//从json数据导入流程图
function loadJson() {
	var blockss = [];
	var connectss = [];
	var datas = [];
	var final_data = '';
	getNewDate(server + '/xml/load?' + timeStamp, "post", true, {
		project_id: proid
	}).then(function(data) {
		if(data.detail != undefined) {
			var data = data.detail;
			//判断是否为读取组件，如果是则选择拼接
			//获取模块

			$(data).find('HiveReader').each(function() {
				//组件componentid
				var h_BlockId = $(this).attr('componentID');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockTypes = $(this).find('type')[0].innerHTML;
				//组件类型
				//                  var h_BlockType = h_BlockTypes.substring(0, h_BlockTypes.length - 6);
				//组件横坐标
				var h_xloc = $(this).find('xloc').text();
				//组件纵坐标
				var h_yloc = $(this).find('yloc').text();
				var h_tableName = $(this).attr('tableName');
				blockss.push({
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockTypes,
					BlockX: h_xloc,
					BlockY: h_yloc,
					BlockName: h_tableName,
				});
			});
			$(data).find('SelfDefinedFeature').each(function() {
				//组件componentid
				var h_BlockId = $(this).attr('componentID');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockTypes = $(this).find('type')[0].innerHTML;
				//组件类型
				//                  var h_BlockType = h_BlockTypes.substring(0, h_BlockTypes.length - 6);
				//组件横坐标
				var h_xloc = $(this).find('xloc').text();
				//组件纵坐标
				var h_yloc = $(this).find('yloc').text();
				var h_tableName = $(this).attr('tableName');
				blockss.push({
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockTypes,
					BlockX: h_xloc,
					BlockY: h_yloc,
					BlockName: h_tableName,
				});
			});

			$(data).find('RobotXSpark').each(function() {
				var h_BlockId = $(this).attr('componentID');
				var data_load_souid = $(this).attr('souid');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockType = $(this).attr('type');
				var h_xloc = $(this).find('xloc').text();
				var h_yloc = $(this).find('yloc').text();
				blockss.push({
					souid: data_load_souid,
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockType,
					BlockX: h_xloc,
					BlockY: h_yloc
				});
			});
			$(data).find('Combination').each(function() {
				var h_BlockId = $(this).attr('componentID');
				var data_load_souid = $(this).attr('souid');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockType = $(this).attr('type');
				var h_xloc = $(this).find('xloc').text();
				var h_yloc = $(this).find('yloc').text();
				blockss.push({
					souid: data_load_souid,
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockType,
					BlockX: h_xloc,
					BlockY: h_yloc
				});
			});
			$(data).find('AtomLearn').each(function() {
				var h_BlockId = $(this).attr('componentID');
				var data_load_souid = $(this).attr('souid');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockType = $(this).attr('type');
				var h_xloc = $(this).find('xloc').text();
				var h_yloc = $(this).find('yloc').text();
				blockss.push({
					souid: data_load_souid,
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockType,
					BlockX: h_xloc,
					BlockY: h_yloc
				});
			});
			$(data).find('AtomAct').each(function() {
				var h_BlockId = $(this).attr('componentID');
				var data_load_souid = $(this).attr('souid');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockType = $(this).attr('type');
				var h_xloc = $(this).find('xloc').text();
				var h_yloc = $(this).find('yloc').text();
				blockss.push({
					souid: data_load_souid,
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockType,
					BlockX: h_xloc,
					BlockY: h_yloc
				});
			});
			$(data).find('AtomTest').each(function() {
				var h_BlockId = $(this).attr('componentID');
				var data_load_souid = $(this).attr('souid');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockType = $(this).attr('type');
				var h_xloc = $(this).find('xloc').text();
				var h_yloc = $(this).find('yloc').text();
				blockss.push({
					souid: data_load_souid,
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockType,
					BlockX: h_xloc,
					BlockY: h_yloc
				});
			});
			$(data).find('ExportModel').each(function() {
				var h_BlockId = $(this).attr('componentID');
				var data_load_souid = $(this).attr('souid');
				var h_BlockIdds = $(this).find('name').text();
				var h_BlockType = $(this).attr('type');
				var h_xloc = $(this).find('xloc').text();
				var h_yloc = $(this).find('yloc').text();
				blockss.push({
					souid: data_load_souid,
					BlockIdd: h_BlockIdds,
					BlockId: h_BlockId,
					BlockType: h_BlockType,
					BlockX: h_xloc,
					BlockY: h_yloc
				});
			});
			//获取模块中的连线
			$(data).find('sequenceFlow').each(function(i) {
				var ConnectionId = $(this).attr('id');

				var PageSourceId = $(this).attr('sourceRef');
				var PageTargetId = $(this).attr('targetRef');
				var anchors = [
					[$(this).attr('anchors_1')],
					[$(this).attr('anchors_2')]
				];
				connectss.push({
					ConnectionId: ConnectionId,
					PageSourceId: PageSourceId, //连线起点块级元素ID
					PageTargetId: PageTargetId, //连线终点块级元素ID
					anchors: anchors
				});
			});
			//获取模块中的数据

		};
		final_data = "{" + '"connects":' + JSON.stringify(connectss) + ', "block":' + JSON.stringify(blockss) + "}";
		var unpack = JSON.parse(final_data);
		if(!unpack) {
			return false;
		};
		if(unpack.block.length == 0) {
			return false;
		};
		//对组件进行渲染
		var iconEle = '<label id="running">执行中</label>' +
			'<label id="pending">等待执行</label>' +
			'<div class="proess-show-go"></div>' +
			'<div class="proess-show-pending"></div>' +
			'</div>' +
			'<div class="proesss" style="display:none;">' +
			'<div class="proess-show-ok"></div>' +
			'</div></div><div class="assembly_tab"><img src="img/icon_fail.png" /></div></div>';
		for(var i = 0; i < unpack['block'].length; i++) {
			var BlockId = unpack['block'][i]['BlockId'];
			var BlockIdd = unpack['block'][i]['BlockIdd'];
			var BlockX = unpack['block'][i]['BlockX'];
			var BlockY = unpack['block'][i]['BlockY'];
			var BlockType = unpack['block'][i]['BlockType'];
			var Souids = unpack['block'][i]['souid'];
			if(BlockType == 'hive') {

				var htmlText = '<div class="model ' + BlockType + ' " style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '" tableName=' + unpack['block'][i].BlockName + '  ><img class="content-img" src="img/type.service.png"><span class="content-text">HiveReader' + BlockId.replace(/[^0-9]/ig, "") + '</span> <div class="assembly_tab"><img src="img/icon_fail.png" /></div></div>';
				$('#container').append(htmlText);
			} else if(BlockType == 'SelfDefinedFeature') {

				var htmlText = '<div class="model ' + BlockType + ' " style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '" tableName=' + unpack['block'][i].BlockName + '  ><img class="content-img" src="img/type.service.png"><span class="content-text">csv自定义特征' + BlockId.replace(/[^0-9]/ig, "") + '</span> <div class="assembly_tab"><img src="img/icon_fail.png" /></div></div>';
				$('#container').append(htmlText);
			} else if(BlockType == 'robotx_spark') {
				var htmlText = '<div class="model ' + BlockType + '" style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '" souid="' + Souids + '" ><img class="content-img" src="img/type.business.rule.png" /><span class="content-text">RobotxSpark' + BlockId.replace(/[^0-9]/ig, "") + '</span><div class="proess_bj"><div class="proess" style="display:none;">' +
					iconEle
				$('#container').append(htmlText);
				$("." + BlockType).attr('souid', '');
			} else if(BlockType == 'combination') {
				var htmlText = '<div class="model ' + BlockType + '" style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '" souid="' + Souids + '" ><img class="content-img" src="img/type.business.rule.png" /><span class="content-text">特征组合' + BlockId.replace(/[^0-9]/ig, "") + '</span><div class="proess_bj"><div class="proess" style="display:none;">' +
					iconEle
				$('#container').append(htmlText);
				$("." + BlockType).attr('souid', '');
			} else if(BlockType == 'learn') {
				var htmlText = '<div class="model ' + BlockType + '" style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '" souid="' + Souids + '"  ><img class="content-img" src="img/type.learn.png"><span class="content-text">Atom建模学习' + BlockId.replace(/[^0-9]/ig, "") + '</span><div class="proess_bj"><div class="proess" style="display:none;">' +
					iconEle
				$('#container').append(htmlText);
				$("." + BlockType).attr('souid', '');
			} else if(BlockType == 'act') {
				var htmlText = '<div class="model ' + BlockType + '"  style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '" souid="' + Souids + '"  ><img class="content-img" src="img/type.act.png"><span class="content-text">Atom建模预测' + BlockId.replace(/[^0-9]/ig, "") + '</span><div class="proess_bj"><div class="proess" style="display:none;">' +
					iconEle
				$('#container').append(htmlText);
				$("." + BlockType).attr('souid', '');
			} else if(BlockType == 'test') {
				var htmlText = '<div class="model ' + BlockType + '" style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '"  souid="' + Souids + '" ><img class="content-img" src="img/type.test.png"><span class="content-text">Atom建模测试' + BlockId.replace(/[^0-9]/ig, "") + '</span><div class="proess_bj"><div class="proess" style="display:none;">' +
					iconEle
				$('#container').append(htmlText);
				$("." + BlockType).attr('souid', '');
			}else if(BlockType == 'exported') {
				var htmlText = '<div class="model ' + BlockType + '" style="position:absolute;left:' + BlockX + 'px;top:' + BlockY + 'px;" id="' + BlockIdd + '" modeltype="' + BlockType + '"     compid="' + BlockId + '"  souid="' + Souids + '" ><img class="content-img" src="img/type.test.png"><span class="content-text">导出模型' + BlockId.replace(/[^0-9]/ig, "") + '</span><div class="proess_bj"><div class="proess" style="display:none;">' +
					iconEle
				$('#container').append(htmlText);
				$("." + BlockType).attr('souid', '');
			};
			var g = true;
			for(var j = 0; j < unpack['connects'].length; j++) {
				var PageSourceId = unpack['connects'][j]['PageSourceId'];
				var PageTargetId = unpack['connects'][j]['PageTargetId'];
				if(BlockIdd != PageSourceId && BlockIdd != PageTargetId) {
					g = false;
				};
			};
			if(unpack['connects'].length == 0) {
				g = false;
			}
			if(g == false) {
				if(BlockIdd.substring(0, 4) === 'hive' || BlockIdd.substring(0, 18) === "SelfDefinedFeature") {
					instance.addEndpoint(BlockIdd, {
						anchors: "TopCenter"
					}, hollowCircle_none_end);
					instance.addEndpoint(BlockIdd, {
						anchors: "RightMiddle"
					}, hollowCircle_none_end);
					instance.addEndpoint(BlockIdd, {
						anchors: "BottomCenter"
					}, hollowCircle_none_end);
					instance.addEndpoint(BlockIdd, {
						anchors: "LeftMiddle"
					}, hollowCircle_none_end);
				} else {
					instance.addEndpoint(BlockIdd, {
						anchors: "TopCenter"
					}, hollowCircle);
					instance.addEndpoint(BlockIdd, {
						anchors: "RightMiddle"
					}, hollowCircle);
					instance.addEndpoint(BlockIdd, {
						anchors: "BottomCenter"
					}, hollowCircle);
					instance.addEndpoint(BlockIdd, {
						anchors: "LeftMiddle"
					}, hollowCircle);
				}

				instance.repaintEverything();
				instance.draggable(BlockIdd);
				$("#" + BlockIdd).draggable({
					containment: "parent",
					drag: function(event, ui) {
						instance.repaintEverything();
					},
					stop: function() {
						instance.repaintEverything();
					}
				});
			};
		};
		//对线进行渲染
		for(var j = 0; j < unpack['connects'].length; j++) {
			var final_anchors = [];
			var ConnectionId = unpack['connects'][j]['ConnectionId'];
			var PageSourceId = unpack['connects'][j]['PageSourceId'];
			var PageTargetId = unpack['connects'][j]['PageTargetId'];
			var d = unpack['connects'][j];
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
			instance.connect({
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
			if(PageSourceId.substring(0, 4) === 'hive' || PageSourceId.substring(0, 18) === "SelfDefinedFeature") {
				instance.addEndpoint(PageSourceId, {
					anchors: "TopCenter"
				}, hollowCircle_none_end);
				instance.addEndpoint(PageSourceId, {
					anchors: "RightMiddle"
				}, hollowCircle_none_end);
				instance.addEndpoint(PageSourceId, {
					anchors: "BottomCenter"
				}, hollowCircle_none_end);
				instance.addEndpoint(PageSourceId, {
					anchors: "LeftMiddle"
				}, hollowCircle_none_end)
			} else {
				instance.addEndpoint(PageSourceId, {
					anchors: "TopCenter"
				}, hollowCircle);
				instance.addEndpoint(PageSourceId, {
					anchors: "RightMiddle"
				}, hollowCircle);
				instance.addEndpoint(PageSourceId, {
					anchors: "BottomCenter"
				}, hollowCircle);
				instance.addEndpoint(PageSourceId, {
					anchors: "LeftMiddle"
				}, hollowCircle)
			};
			instance.addEndpoint(PageTargetId, {
				anchors: "TopCenter"
			}, hollowCircle);
			instance.addEndpoint(PageTargetId, {
				anchors: "RightMiddle"
			}, hollowCircle);
			instance.addEndpoint(PageTargetId, {
				anchors: "BottomCenter"
			}, hollowCircle);
			instance.addEndpoint(PageTargetId, {
				anchors: "LeftMiddle"
			}, hollowCircle);
			instance.repaintEverything();
			instance.draggable(PageSourceId);
			instance.draggable(PageTargetId);
			$("#" + PageSourceId).draggable({
				containment: "parent",
			}); //保证拖动不跨界
			$("#" + PageTargetId).draggable({
				containment: "parent",
			}); //保证拖动不跨界
			modelCounter = $('#container').children('.model').length;

		}
	});

};

//删除模型（键盘按键del）
$(document).keydown(function(event) {
	if(event.keyCode == 46) {
		removeElement(modl_id);
	} else {

	};
});

function save_load_gif(elem, type) {
	if(type == true) {
		$(elem).append('<img class="save-layer-gif" src="img/save_loading.gif" />');
		$(elem).text('保存中...');
	} else {
		$(elem).remove('.save-layer-gif');
		$(elem).text('保存');
	}
};
//确定关闭页面吗
window.onbeforeunload = function (e) {
e = e || window.event;
// 兼容IE8和Firefox 4之前的版本
if (e) {
//	console.log('999')
//	saveAjax();
//  e.returnValue = '是否需要保存已更改信息？';
    return '是否需要保存已更改信息？'
}
// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
//console.log('999')
	saveAjax();
return '是否需要保存已更改信息？';
};
