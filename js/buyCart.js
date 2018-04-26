mui.init({
  pullRefresh: {
    container: "#app",
    up: {
      contentrefresh: "正在加载...",
      callback: pullupRefresh
    }
  }
});
var vm = new Vue({
  el: "#app",
  data: {
    imgs: [],
    cars: [],
    price: false,
    time: false,
    kilometre: false,
    price_data: "",
    time_data: "",
    kilometre_data: "",
    is_price: -1,
    is_time: -1,
    is_kilometre: -1,
    all: true
  }
});
var mySwiper = new Swiper(".swiper-container", {
  autoplay: true,
  autoplayDisableOnInteraction: false, //用户使用后是否停止轮播；
  observer: true, //修改swiper自己或子元素时，自动初始化swiper
  observeParents: false, //修改swiper的父元素时，自动初始化swiper
  // 如果需要分页器
  pagination: {
    el: ".swiper-pagination"
  }
});
//  	广告图
mui.ajax(http_url + "/api.php/Adv/index?id=28", {
  dataType: "json",
  type: "get",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    apitoken: c("/api.php/Adv/index")
  },
  success: function(data) {
    if (data.status == 200) {
      vm.imgs = data.data;
    } else {
      toast(data.message);
    }
  },
  error: function(xhr, type, errorThrown) {}
});
//  	数据接口
mui.ajax(http_url + "/api.php/Buycar/index", {
  dataType: "json",
  type: "get",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    apitoken: c("/api.php/Buycar/index")
  },
  success: function(data) {
    if (data.status == 200) {
      vm.cars = data.data;
    } else {
      toast(data.message);
    }
  },
  error: function(xhr, type, errorThrown) {}
});
//跳转到汽车详情页面
function jump_to_detail(id) {
  mui.openWindow({
    url: "cartDetail.html",
    id: "cartDetail.html",
    extras: {
      good_id: id
    }
  });
}

var gallery = mui(".mui-slider");
gallery.slider({
  interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
});
// 价格筛选
//价格筛选true代表由高到低
var price_data = "";
function select_price() {
  vm.all = false;
  vm.price = !vm.price;
  vm.is_time = -1;
  vm.is_kilometre = -1;
  if (vm.price) {
    price_data = "price-asc";
    vm.is_price = 1;
  } else {
    price_data = "price-desc";
    vm.is_price = 0;
  }
  nowClass = price_data;
  mui.ajax(http_url + "/api.php/Buycar/index?ord=" + price_data, {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/Buycar/index")
    },
    success: function(data) {
      if (data.status == 200) {
        count = 2;
        vm.cars = data.data;
      } else {
        toast(data.message);
      }
    },
    error: function(xhr, type, errorThrown) {}
  });
}
//时间筛选
//时间筛选true代表由高到低
var time_data = "";
function select_time() {
  vm.all = false;
  vm.time = !vm.time;
  vm.is_price = -1;
  vm.is_kilometre = -1;
  if (vm.time) {
    time_data = "bid-asc";
    vm.is_time = 1;
  } else {
    time_data = "bid-desc";
    vm.is_time = 0;
  }
  nowClass = time_data;
  mui.ajax(http_url + "/api.php/Buycar/index?ord=" + time_data, {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/Buycar/index")
    },
    success: function(data) {
      if (data.status == 200) {
        count = 2;
        vm.cars = data.data;
      } else {
        toast(data.message);
      }
    },
    error: function(xhr, type, errorThrown) {}
  });
}
//公里数筛选
//时间筛选true代表由高到底
var milometre_data = "";
function select_kilometre() {
  vm.all = false;
  vm.is_price = -1;
  vm.is_time = -1;
  vm.kilometre = !vm.kilometre;
  if (vm.kilometre) {
    milometre_data = "bxlc-asc";
    vm.is_kilometre = 1;
  } else {
    milometre_data = "bxlc-desc";
    vm.is_kilometre = 0;
  }
  nowClass = milometre_data;
  mui.ajax(http_url + "/api.php/Buycar/index?ord=" + milometre_data, {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/Buycar/index")
    },
    success: function(data) {
      if (data.status == 200) {
        count = 2;
        vm.cars = data.data;
      } else {
        toast(data.message);
      }
    },
    error: function(xhr, type, errorThrown) {}
  });
}
function get_all() {
  if (vm.all) return;
  vm.all = true;
  vm.is_price = -1;
  vm.is_time = -1;
  vm.is_kilometre = -1;
  nowClass = null;
  mui.ajax(http_url + "/api.php/Buycar/index", {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/Buycar/index")
    },
    success: function(data) {
      if (data.status == 200) {
        count = 2;
        vm.cars = data.data;
      } else {
        toast(data.message);
      }
    },
    error: function(xhr, type, errorThrown) {}
  });
}
var count = 2;
var nowClass = null;
//上拉加载
function pullupRefresh() {
  if (nowClass != null) {
    mui.ajax(
      http_url + "/api.php/Buycar/index?ord=" + nowClass + "&p=" + count,
      {
        dataType: "json",
        type: "get",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          apitoken: c("/api.php/Buycar/index")
        },
        success: function(data) {
          if (data.status == 200) {
            vm.cars = vm.cars.concat(data.data);
            count++;
            if (data.data.length == 0) {
              mui("#app")
                .pullRefresh()
                .disablePullupToRefresh();
              mui("#app")
                .pullRefresh()
                .endPullupToRefresh(true);
            } else {
              mui("#app")
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
  } else {
    mui.ajax(http_url + "/api.php/Buycar/index?p=" + count, {
      dataType: "json",
      type: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        apitoken: c("/api.php/Buycar/index")
      },
      success: function(data) {
        if (data.status == 200) {
          vm.cars = vm.cars.concat(data.data);
          count++;
          if (data.data.length == 0) {
            mui("#app")
              .pullRefresh()
              .disablePullupToRefresh();
            mui("#app")
              .pullRefresh()
              .endPullupToRefresh(true);
          } else {
            mui("#app")
              .pullRefresh()
              .endPullupToRefresh(false);
          }
        } else {
          toast(data.message);
        }
      },
      error: function(xhr, type, errorThrown) {}
    });
  }
}
