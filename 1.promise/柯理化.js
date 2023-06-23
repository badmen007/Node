// 函数科里化

// 判断类型 Object.prototype.toString.call() constructor instanceof typeof(typeof null === 'object')
//function isType(val, typing) {
 //return Object.prototype.toString().call(val).slice(8, -1) === typing
//}

// 判断某个变量是不是一个字符串
//isType('hello', 'String')
//isType('abc', 'String')

function sum(a, b, c) {
  return a + b + c
}

function curry(func) {
  const curried = (...args) => {
    if (args.length < func.length) {
      return (...others) => curried(...args, ...others)
    } else {
      return func(...args)
    }
  }
  return curried
}

let curriedSum = curry(sum)
console.log(curriedSum(1)(2)(3))


function isType(typing, val) {
  return Object.prototype.toString.call(val).slice(8, -1) === typing
}

let isString = curry(isType)('String')
console.log(isString('hello'))
