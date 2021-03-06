var selectableItmes = [];
var currBox;
var copyTempItems = [];
var zIndexProp = {max: 50, min: 50};
var MIN_DISTANCE = 8; //捕获的最小距离
var innerOffsetX;
var innerOffsetY;
var stack;
var EditCommand;
var undoData;

(function ($) {
    $.fn.extend({
        /**
         * 初始化盒子
         * @param options
         * @returns {*|jQuery|void}
         */
        initBox: function (options) {

            var rOptions = {
                parent: $(".layout-Content")[0],
                dragStart: function (b, p, o, event) {
                    $.each(selectableItmes, function (i, node) {
                        if (!$(node).data("prop").rectP) {
                            console.log($(node).data());
                        }
                        var rectP = $(node).data("prop").rectP || {
                            x: node.offsetLeft,
                            y: node.offsetTop
                        };

                        $(node).data("originalPosition", {
                            x: $(node).data("prop").rectP.x,
                            y: $(node).data("prop").rectP.y
                        });
                    });

                    innerOffsetX = event.pageX;
                    innerOffsetY = event.pageY;
                },
                dragMove: function (b, p, o, event, pos) {

                    $.each(selectableItmes, function (i, node) {
                        if (b != node) {
                            var nodeOriginalPosition = $(node).data("originalPosition");
                            var newX = pos.devX / pos.zoom + nodeOriginalPosition.x;
                            var newY = pos.devY / pos.zoom + nodeOriginalPosition.y;
                            $(node).rotateResize("setBoxProp", {
                                x: newX,
                                y: newY
                            });
                        }
                    });
                },
                dragEnd: function (b, p, o, event) {
                    undoRecord();
                },
                rotateStart: false,
                rotateMove: false,
                rotateEnd: function (b, p, o) {
                    undoRecord();
                },
                resizeStart: false,
                resizeMove: false,
                resizeEnd: function (b, p) {
                    var myChart = $(b).data("prop").myChart;
                    if (myChart) {
                        myChart.resize();
                    }
                    //getProp($(b));
                    tagChangeSize($(b));
                    undoRecord()
                },
                tagType: options.tagType
            };
            return this.each(function () {
                $(this).selectedBox().rotateResize(rOptions);
            });
        },

        /**
         * 初始化数据
         * @returns {*|jQuery|void}
         */
        initdata: function () {
            return this.each(function () {
            });
        },

        /**
         * 选中盒子
         * @returns {*|jQuery|void}
         */
        selectedBox: function () {

            /**
             * 获取此刻时间
             * @returns {number}
             */
            function getTimeNow() {
                var now = new Date();
                return now.getTime();
            }

            return this.each(function () {

                var timeStart, timeEnd, time, flag = true; //申明全局变量

                $(this).bind("mousedown", function (e) {

                    if (!e.ctrlKey) {

                        if (selectableItmes.indexOf(this) == -1) {
                            selectableItmes = [];
                        }

                        //删除兄弟的class
                        $(this).addClass("box-selected").siblings(".box").removeClass("box-selected");

                        $(this).css("z-index", 1000);

                        timeStart = getTimeNow(); //获取鼠标按下时的时间
                        time = setInterval(function () {
                            timeEnd = getTimeNow();
                            if (timeEnd - timeStart > 500) {
                                clearInterval(time);
                                flag = false;
                                console.log("长按"); //并弹出代码
                            }
                        }, 100);

                        $(this).bind("mouseup", function (e) {
                            if (flag && e.button != 2) {

                                selectableItmes = [];

                                // $(this).siblings(".box").removeClass("ui-selected");
                                // $('.box').removeClass('temp-selected selected');

                                //$(".sitemap-item").removeClass("on");
                                //$("#sm-" + this.id).addClass("on");
                                //var goTop = $("#sm-" + this.id).position().top;
                                //$(".stiemap").animate({
                                //scrollTop: goTop + $(".stiemap")[0].scrollTop - 10
                                //}, 750);
                            }

                            if (selectableItmes.indexOf(this) == -1) {
                                selectableItmes.push(this);
                            }

                            clearInterval(time); //如果按下时间不到1000毫秒便弹起
                            //	showGroup(this);

                            getProp($(this));

                            flag = true;

                            $(this).css("z-index", $(this).data("prop").rectP.zIndex);
                            $(this).unbind("mouseup");

                            //showGroup(this);
                        });

                        boxMouseDown();
                    }
                });
            });
        },

        /**
         * 旋转盒子
         * @param method
         * @returns {*}
         */
        rotateResize: function (method) {
            var methods = {
                initBox: function (options) {
                    var settings = $.extend({
                        parent: document,
                        dragStart: false,
                        dragMove: false,
                        dragEnd: false,
                        rotateStart: false,
                        rotateMove: false,
                        rotateEnd: false,
                        resizeStart: false,
                        resizeMove: false,
                        resizeEnd: false,
                        newId: false
                    }, options);

                    function S4() {
                        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                    }

                    function guid() {
                        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
                    }

                    return this.each(function () {
                        var box = this;
                        var parent = settings.parent;
                        // 定义一个Rect
                        var prop = $(this).data("prop") || {};
                        if (!prop.rectP) {
                            prop.rectP = {};
                        }
                        var rectP = {
                            x: box.offsetLeft,
                            y: box.offsetTop,
                            height: box.offsetHeight,
                            width: box.offsetWidth,
                            rotate: prop.rectP.rotate || 0,
                            zIndex: prop.rectP.zIndex || 50
                        };
                        prop.rectP = rectP;
                        if (!prop.id || settings.newId) {
                            prop.id = guid();
                        }
                        $(box).attr("id", "box" + prop.id);
                        console.log("setDate('prop') is ")
                        console.log(prop)
                        $(this).data("prop", prop);
                        $(box).attr("tag-type", settings.tagType);
                        var draggableHandler, rotateHandler, resizeHandlers, draggable;
                        addHandleHtml($(box));

                        function bindRotateEvents(node, box) {
                            node.onmousedown = function () {
                                pluginsDisable();
                                // 旋转开始
                                var event = window.event,
                                    point = getConterPoint(box),
                                    prevAngle = Math.atan2(event.pageY - point.y, event.pageX - point.x) - $(box).data("prop").rectP.rotate * Math.PI / 180;
                                parent.onmousemove = function () {
                                    // 旋转
                                    var event = window.event,
                                        angle = Math.atan2(event.pageY - point.y, event.pageX - point.x);
                                    $(box).data("prop").rectP.rotate = Math.floor((angle - prevAngle) * 180 / Math.PI);
                                    draw();
                                    if (typeof (settings.rotateMove) == "function") {
                                        settings.rotateMove.call(this, box, $(box).data("prop").rectP);
                                    }
                                }
                                parent.onmouseup = function () {
                                    // 旋转结束
                                    parent.onmousemove = null;
                                    parent.onmouseup = null;
                                    setCursorStyle($(box).data("prop").rectP.rotate);
                                    pluginsEnable();
                                    if (typeof (settings.rotateEnd) == "function") {
                                        settings.rotateEnd.call(this, box, $(box).data("prop").rectP);
                                    }
                                }
                                if (typeof (settings.rotateStart) == "function") {
                                    settings.rotateStart.call(this, box, $(box).data("prop").rectP);
                                }
                            }
                            node.ondragstart = function (event) {
                                event.preventDefault();
                                return false;
                            }
                        }

                        function bindResizeEvents(node) {
                            node.onmousedown = function () {
                                var zoom = $("#content").data("zoom") || 1;
                                pluginsDisable();
                                // 缩放开始
                                var event = window.event;
                                event.preventDefault();
                                // var {
                                // 	x,
                                // 	y,
                                // 	width,
                                // 	height,
                                // 	rotate
                                // } = $(box).data("prop").rectP;
                                var x = Number($(box).data("prop").rectP.x);
                                var y = Number($(box).data("prop").rectP.y);
                                var width = Number($(box).data("prop").rectP.width);
                                var height = Number($(box).data("prop").rectP.height);
                                var rotate = Number($(box).data("prop").rectP.rotate);
                                var ex = event.pageX - $("#content").offset().left;
                                var ey = event.pageY - $("#content").offset().top;
                                // 计算初始状态旋转后的rect
                                var transformedRect = transform({
                                    x,
                                    y,
                                    width,
                                    height
                                }, rotate);
                                // 取得旋转后的8点坐标
                                var {
                                    point
                                } = transformedRect;
                                // 获取当前点和对角线点
                                var pointAndOpposite = getPointAndOppositeByIndex(point, $(this).index());
                                //console.log(pointAndOpposite);
                                var {
                                    opposite
                                } = pointAndOpposite;

                                // 对角线点的索引即为缩放基点索引
                                var baseIndex = opposite.index;

                                var oppositeX = opposite.point.x;
                                var oppositeY = opposite.point.y;

                                // 鼠标释放点距离当前点对角线点的偏移量
                                var offsetWidth = Math.abs(ex / zoom - oppositeX);
                                var offsetHeight = Math.abs(ey / zoom - oppositeY);

                                // 记录最原始的状态
                                var oPoint = {
                                    x,
                                    y,
                                    width,
                                    height,
                                    rotate
                                };

                                parent.onmousemove = function () {
                                    var event = window.event;

                                    var nex = event.pageX - $("#content").offset().left;
                                    var ney = event.pageY - $("#content").offset().top;

                                    var scale = {
                                        x: 1,
                                        y: 1
                                    };
                                    var realScale = 1;

                                    // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算
                                    if (offsetWidth > offsetHeight) {
                                        realScale = Math.abs(nex / zoom - oppositeX) / offsetWidth;
                                    } else {
                                        realScale = Math.abs(ney / zoom - oppositeY) / offsetHeight;
                                    }
                                    if ([0, 2, 4, 6].indexOf(baseIndex) >= 0) {
                                        scale.x = scale.y = realScale;
                                    } else if ([1, 5].indexOf(baseIndex) >= 0) {
                                        scale.y = realScale;
                                    } else if ([3, 7].indexOf(baseIndex) >= 0) {
                                        scale.x = realScale;
                                    }
                                    var newRect = getNewRect(oPoint, scale, transformedRect, baseIndex);

                                    $(box).data("prop").rectP.x = newRect.x;
                                    $(box).data("prop").rectP.y = newRect.y;
                                    $(box).data("prop").rectP.width = newRect.width;
                                    $(box).data("prop").rectP.height = newRect.height;
                                    draw();
                                    if (typeof (settings.resizeMove) == "function") {
                                        settings.resizeMove.call(this, box, $(box).data("prop").rectP);
                                    }
                                }
                                parent.onmouseup = function () {
                                    parent.onmousemove = null;
                                    parent.onmouseup = null;
                                    pluginsEnable();
                                    if (typeof (settings.resizeEnd) == "function") {
                                        settings.resizeEnd.call(this, box, $(box).data("prop").rectP);
                                    }
                                }
                                if (typeof (settings.resizeStart) == "function") {
                                    settings.resizeStart.call(this, box, $(box).data("prop").rectP);
                                }
                            }
                        }

                        /**
                         * 取得rect中心点
                         * @param  {[type]} box [description]
                         */
                        function getConterPoint(box) {
                            return {
                                x: box.offsetLeft + box.offsetWidth / 2,
                                y: box.offsetTop + box.offsetHeight / 2
                            };
                        }

                        /**
                         * 取得鼠标释放点在rect8点坐标中的对应点及其对角线点
                         * @param  {[type]} point [description]
                         * @param  {[type]} ex    [description]
                         * @param  {[type]} ey    [description]
                         */
                        function getPointAndOpposite(point, ex, ey) {
                            var zoom = $("#content").data("zoom") || 1;
                            var oppositePoint = {};
                            var currentPoint = {};

                            var minDelta = 1000;
                            var currentIndex = 0;
                            var oppositeIndex = 0;

                            point.forEach((p, index) => {
                                const delta = Math.sqrt(Math.pow(p.x * zoom - ex, 2) + Math.pow(p.y * zoom - ey, 2));
                                if (delta < minDelta) {
                                    currentPoint = p;
                                    currentIndex = index;
                                    minDelta = delta;
                                    // 对角线点index相差4
                                    var offset = 4;
                                    var oIndex = index - offset;
                                    if (oIndex < 0) {
                                        oIndex = index + offset;
                                    }
                                    // 取对角线点坐标
                                    oppositePoint = point.slice(oIndex, oIndex + 1)[0];
                                    oppositeIndex = oIndex;
                                }
                            });

                            return {
                                current: {
                                    index: currentIndex,
                                    point: currentPoint
                                },
                                opposite: {
                                    index: oppositeIndex,
                                    point: oppositePoint
                                }
                            };
                        }

                        function getPointAndOppositeByIndex(point, index) {

                            var oppositePoint = {};
                            var currentPoint = {};


                            var currentIndex = index;
                            var oppositeIndex = 0;

                            currentPoint = point[index];
                            var offset = 4;
                            var oIndex = currentIndex - offset;
                            if (oIndex < 0) {
                                oIndex = currentIndex + offset;
                            }
                            // 取对角线点坐标
                            oppositePoint = point.slice(oIndex, oIndex + 1)[0];
                            oppositeIndex = oIndex;


                            return {
                                current: {
                                    index: currentIndex,
                                    point: currentPoint
                                },
                                opposite: {
                                    index: oppositeIndex,
                                    point: oppositePoint
                                }
                            };
                        }

                        function bindMoveEvents(node, box) {
                            node.onmousedown = function () {
                                // if (showGroup(box)) {
                                //     return false;
                                // }
                                var content = $("#content");
                                var zoom = $("#content").data("zoom") || 1;
                                pluginsDisable();
                                var event = window.event,
                                    deltaX = event.pageX,
                                    deltaY = event.pageY;
                                var original = {
                                    x: Number($(box).data("prop").rectP.x),
                                    y: Number($(box).data("prop").rectP.y),
                                    width: Number($(box).data("prop").rectP.width),
                                    height: Number($(box).data("prop").rectP.height)
                                };
                                // var pLeft = $("#content").offset().left;
                                // var pTop = $("#content").offset().top;
                                document.onmousemove = function () {
                                    var event = window.event;
                                    var devX = event.pageX - deltaX;
                                    var devY = event.pageY - deltaY;
                                    devX = Math.round(devX / 10) * MIN_DISTANCE;
                                    devY = Math.round(devY / 10) * MIN_DISTANCE;
                                    var newX = devX / zoom + original.x;
                                    var newY = devY / zoom + original.y;
                                    // newX = newX < 0 ? 0 : newX;
                                    // newY = newY < 0 ? 0 : newY;
                                    // newX = newX + Number($(box).data("prop").rectP.width) > content.width() ? (content.width() - Number($(box).data("prop").rectP.width)) : newX;
                                    // newY = newY + Number($(box).data("prop").rectP.height) > content.height() ? (content.height() - Number($(box).data("prop").rectP.height)) : newY;
                                    $(box).data("prop").rectP.x = newX;
                                    $(box).data("prop").rectP.y = newY;
                                    draw();
                                    if (typeof (settings.dragMove) == "function") {
                                        settings.dragMove.call(this, box, $(box).data("prop").rectP, original, event, {
                                            devX: devX,
                                            devY: devY,
                                            zoom: zoom
                                        });
                                    }
                                    event.preventDefault();
                                    return false;
                                }
                                document.onmouseup = function () {
                                    var event = window.event;
                                    document.onmousemove = null;
                                    document.onmouseup = null;
                                    pluginsEnable();
                                    if (typeof (settings.dragEnd) == "function") {
                                        settings.dragEnd.call(this, box, $(box).data("prop").rectP, original, event);
                                    }
                                }
                                if (typeof (settings.dragStart) == "function") {
                                    settings.dragStart.call(this, box, $(box).data("prop").rectP, original, event);
                                }

                            }
                            node.ondragstart = function (event) {
                                event.preventDefault();
                                return false;
                            }
                        }

                        /**
                         * 重绘视图
                         * @return {[type]} [description]
                         */
                        function draw() {
                            css(box, {
                                left: $(box).data("prop").rectP.x + 'px',
                                top: $(box).data("prop").rectP.y + 'px',
                                width: $(box).data("prop").rectP.width + 'px',
                                height: $(box).data("prop").rectP.height + 'px',
                                transform: 'rotate(' + $(box).data("prop").rectP.rotate + 'deg)'
                            });
                        }

                        function setCursorStyle(degree) {
                            var top = box.querySelector('.t'),
                                topRight = box.querySelector('.tr'),
                                right = box.querySelector('.r'),
                                bottomRight = box.querySelector('.br'),
                                bottom = box.querySelector('.b'),
                                bottomLeft = box.querySelector('.bl'),
                                left = box.querySelector('.l'),
                                topLeft = box.querySelector('.tl'),
                                cursorStyle = getNewCursorArray(degree);
                            css(top, {
                                'cursor': cursorStyle[0]
                            });
                            css(topRight, {
                                'cursor': cursorStyle[1]
                            });
                            css(right, {
                                'cursor': cursorStyle[2]
                            });
                            css(bottomRight, {
                                'cursor': cursorStyle[3]
                            });
                            css(bottom, {
                                'cursor': cursorStyle[4]
                            });
                            css(bottomLeft, {
                                'cursor': cursorStyle[5]
                            });
                            css(left, {
                                'cursor': cursorStyle[6]
                            });
                            css(topLeft, {
                                'cursor': cursorStyle[7]
                            });
                        }

                        /**
                         * 获取点的鼠标手势
                         * @param  {[type]} degree [description]
                         * @return {[type]}        [description]
                         */
                        function getNewCursorArray(degree) {
                            const cursorStyleArray = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize'];

                            const ARR_LENGTH = 8;
                            const STEP = 45;

                            var startIndex = 0;

                            if (degree) {
                                startIndex = Math.floor(degree / STEP);
                                if (degree % STEP > (STEP / 2)) {
                                    startIndex += 1;
                                }
                            }

                            if (startIndex > 1) {
                                const len = ARR_LENGTH - startIndex;
                                return (cursorStyleArray.slice(startIndex, startIndex + len))
                                    .concat(cursorStyleArray.slice(0, startIndex));
                            }

                            return cursorStyleArray;
                        }

                        function init() {
                            rotateHandler = box.querySelector('.rotate');
                            draggable = box.querySelector('.draggable');
                            resizeHandlers = Array.prototype.slice.call(box.querySelectorAll('.resizable-handle'), 0);
                            draw();
                            setCursorStyle(0);
                            bindMoveEvents(draggable, box);
                            // $(box).draggable({
                            // 	containment: "parent",
                            // 	scroll:false
                            // });
                            bindRotateEvents(rotateHandler, box);
                            resizeHandlers.map(function (handler) {
                                bindResizeEvents(handler);
                            });
                        }

                        init();
                    });

                },
                getBoxProp: function () {
                    return this.data("prop").rectP;
                },
                setBoxProp: function (p) {
                    var rectP = $.extend({}, this.data("prop").rectP, p);
                    css(this[0], {
                        left: rectP.x + 'px',
                        top: rectP.y + 'px',
                        width: rectP.width + 'px',
                        height: rectP.height + 'px',
                        transform: 'rotate(' + rectP.rotate + 'deg)'
                    });
                    var prop = this.data("prop");
                    prop.rectP = rectP;
                    this.data("prop", prop);
                }
            };

            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || !method) {
                return methods.initBox.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.popupSelection');
            }

            function css(node, ops) {
                for (var index in ops) {
                    node['style'][index] = ops[index];
                }
            }

            /**
             * 添加拖拽条
             * @param box
             */
            function addHandleHtml(box) {
                if (box.find(".rotate").length == 0) {
                    box.append('<div class="rotate"><i class="fa fa-refresh rotateHandler"></i></div>');
                }
                if (box.find(".draggable").length == 0) {
                    box.append('<div title="' + box.attr("id") + '" class="draggable">按住拖拽</div>');
                }
                if (box.find(".resizable").length == 0) {
                    var str = '<div class="resizable">' +
                        '<span class="resizable-handle tl" draggable="true"></span>' +
                        '<span class="resizable-handle t" draggable="true"></span>' +
                        '<span class="resizable-handle tr" draggable="true"></span>' +
                        '<span class="resizable-handle r" draggable="true"></span>' +
                        '<span class="resizable-handle br" draggable="true"></span>' +
                        '<span class="resizable-handle b" draggable="true"></span>' +
                        '<span class="resizable-handle bl" draggable="true"></span>' +
                        '<span class="resizable-handle l" draggable="true"></span>' +
                        '</div>';
                    box.append(str);
                }
            }

            function pluginsDisable() {
                //$("#content").selectable("disable");
            }

            function pluginsEnable() {
                //$("#content").selectable("enable");
            }

            /**
             * 根据缩放基点和缩放比例取得新的rect
             * @param  {[type]} oPoint           [description]
             * @param  {[type]} scale            [description]
             * @param  {[type]} oTransformedRect [description]
             * @param  {[type]} baseIndex        [description]
             * @return {[type]}                  [description]
             */
            function getNewRect(oPoint, scale, oTransformedRect, baseIndex) {
                var scaledRect = getScaledRect({
                    x: oPoint.x,
                    y: oPoint.y,
                    width: oPoint.width,
                    height: oPoint.height,
                    scale: scale
                });
                var transformedRotateRect = transform(scaledRect, oPoint.rotate);
                // 计算到平移后的新坐标
                var translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left;
                var translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top;

                // 计算平移后元素左上角的坐标
                var newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2;
                var newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2;

                // 缩放后元素的高宽
                var newWidth = scaledRect.width;
                var newHeight = scaledRect.height;

                return {
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight
                };
            }
        }
    })
})(jQuery)

/**
 * 右键&&回退
 */
$(function () {
    undoData = {};//getBddpData(true);
    stack = new Undo.Stack();

    EditCommand = Undo.Command.extend({
        constructor: function (oldValue, newValue) {
            this.oldValue = oldValue;
            this.newValue = newValue;
        },
        execute: function () {
        },
        undo: function () {
            importDataForUndo(this.oldValue);
        },
        redo: function () {
            importDataForUndo(this.newValue);
        }
    });

    /**
     * 系统右键菜单屏蔽
     */
    $(document).bind("contextmenu", function () {
            return false;
        }
    );
    /**
     * Mousetrap_一个简单、轻量可用于捕获和处理键盘事件的js 库
     */
    Mousetrap.bind('up', function (e) {
        $.each(selectableItmes, function (i, node) {
            var nodeOriginalPosition = $(node).data("prop").rectP;
            var newX = nodeOriginalPosition.x;
            var newY = nodeOriginalPosition.y - MIN_DISTANCE;
            $(node).rotateResize("setBoxProp", {
                x: newX,
                y: newY
            });
            // if ($(node).data("groupbox")) {
            //     var gnodeOriginalPosition = $(node).data("groupbox").data("prop").rectP;
            //     var gnewX = gnodeOriginalPosition.x;
            //     var gnewY = gnodeOriginalPosition.y - MIN_DISTANCE;
            //     $(node).data("groupbox").dragBox("setBoxProp", {
            //         x: gnewX,
            //         y: gnewY
            //     });
            // }

        });
    });
    Mousetrap.bind('down', function (e) {
        $.each(selectableItmes, function (i, node) {
            var nodeOriginalPosition = $(node).data("prop").rectP;
            var newX = nodeOriginalPosition.x;
            var newY = nodeOriginalPosition.y + MIN_DISTANCE;
            $(node).rotateResize("setBoxProp", {
                x: newX,
                y: newY
            });
            // if ($(node).data("groupbox")) {
            //     var gnodeOriginalPosition = $(node).data("groupbox").data("prop").rectP;
            //     var gnewX = gnodeOriginalPosition.x;
            //     var gnewY = gnodeOriginalPosition.y + MIN_DISTANCE;
            //     $(node).data("groupbox").dragBox("setBoxProp", {
            //         x: gnewX,
            //         y: gnewY
            //     });
            // }

        });

    });
    Mousetrap.bind('left', function (e) {
        $.each(selectableItmes, function (i, node) {
            var nodeOriginalPosition = $(node).data("prop").rectP;
            var newX = nodeOriginalPosition.x - MIN_DISTANCE;
            var newY = nodeOriginalPosition.y;
            $(node).rotateResize("setBoxProp", {
                x: newX,
                y: newY
            });
            // if ($(node).data("groupbox")) {
            //     var gnodeOriginalPosition = $(node).data("groupbox").data("prop").rectP;
            //     var gnewX = gnodeOriginalPosition.x - MIN_DISTANCE;
            //     var gnewY = gnodeOriginalPosition.y;
            //     $(node).data("groupbox").dragBox("setBoxProp", {
            //         x: gnewX,
            //         y: gnewY
            //     });
            // }

        });

    });
    Mousetrap.bind('right', function (e) {
        $.each(selectableItmes, function (i, node) {
            var nodeOriginalPosition = $(node).data("prop").rectP;
            var newX = nodeOriginalPosition.x + MIN_DISTANCE;
            var newY = nodeOriginalPosition.y;
            $(node).rotateResize("setBoxProp", {
                x: newX,
                y: newY
            });
            // if ($(node).data("groupbox")) {
            //     var gnodeOriginalPosition = $(node).data("groupbox").data("prop").rectP;
            //     var gnewX = gnodeOriginalPosition.x + MIN_DISTANCE;
            //     var gnewY = gnodeOriginalPosition.y;
            //     $(node).data("groupbox").dragBox("setBoxProp", {
            //         x: gnewX,
            //         y: gnewY
            //     });
            // }

        });

    });
    Mousetrap.bind('del', function (e) {
        delSelectedBoxs();
        selectableItmes = [];
    });
    Mousetrap.bind('ctrl+c', function (e) {
        copyTempItems = [];
        localStorage.removeItem("copyTempItems");
        // if ($(".groupbox.selected").length > 0) {
        //     var groupbox = $(".groupbox.selected");
        //     $.each(groupbox.data("boxs"), function (i, box) {
        //         var prop = $.extend(true, {}, $(box).data("prop"));
        //         prop.myChart = false;
        //         copyTempItems.push(prop);
        //     });
        // } else {
        $(".box").each(function () {
            if ($(this).hasClass("selected") || $(this).hasClass("box-selected")) {
                var prop = $.extend(true, {}, $(this).data("prop"));
                prop.myChart = false;
                copyTempItems.push(prop);
            }
        });
        // }
        var copynode = {
            props: copyTempItems
        };
        localStorage.setItem("copyTempItems", JSON.stringify(copynode));
    });
    Mousetrap.bind('ctrl+z', function (e) {
        stack["undo"]();
    });
    Mousetrap.bind('ctrl+y', function (e) {
        stack["redo"]();
    });
    Mousetrap.bind('esc', function (e) {
        $(".layout-Header").removeClass("view");
        $(".layout-Sider").removeClass("view");
        $(".layout-Content").removeClass("view");
        $("#rightnav").removeClass("view");
        exitFull();
    });
    Mousetrap.bind('ctrl+v', function (e) {
        alert("建设中...");
        return;
        selectableItmes = [];
        $(".box").removeClass("selected box-selected");
        var copynode = JSON.parse(localStorage.getItem("copyTempItems"));
        $.each(copynode.props, function (i, node) {
            var prop = $.extend(true, {}, node);
            prop.rectP.x += 10;
            prop.rectP.y += 10;
            prop.id = guid();
            prop.myChart = false;
            var elem = createTagsBox(prop);
            elem.addClass("selected");
            selectableItmes.push(elem[0]);
        });
        // if ($(".groupbox.selected").length > 0) {
        //     $(".groupbox").removeClass("selected").hide();
        //     groupBoxs();
        // }
    });

    /**
     * 右键菜单
     */
    context.init();
    context.attach('.box', [{
        text: '删除',
        action: function (e) {
            e.preventDefault();
            delSelectedBoxs();
        }
    }, {
        text: '上移一层',
        action: function (e) {
            $(".box").each(function () {
                if ($(this).hasClass("ui-selected") || $(this).hasClass("box-selected")) {
                    var newIndex = Number($(this).data("prop").rectP.zIndex) + 1;
                    $(this).data("prop").rectP.zIndex = newIndex;
                    zIndexProp.max = newIndex > zIndexProp.max ? newIndex : zIndexProp.max;
                    $(this).css("z-index", $(this).data("prop").rectP.zIndex);
                }
            });

        }
    }, {
        text: '下移一层',
        action: function (e) {
            $(".box").each(function () {
                if ($(this).hasClass("ui-selected") || $(this).hasClass("box-selected")) {
                    var newIndex = Number($(this).data("prop").rectP.zIndex) - 1;
                    $(this).data("prop").rectP.zIndex = newIndex;
                    zIndexProp.max = newIndex < zIndexProp.min ? newIndex : zIndexProp.min;
                    $(this).css("z-index", $(this).data("prop").rectP.zIndex);
                }
            });

        }
    }, {
        text: '置于顶层',
        action: function (e) {
            $(".box").each(function () {
                if ($(this).hasClass("ui-selected") || $(this).hasClass("box-selected")) {
                    zIndexProp.max += 1;
                    $(this).data("prop").rectP.zIndex = zIndexProp.max;
                    $(this).css("z-index", $(this).data("prop").rectP.zIndex);
                }
            });
        }
    }, {
        text: '置于底层',
        action: function (e) {
            $(".box").each(function () {
                if ($(this).hasClass("ui-selected") || $(this).hasClass("box-selected")) {
                    zIndexProp.min -= 1;
                    $(this).data("prop").rectP.zIndex = zIndexProp.min;
                    $(this).css("z-index", $(this).data("prop").rectP.zIndex);
                }
            });
        }
    }, {
        text: '组件属性',
        action: function (e) {
            propSelectedBoxs()
        }
    }])
});

/**
 * 显示组件属性动作
 */
function propSelectedBoxs() {
    var selectSize = 0;
    $(".box").each(function () {
        if ($(this).hasClass("box-selected")) {
            if (selectSize > 0) {
                return;
            }
            selectSize++;
            getProp($(this));
            $("#rightnav").show().removeClass("off");
        }
    });
    if (selectSize == 0) {
        try {
            app.msg("请选择一个组件或图表");
        } catch (e) {
            console.log("app.msg无法运行", e)
        }
    }
}

/**
 * 删除组件动作
 */
function delSelectedBoxs() {
    $(".selected,.box-selected").remove();
    $("#rightnav").hide().addClass("off");
}

/**
 * 撤销记录
 * @param data
 */
function undoRecord(data) {
    var newValue;
    if (data) {
        newValue = data;
    } else {
        newValue = getBddpData(true);
    }
    stack.execute(new EditCommand(undoData, newValue));
    undoData = $.extend(true, {}, newValue);
}

function contentMouseDown() {
    $(".dropdown-menu").hide();
}

function boxMouseDown() {
    $(".dropdown-menu").hide();
}

function Compare(objA, objB) {
    if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
    if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
    return CompareObj(objA, objB, true); //默认为true
}

function CompareObj(objA, objB, flag) {
    for (var key in objA) {
        if (!flag) //跳出整个循环
            break;
        if (!objB.hasOwnProperty(key)) {
            flag = false;
            break;
        }
        if (!isArray(objA[key])) { //子级不是数组时,比较属性值
            if (objB[key] != objA[key]) {
                flag = false;
                break;
            }
        } else {
            if (!isArray(objB[key])) {
                flag = false;
                break;
            }
            var oA = objA[key],
                oB = objB[key];
            if (oA.length != oB.length) {
                flag = false;
                break;
            }
            for (var k in oA) {
                if (!flag) //这里跳出循环是为了不让递归继续
                    break;
                flag = CompareObj(oA[k], oB[k], flag);
            }
        }
    }
    return flag;
}

function isObj(object) {
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
}

function isArray(object) {
    return object && typeof (object) == 'object' && object.constructor == Array;
}

function getLength(object) {
    var count = 0;
    for (var i in object) count++;
    return count;
}