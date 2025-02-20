import { collection, doc, setDoc, query, where, getDocs, } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// 結果未更新の馬券情報取得
export const getTicketsWithoutResults = async (userId) => {
    const racesRef = collection(db, "tickets");
    const q = query(
        racesRef,
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
    }
};

// 払い戻し情報を取得し馬券を更新
// data: 対象1馬券
// 払戻金を返す
export const updateResults = async (data, result) => {
    try {
        // 払戻金計算
        let payouts = 0;
        if (data.tickettype == '単勝') {
            if (data.horse == result.horse) {
                payouts = data.price * parseInt(result.payout, 10) / 100;
            }
        }

        // 馬券レコード更新
        const updTarget = doc(db, "tickets", data.id);
        await setDoc(updTarget, {
            payouts: payouts,
        }, { merge: true });
        return payouts;
    } catch (error) {
        console.error("払戻金アップサート中にエラーが発生しました:", error);
    }
};

// 払い戻し結果取得
export const getResults = async (raceid, tickettype) => {
    const apiUrl = 'https://kawanakute-yokatta-api.vercel.app/payouts/' + raceid;
    try {
        // APIを呼び出す
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('ネットワークエラー');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // console.error('エラー:', error);
        throw error;
    }
}

// export const updateTickets = async (userId) => {
//     const racesRef = collection(db, "tickets");

//     // 今日の分のみ取得
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const q = query(
//         racesRef,
//         where("racedate", "==", Timestamp.fromDate(today)),
//         where("userId", "==", userId)
//     );

//     try {
//         const querySnapshot = await getDocs(q);
//         const tickets = [];
//         querySnapshot.forEach((doc) => {
//             tickets.push({ id: doc.id, ...doc.data() });
//         });
//         return tickets;
//     } catch (error) {
//         console.error("レース情報の取得に失敗しました:", error);
//     }
// };