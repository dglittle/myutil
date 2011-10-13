// public domain

function parseCsv(text) {
    var a = []
    var re = /(^|,|\r?\n)("(?:""|.)*"|[^,\r\n]*)/g
    while (m = re.exec(text)) {
        if (m[1] != ',') {
            a.push([])
        }
        a[a.length - 1].push(m[2].match(/^"/) ? m[2].replace(/""/g, '"') : m[2])
    }
    return a
}

