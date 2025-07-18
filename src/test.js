import "./css/test.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

// 创建一个长方体模型
function Box({ isRotating, rotationSpeed }) {
  const meshRef = useRef();
  
  // 旋转动画
  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
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

// GUI控制面板组件
function ControlPanel({ isRotating, setIsRotating, rotationSpeed, setRotationSpeed }) {
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
      
      <div className="stats">
        <div className="stat-item">
          <span>当前状态:</span>
          <span className={isRotating ? "active" : "inactive"}>
            {isRotating ? "旋转中" : "已停止"}
          </span>
        </div>
        <div className="stat-item">
          <span>速度值:</span>
          <span>{rotationSpeed.toFixed(3)}</span>
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
      1000
    )
  ).current;

  useEffect(() => {
    camera.position.set(292, 233, 185);
  }, [camera]);

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
              {/* 网格模型 */}
              <Box isRotating={isRotating} rotationSpeed={rotationSpeed} />
              {/* 轨道控制 */}
              <OrbitControls
                target={[0,0,0]}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
              />
              <color attach="background" args={["#aaa"]} />
            </Suspense>
          </Canvas>
        </div>
      </div>
      
      <div className="instructions">
        <h3>使用说明:</h3>
        <ul>
          <li>使用右上角的开关控制模型旋转状态</li>
          <li>通过滑块调整模型的旋转速度</li>
          <li>在3D场景中，您可以拖拽、缩放和旋转视角</li>
          <li>当前旋转状态: <span className={isRotating ? "active" : "inactive"}>
            {isRotating ? "旋转中" : "已停止"}
          </span></li>
        </ul>
      </div>
    </div>
  );
}

function Loading() {
  return <h2>🌀 加载中...</h2>;
}

export default Test;