document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('playAudioBtn');
  const audio = document.getElementById('audioPlayer');
  const icon = document.getElementById('btnIcon');
  const floating = document.getElementById('floatingPlayer');

  const startTime = 19;
  const endTime = 30;
  const fadeDuration = 2;

  let fadeInInterval, fadeOutInterval, segmentCheckInterval, isPlaying = false;

  btn.addEventListener('click', () => isPlaying ? stopAudio() : playSegment());

  function playSegment() {
    audio.currentTime = startTime;
    audio.volume = 0;
    audio.play();
    isPlaying = true;
    icon.textContent = "⏹️";
    btn.classList.add('active');

    const steps = 20;
    const stepTime = (fadeDuration * 1000) / steps;
    let currentStep = 0;

    clearInterval(fadeInInterval);
    fadeInInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(currentStep / steps, 1);
      if (currentStep >= steps) clearInterval(fadeInInterval);
    }, stepTime);

    clearInterval(segmentCheckInterval);
    segmentCheckInterval = setInterval(() => {
      if (audio.currentTime >= endTime) {
        clearInterval(segmentCheckInterval);
        fadeOutAndStop();
      }
    }, 100);
  }

  function fadeOutAndStop() {
    const steps = 20;
    const stepTime = (fadeDuration * 1000) / steps;
    let currentStep = 0;

    clearInterval(fadeOutInterval);
    fadeOutInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(1 - currentStep / steps, 0);
      if (currentStep >= steps) {
        clearInterval(fadeOutInterval);
        stopAudio();
      }
    }, stepTime);
  }

  function stopAudio() {
    clearInterval(fadeInInterval);
    clearInterval(fadeOutInterval);
    clearInterval(segmentCheckInterval);
    audio.pause();
    audio.currentTime = startTime;
    audio.volume = 0;
    isPlaying = false;
    icon.textContent = "▶️";
    btn.classList.remove('active');
  }

  // 🚀 DRAG ULTRA FLUIDO + CALAMITA
  let isDragging = false, offsetX = 0, offsetY = 0;

  function startDrag(e) {
    isDragging = true;
    floating.style.transition = 'none'; // nessuna animazione durante il drag
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    const rect = floating.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    floating.style.cursor = 'grabbing';
  }

  function onDrag(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    let x = clientX - offsetX;
    let y = clientY - offsetY;

    x = Math.max(0, Math.min(window.innerWidth - floating.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - floating.offsetHeight, y));

    floating.style.left = x + 'px';
    floating.style.top = y + 'px';
    floating.style.right = 'auto';
    floating.style.bottom = 'auto';
  }

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    floating.style.cursor = 'grab';

    const rect = floating.getBoundingClientRect();
    const isLeft = rect.left + rect.width / 2 < window.innerWidth / 2;

    // Calamita laterale con animazione
    floating.style.transition = 'left 0.2s ease';
    if (isLeft) {
      floating.style.left = '10px';
    } else {
      floating.style.left = (window.innerWidth - floating.offsetWidth - 10) + 'px';
    }
  }

  // PC
  floating.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);

  // Touch
  floating.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('touchend', stopDrag);
});
