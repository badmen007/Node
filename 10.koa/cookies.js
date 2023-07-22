function Cookies(req, res) {
  this.req = req;
  this.res = res;
}

// 用来读取cookie，通过请求头中读cookie
Cookies.prototype.get = function (name) {
  // 获取客户端发送的cookie
  let cookie = this.req.headers.cookie || '';
  return getValueFromHeader(name, cookie)
};

function getValueFromHeader(name, cookie) {
  // 如果cookie为空，直接返回
  if (!cookie) return;
  let regexp = new RegExp("(?:^|;) *" + name +"=([^;]*)")
  let match = cookie.match(regexp)
  if (match) {
    return match[1];
  }
}

// 用来设置cookie，通过响应头中设置cookie Set-Cookie
Cookies.prototype.set = function (name, value, options) {
  // 获取响应头中的Set-Cookie
  const headers = this.res.getHeader("Set-Cookie") || [];
  let cookie = new Cookie(name, value, options);

  // 把新的cookie添加到数组中
  headers.push(cookie.toHeader());
  // 把新的cookie数组设置到响应头中
  // 展开的操作是node内部做的不用做处理
  this.res.setHeader("Set-Cookie", headers);
};

function Cookie(name, value, attrs) {
  this.name = name;
  this.value = value;
  for (let name in attrs) {
    this[name] = attrs[name];
  }
}

Cookie.prototype.toString = function () {
  return `${this.name}=${this.value}`;
};

Cookie.prototype.toHeader = function () {
  let header = this.toString();
  if (this.path) header += `; path=` + this.path;
  if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge);
  if (this.expires) header += `; expires=` + this.expires.toUTCString();
  if (this.domain) header += `; domain=` + this.domain;
  if (this.httpOnly) header += `; httpOnly`;
  return header;
};

module.exports = Cookies;
