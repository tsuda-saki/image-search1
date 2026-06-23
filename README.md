# 画像タグ検索デモ（GitHub Pages向け）

サーバー不要、JSONファイルだけで動く画像検索アプリです。

## ファイル構成

```
/
├── index.html      検索デモ本体
├── demo.js         検索ロジック
├── add.html        画像追加フォーム（images.json を生成）
├── add.js          フォームのロジック
├── data/
│   └── images.json 画像とタグのデータ
└── img/
    ├── penguin_walk.png
    ├── penguin_sit.png
    └── tool_icon.png
```

`img/` 内の3枚は仕組み確認用のプレースホルダー画像です。実際の画像に置き換えてください。

## GitHub Pagesでの公開方法

1. このリポジトリの内容をそのまま push する
2. GitHubの該当リポジトリ → Settings → Pages
3. Source を「Deploy from a branch」、Branch を `main`（フォルダは `/root`）に設定
4. 数分後に `https://ユーザー名.github.io/リポジトリ名/` で公開される

## 画像を追加する手順

1. `add.html` をブラウザで開く
2. 画像ファイルを選び、タグをカンマ区切りで入力して「リストに追加」
3. 必要な分だけ繰り返す
4. 「images.json をダウンロード」して、`data/images.json` を置き換える
5. 選んだ画像ファイル自体は手動で `img/` フォルダにコピーする
   （静的サイトなのでブラウザから直接ファイルを書き込むことはできないため）
6. 変更を commit & push すれば公開サイトにも反映される

既存の `images.json` を `add.html` の①でアップロードすれば、そこに追記する形で編集を続けられます。
