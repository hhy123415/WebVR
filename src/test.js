import "./css/scene.css";
import { GltfGenerator, FbxGenerator } from "./utils/geometry";
import { ControlPanel, FullscreenButton } from "./utils/ui";
import { Loading } from "./utils/load";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { CameraUpdater } from "./utils/cameraUpdater";
import { useFullscreen } from "./utils/useFullScreen";
import { useWindowSize } from "./utils/useWindowSize";

function Test() {
  // 使用自定义钩子管理状态
  const { windowSize, isFullscreen } = useWindowSize();
  const { toggleFullscreen, canvasContainerRef } = useFullscreen(
    windowSize,
    isFullscreen
  );

  // 旋转控制状态
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  // 创建相机
  const camera = useRef(
    new THREE.PerspectiveCamera(
      75,
      windowSize.width / windowSize.height,
      0.1,
      3000
    )
  ).current;

  useEffect(() => {
    camera.position.set(292, 233, 185);
  }, [camera]);

  return (
    <div className={`scene-container`}>
      {!isFullscreen && (
        <header>
          <h1>3D模型演示</h1>
        </header>
      )}

      <div className={`canvas-container`} ref={canvasContainerRef}>
        <ControlPanel
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          rotationSpeed={rotationSpeed}
          setRotationSpeed={setRotationSpeed}
        />

        {/* 全屏按钮 */}
        <FullscreenButton
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />

        <Canvas
          camera={camera}
          fallback={<div>Sorry no WebGL supported!</div>}
          shadows
        >
          <Suspense fallback={<Loading />}>
            <CameraUpdater />
            <ambientLight intensity={1} />
            <directionalLight />
            <GltfGenerator
              modelPath="/model/icecream.glb"
              isRotating={isRotating}
              rotationSpeed={rotationSpeed}
              metalness={0}
              roughness={0}
            />
            <GltfGenerator
              modelPath="/model/ecy1.glb"
              isRotating={isRotating}
              rotationSpeed={rotationSpeed}
              position={[200,0,0]}
              playAnimation={false}
            />
            {/* <FbxGenerator
              modelPath={"/model/ecy.fbx"}
              isRotating={isRotating}
              rotationSpeed={rotationSpeed}
              position={[300,0,0]}
            /> */}
            <OrbitControls
              target={[0, 0, 0]}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
            <color attach="background" args={["#1e293b"]} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default Test;
