export default function PaymentCompleted({ deposit, userId, balance }) {
    // 子コンポーネントからクリックされたボタンの情報を受け取る
    const handleButtonClick = (buttonName) => {
        setdisplayTarget(buttonName);
    };

    return (
        <>
            <p>{deposit}円の入金が完了しました。</p>
            {/* <button onButtonClick={handleButtonClick}>戻る</button> */}
        </>
    );
}