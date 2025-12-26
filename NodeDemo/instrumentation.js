/**
 * OpenTelemetry 自动埋点配置
 * 零代码侵入方案：通过 --require 参数加载此文件即可
 */

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

// 读取环境变量
const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'node-demo-app';

// 创建资源（附加服务元数据）
const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    'service_name': SERVICE_NAME,
    'job': SERVICE_NAME,
});

// 创建导出器
const traceExporter = new OTLPTraceExporter({
    url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
});

const metricExporter = new OTLPMetricExporter({
    url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
});

const logExporter = new OTLPLogExporter({
    url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
});

// 创建 Metric Reader（周期性导出指标）
const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10000, // 每 10 秒导出一次
});

// 初始化 OpenTelemetry SDK
const sdk = new NodeSDK({
    resource: resource,
    traceExporter: traceExporter,
    metricReader: metricReader,
    logRecordProcessor: logExporter,
    instrumentations: [
        getNodeAutoInstrumentations({
            // 自动埋点所有支持的库（Express、HTTP、FS 等）
            '@opentelemetry/instrumentation-http': {
                enabled: true,
            },
            '@opentelemetry/instrumentation-express': {
                enabled: true,
            },
        }),
    ],
});

// 启动 SDK
sdk.start();

console.log('[OpenTelemetry] Auto-instrumentation initialized');
console.log(`[OpenTelemetry] Service: ${SERVICE_NAME}`);
console.log(`[OpenTelemetry] OTLP Endpoint: ${OTEL_EXPORTER_OTLP_ENDPOINT}`);

// 优雅关闭
process.on('SIGTERM', async () => {
    try {
        await sdk.shutdown();
        console.log('[OpenTelemetry] SDK shut down successfully');
    } catch (err) {
        console.error('[OpenTelemetry] Error shutting down SDK', err);
    } finally {
        process.exit(0);
    }
});
