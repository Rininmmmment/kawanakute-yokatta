import Title from "../components/Title";
import { getTodayTickets } from "../lib/vote";
import { useState, useEffect } from "react";
import Constants from '../constants/Constants';  // パスはファイルの場所に応じて調整してください


export default function Inquiry({ userId, balance }) {
    const [display, setDisplay] = useState("menu");
    const [tickets, settickets] = useState("menu");

    const handleMenuClick = (event) => {
        const clickedItemValue = event.target.dataset.value;
        setDisplay(clickedItemValue);
        console.log(display);
    };

    useEffect(() => {
        const fetchUserIdAndBalance = async () => {
            try {
                const data = await getTodayTickets(userId);
                settickets(data);
                console.log(data);
            } catch (error) {
                console.error("ユーザーIDまたは残高の取得に失敗しました:", error);
            }
        }
        fetchUserIdAndBalance();
    }, []);

    return (
        <>
            {display === "menu" &&
                <>
                    <Title title="照会" />
                    <ul>
                        <li onClick={handleMenuClick} data-value="all">投票内容照会</li>
                    </ul>
                </>
            }
            {display === "all" &&
                <>
                    <Title title="投票内容照会" />
                    <ul>
                        {tickets.map((ticket, index) => (
                            <li key={index}>
                                <h3>{ticket.racetrack}</h3>
                                <p>{ticket.racenum}R</p>
                                <p>{Constants.get("TICKET_TYPES").get(ticket.tickettype)}</p>
                                <p>{ticket.horse}</p>
                                <p>{ticket.buytype}</p>
                                <p>{ticket.price}円</p>
                            </li>
                        ))}
                    </ul>
                </>
            }
        </>
    );
}
