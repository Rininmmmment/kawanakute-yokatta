# API仕様
/odds/{raceid}
-> 1-3着情報

/payments/{raceid}
-> 払い戻し情報

# Flask API
## 開発サーバーを立てて動かす
1. Python仮想環境を作成します。
```
python3 -m venv myvenv
source myvenv/bin/activate
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