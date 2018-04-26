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
mui.ajax(
  http_url + "/api.php/User/order?status=1&p=1&token=" + user_all_message.token,
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
var count = 2;
function pullupRefresh() {
  mui.ajax(
    http_url +
      "/api.php/User/order?status=" +
      1 +
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
