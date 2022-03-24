# 模块加载

[脚本的动态加载](http://eux.baidu.com/blog/fe/js-loader)

[seajs](https://github.com/seajs/seajs)

[seajs-module](https://github.com/seajs/seajs/blob/master/src/module.js)

current working directory = cwd

```js
ref https://github.com/seajs/seajs/blob/master/src/util-events.js
// Emit event, firing all bound callbacks. Callbacks receive the same
// arguments as `emit` does, apart from the event name
var emit = (seajs.emit = function (name, data) {
  var list = events[name]

  if (list) {
    // Copy callback lists to prevent modification
    list = list.slice()

    // Execute event callbacks, use index because it's the faster.
    for (var i = 0, len = list.length; i < len; i++) {
      list[i](data)
    }
  }

  return seajs
})
```

```js
function isType(type) {
  return function (obj) {
    return {}.toString.call(obj) == '[object ' + type + ']'
  }
}
```

## textarea

[实现高度内容自适应的 textarea](http://eux.baidu.com/blog/fe/%E9%AB%98%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94%E7%9A%84%20Textarea)
