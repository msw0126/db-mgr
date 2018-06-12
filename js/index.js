//-------------------------主页js-------------------------
angular.module('myApp', ["ui.router"])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	
	var menuList = JSON.parse(sessionStorage.getItem('menuList'));
	var userList = JSON.parse(sessionStorage.getItem('roleList'));
	if(sessionStorage.getItem('userType')=='admin'){
		$urlRouterProvider.when('', '/sysUserManager')
		$(".header-left").attr('ui-sref',"sysUserManager")
	}else{
		$urlRouterProvider.when('', '/home')
	}
	$(".header-role").text(userList[0].roleName)
	var treeIdx_arr = [];
	var projrctMgr = [];
	var projrctMgr_child=[];
	var sysMenu = [];
	var sysMenu_child = [];
	var modelMenu=[],modelMenu_child = []
	for(var i=0;i<menuList.length;i++){
		if(menuList[i].parentCode =="sysRoot"){
			if(menuList[i].treeIdx=="1"){
				for(var j=0;j<menuList.length;j++){
					if(menuList[j].parentCode ==menuList[i].menuCode){
						if(menuList[j].orderNo=="1"){
							projrctMgr_child[0]={"menuName":menuList[j].menuName,"menuUrl":menuList[j].menuUrl,"parentCode":menuList[j].parentCode}
						}else if(menuList[j].orderNo=="2"){
							projrctMgr_child[1]={"menuName":menuList[j].menuName,"menuUrl":menuList[j].menuUrl,"parentCode":menuList[j].parentCode}
						}
					}
				}
				projrctMgr={"menuName":menuList[i].menuName,"menuCode":menuList[i].menuCode,"child":projrctMgr_child};
				$(".left-ul>li:first-child").append('<ul>'+
							'<li class="left-ul-title user-info"><img src="img/icon_project.png" alt="" /><span>'+menuList[i].menuName+'</span></li>'+
					'</ul>');
				for(var index=0;index<projrctMgr_child.length;index++){
					$(".left-ul>li:first-child ul").append('<li class="left-ul-list list_projrctMgr" ui-sref="'+projrctMgr_child[index].menuUrl+'">'+projrctMgr_child[index].menuName+'</li>')
				}
			}else if(menuList[i].treeIdx=="2"){
				for(var j=0;j<menuList.length;j++){
					if(menuList[j].parentCode ==menuList[i].menuCode){
						if(menuList[j].orderNo=="1"){
							sysMenu_child[0]={"menuName":menuList[j].menuName,"menuUrl":menuList[j].menuUrl,"parentCode":menuList[j].parentCode}
						}else if(menuList[j].orderNo=="2"){
							sysMenu_child[1]={"menuName":menuList[j].menuName,"menuUrl":menuList[j].menuUrl,"parentCode":menuList[j].parentCode}
						}
					}
				}
				sysMenu={"menuName":menuList[i].menuName,"menuCode":menuList[i].menuCode,"child":sysMenu_child};
				$(".left-ul>li:nth-child(2)").append('<ul>'+
							'<li class="left-ul-title user-info"><img src="img/icon_power.png" alt="" /><span>'+menuList[i].menuName+'</span></li>'+
					'</ul>');
				for(var index=0;index<sysMenu_child.length;index++){
					$(".left-ul>li:nth-child(2) ul").append('<li class="left-ul-list" ui-sref="'+sysMenu_child[index].menuUrl+'">'+sysMenu_child[index].menuName+'</li>')
				}				
			}
		}
	}
	$(".left-ul>li").each(function(){
		if($(this).children().length==0){
			$(this).remove()
		}
	});
	$(".left-ul-list").click(function(){
		$(this).addClass('change-list').siblings().removeClass('change-list');
		$(this).addClass('change-list').parent().parent().siblings().children().children().removeClass('change-list');
	});
    $(".header-left").click(function(){
    	$(".left-ul-list").removeClass('change-list');
    	$(".sp-container").hide()
    });
    $(".my_info_ ").click(function(){
    	$(".sp-container").hide()
    });
    $(".left-ul-list").click(function(){
    	$(".sp-container").hide()
    });
	$stateProvider.state('trprojectTrainMgr', {
			url: '/trprojectTrainMgr',
			templateUrl: 'same/trprojectTrainMgr.html'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'same/home.html'
		})
		.state('projectProdMgr', {
			url: '/projectProdMgr',
			templateUrl: 'same/projectProdMgr.html'
		})
		.state('sysUserManager', {
			url: '/sysUserManager',
			templateUrl: 'same/sysUserManager.html'
		})
		.state('home.trprojectTrainMgr', {
			url: '/trprojectTrainMgr',
			templateUrl: 'same/trprojectTrainMgr.html'
		})
//		.state('home.my_info', {
//			url: '/my_info',
//			templateUrl: 'same/my_info.html'
//		})
        .state('sysModelMgr',{
            url:'/sysModelMgr',
            templateUrl:'same/sysModelMgr.html'
        })
//      .state('my_info',{
//      	url:'/my_info',
//      	templateUrl:'same/my_info.html'
//      })
}])
$(function() {
	if(sessionStorage.token){
		$(".header-name span:first-child").text(sessionStorage.getItem('name'))
		$(".header-login").click(function() {
			logout();
		});
		function logout() {
			$.ajax({
				type: 'GET',
				url: urlstr + 'sysAuthLogController/logout.do?token=' + sessionStorage.token,
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				success: function(data) {
					if(data.code == "000") {
						sessionStorage.removeItem('token')
						sessionStorage.removeItem('name')
						location.href = 'login.html'
					}
				},
				error: function(textStatus, errorThrown) {
					$(".alert_success img").attr('src', 'img/error.png');
					$(".alert_content").html('接口请求失败');
					$(".alert_success").show();
					setTimeout(function() {
						$(".alert_success").hide();
					}, 2000);
				}
			});
		};
		if(sessionStorage.name) {
	
		} else {
			$(".header-name").click(function() {
				location.href = 'login.html'
			})
		};
	}else{
		location.href='login.html'
	};
	

});