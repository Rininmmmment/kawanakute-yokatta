import Title from "../components/Title";
import { insertTicket } from "../lib/vote";
import { upsertBalance } from "../lib/payment";
import { useState, useEffect } from "react";
import styles from '@/styles/Vote.module.css';
import Constants from '../constants/constants';


export default function Vote({ userId, balance }) {
    const [display, setDisplay] = useState(0);
    const [racetrack, setRacetrack] = useState(null);
    const [raceNum, setRaceNum] = useState(null);
    const [ticketType, setTticketType] = useState(null);
    const [buyType, setBuyType] = useState(null);
    const [horse, setHorse] = useState(null);
    const [selectedHorses, setSelectedHorses] = useState("");
    const [price, setPrice] = useState("");
    const [raceid, setRaceid] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isDisable, setIsDisable] = useState(false);
    const year = new Date().getFullYear();  // レースid用年
    const [trackcode, setTrackcode] = useState("");  // レースid用競馬場コード


    // 購入金額入力取得
    const handlePriceChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) || value === "") {
            setPrice(value * 100);
        }
    };

    // レースID
    const handleRaceIdChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) || value === "") {
            setRaceid(year + trackcode + value + raceNum);
        }
    };

    // セットクリック時（=購入時）
    const handleBtnClick = async () => {
        console.log(balance);
        if (balance >= price) {
            setErrorMsg("");
            try {
                setIsDisable(true);
                await insertTicket(userId, racetrack, raceNum, ticketType, buyType, horse, price, raceid);  // 馬券購入
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
        setTrackcode(Constants.get("TRACK_CODES").get(clickedItemValue))  // 競馬場コードをセット
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
        console.log(display, buyType);
        const clickedItemValue = event.target.dataset.value;
        setBuyType(clickedItemValue);
        console.log(display, buyType);
    };

    // 単勝/複勝馬
    const handleHorseClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setHorse(clickedItemValue);
        setDisplay(display + 1);
    };

    // ワイド
    const handleHorseClickWide = (index) => {
        let selectedArray = selectedHorses ? selectedHorses.split(",").map(Number) : [];

        if (selectedArray.includes(index)) {
            // すでに選択されていたら解除
            selectedArray = selectedArray.filter((horse) => horse !== index);
        } else if (selectedArray.length < 2) {
            // まだ2つ未満なら追加
            selectedArray.push(index);
        }

        setSelectedHorses(selectedArray.join(",")); // カンマ区切りの文字列に変換
        console.log(selectedHorses);
    };

    const handleBack = () => {
        setDisplay(display - 1);
    };

    return (
        <>
            {display !== 0 && display !== 5 &&
                <div>
                    <button onClick={handleBack} className="top-btn">＜ 戻る</button>
                </div>
            }
            {display === 0 &&
                <>
                    <Title title="競馬場" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="東京">東京</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="中山">中山</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="阪神">阪神</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="中京">中京</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="京都">京都</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="札幌">札幌</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="函館">函館</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="新潟">新潟</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="福島">福島</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem} data-value="小倉">小倉</li>
                    </ul>
                </>
            }
            {display === 1 &&
                <>
                    <Title title="レース" />
                    <ul className={styles.voteListContainer}>
                        {[...Array(12)].map((_, index) => (
                            <li key={index + 1} onClick={handleRaceNumClick} className={styles.voteListItem} data-value={String(index + 1).padStart(2, '0')}>{index + 1}R</li>
                        ))}
                    </ul>
                </>
            }
            {display === 2 &&
                <>
                    <Title title="式別" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="単勝">単勝</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="複勝">複勝</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="馬連">馬連：後回し</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="ワイド">ワイド</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="馬単：後回し">馬単：後回し</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="3連複">3連複</li>
                        <li onClick={handleTicketTypeClick} className={styles.voteListItem} data-value="3連単">3連単：後回し</li>
                    </ul>
                </>
            }

            {/* 単/複勝の場合馬選択 */}
            {display === 3 && ((ticketType === "単勝") || (ticketType === "複勝")) &&
                <>
                    <Title title={ticketType} />
                    <ul className={styles.voteListContainer}>
                        {[...Array(18)].map((_, index) => (
                            <li onClick={handleHorseClick} className={styles.voteListItem} data-value={index + 1}>{index + 1}</li>
                        ))}
                    </ul>
                </>
            }

            {/* ワイド */}
            {display === 3 && (ticketType === "ワイド") && (buyType === null) &&
                <>
                    <Title title="方式" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="通常">通常</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="ながし">ながし</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="ボックス">ボックス</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="フォーメーション">フォーメーション</li>
                    </ul>
                </>
            }
            {display === 3 && (ticketType === "ワイド") && (buyType === "通常") &&
                <>
                    <Title title={ticketType} />
                    <p>馬番を2頭選択してください。</p>
                    <ul className={styles.voteListContainer}>
                        {[...Array(18)].map((_, index) => {
                            const number = index + 1;
                            const isSelected = selectedHorses.split(",").map(Number).includes(number);

                            return (
                                <li
                                    key={index}
                                    onClick={() => handleHorseClickWide(number)}
                                    className={`${styles.voteListItem} ${isSelected ? styles.selected : ""}`}
                                    data-value={number}
                                >
                                    {number}
                                </li>
                            );
                        })}
                        <div>
                            <button onClick={() => { setDisplay(display + 1); setHorse(selectedHorses); }}>決定</button>
                        </div>
                    </ul>
                </>
            }
            {/* {display === 3 && (ticketType === "ワイド") && (buyType === "ながし") &&
                <>
                    <Title title={ticketType} />
                    <p>軸を1頭選択してください。</p>
                    <ul className={styles.voteListContainer}>
                        {[...Array(18)].map((_, index) => (
                            <li onClick={handleHorseClick} className={styles.voteListItem} data-value={index + 1}>{index + 1}</li>
                        ))}
                    </ul>
                </>
            } */}

            {/* 三連複 */}
            {display === 3 && (ticketType === "3連複") && (buyType === null) &&
                <>
                    <Title title="方式" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="通常">通常</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="軸一頭ながし">軸一頭ながし</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="軸二頭ながし">軸二頭ながし</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="ボックス">ボックス</li>
                        <li onClick={handleBuyTypeClick} className={styles.voteListItem} data-value="フォーメーション">フォーメーション</li>
                    </ul>
                </>
            }

            {display === 3 && (ticketType === "3連複") && (buyType === "通常") &&
                <>
                    <Title title={ticketType} />
                    <p>馬番を3頭選択してください。</p>
                    <ul className={styles.voteListContainer}>
                        {[...Array(18)].map((_, index) => (
                            <li onClick={handleHorseClick} className={styles.voteListItem} data-value={index + 1}>{index + 1}</li>
                        ))}
                        <button>決定</button>
                    </ul>
                </>
            }

            {/* 確認画面 */}
            {display === 4 &&
                <>
                    <Title title="金額入力" />
                    <table className={styles.voteSetTable}>
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
                        <div className={styles.voteSetInput}>
                            <span>金額　</span>
                            <input type="text" onChange={handlePriceChange} />
                            <span> 00円</span>
                            <p>{errorMsg}</p>
                        </div>
                        <div className={styles.voteSetInputId}>
                            <label>レースID　</label>
                            <span>{year + trackcode} </span>
                            <input type="text" onChange={handleRaceIdChange} />
                            <span> {raceNum}</span>
                        </div>
                        <div className={styles.voteSetInputBtn}>
                            <button
                                disabled={isDisable}
                                onClick={handleBtnClick}>セット
                            </button>
                        </div>
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
