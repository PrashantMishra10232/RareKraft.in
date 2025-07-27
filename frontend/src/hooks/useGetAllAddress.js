import axiosInstance from "@/utils/axiosInstance";
import { USER_API_ENDPOINT } from "@/utils/constant";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAddress } from "@/redux/authSlice";

function useGetAllAddress() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`${USER_API_ENDPOINT}/me`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAddress(res.data.data.shippingAddresses));
          // console.log("user data:", res.data.data);
          // console.log("addresses:", res.data.data.shippingAddresses);
        }
      } catch (error) {
        console.error("Axios error:", error);
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
      }
    };
    fetchUser();
  }, []);
}

export default useGetAllAddress;
