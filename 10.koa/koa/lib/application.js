
const http = require('http')

class Application {
  constructor() {}

  use(fn) {
    this.fn = fn
    return this
  }
  listen(...args) {
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
  callback() {
    const handleRequest = (req, res) => {
      const ctx = {req, res}
      return this.fn(ctx)
    }
    return handleRequest
  }
}

module.exports = Application
