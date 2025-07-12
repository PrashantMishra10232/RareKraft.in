import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    products: [],
    allProducts: [],
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers:{
        setProduct:(state,action)=>{
            state.products = action.payload
        },
        setAllProducts:(state,action)=>{
            state.allProducts = action.payload
        }
    }
})
export const {setProduct,setAllProducts} = productSlice.actions;
export default productSlice.reducer;