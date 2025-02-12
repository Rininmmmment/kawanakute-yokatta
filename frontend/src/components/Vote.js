import Title from "../components/Title";
import { insertTicket } from "../lib/vote";
import { upsertBalance } from "../lib/payment";
import { useState, useEffect } from "react";
import styles from '@/styles/Vote.module.css';


export default function Vote({ userId, balance }) {
    const [display, setDisplay] = useState(0);
    const [racetrack, setRacetrack] = useState(null);
    const [raceNum, setRaceNum] = useState(null);
    const [ticketType, setTticketType] = useState(null);
    const [buyType, setBuyType] = useState(null);
    const [horse, setHorse] = useState(null);
    const [price, setPrice] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isDisable, setIsDisable] = useState(false);

    // 購入金額入力取得
    const handlePriceChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) || value === "") {
            setPrice(value * 100);
        }
    };

    // セットクリック時（=購入時）
    const handleBtnClick = async () => {
        if (balance >= price) {
            setErrorMsg("");
            try {
                setIsDisable(true);
                await insertTicket(userId, racetrack, raceNum, ticketType, buyType, horse, price);  // 馬券購入
                await upsertBalance(userId, -1 * price);  // 残金減らす
                setIsDisable(false);  // 連打防止
                setDisplay(display + 1);
            } catch (error) {
                console.error("挿入に失敗しました:", error);
                setErrorMsg("処理に失敗しました");
            }
        }
        else {
            setErrorMsg("お金が足りないよ");
        }
    }

    // 競馬場
    const handleRacetrackClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setRacetrack(clickedItemValue);
        setDisplay(display + 1);
    };

    // レース
    const handleRaceNumClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setRaceNum(clickedItemValue);
        setDisplay(display + 1);
    };

    // 式別
    const handleTicketTypeClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setTticketType(clickedItemValue);
        setDisplay(display + 1);
    };

    // 方式
    const handleBuyTypeClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setBuyType(clickedItemValue);
        setDisplay(display + 1);
    };

    // 単勝/複勝馬
    const handleHorseClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setHorse(clickedItemValue);
        setDisplay(display + 1);
    };

    const handleBack = () => {
        setDisplay(display - 1);
    };

    return (
        <>
            {display !== 0 && display !== 5 &&
                <div>
                    <button onClick={handleBack}>戻る</button>
                </div>
            }
            {display === 0 &&
                <>
                    <Title title="競馬場" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="中山">中山</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="阪神">阪神</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="中京">中京</li>
                    </ul>
                </>
            }
            {display === 1 &&
                <>
                    <Title title="レース" />
                    <ul className={styles.voteListContainer}>
                        {[...Array(12)].map((_, index) => (
                            <li key={index + 1} onClick={handleRaceNumClick} className={styles.voteListItem} data-value={index + 1}>{index + 1}R</li>
                        ))}
                    </ul>
                </>
            }
            {display === 2 &&
                <>
                    <Title title="式別" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="win">単勝</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="place">複勝</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="quinella">馬連：後回し</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="quinella-place">ワイド</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="exacta">馬単：後回し</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="trio">3連複</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="trifecta">3連単：後回し</li>
                    </ul>
                </>
            }

            {/* 単/複勝の場合馬選択 */}
            {display === 3 && ((ticketType === "win") || (ticketType === "place")) &&
                <>
                    <Title title={ticketType === "win" ? "単勝" : "複勝"} />
                    <ul className={styles.voteListContainer}>
                        {[...Array(12)].map((_, index) => (
                            <li onClick={handleHorseClick} className={styles.voteListItem} data-value={index + 1}>{index + 1}</li>
                        ))}
                    </ul>
                </>
            }

            {/* ワイド */}
            {display === 3 && (ticketType === "quinella-place") &&
                <>
                    <Title title="方式" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="11">通常</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="12">ながし</li>
                    </ul>
                </>
            }

            {/* 三連複 */}
            {display === 3 && (ticketType === "trio") &&
                <>
                    <Title title="方式" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="11">通常</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="12">軸一頭ながし</li>
                    </ul>
                </>
            }

            {/* 確認画面 */}
            {display === 4 &&
                <>
                    <Title title="金額入力" />
                    <table>
                        <tbody>
                            <tr>
                                <td>競馬場</td>
                                <td>{racetrack}</td>
                            </tr>
                            <tr>
                                <td>レース</td>
                                <td>{raceNum}R</td>
                            </tr>
                            <tr>
                                <td>式別</td>
                                <td>{ticketType}</td>
                            </tr>
                            <tr>
                                <td>馬番</td>
                                <td>{horse}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <span>金額</span>
                        <input type="text" onChange={handlePriceChange} />
                        <span>00円</span>
                        <p>{errorMsg}</p>
                        <button
                            disabled={isDisable}
                            onClick={handleBtnClick}>セット
                        </button>
                    </div>
                </>
            }

            {/* 確認画面 */}
            {display === 5 &&
                <>
                    <p>購入が完了しました</p>
                </>
            }
        </>
    );
}
