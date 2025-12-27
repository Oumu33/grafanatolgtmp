<template>
  <div class="home">
    <div class="hero">
      <h2>Vue 3 前端监控演示</h2>
      <p>展示 OpenTelemetry 浏览器端可观测性：Traces + Logs + Metrics</p>
    </div>

    <div class="backend-selector">
      <label>选择后端服务：</label>
      <select v-model="selectedBackend">
        <option value="http://localhost:18083">Node.js (端口 18083)</option>
        <option value="http://localhost:18082">Python (端口 18082)</option>
        <option value="http://localhost:18081">Java (端口 18081)</option>
      </select>
    </div>

    <div class="api-buttons">
      <button @click="callAPI('/hello')" class="btn btn-success">
        <span class="icon">✅</span>
        正常请求 (/hello)
      </button>
      <button @click="callAPI('/slow')" class="btn btn-warning">
        <span class="icon">⚡</span>
        CPU 密集 (/slow)
      </button>
      <button @click="callAPI('/alloc')" class="btn btn-danger">
        <span class="icon">💾</span>
        内存密集 (/alloc)
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>请求中...</p>
    </div>

    <div v-if="result" class="result-container">
      <h3>响应结果</h3>
      <div class="result">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      <button @click="result = null" class="btn-clear">清除结果</button>
    </div>

    <div class="info-section">
      <h3>监控说明</h3>
      <ul>
        <li><strong>自动 Trace 传播</strong>：点击按钮后，前端 fetch 请求会自动传播 Trace Context 到后端</li>
        <li><strong>端到端追踪</strong>：在 Grafana Tempo 中搜索 <code>service.name="vue-demo-app"</code>，查看完整调用链</li>
        <li><strong>性能监控</strong>：页面加载、路由跳转、API 请求耗时均被自动记录</li>
        <li><strong>零业务代码侵入</strong>：OpenTelemetry 自动拦截所有 fetch 请求，无需手动埋点</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const selectedBackend = ref('http://localhost:18083'); // 默认 Node.js
const result = ref(null);
const loading = ref(false);

const callAPI = async (endpoint) => {
  loading.value = true;
  result.value = null;

  try {
    console.log(`[Vue] 调用后端 API: ${selectedBackend.value}${endpoint}`);

    // OpenTelemetry 自动拦截此请求，传播 Trace Context
    const response = await axios.get(`${selectedBackend.value}${endpoint}`, {
      timeout: 30000, // 30 秒超时（/slow 接口可能需要较长时间）
    });

    result.value = {
      status: 'success',
      data: response.data,
      headers: {
        'content-type': response.headers['content-type'],
      },
    };

    console.log('[Vue] API 调用成功:', response.data);
  } catch (error) {
    result.value = {
      status: 'error',
      message: error.message,
      code: error.code,
    };

    console.error('[Vue] API 调用失败:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero h2 {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
}

.backend-selector {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.backend-selector label {
  font-weight: 600;
  color: #333;
}

.backend-selector select {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.backend-selector select:hover {
  border-color: #667eea;
}

.api-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 1.5rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.btn-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.icon {
  font-size: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.result-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.result-container h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.result {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.result pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #333;
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-clear:hover {
  background: #5a6268;
}

.info-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  color: #333;
  line-height: 1.6;
}

.info-section li:last-child {
  border-bottom: none;
}

.info-section code {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #667eea;
}
</style>
