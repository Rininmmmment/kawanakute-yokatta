import { getMoney, updateMoney } from "./moneyDao";

/**
 * 回収率を計算する関数
 * @param {number} balance - 現在の残高
 * @param {number} total - 総額（入金額）
 * @returns {number} 回収率（0～100の整数）
 */
export const calcReturn = (balance, total) => {
    if (total === 0) return 0; // totalが0ならリターンも0
    return Math.floor((balance / total) * 100);
};

/**
 * 収支を計算する関数
 * @param {number} balance - 現在の残高
 * @param {number} total - 総額（入金額）
 * @returns {number} 収支（balance - total）
 */
export const calcProfitLoss = (balance, total) => {
    return balance - total;
};

/**
 * 残金項目をupsertする関数
 * @param {string} userId - ユーザーのID
 * @param {number} balanceChange - 増減する金額
 * @returns {Promise<void>} 処理が完了したら解決されるPromise
 */
export const upsertBalance = async (userId, balanceChange) => {
    const money = await getMoney(userId);
    const currentBalance = money.balance;
    await updateMoney(userId, { balance: parseInt(currentBalance) + parseInt(balanceChange) });
};

/**
 * トータル入金額をupsertする関数
 * @param {string} userId - ユーザーのID
 * @param {number} amount - 増減する金額（入金額）
 * @returns {Promise<void>} 処理が完了したら解決されるPromise
 */
export const upsertTotal = async (userId, amount) => {
    const money = await getMoney(userId);
    await updateMoney(userId, { total: (parseInt(money?.total) ?? 0) + parseInt(amount) });
};

export const resetBalance = async (userId) => {
    const money = await getMoney(userId);
    const currentBalance = money.balance;
    await updateMoney(userId, { balance: parseInt(0) });
};

export const resetTotal = async (userId) => {
    const money = await getMoney(userId);
    await updateMoney(userId, { total: parseInt(0) });
};