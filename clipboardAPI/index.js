const CLIPBOARD_PERMISSION_NAMES = {
  WRITE: 'clipboard-write',
  READ: 'clipboard-read'
}

const { clipboard, permissions } = window.navigator;

const historyTemplate = document.querySelector("#copy-history-item-template");
const historyGroup = document.querySelector('.histories');


// text
const copyTextBtn = document.querySelector(".copy-text-btn");
async function clipText () {
  const hasPermission = await getPermission(CLIPBOARD_PERMISSION_NAMES.WRITE);
  if (!hasPermission) return handlePermissionError();
  const val = document.querySelector(".textarea").value;
  if (!val) return;
  // 写入文字到剪切板
  await clipboard.writeText(val);
  await updateHistory();
}
copyTextBtn.addEventListener("click", clipText);


// html
const copyHtmlBtn = document.querySelector('.copy-html-btn');
async function clipHtml () {
  const hasPermission = await getPermission(CLIPBOARD_PERMISSION_NAMES.WRITE);
  if (!hasPermission) return handlePermissionError();
  const html = document.querySelector('.html-content').innerHTML;
  const blob = new Blob([html], { type: 'text/html' }); // 转换为 blob
  const data = [new ClipboardItem({ [blob.type]: blob })];
  await clipboard.write(data);
  await updateHistory();
}
copyHtmlBtn.addEventListener('click', clipHtml);




// png img
const copyPngImgBtn = document.querySelector('.copy-png-btn');
async function clipPngImg () {
  const hasPermission = await getPermission(CLIPBOARD_PERMISSION_NAMES.WRITE);
  if (!hasPermission) return handlePermissionError();

  const imgSrc = document.querySelector('.png-img').src;

  // 利用 fetch 获取图片
  const resp = await fetch(imgSrc);
  const imgBlob = await resp.blob();
  const data = [new ClipboardItem({ [imgBlob.type]: imgBlob })];
  await clipboard.write(data);
  await updateHistory();
}
copyPngImgBtn.addEventListener('click', clipPngImg);


// jpg img
const copyJpgImgBtn = document.querySelector('.copy-jpg-btn');
async function clipJpgImg () {
  const hasPermission = await getPermission(CLIPBOARD_PERMISSION_NAMES.WRITE);
  if (!hasPermission) return handlePermissionError();

  const jpgElement = document.querySelector('.jpg-img');

  // 利用 fetch 获取图片
  const resp = await fetch(jpgElement.src);
  const jpgBlob = await resp.blob();

  // 转换为 png 格式
  const pngBlob = await convertJpg2Png({
    jpgBlob,
    width: jpgElement.naturalWidth,
    height: jpgElement.naturalHeight
  });
  const data = [new ClipboardItem({ [pngBlob.type]: pngBlob })];
  await clipboard.write(data);
  await updateHistory();
}
copyJpgImgBtn.addEventListener('click', clipJpgImg);




/**
 * 读取剪切板中的值，更新到 页面右侧 “剪切板历史区域”
 *
 * 利用 clipboard 对象的 read() ， 返回值为 任意数据 (arbitrary data)
 */
async function updateHistory () {
  const hasPerssion = await getPermission("clipboard-read"); // 查询是否有读取剪切板内容的权限
  if (!hasPerssion) return handlePermissionError();
  const data = await clipboard.read();
  console.log('从剪切板中读取的内容', data);

  for (const clipboardItem of data) {
    const { types } = clipboardItem;
    for (const type of types) {
      const blob = await clipboardItem.getType(type);
      console.log(blob);

      const tmp = historyTemplate.content.firstElementChild.cloneNode(true);
      const titleNode = tmp.querySelector('.copy-item__title');
      const contentNode = tmp.querySelector('.copy-item__content');

      // 纯文本
      if (type === 'text/plain') {
        const plainText = await blob.text();
        titleNode.textContent = '纯文本';
        contentNode.textContent = plainText;
      } else if (type === 'text/html') {
        const html = await blob.text();
        titleNode.textContent = '超文本';
        contentNode.innerHTML = html;
      } else if (type === 'image/png') {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.style.width = '100%';
        titleNode.textContent = 'PNG 图片'
        contentNode.append(img);
      }
      historyGroup.prepend(tmp);
    }
  }
}


/**
 * 获取 permissionName 对应的权限
 * @param {String} name 
 */
async function getPermission(name){
  const { state } = await permissions.query({ name });
  if (state === 'granted' || state === 'prompt') {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false)
  }
}


function handlePermissionError () {
  alert('未打开网站对剪切板操作的读写权限')
}


/**
 * 利用 canvas 将 jpg 转换为 png
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