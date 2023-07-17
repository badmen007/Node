const parse = require("parseurl");
const qs = require("querystring");
module.exports = {
  get url() {
    return this.req.url;
  },
  get path() {
    //把url路径转成对象，pathname是它的路径名 /a/b 参数req: IncomingMessage
    return parse(this.req).pathname;
  },
  get method() {
    return this.req.method;
  },
  //查询字符串，它的格式是一个字符串 ?a=1&b=2
  get querystring() {
    return parse(this.req).query;
  },
  //它会调用qs.parse方法把查询字符串从字符串转成对象
  get query() {
    return qs.parse(this.querystring);
  },
  get header() {
    return this.req.headers;
  },
  get headers() {
    return this.header;
  },
};
