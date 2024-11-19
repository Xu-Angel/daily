//juejin.cn/post/7360528073631318027
// 进制、游标思想
https: function formatUnit(data) {
  const unitkey = ['kb', 'mb', 'gb', 'tb', 'pb']
  let idx = 0

  while (data >= 1024 && idx < unitkey.length - 1) {
    data /= 1024
    idx++
  }
  const num = (data + '').indexOf('.') !== -1 ? data.toFixed(3) : data
  return `${num} ${unitkey[idx]}`
}

console.log(formatUnit(1024), formatUnit(2048), formatUnit(1024.5), formatUnit(1088.88), formatUnit(1000), formatUnit(1000.58), formatUnit(1042332400353453453454332.587897))

//way2

function convertFileSize(size, fromUnit, toUnit, decimalPoint = 2) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const fromIndex = units.indexOf(fromUnit)
  const toIndex = units.indexOf(toUnit)

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Invalid units')
  }

  // 计算初始单位与目标单位之间的转换系数
  const exponent = toIndex - fromIndex
  // 目标单位较小，进行乘法运算, 较大则进行除法，可以合并乘法和除法为单一公式
  const resultSize = size * Math.pow(1024, -exponent)

  // 返回格式化后的结果，如果需要保留0，则不使用parseFloat
  return parseFloat(resultSize.toFixed(decimalPoint)) + ' ' + toUnit
}

// 示例使用
console.log(convertFileSize(1, 'GB', 'MB')) // 输出: 1024 MB
console.log(convertFileSize(1, 'MB', 'KB')) // 输出: 1024 KB
console.log(convertFileSize(1, 'KB', 'B')) // 输出: 1024 B
console.log(convertFileSize(1, 'MB', 'GB', 4)) // 输出: 0.001 GB
console.log(convertFileSize(1, 'TB', 'GB', 4)) // 输出: 1024 GB
console.log(convertFileSize(1, 'TB', 'MB', 4)) // 输出: 1048576 MB
