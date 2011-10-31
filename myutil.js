//
// license:
// 
// sprintf function:
//      - http://creativecommons.org/licenses/by/2.0/uk/
//
// everything else:
//      - public domain

////////////////////////////
// misc

function setTimeoutRepeat(func, interval) {
    setTimeout(function () {
        func()
        setTimeoutRepeat(func, interval)
    }, interval)
}

function lerp(t0, v0, t1, v1, t) {
    return (t - t0) * (v1 - v0) / (t1 - t0) + v0
}

function trim(s) {
    return s.replace(/^\s+|\s+$/g,"");
}

function values(obj) {
    var a = []
    foreach(obj, function (e) {a.push(e)})
    return a
}

function keys(obj) {
    var a = []
    foreach(obj, function (v, k) {a.push(k)})
    return a
}

function compare(a, b) {
    if (a < b) return -1
    if (a > b) return 1
    return 0
}

function lines(s) {
    return s.split(/\r?\n/)
}

function merge(objA, objB) {
    foreach(objB, function (v, k) {
        objA[k] = v
    })
    return objA
}

function time() {
    return new Date().getTime()
}

function getFragment(url) {
    if (url === undefined) {
        url = window.location.href
    }
    var m = url.match(/#(.*)/)
    return m ? m[1] : ""
}

function getUrlParams(url) {
    if (url === undefined) {
        url = window.location.href
    }
    var params = {}
    var m = url.match(/\?([^#]+)/)
    if (m) {
        foreach(m[1].split(/&/), function (m) {
            if (m.length > 0) {
                var a = m.split(/=/)
                params[unescapeUrl(a[0])] = a.length > 1 ? unescapeUrl(a[1]) : true
            }
        })
    }
    return params
}

////////////////////////////
// random

function randomIndex(n) {
    return Math.floor(Math.random() * n)
}

function pick(a) {
    if (a instanceof Array) {
        return a[randomIndex(a.length)]
    } else {
        return a[pick(keys(a))]
    }
    return a
}

////////////////////////////
// escapeing

function escapeUnicodeChar(c) {
    var code = c.charCodeAt(0)
    var hex = code.toString(16)
    if (code < 16) return '\\u000' + hex
    if (code < 256) return '\\u00' + hex
    if (code < 4096) return '\\u0' + hex
    return '\\u' + hex
}

function escapeString(s) {
    return s.
        replace(/\\/g, '\\\\').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\\"').
        replace(/[\u0000-\u001F]|[\u0080-\uFFFF]/g, escapeUnicodeChar)
}

function escapeRegex(s) {
    return escapeString(s).replace(/([\{\}\(\)\|\[\]\^\$\.\*\+\?])/g, "\\$1")
}

function escapeUrl(s) {
    return encodeURIComponent(s)
}

function unescapeUrl(s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}

function escapeXml(s) {
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
function unescapeXml(s) {
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

////////////////////////////
// list processing

function foreach(a, func) {
    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            if (func(a[i], i) == false) break
        }
    } else {
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                if (func(a[k], k) == false) break
            }
        }
    }
    return a
}

function filter(a, func) {
    if (a instanceof Array) {
        var b = []
        for (var i = 0; i < a.length; i++) {
            var v = a[i]
            if (func(v, i)) {
                b.push(v)
            }
        }
        return b
    } else {
        var b = {}
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                var v = a[k]
                if (func(v, k)) {
                    b[k] = v
                }
            }
        }
        return b
    }
}

function map(a, func) {
    if (a instanceof Array) {
        var b = []
        for (var i = 0; i < a.length; i++) {
            b.push(func(a[i], i))
        }
        return b
    } else {
        var b = {}
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                b[k] = func(a[k], k)
            }
        }
        return b
    }
}

function mapToSelf(a, func) {
    if (a instanceof Array) {
        for (var i = 0; i < a.length; i++) {
            a[i] = func(a[i], i)
        }
        return a
    } else {
        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                a[k] = func(a[k], k)
            }
        }
        return a
    }
}

function group(a, func) {
    var b = {}
    foreach(a, function (e) {
        var k = func(e)
        if (k) {
            if (!b[k]) b[k] = []
            b[k].push(e)
        }
    })
    return b
}

//////////////////////////////////////////////
// json that handles circular references

function myJson(o) {
    var touched = []
    var result = []
    var appendAtEnd = []
    function my_json_helper(result, o, indent, path) {
        switch (typeof o) {
            case 'object':
                // special case for Java strings
                try {
                    if (o instanceof Packages.java.lang.String) {
                        result.push('"')
                        result.push(escapeString('' + o));
                        result.push('" /* was a Java String */')
                        break
                    }
                } catch (e) {
                }
                
                // special case for null
                if (o == null) {
                    result.push('null')
                    break
                }
            
                if (o.__temp_json_path) {
                    result.push("/* ")
                    result.push(o.__temp_json_path)
                    result.push(" */0")
                    
                    appendAtEnd.push("\t" + path + " = " + o.__temp_json_path + "\n")
                    break
                }
                o.__temp_json_path = path       
                touched.push(o)
                if (o instanceof Array) {
                    result.push("[\n")
                    var indentMore = indent + "\t"
                    for (var i = 0; i < o.length; i++) {
                        result.push(indentMore)
                        my_json_helper(result, o[i], indentMore, path + "[" + i + "]")
                        if (i + 1 < o.length) {
                        	result.push(",\n")
                        } else {
                        	result.push("\n")
                        }
                    }
                    result.push(indent)
                    result.push("]")
                } else if (o instanceof Date) {
                    result.push("(function () {var d = new Date(); d.setTime(")
                    result.push(o.getTime())
                    result.push("); return d})()")
                } else {
                    result.push("{\n")
                    var indentMore = indent + "\t"
                    var first = true
                    for (var k in o) {
                        if (o.hasOwnProperty(k)) {
                            if (k == "__temp_json_path") continue;
                            
                        	if (first) {
                        		first = false                        		
                        	} else {
                        		result.push(",\n")
                        	}
                            result.push(indentMore)
                            result.push('"')
                            var escapedK = escapeString(k)
                            result.push(escapedK)
                            result.push('" : ')
                            my_json_helper(result, o[k], indentMore, path + "[\"" + escapedK + "\"]")
                        }
                    }
                    if (!first) {
                    	result.push("\n")
                    }
                    result.push(indent)
                    result.push("}")
                }
                break
            case 'string':
                result.push('"')
                result.push(escapeString(o));    
                result.push('"')
                break
            case 'function':
                result.push(o)
                break
            case 'null':
                result.push('null')
                break
            case 'number':
                result.push(o)
                break
            case 'boolean':
                result.push(o)
                break
            case 'undefined':
                result.push('undefined')
                break
            default:
                throw "error: type not supported: " + (typeof o)
        }
    }
    my_json_helper(result, o, "\t", "data")
    
    if (appendAtEnd.length > 0) {
        result.unshift("(function () {\n\tvar data = ")
        result.push("\n")    
        result = result.concat(appendAtEnd)
        result.push("\treturn data\n})()")
    } else if (touched.length > 0) {
        result.unshift("(")
        result.push(")")
    }
    
    for (var i = 0; i < touched.length; i++) {
        delete touched[i].__temp_json_path
    }
    
    return result.join("")
}

/**
*
*  Javascript sprintf
*  http://www.webtoolkit.info/
*
*  licensed under creative commons attribute:
*  http://creativecommons.org/licenses/by/2.0/uk/
*
**/
sprintfWrapper = {

    init : function () {

        if (typeof arguments == "undefined") { return null; }
        if (arguments.length < 1) { return null; }
        if (typeof arguments[0] != "string") { return null; }
        if (typeof RegExp == "undefined") { return null; }

        var string = arguments[0];
        var exp = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d)?)?([bcdfosxX])))/g);
        var matches = new Array();
        var strings = new Array();
        var convCount = 0;
        var stringPosStart = 0;
        var stringPosEnd = 0;
        var matchPosEnd = 0;
        var newString = '';
        var match = null;

        while (match = exp.exec(string)) {
            if (match[9]) { convCount += 1; }

            stringPosStart = matchPosEnd;
            stringPosEnd = exp.lastIndex - match[0].length;
            strings[strings.length] = string.substring(stringPosStart, stringPosEnd);

            matchPosEnd = exp.lastIndex;
            matches[matches.length] = {
                match: match[0],
                left: match[3] ? true : false,
                sign: match[4] || '',
                pad: match[5] || ' ',
                min: match[6] || 0,
                precision: match[8],
                code: match[9] || '%',
                negative: parseInt(arguments[convCount]) < 0 ? true : false,
                argument: String(arguments[convCount])
            };
        }
        strings[strings.length] = string.substring(matchPosEnd);

        if (matches.length == 0) { return string; }
        if ((arguments.length - 1) < convCount) { return null; }

        var code = null;
        var match = null;
        var i = null;

        for (i=0; i<matches.length; i++) {

            if (matches[i].code == '%') { substitution = '%' }
            else if (matches[i].code == 'b') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(2));
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'c') {
                matches[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(matches[i].argument)))));
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'd') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'f') {
                matches[i].argument = String(Math.abs(parseFloat(matches[i].argument)).toFixed(matches[i].precision ? matches[i].precision : 6));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'o') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(8));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 's') {
                matches[i].argument = matches[i].argument.substring(0, matches[i].precision ? matches[i].precision : matches[i].argument.length)
                substitution = sprintfWrapper.convert(matches[i], true);
            }
            else if (matches[i].code == 'x') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]);
            }
            else if (matches[i].code == 'X') {
                matches[i].argument = String(Math.abs(parseInt(matches[i].argument)).toString(16));
                substitution = sprintfWrapper.convert(matches[i]).toUpperCase();
            }
            else {
                substitution = matches[i].match;
            }

            newString += strings[i];
            newString += substitution;

        }
        newString += strings[i];

        return newString;

    },

    convert : function(match, nosign){
        if (nosign) {
            match.sign = '';
        } else {
            match.sign = match.negative ? '-' : match.sign;
        }
        var l = match.min - match.argument.length + 1 - match.sign.length;
        var pad = new Array(l < 0 ? 0 : l).join(match.pad);
        if (!match.left) {
            if (match.pad == "0" || nosign) {
                return match.sign + pad + match.argument;
            } else {
                return pad + match.sign + match.argument;
            }
        } else {
            if (match.pad == "0" || nosign) {
                return match.sign + match.argument + pad.replace(/0/g, ' ');
            } else {
                return match.sign + match.argument + pad;
            }
        }
    }
}
sprintf = sprintfWrapper.init;
