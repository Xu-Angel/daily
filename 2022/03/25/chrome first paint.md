## [](#%E5%89%8D%E8%A8%80)前言

> First paint 直译过来的意思就是浏览器第一次渲染(paint)，在 First paint 之前是白屏，在这个时间点之后用户就能看到（部分）页面内容。

所以研究这个 First Paint 的触发时机对于优化浏览器页面的首屏渲染时间有很重要的作用。

在正题开始之前，先说下浏览器的页面的加载流程（大体过程是这样，并不精确，只是为了帮助理解后面内容）：

1.  浏览器输入 url，浏览器发送请求到服务器，服务器将请求的 HTML 返回给浏览器。
2.  浏览器下载完成 HTML(Finish Loading HTML)之后，便开始从上到下解析。
3.  解析的过程中碰到 css 和 js 外链（其实 HTML 的下载也是这个流程）都会执行以下过程：

    1.  **`Send Request`:表示给这个外链对应的服务器发送请求**
    2.  **`Receive Response`: 表示接收响应，这里是表示告诉浏览器可以开始从网络接收数据了**
    3.  **`Receive Data`:表示开始接收数据**
    4.  **`Finish Loading`: 表示已经完成下载数据。**
    5.  **`Parse Stylesheet/Evaluate`（默认情况下 js 下载完成之后执行`Evaluate`，css 下载完成后会进行`Parse Stylesheet`）**

4.  所有的 css 下载完成后`Parse Stylesheet`然后开始构建 CSSOM
5.  DOM（文档对象模型）和 CSSOM（CSS 对象模型）会合并生成一个渲染树(`Render Tree`)
6.  根据渲染树的内容计算处各个节点在网页中的大小和位置（`Layout`，可以理解为“刻章”）
7.  根据 Layout 绘制内容在浏览器上（`Paint`，可以理解为“盖章”）。

![](http://eux-blog-static.bj.bcebos.com/fp%2FfirstPaint-1.jpg)

## [](#%E6%AD%A3%E9%A2%98%E5%BC%80%E5%A7%8B)正题开始

在最新版的 Chrome 的`perfomance`中是能直接看到 First Paint 这个时间点的，为了方便大家测试，我就直接拿谷歌这个示例页面来做演示:

[测试页面](https://googlesamples.github.io/web-fundamentals/fundamentals/performance/critical-rendering-path/measure_crp_timing.html)

用 chrome 打开上面链接，最好是隐身模式，防止插件乱入影响判断，按 F12 或者右键检查元素打开控制台先切换到`Network`选项,勾选禁用缓存(缓存也会影响到判断)：

![1](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F1.png)

切换到`Perfomance`，勾选`Screenshots`并点击红框进行页面分析（会自动停止的，不用点 stop）：

![](http://eux-blog-static.bj.bcebos.com/fp%2FfirstPaint-2.jpg)

分析完后可以看到如下结果：

![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2.png)

上图中的绿色的线就是当前页面第一次出现内容的时间点，可以将鼠标放到`Main`上面的`Network`中绿色的线附近可以看到在他之前页面空白，在他之后就有内容。 除了绿色的线还有蓝色以及红色的线，这里也解释一下：

![](http://eux-blog-static.bj.bcebos.com/fp%2FfirstPaint-4.jpg)

简单讲一下`DOMContentLoaded`、`load`的区别：

1.  `DOMContentLoaded`是 HTML 文档（包括 CSS、JS）被加载以及解析完成之后触发（即 `HTML->DOM`的过程完成 ）
2.  `load`则是在页面的其他资源如图片、字体、音频、视频加载完成之后触发
3.  `load`事件一般在`DOMContentLoaded`之后才触发（也有可能在它之前哦）

这个时候发现绿色虚线之前有一个浅绿色方块，相应的解释如下：

![](http://eux-blog-static.bj.bcebos.com/fp%2FfirstPaint-5.jpg)

![](http://eux-blog-static.bj.bcebos.com/fp%2FfirstPaint-6.jpg)

由图可以得出“浅绿色”代表的是**根据 CSSOM 计算样式并进行布局绘制**的过程，这段时间内浏览器做了一下事情：

1.  `Recalculate Style`:重新计算样式，确定 DOM 元素的样式规则（定规则）
2.  `Layout`:根据计算结果进行布局，确定元素的大小和位置（刻章）
3.  `Update Layer Tree`: 更新渲染层树
4.  `Paint`: 绘制，根据前面的 Layer Tree 绘制页面（位置、大小、颜色、边框、阴影等）（盖章）
5.  `Composite Layers`： 形成层，浏览器按照合理的顺序合并成一个图层然后输出到屏幕（给别人看）

![](http://eux-blog-static.bj.bcebos.com/fp%2FfirstPaint-8.jpg)

那什么时候开始`First paint`呢?在浅绿色方块最前面的虚线往前看，发现在灰色虚线之前都会有一个步骤：就是`Parse Stylesheet`（调研了很多页面都是如此）

![](http://eux-blog-static.bj.bcebos.com/fp%2FfirstPaint-9.jpg)

所以，First Paint 的加载流程应该是这样：

1.  **所有的 CSS 加载完成**
2.  **`Parse Stylesheet`：构建出 CSSOM**
3.  **`Recalculate Style`：重新计算样式，确定 DOM 元素的样式规则（定规则）**
4.  **`Layout`：根据计算结果进行布局，确定元素的大小和位置（刻章）**
5.  **`Update Layer Tree`：更新渲染层树**
6.  **`Paint`：绘制，根据前面的 Layer Tree 绘制页面（位置、大小、颜色、边框、阴影等）（盖章）**
7.  **`Composite Layers`：形成层，浏览器按照合理的顺序合并成一个图层然后输出到屏幕（给别人看）**

但是现在还只是确定了`First Paint`的加载流程，也确定了他是在所有 CSS 执行完`Parse Stylesheet`之后才会触发，但是这还是不够准确啊，所以我找了一些 CSS 和 JS 的外链来测试，模板如下：

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.css" rel="stylesheet">
        <link href="https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.css" rel="stylesheet">
        <script src="https://cdn.bootcss.com/vue/2.5.13/vue.js"></script>
        <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.js"></script>
        <script src="https://cdn.bootcss.com/react/16.4.0-alpha.0911da3/cjs/react.development.js"></script>
        <script src="https://cdn.bootcss.com/angular.js/2.0.0-beta.17/angular2.js"></script>
    </head>
    <body>
        <div id='root1'>
            1
        </div>
        <div id='root2'>
            2
        </div>
        <div id='root3'>
            3
        </div>
    </body>
    </html>

我们通过改变上面模板里的外链顺序来探究：

### [](#%E7%AC%AC%E4%B8%80%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第一种情况：

![](http://eux-blog-static.bj.bcebos.com/fp%2F1%2FSnipaste_2018-04-23_19-29-12.png) ![](http://eux-blog-static.bj.bcebos.com/fp%2F1%2FSnipaste_2018-04-23_19-31-12.png)

发现 FP 发生在最后（实心的蓝色线是按`shift`出来的，不是`DOMContentLoaded`）,现在还发现不了什么。

### [](#%E7%AC%AC%E4%BA%8C%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第二种情况：

调换`head`中 CSS 和 JS 外链位置

![](http://eux-blog-static.bj.bcebos.com/fp%2F2%2FSnipaste_2018-04-23_19-31-59.png) ![](http://eux-blog-static.bj.bcebos.com/fp%2F2%2FSnipaste_2018-04-23_19-33-03.png)

仍然发现不了什么

### [](#%E7%AC%AC%E4%B8%89%E7%A7%8D%E6%83%85%E5%86%B5)第三种情况

把 CSS 放`head`，JS 放`</body>`前

![](http://eux-blog-static.bj.bcebos.com/fp%2F3%2FSnipaste_2018-04-23_19-31-59.png) ![](http://eux-blog-static.bj.bcebos.com/fp%2F3%2FSnipaste_2018-04-23_19-38-26.png)

发现`FP`竟然在蓝色和红色虚线前面出现，通过这点可以确定，`FP`还跟 JS 外链的位置有关，继续:

### [](#%E7%AC%AC%E5%9B%9B%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第四种情况：

JS 外链放`head`，CSS 放`</body>`前

![](http://eux-blog-static.bj.bcebos.com/fp%2F4%2FSnipaste_2018-04-23_19-39-23.png) ![](http://eux-blog-static.bj.bcebos.com/fp%2F4%2FSnipaste_2018-04-23_19-39-52.png)

发现又跟第一二种情况一样了，所以这种用法是不可取的。

### [](#%E7%AC%AC%E4%BA%94%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第五种情况：

CSS 和 JS 都放`</body>`前，且 CSS 紧贴在`div`后面，JS 在 CSS 后面：

![](http://eux-blog-static.bj.bcebos.com/fp%2F5%2FSnipaste_2018-04-23_19-40-18.png) ![](http://eux-blog-static.bj.bcebos.com/fp%2F5%2FSnipaste_2018-04-23_19-41-21.png)

可以发现`FP`居然更快触发，**但是我鼠标 hover 到绿色虚线后，仍然是白屏，只有等到 CSS 加载完成执行`Parse Stylesheet`之后才显示出内容**（说明这种用法也不可取），难道 body 中的 CSS 也会影响？

### [](#%E7%AC%AC%E5%85%AD%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第六种情况：

掉换一下上面 CSS 和 JS 的位置：

![](http://eux-blog-static.bj.bcebos.com/fp%2F6%2FSnipaste_2018-04-23_19-41-55.png) ![](http://eux-blog-static.bj.bcebos.com/fp%2F6%2FSnipaste_2018-04-23_19-42-29.png)

发现这次`FP`触发而且立马有内容，而等到 CSS 加载完成之后还会再重新渲染一次，嗯，看来 body 中的第一个 JS 脚本有猫腻，接下来的情况对他特殊照顾。

### [](#%E7%AC%AC%E4%B8%83%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第七种情况：

CSS 放`head`中，JS 放在`div`节点中间：

![](http://eux-blog-static.bj.bcebos.com/fp%2F7%2FSnipaste_2018-04-23_19-43-08.png) ![](http://eux-blog-static.bj.bcebos.com/fp%2F7%2FSnipaste_2018-04-23_19-43-49.png)

哈哈，居然只渲染了 12 俩字，说明浏览器会渲染 body 中脚本之前的内容，那会是哪个脚本之前的内容呢？

### [](#%E7%AC%AC%E5%85%AB%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第八种情况：

在 div 之间都插入脚本

![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-07-03.jpg) ![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-06-52.jpg)

看来浏览器会提前渲染`body`中第一个脚本前的内容（`我们就把body中的第一个外链脚本叫做【第一脚本】吧`），并且**第一脚本**还会在 FP 之后才执行。所以结合之前得出的结论，在 CSSOM 准备就绪之后，浏览器会提前渲染第一脚本前的内容，我们可以用第九种情况来验证：

### [](#%E7%AC%AC%E4%B9%9D%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第九种情况：

这种情况和上种没什么区别，只是增加了一个 CSS，这个 CSS 中还会发出一个请求去加载其他 CSS（通过`@import url()`的方式），所以 CSS 的加载时间很长。

![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-19-44.jpg) ![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-19-35.jpg)

通过结果可以看出，123 在 CSS 下载完成之后才渲染，而不是单独渲染一个 1，所以`FP`必须得等到`CSSOM`准备就绪之后才会触发，否则即使有第一脚本在也没用。 所以到这里，我们总算可以下结论了：

> **FP 发生在 body 中第一个 script 脚本之前的 CSS 解析和 JS 执行完成之后。换句话说就是第一脚本之前的`DOM`和`CSSOM`准备就绪之后，便会着手渲染第一脚本前的内容。**

但是...你以为到这里就结束了？其实没有。

### [](#%E7%AC%AC%E5%8D%81%E7%A7%8D%E6%83%85%E5%86%B5%EF%BC%9A)第十种情况：

这种情况中，`head`中既有 JS 也有 CSS，`body`中也有第一脚本存在：

![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-34-55.jpg) ![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-35-11.jpg)

注意上图中的`vue.js`是在`head`中的，而后面的 JS 文件都在`body`中，而且，`vue.js`加载完成之后，`body`中的 JS 还没下载完成，这个时候我们调换一下`vue.js`和`angular2.js`的位置：

![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-37-53.jpg) ![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-15-37-46.jpg)

看，这个时候又没有提前渲染了，123 等到所有 JS 文件都执行完之后才渲染，这种情况除了验证了第九点的结论，还能补充我们的结论：

> **如果第一脚本前的 JS 和 CSS 加载完了，`body`中的脚本还未下载完成，那么浏览器就会利用构建好的局部`CSSOM`和`DOM`提前渲染第一脚本前的内容（触发`FP`）；如果第一脚本前的 JS 和 CSS 都还没下载完成，`body`中的脚本就已经下载完了，那么浏览器就会在所有 JS 脚本都执行完之后才触发 FP。**

到这里本次探究就结束了，其实还有很多种情况，感兴趣的可以自己去试试。

## [](#%E5%BB%BA%E8%AE%AE%EF%BC%9A)建议：

- CSS 放在 head 中，JS 放在`</body>`前（如果在 head 必须放 JS，也尽量减少他的大小，把大 JS 文件放`</body>`前）。
- 减小 head 中 CSS 和 JS 大小（`gzip`[了解一下？](https://segmentfault.com/a/1190000012800222))，
- 优化 head 中的 JS 和 CSS 外链的网络情况，减少`Stalled`、`TTFB`和`Content Download`的时间。
- 在第一脚本前使用骨架图，可以减少用户的白屏感知时间（对于使用 JS 插入模板来渲染的框架，建议将骨架图的路由生成逻辑单独提出来）

## [](#%E7%A7%91%E6%99%AE%E4%B8%80%E4%B8%8B)科普一下

- `Chrome`会渲染局部`CSSOM`和`DOM`
- `First Paint`和`DOMContentLoaded`、`load`事件的触发没有绝对的关系，`FP`可能在他们之前，也可能在他们之后，这取决于影响他们触发的因素的各自时间（`FP`：`第一脚本`前`CSSOM`和`DOM`的构建速度；`DOMContentLoaded`：`HTML`文档自身以及`HTML`文档中所有`JS`、`CSS`的加载速度；`load`：图片、音频、视频、字体的加载速度）。
- `DOMContentLoaded`和`load`事件也没有强制的先后顺序，`DOMContentLoaded`一般在`load`事件之前触发，但也可能在`load`事件之后触发。
- `第一脚本`前的 CSS 如果还会去加载字体文件，那么即使`CSSOM`和`DOM`构建完成触发`FP`，页面内容也会是空白，只有等到字体文件下载完成才会出现内容（这也是我们在打开一个加载了谷歌字体的网站会白屏很长时间的原因）。
- 默认情况下，`CSS`外链之间是谁先加载完成谁先解析，但是`JS`外链之间即使先加载完成，也得按顺序执行。
- `link`外链后面紧跟`script`外链，须先等`link parse`完成之后，`script`才会执行，即使`script`先下载完成。`script`后面紧跟`link`，也是一样，会等`script`执行完之后，`link`才会`parse`。
- 如果`script`之后紧跟几个`link`且`script`比这几个`link`的下载时间都长，那`script`执行完成之后`link`是按顺序执行。
- `RRDL`：

  - R：send **R**equest，发送资源请求
  - R：receive **R**esponse，接收到服务端响应
  - D：receive **D**ata，开始接受服务端数据(一个资源可能执行多次)
  - L：finish **L**oading，完成资源下载

- 浏览器在`RRDL`的时候，在`D（Receive data）`这个步骤可能执行多次。
- `TTFB`:`Time To First Byte`，第一个字节返回的时间，这个是对应`send Request`到`receive Response`这段时间。
- 浏览器会给 HTML 中的资源文件进行等级分类（`Hightest/High/Meduim/Low/Lowest`）,一般`HTML`文档自身、`head`中的 CSS 都是`Hightest`，`head`中 JS 一般是`High`，而图片一般是`Low`，而设置了`async/defer`的脚本一般是`Low`，`gif`图片一般是`Lowest`。
- 下图中的资源文件浅色和深色和第二个图画红框的位置是对应的（不信自己计算一下对应的时间）

![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-16-04-40.jpg) ![](http://eux-blog-static.bj.bcebos.com/fp%2Fnew%2F2018-04-13-16-05-44.jpg)

参考链接：

1.  [分析关键渲染路径性能](https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/analyzing-crp?hl=zh-cn)
2.  [CSS/JS 对 DOM 渲染的影响](http://harttle.land/2016/11/26/static-dom-render-blocking.html)
3.  [CSS Animation 性能优化](https://github.com/amfe/article/issues/47)
