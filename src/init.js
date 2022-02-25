import { initState } from './state'

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this // vue 中使用 this.$options 指代就是用户传递的属性
        vm.$options = options

        // 初始化状态
        initState(vm)
    }
}