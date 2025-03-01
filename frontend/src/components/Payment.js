import Title from "../components/Title";
import { useState } from "react";
import { upsertBalance, upsertTotal } from "../lib/payment";
import styles from '@/styles/Payment.module.css';

export default function Payment({ userId, balance }) {
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [depositAmount, setDepositAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false); // 入金処理中の状態

    // 入金ボタンクリック時
    const handleDeposit = async (amount) => {
        // 入力値の検証
        if (isNaN(amount) || amount <= 0) {
            setErrorMessage("正しい金額を入力してください");
            return;
        }
        if (amount % 100 !== 0) {
            setErrorMessage("金額は100円単位で入力してください");
            return;
        }

        setErrorMessage(""); // エラーメッセージをクリア
        setIsProcessing(true); // 入金処理中にする

        try {
            await upsertBalance(userId, amount);
            await upsertTotal(userId, amount);
            setIsFormVisible(false);
        } catch (error) {
            setErrorMessage("入金処理に失敗しました。再試行してください。");
        } finally {
            setIsProcessing(false); // 処理完了後に解除
        }
    };

    const handleDepositChange = (event) => {
        const value = event.target.value;
        // 数値または空文字なら入力を許可
        if (!isNaN(value) || value === "") {
            setDepositAmount(value);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await handleDeposit(depositAmount);
    };

    return (
        <>
            <Title title="入金指示" />
            {isFormVisible ? (
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <label className={styles.label}>
                        入金金額
                        <span>
                            <input
                                type="text"
                                value={depositAmount}
                                onChange={handleDepositChange}
                                placeholder="金額を入力"
                                className={styles.input}
                                disabled={isProcessing}
                            /> 円
                        </span>
                    </label>
                    <div className={styles.error}>{errorMessage}</div>
                    <div className={styles.btn}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isProcessing} // 処理中はボタンを非活性化
                        >
                            {isProcessing ? "処理中..." : "確認"}
                        </button>
                    </div>
                </form>
            ) : (
                <p className={styles.successMessage}>{depositAmount}円の入金が完了しました。</p>
            )}
        </>
    );
}
