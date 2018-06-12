$(function() {
	var sample_num = 0;
	var n = 10;
	var return_data = null
	//        导出打分表响应事件
	$("#forecast_scoring").on("click", function() {
		location.href = server + '/atom_act/download_prediction' + window.location.search
	});
	//	获取数据
	$.ajax({
		type: 'get',
		url: server + '/atom_act/report' + window.location.search,
		async:false,
		success: function(data) {
			var datas = JSON.parse(data).detail;
			return_data=datas.ModelPredictionBIns
			sample_survey(datas);
			score_distribution(datas, n);
			var value = $("#Positive").val()
			PositiveSamples(datas.ModelPredictionBIns, value)
		}
	});
	//样本概况开始
	function sample_survey(data) {
		var datas = data['ModelPredictionBIns'];
		for(var i = 0; i < datas.length; i++) {
			sample_num += Number(datas[i].value);
		}
		$("#sample_num").html("样本数 : " + sample_num);
		sample_num = 0;

	}

	function score_distribution(data, n) {
		var datas = data['ModelPredictionBIns'];

		var score_distribution_label = []; //分的组数，数值
		var score_distribution_value = []; //每个区间的总人数
		var sxAxis = []; //每个区间百分比*100；
		for(var i = 0; i < n; i++) {
			score_distribution_label[i] = (i + 1) / n;
			score_distribution_value[i] = 0;

		}
		for(var i = 0; i < datas.length; i++) {
			var num = Number(datas[i].value);
			sample_num += num;
			var group = parseInt(i / n);
			score_distribution_value[group] += num;

		}
		for(var i = 0; i < n; i++) {
			var score_distribution_value_adv = ((score_distribution_value[i] / sample_num) * 100).toFixed(2);
			sxAxis.push(score_distribution_value_adv);

		}

		var myChart = echarts.init(document.getElementById('score_main'));
		var option = {
			tooltip : {
				 formatter: function (params) {
					var value = parseFloat(params.name)-0.1 
		            return '区间：'+value.toFixed(1)+'-'+parseFloat(params.name).toFixed(1)+'<br/>'+
		            '数值：'+parseFloat(params.value)+'%'
		        }
			},
			xAxis: {
				name:'分数区间',
//				type:'value',
//				boundaryGap: [0, 1],
				boundaryGap: [0, 1],
//              min:0,
//				 boundaryGap : false,
				data: score_distribution_label,
				splitLine: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#637a8f',
						width: 2
					}
				},
				axisTick: {
					length: 6,
					lineStyle: {
						width: 2,
						color: '#637a8f',
					}
				},
				axisLabel: {
					color: '#637a8f',
					margin: 10,
					 align:'left',
                    padding:[0,0,0,23]
				},
			},
			yAxis: {
				name:'占比',
				type: 'value',
				axisLabel: {
					show: true,
					interval: 'auto',
					formatter: '{value} %',
					color: '#637a8f',
					margin: 10
				},
				axisLine: {
					lineStyle: {
						color: '#637a8f',
						width: 2
					}
				},
				axisTick: {
					length: 6,
					lineStyle: {
						width: 2,
						color: '#637a8f',
					}
				},
				splitLine: {
					lineStyle: {
						color: ['#d6dde2']
					}
				}
			},
			series: [{
				type: 'bar',
				itemStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(
							0, 0, 0, 1, [{
									offset: 0,
									color: '#ff8199'
								},
								{
									offset: 0.5,
									color: '#ff9db1'
								},
								{
									offset: 1,
									color: '#ffb9c7'
								}
							]
						)
					},
				},
				data: sxAxis,
				barWidth: 55
			}]
		};
		myChart.setOption(option);
		//打分分布表结束
	}
	//input框输入输出
//	function sameCondition(value,data){
//		var length = value.toString().split('.')[1].length
//		if(length>2){
//			data.parent().next().text('保留两位小数')
//			data.parent().next().show()
//		}else{
//			data.parent().next().hide()
//			PositiveSamples(return_data,data.val())
//		}
//	}
	$("#Positive").on('input',function(){
		var value = parseFloat($(this).val())
		var min = parseFloat($("#min").text())
		var max = parseFloat($("#max").text())
		if($(this).val()!=''){
			if(value<=max && value>=min){
				var condition = /^[+-]?((0|([1-9]\d*))\.\d+)?$/  
				if(condition.test($(this).val())==false &&$(this).val()!=0 &&$(this).val()!=1){
					$(this).parent().next().text('不正确的格式')
					$(this).parent().next().show()
				}else{
					
					if($(this).val().indexOf('.')!=-1){
						console.log($(this).val())
						var length = $(this).val().split('.')[1].length
						if(length>2){
							$(this).parent().next().text('保留两位小数')
							$(this).parent().next().show()
						}else{
							$(this).parent().next().hide()
							PositiveSamples(return_data,$(this).val())
						}
					}else{
						if($(this).val()==1){
							PositiveSamples(return_data,'1.0')
						}else{
							PositiveSamples(return_data,'0.0')
							
						}

					}
				}
			}else{
				$(this).parent().next().text('请输入有效的阀值')
				$(this).parent().next().show()
			}
		}


		
	})
	function PositiveSamples(data, value) {
		$("#min").text(data[0].bin.split('-')[0])
		$("#max").text(data[data.length - 1].bin.split('-')[1])
		//正负样本量开始
		var min = []
		var max = []
		for(i in data) {
			if(parseFloat(data[i].bin.split('-')[1]) <= value) {
				min.push(parseInt(data[i].value))
			} else {
				max.push(parseInt(data[i].value))
			}
		}
		var min_value = eval(min.join("+"))
		var max_value = eval(max.join("+"))
		var datas_y=[]
		datas_y.push(min_value,max_value)
		var myChart2 = echarts.init(document.getElementById('pn_sample_size'));
		option = {
			color: ['#ffb46a'],
			tooltip: {
				 formatter: function (params) {
					return params.seriesName+'：'+params.data
		        }
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: ['0', '1'],
				axisTick: {
					alignWithLabel: true
				},
					axisLine: {
					lineStyle: {
						color: '#637a8f',
						width: 2
					}
				},
				axisTick: {
					show:false,
				},
				axisLabel: {
					color: '#637a8f',
					margin: 10
				},
			}],
			yAxis: [{
				type: 'value',
				splitLine: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#637a8f',
						width: 2
					}
				},
				axisTick: {
					length: 6,
					lineStyle: {
						width: 2,
						color: '#637a8f',
					}
				},
				axisLabel: {
					color: '#637a8f',
					margin: 10
				},
			}],
			series: [{
					name: '样本量',
					type: 'bar',
					barWidth: '60%',
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(
								0, 0, 0, 1, [{
										offset: 0,
										color: '#ffa247'
									},
									{
										offset: 0.5,
										color: '#ffb369'
									},
									{
										offset: 1,
										color: '#ffc389'
									}
								]
							)
						},
					},
					data: datas_y
				}

			]
		};
		myChart2.setOption(option);
		//正负样本量结束
	};
	//下载pdf文档
	$("#downloadpdf").click(function(){
		var url = window.location.search+'&threshold='+$("#Positive").val();
		
		window.open(server+'/atom_act/report_pdf'+url)
	})

});