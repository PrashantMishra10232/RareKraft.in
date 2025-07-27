import { setAllProducts } from "@/redux/productSlice";
import axiosInstance from "@/utils/axiosInstance";
import { Product_API_ENDPOINT } from "@/utils/constant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";




function useGetAllProducts() {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllProducts = async()=>{
            try {
                const res = await axiosInstance.get(`${Product_API_ENDPOINT}/all`,
                    {
                        withCredentials:true
                    }
                )
                if(res.data.success){
                    dispatch(setAllProducts(res.data.data.products));                    
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.error("Axios error:",error);
                const errorMessage = error.response?.data?.message || "Something went wrong";
                toast.error(errorMessage)
            }
        }
        fetchAllProducts();
    },[])
}

export default useGetAllProducts;