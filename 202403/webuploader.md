```js
 // 根据要处理的文件大小来节流，一次不能处理太多，会卡。
    throttle = (function( max ) {
        var occupied = 0,
            waiting = [],
            tick = function() {
                var item;

                while ( waiting.length && occupied < max ) {
                    item = waiting.shift();
                    occupied += item[ 0 ];
                    item[ 1 ]();
                }
            };

        return function( emiter, size, cb ) {
            waiting.push([ size, cb ]);
            emiter.once( 'destroy', function() {
                occupied -= size;
                setTimeout( tick, 1 );
            });
            setTimeout( tick, 1 );
        };
    })( 5 * 1024 * 1024 );
```
```js
// 根据要处理的文件大小来节流，一次不能处理太多，会卡。  
function throttle(max) {  
    let occupied = 0;  
    let waitingQueue = [];  
  
    // 用来处理队列中等待的文件的函数  
    function processQueue() {  
        while (waitingQueue.length && occupied < max) {  
            const { size, promise } = waitingQueue.shift();  
            occupied += size;  
            promise.then(() => {  
                occupied -= size;  
                processQueue(); // 递归调用以处理下一个文件  
            });  
        }  
    }  ****
  
    // 返回一个新的 Promise，该 Promise 在文件处理完毕后解析  
    function handleFile(size, handleFileFunc) {  
        return new Promise((resolve, reject) => {  
            waitingQueue.push({  
                size,  
                promise: new Promise((resolveFile, rejectFile) => {  
                    handleFileFunc()  
                        .then(resolveFile)  
                        .catch(rejectFile);  
                }).then(resolve).catch(reject)  
            });  
            processQueue(); // 开始处理队列中的文件  
        });  
    }  
  
    return handleFile;  
}  

// 使用示例  
const throttleHandle = throttle(5 * 1024 * 1024); // 5MB limit  
  
async function processFile(file) {  
    // 模拟文件处理，返回一个 Promise  
    return new Promise(resolve => {  
        setTimeout(() => {  
            console.log(`Processing file of size ${file.size} bytes`);  
            resolve();  
        }, 1000); // 假设处理每个文件需要 1 秒  
    });  
}  
  
// 假设我们有一系列要处理的文件  
const files = [  
    { size: 1 * 1024 * 1024 }, // 1MB  
    { size: 2 * 1024 * 1024 }, // 2MB  
    { size: 3 * 1024 * 1024 }, // 3MB  
    // ...  
];  
  
// 依次处理文件，使用 throttle 来限制并发处理大小  
(async () => {  
    for (const file of files) {  
        await throttleHandle(file.size, () => processFile(file));  
    }  
})();
```