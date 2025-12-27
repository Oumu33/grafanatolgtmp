/**
 * Vue 3 应用入口
 * 注：在创建 Vue 应用之前引入 instrumentation.js，确保监控优先初始化
 */

// 首先初始化 OpenTelemetry（必须在 Vue 应用之前）
import './instrumentation.js';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);

app.mount('#app');
