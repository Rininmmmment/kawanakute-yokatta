import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const getBalance = async (userId) => {
    const userDocRef = doc(db, "money", userId);  // "money"コレクション内のuserIdに対応するドキュメントを取得
    try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            // ドキュメントが存在する場合、データを返す
            console.log("残金データ:", docSnap.data().balance);
            return docSnap.data().balance;  // 取得したデータを返す
        } else {
            console.log("指定されたユーザーのドキュメントは存在しません");
        }
    } catch (error) {
        console.error("ドキュメントの取得中にエラーが発生しました:", error);
    }
};

// 残金項目をupsertする関数
export const upsertBalance = async (event, userId, balance) => {
    event.preventDefault();
    const balanceData = await getBalance(userId);
    const userDocRef = doc(db, "money", userId);
    try {
        await setDoc(userDocRef, {
            balance: parseInt(balance, 10) + parseInt(balanceData, 10),
        }, { merge: true });

        console.log("残金項目がアップサートされました");
    } catch (error) {
        console.error("アップサート中にエラーが発生しました:", error);
    }
};
