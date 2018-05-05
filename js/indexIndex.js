// 精品区域
var carDOM = document.querySelector(".boutique-message");
//新闻容器
var newsDOM = document.querySelector(".news-message");
//商品容器
var goodsDOM = document.querySelector(".good-area");
var good_list = new Vue({
  el: "#app",
  data: {
    cars: [],
    goods: [],
    news: [],
    imgs: []
  },
  mounted: function() {
    // 初始化swiper
  }
});
mui.ajax(http_url + "/api.php/Index/index", {
  dataType: "json",
  type: "get",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    apitoken: c("/api.php/Index/index")
  },
  success: function(data) {
    good_list.cars = data.data.car;
    good_list.news = data.data.news;
    good_list.goods = data.data.goods;
  },
  error: function(xhr, type, errorThrown) {
    //异常处理；
    console.log(type);
  }
});
//  	广告图
mui.ajax(http_url + "/api.php/Adv/index?id=27", {
  dataType: "json",
  type: "get",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    apitoken: c("/api.php/Adv/index")
  },
  success: function(data) {
    if (data.status == 200) {
      good_list.imgs = data.data;
      var gallery = mui(".mui-slider");
      gallery.slider({
        interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
      });
    } else {
      toast(data.message);
    }
  },
  error: function(xhr, type, errorThrown) {}
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

function plusReady() {
  parent = plus.webview.currentWebview().parent(); //获取父窗口
}
if (window.plus) {
  plusReady();
} else {
  document.addEventListener("plusready", plusReady, false);
}
function captureImage() {
  mui.openWindow({
    url: "QRCode.html",
    id: "QRCode.html"
  });
}
// 打开弹出框并且打开遮罩
function openmore() {
  document.getElementById("popup").style.display = "block";
  document.getElementById("shade").style.display = "block";
}
//隐藏弹出框遮罩
function shadeHidden() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("shade").style.display = "none";
}
function ck(message) {
  plus.nativeUI.toast(message, { verticalAlign: "center" });
}
mui.plusReady(function() {});
// 初始化轮播图

mui(".mui-scroll-wrapper").scroll({
  indicators: false,
  deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});
mui("#mui-scroll-wrapper").scroll({
  scrollY: false,
  scrollX: true,
  indicators: false,
  deceleration: 0.0005
});
// 获取分类
var activity = document.getElementsByClassName("every-category");
for (var i = 0; i < activity.length; i++) {
  activity[i].index = i;
}

function every_last_goods(ids) {
  mui.openWindow({
    url: "goodDetail.html",
    id: "goodDetail.html",
    extras: {
      good_id: ids
    }
  });
}
//点击跳转
function jump_buycar() {
  parent.evalJS("changeView('buyCart.html')");
}
//点击跳转到新的页面
function jump_open_new_page(url) {
  mui.openWindow({
    url: url,
    id: url
  });
}
//弹出框中的点击跳转
mui("#popup").on("tap", ".popup-list", function() {
  var url;
  if (this.innerHTML.indexOf("我的订单") >= 0) {
    url = "order.html";
  } else if (this.innerHTML.indexOf("购物车") >= 0) {
    url = "shoppingCart.html";
  } else {
    url = "myCollection.html";
  }
  shadeHidden();
  mui.openWindow({
    url: url,
    id: url
  });
});
//父窗口
var parent;
mui(".category").on("tap", ".every-category", function() {
  if (this.index == 0) {
    parent.evalJS("changeView('buyCart.html')");
  } else if (this.index == 1) {
    mui.openWindow({
      url: "sellCart.html",
      id: "sellCart.html"
    });
  } else if (this.index == 2) {
    parent.evalJS("changeView('shoppingMall.html')");
  } else if (this.index == 3) {
    mui.openWindow({
      url: "news.html",
      id: "news.html"
    });
  } else if (this.index == 6) {
    mui.openWindow({
      url: "cartAssessment.html",
      id: "cartAssessment.html"
    });
  } else {
    ck("功能尚未开通，敬请期待！");
    // mui.openWindow({
    //     url: "publicationEvaluation.html",
    //     id: "publicationEvaluation.html",
    // })
  }
});
function jump_to_shoppingMall() {
  parent.evalJS("changeView('shoppingMall.html')");
}
//跳转到新闻详情页
function jump_to_new_detail(id) {
  mui.openWindow({
    url: "newsMessage.html",
    id: "newsMessage.html",
    extras: {
      message: id //扩展参数
    }
  });
}
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
