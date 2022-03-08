import { parseHTML } from './paser-html'

function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i]

        if (attr.name === 'style') {
            let obj = {}

            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })

            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }

    return `{${str.slice(0, -1)}}`
}

function generate(el) {
    let code = `_c("${el.tag}",${
        el.attrs.length > 0 ? genProps(el.attrs) : 'undefined'
    })
    
    `

    return code
}

export function compileToFunction(template) {
    // 1) 解析html字符串 将html字符串 -> ast语法树
    let root = parseHTML(template)

    // 需要将ast语法书生成最终的render函数， 就是字符串拼接(模版引擎)
    let code = generate(root)

    console.log(code)

    // 核心思路就是将模版转化成 下面这段字符串
    // <div id="app"></div>
    return function render() {}
}
