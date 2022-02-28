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

export function compileToFunction(template) {
    console.log(template)
    return function render() {}
}
