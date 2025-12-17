import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishlistItems: [],
    wishlistCount: 0,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlistItems: (state, action) => {
            const normalizedItems = (action.payload || []).map(item => ({
                ...item,
                addedAt: item.addedAt instanceof Date 
                    ? item.addedAt.toISOString() 
                    : item.addedAt || new Date().toISOString()
            }));
            state.wishlistItems = normalizedItems;
            state.wishlistCount = normalizedItems.length;
        },
        removeWishlistItem: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(
                item => item.product?._id !== action.payload
            );
            state.wishlistCount = state.wishlistItems.length;
        },
        clearWishlist: (state) => {
            state.wishlistItems = [];
            state.wishlistCount = 0;
        },
    },
});

export const { setWishlistItems, removeWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

