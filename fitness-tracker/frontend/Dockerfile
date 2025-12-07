# 使用官方Node运行时作为父镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用源代码
COPY . .

# 构建应用
RUN npm run build

# 安装serve以提供静态文件服务
RUN npm install -g serve

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["serve", "-s", "dist", "-l", "3000"]