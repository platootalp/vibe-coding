#!/bin/bash

# 部署脚本

echo "开始部署 SDD-Kit 项目..."

# 部署后端
echo "部署后端..."
cd backend
# 这里添加实际的后端部署命令
# 例如: java -jar target/app.jar
cd ..

# 部署前端
echo "部署前端..."
cd frontend
# 这里添加实际的前端部署命令
# 例如: cp -r dist/* /var/www/html/
cd ..

echo "部署完成!"