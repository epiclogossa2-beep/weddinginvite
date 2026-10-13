/* ===========================================================
   A & Z — Wedding Site · script.js
   Edit the CONFIG block below to change date / greeting.
   =========================================================== */
const CONFIG = {
  // Counts down to the ceremony: 10 April 2027, 15:00 South Africa time (UTC+2).
  weddingDate: new Date('2027-04-10T15:00:00+02:00'),
  defaultGreeting: 'Dear Guest,',
  // Personalised links: yoursite.com/?guest=The-Naidoo-Family  ->  "Dear The Naidoo Family,"
  guestParam: 'guest',

  // --- RSVP: confirmations are emailed here (via FormSubmit.co, no server needed) ---
  rsvpEmail: 'epiclogossa2@gmail.com',

  // --- Venue map link (opens Google Maps). Replace with the exact Google Maps share link when you have it. ---
  venueMapUrl: 'https://www.google.com/maps/search/?api=1&query=Pont+de+Val',

  // --- Hotel booking: paste the booking link here (leave '' to show "coming soon") ---
  hotelBookingUrl: '',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = (n, l = 2) => String(n).padStart(l, '0');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------------- Countdown ---------------- */
function tick() {
  let diff = CONFIG.weddingDate - new Date();
  if (diff < 0) diff = 0;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  const vals = { days: pad(d, 3), hours: pad(h), minutes: pad(m), seconds: pad(s) };
  $$('[data-unit]').forEach(el => { el.textContent = vals[el.dataset.unit]; });
}
tick();
setInterval(tick, 1000);

/* ---------------- Personalised greeting ---------------- */
(function greeting() {
  const g = new URLSearchParams(location.search).get(CONFIG.guestParam);
  const el = $('#guestGreeting');
  el.textContent = g ? `Dear ${g.replace(/[-_+]/g, ' ').replace(/[<>]/g, '')},` : CONFIG.defaultGreeting;
})();

/* ---------------- Gold dust ---------------- */
(function dust() {
  const box = $('#goldDust');
  const n = window.innerWidth < 700 ? 22 : 40;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    const size = 1.5 + Math.random() * 3;
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `animation-duration:${8 + Math.random() * 10}s;animation-delay:${Math.random() * 8}s;` +
      `--dx:${(Math.random() - .5) * 120}px`;
    box.appendChild(p);
  }
})();

/* ---------------- Falling autumn leaves (canvas) ---------------- */
const leaves = (function () {
  const cv = $('#leaves');
  const ctx = cv.getContext('2d');
  let W, H, items = [], running = true;
  const colors = ['#c9a77a', '#e6cfa8', '#848b79', '#a8ae9b', '#b89562'];
  function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
  addEventListener('resize', resize); resize();

  function make(initial) {
    return {
      x: Math.random() * W, y: initial ? Math.random() * H : -20,
      s: 6 + Math.random() * 9, vy: .4 + Math.random() * .8, vx: (Math.random() - .5) * .4,
      r: Math.random() * Math.PI * 2, vr: (Math.random() - .5) * .02,
      sw: Math.random() * Math.PI * 2, c: colors[(Math.random() * colors.length) | 0],
      a: .35 + Math.random() * .45,
    };
  }
  const count = innerWidth < 700 ? 8 : 15;   // fewer leaves = calmer; raise these numbers for more
  for (let i = 0; i < count; i++) items.push(make(true));

  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x, l.y); ctx.rotate(l.r);
    ctx.globalAlpha = l.a; ctx.fillStyle = l.c;
    ctx.beginPath();
    ctx.moveTo(0, -l.s);
    ctx.bezierCurveTo(l.s * .9, -l.s * .4, l.s * .6, l.s * .7, 0, l.s);
    ctx.bezierCurveTo(-l.s * .6, l.s * .7, -l.s * .9, -l.s * .4, 0, -l.s);
    ctx.fill();
    ctx.globalAlpha = l.a * .8; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = .6;
    ctx.beginPath(); ctx.moveTo(0, -l.s); ctx.lineTo(0, l.s); ctx.stroke();
    ctx.restore();
  }
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    items.forEach((l, i) => {
      l.sw += .02; l.x += l.vx + Math.sin(l.sw) * .5; l.y += l.vy; l.r += l.vr;
      if (l.y > H + 20) items[i] = make(false);
      drawLeaf(l);
    });
    requestAnimationFrame(frame);
  }
  if (!prefersReduced) frame();
  return { stop() { running = false; ctx.clearRect(0, 0, W, H); } };
})();

/* ---------------- Intro sequence ---------------- */
const body = document.body;
const intro = $('#intro');
const stageLogo = $('#stageLogo');
const stageWelcome = $('#stageWelcome');
const stageEnv = $('#stageEnvelope');
const envWrap = $('#envelopeWrap');
const envelope = $('#envelope');
const card = $('#card');
const seal = $('#seal');
const hint = $('#envHint');
const enterBtn = $('#enterBtn');
const curtain = $('#curtain');
const site = $('#site');
const skipBtn = $('#skipBtn');
let opened = false, entered = false;

// Timeline (milliseconds). Adjust these to speed up or slow down each stage.
const TIMING = {
  welcomeIn: 5000,   // welcome line starts easing in (logo has faded out by now)
  welcomeOut: 8800,  // welcome line fades away
  toSage: 9000,      // background changes from white to green
  envelopeIn: 9800,  // envelope arrives
  float: 11300,      // envelope starts gently floating
};
const timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
later(() => stageWelcome.classList.add('show'), TIMING.welcomeIn);
later(() => stageWelcome.classList.add('out'), TIMING.welcomeOut);
later(() => { intro.classList.add('sage'); intro.dataset.cursorTheme = 'dark'; }, TIMING.toSage);
later(() => stageEnv.classList.add('show'), TIMING.envelopeIn);
later(() => envWrap.classList.add('floating'), TIMING.float);

// Envelope parallax tilt
if (finePointer && !prefersReduced) {
  addEventListener('mousemove', e => {
    if (opened) { envelope.style.transform = ''; return; }
    const x = (e.clientX / innerWidth - .5) * 2;
    const y = (e.clientY / innerHeight - .5) * 2;
    envelope.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
  });
}

// Size the invitation card so it rises out of the envelope and the whole group stays centred
const envFit = $('#envFit');
function layoutOpen() {
  const envH = envelope.offsetHeight;
  const H = $('.card-inner', card).offsetHeight;
  card.style.top = (envH * 0.55 - H) + 'px';
  card.style.bottom = '45%';
  envWrap.style.marginTop = Math.max(0, H - envH * 0.55 - 100) + 'px';
  fitEnvelope();
}
// Scale the whole envelope group down when the screen is too short (small phones, landscape)
function fitEnvelope() {
  if (!envFit) return;
  const envH = envelope.offsetHeight;
  let need;
  if (opened) {
    const H = $('.card-inner', card).offsetHeight;
    need = H + envH * 0.45 + 110;           // card above + envelope + logo below
  } else {
    need = envH + 140;                       // envelope + hint above
  }
  const fit = Math.max(.42, Math.min(1, (innerHeight - (opened ? 104 : 56)) / need));
  envFit.style.setProperty('--fit', fit.toFixed(3));
  // only transform when we really need to shrink: any transform on the group makes the text soft
  envFit.style.transform = fit < .995 ? `scale(${fit.toFixed(3)})` : 'none';
}
addEventListener('resize', () => { if (opened && !entered) layoutOpen(); else fitEnvelope(); });
addEventListener('orientationchange', () => setTimeout(() => { if (opened && !entered) layoutOpen(); else fitEnvelope(); }, 250));
fitEnvelope();

function openEnvelope() {
  if (opened) return;
  opened = true;
  envWrap.classList.remove('floating');
  envelope.style.transform = '';
  hint.classList.add('hide');
  envWrap.classList.add('opened');
  envelope.classList.add('open');
  layoutOpen();
  // once the flap has finished turning, drop the 3D layers so the card text renders pin-sharp
  setTimeout(() => { envWrap.classList.add('settled'); envelope.classList.add('settled'); }, 2300);
}
seal.addEventListener('click', openEnvelope);
envelope.addEventListener('click', e => { if (!opened && e.target.closest('.env-front,.env-flap,.env-back')) openEnvelope(); });

function enterSite() {
  if (entered) return;
  entered = true;
  timers.forEach(clearTimeout);
  curtain.classList.add('go');
  setTimeout(() => {
    body.classList.remove('is-locked');
    site.classList.add('visible');
    site.setAttribute('aria-hidden', 'false');
    window.scrollTo(0, 0);
    intro.classList.add('is-done');
    runReveals();
    try { sessionStorage.setItem('az-intro-seen', '1'); } catch (e) {}
  }, 1500);
  setTimeout(() => intro.remove(), 3200);
}
enterBtn.addEventListener('click', enterSite);
skipBtn.addEventListener('click', () => { enterSite(); });

// Returning visitors in the same session skip straight in
try {
  if (sessionStorage.getItem('az-intro-seen') === '1') {
    timers.forEach(clearTimeout);
    intro.remove();
    body.classList.remove('is-locked');
    site.classList.add('visible');
    site.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(runReveals);
  }
} catch (e) {}

/* ---------------- Scroll reveals + nav + parallax ---------------- */
let io;
function runReveals() {
  if (io) return;
  io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        // photos are revealed with a clip-path, so we watch their figure and reveal the photo inside
        const t = en.target._reveal || en.target;
        t.classList.add('in'); io.unobserve(en.target);
      }
    });
  }, { threshold: .15 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (el.closest('.hero') ? i * 0.15 : 0) + 's';
    const fig = el.classList.contains('m-img') ? el.closest('.m') : null;
    if (fig) { fig._reveal = el; io.observe(fig); } else io.observe(el);
  });
}
const nav = $('#nav');
const heroBg = $('#heroBg');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 60);
  if (!prefersReduced && scrollY < innerHeight * 1.2) heroBg.style.transform = `scale(1.08) translateY(${scrollY * .18}px)`;
}, { passive: true });

/* ---------------- Rings cursor ---------------- */
(function cursor() {
  if (!finePointer) return;
  const c = $('#cursor');
  document.documentElement.classList.add('has-cursor');
  let x = -100, y = -100, cx = -100, cy = -100, lastPetal = 0, lastX = 0, lastY = 0;

  addEventListener('mousemove', e => {
    x = e.clientX; y = e.clientY; c.style.opacity = 1;
    // adapt colour to what's underneath
    const under = document.elementFromPoint(x, y);
    const inEnvelopeCard = under && under.closest('.card,.env-back,.env-front,.env-flap');
    const sec = under && under.closest('[data-cursor-theme]');
    const light = inEnvelopeCard || (sec && sec.dataset.cursorTheme === 'light');
    c.classList.toggle('on-light', !!light);
    c.classList.toggle('is-hover', !!(under && under.closest('a,button')));

    // petal trail
    const now = performance.now();
    if (!prefersReduced && now - lastPetal > 70 && Math.hypot(x - lastX, y - lastY) > 14) {
      lastPetal = now; lastX = x; lastY = y;
      const p = document.createElement('span');
      p.className = 'petal' + (light ? ' on-light' : '');
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.setProperty('--dx', (Math.random() - .5) * 40 + 'px');
      p.style.setProperty('--dy', 20 + Math.random() * 34 + 'px');
      p.style.setProperty('--r', (Math.random() - .5) * 240 + 'deg');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1100);
    }
  });
  addEventListener('mousedown', () => c.classList.add('is-down'));
  addEventListener('mouseup', () => c.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => (c.style.opacity = 0));

  (function loop() {
    cx += (x - cx) * .22; cy += (y - cy) * .22;
    // hotspot is the centre of the rings
    c.style.transform = `translate3d(${cx - 23}px,${cy - 23}px,0)`;
    requestAnimationFrame(loop);
  })();
})();


/* ===========================================================
   v2 additions
   =========================================================== */

/* ---------- Eucalyptus line-art branches (procedural SVG) ---------- */
(function eucalyptus() {
  function rng(seed) { let t = seed * 9301 + 49297; return () => ((t = (t * 9301 + 49297) % 233280) / 233280); }
  $$('.euc').forEach(el => {
    const n = +el.dataset.len || 6, r = rng(+el.dataset.seed || 1);
    // stem is a gentle curve running down-right from (0,0)
    const L = 300, pts = [];
    for (let i = 0; i <= n * 4; i++) {
      const t = i / (n * 4);
      pts.push([t * L * 1.0, Math.sin(t * 2.1) * 34 + t * t * 120]);
    }
    let d = `M${pts[0][0]},${pts[0][1]}`;
    pts.forEach(p => { d += ` L${p[0].toFixed(1)},${p[1].toFixed(1)}`; });
    let leaves = '';
    for (let i = 1; i <= n; i++) {
      const p = pts[i * 4], q = pts[Math.min(i * 4 + 1, pts.length - 1)];
      const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
      const size = 20 + r() * 12 + (i < 3 ? 6 : 0);
      [-1, 1].forEach(side => {
        const a = ang + side * (62 + r() * 18);
        const fill = ['#a9b09c', '#9aa28c', '#b9bfae', '#8e967f'][(r() * 4) | 0];
        leaves += `<g transform="translate(${p[0].toFixed(1)},${p[1].toFixed(1)}) rotate(${a.toFixed(1)})">
          <path class="leaf" fill="${fill}" fill-opacity=".55" d="M0,0 C${size * .3},-${size * .55} ${size * 1.1},-${size * .55} ${size * 1.35},0 C${size * 1.1},${size * .55} ${size * .3},${size * .55} 0,0Z"/>
          <path d="M2,0 L${size * 1.2},0" stroke="#fff" stroke-opacity=".6" stroke-width=".6" fill="none"/></g>`;
      });
    }
    const end = pts[pts.length - 1];
    leaves += `<g transform="translate(${end[0]},${end[1]}) rotate(40)"><path class="leaf" fill="#a9b09c" fill-opacity=".6" d="M0,0 C8,-12 26,-12 32,0 C26,12 8,12 0,0Z"/></g>`;
    el.innerHTML = `<svg viewBox="-10 -50 340 260" aria-hidden="true"><g class="sway"><path class="stem" d="${d}"/>${leaves}</g></svg>`;
  });
})();

/* ---------- Torn paper edges ---------- */
(function torn() {
  $$('.torn').forEach(el => {
    const r = Math.random, n = 46, top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const x = (i / n * 100).toFixed(2) + '%';
      top.push(`${x} ${(2 + r() * 16).toFixed(1)}px`);
      bot.push(`${((n - i) / n * 100).toFixed(2)}% calc(100% - ${(2 + r() * 16).toFixed(1)}px)`);
    }
    el.style.clipPath = `polygon(${top.join(',')},${bot.join(',')})`;
  });
})();

/* ---------- Timeline draw-in ---------- */
(function timeline() {
  const tl = $('#timeline'); if (!tl) return;
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { tl.classList.add('in'); o.disconnect(); } }, { threshold: .25 }).observe(tl);
})();

/* ---------- Map + hotel links ---------- */
$$('[data-map]').forEach(a => { a.href = CONFIG.venueMapUrl; });
(function hotel() {
  const b = $('#bookBtn'), note = $('#bookNote');
  if (CONFIG.hotelBookingUrl) { b.href = CONFIG.hotelBookingUrl; }
  else {
    b.removeAttribute('href'); b.style.opacity = .55; b.style.pointerEvents = 'none';
    note.textContent = 'Booking link coming soon';
  }
})();

/* ---------- Dress code: names of the colours to avoid ---------- */
$$('.avoid .av-row button').forEach(b => b.addEventListener('click', () => {
  $$('.avoid .av-row button').forEach(x => x.classList.remove('sel'));
  b.classList.add('sel'); $('#avoidName').textContent = b.dataset.name;
}));

/* ---------- Dress code swatches ---------- */
$$('.swatches button').forEach(b => b.addEventListener('click', () => {
  $$('.swatches button').forEach(x => x.classList.remove('sel'));
  b.classList.add('sel'); $('#swatchName').textContent = b.dataset.name;
}));

/* ---------- Mobile menu + active link ---------- */
(function menu() {
  const t = $('#navToggle'), n = $('#navLinks');
  const close = () => { n.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); body.classList.remove('menu-open'); };
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  addEventListener('resize', () => { if (innerWidth > 760) close(); });
  t.addEventListener('click', () => { const o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o); body.classList.toggle('menu-open', o); });
  $$('a', n).forEach(a => a.addEventListener('click', close));
  const links = $$('a[href^="#"]', n);
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  addEventListener('scroll', () => {
    let cur = null; secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });
})();

/* ---------- Add to calendar (.ics download) ---------- */
$('#addCal').addEventListener('click', () => {
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AZ Wedding//EN', 'BEGIN:VEVENT',
    'UID:amelia-zivan-20270410@wedding', 'DTSTAMP:20260101T000000Z',
    'DTSTART:20270410T120000Z', 'DTEND:20270410T210000Z',   // 14:00 arrival to 23:00 (SAST)
    'SUMMARY:Amelia & Zivan\'s wedding', 'LOCATION:Pont de Val',
    'DESCRIPTION:Guest arrival 2:00 PM\\, ceremony 3:00 PM\\, reception from 5:30 PM. We can\'t wait to celebrate with you!', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'Amelia-and-Zivan-Wedding.ics'; a.click();
});

/* ---------- RSVP form ---------- */
(function rsvp() {
  const form = $('#rsvpForm'), status = $('#rsvpStatus'), btn = $('#rsvpBtn');
  const extra = $('#attendExtra'), guests = $('#guests');
  const g = new URLSearchParams(location.search).get(CONFIG.guestParam);
  if (g) $('#inviteName').value = g.replace(/[-_+]/g, ' ');

  $$('[data-step]').forEach(b => b.addEventListener('click', () => {
    guests.value = Math.min(+guests.max, Math.max(1, +guests.value + +b.dataset.step));
  }));
  $$('input[name=attending]').forEach(r => r.addEventListener('change', () => {
    extra.classList.toggle('off', r.value.startsWith('Regret') && r.checked);
    $('.choice').classList.remove('err');
  }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = ''; status.style.color = '';
    let ok = true;
    $$('.fld.err,.choice.err', form).forEach(x => x.classList.remove('err'));
    ['name', 'email'].forEach(n => {
      const i = form.elements[n];
      if (!i.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(i.value))) { i.closest('.fld').classList.add('err'); ok = false; }
    });
    if (!form.elements.attending.value) { $('.choice').classList.add('err'); ok = false; }
    if (!ok) { status.textContent = 'Please complete the highlighted fields.'; return; }
    if (form.elements._honey.value) return; // bot

    const declined = form.elements.attending.value.startsWith('Regret');
    const data = {
      Name: form.elements.name.value.trim(),
      Email: form.elements.email.value.trim(),
      Phone: form.elements.phone.value.trim() || '-',
      Attendance: form.elements.attending.value,
      Guests: declined ? '0' : guests.value,
      'Party names': declined ? '-' : (form.elements.party_names.value.trim() || '-'),
      Dietary: declined ? '-' : (form.elements.dietary.value.trim() || '-'),
      Message: form.elements.message.value.trim() || '-',
      'Invite link name': $('#inviteName').value || '-',
      _subject: `RSVP: ${form.elements.name.value.trim()} — ${form.elements.attending.value}`,
      _template: 'table', _captcha: 'false', _replyto: form.elements.email.value.trim(),
    };
    btn.disabled = true; btn.firstElementChild.textContent = 'Sending...';
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + CONFIG.rsvpEmail, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === 'false' || out.success === false) throw new Error(out.message || 'fail');
      form.hidden = true; $('#rsvpThanks').hidden = false;
      $('#rsvpThanks').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      status.textContent = 'Sorry, that did not send. Please check your connection and try again.';
      btn.disabled = false; btn.firstElementChild.textContent = 'Send my reply';
    }
  });
})();


/* ===========================================================
   v5 additions — premium interactions
   =========================================================== */

/* ---------- Scroll progress hairline ---------- */
(function progress() {
  const bar = $('#progress'); if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + '%';
  };
  addEventListener('scroll', update, { passive: true }); update();
})();

/* ---------- Photo parallax (gentle drift at different speeds) ---------- */
(function parallax() {
  if (prefersReduced) return;
  const items = $$('[data-speed]'); if (!items.length) return;
  let ticking = false;
  function run() {
    ticking = false;
    if (innerWidth < 760) { items.forEach(el => (el.style.transform = '')); return; }
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const offset = (r.top + r.height / 2) - innerHeight / 2;
      el.style.transform = `translate3d(0,${(offset * +el.dataset.speed).toFixed(1)}px,0)`;
    });
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener('resize', run);
  run();
})();

/* ---------- Photo viewer (click any collage photo) ---------- */
(function lightbox() {
  const lb = $('#lb'), img = $('#lbImg');
  const photos = $$('.m-img img'); if (!lb || !photos.length) return;
  let i = 0;
  function show(n, instant) {
    i = (n + photos.length) % photos.length;
    if (instant) { img.src = photos[i].src; img.alt = photos[i].alt; return; }
    img.classList.add('swap');
    setTimeout(() => { img.src = photos[i].src; img.alt = photos[i].alt; img.classList.remove('swap'); }, 220);
  }
  function open(n) { show(n, true); lb.hidden = false; requestAnimationFrame(() => lb.classList.add('open')); body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('open'); body.style.overflow = ''; }
  photos.forEach((p, n) => p.closest('.m-img').addEventListener('click', () => open(n)));
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(i - 1));
  $('#lbNext').addEventListener('click', () => show(i + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

/* ---------- Itinerary: highlight the step nearest the middle of the screen ---------- */
(function timelineActive() {
  const items = $$('#timeline li'); if (!items.length) return;
  function run() {
    let best = null, bestD = 1e9;
    items.forEach(li => {
      const r = li.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
      if (d < bestD) { bestD = d; best = li; }
    });
    items.forEach(li => li.classList.toggle('active', li === best && bestD < innerHeight * .4));
  }
  addEventListener('scroll', run, { passive: true }); run();
})();

/* ---------- Soft 3D tilt on the venue cards ---------- */
(function tilt() {
  if (!finePointer || prefersReduced) return;
  $$('.detail, .dc, .stay-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();


/* ---------- Image filename fallbacks (e.g. "venue 2.jpg" vs "venue_2.jpg") ---------- */
(function imgFallbacks() {
  $$('img[data-fallbacks]').forEach(img => {
    const list = img.dataset.fallbacks.split(',').map(x => x.trim()).filter(Boolean);
    const next = () => { const n = list.shift(); if (n) img.src = n; };
    img.addEventListener('error', next);
    if (img.complete && img.naturalWidth === 0) next();   // it already failed before this script ran
  });
})();
