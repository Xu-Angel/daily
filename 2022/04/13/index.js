// Lodash
var object = { a: 1, b: 'settings', c: { d: 'test' } }

var hasA = _.has(object, 'a')
var hasCWhichHasD = _.has(object, 'c.d')

console.log(hasA)
// output: true
console.log(hasCWhichHasD)
// output: true

// Native
const has = function (obj, key) {
  var keyParts = key.split('.')

  return !!obj && (keyParts.length > 1 ? has(obj[key.split('.')[0]], keyParts.slice(1).join('.')) : hasOwnProperty.call(obj, key))
}

var object = { a: 1, b: 'settings' }
var result = has(object, 'a')
// output: true
