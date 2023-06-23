
// 无论成功和失败都要执行的逻辑

Promise.prototype.finally = function (callback) {
  return this.then((val) => {
    return Promise.resolve(callback()).then(() => val)
  }, (r) => {
    return Promise.resolve(callback()).then(() => { throw r }) 
  })
}

Promise.resolve().finally(() => {
  console.log('finally')
}).then(value => {
  console.log('成功', value)
}).catch(reason => {
  console.log('失败', reason)
})
