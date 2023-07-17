
const Koa = require('./koa')
const app = new Koa()

const middleware1 = (ctx, next) => {
  console.log(1)
  next()
  console.log(2)
}


const middleware2 = (ctx, next) => {
  console.log(3)
  next()
  console.log(4)
}

const middleware3 = (ctx, next) => {
  console.log(5)
}


app.use(middleware1)
app.use(middleware2)
app.use(middleware3)
app.listen(3000, () => console.log('server is running at http://localhost:3000'))

