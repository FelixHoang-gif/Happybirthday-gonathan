'use strict';

/* ============ CẤU HÌNH — SỬA LỜI CHÚC & TÊN TẠI ĐÂY ============ */
const CONFIG = {
  recipient: 'My cutest son',
  from: 'Felix',
  date: 'October 31st',
  letter:
`Dearest ${'Gonathan'},

Happy Birthday! 🎂💗 I hope your special day is filled with happiness, laughter, and love. May you become happier every day and achieve all your dreams. Thank you for being in my life and for always being there when I feel sad. I hope we can stay by each other's side for a long, long time. 🫶🏻

Happy Birthday, my favorite person! 🎂💖`
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Apply names */
$$('.name').forEach(el => (el.textContent = CONFIG.recipient));
$('#dateText').textContent = CONFIG.date;
$('#fromName').textContent = CONFIG.from;

/* ============ AUDIO ENGINE (Web Audio API) ============ */
const Sound = (() => {
  let ctx, master, musicGain, timer, playing = false, enabled = true, step = 0;
  const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, C6: 1046.5 };
  // [note, beats] — Happy Birthday
  const song = [['G4',.75],['G4',.25],['A4',1],['G4',1],['C5',1],['B4',2],
                ['G4',.75],['G4',.25],['A4',1],['G4',1],['D5',1],['C5',2],
                ['G4',.75],['G4',.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',1],
                ['F5',.75],['F5',.25],['E5',1],['C5',1],['D5',1],['C5',2.5]];
  const beat = 0.5;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.35; musicGain.connect(master);
  }
  function tone(freq, t, dur, { type = 'sine', vol = .3, dest, attack = .005, decay } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (decay || dur));
    o.connect(g); g.connect(dest || master);
    o.start(t); o.stop(t + (decay || dur) + .05);
  }
  function box(freq, t, dur) { // music box: sine + inharmonic overtone
    tone(freq, t, dur, { vol: .5, dest: musicGain, decay: 1.4 });
    tone(freq * 2.76, t, dur, { vol: .12, dest: musicGain, decay: .5 });
    tone(freq * 4.1, t, dur, { vol: .05, dest: musicGain, decay: .25 });
  }
  function schedule() {
    if (!playing) return;
    const [n, b] = song[step % song.length];
    box(N[n], ctx.currentTime + .03, b * beat);
    const wait = b * beat * 1000;
    step++;
    timer = setTimeout(schedule, step % song.length === 0 ? wait + 1600 : wait);
  }
  function noise(dur, filterFreq, vol, t = ctx.currentTime, type = 'lowpass') {
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(); s.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = filterFreq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }
  return {
    init,
    suspend() { if (ctx) ctx.suspend(); },
    resume() { if (ctx && enabled) ctx.resume(); },
    startMusic() { if (!ctx || playing || !enabled) return; playing = true; step = 0; schedule(); },
    stopMusic() { playing = false; clearTimeout(timer); },
    toggleMusic() {
      enabled = !enabled;
      if (enabled) this.startMusic(); else this.stopMusic();
      return enabled;
    },
    chimes() {
      if (!ctx) return; const t = ctx.currentTime;
      [N.C6, N.G5, N.E5, N.D5, N.C5, N.G5, N.C6].forEach((f, i) =>
        tone(f * (i % 2 ? 1 : 1.5), t + i * .09, .9, { vol: .16, decay: 1.6 }));
    },
    pop() {
      if (!ctx) return; const t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(90, t + .12);
      g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.0001, t + .13);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + .15);
      noise(.06, 3000, .4, t, 'highpass');
    },
    blow() {
      if (!ctx) return; const t = ctx.currentTime;
      noise(1.1, 900, .5, t, 'bandpass');
      for (let i = 0; i < 14; i++) noise(.09, 2500, .22, t + 1 + i * .07, 'highpass'); // clap
    },
    type() { if (ctx) tone(rand(1800, 2400), ctx.currentTime, .04, { type: 'square', vol: .04 }); },
    boom() { if (ctx) { noise(.5, 500, .5); tone(70, ctx.currentTime, .4, { vol: .5 }); } },
    sparkle() { if (ctx) tone(rand(1500, 3000), ctx.currentTime, .3, { vol: .05, decay: .4 }); }
  };
})();

/* ============ CANVAS: SKY (stars + shooting stars) ============ */
const sky = $('#sky'), sctx = sky.getContext('2d');
const isMobile = matchMedia('(max-width: 700px), (pointer: coarse)').matches;
const PS = isMobile ? .55 : 1;          // hệ số giảm số hạt trên điện thoại
const MAXP = isMobile ? 320 : 900;      // số hạt tối đa cùng lúc
let W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 2);
let stars = [], shooters = [];
function resize() {
  W = innerWidth; H = innerHeight;
  [sky, fx].forEach(c => { c.width = W * DPR; c.height = H * DPR; });
  sctx.setTransform(DPR, 0, 0, DPR, 0, 0); fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  stars = Array.from({ length: Math.round(W * H / (isMobile ? 9500 : 5500)) }, () => ({
    x: Math.random() * W, y: Math.random() * H, r: rand(.4, 1.8), z: rand(.1, 1),
    f: rand(.5, 3), p: rand(0, 6.28)
  }));
}
const fx = $('#fx'), fctx = fx.getContext('2d');
addEventListener('resize', resize);

let mx = 0, my = 0;
addEventListener('pointermove', e => { mx = (e.clientX / W - .5); my = (e.clientY / H - .5); });

function drawSky(t) {
  sctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    const a = .35 + .65 * Math.abs(Math.sin(t / 1000 * s.f + s.p));
    const x = s.x - mx * 30 * s.z, y = s.y - my * 30 * s.z;
    sctx.globalAlpha = a; sctx.fillStyle = '#fff';
    sctx.beginPath(); sctx.arc(x, y, s.r, 0, 6.283); sctx.fill();
  }
  sctx.globalAlpha = 1;
  if (!reduceMotion && Math.random() < .006) {
    shooters.push({ x: rand(0, W), y: rand(0, H * .4), vx: rand(7, 11), vy: rand(3, 6), life: 1 });
  }
  shooters = shooters.filter(s => s.life > 0);
  for (const s of shooters) {
    const g = sctx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
    g.addColorStop(0, 'rgba(255,255,255,' + s.life + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
    sctx.strokeStyle = g; sctx.lineWidth = 2; sctx.beginPath();
    sctx.moveTo(s.x, s.y); sctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10); sctx.stroke();
    s.x += s.vx; s.y += s.vy; s.life -= .014;
  }
}

/* ============ CANVAS: FX PARTICLES ============ */
let parts = [];
const COLORS = ['#ffd36e', '#ff8fb8', '#b9a2f2', '#8de3ff', '#fff', '#ffb38a'];
function addDust(x, y) {
  const heart = Math.random() < .25;
  parts.push({ k: heart ? 'heart' : 'star', x, y, vx: rand(-.6, .6), vy: rand(-1.6, -.4), g: -.005,
    s: heart ? rand(8, 14) : rand(3, 7), life: 1, decay: rand(.012, .022), c: COLORS[(Math.random() * COLORS.length) | 0], rot: rand(0, 6) });
}
function burst(x, y, n, opts = {}) {
  n = Math.max(4, Math.round(n * PS));
  for (let i = 0; i < n; i++) {
    const a = rand(0, 6.283), sp = rand(1, opts.speed || 5);
    parts.push({ k: opts.kind || 'dot', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: opts.g ?? .06,
      s: opts.size || rand(2, 4), life: 1, decay: rand(.012, .025), c: opts.color || COLORS[(Math.random() * COLORS.length) | 0], rot: rand(0, 6), trail: opts.trail });
  }
}
function firework(x, y) {
  const c = COLORS[(Math.random() * 5) | 0];
  burst(x, y, 70, { speed: 6, color: c, g: .045, trail: true });
  burst(x, y, 30, { speed: 3, color: '#fff', g: .05 });
  Sound.boom();
}
function grandFireworks() {
  for (let i = 0; i < (isMobile ? 6 : 9); i++) setTimeout(() => firework(rand(W * .1, W * .9), rand(H * .1, H * .55)), i * 330);
  if (window.confetti) confetti({ particleCount: Math.round(120 * PS), spread: 100, origin: { y: .7 }, colors: ['#ffd36e', '#ff8fb8', '#b9a2f2'] });
}
function heartShower() {
  for (let i = 0; i < (isMobile ? 40 : 70); i++) setTimeout(() => parts.push({
    k: 'heart', x: rand(0, W), y: -20, vx: rand(-.4, .4), vy: rand(1.5, 3.5), g: 0,
    s: rand(10, 24), life: 1, decay: .004, c: ['#ff5c8a', '#ff8fb8', '#ffb3cf', '#ff7ba9'][i % 4], rot: 0 }), i * 55);
}
function heartBurst(x, y) {
  for (let i = 0; i < Math.round(28 * PS); i++) {
    const a = rand(0, 6.283), sp = rand(2, 7);
    parts.push({ k: 'heart', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, g: .09, s: rand(10, 26), life: 1, decay: .014, c: ['#ff5c8a', '#ff8fb8', '#ffd1e0'][i % 3], rot: 0 });
  }
}
function drawHeart(c, x, y, s) {
  c.beginPath(); c.moveTo(x, y + s * .3);
  c.bezierCurveTo(x, y - s * .2, x - s * .6, y - s * .2, x - s * .6, y + s * .15);
  c.bezierCurveTo(x - s * .6, y + s * .5, x, y + s * .75, x, y + s);
  c.bezierCurveTo(x, y + s * .75, x + s * .6, y + s * .5, x + s * .6, y + s * .15);
  c.bezierCurveTo(x + s * .6, y - s * .2, x, y - s * .2, x, y + s * .3);
  c.fill();
}
function drawStar(c, x, y, r, rot) {
  c.save(); c.translate(x, y); c.rotate(rot); c.beginPath();
  for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * .4 : r; const a = i * Math.PI / 4; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  c.closePath(); c.fill(); c.restore();
}
function drawFx() {
  fctx.clearRect(0, 0, W, H);
  parts = parts.filter(p => p.life > 0 && p.y < H + 40);
  if (parts.length > MAXP) parts.splice(0, parts.length - MAXP);
  for (const p of parts) {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life -= p.decay; p.rot += .05;
    fctx.globalAlpha = Math.max(p.life, 0); fctx.fillStyle = p.c;
    if (p.k === 'heart') drawHeart(fctx, p.x, p.y, p.s);
    else if (p.k === 'star') { if (!isMobile) { fctx.shadowColor = p.c; fctx.shadowBlur = 10; }
      drawStar(fctx, p.x, p.y, p.s, p.rot);
      if (!isMobile) fctx.shadowBlur = 0; }
    else {
      fctx.beginPath(); fctx.arc(p.x, p.y, p.s * (p.trail ? 1 : p.life + .3), 0, 6.283); fctx.fill();
      if (p.trail && Math.random() < (isMobile ? .1 : .3)) parts.push({ k: 'dot', x: p.x, y: p.y, vx: 0, vy: 0, g: .02, s: 1.2, life: .6, decay: .04, c: p.c, rot: 0 });
    }
  }
  fctx.globalAlpha = 1;
}
let lastDust = 0;
function trail(e) {
  const now = performance.now(); if (now - lastDust < 16) return; lastDust = now;
  for (let i = 0; i < (isMobile ? 1 : 2); i++) addDust(e.clientX + rand(-6, 6), e.clientY + rand(-6, 6));
}
addEventListener('pointermove', e => { if (e.pointerType !== 'touch') trail(e); });
addEventListener('touchmove', e => { const t = e.touches[0]; if (t) trail({ clientX: t.clientX, clientY: t.clientY }); }, { passive: true });

let frame = 0;
function loop(t) { if (!isMobile || (frame++ & 1)) drawSky(t); drawFx(); requestAnimationFrame(loop); }
resize(); requestAnimationFrame(loop);

/* ============ BALLOONS ============ */
const balloonLayer = $('#balloons');
const BCOLORS = ['#ffb3d1', '#c9b6ff', '#a8e6ff', '#ffe29a', '#b8f0d0', '#ffc6a8'];
function spawnBalloon() {
  if (document.hidden || balloonLayer.children.length >= (isMobile ? 5 : 9)) return;
  const b = document.createElement('div');
  b.className = 'balloon';
  b.style.left = rand(2, 94) + '%';
  b.style.setProperty('--c', BCOLORS[(Math.random() * BCOLORS.length) | 0]);
  b.style.setProperty('--d', rand(14, 24) + 's');
  b.addEventListener('animationend', e => { if (e.animationName === 'rise') b.remove(); });
  const pop = ev => {
    ev.preventDefault();
    const r = b.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 26, { speed: 5, color: getComputedStyle(b).getPropertyValue('--c'), g: .08 });
    burst(r.left + r.width / 2, r.top + r.height / 2, 10, { speed: 4, color: '#fff' });
    Sound.init(); Sound.pop(); b.remove();
  };
  b.addEventListener('pointerdown', pop);
  balloonLayer.appendChild(b);
}
setInterval(spawnBalloon, isMobile ? 3800 : 2600);
for (let i = 0; i < 3; i++) setTimeout(spawnBalloon, i * 600);

/* ============ STAGE 1: GATE ============ */
const gift = $('#giftBtn');
gift.addEventListener('click', () => {
  Sound.init();
  gift.classList.add('shake');
  Sound.chimes();
  setTimeout(() => {
    gift.classList.add('open');
    const r = gift.getBoundingClientRect();
    if (window.confetti) confetti({ particleCount: Math.round(160 * PS), spread: 120, startVelocity: 45, origin: { x: (r.left + r.width / 2) / W, y: (r.top) / H }, colors: ['#ffd36e', '#ffe9a8', '#fff2c4', '#ff8fb8'] });
    Sound.startMusic();
  }, 650);
  setTimeout(() => $('#gate').classList.add('leave'), 1500);
  setTimeout(() => {
    $('#gate').remove();
    $('#main').classList.remove('hidden');
    $('#controlBar').classList.remove('hidden');
    window.scrollTo(0, 0);
    initGallery();
  }, 2500);
}, { once: true });

/* ============ STAGE 2: CANDLE ============ */
const flame = $('#flame'), wrap = $('#cakeWrap'), wishMsg = $('#wishMsg');
const blowBtn = $('#blowBtn');
let lit = true;

function blowOut() {
  if (!lit) return; lit = false;
  Sound.init(); Sound.blow();
  flame.classList.add('wild');
  setTimeout(() => {
    flame.classList.remove('wild'); flame.classList.add('out');
    for (let i = 0; i < 7; i++) setTimeout(() => {
      const s = document.createElement('div'); s.className = 'smoke';
      s.style.setProperty('--x1', rand(-30, 30) + 'px'); s.style.setProperty('--x2', rand(-45, 45) + 'px');
      wrap.appendChild(s); setTimeout(() => s.remove(), 3300);
    }, i * 180);
    setTimeout(grandFireworks, 500);
    wishMsg.classList.add('show');
    blowBtn.disabled = true;
  }, 500);
}
function relight() {
  lit = true; flame.classList.remove('out', 'wild');
  wishMsg.classList.remove('show'); blowBtn.disabled = false;
  Sound.init(); Sound.chimes();
  $('#stage2').scrollIntoView({ behavior: 'smooth' });
}
blowBtn.addEventListener('click', blowOut);

/* ============ STAGE 3: GALLERY ============ */
function initGallery() {
  if (window.VanillaTilt) VanillaTilt.init($$('.polaroid'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); Sound.sparkle(); io.unobserve(e.target); }
  }), { threshold: .25 });
  $$('.polaroid').forEach((p, i) => { p.style.transitionDelay = (i % 2) * 150 + 'ms'; io.observe(p); });
  $$('.polaroid').forEach(p => {
    p.addEventListener('dblclick', e => { heartBurst(e.clientX, e.clientY); Sound.chimes(); });
    let last = 0;
    p.addEventListener('touchend', e => { // double-tap on touch screens
      const now = Date.now(); const t = e.changedTouches[0];
      if (now - last < 320) { e.preventDefault(); heartBurst(t.clientX, t.clientY); Sound.chimes(); last = 0; } else last = now;
    });
  });
  const sealIO = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .2 });
  sealIO.observe($('#stage4'));
}

/* ============ STAGE 4: LETTER ============ */
const seal = $('#seal');
seal.addEventListener('click', () => {
  Sound.init(); Sound.chimes();
  const r = seal.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 40, { speed: 5, color: '#ff5c8a' });
  seal.classList.add('opened'); $('#sealHint').classList.add('hidden');
  const letter = $('#letter'); letter.classList.add('show');
  const el = $('#letterText'); el.classList.add('typing');
  const text = CONFIG.letter.replace('{name}', CONFIG.recipient);
  let i = 0;
  const typeNext = () => {
    el.textContent = text.slice(0, ++i);
    if (text[i - 1] !== ' ' && text[i - 1] !== '\n') Sound.type();
    if (i < text.length) setTimeout(typeNext, text[i - 1] === '\n' ? 260 : rand(28, 60));
    else { el.classList.remove('typing'); $('#signature').classList.add('show'); heartShower(); }
  };
  setTimeout(typeNext, 600);
  letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
}, { once: true });

/* ============ MAGIC CONTROL BAR ============ */
$('#controlBar').addEventListener('click', e => {
  const act = e.target.closest('button')?.dataset.act; if (!act) return;
  Sound.init();
  if (act === 'fireworks') grandFireworks();
  if (act === 'hearts') { heartShower(); Sound.chimes(); }
  if (act === 'relight') relight();
  if (act === 'music') {
    const on = Sound.toggleMusic();
    $('#musicBtn').textContent = 'Music: ' + (on ? 'ON' : 'OFF') + ' 🎵';
  }
});

/* Tạm dừng âm thanh khi chuyển tab / khóa màn hình để tiết kiệm pin */
document.addEventListener('visibilitychange', () => (document.hidden ? Sound.suspend() : Sound.resume()));
