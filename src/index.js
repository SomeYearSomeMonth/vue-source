import { initMixin } from './init'

// Vue的核心代码 只是Vue的一个声明
function Vue(options) {
    this._init(options)
}

initMixin(Vue)

export default Vue
