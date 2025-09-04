import "./css/scene.css";
import { GltfGenerator } from "./utils/geometry";
import { ControlPanel, FullscreenButton } from "./utils/ui";
import { Loading } from "./utils/load";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { CameraUpdater } from "./utils/cameraUpdater";
import { useFullscreen } from "./utils/useFullScreen";
import { useWindowSize } from "./utils/useWindowSize";

// 新增音频播放组件
const AudioPlayer = ({ isPlaying, onToggle, volume, onVolumeChange }) => {
  return (
    <div className="audio-control">
      <button onClick={onToggle} className="audio-toggle">
        {isPlaying ? '🔊' : '🔇'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={onVolumeChange}
        className="volume-slider"
      />
    </div>
  );
};

function WuXiang() {
  // 使用自定义钩子管理状态
  const { windowSize, isFullscreen } = useWindowSize();
  const { toggleFullscreen, canvasContainerRef } = useFullscreen(
    windowSize,
    isFullscreen
  );

  // 旋转控制状态
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  
  // 新增音频状态
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const audioRef = useRef(null);

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

  // 处理音频播放/暂停
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        // 处理自动播放限制
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("自动播放被阻止:", error);
          });
        }
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // 处理音量变化
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setMusicVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 修复ESLint警告：在effect内部捕获audioRef.current的值
  useEffect(() => {
    const audioElement = audioRef.current;
    
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, []); // 空依赖数组表示此effect仅在挂载和卸载时运行

  return (
    <div className={`scene-container`}>
      {/* 添加音频元素 - 隐藏但可控制 */}
      <audio 
        ref={audioRef}
        loop
        volume={musicVolume}
        preload="auto"
      >
        <source src="/voice/五香干.mp3" type="audio/mpeg" />
      </audio>
      
      {!isFullscreen && (
        <header>
          <h1>腾蛟五香干制作技艺</h1>
          <p>
            腾蛟五香干制作技艺是以五色生香传承至今，也是老少皆宜的传统美食。
          </p>
          <p>
            腾蛟的五香干历经了百年的演变过程，始终把最原始、最纯粹、最精华的工艺流程保留至今。它的制作流程分三步:
            1.备料。选用上等黄豆、精盐、酱油、桂皮、姜丁、香葱、味精等；2.磨浆。先将黄豆洗净，用清水浸泡一昼夜，然后磨成浆，滤渣后备用；3.煮浆。将磨好的生豆浆上锅煮好后，再添加一定量的水，以降低豆浆浓度和减慢凝固速度。
          </p>
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
        
        {/* 新增音频控制按钮 */}
        <div className="audio-control-container">
          <AudioPlayer 
            isPlaying={isMusicPlaying}
            onToggle={toggleMusic}
            volume={musicVolume}
            onVolumeChange={handleVolumeChange}
          />
        </div>

        <Canvas
          camera={camera}
          fallback={<div>Sorry no WebGL supported!</div>}
          shadows
        >
          <Suspense fallback={<Loading />}>
            <CameraUpdater />
            <ambientLight intensity={1} />
            <directionalLight position={[1, 0, 1]} />
            <GltfGenerator
              modelPath="/model/五香干.glb"
              isRotating={isRotating}
              rotationSpeed={rotationSpeed}
            />
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
      <h2>参考资料:</h2>
      <p>
        <a href="https://wenzhou.zjich.cn/xiangmu/xiangmushow.html?id=4336">
          温州非物质文化遗产网
        </a>
      </p>
    </div>
  );
}

export default WuXiang;