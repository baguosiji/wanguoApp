mui.plusReady(function() {
  myPage = plus.webview.getWebviewById("my.html");
  nowPage = plus.webview.currentWebview();
  if (nowPage.change_PWD) {
    plus.webview.getWebviewById("centerChangePWD.html").close("none");
  }
});
var login = new Vue({
  el: "#login",
  data: {
    userPhone: "",
    userPassword: "",
    code: ""
  }
});
var url;
function jump() {
  mui.openWindow({
    url: url,
    id: url
  });
}

mui(".other-type-login").on("tap", ".register", function() {
  url = "register.html";
  jump();
});
mui(".other-type-login").on("tap", ".forget-password", function() {
  url = "changePassword.html";
  jump();
});
var myPage;
var phoneNumber = /^[1][3,4,5,7,8][0-9]{9}$/;
function logins() {
  if (!phoneNumber.test(login.userPhone)) {
    toast("请输入正确手机号码");
  } else if (!login.userPassword) {
    toast("请输入密码");
  } else if (!login.code) {
    toast("请输入验证码");
  } else {
    var waiting = plus.nativeUI.showWaiting("加载中", {
      width: "130px",
      height: "130px"
    });
    mui.ajax(http_url + "/api.php/Login/login", {
      data: {
        phone: login.userPhone,
        user_pwd: login.userPassword,
        verify: login.code
      },
      dataType: "json",
      type: "post",
      timeout: 10000,
      headers: { apitoken: c("/api.php/Login/login") },
      success: function(data) {
        if (data.status == 200) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user-message", JSON.stringify(data.data));
          myPage.reload(true);
          waiting.close();
          mui.back();
        } else if (data.status == 404) {
          waiting.close();
          // document.getElementById("verification").src =
          //   "https://api.wanguo.net/api.php/Login/verify";
          document.getElementById("verification").src="http://192.168.50.50:81/api.php/Login/verify";
          toast(data.message);
        }
      },
      error: function(xhr, type, errorThrown) {
        //异常处理；
        console.log(type);
      }
    });
  }
}
function myPageReload() {
  myPage.reload(true);
  mui.back();
}
document.querySelector(".mui-action-back").addEventListener(
  "tap",
  function() {
    myPageReload();
  },
  false
);
//点击更换图片
function changeImg(e) {
  // e.currentTarget.src = "https://api.wanguo.net/api.php/Login/verify";
  e.currentTarget.src = "http://192.168.50.50:81/api.php/Login/verify";
}
