
const YearDefault = 2023
const MonthDefualt = 5
const DayDefault = 18

let isSettingPannelOpen = false
let timerId



document.querySelector('.setting .title').addEventListener('click', () => {
  const settingBody = document.querySelector('.setting .setting-body')
  settingBody.style.display = isSettingPannelOpen ? 'block' : 'none'
  isSettingPannelOpen && renderSettingBody()
  document.querySelector('.setting .title').innerHTML = isSettingPannelOpen
    ? `<i class="fas fa-regular fa-close"></i>`
    : `<i class="fas fa-regular fa-gear"></i>`
  isSettingPannelOpen = !isSettingPannelOpen
})


function renderSettingBody () {
  const yearEl = document.querySelector('#year')
  const monthEl = document.querySelector('#month')
  const dayEl = document.querySelector('#day')
  const hourEl = document.querySelector('#hour')
  const minuteEl = document.querySelector('#minute')
  const secondEl = document.querySelector('#second')
  yearEl.value = localStorage.getItem('year') ?? YearDefault
  monthEl.value = localStorage.getItem('month') ?? MonthDefualt
  dayEl.value = localStorage.getItem('day') ?? DayDefault
  hourEl.value = localStorage.getItem('year') ?? 0
  minuteEl.value = localStorage.getItem('year') ?? 0
  secondEl.value = localStorage.getItem('year') ?? 0
}

document.querySelector('#set-btn').addEventListener('click', startTimer)

function addInputEventListener () {
  document.querySelectorAll('input[type=number]').forEach(item => {
    item.addEventListener('change', e => {
      console.log(e.target)
      const {id, value} = e.target
      console.log(id, value)
      localStorage.setItem(id, value)
    })
  })
}
addInputEventListener()


function startTimer () {
  let [
    year, month, day, hour, minite, second
  ] = [
    localStorage.getItem('year') ?? 2023,
    localStorage.getItem('month') ?? 5,
    localStorage.getItem('day') ?? 18,
    localStorage.getItem('hour') ?? 0,
    localStorage.getItem('minute') ?? 0,
    localStorage.getItem('second') ?? 0
  ]
  const lunchDate = new Date(year, month - 1, day, hour, minite, second).getTime()
  if (lunchDate < new Date().getTime()) {
    alert('该时间不能被倒计时')
    return
  }

  if (timerId) {
    console.log('关闭定时器')
    clearInterval(timerId)
  }

  const countdown = document.querySelector('.countdown')


  timerId = setInterval(() => {
    const now = new Date().getTime()
    const distance = lunchDate - now
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (100 * 60 * 60 )) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)
    countdown.innerHTML = `
      <div>${days} <span>天</span></div>
      <div>${hours} <span>时</span></div>
      <div>${minutes} <span>分</span></div>
      <div>${seconds} <span>秒</span></div>
    `
    // 倒计时结束
    if (distance < 0) {
      clearInterval(timerId)
      countdown.getElementsByClassName.color = '#17a2b8'
      countdown.innerHTML = `恭喜，恭喜`
    }
  }, 1000)
}

startTimer()