/**
 * 結果API呼び出しのラッパー
 */
export const fetchApi = async (raceid) => {
    const apiUrl = 'https://kawanakute-yokatta-api.vercel.app/payouts/' + raceid;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('ネットワークエラー');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('エラー:', error);
        throw error;
    }
};
