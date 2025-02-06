# Flask API
## 開発サーバーを立てて動かす
1. Python仮想環境を作成します。
```
python3 -m venv 仮想環境名
source 仮想環境名/bin/activate
```

2. 動かす
```
flask run
```

## Vercelにデプロイ
1. requirementsを作成
```
pip freeze > requirements.txt
```

2. 必要であればvercel.jsonを変更する

3. GitHubリモートリポジトリにpushし、vercelからデプロイ