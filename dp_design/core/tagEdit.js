function tagChangeSize(a) {
    var t = a.data("prop");
    if ("swiper" == t.type) {
        var e = t.mySwiper, i = t.rectP;
        $.each(e.slides, function (a, t) {
            $(t).css({height: i.height, width: i.width})
        }), e.updateSize(), e.update(), a.find(".box").each(function () {
            var a = $(this).data("prop").myChart;
            a && a.resize()
        })
    }
}

function addSlide(a, i) {
    layx.html("dom", "可以添加的组件", document.getElementById("charts"), {
        event: {
            onload: {
                before: function (a, t) {
                    $(a).css("background-color", "#263954")
                }, after: function (a, t) {
                    var e = $(a).find(".tags-navs");
                    console.log(e), e.find(".tags-nav.off").remove(), e.find(".tags-nav").bind("click", function () {
                        initChartsTag($(this), i.parent())
                    })
                }
            }
        }
    })
}

function initChartsTag(a, t) {
    var e = a.attr("tag-type"),
        n = $('<div class="box" style="width: 100%;height: 100%;"><div class="tag-charts" style="height:100%;width:100%"></div></div>');
    "map" == e ? layx.iframe("localsiteformap", "选择地图文件", "./component/BddpMapPage.html", {
        event: {
            ondestroy: {
                before: function (a, t, e, i, r) {
                    var o = e.path;
                    -1 < o.indexOf("geographic") && (o = o.substring(o.indexOf("geographic") + "geographic".length, o.length)), getAjaxMapData({mappath: o}, function (a) {
                        if (0 == a.code) {
                            data = a.res;
                            var t = hex_md5(data), e = data;
                            echarts.registerMap(t, e), swiperCreatMapChart(n, t, o)
                        }
                    })
                }
            }
        }
    }) : swiperCreateCharts(e, n), t.empty().append(n), n.find(".tag-charts").bind("click", function () {
        $(".box").removeClass("box-selected"), n.addClass("box-selected"), $("#rightnav").addClass("on"), getProp($(this).parent(), !0)
    }), layx.destroy("dom")
}

function swiperCreateCharts(n, s) {
    globalChartTheme || (globalChartTheme = "default");
    var e = "dp_design/charts-config/" + n + ".json",
        a = "dp_design/charts-theme/" + globalChartTheme + ".json";
    getJSONFileData(a, function (a) {
        var t = a;
        echarts.registerTheme(globalChartTheme, t), getJSONFileData(e, function (a) {
            var t = s.data("prop"), e = a, i = s.find(".tag-charts")[0], r = echarts.init(i, globalChartTheme);
            r.setOption(e, !0);
            var o = $.extend({}, t, {
                options: e,
                myChart: r,
                type: n,
                other: {},
                bigType: "chart",
                slide: !0,
                other: {theme: globalChartTheme},
                id: guid()
            });
            s.data("prop", o)
        })
    })
}

function swiperCreatMapChart(a, t, e) {
    var i = {
        geo: {
            show: !0,
            map: t,
            label: {normal: {show: !0, color: "#ffffff"}, emphasis: {show: !0}},
            roam: !0,
            itemStyle: {
                normal: {areaColor: "transparent", borderColor: "#3fdaff", borderWidth: 2},
                emphasis: {areaColor: "#2B91B7"}
            }
        }
    }, r = a.find(".tag-charts")[0], o = echarts.init(r);
    o.setOption(i, !0);
    var n = a.data("prop"),
        s = $.extend({}, n, {options: i, myChart: o, type: "map", slide: !0, other: {mappath: e}, id: guid()});
    a.data("prop", s)
}

window.editSwiper = function () {
}, window.getImagePath = function (o) {

    app.selectImage.status=true;
    app.selectImage.propInputObj=o;
    // layx.iframe("localsiteforImage", "图片文件选择", "./component/BddpImagesPage.html", {
    //     event: {
    //         ondestroy: {
    //             before: function (a, t, e, i, r) {
    //                 e.name && (o.val("../../bddpConfig/" + e.id + "/images/" + e.name), o.change())
    //             }
    //         }
    //     }
    // })
};