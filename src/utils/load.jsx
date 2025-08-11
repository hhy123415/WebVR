import { Html, useProgress } from "@react-three/drei";
import "../css/load.css"

function Loading() {
  // 使用drei的useProgress钩子获取加载进度
  const { progress } = useProgress();

  return (
    <Html center className="custom-loading">
      <div className="loading-container">
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">{Math.round(progress)}%</div>
        <h2>加载中...</h2>
      </div>
    </Html>
  );
}

export { Loading };
