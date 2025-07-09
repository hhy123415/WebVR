import "./css/test.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

//创建一个长方体模型
function Box() {
  const meshRef = useRef();
  //旋转动画
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });
  return (
    <mesh ref={meshRef} position={[-50, 0, 0]} receiveShadow castShadow>
      <boxGeometry args={[150, 80, 100]} />
      <meshStandardMaterial color={0xff0000} />
    </mesh>
  );
}

// 相机自动更新组件
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
      1000
    )
  ).current;

  useEffect(() => {
    camera.position.set(292, 233, 185);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <h1>test</h1>
      <div className="canvas-container">
        <Canvas
          camera={camera}
          fallback={<div>Sorry no WebGL supported!</div>}
          shadows
        >
          <Suspense fallback={<Loading />}>
            <CameraUpdater />
            {/* 光照 */}
            <ambientLight intensity={0.3} />
            <directionalLight
              color={"white"}
              intensity={1}
              position={[200, 150, 80]}
              decay={0}
              castShadow
            />
            {/* 引入坐标轴辅助线 */}
            {/* <primitive object={new THREE.AxesHelper(150)} /> */}
            {/* 网格模型 */}
            <Box />
            {/* 轨道控制 */}
            <OrbitControls
              makeDefault
              // 添加 OrbitControls 的特定配置
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
            <color attach="background" args={["#aaa"]} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

export default Test;
