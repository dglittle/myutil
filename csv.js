// public domain

function parseCsv(text) {
    var a = []
    var re = /(^|,|\r?\n)("(?:""|[^"])*"|[^,\r\n]*)/g
    while (m = re.exec(text)) {
        if (m[1] != ',') {
            a.push([])
        }
        a[a.length - 1].push(m[2].match(/^"/) ? m[2].slice(1, m[2].length - 1).replace(/""/g, '"') : m[2])
    }
    return a
}

function applyHeaders(a, headers) {
    return map(a, function (a) {
        var b = {}
        foreach(headers, function (h, i) {
            b[h] = a[i]
        })
        return b
    })
}

