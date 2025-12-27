"""
Python Flask Demo 应用
演示零代码侵入的可观测性接入（使用 opentelemetry-instrument）
注：HTTP Metrics 需要轻微代码侵入（集中初始化，业务代码无需修改）
"""

import re
import time
import random
import logging
from flask import Flask, jsonify, g, request
from flask_cors import CORS
from threading import Thread
import requests

# OpenTelemetry Metrics SDK（用于 HTTP 指标自动记录）
from opentelemetry import metrics

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# 配置 CORS：允许前端应用访问
CORS(app, origins=['http://localhost:18084', 'http://localhost:18085'],
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization', 'traceparent', 'tracestate'])

# ============================================================================
# OpenTelemetry Metrics 初始化（集中配置，业务代码无需修改）
# ============================================================================
# 获取 Meter（复用 opentelemetry-instrument 自动配置的 MeterProvider）
# 不再手动创建 MeterProvider，避免与自动埋点冲突
meter = metrics.get_meter(__name__)

# HTTP 请求耗时直方图（单位：毫秒）
http_server_duration = meter.create_histogram(
    name="http_server_duration_milliseconds",
    description="HTTP server request duration in milliseconds",
    unit="ms"
)

# HTTP 请求计数器
http_server_request_count = meter.create_counter(
    name="http_server_request_count",
    description="Total HTTP server requests",
    unit="1"
)

# ============================================================================
# Flask 钩子：自动记录所有 HTTP 请求的指标（业务代码无需修改）
# ============================================================================
@app.before_request
def before_request():
    """记录请求开始时间"""
    g.start_time = time.time()


@app.after_request
def after_request(response):
    """请求结束后记录指标"""
    if hasattr(g, 'start_time'):
        # 计算请求耗时（毫秒）
        duration_ms = (time.time() - g.start_time) * 1000

        # 记录指标（带标签）
        attributes = {
            "http.method": request.method,
            "http.route": request.path,
            "http.status_code": response.status_code,
        }

        # 记录耗时
        http_server_duration.record(duration_ms, attributes)

        # 记录请求数
        http_server_request_count.add(1, attributes)

    return response


# ============================================================================
# 业务代码（完全无需修改，自动获得 Metrics）
# ============================================================================

# 全局变量：用于模拟内存泄漏
memory_holder = []

# 复杂的邮箱正则（模拟低效正则导致的 CPU 高占用）
EMAIL_PATTERN = re.compile(
    r'^(\w+([-.][\w]+)*){3,18}@\w+([-.][\w]+)*\.\w+([-.][\w]+)*$'
)
SLOW_EMAIL_SAMPLE = "rosamariachoccelahuaaranda70@gmail.comnnbbb.bbNG.bbb.n¿.?n"


@app.route('/hello', methods=['GET'])
def hello():
    """正常快速请求（基线）"""
    start_time = time.time()
    logger.info("Processing /hello request - route=hello method=GET")

    result = {
        "message": "Hello from Python Flask!",
        "route": "/hello",
        "timestamp": time.time()
    }

    duration = time.time() - start_time
    logger.info(f"Completed /hello request - route=hello method=GET status=200 duration_ms={duration*1000:.2f}")

    return jsonify(result)


@app.route('/slow', methods=['GET'])
def slow():
    """模拟 CPU 密集型操作（正则校验）"""
    start_time = time.time()
    logger.info("Processing /slow request - route=slow method=GET (CPU intensive operation)")

    # 模拟复杂正则匹配导致的 CPU 高占用
    match_count = 0
    for _ in range(3000):
        if EMAIL_PATTERN.match(SLOW_EMAIL_SAMPLE):
            match_count += 1

    duration = time.time() - start_time
    logger.info(f"Completed /slow request - route=slow method=GET status=200 duration_ms={duration*1000:.2f}")

    return jsonify({
        "message": "Slow operation completed",
        "route": "/slow",
        "match_count": match_count,
        "duration_seconds": duration
    })


@app.route('/alloc', methods=['GET'])
def alloc():
    """模拟内存密集型操作"""
    start_time = time.time()
    logger.info("Processing /alloc request - route=alloc method=GET (Memory intensive operation)")

    # 每次请求分配约 50MB 内存
    CHUNK_SIZE = 256 * 1024  # 256KB
    CHUNK_COUNT = 200  # 总共 50MB
    MAX_RETAINED = 20  # 最多保留 20 批（约 1GB）

    # 清理旧数据
    if len(memory_holder) >= MAX_RETAINED:
        memory_holder.pop(0)

    # 分配新内存
    batch = bytearray(CHUNK_SIZE * CHUNK_COUNT)
    for i in range(len(batch)):
        batch[i] = i % 256
    memory_holder.append(batch)

    duration = time.time() - start_time
    logger.info(f"Completed /alloc request - route=alloc method=GET status=200 duration_ms={duration*1000:.2f} memory_batches={len(memory_holder)}")

    return jsonify({
        "message": "Memory allocation completed",
        "route": "/alloc",
        "allocated_mb": (CHUNK_SIZE * CHUNK_COUNT) / (1024 * 1024),
        "total_batches": len(memory_holder),
        "duration_seconds": duration
    })


@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    logger.info("Health check - route=health method=GET status=200")
    return jsonify({"status": "healthy", "service": "python-demo-app"})


def traffic_generator():
    """后台流量生成器：持续发送请求到各个接口"""
    time.sleep(10)  # 等待应用启动完成

    routes = ['/hello', '/slow', '/alloc']
    weights = [0.6, 0.3, 0.1]  # 权重：hello 60%, slow 30%, alloc 10%

    logger.info("Starting traffic generator...")

    while True:
        try:
            route = random.choices(routes, weights=weights)[0]
            url = f"http://127.0.0.1:5000{route}"

            requests.get(url, timeout=30)

            # 随机间隔 1-3 秒
            time.sleep(random.uniform(1, 3))

        except Exception as e:
            logger.warning(f"Traffic generator error: {e}")
            time.sleep(5)


if __name__ == '__main__':
    # 注意：内部流量生成器已禁用，避免与 Flask 单进程模式冲突
    # 如需测试，请从外部发送请求：curl http://localhost:18082/hello

    # 启动 Flask 应用（启用多线程模式）
    logger.info("=" * 60)
    logger.info("Starting Python Flask Demo App")
    logger.info("Service: python-demo-app")
    logger.info("Port: 5000")
    logger.info("OpenTelemetry: Enabled (auto-instrumentation)")
    logger.info("Logs Export: OTLP")
    logger.info("Metrics Export: OTLP")
    logger.info("Traces Export: OTLP")
    logger.info("=" * 60)

    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True, use_reloader=False)
