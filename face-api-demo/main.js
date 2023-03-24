

async function getVideoStream () {
  try {
    const stream = await window.navigator.mediaDevices.getUserMedia({video: true})
    const video = document.getElementById('video')
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  } catch(e) {
    console.erorr(e)
  }
  
}

async function loadModel(){
  await faceapi.nets.ssdMobilenetv1.loadFromUri("./models"); // 算法模型
  await faceapi.loadFaceLandmarkModel("./models"); // 轮廓模型
  await faceapi.loadFaceExpressionModel("./models"); // 表情模型
  await faceapi.loadAgeGenderModel("./models"); // 年龄模型
}
// getVideoStream()


/**
 * 检测单张图片
 */
async function testDetectSingleFace () {
  // 加载图片
  const img = await faceapi.fetchImage('./images/face.png')
  const canvas = document.createElement('canvas')
  canvas.height = img.height
  canvas.width = img.width
  canvas.style.boxSizing = 'border-box'
  canvas.style.border = '1px solid red'
  document.body.append(canvas)
  // console.log(img)
  // 加载模型
  await loadModel()
  const result = await faceapi.detectSingleFace(img).withFaceLandmarks()
  console.log(result)
  // 绘制源图像
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0,0, img.width, img.height)
  const detectionsForSize = faceapi.resizeResults(result, { width: img.width, height: img.height })
  // 绘制检测结果
  faceapi.draw.drawDetections(canvas, detectionsForSize, { withScore: true })
}

// testDetectSingleFace()


// 1. 配置 face-api参数(加载模型，指定识别参数)
// 2. 获取视频流
// 3. 将视频流截取画面帧用于检测
// 4. 渲染画面识别结果
async function main () {
  await loadModel()
  await getVideoStream()
  const input = document.getElementById('video')
  
  const detections = await faceapi.detectSingleFace(input).withFaceLandmarks()
  // resize the detected boxes in case your displayed image has a different size then the original
  const detectionsForSize = await faceapi.resizeResults(detections, { width: input.width, height: input.height })
  // draw them into a canvas
  const canvas = document.getElementById('canvas')
  canvas.width = input.width
  canvas.height = input.height
  faceapi.drawDetection(canvas, detectionsForSize, { withScore: true })
  console.log('done')
}

main()
