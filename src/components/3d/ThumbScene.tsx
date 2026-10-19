import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei/core/Environment";
import { useGLTF } from "@react-three/drei/core/Gltf";
import { OrbitControls as OrbitControlsConstructor } from "three-stdlib";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function ThumbScene({ glb, autorotate }: { glb: string; autorotate: boolean }) {
  return (
    <Canvas camera={{ position: [8, 6, 10], fov: 40 }}>
      <ThumbContent glb={glb} autorotate={autorotate} />
    </Canvas>
  );
}

function ThumbContent({ glb, autorotate }: { glb: string; autorotate: boolean }) {
  const { scene } = useGLTF(glb);
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    const controls = new OrbitControlsConstructor(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.autoRotate = autorotate;
    controls.autoRotateSpeed = 6;
    controls.enableZoom = false;
    controls.enablePan = false;
    controlsRef.current = controls;

    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);

  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autorotate;
  }, [autorotate]);

  useFrame(() => controlsRef.current?.update());

  return (
    <>
      <Environment preset="studio" />
      <primitive object={scene} />
    </>
  );
}