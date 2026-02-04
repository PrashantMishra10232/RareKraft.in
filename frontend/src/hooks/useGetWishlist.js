import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { WISHLIST_API_ENDPOINT } from "@/utils/constant";
import { setWishlistItems } from "@/redux/wishlistSlice";
import store from "@/redux/store";

function useGetWishlist() {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user) {
            dispatch(setWishlistItems([]));
            return;
        }

        const fetchWishlist = async () => {
            try {
                const token = store.getState().auth.token;
                const res = await axios.get(
                    `${WISHLIST_API_ENDPOINT}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (res.data.success) {
                    // Normalize addedAt dates to ISO strings for serialization
                    const normalizedData = (res.data.data || []).map(item => ({
                        ...item,
                        addedAt: item.addedAt instanceof Date 
                            ? item.addedAt.toISOString() 
                            : item.addedAt || new Date().toISOString()
                    }));
                    dispatch(setWishlistItems(normalizedData));
                }
            } catch (error) {
                console.error("Fetch wishlist error:", error);
                dispatch(setWishlistItems([]));
            }
        };

        fetchWishlist();
    }, [user, dispatch]);
}

export default useGetWishlist;

