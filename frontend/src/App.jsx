import {createBrowserRouter,RouterProvider} from "react-router"
import Home from "./components/Home"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import ForgotPasswordPage from "./components/ForgotPasswordPage"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import axios from "axios"
import { USER_API_ENDPOINT } from "./utils/constant"
import { setToken } from "./redux/authSlice"
import LoginSuccess from "./components/auth/LoginSuccess"

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path: '/login/success',
    element: <LoginSuccess/>
  },
  {
    path:"/forgotPassword",
    element:<ForgotPasswordPage/>
  }
])

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!token) {
      const refreshToken = async () => {
        try {
          const res = await axios.post(`${USER_API_ENDPOINT}/refresh_token`, {}, {
            withCredentials: true,
          });
          const { accessToken } = res.data.data;
          dispatch(setToken(accessToken));
        } catch (err) {
          if (err.response?.status === 401) {
            console.warn("No refresh token found, Skipping logout")
          } else {
            console.error("Failed to refresh token on app load:", err);
          }
        }
      };
      refreshToken();
    }
  }, [token]);


  return (
    <div>
      <RouterProvider router = {appRouter}/>
    </div>
  )
}

export default App
