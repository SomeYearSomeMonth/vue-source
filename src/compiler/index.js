import { parseHTML } from './paser-html'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

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

function genChildren(el) {
    let children = el.children

    if (children && children.length > 0) {
        return `${children.map(item => gen(item)).join()}`
    } else {
        return false
    }
}

function gen(node) {
    if (node.type === 1) {
        return generate(node)
    } else {
        let text = node.text // a {{name}}  b{{age}} c
        let tokens = []
        let match, index
        // 每次的偏移量 buffer.split()
        let lastIndex = (defaultTagRE.lastIndex = 0) // 只要是全局匹配 据需要将lastIndex每次匹配的时候调到0处

        while ((match = defaultTagRE.exec(text))) {
            index = match.index
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }

        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${tokens.join('+')})`
    }
}

function generate(el) {
    const children = genChildren(el)

    let code = `_c("${el.tag}",${
        el.attrs.length > 0 ? genProps(el.attrs) : 'undefined'
    }${children ? ',' + children : ''})`

    return code
}

export function compileToFunction(template) {
    // 1) 解析html字符串 将html字符串 -> ast语法树
    let root = parseHTML(template)

    // 需要将ast语法书生成最终的render函数， 就是字符串拼接(模版引擎)
    let code = generate(root)

    // 核心思路就是将模版转化成 下面这段字符串
    // <div id="app"><p>hello {{name}}</p></div>
    // 将ast树 再次转化为js的语法
    // _c("div",{id:app},_c("p",undefind,_v('hello'+_s(name))))

    let renderFn = new Function(`with(this){ return ${code}}`)
    return renderFn
}
