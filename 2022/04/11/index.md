# 剩余参数

> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters

剩余参数语法允许我们将一个不定数量的参数表示为一个数组。如果函数的最后一个命名参数以...为前缀，则它将成为一个由剩余参数组成的真数组，其中从 0（包括）到 theArgs.length（排除）的元素由传递给函数的实际参数提供。

和 arguments 对比

- 剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参。
- arguments 对象不是一个真正的数组，而剩余参数是真正的 Array 实例，也就是说你能够在它上面直接使用所有的数组方法，比如 sort，map，forEach 或 pop。
- arguments 对象还有一些附加的属性 （如 callee 属性）。
