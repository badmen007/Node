
// 高阶函数 - 函数作为返回值 函数作为一个函数的参数


function core(a, b, c) {
  console.log('core', a, b, c)
}

//切片编程
Function.prototype.before = function(fn) {
  return (...args) => {
    // todo...
    fn()
    this(...args)
  }
}

const newCore = core.before(() => {
  console.log('before core')
})

newCore(1, 2, 3)
