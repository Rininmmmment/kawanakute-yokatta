const Constants = new Map([
    ["TICKET_TYPES", new Map([
        ["win", "単勝"],
        ["place", "複勝"],
        ["quinella", "馬連"],
        ["quinella-place", "ワイド"],
        ["exacta", "馬単"],
        ["trio", "3連複"],
        ["trifecta", "3連単"]
    ])],
    ["TRACK_CODES", new Map([
        ["東京", "05"],
        ["中山", "06"],
        ["中京", "07"],
        ["京都", "08"],
        ["阪神", "09"]
    ])]
]);

export default Constants;
