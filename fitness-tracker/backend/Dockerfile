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

# 编译TypeScript代码
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "dist/server.js"]