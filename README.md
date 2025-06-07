# Tesla Supercharger Finder

Dockerで簡単に起動できるTeslaスーパーチャージャー検索アプリ

## 起動方法（超簡単）

```bash
# 1. 環境変数の設定
cp .env.example .env
# .envファイルを編集してAPIキーを設定

# 2. Docker起動
docker-compose up

# 3. ブラウザでアクセス
# http://localhost:3000
```

以上！

## 必要なAPIキー

1. **Mapbox Token**

   - https://www.mapbox.com/ で無料アカウント作成
   - 無料枠で十分

2. **Google Places API Key**
   - https://console.cloud.google.com/ でプロジェクト作成
   - Places APIを有効化
   - APIキーを作成

## 開発コマンド

```bash
# コンテナに入る
docker-compose exec app sh

# パッケージ追加
docker-compose exec app npm install <package-name>

# 型チェック
docker-compose exec app npm run type-check

# リント
docker-compose exec app npm run lint
```

## トラブルシューティング

### ポート3000が使用中の場合

docker-compose.ymlの`ports`を変更:

```yaml
ports:
  - '3001:3000' # 3001でアクセス
```

### node_modulesの問題

```bash
docker-compose down
docker volume prune
docker-compose up --build
```
