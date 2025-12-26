# Node.js Express Demo - 零代码侵入可观测性接入

这是一个 Node.js Express 应用演示，展示如何使用 OpenTelemetry 自动埋点实现**完全零代码侵入**的可观测性接入。

## 特点

- ✅ **完全零代码侵入**：业务代码无需任何埋点代码
- ✅ **自动生成 Traces**：HTTP 请求自动生成 span
- ✅ **自动生成 Logs**：console.log 自动关联 trace_id
- ✅ **自动生成 Metrics**：HTTP 请求自动记录 RED 指标（Rate、Error、Duration）
- ✅ **一句命令启动**：`node --require ./instrumentation.js app.js`

## 实现原理

### 零代码侵入方案

Node.js 使用 `--require` 参数在应用启动前加载 OpenTelemetry SDK：

```bash
node --require ./instrumentation.js app.js
```

`instrumentation.js` 会：
1. 初始化 OpenTelemetry SDK
2. 配置 OTLP 导出器（指向 Alloy）
3. 启用自动埋点（Express、HTTP 等）
4. 自动为所有 HTTP 请求生成 span 和 metrics

### 业务代码示例

```javascript
// 业务代码完全无需埋点！
app.get('/hello', (req, res) => {
    console.log('[INFO] Processing request');
    res.json({ message: 'Hello World' });
});
```

OpenTelemetry 会自动：
- 为这个请求生成 span
- 在日志中添加 trace_id 和 span_id
- 记录 HTTP 指标（延迟、状态码等）

## 演示接口

### 1. `/hello` - 正常快速请求（基线）

```bash
curl http://localhost:18083/hello
```

- 用途：作为性能基线，对比正常延迟
- 特点：极少量工作，延迟很低

### 2. `/slow` - CPU 密集型操作（正则校验）

```bash
curl http://localhost:18083/slow
```

- 用途：演示 CPU 热点定位
- 模拟：3000 次复杂正则表达式匹配
- 在 Grafana 中：
  - Tempo：可以看到 span 持续时间较长
  - Pyroscope（如果配置）：可以看到正则相关函数的 CPU 占用

### 3. `/alloc` - 内存密集型操作

```bash
curl http://localhost:18083/alloc
```

- 用途：演示内存占用分析
- 行为：每次请求分配约 50MB 内存（最多保留 1GB）
- 在 Grafana 中：
  - Tempo：可以看到 span 持续时间较长
  - 系统监控：可以看到进程内存占用上升

### 4. `/health` - 健康检查

```bash
curl http://localhost:18083/health
```

## 本地开发

### 1. 安装依赖

```bash
cd NodeDemo
npm install
```

### 2. 启动应用（带自动埋点）

```bash
# 方式 A：使用 npm script
npm start

# 方式 B：直接运行
node --require ./instrumentation.js app.js
```

### 3. 测试接口

```bash
curl http://localhost:3000/hello
curl http://localhost:3000/slow
curl http://localhost:3000/alloc
```

## Docker 部署

已经集成到主项目的 docker-compose 中：

```bash
# ARM64（Mac M1/M2/M3）
docker-compose up -d node-app

# x86_64（Linux/Windows/Intel Mac）
docker-compose -f docker-compose-x86.yaml up -d node-app
```

访问地址：
- ARM64: `http://localhost:18083`
- x86_64: `http://localhost:18083`

## 环境变量配置

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP 采集端地址 | `http://localhost:4318` |
| `OTEL_SERVICE_NAME` | 服务名称 | `node-demo-app` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | OTLP 协议 | `http/protobuf` |
| `OTEL_LOGS_EXPORTER` | 日志导出器 | `otlp` |
| `OTEL_METRICS_EXPORTER` | 指标导出器 | `otlp` |
| `OTEL_METRIC_EXPORT_INTERVAL` | 指标导出间隔（毫秒） | `5000` |

## 在 Grafana 中查看

### 1. Traces（Tempo）

1. 打开 Grafana: `http://localhost:3000`
2. 进入 Explore → Tempo
3. 查询: `{service.name="node-demo-app"}`
4. 查看 span 详情

### 2. Logs（Loki）

1. Explore → Loki
2. 查询: `{job="node-demo-app"}`
3. 日志中会自动包含 `trace_id` 和 `span_id`
4. 点击日志右侧的 **Tempo** 按钮跳转到对应 trace

### 3. Metrics（Mimir）

1. Explore → Mimir
2. 常用查询：

```promql
# 请求速率（QPS）
rate(http_server_duration_milliseconds_count{job="node-demo-app"}[5m])

# 请求延迟（P95）
histogram_quantile(0.95, rate(http_server_duration_milliseconds_bucket{job="node-demo-app"}[5m]))

# 错误率
rate(http_server_duration_milliseconds_count{job="node-demo-app",status_code=~"5.."}[5m])
```

## 与其他语言的对比

| 语言 | 代码侵入 | 接入方式 | 自动 Traces | 自动 Logs | 自动 Metrics |
|------|----------|----------|------------|-----------|--------------|
| **Java** | ✅ 零侵入 | -javaagent | ✅ | ✅ | ✅ |
| **Python** | ⚠️ 轻微侵入 | opentelemetry-instrument + Flask钩子 | ✅ | ✅ | ✅ 需30行代码 |
| **Node.js** | ✅ 零侵入 | --require参数 | ✅ | ✅ | ✅ |
| **Go** | ⚠️ 轻微侵入 | otelhttp中间件 | ✅ | ✅ 手动 | ✅ |

**Node.js 的优势**：
- 与 Java 类似，完全零代码侵入
- 业务代码无需任何修改
- 自动埋点所有 Express 路由
- 自动关联 console.log 和 trace

## 文件结构

```
NodeDemo/
├── app.js                 # 业务代码（完全无埋点代码）
├── instrumentation.js     # OpenTelemetry 配置（一次性配置）
├── package.json           # 依赖配置
├── Dockerfile             # Docker 镜像
├── .dockerignore          # Docker 忽略文件
└── README.md              # 本文档
```

## 常见问题

### Q: 为什么业务代码不需要任何埋点代码？

A: Node.js 的 OpenTelemetry SDK 使用 monkey patching 技术，在运行时自动包装 Express、HTTP 等模块的方法，无需修改业务代码。

### Q: console.log 如何自动关联 trace_id？

A: OpenTelemetry 的 Logs Bridge 会自动拦截 console.log，在日志中注入当前的 trace context。

### Q: 如何添加自定义 span？

A: 虽然零侵入方案已经自动生成 span，但如果需要添加业务级 span，可以这样：

```javascript
const { trace } = require('@opentelemetry/api');

app.get('/custom', (req, res) => {
    const tracer = trace.getTracer('my-app');
    const span = tracer.startSpan('custom_operation');

    // 业务逻辑

    span.end();
    res.json({ ok: true });
});
```

### Q: 如何禁用自动埋点？

A: 移除 `--require ./instrumentation.js` 参数，直接运行 `node app.js`。

## 相关文档

- [OpenTelemetry Node.js 文档](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
- [OpenTelemetry Auto-Instrumentation](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node)
- [Express Instrumentation](https://www.npmjs.com/package/@opentelemetry/instrumentation-express)
