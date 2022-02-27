/**
 *
 * 当前数据是不是对象
 * @export
 * @param {*} data
 * @return {boolean}
 */
export function isObject(data) {
    return typeof data === 'object' && data !== null
}

/**
 * 被观测数据 某个key不可被循环
 * @export
 * @param {*} data 被观测数据
 * @param {*} key 不需要观测的key
 * @param {*} value 
 */
export function def(data, key, value) {
    Object.defineProperty(data, key, {
        enumerable: false,
        configurable: false,
        value,
    })
}
