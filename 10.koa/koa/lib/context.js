const delegate = require("./delegates");
//创建一个空对象并将其导出
const proto = module.exports = {
  onerror(error) {
    const { res } = this;
    this.status = 500;
    res.end(error.message)
  }
}
//使用代理模块将proto对象的一些属性代理到request对象上  proto.url=>proto.request.url
delegate(proto, "request")
  .access("method") //将request对象上method属性代理到proto对象上 access能读又能写
  .access("query")
  .access("url")
  .access("path")
  .getter("header"); //只能读不能写

//使用代理模块将proto对象的一些属性代理到response对象上  proto.body=>proto.response.body
delegate(proto, "response")
  .access("status")
  .access("message")
  .access("body")
  .method("set"); //将response对象上的set方法代理到proto对象上
