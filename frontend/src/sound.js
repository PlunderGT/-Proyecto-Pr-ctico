// Efectos de sonido generados con Web Audio API (sin archivos de audio).
let ctx = null;
let muted = false;
try {
  muted = localStorage.getItem('ih-muted') === '1';
} catch {
  /* sin acceso a localStorage: se queda en falso */
}

function audio() {
  if (muted) return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, offset, duration, type = 'sine', volume = 0.12) {
  const c = audio();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime + offset;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem('ih-muted', value ? '1' : '0');
  } catch {
    /* ignorar */
  }
}

export const sounds = {
  click: () => tone(660, 0, 0.07, 'triangle', 0.08), // navegar / abrir
  filter: () => tone(520, 0, 0.05, 'square', 0.04), // cambiar un filtro
  success: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.18, 'sine', 0.13)), // crear / resolver / cerrar
  assign: () => { tone(440, 0, 0.09, 'triangle', 0.1); tone(660, 0.09, 0.14, 'triangle', 0.1); }, // asignar técnico
  status: () => { tone(392, 0, 0.1, 'sine', 0.11); tone(587, 0.1, 0.16, 'sine', 0.11); }, // cambio de estado
  comment: () => tone(880, 0, 0.09, 'sine', 0.09), // comentario
  error: () => { tone(180, 0, 0.18, 'sawtooth', 0.09); tone(140, 0.14, 0.22, 'sawtooth', 0.09); }, // error
};
