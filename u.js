
// dependencies: jQuery
// license : public domain

// note to self: new fancy native array methods:
// forEach
// map
// filter
// reduce
// every
// some

_ = (function () {
var _ = {}

_.has = function (o, k) {
    return o.hasOwnProperty(k)
}

_.identity = function (e) { return e }

_.each = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array) {
        for (var i = 0; i < o.length; i++)
            if (func(o[i], i) == false)
                break
    } else {
        for (var k in o)
            if (o.hasOwnProperty(k))
                if (func(o[k], k) == false)
                    break
    }
}

_.map = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array)
        return o.map(func)
    var accum = {}
    for (var k in o)
        if (o.hasOwnProperty(k))
            accum[k] = func(o[k], k)
    return accum
}

_.filter = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array)
        return o.filter(func)
    var accum = {}
    for (var k in o)
        if (o.hasOwnProperty(k))
            if (func(o[k], k))
                accum[k] = o[k]
    return accum
}

_.reduce = _.fold = function (o, func, init) {
    if (!func) func = _.identity
    if (o instanceof Array)
        return o.reduce(func, init)
    var accum = init
    for (var k in o)
        if (o.hasOwnProperty(k))
            accum = func(accum, o[k])
    return accum
}

_.some = _.any = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array)
        return o.some(func)
    for (var k in o)
        if (o.hasOwnProperty(k))
            if (func(o[k], k)) return true
    return false
}

_.every = _.all = function (o, func) {
    if (!func) func = _.identity
    if (o instanceof Array)
        return o.every(func)
    for (var k in o)
        if (o.hasOwnProperty(k))
            if (!func(o[k], k)) return false
    return true
}

_.min = function (o, func) {
    if (!func) func = _.identity
    var bestScore = null
    var best = null
    _.each(o, function (v, k) {
        var score = func(v, k)
        if (bestScore === null || score < bestScore) {
            bestScore = score
            best = v
        }
    })
    return best
}

_.max = function (o, func) {
    if (!func) func = _.identity
    var bestScore = null
    var best = null
    _.each(o, function (v, k) {
        var score = func(v, k)
        if (bestScore === null || score > bestScore) {
            bestScore = score
            best = v
        }
    })
    return best
}

_.find = function (o, func) {
    if (!func) func = _.identity
    var found = null
    _.each(o, function (v, k) {
        if (func(v, k)) {
            found = v
            return false
        }
    })
    return found
}

_.size = function (o) {
    if (o instanceof Array)
        return o.length
    return _.keys(o).length
}

_.deepEquals = function (a, b) {
    if (typeof(a) != typeof(b)) return false
    if (typeof(a) == 'object') {
        return _.size(a) == _.size(b) && _.all(a, function (v, k) {
            return _.has(b, k) && _.deepEquals(b[k], v)
        })
    } else {
        return a == b
    }
}

_.keys = function (o) {
    return Object.keys(o)
}

_.values = function (o) {
    var accum = []
    _.each(o, function (e) {
        accum.push(e)
    })
    return accum
}

_.extend = function (o, that) {
    _.each(that, function (v, k) {
        o[k] = v
    })
    return o
}

_.pairs = function (o) {
    var accum = []
    _.each(o, function (v, k) {
        accum.push([k, v])
    })
    return accum
}

_.object = _.unPairs = function (a, b) {
    var accum = {}
    if (b) {
        _.each(a, function (k, i) {
            accum[k] = b[i]
        })
    } else {
        _.each(a, function (e) {
            accum[e[0]] = e[1]
        })
    }
    return accum
}

_.pick = function (o) {
    var accum = {}
    for (var i = 1; i < arguments.length; i++) {
        var k = arguments[i]
        if (_.has(o, k)) accum[k] = o[k]
    }
    return accum
}

_.omit = function (o) {
    var omits = _.makeSet(_.toArray(arguments).slice(1))
    var accum = {}
    _.each(o, function (v, k) {
        if (!_.has(omits, k))
            accum[k] = v
    })
    return accum
}

_.setAdd = function (s, key) {
    if (!_.has(s, key) || !s[key])
        return s[key] = true
    return false
}

_.makeSet = function (a) {
    var s = {}
    _.each(a, function (e) {
        s[e] = true
    })
    return s
}

_.bagAdd = function (bag, key, amount) {
    if (amount == null) amount = 1
    if (!_.has(bag, key))
        bag[key] = 0
    bag[key] += amount
    return bag[key]
}

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
    return s.split(/\r\n|\r|\n/)
}

_.sum = function (a) {
    return _.fold(a, function (a, b) { return a + b }, 0)
}

_.sample = function (o) {
    if (o instanceof Array)
        return o[Math.floor(o.length * Math.random())]
    else
        return _.sample(_.values(o))
}

_.shuffle = function (a) {
    for (var i = 0; i < a.length; i++) {
        var ri = Math.floor(a.length * Math.random())
        var temp = a[i]
        a[i] = a[ri]
        a[ri] = temp
    }
    return a
}

_.toArray = function (a) {
    var accum = []
    for (var i = 0; i < a.length; i++)
        accum[i] = a[i]
    return accum
}

_.ensure = function () {
    if (arguments.length <= 3) {
        if (!(arguments[1] in arguments[0])) {
            arguments[0][arguments[1]] = arguments[2]
        }
        return arguments[0][arguments[1]]
    }
    var args = _.toArray(arguments)
    var prev = _.ensure.apply(null, args.slice(0, 2).concat([typeof(args[2]) == "string" ? {} : []]))
    return _.ensure.apply(null, [prev].concat(args.slice(2)))
}

_.escapeUnicodeChar = function (c) {
    var code = c.charCodeAt(0)
    var hex = code.toString(16)
    if (code < 16) return '\\u000' + hex
    if (code < 256) return '\\u00' + hex
    if (code < 4096) return '\\u0' + hex
    return '\\u' + hex
}

_.escapeString = function (s) {
    return s.
        replace(/\\/g, '\\\\').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\\"').
        replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, _.escapeUnicodeChar)
}

_.escapeRegExp = function (s) {
    return _.escapeString(s).replace(/([\{\}\(\)\|\[\]\^\$\.\*\+\?])/g, "\\$1")
}

_.escapeUrl = function (s) {
    return encodeURIComponent(s)
}

_.unescapeUrl = function (s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}

_.escapeXml = function (s) {
    s = s.replace(/&/g, "&amp;")
    s = s.replace(/</g, "&lt;").
        replace(/>/g, "&gt;").
        replace(/'/g, "&apos;").
        replace(/"/g, "&quot;").
//            replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, function (c) {
        replace(/[\u0080-\uFFFF]/g, function (c) {
            var code = c.charCodeAt(0)
            return '&#' + code + ';'
            // if we want hex:
            var hex = code.toString(16)
            return '&#x' + hex + ';'
        })
    return s;
}

_.unescapeXml = function (s) {
    return s.replace(/&[^;]+;/g, function (s) {
        switch(s.substring(1, s.length - 1)) {
            case "amp":  return "&";
            case "lt":   return "<";
            case "gt":   return ">";
            case "apos": return "'";
            case "quot": return '"';
            default:
                if (s.charAt(1) == "#") {
                    if (s.charAt(2) == "x") {
                        return String.fromCharCode(parseInt(s.substring(3, s.length - 1), 16));
                    } else {
                        return String.fromCharCode(parseInt(s.substring(2, s.length - 1)));
                    }
                } else {
                    throw "unknown XML escape sequence: " + s
                }
        }
    })
}

function splitSizeHelper(prefix, size) {
    if (size == null) return ""
    if (size <= 1) return prefix + '="' + Math.round(100 * size) + '%"'
    return prefix + '="' + size + 'px"'
}

_.splitHorz = function (aSize, bSize, a, b, fill) {
    if (fill === undefined) fill = true
    if (arguments.length == 3) {
        // backwards compatibility
        b = a
        a = bSize
        aSize = aSize / 100
        bSize = null
    }
    aSize = splitSizeHelper('width', aSize)
    bSize = splitSizeHelper('width', bSize)
    var t = $('<table ' + (fill ? 'style="width:100%;height:100%"' : '') + '><tr valign="top"><td class="a" ' + aSize + '></td><td class="b" ' + bSize + '></td></tr></table>')
    // don't do this:
    // t.find('.a').append(a)
    // t.find('.b').append(b)
    var _a = t.find('.a')
    var _b = t.find('.b')
    _a.append(a)
    _b.append(b)
    return t
}

_.splitVert = function (aSize, bSize, a, b, fill) {
    if (fill === undefined) fill = true
    if (arguments.length == 3) {
        // backwards compatibility
        b = a
        a = bSize
        aSize = aSize / 100
        bSize = null
    }
    aSize = splitSizeHelper('height', aSize)
    bSize = splitSizeHelper('height', bSize)
    var t = $('<table ' + (fill ? 'style="width:100%;height:100%"' : '') + '><tr valign="top"><td class="a" ' + aSize + '></td></tr><tr valign="top"><td class="b" ' + bSize + '></td></tr></table>')
    // don't do this:
    // t.find('.a').append(a)
    // t.find('.b').append(b)
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
        var w = window.innerWidth
        var h = window.innerHeight
        d.css({
            left : Math.round(w / 2 - d.width() / 2) + "px",
            top : Math.round(h / 2 - d.height() / 2) + "px"
        })
    }, 0)
    
    _.closeDialog = function () {
        b.remove()
        d.remove()
    }
}

_.decycle = function(o) {
    var rootKey = "root_" + Math.round(Math.random() * 1000)
    var uniqueObj = {}
    while (true) {
        try {
            var objs = []
            function helper(o, path) {
                if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey)
                    throw "bad root key"
                if (typeof(o) == "object" && o) {
                    if (typeof(o[rootKey]) == "object" && o[rootKey].uniqueObj == uniqueObj) {
                        return o[rootKey].path
                    } else {
                        if (rootKey in o)
                            throw "bad root key"
                        var oo = (o instanceof Array) ? [] : {}
                        o[rootKey] = {
                            uniqueObj : uniqueObj,
                            path : path,
                            newObj : oo
                        }
                        objs.push(o)
                        return oo
                    }
                }
                return o
            }
            function helper2(o) {
                var oo = o[rootKey].newObj
                var path = o[rootKey].path
                if (o instanceof Array) {
                    for (var i = 0; i < o.length; i++) {
                        oo[i] = helper(o[i], path + '[' + i + ']')
                    }
                } else {
                    for (k in o) {
                        if (k != rootKey) {
                            oo[k] = helper(o[k], path + '[' + JSON.stringify(k) + ']')
                        }
                    }
                }
            }
            function cleanup() {
                for (var i = 0; i < objs.length; i++) {
                    delete objs[i][rootKey]
                }
            }
            
            var ret = {}
            ret.cycle_root = rootKey
            ret[rootKey] = helper(o, rootKey)
            for (var i = 0; i < objs.length; i++) {
                helper2(objs[i])
            }
            cleanup()
            return ret
        } catch (e) {
            cleanup()
            if (e == "bad root key") {
                rootKey += Math.round(Math.random() * 1000)
            } else {
                throw e
            }
        }
    }
}

_.recycle = function (obj) {
    // regex adapted from https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
    var r = /^root(?:_\d+)?(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/
    
    if (!obj.cycle_root || !(obj.cycle_root in obj))
        throw "doesn't look recycle-able"
    
    var rootKey = obj.cycle_root
    function helper(o) {
        if (typeof(o) == "string" && o.slice(0, rootKey.length) == rootKey) {
            if (!o.match(r)) throw "I'm afraid to eval: " + o
            with (obj) {
                return eval(o)
            }
        }
        if (typeof(o) == "object" && o) {
            if (o instanceof Array) {
                for (var i = 0; i < o.length; i++) {
                    o[i] = helper(o[i])
                }
            } else {
                for (var k in o) {
                    o[k] = helper(o[k])
                }
            }
        }
        return o
    }
    return helper(obj[rootKey])
}

_.json = function (x, pretty) {
    try {
        return JSON.stringify(x, null, pretty === true ? "    " : pretty)
    } catch (e) {
        return _.json(_.decycle(x), pretty)
    }
}

_.unJson = function (s) {
    var o = JSON.parse(s)
    try {
        return _.recycle(o)
    } catch (e) {
        return o
    }
}

return _
})();
