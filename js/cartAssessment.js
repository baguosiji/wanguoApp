request_url = "/api.php/Salecar/car_brand";
mui.ajax(http_url + "/api.php/Salecar/car_brand", {
  dataType: "json",
  type: "get",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    apitoken: c("/api.php/Salecar/car_brand")
  },
  success: function(data) {
    vm.cart = data.data;
  },
  error: function(xhr, type, errorThrown) {
    //异常处理；ss
  }
});
var vm = new Vue({
  el: "#app",
  data: {
    name: "",
    phone: "",
    distance: "",
    cart: [],
    selectCart: []
  }
});
mui.plusReady(function() {
  mui("#app").on("tap", "#date", function() {
    pickDate(this);
  });
});
// 选择日期
function pickDate(data) {
  plus.nativeUI.pickDate(
    function(e) {
      var d = e.date;
      data.querySelector("#date>input").placeholder =
        d.getFullYear() + "-" + (d.getMonth() + 1);
    },
    function(e) {}
  );
}
var selectCart;
var cartType;
//选择汽车类型
function selectCartType(e) {
  var index = e.selectedIndex;
  cartType = e.options[index].text;
}
// 选择汽车品牌
function selectCarts(e) {
  var index = e.selectedIndex;
  selectCart = e.options[index].text;
  mui.ajax(http_url + "/api.php/Salecar/car_series?b_id=" + e.value, {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/Salecar/car_series")
    },
    success: function(data) {
      vm.selectCart = [];
      vm.selectCart = data.data;
    },
    error: function(xhr, type, errorThrown) {
      //异常处理；ss
    }
  });
}
var dateShow = document.querySelector("#date>input");
var car_type = document.getElementById("car-type");
//提交信息
var phoneNumber = /^[1][3,4,5,7,8][0-9]{9}$/; //电话号码验证
var sixNumber = /^\d{6}$/; //六位数验证
function submit() {
  if (!vm.name) {
    toast("请输入您的姓名");
  } else if (!phoneNumber.test(vm.phone)) {
    toast("请输入正确手机号码");
  } else if (!vm.distance) {
    toast("请输入您的行使公里数");
  } else if (
    selectCart == "汽车品牌" ||
    cartType == "汽车类型" ||
    !selectCart ||
    !cartType
  ) {
    toast("请选择您的车型");
  } else if (dateShow.placeholder == "请选择上牌时间") {
    toast("请选择您的上牌时间");
  } else {
    mui.ajax(http_url + "/api.php/Salecar/add", {
      data: {
        sale_type: 0,
        truename: vm.name,
        mobile: vm.phone,
        brand_name: selectCart,
        series_name: cartType,
        car_date: dateShow.placeholder,
        mileage: vm.distance
      },
      dataType: "json",
      headers: { apitoken: c("/api.php/Salecar/add") },
      type: "post",
      timeout: 10000,
      success: function(data) {
        mui.alert(data.message, "提交成功,稍后会员专员联系您", function() {
          mui.back();
        });
      },
      error: function(xhr, type, errorThrown) {
        //异常处理；ss
      }
    });
  }
}
