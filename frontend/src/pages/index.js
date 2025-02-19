import { useState, useEffect } from "react";
import { getBalance, getTotal, getReturn } from "../lib/payment";
import { getCurrentUserId } from "../lib/auth";

import Head from "next/head";
import Auth from "../components/Auth";
import Top from "../components/Top";
import Payment from "../components/Payment";
import Vote from "../components/Vote";
import Inquiry from "../components/Inquiry";
import styles from '@/styles/Home.module.css';

export default function Home() {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [displayTarget, setdisplayTarget] = useState("top");
    const [balance, setBalance] = useState(null);
    const [total, setTotal] = useState(null);
    const [returnRate, setReturnRate] = useState(null);

    // 子コンポーネントからクリックされたボタンの情報を受け取る
    const handleButtonClick = (buttonName) => {
        setdisplayTarget(buttonName);
    };

    // ユーザーID, 残金を取得
    useEffect(() => {
        const fetchUserIdAndBalance = async () => {
            try {
                // まずユーザーIDを取得
                const userId = await getCurrentUserId();
                setCurrentUserId(userId); // userId を state に保存

                // userId が取得できたら balance を取得
                if (userId) {
                    const balanceData = await getBalance(userId);
                    setBalance(balanceData);
                    const totalData = await getTotal(userId);
                    setTotal((totalData));
                    const returnRate = await getReturn(userId);
                    setReturnRate((returnRate));
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
                    {displayTarget != "top" && <button className="top-btn" onClick={() => handleButtonClick("top")}>トップに戻る</button>}
                    {displayTarget === "top" && <Top onButtonClick={handleButtonClick} userId={currentUserId} balance={balance} total={total} returnRate={returnRate} />}
                    {displayTarget === "payment" && currentUserId && <Payment userId={currentUserId} balance={balance} />}
                    {displayTarget === "vote" && <Vote userId={currentUserId} balance={balance} />}
                    {displayTarget === "inquiry" && <Inquiry userId={currentUserId} balance={balance} />}
                </main >
            </div >
        </>
    );
}
