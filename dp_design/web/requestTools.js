function reqServerController(path, dataparm, callback) {
    var rdpserver = "";//getConfigProp("rdpserver");
    $.ajax({
        url: rdpserver + path,
        type: 'post',
        data: JSON.stringify(dataparm),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        success: function (data) {
            if (callback && typeof (callback) == "function") {
                callback.call(this, data);
            }
        },
        error: function (e) {
            if (callback && typeof (callback) == "function") {
                callback.call(this, e);
            }
        }
    });
}

function reqServerControllerParms(path, dataparm, callback) {
    var rdpserver = "";//getConfigProp("rdpserver");
    $.ajax({
        url: rdpserver + path,
        type: 'post',
        data: dataparm,
        success: function (data) {
            if (callback && typeof (callback) == "function") {
                callback.call(this, data);
            }
        },
        error: function (e) {
            if (callback && typeof (callback) == "function") {
                callback.call(this, e);
            }
        }
    });
}