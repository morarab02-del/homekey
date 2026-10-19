import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei/core/Environment";
import { useGLTF } from "@react-three/drei/core/Gltf";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls as OrbitControlsConstructor } from "three-stdlib";
import { Vector3, type Object3D } from "three";

const QUALITY: Record<string, { pixelRatio: number; damping: number }> = {
  low: { pixelRatio: 1, damping: 0.08 },
  med: { pixelRatio: 2, damping: 0.06 },
  high: { pixelRatio: 3, damping: 0.04 },
};

export function ThreeScene({
  glb,
  quality,
  hiddenNames,
  autorotate,
  activeRoom,
}: {
  glb: string;
  quality: "low" | "med" | "high";
  hiddenNames: Set<string>;
  autorotate: boolean;
  activeRoom: { hotspot: [number, number, number] } | null;
}) {
  return (
    <Canvas
      camera={{ position: [8, 6, 10], fov: 40 }}
      dpr={[1, QUALITY[quality].pixelRatio]}
    >
      <SceneContent
        glb={glb}
        quality={quality}
        hiddenNames={hiddenNames}
        autorotate={autorotate}
        activeRoom={activeRoom}
      />
    </Canvas>
  );
}

function SceneContent({
  glb,
  quality,
  hiddenNames,
  autorotate,
  activeRoom,
}: {
  glb: string;
  quality: "low" | "med" | "high";
  hiddenNames: Set<string>;
  autorotate: boolean;
  activeRoom: { hotspot: [number, number, number] } | null;
}) {
  const { scene } = useGLTF(glb);
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    const controls = new OrbitControlsConstructor(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = QUALITY[quality].damping;
    controls.autoRotate = autorotate;
    controls.autoRotateSpeed = 8;
    controls.minDistance = 2;
    controls.maxDistance = 40;
    controls.enablePan = true;
    controlsRef.current = controls;

    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);

  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.dampingFactor = QUALITY[quality].damping;
    controlsRef.current.autoRotate = autorotate;
  }, [quality, autorotate]);

  useEffect(() => {
    scene.traverse((o: Object3D) => {
      o.visible = !hiddenNames.has(o.name);
    });
  }, [scene, hiddenNames]);

  // Smoothly fly the camera toward the active room's hotspot.
  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (activeRoom) controls.target.lerp(new Vector3(...activeRoom.hotspot), 0.12);
    controls.update();
  });

  return (
    <>
      <Environment preset="studio" />
      <primitive object={scene} />
    </>
  );
}