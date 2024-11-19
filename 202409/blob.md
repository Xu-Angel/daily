## MIME

MIME（多用途互联网邮件扩展）是一种用于描述除 ASCII 文本以外的其他格式文档的标准，例如音频、视频和图像。最初用于电子邮件附件，现已成为用于在任何地方定义文档类型的事实标准。

MIME 类型（现在正式地称作“媒体类型”，但有时也被称作“内容类型”）是指示文件类型的会与文件同时发送出去的字符串，描述了内容的格式（例如，一个声音文件可能被标记为 audio/ogg ，一个图像文件可能是 image/png）。

它与传统 Windows 上的文件扩展名有相同目的。这个术语的名字源于最初用于电子邮件的 MIME 标准。

`"application/octet-stream"`二进制数据默认

## Blob

Blob 对象表示一个不可变、原始数据的类文件对象。它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作。

Blob 表示的不一定是 JavaScript 原生格式的数据。File 接口基于 Blob，继承了 blob 的功能并将其扩展以支持用户系统上的文件。

```
const blob = new Blob(blobParts, options);
```

blobParts: 一个数组，包含将被放入 Blob 对象中的数据，可以是字符串、数组缓冲区（ArrayBuffer）、TypedArray、Blob 对象等。

options: 一个可选的对象，可以设置 type（MIME 类型）和 endings（用于表示换行符）。

```
const blob = new Blob(["Hello, world!"], { type: "text/plain" });

```

## 使用场景

- 下载文件

```
const blob = new Blob(["This is a test file."], { type: "text/plain" });
const url = URL.createObjectURL(blob); // 创建一个 Blob URL
const a = document.createElement("a");
a.href = url;
a.download = "test.txt";
a.click();
URL.revokeObjectURL(url); // 释放 URL 对象

```

- 上传文件你可以通过 FormData 对象将 Blob 作为文件上传到服务器：

```
 formData.append('cluster',new Blob([JSON.stringify(clusterParams)], {type: 'application/json'}))
```

- 读取图片或其他文件通过 FileReader API 可以将 Blob 对象读取为不同的数据格式。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="file" id="fileInput" accept="image/*" />

    <div id="imageContainer"></div>
    <script>
      const fileInput = document.getElementById('fileInput')

      const imageContainer = document.getElementById('imageContainer')

      fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0]

        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader()

          reader.onload = function (e) {
            const img = document.createElement('img')
            img.src = e.target.result
            img.style.maxWidth = '500px'
            img.style.margin = '10px'
            imageContainer.innerHTML = ''
            imageContainer.appendChild(img)
          }

          reader.readAsDataURL(file)
        } else {
          alert('请选择一个有效的图片文件。')
        }
      })
    </script>
  </body>
</html>
```

- Blob 和 Base64 有时你可能需要将 Blob 转换为 Base64 编码的数据（例如用于图像的内联显示或传输）

```js
const reader = new FileReader()
reader.onloadend = function () {
  const base64data = reader.result
  console.log(base64data) // 输出 base64 编码的数据
}

reader.readAsDataURL(blob) // 将 Blob 读取为 base64
```

## File

File 是 JavaScript 中代表文件的数据结构，它继承自 Blob 对象，包含文件的元数据（如文件名、文件大小、类型等）。File 对象通常由用户通过 <input type="file"> 选择文件时创建，也可以使用 JavaScript 构造函数手动创建。

File 接口提供有关文件的信息，并允许网页中的 JavaScript 访问其内容。

File 对象通常从用户使用 <input> 元素选择文件返回的 FileList 对象中检索，或者从拖放操作返回的 DataTransfer 对象中检索。

File 对象是一种特定类型的 Blob，并且可以在 Blob 可以使用的任何上下文中使用。特别是，FileReader、URL.createObjectURL()、createImageBitmap()、fetch() 方法的 body 选项和 XMLHttpRequest.send() 都可以接收 Blob 对象和 File 对象。

```js
<input type="file" id="fileInput" />
<script>
  document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    console.log("文件名:", file.name);
    console.log("文件类型:", file.type);
    console.log("文件大小:", file.size);
  });
</script>

```

### 手动创建 File 对象

```js
const file = new File(['Hello, world!'], 'hello-world.txt', {
  type: 'text/plain',
})

console.log(file)
```

### 继承方法

File 对象继承了 Blob 对象的方法，因此可以使用一些 Blob 对象的方法来处理文件数据。

slice(): 从文件中获取一个子部分数据，返回一个新的 Blob 对象。

```js
const blob = file.slice(0, 1024) // 获取文件的前 1024 个字节
```

text(): 读取文件内容，并将其作为文本返回（这是 Blob 的方法，但可以用于 File 对象）。

```js
file.text().then((text) => {
  console.log(text) // 输出文件的文本内容
})
```

arrayBuffer(): 将文件内容读取为 ArrayBuffer（用于处理二进制数据）。

```js
file.arrayBuffer().then((buffer) => {
  console.log(buffer) // 输出文件的 ArrayBuffer
})
```

stream(): 返回一个 ReadableStream 对象，可以通过流式读取文件内容。

```js
const stream = file.stream()
```

## 总结

Blob 是纯粹的二进制数据，它可以存储任何类型的数据，但不具有文件的元数据（如文件名、最后修改时间等）。 File 是 Blob 的子类，File 对象除了具有 Blob 的所有属性和方法之外，还包含文件的元数据，如文件名和修改日期。你可以将 File 对象看作是带有文件信息的 Blob。

```js
const file = new File(['Hello, world!'], 'hello.txt', { type: 'text/plain' })

console.log(file instanceof Blob) // true
```

二者在文件上传和二进制数据处理的场景中被广泛使用。Blob 更加通用，而 File 更专注于与文件系统的交互。

## base64

由于 btoa 将其输入字符串的码位解释为字节值，因此如果字符的码位超过 0xff，调用 btoa 将导致“Character Out Of Range”异常。对于需要编码任意 Unicode 文本的用例，需要首先将字符串转换为其 UTF-8 的组成字节，然后对这些字节进行编码。

最简单的解决方案是使用 TextEncoder 和 TextDecoder 在 UTF-8 和字符串的单字节表示之间进行转换：

```js
function base64ToBytes(base64) {
  const binString = atob(base64)
  return Uint8Array.from(binString, (m) => m.codePointAt(0))
}

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('')
  return btoa(binString)
}

// 用法
bytesToBase64(new TextEncoder().encode('a Ā 𐀀 文 🦄')) // "YSDEgCDwkICAIOaWhyDwn6aE"
new TextDecoder().decode(base64ToBytes('YSDEgCDwkICAIOaWhyDwn6aE')) // "a Ā 𐀀 文 🦄"
```

### 转换任意二进制数据

前一节中的 bytesToBase64 和 base64ToBytes 函数可以直接用于在 Base64 字符串和 Uint8Array 之间进行转换。为了获得更好的性能，可以通过 Web 平台内置的 FileReader 和 fetch API 进行基于 Base64 数据 URL 的异步转换：

```js
async function bytesToBase64DataUrl(bytes, type = 'application/octet-stream') {
  return await new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result),
      onerror: () => reject(reader.error),
    })
    reader.readAsDataURL(new File([bytes], '', { type }))
  })
}

async function dataUrlToBytes(dataUrl) {
  const res = await fetch(dataUrl)
  return new Uint8Array(await res.arrayBuffer())
}

// 用法
await bytesToBase64DataUrl(new Uint8Array([0, 1, 2])) // "data:application/octet-stream;base64,AAEC"
await dataUrlToBytes('data:application/octet-stream;base64,AAEC') // Uint8Array [0, 1, 2]
```

> https://juejin.cn/post/7413921824066551842

> https://developer.mozilla.org/zh-CN/docs/Web/API/Blob

> https://developer.mozilla.org/zh-CN/docs/Glossary/Base64

> https://developer.mozilla.org/zh-CN/docs/Web/API/File
