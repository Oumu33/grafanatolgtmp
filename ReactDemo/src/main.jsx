/**
 * React 应用入口
 * 注：在创建 React 应用之前引入 instrumentation.js，确保监控优先初始化
 */

// 首先初始化 OpenTelemetry（必须在 React 应用之前）
import './instrumentation.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
