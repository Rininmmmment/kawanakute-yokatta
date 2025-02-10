import Title from "../components/Title";
import { getCurrentUserId } from "../lib/auth";
import { useState } from "react";
import styles from '@/styles/Vote.module.css';


export default function Vote() {
    const [display, setDisplay] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [deposit, setdeposit] = useState("0");

    const [racetrack, setRacetrack] = useState(null);
    const [raceDate, setRaceDate] = useState(null);
    const [raceNum, setRaceNum] = useState(null);
    const [ticketType, setTticketType] = useState(null);
    const [buyType, setBuyType] = useState(null);
    const [horse, setHorse] = useState(null);

    // ユーザーIDを取得
    getCurrentUserId().then((userId) => {
        setCurrentUserId(userId);
    });

    // 競馬場
    const handleRacetrackClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setRacetrack(clickedItemValue);
        setDisplay(display + 1);
        console.log(clickedItemValue);  // クリックしたアイテムのテキストを表示
    };

    // レース
    const handleRaceNumClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setRaceNum(clickedItemValue);
        setDisplay(display + 1);
        console.log(clickedItemValue);  // クリックしたアイテムのテキストを表示
    };

    // 式別
    const handleTicketTypeClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setTticketType(clickedItemValue);
        setDisplay(display + 1);
        console.log(clickedItemValue);  // クリックしたアイテムのテキストを表示
    };

    // 方式
    const handleBuyTypeClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setBuyType(clickedItemValue);
        setDisplay(display + 1);
        console.log(clickedItemValue);  // クリックしたアイテムのテキストを表示
    };

    // 単勝/複勝馬
    const handleHorseClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setHorse(clickedItemValue);
        setDisplay(display + 1);
        console.log(clickedItemValue);  // クリックしたアイテムのテキストを表示
    };

    const handleBack = () => {
        setDisplay(display - 1);
    };

    return (
        <>
            {display !== 0 &&
                <div>
                    <button onClick={handleBack}>戻る</button>
                </div>
            }
            {display === 0 &&
                <>
                    <Title title="競馬場" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem}>中山</li>
                        <li onClick={handleRacetrackClick} className={styles.voteListItem}>阪神</li>
                    </ul>
                </>
            }
            {display === 1 &&
                <>
                    <Title title="レース" />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleRaceNumClick} className={styles.voteListItem} data-value="11">11R</li>
                        <li onClick={handleRaceNumClick} className={styles.voteListItem} data-value="12">12R</li>
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
            {display === 3 && (ticketType === "win") || (ticketType === "place") &&
                <>
                    <Title title={ticketType === "win" ? "単勝" : "複勝"} />
                    <ul className={styles.voteListContainer}>
                        <li onClick={handleHorseClick} className={styles.voteListItem} data-value="1">1: サクラトゥジュール</li>
                        <li onClick={handleHorseClick} className={styles.voteListItem} data-value="2">2: メイショウチタン</li>
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
        </>
    );
}
