
const Koa = require('koa')
const static = require('./koa-static')
const path = require('path')
const app = new Koa();

app.use(static(path.join(__dirname, 'static')))
app.use(async (ctx, next) => {
  //ctx.body = 'hello'
})

app.listen(3000, () => console.log('server is running at http://localhost:3000'))
