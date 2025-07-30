import "./css/test.css";
import metal from "./picture/metal.jpg";
import woodFloor from "./picture/woodFloor.jpg";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls, Html } from "@react-three/drei";

/**
 * 创建立方体模型
 * @param {*} isRotating:是否旋转
 * @param {*} rotationSpeed:旋转速度
 * @param {*} x:x轴坐标
 * @param {*} y:y轴坐标
 * @param {*} z:z轴坐标
 * @returns 网格模型
 */
function Box({ isRotating, rotationSpeed, x, y, z }) {
  const meshRef = useRef();
  // 纹理
  const colorMap = useLoader(THREE.TextureLoader, metal);

  // 旋转动画
  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]} receiveShadow castShadow>
      <boxGeometry args={[150, 80, 100]} />
      <meshStandardMaterial map={colorMap} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Plane() {
  const colorMap = useLoader(THREE.TextureLoader, woodFloor);
  //纹理重复阵列
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(3,3);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
}

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

// GUI控制面板组件
function ControlPanel({
  isRotating,
  setIsRotating,
  rotationSpeed,
  setRotationSpeed,
}) {
  return (
    <div className="control-panel">
      <h2>模型旋转控制</h2>
      <div className="control-group">
        <div className="toggle-switch">
          <span>旋转状态: </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isRotating}
              onChange={() => setIsRotating(!isRotating)}
            />
            <span className="slider"></span>
          </label>
          <span className="status">{isRotating ? "启用" : "禁用"}</span>
        </div>

        <div className="slider-control">
          <label>旋转速度: {rotationSpeed.toFixed(3)}</label>
          <input
            type="range"
            min="0.001"
            max="0.05"
            step="0.001"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
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

  const boxPositions = Array(5)
    .fill()
    .map((_, index) => ({
      x: index * 150, // x坐标每次增加150
      y: 0,
      z: 0,
    }));

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
              <ambientLight intensity={0.3} />
              <directionalLight
                color={"white"}
                intensity={1}
                position={[200, 150, 80]}
                decay={0}
                castShadow
              />
              {/* 循环创建多个立方体 */}
              {boxPositions.map((position, index) => (
                <Box
                  key={index} // 必须提供唯一key
                  isRotating={isRotating}
                  rotationSpeed={rotationSpeed}
                  {...position} // 展开位置属性 (x, y, z)
                />
              ))}

              {/* 创建地板 */}
              <Plane/>

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
        alignItems: "center",
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
