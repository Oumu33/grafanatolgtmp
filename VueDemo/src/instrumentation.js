/**
 * OpenTelemetry 浏览器端自动埋点配置
 * 轻微侵入方案：只需在 main.js 中引入一次即可
 *
 * 功能：
 * - 自动监控页面加载性能（Web Vitals）
 * - 自动监控 fetch/XHR 请求
 * - 自动监控用户交互事件
 * - 自动传播 Trace Context 到后端
 */

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// 创建资源（附加服务元数据）
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'vue-demo-app',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  'service_name': 'vue-demo-app',
  'job': 'vue-demo-app',
});

// 创建 Trace Provider
const provider = new WebTracerProvider({
  resource: resource,
});

// 创建 OTLP Exporter（通过 Nginx 代理发送到 Alloy）
const exporter = new OTLPTraceExporter({
  url: '/otlp/v1/traces', // 通过 Nginx 反向代理到 Alloy
  headers: {},
});

// 添加 Batch Span Processor（批量发送，优化性能）
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// 注册 Trace Provider
provider.register({
  contextManager: new ZoneContextManager(), // 使用 Zone.js 管理上下文
});

// 注册自动埋点（页面加载、fetch、用户交互）
const autoInstrumentations = getWebAutoInstrumentations({
  // 页面加载性能监控
  '@opentelemetry/instrumentation-document-load': {
    enabled: true,
  },
  // Fetch API 监控（自动传播 Trace Context）
  '@opentelemetry/instrumentation-fetch': {
    enabled: true,
    propagateTraceHeaderCorsUrls: [
      /localhost:18081/, // Java 后端
      /localhost:18082/, // Python 后端
      /localhost:18083/, // Node.js 后端
    ],
  },
  // XHR 监控
  '@opentelemetry/instrumentation-xml-http-request': {
    enabled: true,
    propagateTraceHeaderCorsUrls: [
      /localhost:18081/,
      /localhost:18082/,
      /localhost:18083/,
    ],
  },
  // 用户交互监控（点击、表单提交等）
  '@opentelemetry/instrumentation-user-interaction': {
    enabled: true,
    eventNames: ['click', 'submit'],
  },
});

// 启动自动埋点
autoInstrumentations.forEach(instrumentation => instrumentation.enable());

console.log('[OpenTelemetry] Vue 前端监控已初始化');
console.log('[OpenTelemetry] Service: vue-demo-app');
console.log('[OpenTelemetry] OTLP Endpoint: /otlp/v1/traces (通过 Nginx 代理到 Alloy)');
