
function getNewDate(url,type,async,data) {
	return new Promise(function(resolve, reject) {
		$.ajax({
				url: url,
				type: type,
				async: async,
				data: data,
			})
			.done(function(data) {
//				console.log(res)
				if(JSON.parse(data).error_code){
        			ErrorAlert(JSON.parse(data).error_code)
        	}else{
        			var thisDate = JSON.parse(data);; //需要返回thisDate
					resolve(thisDate);
        		}
				
			})
			.fail(function(err) {
				reject(err);
			})
			.always(function() {});
	});
}
//保存成功代码
function alertSuccess(){
	layer.alert('保存成功！', {
		icon: 1,
		title: '提示'
	});
}
//错误代码提示
function alert(result){
	layer.alert(result, {
		icon: 2,
		title: '提示'
	});
}
function ErrorAlert(code) {
	if(code === 'param000') {
		alert('请求参数不存在')
	} else if(code === 'param001') {
		alert('参数错误')
	} else if(code === 'hive000') {
		alert('集群网络不通或查询错误')
	} else if(code === 'hive001') {
		alert('表不存在')
	} else if(code === 'component000') {
		alert('组件不存在')
	} else if(code === 'component001') {
		alert('组件ID不正确')
	} else if(code === 'py4j000') {
		alert('py4j服务异常')
	}else if(code==='feature002'){
		alert('关联字段不在SelfDefinedFeature组件中')		
	}else if(code==='ATOM_LEARN_NOT_CONFIGURED'){
		alert('Atom Learn没有配置')		
	}else if(code==='ATOM_ACT_NOT_CONFIGURED'){
		alert('Atom Act没有配置')		
	}else if(code==='ALGORITHM_PARAM_ERROR'){
		alert('算法参数错误')		
	}else if(code==='INPUT_NOT_SAME_AS_LEARN'){
		alert('输入数据与ATOMLEARN不同')			
	}else if(code==='COMPONENT_NOT_SAME_AS_LEARN'){
		alert('输入组件类型和ATOMLEARN不同')			
	}else if(code==='NO_SUCH_APP'){
		alert('不存在该任务ID对应的任务')			
	}else if(code==='TASK_KILLED'){
		alert('停止任务成功，稍后会体现在页面中')			
	}else if(code==='TASK_ALREADY_FINISHED'){
		alert('任务已完成，不需要手动停止')			
	}else if(code==='APP_ID_ERROR'){
		alert('提交的任务ID格式有误')			
	}else if(code==='csv006'){
		alert('文件未上传')			
	}else if(code==='csv007'){
		alert('导入数据表失败，请检查重试')			
	}else{
		alert(code)
	}
};
function dataBack(data){
	return JSON.parse(data)
}
function backInfo(data,success){
	if(dataBack(data).error_code){
		ErrorAlert(dataBack(data).error_code)
	}else{
		success()
	}	
}
//限制文件上传类型以及文件大小
function limitSize(size) {
	if(size > 31457280) {
		layer.alert('文件不能超过30M', {
			icon: 2,
			title: '提示'
		});
		return false
	} else {
		return true
	}
};
//运行参数配置
function runParameter(value){
$.ajax({
	url:server+'/yarn_resource/previous',
	type:'post',
	data:{
		project_id:proid,
		component_id:value,
	},
	success:function(data){
		function success(){
			var datas = dataBack(data).detail
			$("#driver_memory").val(datas.driver_memory)
			$("#num_executor").val(datas.num_executor)
			$("#executor_memory").val(datas.executor_memory)
            $("#executor_cores").val(datas.executor_cores)
            $("#driver_perm").val(datas.driver_perm)
            $("#executor_perm").val(datas.executor_perm)
		}
		backInfo(data,success)
	}
})	
$("#cancel").click(function(){
	$("#runContent").fadeOut()
	$("#shadowBody").hide()
	$(".error1").hide()
})
$('#save').click(function(){
	if(numberStatus===true){
		$.ajax({
			url:server+'/yarn_resource/save',
			type:'post',
			data:{
				project_id:proid,
				component_id:value,
				driver_memory:$("#driver_memory").val(),
				num_executor:$("#num_executor").val(),
				executor_memory:$("#executor_memory").val(),
                executor_cores:$("#executor_cores").val(),
                driver_perm:$("#driver_perm").val(),
                executor_perm:$("#executor_perm").val(),
			},
			success:function(data){
				function success(){
					var datas = dataBack(data).detail;
					if(datas===null){
						$("#shadowBody").hide()
						$("#runContent").hide()
						layer.alert('保存成功！', {
							icon: 1,
							title: '提示'
						});
					}
				}
				backInfo(data,success)
				
			}
		})		
	}

})
};
//判断是否是数字

function checkNumber(theObj) {
  var reg = /^\+?[1-9][0-9]*$/;
  if (reg.test(theObj)) {
    return true;
  }
  return false;
}
var numberStatus = true;
$("#runContent_content input").blur(function(){
	var data = checkNumber($(this).val())
	if(data===true){
		numberStatus=true
		$(this).parent().next().next().hide()
	}else{
		numberStatus = false
		$(this).parent().next().next().show()
	}
})
