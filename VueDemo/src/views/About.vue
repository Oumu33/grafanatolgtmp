<template>
  <div class="about">
    <div class="card">
      <h2>关于本项目</h2>

      <div class="section">
        <h3>项目简介</h3>
        <p>
          这是一个基于 Vue 3 的前端监控演示应用，展示如何使用 OpenTelemetry 实现浏览器端的可观测性。
          本项目集成了 LGTMP 可观测性栈（Loki + Grafana + Tempo + Mimir + Pyroscope），
          实现了端到端的 Traces、Logs 和 Metrics 采集与关联。
        </p>
      </div>

      <div class="section">
        <h3>技术栈</h3>
        <ul class="tech-list">
          <li><strong>前端框架</strong>: Vue 3 + Vue Router + Vite</li>
          <li><strong>监控 SDK</strong>: OpenTelemetry Web SDK</li>
          <li><strong>HTTP 客户端</strong>: Axios</li>
          <li><strong>容器化</strong>: Docker + Nginx</li>
          <li><strong>可观测性栈</strong>: Loki + Grafana + Tempo + Mimir + Pyroscope</li>
        </ul>
      </div>

      <div class="section">
        <h3>监控特性</h3>
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h4>自动埋点</h4>
            <p>自动监控页面加载、API 请求、路由跳转</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔗</div>
            <h4>Trace 传播</h4>
            <p>自动传播 Trace Context 到后端服务</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h4>性能监控</h4>
            <p>Web Vitals (FCP, LCP, TTI) 性能指标</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h4>轻微侵入</h4>
            <p>仅需 30 行初始化代码，业务组件零修改</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>如何查看监控数据</h3>
        <ol class="steps">
          <li>打开 Grafana: <code>http://localhost:3000</code></li>
          <li>进入 Explore，选择数据源 <strong>Tempo</strong></li>
          <li>搜索: <code>service.name="vue-demo-app"</code></li>
          <li>查看 Trace 瀑布图，展示浏览器 → 后端的完整调用链</li>
          <li>点击后端 Span，查看 Profiles 火焰图（CPU/内存分析）</li>
        </ol>
      </div>

      <div class="section">
        <h3>代码侵入性对比</h3>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>平台</th>
              <th>侵入性</th>
              <th>初始化代码量</th>
              <th>业务代码需要改吗？</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Java</td>
              <td class="badge badge-success">零侵入</td>
              <td>0 行</td>
              <td>❌ 不需要</td>
            </tr>
            <tr>
              <td>Node.js</td>
              <td class="badge badge-success">零侵入</td>
              <td>0 行</td>
              <td>❌ 不需要</td>
            </tr>
            <tr>
              <td>Python</td>
              <td class="badge badge-warning">轻微侵入</td>
              <td>~30 行</td>
              <td>❌ 不需要</td>
            </tr>
            <tr class="highlight">
              <td>Vue/React</td>
              <td class="badge badge-warning">轻微侵入</td>
              <td>~30 行</td>
              <td>❌ 不需要</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section footer-section">
        <p><strong>访问地址</strong></p>
        <ul>
          <li>Vue 应用: <code>http://localhost:18084</code></li>
          <li>React 应用: <code>http://localhost:18085</code></li>
          <li>Grafana: <code>http://localhost:3000</code></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('[Vue] About 页面已挂载');
});
</script>

<style scoped>
.about {
  padding: 2rem 0;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #667eea;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.section {
  margin-bottom: 2.5rem;
}

.section h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.section p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.tech-list {
  list-style: none;
  padding: 0;
}

.tech-list li {
  padding: 0.75rem 0;
  color: #333;
  border-bottom: 1px solid #eee;
}

.tech-list li:last-child {
  border-bottom: none;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.feature-card h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.steps {
  padding-left: 1.5rem;
  color: #333;
}

.steps li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

code {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #667eea;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
}

.comparison-table thead {
  background: #667eea;
  color: white;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
}

.comparison-table tbody tr {
  border-bottom: 1px solid #eee;
}

.comparison-table tbody tr:last-child {
  border-bottom: none;
}

.comparison-table tbody tr:hover {
  background: #f8f9fa;
}

.comparison-table tbody tr.highlight {
  background: #fff9e6;
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-warning {
  background: #fff3cd;
  color: #856404;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}
</style>
