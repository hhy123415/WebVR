import "./css/App.css";

function App() {
  return (
    <>
      <nav>
        <div>
          <ul className="nav-links">
            <a href="/">
              首页
            </a>
            <a href="/">
              关于
            </a>
          </ul>
        </div>
      </nav>
      <div className="App">
        <h1>This is React App.</h1>
      </div>
      <div className="button_test">
        <button>this is button</button>
      </div>
    </>
  );
}

export default App;
