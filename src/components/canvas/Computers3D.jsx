/* eslint-disable react/no-unknown-property */
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";

const MODEL_URL = "/desktop_pc/scene-desktop.glb";

function CanvasLoader({ onStall }) {
  const { progress } = useProgress();
  const roundedProgress = Math.round(progress);

  useEffect(() => {
    if (progress < 95 || progress >= 100) return undefined;
    const timeoutId = window.setTimeout(onStall, 8000);
    return () => window.clearTimeout(timeoutId);
  }, [onStall, progress]);

  return (
    <Html center>
      <div className="grid min-w-24 place-items-center gap-3 text-white">
        <span className="h-9 w-9 rounded-full border-2 border-white/20 border-t-simple animate-spin" />
        <span className="font-mono text-xs font-bold text-soft">
          {roundedProgress}%
        </span>
      </div>
    </Html>
  );
}

function Computer({ isMobile, onReady }) {
  const groupRef = useRef(null);
  const computer = useGLTF(MODEL_URL);

  useEffect(() => {
    computer.scene.traverse((child) => {
      child.castShadow = false;
      child.receiveShadow = false;
    });
    onReady();
  }, [computer.scene, onReady]);

  useFrame(({ clock }) => {
    if (isMobile || !groupRef.current) return;

    const t = clock.getElapsedTime();
    const baseY = -3.1;
    groupRef.current.rotation.y = -0.45 + Math.sin(t * 0.55) * 0.045;
    groupRef.current.rotation.x = -0.01 + Math.sin(t * 0.42) * 0.012;
    groupRef.current.rotation.z = -0.1 + Math.sin(t * 0.5 + 0.8) * 0.01;
    groupRef.current.position.y = baseY + Math.sin(t * 0.62) * 0.035;
  });

  return (
    <mesh>
      <hemisphereLight intensity={0.7} groundColor="black" />
      <directionalLight position={[-8, 12, 6]} intensity={1.4} />
      <pointLight color={0xff3d81} intensity={45} position={[7, 5, 0]} />
      <pointLight color={0x22d3ee} intensity={24} position={[-7, 2, 4]} />
      <group
        ref={groupRef}
        position={isMobile ? [0, -2.45, -1.25] : [0, -3.1, -1.5]}
        rotation={[-0.01, -0.45, -0.1]}
      >
        <group scale={isMobile ? 0.86 : 0.78}>
          <primitive object={computer.scene} />
        </group>
      </group>
    </mesh>
  );
}

export default function Computers3D() {
  const [isMobile, setIsMobile] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const retryCountRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleReady = useCallback(() => {
    setModelReady(true);
    retryCountRef.current = 0;
  }, []);

  const handleStall = useCallback(() => {
    if (retryCountRef.current >= 2) return;
    retryCountRef.current += 1;
    setModelReady(false);
    if (typeof useGLTF.clear === "function") {
      useGLTF.clear(MODEL_URL);
    }
    setRetryKey((value) => value + 1);
  }, []);

  return (
    <Canvas
      key={`${isMobile ? "m" : "d"}-${retryKey}`}
      frameloop={isMobile && modelReady ? "demand" : "always"}
      dpr={[1, 1]}
      // 모바일은 fov 를 더 넓혀(줌아웃) 좁은 화면에서도 모델 전체가 들어오게
      camera={{ position: isMobile ? [15.5, 2.7, 4.6] : [20, 3, 5], fov: 30 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
      style={{
        background: "transparent",
        pointerEvents: isMobile ? "none" : "auto",
        touchAction: "pan-y",
      }}
    >
      <Suspense fallback={<CanvasLoader onStall={handleStall} />}>
        {!isMobile && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
        <Computer isMobile={isMobile} onReady={handleReady} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
