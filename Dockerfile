# 使用 Node.js 版本 16 作為基礎映像
FROM node:16.20.0

# 清除 npm 缓存
RUN npm cache clean --force

# 安裝 TypeScript
RUN npm install -g typescript

# 設定docker容器起始位置
WORKDIR /

# 將其它要用到的檔案複製到docker容器內
COPY package*.json ./
COPY swagger.json ./

# 安裝相依套件
RUN npm install --omit=dev
RUN npm install swagger-ui-express

# 複製已編譯好的 JavaScript 檔案到docker容器內
COPY dist /dist

# 設定環境變數
ENV NODE_ENV=production

# 設定容器對外的埠號
EXPOSE 3005

# 執行指令
CMD ["node", "dist/app.js"]