import { setAllProducts } from "@/redux/productSlice";
import axios from "axios";
import { Product_API_ENDPOINT } from "@/utils/constant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";




function useGetAllProducts() {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllProducts = async()=>{
            try {
                // Fetch all products by passing page=all parameter
                // Use regular axios instead of axiosInstance since products don't require auth
                const res = await axios.get(`${Product_API_ENDPOINT}/all?page=all`,
                    {
                        withCredentials:true
                    }
                )
                if(res.data.success){
                    dispatch(setAllProducts(res.data.data.products));                    
                    // Only show toast if there's a message
                    if(res.data.message) {
                        toast.success(res.data.message);
                    }
                }
            } catch (error) {
                console.error("Axios error:",error);
                const errorMessage = error.response?.data?.message || "Something went wrong";
                // Don't show error toast for product fetching - it's not critical
                console.error("Failed to fetch products:", errorMessage);
            }
        }
        fetchAllProducts();
    },[])
}

export default useGetAllProducts;