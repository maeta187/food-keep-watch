# データベースセットアップ

Expo + Drizzle + `expo-sqlite` の初期構成についてまとめます。アプリ内で入力した値を端末に保存する際の参考にしてください。

## 使い方

- スキーマ定義: `src/database/schema.ts`
- クライアント初期化: `src/database/client.ts` にある `getDb()` を呼び出すと、`drizzle-orm` のインスタンスを取得できます。
- データベースファイル: `food-keep-watch.db`（端末内に作成されます）

```ts
import { getDb } from '@/src/database/client'

const db = await getDb()
await db.insert(foods).values({ name: '牛乳', ... })
```

## 開発フロー

| コマンド              | 説明                                                               |
| --------------------- | ------------------------------------------------------------------ |
| `bun run db:generate` | `drizzle.config.ts` を参照してマイグレーションファイルを生成します |

`drizzle` ディレクトリ以下にマイグレーションファイルが出力されます。Expo SQLite では CLI の `push` が利用できないため、アプリ起動時に `src/database/client.ts` が自動でマイグレーションを適用します。`schema.ts` を更新したら `db:generate` を実行し、アプリを再起動して反映してください。

## シードデータ投入

- サンプル定義: `src/database/sample-data.ts`
- コマンド: `bun run db:seed`
- 出力: `.local/sqlite/food-keep-watch.db`

`db:seed` は Bun の `bun:sqlite` ドライバーを使ってローカル SQLite ファイルを作成し、サンプルデータ（牛乳、ヨーグルト、冷凍うどん）を投入します。Expo 実行環境とは独立したファイルなので、挙動確認や開発時の参考用途として利用してください。

## `drizzle/` ディレクトリ構成

| パス                         | 役割                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `drizzle/0000_*.sql`         | スキーマ変更内容を記述した SQL マイグレーションファイル。`bun run db:generate` 実行時に自動生成されます。                                        |
| `drizzle/meta/_journal.json` | 適用済みマイグレーションの履歴を保持するメタ情報。Drizzle Migrator が参照します。                                                                |
| `drizzle/migrations.js`      | Expo/React Native でマイグレーションを適用する際に読み込むエントリーポイント。`src/database/client.ts` や CLI シードスクリプトから参照されます。 |
