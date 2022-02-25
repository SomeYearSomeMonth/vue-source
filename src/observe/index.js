// 把data中的数据 都是Object.defineProperty重新定义 ES5
// Object.defineProperty 不能兼容IE8 及以下 vue2 无法兼容IE8版本
export function observe(data) {
    console.log(data, 'observe')
}
