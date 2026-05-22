/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Computer({ isMobile }) {
  const groupRef = useRef(null);
  const computer = useGLTF("/desktop_pc/scene-desktop.glb");

  useEffect(() => {
    computer.scene.traverse((child) => {
      child.castShadow = false;
      child.receiveShadow = false;
    });
  }, [computer.scene]);

  useFrame(({ clock }) => {
    if (isMobile) return;
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();
    const baseY = isMobile ? -2.45 : -3.1;
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      key={isMobile ? "m" : "d"}
      frameloop={isMobile ? "demand" : "always"}
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
      <Suspense fallback={null}>
        {!isMobile && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
        <Computer isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
