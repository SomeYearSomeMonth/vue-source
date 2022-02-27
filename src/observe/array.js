// 我要重写数据的那些方法 7个 push unshift shift pop reverse sort splice 会导致数据本身发生变化

let oldArrayMethods = Array.prototype
// value.__proto__ = arrayMethods 原型链查找的问题 会向上查找，先查找我重写的，重写的没有会继续向上查找
// arrayMethods.__proto__ = oldArrayMethods

export const arrayMethos = Object.create(oldArrayMethods)

const methods = ['push', 'unshift', 'shift', 'pop', 'reverse', 'sort', 'splice']

methods.forEach(method => {
    arrayMethos[method] = function (...args) {
        console.log(`用户调用了${method}方法`) // AOP 切片编程

        const result = oldArrayMethods[method].apply(this, args) // 调用原生的数据方法

        let instered // 当前用户插入的元素

        let ob = this.__ob__

        switch (method) {
            case 'push':
            case 'unshift':
                instered = args
                break
            case 'splice': // 3个 新增的属性 splice 有删除 新增的功能 arr.splice(0,1,{name:1})
                instered = args.splice(2)
                break
            default:
                break
        }

        if (instered) ob.observerArray(instered) // 将新增属性继续观测

        return result
    }
})
