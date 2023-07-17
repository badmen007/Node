const http = require("http");

const context = require("./context");
const request = require("./request");
const response = require("./response");
const compose = require("./koa-compose");
const { Stream } = require("stream");

class Application {
  constructor() {
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middleware = []
  }

  use(fn) {
    this.middleware.push(fn)
    return this;
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
  callback() {
    const fn = compose(this.middleware)
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
  handleRequest(ctx, fnMiddleware) {
    const handleResponse = () => respond(ctx);
    const onerror = err => ctx.onerror(err);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
  createContext(req, res) {
    const ctx = Object.create(this.context);
    const request = (ctx.request = Object.create(this.request));
    const response = (ctx.response = Object.create(this.response));

    ctx.req = request.req = req;
    ctx.res = response.res = res;

    return ctx;
  }
}

function respond(ctx) {
  let { res, body } = ctx;
  if (Buffer.isBuffer(body)) return res.end(body);
  if (typeof body === 'string') return res.end(body);
  if (body instanceof Stream) return body.pipe(res)
  res.end(JSON.stringify(body))
}

module.exports = Application;
