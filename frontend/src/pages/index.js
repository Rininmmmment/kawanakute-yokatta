import Head from "next/head";
import Image from "next/image";
import Auth from "../components/Auth";
import styles from '@/styles/Home.module.css';
import yenPic from "/public/images/yen.svg";
import horsePic from "/public/images/horse.svg";
import analyzePic from "/public/images/analyze.svg";
import settingPic from "/public/images/setting.svg";


export default function Home() {
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
                    <div className={styles.mainInfo}>
                        <h2>回収 __ %</h2>
                        <h2>収支 __ 円</h2>
                        <h3>購入限度 __ 円</h3>
                    </div>
                    <div>
                        <div className={styles.menuContainer}>
                            <div className={styles.menuBtn}>
                                <a href="#">
                                    <Image src={yenPic} alt="Profile Picture" width={50} height={50} />
                                    <p>入出金</p>
                                </a>
                            </div>
                        </div>
                        <div className={styles.menuContainer}>
                            <div className={styles.menuBtn}>
                                <a href="#">
                                    <Image src={horsePic} alt="Profile Picture" width={50} height={50} />
                                    <p>通常投票</p>
                                </a>
                            </div>
                            <div className={styles.menuBtn}>
                                <a href="#">
                                    <Image src={analyzePic} alt="Profile Picture" width={50} height={50} />
                                    <p>照会</p>
                                </a>
                            </div>
                        </div>
                        <div className={styles.menuContainer}>
                            <div className={styles.menuBtn}>
                                <a href="#">
                                    <Image src={settingPic} alt="Profile Picture" width={50} height={50} />
                                    <p>設定</p>
                                </a>
                            </div>
                        </div>

                    </div>
                </main>
                <footer >
                </footer>
            </div>
        </>
    );
}
