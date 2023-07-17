
const Koa = require('./koa')

const app = new Koa()

app.use(ctx => {
  
  // 请求方法 
  console.log(ctx.method)

  // 请求的url /a/b?c=1&d=2
  console.log(ctx.url)

  // 请求的路径 /a/b
  console.log(ctx.path)

  // 查询字符串 {c: 1, d: 2}
  console.log(ctx.query)

  // 请求头 { host: 'localhost:3000', connection: 'keep-alive', ...'}
  console.log(ctx.header)

  // 响应状态码
  ctx.status = 200

  // 响应的状态码的原因短语
  ctx.message = 'ok'
  
  // 响应头
  ctx.set('Content-Type', 'text/html;charset=utf-8')

  // 相应体
  ctx.body = 'hello world'
})

app.listen(3000, () => console.log('server is running at http://localhost:3000'))
