import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/redux/authSlice";
import { toast } from "sonner";

const LoginSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");
        const userEncoded = params.get("user");

        if (accessToken && userEncoded) {
            const user = JSON.parse(atob(userEncoded)); // decode base64

            localStorage.setItem("loggedInUser", JSON.stringify(user));

            dispatch(setUser(user));
            dispatch(setToken(accessToken));
            toast.message("Please set your account's password in the view profile section")
            navigate("/");

        }
    }, [dispatch, navigate]);

    return <p>Logging you in, please wait...</p>;
};

export default LoginSuccess;
