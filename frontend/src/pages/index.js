import { useState } from "react";
import Head from "next/head";
import Auth from "../components/Auth";
import Top from "../components/Top";
import Payment from "../components/Payment";
import styles from '@/styles/Home.module.css';

export default function Home() {
    const [displayTarget, setdisplayTarget] = useState("top");

    // 子コンポーネントからクリックされたボタンの情報を受け取る
    const handleButtonClick = (buttonName) => {
        setdisplayTarget(buttonName);
    };

    return (
        <>
            <Head>
                <title>買わなくて良かった</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>{displayTarget}
                <header className={styles.header}>
                    <h1>買わなくて良かった</h1>
                    <div>
                        <Auth />
                    </div>
                </header>
                <main>
                    {displayTarget != "top" && <button onClick={() => handleButtonClick("top")}>トップに戻る</button>}
                    {displayTarget === "top" && <Top onButtonClick={handleButtonClick} />}
                    {displayTarget === "payment" && <Payment />}
                    {/* {displayTarget === "top" && <Top onButtonClick={handleButtonClick} />}
                    {displayTarget === "top" && <Top onButtonClick={handleButtonClick} />}
                    {displayTarget === "top" && <Top onButtonClick={handleButtonClick} />} */}
                    {/* <Payment /> */}
                </main >
                <footer >
                </footer>
            </div >
        </>
    );
}
