const fs = require('fs')
console.log(fs.readFileSync('hello.txt'))
console.log(fs.readFileSync('hello.txt', 'utf-8'))
console.log('-----')
console.log("hello, world\r\ngoodbye, world");
console.log('-----')
console.log("hello, world\ngoodbye, world");
