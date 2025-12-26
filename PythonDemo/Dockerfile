FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 自动安装 OpenTelemetry 插桩
RUN opentelemetry-bootstrap -a install

# 复制应用代码
COPY app.py .

# 暴露端口
EXPOSE 5000

# 使用 opentelemetry-instrument 启动应用（零代码侵入！）
CMD ["opentelemetry-instrument", "python", "app.py"]
