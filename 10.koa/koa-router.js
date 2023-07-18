
const methods = ['get', 'post', 'options', 'put', 'patch', 'delete']

function Router() {
  this.stack = [] // stack里存放路由规则
}

for (const method of methods) {
  Router.prototype[method] = function (path, middleware) {
    // 将路由规则存入stack
    const routes = { path, method, middleware }
    this.stack.push(routes)
  }
}

Router.prototype.routes = function () {
  return async (ctx, next) => {
    const { path, method } = ctx;
    const matchedLayer = this.stack.find(layer => {
      return layer.path === path && layer.method === method.toLowerCase()
    }) 
    if (!matchedLayer) {
      return await next()
    }
    await matchedLayer.middleware(ctx, next)
  }
}

module.exports = Router;
