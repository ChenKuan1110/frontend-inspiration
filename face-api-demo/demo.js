const video = document.getElementById('video')
const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d')
ctx.font = '24px'
ctx.fillStyle = 'green'
ctx.fillText('获取摄像头...', 200, 200)

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("./models"), // 算法模型
  faceapi.loadFaceLandmarkModel("./models"), // 轮廓模型
  faceapi.loadFaceExpressionModel("./models"), // 表情模型
  faceapi.loadAgeGenderModel("./models") // 年龄模型
]).then(getVideo)

function getVideo () {
  window.navigator.mediaDevices.getUserMedia({
    video: true
  }).then(stream => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }).catch(err => {
    console.log('浏览器不能获取到视频流')
  })
}

video.addEventListener('play', () => {
  const diplaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, diplaySize)
  ctx.fillStyle = 'green'
  ctx.fillText('模型加载中...', 200, 200)
  setInterval(async() => {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.SsdMobilenetv1Options()
    ).withFaceLandmarks().withFaceExpressions()
    const detectionsForSize = faceapi.resizeResults(detections, diplaySize)
    ctx.clearRect(0,0,canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, detectionsForSize)
    faceapi.draw.drawFaceLandmarks(canvas, detectionsForSize)
    faceapi.draw.drawFaceExpressions(canvas, detectionsForSize)
  }, 100)
})