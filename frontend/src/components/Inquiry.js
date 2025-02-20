import Title from "../components/Title";
import { getTodayTickets } from "../lib/vote";
import { getResults, updateResults, getTicketsWithoutResults } from "../lib/results";
import { upsertBalance } from "../lib/payment";
import { useState, useEffect } from "react";
import styles from '@/styles/Inquiry.module.css';



export default function Inquiry({ userId, balance }) {
    const [display, setDisplay] = useState("menu");
    const [tickets, settickets] = useState([]);
    const [isDisable, setIsDisable] = useState(false);

    const handleMenuClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setDisplay(clickedItemValue);
    };

    // 結果を取得して、馬券情報に払い戻しの項目を追加する
    const fetchResults = async () => {
        setIsDisable(true);

        // 結果未更新馬券データ取得
        const data = await getTicketsWithoutResults(userId);

        // それぞれ結果取得し更新
        for (let i = 0; i < data.length; i++) {
            const result = await getResults(data[i].raceid);
            const payouts = await updateResults(data[i], result[data[i].tickettype]);
            upsertBalance(userId, payouts);
        };
        setIsDisable(false);
    };

    // 投票内容照会(当日分)のデータ取得
    useEffect(() => {
        const fetchTicketsData = async () => {
            try {
                const data = await getTodayTickets(userId);
                settickets(data);
            } catch (error) {
                console.error("当日分馬券情報の取得に失敗しました:", error);
            }
        }
        fetchTicketsData();
    }, []);

    return (
        <>
            {display === "menu" &&
                <>
                    <Title title="照会" />
                    <ul className={styles.menu}>
                        <li onClick={handleMenuClick} data-value="all">投票内容照会(当日分)</li>
                        <div className={styles.menuBtn}>
                            <button onClick={fetchResults} data-value="get-results" disabled={isDisable}>{isDisable ? "更新中..." : "結果更新(当日分)"}</button>
                        </div>
                    </ul>
                </>
            }
            {display === "all" &&
                <>
                    <Title title="投票内容照会(当日分)" />
                    <ul>
                        <li className={styles.ticketItemUl}>投票内容</li>
                        {tickets.map((ticket, index) => (

                            <li key={index} className={styles.ticketItem}>
                                <p>({index + 1})</p>
                                <p>{ticket.racetrack} {ticket.racenum}R</p>
                                <p>{ticket.horse}</p>
                                <p>{ticket.payouts !== 0 && ticket.payouts !== null && <span className={styles.ticketItemWin}>的中</span>}</p>
                                <p>{ticket.tickettype} {ticket.buytype}</p>
                                <p>購入: {ticket.price}円</p>
                                <p className={styles.ticketItemPayout}><span>払戻: </span>{ticket.payouts == null ? "未反映" : ticket.payouts + "円"}</p>
                            </li>
                        ))}
                    </ul>
                </>
            }
        </>
    );
}
