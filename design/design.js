var globalChartTheme = "default", globalDataBase, jsonExtentEditor;

function getProp(a, t) {
    if (currBox && currBox.is(a) && !t) ; else {
        if (!a) return !1;
        var e = (currBox = a).data("prop"), n = e.type, i = e.data, o = e.other || {};
        changeDataInput(n, o.dataFrom);
        var s = $.getCache("tag-" + n);
        s || (s = executeSQLAsObject("SELECT * FROM tags WHERE tagName='" + n + "'"), $.setCache("tag-" + n, s));
        var l = $.getCache(s.id);
        l || (l = executeSQL("SELECT pId,id,name,keyName,tagprop.tagId FROM\tpropitems,tagprop where propitems.type ISNULL and tagprop.propId = propitems.id AND tagprop.tagId =" + s.id), $.setCache(s.id, l));
        var d = tableValsToNode(l);
        if (d = transformTozTreeFormat(d), bulidTabs($("#config-panel"), d, 1, e), $(".data-dimension").empty(), $(".data-series").empty(), $(".data-classify").empty(), $("#datalink").val(""), $("#data-show").JSONView({}, {collapsed: !0}), $("#data-show").find(".prop").draggable({
            scroll: !1,
            helper: "clone"
        }), $("#data-box [name='dataFromRadio']").removeProp("checked"), $("#data-box #dataFromRadio-" + o.dataFrom).prop("checked", !0), o.dataFrom ? ($("#dataSetsRow").hide(), 1 == o.dataFrom ? ($("#datalinkRow").hide(), globalDataBase && ($("#data-show").JSONView(globalDataBase, {collapsed: !0}), $("#data-show").find(".prop").draggable({
            scroll: !1,
            helper: "clone"
        }))) : 2 == o.dataFrom ? ($("#datalinkRow").show(), $("#selectJSONFile").hide()) : 3 == o.dataFrom ? ($("#datalinkRow").show(), $("#selectJSONFile").show()) : 4 == o.dataFrom && ($("#datalinkRow").hide(), $("#selectJSONFile").hide(), $("#dataSetsRow").show())) : ($("#datalinkRow").hide(), globalDataBase && ($("#data-show").JSONView(globalDataBase, {collapsed: !0}), $("#data-show").find(".prop").draggable({
            scroll: !1,
            helper: "clone"
        })), o.dataFrom = 1), $("#data-box").find("input[type=radio]").checkboxradio({icon: !1}), i) {
            var c = i.link || "";
            $("#datalink").val(c);
            var r = i.dimension;
            $.each(r, function (a, t) {
                var e = $('<div class="data-item" title="' + t.keyname + '" data-keyname="' + t.keyname + '" data-displayname="' + t.displayname + '"><span class="desc">' + t.displayname + '</span><i class="fa fa-edit "></i><i class="fa fa-close"></i></div>');
                e.find("i.fa-edit").bind("click", function () {
                    var a = $('<input type="text" class="data-item-input" />');
                    $(this).parent().append(a), a.bind("blur", function () {
                        $(this).parent().attr("data-displayname", $(this).val()), $(this).parent().find(".desc").html($(this).val()), $(this).unbind().remove()
                    })
                }), e.find("i.fa-close").bind("click", function () {
                    $(this).unbind().parent().remove()
                }), $(".data-dimension").append(e)
            });
            var p = i.series;
            $.each(p, function (a, t) {
                var e = $('<div class="data-item" title="' + t.keyname + '" data-keyname="' + t.keyname + '" data-displayname="' + t.displayname + '"><span class="desc">' + t.displayname + '</span><i class="fa fa-edit "></i><i class="fa fa-close"></i></div>');
                e.find("i.fa-edit").bind("click", function () {
                    var a = $('<input type="text" class="data-item-input" />');
                    $(this).parent().append(a), a.bind("blur", function () {
                        $(this).parent().attr("data-displayname", $(this).val()), $(this).parent().find(".desc").html($(this).val()), $(this).unbind().remove()
                    })
                }), e.find("i.fa-close").bind("click", function () {
                    $(this).unbind().parent().remove()
                }), $(".data-series").append(e)
            });
            var f = i.classify || {};
            $.each(f, function (a, t) {
                var e = $('<div class="data-item" title="' + t.keyname + '" data-keyname="' + t.keyname + '" data-displayname="' + t.displayname + '"><span class="desc">' + t.displayname + '</span><i class="fa fa-edit "></i><i class="fa fa-close"></i></div>');
                e.find("i.fa-edit").bind("click", function () {
                    var a = $('<input type="text" class="data-item-input" />');
                    $(this).parent().append(a), a.bind("blur", function () {
                        $(this).parent().attr("data-displayname", $(this).val()), $(this).parent().find(".desc").html($(this).val()), $(this).unbind().remove()
                    })
                }), e.find("i.fa-close").bind("click", function () {
                    $(this).unbind().parent().remove()
                }), $(".data-classify").append(e)
            }), i.dtId && ($("#dataSetsSelect").select2().val([i.dtId]).trigger("change"), getDataSetsData(i))
        }
        e.optionsText ? jsonExtentEditor.setValue(e.optionsText) : e.options && jsonExtentEditor.setValue(JSON.stringify(e.options, null, 4))
    }
}

function changeDataInput(a, t) {
    var e = $("#server-dimension").hide(), n = $("#server-series").hide(), i = $("#server-classify").hide();
    "line" == a || "bar" == a ? (e.find(".lead").html("X轴"), n.find(".lead").html("Y轴"), e.show(), n.show()) : "map" == a ? (e.find(".lead").html("数据点"), n.find(".lead").html("波纹数据点"), e.show(), n.show()) : "pie" == a || "radar" == a ? (e.find(".lead").html("标签名称"), n.find(".lead").html("值"), e.show(), n.show()) : "gauge" == a ? (n.find(".lead").html("值"), n.show()) : "table" == a ? (e.find(".lead").html("表头数据"), n.find(".lead").html("列表数据"), e.show(), n.show()) : "text" == a ? (e.find(".lead").html("值"), e.show()) : (e.find(".lead").html("维度"), n.find(".lead").html("系列"), e.show(), n.show()), 4 == t && i.show()
}

function tableValsToNode(a) {
    if (a && 0 < a.length) {
        var i = [], t = a[0], o = t.columns, e = t.values, s = o.length;
        return $.each(e, function (a, t) {
            for (var e = {}, n = 0; n < s; n++) e[o[n]] = t[n];
            i.push(e)
        }), i
    }
    return null
}

function transformTozTreeFormat(a) {
    var t, e;
    if (!a) return [];
    if (n = a, "[object Array]" !== Object.prototype.toString.apply(n)) return [a];
    var n, i = [], o = {};
    for (t = 0, e = a.length; t < e; t++) o[a[t].id] = a[t];
    for (t = 0, e = a.length; t < e; t++) {
        var s = o[a[t].pId];
        if (s && a[t].id != a[t].pId) {
            var l = d(s);
            l || (l = d(s, [])), l.push(a[t])
        } else i.push(a[t])
    }
    return i;

    function d(a, t) {
        if (!a) return null;
        var e = "children";
        return void 0 !== t && (a[e] = t), a[e]
    }
}

function bulidTabs(a, t, s, l) {
    a.find(".colorPicker").spectrum("destroy"), a.empty();
    var d = $('<div class="box-' + s + '"></div>'), c = $("<ul></ul>");
    d.append(c), $.each(t, function (a, i) {
        if ("series" == i.keyName) {
            var t = l.data, e = l.options;
            t && e.series && $.each(e.series, function (a, t) {
                var e = $(' <li><a href="#' + i.keyName + "-" + a + '">' + i.name + a + "</a></li>");
                e.data("node", i), e.data("lv", s), c.append(e);
                var n = $('<div data-keyname="' + i.keyName + '" data-index="' + a + '" id="' + i.keyName + "-" + a + '"></div>');
                i.children && 0 < i.children.length && bulidTabs(n, i.children, s + 1, l), d.append(n)
            })
        } else {
            var n = $(' <li><a href="#' + i.keyName + '">' + i.name + "</a></li>");
            n.data("node", i), n.data("lv", s), c.append(n);
            var o = $('<div data-keyname="' + i.keyName + '"  id="' + i.keyName + '"></div>');
            i.children && 0 < i.children.length && bulidTabs(o, i.children, s + 1, l), d.append(o)
        }
    }), a.append(d), d.tabs({
        activate: function (a, t) {
            if (2 == t.newTab.data("lv")) {
                var e = t.newTab.data("node");
                bulidProp(t.newPanel, e.id, e.tagId)
            }
        }, beforeActivate: function (a, t) {
        }, beforeLoad: function (a, t) {
        }, create: function (a, t) {
            if (2 == t.tab.data("lv")) {
                var e = t.tab.data("node");
                bulidProp(t.panel, e.id, e.tagId)
            }
        }, load: function (a, t) {
        }
    }).addClass("ui-tabs-vertical ui-helper-clearfix ui-tabs-lv" + s), d.removeClass("ui-corner-top").addClass("ui-corner-left")
}
