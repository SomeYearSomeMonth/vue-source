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

let root = null // ast语法树的树根
let currentParent // 标识当前父亲是谁
let stack = []
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
    return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs,
        parent: null,
    }
}

function start(tagName, attrs) {
    // 遇到开始标签 创建一个ast元素
    let element = createASTElement(tagName, attrs)
    if (!root) {
        root = element
    }
    currentParent = element // 把当前元素标记成父ast树
    stack.push(element) // 将开始标签存放到栈中
}

function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
        currentParent.children.push({
            text,
            type: TEXT_TYPE,
        })
    }
}

function end(tagName) {
    let element = stack.pop()
    // 我要标识当前这个P属于这个div的儿子的
    currentParent = stack[stack.length - 1]
    if (currentParent) {
        element.parent = currentParent
        currentParent.children.push(element)
    }
}

export function parseHTML(html) {
    // 不停的去解析html字符串
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            let startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs) // 1.解析开始标签
                continue // 如果开始标签匹配完毕后 继续下一次匹配
            }

            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1]) //  2.解析结束标签
                continue
            }
        }

        let text
        if (textEnd >= 0) {
            text = html.substring(0, textEnd)
        }

        if (text) {
            advance(text.length)
            chars(text) //  3.解析文本标签
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
    return root
}
