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

export const getTotal = async (userId) => {
    const userDocRef = doc(db, "money", userId);  // "money"コレクション内のuserIdに対応するドキュメントを取得
    try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            // ドキュメントが存在する場合、データを返す
            const balance = await getBalance(userId);
            console.log("収支データ:", docSnap.data().total);
            return balance - docSnap.data().total;  // 取得したデータを返す
        } else {
            console.log("指定されたユーザーのドキュメントは存在しません");
        }
    } catch (error) {
        console.error("ドキュメントの取得中にエラーが発生しました:", error);
    }
};

export const getReturn = async (userId) => {
    const userDocRef = doc(db, "money", userId);  // "money"コレクション内のuserIdに対応するドキュメントを取得
    try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const balance = await getBalance(userId);
            if (docSnap.data().total != 0) {
                return Math.floor((balance) / docSnap.data().total * 100);  // 取得したデータを返す
            } else {
                return 0;
            }
        } else {
            console.log("指定されたユーザーのドキュメントは存在しません");
        }
    } catch (error) {
        console.error("ドキュメントの取得中にエラーが発生しました:", error);
    }
};

// 残金項目をupsertする関数
// balance: 増減金額
export const upsertBalance = async (userId, balance) => {
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

// トータル入金額upsert
// diff: 増減金額
export const upsertTotal = async (userId, diff) => {
    const updTarget = doc(db, "money", userId);
    const data = await getDoc(updTarget);
    try {
        await setDoc(updTarget, {
            total: data.data().total + parseInt(diff, 10),
        }, { merge: true });
    } catch (error) {
        console.error("アップサート中にエラーが発生しました:", error);
    }
};
