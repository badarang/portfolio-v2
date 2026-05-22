import { useEffect, useRef } from "react";

const layers = [
  { color: [34, 211, 238], baseFrac: 0.4, amp: 26, waves: 2.0, speed: 0.5, alpha: 0.13, phase: 0.0 },
  { color: [255, 61, 129], baseFrac: 0.5, amp: 30, waves: 1.5, speed: -0.38, alpha: 0.1, phase: 2.1 },
  { color: [163, 230, 53], baseFrac: 0.58, amp: 20, waves: 2.7, speed: 0.7, alpha: 0.09, phase: 4.3 },
];

// 여러 무리수 배수의 sine 합 + 저주파 envelope 로 마루 높이를 들쭉날쭉하게.
function waveOffset(x, f, t, amp, phase) {
  const env = 1 + 0.5 * Math.sin(x * f * 0.37 + t * 0.21 + phase);
  let y = Math.sin(x * f + t * 1.08 + phase) * amp * env;
  y += Math.sin(x * f * 1.73 - t * 0.74 + phase * 1.3 + Math.sin(x * f * 0.5 + t * 0.43) * 0.6) * amp * 0.42;
  y += Math.sin(x * f * 2.61 + t * 1.43 + phase * 0.7) * amp * 0.22;
  y += Math.sin(x * f * 4.13 - t * 0.92 + phase * 2.1) * amp * 0.12;
  return y;
}

export default function Waves() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = 1;
    let raf;
    let W = 0; // device px
    let H = 0;
    let running = true;
    let lastDraw = 0;

    const resize = () => {
      W = Math.floor(canvas.clientWidth * dpr);
      H = Math.floor(canvas.clientHeight * dpr);
      canvas.width = W;
      canvas.height = H;
      draw(performance.now(), true);
    };

    const start = performance.now();
    const frameMs = 1000 / 24;
    const step = 18;

    const draw = (now, force = false) => {
      if (W <= 0 || H <= 0) return;
      if (!force && now - lastDraw < frameMs) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      const t = (now - start) / 1000;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (const L of layers) {
        const baseline = H * L.baseFrac;
        const f = (Math.PI * 2 * L.waves) / W;
        const tt = reducedMotion.matches ? 0 : t * L.speed;
        const amp = L.amp * dpr;
        const [r, g, b] = L.color;
        const grad = ctx.createLinearGradient(0, baseline - amp * 2.2, 0, H);

        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.22, `rgba(${r},${g},${b},${L.alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W + step; x += step) {
          const topY = baseline - waveOffset(x, f, tt, amp, L.phase);
          ctx.lineTo(x, topY);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      if (!force && running && !reducedMotion.matches) {
        raf = requestAnimationFrame(draw);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running) {
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    });

    const onMotionChange = () => {
      cancelAnimationFrame(raf);
      draw(performance.now(), true);
      if (running && !reducedMotion.matches) {
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", onMotionChange);
    observer.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[52vh] w-full opacity-70 mix-blend-screen"
    />
  );
}
