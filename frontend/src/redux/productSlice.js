import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    product: {},
    allProducts: [],
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers:{
        setProduct:(state,action)=>{
            state.product = action.payload
        },
        setAllProducts:(state,action)=>{
            state.allProducts = action.payload
        }
    }
})
export const {setProduct,setAllProducts} = productSlice.actions;
export default productSlice.reducer;