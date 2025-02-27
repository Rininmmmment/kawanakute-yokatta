import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

/**
 * @typedef {Object} Money
 * @property {number} balance - 購入可能残高
 * @property {number} total - 入金合計額
 */

/**
 * moneyのレコードを取得する
 * @param {string} userId ユーザーID
 * @returns {Promise<Money | undefined>} ユーザーのMoneyデータ、または存在しない場合はundefined
 */
export const getMoney = async (userId) => {
    const userDocRef = doc(db, "money", userId);
    try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.warn("指定されたユーザーのドキュメントは存在しません");
            return undefined;
        }
    } catch (error) {
        console.error("ドキュメントの取得中にエラーが発生しました:", error);
        throw error;
    }
};

/**
 * moneyのレコードを作成または更新（Upsert）する
 * @param {string} userId ユーザーID
 * @param {Money} moneyData 登録するMoneyデータ
 * @returns {Promise<void>}
 * 
 * @example
 * // moneyデータを設定する例
 * (async () => {
 *     try {
 *         await setMoney("user123", { balance: 500000, total: 30000 });
 *         console.log("Moneyデータが正常に登録されました！");
 *     } catch (error) {
 *         console.error("登録エラー:", error);
 *     }
 * })();
 */
export const upsertMoney = async (userId, moneyData) => {
    const userDocRef = doc(db, "money", userId);
    try {
        await setDoc(userDocRef, moneyData);
        console.log("moneyデータが正常に作成/更新されました");
    } catch (error) {
        console.error("moneyデータの作成/更新中にエラーが発生しました:", error);
        throw error;
    }
};

/**
 * moneyのレコードを更新する（部分更新）
 * @param {string} userId ユーザーID
 * @param {Partial<Money>} updateData 更新するフィールド
 * @returns {Promise<void>}
 * 
 * @example
 * // balance を 500000 に更新する例
 * (async () => {
 *     try {
 *         await updateMoney("user123", { balance: 500000 });
 *         console.log("Moneyデータが正常に更新されました！");
 *     } catch (error) {
 *         console.error("更新エラー:", error);
 *     }
 * })();
 */
export const updateMoney = async (userId, updateData) => {
    const userDocRef = doc(db, "money", userId);
    try {
        await updateDoc(userDocRef, updateData);
        console.log("moneyデータが正常に更新されました");
    } catch (error) {
        console.error("moneyデータの更新中にエラーが発生しました:", error);
        throw error;
    }
};

/**
 * moneyのレコードを削除する
 * @param {string} userId ユーザーID
 * @returns {Promise<void>}
 */
export const deleteMoney = async (userId) => {
    const userDocRef = doc(db, "money", userId);
    try {
        await deleteDoc(userDocRef);
        console.log("moneyデータが正常に削除されました");
    } catch (error) {
        console.error("moneyデータの削除中にエラーが発生しました:", error);
        throw error;
    }
};