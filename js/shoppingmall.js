
(function ($) {
    //阻尼系数
    $.ready(function () {
        //循环初始化所有下拉刷新，上拉加载。
        $.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function (index, pullRefreshEl) {
            $(pullRefreshEl).pullToRefresh({
                up: {
                    callback: pull_up_refresh
                }
            });
        });
    });
})(mui);
var vm = new Vue({
    el: "#container",
    data: {
        good1: { good: [], page: 2 },
        good2: { good: [], page: 2 },
        good3: { good: [], page: 2 },
        good4: { good: [], page: 2 },
        good5: { good: [], page: 2 },
        classification: [],
        imgs: [],
    }
})
var mySwiper = new Swiper('.swiper-container', {
    autoplay: true,
    autoplayDisableOnInteraction: false,//用户使用后是否停止轮播；  
    observer: true,//修改swiper自己或子元素时，自动初始化swiper 
    observeParents: false,//修改swiper的父元素时，自动初始化swiper 
    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
    },
})
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
    bounce: false,
    indicators: true, //是否显示滚动条
    deceleration: deceleration
});
//  	广告图
mui.ajax(http_url + '/api.php/Adv/index?id=30', {
    dataType: 'json',
    type: 'get',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json', "apitoken": c('/api.php/Adv/index'), },
    success: function (data) {
        if (data.status == 200) {
            vm.imgs = data.data;
        } else {
            toast(data.message);
        }
    },
    error: function (xhr, type, errorThrown) {

    }
})

//第一次获取数据
mui.ajax(http_url + '/api.php/Mall/index?p=1&cat_id=0', {
    dataType: 'json',
    type: 'get',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json', "apitoken": c('/api.php/Mall/index'), },
    success: function (data) {
        nowId = 0;
        vm.good1.good = data.data.list;
        nowSelectClass = vm.good1;
        vm.classification = data.data.cat_list;
    },
    error: function (xhr, type, errorThrown) {

    }
});

mui.plusReady(function () {

})
// mui(".mui-scroll-wrapper").scroll({
//     deceleration: 0.0005
// })
var gallery = mui(".mui-slider");
gallery.slider({
    interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});
var slid_list = mui("#slider");
slid_list.slider({
    interval: 0,
})
function change_list(index) {
    slid_list.slider().gotoItem(index);
    is_search == 2 ? is_search = 3 : null;
    if (index == 0) {
        get_goods(1, 0);
    } else {
        get_goods(index, vm.classification[index - 1].id)
    }
}
mui(".shopping-mall-good-list").on("tap", ".buy-now", function () {
    mui.openWindow({
        url: "goodDetail.html",
        id: "goodDetail.html"
    })
})

// slider监听
document.querySelector('#slider').addEventListener('slide', function (event) {
    var num = event.detail.slideNumber;
    is_search == 2 ? is_search = 3 : null;
    if (num > 0) {
        get_goods(num + 1, vm.classification[num - 1].id);
    } else {
        get_goods(1, 0)
    }
});
var nowId = 1;    //当前id
var nowData = 1;    //当前数据
function get_goods(index, id) {
    var goods = [];
    nowId = id;
    nowData = index;
    switch (index) {
        case 1:
            if (is_search == 3) {
                goods = [];
                is_search = 1;
            } else {
                goods = vm.good1.good;
            }
            break;
        case 2:
            goods = vm.good2.good;
            break;
        case 3:
            goods = vm.good3.good;
            break;
        case 4:
            goods = vm.good4.good;
            break;
        case 5:
            goods = vm.good5.good;
            break;
    }
    if (goods.length >= 1) {
        return
    }
    mui.ajax(http_url + '/api.php/Mall/index?p=1&cat_id=' + id, {
        dataType: 'json',
        type: 'get',
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', "apitoken": c('/api.php/Mall/index'), },
        success: function (data) {
            switch (index) {
                case 1:
                    vm.good1.good = data.data.list;
                    nowSelectClass = vm.good1;
                    break;
                case 2:
                    vm.good2.good = data.data.list;
                    nowSelectClass = vm.good2;
                    break;
                case 3:
                    vm.good3.good = data.data.list;
                    nowSelectClass = vm.good3;
                    break;
                case 4:
                    vm.good4.good = data.data.list;
                    nowSelectClass = vm.good4;
                    break;
                case 5:
                    vm.good5.good = data.data.list;
                    nowSelectClass = vm.good5;
                    break;
            }

        },
        error: function (xhr, type, errorThrown) {

        }
    });
}
var goodDetailPage;
//跳转到商品详情页
function jump_to_good_detail(ids) {
    mui.openWindow({
        url: "goodDetail.html",
        id: "goodDetail.html",
        extras: {
            good_id: ids,
        }
    })
};
var page = 2;
var nowSelectClass;                 //当前选择的商品分类
function pull_up_refresh() {
    if (is_search == 2) {
        this.endPullUpToRefresh(false);
        return;
    }
    var self = this;
    mui.ajax(http_url + '/api.php/Mall/index?p=' + nowSelectClass.page + '&cat_id=' + nowId, {
        dataType: 'json',
        type: 'get',
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', "apitoken": c('/api.php/Mall/index'), },
        success: function (data) {
            if (data.data.list.length > 0) {
                switch (nowData) {
                    case 1:
                        vm.good1.good = vm.good1.good.concat(data.data.list);
                        vm.good1.page++;
                        break;
                    case 2:
                        vm.good2.good = vm.good2.good.concat(data.data.list);
                        vm.good2.page++;
                        break;
                    case 3:
                        vm.good3.good = vm.good2.good.concat(data.data.list);
                        vm.good3.page++;
                        break;
                    case 4:
                        vm.good4.good = vm.good4.good.concat(data.data.list);
                        vm.good4.page++;
                        break;
                    case 5:
                        vm.good5.good = vm.good5.good.concat(data.data.list);
                        vm.good5.page++;
                        break;
                }
                self.endPullUpToRefresh(false);
            } else {
                // self.disablePullupToRefresh();
                self.endPullUpToRefresh(true)
            }
        },
        error: function (xhr, type, errorThrown) {

        }
    })
}
var is_search = 1;                //是否为搜索跳转的
//搜索商品
function search(text) {
    slid_list.slider().gotoItem(0);
    is_search = 2;
    mui.ajax(http_url + '/api.php/Mall/index?keywords=' + text, {
        dataType: 'json',
        type: 'get',
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', "apitoken": c('/api.php/Mall/index'), },
        success: function (data) {
            // alert(JSON.stringify(data.data));
            // alert(JSON.stringify(data));
            vm.good1.good = [];
            vm.good1.good = data.data.list;
            // Vue.set(vm.good1,'good',data.data.list);
        },
        error: function (xhr, type, errorThrown) {

        }
    });
}