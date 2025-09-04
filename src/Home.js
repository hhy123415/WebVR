import "./css/home.css";
import { Link } from "react-router-dom";

function Home() {
  // 页面跳转数据
  const navItems = [
    {
      title: "腾蛟五香干制作技艺",
      path: "/WuXiang",
      imageUrl: "/picture/WuXiang.jpg",
    },
    {
      title: "场景测试",
      path: "/test_scene",
      imageUrl: "/picture/test.png",
    },
    {
      title: "场景测试",
      path: "/test_scene",
      imageUrl: "/picture/test.png",
    },
    {
      title: "场景测试",
      path: "/test_scene",
      imageUrl: "/picture/test.png",
    },
    {
      title: "场景测试",
      path: "/test_scene",
      imageUrl: "/picture/test.png",
    },
    {
      title: "场景测试",
      path: "/test_scene",
      imageUrl: "/picture/test.png",
    },
    {
      title: "场景测试",
      path: "/test_scene",
      imageUrl: "/picture/test.png",
    },
    {
      title: "场景测试",
      path: "/test_scene",
      imageUrl: "/picture/test.png",
    },
  ];

  return (
    <>
      <div className="nav-grid">
        {navItems.map((item, index) => (
          <Link key={index} to={item.path} className="nav-card">
            <div className="image-container">
              <img src={item.imageUrl} alt={item.title} />
            </div>
            <h3 className="nav-title">{item.title}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Home;
