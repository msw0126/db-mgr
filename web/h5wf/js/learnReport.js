$(function() {
	var return_data = null;
	var needArr = ['f1', 'f2', 'f0point5', 'accuracy', 'precision', 'recall', 'specificity']
	//交叉验证模型数据
	var jxyz = ['accuracy', 'auc', 'f0point5', 'f1', 'f2', 'logloss', 'mse', 'precision', 'r2', 'recall', 'rmse', 'specificity']
	
	var itemName = window.location.search.split('=')[2].substring(0,9);
	var postUrl = '';
	if(itemName=='AtomLearn'){
		postUrl = '/atom_learn/report'
	}else{
		postUrl = '/atom_test/report'
	}
	$.ajax({
		type: 'get',
		async: false,
		url: server + postUrl + window.location.search,
		success: function(data) {
			var datas = JSON.parse(data).detail;
			return_data = datas
			if(datas.ModelDescription){
				algorithm_name(datas);
			}
			model_size(datas);
			if(datas.ModelBestParams){
			modelBestParams(datas);
				
			}
			if(datas.ModelSummary){
				defaultParams(datas.ModelSummary)
				
			}

			if(datas.ModelVariableImportance) {
				ModelVariableImportance(datas)
				$("#Importance").show()
			} else {
				$("#Importance").hide()
			}
			if(datas.ModelCoefficient) {
				ModelCoefficient(datas)
				$("#Coefficient").show()
			} else {
				$("#Coefficient").hide()
			}
			ModelMaxCriteria(datas)
			var threshold = $("#value_Matrix").val()
			ConfusionMatrix(datas, threshold)
			charts(datas, threshold)
			if(datas.ModelKFoldsSummary) {
				ModelKFoldsSummary(datas)
				$("#model_jxs").show()
			} else {
				$("#model_jxs").hide()
			}
			if(datas.ModelThresholdsMetric){
				roc(datas.ModelThresholdsMetric)
			}
			if(datas.ModelSyntheticMetrics){
				card(datas.ModelSyntheticMetrics)
				
			}

			if(datas.ModelScoreGroupThreshold) {
				var value_score = $("#value_Matrix1").val()
				ScoreGroupThreshold(datas.ModelScoreGroupThreshold, value_score)
				$("#scores").show()
			} else {
				$("#scores").hide()
			}
			if(datas.ModelTopnMetricList) {
				TopnMetricList(datas.ModelTopnMetricList)
				$("#Dimensions").show()
			} else {
				$("#Dimensions").hide()
			}

		}
	})

	function algorithm_name(data) {
		$("#algorithm_name").text(data['ModelDescription'][0]['algorithm']);
	}

	function model_size(data) {
		$("#model_size").text("");
	}
	//隐藏差号
	document.body.onclick=  function(e){
		$("#clear_xs").css('visibility','hidden')
		$("#clear").css('visibility','hidden')
	}
	//点击显示差号
	$(".dataSear").click(function(e){
          if (e.stopPropagation)
                e.stopPropagation();
            else
                e.cancelBubble = true;
	})
	//    实际建模所使用的参数值
	function modelBestParams(data) {
		for(var i = 0; i < data.ModelBestParams.length; i++) {
			$('#best_params>li:first-child>ul').append(
				'<li>' + data.ModelBestParams[i].name + '</li>'
			)
			$('#best_params>li:nth-child(2)>ul').append(

				'<li>' + doubleInt(data.ModelBestParams[i].value) + '</li>'
			)
		}
		$("#best_params>li").each(function() {
			if($(this).index() !== 0) {
				$(this).find('li').each(function() {
					var width = $("#best_params>li").eq(0).find('li').eq($(this).index()).outerWidth()
					$(this).css('width', width + 'px')
				})
			}
		})
	}
	//默认参数值
	function defaultParams(data) {
		var layerArr = []
		for(var i = 0; i < data.length; i++) {
			layerArr.push(data[i].layer)
		}
		layerArr = unique(layerArr).sort()
		for(var i = 0; i < layerArr.length; i++) {
			$('#default_params').append(
				'<li>' +
				'<ul>' +
//				'<li>' + layerArr[i] + '</li>' +
				'</ul>' +
				'</li>'
			)
		}
		var lis = $('#default_params>li')
		for(var i = 0; i < data.length; i++) {
			$('#default_params>li:first-child>ul').append(
				'<li>' + data[i].name + '</li>'
			)
				var number = data[i].layer+1
				$('#default_params>li:nth-child('+number+')>ul').append(
					'<li title="'+data[i].value+'">' + doubleInt(data[i].value) + '</li>'
				)
			
		}
		$('#default_params>li>ul>li:last-child').remove()
		$("#default_params>li").each(function() {
			if($(this).index() !== 0) {
				$(this).find('li').each(function() {
					var width = $("#default_params>li").eq(0).find('li').eq($(this).index()).outerWidth()
					$(this).css('width', width + 'px')
				})
			}
		})
	}
	//变量重要性
	function ModelVariableImportance(data) {
		var VariableImportance = data.ModelVariableImportance
		for(var i = 0; i < VariableImportance.length; i++) {
			doubleInt(VariableImportance[i].relative_importance)
			$("#VariableImportance").append(
				' <ul>' +
				' <li title="'+VariableImportance[i].variable.replace(/\</g,'&lt;')+'">' + VariableImportance[i].variable.replace(/\</g,'&lt;') + '</li>' +
				' <li>' + doubleInt(VariableImportance[i].relative_importance) + '</li>' +
				' <li>' + doubleInt(VariableImportance[i].scaled_importance) + '</li>' +
				'<li>' + doubleInt(VariableImportance[i].percentage) + '</li>' +
				'</ul>'
			)
		}

	}
	//判断小数还是整数
	function doubleInt(data){
		if(data.toString().substr(0,1)=='('){
			var datas = data.toString().replace('(','')
			datas = datas.replace(')','')
			var datasArr = datas.split('/')
			return '('+datasArr[0].split('.')[0]+'/'+datasArr[1].split('.')[0]+')'
		}else  if(data.indexOf('.')==-1){
			return data
		}else if(data.split('.')[1].length>4){
			var tmp = 0/0; 
			if(isNaN(data)===true){
				return data
			}
			var datass = null
			if(parseFloat(data).toFixed(4)==='1.0000'||parseFloat(data).toFixed(4)==='0.0000'){
				datass = parseFloat(data).toFixed(4).split('.')[0]
			}else{
				datass = parseFloat(data).toFixed(4)
			}
			return datass

		}else if(data.split('.')[1].length===1&&data.split('.')[1]=='0'){
			return parseInt(data)
		}else{
			if(isNaN(data)===true){
				var value = data.split('.')[1].length
				if(value<5){
					var datas = data.replace('[','')
					datas = datas.replace(']','')
					return '['+parseFloat(datas).toFixed(4)+']'
				}
				return data
			}
			var datass = null
			if(parseFloat(data).toFixed(4)==='1.0000'||parseFloat(data).toFixed(4)==='0.0000'){
				datass = parseFloat(data).toFixed(4).split('.')[0]
			}else{
				datass = parseFloat(data).toFixed(4)
			}
			return datass
		}
		
	}
	$("#search_var").click(function(){
		var text = $(this).parent().find('input').val()
		var datas = return_data.ModelVariableImportance
		if(text!==''){
			$("#VariableImportance").html('')
		for(i in datas){
			if(datas[i].variable.indexOf(text)>=0 || datas[i].variable===text){
				$("#VariableImportance").append(
				' <ul>' +
				' <li title="'+datas[i].variable.replace(/\</g,'&lt;')+'">' + datas[i].variable.replace(/\</g,'&lt;') + '</li>' +
				' <li>' + datas[i].relative_importance + '</li>' +
				' <li>' + datas[i].scaled_importance + '</li>' +
				'<li>' + datas[i].percentage + '</li>' +
				'</ul>'
			)
			}
		}
		}else{
			ModelVariableImportance(return_data)
		}
		
	})
	$('#var_input').on('focus',function(e){
		$(this).next().css('visibility','visible')
	})
//	$('#var_input').on('blur',function(){
//		$(this).next().css('visibility','hidden')
//	})
$("#clear").click(function(){
	$("#VariableImportance").html('')
	$(this).prev().val('')
	ModelVariableImportance(return_data)
})
	//最大标准量
	function ModelMaxCriteria(data) {
		var ModelMaxCriteria = data.ModelMaxCriteria
		for(var i = 0; i < ModelMaxCriteria.length; i++) {
			for(var j = 0; j < needArr.length; j++) {
				if(ModelMaxCriteria[i].metric.split(' ')[1] === needArr[j]) {
					console.log(ModelMaxCriteria[i].threshold)
					console.log(doubleInt(ModelMaxCriteria[i].threshold))
					$("#ModelMaxCriteria").append(
						' <ul>' +
						' <li><span>' + ModelMaxCriteria[i].metric + '</span><i></i><div></div></li>' +
						' <li>' + doubleInt(ModelMaxCriteria[i].threshold) + '</li>' +
						' <li>' + doubleInt(ModelMaxCriteria[i].value) + '</li>' +
						//						'<li>' + ModelMaxCriteria[i].idx + '</li>' +
						'</ul>'
					)
				}
			}

		}
		$("#ModelMaxCriteria>ul>li>i").each(function(){
			var name = $(this).parent().text();
			var width = $(this).prev().width()+55
			$(this).next().css('left',width+'px')
			if(name==='max f1'){
				$(this).next().html('基于精准率与召回率的调和平均')
			}else if(name==='max f2'){
				$(this).next().html('加权调和平均,值更大时，精准率有更大影响')
			}else if(name==='max f0point5'){
				$(this).next().html('加权调和平均,度量了精准率对召回率的相对重要性')
			}else if(name==='max accuracy'){
				$(this).next().html('反映分类器对整个样本的判定能力，能将正的判定为正，负的判定为负')
			}else if(name==='max precision'){
				$(this).next().html('预测正确的正例数占预测为正例总量的比率')
			}else if(name==='max recall'){
				$(this).next().html('预测对的正例数占真正的正例数的比率')
			}else if(name==='max specificity'){
				$(this).next().html('正确预测到的负例数/实际负例总数')
			}
		})
		
	}
	//测量集混淆矩阵和评估指标
	function ConfusionMatrix(data, threshold) {
		var ConfusionMatrix = data.ModelConfusionMatrix
		$("#min").text(ConfusionMatrix[0].threshold)
		$("#max").text(ConfusionMatrix[ConfusionMatrix.length - 1].threshold)
		$("#ConfusionMatrix>ul>li").not(':first-child').remove()
		threshold = parseFloat(threshold)
		threshold_idx = -1;
		for(var i = ConfusionMatrix.length - 1; i >= 0; i--) {
			if(threshold >= parseFloat(ConfusionMatrix[i].threshold)) {
				threshold_idx = i;
				break;
			}
		}
		for(var j = 11; j >= 0; j--) {
			i = threshold_idx - j;
			if(ConfusionMatrix[i].value_type.split('-')[1] === '0') {
				$("#ConfusionMatrix>ul:first-child").append(
					'<li>' + doubleInt(ConfusionMatrix[i].value) + '</li>'
				)
			} else if(ConfusionMatrix[i].value_type.split('-')[1] === '1') {
				$("#ConfusionMatrix>ul:nth-child(2)").append(
					'<li>' + doubleInt(ConfusionMatrix[i].value) + '</li>'
				)
			} else if(ConfusionMatrix[i].value_type.split('-')[1] === 'Total') {
				$("#ConfusionMatrix>ul:nth-child(3)").append(
					'<li>' + doubleInt(ConfusionMatrix[i].value) + '</li>'
				)
			}
		}
	}
	//输入框输入事件
	$("#value_Matrix").on('input', function() {
		var value = parseFloat($(this).val())
		var min = parseFloat($("#min").text())
		var max = parseFloat($("#max").text())
		if($(this).val()!=''){
			if(value<=max && value>=min){
				var condition = /^[+-]?((0|([1-9]\d*))\.\d+)?$/  
				if(condition.test($(this).val())==false &&$(this).val()!=0&&$(this).val()!=1){
					$(this).parent().next().text('不正确的格式')
					$(this).parent().next().show()
				}else{
					if($(this).val().indexOf('.')!=-1){
						var length = $(this).val().split('.')[1].length
						if(length>2){
							$(this).parent().next().text('保留两位小数')
							$(this).parent().next().show()
						}else{
							$(this).parent().next().hide()
							ConfusionMatrix(return_data, $(this).val())
							charts(return_data, $(this).val())
						}
					}else{
						ConfusionMatrix(return_data, '0.0')
						charts(return_data, '0.0')
					}
				}
			}else{
				$(this).parent().next().text('请输入有效的阀值')
				$(this).parent().next().show()
			}
		}

	})
	//柱状图显示
	function charts(data, threshold) {
//		var ThresholdsMetric = data.ModelThresholdsMetric
//
//		var thresholdArr = []
////		var thresholds = []
//		var value_thre = ''
//		for(var i = 0; i < ThresholdsMetric.length; i++) {
//			thresholdArr.push(ThresholdsMetric[i].threshold)
////			if(ThresholdsMetric[i].metric==='threshold'){
////				thresholdArr.push(ThresholdsMetric[i].value)
////			}
//		}
////		console.log(thresholds)
//		thresholdArr.push(threshold)
//		thresholdArr = thresholdArr.sort()
//		$("#min").text(thresholdArr[0])
//		$("#max").text(thresholdArr[thresholdArr.length - 1])
//		for(var i = 0; i < thresholdArr.length; i++) {
//			if(thresholdArr[i] === threshold) {
//				if(parseFloat(thresholdArr[i]) - parseFloat(thresholdArr[i - 1]) > parseFloat(thresholdArr[i + 1]) - parseFloat(thresholdArr[i])) {
//					value_thre = thresholdArr[i + 1]
//				} else {
//					value_thre = thresholdArr[i - 1]
//				}
//
//			}
//		}
//		var metricArr = []
//		var valueArr = []
////		console.log(thresholdArr)
////		console.log(value_thre)
//console.log(value_thre)
//		for(var i = 0; i < ThresholdsMetric.length; i++) {
//			if(ThresholdsMetric[i].metric==='threshold'){
//				if(ThresholdsMetric[i].value==value_thre){
//					thresholdValue = ThresholdsMetric[i].threshold
//				}
//			}
//		}
//		console.log(thresholdValue)
//		for(var i = 0; i < ThresholdsMetric.length; i++) {
////			console.log(ThresholdsMetric[i].threshold)
//			if(ThresholdsMetric[i].threshold == thresholdValue) {
////				console.log('6666')
//				for(var j = 0; j < needArr.length; j++) {
//					if(ThresholdsMetric[i].metric === needArr[j]) {
//						metricArr.push(ThresholdsMetric[i].metric)
//						valueArr.push(ThresholdsMetric[i].value)
//					}
//				}
//
//			}
//		}

		var ThresholdsMetric = data.ModelThresholdsMetric
		var thresholdArr = []
		var value_thre = ''
		for(var i = 0; i < ThresholdsMetric.length; i++) {
			thresholdArr.push(ThresholdsMetric[i].threshold)
		}
		thresholdArr.push(threshold)
		thresholdArr = thresholdArr.sort()
		for(var i = 0; i < thresholdArr.length; i++) {
			if(thresholdArr[i] === threshold) {
				if(parseFloat(thresholdArr[i]) - parseFloat(thresholdArr[i - 1]) > parseFloat(thresholdArr[i + 1]) - parseFloat(thresholdArr[i])) {
					value_thre = thresholdArr[i + 1]
				} else {
					value_thre = thresholdArr[i - 1]
				}

			}
		}
		var metricArr = []
		var valueArr = []
		for(var i = 0; i < ThresholdsMetric.length; i++) {
			if(ThresholdsMetric[i].threshold === value_thre) {
				for(var j = 0; j < needArr.length; j++) {
					if(ThresholdsMetric[i].metric === needArr[j]) {
						metricArr.push(ThresholdsMetric[i].metric)
						valueArr.push(ThresholdsMetric[i].value)
					}
				}

			}
		}
//		var rich = []
//		var img = 'img/icon/icon_question1.png'
//		var obj = {};
//	      for(var i = 0 ;i<metricArr.length;i++){
//	        obj[metricArr[i]] = {};
//	        obj[metricArr[i]]['height'] = 15;
//	        obj[metricArr[i]]['width'] = 15;
//	        obj[metricArr[i]]['backgroundColor'] = {};
//	        obj[metricArr[i]]['backgroundColor'].image = img
//	      }
		var myChart = echarts.init(document.getElementById('threshold'))
		myChart.setOption({
			color: ['#3398DB'],
			tooltip: {
				formatter: function (value) {
                   return value.name+'<br/>'+doubleInt(value.data)
               },
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: metricArr,
				axisTick: {
					alignWithLabel: true
				},
				axisTick: {
					show: false
				},
//				axisLabel: {
//					 interval: 0,
//					 formatter: function (value) {
//		                   return '{value|' + value + '}  {' + value + '|}';
//		               },
//					margin: 20,
//					rich: obj
//				}
			}],
			yAxis: [{
				type: 'value',
			}],
			series: [{
				//				name: '直接访问',
				type: 'bar',
				barWidth: '40',
				data: valueArr,
				itemStyle: {
					normal: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: '#FFA944'
						}, {
							offset: 1,
							color: '#FFC27B'
						}]),
					}
				}
			}]
		})
	}
	//交叉验证模型概要
	function ModelKFoldsSummary(data) {
		var KFoldsSummary = data.ModelKFoldsSummary
		var merticArr = []
		merticArr = jxyz
		mertic_idx = null
		ul_idx = null
		for(var i = 0; i < merticArr.length; i++) {
			$("#KFoldsSummary").append(
				'<ul>' +
				'<li>' + merticArr[i] + '</li>' +
				'</ul>'
			)
			for(var j = 0; j < KFoldsSummary.length; j++) {
				if(i === 0) {
					if(KFoldsSummary[j].metric === merticArr[0]) {
						$("#KFoldsSummary>ul:first-child").append(
							'<li>' + doubleInt(KFoldsSummary[j].value) + '</li>'
						)
					}
				} else {
					var idx = i + 1
					if(KFoldsSummary[j].metric === merticArr[i]) {
						$("#KFoldsSummary>ul:nth-child(" + idx + ")").append(
							'<li>' +doubleInt( KFoldsSummary[j].value) + '</li>'
						)

					}
				}
			}
		}

		for(var j = 0; j < KFoldsSummary.length; j++) {
			if(KFoldsSummary[j].metric === merticArr[0]) {
				$("#KFoldsTitle").append(
					' <li>' + KFoldsSummary[j].value_type + '</li>'
				)
			}
			
		};
		var widths = 0;
		
			$('#KFoldsTitle>li').each(function(){
				widths+= $(this).innerWidth()
			})
			$("#KFoldsTitle").css('width',widths)
			$("#KFoldsSummary>ul").css('width',widths)
			$("#KFoldsSummary").css('width',widths)

	}
	//系数表
	function ModelCoefficient(data) {
		var Coefficient = data.ModelCoefficient
		for(var i = 0; i < Coefficient.length; i++) {
			$("#Coefficients").append(
				'<ul>' +
				'<li>' + Coefficient[i].name + '</li>' +
				'<li>' + doubleInt(Coefficient[i].coefficient) + '</li>' +
				'<li>' + doubleInt(Coefficient[i].standardized_coefficient) + '</li>' +
				'</ul>'
			)
		}

	}
	$("#search_xs").click(function(){
		var text = $(this).parent().find('input').val()
		if(text!==''){
			var datas = return_data.ModelCoefficient
		$("#Coefficients").html('')
		for(i in datas){
			if(datas[i].name===text || datas[i].name.indexOf(text)>=0){
				$("#Coefficients").append(
				' <ul>' +
				' <li title="'+datas[i].name.replace(/\</g,'&lt;')+'">' + datas[i].name.replace(/\</g,'&lt;') + '</li>' +
				' <li>' + datas[i].coefficient + '</li>' +
				' <li>' + datas[i].standardized_coefficient + '</li>' +
				'</ul>'
			)
			}
		}
		}else{
			ModelCoefficient(return_data)
		}
	})
	$("#in-css").focus(function(e){
		$(this).next().css('visibility','visible')
            
	})
	$("#clear_xs").click(function(){
		$("#Coefficients").html('')
		$(this).prev().val('')
		ModelCoefficient(return_data)
	})
	//按score分组统计
	function ScoreGroupThreshold(data, value) {
		$("#min1").text(data[0].threshold)
		$("#max1").text(data[data.length - 1].threshold)
		$("#ScoreGroup").html('')
		for(var i = 0; i < data.length; i++) {
			if(data[i].threshold === value) {
				$("#ScoreGroup").append(
					'<ul>' +
					'<li>' + data[i].score_bins + '</li>' +
					'<li class="score_tps"><span>' + doubleInt(data[i].tps) + '</span></li>' +
					'<li class="score_fps"><span>' + doubleInt(data[i].fps) + '</span></li>' +
					'<li class="score_tns"><span>' + doubleInt(data[i].tns) + '</span></li>' +
					'<li class="score_fns"><span>' + doubleInt(data[i].fns) + '</span></li>' +
					'<li>' + doubleInt(data[i].recall) + '</li>' +
					'<li>' + doubleInt(data[i].precision) + '</li>' +
					'<li>' + doubleInt(data[i].accuracy) + '</li>' +
					'<li>' + doubleInt(data[i].specificity) + '</li>' +
					'</ul>'
				)
			}

		}
		changeColor($('.score_tps'))
		changeColor($('.score_fps'))
		changeColor($('.score_tns'))
		changeColor($('.score_fns'))
	}
	//通过数值改变背景颜色
	function changeColor(data) {
		var tpsArr = []
		for(var i = 0; i < data.length; i++) {
			tpsArr.push(data.eq(i).text())
		}
		var max = Math.max.apply(null, tpsArr)
		for(var i = 0; i < data.length; i++) {
			if(max === 0 || max === -Infinity) {
				data.eq(i).find('span').css('background', 'none')
			} else {
				if(parseInt(data.eq(i).text()) === max) {
					data.eq(i).find('span').css('width', '100%')
				} else {
					data.eq(i).find('span').css('width', parseInt(data.eq(i).text()) / max * 100 + '%')
				}
			}
		}

	}
	//scorre分组统计输入框
	$("#value_Matrix1").on('input', function(){
		var value = parseFloat($(this).val())
		var min = parseFloat($("#min1").text())
		var max = parseFloat($("#max1").text())
		if($(this).val()!=''){
			if(value<=max && value>=min){
				var condition = /^[+-]?((0|([1-9]\d*))\.\d+)?$/  
				if(condition.test($(this).val())==false &&$(this).val()!=0&&$(this).val()!=1){
					$(this).parent().next().text('不正确的格式')
					$(this).parent().next().show()
				}else{
					if($(this).val().indexOf('.')!=-1){
						var length = $(this).val().split('.')[1].length
						if(length>1){
							$(this).parent().next().text('保留一位小数')
							$(this).parent().next().show()
						}else{
							$(this).parent().next().hide()
							ScoreGroupThreshold(return_data.ModelScoreGroupThreshold, $(this).val())
						}
					}else{
						if($(this).val()==1){
							ScoreGroupThreshold(return_data.ModelScoreGroupThreshold, '10')
						}
						ScoreGroupThreshold(return_data.ModelScoreGroupThreshold, '0.0')
					}
				}
					

				
			}else{
				$(this).parent().next().text('请输入有效的阀值')
				$(this).parent().next().show()
			}
		}
	})
	//Top维度指标统计
	function TopnMetricList(data) {
		for(var i = 0; i < data.length; i++) {
			$("#TopnMetricList").append(
				'<ul>' +
				'<li>' + data[i].score_topN + '</li>' +
				'<li class="top_tps"><span>' + doubleInt(data[i].tps) + '</span></li>' +
				'<li class="top_fps"><span>' + doubleInt(data[i].fps) + '</span></li>' +
				'<li class="top_tns"><span>' + doubleInt(data[i].tns) + '</span></li>' +
				'<li class="top_fns"><span>' + doubleInt(data[i].fns) + '</span></li>' +
				'<li>' + doubleInt(data[i].recall) + '</li>' +
				'<li>' + doubleInt(data[i].precision) + '</li>' +
				'</ul>'
			)
		}
		changeColor($('.top_tps'))
		changeColor($('.top_fps'))
		changeColor($('.top_tns'))
		changeColor($('.top_fns'))
	}
	//图信息卡片
	function card(data) {
		for(var i = 0; i < data.length; i++) {
			if(data[i].name === 'AUC') {
				$("#infoCard>ul").append(
					'<li id="auc_value">AUC：' + parseFloat(data[i].value).toFixed(2) + '</li>'
				)
			} else if(data[i].name === 'logloss') {
				$("#infoCard>ul").append(
					'<li>logloss：' + parseFloat(data[i].value).toFixed(2) + '</li>'
				)
			} else if(data[i].name === 'MSE') {
				$("#infoCard>ul").append(
					'<li>MSE：' + parseFloat(data[i].value).toFixed(2) + '</li>'
				)
			} else if(data[i].name === 'RMSE') {
				$("#infoCard>ul").append(
					'<li>RMSE：' + parseFloat(data[i].value).toFixed(2) + '</li>'
				)
			} else if(data[i].name === 'Gini') {
				$("#infoCard>ul").append(
					'<li>Gini：' + parseFloat(data[i].value).toFixed(2) + '</li>'
				)
			}
		}

	}
	//图切换
	$("#testResultTitle li").click(function() {
		$(this).addClass('checked').siblings().removeClass('checked')
		$("#picture li").hide()
		$("#picture li").eq($(this).index()).show()
		if($(this).index() === 1) {
			$("#card").css('visibility', 'hidden')
			Precision(return_data.ModelThresholdsMetric)
		} else if($(this).index() === 2) {
			$("#card").css('visibility', 'hidden')
			lift(return_data.ModelGainLiftSummary)
		} else if($(this).index() === 3) {
			$("#card").css('left', '7%')
			$("#card").css('visibility', 'visible')
			ks(return_data.ModelThresholdsMetric)
		} else if($(this).index() === 4) {
			$("#card").css('visibility', 'hidden')
			Gair(return_data.ModelGainLiftSummary)
		} else {
			$("#card").css('left', '25%')
			$("#card").css('visibility', 'visible')
			roc(return_data.ModelThresholdsMetric)
		}
	})
	//图展示相同方法
	function sameFuc(data, x, y) {
		var xArr = []
		var yArr = []
		var zb = []
		for(var i = 0; i < data.length; i++) {
			if(data[i].metric === x) {
				xArr.push(parseFloat(data[i].value))
				
			}
		}
		xArr = xArr.sort()
		for(var i=0;i<xArr.length;i++){
			for(var j=0;j<data.length;j++){
				if(data[j].metric === x) {
					if(data[j].value==xArr[i]){
						zb.push(data[j].threshold)
					}
				}
			}
		}
		zb = unique(zb)
		for(var i=0;i<zb.length;i++){
			for(var j=0;j<data.length;j++){
				if(data[j].metric === y) {
					if(data[j].threshold==zb[i]){
						yArr.push(parseFloat(data[j].value))
					}
				}
			}
		}
		var arr = []
		for(var i = 0; i < xArr.length; i++) {
			arr.push([xArr[i], yArr[i]])
		}
		return arr
	}
	//roc曲线
	function roc(data) {
		var arr = sameFuc(data, 'fpr', 'tpr')
		var auc_value = null
		for(i in return_data.ModelSyntheticMetrics) {
			if(return_data.ModelSyntheticMetrics[i].name === 'AUC') {
				auc_value = parseFloat(return_data.ModelSyntheticMetrics[i].value).toFixed(2)
			}
		}
		$("#card").html('测试数据Area Under the Curve=' + auc_value)
		var myChart = echarts.init(document.getElementById('roc'))
		myChart.setOption({
			//			tooltip: {
			//				trigger: 'axis',
			//		        axisPointer: {
			//		            type: 'cross',
			//		            label: {
			//		                backgroundColor: '#6a7985'
			//		            }
			//		        }
			//			},
			calculable: true,
			xAxis: [{
				type: 'value',
				name: 'fpr',
//				nameGap:30,
//	            nameLocation:'center',
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
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				name: 'tpr',
//				nameGap:30,
//	            nameLocation:'center',
				type: 'value',
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
				splitLine: {
					lineStyle: {
						color: ['#d6dde2']
					}
				}
			}],
			series: [{
					type: 'line',
					data: arr,
					areaStyle: {
						normal: {
							opacity: 0.3,
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: '#ff617f'
							}, {
								offset: 1,
								color: '#ffbac7'
							}])
						}
					},
					symbol: 'none',
					itemStyle: {
						normal: {
							color: '#ff4266'
						}
					}
				},
				{

					type: 'line',
					data: [
						[0, 0],
						[1, 1]
					],
					symbol: 'none',
					itemStyle: {
						normal: {
							color: '#ff9e20'
						}
					}
				}
			]
		})

	}
	//Precision曲线
	function Precision(data) {
		var arr = sameFuc(data, 'recall', 'precision')
		
 		arr = arr.filter(function(item){
              if(!(item[0] == 0 && item[1] == 0)){
                return item;
              }
        })
 		var statusArr = null;
 		if(equel(arr)==true){
 			statusArr = 'emptyCircle'
 		}else{
 			statusArr = 'none'
 		}
 		function equel(aaa){
		    var bbb = JSON.stringify(aaa[0]);
		    var ccc = 0;
		    for(var i = 1; i<aaa.length;i++){
		      var ddd = JSON.stringify(aaa[i]);
		      if(ddd != bbb){
		        
		        break;
		      }else{
		      	ccc = i+1;
		      }
		    }
		    if(ccc === aaa.length){
		    	return true
		    }else{
		    	return false
		    }	
		}
		var myChart = echarts.init(document.getElementById('Precision'))
		myChart.setOption({
			legend: {
				data: ['数据1', '数据2']
			},
			calculable: true,
			xAxis: [{
				type: 'value',
				name: 'recall',
//				nameGap:30,
//	            nameLocation:'center',
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
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				type: 'value',
				name: 'precision',
//				nameGap:30,
//	            nameLocation:'center',
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
				splitLine: {
					lineStyle: {
						color: ['#d6dde2']
					}
				}
			}],
			series: [{
				type: 'line',
				data: arr,
				symbol: statusArr,
				itemStyle: {
					normal: {
						color: '#26dabe'
					}
				}
			}, ]
		})
	}
	//ks曲线
	function ks(data) {
		var xArr = []
		var yArr = []
		var tprArr = []
		var fprArr = []
		var xyArr = []
		for(var i = 0; i < data.length; i++) {
			if(data[i].metric === 'tpr') {
				xArr.push(data[i].threshold)
				tprArr.push(data[i].value)
			}
			if(data[i].metric === 'fpr') {
				yArr.push(data[i].threshold)
				fprArr.push(data[i].value)
			}
//			if(data[i].metric === 'threshold'){
//				xyArr.push(data[i].value)
//			}
		}
		xArr = xArr.sort()
		yArr = yArr.sort()
		tprArr = tprArr.sort()
		fprArr = fprArr.sort()
		var tprResult = []
		var fprResult = []
//		for(var i = 0; i < xyArr.length; i++) {
//			tprResult.push([xyArr[i], tprArr[i]])
//			fprResult.push([xyArr[i], fprArr[i]])
//		}
		for(var i = 0; i < xArr.length; i++) {
			tprResult.push([xArr[i], tprArr[i]])
		}

		for(var i = 0; i < yArr.length; i++) {
			fprResult.push([yArr[i], fprArr[i]])
		}
		//获取ks值
		var arr3 = []
		var ks = null
		for(index in tprArr) {
			arr3.push(parseFloat(tprArr[index]) - parseFloat(fprArr[index]))
		}

		function sortNumber(a, b) {
			return a - b
		}
		ks = arr3.sort(sortNumber).pop()
		var kss = ks.toFixed(3)*100
		$("#card").html('测试数据KS=' + kss.toFixed(2)+'%')
		//ks两个坐标
		var ks_tpr = null
		var ks_fpr = null
		for(index in tprArr) {
			if(parseFloat(tprArr[index]) - parseFloat(fprArr[index]) === ks) {
				ks_tpr = tprArr[index]
				ks_fpr = fprArr[index]
			}
		}
		
		//产生ks值得横纵坐标
		var ksArr = []
		var coordinate_tpr = null
		var coordinate_fpr = null
		for(i in fprResult) {
			if(fprResult[i][1] === ks_fpr) {
				coordinate_tpr = fprResult[i][0]
				coordinate_fpr = fprResult[i][0]
			}
		}
		ksArr.push([coordinate_tpr, ks_tpr])
		ksArr.push([coordinate_tpr, ks_fpr])
		//开始画图
		var myChart = echarts.init(document.getElementById('KS'))
		myChart.setOption({
			legend: {
				selectedMode:false,
				data: ['正样本洛伦兹曲线', '负样本洛伦兹曲线', 'KS值'],
				right: 80
			},
			grid:{
			　　x:60,
			　　x2:80,
//			　　y2:200
			},
			calculable: true,
			xAxis: [{
				type: 'value',
				name: '按打分分组',
				splitNumber:10,
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
					formatter:function(value){
						return value*100
					}
					
				},
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				type: 'value',
				name: '累计占比%',
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
					formatter:function(value){
						return value*100
					}
				},
				splitLine: {
					lineStyle: {
						color: ['#d6dde2']
					}
				}
			}],
			series: [{
					name: '正样本洛伦兹曲线',
					type: 'line',
					data: tprResult,
					symbol: 'none',
					itemStyle: {
						normal: {
							color: '#ff4266'
						}
					}

				},
				{
					name: '负样本洛伦兹曲线',
					type: 'line',
					data: fprResult,
					symbol: 'none',
					itemStyle: {
						normal: {
							color: '#2184ff'
						}
					}
				}, {
					name: 'KS值',
					type: 'line',
					data: ksArr,
					symbol: 'none',
					smooth: false,
					itemStyle: {
						normal: {
							color: '#ff9e2c',
							lineStyle: {
								type: 'dotted'

							}

						}
					}

				}
			]
		})

	}
	//lift图
	function lift(data) {
		var arr = []
		for(var i = 0; i < data.length; i++) {
			arr.push([data[i].cumulative_data_fraction, data[i].node1cumulative_lift])
		}
		var myChart = echarts.init(document.getElementById('Lift'))
		myChart.setOption({
			legend: {
				data: ['数据1', '数据2']
			},
			grid:{
			　　x:60,
			　　x2:180,
//			　　y2:200
			},
			calculable: true,
			xAxis: [{
				type: 'value',
				name: 'cumulative_data_fraction',
//				 nameGap:30,
//	            nameLocation:'center',
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
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				type: 'value',
				name: 'cumulative_lift',
//				 nameGap:30,
//	            nameLocation:'center',
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
				splitLine: {
					lineStyle: {
						color: ['#d6dde2']
					}
				}
			}],
			series: [{
				type: 'line',
				data: arr,
				symbol: 'none',
				itemStyle: {
					normal: {
						color: '#26dabe'
					}
				}
			}, ]
		})
	}
	//Gair图
	function Gair(data) {
		var arr = []
		for(var i = 0; i < data.length; i++) {
			arr.push([data[i].cumulative_data_fraction, data[i].node1cumulative_capture_ratenode1])
		}
		var myChart = echarts.init(document.getElementById('Gair'))
		myChart.setOption({
			legend: {
				data: ['数据1', '数据2']
			},
			grid:{
			　　x:60,
			　　x2:110
			},
			calculable: true,
			xAxis: [{
				type: 'value',
				name:'占数据集的百分比',
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
					formatter:function(value){
						return value*100
					}
				},
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				name:'true positive rate',
//				nameGap:30,
//	            nameLocation:'center',
				type: 'value',
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
				splitLine: {
					lineStyle: {
						color: ['#d6dde2']
					}
				}
			}],
			series: [{
				type: 'line',
				data: arr,
				symbol: 'none',
				itemStyle: {
					normal: {
						color: '#26dabe'
					}
				}
			}, ]
		})
	}

	function unique(arr) {
		// 遍历arr，把元素分别放入tmp数组(不存在才放)
		var tmp = new Array();
		for(var i in arr) {
			//该元素在tmp内部不存在才允许追加
			if(tmp.indexOf(arr[i]) == -1) {
				tmp.push(arr[i]);
			}
		}
		return tmp;
	};
	//点击查看更多进入帮助文档
	$(".seeMoreEm").click(function(){
		window.open('help.html?algorithm='+$(this).attr('type')+'');
	});
	//下载pdf文件
	$("#downloadpdf").click(function(){
		var threshold_confusion = $("#value_Matrix").val();
		var threshold_top = $("#value_Matrix1").val();
		var ids = window.location.search;
		var url = ids+'&threshold_confusion='+threshold_confusion+'&threshold_top='+threshold_top;
		
		if(itemName=='AtomLearn'){
			window.open(server+'/atom_learn/report_pdf'+url)
		}else{
			window.open(server+'/atom_test/report_pdf'+url)
			
		}
	})
})