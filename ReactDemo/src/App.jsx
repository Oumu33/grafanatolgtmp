import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Demo from './pages/Demo.jsx';
import About from './pages/About.jsx';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <header>
      <nav>
        <div className="nav-container">
          <h1>React 前端监控 Demo</h1>
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              首页
            </Link>
            <Link to="/demo" className={location.pathname === '/demo' ? 'active' : ''}>
              演示
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              关于
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div id="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer>
          <p>OpenTelemetry 浏览器端监控演示 | LGTMP Stack</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
