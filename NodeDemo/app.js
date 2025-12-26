/**
 * Node.js Express Demo 应用
 * 演示零代码侵入的可观测性接入（使用 OpenTelemetry Auto-Instrumentation）
 *
 * 特点：
 * - Traces/Logs/Metrics 完全零代码侵入（通过 --require 参数启动）
 * - 业务代码无需任何埋点代码
 * - 自动关联 Traces、Logs 和 Metrics
 */

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// 业务代码（完全无需埋点代码，自动生成 Traces/Logs/Metrics）
// ============================================================================

// 全局变量：用于模拟内存泄漏
const memoryHolder = [];

// 复杂的邮箱正则（模拟低效正则导致的 CPU 高占用）
const EMAIL_PATTERN = /^(\w+([-.][\w]+)*){3,18}@\w+([-.][\w]+)*\.\w+([-.][\w]+)*$/;
const SLOW_EMAIL_SAMPLE = "rosamariachoccelahuaaranda70@gmail.comnnbbb.bbNG.bbb.n¿.?n";

/**
 * /hello - 正常快速请求（基线）
 * 业务代码完全无需埋点，OpenTelemetry 自动生成 span 和 metrics
 */
app.get('/hello', (req, res) => {
    const startTime = Date.now();
    console.log('[INFO] Processing /hello request - route=hello method=GET');

    const result = {
        message: 'Hello from Node.js Express!',
        route: '/hello',
        timestamp: new Date().toISOString()
    };

    const duration = Date.now() - startTime;
    console.log(`[INFO] Completed /hello request - route=hello method=GET status=200 duration_ms=${duration}`);

    res.json(result);
});

/**
 * /slow - 模拟 CPU 密集型操作（正则校验）
 * 业务代码无需埋点，OpenTelemetry 自动生成 span 和 metrics
 */
app.get('/slow', (req, res) => {
    const startTime = Date.now();
    console.log('[INFO] Processing /slow request - route=slow method=GET (CPU intensive operation)');

    // 模拟复杂正则匹配导致的 CPU 高占用
    let matchCount = 0;
    for (let i = 0; i < 500; i++) {  // 减少到 500 次，避免阻塞太久
        if (EMAIL_PATTERN.test(SLOW_EMAIL_SAMPLE)) {
            matchCount++;
        }
    }

    const duration = Date.now() - startTime;
    console.log(`[INFO] Completed /slow request - route=slow method=GET status=200 duration_ms=${duration}`);

    res.json({
        message: 'Slow operation completed',
        route: '/slow',
        match_count: matchCount,
        duration_ms: duration
    });
});

/**
 * /alloc - 模拟内存密集型操作
 * 业务代码无需埋点，OpenTelemetry 自动生成 span 和 metrics
 */
app.get('/alloc', (req, res) => {
    const startTime = Date.now();
    console.log('[INFO] Processing /alloc request - route=alloc method=GET (Memory intensive operation)');

    // 每次请求分配约 50MB 内存
    const CHUNK_SIZE = 256 * 1024;  // 256KB
    const CHUNK_COUNT = 200;        // 总共 50MB
    const MAX_RETAINED = 20;        // 最多保留 20 批（约 1GB）

    // 清理旧数据
    if (memoryHolder.length >= MAX_RETAINED) {
        memoryHolder.shift();
    }

    // 分配新内存
    const batch = Buffer.alloc(CHUNK_SIZE * CHUNK_COUNT);
    for (let i = 0; i < batch.length; i++) {
        batch[i] = i % 256;
    }
    memoryHolder.push(batch);

    const duration = Date.now() - startTime;
    console.log(`[INFO] Completed /alloc request - route=alloc method=GET status=200 duration_ms=${duration} memory_batches=${memoryHolder.length}`);

    res.json({
        message: 'Memory allocation completed',
        route: '/alloc',
        allocated_mb: (CHUNK_SIZE * CHUNK_COUNT) / (1024 * 1024),
        total_batches: memoryHolder.length,
        duration_ms: duration
    });
});

/**
 * /health - 健康检查
 */
app.get('/health', (req, res) => {
    console.log('[INFO] Health check - route=health method=GET status=200');
    res.json({
        status: 'healthy',
        service: 'node-demo-app'
    });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(60));
    console.log('Starting Node.js Express Demo App');
    console.log(`Service: node-demo-app`);
    console.log(`Port: ${PORT}`);
    console.log('OpenTelemetry: Enabled (auto-instrumentation)');
    console.log('Logs Export: OTLP');
    console.log('Metrics Export: OTLP');
    console.log('Traces Export: OTLP');
    console.log('='.repeat(60));
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('[INFO] SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('[INFO] SIGINT received, shutting down gracefully...');
    process.exit(0);
});
