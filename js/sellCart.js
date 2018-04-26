var vm = new Vue({
  el: "#app",
  data: {
    imgs: []
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
mui.ajax(http_url + "/api.php/Adv/index?id=29", {
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
mui(".mui-scroll-wrapper").scroll({
  deceleration: 0.0005
});
mui(".operation-button").on("tap", ".operation-button-sell", function() {
  mui.openWindow({
    url: "sellCartMessage.html",
    id: "sellCartMessage.html"
  });
});
mui(".operation-button").on("tap", ".operation-button-assessment", function() {
  mui.openWindow({
    url: "cartAssessment.html",
    id: "cartAssessment.html"
  });
});
