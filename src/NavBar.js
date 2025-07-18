import "./css/NavBar.css";
import logo from "./picture/logo.png";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // 当路由变化时关闭移动菜单
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="logo" />
          <span>非遗数字博物馆</span>
        </div>
        
        {/* 移动端菜单按钮 */}
        <div 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
            >
              <i className="fas fa-home"></i> 首页
            </Link>
          </li>
          <li>
            <Link 
              to="/test_scene" 
              className={location.pathname === "/test_scene" ? "active" : ""}
            >
              <i className="fas fa-cube"></i> 场景测试
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={location.pathname === "/about" ? "active" : ""}
            >
              <i className="fas fa-info-circle"></i> 关于
            </Link>
          </li>
          <li>
            <Link 
              to="/quiz" 
              className={location.pathname === "/quiz" ? "active" : ""}
            >
              <i className="fas fa-question-circle"></i> 自我测验
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;