import "./css/NavBar.css";
import logo from "./picture/logo.png";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      <nav>
        <div className="nav-logo">
          <img src={logo} alt="logo"></img>
        </div>
        <div>
          <ul className="nav-links">
            <Link to="/">首页</Link>
            <Link to="/test_scene">场景测试</Link>
            <Link to="/about">关于</Link>
            <Link to="/quiz">自我测验</Link>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
