[Javascript 有个 Unicode 的天坑](http://www.alloyteam.com/2016/12/javascript-has-a-unicode-sinkhole/ 'Javascript 有个 Unicode 的天坑')

---

最近笔者在项目中遇到了 emoji 表情的处理，期间发现 js 处理多字节字符时会有较多坑，记录一下与各位分享。  
本文涉及知识点：

> Unicode (BMP/SP)  
> UTF-8 UTF-16 UTF-32 UCS-2  
> javascript 字符处理

## Unicode

Unicode 是目前绝大多数程序使用的字符编码，定义也很简单，用一个码点 (code point) 映射一个字符。码点值的范围是从 U+0000 到 U+10FFFF，可以表示超过 110 万个符号。下面是一些符号与它们的码点

- `A` 的码点 U+0041
- `a` 的码点 U+0061
- `©`的码点 U+00A9
- `☃`的码点 U+2603
- `💩`的码点 U+1F4A9

对于每个码点，Unicode 还会配上一小段文字说明，可以在 codepoints.net 查到，比如 [💩 的码点说明](https://codepoints.net/U+1F4A9)

Unicode 最前面的 65536 个字符位，称为基本平面（BMP-—Basic Multilingual Plane），它的码点范围是从 U+0000 到 U+FFFF。最常见的字符都放在这个平面，这是 Unicode 最先定义和公布的一个平面。  
剩下的字符都放在补充平面（Supplementary Plane），码点范围从 U+010000 一直到 U+10FFFF，共 16 个。

## UTF 与 UCS

UTF（Unicode transformation format）Unicode 转换格式，是服务于 Unicode 的，用于将一个 Unicode 码点转换为特定的字节序列。常见的 UTF 有

> UTF-8 可变字节序列，用 1 到 4 个字节表示一个码点  
> UTF-16 可变字节序列，用 2 或 4 个字节表示一个码点  
> UTF-32 固定字节序列，用 4 个字节表示一个码点

[UTF-8](https://en.wikipedia.org/wiki/UTF-8) 对 ASCⅡ 编码是兼容的，都是一个字节，超过 U+07FF 的部分则用了复杂的转换方式来映射 Unicode，具体不再详述。

UTF-16 对于 BMP 的码点，采用 2 个字节进行编码，而 BMP 之外的码点，用 4 个字节组成代理对（surrogate pair）来表示。其中前两个字节范围是 U+D800 到 U+DBFF，后两个字节范围是 U+DC00 到 U+DFFF，通过以下公式完成映射（H：高字节 L：低字节 c：码点）  
H = Math.floor((c-0x10000) / 0x400)+0xD800  
L = (c - 0x10000) % 0x400 + 0xDC00

比如 💩 用 UTF-16 表示就是"\\uD83D\\uDCA9"

UCS（Universal Character Set）通用字符集，是一个 ISO 标准，目前与 Unicode 可以说是等价的。  
相对于 UTF，UCS 也有自己的转换方法（编码）。如

> UCS-2 用 2 个字节表示 BMP 的码点  
> UCS-4 用 4 个字节表示码点

UCS-2 是一个过时的编码方式，因为它只能编码基本平面（BMP) 的码点，在 BMP 的编码上，与 UTF-16 是一致的，所以可以认为是 UTF-16 的一个子集。  
UCS-4 则与 UTF-32 等价，都是用 4 个字节来编码 Unicode。

## javascript 字符处理

辣莫，js 到底是用的啥编码呢？答案是 UCS-2。咦，刚刚不是说 UCS-2 过时了吗？首先看下年表

> 1990 UCS-2 诞生  
> 1995.5 JavaScript 诞生  
> 1996.7 UTF-16 诞生

也就是说，Brendan Eich 在写 JS 的时候，UTF-16 还没问世，所以只能用 UCS-2 的方式来处理字符，也因此留下了隐患。

### 坑 1——length 属性

先看一个简单的例子：

> > "\\uD83D\\uDCA9" === "💩"  
> > true  
> > "💩".length  
> > 2

因为"💩"在 JS 的编码是"\\uD83D\\uDCA9"，而 JS 认为每 16 位 (2 字节）即表示一个字符，所以一坨大便是占 2 个字符的。我们经常用 length 来判断字符串长度，那产品不干了呀，说好可以输入 10 个字，为毛输了 5 个 emoji 就不给输入了？  
怎么破？可以用万能的正则匹配

```js
var regexAstralSymbols = /\[\\uD800-\\uDBFF\]\[\\uDC00-\\uDFFF\]/g // 匹配 UTF-16 的代理对

function countSymbols(string) {
  return (
    // …这时候取长度就妥妥的啦.

    string

      // 把代理对改为一个 BMP 的字符.

      .replace(regexAstralSymbols, '_').length
  )
}

countSymbols('💩') // 1
```

### 坑 2——反转字符串

js 里怎么反转（reverse）字符串？相信有些同学已经想到了一个极简的方案

```js
function reverse(str) {
  return str.split('').reverse().join('')
}
```

js 虽没有直接的反转字符串的 API，但是数组有啊，转数组反转之后再转回字符串，嘿嘿嘿，是不是很机智？这时候 Unicode 大爷又出来打脸了：你们呐，sometimes naive！  
拿刚才的函数反转带有 💩 的字符串试试

```js
reverse('这是一坨 💩')
;('�� 坨一是这')
```

� 的 Unicode 码点是+UFFFD，通常用来表示 Unicode 转换时无法识别的字符（也就是乱码）  
当 💩（\\uD83D\\uDCA9）通过上述方法反转时，变成\\uDCA9\\uD83D，不是一个合法的代理对（高低字节范围不同），同时，Unicode 规定代理对范围内的码点不能单独出现，所以 js 只能用 � 表示了。  
怎么破？

1.  ES6 的 Array.from 支持代理对的解析

```js
function reverse(string) {
  return Array.from(string).reverse().join('')
}
```

1.  使用 [Esrever](https://github.com/mathiasbynens/esrever)（reverse 反转之后就是 esrever...)

### 坑 3——码点与字符互转

String.fromCharCode 可以将一个码点转换为字符，比如

```js
String.fromCharCode(0x0041)
;('A')
```

但超过 BMP 平面的就跪了。

```js
> > String.fromCharCode(0x1F4A9) // U+1F4A9

'' // U+F4A9, not U+1F4A9
```

事实上这个 API 是支持俩参数的，分别是代理对的高低字节。所以需要通过公式计算出对应的高低字节

```js

> > String.fromCharCode(0xD83D, 0xDCA9)

'💩' // U+1F4A9

> > '💩'.charCodeAt(0)

0xD83D
```

一个字，蛋疼！  
怎么破？ ES6 大法好。

```js

> > String.fromCodePoint(0x1F4A9)

'💩' // U+1F4A9

> > '💩'.codePointAt(0)

0x1F4A9
```

### 坑 4——正则匹配

正则匹配符`.` 只能匹配单个 “字符”，但 js 将代理对当成两个单独的 “字符” 处理，所以匹配不到任何辅助平面字符。

```js
> > /foo.bar/.test('foo💩bar')

false
```

思考一下，什么正则表达式可以表示任何 Unicode 字符？ 显然`.` 是不够的，因为它不能匹配辅助平面字符或者换行符。那么用\\s\\S 呢？

```js

>>  /^\[\s\S\]$/.test('💩')

false

```

怀疑人生了~~正确的匹配任意 Unicode 字符的正则如下：

```js

> > /\[\0-\uD7FF\uE000-\uFFFF\]|\[\uD800-\uDBFF\]\[\uDC00-\uDFFF\]|\[\uD800-\uDBFF\](?!\[\uDC00-\uDFFF\])|(?:\[^\uD800-\uDBFF\]|^)\[\uDC00-\uDFFF\]/.test('💩') // wtf

true
```

怎么破？ ES6 给出一个简单的方法——增加一个 u 标志

```js

> > /foo.bar/u.test('foo💩bar')

true
```

注意：这里的`.` 还是不能匹配换行符。

## ES6 的 Unicode 支持

从上面的例子中可以看出，ES6 已经在很努力地填坑了。对于 Unicode 字符，ES6 支持新的表示方法  
`\u{1F4A9}` 加上花括号后，可以把码点直接填进去来表示，而不用去计算代理对。再补充 2 点：  
1\. 为了向后兼容，字符串的 length 属性还是用双字节判断的，所以要用 Array.from(str).length。  
2\. 遍历字符串的时候，可以用 `for(let s of str) {}`

参考资料：  
[Unicode 与 JavaScript 详解](http://www.ruanyifeng.com/blog/2014/12/unicode.html)  
[JavaScript has a Unicode problem](https://mathiasbynens.be/notes/javascript-unicode)
