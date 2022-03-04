import { parseHTML } from './paser-html'

export function compileToFunction(template) {
    // 1) 解析html字符串 将html字符串 -> ast语法树
    let root = parseHTML(template)
    console.log(root)
    return function render() {}
}
