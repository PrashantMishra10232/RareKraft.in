import { USER_API_ENDPOINT } from "@/utils/constant";
import React from "react";

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${USER_API_ENDPOINT}/auth/google`;
    };

    return (
        <div className="flex items-center justify-center">
            <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-red-600"
        >
            <img className="w-[20px] h-[20px]" src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="" />Continue with Google
        </button>
        </div>
        
    );
};

export default GoogleLoginButton;
