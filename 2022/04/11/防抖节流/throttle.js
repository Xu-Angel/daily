function throttle(fn, wait, immediate) {
  let timer = null
  let callNow = immediate

  return function () {
    let context = this,
      args = arguments

    if (callNow) {
      fn.apply(context, args)
      callNow = false
    }

    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

function throttle(func, timeFrame) {
  var lastTime = 0
  return function (...args) {
    var now = new Date()
    if (now - lastTime >= timeFrame) {
      func(...args)
      lastTime = now
    }
  }
}

// Avoid running the same function twice within the specified timeframe.
jQuery(window).on('resize', throttle(calculateLayout, 150))
