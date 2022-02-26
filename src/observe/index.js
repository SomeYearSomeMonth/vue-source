// 把data中的数据 都是Object.defineProperty重新定义 ES5
// Object.defineProperty 不能兼容IE8 及以下 vue2 无法兼容IE8版本
import { isObject } from '../util/index'

class Observer {
    constructor(value) {
        // vue 如果数据的层次过多 需要递归的去解析对象中的属性，依次增加set和get方法

        this.walk(value)
    }

    walk(data) {
        let keys = Object.keys(data)

        keys.forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}

function defineReactive(data, key, value) {
    observe(value) // 递归实现深度检测
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue === value) return
            observe(newValue) // 继续劫持用户设置的值，因为有可能用户设置的值是一个对象
            value = newValue
        },
    })
}

export function observe(data) {
    let isobj = isObject(data)
    if (!isobj) {
        return
    }

    return new Observer(data)
}
