import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

// 相机自动更新函数
function CameraUpdater() {
  const { camera, size } = useThree();

  useEffect(() => {
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}

export {CameraUpdater}