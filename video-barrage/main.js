/**
 * 弹幕实现整体思路
 * 1. canvas 绘制 弹幕文字
 * 2. 弹幕滚动
 */

const container = document.querySelector('.container');
const canvas = document.querySelector('#canvas');
const video = document.querySelector('.video');

const barrage = new Barrage({
  canvas,
  video,
  speed: 10,
  data: getData(30)
});

video.addEventListener('play', () => {
  barrage.isPlay = true;
  barrage.render();
});

video.addEventListener('pause', () => {
  barrage.pause();
});

// --------------------- 弹幕输入逻辑 ----------------
const textInput = document.getElementById('text-input');
const colorInput = document.getElementById('color-input');
const sizeInput = document.getElementById('size-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', () => {
  const value = textInput.value;
  if (!value) return;
  const color = colorInput.value;
  const size = sizeInput.value;

  const option = {
    value,
    color,
    size: parseInt(size)
  }
  // 添加弹幕
  barrage.addBarrage(option);
  textInput.value = '';
})


/**
 * 模拟获取弹幕
 * @param {Number} len 获取弹幕的条数
 * @returns {Array<Object>} 弹幕对象数组
 */
function getData (len) {
  let data = [];
  for (let i = 0; i < len; i++){
    data.push({
      value: `这是第${i+1}条弹幕`,  // 弹幕内容
      time: (i+1 ) * 2, // 时间 s
      fontSize: 20, // 弹幕字体大小
      color: 'red', // 弹幕颜色
      speed: 1 // 弹幕速度
    });
  }
  return data;
}
