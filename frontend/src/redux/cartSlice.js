import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    cartCount: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
            // Calculate total count (sum of all quantities)
            state.cartCount = action.payload.reduce((sum, item) => sum + (item.quantity || 0), 0);
        },
        updateCartCount: (state, action) => {
            state.cartCount = action.payload;
        }
    }
})

export const { setCartItems, updateCartCount } = cartSlice.actions;
export default cartSlice.reducer;

