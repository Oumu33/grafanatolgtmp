import { useState } from 'react';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [selectedBackend, setSelectedBackend] = useState('http://localhost:18083');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const callAPI = async (endpoint) => {
    setLoading(true);
    setResult(null);

    try {
      console.log(`[React] 调用后端 API: ${selectedBackend}${endpoint}`);

      // OpenTelemetry 自动拦截此请求，传播 Trace Context
      const response = await axios.get(`${selectedBackend}${endpoint}`, {
        timeout: 30000,
      });

      setResult({
        status: 'success',
        data: response.data,
        headers: {
          'content-type': response.headers['content-type'],
        },
      });

      console.log('[React] API 调用成功:', response.data);
    } catch (error) {
      setResult({
        status: 'error',
        message: error.message,
        code: error.code,
      });

      console.error('[React] API 调用失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="hero">
        <h2>React 前端监控演示</h2>
        <p>展示 OpenTelemetry 浏览器端可观测性：Traces + Logs + Metrics</p>
      </div>

      <div className="backend-selector">
        <label>选择后端服务：</label>
        <select value={selectedBackend} onChange={(e) => setSelectedBackend(e.target.value)}>
          <option value="http://localhost:18083">Node.js (端口 18083)</option>
          <option value="http://localhost:18082">Python (端口 18082)</option>
          <option value="http://localhost:18081">Java (端口 18081)</option>
        </select>
      </div>

      <div className="api-buttons">
        <button onClick={() => callAPI('/hello')} className="btn btn-success">
          <span className="icon">✅</span>
          正常请求 (/hello)
        </button>
        <button onClick={() => callAPI('/slow')} className="btn btn-warning">
          <span className="icon">⚡</span>
          CPU 密集 (/slow)
        </button>
        <button onClick={() => callAPI('/alloc')} className="btn btn-danger">
          <span className="icon">💾</span>
          内存密集 (/alloc)
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>请求中...</p>
        </div>
      )}

      {result && (
        <div className="result-container">
          <h3>响应结果</h3>
          <div className="result">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
          <button onClick={() => setResult(null)} className="btn-clear">
            清除结果
          </button>
        </div>
      )}

      <div className="info-section">
        <h3>监控说明</h3>
        <ul>
          <li>
            <strong>自动 Trace 传播</strong>：点击按钮后，前端 fetch 请求会自动传播 Trace Context 到后端
          </li>
          <li>
            <strong>端到端追踪</strong>：在 Grafana Tempo 中搜索 <code>service.name="react-demo-app"</code>，查看完整调用链
          </li>
          <li>
            <strong>性能监控</strong>：页面加载、路由跳转、API 请求耗时均被自动记录
          </li>
          <li>
            <strong>零业务代码侵入</strong>：OpenTelemetry 自动拦截所有 fetch 请求，无需手动埋点
          </li>
        </ul>
      </div>
    </div>
  );
}
