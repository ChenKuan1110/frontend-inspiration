# 利用剪切板API (ClipBoard API)



### 文档参考
[MDN-ClipBoard API](https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API)

### 实现逻辑
1. 点击页面按钮时，获取相对应的数据， 通过 `clipboard.write()/writeText()`往剪切板写入数据
2. 写入数据之后，通过 `clipboard.read()/readText()` 从剪切板中读取数据
3. 展示获取到的数据


### 注意事项
1. 保存图片到剪切板的时候，暂时只能保存 **png** 图片，保存 **jpg** 图片需要利用其他方式转换为 **png**





----
### 修改默认滚动条样式
对于设置 `overflow` 的元素(及父级)可通过如下伪元素(pseudo-element)修改默认滚动条的样式
* `::-webkit-scrollbar`——整个滚动条
* `::-webkit-scrollbar-button`——滚动条上的按钮（上下箭头）
* `::-webkit-scrollbar-thumb`——滚动条上的滚动滑块
* `::-webkit-scrollbar-track`——滚动条轨道
* `::-webkit-scrollbar-track-piece`——滚动条没有滑块的轨道部分
* `::-webkit-scrollbar-corner`——当同时有垂直滚动条和水平滚动条时交汇的部分。通常是浏览器窗口的右下角
* `::-webkit-resizer`——出现在某些元素底角的可拖动调整大小的滑块


### **jpg** 转 **png** 
实现思路： 利用 `canvas` 图片绘制，然后保存 **png** 图片

示例：
```javascript
/**
 * 
 */
async function convertJpg2Png ({ jpgBlob, width, height }) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;

  const img = document.createElement('img');
  img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0, width, height); // 绘制图片
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      reject('不能保存为 Blob 对象')
    }, 'image/png')
  });
  img.src = URL.createObjectURL(jpgBlob);
  });
}
```

### 在线体验地址
[在线体验](https://chenkuan1110.github.com/frontend-inspiration/clipboardAPI)