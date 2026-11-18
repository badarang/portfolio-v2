import { useEffect, useRef, useState } from "react";

// 이지툰 "벽부수기" 오마주. Hero 전체를 덮는 캔버스에서 스틱맨이 벽 하나를 상대로
// 기술을 바꿔가며 공격하는 자동 연출이다. 조작은 없다.
//
// 두 겹으로 그린다.
//  - 흑백 겹: 스틱맨과 벽. 저해상도로 그려 2색으로 양자화하고, 가변 프레임(10~30fps)으로 끊어 갱신한다.
//  - 컬러 겹: 픽셀 파티클과 파편. 매 프레임(60fps) 부드럽게 움직인다.
//
// 캐릭터 애니메이션은 포즈 스프링(오버슈트, 팔로스루), 곡선 팔다리, 따로 노는 머리의
// 스쿼시 앤 스트레치, 자동 스미어로 만든다. 타격의 충격은 data-jolt 가 붙은 글자에도 전달된다.

const INK = "#fff"; // 흑백 겹에서 그려지는 색 (양자화 후 종이색)
const VOID = "#000"; // 비우는 색 (양자화 후 투명)
const PAPER = "#f3efe6";
const PINK = "#ff3d81";
const CYAN = "#22d3ee";
const LIME = "#a3e635";
const GOLD = "#fbbf24";
const ACC = [PINK, CYAN, LIME];

const rand = (a, b) => a + Math.random() * (b - a);
const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOutBack = (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInQuad = (t) => t * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// 몸 치수 (논리 픽셀)
const TORSO = 8;
const UA = 6.5;
const FA = 6.5;
const TH = 8;
const SHIN = 8.5;
const HEAD = 7;

// [0 기울기, 1 앞팔, 2 앞팔꿈치, 3 뒷팔, 4 뒷팔꿈치, 5 앞다리, 6 앞무릎, 7 뒷다리, 8 뒷무릎, 9 골반 높이, 10 척추 굽힘]
// 각도 0 = 아래, 양수 = 벽 쪽. 척추 굽힘 양수 = 등을 둥글게 만다.
const P = {
  idle: [0.04, 0.35, 0.45, -0.3, 0.35, 0.2, -0.12, -0.2, -0.1, 15.5, 0.15],
  guard: [0.28, 0.9, 1.5, 0.5, 1.7, 0.5, -0.6, -0.45, -0.25, 14, 0.5],
  punchF: [0.55, 1.55, 0.02, 0.3, 2.0, 0.75, -0.8, -0.9, -0.2, 14, -0.3],
  punchB: [0.45, 0.4, 2.0, 1.55, 0.02, 0.6, -0.7, -0.8, -0.25, 14, -0.2],
  windup: [-0.45, -1.7, 1.5, 0.9, 1.2, 0.4, -0.5, -0.7, -0.5, 13, -0.8],
  kick: [-0.7, -0.6, 1.0, -1.3, 0.6, 1.6, 0, -0.2, -0.6, 15.5, -0.6],
  crouch: [0.6, -0.8, 0.7, -1.0, 0.6, 1.1, -1.9, 0.6, -1.7, 7, 0.9],
  air: [0.3, -0.7, 0.9, -1.5, 0.4, 1.0, -1.5, -0.5, -1.0, 15.5, 0.4],
  flykick: [-0.8, -1.1, 0.8, -1.7, 0.4, 1.57, 0, 0.7, -2.0, 15.5, -0.5],
  upkick: [-0.9, -1.0, 0.6, -1.8, 0.5, 2.3, 0, 0.3, -1.6, 15.5, -0.7],
  overhead: [-0.4, 2.95, 0.1, 2.75, 0.2, 0.35, -0.4, -0.5, -0.3, 15, -0.9],
  slam: [0.85, 1.05, 0.1, 0.95, 0.2, 0.9, -1.2, -0.7, -0.5, 11, 0.8],
  aim: [0.08, 1.57, 0, 1.42, 0.1, 0.35, -0.2, -0.35, -0.15, 15.5, 0],
  iai: [0.8, -0.3, 1.2, -0.5, 0.9, 1.2, -1.5, -0.9, -0.6, 9, 0.6],
  iaiEnd: [0.7, 1.9, 0, -1.0, 0.4, 1.2, -1.3, -1.1, -0.2, 10, -0.2],
  sheath: [0.05, -0.2, 0.9, -0.3, 0.8, 0.2, -0.1, -0.2, -0.1, 15.5, 0],
  throwUp: [-0.35, 2.7, -0.3, 0.6, 1.0, 0.4, -0.4, -0.5, -0.3, 15, -0.6],
  throwEnd: [0.7, 1.3, 0.1, -1.0, 0.5, 0.8, -0.9, -0.9, -0.3, 13, 0.5],
  cheer: [0, 2.8, 0.25, -2.8, -0.25, 0.25, -0.1, -0.25, -0.1, 15.5, -0.3],
  charge: [0.7, -0.6, 1.6, -0.9, 1.5, 1.0, -1.7, 0.4, -1.5, 8, 1],
  tada: [-0.15, 2.6, 0.3, -0.9, 1.9, 0.35, -0.15, -0.3, -0.1, 15.5, -0.5],
  run: [0.95, -1.3, 0.5, 1.2, 1.3, 1.25, -1.2, -1.0, -0.9, 11, 0.4],
  skid: [-0.35, 0.9, 0.6, 0.6, 0.9, 0.9, -0.5, -0.5, -1.0, 12, -0.4],
  rise: [0.2, 2.4, 0.3, 2.2, 0.4, 0.15, -0.2, -0.25, -0.3, 15.5, -0.3],
  tuck: [0.5, 0.9, 1.6, 0.6, 1.7, 1.3, -2.0, 0.9, -1.9, 12, 0.9],
  drop: [-0.1, 2.0, 0.4, -2.0, -0.4, 0.3, -0.3, -0.2, -0.4, 15.5, -0.3],
  hover: [0.15, 0.6, 0.9, -0.5, 0.7, 0.5, -0.9, 0.1, -0.8, 14, 0.2],
  hoverAim: [0, 1.57, 0, -1.57, 0, 0.5, -0.9, 0.1, -0.8, 14, 0],
  hold: [0.0, 2.95, 0.15, 3.3, -0.15, 0.4, -0.5, -0.4, -0.4, 14, -0.2],
};
// 관절이 사람처럼 보이는 범위. 스프링이 출렁여도 팔꿈치와 무릎이 거꾸로 꺾이지 않게 막는다.
const LIMIT = { 0: [-1.1, 1.1], 2: [-0.45, 2.4], 4: [-0.45, 2.4], 6: [-2.2, 0.12], 8: [-2.2, 0.12], 9: [5, 17], 10: [-1.2, 1.2] };
// 부위별 스프링: 몸통과 다리는 단단하게, 팔과 팔꿈치는 느슨하게 → 팔이 늦게 따라오고 출렁인다.
const SPRING_K = [230, 300, 190, 280, 180, 260, 230, 260, 230, 250, 200];
const SPRING_D = [24, 22, 16, 22, 16, 24, 21, 24, 21, 22, 18];

const MOVES = ["PUNCH RUSH", "ROUNDHOUSE", "HAMMER", "CROSS SLASH", "TWIN BAZOOKA", "REVOLVERS", "LETTER THROW", "HEAD BOMB", "FINISHER"];
const SFX_NAMES = [
  "punch1", "punch2", "punch3", "kick", "heavy", "rock1", "rock2", "debris", "shatter", "slash", "swish",
  "gun", "gunbig", "boom", "launch", "tick", "bonk", "whoosh", "charge", "pop", "land",
];
const WALL_W = 30;
const WALL_H = 138;

export default function SmashStage({ labels, onReveal }) {
  const canvasRef = useRef(null);
  const hitRef = useRef(null);
  const vfxRef = useRef(null);
  const soundRef = useRef(false);
  const audioRef = useRef({ ctx: null, master: null, buffers: {}, loading: false });
  const revealRef = useRef(onReveal);
  const [sound, setSound] = useState(false);
  const [move, setMoveState] = useState(-1);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);
  useEffect(() => {
    revealRef.current = onReveal;
  }, [onReveal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mono = document.createElement("canvas");
    const m = mono.getContext("2d", { willReadFrequently: true });

    let LW = 288;
    let LH = 180;
    let KX = 5; // 논리 픽셀 → CSS 픽셀
    let KY = 5;
    let FLOOR = 166;
    let WALL_X = 224;
    let WALL_TOP = 28;
    let HOME = 205;
    const Y = (v) => FLOOR - (158 - v); // 각본의 높이 값은 바닥 기준 상대값

    const st = { shake: 0, stop: 0, slow: 0, invert: 0, hits: 0, hitPop: 0, charging: false, step: 1 / 15, acc: 0, dirty: true, sx: 0, sy: 0 };
    const wall = { ox: 0, v: 0, drop: 0, dropV: 0, dead: false, holes: [], cracks: [], cut: null, dmg: 0, stage: 0, bites: [], tilt: 0 };
    const man = {
      x: 0, y: 0, rot: 0, sq: 1, sqv: 0, face: 1,
      pose: [...P.idle], vel: new Array(11).fill(0), target: P.idle,
      prop: null, propT: 0, swordOut: false, headless: false,
      hp: [0, 0], hv: [0, 0], snapHead: true, j: null, prev: null, lastHip: null, ghostT: 0,
    };
    let chunks = []; // 벽 파편 (컬러 겹, 종이색)
    let parts = []; // 픽셀 파티클
    let fx = []; // 흑백 겹 이펙트 (임팩트 별, 궤적)
    let bolts = []; // 번개
    let ghosts = []; // 잔상
    let slabs = []; // 떨어져 나간 큰 벽 덩어리
    let missiles = []; // 이타노 서커스 미사일
    // 벽은 실제 픽셀 비트맵이다. 맞으면 지워지고, 땅과 이어지지 않은 부분은 떨어진다.
    const wallCv = document.createElement("canvas");
    wallCv.width = WALL_W;
    wallCv.height = WALL_H;
    const w2 = wallCv.getContext("2d", { willReadFrequently: true });
    let wallPx = null;
    let missile = null;
    let jolts = [];

    // ---------- 글자 충격 ----------
    const measure = () => {
      const host = canvas.parentElement;
      for (const j of jolts) j.el.style.transform = "";
      const cr = canvas.getBoundingClientRect();
      jolts = [...host.querySelectorAll("[data-jolt]")].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el, cx: r.left - cr.left + r.width / 2, cy: r.top - cr.top + r.height / 2,
          hw: r.width / 2, hh: r.height / 2, step: el.hasAttribute("data-jolt-step"),
          w: parseFloat(el.dataset.jolt) || 1, shot: el.hasAttribute("data-jolt-shot"),
          x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0, q: [], held: false, live: false,
        };
      });
    };
    const jolt = (lx, ly, power) => {
      const px = lx * KX;
      const py = ly * KY;
      for (const j of jolts) {
        if (j.held) continue;
        const dx = j.cx - px;
        const dy = j.cy - py;
        const d = Math.hypot(dx, dy) || 1;
        const f = (power * j.w * 34) / (1 + d / 260);
        j.q.push({ t: d / 2600, ix: (dx / d) * f, iy: (dy / d) * f * 0.6 - f * 0.25, ir: rand(-1, 1) * f * 0.5 });
      }
    };
    // 바닥을 쿵 찍었을 때: 글자들이 가까운 것부터 차례로 튀어 오른다.
    const thump = (lx, power) => {
      const px = lx * KX;
      for (const j of jolts) {
        if (j.held) continue;
        const d = Math.abs(j.cx - px);
        j.q.push({ t: d / 3000, ix: 0, iy: (-power * j.w * 22) / (1 + d / 500), ir: rand(-1, 1) * power * 3 });
      }
    };
    // 날아간 파편이 글자에 맞으면 글자가 밀리고 파편은 튕긴다.
    const pelt = (c) => {
      const cx = c.x * KX;
      const cy = c.y * KY;
      for (const j of jolts) {
        if (j.w < 0.5 || j.held) continue;
        if (Math.abs(cx - j.cx - j.x) > j.hw || Math.abs(cy - j.cy - j.y) > j.hh * 0.62) continue;
        const k = 0.05 * c.s * j.w;
        j.vx += c.vx * KX * k;
        j.vy += c.vy * KY * k;
        j.vr += rand(-40, 40) * c.s;
        c.vx *= -0.4;
        c.vy = -Math.abs(c.vy) * 0.45;
        c.cool = 0.25;
        sparks(c.x, c.y, 2, [PAPER, ACC[c.s % 3]], 0.3);
        return;
      }
    };
    const updateJolts = (dt) => {
      for (const j of jolts) {
        for (const imp of j.q) {
          imp.t -= dt;
          if (imp.t <= 0) {
            j.vx += imp.ix;
            j.vy += imp.iy;
            j.vr += imp.ir;
          }
        }
        if (j.q.length) j.q = j.q.filter((imp) => imp.t > 0);
        if (!j.held) {
          j.vx += (-170 * j.x - 13 * j.vx) * dt;
          j.vy += (-170 * j.y - 13 * j.vy) * dt;
          j.vr += (-170 * j.r - 12 * j.vr) * dt;
          j.x += j.vx * dt;
          j.y += j.vy * dt;
          j.r += j.vr * dt;
        }
        const moving = j.held || Math.abs(j.x) + Math.abs(j.y) + Math.abs(j.r) > 0.08 || Math.abs(j.vx) + Math.abs(j.vy) > 2;
        if (moving) {
          j.el.style.transform = `translate(${j.x.toFixed(1)}px, ${j.y.toFixed(1)}px) rotate(${j.r.toFixed(1)}deg)`;
          j.live = true;
        } else if (j.live) {
          j.el.style.transform = "";
          j.live = false;
          j.x = j.y = j.r = j.vx = j.vy = j.vr = 0;
        }
      }
    };

    const layout = () => {
      const W = canvas.clientWidth || 1;
      const H = canvas.clientHeight || 1;
      const scale = Math.max(1.6, Math.min(H / 180, W / 170));
      LW = Math.ceil(W / scale);
      LH = Math.ceil(H / scale);
      KX = W / LW;
      KY = H / LH;
      canvas.width = mono.width = LW;
      canvas.height = mono.height = LH;
      ctx.imageSmoothingEnabled = false;
      const oldFloor = FLOOR;
      const oldWall = WALL_X;
      FLOOR = LH - 14;
      WALL_X = Math.round(LW - WALL_W - Math.max(18, LW * 0.11));
      WALL_TOP = FLOOR - WALL_H;
      HOME = WALL_X - 17;
      man.x += WALL_X - oldWall;
      man.y += FLOOR - oldFloor;
      man.snapHead = true;
      st.dirty = true;
      measure();
    };

    // ---------- 매끈한 VFX 겹 ----------
    // 픽셀 캔버스 위에 고해상도로 얹는 섬광과 충격파. 색은 흰색과 한 가지 강조색만 쓴다.
    const spawn = (css, frames, opts) => {
      const host = vfxRef.current;
      if (!host || !host.animate) return;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;pointer-events:none;will-change:transform,opacity;${css}`;
      host.appendChild(el);
      const anim = el.animate(frames, { fill: "forwards", ...opts });
      anim.onfinish = () => el.remove();
      anim.oncancel = () => el.remove();
    };
    // 부드럽게 피었다 사라지는 빛
    const glow = (lx, ly, size, color = "255,255,255", ms = 420) => {
      spawn(
        `left:${lx * KX - size / 2}px;top:${ly * KY - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle, rgba(${color},0.85) 0%, rgba(${color},0.32) 28%, rgba(${color},0) 68%);`,
        [{ transform: "scale(0.25)", opacity: 1 }, { transform: "scale(1.2)", opacity: 0 }],
        { duration: ms, easing: "cubic-bezier(0.2,0.8,0.2,1)" }
      );
    };
    // 얇고 선명한 충격파 링
    const shock = (lx, ly, color, delay = 0, scale = 8, ms = 720) => {
      const d = 110;
      spawn(
        `left:${lx * KX - d / 2}px;top:${ly * KY - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;opacity:0;background:radial-gradient(circle, rgba(${color},0) 62%, rgba(${color},0.35) 68%, rgba(${color},0.95) 70.5%, rgba(${color},0.3) 73%, rgba(${color},0) 79%);`,
        [{ transform: "scale(0.2)", opacity: 0.95 }, { transform: `scale(${scale})`, opacity: 0 }],
        { duration: ms, delay, easing: "cubic-bezier(0.15,0.75,0.2,1)" }
      );
    };
    // 중력렌즈 느낌의 굴절 링. 링이 지나가는 자리의 배경이 번지고 밝아지며 일그러져 보인다.
    const lens = (lx, ly, scale = 8, ms = 900) => {
      // backdrop-filter 로 배경을 실제로 번지게 하면 화면 전체를 매 프레임 다시 그려서
      // 프레임이 117ms 까지 떨어졌다(측정). 그래서 굴절은 색 번짐 링 두 겹으로 흉내만 낸다.
      const d = 170;
      for (const [color, off, delay] of [["255,61,129", -3, 0], ["34,211,238", 3, 30]]) {
        spawn(
          `left:${lx * KX - d / 2 + off}px;top:${ly * KY - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;opacity:0;background:radial-gradient(circle, rgba(${color},0) 50%, rgba(${color},0.5) 62%, rgba(${color},0.16) 74%, rgba(${color},0) 84%);`,
          [{ transform: "scale(0.15)", opacity: 1 }, { transform: `scale(${scale})`, opacity: 0 }],
          { duration: ms, delay, easing: "cubic-bezier(0.12,0.7,0.2,1)" }
        );
      }
    };
    // 가로로 길게 번지는 렌즈 섬광
    const streak = (lx, ly) => {
      spawn(
        `left:-20%;top:${ly * KY - 2}px;width:140%;height:4px;transform-origin:${((lx * KX) / (canvas.clientWidth * 1.4) + 0.143) * 100}% 50%;background:linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%);`,
        [{ transform: "scaleX(0.15) scaleY(2.2)", opacity: 1 }, { transform: "scaleX(1) scaleY(0.4)", opacity: 0 }],
        { duration: 460, easing: "cubic-bezier(0.2,0.8,0.2,1)" }
      );
    };

    // ---------- 효과음 (기본 꺼짐) ----------
    // 실제 효과음 샘플을 쓴다. 소리를 처음 켤 때 한 번 받아서 디코딩해 두고, 재생할 때마다 음정을 조금씩 흔든다.
    const audio = audioRef.current;
    const loadSfx = () => {
      if (audio.loading || !audio.ctx) return;
      audio.loading = true;
      audio.master = audio.ctx.createGain();
      audio.master.gain.value = 0.55;
      audio.master.connect(audio.ctx.destination);
      for (const name of SFX_NAMES) {
        fetch(`/sfx/${name}.mp3`)
          .then((r) => r.arrayBuffer())
          .then((buf) => audio.ctx.decodeAudioData(buf))
          .then((decoded) => {
            audio.buffers[name] = decoded;
          })
          .catch(() => {});
      }
    };
    const play = (name, vol = 1, rate = 1) => {
      if (!soundRef.current || !audio.ctx) return;
      loadSfx();
      const buf = audio.buffers[name];
      if (!buf) return;
      try {
        const src = audio.ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = rate * rand(0.94, 1.06);
        const g = audio.ctx.createGain();
        g.gain.value = vol;
        src.connect(g).connect(audio.master);
        src.start();
      } catch {
        /* 오디오를 못 쓰는 환경은 조용히 넘어간다 */
      }
    };
    // 타격음: 세기에 따라 주먹, 발차기, 돌 깨지는 소리로 나뉜다. crack 은 총알이나 연타처럼 가벼운 타격.
    const sfx = (power, crack) => {
      if (crack) play(pickOne(["rock1", "rock2"]), 0.5);
      else if (power < 1.6) play(pickOne(["punch1", "punch2", "punch3"]), 0.8);
      else if (power < 3) play("kick", 0.9);
      else {
        play("heavy", 1);
        play("kick", 0.6);
      }
    };

    // ---------- 연출 도구 ----------
    const fps = (n) => {
      st.step = 1 / n;
    };
    const setMove = (i) => setMoveState(i);
    // mode: undefined = 스프링으로 따라감, "pop" = 목표를 살짝 지나쳐 찍고 되돌아옴(타격), "snap" = 즉시
    const setPose = (p, mode) => {
      if (mode === "pop") {
        for (let i = 0; i < 11; i++) {
          man.pose[i] = p[i] + (p[i] - man.pose[i]) * (i === 9 ? 0 : 0.08);
          man.vel[i] = 0;
        }
        st.dirty = true;
      } else if (mode === "snap") {
        man.pose = [...p];
        man.vel.fill(0);
        st.dirty = true;
      }
      man.target = p;
    };

    // 픽셀 파티클: 불꽃(중력, 꼬리), 먼지(감속, 깜빡이며 사라짐), 흡수(목표로 빨려 들어감)
    const sparks = (x, y, n, colors, speed = 1, dirX = 0) => {
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(60, 330) * speed;
        parts.push({
          k: "spark", x, y, px: x, py: y,
          vx: Math.cos(a) * sp + dirX * rand(40, 200), vy: Math.sin(a) * sp - 60,
          c: pickOne(colors), s: Math.random() < 0.3 ? 2 : 1, life: rand(0.18, 0.55), max: 0.55,
        });
      }
    };
    const dust = (x, y, n, spread = 40, lift = 30) => {
      for (let i = 0; i < n; i++) {
        parts.push({
          k: "dust", x: x + rand(-3, 3), y: y + rand(-2, 1),
          vx: rand(-spread, spread), vy: -rand(2, lift),
          c: PAPER, s: Math.random() < 0.4 ? 2 : 1, life: rand(0.25, 0.7), max: 0.7,
        });
      }
    };
    const gather = (x, y, n, colors) => {
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const r = rand(26, 70);
        parts.push({ k: "suck", x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, tx: x, ty: y, c: pickOne(colors), s: 1, life: rand(0.25, 0.5), max: 0.5 });
      }
    };
    const pixelRing = (x, y, color, n = 18, speed = 210, delay = 0) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        parts.push({ k: "ring", x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, c: color, s: 2, life: 0.28, max: 0.28, delay });
      }
    };
    // 폭발. 흰 섬광 한 프레임, 바깥으로 터져 나가다 떠오르는 불덩이, 뒤에 남는 연기.
    const blast = (x, y, size = 1, tint = GOLD) => {
      fx.push({ type: "blast", x, y, r: 13 * size, life: 0.075, max: 0.075 });
      for (let i = 0; i < 16 * size; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(40, 260) * size;
        parts.push({ k: "fire", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 30, tint, s: 3, life: rand(0.3, 0.6), max: 0.6 });
      }
      for (let i = 0; i < 8 * size; i++) {
        parts.push({ k: "smoke", x: x + rand(-6, 6) * size, y: y + rand(-6, 6) * size, vx: rand(-26, 26), vy: -rand(14, 50), c: "#77746c", s: 3, life: rand(0.7, 1.4), max: 1.4, delay: rand(0.05, 0.2) });
      }
      st.shake = Math.min(1, st.shake + 0.22 * size);
      wall.v += 120 * size;
    };
    const embers = (x, y, n, w, h) => {
      for (let i = 0; i < n; i++) {
        parts.push({ k: "ember", x: x + rand(-w, w), y: y + rand(-h, h), vy: -rand(8, 38), c: pickOne([PINK, CYAN, LIME, GOLD, PAPER]), s: 1, life: rand(1.2, 3), max: 3, delay: rand(0, 0.5) });
      }
    };
    const slab = (pts, vx, vy) => {
      const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length;
      const cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
      slabs.push({ x: cx, y: cy, vx, vy, a: 0, av: rand(-6, 6), pts: pts.map((q) => [q[0] - cx, q[1] - cy]), life: 0.6 });
    };
    // ----- 벽 비트맵 -----
    const readWall = () => {
      wallPx = w2.getImageData(0, 0, WALL_W, WALL_H).data;
    };
    const resetWall = () => {
      wall.lines = [];
      w2.globalCompositeOperation = "source-over";
      w2.clearRect(0, 0, WALL_W, WALL_H);
      w2.fillStyle = "#fff";
      w2.fillRect(0, 0, WALL_W, WALL_H);
      readWall();
    };
    resetWall();
    // 좌표는 벽 기준 (lx: 앞면에서의 깊이, y: 화면 높이)
    const carveBlob = (lx, y, rx, ry) => {
      const seed = Math.random() * 99;
      w2.save();
      w2.beginPath();
      w2.rect(0, 0, WALL_W - 9, WALL_H);
      w2.clip();
      w2.globalCompositeOperation = "destination-out";
      w2.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const k = 0.65 + 0.45 * Math.abs(Math.sin(seed + i * 2.3));
        w2.lineTo(lx + Math.cos(a) * rx * k, y - WALL_TOP + Math.sin(a) * ry * k);
      }
      w2.closePath();
      w2.fill();
      w2.restore();
    };
    const carvePoly = (poly) => {
      w2.save();
      w2.beginPath();
      w2.rect(0, 0, WALL_W - 9, WALL_H);
      w2.clip();
      w2.globalCompositeOperation = "destination-out";
      w2.beginPath();
      poly.forEach(([px, py], i) => (i === 0 ? w2.moveTo(px, py - WALL_TOP) : w2.lineTo(px, py - WALL_TOP)));
      w2.closePath();
      w2.fill();
      w2.restore();
    };
    // 금과 베인 자국은 벽 위에 그리기만 한다. 벽을 실제로 끊지는 않는다.
    const carveLine = (pts) => {
      wall.lines.push(pts);
    };
    // 땅에서부터 이어진 부분만 남기고, 공중에 뜬 부분은 지우고 파편으로 떨어뜨린다.
    const settle = () => {
      const img = w2.getImageData(0, 0, WALL_W, WALL_H);
      const d = img.data;
      const n = WALL_W * WALL_H;
      const ok = new Uint8Array(n);
      const stack = [];
      for (let x = 0; x < WALL_W; x++) {
        const i = (WALL_H - 1) * WALL_W + x;
        if (d[i * 4 + 3] > 127) {
          ok[i] = 1;
          stack.push(i);
        }
      }
      while (stack.length) {
        const i = stack.pop();
        const x = i % WALL_W;
        const y = (i / WALL_W) | 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= WALL_W || ny >= WALL_H) continue;
            const k = ny * WALL_W + nx;
            if (ok[k] || d[k * 4 + 3] <= 127) continue;
            ok[k] = 1;
            stack.push(k);
          }
        }
      }
      let fell = 0;
      const wx = WALL_X + wall.ox;
      for (let i = 0; i < n; i++) {
        if (d[i * 4 + 3] <= 127 || ok[i]) {
          if (!ok[i]) d[i * 4 + 3] = 0;
          continue;
        }
        d[i * 4 + 3] = 0;
        fell++;
        const x = i % WALL_W;
        const y = (i / WALL_W) | 0;
        if (x % 2 === 0 && y % 2 === 0 && chunks.length < 420) {
          chunks.push({ x: wx + x, y: WALL_TOP + y, vx: rand(-26, 10), vy: rand(-20, 30), s: 2, life: 1 });
        }
      }
      w2.putImageData(img, 0, 0);
      wallPx = d;
      if (fell > 40) {
        st.shake = Math.min(1, st.shake + 0.25);
        dust(wx + WALL_W / 2, FLOOR - 1, 10, 90, 20);
        play("debris", 0.5);
      }
    };
    const solid = (lx, y) => {
      const x = Math.floor(lx);
      const yy = Math.floor(y - WALL_TOP);
      if (x < 0 || x >= WALL_W || yy < 0 || yy >= WALL_H) return false;
      return wallPx[(yy * WALL_W + x) * 4 + 3] > 127;
    };
    // 벽 앞면에서 몇 픽셀 들어가야 벽에 닿는지. 완전히 뚫려 있으면 null.
    const surface = (y) => {
      for (let lx = 0; lx < WALL_W; lx++) if (solid(lx, y)) return lx;
      return null;
    };
    const reachAt = (y) => Math.min(13, surface(y) ?? 13);
    // 누적 피해가 단계에 닿으면, 맞은 바로 그 자리에서 덩어리가 떨어져 나간다.
    const bite = (lx, y) => {
      const cx = Math.max(2, lx + 2);
      const poly = [];
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        const r = rand(4, 7);
        poly.push([clamp(cx + Math.cos(a) * r, -1, WALL_W + 1), clamp(y + Math.sin(a) * r * 1.3, WALL_TOP, FLOOR)]);
      }
      carvePoly(poly);
      const wx = WALL_X + wall.ox;
      slab(poly.map((q) => [wx + q[0], q[1]]), -rand(50, 130), -rand(40, 120));
      rubble(wx + cx, y, 10, -1, 0.9);
      dust(wx + cx, y, 10, 70, 30);
      st.shake = Math.min(1, st.shake + 0.3);
      wall.v += 160;
      play("debris", 0.7);
    };
    // 바닥에 쌓인 잔해를 쓸어낸다 (새 벽이 떨어질 때).
    const sweep = (cx) => {
      for (const c of [...chunks, ...slabs]) {
        c.rest = false;
        c.fade = true;
        c.life = rand(0.45, 0.9);
        c.vx = Math.sign(c.x - cx || 1) * rand(120, 380);
        c.vy = -rand(100, 300);
        if (c.av !== undefined) c.av = rand(-10, 10);
      }
    };
    const rubble = (x, y, n, dir = -1, power = 1) => {
      for (let i = 0; i < n; i++) {
        chunks.push({
          x: x + rand(-2, 2), y: y + rand(-4, 4),
          vx: dir * rand(20, 180) * power + rand(-20, 20), vy: -rand(30, 210) * power,
          s: Math.ceil(rand(0.6, 4)), life: rand(1.2, 2.6),
        });
      }
      // 잔해는 바닥에 쌓여 남는다. 너무 많아지면 오래된 것부터 깜빡이며 사라진다.
      for (let i = 0; i < chunks.length - 240; i++) {
        if (!chunks[i].fade) {
          chunks[i].fade = true;
          chunks[i].life = 0.4;
        }
      }
    };

    const hit = (dmg, y, opt = {}) => {
      // 벽이 파인 만큼 더 들어간 자리에서 맞는다.
      const reach = surface(y);
      const lx = reach === null ? WALL_W * 0.7 : reach;
      const x = WALL_X + wall.ox + lx;
      st.hits += 1;
      st.hitPop = 1;
      st.dirty = true;
      wall.v += dmg * 16;
      st.shake = Math.min(1, st.shake + dmg / 30 + 0.1);
      st.stop = opt.stop ?? Math.min(0.13, 0.02 + dmg * 0.005);
      if (opt.invert) st.invert = opt.invert;
      if (opt.boom) {
        // 큰 타격의 박자: 길게 한 번 멈추고(16), 한 박자만 느리고(12), 바로 정상(8).
        // 느린 구간을 길게 끌면 연출이 아니라 프레임 드롭처럼 보인다.
        st.stop = Math.max(st.stop, 0.15 + opt.boom * 0.25);
        st.slow = 0.07;
        glow(x, y, 150 + dmg * 9, "255,255,255", 360);
      }
      wall.dmg += dmg;
      carveBlob(lx + 0.5, y, 1.4 + dmg * 0.2, 2 + dmg * 0.3);
      if (dmg >= 8) {
        const pts = [[lx, y]];
        let cx = lx;
        let cy = y;
        const up = Math.random() < 0.5 ? -1 : 1;
        for (let i = 0; i < 4; i++) {
          cx += rand(3, 9);
          cy += up * rand(2, 12) + rand(-4, 4);
          pts.push([Math.min(cx, WALL_W), clamp(cy, WALL_TOP, FLOOR)]);
        }
        carveLine(pts);
      }
      const stage = Math.floor(wall.dmg / 85);
      if (stage > wall.stage && stage <= 3) {
        wall.stage = stage;
        bite(lx, y);
      }
      fx.push({ type: "star", x, y, r: 7 + dmg * 1.5, n: 6 + Math.round(dmg / 3), life: 0.07 });
      const color = ACC[st.hits % 3];
      sparks(x, y, Math.round(3 + dmg * 1.3), [color, color, PAPER], 0.6 + dmg / 24, -0.8);
      rubble(x, y, Math.round(2 + dmg * 0.55), -1, 0.6 + dmg / 20);
      if (dmg >= 8) dust(x - 2, y, 6, 50, 40);
      if (dmg >= 11) {
        // 큰 타격은 파편 몇 개가 왼쪽 글자까지 날아간다.
        for (let i = 0; i < Math.round(dmg / 3); i++) {
          chunks.push({ x, y, vx: -rand(230, 470), vy: -rand(150, 330), s: Math.ceil(rand(1, 4)), life: 1 });
        }
      }
      settle();
      jolt(x, y, dmg);
      sfx(dmg / 5, opt.crack);
      return x;
    };

    const shatter = () => {
      wall.dead = true;
      st.shake = 0.9;
      st.stop = 0.22;
      st.slow = 0.08;
      st.dirty = true;
      const wx = WALL_X + wall.ox;
      const cx = wx + WALL_W / 2;
      const cy = Y(112);
      for (const c of [...chunks, ...slabs]) {
        c.rest = false;
        c.vx += rand(-60, 220);
        c.vy = -rand(80, 260);
      }
      // 남아 있는 벽만 갈라져 날아간다. 이미 파인 자리는 비어 있는 채로다.
      const nx = 3;
      const ny = 8;
      const cw = WALL_W / nx;
      const ch = WALL_H / ny;
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          // 이 칸에 벽이 얼마나 남아 있는지 센다
          let filled = 0;
          let total = 0;
          const cells = [];
          for (let yy = Math.floor(j * ch); yy < (j + 1) * ch; yy += 2) {
            for (let xx = Math.floor(i * cw); xx < (i + 1) * cw; xx += 2) {
              total++;
              if (wallPx[(yy * WALL_W + xx) * 4 + 3] > 127) {
                filled++;
                cells.push([xx, yy]);
              }
            }
          }
          if (!filled) continue;
          const vx = rand(60, 300) + i * 30;
          const vy = -rand(60, 300) - (ny - j) * 22;
          if (filled / total > 0.72) {
            const x0 = wx + i * cw;
            const y0 = WALL_TOP + j * ch;
            const jit = () => rand(-2, 2);
            slab([[x0 + jit(), y0 + jit()], [x0 + cw + jit(), y0 + jit()], [x0 + cw + jit(), y0 + ch + jit()], [x0 + jit(), y0 + ch + jit()]], vx, vy);
          } else {
            // 군데군데 파인 칸은 남은 픽셀만 파편으로 흩어진다
            for (const [xx, yy] of cells) {
              if ((xx + yy) % 4) continue;
              chunks.push({ x: wx + xx, y: WALL_TOP + yy, vx: vx * rand(0.5, 1.1) + rand(-40, 40), vy: vy * rand(0.5, 1.1), s: 3, life: 1 });
            }
          }
        }
      }
      // 빛 한 번, 얇은 충격파 두 겹, 가로 섬광 하나. 색은 흰색에 시안만 살짝.
      glow(wx, cy, 620, "255,255,255", 620);
      glow(wx, cy, 300, "190,240,255", 420);
      streak(wx, cy);
      lens(wx, cy, 9, 1000);
      shock(wx, cy, "255,255,255", 0, 9, 760);
      shock(wx, cy, "34,211,238", 110, 6, 680);
      fx.push({ type: "star", x: wx, y: cy, r: 96, n: 16, life: 0.09, inner: 0.3 });
      sparks(cx, cy, 18, [PAPER, PAPER, CYAN], 1.4);
      // 바닥을 따라 낮게 퍼지는 먼지
      for (let i = 0; i < 26; i++) {
        const dir = i % 2 ? 1 : -1;
        parts.push({ k: "dust", x: cx + dir * rand(0, 16), y: FLOOR - rand(0, 3), vx: dir * rand(60, 300), vy: -rand(0, 16), c: PAPER, s: Math.random() < 0.5 ? 2 : 1, life: rand(0.5, 1.1), max: 1.1 });
      }
      jolt(cx, cy, 62);
      thump(cx, 12);
      play("shatter", 1);
      play("boom", 0.8);
    };

    // ---------- 뼈대 계산 ----------
    const rig = () => {
      const p = man.pose;
      const sy = man.sq;
      const sx = 1 + (1 - man.sq) * 0.8;
      const hx = man.x;
      const hy = man.y - p[9] * sy;
      const c = Math.cos(man.rot);
      const s = Math.sin(man.rot);
      const fc = man.face;
      const tp = ([lx, ly]) => [hx + fc * (lx * sx * c - ly * sy * s), hy + lx * sx * s + ly * sy * c];
      const seg = (o, a, len) => [o[0] + Math.sin(a) * len, o[1] + Math.cos(a) * len];
      const dir = [Math.sin(p[0]), -Math.cos(p[0])];
      const sh = [dir[0] * TORSO, dir[1] * TORSO];
      const mid = [sh[0] / 2 + dir[1] * p[10] * 3.2, sh[1] / 2 - dir[0] * p[10] * 3.2];
      const eF = seg(sh, p[1], UA);
      const eB = seg(sh, p[3], UA);
      const kF = seg([0, 0], p[5], TH);
      const kB = seg([0, 0], p[7], TH);
      return {
        hip: tp([0, 0]), mid: tp(mid), sh: tp(sh),
        eF: tp(eF), hF: tp(seg(eF, p[1] + p[2], FA)),
        eB: tp(eB), hB: tp(seg(eB, p[3] + p[4], FA)),
        kF: tp(kF), fF: tp(seg(kF, p[5] + p[6], SHIN)),
        kB: tp(kB), fB: tp(seg(kB, p[7] + p[8], SHIN)),
        headT: tp([sh[0] + dir[0] * (HEAD + 0.5), sh[1] + dir[1] * (HEAD + 0.5)]),
      };
    };

    // ---------- 각본 (제너레이터: yield 초) ----------
    function* land(x, power = 0) {
      Object.assign(man, { x, y: FLOOR, rot: 0, sq: 0.58, sqv: 0 });
      if (power) thump(x, power);
      play("land", 0.55);
      st.shake = Math.min(1, st.shake + 0.1);
      st.dirty = true;
      dust(x, FLOOR - 1, 9, 70, 16);
      setPose(P.crouch, "snap");
      yield 0.09;
      setPose(P.idle);
    }
    // 지면 대시. 깊게 숙이고 치고 나가서 미끄러지며 멈춘다. 벽에서 멀어질 때는 뒤로 미끄러진다.
    function* dash(x, dur = 0.16) {
      const x0 = man.x;
      const dir = Math.sign(x - x0) || 1;
      const keep = st.step;
      fps(30);
      setPose(dir > 0 ? P.run : P.skid, "pop");
      play("whoosh", 0.45);
      man.sq = 0.9;
      dust(x0, FLOOR - 1, 7, 70, 10);
      for (let t = 0; t < dur; t += 0.016) {
        man.x = lerp(x0, x, easeOutCubic(t / dur));
        if (Math.random() < 0.6) dust(man.x - dir * 6, FLOOR - 1, 1, 24, 6);
        yield 0.016;
      }
      man.x = x;
      man.sq = 0.82;
      dust(x + dir * 5, FLOOR - 1, 6, 80, 8);
      setPose(P.idle);
      st.step = keep;
    }
    // 도약. 움츠렸다가 치솟고, 정점에서 몸을 말고 잠깐 떠 있다가, 다리를 뻗으며 가속해 떨어진다.
    // 속도가 빠른 양 끝에서는 몸이 늘어나고 정점에서는 뭉친다. 진행 방향으로 몸이 기운다.
    function* arc(x, y, dur, height, flip = 0) {
      const x0 = man.x;
      const y0 = man.y;
      const dir = Math.sign(x - x0);
      setPose(P.crouch);
      man.sq = 0.68;
      yield height > 40 ? 0.1 : 0.07;
      dust(x0, y0 - 1, 5, 60, 10);
      for (let t = 0; t < dur; t += 0.016) {
        const u = t / dur;
        const v = 2 * u - 1; // -1 치솟음 ... 0 정점 ... 1 낙하
        man.x = lerp(x0, x, u);
        man.y = lerp(y0, y, u) - height * 4 * u * (1 - u);
        setPose(u < 0.28 ? P.rise : u < 0.7 ? P.tuck : P.drop);
        man.sq = 0.94 + 0.3 * Math.abs(v);
        man.sqv = 0;
        man.rot = flip ? flip * Math.PI * 2 * easeInOut(clamp((u - 0.12) / 0.76, 0, 1)) : dir * -0.22 * v;
        yield 0.016;
      }
      man.x = x;
      man.y = y;
      man.rot = 0;
      st.dirty = true;
    }
    function* jumpTo(x, dur, height, flip = 0) {
      const keep = st.step;
      fps(30);
      yield* arc(x, FLOOR, dur, height, flip);
      yield* land(x, height > 40 ? 4 : 0);
      st.step = keep;
    }

    function* punchRush() {
      setMove(0);
      fps(15);
      yield* dash(HOME - 4, 0.14);
      setPose(P.guard);
      yield 0.22;
      fps(30);
      for (let i = 0; i < 7; i++) {
        setPose(i % 2 ? P.punchB : P.punchF, "pop");
        const reach = reachAt(Y(134));
        man.x = HOME + 2 + rand(0, 3) + reach;
        man.sq = 1.1;
        hit(5, Y(134) + rand(-6, 6), { crack: true, stop: 0.035 });
        yield 0.05;
        man.x = HOME - 3 + reach;
        man.sq = 0.94;
        yield 0.03;
      }
      // 크게 당겼다가 한 방
      fps(10);
      setPose(P.windup);
      man.x = HOME - 12;
      man.sq = 0.8;
      for (let i = 0; i < 4; i++) {
        gather(man.x - 10, Y(132), 6, [PINK, PINK, PAPER]);
        st.shake = Math.min(1, st.shake + 0.06);
        yield 0.09;
      }
      fps(30);
      man.x = HOME + 5 + reachAt(Y(134));
      man.sq = 1.28;
      setPose(P.punchF, "pop");
      dust(HOME - 8, FLOOR - 1, 8, 90, 12);
      hit(16, Y(134), { stop: 0.12, boom: 0.18, invert: 1 });
      pixelRing(WALL_X, Y(134), PINK, 20, 250);
      yield 0.12;
      fps(15);
      setPose(P.idle);
      yield 0.16;
    }

    function* roundhouse() {
      setMove(1);
      fps(12);
      man.x = HOME - 2;
      setPose(P.crouch);
      man.sq = 0.75;
      yield 0.18;
      fps(30);
      setPose(P.air, "pop");
      man.sq = 1.25;
      for (let i = 0; i < 10; i++) {
        const u = i / 10;
        man.rot = easeInOut(u) * Math.PI * 2;
        man.y = FLOOR - Math.sin(u * Math.PI) * 9;
        yield 0.02;
      }
      man.rot = 0;
      man.y = FLOOR;
      man.x = HOME - 2 + reachAt(Y(142));
      setPose(P.kick, "pop");
      hit(14, Y(142), { stop: 0.1, boom: 0.14 });
      pixelRing(WALL_X, Y(142), CYAN, 14, 200);
      yield 0.14;
      fps(12);
      yield 0.22;
      fps(15);
      setPose(P.idle);
    }

    function* hammer() {
      setMove(2);
      fps(15);
      yield* dash(HOME - 9, 0.12);
      fps(10);
      setPose(P.overhead);
      man.prop = "hammer";
      man.propT = 0;
      man.sq = 1.22;
      sparks(man.x + 2, Y(110), 10, [GOLD, PAPER], 0.5);
      yield 0.52;
      fps(30);
      setPose(P.slam, "pop");
      man.x = HOME - 9 + reachAt(Y(138));
      man.sq = 0.7;
      hit(20, Y(138), { stop: 0.13, invert: 1, boom: 0.2 });
      pixelRing(WALL_X, Y(138), GOLD, 20, 240);
      dust(WALL_X - 6, FLOOR - 1, 16, 110, 30);
      thump(WALL_X, 11);
      yield 0.2;
      fps(12);
      yield 0.38;
      man.prop = null;
      sparks(man.j.hF[0], man.j.hF[1], 8, [GOLD], 0.4);
      fps(15);
      setPose(P.idle);
    }

    // 십자 베기. 낮게 모으고 → 한 프레임에 지나가며 베고 → 돌아서서 다시 베며 돌아온다.
    function* flashDraw() {
      setMove(3);
      fps(15);
      yield* dash(HOME - 56, 0.2);
      fps(10);
      man.prop = "sword";
      man.swordOut = false;
      setPose(P.iai);
      man.sq = 0.88;
      yield 0.25;
      st.charging = true;
      play("charge", 0.6, 0.8);
      for (let i = 0; i < 9; i++) {
        gather(man.x - 6, Y(144), 5, [CYAN, CYAN, GOLD, PAPER]);
        jolt(man.x, Y(144), -0.5 - i * 0.1);
        dust(man.x + rand(-10, 10), FLOOR - 1, 1, 14, 22);
        yield 0.075;
      }
      st.charging = false;
      sparks(man.x - 8, Y(146), 6, [PAPER, CYAN], 0.3);
      yield 0.12;

      const home = man.x;
      const far = WALL_X + WALL_W + 16;
      // 한 번 지나가며 벤다: from → to, 벽에는 (ya → yb) 대각선이 남는다.
      const pass = (from, to, ya, yb, dmg, opt) => {
        const dir = Math.sign(to - from);
        for (let i = 0; i < 6; i++) {
          man.x = lerp(from, to, i / 6);
          ghosts.push({ j: rig(), hp: null, sq: 1, headless: false, life: 0.2 + i * 0.05, max: 0.5, c: i % 2 ? CYAN : PAPER });
        }
        const pts = [];
        for (let i = 0; i <= 9; i++) pts.push([lerp(from, to, i / 9), Y(138) + (i % 2 ? -1 : 1) * rand(2, 8)]);
        bolts.push({ pts, life: 0.2, c: CYAN });
        for (let i = 0; i < 22; i++) dust(lerp(from, to, Math.random()), FLOOR - 1, 1, 30, 40);
        man.x = to;
        man.swordOut = true;
        man.sq = 1.15;
        man.snapHead = true;
        man.prev = null;
        setPose(P.iaiEnd, "snap");
        play("slash", 0.9);
        play("swish", 0.7);
        carveLine([[0, ya], [WALL_W, yb]]);
        fx.push({ type: "line", x1: WALL_X - 18, y1: ya + (ya - yb) * 0.3, x2: WALL_X + WALL_W + 18, y2: yb - (ya - yb) * 0.3, w: 1, life: 0.1 });
        for (let i = 0; i < 24; i++) {
          const u = Math.random();
          sparks(WALL_X + WALL_W * u, lerp(ya, yb, u), 1, [CYAN, PAPER, GOLD], 0.9);
        }
        hit(dmg, (ya + yb) / 2, opt);
        rubble(WALL_X + (dir > 0 ? WALL_W : 0), (ya + yb) / 2, 6, dir, 0.8);
      };

      fps(30);
      pass(home, far, Y(150), Y(96), 10, { stop: 0.1 });
      yield 0.14;
      // 돌아서서 한 번 더
      man.face = -1;
      setPose(P.iai, "snap");
      man.swordOut = false;
      man.sq = 0.86;
      st.dirty = true;
      yield 0.12;
      pass(far, home, Y(98), Y(152), 15, { stop: 0.13, invert: 1, boom: 0.2 });
      pixelRing(WALL_X + WALL_W / 2, Y(124), CYAN, 16, 230);
      yield 0.16;

      fps(12);
      yield 0.2;
      setPose(P.sheath);
      yield 0.26;
      man.swordOut = false;
      sparks(man.x + 3, Y(146), 5, [GOLD, PAPER], 0.25);
      st.dirty = true;
      yield 0.2;
      man.prop = null;
      man.face = 1;
      man.snapHead = true;
      st.dirty = true;
      fps(15);
    }

    // 리볼버. 한 발 한 발이 무겁다: 팔이 위로 튀고, 몸이 젖혀지고, 뒤로 밀린다.
    function* guns() {
      setMove(5);
      fps(15);
      yield* dash(HOME - 26, 0.16);
      setPose(P.aim);
      man.prop = "guns";
      man.propT = 0;
      yield 0.34;
      for (let i = 0; i < 6; i++) {
        const last = i === 5;
        const front = i % 2 === 0;
        fps(30);
        for (const from of last ? [man.j.hF, man.j.hB] : [front ? man.j.hF : man.j.hB]) {
          const y = Y(rand(104, 148));
          const reach = surface(y);
          const ex = reach === null ? LW + 10 : WALL_X + wall.ox + reach;
          fx.push({ type: "line", x1: from[0] + 7, y1: from[1] - 1, x2: ex, y2: y, w: last ? 2 : 1, life: 0.045 });
          fx.push({ type: "star", x: from[0] + 9, y: from[1] - 1, r: last ? 11 : 8, life: 0.05, rot: rand(0, 1) });
          sparks(from[0] + 8, from[1] - 1, 7, [GOLD, GOLD, PAPER], 0.7, 1);
          play(last ? "gunbig" : "gun", last ? 1 : 0.85);
          dust(from[0] + 6, from[1] - 3, 3, 16, 26);
          parts.push({ k: "spark", x: from[0], y: from[1] - 2, px: from[0], py: from[1], vx: rand(-110, -50), vy: rand(-190, -110), c: GOLD, s: 2, life: 0.8, max: 0.8 });
          if (reach !== null) hit(last ? 7 : 6, y, { stop: last ? 0.08 : 0.05, boom: last ? 0.12 : 0 });
          else st.dirty = true;
        }
        // 반동
        const a = front || last ? 1 : 3;
        man.pose[a] = 2.75;
        man.vel[a] = 6;
        man.pose[a + 1] = 0.5;
        if (last) {
          man.pose[3] = 2.6;
          man.vel[3] = 6;
        }
        man.pose[0] = last ? -0.75 : -0.45;
        man.pose[10] = -0.9;
        man.hv[0] -= 150;
        man.hv[1] -= 60;
        man.x -= last ? 9 : 3.5;
        man.sq = 0.84;
        st.shake = Math.min(1, st.shake + 0.22);
        dust(man.x - 2, FLOOR - 1, last ? 10 : 3, 60, 8);
        yield 0.07;
        fps(12);
        yield last ? 0.3 : 0.13;
      }
      man.prop = null;
      fps(15);
      setPose(P.idle);
    }

    // 발밑 추진 불꽃
    const jet = () => {
      if (!man.j) return;
      for (const ft of [man.j.fF, man.j.fB]) {
        parts.push({ k: "dust", x: ft[0] + rand(-1, 1), y: ft[1] + 2, vx: rand(-14, 14), vy: rand(90, 180), c: pickOne([GOLD, GOLD, PINK, PAPER]), s: Math.random() < 0.4 ? 2 : 1, life: rand(0.12, 0.3), max: 0.3 });
      }
    };
    // 미사일 한 발. 발사구에서 뒤로 빠졌다가 크게 휘어 들어가는 3차 베지어 궤적을 탄다.
    const fire = (from, side, k, lastOne) => {
      const sgn = k % 4 < 2 ? 1 : -1;
      const ty = Y(rand(74, 150));
      const p0 = [from[0] + side * 11, from[1] - 1];
      const p3 = [WALL_X + 1, ty];
      // 오른쪽 포는 벽 쪽으로 나가 위아래로 크게 휘고, 왼쪽 포는 반대로 멀리 나갔다가 돌아 들어온다.
      const p1 = side > 0
        ? [p0[0] + rand(24, 50), p0[1] + sgn * rand(50, 100)]
        : [p0[0] - rand(70, 130), p0[1] + sgn * rand(20, 90)];
      const p2 = [p3[0] - rand(30, 90), p3[1] - sgn * rand(40, 100)];
      missiles.push({ p0, p1, p2, p3, t: 0, dur: side > 0 ? rand(0.8, 1.0) : rand(1.05, 1.3), trail: [], done: false, c: ACC[k % 3], lastOne });
      fx.push({ type: "star", x: p0[0] + side * 3, y: p0[1], r: 9, n: 7, life: 0.05 });
      sparks(p0[0], p0[1], 5, [GOLD, PAPER], 0.5, side);
      play("launch", 0.55);
    };
    // 이타노 서커스. 양손에 네모난 바주카를 들고 떠올라, 제각각 휘어 날아가는 미사일을 쏟아붓는다.
    function* itano() {
      setMove(4);
      fps(30);
      const hx = HOME - 72;
      const hy = FLOOR - 84;
      setPose(P.crouch);
      man.sq = 0.62;
      yield 0.12;
      const x0 = man.x;
      const y0 = man.y;
      setPose(P.rise, "pop");
      st.shake = Math.min(1, st.shake + 0.2);
      dust(x0, FLOOR - 1, 14, 90, 14);
      for (let t = 0; t < 0.42; t += 0.016) {
        const u = easeOutCubic(t / 0.42);
        man.x = lerp(x0, hx, u);
        man.y = lerp(y0, hy, u);
        man.sq = 1.16 - 0.16 * u;
        man.sqv = 0;
        jet();
        yield 0.016;
      }
      setPose(P.hoverAim);
      man.prop = "bazooka";
      man.propT = 0;
      let clock = 0;
      const bob = () => {
        clock += 0.016;
        man.y = hy + Math.sin(clock * 7) * 2.2;
        man.x += (hx - man.x) * 0.08;
        man.rot *= 0.86;
        jet();
      };
      for (let t = 0; t < 0.4; t += 0.016) {
        bob();
        yield 0.016;
      }
      // 세 번, 양쪽 포에서 한 발씩. 수를 줄인 대신 한 발 한 발이 크고 또렷하다.
      for (let v = 0; v < 3; v++) {
        fire(man.j.hF, 1, v * 2, false);
        fire(man.j.hB, -1, v * 2 + 1, v === 2);
        man.sq = 0.86;
        man.y += 3;
        st.shake = Math.min(1, st.shake + 0.22);
        for (let t = 0; t < 0.34; t += 0.016) {
          bob();
          yield 0.016;
        }
      }
      while (missiles.some((ms) => !ms.done)) {
        bob();
        yield 0.016;
      }
      for (let t = 0; t < 0.2; t += 0.016) {
        bob();
        yield 0.016;
      }
      man.prop = null;
      man.rot = 0;
      setPose(P.drop);
      const yy = man.y;
      const xx = man.x;
      for (let t = 0; t < 0.3; t += 0.016) {
        const u = t / 0.3;
        man.y = lerp(yy, FLOOR, u * u);
        man.x = lerp(xx, HOME - 30, u);
        man.sq = 1 + 0.25 * u;
        man.sqv = 0;
        yield 0.016;
      }
      yield* land(HOME - 30, 5);
      fps(15);
      yield 0.2;
    }

    // 글자 던지기. 직접 뛰어올라 이름에서 글자를 뜯어내고, 머리 위로 들고 기를 모았다가 한 방에 던진다.
    function* letterThrow() {
      const letters = jolts.filter((j) => j.step).sort((a, b) => a.cx - b.cx);
      if (!letters.length) return;
      const J = letters[Math.max(0, letters.length - 2)];
      setMove(6);
      fps(15);
      const lx = J.cx / KX;
      const ly = J.cy / KY;
      yield* dash(clamp(lx - 3, 14, HOME - 24), 0.26);
      const carry = () => {
        const h = man.j.hF;
        J.x = h[0] * KX - J.cx;
        J.y = (h[1] - 9) * KY - J.cy;
      };
      // 뛰어올라 뜯는다
      fps(10);
      setPose(P.crouch);
      man.sq = 0.6;
      yield 0.2;
      fps(30);
      const apex = Math.max(20, FLOOR - (ly + 26));
      setPose(P.rise, "pop");
      man.sq = 1.36;
      dust(man.x, FLOOR - 1, 12, 90, 14);
      for (let t = 0; t < 0.24; t += 0.016) {
        man.y = FLOOR - apex * easeOutCubic(t / 0.24);
        yield 0.016;
      }
      J.held = true;
      J.q = [];
      for (let i = 0; i < 5; i++) {
        J.x = rand(-5, 5);
        J.y = rand(-4, 4);
        J.r = rand(-12, 12);
        yield 0.03;
      }
      st.stop = 0.07;
      st.shake = Math.min(1, st.shake + 0.25);
      sparks(lx, ly, 14, [LIME, PAPER], 0.8);
      for (const N of letters) if (N !== J) N.vy -= 140 / (1 + Math.abs(N.cx - J.cx) / 70);
      setPose(P.hold, "pop");
      for (let t = 0; t < 0.24; t += 0.016) {
        man.y = FLOOR - apex * (1 - easeInQuad(t / 0.24));
        man.sq = 1.1;
        man.sqv = 0;
        carry();
        yield 0.016;
      }
      man.y = FLOOR;
      man.sq = 0.6;
      man.sqv = 0;
      thump(man.x, 5);
      dust(man.x, FLOOR - 1, 10, 80, 14);
      // 머리 위로 들고 기를 모은다. 글자가 점점 빨리 돌고, 주변 글자가 끌려온다.
      fps(10);
      st.charging = true;
      play("charge", 0.7, 0.7);
      let spin = 0;
      for (let t = 0; t < 1.05; t += 0.016) {
        const k = t / 1.05;
        carry();
        spin += (120 + k * k * 2400) * 0.016;
        J.r = spin;
        if (Math.random() < 0.5 + k * 0.5) gather((J.cx + J.x) / KX, (J.cy + J.y) / KY, 2, [LIME, LIME, CYAN, PAPER]);
        if (Math.floor(t / 0.15) !== Math.floor((t - 0.016) / 0.15)) {
          jolt(man.x, man.y - 30, -(1 + k * 5));
          st.shake = Math.min(1, st.shake + 0.05 + k * 0.1);
          glow((J.cx + J.x) / KX, (J.cy + J.y) / KY, 60 + k * 150, "163,230,53", 300);
          man.sq = 0.86;
        }
        yield 0.016;
      }
      st.charging = false;
      // 던진다
      setPose(P.throwUp, "pop");
      man.sq = 1.2;
      for (let t = 0; t < 0.12; t += 0.016) {
        carry();
        yield 0.016;
      }
      fps(30);
      setPose(P.throwEnd, "pop");
      man.sq = 0.8;
      man.x -= 4;
      const ty = Y(122);
      const reach = surface(ty);
      const tx = WALL_X + (reach ?? WALL_W * 0.7);
      const fx0 = J.x;
      const fy0 = J.y;
      streak((J.cx + J.x) / KX, ty);
      play("swish", 1);
      play("whoosh", 0.8);
      for (let t = 0; t < 0.09; t += 0.016) {
        const u = t / 0.09;
        J.x = lerp(fx0, tx * KX - J.cx, u);
        J.y = lerp(fy0, ty * KY - J.cy, u);
        J.r = spin + u * 900;
        for (let i = 0; i < 3; i++) {
          parts.push({ k: "dust", x: (J.cx + J.x) / KX - i * 4, y: (J.cy + J.y) / KY + rand(-3, 3), vx: rand(-60, 0), vy: rand(-20, 20), c: pickOne([LIME, PAPER]), s: 2, life: 0.35, max: 0.35 });
        }
        yield 0.016;
      }
      J.x = tx * KX - J.cx;
      J.y = ty * KY - J.cy;
      hit(22, ty, { stop: 0.13, invert: 1, boom: 0.22 });
      shock(tx, ty, "163,230,53", 0, 6, 620);
      pixelRing(tx, ty, LIME, 22, 260);
      // 글자가 벽에 박혀 떨다가 튕겨서 돌아간다
      for (let t = 0; t < 0.4; t += 0.016) {
        J.r = spin + rand(-8, 8);
        yield 0.016;
      }
      Object.assign(J, { held: false, vx: -rand(500, 800), vy: -rand(260, 460), vr: rand(-600, 600) });
      fps(15);
      setPose(P.idle);
      yield 0.25;
    }

    // 머리 폭탄. 머리를 뽑아 심지에 불을 붙이고, 던져서 벽 밑에 떨군 뒤 등을 돌려 웅크린다.
    // 삑삑거리다 부풀어 오르고 터진다. 폭풍에 스틱맨이 밀려나고, 머리는 위에서 떨어져 목에 꽂힌다.
    function* headMissile() {
      setMove(7);
      fps(15);
      yield* dash(HOME - 46, 0.18);
      fps(12);
      setPose(P.throwUp);
      yield 0.12;
      man.headless = true;
      man.prop = "head";
      man.sq = 1.15;
      // 심지에 불이 붙는다
      for (let t = 0; t < 0.3; t += 0.016) {
        const hx0 = man.j.hF[0] + 6;
        const hy0 = man.j.hF[1] - 17;
        parts.push({ k: "spark", x: hx0, y: hy0, px: hx0, py: hy0, vx: rand(-70, 70), vy: rand(-110, -10), c: pickOne([GOLD, GOLD, PAPER, PINK]), s: Math.random() < 0.3 ? 2 : 1, life: rand(0.1, 0.28), max: 0.28 });
        yield 0.016;
      }
      fps(30);
      setPose(P.throwEnd, "pop");
      play("swish", 0.8);
      man.prop = null;
      man.sq = 0.85;
      const bx0 = man.j.hF[0];
      const by0 = man.j.hF[1];
      const bx1 = WALL_X - 5;
      const by1 = FLOOR - 7;
      missile = { x: bx0, y: by0, lit: false, fuse: 1, scale: 1 };
      const fizz = (n = 1) => {
        const sc = missile.scale;
        const fx1 = missile.x + (4 + missile.fuse * 5) * sc;
        const fy1 = missile.y + (-8 - missile.fuse * 6) * sc;
        for (let i = 0; i < n; i++) {
          parts.push({ k: "spark", x: fx1, y: fy1, px: fx1, py: fy1, vx: rand(-80, 80), vy: rand(-120, 20), c: pickOne([GOLD, GOLD, PAPER, PINK]), s: Math.random() < 0.3 ? 2 : 1, life: rand(0.1, 0.3), max: 0.3 });
        }
      };
      for (let t = 0; t < 0.4; t += 0.016) {
        const u = t / 0.4;
        missile.x = lerp(bx0, bx1 - 7, u);
        missile.y = lerp(by0, by1, u) - 46 * 4 * u * (1 - u);
        missile.fuse = 1 - u * 0.4;
        fizz(2);
        yield 0.016;
      }
      dust(missile.x, FLOOR - 1, 5, 40, 8);
      play("bonk", 0.8);
      man.face = -1;
      setPose(P.crouch, "pop");
      man.sq = 0.7;
      for (let t = 0; t < 0.13; t += 0.016) {
        const u = t / 0.13;
        missile.x = lerp(bx1 - 7, bx1, u);
        missile.y = by1 - 6 * 4 * u * (1 - u);
        fizz(1);
        yield 0.016;
      }
      // 삑, 삑, 삑
      for (const gap of [0.1, 0.065, 0.04]) {
        missile.lit = true;
        missile.scale = 1.18;
        missile.fuse -= 0.18;
        st.dirty = true;
        play("tick", 0.7, 1 + (0.24 - gap) * 3);
        fizz(4);
        yield 0.035;
        missile.lit = false;
        missile.scale = 1;
        st.dirty = true;
        for (let t = 0; t < gap; t += 0.016) {
          fizz(1);
          yield 0.016;
        }
      }
      // 부풀어 오른다
      gather(missile.x, missile.y, 22, [GOLD, PAPER, PINK]);
      jolt(missile.x, missile.y, -7);
      for (let t = 0; t < 0.13; t += 0.016) {
        missile.scale = 1 + (t / 0.13) * 0.8;
        missile.lit = !missile.lit;
        missile.fuse = 0;
        st.dirty = true;
        yield 0.016;
      }
      // 터진다
      const ex = missile.x;
      const ey = missile.y;
      missile.lit = false;
      missile.scale = 1;
      hit(20, ey - 6, { stop: 0.1, invert: 2, boom: 0.2 });
      blast(ex, ey - 4, 2.6, PINK);
      play("boom", 1, 0.8);
      play("debris", 0.7);
      glow(ex, ey - 4, 440, "255,190,110", 520);
      shock(ex, ey - 4, "255,255,255", 0, 7, 620);
      lens(ex, ey - 4, 5, 640);
      rubble(ex, ey - 6, 26, -1, 1.5);
      for (let i = 0; i < 12; i++) {
        chunks.push({ x: ex + rand(-4, 4), y: ey - rand(0, 12), vx: rand(-260, 120), vy: -rand(260, 520), s: Math.ceil(rand(1, 4)), life: 1 });
      }
      dust(ex, FLOOR - 1, 26, 190, 26);
      thump(ex, 15);
      st.shake = 1;
      // 폭풍에 밀려난다
      const kx = man.x;
      man.sq = 0.62;
      man.sqv = 0;
      for (let t = 0; t < 0.24; t += 0.016) {
        const u = t / 0.24;
        man.x = lerp(kx, kx - 20, easeOutCubic(u));
        missile.x = lerp(ex, ex - 26, u);
        missile.y = lerp(ey, -24, easeOutCubic(u));
        if (Math.random() < 0.7) dust(man.x + 6, FLOOR - 1, 1, 30, 8);
        yield 0.016;
      }
      missile = null;
      fps(12);
      yield 0.22;
      man.face = 1;
      setPose(P.idle);
      man.snapHead = true;
      st.dirty = true;
      yield 0.25;
      // 머리가 위에서 떨어져 목에 꽂힌다
      fps(30);
      missile = { x: man.j.headT[0], y: -12, lit: false, fuse: 0, scale: 1 };
      for (let t = 0; t < 0.26; t += 0.016) {
        const u = t / 0.26;
        missile.x = man.j.headT[0];
        missile.y = lerp(-12, man.j.headT[1], u * u);
        yield 0.016;
      }
      missile = null;
      man.headless = false;
      man.snapHead = true;
      man.sq = 0.6;
      man.sqv = 0;
      st.shake = Math.min(1, st.shake + 0.15);
      sparks(man.j.headT[0], man.j.headT[1], 6, [PAPER, GOLD], 0.4);
      st.dirty = true;
      fps(15);
      yield 0.3;
    }

    function* finisher() {
      setMove(8);
      fps(15);
      const tx = HOME - 80;
      yield* dash(tx, 0.26);
      fps(10);
      setPose(P.charge);
      man.sq = 0.72;
      st.charging = true;
      play("charge", 0.8, 0.6);
      for (let i = 0; i < 13; i++) {
        gather(man.x, FLOOR - 14, 7, [PINK, CYAN, LIME, PAPER]);
        st.shake = Math.min(1, st.shake + 0.05 + i * 0.012);
        jolt(man.x, FLOOR - 14, -(1 + i * 0.3));
        yield 0.075;
      }
      st.charging = false;
      fps(30);
      setPose(P.flykick, "pop");
      man.sq = 1.25;
      const x0 = man.x;
      for (let i = 1; i <= 7; i++) {
        man.x = lerp(x0, WALL_X - 18, easeInQuad(i / 7));
        man.y = FLOOR - 14;
        dust(man.x - 8, FLOOR - 1, 2, 30, 14);
        parts.push({ k: "dust", x: man.x - 12, y: man.y - rand(4, 26), vx: -160, vy: 0, c: pickOne(ACC), s: 2, life: 0.2, max: 0.2 });
        yield 0.016;
      }
      shatter();
      const x1 = man.x;
      for (let t = 0; t < 0.3; t += 0.016) {
        man.x = lerp(x1, WALL_X + 30, t / 0.3);
        yield 0.016;
      }
      fps(15);
      yield* land(man.x);
      yield 0.15;
    }

    const firework = (x, top, c) => parts.push({ k: "rocket", x, y: FLOOR, y0: FLOOR, ty: top, c, s: 2, life: 0.4, max: 0.4 });

    // 승리 연출: 폭죽, 연속 백덤블링, 이름 글자를 징검다리처럼 밟고 올라가 포즈.
    function* reveal() {
      setMove(9);
      revealRef.current?.(true);
      fps(30);
      firework(WALL_X - 30, Y(60), PINK);
      firework(WALL_X + 14, Y(40), CYAN);
      yield* jumpTo(WALL_X - 14, 0.5, 64, -2);
      firework(WALL_X - 70, Y(50), LIME);

      const all = jolts.filter((j) => j.step).sort((a, b) => b.cx - a.cx);
      const steps = all.length >= 3 ? [all[0], all[Math.floor(all.length / 2)], all[all.length - 1]] : all;
      if (steps.length) {
        yield* dash(clamp(steps[0].cx / KX + 26, 14, WALL_X - 20), 0.3);
        const topOf = (J) => (J.cy - J.hh * 0.7 + J.y) / KY;
        for (let i = 0; i < steps.length; i++) {
          const J = steps[i];
          const lastOne = i === steps.length - 1;
          const tx = J.cx / KX;
          yield* arc(tx, topOf(J), i === 0 ? 0.5 : 0.44, i === 0 ? 46 : 30, lastOne ? -1 : 0);
          // 글자가 트램펄린처럼 눌렸다가 튀어 오른다. 스틱맨은 글자에 붙어서 같이 내려간다.
          J.vy += 400;
          J.vr += rand(-120, 120);
          man.sq = 0.6;
          man.sqv = 0;
          setPose(P.crouch, "snap");
          sparks(tx, topOf(J), 10, [ACC[i % 3], PAPER], 0.6);
          dust(tx, topOf(J), 5, 40, 8);
          for (const N of all) if (N !== J) N.vy += 120 / (1 + Math.abs(N.cx - J.cx) / 60);
          play("land", 0.7);
          for (let t = 0; t < (lastOne ? 0.2 : 0.11); t += 0.016) {
            man.y = topOf(J);
            yield 0.016;
          }
        }
        // 맨 앞 글자 위에서 포즈
        const top = steps[steps.length - 1];
        setPose(P.tada, "pop");
        man.sq = 1.3;
        const px0 = (top.cx + 60) / KX;
        firework(px0, man.y - 46, GOLD);
        firework(px0 + 40, man.y - 30, PINK);
        fps(12);
        for (let t = 0, beat = 0; t < 1.5; t += 0.016) {
          man.y = topOf(top);
          if (t >= beat) {
            beat += 0.45;
            man.sq = 1.14;
            top.vy += 170;
            for (const N of all) N.vr += rand(-50, 50);
            sparks(man.x + rand(-14, 14), man.y - rand(20, 44), 5, [GOLD, PAPER], 0.3);
          }
          yield 0.016;
        }
        fps(30);
        firework(px0 + 90, man.y - 20, CYAN);
      } else {
        setPose(P.tada, "pop");
        yield 1.6;
      }
      yield 0.5;
      revealRef.current?.(false);
    }

    function* newWall() {
      setMove(-1);
      yield* jumpTo(HOME - 30, 0.62, 70, 2);
      resetWall();
      Object.assign(wall, { dead: false, dmg: 0, stage: 0, tilt: 0, ox: 0, v: 0, drop: -(WALL_TOP + WALL_H + 20), dropV: 0 });
      st.hits = 0;
      while (wall.drop < 0) yield 0.016;
      st.shake = 0.8;
      st.dirty = true;
      dust(WALL_X + WALL_W / 2, FLOOR - 1, 26, 150, 30);
      thump(WALL_X + WALL_W / 2, 15);
      sweep(WALL_X + WALL_W / 2);
      play("heavy", 1, 0.8);
      play("debris", 0.6);
      man.sq = 1.3;
      man.y = FLOOR - 6;
      setPose(P.fall ?? P.air, "pop");
      yield 0.12;
      yield* land(man.x);
      yield 0.45;
    }

    function* show() {
      yield 0.8;
      for (;;) {
        yield* punchRush();
        yield 0.3;
        yield* roundhouse();
        yield 0.3;
        yield* hammer();
        yield 0.3;
        yield* flashDraw();
        yield 0.3;
        yield* itano();
        yield 0.2;
        yield* guns();
        yield 0.3;
        yield* letterThrow();
        yield 0.2;
        yield* headMissile();
        yield 0.3;
        yield* finisher();
        yield* reveal();
        yield* newWall();
      }
    }
    const script = show();
    let wait = 0;

    // ---------- 갱신 ----------
    const update = (dt) => {
      wait -= dt;
      let guard = 0;
      while (wait <= 0 && guard++ < 60) wait += script.next().value || 0;

      for (let i = 0; i < 11; i++) {
        man.vel[i] += ((man.target[i] - man.pose[i]) * SPRING_K[i] - man.vel[i] * SPRING_D[i]) * dt;
        man.pose[i] += man.vel[i] * dt;
        const lim = LIMIT[i];
        if (lim && (man.pose[i] < lim[0] || man.pose[i] > lim[1])) {
          man.pose[i] = clamp(man.pose[i], lim[0], lim[1]);
          man.vel[i] = 0;
        }
      }
      man.sqv += (1 - man.sq) * 300 * dt - man.sqv * 14 * dt;
      man.sq += man.sqv * dt;
      man.propT = Math.min(1, man.propT + dt * 5);

      man.j = rig();
      if (man.snapHead) {
        man.hp = [...man.j.headT];
        man.hv = [0, 0];
        man.snapHead = false;
      } else {
        for (let i = 0; i < 2; i++) {
          man.hv[i] += ((man.j.headT[i] - man.hp[i]) * 900 - man.hv[i] * 38) * dt;
          man.hp[i] += man.hv[i] * dt;
        }
        // 머리가 목에서 너무 멀리 떨어지지 않게 묶는다.
        const dx = man.hp[0] - man.j.headT[0];
        const dy = man.hp[1] - man.j.headT[1];
        const dl = Math.hypot(dx, dy);
        if (dl > 4) {
          man.hp[0] = man.j.headT[0] + (dx / dl) * 4;
          man.hp[1] = man.j.headT[1] + (dy / dl) * 4;
        }
      }

      // 빠르게 움직일 때 반투명 잔상을 띄엄띄엄 남긴다.
      const hipSpeed = man.lastHip && dt > 0 ? Math.hypot(man.j.hip[0] - man.lastHip[0], man.j.hip[1] - man.lastHip[1]) / dt : 0;
      man.lastHip = man.j.hip;
      man.ghostT -= dt;
      if (hipSpeed > 160 && hipSpeed < 5000 && man.ghostT <= 0) {
        man.ghostT = 0.045;
        ghosts.push({ j: man.j, hp: [...man.hp], sq: man.sq, headless: man.headless, life: 0.26, max: 0.26, c: Math.random() < 0.5 ? PAPER : ACC[st.hits % 3] });
      }

      wall.tilt += (Math.min(0.075, (wall.dmg / 300) * 0.075) - wall.tilt) * Math.min(1, dt * 6);
      wall.v += -wall.ox * 420 * dt - wall.v * 20 * dt;
      wall.ox += wall.v * dt;
      if (wall.drop < 0) {
        wall.dropV += 1500 * dt;
        wall.drop = Math.min(0, wall.drop + wall.dropV * dt);
      }

      if (missile && missile.vx) {
        missile.t += dt;
        missile.x += missile.vx * dt;
        missile.y += Math.sin(missile.t * 40) * 0.6;
        parts.push({ k: "dust", x: missile.x - 7, y: missile.y + rand(-2, 2), vx: rand(-60, -20), vy: rand(-14, 14), c: pickOne([PINK, GOLD, PAPER]), s: Math.random() < 0.4 ? 2 : 1, life: 0.35, max: 0.35 });
        if (missile.x >= WALL_X - 5) missile.vx = 0;
      }

      for (const c of chunks) {
        if (c.fade) c.life -= dt;
        if (c.rest) continue;
        c.vy += 520 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.cool > 0) c.cool -= dt;
        else if (c.x < WALL_X - 30) pelt(c);
        if (c.y > FLOOR - 1 && c.vy > 0) {
          c.y = FLOOR - 1;
          c.vy *= -0.38;
          c.vx *= 0.6;
          if (Math.abs(c.vy) < 14) {
            c.rest = true;
            c.vx = c.vy = 0;
          }
        }
      }
      chunks = chunks.filter((c) => c.life > 0);
      for (const sl of slabs) {
        if (sl.fade) sl.life -= dt;
        if (sl.rest) continue;
        sl.vy += 520 * dt;
        sl.x += sl.vx * dt;
        sl.y += sl.vy * dt;
        sl.a += sl.av * dt;
        if (sl.y > FLOOR - 5 && sl.vy > 0) {
          sl.y = FLOOR - 5;
          if (Math.abs(sl.vy) > 30) dust(sl.x, FLOOR - 1, 3, 40, 8);
          sl.vy *= -0.3;
          sl.vx *= 0.55;
          sl.av *= 0.4;
          if (Math.abs(sl.vy) < 40) {
            // 큰 덩어리는 바닥에 닿아 멈추면 잘게 부서져 잔해 더미가 된다.
            sl.fade = true;
            sl.life = 0;
            for (let i = 0; i < 7; i++) {
              chunks.push({ x: sl.x + rand(-7, 7), y: FLOOR - 1 - rand(0, 5), vx: rand(-50, 50), vy: -rand(20, 90), s: Math.ceil(rand(1, 4)), life: 1 });
            }
            dust(sl.x, FLOOR - 1, 6, 60, 12);
          }
        }
      }
      if (slabs.length > 26) slabs.slice(0, slabs.length - 26).forEach((sl) => (sl.fade = true));
      slabs = slabs.filter((sl) => sl.life > 0);
      for (const p of parts) {
        if (p.delay > 0) {
          p.delay -= dt;
          continue;
        }
        p.life -= dt;
        if (p.k === "spark") {
          p.px = p.x;
          p.py = p.y;
          p.vy += 640 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.y > FLOOR - 1 && p.vy > 0) {
            p.y = FLOOR - 1;
            p.vy *= -0.4;
            p.vx *= 0.6;
          }
        } else if (p.k === "dust") {
          p.vx *= 1 - dt * 3.2;
          p.vy *= 1 - dt * 2;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        } else if (p.k === "fire") {
          // 흰색 → 금색 → 강조색 → 재. 빠르게 퍼졌다가 멈추며 떠오른다.
          const k = p.life / p.max;
          p.vx *= 1 - dt * 5.5;
          p.vy = p.vy * (1 - dt * 5.5) - 70 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.c = k > 0.75 ? PAPER : k > 0.5 ? GOLD : k > 0.25 ? p.tint : "#5a5750";
          p.s = k > 0.6 ? 4 : k > 0.3 ? 3 : 2;
        } else if (p.k === "smoke") {
          p.vx *= 1 - dt * 1.5;
          p.x += p.vx * dt + Math.sin(p.life * 4 + p.y) * 6 * dt;
          p.y += p.vy * dt;
          p.s = p.life / p.max > 0.5 ? 3 : 2;
        } else if (p.k === "ember") {
          p.x += Math.sin(p.life * 5 + p.y) * 12 * dt;
          p.y += p.vy * dt;
        } else if (p.k === "rocket") {
          p.y = lerp(p.y0, p.ty, easeOutCubic(1 - Math.max(0, p.life) / p.max));
          parts.push({ k: "dust", x: p.x, y: p.y + 3, vx: rand(-8, 8), vy: rand(10, 40), c: PAPER, s: 1, life: 0.25, max: 0.25 });
          if (p.life <= 0) {
            sparks(p.x, p.ty, 34, [p.c, p.c, PAPER], 0.75);
            pixelRing(p.x, p.ty, p.c, 16, 150);
            jolt(p.x, p.ty, 2.5);
            play("pop", 0.6);
          }
        } else if (p.k === "suck") {
          const u = 1 - p.life / p.max;
          p.x += (p.tx - p.x) * u * u * 0.5;
          p.y += (p.ty - p.y) * u * u * 0.5;
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 1 - dt * 4;
          p.vy *= 1 - dt * 4;
        }
      }
      parts = parts.filter((p) => p.life > 0);
      if (parts.length > 700) parts.splice(0, parts.length - 700);
      for (const f of fx) f.life -= dt;
      fx = fx.filter((f) => f.life > 0);
      for (const ms of missiles) {
        for (const q of ms.trail) q.life -= dt;
        if (ms.trail.length && ms.trail[0].life <= 0) ms.trail = ms.trail.filter((q) => q.life > 0);
        if (ms.done) continue;
        ms.t += dt / ms.dur;
        const u = Math.min(1, ms.t);
        const e = Math.pow(u, 1.7); // 천천히 빠져나와서 가속하며 꽂힌다
        const a = (1 - e) ** 3;
        const b = 3 * (1 - e) ** 2 * e;
        const c = 3 * (1 - e) * e * e;
        const d = e ** 3;
        ms.x = a * ms.p0[0] + b * ms.p1[0] + c * ms.p2[0] + d * ms.p3[0];
        ms.y = a * ms.p0[1] + b * ms.p1[1] + c * ms.p2[1] + d * ms.p3[1];
        ms.trail.push({ x: ms.x, y: ms.y, life: 0.7 });
        if (u >= 1) {
          ms.done = true;
          if (!wall.dead) {
            const ix = hit(ms.lastOne ? 13 : 8, ms.p3[1], { stop: ms.lastOne ? 0.09 : 0.035, boom: ms.lastOne ? 0.14 : 0 });
            blast(ix, ms.p3[1], ms.lastOne ? 1.5 : 1, ms.c);
            play("boom", ms.lastOne ? 0.9 : 0.6, ms.lastOne ? 0.9 : 1.15);
            pixelRing(ix, ms.p3[1], ms.c, 12, 170);
            sparks(ix, ms.p3[1], 8, [ms.c, GOLD, PAPER], 0.9, -1);
            glow(ix, ms.p3[1], ms.lastOne ? 260 : 150, "255,200,120", 280);
          }
        }
      }
      missiles = missiles.filter((ms) => !ms.done || ms.trail.length);
      for (const b of bolts) b.life -= dt;
      bolts = bolts.filter((b) => b.life > 0);
      for (const g of ghosts) g.life -= dt;
      ghosts = ghosts.filter((g) => g.life > 0);
    };

    // ---------- 흑백 겹 ----------
    const curve = (c, A, J, E) => {
      c.beginPath();
      c.moveTo(A[0], A[1]);
      c.quadraticCurveTo(J[0] + (J[0] - (A[0] + E[0]) / 2) * 0.3, J[1] + (J[1] - (A[1] + E[1]) / 2) * 0.3, E[0], E[1]);
      c.stroke();
    };
    const drawHead = (c, x, y, vx = 0, vy = 0, sq = 1, stroke = INK, fill = VOID) => {
      const speed = Math.hypot(vx, vy);
      const stretch = clamp(speed / 650, 0, 0.5);
      const hs = clamp(sq, 0.55, 1.35);
      c.save();
      c.translate(x, y);
      if (stretch > 0.04) {
        const a = Math.atan2(vy, vx);
        c.rotate(a);
        c.scale(1 + stretch, 1 / (1 + stretch));
        c.rotate(-a);
      }
      c.strokeStyle = stroke;
      c.lineWidth = 2.5;
      c.beginPath();
      c.ellipse(0, 0, HEAD / Math.sqrt(hs), HEAD * hs, 0, 0, Math.PI * 2);
      if (fill) {
        c.fillStyle = fill;
        c.fill();
      }
      c.stroke();
      c.restore();
    };
    // 스틱맨 한 명을 그린다. 본체는 흑백 겹에, 잔상은 컬러 겹에 반투명으로 같은 함수로 그린다.
    const drawFigure = (c, f, color, fill) => {
      const j = f.j;
      c.strokeStyle = color;
      c.lineWidth = 3;
      c.lineCap = "round";
      c.lineJoin = "round";
      curve(c, j.hip, j.kB, j.fB);
      curve(c, j.sh, j.eB, j.hB);
      curve(c, j.hip, j.mid, j.sh);
      if (!f.headless) {
        const hp = f.hp || j.headT;
        c.beginPath();
        c.moveTo(j.sh[0], j.sh[1]);
        c.lineTo(hp[0], hp[1]);
        c.stroke();
        drawHead(c, hp[0], hp[1], f.hv ? f.hv[0] : 0, f.hv ? f.hv[1] : 0, f.sq, color, fill);
      }
      c.strokeStyle = color;
      c.lineWidth = 3;
      curve(c, j.hip, j.kF, j.fF);
      curve(c, j.sh, j.eF, j.hF);
    };

    const drawMan = () => {
      const j = man.j;
      if (!j) return;
      // 스미어: 직전 프레임에서 손이나 발이 크게 움직였으면 호 모양으로 번진다.
      if (man.prev) {
        m.strokeStyle = INK;
        m.lineCap = "round";
        m.lineWidth = 4;
        for (const [key, root] of [["hF", j.sh], ["fF", j.hip], ["hB", j.sh]]) {
          const a = man.prev[key];
          const b = j[key];
          const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (d < 9 || d > 60) continue;
          const mx = (a[0] + b[0]) / 2;
          const my = (a[1] + b[1]) / 2;
          const ox = mx - root[0];
          const oy = my - root[1];
          const ol = Math.hypot(ox, oy) || 1;
          m.beginPath();
          m.moveTo(a[0], a[1]);
          m.quadraticCurveTo(mx + (ox / ol) * d * 0.3, my + (oy / ol) * d * 0.3, b[0], b[1]);
          m.stroke();
        }
      }
      man.prev = { hF: j.hF, fF: j.fF, hB: j.hB };
      drawFigure(m, man, INK, VOID);
    };

    const drawProp = () => {
      const j = man.j;
      if (!man.prop || !j) return;
      const sc = easeOutBack(man.propT);
      m.fillStyle = INK;
      m.strokeStyle = INK;
      if (man.prop === "head") {
        drawHead(m, j.hF[0] + 1, j.hF[1] - 7);
        return;
      }
      if (man.prop === "bazooka") {
        // 네모난 바주카 두 문
        for (const [[gx, gy], dir] of [[j.hF, 1], [j.hB, -1]]) {
          m.save();
          m.translate(gx, gy);
          m.scale(sc * dir, sc);
          m.fillStyle = INK;
          m.fillRect(-5, -6, 17, 10);
          m.fillStyle = VOID;
          m.fillRect(8, -4, 3, 6);
          m.fillRect(-3, -4, 2, 6);
          m.restore();
        }
        return;
      }
      if (man.prop === "guns") {
        for (const [gx, gy] of [j.hF, j.hB]) {
          m.save();
          m.translate(gx, gy);
          m.scale(sc, sc);
          m.fillRect(-1, -3, 9, 3);
          m.fillRect(-1, -1, 3, 5);
          m.restore();
        }
        return;
      }
      if (man.prop === "sword" && !man.swordOut) {
        m.lineWidth = 2;
        m.beginPath();
        m.moveTo(j.hip[0] + 3 * man.face, j.hip[1] - 2);
        m.lineTo(j.hip[0] - 19 * man.face, j.hip[1] + 5);
        m.stroke();
        return;
      }
      m.save();
      m.translate(j.hF[0], j.hF[1]);
      m.rotate(Math.atan2(j.hF[1] - j.eF[1], j.hF[0] - j.eF[0]));
      m.scale(sc, sc);
      if (man.prop === "hammer") {
        m.lineWidth = 2.5;
        m.beginPath();
        m.moveTo(-4, 0);
        m.lineTo(20, 0);
        m.stroke();
        m.fillRect(18, -11, 13, 22);
        m.fillStyle = VOID;
        m.fillRect(21, -8, 7, 3);
      } else {
        m.lineWidth = 2;
        m.beginPath();
        m.moveTo(-2, 0);
        m.lineTo(28, 0);
        m.moveTo(3, -4);
        m.lineTo(3, 4);
        m.stroke();
      }
      m.restore();
    };

    const drawWall = () => {
      if (wall.dead) return;
      const x = Math.round(WALL_X + wall.ox);
      m.save();
      m.translate(0, wall.drop);
      if (wall.tilt > 0.002) {
        m.translate(x + WALL_W / 2, FLOOR);
        m.rotate(wall.tilt);
        m.translate(-(x + WALL_W / 2), -FLOOR);
      }
      m.drawImage(wallCv, x, WALL_TOP);
      m.strokeStyle = VOID;
      m.lineWidth = 1;
      m.lineCap = "butt";
      for (const line of wall.lines) {
        m.beginPath();
        line.forEach(([px, py], i) => (i === 0 ? m.moveTo(x + px, py) : m.lineTo(x + px, py)));
        m.stroke();
      }
      m.restore();
    };

    const drawMono = () => {
      m.setTransform(1, 0, 0, 1, 0, 0);
      m.fillStyle = VOID;
      m.fillRect(0, 0, LW, LH);
      m.fillStyle = INK;
      m.fillRect(0, FLOOR, LW, 1);
      drawWall();

      const jitter = st.charging ? rand(-1, 1) : 0;
      if (jitter && man.j) for (const key of Object.keys(man.j)) man.j[key] = [man.j[key][0] + jitter, man.j[key][1]];
      drawMan();
      drawProp();

      if (missile) {
        m.save();
        m.translate(missile.x, missile.y);
        m.scale(missile.scale || 1, missile.scale || 1);
        drawHead(m, 0, 0, 0, 0, 1, INK, missile.lit ? INK : VOID);
        if (missile.fuse > 0) {
          // 심지: 타 들어가며 짧아진다
          m.strokeStyle = INK;
          m.lineWidth = 1.5;
          m.beginPath();
          m.moveTo(2, -6);
          m.quadraticCurveTo(6, -10, 4 + missile.fuse * 5, -8 - missile.fuse * 6);
          m.stroke();
        }
        m.restore();
      }

      m.strokeStyle = INK;
      m.fillStyle = INK;
      for (const f of fx) {
        if (f.type === "star") {
          // 가운데를 비운 집중선. 길이와 굵기가 제각각이다.
          if (!f.rays) {
            const n = f.n || 8;
            f.rays = Array.from({ length: n }, (_, i) => [((i + rand(-0.35, 0.35)) / n) * Math.PI * 2, rand(0.5, 1), Math.random() < 0.3 ? 2 : 1]);
          }
          const inner = (f.inner ?? 0.36) * f.r;
          m.lineCap = "butt";
          for (const [a, len, w] of f.rays) {
            m.lineWidth = w;
            m.beginPath();
            m.moveTo(f.x + Math.cos(a) * inner, f.y + Math.sin(a) * inner);
            m.lineTo(f.x + Math.cos(a) * f.r * len, f.y + Math.sin(a) * f.r * len);
            m.stroke();
          }
        } else if (f.type === "blast") {
          // 꽉 찬 원이 한 프레임, 다음 프레임엔 속이 빈 테두리
          const k = f.life / f.max;
          m.fillStyle = INK;
          m.beginPath();
          m.arc(f.x, f.y, f.r * (1.5 - k * 0.5), 0, Math.PI * 2);
          m.fill();
          if (k < 0.55) {
            m.fillStyle = VOID;
            m.beginPath();
            m.arc(f.x, f.y, f.r * 1.15, 0, Math.PI * 2);
            m.fill();
          }
        } else if (f.type === "flare") {
          const k = f.life / f.max;
          m.fillStyle = INK;
          m.fillRect(0, Math.round(f.y - 1 - k * 2), LW, Math.max(1, Math.round(1 + k * 4)));
          m.fillRect(Math.round(f.x - 1), Math.round(f.y - 60 * k), 2, Math.round(120 * k));
          m.beginPath();
          m.ellipse(f.x, f.y, 26 * k, 26 * k, 0, 0, Math.PI * 2);
          m.fill();
        } else {
          m.lineWidth = f.w;
          m.lineCap = "butt";
          m.beginPath();
          m.moveTo(f.x1, f.y1);
          m.lineTo(f.x2, f.y2);
          m.stroke();
        }
      }

      // 2색 양자화: 밝은 픽셀은 종이색, 나머지는 투명. 반전 프레임에서는 뒤집는다.
      const img = m.getImageData(0, 0, LW, LH);
      const d = img.data;
      const inv = st.invert > 0;
      for (let i = 0; i < d.length; i += 4) {
        const on = d[i] + d[i + 1] + d[i + 2] >= 384;
        if (on !== inv) {
          d[i] = 243;
          d[i + 1] = 239;
          d[i + 2] = 230;
          d[i + 3] = inv ? 200 : 255;
        } else if (inv) {
          d[i] = d[i + 1] = d[i + 2] = 11;
          d[i + 3] = 255;
        } else {
          d[i + 3] = 0;
        }
      }
      m.putImageData(img, 0, 0);
      if (st.invert > 0) st.invert -= 1;
    };

    // ---------- 컬러 겹 + 합성 ----------
    const px = (x, y, s, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), s, s);
    };
    const composite = () => {
      ctx.clearRect(0, 0, LW, LH);
      const sh = st.shake * st.shake;
      st.sx = Math.round(rand(-1, 1) * 6 * sh);
      st.sy = Math.round(rand(-1, 1) * 6 * sh);
      ctx.drawImage(mono, st.sx, st.sy);
      ctx.save();
      ctx.translate(st.sx, st.sy);

      for (const g of ghosts) {
        ctx.globalAlpha = 0.34 * clamp(g.life / g.max, 0, 1);
        drawFigure(ctx, g, g.c, null);
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = PAPER;
      for (const sl of slabs) {
        if (sl.life < 0.5 && Math.random() < 0.5) continue;
        const c = Math.cos(sl.a);
        const sn = Math.sin(sl.a);
        ctx.beginPath();
        sl.pts.forEach(([qx, qy], i) => {
          const X = Math.round(sl.x + qx * c - qy * sn);
          const Yy = Math.round(sl.y + qx * sn + qy * c);
          if (i === 0) ctx.moveTo(X, Yy);
          else ctx.lineTo(X, Yy);
        });
        ctx.closePath();
        ctx.fill();
      }

      for (const b of bolts) {
        if (Math.random() < 0.2) continue;
        for (let i = 0; i < b.pts.length - 1; i++) {
          const [ax, ay] = b.pts[i];
          const [bx, by] = b.pts[i + 1];
          const n = Math.ceil(Math.hypot(bx - ax, by - ay));
          for (let k = 0; k <= n; k++) {
            const u = k / n;
            px(lerp(ax, bx, u), lerp(ay, by, u), b.life > 0.12 ? 2 : 1, k % 5 === 0 ? PAPER : b.c);
          }
        }
      }

      // 미사일: 연기 꼬리는 지나온 자리에 남아 서서히 옅어진다.
      for (const ms of missiles) {
        for (let i = 0; i < ms.trail.length; i++) {
          const q = ms.trail[i];
          if (q.life < 0.25 && (i + ((q.x + q.y) | 0)) % 2) continue;
          px(q.x - 1, q.y - 1, q.life > 0.45 ? 3 : q.life > 0.25 ? 2 : 1, q.life > 0.6 ? ms.c : PAPER);
          const nq = ms.trail[i + 1];
          if (nq) px((q.x + nq.x) / 2, (q.y + nq.y) / 2, 1, PAPER);
        }
        if (!ms.done) {
          px(ms.x - 3, ms.y - 3, 6, PAPER);
          px(ms.x - 1, ms.y - 1, 3, ms.c);
          px(ms.x + rand(-5, -3), ms.y + rand(-1, 1), 2, GOLD);
        }
      }
      for (const c of chunks) {
        if (c.life < 0.5 && Math.random() < 0.5) continue; // 깜빡이며 사라진다
        px(c.x, c.y - c.s + 1, c.s, PAPER);
      }
      for (const p of parts) {
        if (p.delay > 0) continue;
        const k = p.life / p.max;
        if (k < 0.3 && Math.random() < 0.45) continue;
        if (p.k === "spark") px(p.px, p.py, 1, p.c);
        px(p.x, p.y, p.s, p.c);
      }
      ctx.restore();
    };

    // 타격 수 표시는 캔버스가 아니라 사이트 서체로 된 DOM 요소다. 벽 왼쪽에 붙여 둔다.
    const hitEl = hitRef.current;
    const hitNum = hitEl?.firstElementChild;
    let shownHits = -1;
    let shownPlace = "";
    let popLive = true;
    const updateCounter = () => {
      if (!hitEl) return;
      const show = st.hits > 0 && !wall.dead;
      if (st.hits !== shownHits) {
        shownHits = st.hits;
        hitNum.textContent = st.hits;
        hitNum.style.color = st.hits > 1 ? ACC[st.hits % 3] : "";
      }
      // 값이 바뀔 때만 스타일을 쓴다. 매 프레임 같은 값을 쓰면 브라우저가 스타일을 계속 다시 계산한다.
      const pop = st.hitPop;
      const place = `${show ? 1 : 0}|${Math.round((WALL_X - 10) * KX)}|${Math.round((WALL_TOP + 16) * KY)}`;
      if (place !== shownPlace) {
        shownPlace = place;
        hitEl.style.opacity = show ? 1 : 0;
        hitEl.style.left = `${(WALL_X - 10) * KX}px`;
        hitEl.style.top = `${(WALL_TOP + 16) * KY}px`;
      }
      if (pop > 0 || popLive) {
        popLive = pop > 0;
        const jx = rand(-1, 1) * pop * pop * 22;
        const jy = rand(-1, 1) * pop * pop * 16;
        hitEl.style.transform = `translate(calc(-100% + ${jx.toFixed(1)}px), ${jy.toFixed(1)}px) scale(${(1 + pop * 0.85).toFixed(3)}) rotate(${(rand(-1, 1) * pop * 14).toFixed(1)}deg)`;
      }
    };

    // ---------- 루프 ----------
    let raf = 0;
    let last = 0;
    let visible = true;
    const frame = (now) => {
      const real = Math.min((now - last) / 1000 || 0, 0.033);
      last = now;
      st.shake = Math.max(0, st.shake - real * 2.2);
      st.hitPop = Math.max(0, st.hitPop - real * 5);
      let ts = 1;
      if (st.slow > 0) {
        st.slow -= real;
        // 정지 직후 아주 짧게만 느리고 곧바로 정상 속도로 돌아온다.
        ts = 0.55;
      }
      if (st.stop > 0) {
        st.stop -= real;
        ts = 0;
      }
      update(real * ts);
      updateJolts(real);
      st.acc += real;
      if (st.dirty || st.acc >= (st.slow > 0 ? 1 / 30 : st.step)) {
        st.acc = 0;
        st.dirty = false;
        drawMono();
      }
      composite();
      updateCounter();
      if (visible) raf = requestAnimationFrame(frame);
    };

    layout();
    Object.assign(man, { x: HOME - 30, y: FLOOR, snapHead: true });
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    const remeasure = window.setTimeout(measure, 1200);
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(remeasure);
      ro.disconnect();
      io.disconnect();
      for (const j of jolts) j.el.style.transform = "";
    };
  }, []);

  const caption =
    move === MOVES.length
      ? labels.cleared
      : move >= 0
        ? `${String(move + 1).padStart(2, "0")} / ${String(MOVES.length).padStart(2, "0")}  ${MOVES[move]}`
        : "";

  return (
    <>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={labels.alt}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />
      <div ref={vfxRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" />
      <div
        ref={hitRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-10 flex items-baseline gap-2 font-display font-bold leading-none opacity-0 transition-opacity duration-200"
        style={{ transformOrigin: "100% 60%" }}
      >
        <span className="text-[clamp(2.6rem,5.2vw,4.75rem)] tabular-nums tracking-tight text-white">0</span>
        <span className="text-xs uppercase tracking-[0.18em] text-white/60 sm:text-sm">hit</span>
      </div>
      <div className="absolute right-4 top-20 z-20 flex items-center gap-3 sm:bottom-7 sm:right-8 sm:top-auto">
        <p className="hidden font-mono text-xs font-bold uppercase tracking-[0.12em] text-white/70 sm:block">
          {caption}
        </p>
        <button
          type="button"
          onClick={() => {
            const a = audioRef.current;
            if (!a.ctx) {
              const Ctx = window.AudioContext || window.webkitAudioContext;
              if (Ctx) a.ctx = new Ctx();
            }
            if (a.ctx && a.ctx.state === "suspended") a.ctx.resume();
            setSound((v) => !v);
          }}
          aria-pressed={sound}
          className="rounded-full border border-white/20 bg-[#0b0b0c]/50 px-3 py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/70 backdrop-blur-sm transition hover:border-white/50 hover:text-white"
        >
          {sound ? labels.soundOn : labels.soundOff}
        </button>
      </div>
    </>
  );
}
