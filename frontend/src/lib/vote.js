import { Timestamp } from "firebase/firestore";
import { ticketsDao } from "./ticketsDao";

// 馬券を購入する
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

// 当日分のチケットを取得
export const getTodayTickets = async (userId) => {
    try {
        const tickets = await ticketsDao.getTodayTickets(userId);
        return tickets;
    } catch (error) {
        console.error("当日分馬券情報の取得に失敗しました:", error);
    }
};
