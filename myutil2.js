
// dependencies: underscore and jQuery
// license : public domain

_.lerp = function (t0, v0, t1, v1, t) {
    return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

_.time = function () {
    return new Date().getTime()
}

_.trim = function (s) {
    return s.replace(/^\s+|\s+$/g,"")
}

_.ensure = function () {
    if (arguments.length <= 3) {
        if (!(arguments[1] in arguments[0])) {
            arguments[0][arguments[1]] = arguments[2]
        }
        return arguments[0][arguments[1]]
    }
    var args = _.toArray(arguments)
    var prev = ensure.apply(null, args.slice(0, 2).concat([typeof(args[2]) == "string" ? {} : []]))
    return ensure.apply(null, [prev].concat(args.slice(2)))
}

_.getStartOfDay = function (time) {
    var t = new Date(time)
    t.setHours(0)
    t.setMinutes(0)
    t.setSeconds(0)
    t.setMilliseconds(0)
    return t.getTime()
}

_.dialog = function (content) {
    var win = $(window)
    var w = win.width()
    var h = win.height()
    
    var b
    $('body').append(b = $('<div style="position:fixed;left:0px;top:0px; z-index:10000;background:black;opacity:0.5"/>').width(w).height(h))
    
    var d = $('<div style="position:fixed;z-index:20000;background:white"/>').append(content)
    $('body').append(d)
    setTimeout(function () {
        d.css({
            left : (w / 2 - d.width() / 2) + "px",
            top : (h / 2 - d.height() / 2) + "px"
        })
    }, 0)
    
    _.closeDialog = function () {
        b.remove()
        d.remove()
    }
}
