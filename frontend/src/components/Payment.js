import Title from "../components/Title";
import PaymentForm from "../components/PaymentForm";
import PaymentCompleted from "../components/PaymentCompleted";
import { useState } from "react";

export default function Payment({ userId, balance }) {
    const [displayForm, setdisplayForm] = useState(true);
    const [deposit, setdeposit] = useState(0);

    // 追加する金額
    const handleDisplay = (deposit) => {
        setdisplayForm(false);
        setdeposit(deposit);
    };

    return (
        <>
            <Title title="入金指示" />
            {displayForm && <PaymentForm onButtonClick={handleDisplay} userId={userId} balance={balance} />}
            {!displayForm && <PaymentCompleted deposit={deposit} userId={userId} balance={balance} />}
        </>
    );
}
