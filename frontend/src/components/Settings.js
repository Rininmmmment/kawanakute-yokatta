import Title from "../components/Title";
import { useState } from "react";
import { ticketsDao } from '../lib/ticketsDao';
import { resetBalance, resetTotal } from "../lib/payment";
import styles from '@/styles/Settings.module.css';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function Settings({ userId, balance }) {
    const [display, setDisplay] = useState("menu");
    const [isDisable, setIsDisable] = useState(false);

    // 選択中照会メニュー名
    const handleMenuClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setDisplay(clickedItemValue);
    };

    // 馬券を全て消す
    const deleteAllTickets = async (userId) => {
        setIsDisable(true);
        try {
            const allTickets = await ticketsDao.getTodayTickets(userId);
            allTickets.forEach(async (document) => {
                await deleteDoc(doc(db, "tickets", document.id));
            });
            await resetBalance(userId);
            await resetTotal(userId);

            setIsDisable(false);
            window.location.reload();
        } catch (error) {
            console.error("削除中にエラーが発生しました: ", error);
        }
    };

    return (
        <>
            {display === "menu" &&
                <>
                    <Title title="設定" />
                    <ul className={styles.menu}>
                        <li onClick={handleMenuClick} data-value="reset">データリセット</li>
                    </ul>
                </>
            }
            {display === "reset" &&
                <>
                    <Title title="データリセット" />
                    <div className={styles.reset}>
                        <p>これまでの投票データ・入出金データを全て削除します。<br />よろしいですか？</p>
                        <div className={styles.btnContainer}>
                            <button onClick={() => deleteAllTickets(userId)} disabled={isDisable}>{isDisable ? "削除中..." : "はい"}</button>
                            <button onClick={handleMenuClick} data-value="menu">いいえ</button>
                        </div>
                    </div>
                </>
            }
        </>
    );
}
