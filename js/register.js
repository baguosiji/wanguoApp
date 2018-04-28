var vm = new Vue({
  el: "#app",
  data: {
    phone: "",
    verificationCode: "",
    firstPWD: "",
    nextPWD: "",
    countDown: 60
  }
});
// 获取验证码
function getVerification() {
  var phoneNumber = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!phoneNumber.test(vm.phone)) {
    toast("请输入正确手机号");
  } else {
    mui.ajax(http_url + "/api.php/Login/getsms", {
      data: {
        phone: vm.phone
      },
      dataType: "json",
      type: "post",
      timeout: 10000,
      headers: { apitoken: c("/api.php/Login/getsms") },
      success: function(data) {
        toast(data.message);
        var ref_time_out=setInterval(function() {
          if (vm.countDown > 0) {
            vm.countDown--;
          }else{
            vm.countDown=60;
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
// 发送修改密码请求
function submit() {
  var pwdReg = /^(\d{8,16})?$/; //8到16位数字与字母组合
  if (!pwdReg.test(vm.firstPWD)) {
    toast("密码为8-16位数字");
  } else if (vm.firstPWD != vm.nextPWD) {
    toast("两次密码输入不一致");
  } else if (!vm.verificationCode) {
    toast("请输入验证码");
  } else {
    var waiting = plus.nativeUI.showWaiting("加载中", {
      width: "130px",
      height: "130px"
    });
    mui.ajax(http_url + "/api.php/Login/reg", {
      data: {
        phone: vm.phone,
        user_pwd: vm.firstPWD,
        user_rpwd: vm.nextPWD,
        smscode: vm.verificationCode
      },
      dataType: "json",
      type: "post",
      headers: { apitoken: c("/api.php/Login/reg") },
      timeout: 10000,
      success: function(data) {
        if (data.status == 200) {
          waiting.close();
          mui.alert(data.message, "万国提示", function() {
            mui.back();
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
//验证码倒计时
