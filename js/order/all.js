var vm = new Vue({
  el: "#app",
  data: {
    orders: [],
    integral: 0
  }
});
mui.init({
  swipeBack: false,
  keyEventBind: {
    backbutton: false //关闭back按键监听
  },
  pullRefresh: {
    container: "#pullrefresh",
    down: {
      height: 50, //可选,默认50.触发下拉刷新拖动距离,
      contentdown: "下拉刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
      contentover: "释放更新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
      contentrefresh: "加载中...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内
      callback: pulldown
    },
    up: {
      contentrefresh: "加载中...",
      callback: pullupRefresh
    }
  }
});
//订单状态显示文字
function show_text(status, num) {
  if (status == 0) {
    return "等待买家付款";
  } else if (status == 1) {
    return "买家已付款，等待卖家发货";
  } else if (status == 2) {
    return "卖家已发货，等待买家确认";
  } else if (status == 3 && num == 1) {
    return "交易成功";
  } else if (status == 3 && num == 0) {
    return "待评价";
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
function pulldown() {
  mui.ajax(
    http_url + "/api.php/User/order?p=1&token=" + user_all_message.token,
    {
      dataType: "json",
      type: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        apitoken: c("/api.php/User/order")
      },
      success: function(data) {
        if (data.status == 200) {
          vm.orders = data.data;
          count = 2;
        } else {
          toast(data.message);
        }
        mui("#pullrefresh")
          .pullRefresh()
          .endPulldownToRefresh();
      },
      error: function(xhr, type, errorThrown) {
        mui("#pullrefresh")
          .pullRefresh()
          .endPulldownToRefresh();
      }
    }
  );
}
mui.ajax(http_url + "/api.php/User/order?p=1&token=" + user_all_message.token, {
  dataType: "json",
  type: "get",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    apitoken: c("/api.php/User/order")
  },
  success: function(data) {
    if (data.status == 200) {
      vm.orders = data.data;
    } else {
      toast(data.message);
    }
  },
  error: function(xhr, type, errorThrown) {}
});
//查询用户积分
mui.ajax(http_url + "/api.php/User/integral?token=" + user_all_message.token, {
  dataType: "json",
  type: "get",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    apitoken: c("/api.php/User/integral")
  },
  success: function(data) {
    if (data.status == 200) {
      vm.integral = Number(data.data);
    }
  },
  error: function(xhr, type, errorThrown) {
    //异常处理；ss
    console.log(errorThrown);
  }
});
var orderPage = null; //订单页面
var child = []; //订单子页面
mui.plusReady(function() {
  orderPage = plus.webview.getWebviewById("order.html");
  child = orderPage.children();
});

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
      "/api.php/User/order?p=" +
      count +
      "&token=" +
      user_all_message.token,
    {
      dataType: "json",
      type: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        apitoken: c("/api.php/User/order")
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
function jump_to_good_detial(id, num) {
  if (Number(num) > 0) {
    var extras = {
      good_id: id,
      type: "integral"
    };
  } else {
    var extras = {
      good_id: id
    };
  }
  mui.openWindow({
    url: "../goodDetail.html",
    id: "goodDetail.html",
    extras: extras
  });
}
//跳转到物流页面
function jump_to_logistics(url, id) {
  mui.openWindow({
    url: "../logistics.html",
    id: "../logistics.html",
    extras: {
      img: url,
      order_id: id
    }
  });
}
//点击跳转到支付页面
function jump_to_payment(id, num) {
  console.log(num);
  console.log(vm.integral);
  if (Number(num) > vm.integral) {
    toast("您的积分不足");
    return;
  }
  mui.openWindow({
    url: "../payment.html",
    id: "../payment.html",
    extras: {
      order_id: id,
      is_order: true,
      iscart: true
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
            for (i in child) {
              child[i].reload(true);
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
              for (i in child) {
                child[i].reload(true);
              }
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
