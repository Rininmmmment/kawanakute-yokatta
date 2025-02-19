import { collection, addDoc, Timestamp, query, where, getDocs, } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// 馬券を購入する
export const insertTicket = async (userId, racetrack, racenum, tickettype, buytype, horse, price, raceid) => {
    try {
        // 当日分のみ購入可能
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        const docRef = await addDoc(collection(db, "tickets"), {
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
        });

        console.log("チケットが追加されました。ID:", docRef.id);
    } catch (error) {
        console.error("チケット追加中にエラーが発生しました:", error);
    }
};

export const getTodayTickets = async (userId) => {
    const racesRef = collection(db, "tickets");

    // 今日の分のみ取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
        racesRef,
        where("racedate", "==", Timestamp.fromDate(today)),
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
    }
};