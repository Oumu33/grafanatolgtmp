import { useEffect } from 'react';
import './About.css';

export default function About() {
  useEffect(() => {
    console.log('[React] About 页面已挂载');
  }, []);

  return (
    <div className="about">
      <div className="card">
        <h2>关于本项目</h2>

        <div className="section">
          <h3>项目简介</h3>
          <p>
            这是一个基于 React 的前端监控演示应用，展示如何使用 OpenTelemetry 实现浏览器端的可观测性。
            本项目集成了 LGTMP 可观测性栈（Loki + Grafana + Tempo + Mimir + Pyroscope），
            实现了端到端的 Traces、Logs 和 Metrics 采集与关联。
          </p>
        </div>

        <div className="section">
          <h3>技术栈</h3>
          <ul className="tech-list">
            <li><strong>前端框架</strong>: React 18 + React Router + Vite</li>
            <li><strong>监控 SDK</strong>: OpenTelemetry Web SDK</li>
            <li><strong>HTTP 客户端</strong>: Axios</li>
            <li><strong>容器化</strong>: Docker + Nginx</li>
            <li><strong>可观测性栈</strong>: Loki + Grafana + Tempo + Mimir + Pyroscope</li>
          </ul>
        </div>

        <div className="section">
          <h3>监控特性</h3>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>自动埋点</h4>
              <p>自动监控页面加载、API 请求、路由跳转</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h4>Trace 传播</h4>
              <p>自动传播 Trace Context 到后端服务</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>性能监控</h4>
              <p>Web Vitals (FCP, LCP, TTI) 性能指标</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h4>轻微侵入</h4>
              <p>仅需 30 行初始化代码，业务组件零修改</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>如何查看监控数据</h3>
          <ol className="steps">
            <li>打开 Grafana: <code>http://localhost:3000</code></li>
            <li>进入 Explore，选择数据源 <strong>Tempo</strong></li>
            <li>搜索: <code>service.name="react-demo-app"</code></li>
            <li>查看 Trace 瀑布图，展示浏览器 → 后端的完整调用链</li>
            <li>点击后端 Span，查看 Profiles 火焰图（CPU/内存分析）</li>
          </ol>
        </div>

        <div className="section footer-section">
          <p><strong>访问地址</strong></p>
          <ul>
            <li>Vue 应用: <code>http://localhost:18084</code></li>
            <li>React 应用: <code>http://localhost:18085</code></li>
            <li>Grafana: <code>http://localhost:3000</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
