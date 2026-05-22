import { motion } from "framer-motion";
import logo from "../assets/logo.svg";
import gamepad from "../assets/gamepad.png";
import palette from "../assets/palette.png";

// 둥둥 떠다니는 아이콘들 — 각자 다른 위치/크기/속도로 부유.
const items = [
  { src: logo, size: 64, top: "12%", left: "6%", dur: 7, delay: 0, x: 14 },
  { src: gamepad, size: 46, top: "68%", left: "10%", dur: 9, delay: 0.6, x: -12 },
  { src: palette, size: 40, top: "24%", left: "44%", dur: 8, delay: 1.2, x: 10 },
  { src: logo, size: 34, top: "78%", left: "40%", dur: 10, delay: 0.3, x: -16 },
  { src: gamepad, size: 38, top: "8%", left: "30%", dur: 11, delay: 1.6, x: 12 },
];

export default function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
      {items.map((it, i) => (
        <motion.img
          key={i}
          src={it.src}
          alt=""
          aria-hidden
          className="absolute rounded-2xl opacity-40 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          style={{ top: it.top, left: it.left, width: it.size, height: it.size }}
          animate={{ y: [0, -22, 0], x: [0, it.x, 0], rotate: [0, it.x > 0 ? 8 : -8, 0] }}
          transition={{
            duration: it.dur,
            delay: it.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
