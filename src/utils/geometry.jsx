import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

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

function GltfGenerator({isRotating,rotationSpeed}) {
  const gltf = useGLTF("/model/ecy.glb");
  const meshRef = useRef();

  // 旋转动画
  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  // 遍历模型中的所有材质并调整属性
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      const material = child.material;

      material.metalness = 0.2;
      material.roughness = 0.8;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={100}
      position={[0, 0, 0]}
    />
  );
}

export { Box, Plane, GltfGenerator };
