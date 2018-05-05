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

var count = 2;
mui.ajax(
  http_url +
    "/api.php/User/order?status=3" +
    "&comment=0" +
    "&p=1" +
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
        vm.orders = data.data;
      } else {
        toast(data.message);
      }
    },
    error: function(xhr, type, errorThrown) {}
  }
);

function pulldown() {
  mui.ajax(
    http_url +
      "/api.php/User/order?status=3" +
      "&comment=0" +
      "&p=1" +
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
          count = 2;
          vm.orders = data.data;
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
// mui('.mui-scroll-wrapper').scroll({
//     deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
//     indicators: false
// });
//跳转到换货页面
mui(".every-last-order").on("tap", ".more", function() {
  mui.openWindow({
    url: "../selectService.html",
    id: "../selectService.html"
  });
});
function pullupRefresh() {
  mui.ajax(
    http_url +
      "/api.php/User/order?status=" +
      3 +
      "&comment=0" +
      "&p=" +
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
    url: "../goodDetail.html",
    id: "goodDetail.html",
    extras: {
      good_id: id
    }
  });
}
