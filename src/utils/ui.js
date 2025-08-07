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
export { ControlPanel };
