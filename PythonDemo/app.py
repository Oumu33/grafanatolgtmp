"""
Python Flask Demo 应用
演示零代码侵入的可观测性接入（使用 opentelemetry-instrument）
"""

import re
import time
import random
import logging
from flask import Flask, jsonify
from threading import Thread
import requests

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

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
