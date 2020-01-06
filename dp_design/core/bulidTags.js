function createTagsBox(prop, data, elem) {
    var r;
    switch (prop.type) {
        case"line":
            r = bulidLineChart(createChart(prop, elem), data);
            break;
        case"bar":
            r = bulidBarChart(createChart(prop, elem), data);
            break;
        case"pie":
            r = bulidPieChart(createChart(prop, elem), data);
            break;
        case"radar":
            r = bulidRadarChart(createChart(prop, elem), data);
            break;
        case"tree":
            r = bulidTreeChart(createChart(prop, elem), data);
            break;
        case"treemap":
            r = bulidTreemapChart(createChart(prop, elem), data);
            break;
        case"sunburst":
            r = bulidSunburstChart(createChart(prop, elem), data);
            break;
        case"funnel":
            r = bulidFunnelChart(createChart(prop, elem), data);
            break;
        case"gauge":
            r = bulidGaugeChart(createChart(prop, elem), data);
            break;
        case"boxplot":
            r = bulidBoxplotChart(createChart(prop, elem), data);
            break;
        case"heatmap":
            r = bulidHeatmapChart(createChart(prop, elem), data);
            break;
        case"graph":
            r = bulidGraphChart(createChart(prop, elem), data);
            break;
        case"parallel":
            r = bulidParallelChart(createChart(prop, elem), data);
            break;
        case"sankey":
            r = bulidsankeyChart(createChart(prop, elem), data);
            break;
        case"scatter":
            r = bulidScatterChart(createChart(prop, elem), data);
            break;
        case"map":
            r = bulidMapChart(createChart(prop, elem), data);
            break;
        case"candlestick":
            r = bulidCandkestickChart(createChart(prop, elem), data);
            break;
        case"text":
            r = bulidText(prop, data);
            break;
        case"rect":
            r = bulidRect(prop, data);
            break;
        case"circle":
            r = bulidCircle(prop, data);
            break;
        case"image":
            r = bulidImage(prop, data);
            break;
        case"table":
            r = bulidTable(prop, data);
            break;
        case"time":
            r = bulidTime(prop, data);
            break;
        case"triangle":
            r = bulidTriangle(prop, data);
            break;
        case"iframe":
            r = bulidIframe(prop, data);
            break;
        case"swiper":
            r = bulidSwiper(prop, data)
    }
    return r
}

function setRectP(elem, $obj) {
    var a = $obj.rectP;
    elem.css({
        left: a.x,
        top: a.y,
        width: a.width + "px",
        height: a.height + "px",
        zIndex: a.zIndex,
        transform: "rotate(" + a.rotate + "deg)"
    })
}

function setTagsParts(elem, data, prop) {
    currBox = elem;
    if (data) {
        $.each(data, function (index, val) {
            switch (index) {
                case"fontSize":
                    elem.find(".tag-" + prop.type).css("font-size", val + "px");
                    break;
                case"fontWeight":
                    elem.find(".tag-" + prop.type).css("font-weight", val);
                    break;
                case"textShadow":
                    elem.find(".tag-" + prop.type).css("text-shadow", val);
                    break;
                case"color":
                    elem.find(".tag-" + prop.type).css("color", val);
                    break;
                case"backgroundImage":
                    var a = val;
                    a = a.replace(/\\/g, "/");
                    elem.find(".tag-" + prop.type).css({
                        "background-image": "url('" + a + "')",
                        "background-repeat": "no-repeat",
                        "background-size": "100% 100%"
                    });
                    break;
                case"backgroundColor":
                    elem.find(".tag-" + prop.type).css({"background-color": val});
                    break;
                case"text":
                    elem.find(".tag-" + prop.type).html(val);
                    break;
                case"borderRadius":
                    elem.find(".tag-" + prop.type).css({"border-radius": val + "px"});
                    break;
                case"iframeUrl":
                case"imgUrl":
                    elem.find(".tag-" + prop.type).attr("src", val);
                    break;
                case"fontFamily":
                    elem.find(".tag-" + prop.type).css("font-family", val);
                    break;
                case"borderWidth":
                    elem.find(".tag-" + prop.type).css("border-width", val);
                    break;
                case"borderStyle":
                    elem.find(".tag-" + prop.type).css("border-style", val);
                    break;
                case"borderColor":
                    elem.find(".tag-" + prop.type).css("border-color", val);
                    break;
                case"textAlign":
                    elem.find(".tag-" + prop.type).css("text-align", val);
                    break;
                case"lineHeight":
                    elem.find(".tag-" + prop.type).css("line-height", val + "px")
            }
        })
    }
}

function bulidText(prop, data) {
    var $box = $('<div class="box" style="width: 100px;height: 40px;"><div class="tag-text" style="width: 100%;height: 100%;"></div></div>');
    var r = prop.parts;
    if (setRectP($box, prop), $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type}), data) {
        var text = getJsonValue(data, prop.data.dimension[0].keyname);
        prop.parts && prop.parts.format ? prop.parts.text = prop.parts.format.replace(/{val}/g, text) : prop.parts.text = text
    }
    return setTagsParts($box, r, prop), $box
}

function bulidRect(prop, data) {
    var $box = $('<div class="box" style="width: 100px;height: 40px;"><div class="tag-rect" style="width:100%;height:100%;background-color:#ffffff;"></div></div>');
    var parts = prop.parts;
    return setRectP($box, prop), $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type}), setTagsParts($box, parts, prop), $box
}

function bulidImage(prop, data) {
    var $box = $('<div class="box" style="width: 100px;height: 40px;"><img class="tag-image" width="100%" height="100%" src="static/img/default.jpg" /></div>');
    var parts = prop.parts;
    return setRectP($box, prop), $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type}), setTagsParts($box, parts, prop), $box
}

function bulidIframe(prop, data) {
    var $box = $('<div class="box" style="width: 100px;height: 40px;"><iframe class="tag-iframe" style="width:100%;height:100%;"></iframe></div>');
    var parts = prop.parts;
    return setRectP($box, prop), $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type}), setTagsParts($box, parts, prop), $box
}

function bulidSwiper(prop, data) {
    var $box = $('<div class="box" style="width: 480px;height: 320px;"><div class="tag-swiper swiper-container"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div></div></div>');
    var parts = prop.parts;
    setRectP($box, prop), $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type}), setTagsParts($box, parts, prop), 0 < prop.slides.length && $.each(prop.slides, function (index, val) {
        var swiperSlide = $('<div class="swiper-slide"></div>');
        val.id || (val.id = guid()), swiperSlide.attr("id", "slide-" + val.id), swiperSlide.appendTo($box.find(".swiper-wrapper")), createTagsBox(val, !1, swiperSlide)
    });
    var _swiper = new Swiper($box.find(".tag-swiper"), prop.swiper);
    return $box.data("prop").mySwiper = _swiper, $box
}

function bulidCircle(prop, data) {
    var $box = $('<div class="box" style="width: 100px;height: 40px;"><div class="tag-circle" style="width:100%;height:100%;border-radius: 100%;background-color:#ffffff"></div></div>');
    var parts = prop.parts;
    return setRectP($box, prop), $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type}), setTagsParts($box, parts, prop), $box
}

function bulidTable(prop, data) {
    var $box = $('<div class="box" style="width: 480px;height: 320px;"><div class="tag-table kgo-scroll-sty " style="width:100%;height:100%;overflow:hidden;"><div style="width:100%;height:auto;"><div class="kgo-scroll-head"></div><div class="kgo-scroll-body"><ul class="kgo-scroll-body-ul"></ul></div></div></div></div>');
    var parts = prop.parts;
    setRectP($box, prop), delete prop.id, $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type});
    var s = $box.find(".tag-" + prop.type), i = void 0 === prop.parts ? null : prop.parts.tableHeight || null;
    if (data) {
        var n = prop.data, d = getJsonValue(data, n.dimension[0].keyname), o = {
            ajax_data: getJsonValue(data, n.series[0].keyname),
            ajax_type: "POST",
            supportCheckbox: !1,
            supportAutoOrder: !1,
            height: "100%",
            width: "100%",
            tableHeight: i,
            columnData: d
        };
        s.initScroll(o), $box.data("prop").gmOptions = o
    } else prop.gmOptions.tableHeight = i, s.initScroll(prop.gmOptions);
    return prop.effect && prop.effect.autoscroll && s.autoScroll(), setTagsParts($box, parts, prop), $box
}

function bulidTime(prop, data) {
    var $box = $('<div class="box" style="width: 100px;height: 40px;"><div class="clock tag-time"></div></div>');
    var parts = prop.parts;
    return setRectP($box, prop), $box.appendTo("#content"), $box.data("prop", prop), $box.initBox({tagType: prop.type}), $box.find(".tag-" + prop.type).ledTime(), setTagsParts($box, parts, prop), $box
}

function createChart(prop, elem) {
    prop.myChart && prop.myChart.dispose(), "string" == typeof prop.options && (prop.options = eval("(" + prop.options + ")")), prop.optionsText && "string" == typeof prop.optionsText && (prop.options = eval("(" + prop.optionsText + ")"));
    var html = $('<div class="box" style="height:100%;width:100%;"><div class="tag-charts" style="height:100%;width:100%"></div></div>');
    return html.data("prop", prop), prop.slide ? (html.appendTo(elem), html.find(".tag-charts").bind("click", function () {
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

function bulidLineChart(prop, data) {
    var _prop = prop.data("prop"), _subtype = _prop.subtype, _data = _prop.data, _other = _prop.other, _options = _prop.options || {};
    if (data) {
        _options.legend = _options.legend || {}, _options.legend.data = _options.legend.data || [], _options.series = _options.series || [];
        var jsonValue = getJsonValue(data, _data.dimension[0].keyname);
        $.each(_data.series, function (index, val) {
            var a = {data: getJsonValue(data, val.keyname), type: _prop.type, name: val.displayname};
            2 == _subtype ? a.areaStyle = {} : 3 == _subtype && (a.areaStyle = {}, a.stack = "堆叠标识"), _options.series[index] ? _options.series[index] = $.extend({}, _options.series[index], a) : _options.series.push(a), _options.legend.data[index] ? _options.legend.data[index] = val.displayname : _options.legend.data.push(val.displayname)
        }), _options.series = _options.series.slice(0, _data.series.length), _options.legend.data = _options.legend.data.slice(0, _data.series.length), _options.xAxis.data = jsonValue, _other.sXAxis = _options.xAxis, _other.sYAxis = _options.yAxis
    }
    return setChartTheme(prop, _prop), prop
}

function bulidBarChart(prop, data) {
    var _prop = prop.data("prop");
    var _data = _prop.data;
    var _options = _prop.options || {};
    var _other = _prop.other || {};

    if (data) {
        _options.legend = _options.legend || {};
        _options.legend.data = _options.legend.data || [];
        _options.series = _options.series || [];

        var n = getJsonValue(data, _data.dimension[0].keyname);
        debugger
        $.each(_data.series, function (e, t) {
            var a = {data: getJsonValue(data, t.keyname), type: _prop.type, name: t.displayname};
            _options.series[e] ? _options.series[e] = $.extend({}, _options.series[e], a) : _options.series.push(a), _options.legend.data[e] ? _options.legend.data[e] = t.displayname : _options.legend.data.push(t.displayname)
        }), _options.series = _options.series.slice(0, _data.series.length), _options.legend.data = _options.legend.data.slice(0, _data.series.length), _other.axis ? _options.yAxis.data = n : _options.xAxis.data = n, _other.sXAxis = _options.xAxis, _other.sYAxis = _options.yAxis
    }
    return setChartTheme(prop, _prop), prop
}

function bulidPieChart(prop, data) {
    var _prop = prop.data("prop"), _data = _prop.data, _options = _prop.options || {};
    if (data) {
        _options.legend = _options.legend || {}, _options.legend.data = _options.legend.data || [], _options.series = _options.series || [];
        for (var i = getJsonValue(data, _data.dimension[0].keyname), n = getJsonValue(data, _data.series[0].keyname), d = [], o = 0; o < i.length; o++) {
            var p = {name: i[o], value: n[o]};
            _options.legend.data[o] ? _options.legend.data[o] = i[o] : _options.legend.data.push(i[o]), d.push(p)
        }
        _options.legend.data = _options.legend.data.slice(0, i.length);
        var l = {data: d, type: _prop.type};
        _options.series[0] ? _options.series[0] = $.extend({}, _options.series[0], l) : _options.series.push(l)
    }
    return setChartTheme(prop, _prop), prop
}

function bulidRadarChart(prop, data) {
    var _prop = prop.data("prop"), _data = _prop.data, _options = _prop.options || {};
    if (data) {
        _options.legend = _options.legend || {}, _options.legend.data = _options.legend.data || [];
        var n = getJsonValue(data, _data.dimension[0].keyname), r = getJsonValue(data, _data.series[0].keyname);
        _options.series = _options.series || [], _options.radar = _options.radar || {}, _options.radar.indicator = _options.radar.indicator || [];
        var d = {}, o = 0;
        $.each(r, function (e, t) {
            var a = {data: [], type: _prop.type}, r = {name: n[e], value: []};
            _options.legend.data[e] ? _options.legend.data[e] = n[e] : _options.legend.data.push(n[e]), $.each(t, function (e, t) {
                d[t.indicator] = t.value, o = o > t.value ? o : t.value, r.value.push(t.value)
            }), a.data.push(r), _options.series[e] ? _options.series[e] = $.extend({}, _options.series[e], a) : _options.series.push(a)
        }), _options.series = _options.series.slice(0, r.length), _options.legend.data = _options.legend.data.slice(0, n.length);
        var p = 0;
        $.each(d, function (e, t) {
            _options.radar.indicator[p] ? _options.radar.indicator[p] = $.extend({}, _options.radar.indicator[p], {
                name: e,
                max: o
            }) : _options.radar.indicator.push({name: e, max: o}), p++
        }), _options.radar.indicator = _options.radar.indicator.slice(0, p)
    }
    return setChartTheme(prop, _prop), prop
}

function bulidTreeChart(prop, data) {
    var _prop = prop.data("prop"), _data = _prop.data, _options = _prop.options || {};
    if (data) {
        var jsonValue = getJsonValue(data, _data.series[0].keyname);
        _options.series = [];
        var n = {data: [jsonValue], type: _prop.type};
        _options.series.push(n)
    }
    return setChartTheme(prop, _prop), prop
}

function bulidTreemapChart(prop, data) {
    var _prop = prop.data("prop"), _data = _prop.data, _options = _prop.options || {};
    if (data) {
        var jsonValue = getJsonValue(data, _data.series[0].keyname);
        _options.series = [];
        var n = {data: jsonValue, type: _prop.type};
        _options.series.push(n)
    }
    return setChartTheme(prop, _prop), prop
}

function bulidSunburstChart(prop, data) {
    var _prop = prop.data("prop"), _data = _prop.data, _options = _prop.options || {};
    if (data) {
        var jsonValue = getJsonValue(data, _data.series[0].keyname);
        _options.series = [];
        var n = {data: jsonValue, type: _prop.type};
        _options.series.push(n)
    }
    return setChartTheme(prop, _prop), prop
}

function bulidFunnelChart(prop, data) {
    var _prop = prop.data("prop"), _data = _prop.data, _options = _prop.options || {};
    if (data) {
        var i = getJsonValue(data, _data.series[0].keyname);
        _options.series = [], $.each(i, function (e, t) {
            var a = t;
            a.type = _prop.type, _options.series.push(a)
        })
    }
    return setChartTheme(prop, _prop), prop
}

function bulidGaugeChart(prop, data) {
    var _prop = prop.data("prop"), _data = _prop.data, _options = _prop.options || {}, i = _prop.other;
    if (data) {
        var n = getJsonValue(data, _data.series[0].keyname);
        _options.series = _options.series || [], $.each(n, function (e, t) {
            var a = {};
            (a = 4 == i.dataFrom ? {data: [{value: t}]} : $.extend({}, a, t)).type = _prop.type, _options.series[e] ? _options.series[e] = $.extend({}, _options.series[e], a) : _options.series.push(a), _options.series[e].data[e] ? _options.series[e].data[e] = $.extend({}, _options.series[e].data[e], t) : _options.series[e].data.push(t)
        }), _options.series = _options.series.slice(0, n.length)
    }
    return setChartTheme(prop, _prop), prop
}

function bulidMapChart(prop, data) {
    var _mappath = prop.data("prop").other.mappath;
    return -1 < _mappath.indexOf("geographic") && (_mappath = _mappath.substring(_mappath.indexOf("geographic") + "geographic".length, _mappath.length)), getAjaxMapDataSync({mappath: _mappath}, function (e) {
        if (0 == e.code) {
            data = e.res;
            var t = hex_md5(data), a = data;
            echarts.registerMap(t, a), bulidMapData(prop, t, _mappath, data)
        }
    }), prop
}

function bulidMapData(prop, t, mappath, data) {
    var _prop = prop.data("prop"), n = $.extend({}, _prop.options);
    n.geo.map = t;
    var s = _prop.data;
    if (data) {
        n.series = n.series || [], n.legend = n.legend || {}, n.legend.data = [];
        var d = 0;
        $.each(s.dimension, function (index, val) {
            var a = getJsonValue(data, val.keyname), r = val.displayname;
            -1 < $.inArray(val.displayname, n.legend.data) ? (n.legend.data.push(val.displayname + d), r += d) : n.legend.data.push(val.displayname);
            var s = {name: r, data: a, type: "scatter", coordinateSystem: "geo"};
            n.series[d] ? n.series[d] = $.extend({}, n.series[d], s) : n.series.push(s), d++
        }), $.each(s.series, function (index, val) {
            var a = getJsonValue(data, val.keyname), r = val.displayname;
            -1 < $.inArray(val.displayname, n.legend.data) ? (n.legend.data.push(val.displayname + d), r += d) : n.legend.data.push(val.displayname);
            var s = {name: r, data: a, type: "effectScatter", coordinateSystem: "geo"};
            n.series[d] ? n.series[d] = $.extend({}, n.series[d], s) : n.series.push(s), d++
        }), n.series = n.series.slice(0, d), n.legend.data = n.legend.data.slice(0, d)
    }
    var _chartsDom = prop.find(".tag-charts")[0], p = echarts.init(_chartsDom);
    p.setOption(n, !0), _prop.options = n, _prop.myChart = p, _prop.other.mappath = mappath, _prop.optionsText = JSON.stringify(n, function (e, t) {
        return "function" == typeof t ? "&" + t.toString().replace(/\s+/g, " ").replace(/\n/g, "") + "&" : t
    }, 4), _prop.optionsText = _prop.optionsText.replace(/"&/g, "").replace(/&"/g, ""), prop.data("prop", _prop), prop.initdata(), $(".box").removeClass("box-selected"), currBox = prop
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
            echarts.registerTheme(n.theme, t);
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