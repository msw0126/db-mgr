$(function(){
	setTimeout(function(){
		var souid_arr = $("#act-main").attr('souid').split(',');
		if(souid_arr.length<2){
			layer.alert('请选择相应组件进行连接', {
				icon: 2,
				title: '提示'
			});
		}
	},10)

	$(".c-act-save").click(function(){
		var souidArr = $("#act-main").attr('souid').split(',');
		if($("#act-main").attr('souid')===''){
			alert('请链接相应组件')
		}else if(souidArr.length===1&&souidArr[0].substring(0,9)==='AtomLearn'){
			alert('请链接一份数据')
		}else{
			var learnId = '';
			var inputID = '';
			for(var i=0;i<souidArr.length;i++){
				if(souidArr[i].substring(0,9)==='AtomLearn'){
					learnId = souidArr[i]
				}else{
					inputID = souidArr[i]
				}
			};
			$.ajax({
				type:'post',
				url:server+'/atom_act/save?'+timeStamp,
				data:{
					project_id:proid,
					component_id:$("#act-main").attr('data'),
					atom_learn_id:learnId,
					input_comp_id:inputID
				},
				success:function(data){
					function success(){
						alertSuccess()
					};
					backInfo(data,success)
				}
			})			
		}

	});
	$(".run").click(function(){
		runParameter($("#act-main").attr('data'))
		$("#runContent").fadeIn()
		$("#shadowBody").show()
	})
})
