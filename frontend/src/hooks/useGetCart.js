import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CART_API_ENDPOINT } from "@/utils/constant";
import { setCartItems } from "@/redux/cartSlice";
import store from "@/redux/store";

function useGetCart() {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user) {
            dispatch(setCartItems([]));
            return;
        }

        const fetchCart = async () => {
            try {
                const token = store.getState().auth.token;
                const res = await axios.get(
                    `${CART_API_ENDPOINT}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (res.data.success) {
                    dispatch(setCartItems(res.data.data || []));
                }
            } catch (error) {
                console.error("Fetch cart error:", error);
                // Don't show error toast here, just set empty cart
                dispatch(setCartItems([]));
            }
        };

        fetchCart();
    }, [user, dispatch]);
}

export default useGetCart;

