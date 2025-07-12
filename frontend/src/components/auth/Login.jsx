import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Input } from '../ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setToken, setUser } from '@/redux/authSlice'
import axios from 'axios'
import { USER_API_ENDPOINT } from '@/utils/constant'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import GoogleLoginButton from './GoogleAuth'
import { toast } from 'sonner'

function Login() {

  const [input, setInput] = useState({
    email: "",
    password: ""
  })

  const { loading, user } = useSelector(store => store.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })

      if (res.data.success) {
        dispatch(setUser(res.data.data.loggedInUser));
        dispatch(setToken(res.data.data.accessToken));       

        localStorage.setItem("loggedInUser", JSON.stringify(res.data.data.loggedInUser))

        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      console.error("Error Response:", error.response);

      const errorMessage =
        error.response?.data?.message || error.message || "Something went wrong!";

      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    if (!user) { navigate("/login") }
    else if (user && user.role === "Buyer") {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div>
      <Navbar />
      <div id="login" className=' my-30'>
        <form onSubmit={submitHandler} className='w-[80%] sm:w-[30%] mx-auto'>
          <div className='flex justify-center items-center gap-3'>
            <h1 style={{ fontFamily: 'Prata, serif' }} className='text-3xl'>Login</h1>
            <p className='w-8 h-[1px] bg-[#414141]'></p>
          </div>
          <div className='my-2'>
            <Input
              type='email'
              value={input.email}
              name="email"
              placeholder="Email"
              onChange={changeEventHandler}
              className='border border-black rounded-none h-[42px] my-4'
            ></Input>
          </div>
          <div className='my-2'>
            <Input
              type='password'
              value={input.password}
              name="password"
              placeholder="Password"
              onChange={changeEventHandler}
              className='border border-black rounded-none h-[42px] my-4'
            ></Input>
          </div>
          <div className='flex justify-between'>
            <div style={{ fontFamily: 'Prata,serif' }} ><Link to="/forgotPassword">Forgot password?</Link></div>
            <span style={{ fontFamily: 'Prata,serif' }} ><Link to='/signup' className='font-semibold'>Sign up!</Link></span>
          </div>
          {
            loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> : <Button
              type='submit'
              className='w-full my-4'
            >Login</Button>
          }
        </form>
        {
          loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> : <GoogleLoginButton />
        }
      </div>
      <Footer />
    </div>
  )
}


export default Login