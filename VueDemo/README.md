# Vue Frontend Monitoring Demo

这是一个基于 Vue 3 的前端监控演示应用，展示如何使用 OpenTelemetry 实现浏览器端的可观测性。

## 特性

- ✅ **轻微侵入**：仅需 30 行 OpenTelemetry 初始化代码，业务组件无需修改
- ✅ **自动埋点**：自动监控页面加载、API 请求、路由跳转
- ✅ **Trace 传播**：自动传播 Trace Context 到后端服务，实现端到端追踪
- ✅ **性能监控**：Web Vitals (FCP, LCP, TTI) 性能指标

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
open http://localhost:5173
```

### Docker 部署

```bash
# 构建镜像
docker build -t vue-demo-app .

# 运行容器
docker run -p 18084:80 --name vue-demo vue-demo-app

# 访问应用
open http://localhost:18084
```

## 监控配置

### OpenTelemetry 初始化

在 `src/instrumentation.js` 中配置 OpenTelemetry：

```javascript
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

// ... 初始化代码（约 30 行）
```

在 `src/main.js` 中引入：

```javascript
import './instrumentation.js'; // 必须在 Vue 应用之前
import { createApp } from 'vue';
// ...
```

### 监控指标

- **页面加载性能**：FCP (First Contentful Paint)、LCP (Largest Contentful Paint)、TTI (Time to Interactive)
- **API 请求追踪**：自动拦截所有 fetch/XHR 请求，传播 Trace Context
- **路由跳转性能**：Vue Router 切换耗时
- **用户交互事件**：点击、表单提交等

## 查看监控数据

1. 打开 Grafana: `http://localhost:3000`
2. 进入 Explore，选择数据源 **Tempo**
3. 搜索: `service.name="vue-demo-app"`
4. 查看 Trace 瀑布图：
   - 浏览器 Span (页面加载、fetch 请求)
   - 后端 Span (Node.js/Python/Java 处理)
5. 点击后端 Span → "Profiles" → 查看 CPU/内存火焰图

## 目录结构

```
VueDemo/
├── src/
│   ├── main.js              # 应用入口
│   ├── App.vue              # 根组件
│   ├── instrumentation.js   # OpenTelemetry 初始化（30 行）
│   ├── router/              # Vue Router 配置
│   │   └── index.js
│   └── views/               # 页面组件
│       ├── Home.vue         # 首页（API 调用按钮）
│       ├── Demo.vue         # 路由跳转演示
│       └── About.vue        # 关于页面
├── public/
├── package.json
├── vite.config.js
├── index.html
├── Dockerfile
├── nginx.conf
└── README.md
```

## 技术栈

- **前端框架**: Vue 3 + Vue Router + Vite
- **HTTP 客户端**: Axios
- **监控 SDK**: OpenTelemetry Web SDK
- **容器化**: Docker + Nginx
- **可观测性栈**: Loki + Grafana + Tempo + Mimir + Pyroscope

## 侵入性说明

| 平台 | 侵入性 | 初始化代码量 | 业务代码需要改吗？ |
|------|--------|------------|------------------|
| Vue/React | ⚠️ 轻微侵入 | ~30 行 | ❌ 不需要 |
| Node.js | ✅ 零侵入 | 0 行 | ❌ 不需要 |
| Java | ✅ 零侵入 | 0 行 | ❌ 不需要 |
| Python | ⚠️ 轻微侵入 | ~30 行 | ❌ 不需要 |

## License

MIT
