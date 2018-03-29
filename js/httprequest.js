var url = "http://192.168.50.50:81/api.php/";
//使用promise 重写ajax请求
function asjax(path, data) {
  console.log("zhixing");
  return new Promise(function(resolve, reject) {
    mui.ajax(url + path, {
      type: data == null ? "get" : "post",
      dataType: "json",
      data: data == null ? "" : JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
      success: function(resp) {
        resolve(resp);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        switch (XMLHttpRequest.status) {
          case 500:
            reject("服务器系统内部错误");
            break;
          case 403:
            reject("无权限执行此操作");
            break;
          case 408:
            reject("请求超时");
            break;
          default:
            reject(XMLHttpRequest.responseText);
        }
      }
    });
  });
}

//封装mui.ajax请求
function ajax(path, data) {
  mui.ajax(url + path, {
    data: data,
    dataType: "json",
    type: data ? "post" : "get",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    success: function(data) {},
    error: function(xhr, type, errorThrown) {}
  });
}
