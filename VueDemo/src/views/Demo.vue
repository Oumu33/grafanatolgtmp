<template>
  <div class="demo">
    <div class="card">
      <h2>路由跳转性能监控演示</h2>
      <p>OpenTelemetry 自动监控页面路由切换的性能指标</p>

      <div class="navigation-demo">
        <p>尝试在不同页面之间切换，查看路由跳转的监控数据：</p>
        <div class="nav-buttons">
          <router-link to="/" class="demo-btn">返回首页</router-link>
          <router-link to="/about" class="demo-btn">前往关于页</router-link>
        </div>
      </div>

      <div class="metrics-info">
        <h3>监控指标说明</h3>
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>document-load</code></td>
              <td>页面加载性能（FCP、LCP、TTI）</td>
            </tr>
            <tr>
              <td><code>route-change</code></td>
              <td>SPA 路由跳转耗时</td>
            </tr>
            <tr>
              <td><code>fetch</code></td>
              <td>API 请求耗时和状态码</td>
            </tr>
            <tr>
              <td><code>user-interaction</code></td>
              <td>用户点击、表单提交等交互事件</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('[Vue] Demo 页面已挂载，OpenTelemetry 已自动记录页面加载性能');
});
</script>

<style scoped>
.demo {
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
  margin-bottom: 1rem;
}

.card p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.navigation-demo {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.demo-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.demo-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.metrics-info {
  margin-top: 2rem;
}

.metrics-info h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background: #667eea;
  color: white;
}

th, td {
  padding: 1rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid #eee;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background: #f8f9fa;
}

code {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #667eea;
}
</style>
