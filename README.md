# slacc

署名と zip の読み取りを、ネイティブコード(Rust)で行うモジュールです。[misskey-dev/slacc](https://github.com/misskey-dev/slacc) のコミット `eaad29863dcb07038bb196ea4f7d97b60cf89452`(0.2.0)から分かれたフォークで、MIT です。[Misskey (Toneriko)](https://github.com/toneriko-dev/toneriko) のために保守していて、npm には公開しません。

## フォークした理由

ネイティブモジュールを npm 経由で受け取ると、13 プラットフォーム分のバイナリの配布に縛られます。`Cannot find native binding` のような、環境に依存する起動の失敗も、自分では追えません。使う環境は限られているので、ソースを持ち、必要なプラットフォームだけをビルドします。

## upstream との違い

- `AhoCorasick` を削除しました。使っていないため、`aho-corasick` crate ごと外しています。
- 13 プラットフォーム対応のローダーを、隣に置かれたビルド成果物だけを読む `index.cjs` に置き換えました。
- ESM から読めるように `index.mjs` を足しました。ネイティブモジュールは CommonJS でしか読めないため、`createRequire` で包んでいます。

## ビルド

Rust のツールチェーンが必要です。

```sh
bun install
bun run build        # release ビルド
bun run build:debug  # debug ビルド
```

成果物の `*.node` と `target/` は main では追跡しません。

## 提供するもの

| 名前 | 内容 |
| --- | --- |
| `init(numThreads)` | 署名と検証を並列に処理するスレッドプールを初期化する。プロセスで 1 回だけ呼ぶ。2 回目はエラーになる |
| `Signer` | HTTP 署名と LD 署名を作る。RSA(2048〜8192 ビット)、Ed25519、ML-DSA-44 に対応する |
| `Verifier` | HTTP 署名を検証する |
| `ZipArchiveReader` | 絵文字のインポートで使う zip から、名前が一致する通常のファイルを読む。暗号化されたエントリ、ディレクトリ、symlink、上限のバイト数を超えるエントリは、エラーにする |

Misskey の backend が、ActivityPub の署名の生成と検証(`core/activitypub/http-signature.ts`)と、絵文字の zip のインポート(`queue/handlers/emojis.ts`)で使います。スレッドプールの初期化は `boot/common.ts` で行います。

## Misskey から使う

Misskey は、このリポジトリのタグを git の依存として `"slacc": "github:toneriko-dev/slacc#v<版>"` の形で参照します。タグのコミットには、GitHub Actions でビルドした次の 2 つのバイナリが入っています。依存として入れるときにビルドが走らないので、利用側に Rust は要りません。

| ファイル | 対象 |
| --- | --- |
| `index.linux-x64-gnu.node` | x86_64 の Linux (glibc) |
| `index.linux-arm64-gnu.node` | arm64 の Linux (glibc)。Raspberry Pi など |

ほかの環境 (macOS、Windows、musl の Linux) では `slacc: native binding not found` で止まります。その環境で使うときは、このリポジトリを clone してビルドし、できた `*.node` を利用側の `node_modules/slacc` に置いてください。

タグは release workflow で作ります。`package.json` と `Cargo.toml` の `version` を上げて main に push してから、workflow を手動で実行します。workflow は 2 つの環境でビルドして読み込めることを確かめたあと、バイナリを足したコミットに `v<版>` のタグを付けて push します。同じ版のタグがあれば止まります。
