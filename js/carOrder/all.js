var vm = new Vue({
  el: "#app",
  data: {
    orders: []
  }
});
mui.init({
  swipeBack: false,
  keyEventBind: {
    backbutton: false //关闭back按键监听
  },
  pullRefresh: {
    container: "#pullrefresh",
    up: {
      contentrefresh: "正在加载...",
      callback: pullupRefresh
    }
  }
});
//订单状态显示文字
function show_text(status) {
  if (status == 0) {
    return "等待买家付款";
  } else if (status == 1) {
    return "买家已付款，等待卖家发货";
  } else if (status == 2) {
    return "卖家已发货，等待买家确认";
  } else {
    return "交易成功";
  }
  // switch (status) {
  //     case 0:
  //         return "等待买家付款";
  //         break;
  //     case 1:
  //         return "买家已付款，等待卖家发货";
  //         break;
  //     case 2:
  //         return "卖家已发货,等待买家确认";
  //         break;
  //     case 3:
  //         return "待评价";
  //         break;
  // }
}
mui.ajax(
  http_url + "/api.php/User/buycar?p=1&token=" + user_all_message.token,
  {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/User/buycar")
    },
    success: function(data) {
      if (data.status == 200) {
        vm.orders = data.data;
      } else {
        toast(data.message);
      }
    },
    error: function(xhr, type, errorThrown) {}
  }
);
window.onload = function() {
  mui.plusReady(function() {});
};
// mui('.mui-scroll-wrapper').scroll({
//     deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
//     indicators: false
// });
//跳转到换货页面
// mui(".every-last-order").on("tap", ".more", function () {
//     mui.openWindow({
//         url: "../selectService.html",
//         id: "../selectService.html",
//     })
// })
var count = 2;
function pullupRefresh() {
  mui.ajax(
    http_url +
      "/api.php/User/buycar?p=" +
      count +
      "&token=" +
      user_all_message.token,
    {
      dataType: "json",
      type: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        apitoken: c("/api.php/User/buycar")
      },
      success: function(data) {
        if (data.status == 200) {
          count++;
          vm.orders = vm.orders.concat(data.data);
          if (data.data.length == 0) {
            mui("#pullrefresh")
              .pullRefresh()
              .disablePullupToRefresh();
            mui("#pullrefresh")
              .pullRefresh()
              .endPullupToRefresh(true);
          } else {
            mui("#pullrefresh")
              .pullRefresh()
              .endPullupToRefresh(false);
          }
        } else {
          toast(data.message);
        }
      },
      error: function(xhr, type, errorThrown) {}
    }
  );
}
//跳转到评价页面
function jump_to_evaluate(order_id, goods_id) {
  mui.openWindow({
    url: "../publicationEvaluation.html",
    id: "../publicationEvaluation.html",
    extras: {
      order_id: order_id,
      good_id: goods_id
    }
  });
}
// 跳转到商品详情页面
function jump_to_good_detial(id) {
  mui.openWindow({
    url: "../cartDetail.html",
    id: "../cartDetail.html",
    extras: {
      good_id: id
    }
  });
}

//点击跳转到支付页面
function jump_to_payment(id) {
  mui.openWindow({
    url: "../payment.html",
    id: "../payment.html",
    extras: {
      order_id: id,
      is_cart: true,
      is_order: true
    }
  });
}
//点击删除订单
function tap_delect_goods(id) {
  mui.confirm("确认删除订单?", "您正在进行删除操作", ["取消", "确认"], function(
    e
  ) {
    if (e.index == 1) {
      mui.ajax(
        http_url +
          "/api.php/Order/delord?token=" +
          user_all_message.token +
          "&order_id=" +
          id,
        {
          dataType: "json",
          type: "get",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            apitoken: c("/api.php/Order/delord")
          },
          success: function(data) {
            toast(data.message);
            if (plus.webview.currentWebview("order/pendingPayment.html")) {
              plus.webview
                .currentWebview("order/pendingPayment.html")
                .reload(true);
            }
          },
          error: function(xhr, type, errorThrown) {}
        }
      );
    }
  });
}
//确认收货页面
function goods_to_be_received(id) {
  mui.confirm("确认收货?", "收货操作", ["取消", "确认"], function(e) {
    if (e.index == 1) {
      mui.ajax(
        http_url +
          "/api.php/Order/receipt?token=" +
          user_all_message.token +
          "&order_id=" +
          id,
        {
          dataType: "json",
          type: "get",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            apitoken: c("/api.php/Order/receipt")
          },
          success: function(data) {
            if (data.status == 200) {
              toast(data.message);
              plus.webview.currentWebview().reload(true);
            } else {
              toast(data.message);
            }
          },
          error: function(xhr, type, errorThrown) {}
        }
      );
    }
  });
}
