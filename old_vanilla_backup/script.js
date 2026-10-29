// ========================================================
// CONTADOR EN TIEMPO REAL (100% JavaScript Nativo en el Navegador)
// ========================================================

// Función para determinar el próximo 24 de diciembre
function calculateTargetDate() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 11, 24, 0, 0, 0, 0); // 24 de Diciembre (mes 11 en JS)

  // Si ya pasó el 24 de diciembre en el año actual, apuntar al del siguiente año
  if (now.getTime() >= target.getTime()) {
    target = new Date(year + 1, 11, 24, 0, 0, 0, 0);
  }
  return target;
}

const targetDate = calculateTargetDate();

// Elementos de la interfaz
const elMonths = document.getElementById('months');
const elDays = document.getElementById('days');
const elHours = document.getElementById('hours');
const elMinutes = document.getElementById('minutes');
const elSeconds = document.getElementById('seconds');
const elLiveText = document.getElementById('live-target-text');

if (elLiveText) {
  elLiveText.textContent = `OBJETIVO: 24 DE DICIEMBRE ${targetDate.getFullYear()} 💕 EN TIEMPO REAL`;
}

function padZero(num) {
  return String(num).padStart(2, '0');
}

let previousSecond = null;

// Función de actualización precisa ejecutada en tiempo real
function tickClock() {
  const now = new Date();
  const diffTotal = targetDate.getTime() - now.getTime();

  if (diffTotal <= 0) {
    if (elMonths) elMonths.textContent = '00';
    if (elDays) elDays.textContent = '00';
    if (elHours) elHours.textContent = '00';
    if (elMinutes) elMinutes.textContent = '00';
    if (elSeconds) elSeconds.textContent = '00';
    if (elLiveText) elLiveText.textContent = '💖 ¡HOY ES EL DÍA MÁS IMPORTANTE MI NIÑA! 💖';
    return;
  }

  // 1. Desglose exacto de meses calendario restantes
  let months = 0;
  let cursor = new Date(now.getTime());

  while (true) {
    let nextMonth = new Date(cursor.getTime());
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (nextMonth.getTime() <= targetDate.getTime()) {
      months++;
      cursor = nextMonth;
    } else {
      break;
    }
  }

  // 2. Tiempo restante tras descontar meses
  let diffRemaining = targetDate.getTime() - cursor.getTime();

  const msDay = 86400000;
  const msHour = 3600000;
  const msMinute = 60000;
  const msSecond = 1000;

  const days = Math.floor(diffRemaining / msDay);
  diffRemaining -= days * msDay;

  const hours = Math.floor(diffRemaining / msHour);
  diffRemaining -= hours * msHour;

  const minutes = Math.floor(diffRemaining / msMinute);
  diffRemaining -= minutes * msMinute;

  const seconds = Math.floor(diffRemaining / msSecond);

  // Actualizar DOM
  if (elMonths) elMonths.textContent = padZero(months);
  if (elDays) elDays.textContent = padZero(days);
  if (elHours) elHours.textContent = padZero(hours);
  if (elMinutes) elMinutes.textContent = padZero(minutes);

  if (elSeconds && seconds !== previousSecond) {
    elSeconds.textContent = padZero(seconds);
    elSeconds.classList.remove('pulse');
    void elSeconds.offsetWidth; // Forzar reflow para reiniciar la animación
    elSeconds.classList.add('pulse');
    previousSecond = seconds;
  }
}

// Iniciar inmediatamente y verificar cada 100ms para precisión total sin retrasos
tickClock();
setInterval(tickClock, 100);

// ========================================================
// FONDO DINÁMICO EN MOVIMIENTO (Corazones y Estrellas en Canvas)
// ========================================================
const canvas = document.getElementById('love-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = {
    x: width / 2,
    y: height / 2
  };

  // Trazo interactivo con el cursor (corazoncitos flotantes al mover el mouse)
  const trailHearts = [];

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (Math.random() > 0.4) {
      trailHearts.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 12 + 8,
        alpha: 1,
        speedY: -(Math.random() * 1.5 + 0.8),
        speedX: (Math.random() - 0.5) * 1.5,
        rotation: (Math.random() - 0.5) * 0.4
      });
    }
  });

  // Función para dibujar un corazón con curvas Bézier
  function drawHeart(context, x, y, size, color, alpha, rotation = 0) {
    context.save();
    context.translate(x, y);
    if (rotation !== 0) context.rotate(rotation);
    context.beginPath();
    const topCurveHeight = size * 0.3;
    context.moveTo(0, topCurveHeight);
    // Lado izquierdo
    context.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
    // Lado derecho
    context.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
    context.fillStyle = color;
    context.globalAlpha = Math.max(0, Math.min(1, alpha));
    context.shadowBlur = size * 1.2;
    context.shadowColor = 'rgba(255, 105, 180, 0.7)';
    context.fill();
    context.restore();
  }

  // Colección de partículas ambientales (corazones y destellos flotantes)
  const particles = [];
  const TOTAL_PARTICLES = 50;

  const pinkShades = [
    '#ff4d6d',
    '#ff758f',
    '#ff8fa3',
    '#ffb3c1',
    '#ffccd5',
    '#ffffff'
  ];

  class LoveParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 16 + 7;
      this.speedY = -(Math.random() * 0.85 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.alpha = Math.random() * 0.6 + 0.25;
      this.color = pinkShades[Math.floor(Math.random() * pinkShades.length)];
      this.isHeart = Math.random() > 0.35; // 65% corazones, 35% estrellitas
      this.rotation = (Math.random() - 0.5) * 0.5;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.4;
      this.rotation += this.rotSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      if (this.isHeart) {
        drawHeart(ctx, this.x, this.y, this.size, this.color, this.alpha, this.rotation);
      } else {
        // Estrellita / Bokeh
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.alpha * 0.8);
        ctx.shadowBlur = this.size * 1.5;
        ctx.shadowColor = '#ff8fa3';
        ctx.fill();
        ctx.restore();
      }
    }
  }

  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    particles.push(new LoveParticle());
  }

  // Bucle de animación 60 FPS
  function animateLoveScene() {
    ctx.clearRect(0, 0, width, height);

    // Fondo degradado suave en canvas
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.4, 20,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.8
    );
    bgGrad.addColorStop(0, 'rgba(65, 18, 50, 0.45)');
    bgGrad.addColorStop(0.6, 'rgba(32, 8, 26, 0.85)');
    bgGrad.addColorStop(1, 'rgba(17, 3, 13, 0.98)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Dibujar y actualizar partículas flotantes
    for (let p of particles) {
      p.update();
      p.draw();
    }

    // Dibujar y actualizar estela de corazones del cursor
    for (let i = trailHearts.length - 1; i >= 0; i--) {
      const th = trailHearts[i];
      th.y += th.speedY;
      th.x += th.speedX;
      th.alpha -= 0.02;
      th.size *= 0.98;

      if (th.alpha <= 0) {
        trailHearts.splice(i, 1);
      } else {
        drawHeart(ctx, th.x, th.y, th.size, '#ff4d6d', th.alpha, th.rotation);
      }
    }

    requestAnimationFrame(animateLoveScene);
  }

  requestAnimationFrame(animateLoveScene);
}

// ========================================================
// REPRODUCTOR DE MELODÍA DULCE (Cajita musical romántica con Web Audio)
// ========================================================
let audioCtx = null;
let isPlayingMelody = false;
let melodyInterval = null;

const musicNotes = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.00, // A5
  987.77, // B5
  1046.50 // C6
];

// Melodía suave tipo caja de música
const songPattern = [
  { note: 2, dur: 400 }, // E5
  { note: 4, dur: 400 }, // G5
  { note: 5, dur: 600 }, // A5
  { note: 4, dur: 400 }, // G5
  { note: 2, dur: 600 }, // E5
  { note: 1, dur: 400 }, // D5
  { note: 0, dur: 800 }, // C5
  { note: 2, dur: 400 }, // E5
  { note: 4, dur: 600 }, // G5
  { note: 7, dur: 800 }  // C6
];

function playChimeNote(freq) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.25);
}

let melodyStep = 0;

function startSweetMelody() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  function playNext() {
    if (!isPlayingMelody) return;
    const item = songPattern[melodyStep];
    const freq = musicNotes[item.note];
    playChimeNote(freq);
    melodyStep = (melodyStep + 1) % songPattern.length;
    melodyInterval = setTimeout(playNext, item.dur);
  }

  playNext();
}

function stopSweetMelody() {
  if (melodyInterval) {
    clearTimeout(melodyInterval);
    melodyInterval = null;
  }
}

const musicBtn = document.getElementById('music-btn');
if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!isPlayingMelody) {
      isPlayingMelody = true;
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.btn-text').textContent = 'Pausar Melodía';
      startSweetMelody();
    } else {
      isPlayingMelody = false;
      musicBtn.classList.remove('playing');
      musicBtn.querySelector('.btn-text').textContent = 'Melodía Dulce';
      stopSweetMelody();
    }
  });
}
