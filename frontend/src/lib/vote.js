import { Timestamp } from "firebase/firestore";
import { ticketsDao } from "./ticketsDao";

/**
 * 馬券を購入する関数
 * @param {string} userId - ユーザーのID
 * @param {string} racetrack - 競馬場の名前
 * @param {string} racenum - レース番号
 * @param {string} tickettype - チケットの種類（例: 単勝, 複勝, 3連複など）
 * @param {string} buytype - 購入方式（例: 通常, ボックス, 軸一頭ながし など）
 * @param {string} horse - 購入する馬の番号（複数の場合カンマ区切りで指定）
 * @param {number} price - 馬券の購入金額
 * @param {string} raceid - レースID
 * @returns {Promise<void>} - チケットが正常に追加された場合、何も返さない
 */
export const insertTicket = async (userId, racetrack, racenum, tickettype, buytype, horse, price, raceid) => {
    try {
        // 当日分のみ購入可能
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        const newTicket = {
            userId: userId,
            racetrack: racetrack,
            racedate: Timestamp.fromDate(date),
            racenum: parseInt(racenum, 10),
            tickettype: tickettype,
            buytype: buytype,
            horse: horse,
            price: price,
            raceid: raceid,
            payouts: null
        };

        await ticketsDao.addTicket(newTicket);  // 新しいチケットを追加
    } catch (error) {
        console.error("チケット追加中にエラーが発生しました:", error);
    }
};

/**
 * 当日分のチケットを取得する関数
 * @param {string} userId - ユーザーのID
 * @returns {Promise<Array>} - ユーザーの当日分のチケットのリスト
 */
export const getTodayTickets = async (userId) => {
    try {
        const tickets = await ticketsDao.getTodayTickets(userId);
        return tickets;
    } catch (error) {
        console.error("当日分馬券情報の取得に失敗しました:", error);
    }
};
