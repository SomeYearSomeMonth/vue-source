// 把data中的数据 都是Object.defineProperty重新定义 ES5
// Object.defineProperty 不能兼容IE8 及以下 vue2 无法兼容IE8版本
import { isObject, def } from '../util/index'

import { arrayMethos } from './array'

class Observer {
    constructor(value) {
        // vue 如果数据的层次过多 需要递归的去解析对象中的属性，依次增加set和get方法
        // value.__ob__ = this // 我给每一个监控过的对象都增加一个__ob__属性
        def(value, '__ob__', this)

        if (Array.isArray(value)) {
            // 如果是数据的话并不会对索引进行观测 因为会导致性能问题
            // 前端开发中很少很少 去操作索引 push shift unshift
            value.__proto__ = arrayMethos

            // 如果数据里放的是对象我再监控
            this.observerArray(value)
        } else {
            this.walk(value)
        }
    }

    walk(data) {
        let keys = Object.keys(data)

        keys.forEach(key => {
            defineReactive(data, key, data[key])
        })
    }

    observerArray(value) {
        for (let index = 0; index < value.length; index++) {
            observe(value[index])
        }
    }
}

function defineReactive(data, key, value) {
    observe(value) // 递归实现深度检测
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: false,
        get() {
            return value
        },
        set(newValue) {
            console.log('更新数据')
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
