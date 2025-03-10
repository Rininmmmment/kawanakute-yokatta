import Title from "../components/Title";
import { getTodayTickets } from "../lib/vote";
import { upsertBalance } from "../lib/payment";
import { useState, useEffect } from "react";
import styles from '@/styles/Inquiry.module.css';
import { ticketsDao } from '../lib/ticketsDao';
import { fetchApi } from '../lib/resultsApi';
import { createRaceDataUrl } from '../lib/ticketUtil';

export default function Inquiry({ userId, balance }) {
    const [display, setDisplay] = useState("menu");
    const [tickets, settickets] = useState([]);
    const [isDisable, setIsDisable] = useState(false);

    // 選択中照会メニュー名
    const handleMenuClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setDisplay(clickedItemValue);
    };

    // 選択中照会メニュー名
    const convertPayouts = (payouts) => {
        if (payouts == -1) {
            return "該当レース無し";
        } else if (payouts == null) {
            return "未反映";
        } else {
            return payouts.toLocaleString() + "円";
        }
    };

    // 結果を取得して、馬券情報に払い戻しの項目を追加する
    const fetchResults = async () => {
        setIsDisable(true);

        // 結果未更新馬券データ取得
        const tickets = await ticketsDao.getTicketsWithoutResults(userId);
        for (const ticket of tickets) {
            const result = await fetchApi(ticket.raceid);
            const payouts = ticketsDao.calculatePayouts(ticket, result[ticket.tickettype]);

            if (payouts == -1) {
                // 馬券更新
                await ticketsDao.updateResults(ticket, result[ticket.tickettype]);
            } else {
                // 馬券更新
                await ticketsDao.updateResults(ticket, result[ticket.tickettype]);
                // 残高更新
                await upsertBalance(userId, parseInt(payouts));

            }
        };
        setIsDisable(false);
        window.location.reload();
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
                    <h2 className={styles.ticketItemUl}>投票内容</h2>
                    <ul>
                        {tickets.map((ticket, index) => (
                            <a href={createRaceDataUrl(ticket.raceid)} target="_blank">
                                <li key={index} className={styles.ticketItem}>
                                    <p>({index + 1})</p>
                                    <p className={styles.ticketItemDate}>購入日時: {ticket.racedate.toDate().toLocaleString()}</p>
                                    <p>{ticket.payouts > 0 && ticket.payouts !== null && <span className={styles.ticketItemWin}>的中</span>}</p>
                                    <p className={styles.ticketItemRace}>{ticket.racetrack} {ticket.racenum}R</p>
                                    <p>{ticket.horse}</p>
                                    <p className={styles.ticketItemTicketType}>{ticket.tickettype} {ticket.buytype}</p>
                                    <p>購入: {ticket.price.toLocaleString()}円</p>
                                    <p className={styles.ticketItemPayout}><span>払戻: </span>{convertPayouts(ticket.payouts)}</p>
                                </li>
                            </a>
                        ))}
                    </ul>
                </>
            }
        </>
    );
}
