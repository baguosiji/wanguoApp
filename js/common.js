var http_url = "http://192.168.50.50:81";
// 时间转换
Date.prototype.format = function(fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
// 毫秒转时间
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "年" +
    (this.getMonth() + 1) +
    "月" +
    this.getDate() +
    "日 " +
    this.getHours() +
    "点" +
    this.getMinutes() +
    "分" +
    this.getSeconds() +
    "秒"
  );
};
var http_time = new Date().format("yyyy-MM-dd hh");
// 原生toast弹出框
function toast(message) {
  plus.nativeUI.toast(message, { verticalAlign: "center" });
}
//MD5加密计算方法
function self_MD5(path) {
  return hex_md5(path + http_time + "wanguo.net!@#");
}
var reg_phone = /^[1][3,4,5,7,8][0-9]{9}$/;

//用户token;
var user_all_message = JSON.parse(localStorage.getItem("user-message"));
//获取用户头
function user_token() {
  var token = JSON.parse(localStorage.getItem("user-message"));
  if (token) {
    return true;
  } else {
    return false;
  }
}
