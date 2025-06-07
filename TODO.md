# Tesla Supercharger Finder - TODO List

## Completed ✅
- [x] 技術スタック選定（Next.jsフルスタック版）
- [x] Docker環境のセットアップ（Dockerfile, docker-compose）

## In Progress 🔄
- [ ] Next.jsプロジェクトの初期セットアップ

## High Priority 🔴
- [ ] 地図表示の実装（react-map-gl）
- [ ] スーパーチャージャーデータの静的JSONファイル作成
- [ ] 現在地取得と最寄りチャージャー表示

## Medium Priority 🟡
- [ ] Google Places APIでの周辺施設検索
- [ ] 検索・フィルター機能
- [ ] レスポンシブデザイン対応
- [ ] Vercelへのデプロイ

## Implementation Details

### Next.jsプロジェクトの初期セットアップ
- Create Next.js app with TypeScript
- Configure Tailwind CSS
- Set up ESLint and Prettier
- Create basic folder structure

### 地図表示の実装
- Install react-map-gl and mapbox-gl
- Create Map component
- Add Mapbox token configuration
- Implement basic map controls

### スーパーチャージャーデータ
- Create JSON schema for charger data
- Add sample data for major cities
- Implement data loading utility

### 現在地機能
- Use browser Geolocation API
- Add location permission handling
- Calculate nearest chargers
- Show distance from current location

### 周辺施設検索
- Implement Google Places API integration
- Add search radius configuration
- Filter by place types (restaurants, shopping, etc.)
- Cache API responses

### フィルター機能
- Filter by distance
- Filter by charger availability
- Filter by amenities
- Save filter preferences

### レスポンシブデザイン
- Mobile-first approach
- Touch-friendly controls
- Optimize for different screen sizes
- Progressive Web App features

### Vercelデプロイ
- Configure environment variables
- Set up CI/CD pipeline
- Optimize build performance
- Configure custom domain