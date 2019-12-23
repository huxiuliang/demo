var globalChartTheme = "default", globalDataBase, jsonExtentEditor;

/**
 * 左侧的属性面板
 */
function initLeftnav() {
    var _tab = $("#tabs").tabs({
        beforeLoad: function (event, ui) {
            ui.jqXHR.error(function () {
                ui.panel.html("<div style='color: white;font-size: 12px;padding: 10px;margin: 10px'>不能正确加载该标签页</div>");
            });
        }
    });
    _tab.addClass("ui-tabs-vertical ui-helper-clearfix");
    $("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
}

/**
 * 右侧的属性面板
 */
function initRightnav() {
    $("#rightnav").tabs({
        activate: function (a, t) {
            $("#rightnav").hasClass("on") || $("#rightnav").addClass("on")
        }
    }).addClass("ui-tabs-vertical ui-helper-clearfix"),
        $("#rightnav li").removeClass("ui-corner-top").addClass("ui-corner-left")
}

function initDataBaseConfig() {

    //数据配置
    $("#tools-database").bind("click", function () {
        var a = $(".database-content");
        a.hasClass("on") ? a.removeClass("on") : a.addClass("on")
    });

    $(".database-content").find("input[type=radio]").checkboxradio({icon: !1}), $("input[name=globalDataFrom]").bind("click", function () {
        $(".globalDataFromDiv").hide(), $("#globalDataFromDiv-" + $(this).val()).show(), 1 == $(this).val() || $("#globalDataFromDiv-1").show(), $("#content").data("dataFrom", $(this).val())
    });

    $("#databaseBtn").bind("click", function () {
        $(".database-content").removeClass("on")
    });

    $("#getGlobalDataBtn").bind("click", function () {
        var e = $("#globalDataUrl").val();
        layx.load("initGlobalData-layx", "数据正在加载中，请稍后"), $.ajax({
            url: e,
            type: "get",
            dataType: "json",
            timeout: 3e3,
            success: function (a, t) {
                $("#globalJSONShow").JSONView(a, {collapsed: !0}), globalDataBase = a, $("#content").data("url", e), $("#content").data("data", a)
            },
            complete: function (a, t) {
                console.log(a), layx.destroy("initGlobalData-layx")
            },
            error: function (a, t, e) {
                layx.msg("数据加载失败", {dialogIcon: "error"})
            }
        })
    })
}

function initAceEditer() {
    jsonExtentEditor = ace.edit("senior-panel");

    //在线编辑器保存 更新图像
    $("#jsoneditorSaveBtn").bind("click", function () {
        var prop = currBox.data("prop");
        var options = eval("(" + jsonExtentEditor.getValue() + ")");
        var optionsText = jsonExtentEditor.getValue();
        var myChart = prop.myChart;

        if (myChart) {
            myChart.setOption(options);
            prop.options = options;
            prop.optionsText = optionsText;
            currBox.data("prop", prop);
            undoRecord();
        }
    })
}

/**
 * 场景图形展示
 */
function initSceneConfig() {
    var content = $("#content");
    content.data("id", guid());

    content.draggable({
        handle: "#contentHandle",
        scroll: !1,
        snap: ".layout-Content",
        snapMode: "inner"
    });

    // var scene = $("#scene");
    // scene.find("input[type=radio]").checkboxradio({icon: !1});

    $("#scenebgcolor").spectrum({
        showPalette: !0,
        showInput: !0,
        allowEmpty: !0,
        showAlpha: !0,
        showSelectionPalette: !0,
        showInitial: !0,
        preferredFormat: "rgb",
        palette: [["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"], ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"], ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d9ead3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"], ["#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47"], ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"]],
        cancelText: "取消",
        chooseText: "确认",
        change: function (a) {
        },
        show: function (a) {
        },
        move: function (a) {
        },
        hide: function (a) {
        },
        choose: function (a) {
            content.css("background-color", a.toRgbString());
            content.data("backgroundColor", a.toRgbString())
        }
    });

    // $(".bgimglist li").bind("click", function () {
    //     $(this).hasClass("on") ? (content.css("background-image", ""), content.data("backgroundImage", ""), $(this).removeClass("on")) : ($(".bgimglist li").removeClass("on"), $(this).addClass("on"), content.css("background-image", this.style.backgroundImage), content.data("backgroundImage", this.style.backgroundImage), $("#bdbgPath").val(this.style.backgroundImage))
    // });

    //通过鼠标滚轮与页面交互
    $(".layout-Content").on("mousewheel", function (a) {
        var t;
        var e = Math.abs(a.deltaFactor * a.deltaY) / 1e3;
        var n = content.data("zoom") || 1;

        if (0 < a.deltaY) {
            t = (t = 5 < (t = Number(n) + e) ? 5 : t).toFixed(1);
            content.css("transform", "scale(" + t + ")");
            content.data("zoom", t);
        } else {
            t = (t = (t = Number(n) - e) < .2 ? .2 : t).toFixed(1);
            content.css("transform", "scale(" + t + ")");
            content.data("zoom", t);
        }
    });

    // $("#sceneBtn").bind("click", function () {
    //     $("#scene").removeClass("on")
    // });

    // $("#sceneW").bind("change", function () {
    //     content.css("width", $(this).val() + "px"), content.data("width", $(this).val())
    // });

    // $("#sceneH").bind("change", function () {
    //     content.css("height", $(this).val() + "px"), content.data("height", $(this).val())
    // });

    // $("#sceneName").bind("change blur", function () {
    //     content.data("sceneName", $(this).val())
    // });

    // $(".scene-addBgBtn").bind("click", function () {
    //     getImagePath($("#bdbgPath"))
    // });

    // $("#bdbgPath").bind("change blur", function () {
    //     var a = this.value;
    //     a = a.replace(/\\/g, "/");
    //     content.css("background-image", "url('" + a + "')");
    //     content.data("backgroundImage", a);
    //     this.value = a
    // });

    // $("input[name=sceneSizeRadio]").bind("click", function () {
    //     var a = $(this).val().split("*");
    //     content.css("width", a[0] + "px"), content.data("width", a[0]);
    //     content.css("height", a[1] + "px"), content.data("height", a[1]);
    //     $("#sceneW").val(a[0]);
    //     $("#sceneH").val(a[1]);
    //     resizeContent(a[0], a[1]);
    // });

    // $("input[name=globalTheme]").bind("click", function () {
    //     globalChartTheme = $(this).val()
    // });

    $(document).bind("keydown", function (a) {
        //按住空格 可以拖拽场景图形展示区
        32 == a.keyCode && $("#contentHandle").addClass("on")
    });

    $(document).bind("keyup", function (a) {
        //按住空格 可以拖拽场景图形展示区
        32 == a.keyCode && $("#contentHandle").removeClass("on")
    });
}

function initDataConfig() {
    //链接地址
    var t = $("#datalink");
    //获取数据格式
    var a = $("#datalinkBtn");

    function l(a, t, e) {
        layx.load("initTagData-layx", "数据正在加载中，请稍后"), 2 == a ? $.ajax({
            url: "../../bddpshow/getJSONDataByUrl",
            type: "post",
            data: {url: t},
            dataType: "json",
            success: function (a, t) {
                e.call(this, a), layx.destroy("initTagData-layx")
            },
            complete: function (a, t) {
                layx.destroy("initTagData-layx"), console.log(a)
            },
            error: function (a, t, e) {
                layx.msg("数据加载失败", {dialogIcon: "error"})
            }
        }) : 3 == a ? $.ajax({
            url: t, type: "get", timeout: 3e3, dataType: "json", success: function (a, t) {
                e.call(this, a), layx.destroy("initTagData-layx")
            }, complete: function (a, t) {
                layx.destroy("initTagData-layx")
            }, error: function (a, t, e) {
                layx.msg("数据加载失败", {dialogIcon: "error"})
            }
        }) : 4 == a && $.ajax({
            url: t, type: "post", timeout: 3e3, dataType: "json", success: function (a, t) {
                e.call(this, a), layx.destroy("initTagData-layx")
            }, complete: function (a, t) {
                layx.destroy("initTagData-layx"), console.log(a)
            }, error: function (a, t, e) {
                layx.msg("数据加载失败", {dialogIcon: "error"})
            }
        })
    }

    //数据来源切换
    $("#data-box").find("input[type=radio]").checkboxradio({icon: !1});

    $("#data-box [name='dataFromRadio']").on("change", function (a) {

        var t = $(".box-selected").data("prop");

        $("#dataSetsRow").hide();
        $("#server-classify").hide();

        if (1 == $(a.target).val()) {

            $("#data-show").JSONView(globalDataBase, {collapsed: !0});
            $("#data-show").find(".prop").draggable({
                scroll: !1,
                helper: "clone"
            });

            $("#datalinkRow").hide();

        } else {

            if (2 == $(a.target).val()) {

                $("#datalinkRow").show();
                $("#selectJSONFile").hide();

            } else {

                if (3 == $(a.target).val()) {

                    $("#datalinkRow").show();
                    $("#selectJSONFile").show();

                } else {

                    if (4 == $(a.target).val()) {

                        $("#datalinkRow").hide();
                        $("#selectJSONFile").hide();
                        $("#dataSetsRow").show();
                        $("#server-classify").show();
                    }
                }
            }
        }

        t.other = t.other || {};
        t.other.dataFrom = $(a.target).val()
    });

    a.bind("click", function () {
        var a = t.val();
        l($(".box-selected").data("prop").other.dataFrom, a, function (a) {
            $("#data-show").JSONView(a, {collapsed: !0}), $("#data-show").find(".prop").draggable({
                scroll: !1,
                helper: "clone"
            })
        })
    });

    $("#datalinkSaveBtn").bind("click", function () {
        var a = $("#data-box [name='dataFromRadio']:checked").val();
        if (0 < $(".box-selected").length) {
            var t = {dimension: [], series: [], classify: []};
            $(".data-dimension > .data-item").each(function () {
                t.dimension.push({keyname: $(this).data("keyname"), displayname: $(this).data("displayname")})
            }), $(".data-series > .data-item").each(function () {
                t.series.push({keyname: $(this).data("keyname"), displayname: $(this).data("displayname")})
            }), $(".data-classify > .data-item").each(function () {
                t.classify.push({keyname: $(this).data("keyname"), displayname: $(this).data("displayname")})
            });
            var e = $(".box-selected").data("prop");
            if (4 == a) {
                t.link = getConfigProp("rdpserver") + "ex/ser/dataset/sqlgroupresult?";
                var n = t.series.map(function (a) {
                    return a.keyname.split("data.")[1]
                }).join(","), i = t.dimension.map(function (a) {
                    return a.keyname.split("data.")[1]
                }).join(","), o = t.classify.map(function (a) {
                    return a.keyname.split("data.")[1]
                }).join(","), s = $("#dataSetsSelect").select2("data")[0].id;
                t.dtId = s, t.link += "columns=" + n, t.link += "&groups=" + i, t.link += "&series=" + o, t.link += "&dtId=" + s, t.link += "&type=" + e.type
            } else t.link = $("#datalink").val();
            e.data = t, function (t) {
                var e = t.data("prop"), a = e.data, n = e.other;
                a && (1 == n.dataFrom ? (createTagsBox(e, globalDataBase, t.parent()), t.remove(), getProp(currBox, !0), currBox.addClass("box-selected"), layx.destroy("initTagData-layx")) : l(n.dataFrom, a.link, function (a) {
                    createTagsBox(e, a, t.parent()), t.remove(), getProp(currBox, !0), currBox.addClass("box-selected")
                }))
            }($(".box-selected"))
        }
    });

    $(".data-dimension,.data-series,.data-classify").droppable({
        accept: function (a) {
            return !0
        }, activeClass: "ui-state-hover", hoverClass: "ui-state-active", drop: function (a, t) {
            var e = function a(t, e, n) {
                    {
                        var i;
                        return 0 < t ? (0 < (i = 0 < n.closest(".array.level" + --t).length ? n.closest(".array.level" + t).siblings(".prop") : n.closest(".obj").siblings(".prop")).length && (e = i.data("key") + "." + e), a(t, e, i)) : e
                    }
                }(t.draggable.data("level"), t.draggable.data("key"), t.draggable),
                n = $('<div class="data-item" title="' + e + '" data-keyname="' + e + '" data-displayname="' + e + '"><span class="desc">' + e + '</span><i class="fa fa-edit "></i><i class="fa fa-close"></i></div>');
            n.find("i.fa-edit").bind("click", function () {
                var a = $('<input type="text" class="data-item-input" />');
                $(this).parent().append(a), a.bind("blur", function () {
                    $(this).parent().attr("data-displayname", $(this).val()), $(this).parent().find(".desc").html($(this).val()), $(this).unbind().remove()
                })
            }), n.find("i.fa-close").bind("click", function () {
                $(this).unbind().parent().remove()
            }), $(this).append(n)
        }
    });

    reqServerController("dp_design/test_data/dataset_list.json", {}, function (a) {
        var t = a.list;
        t && $("#dataSetsSelect").select2({
            placeholder: "请选择数据源",
            containerCssClass: "bd-select2-container",
            dropdownCssClass: "bd-select2-dropdown",
            allowClear: !0,
            data: t.map(function (a) {
                return a.text = a.dtName, a.id = a.dtId, a
            })
        }).val(null).trigger("change").on("select2:select", function (a) {
            getDataSetsData(a.params.data)
        })
    });

    $("#refreshDataSetsListBtn").bind("click", function () {
        reqServerController("ex/ser/dataset/list", {}, function (a) {
            var t = a.list;
            $("#dataSetsSelect").select2({
                placeholder: "请选择数据源",
                containerCssClass: "bd-select2-container",
                dropdownCssClass: "bd-select2-dropdown",
                allowClear: !0,
                data: t.map(function (a) {
                    return a.text = a.dtName, a.id = a.dtId, a
                })
            }).val(null).trigger("change").on("select2:select", function (a) {
                getDataSetsData(a.params.data)
            })
        })
    })
}

function resizeContent(a, t) {
    var e = document.getElementById("content"), n = $(e).parent()[0].offsetWidth, i = $(e).parent()[0].clientHeight,
        o = a || e.offsetWidth, s = t || e.offsetHeight, l = n / o, d = i / s, c = 1;
    l < d ? (c = l, e.style.setProperty("margin-left", -(o - o * c) / 2 + "px"), e.style.setProperty("margin-top", (i - s * c) / 2 - (s - s * c) / 2 + "px")) : (c = d, e.style.setProperty("margin-top", -(s - s * c) / 2 + "px"), e.style.setProperty("margin-left", (n - o * c) / 2 - (o - o * c) / 2 + "px")), e.style.setProperty("top", "0px"), e.style.setProperty("left", "0px"), e.style.setProperty("transform", "scale(" + c + ")"), $(e).data("zoom", c)
}

function getDataSetsData(a) {
    reqServerControllerParms("dp_design/data-source/dataset_result.json", {dtId: a.dtId}, function (a) {
        console.log(a), 0 == a.code && dataHandler(a)
    })
}

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

function getSceneConfig() {
    $("#sceneW").val($("#content").width()), $("#sceneH").val($("#content").height()), $("#scenebgcolor").spectrum("set", $("#content").css("background-color")), $("#sceneName").val($("#content").data("sceneName"))
}

function editBddpByParams() {
    var a = getQueryString("uuid");
    a && "undefined" != a ? importDataId(a) : createbd()
}

function createbd() {

    // alert("新建大屏幕报表");
    return;

    layx.prompt("新建大屏幕报表", "请输入大屏幕报表名称", function (a, t, e, n, i) {
    }, null, {
        skin: "asphalt",
        storeStatus: !1,
        shadable: !0,
        width: 360,
        height: 150,
        buttons: [{
            label: "确定", callback: function (t, a, e) {
                var n = $(e).val();
                if (n) {
                    var i = {
                        content: {
                            width: 1920,
                            height: 1080,
                            globalChartTheme: "default",
                            id: guid(),
                            sceneName: n
                        }, boxs: [], ruler: {v: [], h: []}
                    };
                    saveBddpData(i, function (a) {
                        0 == a.code ? (console.log("新建成功"), history.pushState({}, n, "spectrum.html?uuid=" + i.content.id), importDataId(i.content.id), layx.destroy(t)) : console.log("新建失败")
                    })
                } else $(e).focus()
            }
        }, {
            label: "取消", callback: function (a, t, e) {
                openbd(), layx.destroy(a)
            }
        }],
        event: {
            ondestroy: {
                before: function (a, t, e, n, i) {
                    n && openbd()
                }, after: function () {
                }
            }
        }
    })
}

function savebd(a) {
    var i = {};
    if (i.content = {
        width: $("#content").data("width") || 1920,
        height: $("#content").data("height") || 1080,
        backgroundColor: $("#content").data("backgroundColor"),
        backgroundImage: $("#content").data("backgroundImage"),
        url: $("#content").data("url"),
        globalChartTheme: globalChartTheme,
        dataFrom: $("#content").data("dataFrom"),
        id: $("#content").data("id")
    }, !$("#content").data("sceneName") || "undefined" == $("#content").data("sceneName")) return $("#scene").addClass("on"), getSceneConfig(), layx.msg("场景名称不能为空！", {dialogIcon: "warn"}), !1;
    i.content.sceneName = $("#content").data("sceneName"), i.boxs = [], $("#content").children(".box").each(function () {
        var a = $(this).data("prop"), e = {
            options: a.options,
            optionsText: a.optionsText,
            other: a.other,
            rectP: a.rectP,
            data: a.data,
            event: a.event,
            type: a.type,
            parts: a.parts,
            effect: a.effect,
            id: a.id,
            bigType: a.bigType,
            gmOptions: a.gmOptions,
            swiper: a.swiper,
            slides: a.slides
        };
        "swiper" == a.type && (e.slides = [], $(this).find(".box").each(function () {
            var a = $(this).data("prop"), t = {
                options: a.options,
                optionsText: a.optionsText,
                other: a.other,
                rectP: a.rectP,
                event: a.event,
                data: a.data,
                type: a.type,
                effect: a.effect,
                parts: a.parts,
                id: a.id,
                bigType: a.bigType,
                gmOptions: a.gmOptions,
                slide: a.slide
            };
            e.slides.push(t)
        })), i.boxs.push(e)
    }), i.ruler = {v: [], h: []}, $(".zxxRefLine_v").each(function () {
        i.ruler.v.push(this.offsetLeft)
    }), $(".zxxRefLine_h").each(function () {
        i.ruler.h.push(this.offsetTop)
    }), console.log(i), layx.confirm("保存提示", "是否生成缩略图？<br>生成缩略图比较耗内存，容易造成浏览器卡死，<br>等待一会儿即可，建议不要频繁生成", null, {
        skin: "asphalt",
        height: 170,
        buttons: [{
            label: "是", callback: function (a, t, e) {
                layx.load("loadId", "正在生成缩略图，请稍后"), $("#content").css("transform", "scale(1)"), $.pageRulerHide();
                var n = i.content.id;
                html2canvas($("#content")[0], {allowTaint: !0, taintTest: !1}).then(function (a) {
                    layx.destroy("loadId");
                    var t = a.toDataURL("image/jpeg", .4);
                    $("#content").css("transform", "scale(" + $("#content").data("zoom") + ")"), saveBddpBgi(n, t, function (a) {
                        0 == a.code ? layx.msg("缩略图生成成功 ", {dialogIcon: "success"}) : layx.msg("缩略图生成失败", {dialogIcon: "warn"})
                    })
                }), saveBddpData(i, function (a) {
                    0 == a.code ? layx.msg("保存成功", {dialogIcon: "success"}) : layx.msg("保存失败", {dialogIcon: "error"})
                }), layx.destroy(a)
            }
        }, {
            label: "否", callback: function (a, t, e) {
                saveBddpData(i, function (a) {
                    0 == a.code ? layx.msg("保存成功", {dialogIcon: "success"}) : layx.msg("保存失败", {dialogIcon: "error"})
                }), layx.destroy(a)
            }
        }]
    })
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

$(function () {
    $(window).resize(function () {
        resizeContent()
    });

    //清理本地缓存
    $("#tools-clearCache").bind("click", function () {
        localStorage.clear(), 0 == localStorage.length && app.$Message.info("本地缓存清理成功")
    });

    //页面配置
    $("#tools-scene").bind("click", function () {
        var a = $("#scene");//FIXME 没有页面
        a.hasClass("on") ? a.removeClass("on") : (a.addClass("on"), getSceneConfig())
    });

    //组件属性配置
    $("#tags-props").bind("click", function () {
        return $("#rightnav").show().removeClass("off"), !1
    });

    //组件属性配置Close
    $(".rightnav-close").bind("click", function () {
        $("#rightnav").hide().addClass("off")
    });

    //新建
    $("#tools-new").bind("click", function () {
        newbd()
    });

    //保存
    $("#tools-save").bind("click", function () {
        savebd()
    });

    //快捷键说明在这里
    $("#tools-shortcutkey").bind("click", function () {
        app.showShortcutkey();
    });

    //预览
    $("#tools-view").bind("click", function () {
        $(".layout-Header").addClass("view"), $(".layout-Sider").addClass("view"), $(".layout-Content").addClass("view"), $("#rightnav").addClass("view"), requestFullScreen()
    });

    //选择JSON文件
    $("#selectJSONFile").bind("click", function () {
        alert("JSON数据文件选择,建设中...");
        // iframe("localsiteforjson", "JSON数据文件选择", "./component/BddpDataPage.html", {
        //        ondestroy: {
        //             before: function (a, t, e, n, i) {
        //                 e.name && $("#datalink").val("../../bddpConfig/" + e.id + "/data/" + e.name)
        //             }
        //     }
        // })
    });

    //左侧的属性面板
    initLeftnav();

    //右侧的属性面板
    initRightnav();

    //场景图形展示
    initSceneConfig();

    initDataConfig();

    initDataBaseConfig();

    //json编辑器
    initAceEditer();

    editBddpByParams();

    initSelectBox(".layout-Content");

});