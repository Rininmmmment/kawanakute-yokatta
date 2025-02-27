import Title from "../components/Title";
import { getTodayTickets } from "../lib/vote";
import { upsertBalance } from "../lib/payment";
import { useState, useEffect } from "react";
import styles from '@/styles/Inquiry.module.css';
import { ticketsDao } from '../lib/ticketsDao';
import { fetchApi } from '../lib/resultsApi';

export default function Inquiry({ userId, balance }) {
    const [display, setDisplay] = useState("menu");
    const [tickets, settickets] = useState([]);
    const [isDisable, setIsDisable] = useState(false);

    // 選択中照会メニュー名
    const handleMenuClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setDisplay(clickedItemValue);
    };

    // 結果を取得して、馬券情報に払い戻しの項目を追加する
    const fetchResults = async () => {
        setIsDisable(true);

        // 結果未更新馬券データ取得
        const data = await ticketsDao.getTicketsWithoutResults(userId);

        for (const ticket of tickets) {
            const result = await fetchApi(ticket.raceid);
            const payouts = ticketsDao.calculatePayouts(ticket, result[ticket.tickettype]);

            // 馬券更新
            await ticketsDao.updateResults(ticket, result[ticket.tickettype]);
            // 残高更新
            await upsertBalance(userId, parseInt(payouts));
        };
        setIsDisable(false);
    };

    // 投票内容照会(当日分)のデータ取得
    useEffect(() => {
        const fetchTicketsData = async () => {
            try {
                const data = await getTodayTickets(userId);
                console.log(data);
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
                                <p>購入: {ticket.price.toLocaleString()}円</p>
                                <p className={styles.ticketItemPayout}><span>払戻: </span>{ticket.payouts == null ? "未反映" : ticket.payouts.toLocaleString() + "円"}</p>
                            </li>
                        ))}
                    </ul>
                </>
            }
        </>
    );
}
