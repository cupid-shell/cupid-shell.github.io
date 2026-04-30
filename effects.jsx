/* global React, ReactDOM */
// Visual effects: reveal-on-scroll, magnetic buttons, cursor glow,
// animated topographic background, 3D project-card tilt, timeline path draw.
const { useEffect, useRef } = React;

// 1) ============ REVEAL ON SCROLL ============
// Adds .reveal to common section blocks; .in toggles via IntersectionObserver
function initReveal() {
  const targets = document.querySelectorAll(
    'section h2.section-title, section .section-subtitle, .info-card, .about-card-big, ' +
    '.research-card, .research-meta, .project, .skill-tile, .pub-card, .tl-item, ' +
    '.metric-strip, .hero-eyebrow, .hero-title, .hero-sub, .hero-ctas, .hero-portrait'
  );
  targets.forEach((el, i) => {
    if (el.dataset.revealBound) return;
    el.dataset.revealBound = '1';
    el.classList.add('reveal');
    el.style.transitionDelay = ((i % 6) * 60) + 'ms';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
    // If already in viewport, reveal immediately
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add('in');
    } else {
      io.observe(el);
    }
  });
}

// 2) ============ MAGNETIC BUTTONS + CURSOR GLOW ============
function initMagnetic() {
  const btns = document.querySelectorAll('.btn, .contact-link, .icon-btn, .fr-cta, .tab');
  const handlers = [];
  btns.forEach((b) => {
    const move = (e) => {
      const r = b.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const strength = b.classList.contains('btn-filled') || b.classList.contains('fr-cta') ? 0.35 : 0.22;
      b.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const leave = () => { b.style.transform = ''; };
    b.addEventListener('mousemove', move);
    b.addEventListener('mouseleave', leave);
    handlers.push([b, move, leave]);
  });
  // Cursor glow
  let glow = document.querySelector('.cursor-glow');
  if (!glow) {
    glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
  }
  let tx = 0, ty = 0, x = 0, y = 0;
  const onMove = (e) => { tx = e.clientX; ty = e.clientY; if (!glow.classList.contains('on')) glow.classList.add('on'); };
  const tick = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(tick);
  };
  window.addEventListener('mousemove', onMove);
  // Hide on touch
  window.addEventListener('touchstart', () => glow.classList.remove('on'), { once: true });
  tick();
}

// 3) ============ ANIMATED TOPOGRAPHIC BACKGROUND ============
// Renders soft drifting contour lines into a fixed canvas behind everything.
function initTopo() {
  if (document.querySelector('.topo-canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'topo-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, t = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Two slow-drifting noise-driven centers create rolling contour lines
  function draw() {
    t += 0.0018;
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6750A4';
    const lineAlpha = isDark ? 0.12 : 0.10;
    ctx.lineWidth = 1;
    const cx1 = W * (0.3 + 0.1 * Math.sin(t * 1.2));
    const cy1 = H * (0.4 + 0.08 * Math.cos(t * 0.9));
    const cx2 = W * (0.75 + 0.08 * Math.cos(t * 0.7));
    const cy2 = H * (0.65 + 0.1 * Math.sin(t * 1.1));
    const ringCount = 14;
    for (let i = 0; i < ringCount; i++) {
      const r = 60 + i * 60 + Math.sin(t * 2 + i) * 8;
      const a = lineAlpha * (1 - i / ringCount);
      ctx.strokeStyle = hexA(accent, a);
      ctx.beginPath();
      // Wobbly ring around c1
      for (let ang = 0; ang <= Math.PI * 2 + 0.05; ang += 0.08) {
        const wob = Math.sin(ang * 3 + t * 1.5 + i * 0.6) * 6 + Math.cos(ang * 5 + t * 0.9) * 4;
        const px = cx1 + (r + wob) * Math.cos(ang);
        const py = cy1 + (r + wob) * Math.sin(ang);
        if (ang === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // Wobbly ring around c2 (offset phase)
      ctx.strokeStyle = hexA(accent, a * 0.7);
      ctx.beginPath();
      for (let ang = 0; ang <= Math.PI * 2 + 0.05; ang += 0.08) {
        const wob = Math.sin(ang * 4 + t * 1.2 + i * 0.5) * 5 + Math.cos(ang * 6 + t * 0.8) * 4;
        const r2 = 50 + i * 55;
        const px = cx2 + (r2 + wob) * Math.cos(ang);
        const py = cy2 + (r2 + wob) * Math.sin(ang);
        if (ang === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  function hexA(hex, a) {
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  draw();
}

// 4) ============ 3D TILT ON PROJECT CARDS ============
function initTilt() {
  const cards = document.querySelectorAll('.project, .pub-card, .research-card, .skill-tile, .info-card');
  cards.forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';
    let rafId = null;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - 0.5) * 8;   // rotateY
      const rx = (0.5 - py) * 8;   // rotateX
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
        // Sheen
        let sheen = card.querySelector('.tilt-sheen');
        if (!sheen) {
          sheen = document.createElement('div');
          sheen.className = 'tilt-sheen';
          card.appendChild(sheen);
        }
        sheen.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,${document.documentElement.getAttribute('data-theme') === 'dark' ? 0.08 : 0.18}), transparent 55%)`;
      });
    };
    const onLeave = () => {
      card.style.transform = '';
      const sheen = card.querySelector('.tilt-sheen');
      if (sheen) sheen.style.background = 'transparent';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
}

// 5) ============ TIMELINE PATH DRAW ============
function initTimelineDraw() {
  const tl = document.querySelector('.timeline');
  if (!tl) return;
  tl.classList.add('tl-anim');
  // Add SVG path overlay if not present
  if (!tl.querySelector('.tl-path')) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('tl-path');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = `<line x1="1" y1="0" x2="1" y2="100%" stroke="currentColor" stroke-width="2" pathLength="1" />`;
    tl.appendChild(svg);
  }
  const dots = tl.querySelectorAll('.tl-item');
  dots.forEach((d, i) => d.style.setProperty('--tl-i', i));

  const update = () => {
    const r = tl.getBoundingClientRect();
    const vh = window.innerHeight;
    // Visible portion 0..1
    const visStart = Math.max(0, vh * 0.85 - r.top);
    const total = r.height;
    const ratio = Math.min(1, Math.max(0, visStart / total));
    tl.style.setProperty('--tl-progress', ratio.toFixed(3));
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ============ BOOTSTRAP ============
function boot() {
  // Wait for the React tree to mount
  const start = () => {
    const root = document.getElementById('root');
    if (!root || !root.children.length) { return setTimeout(start, 80); }
    initReveal();
    initMagnetic();
    initTopo();
    initTilt();
    initTimelineDraw();

    // Re-bind tilt when new cards appear (e.g. tab/route changes — defensive)
    const mo = new MutationObserver(() => {
      initTilt();
      initReveal();
      initTimelineDraw();
    });
    mo.observe(root, { childList: true, subtree: true });
  };
  start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
