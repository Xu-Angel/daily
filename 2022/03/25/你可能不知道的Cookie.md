## []大家都了解的 cookie

很多前端面试题都会考察 cookie 大家一般都能答上的几个点：

- 不能跨域
- 存储空间有限，4KB
- 通过`document.cookie`API 进行 get 和 set

## cookie 与其他本地存储的区别

2.  大小不同，cookie 是最小的。
3.  数量受限,每个域名下的 cookie 数量最多为 20 个（但很多浏览器厂商在具体实现时支持大于 20 个)
4.  某个域下的 cookie 会自动随该域下的请求带在 request header 的 cookie 字段里。
5.  可以设定过期时间。
6.  可以设定 path，而其他存储往往只有域的限制。
7.  存在 httpOnly 属性，只能由服务端设置，JS 无法设置和获取。
8.  可以设置 secure 属性,当设置为 true 时，只能在 HTTPS 连接中被浏览器传递到服务器端进行会话验证，如果是 HTTP,连接则不会传递该信息，所以不会被窃取到 Cookie 的具体内容。
9.  可以通过浏览器的清除历史功能清除
10. 用户可以禁用 cookie

## cookie 的应用场景

- cookie 最大的特点是自动随该域下的请求带在 request header 的 cookie 字段里，而无需额外的 JS 操作，在做通用的登录认证系统的时候有着天然的优势。
- cookie 有 httpOnly 属性，可以防止 XSS 攻击，安全性比其他存储更有保障。
- 服务端在控制页面跳转的时候可以不通过 JS 方便的进行少量值的传递，控制页面的展示。
- 静态资源 CDN 之所以放在非主域名下，很大一部分原因在于可以无需携带相关 cookie，减少流量损耗。

## cookie 的属性

<table width="680" style="height: 361px;"><thead><tr><th><h6 style="text-align: center;">属性</h6></th><th><h6 style="text-align: center;">说明</h6></th><th><h6 style="text-align: center;">示例</h6></th></tr></thead><tbody><tr><td style="text-align: center;">name</td><td style="text-align: center;">cookie的key值</td><td>‘id=sdbsdabsdsa;’</td></tr><tr><td style="text-align: center;">expires</td><td style="text-align: center;">到期时间</td><td>‘expires=21 Oct 2015 07:28:00 GMT</td></tr><tr><td style="text-align: center;">domain</td><td style="text-align: center;">cookie生效的域</td><td>‘domain=im.baidu.com;’</td></tr><tr><td style="text-align: center;">path</td><td style="text-align: center;">cookie生效的路径</td><td>‘path=/todo’</td></tr><tr><td style="text-align: center;">secure</td><td style="text-align: center;">是否只在https下生效</td><td>‘secure’</td></tr><tr><td style="text-align: center;">httponly</td><td style="text-align: center;">是否允许JS获取</td><td>‘httponly’</td></tr><tr><td style="text-align: center;">max-age</td><td style="text-align: center;">以秒为单位设置过期时间,IE6\7\8不生效</td><td>‘ 31536000’</td></tr></tbody></table>

## cookie 的增删改查

服务端和 JS 端都可以对 cookie 进行增删改查, cookie 中不得包含任何逗号、分号或空格，（可以用 encodeURIComponent()来保证）.

### 服务端设置 cookie

服务端通过在请求的`response header`中携带`Set-Cookie`字段对 cookie 进行设置, 格式与用 JS 设置 cookie 是相同的,都采用`;`进行属性分隔. 例如:

    Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly

### JS 设置 cookie

JS 设置 domain: 默认值为当前域, n 级域名可以设置 小于 n 级域名的 domain. 例如: 在`www.baidu.com`域下 可以将 domain 设置为 `baidu.com`, 但是不能设置为`a.www.baidu.com`, 也不能设置为`tieba.baidu.com`,更不能设置为`sina.com`.

JS 设置 path: 默认为`/`, path 的设置不受限制, 比如我可以在`im.baidu.com/todo`下将 cookie 的 path 设置为`/search`

JS 对于 secure 属性,无论 get 还是 set ,必须在 https 下,

JS 不能设置 httponly 属性,

删除 cookie: 指定 key, domain, path 必须与想要删掉的 cookie 一模一样, 然后将`expires`的值设为一个过期值,即可删除.

修改 cookie: 指定 key, domain, path 必须与想要修改的 cookie 一模一样, 否则将创建一个不同的 cookie,然后设置想要更新的 value 或 expires 值.

        var cookie = {
            getCookie: function (key) {
                return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
            },

            setCookie: function (opts) {
                if (Object.prototype.toString.call(opts) !== "[object Object]") {
                    return;
                }
                if (!opts.key) {
                    return;
                }
                if (!opts.value) {
                    opts.value = '';
                }
                var tmp = opts.key + '=' + encodeURIComponent(opts.value) + ';';
                if (opts.expires) {
                    tmp += 'expires=' + new Date(new Date().getTime() + opts.expires * 1000).toGMTString() + ';';
                }
                if (opts.path) {
                    tmp += ('path=' + opts.path + ';');
                }

                if (opts.domain) {
                    tmp += ('domain=' + opts.domain + ';');
                }

                if (opts.secure) {
                    tmp += 'secure'
                }
                document.cookie = tmp;
            },

            delCookie: function (opts) {
                cookie.setCookie({
                    key: opts.key,
                    value: '',
                    expired: -1000000000,
                    path: opts.path,
                    domain: opts.domain,
                })
            },
        }

## 其他

### 判断是否启用 cookie

使用`navigator.cookieEnabled`可以判断用户是否启用 cookie

    if (!navigator.cookieEnabled) {
      // 让用户知道,开启网页中的cookies是很有必要的.
    }

### 是否可以直接修改 header 中的 cookie 字段?

Ajax 请求可以设置 header,但是某些 header 字段无法设置,比如`refer`, `cookie`等.

### cookie 自动删除

cookie 会被浏览器自动删除，通常存在以下几种原因：

- 会话 cooke (Session cookie) 在会话结束时（浏览器关闭）会被删除
- 持久化 cookie（Persistent cookie）在到达失效日期时会被删除
- 如果浏览器中的 cookie 数量达到限制，那么 cookie 会被删除以为新建的 cookie 创建空间。

### CORS 请求携带 cookie

CORS 请求默认不发送 Cookie 和 HTTP 认证信息。如果要把 Cookie 发到服务器，一方面要服务器同意，指定 Access-Control-Allow-Credentials 字段。

    Access-Control-Allow-Credentials: true

另一方面，开发者必须在 AJAX 请求中打开 withCredentials 属性。

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

否则，即使服务器同意发送 Cookie，浏览器也不会发送。或者，服务器要求设置 Cookie，浏览器也不会处理。

**需要注意的是，如果要发送 Cookie，Access-Control-Allow-Origin 就不能设为星号，必须指定明确的、与请求网页一致的域名**。同时，Cookie 依然遵循同源政策，只有用服务器域名设置的 Cookie 才会上传，其他域名的 Cookie 并不会上传，且（跨源）原网页代码中的 document.cookie 也无法读取服务器域名下的 Cookie。

## 参考资料

- [MDN Set-Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)
- [MDN Document/cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie)
- [聊一聊 cookie](https://segmentfault.com/a/1190000004556040)
- [深入浅出 cookie](https://www.cloudxns.net/Support/detail/id/1887.html)
- [HTTP cookies 详解](http://bubkoo.com/2014/04/21/http-cookies-explained/)
- [MDN cookieEnabled](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/cookieEnabled)
