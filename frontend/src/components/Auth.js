// components/Auth.js
import { useState, useEffect } from "react";
import { signInWithGoogle, logout } from "../lib/auth";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Auth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <p>{user.displayName} さん</p>
                    <button onClick={logout}>ログアウト</button>
                </div>
            ) : (
                <button onClick={signInWithGoogle}>ログイン</button>
            )}
        </div>
    );
};

export default Auth;
