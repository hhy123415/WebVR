import "./css/test.css";
import { Box, Plane, GltfGenerator } from "./utils/geometry";
import { ControlPanel } from "./utils/ui";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls, Html } from "@react-three/drei";

/**
 * 相机自动更新函数
 * @returns null
 */
function CameraUpdater() {
  const { camera, size } = useThree();

  useEffect(() => {
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}

function Test() {
  // 状态管理窗口尺寸
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 200,
  });

  // 旋转控制状态
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  // 监听窗口变化
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight - 200,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 创建相机（只创建一次）
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

  // const boxPositions = Array(5)
  //   .fill()
  //   .map((_, index) => ({
  //     x: index * 150, // x坐标每次增加150
  //     y: 0,
  //     z: 0,
  //   }));

  return (
    <div className="scene-container">
      <h1>3D模型旋转控制演示</h1>

      <div className="content-wrapper">
        <ControlPanel
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          rotationSpeed={rotationSpeed}
          setRotationSpeed={setRotationSpeed}
        />

        <div className="canvas-container">
          <Canvas
            camera={camera}
            fallback={<div>Sorry no WebGL supported!</div>}
            shadows
          >
            <Suspense fallback={<Loading />}>
              <CameraUpdater />
              {/* 光照 */}
              
              <ambientLight intensity={1} />
              {/* <directionalLight
                color={"white"}
                intensity={1}
                position={[0, 0, 80]}
                decay={0}
                castShadow
              /> */}

              {/* 循环创建多个立方体 */}

              {/* {boxPositions.map((position, index) => (
                <Box
                  key={index} // 必须提供唯一key
                  isRotating={isRotating}
                  rotationSpeed={rotationSpeed}
                  {...position} // 展开位置属性 (x, y, z)
                />
              ))} */}

              {/* 创建地板 */}

              {/* <Plane /> */}

              {/* 外部模型 */}

              <GltfGenerator />

              {/* 轨道控制 */}
              <OrbitControls
                target={[0, 0, 0]}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
              />
              <color attach="background" args={["#aaa"]} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <Html
      center
      style={{
        display: "flex",
        justifyContent: "center",
        width: "200px",
      }}
      className="custom-loading"
    >
      <div>🌀</div>
      <h2>加载中...</h2>
    </Html>
  );
}

export default Test;
