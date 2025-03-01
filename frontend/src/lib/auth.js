import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

/**
 * Googleアカウントでサインインする関数
 * 
 * Googleの認証プロバイダを使用してポップアップを表示し、ユーザーにGoogleアカウントでのサインインを促す
 * 成功時、ユーザー情報を返す
 * 
 * @returns {Promise<Object | undefined>} ユーザー情報 (成功時) または undefined (失敗時)
 * @throws {Error} Googleサインイン中のエラー
 */
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Google Sign-In Error:", error);
    }
};

/**
 * ログアウト処理を行う関数
 * 
 * @returns {Promise<void>} サインアウトの完了
 * @throws {Error} ログアウト中のエラー
 */
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

/**
 * 現在サインインしているユーザーIDを取得する関数
 * 
 * Firebaseの`onAuthStateChanged`を使用して、認証状態の変化を監視します。
 * 認証状態が変わった際に、現在サインインしているユーザーのUIDを返します。
 * ユーザーがサインインしていない場合は、`null`が返されます。
 * 
 * @returns {Promise<string | null>} ユーザーのUID (サインインしている場合) または null (サインインしていない場合)
 */
export const getCurrentUserId = async () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user ? user.uid : null);
        });
    });
};

