

const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

// 可以解析json格式的请求体
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  // 允许3000端口访问
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  // 客户端能够拿到自定义的请求头
  res.header('Access-Control-Expose-Headers', 'Custom-Header')

  res.header('Access-Control-Allow-Headers', 'Client_Custom_Header, Content-Type, Authorization')
  // 自定义的请求头
  res.header('Custom-Header', 'hello')

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  res.header('Access-Control-Max-Age', '1000') // 预检请求的有效期 

  res.header('Access-Control-Allow-Credentials', 'true') // 允许跨域的时候携带cookie

  if (req.method === 'OPTIONS') {
    res.sendsStatus(200) // 预检请求不需要请求体
  }
  next()
})

app.use(express.static('public'))

const users = [{ id: 1, name: 'zhuang'}]
app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', (req, res) => {
  const user = req.body
  user.id = users[users.length - 1].id + 1
  users.push(user)
  res.json(users)
})

app.get('/count', (req, res) => {
  let count = req.cookies.count || 0
  count++
  res.cookie('count', count)
  res.json({ count })
})

app.listen(4000, () => console.log('http://localhost:4000'))
