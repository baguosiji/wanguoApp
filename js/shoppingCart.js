mui.init({
  pullRefresh: {
    container: "#refreshContainer",
    up: {
      contentrefresh: "正在加载...",
      callback: pullupRefresh
    }
  }
});
var vm = new Vue({
  el: "#app",
  data: {
    goods: [],
    total: 0,
    edit: false,
    mydata: []
  }
});
// mui(".mui-scroll-wrapper").scroll({
//     deceleration: 0.0005,
//     indicators: false, //是否显示滚动条
// })
mui.ajax(
  http_url +
    "/api.php/User/cart?p=" +
    page +
    "&token=" +
    user_all_message.token,
  {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/User/cart")
    },
    success: function(data) {
      if (data.status == 200) {
        vm.goods = vm.goods.concat(data.data);
        page++;
      } else {
        toast(data.message);
      }
    },
    error: function(xhr, type, errorThrown) {}
  }
);

var page = 2;
// 下拉刷新
function pullupRefresh() {
  //当前页码
  mui.ajax(
    http_url +
      "/api.php/User/cart?p=" +
      page +
      "&token=" +
      user_all_message.token,
    {
      dataType: "json",
      type: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        apitoken: c("/api.php/User/cart")
      },
      success: function(data) {
        if (data.status == 200) {
          vm.goods = vm.goods.concat(data.data);
          page++;
          if (data.data.length == 0) {
            mui("#refreshContainer")
              .pullRefresh()
              .disablePullupToRefresh();
            mui("#refreshContainer")
              .pullRefresh()
              .endPullupToRefresh(true);
          } else {
            mui("#refreshContainer")
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

//点击编辑按钮
mui(".action-bar-no-search").on("tap", ".title-right-right", function() {
  if (vm.edit) {
    vm.edit = false;
    this.querySelector("span").innerText = "编辑";
  } else {
    vm.edit = true;
    this.querySelector("span").innerText = "完成";
  }
});
// 选择单个商品
var select_good = document.getElementsByClassName("select-good");
var number = 0;
// for (var i = 0; i < select_good.length; i++) {
//     select_good[i].querySelector("img").addEventListener("tap", function () {
//         if ((this.src.indexOf("True")) >= 0) {
//             this.src = "../img/selectFalse.png";
//             number--;
//             if (number != select_good.length) {
//                 select_all.src = "../img/selectFalse.png";
//             }
//         } else {
//             this.src = "../img/selectTrue.png";
//             number++
//             if (number == select_good.length) {
//                 select_all.src = "../img/selectTrue.png";
//             }
//         }
//     }, false)
// }
//选择单个商品
function select_goods(e, id, buy_num, nowGood) {
  if (e.currentTarget.querySelector(".noedit").src.indexOf("True") >= 0) {
    e.currentTarget.querySelector(".noedit").src = "../img/selectFalse.png";
    number--;
    vm.total = vm.total - Number(e.currentTarget.id) * Number(buy_num);
    var nowChange;
    for (var j = 0; j < vm.mydata.length; j++) {
      vm.mydata[j].delect == id ? (nowChange = vm.mydata[j]) : null;
    }
    vm.mydata.splice(vm.mydata.indexOf(nowChange), 1);
    if (number != select_good.length) {
      select_all.src = "../img/selectFalse.png";
    }
    nowGood.active = false;
  } else {
    e.currentTarget.querySelector(".noedit").src = "../img/selectTrue.png";
    number++;
    vm.total = vm.total + Number(e.currentTarget.id) * buy_num;
    var data = {
      delect: "",
      number: ""
    };
    data.delect = id;
    data.number = buy_num;
    vm.mydata.push(data);
    if (number == select_good.length) {
      select_all.src = "../img/selectTrue.png";
    }
    nowGood.active = true;
  }
}
//选择所有商品
var select_all = document.getElementById("select-all");
select_all.addEventListener(
  "tap",
  function() {
    if (this.src.indexOf("True") >= 0) {
      this.src = "../img/selectFalse.png";
      number = 0;
      vm.delect = [];
      vm.number = [];
      for (var i = 0; i < select_good.length; i++) {
        vm.total = 0;
        vm.goods[i].active = false;
        select_good[i].querySelector(".noedit").src = "../img/selectFalse.png";
      }
    } else {
      this.src = "../img/selectTrue.png";
      number = select_good.length;
      vm.delect = [];
      var data = {
        delect: "",
        number: ""
      };
      for (var i = 0; i < select_good.length; i++) {
        select_good[i].querySelector(".noedit").src = "../img/selectTrue.png";
        data.delect = vm.goods[i].id;
        data.number = vm.goods[i].goods_num;
        vm.mydata.push(data);
        vm.goods[i].active = true;
        vm.total +=
          Number(vm.goods[i].goods.shop_price) * vm.goods[i].goods_num;
      }
    }
  },
  false
);

//点击去付款按钮
function payfor() {
  var lastNumber = [];
  var lastBuy = [];
  for (var i = 0; i < vm.mydata.length; i++) {
    lastNumber.push(vm.mydata[i].number);
    lastBuy.push(vm.mydata[i].delect);
  }
  if (lastNumber.length > 0) {
    mui.openWindow({
      url: "settlementPage.html",
      id: "settlementPage.html",
      extras: {
        goodId: lastBuy,
        goodNum: lastNumber
      }
    });
  }
}
function delect_good() {
  var delect = [];
  for (var i = 0; i < vm.mydata.length; i++) {
    delect.push(vm.mydata[i].delect);
  }
  if (delect.length > 0) {
    mui.confirm("确认删除？", "您正在进行删除操作", ["取消", "确认"], function(
      e
    ) {
      if (e.index == 1) {
        mui.ajax(
          http_url +
            "/api.php/User/delcart?ids=" +
            delect +
            "&token=" +
            user_all_message.token,
          {
            dataType: "json",
            type: "get",
            timeout: 10000,
            headers: {
              "Content-Type": "application/json",
              apitoken: c("/api.php/User/delcart")
            },
            success: function(data) {
              if (data.status == 200) {
                toast(data.message);
                vm.total = 0;
                page = 1;
                vm.goods = [];
                pullupRefresh();
              } else {
                toast(data.message);
              }
            },
            error: function(xhr, type, errorThrown) {
              console.log(xhr);
            }
          }
        );
      } else {
      }
    });
  }
}
//购买数量加
function add_num(number) {
  number.goods_num++;
  if (number.active) {
    vm.total += Number(number.goods.shop_price);
  }
}
//购买数量减少
function remove_num(number) {
  if (number.goods_num <= 1) {
  } else {
    number.goods_num--;
    if (number.active) {
      vm.total -= Number(number.goods.shop_price);
    }
  }
}
