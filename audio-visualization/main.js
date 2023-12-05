const audio = document.querySelector('audio');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let init = false; // 是否初始化
let analyser = null;
let dataArray = []; // 记录分析数据

audio.addEventListener('play', () => {
  if(init){
    return;
  }
  // 初始化
  const audioCtx = new AudioContext(); // 创建音频上下文
  const source = audioCtx.createMediaElementSource(audio); // 创建音频源节点
  analyser = audioCtx.createAnalyser(); // 创建分析器节点
  analyser.fftSize = 512; // 设置 fft 大小
  // 创建数组，用于接收分析器节点的分析数据
  dataArray = new Uint8Array(analyser.frequencyBinCount) // 256 
  // 设置音频上下文连接情况
  source.connect(analyser) // 连接音频源节点和分析器节点
  analyser.connect(audioCtx.destination); // 连接分析器节点和 音频目标节点 (AudioDestinationNode)
  init = true;
});


// 把分析出的波形绘制到 canvas 上
function draw () {
  requestAnimationFrame(draw);
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!init) return;
  // 让分析器分析出数据到数组中
  analyser.getByteFrequencyData(dataArray);
  // 可视化绘制(利用柱状图)
  const len = dataArray.length;
  const barWidth = canvas.width / len / 2;
  ctx.fillStyle = '#78c5f7';
  for (let i = 0; i < len; i++){
    const data = dataArray[i]; // <256
    const barHeight = data / 256 * canvas.height;
    // // 源数据渲染
    // ctx.fillRect(i * barWidth, y, barWidth - 2, barHeight);
    
    // 利用数据的
    const x1 = i * barWidth + canvas.width / 2; // 从中间画
    const x2 = canvas.width / 2 - i * barWidth
    const y = canvas.height - barHeight;
    ctx.fillRect(x1, y, barWidth - 2, barHeight);
    ctx.fillRect(x2, y, barWidth - 2, barHeight);
  }
}

draw();