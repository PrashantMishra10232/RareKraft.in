import axios from "axios";
import { USER_API_ENDPOINT } from "./constant";
import store from "@/redux/store";
import { setToken, logout } from "@/redux/authSlice";

const axiosInstance = axios.create({
    baseURL: USER_API_ENDPOINT,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = store.getState().auth.token;
    
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest = error.config;

        //if access token expired
        if(error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                const res = await axios.post(`${USER_API_ENDPOINT}/refresh_token`,{},{withCredentials:true})

                const{accessToken} = res.data.data;
                // console.log("accessToken",accessToken);
                

                store.dispatch(setToken(accessToken)) 

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh Token Error:' ,refreshError);
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;