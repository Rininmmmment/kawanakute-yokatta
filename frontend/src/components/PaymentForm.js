import Title from "../components/Title";
import { getCurrentUserId } from "../lib/auth";
import { upsertBalance } from "../lib/payment";
import { useState } from "react";

import styles from '@/styles/Payment.module.css';

export default function Payment({ onButtonClick }) {
    const currentUserId = getCurrentUserId();
    const [deposit, setdeposit] = useState("0");

    const handleDepositChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) || value === "") {
            setdeposit(value);
        }
    };

    const handleFormSubmit = (event) => {
        onButtonClick(deposit);
        upsertBalance(event, currentUserId, deposit);
    };

    return (
        <>
            <form onSubmit={handleFormSubmit}>
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
