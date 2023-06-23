
function wrap(iteratorFn) {
  const _context = {
    next: 0,
    done: false,
    sent: undefined,
    stop: function () {
      this.done = true
    }
  }
  return {
    next(value) {
      _context.sent = value
      let v = iteratorFn(_context)
      return { value: v, done: _context.done }
    }
  }
}


function gen() {
  var a, b, c;
  return wrap(function gen$(_context) {
    switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return 1;
      case 2:
        a = _context.sent;
        console.log(a);
        _context.next = 6;
        return 2;
      case 6:
        b = _context.sent;
        console.log(b);
        _context.next = 10;
        return 3;
      case 10:
        c = _context.sent;
        console.log(c);
      case 12:
      case "end":
        return _context.stop();
    }
  })
}


let it = gen()
console.log(it.next())
console.log(it.next('abc'))
console.log(it.next('bcd'))
console.log(it.next('bcd'))
