import Image from "next/image";
import styles from '@/styles/Home.module.css';
import yenPic from "/public/images/yen.svg";
import horsePic from "/public/images/horse.svg";
import analyzePic from "/public/images/analyze.svg";
import settingPic from "/public/images/setting.svg";

export default function Top({ onButtonClick, userId, balance, total, returnRate }) {
    return (
        <>
            <div className={styles.mainInfo}>
                <h2>回収 {returnRate == null ? "loading..." : returnRate.toLocaleString()} %</h2>
                <h2>収支 {total == null ? "loading..." : total.toLocaleString()} 円</h2>
                <h3>購入限度 {balance == null ? "loading..." : balance.toLocaleString()} 円</h3>
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
