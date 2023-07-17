
function compose(middleware) {
  return function (context) {
    function dispatch(i) {
      let fn = middleware[i]
      return Promise.resolve(fn(context, () => dispatch(i+1)))
    }
    return dispatch(0)
  }
}

module.exports = compose
