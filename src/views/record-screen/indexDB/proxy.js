class Proxy {
    /**
     * @class Proxy
     * 基本代理实现，管理运用程序的数据并且只是管理本地数据对象的引用，异步读取、修改、删除数据
     * @param {string} [proxyName]
     *  代理的名称。如果没传，代理将使用它的构造函数
     * @param {Object} [data]
     * @constructor
     */
    constructor(proxyName, data) {
        this._proxyName = null;
        this._data = null;

        this._proxyName = proxyName || this.constructor.NAME;
        if (data != null) {
          // 设置数据
          this.setData(data);
        }
    }

    /**
     * @return {string}
    */
    getProxyName() {
      return this._proxyName;
    }

    /**
     * @param {Object} data
     * @return {void}
     */
    setData(data) {
      this._data = data;
    }

    /**
     * @return {Object}
     */
    getData() {
      return this._data;
    }

    get data() {
      return this._data
    }

    set data(value) {
      this._data = value;
    }

    /**
     * 外部调用，proxy被注册
     * @return {void}
     */
    onRegister() {
      return;
    }

    /**
     * 外部调用，proxy被移除
     * @return {void}
     */
    onRemove() {
      return;
    }
}

Proxy.NAME = "Proxy";

export default Proxy;