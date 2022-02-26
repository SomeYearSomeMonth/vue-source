/**
 * 
 * 当前数据是不是对象
 * @export
 * @param {*} data
 * @return {*} 
 */
export function isObject(data) {
    return typeof data === 'object' && data !== null
}
