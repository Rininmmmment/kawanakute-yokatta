import { upsertBalance, upsertTotal } from "../lib/payment";
import { useState } from "react";
import styles from '@/styles/Payment.module.css';

export default function Payment({ onButtonClick, userId, balance }) {
    const [deposit, setdeposit] = useState("0");

    const handleDepositChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) || value === "") {
            setdeposit(value);
        }
    };

    const handleFormSubmit = () => {
        upsertBalance(userId, deposit);
        upsertTotal(userId, deposit);
        onButtonClick(deposit);
    };

    return (
        <>
            <form onSubmit={(event) => { event.preventDefault(); handleFormSubmit(); }}>
                <label className={styles.label}>
                    入金金額
                    <input
                        type="text"
                        value={deposit}
                        onChange={handleDepositChange} />円
                </label>
                <button
                    type="submit"
                    className={styles.btn}
                > 確認</button>
            </form >
        </>
    );
}
