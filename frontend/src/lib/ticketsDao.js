import { collection, addDoc, setDoc, doc, query, where, getDocs, orderBy } from "firebase/firestore";
import { calcTickets } from "./ticketUtil";
import { db } from "../../firebaseConfig";

/**
 * TicketsコレクションのDAOクラス
 */
class TicketsDao {
    constructor() {
        this.ticketsRef = collection(db, "tickets");
    }

    /**
     * 馬券を新規追加
     * @param {Object} newTicket - 新しい馬券のデータ
     * @returns {Promise<void>}
     */
    async addTicket(newTicket) {
        try {
            await addDoc(this.ticketsRef, newTicket);
        } catch (error) {
            console.error("チケットの追加に失敗しました:", error);
            throw error;
        }
    }

    /**
     * 特定のユーザーの馬券を取得
     * @param {string} userId - ユーザーID
     * @returns {Promise<Array>} - 当日分の馬券リスト
     */
    async getTodayTickets(userId) {
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);

        const q = query(
            this.ticketsRef,
            // where("racedate", "==", Timestamp.fromDate(today)),
            where("userId", "==", userId),
            orderBy("racedate", "desc")
        );

        try {
            const querySnapshot = await getDocs(q);
            const tickets = [];
            querySnapshot.forEach((doc) => {
                tickets.push({ id: doc.id, ...doc.data() });
            });
            return tickets;
        } catch (error) {
            console.error("当日分馬券情報の取得に失敗しました:", error);
            throw error;
        }
    }

    /**
     * 特定のユーザーの払い戻し未更新の馬券を取得
     * @param {string} userId - ユーザーID
     * @returns {Promise<Array>} - 払い戻し未更新の馬券リスト
     */
    async getTicketsWithoutResults(userId) {
        const q = query(
            this.ticketsRef,
            where("payouts", "==", null),
            where("userId", "==", userId)
        );

        try {
            const querySnapshot = await getDocs(q);
            const tickets = [];
            querySnapshot.forEach((doc) => {
                tickets.push({ id: doc.id, ...doc.data() });
            });
            return tickets;
        } catch (error) {
            console.error("レース情報の取得に失敗しました:", error);
            throw error;
        }
    }

    /**
     * 馬券IDで馬券データを取得
     * @param {string} ticketId - 馬券ID
     * @returns {Promise<Object|null>} - 馬券データ
     */
    async getTicketById(ticketId) {
        const ticketRef = doc(this.ticketsRef, ticketId);
        const docSnap = await getDocs(ticketRef);
        return docSnap.exists() ? docSnap.data() : null;
    }

    /**
     * 払い戻し金額を馬券情報に反映
     * @param {Object} data - 馬券データ
     * @param {Object} result - 払い戻し結果
     * @returns {Promise<number>} - 払い戻し金額
     */
    async updateResults(data, result) {
        let payouts = this.calculatePayouts(data, result);

        // 馬券レコード更新
        const updTarget = doc(this.ticketsRef, data.id);
        await setDoc(updTarget, { payouts: payouts }, { merge: true });
        return payouts;
    }

    /**
     * 払い戻し金額を計算するロジック
     * @param {Object} data - 馬券データ
     * @param {Object} result - 結果データ
     * @returns {number} - 計算された払い戻し金額
     */
    calculatePayouts(data, result) {
        try {
            let payouts = 0;
            if (data.tickettype === '単勝') {
                if (data.horse === result.horse) {
                    payouts = data.price * parseInt(result.payout, 10) / 100;
                }
            } else if (data.tickettype === '複勝') {
                result.forEach(r => {
                    if (data.horse === r.horse) {
                        payouts = data.price * parseInt(r.payout, 10) / 100;
                    }
                });
            } else if (data.tickettype === 'ワイド') {
                const targetTickets = calcTickets(data.horse, data.tickettype, data.buytype);
                for (let ticket of targetTickets) {
                    const nums = ticket.split(",");
                    result.forEach(r => {
                        if (nums.every(h => r.horse.includes(h))) {
                            payouts += data.price * parseInt(r.payout, 10) / 100;
                        }
                    });
                }
            } else if (data.tickettype === '3連複') {
                const targetTickets = calcTickets(data.horse, data.tickettype, data.buytype);
                for (let ticket of targetTickets) {
                    const nums = ticket.split(",");
                    if (nums.every(h => result.horse.includes(h))) {
                        payouts = data.price * parseInt(result.payout, 10) / 100;
                    }
                }
            }
        } catch (error) {
            return -1;
        }

        return payouts;
    }
}

export const ticketsDao = new TicketsDao();