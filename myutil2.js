
// dependencies: underscore and jQuery
// license : public domain

_.setAdd = function (s, key) {
    if (!_.has(s, key) || !s[key]) {
        s[key] = true
        return true
    }
    return false
}

_.makeSet = function (a) {
    var s = {}
    _.each(a, function (e) {
        s[e] = true
    })
    return s
}

_.bagAdd = function (bag, key) {
    if (!_.has(bag, key))
        bag[key] = 0
    bag[key]++
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
    return _.reduce(a, function (a, b) { return a + b }, 0)
}

_.choose = function (a) {
    if (a instanceof Array)
        return a[Math.floor(a.length * Math.random())]
    else
        return a[pick(_.keys(a))]
}
_.sample = _.choose

_.unPairs = _.object

if (!_.oldMap) _.oldMap = _.map

_.map = function (o, iterator, context) {
    var r = _.isArray(o) ? [] : {}
    _.each(o, function (v, k, list) {
        r[k] = iterator.call(context, v, k, list)
    })
    return r
}

if (!_.oldFilter) _.oldFilter = _.filter

_.filter = _.select = function (o, iterator, context) {
    if (_.isArray(o)) {
        return _.oldFilter(o, iterator, context)
    } else {
        var r = {}
        _.each(o, function (v, k, list) {
            if (iterator.call(context, v, k, list)) {
                r[k] = v
            }
        })
        return r
    }
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

// depends on _.escapeUnicodeChar
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

// depends on _.escapeString
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
