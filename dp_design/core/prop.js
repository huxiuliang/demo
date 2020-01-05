!function ($) {
    $.fn.extend({
        initProp: function (method) {
            var methods = {
                init: function (data) {
                    var mergerData = $.extend({}, data);
                    return this.each(function () {
                        var elem = $(this);
                        console.log(elem.html())
                        elem.empty();
                        $.each(mergerData.data, function (index, val) {
                            addPropDom(elem, val)
                        })
                    })
                }
            };

            function addPropDom(elem, data) {
                var type = data.type;

                if ("driver" == type) {
                    addDriver(elem, data)
                } else if ("title" == type) {
                    addTitle(elem, data);
                } else if ("btn" == type) {
                    addBtn(elem, data)
                } else if ("tag" == type) {
                    addPropTag(elem, data)
                } else if ("tabs" == type) {
                    addTabs(elem, data)
                } else {
                    throw "类型无法解析";
                }
            }

            function addDriver(elem, data) {
                elem.append('<div class="prop-driver"></div>')
            }

            function addTitle(elem, data) {
                elem.append('<div class="prop-title">' + data.name + "</div>")
            }

            function addBtn(elem, data) {
                var $div = $('<div class="prop-btn"></div>');
                var $btn = $('<button type="button">' + data.name + "</button>");

                $btn.bind("click", function () {
                    data.keyname && window[data.keyname]()
                });
                $div.append($btn);
                elem.append($div);
            }

            function addPropTag(elem, data) {
                var $tag = $('<div class="prop-tag"></div>');
                var $check = $('<div class="tag-checkbox fa fa-square-o"></div>');
                var $title = $('<div class="tag-title">' + data.name + "</div>");
                var $widget = $('<div class="prop-widget"></div>');
                var $over = $('<div class="prop-over"></div>');
                $tag.append($check).append($title).append($widget).append($over);
                elem.append($tag);
                $check.bind("click", function () {
                    $(this).parent().hasClass("on") ? ($(this).removeClass("fa-check-square-o").addClass("fa-square-o"), $(this).parent().removeClass("on"), $over.show()) : ($(this).addClass("fa-check-square-o").removeClass("fa-square-o"), $(this).parent().addClass("on"))
                });
                $over.bind("click", function () {
                    $(this).parent().hasClass("on") || ($check.addClass("fa-check-square-o").removeClass("fa-square-o"), $(this).parent().addClass("on"), $(this).hide())
                });
                getTag($widget, data)
            }

            function getTag(elem, data) {
                switch (data.tag) {
                    case"input":
                        createInput(elem, data);
                        break;
                    case"radio":
                        ctreateRadio(elem, data);
                        break;
                    case"slider":
                        createSlider(elem, data);
                        break;
                    case"doubleSlider":
                        createDoubleSlider(elem, data);
                        break;
                    case"color":
                        createColorPicker(elem, data);
                        break;
                    case"inputBtn":
                        createInputBtn(elem, data);
                        break;
                    case"button":
                        createButton(elem, data)
                }
            }

            function createInput(elem, data) {
                var $panel = elem.closest(".ui-tabs-panel").data();
                var $widget = $('<div class="prop-widget-input"></div>');
                var $input = $('<input type="text" />');

                $widget.append($input);
                elem.append($widget);

                $input.bind("change", function () {
                    "series" == $panel.keyname ? setBoxPropVal(data.keyname, $(this).val(), $panel.keyname, $panel.index) : setBoxPropVal(data.keyname, $(this).val(), !1)
                });
                var boxPropVal = getBoxPropVal(data.keyname, $panel.keyname, $panel.index);
                var n = boxPropVal;
                isArray(boxPropVal) && (n = boxPropVal[0]), n && (n = "function" == typeof n ? n.toString() : n, $input.val(n), elem.parent().addClass("on"), elem.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o"), elem.parent().find(".prop-over").hide())
            }

            function ctreateRadio(elem, data) {

                var $tabsPanelData = elem.closest(".ui-tabs-panel").data();//匹配特定选择器且离当前元素最近的祖先元素
                var $div = $('<div class="prop-widget-radio"></div>');
                var $ul = $("<ul></ul>");

                if ("string" == typeof data.items) {
                    var temps = data.items.split("|");
                    $.each(temps, function (index, val) {
                        var t = val.split("-");
                        $('<li data-value="' + t[1] + '">' + t[0] + "</li>").appendTo($ul)
                    })
                } else {
                    $.each(data.items, function (index, val) {
                        $('<li data-value="' + val.value + '">' + val.text + "</li>").appendTo($ul)
                    });
                }
                $ul.children("li").bind("click", function () {

                    if (!$(this).parents(".prop-tag").hasClass("on")) {
                        return false;
                    }
                    $(this).addClass("on").siblings("li").removeClass("on");
                    var value = $(this).data("value");
                    if ("series" == $tabsPanelData.keyname) {
                        setBoxPropVal(data.keyname, value, $tabsPanelData.keyname, $tabsPanelData.index)
                    } else {
                        setBoxPropVal(data.keyname, value, !1)
                    }
                });

                $div.append($ul);
                elem.append($div);
                var boxPropVal = getBoxPropVal(data.keyname, $tabsPanelData.keyname, $tabsPanelData.index);

                if (boxPropVal && isArray(boxPropVal)) {

                    i = boxPropVal[0];

                    $ul.find("li[data-value=" + i + "]").addClass("on").siblings("li").removeClass("on");
                    elem.parent().addClass("on");
                    elem.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o");
                    elem.parent().find(".prop-over").hide();
                }
            }

            function createSlider(elem, data) {

                var $panel = elem.closest(".ui-tabs-panel").data();
                var $widget = $('<div class="prop-widget-slider"></div>');
                var $div = $("<div><div/>");
                var $input = $('<input class="slider-input" type="number" />');

                $widget.append($div);
                elem.append($widget).append($input);

                var n = $.extend({
                    change: function (e, a) {
                        //...
                    },
                    slide: function (e, a) {
                        $input.val(a.value);
                        var t = Number(a.value);

                        if (data.items) {
                            t += data.items
                        }

                        if ("seriejs" == $panel.keyname) {
                            setBoxPropVal(data.keyname, t, $panel.keyname, $panel.index)
                        } else {
                            setBoxPropVal(data.keyname, t, !1)
                        }
                    }
                }, {min: 0, max: 100});

                $div.slider(n);
                $input.bind("change", function () {
                    var e = Number($(this).val());

                    if (data.items) {
                        t += data.items
                    }

                    if ("seriejs" == $panel.keyname) {
                        setBoxPropVal(data.keyname, e, $panel.keyname, $panel.index)
                    } else {
                        setBoxPropVal(data.keyname, e, !1);
                    }

                    var a = $div.slider("option", "max");

                    if ($(this).val() > a) {
                        $div.slider("option", "max", $(this).val());
                        $div.slider("value", $(this).val());
                    }

                });
                var i = getBoxPropVal(data.keyname, $panel.keyname, $panel.index);

                if (i && isArray(i)) {

                    p = i[0];

                    if ("" != data.items) {

                        p = (p + "").split(data.items)[0];
                    }

                    $input.val(p);
                    $div.slider("option", "max") < p && $div.slider("option", "max", p);
                    $div.slider("value", p);
                    elem.parent().addClass("on");
                    elem.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o");
                    elem.parent().find(".prop-over").hide();
                }
            }

            function createDoubleSlider(elem, o) {

                var $panel = elem.closest(".ui-tabs-panel").data();
                var $widget = $('<div class="prop-widget-slider"></div>');
                var $div = $("<div><div/>");

                var $input = $('<input class="slider-input" type="number" />');
                var $widget2 = $('<div class="prop-widget-slider"></div>');
                var $div2 = $("<div><div/>");
                var $input2 = $('<input class="slider-input" type="number" />');

                $div.append($div);
                $widget2.append($div2);
                elem.append($div).append($input).append($widget2).append($input2);

                $.extend({
                    change: function (e, a) {
                        //...
                    }, slide: function (e, a) {
                        input.val(a.value);

                        if ("series" == $panel.keyname) {
                            setBoxPropVal(o.keyname, Number(a.value) + o.items, $panel.keyname, $panel.index)
                        } else {
                            setBoxPropVal(o.keyname, Number(a.value) + o.items, !1)
                        }
                    }
                }, {min: -100, max: 100});

                $div.slider({
                    slide: function (e, a) {
                        $input.val(a.value);
                        var t = [];
                        o.items ? (t.push(a.value + o.items), t.push($div2.slider("value") + o.items)) : (t.push(a.value), t.push($div2.slider("value"))), "series" == $panel.keyname ? setBoxPropVal(o.keyname, t, $panel.keyname, $panel.index) : setBoxPropVal(o.keyname, t, !1)
                    }
                });

                $div2.slider({
                    slide: function (e, a) {
                        $input2.val(a.value);
                        var t = [];

                        if (o.items) {
                            t.push($div.slider("value") + o.items);
                            t.push(a.value + o.items)
                        } else {
                            t.push($div.slider("value"));
                            t.push(a.value)
                        }

                        if ("series" == $panel.keyname) {
                            setBoxPropVal(o.keyname, t, $panel.keyname, $panel.index)
                        } else {
                            setBoxPropVal(o.keyname, t, !1)
                        }
                    }
                });

                $input.bind("change", function () {
                    var _max = $div.slider("option", "max");
                    var _val = $(this).val();

                    if (_max < _val) {
                        $div.slider("option", "max", _val);
                    }

                    $div.slider("value", _val);
                    var t = [];

                    if (o.items) {
                        t.push(_val + o.items), t.push($div2.slider("value") + o.items)
                    } else {
                        t.push(_val), t.push($div2.slider("value"))
                    }

                    if ("series" == $panel.keyname) {
                        setBoxPropVal(o.keyname, t, $panel.keyname, $panel.index)
                    } else {
                        setBoxPropVal(o.keyname, t, !1)
                    }

                });

                $input2.bind("change", function () {
                    var _max = $div2.slider("option", "max");
                    var _val = $(this).val();

                    if (_max < _val) {
                        $div2.slider("option", "max", _val);
                    }

                    $div2.slider("value", _val);
                    var t = [];

                    if (o.items) {
                        t.push($div.slider("value") + o.items), t.push(_val + o.items)
                    } else {
                        t.push($div.slider("value")), t.push(_val)
                    }

                    if ("series" == $panel.keyname) {
                        setBoxPropVal(o.keyname, t, $panel.keyname, $panel.index)
                    } else {
                        setBoxPropVal(o.keyname, t, !1)
                    }

                });
                var boxPropVal = getBoxPropVal(o.keyname, $panel.keyname, $panel.index);

                if (isArray(boxPropVal)) {

                    var _max = boxPropVal[0];
                    var _mix = boxPropVal[1];

                    if (!isNaN(_max) && !isNaN(_mix)) {

                        if (o.items) {
                            _max = _max.split(o.items)[0];
                            _mix = _mix.split(o.items)[0]
                        }

                        $input.val(_max);
                        $div.slider("option", "max") < _max && $div.slider("option", "max", _max);
                        $div.slider("value", _max);
                        $input2.val(_mix);
                        $div2.slider("option", "max") < _mix && $div2.slider("option", "max", _mix);
                        $div2.slider("value", _mix);
                        elem.parent().addClass("on");
                        elem.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o");
                        elem.parent().find(".prop-over").hide()
                    }
                }
            }

            function createColorPicker(elem, data) {
                var $panel = elem.closest(".ui-tabs-panel").data();
                var $widget = $('<div class="prop-widget-color"></div>');
                var $div = $('<div class="colorPicker"><div/>');

                $widget.append($div);
                elem.append($widget);
                $div.spectrum({
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
                        e = e ? e.toRgbString() : "auto";
                        $div.css("background-color", e);

                        if ("series" == $panel.keyname) {
                            setBoxPropVal(data.keyname, e, $panel.keyname, $panel.index)
                        } else {
                            setBoxPropVal(data.keyname, e, !1)
                        }
                    }
                });
                var boxPropVal = getBoxPropVal(data.keyname, $panel.keyname, $panel.index);
                var n;

                if (isArray(boxPropVal)) {
                    n = boxPropVal[0];
                    $div.spectrum("set", n);
                    $div.css("background-color", n);
                    elem.parent().addClass("on");
                    elem.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o");
                    elem.parent().find(".prop-over").hide()
                }
            }

            function createInputBtn(elem, data) {
                var $panel = elem.closest(".ui-tabs-panel").data();
                var $widget = $('<div class="prop-widget-input"></div>');
                var $input = $('<input class="input-btn-input" type="text" />');
                var $button = $('<button class="input-btn-btn" type="button">...</button>');

                $button.bind("click", function () {
                    data.items && window[data.items]($input)
                });
                $widget.append($input).append($button);
                elem.append($widget);
                $input.bind("change blur", function () {

                    if ("series" == $panel.keyname) {
                        setBoxPropVal(data.keyname, $(this).val(), $panel.keyname, $panel.index)
                    } else {
                        setBoxPropVal(data.keyname, $(this).val(), !1)
                    }
                });
                var boxPropVal = getBoxPropVal(data.keyname, $panel.keyname, $panel.index);

                if (isArray(boxPropVal)) {
                    var i = boxPropVal[0];
                    $input.val(i);
                    elem.parent().addClass("on");
                    elem.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o");
                    elem.parent().find(".prop-over").hide()
                }
            }

            function createButton(elem, data) {
                var $panel = elem.closest(".ui-tabs-panel").data();
                var $button = $('<button class="button-btn" type="button"></button>');
                var boxPropVal = getBoxPropVal(data.keyname, $panel.keyname, $panel.index);
                $button.html(data.value);
                $button.bind("click", function () {
                    if (data.items) {
                        var e = getBoxPropVal(data.keyname, $panel.keyname, $panel.index);
                        window[data.items](e, function (e) {
                            setBoxPropVal(data.keyname, e, !1)
                        })
                    }
                });

                elem.append($button);

                if (boxPropVal) {
                    elem.parent().addClass("on");
                    elem.parent().find(".tag-checkbox").addClass("fa-check-square-o").removeClass("fa-square-o");
                    elem.parent().find(".prop-over").hide()
                }
            }

            function addTabs(elem, data) {
                var $tabs = $('<div class="prop-tabs"></div>');
                var items = data.items;
                var $ul = $("<ul></ul>");

                $tabs.append($ul);
                $.each(items, function (index, val) {
                    $('<li class="prop-tabs-item">' + val.text + "</li>").appendTo($ul);
                    var $page = $('<div class="prop-tabs-page"></div>');
                    $tabs.append($page);
                    var items2 = val.items;
                    $.each(items2, function (index2, val2) {
                        addPropDom($page, val2)
                    })
                });

                elem.append($tabs);
                $tabs.propTabs()
            }

            function getBoxPropVal(targetNames, keyname, specifyIndex) {
                return getJsonValue(currBox.data("prop"), targetNames, keyname, specifyIndex)
            }

            function getJsonValue(prop, targetNames, keyname, specifyIndex) {

                var _targetNames = targetNames.split(".");
                var _prop = prop[_targetNames[0]];

                if ("[object Array]" === Object.prototype.toString.apply(_prop)) {
                    return getJsonArray(_prop, 0, _targetNames, keyname, specifyIndex)
                } else if ("[object Object]" === Object.prototype.toString.apply(_prop)) {
                    return getJsonObject(_prop, 0, _targetNames, keyname, specifyIndex)
                } else {
                    return _prop;
                }
            }

            function getJsonObject(data, firstIndex, targetNames, keyname, specifyIndex) {
                if (firstIndex < targetNames.length) {
                    var _data = data[targetNames[firstIndex + 1]];

                    if ("[object Array]" === Object.prototype.toString.apply(_data)) {
                        return getJsonArray(_data, firstIndex + 1, targetNames, keyname, specifyIndex)
                    } else if ("[object Object]" === Object.prototype.toString.apply(_data)) {
                        return getJsonObject(_data, firstIndex + 1, targetNames, keyname, specifyIndex)
                    } else {
                        return _data;
                    }
                }
            }

            function getJsonArray(data, firstIndex, targetNameArray, keyname, specifyIndex) {

                debugger
                if (keyname != targetNameArray[firstIndex]) {
                    var _array = [];

                    $.each(data, function (index, val) {
                        if (firstIndex < targetNameArray.length) {
                            var _data = val[targetNameArray[firstIndex + 1]];

                            if ("[object Array]" === Object.prototype.toString.apply(_data)) {
                                _array.push(getJsonArray(_data, firstIndex + 1, targetNameArray, keyname, specifyIndex))
                            } else if ("[object Object]" === Object.prototype.toString.apply(_data)) {
                                _array.push(getJsonObject(_data, firstIndex + 1, targetNameArray, keyname, specifyIndex))
                            } else if ("[string String]" === Object.prototype.toString.apply(val)) {
                                _array.push(val)
                            } else {
                                _array.push(_data)
                            }
                        }
                    });
                    return _array;
                }
                var a = data[specifyIndex];
                if (firstIndex < targetNameArray.length) {
                    var t = a[targetNameArray[firstIndex + 1]];

                    if (firstIndex + 1 == targetNameArray.length - 1) {
                        return t;
                    } else if ("[object Array]" === Object.prototype.toString.apply(t)) {
                        return getJsonArray(t, firstIndex + 1, targetNameArray, keyname, specifyIndex);
                    } else if ("[object Object]" === Object.prototype.toString.apply(t)) {
                        return getJsonObject(t, firstIndex + 1, targetNameArray, keyname, specifyIndex);
                    } else {
                        return t;
                    }
                }
            }

            function setBoxPropVal(name, val, flag, pindex) {
                var box = currBox;
                var prop = box.data("prop");
                setJsonValue(prop, name, val, flag, pindex);
                var keys = name.split(".");
                if ("rectP" == keys[0]) {
                    box.rotateResize("setBoxProp", prop.rectP);
                    var myChart = box.data("prop").myChart;
                    if (myChart) {
                        myChart.resize()
                    }
                } else if ("options" == keys[0]) {
                    var myChart = box.data("prop").myChart;
                    if (myChart) {
                        var tempOptions = $.extend(!0, {}, eval("(" + prop.optionsText + ")"), prop.options);
                        prop.optionsText = JSON.stringify(tempOptions, function (e, a) {
                            return "function" == typeof a ? "&" + a.toString().replace(/\s+/g, " ").replace(/\n/g, "") + "&" : a
                        }, 4);
                        prop.optionsText = prop.optionsText.replace(/"&/g, "").replace(/&"/g, "");
                        jsonExtentEditor.setValue(prop.optionsText);
                        myChart.setOption(prop.options);
                    }
                } else if ("other" == keys[0]) {

                    //"theme" != keys[1] &&
                    //"axis" != keys[1] ||
                    bulidChartOther(currBox);

                } else if ("parts" == keys[0]) {
                    switch (keys[1]) {
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
                    }
                } else if ("swiper" == keys[0]) {
                    box.data("prop").mySwiper.destroy(!0, !0);
                    var swiper = box.data("prop").swiper;
                    var mySwiper = new Swiper(box.find(".tag-swiper"), swiper);
                    box.data("prop").mySwiper = mySwiper

                } else if ("effect" == keys[0]) {
                    switch (keys[1]) {
                        case"autoscroll":
                            val ? box.autoScroll() : box.stopScroll()
                    }
                }
                undoRecord()
            }

            /**
             * prop, name, val, flag, pindex
             * @param prop
             * @param name
             * @param val
             * @param flag
             * @param pindex
             */
            function setJsonValue(prop, name, val, flag, pindex) {
                var names = name.split(".");
                prop.hasOwnProperty(names[0]) || (prop[names[0]] = {});
                var _prop = prop[names[0]];

                if ("[object Array]" === Object.prototype.toString.apply(_prop)) {
                    setJsonArray(_prop, 0, names, val, flag, pindex)
                } else if ("[object Object]" === Object.prototype.toString.apply(_prop)) {
                    setJsonObject(_prop, 0, names, val, flag, pindex)

                } else if ("delObj" == val) {
                    delete prop[names[0]]
                } else {
                    prop[names[0]] = val
                }
            }

            function setJsonObject(prop, len, name, val, flag, pindex) {
                if (len < name.length - 1) {
                    prop.hasOwnProperty(name[len + 1]) || len + 1 == name.length - 1 || (prop[name[len + 1]] = {});
                    var _prop = prop[name[len + 1]];

                    if ("[object Array]" === Object.prototype.toString.apply(_prop)) {
                        setJsonArray(_prop, len + 1, name, val, flag, pindex)
                    } else if ("[object Object]" === Object.prototype.toString.apply(_prop)) {
                        setJsonObject(_prop, len + 1, name, val, flag, pindex)
                    } else if ("delObj" == val) {
                        delete prop[name[len + 1]]
                    } else {
                        prop[name[len + 1]] = val
                    }
                }
            }

            function setJsonArray(prop, len, name, val, flag, pindex) {
                if (flag && len < name.length - 1) {
                    if (flag == name[len]) {
                        var e = prop[pindex];
                        e.hasOwnProperty(name[len + 1]) || len + 1 == name.length - 1 ? len + 1 == name.length - 1 && (e[name[len + 1]] = val) : e[name[len + 1]] = {};
                        var a = e[name[len + 1]];

                        if ("[object Array]" === Object.prototype.toString.apply(a)) {
                            setJsonArray(a, len + 1, name, val, flag, pindex)
                        } else if ("[object Object]" === Object.prototype.toString.apply(a)) {
                            setJsonObject(a, len + 1, name, val, flag, pindex)
                        } else if ("delObj" == val) {
                            delete e[name[len + 1]]
                        } else {
                            e[name[len + 1]] = val
                        }
                    }
                } else $.each(prop, function (e, a) {
                    if (len < name.length - 1) {
                        a.hasOwnProperty(name[len + 1]) || len + 1 == name.length - 1 || (a[name[len + 1]] = {});
                        var t = a[name[len + 1]];

                        if ("[object Array]" === Object.prototype.toString.apply(t)) {
                            setJsonArray(t, len + 1, name, val, flag, pindex)
                        } else if ("[object Object]" === Object.prototype.toString.apply(t)) {
                            setJsonObject(t, len + 1, name, val, flag, pindex)
                        } else if ("delObj" == val) {
                            delete a[name[len + 1]]
                        } else {
                            a[name[len + 1]] = val
                        }

                    } else {
                        prop[e] = val[e]
                    }
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

            if (methods[method]) {
                methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {

                if ("object" != typeof method && method) {
                    void $.error("Method " + method + " does not exist on jQuery.popupSelection")
                } else {
                    methods.init.apply(this, arguments)
                }
            }

        },

        propTabs: function (e) {
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