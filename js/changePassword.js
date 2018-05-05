var vm = new Vue({
  el: "#app",
  data: {
    phone: "",
    verification: "",
    user_pwd: "",
    countDown: 60
  }
});
var phoneNumber = /^[1][3,4,5,7,8][0-9]{9}$/;
// 获取验证码
function getVerification() {
  if (!phoneNumber.test(vm.phone)) {
    toast("请输入正确手机号");
  } else {
    mui.ajax(http_url + "/api.php/Login/getsms", {
      data: {
        phone: vm.phone
      },
      dataType: "json",
      headers: { apitoken: c("/api.php/Login/getsms") },
      type: "post",
      timeout: 10000,
      // headers: { 'Content-Type': 'application/json' },
      success: function(data) {
        toast(data.message);
        var ref_time_out = setInterval(function() {
          if (vm.countDown > 0) {
            vm.countDown--;
          } else {
            vm.countDown = 60;
            clearInterval(ref_time_out);
          }
        }, 1000);
      },
      error: function(xhr, type, errorThrown) {
        //异常处理；
        console.log(type);
      }
    });
  }
}
// 提交修改密码请求
function submit() {
  var pwdReg = /^(\d{8,16})?$/; //8到16位数字与字母组合
  if (!phoneNumber.test(vm.phone)) {
    toast("请输入正确手机号");
  } else if (!vm.verification) {
    toast("请输入验证码");
  } else if (!pwdReg.test(vm.user_pwd)) {
    toast("密码为8-16位数字");
  } else {
    var waiting = plus.nativeUI.showWaiting("加载中", {
      width: "120px",
      height: "120px"
    });
    mui.ajax(http_url + "/api.php/Login/getpass", {
      data: {
        phone: vm.phone,
        user_pwd: vm.user_pwd,
        smscode: vm.verification
      },
      headers: { apitoken: c("/api.php/Login/getpass") },
      dataType: "json",
      type: "post",
      timeout: 1000,
      success: function(data) {
        if (data.status == 200) {
          waiting.close();
          mui.alert("密码修改成功", "万国提示", function() {
            mui.back();
          });
        } else {
          waiting.close();
          toast(data.message);
        }
      },
      error: function() {
        waiting.close();
      }
    });
  }
}
