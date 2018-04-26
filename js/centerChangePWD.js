var vm = new Vue({
  el: "#app",
  data: {
    oldpwd: "",
    pwd: "",
    rpwd: ""
  }
});
var pwdReg = /^(\d{8,16})?$/; //8到16位数字与字母组合
function submit() {
  if (!vm.oldpwd) {
    toast("请输入旧密码");
  } else if (!pwdReg.test(vm.pwd)) {
    toast("密码长度为8-16位数字");
  } else if (vm.pwd != vm.rpwd) {
    toast("两次输入密码不一致");
  } else {
    var waiting = plus.nativeUI.showWaiting("加载中", {
      width: "130px",
      height: "130px"
    });

    mui.ajax(http_url + "/api.php/User/editpass", {
      data: {
        oldpwd: vm.oldpwd,
        pwd: vm.pwd,
        rpwd: vm.rpwd
      },
      dataType: "json",
      type: "post",
      headers: { apitoken: c("/api.php/User/editpass") },
      timeout: 10000,
      success: function(data) {
        if (data.status == 200) {
          waiting.close();
          localStorage.removeItem("user-message");
          mui.alert(data.message, "万国提示", function() {
            mui.openWindow({
              url: "login.html",
              id: "login.html",
              extras: { change_PWD: true }
            });
          });
        } else {
          waiting.close();
          toast(data.message);
        }
      },
      error: function(xhr, type, errorThrown) {
        waiting.close();
      }
    });
  }
}
