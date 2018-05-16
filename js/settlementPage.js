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
    goods: [],
    name: "",
    phone: "",
    address: "",
    address_detail: "",
    province: "",
    city: "",
    area: "",
    total: 0,
    goods_id: [],
    order_id: "",
    type: false,
    integral: 0
  }
});

mui(".mui-scroll-wrapper").scroll({
  deceleration: 0.0005,
  indicators: false //是否显示滚动条
});
//当前页面
var nowPage;
//支付通道
var channel = null;
mui.plusReady(function() {
  nowPage = plus.webview.currentWebview();
  //获取支付商品信息
  if (nowPage.one) {
    if (nowPage.spec_ids) {
      if (nowPage.type) {
        console.log(nowPage.type);
        var data = {
          goods_id: nowPage.goodId,
          num: nowPage.goodNum,
          spec_ids: nowPage.spec_ids,
          spec_names: nowPage.spec_names,
          buy_type: nowPage.type
        };
      } else {
        var data = {
          goods_id: nowPage.goodId,
          num: nowPage.goodNum,
          spec_ids: nowPage.spec_ids,
          spec_names: nowPage.spec_names
        };
      }
    } else {
      var data = {
        goods_id: nowPage.goodId,
        num: nowPage.goodNum,
        buy_type: nowPage.type
      };
    }
    mui.ajax(
      http_url + "/api.php/Order/addorder?token=" + user_all_message.token,
      {
        dataType: "json",
        type: "post",
        data: data,
        timeout: 10000,
        headers: { apitoken: c("/api.php/Order/addorder") },
        success: function(data) {
          if (data.status == 200) {
            vm.total = Number(data.data.total);
            vm.integral = Number(data.data.total_integral);
            vm.goods.push(data.data);
          } else {
            toast(data.message);
          }
        },
        error: function(xhr, type, errorThrown) {
          console.log(JSON.stringify(errorThrown));
        }
      }
    );
  } else {
    console.log(nowPage.goodNum);
    console.log(nowPage.goodId);
    mui.ajax(
      http_url + "/api.php/User/cartpay?token=" + user_all_message.token,
      {
        dataType: "json",
        type: "post",
        data: {
          ids: nowPage.goodId,
          nums: nowPage.goodNum
        },
        timeout: 10000,
        headers: { apitoken: c("/api.php/User/cartpay") },
        success: function(data) {
          if (data.status == 200) {
            vm.goods = data.data;
            console.log(JSON.stringify(data.data));
            for (var i = 0; i < vm.goods.length; i++) {
              if (vm.goods[i].integral_status == 1) {
                nowPage.type = "integral"; //如果商品中有购买类型为积分购买的则当前页面中的type属性改为integral
              }
              vm.total +=
                Number(vm.goods[i].shop_price) * vm.goods[i].goods_num;
              vm.integral +=
                Number(vm.goods[i].integral) * vm.goods[i].goods_num;
              vm.goods_id.push(vm.goods[i].goods_id);
              // alert(vm.goods_id);
            }
          } else {
            toast(data.message);
          }
        },
        error: function(xhr, type, errorThrown) {}
      }
    );
  }
  plus.payment.getChannels(
    function(channels) {
      channel = channels[0];
    },
    function(e) {}
  );
});

//点击微信支付
mui("#popup").on("tap", ".wechat", function() {
  pay("wxpay");
});
//点击支付宝支付
mui("#popup").on("tap", ".alipay", function() {
  pay("alipay");
});
//点击关闭支付弹框
mui("#popup").on("tap", ".close", function() {
  // popup.style.bottom = -11 + "rem";
  // mask.style.display = "none";
  mui.back();
});
var popup = document.getElementById("popup");
var mask = document.getElementById("mask");
mui(".bottom-nav").on("tap", ".bottom-nav-right", function() {
  if (!vm.name) {
    toast("请输入收货人姓名");
  } else if (!vm.address) {
    toast("请选择所在地区");
  } else if (!vm.address_detail) {
    toast("请输入详细地址");
  } else if (!reg_phone.test(vm.phone)) {
    toast("请输入正确手机号");
  } else {
    postPay();
  }
});
mask.addEventListener("tap", function() {
  // popup.style.bottom = -11 + "rem";
  // mask.style.display = "none";
  mui.back();
});
//发起支付请求
function postPay() {
  var waiting = plus.nativeUI.showWaiting("加载中", {
    width: "110px",
    height: "110px"
  });
  if (nowPage.one) {
    if (nowPage.spec_ids) {
      if (nowPage.type) {
        var data = {
          goods_id: nowPage.goodId,
          num: nowPage.goodNum,
          spec_ids: nowPage.spec_ids,
          spec_names: nowPage.spec_names,
          truename: vm.name,
          mobile: vm.phone,
          province: vm.province,
          city: vm.city,
          area: vm.area,
          address: vm.address_detail,
          buy_type: nowPage.type
        };
      } else {
        var data = {
          goods_id: nowPage.goodId,
          num: nowPage.goodNum,
          spec_ids: nowPage.spec_ids,
          spec_names: nowPage.spec_names,
          truename: vm.name,
          mobile: vm.phone,
          province: vm.province,
          city: vm.city,
          area: vm.area,
          address: vm.address_detail
        };
      }
    } else {
      if (nowPage.type) {
        var data = {
          goods_id: nowPage.goodId,
          num: nowPage.goodNum,
          spec_ids: "",
          spec_names: "",
          truename: vm.name,
          mobile: vm.phone,
          province: vm.province,
          city: vm.city,
          area: vm.area,
          address: vm.address_detail,
          buy_type: nowPage.type
        };
      } else {
        var data = {
          goods_id: nowPage.goodId,
          num: nowPage.goodNum,
          spec_ids: "",
          spec_names: "",
          truename: vm.name,
          mobile: vm.phone,
          province: vm.province,
          city: vm.city,
          area: vm.area,
          address: vm.address_detail
        };
      }
    }
    mui.ajax(
      http_url + "/api.php/Order/saveorder?token=" + user_all_message.token,
      {
        dataType: "json",
        type: "post",
        data: data,
        headers: { apitoken: c("/api.php/Order/saveorder") },
        timeout: 10000,
        success: function(data) {
          waiting.close();
          if (data.status == 200) {
            console.log(JSON.stringify(data));
            // vm.order_id = data.data.order_id;
            mui.openWindow({
              url: "payment.html",
              id: "payment.html",
              extras: {
                order_id: data.data.order_id,
                iscart: nowPage.one
              }
            });
          } else {
            toast(data.message);
          }
        },
        error: function(xhr, type, errorThrown) {
          waiting.close();
        }
      }
    );
  } else {
    var shoppingCartData = {};
    if (nowPage.type) {
      shoppingCartData = {
        ids: nowPage.goodId,
        nums: nowPage.goodNum,
        truename: vm.name,
        mobile: vm.phone,
        province: vm.province,
        city: vm.city,
        area: vm.area,
        address: vm.address_detail,
        goods_id: 1,
        buy_type: nowPage.type
      };
    } else {
      shoppingCartData = {
        ids: nowPage.goodId,
        nums: nowPage.goodNum,
        truename: vm.name,
        mobile: vm.phone,
        province: vm.province,
        city: vm.city,
        area: vm.area,
        address: vm.address_detail,
        goods_id: 1
      };
    }
    mui.ajax(
      http_url + "/api.php/User/cartsave?token=" + user_all_message.token,
      {
        dataType: "json",
        type: "post",
        data: shoppingCartData,
        headers: { apitoken: c("/api.php/User/cartsave") },
        timeout: 10000,
        success: function(data) {
          waiting.close();
          if (data.status == 200) {
            console.log(JSON.stringify(data));
            // vm.order_id = data.data.order_id;
            mui.openWindow({
              url: "payment.html",
              id: "payment.html",
              extras: {
                order_id: data.data.order_id,
                iscart: nowPage.one
              }
            });
          } else {
            toast(data.message);
          }
        },
        error: function(xhr, type, errorThrown) {
          waiting.close();
        }
      }
    );
  }
}

//调起支付
function pay(pay) {
  var iscart = 0;
  if (nowPage.one) {
    iscart = 0;
  } else {
    iscart = 1;
  }
  if (pay == "alipay") {
    mui.ajax(
      http_url + "/api.php/Order/dopay?token=" + user_all_message.token,
      {
        type: "post",
        data: {
          order_id: vm.order_id,
          pay_type: pay,
          iscart: iscart
        },
        headers: { apitoken: c("/api.php/Order/dopay") },
        timeout: 10000,
        success: function(res) {
          console.log(res);
          plus.payment.request(
            channel,
            res,
            function(result) {
              plus.nativeUI.alert("支付成功！", function() {
                back();
              });
            },
            function(error) {
              plus.nativeUI.alert("支付失败：" + error.code);
            }
          );
        },
        error: function(xhr, type, errorThrown) {
          console.log(xhr);
          console.log(type);
          console.log(errorThrown);
        }
      }
    );
  } else if (pay == "wxpay") {
    mui.ajax(
      http_url + "/api.php/Order/dopay?token=" + user_all_message.token,
      {
        dataType: "json",
        type: "post",
        data: {
          order_id: vm.order_id,
          pay_type: pay,
          iscart: iscart
        },
        headers: { apitoken: c("/api.php/Order/dopay") },
        timeout: 10000,
        success: function(res) {
          console.log(JSON.stringify(res));
          plus.payment.request(
            channel,
            res,
            function(result) {
              plus.nativeUI.alert("支付成功！", function() {
                back();
              });
            },
            function(error) {
              plus.nativeUI.alert("支付失败：" + error.code);
            }
          );
        },
        error: function(xhr, type, errorThrown) {}
      }
    );
  } else {
    return;
  }
  // var xhr = new XMLHttpRequest();
  // xhr.onreadystatechange = function () {

  //     switch (xhr.readyState) {
  //         case 4:
  //             if (xhr.status == 200) {
  //                 console.log(JSON.stringify(xhr));

  //             } else {
  //                 alert("获取订单信息失败！");
  //             }
  //             break;
  //         default:
  //             break;
  //     }
  // }
  // xhr.open('GET', PAYSERVER);
  // xhr.send();
}
