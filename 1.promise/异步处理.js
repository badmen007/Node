
const fs = require('fs')
const path = require('path')

// 什么是同步？什么是异步？
// 同步：一件事情做完了，才能做另外一件事情
// 异步：一件事情做一半，就可以去做另外一件事情
// 异步的好处：提高程序的执行效率
// 异步的坏处：代码的阅读性变差了
// 异步的本质：回调函数
// 异步的本质：Promise
// 异步的本质：Generator
// 异步的本质：async/await
// 异步的本质：事件监听
// 异步的本质：发布订阅
// 异步的本质：进程间通信
// 异步的本质：多线程
// 异步的本质：多进程
// 异步的本质：协程
// 异步的本质：线程池
// 异步的本质：IO多路复用
// 异步的本质：事件循环
// 异步的本质：PromiseA+规范
// 异步的本质：Promise.all;

const person = {}

function after(times, callback) {
  return function() {
    if (--times === 0) {
      callback()
    }
  }
}

let out = after(2, function() {
  console.log(person)
})

fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
  person.name = data
  out()
})

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
  person.age = data
  out()
})

