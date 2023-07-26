
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 4000 })

server.on('connection', socket => {
  socket.on('message', message => {
    console.log(message.toString())
    socket.send('world')
  })
})

console.log('ws://localhost:4000')

//ws和net模块有什么区别？
//net属于传输层协议，只负责数据传输，不管内容是什么
//http udp ws属于应用层协议，可以传输任何内容，但是需要对内容进行解析
