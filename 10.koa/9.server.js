
const Koa = require('koa')
const Router = require('koa-router')
const Cookies = require('./cookies')
const app = new Koa()
const router = new Router()

app.use(async (ctx, next) => {
  ctx.cookies2 = new Cookies(ctx.req, ctx.res)
  await next()
})

router.get('/writeCookie', async ctx => {
  // 向客户端种植cookie 普通的cookie
  ctx.cookies2.set('name', 'xz')
  // 设置过期时间
  ctx.cookies2.set('name_expire', 'name_expire_value', { expires: new Date(Date.now()+10*1000 ) })
  // 设置存活的时间 
  ctx.cookies2.set('name_maxAge', 'name_maxAge_value', { maxAge: 1000 * 10 })
  // 设置域名 
  ctx.cookies2.set('name_domain', 'name_domain_value', { domain: 'localhost' })
  // 设置路径
  ctx.cookies2.set('name_path', 'name_path_value', { path: '/writeCookie' })
  // 设置httpOnly
  ctx.cookies2.set('name_httpOnly', 'name_httpOnly_value', { httpOnly: true })
  // 原生的方法
  // ctx.res.setHeader('Set-Cookie', ['name=xz', 'age=18'])
  ctx.body = 'already write cookie'
})

router.get('/readCookie', async ctx => {
  const name = ctx.cookies2.get('name')
  const name_expire = ctx.cookies2.get('name_expire')
  const name_maxAge = ctx.cookies2.get('name_maxAge')
  const name_domain = ctx.cookies2.get('name_domain')
  const name_path = ctx.cookies2.get('name_path')
  const name_httpOnly = ctx.cookies2.get('name_httpOnly')
  let values = [name, name_expire, name_maxAge, name_domain, name_path, name_httpOnly]
  ctx.body = values.join(',')
})

app.use(router.routes())

app.listen(3000, () => console.log('server is running at http://localhost:3000'))
