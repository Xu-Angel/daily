#### 为原生 API 添加功能，即继承原生 API 并进行扩展

这篇文章来源于一个需求：**如何统计 ajax 请求从发起到成功返回所耗费的时间**？ 如果在业务中每个请求的发起和结束时进行打点，计算差值的话，那么工作量将非常巨大，如果要求每个项目封装一个通用方法的话，对于我们这种有好几百个项目的部门来说也同样是不可能的，那么就需要对 XMLHttpRequest 本身进行功能扩展.

#### **实现原理解析**

不改变 this 指向的情况，比如下面这个例子，this 指向始终是 window,那么我们无需对 this 的指向做任何更改。

        //原函数
        function a (v) {
            console.log(v)
        }

        //创建一个变量b, 指向原函数，以保留原函数的功能
        let b = a;

        //覆写原函数
        a = function (v) {
            console.log(v + 1); //执行新增功能
            b(v);      //执行原函数功能
        }

        a(1); // 2 1

需要改变 this 指向

        //原函数
        let obj = {
            a: function(v) {
                //这里this指向obj
                this.v = v
                console.log(this.v);
            }
        }

        //创建一个变量b, 指针指向原函数, 但是对于b来说， this === window
        let b = obj.a;

        //覆写原函数
        obj.a = function (v) {
            let args = [].slice.call(arguments);
            b.apply(this, args);      //原函数功能,需要将this重新指向obj
            console.log(this.v + 1); //新增功能
        }

        obj.a(1); // 1 2

实例 1：在 alert 的时候 console.log 打印 alert 的值

    (function () {
        let a = alert;

        alert = function (v) {
            console.log(v);
            a(v);
        }

        alert(1); // 控制台输出1，弹窗1
    })();

实例 2：在 console.log 的同时进行 alert

    (function () {
        let a = console.log;

        console.log = function () {
            //将arguments转成数组，如果需要对参数做push、pop等操作的话需要转换，否则不需要
            var args = [].slice.call(arguments);
            a.apply(this, args); //这里就不能直接使用a(...args)
            alert(args[0])
        }

        console.log(1); // 控制台输出1，弹窗1
    })();

#### 方法总结

step1：

先用一个变量，如`a`，指向原方法。

    let a = console.log;

step2：

新写一个函数覆盖原方法，增加你想要的扩展功能，并在其中调用 step1 中的`a`，并通过`apply`方法保证`a`执行的时候有正确的 this 指向和参数传递，保证原方法的正常使用。

    console.log = function () {
        var args = [].slice.call(arguments);
        args.push(1); //如果对入参有修改，需要将arguments转换为Array.
        a.apply(this, args); //这里就不能直接使用a(...args)
        alert(args[0]);
    }

虽然在一些情况下 this 指向不发生改变，无需使用 apply，但是使用 apply 也可以得到正确的结果，从参数扩展、方便记忆的角度话可以统一成同一种模式。

**通过 apply 与 call 实现继承的方式**

- apply() 方法在**指定 this 值和参数**（参数以数组或类数组对象的形式存在）的情况下**调用**某个函数.
- call() 方法在**指定 this 值和若干个指定的参数值**的前提下**调用**某个函数.
- **注意**： apply() 方法接受的是**一个包含多个参数的数组**，call() 方法接受的是**若干个参数的列表**.

  fun.apply(thisArg, [argsArray]) fun.call(thisArg, ...argsArray)

#### 参考资料

- [MDN Function.prototype.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- [MDN Function.prototype.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
