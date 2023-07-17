
const Koa = require('./koa');
const app = new Koa()

const fs = require('fs')

const middleware1 = async (ctx, next) => {
  ctx.body = 'hello world'
  ctx.body = Buffer.from('hello world')
  ctx.body = fs.createReadStream('./package.json')
  // ctx.body = {a: 1}
}

app.use(middleware1)

app.listen(3000, () => console.log('server is running at http://localhost:3000'))
