var click = true;
var Index = 0;
var self = null;
var wgtWaiting = null; //等待框
var oldVer = null; // 当前应用号
var newVer = null; //最新号
var versionMessage = null;
var subpages = [
  "indexIndex.html",
  "buyCart.html",
  "shoppingMall.html",
  "my.html"
];
mui.plusReady(function() {
  plus.runtime.getProperty(plus.runtime.appid, function(inf) {
    oldVer = inf.version;
    checkUpdate();
  });
  document.addEventListener("netchange", onNetChange, false);
  self = plus.webview.currentWebview();
  for (var i = 0; i < subpages.length; i++) {
    var sub = plus.webview.create(subpages[i], subpages[i], {
      top: "45px",
      bottom: "50px"
    });
    if (i != Index) {
      sub.hide();
    }
    //将webview对象填充到窗口
    self.append(sub);
  }
  shoppingMallPage = plus.webview.getWebviewById("shoppingMall.html");
  indexSubject = plus.webview.getWebviewById("indexIndex.html");

  // document.querySelector(".title-right").addEventListener("tap", function () {
  //     console.log(click);
  //     if (user_token()) {
  //         click ? indexSubject.evalJS("openmore()") : null;
  //     } else {
  //         if (!click) return;
  //         mui.confirm("您还未登录!", "万国提示", ['取消', '去登录'], function (e) {
  //             if (e.index == 1) {
  //                 mui.openWindow({
  //                     url: "login.html",
  //                     id: "login.html"
  //                 })
  //             }
  //         })
  //     }
  // })
});
//当前有无网络连接
function onNetChange() {
  var nt = plus.networkinfo.getCurrentType();
  if (nt == plus.networkinfo.CONNECTION_NONE) {
    toast("当前无网络连接");
  } else {
    var child = self.children();
    for (i in child) {
      child[i].reload(true);
    }
  }
}
//当前激活选项
var activeTab = subpages[Index];
title = document.querySelector(".title-center");
var url = "order.html"; //点击右侧按钮的跳转路径
var indexSubject;
var activeA = document
  .getElementsByClassName("mui-bar-tab")[0]
  .getElementsByTagName("a"); //获取所有点击的a
//顶部右侧按钮
// var action_bar_right = document.querySelector(".title-right").querySelector(".mui-icon")
mui(".mui-bar-tab").on("tap", "a", function(e) {
  //获取目标子页的id
  var targetTab = this.getAttribute("href");
  if (targetTab == activeTab) {
    return;
  }
  //更换标题
  // title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
  if (this.querySelector(".mui-tab-label").innerHTML == "我的") {
    click = false;
    title.getElementsByClassName("title-input")[0].style.display = "none";
    title.innerHTML =
      "<span>我的&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>";
    document.querySelector(".title-left").style.visibility = "hidden";
    // action_bar_right.style.visibility = "hidden";
    // document.querySelector(".title-right").querySelector("span") = "img/setting.png";
    url = "setting.html";
    url = "setting.html";
  } else if (this.querySelector(".mui-tab-label").innerHTML == "首页") {
    title.innerHTML = "";
    url = "order.html";
    click = true;
    var div = document.createElement("div");
    var childDIV = document.createElement("div");
    document.querySelector(".title-left").style.visibility = "visible";
    // action_bar_right.style.visibility = "visible";
    div.setAttribute("class", "title-input");
    childDIV.setAttribute("class", "search-button");
    childDIV.innerText = "搜索";
    childDIV.addEventListener(
      "tap",
      function() {
        search();
        var nowinput = document.querySelector("input");
        shoppingMallPage.evalJS("search('" + nowinput.value + "')");
      },
      false
    );
    var input = document.createElement("input");
    input.setAttribute("placeholder", "请输入搜索内容");
    input.setAttribute("type", "text");
    div.appendChild(input);
    div.appendChild(childDIV);
    title.appendChild(div);
  } else {
    title.innerHTML = "";
    url = "order.html";
    click = false;
    var div = document.createElement("div");
    var childDIV = document.createElement("div");
    document.querySelector(".title-left").style.visibility = "visible";
    // action_bar_right.style.visibility = "hidden";
    div.setAttribute("class", "title-input");
    childDIV.setAttribute("class", "search-button");
    childDIV.innerText = "搜索";
    childDIV.addEventListener(
      "tap",
      function() {
        search();
        var nowinput = document.querySelector("input");
        shoppingMallPage.evalJS("search('" + nowinput.value + "')");
      },
      false
    );
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "请输入搜索内容");
    div.appendChild(input);
    div.appendChild(childDIV);
    title.appendChild(div);
  }
  //显示目标选项卡
  plus.webview.show(targetTab, "slide-in-right");
  //隐藏当前选项卡
  plus.webview.hide(activeTab);
  //更改当前活跃的选项卡
  activeTab = targetTab;
});
//子页面点击切换页面的方法
function changeView(now) {
  var targetTab = now;
  var that;
  if (targetTab == activeTab) {
    return;
  }
  for (var i = 0; i < activeA.length; i++) {
    activeA[i].classList.remove("mui-active");
    if (activeA[i].href.indexOf(now) >= 0) {
      that = activeA[i];
    }
  }
  that.classList.add("mui-active");
  if (c) {
    // title.getElementsByClassName("title-input")[0].style.display = "none";
    // title.innerHTML = that.querySelector(".mui-tab-label").innerHTML;
    click = false;
    document.querySelector(".title-left").style.visibility = "visible";
    // action_bar_right.style.visibility = "hidden";
    // document.querySelector(".title-right").querySelector("span") = "img/setting.png";
  }
  // else {
  //     title.innerHTML = "";
  //     url = "order.html"
  //     click = false;
  //     var div = document.createElement("div");
  //     document.querySelector(".title-left").style.visibility = "visible";
  //     action_bar_right.style.visibility = "hidden";
  //     // document.querySelector(".title-right").querySelector("span").src = "img/close.png";
  //     div.setAttribute("class", "title-input");
  //     var input = document.createElement("input");
  //     input.setAttribute("placeholder", "请输入搜索内容");
  //     div.appendChild(input);
  //     title.appendChild(div);
  // }
  //显示目标选项卡
  plus.webview.show(targetTab);
  //隐藏当前选项卡
  plus.webview.hide(activeTab);
  //更改当前活跃的选项卡
  activeTab = targetTab;
}

mui(".action-bar").on("tap", ".title-left", function() {
  logo_click();
});
function logo_click() {
  if ("indexIndex.html" == activeTab) {
    return;
  }
  var that;
  for (var i = 0; i < activeA.length; i++) {
    activeA[i].classList.remove("mui-active");
    if (activeA[i].href.indexOf("indexIndex.html") >= 0) {
      that = activeA[i];
    }
  }
  that.classList.add("mui-active");
  plus.webview.show("indexIndex.html");
  plus.webview.hide(activeTab);
  activeTab = "indexIndex.html";
}
var shoppingMallPage;

document.querySelector(".search-button").addEventListener(
  "tap",
  function() {
    search();
    var nowinput = document.querySelector("input");
    if (nowinput.value) {
      shoppingMallPage.evalJS("search('" + nowinput.value + "')");
    } else {
      toast(请输入搜索内容);
    }
  },
  false
);
function search() {
  var that;
  if (activeTab == "shoppingMall.html") {
  } else {
    plus.webview.show("shoppingMall.html");
    plus.webview.hide(activeTab);
    activeTab = "shoppingMall.html";
    for (var i = 0; i < activeA.length; i++) {
      activeA[i].classList.remove("mui-active");
      if (activeA[i].href.indexOf("shoppingMall.html") >= 0) {
        that = activeA[i];
      }
    }
    that.classList.add("mui-active");
  }
}

//改变
function checkUpdate() {
  mui.ajax(http_url + "/api.php/Index/checkversion", {
    dataType: "json",
    type: "get",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      apitoken: c("/api.php/Index/checkversion")
    },
    success: function(data) {
      newVer = data.data;
      versionMessage = data;
      // 监听应用启动界面关闭事件
      if (plus.navigator.hasSplashscreen()) {
        // 启动页未关闭
        document.addEventListener("splashclosed", downUpload, false);
      } else {
        //启动界面已关闭
        downUpload();
      }
    },
    error: function(xhr, type, errorThrown) {}
  });
}
//资源
function downUpload(text) {
  if (compareVersion(oldVer, newVer)) {
    mui.confirm(
      versionMessage.message,
      "万国提示",
      ["下次再说", "确定"],
      function(e) {
        if (e.index == 1) {
          wgtWaiting = plus.nativeUI.showWaiting("开始任务", {
            width: "130px",
            height: "130px"
          });
          var options = { method: "GET" };
          var dtask = plus.downloader.createDownload(
            http_url + "/appversion/" + newVer + ".wgt",
            options,
            function(d, status) {
              if (status == 200) {
                wgtWaiting.setTitle("开始");
                install(d);
              } else {
                wgtWaiting.close();
              }
            }
          );
          dtask.addEventListener("statechanged", function(task, status) {
            switch (task.state) {
              case 1: // 开始
                break;
              case 2: // 已连接到服务器
                wgtWaiting.setTitle("已连接到服务器");
                break;
              case 3: // 已接收到数据
                // if (setnum) {
                // }
                // setnum = false;
                // var percent = task.downloadedSize / task.totalSize * 100;
                break;
              case 4:
                wgtWaiting.setTitle("加载完成");
                break;
            }
          });
          dtask.start();
        }
      }
    );
  }
}
function install(task) {
  plus.runtime.install(
    task.filename,
    { force: true },
    function() {
      wgtWaiting.close();
      mui.confirm("已完成，是否重启！", "万国提示", ["取消", "确定"], function(
        e
      ) {
        if (e.index == 1) {
          plus.runtime.restart();
        }
      });
    },
    function(err) {
      wgtWaiting.close();
      mui.toast("未知错误");
    }
  );
}
//比较两个版本
function compareVersion(ov, nv) {
  if (!ov || !nv || ov == "" || nv == "") {
    return false;
  }
  var b = false;
  var ova = ov.split(".", 3);
  var nva = nv.split(".", 3);
  for (var i = 0; i < ova.length && i < nva.length; i++) {
    var so = ova[i],
      no = parseInt(so),
      sn = nva[i],
      nn = parseInt(sn);
    if (nn > no || sn.length > so.length) {
      return true;
    } else if (nn < no) {
      return false;
    }
  }
  if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
    return true;
  }
}
