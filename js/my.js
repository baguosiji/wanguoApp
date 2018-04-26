var vm = new Vue({
  el: "#app",
  data: {
    user_message: user_all_message
  }
});
// vm.user_message = JSON.parse(localStorage.getItem("user-message"))
if (user_all_message) {
  mui.ajax(http_url + "/api.php/User/info?token=" + user_all_message.token, {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/User/info")
    },
    success: function(data) {
      vm.user_message = data.data;
      localStorage.removeItem("user-message");
      localStorage.setItem("user-message", JSON.stringify(data.data));
    },
    error: function(xhr, type, errorThrown) {
      //异常处理；ss
      console.log(errorThrown);
    }
  });
}
mui(".mui-scroll-wrapper").scroll({
  deceleration: 0.0005
});
document
  .getElementsByClassName("sign-out")[0]
  .addEventListener("tap", function() {
    if (user_all_message) {
      mui.ajax(
        http_url + "/api.php/Login/logout?token=" + user_all_message.token,
        {
          dataType: "json",
          type: "get",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            apitoken: c("/api.php/Login/logout")
          },
          success: function(data) {
            localStorage.removeItem("token");
            localStorage.removeItem("user-message");
            mui.alert(data.message, "万国提示", function() {
              mui.openWindow({
                id: "login.html",
                url: "login.html"
              });
            });
          },
          error: function(xhr, type, errorThrown) {
            //异常处理；
            console.log(type);
          }
        }
      );
    } else {
      mui.openWindow({
        id: "login.html",
        url: "login.html"
      });
    }
  });
document
  .getElementsByClassName("user-message")[0]
  .addEventListener("tap", function() {
    if (user_token()) {
      mui.openWindow({
        url: "personalInformation.html",
        id: "personalInformation.html"
      });
    } else {
      mui.openWindow({
        id: "login.html",
        url: "login.html"
      });
    }
  });
mui(".my-list-every-last").on("tap", ".center", function() {
  var text = this.innerText;
  var url;
  if (text == "关于我们") {
    mui.openWindow({
      id: "aboutUs.html",
      url: "aboutUs.html"
    });
  } else if (user_token()) {
    if (text === "我的订单") {
      url = "order.html";
    } else if (text == "购车订单") {
      url = "cartOrder.html";
    } else if (text === "我的评价") {
      url = "evaluate.html";
    } else if (text === "我的收藏") {
      url = "myCollection.html";
    } else if (text === "修改密码") {
      url = "centerChangePWD.html";
    } else if (text === "我的购物车") {
      url = "shoppingCart.html";
    }
    mui.openWindow({
      id: url,
      url: url
    });
  } else {
    mui.openWindow({
      id: "login.html",
      url: "login.html"
    });
  }
});
