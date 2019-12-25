function executeSQL(sqlStr,callback) {
    axios.get("db/bddp.db", {responseType: 'arraybuffer'})
        .then(function (response) {
            let db = new window.SQL.Database(new Uint8Array(response.data));
            // 执行查询
            //let s = new Date().getTime();
            //console.log(sqlStr);
            let r = db.exec(sqlStr);
            let e = new Date().getTime();
            //console.info("查询数据耗时：" + (e - s) + "ms");
            // 解析数据
            let obj = dbToObj(r);
            //console.info(obj);

            db.close();

            if (callback) {
                callback(obj);
                return;
            }
        })
        .catch(function (error) {
            console.info(error);
        });
}

var dbToObj = (_data = {}) => {
    let _res = [];
    _data.map(function (item) {
        let _columns = camelArr(item.columns);
        item.values.map(function (values) {
            _res.push(ArraytoObj(_columns, values));
        });
    });
    return _res;
};

var camelArr = (arrs = []) => {
    let _arrs = [];
    arrs.map(function (item) {
        _arrs.push(camel(item));
    });
    return _arrs;
};

var ArraytoObj = (keys = [], values = []) => {
    if (keys.length === 0 || values.length === 0) return {};
    const len = keys.length > values.length ? values.length : keys.length;
    const obj = {};
    for (let i = 0; i < len; ++i) {
        obj[keys[i]] = values[i]
    }
    return obj;
};

// 转驼峰表示：func.camel('USER_ROLE',true) => UserRole
// 转驼峰表示：func.camel('USER_ROLE',false) => userRole
var camel = (str, firstUpper = false) => {
    let ret = str.toLowerCase();
    ret = ret.replace(/_([\w+])/g, function (all, letter) {
        return letter.toUpperCase();
    });
    if (firstUpper) {
        ret = ret.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
            return $1.toUpperCase() + $2;
        });
    }
    return ret;
};

function executeSQLAsObject(sqlStr, callback) {

    axios.get("db/bddp.db", {responseType: 'arraybuffer'})
        .then(function (response) {
            let db = new window.SQL.Database(new Uint8Array(response.data));
            // 执行查询
            //let s = new Date().getTime();
            let r = db.exec(sqlStr);
            let e = new Date().getTime();
            //console.info("查询数据耗时：" + (e - s) + "ms");
            // 解析数据
            let obj = dbToObj(r);
            //console.info(obj);

            db.close();

            if (obj.length > 0) {
                if (callback) {
                    callback(obj[0]);
                    return;
                }
            }
            callback({});
        })
        .catch(function (error) {
            console.info(error);
        });
}

function getJSONFileData(path, callback) {
    $.ajax({
        type: "get",
        url: path,
        dataType: "json",
        success: function (result) {
            if (callback) {
                callback.call(this, result);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getJSONFileDataSync(path) {
    var res = "";
    $.ajax({
        type: "get",
        url: path,
        async: false,
        dataType: "json",
        success: function (result) {
            res = result;
        },
        error: function (e) {
            console.log(e);
        }
    });
    return res;
}

function getAjaxData(path, data, callback) {
    data = data || {};
    $.ajax({
        type: "get",
        url: path,
        data: data,
        dataType: "json",
        success: function (result) {
            if (callback) {
                callback.call(this, result);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function saveBddpData(data, callback) {
    var bddata = "";//Base64Util.encode64(JSON.stringify(data));
    if (callback) {
        callback.call(this, "");
    }
    return
    $.ajax({
        type: "post",
        url: "../../bddp/saveBddpDataForFolder",
        // url : "../../bddp/saveBddpData", 
        data: {
            name: data.content.id,
            data: bddata
        },
        dataType: "json",
        success: function (result) {
            if (callback) {
                callback.call(this, result);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function saveBddpDiyTagsData(data, callback) {
    $.ajax({
        type: "post",
        url: "../../bddp/saveDiyTags",
        // url : "../../bddp/saveBddpData", 
        data: data,
        dataType: "json",
        success: function (result) {
            if (callback) {
                callback.call(this, result);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function saveBddpBgi(name, bgi, callback) {
    $.ajax({
        type: "post",
        url: "../../bddp/saveBddpBgi",
        data: {
            name: name,
            bgi: bgi
        },
        dataType: "json",
        success: function (result) {
            if (callback) {
                callback.call(this, result);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getAjaxMapData(data, callback) {
    data = data || {};
    $.ajax({
        type: "get",
        url: "../../bddp/getJSONMapContent",
        data: data,
        dataType: "json",
        success: function (result) {
            if (callback) {
                callback.call(this, result);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getAjaxMapDataSync(data, callback) {
    data = data || {};
    $.ajax({
        type: "get",
        async: false,
        url: "../../bddp/getJSONMapContent",
        data: data,
        dataType: "json",
        success: function (result) {
            if (callback) {
                callback.call(this, result);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function requestFullScreen(element) {
    if (!element) {
        element = document.body;
    }
    // 判断各种浏览器，找到正确的方法
    var requestMethod = element.requestFullScreen || //W3C
        element.webkitRequestFullScreen ||    //Chrome等
        element.mozRequestFullScreen || //FireFox
        element.msRequestFullScreen; //IE11
    if (requestMethod) {
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

//退出全屏 判断浏览器种类
function exitFull() {
    // 判断各种浏览器，找到正确的方法
    var exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen ||    //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}