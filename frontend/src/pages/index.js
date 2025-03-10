import { useState, useEffect } from "react";
import { calcReturn, calcProfitLoss } from "../lib/payment";
import { getCurrentUserId } from "../lib/auth";
import { getMoney } from "../lib/moneyDao";

import Head from "next/head";
import Auth from "../components/Auth";
import Top from "../components/Top";
import Payment from "../components/Payment";
import Vote from "../components/Vote";
import Inquiry from "../components/Inquiry";
import Settings from "../components/Settings";
import styles from '@/styles/Home.module.css';

export default function Home() {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [displayTarget, setDisplayTarget] = useState("top");
    const [balance, setBalance] = useState(null);
    const [total, setTotal] = useState(null);
    const [returnRate, setReturnRate] = useState(null);

    // 子コンポーネントからクリックされたボタンの情報を受け取る
    const handleButtonClick = (buttonName) => {
        setDisplayTarget(buttonName);
    };

    // ユーザーID, 残金を取得
    useEffect(() => {
        const fetchUserIdAndBalance = async () => {
            try {
                const userId = await getCurrentUserId();
                setCurrentUserId(userId);
                if (userId) {
                    const moneyData = await getMoney(userId);
                    setBalance(moneyData.balance);
                    setTotal(calcProfitLoss(moneyData.balance, moneyData.total));
                    setReturnRate(calcReturn(moneyData.balance, moneyData.total));
                }
            } catch (error) {
                console.error("ユーザーIDまたは残高の取得に失敗しました:", error);
            }
        };
        fetchUserIdAndBalance();
    }, []);

    return (
        <>
            <Head>
                <title>買わなくて良かった</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <header className={styles.header}>
                    <h1>買わなくて良かった</h1>
                    <div>
                        <Auth />
                    </div>
                </header>
                <main>
                    {displayTarget !== "top" && (
                        <button className="top-btn" onClick={() => window.location.reload()}>
                            トップに戻る
                        </button>
                    )}
                    {displayTarget === "top" && (
                        <Top
                            onButtonClick={handleButtonClick}
                            userId={currentUserId}
                            balance={balance}
                            total={total}
                            returnRate={returnRate}
                        />
                    )}
                    {displayTarget === "payment" && currentUserId && (
                        <Payment userId={currentUserId} balance={balance} />
                    )}
                    {displayTarget === "vote" && (
                        <Vote userId={currentUserId} balance={balance} />
                    )}
                    {displayTarget === "inquiry" && (
                        <Inquiry userId={currentUserId} balance={balance} />
                    )}
                    {displayTarget === "settings" && (
                        <Settings userId={currentUserId} balance={balance} />
                    )}
                </main>
            </div >
        </>
    );
}
