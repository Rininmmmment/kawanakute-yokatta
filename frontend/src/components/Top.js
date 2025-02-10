import Image from "next/image";
import { getCurrentUserId } from "../lib/auth";

import { getBalance } from "../lib/payment";
import { useState, useEffect } from "react";


import styles from '@/styles/Home.module.css';
import yenPic from "/public/images/yen.svg";
import horsePic from "/public/images/horse.svg";
import analyzePic from "/public/images/analyze.svg";
import settingPic from "/public/images/setting.svg";

export default function Top({ onButtonClick }) {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [balance, setBalance] = useState(null);

    // ユーザーIDを取得
    getCurrentUserId().then((userId) => {
        setCurrentUserId(userId);
    });

    // currentUserId が取得できたら balance を取得
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const balanceData = await getBalance(currentUserId);
                setBalance(balanceData);
            } catch (error) {
                console.error("残高の取得に失敗しました:", error);
            }
        };

        fetchBalance();
    }, [currentUserId]);

    return (
        <>
            <div className={styles.mainInfo}>
                <h2>回収 __ %</h2>
                <h2>収支 __ 円</h2>
                <h3>購入限度 {balance} 円</h3>
            </div>
            <div>
                <div className={styles.menuContainer}>
                    <div className={styles.menuBtn}>
                        <button onClick={() => onButtonClick("payment")}>
                            <Image src={yenPic} alt="Profile Picture" width={50} height={50} />
                            <p>入出金</p>
                        </button>
                    </div>
                </div>
                <div className={styles.menuContainer}>
                    <div className={styles.menuBtn}>
                        <button onClick={() => onButtonClick("vote")}>
                            <Image src={horsePic} alt="Profile Picture" width={50} height={50} />
                            <p>通常投票</p>
                        </button>
                    </div>
                    <div className={styles.menuBtn}>
                        <button onClick={() => onButtonClick("inquiry")}>
                            <Image src={analyzePic} alt="Profile Picture" width={50} height={50} />
                            <p>照会</p>
                        </button>
                    </div>
                </div>
                <div className={styles.menuContainer}>
                    <div className={styles.menuBtn}>
                        <button onClick={() => onButtonClick("setting")}>
                            <Image src={settingPic} alt="Profile Picture" width={50} height={50} />
                            <p>設定</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
