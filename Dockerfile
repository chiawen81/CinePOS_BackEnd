

# 使用 Node.js 版本 16 作為基礎映像
FROM node:16.20.0

# 清除 npm 缓存
RUN npm cache clean --force

# 安裝 TypeScript
RUN npm install -g typescript
RUN npm install multer
RUN npm install mongoose
RUN npm install mongodb

RUN ls -al

# 設定工作目錄
WORKDIR /app

# 將 package.json 和 package-lock.json 複製到工作目錄
COPY package*.json ./

# 安裝相依套件
RUN npm install --production

# 複製 TypeScript 專案到工作目錄
COPY . .

# 編譯 TypeScript 專案
RUN tsc

# 設定環境變數
ENV NODE_ENV=production

# 設定容器對外的埠號
EXPOSE 3005

# 執行指令
CMD ["npm", "run", "start"]