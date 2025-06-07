FROM node:20-alpine

WORKDIR /app

# 依存関係のインストール（キャッシュ効率化）
COPY package*.json ./
RUN npm ci

# アプリケーションのコピー
COPY . .

# 開発サーバーのポート
EXPOSE 3000

# 開発モードで起動
CMD ["npm", "run", "dev"]