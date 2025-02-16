from flask import Flask, Response, request
import json
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# オッズと馬番号を取得
def scrape_odds_and_horse_number(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return {"error": "Failed to fetch the page"}

    response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, "html.parser")
    
    results = []
    
    for row in soup.find_all("tr", class_="FirstDisplay"):
        try:
            rank = row.find("div", class_="Rank").text.strip()
            numbers = row.find_all("td", class_="Num")
            if len(numbers) < 2:
                continue 
            waku_number = numbers[0].div.text.strip() 
            uma_number = numbers[1].div.text.strip()
            horse_name = row.find("dt", class_="Horse_Name").text.strip()
            odds = row.find("td", class_="Odds").find("dt").text.strip()

            results.append({
                "着順": rank,
                "枠番": waku_number,
                "馬番": uma_number,
                "馬名": horse_name,
                "オッズ": odds
            })
        except AttributeError:
            continue 
    
    return results


def scrape_payouts(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return {"error": "Failed to fetch the page"}

    response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, "html.parser")

    payout_data = []

    # 払戻しテーブルを取得
    table = soup.find("table", class_="Payout_Detail_Table")
    if not table:
        return {"error": "Payout table not found"}

    rows = table.find_all("tr")

    for row in rows:
        bet_type = row.find("th").text.strip()
        numbers = [span.text.strip() for span in row.find("td", class_="Result").find_all("span") if span.text.strip()]
        payout = [span.text.strip() for span in row.find("td", class_="Payout").find_all("span") if span.text.strip()]
        popularity = [span.text.strip() for span in row.find("td", class_="Ninki").find_all("span") if span.text.strip()]

        payout_data.append({
            "tickettype": bet_type,
            "horse": numbers,
            "payout": payout,
            "popularity": popularity
        })

    return payout_data

@app.route('/odds/<race_id>', methods=['GET'])
def scrape_odds_endpoint(race_id):
    url = f"https://race.sp.netkeiba.com/?pid=race_result&race_id={race_id}"
    data = scrape_odds_and_horse_number(url)
    return Response(json.dumps(data, ensure_ascii=False), content_type="application/json; charset=utf-8")

@app.route('/payouts/<race_id>', methods=['GET'])
def scrape_payouts_endpoint(race_id):
    url = f"https://race.sp.netkeiba.com/?pid=race_result&race_id={race_id}"
    data = scrape_payouts(url)
    return Response(json.dumps(data, ensure_ascii=False), content_type="application/json; charset=utf-8")

if __name__ == '__main__':
    app.run(debug=True)
