//组件服务地址
   var server = 'http://192.168.1.119:8000';
//var server = 'http://192.168.1.124:8000';
//133
//用户信息地址
var urlstr = 'http://192.168.1.119:8081/db/';
//var urlstr = 'http://192.168.1.168:8080/db/';

var proid = getUrlParam('projectID');
var proname = sessionStorage.getItem('trainName');
var separator = ',';
var csvloadid = '';
//xml 文件
var dist_final_xml = '';
var userId = sessionStorage.getItem('userId');
var token = sessionStorage.getItem('token');
var timeStamp = "timeStamp="+new Date().getTime();
var timestamp = new Date().getTime();
////获取URL参数
 function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};
