var wxchannel = null;
var alichannel = null;
var nowPage = null;
var orderPage = null; //订单页面
var child = []; //订单子页面
mui.plusReady(function() {
  // plus.webview.get
  nowPage = plus.webview.currentWebview();
  orderPage = plus.webview.getWebviewById("order.html");
  if (orderPage) {
    child = orderPage.children();
  }
  plus.payment.getChannels(
    function(channels) {
      for (i in channels) {
        if (channels[i].id == "wxpay") {
          wxchannel = channels[i];
        } else {
          alichannel = channels[i];
        }
      }
    },
    function(e) {}
  );
  nowPage.iscart ? (vm.iscart = 0) : (vm.iscart = 1);
  if (nowPage.is_cart) {
    vm.iscart = 0;
    plus.webview.close("paymentMessage.html");
    mui.ajax(
      http_url +
        "/api.php/Order/buycar_payment?token=" +
        user_all_message.token +
        "&id=" +
        nowPage.order_id,
      {
        dataType: "json",
        type: "get",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          apitoken: c("/api.php/Order/buycar_payment")
        },
        success: function(data) {
          if (data.status == 200) {
            vm.order_message = data.data;
          }
        },
        error: function(xhr, type, errorThrown) {
          //异常处理；ss
          console.log(errorThrown);
        }
      }
    );
  } else {
    if (plus.webview.getWebviewById("settlementPage.html"));
    {
      plus.webview.close("settlementPage.html");
    }
    mui.ajax(
      http_url +
        "/api.php/Order/payment?token=" +
        user_all_message.token +
        "&order_id=" +
        nowPage.order_id +
        "$iscart=" +
        vm.iscart,
      {
        dataType: "json",
        type: "get",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          apitoken: c("/api.php/Order/payment")
        },
        success: function(data) {
          if (data.status == 200) {
            vm.order_message = data.data.ordinfo;
          }
        },
        error: function(xhr, type, errorThrown) {
          //异常处理；ss
          console.log(errorThrown);
        }
      }
    );
  }
});
var vm = new Vue({
  el: "#app",
  data: {
    order_message: { ordinfo: {} },
    iscart: 0
  }
});
//选择支付方式;
var payment = "wxpay";
var alipayDom = document.querySelector(".alipay");
var wxpayDom = document.querySelector(".wechat");
function selectPayment(pay) {
  if (pay == "wxpay") {
    wxpayDom.classList.add("active");
    alipayDom.classList.remove("active");
  } else {
    wxpayDom.classList.remove("active");
    alipayDom.classList.add("active");
  }
  payment = pay;
}
//调起支付
function pay() {
  var data;
  var waiting = plus.nativeUI.showWaiting("正在支付", {
    width: "120px",
    height: "120px"
  });
  if (nowPage.is_cart) {
    data = {
      id: nowPage.order_id,
      pay_type: payment
    };
    if (payment == "alipay") {
      mui.ajax(
        http_url +
          "/api.php/Order/buycar_dopay?token=" +
          user_all_message.token,
        {
          type: "post",
          data: data,
          headers: { apitoken: c("/api.php/Order/buycar_dopay") },
          timeout: 10000,
          success: function(res) {
            plus.payment.request(
              alichannel,
              res,
              function(result) {
                waiting.close();
                mui.alert("支付成功!", "支付宝支付", function() {
                  jump_to_order();
                });
              },
              function(error) {
                waiting.close();
                mui.alert("支付失败!", "支付宝支付", function() {
                  jump_to_order();
                });
              }
            );
          },
          error: function(xhr, type, errorThrown) {
            waiting.close();
          }
        }
      );
    } else if (payment == "wxpay") {
      mui.ajax(
        http_url +
          "/api.php/Order/buycar_dopay?token=" +
          user_all_message.token,
        {
          dataType: "json",
          type: "post",
          data: data,
          headers: { apitoken: c("/api.php/Order/buycar_dopay") },
          timeout: 10000,
          success: function(res) {
            waiting.close();
            plus.payment.request(
              wxchannel,
              res,
              function(result) {
                waiting.close();
                mui.alert("支付成功!", "微信付款", function() {
                  jump_to_order();
                });
              },
              function(error) {
                waiting.close();
                mui.alert("支付失败!", "微信付款", function() {
                  jump_to_order();
                });
              }
            );
          },
          error: function(xhr, type, errorThrown) {
            waiting.close();
          }
        }
      );
    } else {
      return;
    }
  } else {
    data = {
      order_id: nowPage.order_id,
      pay_type: payment,
      iscart: vm.iscart
    };
    if (payment == "alipay") {
      mui.ajax(
        http_url + "/api.php/Order/dopay?token=" + user_all_message.token,
        {
          type: "post",
          data: data,
          headers: { apitoken: c("/api.php/Order/dopay") },
          timeout: 10000,
          success: function(res) {
            plus.payment.request(
              alichannel,
              res,
              function(result) {
                waiting.close();
                mui.alert("支付成功!", "支付宝支付", function() {
                  jump_to_order();
                });
              },
              function(error) {
                waiting.close();
                mui.alert("支付失败!", "支付宝支付", function() {
                  jump_to_order();
                });
              }
            );
          },
          error: function(xhr, type, errorThrown) {
            waiting.close();
          }
        }
      );
    } else if (payment == "wxpay") {
      mui.ajax(
        http_url + "/api.php/Order/dopay?token=" + user_all_message.token,
        {
          dataType: "json",
          type: "post",
          data: data,
          headers: { apitoken: c("/api.php/Order/dopay") },
          timeout: 10000,
          success: function(res) {
            waiting.close();
            plus.payment.request(
              wxchannel,
              res,
              function(result) {
                waiting.close();
                mui.alert("支付成功!", "微信付款", function() {
                  jump_to_order();
                });
              },
              function(error) {
                waiting.close();
                mui.alert("支付失败!", "微信付款", function() {
                  jump_to_order();
                });
              }
            );
          },
          error: function(xhr, type, errorThrown) {
            waiting.close();
          }
        }
      );
    } else {
      return;
    }
  }
}
mui(".action-bar-no-search").on("tap", ".title-left", function() {
  jump_to_order();
});
function jump_to_order() {
  if (nowPage.is_order) {
    for (i in child) {
      child[i].reload(true);
    }
    mui.back();
  } else {
    nowPage.close();
    mui.openWindow({
      url: "order.html",
      id: "order.html"
    });
  }
}
