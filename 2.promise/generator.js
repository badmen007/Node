
// 生成器，在生成的过程中，可以暂停，可以恢复执行

let likeArr = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
  [Symbol.iterator]: function* () {
    let i = 0
    let len = this.length
    while (len != i) {
      yield this[i++]
    }
  }
 // [Symbol.iterator]() {
 //   let i = 0
 //   return {
 //     next: () => {
 //       return {
 //         value: this[i],
 //         done: i++ === this.length
 //       }
 //     }
 //   }
 // }
}

function* gen() {
  let a = yield 1 // js执行是先走右边的，遇到 yield 就停下来了
  console.log(a)
  let b = yield 2 // yield 的返回值是下一个 next 的参数
  console.log(b)
  let c = yield 3
  console.log(c)
}

let it = gen() // iterator 迭代器
console.log(it.next()) // 第一次调用传单没有任何意义
console.log(it.next(100))

// it.throw('出错了') // 抛出错误



const arr = [...likeArr]



const fs = require('fs/promises')
const path = require('path')
// const co = require('co')

function* readResult() {
  const filename = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8')
  let age = yield fs.readFile(path.resolve(__dirname, filename.replace('\n', '')), 'utf8')
  return age
}

function co(it) {
  return new Promise((resolve, reject) => {
    function next(data) {
      let { value, done } = it.next(data)
      if (!done) {
        Promise.resolve(value).then(data => {
          next(data)
        },reject)
      } else {
        resolve(value)
      }
    }
    next()
  })
}

co(readResult()).then(data => {
  console.log(data)
})

//let it1 = readResult()
//let { value, done } = it1.next()
//value.then(data => {
//  console.log(data)
//  let { value, done } = it1.next(data.replace('\n', ''))
//  value.then(data => {
//    console.log(data)
//  })
//})
