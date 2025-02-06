# React - Next.js
## 開発サーバーを立てて動かす
0. Nodeのバージョンを変更する
```
# なければ
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 18.17.0

# バージョン変更
nvm use 18.17.0
```

1. インストール
```
npm install
```

2. 開発サーバーたてる
```
npm run dev
```

## Vercelにデプロイ
1. 必要であればvercel.jsonを変更する

2. GitHubリモートリポジトリにpushし、vercelからデプロイ