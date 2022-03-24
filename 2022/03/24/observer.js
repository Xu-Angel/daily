var observer = (function () {

    var list = {};

    var on = function (evt, cb) {
        if (!list[evt]) {
            list[evt] = [];
        }
        list[evt].push(cb);
    };

    var trigger = function () {
        var evtName = Array.prototype.shift.call(arguments);
        callbacks = list[evtName];
        if (!callbacks || callbacks.length === 0) {
            return;
        }
        for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i].apply(this, arguments);
        }
    };

    var off = function (evt, fn) {
        var callbacks = list[evt];
        if (!callbacks) {
            return;
        }
        if (!fn) {
            callbacks && callbacks.length = 0;
            return;
        }
      for (var i = 0, len = callbacks.length; i < len; i++) {
            if (fn === callbacks[i]) {
                callbacks.splice(i, 1);
            }
        }
    };

    // 暴露对外接口
    return {
        trigger: trigger,
        on: on,
        off: off
    }
})();