
function compose(middleware) {
  return function (context) {
    let index = -1
    function dispatch(i) {
      // 防止多次调用next
      if (i < index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (!fn) {
        return Promise.resolve()
      }
      try {
        return Promise.resolve(fn(context, () => dispatch(i+1)))
      } catch (err) {
        return Promsie.reject(err)
      }
    }
    return dispatch(0)
  }
}

module.exports = compose
