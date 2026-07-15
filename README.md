# Nostx

**Nostrの世界をシームレスに**

https://nostx.io

Nostx は、Nostr で使われる NIP-19 形式のコード（`npub` / `nprofile` / `note` / `nevent`）や NIP-05 アドレスを読み取り、各 Nostr クライアントで開けるリンクに変換するシェアゲートウェイです。クライアントの垣根を越えて、プロフィールや投稿を簡単に共有できます。

## 主な機能

- **NIP-19 コードの変換**: `npub1...` / `nprofile1...` / `note1...` / `nevent1...` を各クライアントのリンクに変換
- **NIP-05 アドレス対応**: `name@example.com` 形式のアドレスからプロフィールを解決
- **プレビュー表示**: 変換前にプロフィールや投稿の内容をプレビュー
- **QR コード生成**: `https://nostx.io/...` 形式の共有用 QR コードを生成
- **Zap 送金**: Lightning Address（LUD-16）から LNURL 経由でインボイスを生成し、`lightning:` スキームで送金
- **多言語対応**: 日本語 / 英語（svelte-i18n）

## 対応クライアント

| クライアント | 方式 |
| --- | --- |
| アプリで開く | `nostr:` スキーム（ネイティブアプリ連携） |
| [Primal](https://primal.net/) | Web リンク |
| [Coracle](https://coracle.social/) | Web リンク |
| [Iris](https://iris.to/) | Web リンク |
| [Snort](https://snort.social/) | Web リンク |
| [nostter](https://nostter.app/) | Web リンク |
| [Lumilumi](https://lumilumi.app/) | Web リンク |

## 使い方

トップページ（https://nostx.io ）の入力欄に NIP-19 コードを貼り付けるか、URL に直接コードを付けてアクセスします。

```
https://nostx.io/{npub | nprofile | note | nevent | NIP-05アドレス}
```

例:

```
https://nostx.io/npub1xxxxxxxx...
https://nostx.io/nevent1xxxxxxxx...
https://nostx.io/name@example.com
```

開いたページでプレビューを確認し、開きたいクライアントを選択するだけです。

QR コードを作りたい場合は https://nostx.io/qr から生成できます。

## 開発

### 技術スタック

- [SvelteKit 2](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/)
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools)
- [svelte-i18n](https://github.com/kaisermann/svelte-i18n)

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# 型チェック
npm run check

# Lint
npm run lint
```

## ライセンス

[LICENSE.md](./LICENSE.md) を参照してください。
