// Carichiamo l'API di YouTube per controllare il player
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    events: {
      'onReady': onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  setupVisualizer();
}

function setupVisualizer() {
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);

  let audioElement = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  audioElement.crossOrigin = "anonymous";
  audioElement.loop = true;
  audioElement.muted = true;
  audioElement.play();

  let source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  let canvas = document.getElementById('audioVisualizer');
  let ctx = canvas.getContext('2d');
  let WIDTH = canvas.width;
  let HEIGHT = canvas.height;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(30,30,30,0.6)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    let barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      let r = 255;
      let g = Math.max(0, 62 - (barHeight / 2));
      let b = Math.max(0, 62 - (barHeight / 2));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }

  draw();
}

// Spoiler audio
const btn = document.getElementById('playAudioBtn');
const audio = document.getElementById('audioPlayer');

const startTime = 19;
const endTime = 30;
const fadeDuration = 2;
let fadeInterval;
let isPlaying = false;

btn.addEventListener('click', () => {
  if (isPlaying) {
    stopAudio();
  } else {
    playSegment();
  }
});

function playSegment() {
  audio.currentTime = startTime;
  audio.volume = 0;
  audio.play();
  isPlaying = true;
  btn.textContent = "Stop";

  let vol = 0;
  const fadeInStep = 0.05;
  clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    if (vol < 1) {
      vol = Math.min(vol + fadeInStep, 1);
      audio.volume = vol;
    } else {
      clearInterval(fadeInterval);
    }
  }, (fadeDuration * 1000) * fadeInStep);

  const checkInterval = setInterval(() => {
    if (audio.currentTime >= endTime) {
      clearInterval(checkInterval);
      fadeOutAndStop();
    }
  }, 100);
}

function fadeOutAndStop() {
  let vol = audio.volume;
  const fadeOutStep = 0.05;
  clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    if (vol > 0) {
      vol = Math.max(vol - fadeOutStep, 0);
      audio.volume = vol;
    } else {
      clearInterval(fadeInterval);
      stopAudio();
    }
  }, (fadeDuration * 1000) * fadeOutStep);
}

function stopAudio() {
  clearInterval(fadeInterval);
  audio.pause();
  audio.currentTime = startTime;
  audio.volume = 0;
  isPlaying = false;
  btn.textContent = "Play";
}

// POPUP PROMOZIONALE "KRYPTONITE"
window.onload = function() {
  let popupClosed = false;

  function showKryptonitePopup() {
  if (!popupClosed) {
    const popup = document.getElementById("kryptonitePopup");
    const overlay = document.getElementById("overlay");
    if (popup && overlay) {
      popup.style.display = "block";
      overlay.style.display = "block";
    }
  }
}

function closeKryptonitePopup() {
  const popup = document.getElementById("kryptonitePopup");
  const overlay = document.getElementById("overlay");
  if (popup && overlay) {
    popup.style.display = "none";
    overlay.style.display = "none";
    popupClosed = true;
  }
}


  window.closeKryptonitePopup = closeKryptonitePopup;

  setTimeout(showKryptonitePopup, 1000); // primo dopo 1 sec
  const popupInterval = setInterval(() => {
    if (!popupClosed) {
      showKryptonitePopup();
    } else {
      clearInterval(popupInterval);
    }
  }, 3000); // ogni 3 secondi
};
