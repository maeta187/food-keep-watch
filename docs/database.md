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

`db:generate` を実行すると、`drizzle/0000_*.ts` のほか、適用済み履歴を持つ `drizzle/meta/_journal.json` とスキーマスナップショットの `drizzle/meta/*_snapshot.json` が更新されます。これらをコミットしておくと、`expo-sqlite` 上で Drizzle の `migrate()` が同じ状態を再現できます。

`drizzle` ディレクトリ以下にマイグレーションファイルが出力されます。Expo SQLite では CLI の `push` が利用できないため、アプリ起動時に `src/database/client.ts` が自動でマイグレーションを適用します。`schema.ts` を更新したら `db:generate` を実行し、アプリを再起動して反映してください。

> 備考: `bun run db:generate` は SQL で生成されたファイルを自動で `.ts` に包み直すスクリプト（`scripts/prepare-migrations.ts`）を実行します。Expo/React Native で扱いやすいよう文字列エクスポートに変換しているだけなので、生成後のファイルをそのままコミットしてください。

### マイグレーション（SQL）の作成方法

- Drizzle は `.sql` を出力しますが、リポジトリでは **`.ts` ファイルのみを採用** します。生成された `.sql` はコミットせず削除してください。
- 各マイグレーションファイルは `drizzle/000x_*.ts` に `const migration = \`...\``形式で SQL を文字列化して`export default migration`します。SQL 内のバッククォートは`\`` でエスケープしてください。
- 例: `drizzle/0001_wandering_chamber.ts`
  ```ts
  const migration = `
  CREATE TABLE \\`categories\\` (...);
  --> statement-breakpoint
  CREATE UNIQUE INDEX ...;
  `
  export default migration
  ```

## シードデータ投入

- サンプル定義: `src/database/sample-data.ts`
- コマンド: `bun run db:seed`
- 出力: `.local/sqlite/food-keep-watch.db`

`db:seed` は Bun の `bun:sqlite` ドライバーを使ってローカル SQLite ファイルを作成し、サンプルデータ（牛乳、ヨーグルト、冷凍うどん）を投入します。Expo 実行環境とは独立したファイルなので、挙動確認や開発時の参考用途として利用してください。

## `drizzle/` ディレクトリ構成

| パス                         | 役割                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `drizzle/0000_*.ts`          | スキーマ変更内容を記述したマイグレーション（SQL を文字列でエクスポート）。`bun run db:generate` 実行時に自動生成されます。                       |
| `drizzle/meta/_journal.json` | 適用済みマイグレーションの履歴を保持するメタ情報。Drizzle Migrator が参照します。                                                                |
| `drizzle/migrations.js`      | Expo/React Native でマイグレーションを適用する際に読み込むエントリーポイント。`src/database/client.ts` や CLI シードスクリプトから参照されます。 |

## シミュレーター上の DB ファイルを確認する

シミュレーターにインストールされたアプリのデータディレクトリを確認するには、`xcrun simctl get_app_container` を使います。`bundleIdentifier` は `app.json` の `ios.bundleIdentifier` と一致させてください。

```bash
# 起動中のシミュレーターを対象に、データコンテナのパスを取得
xcrun simctl get_app_container booted com.anonymous.food-keep-watch data
```

出力されるパス例:

```
/Users/<あなたのユーザー名>/Library/Developer/CoreSimulator/Devices/<UDID>/data/Containers/Data/Application/<UUID>
```

このディレクトリ配下の `Library/LocalDatabase/food-keep-watch.db` にアプリ本番の SQLite ファイルが保存されています。Finder で開きたい場合は `open <上記パス>` を実行するか、`open -R <パス>/Library/LocalDatabase/food-keep-watch.db` で直接ファイルを選択できます。
