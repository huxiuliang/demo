function createTagsBox(e, t, a) {
    var r;
    switch (e.type) {
        case"line":
            r = bulidLineChart(createChart(e, a), t);
            break;
        case"bar":
            r = bulidBarChart(createChart(e, a), t);
            break;
        case"pie":
            r = bulidPieChart(createChart(e, a), t);
            break;
        case"radar":
            r = bulidRadarChart(createChart(e, a), t);
            break;
        case"tree":
            r = bulidTreeChart(createChart(e, a), t);
            break;
        case"treemap":
            r = bulidTreemapChart(createChart(e, a), t);
            break;
        case"sunburst":
            r = bulidSunburstChart(createChart(e, a), t);
            break;
        case"funnel":
            r = bulidFunnelChart(createChart(e, a), t);
            break;
        case"gauge":
            r = bulidGaugeChart(createChart(e, a), t);
            break;
        case"boxplot":
            r = bulidBoxplotChart(createChart(e, a), t);
            break;
        case"heatmap":
            r = bulidHeatmapChart(createChart(e, a), t);
            break;
        case"graph":
            r = bulidGraphChart(createChart(e, a), t);
            break;
        case"parallel":
            r = bulidParallelChart(createChart(e, a), t);
            break;
        case"sankey":
            r = bulidsankeyChart(createChart(e, a), t);
            break;
        case"scatter":
            r = bulidScatterChart(createChart(e, a), t);
            break;
        case"map":
            r = bulidMapChart(createChart(e, a), t);
            break;
        case"candlestick":
            r = bulidCandkestickChart(createChart(e, a), t);
            break;
        case"text":
            r = bulidText(e, t);
            break;
        case"rect":
            r = bulidRect(e, t);
            break;
        case"circle":
            r = bulidCircle(e, t);
            break;
        case"image":
            r = bulidImage(e, t);
            break;
        case"table":
            r = bulidTable(e, t);
            break;
        case"time":
            r = bulidTime(e, t);
            break;
        case"triangle":
            r = bulidTriangle(e, t);
            break;
        case"iframe":
            r = bulidIframe(e, t);
            break;
        case"swiper":
            r = bulidSwiper(e, t)
    }
    return r
}

function setRectP(e, t) {
    var a = t.rectP;
    e.css({
        left: a.x,
        top: a.y,
        width: a.width + "px",
        height: a.height + "px",
        zIndex: a.zIndex,
        transform: "rotate(" + a.rotate + "deg)"
    })
}

function setTagsParts(r, e, s) {
    currBox = r, e && $.each(e, function (e, t) {
        switch (e) {
            case"fontSize":
                r.find(".tag-" + s.type).css("font-size", t + "px");
                break;
            case"fontWeight":
                r.find(".tag-" + s.type).css("font-weight", t);
                break;
            case"textShadow":
                r.find(".tag-" + s.type).css("text-shadow", t);
                break;
            case"color":
                r.find(".tag-" + s.type).css("color", t);
                break;
            case"backgroundImage":
                var a = t;
                a = a.replace(/\\/g, "/"), r.find(".tag-" + s.type).css({
                    "background-image": "url('" + a + "')",
                    "background-repeat": "no-repeat",
                    "background-size": "100% 100%"
                });
                break;
            case"backgroundColor":
                r.find(".tag-" + s.type).css({"background-color": t});
                break;
            case"text":
                r.find(".tag-" + s.type).html(t);
                break;
            case"borderRadius":
                r.find(".tag-" + s.type).css({"border-radius": t + "px"});
                break;
            case"iframeUrl":
            case"imgUrl":
                r.find(".tag-" + s.type).attr("src", t);
                break;
            case"fontFamily":
                r.find(".tag-" + s.type).css("font-family", t);
                break;
            case"borderWidth":
                r.find(".tag-" + s.type).css("border-width", t);
                break;
            case"borderStyle":
                r.find(".tag-" + s.type).css("border-style", t);
                break;
            case"borderColor":
                r.find(".tag-" + s.type).css("border-color", t);
                break;
            case"textAlign":
                r.find(".tag-" + s.type).css("text-align", t);
                break;
            case"lineHeight":
                r.find(".tag-" + s.type).css("line-height", t + "px")
        }
    })
}

function bulidText(e, t) {
    var a = $('<div class="box" style="width: 100px;height: 40px;"><div class="tag-text" style="width: 100%;height: 100%;"></div></div>'),
        r = e.parts;
    if (setRectP(a, e), a.appendTo("#content"), a.data("prop", e), a.initBox({tagType: e.type}), t) {
        var s = getJsonValue(t, e.data.dimension[0].keyname);
        e.parts && e.parts.format ? e.parts.text = e.parts.format.replace(/{val}/g, s) : e.parts.text = s
    }
    return setTagsParts(a, r, e), a
}

function bulidRect(e, t) {
    var a = $('<div class="box" style="width: 100px;height: 40px;"><div class="tag-rect" style="width:100%;height:100%;background-color:#ffffff;"></div></div>'),
        r = e.parts;
    return setRectP(a, e), a.appendTo("#content"), a.data("prop", e), a.initBox({tagType: e.type}), setTagsParts(a, r, e), a
}

function bulidImage(e, t) {
    var a = $('<div class="box" style="width: 100px;height: 40px;"><img class="tag-image" width="100%" height="100%" src="static/img/default.jpg" /></div>'),
        r = e.parts;
    return setRectP(a, e), a.appendTo("#content"), a.data("prop", e), a.initBox({tagType: e.type}), setTagsParts(a, r, e), a
}

function bulidIframe(e, t) {
    var a = $('<div class="box" style="width: 100px;height: 40px;"><iframe class="tag-iframe" style="width:100%;height:100%;"></iframe></div>'),
        r = e.parts;
    return setRectP(a, e), a.appendTo("#content"), a.data("prop", e), a.initBox({tagType: e.type}), setTagsParts(a, r, e), a
}

function bulidSwiper(e, t) {
    var r = $('<div class="box" style="width: 480px;height: 320px;"><div class="tag-swiper swiper-container"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div></div>'),
        a = e.parts;
    setRectP(r, e), r.appendTo("#content"), r.data("prop", e), r.initBox({tagType: e.type}), setTagsParts(r, a, e), 0 < e.slides.length && $.each(e.slides, function (e, t) {
        var a = $('<div class="swiper-slide"></div>');
        t.id || (t.id = guid()), a.attr("id", "slide-" + t.id), a.appendTo(r.find(".swiper-wrapper")), createTagsBox(t, !1, a)
    });
    var s = new Swiper(r.find(".tag-swiper"), e.swiper);
    return r.data("prop").mySwiper = s, r
}

function bulidCircle(e, t) {
    var a = $('<div class="box" style="width: 100px;height: 40px;"><div class="tag-circle" style="width:100%;height:100%;border-radius: 100%;background-color:#ffffff"></div></div>'),
        r = e.parts;
    return setRectP(a, e), a.appendTo("#content"), a.data("prop", e), a.initBox({tagType: e.type}), setTagsParts(a, r, e), a
}

function bulidTable(e, t) {
    var a = $('<div class="box" style="width: 480px;height: 320px;"><div class="tag-table kgo-scroll-sty " style="width:100%;height:100%;overflow:hidden;"><div style="width:100%;height:auto;"><div class="kgo-scroll-head"></div><div class="kgo-scroll-body"><ul class="kgo-scroll-body-ul"></ul></div></div></div></div>'),
        r = e.parts;
    setRectP(a, e), delete e.id, a.appendTo("#content"), a.data("prop", e), a.initBox({tagType: e.type});
    var s = a.find(".tag-" + e.type), i = void 0 === e.parts ? null : e.parts.tableHeight || null;
    if (t) {
        var n = e.data, d = getJsonValue(t, n.dimension[0].keyname), o = {
            ajax_data: getJsonValue(t, n.series[0].keyname),
            ajax_type: "POST",
            supportCheckbox: !1,
            supportAutoOrder: !1,
            height: "100%",
            width: "100%",
            tableHeight: i,
            columnData: d
        };
        s.initScroll(o), a.data("prop").gmOptions = o
    } else e.gmOptions.tableHeight = i, s.initScroll(e.gmOptions);
    return e.effect && e.effect.autoscroll && s.autoScroll(), setTagsParts(a, r, e), a
}

function bulidTime(e, t) {
    var a = $('<div class="box" style="width: 100px;height: 40px;"><div class="clock tag-time"></div></div>'),
        r = e.parts;
    return setRectP(a, e), a.appendTo("#content"), a.data("prop", e), a.initBox({tagType: e.type}), a.find(".tag-" + e.type).ledTime(), setTagsParts(a, r, e), a
}

function createChart(prop, oelem) {
    prop.myChart && prop.myChart.dispose(), "string" == typeof prop.options && (prop.options = eval("(" + prop.options + ")")), prop.optionsText && "string" == typeof prop.optionsText && (prop.options = eval("(" + prop.optionsText + ")"));
    var html = $('<div class="box" style="height:100%;width:100%;"><div class="tag-charts" style="height:100%;width:100%"></div></div>');
    return html.data("prop", prop), prop.slide ? (html.appendTo(oelem), html.find(".tag-charts").bind("click", function () {
        $(".box").removeClass("box-selected"), html.addClass("box-selected"), $("#rightnav").addClass("on"), getProp($(this).parent(), !0)
    })) : (html.appendTo("#content"), setRectP(html, prop), html.initBox({tagType: prop.type})), html
}

function bulidChartOther(elem) {

    var prop = elem.data("prop");
    var other = prop.other;
    var options = prop.options || {};

    if (other.sYAxis && other.sXAxis) {
        options.xAxis = other.sYAxis;
        options.yAxis = other.sXAxis

    }
    setChartTheme(elem, prop)
}

function bulidLineChart(e, r) {
    var s = e.data("prop"), i = s.subtype, t = s.data, a = s.other, n = s.options || {};
    if (r) {
        n.legend = n.legend || {}, n.legend.data = n.legend.data || [], n.series = n.series || [];
        var d = getJsonValue(r, t.dimension[0].keyname);
        $.each(t.series, function (e, t) {
            var a = {data: getJsonValue(r, t.keyname), type: s.type, name: t.displayname};
            2 == i ? a.areaStyle = {} : 3 == i && (a.areaStyle = {}, a.stack = "堆叠标识"), n.series[e] ? n.series[e] = $.extend({}, n.series[e], a) : n.series.push(a), n.legend.data[e] ? n.legend.data[e] = t.displayname : n.legend.data.push(t.displayname)
        }), n.series = n.series.slice(0, t.series.length), n.legend.data = n.legend.data.slice(0, t.series.length), n.xAxis.data = d, a.sXAxis = n.xAxis, a.sYAxis = n.yAxis
    }
    return setChartTheme(e, s), e
}

function bulidBarChart(elem, options) {
    var _prop = elem.data("prop");
    var _data = _prop.data;
    var _options = _prop.options || {};
    var _other = _prop.other || {};

    if (options) {
        _options.legend = _options.legend || {};
        _options.legend.data = _options.legend.data || [];
        _options.series = _options.series || [];

        var n = getJsonValue(options, _data.dimension[0].keyname);
        debugger
        $.each(_data.series, function (e, t) {
            var a = {data: getJsonValue(options, t.keyname), type: _prop.type, name: t.displayname};
            _options.series[e] ? _options.series[e] = $.extend({}, _options.series[e], a) : _options.series.push(a), _options.legend.data[e] ? _options.legend.data[e] = t.displayname : _options.legend.data.push(t.displayname)
        }), _options.series = _options.series.slice(0, _data.series.length), _options.legend.data = _options.legend.data.slice(0, _data.series.length), _other.axis ? _options.yAxis.data = n : _options.xAxis.data = n, _other.sXAxis = _options.xAxis, _other.sYAxis = _options.yAxis
    }
    return setChartTheme(elem, _prop), elem
}

function bulidPieChart(e, t) {
    var a = e.data("prop"), r = a.data, s = a.options || {};
    if (t) {
        s.legend = s.legend || {}, s.legend.data = s.legend.data || [], s.series = s.series || [];
        for (var i = getJsonValue(t, r.dimension[0].keyname), n = getJsonValue(t, r.series[0].keyname), d = [], o = 0; o < i.length; o++) {
            var p = {name: i[o], value: n[o]};
            s.legend.data[o] ? s.legend.data[o] = i[o] : s.legend.data.push(i[o]), d.push(p)
        }
        s.legend.data = s.legend.data.slice(0, i.length);
        var l = {data: d, type: a.type};
        s.series[0] ? s.series[0] = $.extend({}, s.series[0], l) : s.series.push(l)
    }
    return setChartTheme(e, a), e
}

function bulidRadarChart(e, t) {
    var s = e.data("prop"), a = s.data, i = s.options || {};
    if (t) {
        i.legend = i.legend || {}, i.legend.data = i.legend.data || [];
        var n = getJsonValue(t, a.dimension[0].keyname), r = getJsonValue(t, a.series[0].keyname);
        i.series = i.series || [], i.radar = i.radar || {}, i.radar.indicator = i.radar.indicator || [];
        var d = {}, o = 0;
        $.each(r, function (e, t) {
            var a = {data: [], type: s.type}, r = {name: n[e], value: []};
            i.legend.data[e] ? i.legend.data[e] = n[e] : i.legend.data.push(n[e]), $.each(t, function (e, t) {
                d[t.indicator] = t.value, o = o > t.value ? o : t.value, r.value.push(t.value)
            }), a.data.push(r), i.series[e] ? i.series[e] = $.extend({}, i.series[e], a) : i.series.push(a)
        }), i.series = i.series.slice(0, r.length), i.legend.data = i.legend.data.slice(0, n.length);
        var p = 0;
        $.each(d, function (e, t) {
            i.radar.indicator[p] ? i.radar.indicator[p] = $.extend({}, i.radar.indicator[p], {
                name: e,
                max: o
            }) : i.radar.indicator.push({name: e, max: o}), p++
        }), i.radar.indicator = i.radar.indicator.slice(0, p)
    }
    return setChartTheme(e, s), e
}

function bulidTreeChart(e, t) {
    var a = e.data("prop"), r = a.data, s = a.options || {};
    if (t) {
        var i = getJsonValue(t, r.series[0].keyname);
        s.series = [];
        var n = {data: [i], type: a.type};
        s.series.push(n)
    }
    return setChartTheme(e, a), e
}

function bulidTreemapChart(e, t) {
    var a = e.data("prop"), r = a.data, s = a.options || {};
    if (t) {
        var i = getJsonValue(t, r.series[0].keyname);
        s.series = [];
        var n = {data: i, type: a.type};
        s.series.push(n)
    }
    return setChartTheme(e, a), e
}

function bulidSunburstChart(e, t) {
    var a = e.data("prop"), r = a.data, s = a.options || {};
    if (t) {
        var i = getJsonValue(t, r.series[0].keyname);
        s.series = [];
        var n = {data: i, type: a.type};
        s.series.push(n)
    }
    return setChartTheme(e, a), e
}

function bulidFunnelChart(e, t) {
    var r = e.data("prop"), a = r.data, s = r.options || {};
    if (t) {
        var i = getJsonValue(t, a.series[0].keyname);
        s.series = [], $.each(i, function (e, t) {
            var a = t;
            a.type = r.type, s.series.push(a)
        })
    }
    return setChartTheme(e, r), e
}

function bulidGaugeChart(e, t) {
    var r = e.data("prop"), a = r.data, s = r.options || {}, i = r.other;
    if (t) {
        var n = getJsonValue(t, a.series[0].keyname);
        s.series = s.series || [], $.each(n, function (e, t) {
            var a = {};
            (a = 4 == i.dataFrom ? {data: [{value: t}]} : $.extend({}, a, t)).type = r.type, s.series[e] ? s.series[e] = $.extend({}, s.series[e], a) : s.series.push(a), s.series[e].data[e] ? s.series[e].data[e] = $.extend({}, s.series[e].data[e], t) : s.series[e].data.push(t)
        }), s.series = s.series.slice(0, n.length)
    }
    return console.log(r), setChartTheme(e, r), e
}

function bulidMapChart(r, s) {
    var i = r.data("prop").other.mappath;
    return -1 < i.indexOf("geographic") && (i = i.substring(i.indexOf("geographic") + "geographic".length, i.length)), getAjaxMapDataSync({mappath: i}, function (e) {
        if (0 == e.code) {
            data = e.res;
            var t = hex_md5(data), a = data;
            echarts.registerMap(t, a), bulidMapData(r, t, i, s)
        }
    }), r
}

function bulidMapData(e, t, a, i) {
    var r = e.data("prop"), n = $.extend({}, r.options);
    n.geo.map = t;
    var s = r.data;
    if (i) {
        n.series = n.series || [], n.legend = n.legend || {}, n.legend.data = [];
        var d = 0;
        $.each(s.dimension, function (e, t) {
            var a = getJsonValue(i, t.keyname), r = t.displayname;
            -1 < $.inArray(t.displayname, n.legend.data) ? (n.legend.data.push(t.displayname + d), r += d) : n.legend.data.push(t.displayname);
            var s = {name: r, data: a, type: "scatter", coordinateSystem: "geo"};
            n.series[d] ? n.series[d] = $.extend({}, n.series[d], s) : n.series.push(s), d++
        }), $.each(s.series, function (e, t) {
            var a = getJsonValue(i, t.keyname), r = t.displayname;
            -1 < $.inArray(t.displayname, n.legend.data) ? (n.legend.data.push(t.displayname + d), r += d) : n.legend.data.push(t.displayname);
            var s = {name: r, data: a, type: "effectScatter", coordinateSystem: "geo"};
            n.series[d] ? n.series[d] = $.extend({}, n.series[d], s) : n.series.push(s), d++
        }), n.series = n.series.slice(0, d), n.legend.data = n.legend.data.slice(0, d)
    }
    var o = e.find(".tag-charts")[0], p = echarts.init(o);
    p.setOption(n, !0), r.options = n, r.myChart = p, r.other.mappath = a, r.optionsText = JSON.stringify(n, function (e, t) {
        return "function" == typeof t ? "&" + t.toString().replace(/\s+/g, " ").replace(/\n/g, "") + "&" : t
    }, 4), r.optionsText = r.optionsText.replace(/"&/g, "").replace(/&"/g, ""), e.data("prop", r), e.initdata(), $(".box").removeClass("box-selected"), currBox = e
}

/**
 * @param elem
 * @param prop
 */
function setChartTheme(elem, prop) {
    var i = prop.options, n = prop.other;
    prop.data;
    if (prop.myChart &&
    prop.myChart.dispose(),
    n &&
    n.theme) {
        var e = "dp_design/charts-theme/" + n.theme + ".json";
        getJSONFileData(e, function (e) {
            var t = e;
            // echarts.registerTheme(n.theme, t);
            var a = echarts.init(elem.find(".tag-charts")[0], n.theme);
            a.setOption(i),
                prop.myChart = a,
                prop.options = i,
                prop.optionsText = JSON.stringify(i, function (e, t) {
                    return "function" == typeof t ? "&" + t.toString().replace(/\s+/g, " ").replace(/\n/g, "") + "&" : t
                }, 4),
                prop.optionsText = prop.optionsText.replace(/"&/g, "").replace(/&"/g, ""),
                elem.data("prop", prop)
        })
    } else {
        var t = echarts.init(elem.find(".tag-charts")[0]);
        t.setOption(i),
            prop.myChart = t,
            prop.options = i,
            prop.optionsText = JSON.stringify(i, function (e, t) {
                return "function" == typeof t ? "&" + t.toString().replace(/\s+/g, " ").replace(/\n/g, "") + "&" : t
            }, 4),
            prop.optionsText = prop.optionsText.replace(/"&/g, "").replace(/&"/g, ""),
            elem.data("prop", prop)
    }
    currBox = elem
}

function getJsonValue(jsonData, keyName) {
    debugger

    var keys = keyName.split(".");
    var val = jsonData[keys[0]];

    if ("[object Array]" === Object.prototype.toString.apply(val) && 1 < keys.length) {
        return getJsonArray(val, 0, keys)
    } else {
        if ("[object Object]" === Object.prototype.toString.apply(val) && 1 < keys.length) {
            return getJsonObject(val, 0, keys)
        } else {
            return val
        }
    }
}

function getJsonObject(data, len, keys) {
    if (len < keys.length) {
        var val = data[keys[len + 1]];

        if ("[object Array]" === Object.prototype.toString.apply(val) && len + 1 < keys.length - 1) {
            return getJsonArray(val, len + 1, keys)
        } else {

            if ("[object Object]" === Object.prototype.toString.apply(val) && len + 1 < keys.length - 1) {
                return getJsonObject(val, len + 1, keys)
            } else {
                return val
            }
        }
    } else {
        return {};
    }
}

function getJsonArray(data, len, keys) {
    var _array = [];
    $.each(data, function (index, val) {
        if (len < keys.length - 1) {
            var valElement = val[keys[len + 1]];
            if ("[object Array]" === Object.prototype.toString.apply(valElement)) {
                _array.push(getJsonArray(valElement, len + 1, keys))
            } else if ("[object Object]" === Object.prototype.toString.apply(valElement)) {
                _array.push(getJsonObject(valElement, len + 1, keys))
            } else {
                _array.push(valElement)
            }
        } else {
            _array.push(val)
        }
    });
    return _array;
}

function S4() {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
}

function guid() {
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}

function uniq(e) {
    for (var t = [], a = 0; a < e.length; a++) -1 == t.indexOf(e[a]) && t.push(e[a]);
    return t
}