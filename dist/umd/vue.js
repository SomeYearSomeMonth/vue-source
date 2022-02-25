
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    // 把data中的数据 都是Object.defineProperty重新定义 ES5
    // Object.defineProperty 不能兼容IE8 及以下 vue2 无法兼容IE8版本
    function observe(data) {
      console.log(data, 'observe');
    }

    function initState(vm) {
      var opts = vm.$options; // vue 的数据来源 属性 方法 数据 计算属性 watch

      if (opts.props) ;

      if (opts.methods) ;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) ;

      if (opts.watch) ;
    }

    function initData(vm) {
      // 数据初始化工作
      var data = vm.$options.data; // 用户传递的data

      data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对象劫持 用户改变了数据 我希望可以得到通知 ==> 刷新页面
      // MVVM模式 数据变化可以驱动试图变化
      // Object.defineProperty() 给属性添加get和set方法

      observe(data); // 响应式原理
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this; // vue 中使用 this.$options 指代就是用户传递的属性

        vm.$options = options; // 初始化状态

        initState(vm);
      };
    }

    function Vue(options) {
      this._init(options);
    }

    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
