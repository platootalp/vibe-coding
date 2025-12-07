#!/bin/bash

# 构建脚本

echo "开始构建 SDD-Kit 项目..."

# 构建后端
echo "构建后端..."
cd backend
if [ -f "pom.xml" ]; then
  mvn clean install
elif [ -f "build.gradle" ]; then
  ./gradlew build
fi
cd ..

# 构建前端
echo "构建前端..."
cd frontend
npm install
npm run build
cd ..

echo "构建完成!"