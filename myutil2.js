
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

_.lines = function (s) {
    return s.split(/\r?\n/)
}

_.choose = function (a) {
    if (a instanceof Array)
        return a[Math.floor(a.length * Math.random())]
    else
        return a[pick(_.keys(a))]
}

_.json = function (x, pretty) {
    return JSON.stringify(x, null, pretty ? "    " : null)
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

_.splitHorz = function (percent, a, b) {
    var t = $('<table class="fill"><tr><td class="a" width="' + percent + '%"></td><td class="b" width="' + (100 - percent) + '%"></td></tr></table>')
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
}

_.splitVert = function (percent, a, b) {
    var t = $('<table class="fill"><tr><td class="a" height="' + percent + '%"></td></tr><tr><td class="b" height="' + (100 - percent) + '%"></td></tr></table>')
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
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
