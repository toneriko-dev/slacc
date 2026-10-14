/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: MIT
 */

// ビルドしたバイナリが今の環境で読み込め、公開する名前がそろっていることを確かめる。
// 引数のファイルが無いときは、release に別の環境のバイナリを入れてしまわないよう失敗させる。
import { existsSync } from 'node:fs';

const expected = process.argv[2];
if (expected == null || !existsSync(expected)) {
	console.error(`missing binding: ${expected}`);
	process.exit(1);
}

const binding = await import('../index.mjs');
const names = ['init', 'Signer', 'Verifier', 'ZipArchiveReader', 'SignatureAlgorithm'];
const missing = names.filter((name) => binding[name] == null);
if (missing.length > 0) {
	console.error(`missing exports: ${missing.join(', ')}`);
	process.exit(1);
}
binding.init(1);
console.log(`${expected}: ${names.join(', ')}`);
