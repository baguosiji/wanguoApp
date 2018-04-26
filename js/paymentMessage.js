(function($, doc) {
  $.init();
  $.ready(function() {
    /**
     * 获取对象属性的值
     * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
     * @param {Object} obj 对象
     * @param {String} param 属性名
     */
    var _getParam = function(obj, param) {
      return obj[param] || "";
    };
    //-----------------------------------------
    //					//级联示例
    var cityPicker3 = new $.PopPicker({
      layer: 3
    });
    cityPicker3.setData(cityData3);
    var showCityPickerButton = doc.getElementById("showCityPicker3");
    showCityPickerButton.addEventListener(
      "tap",
      function(event) {
        cityPicker3.show(function(items) {
          vm.address =
            _getParam(items[0], "text") +
            " " +
            _getParam(items[1], "text") +
            " " +
            _getParam(items[2], "text");
          vm.province = _getParam(items[0], "text");
          vm.city = _getParam(items[1], "text");
          vm.area = _getParam(items[2], "text");
          //返回 false 可以阻止选择框的关闭
          //return false;
        });
      },
      false
    );
  });
})(mui, document);
var vm = new Vue({
  el: "#app",
  data: {
    order: {},
    name: "",
    phone: "",
    address: "",
    address_detail: "",
    province: "",
    city: "",
    area: ""
  }
});
var nowPage;
mui.plusReady(function() {
  nowPage = plus.webview.currentWebview();
  console.log(nowPage.bid);
  mui.ajax(
    http_url +
      "/api.php/Order/buycar_add?token=" +
      user_all_message.token +
      "&bid=" +
      nowPage.bid,
    {
      dataType: "json",
      type: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        apitoken: c("/api.php/Order/buycar_add")
      },
      success: function(data) {
        if (data.status == 200) {
          vm.order = data.data;
        }
      },
      error: function(xhr, type, errorThrown) {
        //异常处理；ss
        console.log(errorThrown);
      }
    }
  );
});
//跳转到支付页面
function jump_to_payment() {
  if (!vm.name) {
    toast("请输入收货人姓名");
  } else if (!vm.address) {
    toast("请选择所在地区");
  } else if (!vm.address_detail) {
    toast("请输入详细地址");
  } else if (!reg_phone.test(vm.phone)) {
    toast("请输入正确手机号");
  } else {
    mui.ajax(
      http_url + "/api.php/Order/buycar_add?token=" + user_all_message.token,
      {
        dataType: "json",
        type: "post",
        data: {
          bid: vm.order.bid,
          btitle: vm.order.title,
          truename: vm.name,
          mobile: vm.phone,
          province: vm.province,
          city: vm.city,
          area: vm.area,
          address: vm.address_detail
        },
        headers: { apitoken: c("/api.php/Order/buycar_add") },
        timeout: 10000,
        success: function(data) {
          if (data.status == 200) {
            console.log(JSON.stringify(data));
            mui.openWindow({
              url: "payment.html",
              id: "payment.html",
              extras: {
                order_id: data.data.id,
                is_cart: true
              }
            });
          }
        },
        error: function(xhr, type, errorThrown) {
          //异常处理；ss
          console.log(errorThrown);
        }
      }
    );
  }
}
