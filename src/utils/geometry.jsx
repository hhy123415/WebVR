import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGLTF, useFBX } from "@react-three/drei";

/**
 * 创建立方体模型
 * @param {*} isRotating:是否旋转
 * @param {*} rotationSpeed:旋转速度
 * @param {*} x:x轴坐标
 * @param {*} y:y轴坐标
 * @param {*} z:z轴坐标
 * @returns 立方体模型
 */
function Box({ isRotating, rotationSpeed, x, y, z }) {
  const meshRef = useRef();
  // 纹理
  const colorMap = useLoader(THREE.TextureLoader, "/picture/metal.jpg");

  // 旋转动画
  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, z]} receiveShadow castShadow>
      <boxGeometry args={[150, 80, 100]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
}

/**
 * 创建平面
 * @returns 平面模型
 */
function Plane() {
  const colorMap = useLoader(THREE.TextureLoader, "/picture/woodFloor.jpg");
  //纹理重复阵列
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(3, 3);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={colorMap} side={THREE.DoubleSide} />
    </mesh>
  );
}

function GltfGenerator({
  modelPath,
  isRotating,
  rotationSpeed,
  scale = 100,
  position = [0, 0, 0],
  metalness = 0.2,
  roughness = 0.8,
}) {
  // 动态加载传入路径的模型
  const originalScene = useGLTF(modelPath).scene;
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  useEffect(() => {
    originalScene.traverse((child) => {
      if (child.isMesh) {
        const material = child.material;
        // 克隆材质以确保实例间独立
        if (material && !material.isCloned) {
          child.material = material.clone();
          child.material.isCloned = true;
        }
        child.material.metalness = metalness;
        child.material.roughness = roughness;
      }
    });
  }, [originalScene, metalness, roughness]);

  return (
    <primitive
      ref={meshRef}
      object={originalScene}
      scale={scale}
      position={position}
    />
  );
}

function FbxGenerator({
  modelPath,
  isRotating,
  rotationSpeed,
  scale = 1,
  position = [0, 0, 0],
  metalness = 0.2,
  roughness = 0.8,
}) {
  // 使用 useFBX 钩子加载 FBX 模型
  const fbx = useFBX(modelPath);
  const meshRef = useRef();

  // 旋转动画
  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // 使用useEffect确保只在模型加载后修改一次材质
  useEffect(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        const material = child.material;
        material.metalness = metalness;
        material.roughness = roughness;
      }
    });
  }, [fbx, metalness, roughness]);

  return (
    <primitive ref={meshRef} object={fbx} scale={scale} position={position} />
  );
}

export { Box, Plane, GltfGenerator, FbxGenerator };
