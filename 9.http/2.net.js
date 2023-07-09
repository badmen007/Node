
const net = require('node:net');
const server = net.createServer((socket) => {
  // 'connection' listener.

  // http是纯文本的(纯文本描述是有缺陷的)
  const arr = []
  socket.on('data', (chunk) => {
    arr.push(chunk)
  })
  socket.on('end', () => {
    console.log(Buffer.concat(arr).toString());
  })
  socket.write(`HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 2

ok`);
  socket.end('ok');
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
