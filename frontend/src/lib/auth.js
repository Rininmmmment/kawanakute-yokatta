// lib/auth.js
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Google Sign-In Error:", error);
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

// 現在のユーザーIDを取得
export const getCurrentUserId = async () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user ? user.uid : null);
        });
    });
};

