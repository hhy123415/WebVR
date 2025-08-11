import { useState, useEffect, useCallback, useRef } from "react";

export function useFullscreen(initialWindowSize, initialFullscreen) {
  const [windowSize, setWindowSize] = useState(initialWindowSize);
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);
  const canvasContainerRef = useRef(null);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const canvasContainer = canvasContainerRef.current;
      if (canvasContainer) {
        const requestFullscreen =
          canvasContainer.requestFullscreen ||
          canvasContainer.mozRequestFullScreen ||
          canvasContainer.webkitRequestFullscreen ||
          canvasContainer.msRequestFullscreen;

        requestFullscreen.call(canvasContainer);
      }
    } else {
      const exitFullscreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

      exitFullscreen.call(document);
    }
  }, [isFullscreen]);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;

      setIsFullscreen(!!fullscreenElement);

      setWindowSize({
        width: window.innerWidth,
        height: isFullscreen ? window.innerHeight : window.innerHeight * 0.8,
      });
    };

    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [isFullscreen]);

  return {
    toggleFullscreen,
    canvasContainerRef,
    isFullscreen,
    windowSize,
  };
}
