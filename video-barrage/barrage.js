/**
 * 弹幕类
 */

class BarrageItem{
  constructor(data, barrage) {
    Object.assign(this, data);
    this.barrage = barrage;
    // 弹幕是否初始化
    this.isInit = false;
    // 是否需要绘制弹幕
    this.isRender = true;
  }

  // 弹幕初始化
  init () {
    // 初始化弹幕的基础属性
    this.value = this.value || this.barrage.value;
    this.color = this.color || this.barrage.color;
    this.speed = this.speed || this.barrage.speed;
    this.fontSize = this.fontSize || this.barrage.fontSize;
    
    // 获取弹幕宽度
    this.width = this.getWidth();
    this.height = this.fontSize;
    // 弹幕初始 x坐标
    this.x = this.barrage.canvas.width;
    // 弹幕初始 y 坐标
    this.y = Math.random() * this.barrage.canvas.height;
    if (this.y > this.barrage.canvas.height - this.fontSize) {
      this.y = this.barrage.canvas.height - this.fontSize;
    }
    if (this.y < this.fontSize) {
      this.y = this.fontSize;
    }
    this.y = Math.floor(this.y);
    console.log('弹幕初始化完成：',this)
  }

  // 获取弹幕宽度
  getWidth () {
    // 通过根据创建 html 元素来获取宽高
    const el = document.createElement('span');
    el.innerText = this.value;
    el.style.font = `${this.fontSize}px Monoco`;
    el.style.color = this.color;
    el.style.position = 'absolute';
    el.style.zIndex = -1;
    document.body.appendChild(el);
    const width = el.clientWidth;
    document.body.removeChild(el); // 移除dom
    return width;
  }

  // 渲染当前弹幕
  render () {
    // 绘制
    this.barrage.ctx.font = `${this.fontSize}px Monoco`;
    this.barrage.ctx.fillStyle = this.color;
    this.barrage.ctx.fillText(this.value, this.x, this.y);
    // 绘制边框
    if (this.isMe) {
      this.barrage.ctx.strokeStyle = 'red';
      this.barrage.ctx.beginPath();
      this.barrage.ctx.rect(this.x, this.y - this.fontSize, this.width + 5, this.height + 5);
      this.barrage.ctx.stroke();
    }
  }
}

/**
 * 弹幕控制类
 */
class Barrage{
  constructor(options) {
    if (!options.canvas || !options.video) return;
    const defaultOption = {
      fontSize: 26,
      color: 'green',
      speed: 1,
      data: []
    };
    Object.assign(this, defaultOption, options);

    // 初始化弹幕 canvas
    this.canvas.width = this.video.clientWidth;
    this.canvas.height = this.video.clientHeight;
    this.ctx = this.canvas.getContext('2d');

    // 保存弹幕数据
    this.barrages = this.data.map(item =>  new BarrageItem(item, this));

    // 视频是否暂停
    this.isPlay = true;
  }

  // 清空画布
  clear () {
    // console.log('清空画布');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 渲染弹幕
  renderBarrages () {
    // 获取视频当前时间
    const currentTime = this.video.currentTime;
    // console.log('当前视频时间: ', currentTime);
    // 判断当前视频时间和弹幕时间来控制弹幕的显示
    this.barrages.filter(barrage => currentTime >= barrage.time && barrage.isRender).forEach(barrage => {
      if (!barrage.isInit) {
        barrage.init();
        barrage.isInit = true;
      }
      // 修改弹幕在 canvas 上的 x 的位置
      barrage.x = barrage.x - barrage.speed;
      // 判断弹幕是否已超出画布，用于停止绘制
      if (barrage.x < - barrage.width) {
        barrage.isRender = false;
      }
      // 绘制弹幕
      barrage.render();
    })
  }

  // 弹幕渲染
  render () {
    console.log('渲染弹幕 render');
    // 1. 清空画布
    this.clear();
    // 2. 渲染新画布(弹幕)
    this.renderBarrages();

    // 3. 递归调用渲染方法
    if (this.isPlay) {
      window.requestAnimationFrame(this.render.bind(this));
    }
  }

  // 弹幕暂停
  pause () {
    this.isPlay = false;
    console.log('弹幕暂停');
  }

  // 添加弹幕
  addBarrage ({value, color, size, time}) {
    const newBarrage = new BarrageItem({
      fontSize: size,
      color: color,
      speed: this.speed || 1,
      value,
      time: this.video.currentTime,
      isMe: true // 用于在绘制的时候，增加 边框
    }, this);
    this.barrages.push(newBarrage);
  }
}
