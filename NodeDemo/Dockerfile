FROM node:18-slim

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制应用代码
COPY app.js .
COPY instrumentation.js .

# 暴露端口
EXPOSE 3000

# 使用 --require 参数启动应用（零代码侵入！）
CMD ["node", "--require", "./instrumentation.js", "app.js"]
