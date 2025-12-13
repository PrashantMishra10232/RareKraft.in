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
import ProductPage from "./components/admin/ProductPage"
import OrdersPage from "./components/admin/OrdersPage"
import ProtectedRoute from "./components/admin/ProtectedRoute"
import Dashboard from "./components/admin/Dashboard"
import ProductEditPage from "./components/admin/ProductEditPage"
import Collection from "./components/Collection"
import Contact from "./components/Contact"
import About from "./components/About"
import ProductDetail from "./components/ProductDetail"
import ProfilePage from "./components/ProfilePage"
import AddressUpdateForm from "./components/AddressUpdateForm"
import ProfileDetailPage from "./components/ProfileDetailPage"
import Cart from "./components/Cart"
import Checkout from "./components/Checkout"

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/collection",
    element:<Collection/>
  },
  {
    path:"/about",
    element:<About/>
  },
  {
    path:"/contact",
    element:<Contact/>
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
  },
  {
    path:"/details/:id",
    element:<ProductDetail/>
  },
  {
    path:"/profilePage",
    element: <ProfilePage/>
  },
  {
    path:"/address",
    element: <AddressUpdateForm/>
  },
  {
    path:"/profileDetails",
    element:<ProfileDetailPage/>
  },
  {
    path:"/cart",
    element:<Cart/>
  },
  {
    path:"/checkout",
    element:<Checkout/>
  },


  //for seller/admin
  {
    path:"/admin/dashboard",
    element:<ProtectedRoute><Dashboard/></ProtectedRoute>
  },
  {
    path:"/admin/productPage",
    element:<ProtectedRoute><ProductPage/></ProtectedRoute>
  },
  {
    path:"/admin/product/edit/:id",
    element:<ProtectedRoute><ProductEditPage/></ProtectedRoute>
  },
  {
    path:"/admin/orderPage",
    element:<ProtectedRoute><OrdersPage/></ProtectedRoute>
  }
])

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!token && localStorage.getItem("loggedInUser")) {
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
