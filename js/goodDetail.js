var vm = new Vue({
  el: "#container",
  data: {
    goodMessage: { goods_images: [] },
    goodData: { sec_list: { spec: [] } },
    buy_num: 1,
    good_spec: {},
    img_load: false,
    payType: false,
    user_integral: 0
  }
});
//图片是否加载完毕
// document.getElementById("imgs").onload = function () {
//     img_load = true;
// }
var gallery = mui(".mui-slider");
gallery.slider({
  interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
});
var collection_good = document.getElementById("collection");
//在details页面接收id参数
var firstImage; //轮播图的第一张图片
var lastImage; //轮播图的最后一张图片
mui.plusReady(function() {
  var id = plus.webview.currentWebview().good_id;
  if (plus.webview.currentWebview().type) {
    vm.payType = true;
  }
  console.log(http_url + "/api.php/Mall/details?id=" + id);
  mui.ajax(http_url + "/api.php/Mall/details?id=" + id, {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/Mall/details")
    },
    success: function(data) {
      console.log(JSON.stringify(data.data.info));
      vm.goodMessage = data.data.info;
      document.getElementById("contents").innerHTML =
        data.data.info.goods_content;
      firstImage = data.data.info.goods_images[0];
      lastImage = data.data.info.goods_images.pop();
      vm.goodData = data.data;
      if (data.data.addFav == 1) {
        collection_good.querySelector(".text").innerText = "已收藏";
        collection_good.querySelectorAll("p")[0].style.color = "red";
        collection_good.querySelectorAll("p")[1].style.color = "red";
      } else {
        collection_good.querySelector(".text").innerText = "收藏";
        collection_good.querySelectorAll("p")[0].style.color = "#666";
        collection_good.querySelectorAll("p")[1].style.color = "#666";
      }
      // document.getElementById("good-message-list").innerHTML = vm.goodMessage.goods_content;
    },
    error: function(xhr, type, errorThrown) {
      //异常处理；ss
      console.log(errorThrown);
    }
  });

  //查询用户积分
  mui.ajax(
    http_url + "/api.php/User/integral?token=" + user_all_message.token,
    {
      dataType: "json",
      type: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        apitoken: c("/api.php/User/integral")
      },
      success: function(data) {
        if (data.status == 200) {
          vm.user_integral = Number(data.data);
        }
      },
      error: function(xhr, type, errorThrown) {
        //异常处理；ss
        console.log(errorThrown);
      }
    }
  );
});

//点击选择商品分类
var rememberId = [];
function selectType(index, id, e) {
  if (e.currentTarget.parentNode.index == index) {
    e.currentTarget.parentNode.childNodes;
    for (var i = 0; i < e.currentTarget.parentNode.childNodes.length; i++) {
      e.currentTarget.parentNode.childNodes[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
  } else {
    e.currentTarget.parentNode.index = index;
    e.currentTarget.classList.add("active");
  }
  rememberId[index] = id;
  var text = "";
  for (var j = 0; j < rememberId.length; j++) {
    if (j + 1 == rememberId.length) {
      text += rememberId[j];
    } else {
      text += rememberId[j] + "_";
    }
  }
  if (vm.goodData.sec_list.spec.length == rememberId.length) {
    for (i in vm.goodData.sec_list.spec_val) {
      if (vm.goodData.sec_list.spec_val[i].spec_ids == text) {
        vm.good_spec = vm.goodData.sec_list.spec_val[i];
        console.log(JSON.stringify(vm.good_spec));
      }
    }
    // vm.good_spec = vm.goodData.sec_list.spec_val.find(function (every) {
    //     return every.spec_ids == text;
    // })
  }
}
//初始化input value值;
var popup = document.getElementById("popup");
var mask = document.getElementById("mask");
// 购买数量添加
mui(".popup").on("tap", ".add", function() {
  if (vm.buy_num >= vm.good_spec.store_count) {
    toast("库存不足");
  } else {
    vm.buy_num++;
  }
});
//购买数量减少
mui(".popup").on("tap", ".remove", function() {
  if (vm.buy_num > 1) {
    vm.buy_num--;
  }
});
function call_serve() {
  mui.confirm(
    "请联系客服：400-0998-058",
    "万国提示",
    ["取消", "确认"],
    function(num) {
      if (num.index == 1) {
        window.location.href = "tel:400-0998-058";
      }
    }
  );
}
//点击选择收藏商品
function collections(e) {
  var eTarget = e.currentTarget;
  var id = vm.goodMessage.goods_id;
  if (!user_token()) {
    toast("请登录");
    return;
  } else if (e.currentTarget.querySelector(".text").innerText == "收藏") {
    mui.ajax(
      http_url +
        "/api.php/Mall/add_collect?id=" +
        id +
        "&token=" +
        user_all_message.token,
      {
        dataType: "json",
        type: "get",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          apitoken: c("/api.php/Mall/add_collect")
        },
        success: function(data) {
          toast(data.message);
          if (data.status == 200) {
            eTarget.querySelector(".text").innerText = "已收藏";
            eTarget.querySelectorAll("p")[0].style.color = "red";
            eTarget.querySelectorAll("p")[1].style.color = "red";
          }
        },
        error: function(xhr, type, errorThrown) {
          //异常处理；ss
          console.log(errorThrown);
        }
      }
    );
  } else {
    request_url = "/api.php/Mall/del_collect";
    mui.ajax(
      http_url +
        "/api.php/Mall/del_collect?id=" +
        id +
        "&token=" +
        user_all_message.token,
      {
        dataType: "json",
        type: "get",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          apitoken: c("/api.php/Mall/del_collect")
        },
        success: function(data) {
          toast(data.message);
          if (data.status == 200) {
            eTarget.querySelector(".text").innerText = "收藏";
            eTarget.querySelectorAll("p")[0].style.color = "#666";
            eTarget.querySelectorAll("p")[1].style.color = "#666";
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

//跳转到结算页面
mui(".popup-bottom").on("tap", ".buy", function() {
  console.log(vm.user_integral);
  console.log(vm.goodMessage.integral);
  if (user_token()) {
    if (!vm.goodData.sec_list.spec) {
      if (vm.buy_num > vm.goodMessage.store_num) {
        toast("库存不足");
      } else if (!vm.payType) {
        popup.style.bottom = -14 + "rem";
        mask.style.display = "none";
        mui.openWindow({
          url: "settlementPage.html",
          id: "settlementPage.html",
          extras: {
            goodId: vm.goodMessage.goods_id,
            goodNum: vm.buy_num,
            one: true,
            type: plus.webview.currentWebview().type
          }
        });
      } else if (
        vm.user_integral < Number(vm.goodMessage.integral * vm.buy_num)
      ) {
        toast("您的积分不足");
      } else {
        console.log("?????sdfsdfds");
        popup.style.bottom = -14 + "rem";
        mask.style.display = "none";
        mui.openWindow({
          url: "settlementPage.html",
          id: "settlementPage.html",
          extras: {
            goodId: vm.goodMessage.goods_id,
            goodNum: vm.buy_num,
            one: true,
            type: plus.webview.currentWebview().type
          }
        });
      }
    } else if (!vm.good_spec.id) {
      toast("请选择商品规格");
    } else if (vm.buy_num > vm.good_spec.store_count) {
      toast("库存不足");
    } else if (!vm.payType) {
      popup.style.bottom = -14 + "rem";
      mask.style.display = "none";
      mui.openWindow({
        url: "settlementPage.html",
        id: "settlementPage.html",
        extras: {
          goodId: vm.goodMessage.goods_id,
          goodNum: vm.buy_num,
          spec_ids: vm.good_spec.spec_ids ? vm.good_spec.spec_ids : "",
          spec_names: vm.good_spec.spec_names ? vm.good_spec.spec_names : "",
          one: true
        }
      });
    } else if (vm.user_integral < Number(vm.good_spec.integral * vm.buy_num)) {
      toast("您的积分不足");
    } else {
      popup.style.bottom = -14 + "rem";
      mask.style.display = "none";
      mui.openWindow({
        url: "settlementPage.html",
        id: "settlementPage.html",
        extras: {
          goodId: vm.goodMessage.goods_id,
          goodNum: vm.buy_num,
          spec_ids: vm.good_spec.spec_ids ? vm.good_spec.spec_ids : "",
          spec_names: vm.good_spec.spec_names ? vm.good_spec.spec_names : "",
          one: true,
          type: plus.webview.currentWebview().type
        }
      });
    }
  } else {
    mui.confirm("您还未登录!", "万国提示", ["取消", "去登录"], function(e) {
      if (e.index == 1) {
        popup.style.bottom = -14 + "rem";
        mask.style.display = "none";
        mui.openWindow({
          url: "login.html",
          id: "login.html"
        });
      }
    });
  }
  // console.log(JSON.stringify(mui.webview.getCur))
});
mui(".mui-scroll-wrapper").scroll({
  deceleration: 0.0005,
  indicators: true
});
mui(".scroll-wrapper").scroll({
  deceleration: 0.0005,
  indicators: true
});
mui(".bottom-nav").on("tap", ".center", function() {
  popup.style.bottom = 0;
  mask.style.display = "block";
});
mui(".bottom-nav").on("tap", ".right", function() {
  popup.style.bottom = 0;
  mask.style.display = "block";
});
mask.addEventListener("tap", function() {
  popup.style.bottom = -14 + "rem";
  mask.style.display = "none";
});
//添加商品到购物车
function add_to_shopping_cart() {
  if (user_token()) {
    var token = localStorage.getItem("token");
    if (!vm.goodData.sec_list.spec) {
      if (vm.buy_num > vm.goodMessage.store_num) {
        toast("库存不足");
      } else {
        mui.ajax(http_url + "/api.php/Order/addcart?token=" + token, {
          dataType: "json",
          type: "post",
          headers: { apitoken: c("/api.php/Order/addcart") },
          data: {
            goods_id: vm.goodMessage.goods_id,
            num: vm.buy_num,
            buy_type: plus.webview.currentWebview().type
            // spec_ids:  "",
            // spec_names:  ""
          },
          timeout: 10000,
          success: function(data) {
            popup.style.bottom = -14 + "rem";
            mask.style.display = "none";
            toast(data.message);
          },
          error: function(xhr, type, errorThrown) {
            //异常处理；ss
            console.log(errorThrown);
          }
        });
      }
    } else if (!vm.good_spec.id) {
      toast("请选择商品规格");
    } else if (vm.buy_num > vm.good_spec.store_count) {
      toast("库存不足");
    } else {
      mui.ajax(http_url + "/api.php/Order/addcart?token=" + token, {
        dataType: "json",
        type: "post",
        headers: { apitoken: c("/api.php/Order/addcart") },
        data: {
          goods_id: vm.goodMessage.goods_id,
          num: vm.buy_num,
          spec_ids: vm.good_spec.spec_ids,
          spec_names: vm.good_spec.spec_names,
          buy_type: plus.webview.currentWebview().type
        },
        timeout: 10000,
        success: function(data) {
          toast(data.message);
        },
        error: function(xhr, type, errorThrown) {
          //异常处理；ss
          console.log(errorThrown);
        }
      });
    }
  } else {
    mui.confirm("您还未登录!", "万国提示", ["取消", "去登录"], function(e) {
      if (e.index == 1) {
        mui.openWindow({
          url: "login.html",
          id: "login.html"
        });
      }
    });
  }
}
//点击预览图片
// var content = document.getElementById("contents");
// var imgs = [];
// mui("#contents").on("tap", "img", function() {
//   if (imgs.length != 0) {
//     plus.nativeUI.previewImage(imgs, {
//       current: this.index,
//       indicator: "number",
//       loop: true
//     });
//   } else {
//     var contetn_imgs = content.getElementsByTagName("img");
//     for (i in contetn_imgs) {
//       imgs.push(contetn_imgs[i].src);
//       contetn_imgs[i].index = i;
//     }
//     plus.nativeUI.previewImage(imgs, {
//       current: this.index,
//       indicator: "number",
//       loop: true
//     });
//   }
// });
