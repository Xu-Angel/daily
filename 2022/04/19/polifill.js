;['a1', 'b', 'a2'].findLast((x) => x.startsWith('a')) // 'a2'
;[('a1', 'b', 'a2')].findLastIndex((x) => x.startsWith('a')) // 2
function findLast(arr, callback, thisArg) {
  for (let index = arr.length - 1; index >= 0; index--) {
    const value = arr[index]
    if (callback.call(thisArg, value, index, arr)) {
      return value
    }
  }
  return undefined
}

function findLastIndex(arr, callback, thisArg) {
  for (let index = arr.length - 1; index >= 0; index--) {
    const value = arr[index]
    if (callback.call(thisArg, value, index, arr)) {
      return index
    }
  }
  return -1
}
