const BRAND = ['#1a3df0', '#0a0a0a', '#dcd4c1', '#1f6b3a'];

/** Brief brand-colored burst. No-ops on the server, in jsdom (no 2d ctx), or under reduced motion. */
export function fireConfetti(): void {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth, H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '200',
  });
  ctx.scale(dpr, dpr);
  document.body.appendChild(canvas);

  const N = 90;
  const parts = Array.from({ length: N }, () => ({
    x: W / 2, y: H * 0.42, r: 3 + Math.sin(Date.now() + Math.random()) * 2 + Math.random() * 3,
    vx: (Math.random() - 0.5) * 11, vy: -6 - Math.random() * 9,
    color: BRAND[(Math.random() * BRAND.length) | 0], rot: Math.random() * Math.PI, life: 0,
  }));

  let raf = 0; const start = performance.now();
  function frame(now: number) {
    const t = now - start;
    ctx!.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.rot += 0.1; p.life = t;
      ctx!.save(); ctx!.translate(p.x, p.y); ctx!.rotate(p.rot);
      ctx!.globalAlpha = Math.max(0, 1 - t / 1500);
      ctx!.fillStyle = p.color; ctx!.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.4);
      ctx!.restore();
    }
    if (t < 1500) raf = requestAnimationFrame(frame);
    else { cancelAnimationFrame(raf); canvas.remove(); }
  }
  raf = requestAnimationFrame(frame);
}
