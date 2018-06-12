$(function(){
	setTimeout(function(){
		var souid_arr = $("#test-main").attr('souid').split(',');
		if(souid_arr.length<2){
			layer.alert('请选择相应组件进行连接', {
				icon: 2,
				title: '提示'
			});
		}
	},10)
	$(".c-test-save").click(function(){
		var souidArr = $("#test-main").attr('souid').split(',');
		if( $("#test-main").attr('souid')===''){
			alert('请链接相应组件')
		}else if(souidArr.length===1&&souidArr[0].substring(0,7)==='AtomAct'){
			alert('请连接一份数据')
		}else{
			var actId = '';
			var inputID = '';
			for(var i=0;i<souidArr.length;i++){
				if(souidArr[i].substring(0,7)==='AtomAct'){
					actId = souidArr[i]
				}else{
					inputID = souidArr[i]
				}
			};
			$.ajax({
				type:'post',
				url:server+'/atom_test/save?'+timeStamp,
				data:{
					project_id:proid,
					component_id:$("#test-main").attr('data'),
					atom_act_id:actId,
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
		runParameter($("#test-main").attr('data'))
		$("#runContent").fadeIn()
		$("#shadowBody").show()
	})
})
