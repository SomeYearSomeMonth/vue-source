// ast语法树 用对象来描述原生语法的 虚拟dom 用对象来描述dom节点
// ?:匹配不捕获
// argumens[0] = 匹配到的标签 arguments[1] 匹配到的标签名字
const ncname = `[a-zA-z_][\\-\\.0-9_a-zA-z]*` // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // <aaa:asdfas>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function start(tagName, attrs) {
    console.log('开始标签', tagName, 'attrs', attrs)
}

function chars(text) {
    console.log('文本是', text)
}

function end(tagName) {
    console.log('结束标签', tagName)
}

function parseHTML(html) {
    // 不停的去解析html字符串
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            let startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue // 如果开始标签匹配完毕后 继续下一次匹配
            }

            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }

        let text
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }

        if (text) {
            advance(text.length)
            chars(text)
        }
    }

    function advance(n) {
        html = html.substring(n)
    }

    function parseStartTag() {
        let start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            }
            advance(start[0].length)

            let end, attr
            while (
                !(end = html.match(startTagClose)) &&
                (attr = html.match(attribute))
            ) {
                // 将属性进行解析
                advance(attr[0].length) // 将属性去掉
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5],
                })
            }

            if (end) {
                // 去掉开始标签的 >
                advance(end[0].length)
                return match
            }
        }
    }
}

export function compileToFunction(template) {
    let root = parseHTML(template)
    return function render() {}
}
