<div align="center">
  <a href="https://github.com/toneriko-dev"><img src=".github/assets/toneriko-icon.svg" width="72" height="72" alt="Toneriko"></a>

  <h1>slacc</h1>

  <p>署名と zip の読み取りを Rust で行う、Misskey (Toneriko) のネイティブモジュール</p>

  <p>
    <a href="https://github.com/toneriko-dev/slacc/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/toneriko-dev/slacc/test.yml?branch=main&style=flat-square&label=test" alt="test"></a>
    <a href="https://github.com/toneriko-dev/slacc/tags"><img src="https://img.shields.io/github/v/tag/toneriko-dev/slacc?style=flat-square&color=26739f&label=release" alt="release"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-434d54?style=flat-square" alt="MIT"></a>
  </p>

  <p>
    <a href="#提供するもの">提供するもの</a>
    ·
    <a href="#ビルド">ビルド</a>
    ·
    <a href="#misskey-から使う">Misskey から使う</a>
  </p>

  <sub><a href="https://github.com/toneriko-dev">Toneriko</a> の部品</sub>
</div>

<br>

[misskey-dev/slacc](https://github.com/misskey-dev/slacc) 0.2.0 から分かれた、署名と zip の読み取りを Rust で行うモジュールです。使う環境だけのバイナリを自分でビルドするために、ソースごと持っています。

## 提供するもの

| 名前 | 内容 |
| --- | --- |
| `init(numThreads)` | 署名と検証のスレッドプールを作る。プロセスで 1 回だけ呼ぶ |
| `Signer` | HTTP 署名と LD 署名を作る。RSA(2048〜8192 ビット)、Ed25519、ML-DSA-44 |
| `Verifier` | HTTP 署名を検証する |
| `ZipArchiveReader` | 絵文字のインポートの zip から、名前の一致するファイルを読む |

upstream から `AhoCorasick` を外し、13 環境向けのローダーを、隣のバイナリだけを読む `index.cjs` と ESM 用の `index.mjs` に置き換えています。

## ビルド

Rust のツールチェーンが要ります。

```sh
bun install
bun run build        # release
bun run build:debug  # debug
```

## Misskey から使う

Misskey は release のタグを git の依存として読み込みます。

```json
"slacc": "github:toneriko-dev/slacc#v<版>"
```

タグのコミットには、x86_64 と arm64 の Linux(glibc)向けのバイナリが入っています。ほかの環境では `slacc: native binding not found` で止まるので、clone してビルドした `*.node` を `node_modules/slacc` に置いてください。

版を出すときは、`package.json` と `Cargo.toml` の `version` を上げて main に push し、release workflow を手動で実行します。
