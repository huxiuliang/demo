!function ($) {
    $.fn.extend({
        initProp: function (method) {
            var methods = {
                init: function (e) {
                    var a = $.extend({}, e);
                    return this.each(function () {
                        var t = $(this);
                        t.empty();
                        var e = a.data;
                        $.each(e, function (e, a) {
                            addPropDom(t, a)
                        })
                    })
                }
            };

            function addPropDom(e, a) {
                var t = a.type;
                "driver" == t ? addDriver(e, a) : "title" == t ? addTitle(e, a) : "btn" == t ? addBtn(e, a) : "tag" == t ? addPropTag(e, a) : "tabs" == t && addTabs(e, a)
            }

            function addDriver(e, a) {
                e.append('<div class="prop-driver"></div>')
            }

            function addTitle(e, a) {
                e.append('<div class="prop-title">' + a.name + "</div>")
            }

            function addBtn(e, a) {
                var t = $('<div class="prop-btn"></div>'), o = $('<button type="button">' + a.name + "</button>");
                o.bind("click", function () {
                    a.keyname && window[a.keyname]()
                }), t.append(o), e.append(t)
            }

            function addPropTag(e, a) {
                var t = $('<div class="prop-tag"></div>'), o = $('<div class="tag-checkbox fa fa-square-o"></div>'),
                    r = $('<div class="tag-title">' + a.name + "</div>"), s = $('<div class="prop-widget"></div>'),
                    n = $('<div class="prop-over"></div>');
                t.append(o).append(r).append(s).append(n), e.append(t), o.bind("click", function () {
                    $(this).parent().hasClass("on") ? ($(this).removeClass("fa-check-square-o").addClass("fa-square-o"), $(this).parent().removeClass("on"), n.show()) : ($(this).addClass("fa-check-square-o").removeClass("fa-square-o"), $(this).parent().addClass("on"))
                }), n.bind("click", function () {
                    $(this).parent().hasClass("on") || (o.addClass("fa-check-square-o").removeClass("fa-square-o"), $(this).parent().addClass("on"), $(this).hide())
                }), getTag(s, a)
            }

            function getTag(e, a) {
                switch (a.tag) {
                    case"input":
                        createInput(e, a);
                        break;
                    case"radio":
                        ctreateRadio(e, a);
                        break;
                    case"slider":
                        createSlider(e, a);
                        break;
                    case"doubleSlider":
                        createDoubleSlider(e, a);
                        break;
                    case"color":
                        createColorPicker(e, a);
                        break;
                    case"inputBtn":
                        createInputBtn(e, a);
                        break;
                    case"button":
                        createButton(e, a)
                }
            }

            function createInput(e, a) {
                var t = e.closest(".ui-tabs-panel").data(), o = $('<div class="prop-widget-input"></div>'),
                    r = $('<input type="text" />');
                o.append(r), e.append(o), r.bind("change", function () {
                    "series" == t.keyname ? setBoxPropVal(a.keyname, $(this).val(), t.keyname, t.index) : setBoxPropVal(a.keyname, $(this).val(), !1)
                });
                var s = getBoxPropVal(a.keyname, t.keyname, t.index), n = s;
                isArray(s) && (n = s[0]), n && (n = "function" == typeof n ? n.toString() : n, r.val(n), e.parent().addClass("on"), e.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), e.parent().find(".prop-over").hide())
            }

            function ctreateRadio(e, a) {
                var t = e.closest(".ui-tabs-panel").data(), o = $('<div class="prop-widget-radio"></div>'),
                    r = $("<ul></ul>");
                if ("string" == typeof a.items) {
                    var s = a.items.split("|");
                    $.each(s, function (e, a) {
                        var t = a.split("-");
                        $('<li data-value="' + t[1] + '">' + t[0] + "</li>").appendTo(r)
                    })
                } else $.each(a.items, function (e, a) {
                    $('<li data-value="' + a.value + '">' + a.text + "</li>").appendTo(r)
                });
                r.children("li").bind("click", function () {
                    if (!$(this).parents(".prop-tag").hasClass("on")) return !1;
                    $(this).addClass("on").siblings("li").removeClass("on");
                    var e = $(this).data("value");
                    "series" == t.keyname ? setBoxPropVal(a.keyname, e, t.keyname, t.index) : setBoxPropVal(a.keyname, e, !1)
                }), o.append(r), e.append(o);
                var n = getBoxPropVal(a.keyname, t.keyname, t.index), i = n;
                isArray(n) && (i = n[0]), i && (r.find("li[data-value=" + i + "]").addClass("on").siblings("li").removeClass("on"), e.parent().addClass("on"), e.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), e.parent().find(".prop-over").hide())
            }

            function createSlider(e, o) {
                var r = e.closest(".ui-tabs-panel").data(), a = $('<div class="prop-widget-slider"></div>'),
                    t = $("<div><div/>"), s = $('<input class="slider-input" type="number" />');
                a.append(t), e.append(a).append(s);
                var n = $.extend({
                    change: function (e, a) {
                    }, slide: function (e, a) {
                        s.val(a.value);
                        var t = Number(a.value);
                        o.items && (t += o.items), "series" == r.keyname ? setBoxPropVal(o.keyname, t, r.keyname, r.index) : setBoxPropVal(o.keyname, t, !1)
                    }
                }, {min: 0, max: 100});
                t.slider(n), s.bind("change", function () {
                    var e = Number($(this).val());
                    o.items && (e += o.items), "series" == r.keyname ? setBoxPropVal(o.keyname, e, r.keyname, r.index) : setBoxPropVal(o.keyname, e, !1);
                    var a = t.slider("option", "max");
                    $(this).val() > a && t.slider("option", "max", $(this).val()), t.slider("value", $(this).val())
                });
                var i = getBoxPropVal(o.keyname, r.keyname, r.index), p = i;
                (isArray(i) && (p = i[0]), p) && ("" != o.items && (p = (p + "").split(o.items)[0]), s.val(p), t.slider("option", "max") < p && t.slider("option", "max", p), t.slider("value", p), e.parent().addClass("on"), e.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), e.parent().find(".prop-over").hide())
            }

            function createDoubleSlider(e, o) {
                var r = e.closest(".ui-tabs-panel").data(), a = $('<div class="prop-widget-slider"></div>'),
                    s = $("<div><div/>"), n = $('<input class="slider-input" type="number" />'),
                    t = $('<div class="prop-widget-slider"></div>'), i = $("<div><div/>"),
                    p = $('<input class="slider-input" type="number" />');
                a.append(s), t.append(i), e.append(a).append(n).append(t).append(p);
                $.extend({
                    change: function (e, a) {
                    }, slide: function (e, a) {
                        input.val(a.value), "series" == r.keyname ? setBoxPropVal(o.keyname, Number(a.value) + o.items, r.keyname, r.index) : setBoxPropVal(o.keyname, Number(a.value) + o.items, !1)
                    }
                }, {min: -100, max: 100});
                s.slider({
                    slide: function (e, a) {
                        n.val(a.value);
                        var t = [];
                        o.items ? (t.push(a.value + o.items), t.push(i.slider("value") + o.items)) : (t.push(a.value), t.push(i.slider("value"))), "series" == r.keyname ? setBoxPropVal(o.keyname, t, r.keyname, r.index) : setBoxPropVal(o.keyname, t, !1)
                    }
                }), i.slider({
                    slide: function (e, a) {
                        p.val(a.value);
                        var t = [];
                        o.items ? (t.push(s.slider("value") + o.items), t.push(a.value + o.items)) : (t.push(s.slider("value")), t.push(a.value)), "series" == r.keyname ? setBoxPropVal(o.keyname, t, r.keyname, r.index) : setBoxPropVal(o.keyname, t, !1)
                    }
                }), n.bind("change", function () {
                    var e = s.slider("option", "max"), a = $(this).val();
                    e < a && s.slider("option", "max", a), s.slider("value", a);
                    var t = [];
                    o.items ? (t.push(a + o.items), t.push(i.slider("value") + o.items)) : (t.push(a), t.push(i.slider("value"))), "series" == r.keyname ? setBoxPropVal(o.keyname, t, r.keyname, r.index) : setBoxPropVal(o.keyname, t, !1)
                }), p.bind("change", function () {
                    var e = i.slider("option", "max"), a = $(this).val();
                    e < a && i.slider("option", "max", a), i.slider("value", a);
                    var t = [];
                    o.items ? (t.push(s.slider("value") + o.items), t.push(a + o.items)) : (t.push(s.slider("value")), t.push(a)), "series" == r.keyname ? setBoxPropVal(o.keyname, t, r.keyname, r.index) : setBoxPropVal(o.keyname, t, !1)
                });
                var d = getBoxPropVal(o.keyname, r.keyname, r.index);
                if (isArray(d)) {
                    var l = d[0], c = d[1];
                    if (!isNaN(l) && !isNaN(c)) o.items && (l = l.split(o.items)[0], c = c.split(o.items)[0]), n.val(l), s.slider("option", "max") < l && s.slider("option", "max", l), s.slider("value", l), p.val(c), i.slider("option", "max") < c && i.slider("option", "max", c), i.slider("value", c), e.parent().addClass("on"), e.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), e.parent().find(".prop-over").hide()
                }
            }

            function createColorPicker(e, a) {
                var t = e.closest(".ui-tabs-panel").data(), o = $('<div class="prop-widget-color"></div>'),
                    r = $('<div class="colorPicker"><div/>');
                o.append(r), e.append(o), r.spectrum({
                    showPalette: !0,
                    showInput: !0,
                    allowEmpty: !0,
                    showAlpha: !0,
                    showSelectionPalette: !0,
                    showInitial: !0,
                    preferredFormat: "rgba",
                    palette: [["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"], ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"], ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d9ead8", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"], ["#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47"], ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"]],
                    cancelText: "取消",
                    chooseText: "确认",
                    change: function (e) {
                    },
                    show: function (e) {
                    },
                    move: function (e) {
                    },
                    hide: function (e) {
                    },
                    choose: function (e) {
                        e = e ? e.toRgbString() : "auto", r.css("background-color", e), "series" == t.keyname ? setBoxPropVal(a.keyname, e, t.keyname, t.index) : setBoxPropVal(a.keyname, e, !1)
                    }
                });
                var s = getBoxPropVal(a.keyname, t.keyname, t.index), n = s;
                isArray(s) && (n = s[0]), n && (r.spectrum("set", n), r.css("background-color", n), e.parent().addClass("on"), e.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), e.parent().find(".prop-over").hide())
            }

            function createInputBtn(e, a) {
                var t = e.closest(".ui-tabs-panel").data(), o = $('<div class="prop-widget-input"></div>'),
                    r = $('<input class="input-btn-input" type="text" />'),
                    s = $('<button class="input-btn-btn" type="button">...</button>');
                s.bind("click", function () {
                    a.items && window[a.items](r)
                }), o.append(r).append(s), e.append(o), r.bind("change blur", function () {
                    console.log("asdasdas"), "series" == t.keyname ? setBoxPropVal(a.keyname, $(this).val(), t.keyname, t.index) : setBoxPropVal(a.keyname, $(this).val(), !1)
                });
                var n = getBoxPropVal(a.keyname, t.keyname, t.index), i = n;
                isArray(n) && (i = n[0]), i && (r.val(i), e.parent().addClass("on"), e.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), e.parent().find(".prop-over").hide())
            }

            function createButton(e, a) {
                var t = e.closest(".ui-tabs-panel").data(), o = $('<button class="button-btn" type="button"></button>'),
                    r = getBoxPropVal(a.keyname, t.keyname, t.index);
                o.html(a.value), o.bind("click", function () {
                    if (a.items) {
                        var e = getBoxPropVal(a.keyname, t.keyname, t.index);
                        window[a.items](e, function (e) {
                            setBoxPropVal(a.keyname, e, !1)
                        })
                    }
                }), e.append(o), r && (e.parent().addClass("on"), e.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), e.parent().find(".prop-over").hide())
            }

            function addTabs(e, a) {
                var r = $('<div class="prop-tabs"></div>'), t = a.items, s = $("<ul></ul>");
                r.append(s), $.each(t, function (e, a) {
                    $('<li class="prop-tabs-item">' + a.text + "</li>").appendTo(s);
                    var t = $('<div class="prop-tabs-page"></div>');
                    r.append(t);
                    var o = a.items;
                    $.each(o, function (e, a) {
                        addPropDom(t, a)
                    })
                }), e.append(r), r.propTabs()
            }

            function getBoxPropVal(e, a, t) {
                return getJsonValue(currBox.data("prop"), e, a, t)
            }

            function getJsonValue(e, a, t, o) {
                var r = a.split("."), s = e[r[0]];
                return "[object Array]" === Object.prototype.toString.apply(s) ? getJsonArray(s, 0, r, t, o) : "[object Object]" === Object.prototype.toString.apply(s) ? getJsonObject(s, 0, r, t, o) : s
            }

            function getJsonObject(e, a, t, o, r) {
                if (a < t.length) {
                    var s = e[t[a + 1]];
                    return "[object Array]" === Object.prototype.toString.apply(s) ? getJsonArray(s, a + 1, t, o, r) : "[object Object]" === Object.prototype.toString.apply(s) ? getJsonObject(s, a + 1, t, o, r) : s
                }
            }

            function getJsonArray(e, o, r, s, n) {
                if (s != r[o]) {
                    var i = [];
                    return $.each(e, function (e, a) {
                        if (o < r.length) {
                            var t = a[r[o + 1]];
                            "[object Array]" === Object.prototype.toString.apply(t) ? i.push(getJsonArray(t, o + 1, r, s, n)) : "[object Object]" === Object.prototype.toString.apply(t) ? i.push(getJsonObject(t, o + 1, r, s, n)) : "[string String]" === Object.prototype.toString.apply(a) ? i.push(a) : i.push(t)
                        }
                    }), i
                }
                var a = e[n];
                if (o < r.length) {
                    var t = a[r[o + 1]];
                    return o + 1 == r.length - 1 ? t : "[object Array]" === Object.prototype.toString.apply(t) ? getJsonArray(t, o + 1, r, s, n) : "[object Object]" === Object.prototype.toString.apply(t) ? getJsonObject(t, o + 1, r, s, n) : t
                }
            }

            function setBoxPropVal(name, val, flag, pindex) {
                var box = currBox, prop = box.data("prop");
                setJsonValue(prop, name, val, flag, pindex);
                var keys = name.split(".");
                if ("rectP" == keys[0]) {
                    box.rotateResize("setBoxProp", prop.rectP);
                    var myChart = box.data("prop").myChart;
                    myChart && myChart.resize()
                } else if ("options" == keys[0]) {
                    var myChart = box.data("prop").myChart;
                    if (myChart) {
                        var tempOptions = $.extend(!0, {}, eval("(" + prop.optionsText + ")"), prop.options);
                        prop.optionsText = JSON.stringify(tempOptions, function (e, a) {
                            return "function" == typeof a ? "&" + a.toString().replace(/\s+/g, " ").replace(/\n/g, "") + "&" : a
                        }, 4), prop.optionsText = prop.optionsText.replace(/"&/g, "").replace(/&"/g, ""), jsonExtentEditor.setValue(prop.optionsText), myChart.setOption(prop.options)
                    }
                } else if ("other" == keys[0]) "theme" != keys[1] && "axis" != keys[1] || bulidChartOther(currBox); else if ("parts" == keys[0]) switch (keys[1]) {
                    case"fontSize":
                        box.find(".tag-" + prop.type).css("font-size", val + "px");
                        break;
                    case"fontWeight":
                        box.find(".tag-" + prop.type).css("font-weight", val);
                        break;
                    case"textShadow":
                        box.find(".tag-" + prop.type).css("text-shadow", val);
                        break;
                    case"color":
                        box.find(".tag-" + prop.type).css("color", val);
                        break;
                    case"backgroundImage":
                        var strurl = val;
                        strurl = strurl.replace(/\\/g, "/"), box.find(".tag-" + prop.type).css({
                            "background-image": "url('" + strurl + "')",
                            "background-repeat": "no-repeat",
                            "background-size": "100% 100%"
                        });
                        break;
                    case"backgroundColor":
                        box.find(".tag-" + prop.type).css({"background-color": val});
                        break;
                    case"backgroundSize":
                        var sizeVal = "";
                        val && 2 == val.length && 0 < val[0] && 0 < val[1] && (sizeVal = val[0] + "% " + val[1] + "%"), box.find(".tag-" + prop.type).css({"background-size": sizeVal});
                        break;
                    case"backgroundRepeat":
                        box.find(".tag-" + prop.type).css({"background-repeat": val.replace("_", "-")});
                        break;
                    case"imgUrl":
                        box.find(".tag-" + prop.type).attr("src", val);
                        break;
                    case"text":
                        box.find(".tag-" + prop.type).html(val);
                        break;
                    case"borderRadius":
                        box.find(".tag-" + prop.type).css({"border-radius": val + "px"});
                        break;
                    case"iframeUrl":
                        -1 == val.indexOf("http://") && (val = "http://" + val), box.find(".tag-" + prop.type).attr("src", val);
                        break;
                    case"fontFamily":
                        box.find(".tag-" + prop.type).css("font-family", val);
                        break;
                    case"borderWidth":
                        box.find(".tag-" + prop.type).css("border-width", val);
                        break;
                    case"borderStyle":
                        box.find(".tag-" + prop.type).css("border-style", val);
                        break;
                    case"borderColor":
                        box.find(".tag-" + prop.type).css("border-color", val);
                        break;
                    case"textAlign":
                        box.find(".tag-" + prop.type).css("text-align", val);
                        break;
                    case"lineHeight":
                        box.find(".tag-" + prop.type).css("line-height", val + "px");
                        break;
                    case"tableHeight":
                        box.find(".tag-" + prop.type).find("ul.kgo-scroll-body-ul li").css("height", val + "px")
                } else if ("swiper" == keys[0]) {
                    box.data("prop").mySwiper.destroy(!0, !0);
                    var swiper = box.data("prop").swiper, mySwiper = new Swiper(box.find(".tag-swiper"), swiper);
                    box.data("prop").mySwiper = mySwiper
                } else if ("effect" == keys[0]) switch (keys[1]) {
                    case"autoscroll":
                        val ? box.autoScroll() : box.stopScroll()
                }
                undoRecord()
            }

            function setJsonValue(e, a, t, o, r) {
                var s = a.split(".");
                e.hasOwnProperty(s[0]) || (e[s[0]] = {});
                var n = e[s[0]];
                "[object Array]" === Object.prototype.toString.apply(n) ? setJsonArray(n, 0, s, t, o, r) : "[object Object]" === Object.prototype.toString.apply(n) ? setJsonObject(n, 0, s, t, o, r) : "delObj" == t ? delete e[s[0]] : e[s[0]] = t
            }

            function setJsonObject(e, a, t, o, r, s) {
                if (a < t.length - 1) {
                    e.hasOwnProperty(t[a + 1]) || a + 1 == t.length - 1 || (e[t[a + 1]] = {});
                    var n = e[t[a + 1]];
                    "[object Array]" === Object.prototype.toString.apply(n) ? setJsonArray(n, a + 1, t, o, r, s) : "[object Object]" === Object.prototype.toString.apply(n) ? setJsonObject(n, a + 1, t, o, r, s) : "delObj" == o ? delete e[t[a + 1]] : e[t[a + 1]] = o
                }
            }

            function setJsonArray(o, r, s, n, i, p) {
                if (i && r < s.length - 1) {
                    if (i == s[r]) {
                        var e = o[p];
                        e.hasOwnProperty(s[r + 1]) || r + 1 == s.length - 1 ? r + 1 == s.length - 1 && (e[s[r + 1]] = n) : e[s[r + 1]] = {};
                        var a = e[s[r + 1]];
                        "[object Array]" === Object.prototype.toString.apply(a) ? setJsonArray(a, r + 1, s, n, i, p) : "[object Object]" === Object.prototype.toString.apply(a) ? setJsonObject(a, r + 1, s, n, i, p) : "delObj" == n ? delete e[s[r + 1]] : e[s[r + 1]] = n
                    }
                } else $.each(o, function (e, a) {
                    if (r < s.length - 1) {
                        a.hasOwnProperty(s[r + 1]) || r + 1 == s.length - 1 || (a[s[r + 1]] = {});
                        var t = a[s[r + 1]];
                        "[object Array]" === Object.prototype.toString.apply(t) ? setJsonArray(t, r + 1, s, n, i, p) : "[object Object]" === Object.prototype.toString.apply(t) ? setJsonObject(t, r + 1, s, n, i, p) : "delObj" == n ? delete a[s[r + 1]] : a[s[r + 1]] = n
                    } else o[e] = n[e]
                })
            }

            function isEmptyObject(e) {
                var a;
                for (a in e) return !1;
                return !0
            }

            function isArray(e) {
                return "[object Array]" === Object.prototype.toString.apply(e)
            }

            function isObjecty(e) {
                return "[object Object]" === Object.prototype.toString.apply(e)
            }

            return methods[method] ? methods[method].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof method && method ? void $.error("Method " + method + " does not exist on jQuery.popupSelection") : methods.init.apply(this, arguments)
        }, propTabs: function (e) {
            var t = $.extend({width: 150}, e);
            return this.each(function () {
                var a = $(this);
                a.find(".prop-tabs-item").each(function () {
                    var e = t.width;
                    $(this).css("width", e + "px"), a.find(".prop-tabs-item").click(function () {
                        var e = $(this).index();
                        a.find(".prop-tabs-item").removeClass("show"), $(this).addClass("show"), a.find(".prop-tabs-page").removeClass("show"), a.find(".prop-tabs-page").eq(e).addClass("show")
                    })
                }), a.find(".prop-tabs-item").eq(0).addClass("show"), a.find(".prop-tabs-page").eq(0).addClass("show")
            })
        }
    })
}(jQuery);