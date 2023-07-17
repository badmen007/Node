module.exports = {
  //设置状态码   response.status = 200;
  set status(code) {
    //把状态码code透传给原生的res响应对象
    this.res.statusCode = code;
  },
  set message(msg) {
    //给响应状态码的原因短语赋值
    this.res.statusMessage = msg;
  },
  set body(value) {
    //当调用response.body = xxx的时候，会把xxx暂存到response._body上
    this._body = value;
    //一旦调用了res.end方法，则不能再次写入响应了
    //this.res.end(value);
  },
  get body() {
    return this._body;
  },
  //set用来设置响应头
  set(field, value) {
    //调用原生的响应对象的setHeader方法，设置字符和值
    this.res.setHeader(field, value);
  },
};
