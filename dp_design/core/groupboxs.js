function groupBoxs() {
    createGroupBox()
}

function dissolveBoxs() {
    var t = $(".groupbox.selected");
    selectableItmes = [], $.each(t.data("boxs"), function (t, o) {
        $(o).removeData("groupbox").addClass("selected"), selectableItmes.push(o)
    }), t.removeData("boxs"), t.remove()
}

function createGroupBox() {
    var o = {"z-index": 999}, e = [], a = $('<div class="groupbox"></div>');
    $(".box").each(function () {
        if ($(this).hasClass("selected") || $(this).hasClass("box-selected")) {
            var t = $(this).data("prop").rectP;
            (!o.left || t.x < o.left) && (o.left = t.x), (!o.top || t.y < o.top) && (o.top = t.y), (!o.width || t.x + t.width > o.width) && (o.width = t.x + t.width), (!o.height || t.y + t.height > o.height) && (o.height = t.y + t.height), e.push(this), $(this).data("groupbox", a)
        }
    }), o.width = o.width - o.left, o.height = o.height - o.top, a.css(o), a.appendTo("#content"), a.data("boxs", e), a.addClass("selected"), a.dragBox({
        parent: $(".layout-Content")[0],
        dragStart: function (t, o, e, a) {
            $(".groupbox").show(), guides = getGuides(t), boxsOriginalPosition(t)
        },
        dragMove: function (t, o, e, a, r) {
            a.altKey && searchGuides(t, a)
        },
        dragEnd: function (t, o, e, a, r) {
            hideGuides(), $(".groupbox").not($(t)).hide(), r.devX = o.x - e.x, r.devY = o.y - e.y, r.zoom = 1, boxsMovePosition(t, r)
        }
    })
}

function createGroupBoxByDiyTags(t) {
    var o = {"z-index": 999}, e = [], a = $('<div class="groupbox"></div>');
    return $.each(t, function () {
        var t = $(this).data("prop").rectP;
        (!o.left || t.x < o.left) && (o.left = t.x), (!o.top || t.y < o.top) && (o.top = t.y), (!o.width || t.x + t.width > o.width) && (o.width = t.x + t.width), (!o.height || t.y + t.height > o.height) && (o.height = t.y + t.height), e.push(this), $(this).data("groupbox", a)
    }), o.width = o.width - o.left, o.height = o.height - o.top, a.css(o), a.appendTo("#content"), a.data("boxs", e), a.addClass("selected"), a.dragBox({
        parent: $(".layout-Content")[0],
        dragStart: function (t, o, e, a) {
            $(".groupbox").show(), guides = getGuides(t), boxsOriginalPosition(t)
        },
        dragMove: function (t, o, e, a, r) {
            a.altKey && searchGuides(t, a)
        },
        dragEnd: function (t, o, e, a, r) {
            hideGuides(), $(".groupbox").not($(t)).hide(), r.devX = o.x - e.x, r.devY = o.y - e.y, r.zoom = 1, boxsMovePosition(t, r)
        }
    }), a
}

function showGroup(t) {
    return !!$(t).data("groupbox") && ($(".groupbox").hide(), $(t).data("groupbox").show().addClass("selected"), $(".box").removeClass("box-selected"), currBox = null, $("#config-panel").empty(), $(".sitemap-item").removeClass("on"), $("#rightnav").removeClass("on").hide(), !0)
}

function boxsOriginalPosition(t) {
    $.each($(t).data("boxs"), function (t, o) {
        $(o).data("originalPosition", {x: $(o).data("prop").rectP.x, y: $(o).data("prop").rectP.y})
    })
}

function boxsMovePosition(t, i) {
    $.each($(t).data("boxs"), function (t, o) {
        var e = $(o).data("originalPosition"), a = i.devX / i.zoom + e.x, r = i.devY / i.zoom + e.y;
        $(o).rotateResize("setBoxProp", {x: a, y: r})
    })
}

!function (h) {
    h.fn.extend({
        dragBox: function (t) {
            var o = {
                initBox: function (t) {
                    var c = h.extend({parent: document, dragStart: !1, dragMove: !1, dragEnd: !1}, t);
                    return this.each(function () {
                        var t = this, o = (c.parent, h(this).data("prop") || {});
                        o.rectP || (o.rectP = {});
                        var p, e = {x: t.offsetLeft, y: t.offsetTop};

                        function u() {
                            d(t, {left: h(t).data("prop").rectP.x + "px", top: h(t).data("prop").rectP.y + "px"})
                        }

                        o.rectP = e, o.id && !c.newId || (o.id = guid()), h(t).attr("id", "groupbox" + o.id), h(this).data("prop", o), u(), (p = t).onmousedown = function () {
                            h("#content");
                            var a = h("#content").data("zoom") || 1;
                            h(p).removeData("rulerspos");
                            var r, i, t = window.event, n = t.pageX, d = t.pageY,
                                s = {x: Number(h(p).data("prop").rectP.x), y: Number(h(p).data("prop").rectP.y)};
                            document.onmousemove = function () {
                                h(p).addClass("groupBox-move");
                                var t = window.event;
                                r = t.pageX - n, i = t.pageY - d, r = 10 * Math.round(r / 10), i = 10 * Math.round(i / 10);
                                var o = r / a + s.x, e = i / a + s.y;
                                return h(p).data("prop").rectP.x = o, h(p).data("prop").rectP.y = e, u(), "function" == typeof c.dragMove && c.dragMove.call(this, p, h(p).data("prop").rectP, s, t, {
                                    devX: r,
                                    devY: i,
                                    zoom: a
                                }), t.preventDefault(), !1
                            }, document.onmouseup = function () {
                                h(p).removeClass("groupBox-move");
                                var t = window.event;
                                document.onmousemove = null, document.onmouseup = null, "function" == typeof c.dragEnd && c.dragEnd.call(this, p, h(p).data("prop").rectP, s, t, {
                                    devX: r,
                                    devY: i,
                                    zoom: a
                                })
                            }, "function" == typeof c.dragStart && c.dragStart.call(this, p, h(p).data("prop").rectP, s, t)
                        }, p.ondragstart = function (t) {
                            return t.preventDefault(), !1
                        }
                    })
                }, getBoxProp: function () {
                    return this.data("prop").rectP
                }, setBoxProp: function (t, o) {
                    var e = this.data("prop").rectP.x, a = this.data("prop").rectP.y,
                        r = h.extend({}, this.data("prop").rectP, t);
                    d(this[0], {left: r.x + "px", top: r.y + "px"});
                    var i = this.data("prop");
                    i.rectP = r, this.data("prop", i);
                    var n = {zoom: 1, devX: r.x - e, devY: r.y - a};
                    o ? (boxsOriginalPosition(this), boxsMovePosition(this, n)) : this.data("rulerspos", n)
                }
            };
            if (o[t]) return o[t].apply(this, Array.prototype.slice.call(arguments, 1));
            if ("object" == typeof t || !t) return o.initBox.apply(this, arguments);

            function d(t, o) {
                for (var e in o) t.style[e] = o[e]
            }

            h.error("Method " + t + " does not exist on jQuery.popupSelection")
        }
    })
}(jQuery);