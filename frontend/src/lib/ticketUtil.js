/**
 * 買い目を展開する
 * 
 * @param {string} horse - 馬番をカンマ区切りまたはコロン区切りで指定します。
 * @param {string} tickettype - 馬券のタイプ（例: "単勝", "複勝", "ワイド", "3連複"）
 * @param {string} buytype - 買い方の方式（例: "通常", "ボックス", "軸一頭ながし", "軸二頭ながし", "フォーメーション"）
 * @returns {Array<string>} - 計算された買い目のリスト（例: ['2,3,4', '5,6,7']）
 */
export const calcTickets = (horse, tickettype, buytype) => {
    // 分割
    function safeSplit(targetStr) {
        return targetStr.includes(',') ? targetStr.split(',') : [targetStr];
    }

    // arrからr個取り出す組み合わせを列挙する関数
    function getCombinations(arr, r) {
        let result = [];
        function combine(start, combo) {
            if (combo.length === r) {
                result.push(combo.join(','));  // ここでカンマ区切りの文字列に変換
                return;
            }
            for (let i = start; i < arr.length; i++) {
                combine(i + 1, combo.concat(arr[i]));
            }
        }

        combine(0, []);
        return result;
    }

    if (tickettype == "3連複" && buytype != "通常") {
        const parts = horse.includes(':') ? horse.split(':') : [horse];
        const splittedParts = parts.map(part => safeSplit(part));
        console.log(splittedParts);

        if (buytype == "ボックス") {
            return getCombinations(splittedParts[0], 3);
        } else if (buytype == "軸一頭ながし") {
            const subHorsesCombi = getCombinations(splittedParts[1], 2);  // 軸以外の2頭ずつの組み合わせ
            return subHorsesCombi.map(item => item + ',' + splittedParts[0]);
        } else if (buytype == "軸二頭ながし") {
            let result = [];
            for (let item of splittedParts[1]) {
                result.push(splittedParts[0] + ',' + item);
            }
            return result;
        } else if (buytype == "フォーメーション") {
            const combi = new Set();
            for (const l1 of splittedParts[0]) {
                for (const l2 of splittedParts[1]) {
                    for (const l3 of splittedParts[2]) {
                        if (l1 !== l2 && l2 !== l3 && l1 !== l3) {
                            const sortedCombo = [l1, l2, l3].sort().join(',');
                            combi.add(sortedCombo);
                        }
                    }
                }
            }
            return [...combi];
        }
    } else if (tickettype == "ワイド" && buytype != "通常") {
        const parts = horse.includes(':') ? horse.split(':') : [horse];
        const splittedParts = parts.map(part => safeSplit(part));

        if (buytype == "ボックス") {
            return getCombinations(splittedParts[0], 2);
        } else if (buytype == "ながし") {
            let result = [];
            for (let item of splittedParts[1]) {
                result.push(splittedParts[0] + ',' + item);
            }
            return result;
        } else if (buytype == "フォーメーション") {
            const combi = new Set();
            for (const l1 of splittedParts[0]) {
                for (const l2 of splittedParts[1]) {
                    if (l1 !== l2) {
                        const sortedCombo = [l1, l2].sort().join(',');
                        combi.add(sortedCombo);
                    }
                }
            }
            return [...combi];
        }
    } else {
        // 単勝/複勝 or 通常の場合はそのまま
        return [horse];
    }

};
// console.log(calcTickets("3,6,8,10", "ワイド", "ボックス"));
// console.log(calcTickets("3:,6,8,10", "ワイド", "ながし"));
// console.log(calcTickets("3,6:3,6,8,10", "ワイド", "フォーメーション"));
// console.log(calcTickets("3,6,8,10", "3連複", "ボックス"));
// console.log(calcTickets("2:6,8,10", "3連複", "軸一頭ながし"));
// console.log(calcTickets("2:3:6,8,10", "3連複", "軸二頭ながし"));
// console.log(calcTickets("2:3,6:6,8,10", "3連複", "フォーメーション"));
// console.log(calcTickets("2", "3連複", "通常"));

export const createRaceDataUrl = (raceid) => {
    return "https://race.sp.netkeiba.com/?pid=race_result&race_id=" + raceid + "&rf=race_toggle_menu";
}