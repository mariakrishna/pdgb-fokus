const html = document.querySelector('html');
const focusBtn = document.querySelector('.app__card-button--foco');
const shortBtn = document.querySelector('.app__card-button--curto');
const longBtn = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const title = document.querySelector('.app__title');
const buttons = document.querySelectorAll('.app__card-button')
const musicFocusInput = document.querySelector('#alternar-musica');
const startOrPauseBtn = document.querySelector('#start-pause span');
const playArrow = document.querySelector('.app__card-primary-butto-icon');
const screenTime = document.querySelector('#timer');

const music = new Audio('./sons/luna-rise-part-one.mp3');
const startPauseBtn = document.querySelector('#start-pause');
const pauseSound = new Audio('./sons/pause.mp3');
const playSound = new Audio('./sons/play.wav');
const finishSound = new Audio('./sons/beep.mp3');

let elapsedTimeInSeconds = 1500;
let intervalId = null;
music.loop = true

musicFocusInput.addEventListener('change', () => {
  if(music.paused) {
    music.play()
   } else {
      music.pause()
    }
  })

focusBtn.addEventListener('click', () => {
  elapsedTimeInSeconds = 1500;
  alterarContexto('foco')
  focusBtn.classList.add('active')
});

shortBtn.addEventListener('click', () => {
  elapsedTimeInSeconds = 300;
  alterarContexto('descanso-curto')
  shortBtn.classList.add('active')
});

longBtn.addEventListener('click', () => {
  elapsedTimeInSeconds = 900;
  alterarContexto('descanso-longo')
  longBtn.classList.add('active')
});

function alterarContexto(contexto) {
  showTime()
  buttons.forEach(function(contexto) {
    contexto.classList.remove('active')
  })
  html.setAttribute('data-contexto', contexto)
  banner.setAttribute('src', `./imagens/${contexto}.png`)
  switch (contexto) {
    case "foco":
      title.innerHTML = `Otimize sua produtividade,<br>
      <strong class="app__title-strong">mergulhe no que importa.</strong>`
      break;
    case "descanso-curto":
      title.innerHTML = `Que tal dar uma respirada?<br>
      <strong class="app__title-strong">Faça uma pausa curta!</strong>`
      break;
    case "descanso-longo":
      title.innerHTML = `Hora de voltar à superfície.<br>
      <strong class="app__title-strong">Faça uma pausa longa.</strong>`
    default:
      break;
  }
}

let countdown = () => {
  if(elapsedTimeInSeconds <= 0) {
    finishSound.play();
    alert('tempo finalizado');
    const activeFocus = html.getAttribute('data-contexto') == 'foco'
    if (activeFocus) {
      const event = new CustomEvent('focoFinalizado')
      document.dispatchEvent(event)
    }
    toZero();
    return;
  }
  elapsedTimeInSeconds -= 1
  showTime()
}

startPauseBtn.addEventListener('click', startOrPause)

function startOrPause() {
  if(intervalId) {
    pauseSound.play();
    toZero()
    return
    
  } 
    playSound.play()
    intervalId = setInterval (countdown, 1000)
    startOrPauseBtn.textContent = 'Pausar'
    playArrow.src = './imagens/pause.png'
  }

function toZero() {
  clearInterval(intervalId)
  startOrPauseBtn.textContent = 'Começar'
  intervalId = null
  playArrow.src = './imagens/play_arrow.png'
}

function showTime() {
  const time = new Date(elapsedTimeInSeconds * 1000)
  const formatedTime = time.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
  screenTime.innerHTML = `${formatedTime}`
}

showTime()