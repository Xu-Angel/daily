class EventEmitter {
  constructor() {
    this.listener = {}
  }
  on(handler, fn) {
    if (!this.listener[handler]) {
      this.listener[handler] = []
    }
    this.listener[handler].push(fn)
  }
  emit(handler, playoad) {
    if (this.listener[handler]) {
      this.listener[handler].forEach((h) => h(handler, playoad))
    }
  }
}
const e = new EventEmitter()
e.on('say', (handler, playoad) => {
  console.log(handler, playoad)
})
e.emit('say', 'hello 17')
