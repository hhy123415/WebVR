import NavBar from "./NavBar";
import Test from "./test";
import Home from "./Home";
import About from "./About";
import Quiz from "./quiz";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import WuXiang from "./WuXiang";

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <NavBar />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test_scene" element={<Test />} />
          <Route path="/about" element={<About />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/WuXiang" element={<WuXiang />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
