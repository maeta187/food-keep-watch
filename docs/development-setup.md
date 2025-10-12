# 開発環境セットアップ

プロジェクトを手元で動かすための前提条件と基本的なコマンドをまとめます。Expo Router と Bun を活用するワークフローに合わせ、依存関係の取得から開発サーバーの起動までを確認してください。

## 前提条件

- **Bun**: 最新の安定版をインストールします。`bun --version` で確認できます。
- **Node.js**: Volta を利用して `package.json` の指定 (`22.20.0`) を守ります。
- **Expo CLI**: グローバルインストールは不要で、`bunx expo` で必要なコマンドを呼び出します。
- **iOS シミュレーター**: 実機検証が必要な場合に備えて Xcode とシミュレーターを準備してください。

## 依存関係のインストール

```sh
bun install
```

- Bun が `package.json` と `bun.lock` を基に依存関係を解決します。
- 既存の `node_modules` に問題が生じた場合は削除して再インストールしてください。

## 開発サーバーの起動

Expo Router を用いたアプリの開発には以下のコマンドを使用します。

```sh
bunx expo start
```

- Web ブラウザでの確認が必要な場合は `bunx expo start --web` を使用します。
- 開発用クライアントでネイティブ挙動を確認する場合は `bunx expo start --dev-client` を利用し、別途 `expo-dev-client` をインストールしたビルドを用意してください。

## 補助コマンド

品質を保つため、以下のコマンドを適宜実行してください。

| コマンド               | 目的                                          |
| ---------------------- | --------------------------------------------- |
| `bun run lint`         | ESLint による静的解析（警告を許容しません）。 |
| `bun run lint:fix`     | 自動修正可能な ESLint エラーの解消。          |
| `bun run format`       | Prettier によるコード整形。                   |
| `bun run format:check` | 整形が必要なファイルの検出。                  |
| `bun run test`         | Vitest の単発実行。                           |
| `bun run test:watch`   | 変更を監視しながらのテスト実行。              |

## 環境変数

- 秘密情報は `.env` や Expo の Secrets など安全な手段で管理します。
- Supabase の URL や anon キーなどを扱う場合は、プロジェクトのガイドラインに従い `.env` を `.gitignore` に保持したまま管理してください。

## トラブルシューティング

- **キャッシュクリア**: `bunx expo start -c` で Metro バンドラのキャッシュをクリアできます。
- **TypeScript の型定義が反映されない**: エディタを再起動するか、`node_modules/.cache` を削除して再インストールします。
- **iOS シミュレーターでのリンク不良**: `bunx expo run:ios` でネイティブビルドを更新し、依存関係を再リンクしてください。

## 参考情報

- Expo Router ドキュメント: <https://docs.expo.dev/router/introduction/>
- NativeWind ドキュメント: <https://www.nativewind.dev/>
- Tailwind CSS ドキュメント: <https://tailwindcss.com/docs/installation>
