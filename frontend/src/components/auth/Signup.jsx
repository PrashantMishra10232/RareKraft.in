import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Input } from '../ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import { USER_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setLoading } from '@/redux/authSlice'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import GoogleLoginButton from './GoogleAuth'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'



function Signup() {

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  })
  const { loading, user } = useSelector(store => store.auth)
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name)
    formData.append("email", input.email)
    formData.append("password", input.password)
    formData.append("otp", input.otp)

    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login')
      }
    } catch (error) {
      console.log("Axios Error:", error);
      console.log("Error Response Data:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Something went wrong! Please try again.";

      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false))
    }
  }

  const otpHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", input.email)

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/getOtp`, { email: input.email })
      if (res.data.success) {
        toast.success(res.data.message)
        setOtpSent(true);
      }
    } catch (error) {
      console.log("Axios Error:", error);
      console.log("Error Response Data:", error.response?.data);
      // console.log("Error Response Data Message:", error.response?.data?.message);

      const errorMessage = error.response?.data?.message || "Something went wrong! Please try again.";

      toast.error(errorMessage);
    }
    finally {
      dispatch(setLoading(false));
    }
  }


  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div id="signup" className='my-30'>
        <form onSubmit={submitHandler} className='w-[80%] sm:w-[30%] mx-auto'>
          <div className='flex justify-center items-center gap-3'>
            <h1 style={{ fontFamily: 'Prata, serif' }} className='text-3xl'>Sign Up</h1>
            <p className='w-8 h-[1px] bg-[#414141]'></p>
          </div>
          <div className='my-2'>
            <Input
              type='text'
              value={input.name}
              name="name"
              placeholder="Name"
              onChange={changeEventHandler}
              className='border border-black rounded-none h-[42px] my-4'
            ></Input>
          </div>
          <div className='my-2 flex justify-center items-center'>
            <Input
              type='email'
              value={input.email}
              name="email"
              placeholder="Email"
              onChange={changeEventHandler}
              className='border border-black border-r-0 rounded-none h-[42px] my-4'
            >
            </Input>
            <Button onClick={otpHandler} className='h-[42px] rounded-none border border-black border-l-0 font-bold'>Verify email</Button>
          </div>
          {otpSent && (
            <div className='my-2 flex justify-center items-center'>
              <InputOTP
                maxLength={6}
                type='otp'
                name="otp"
                value={input.otp}
                onChange={(value) => {
                  setInput({ ...input, otp: value });
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className='border border-black rounded-none' />
                  <InputOTPSlot index={1} className='border border-black rounded-none' />
                  <InputOTPSlot index={2} className='border border-black rounded-none' />
                  <InputOTPSeparator />
                  <InputOTPSlot index={3} className='border border-black rounded-none' />
                  <InputOTPSlot index={4} className='border border-black rounded-none' />
                  <InputOTPSlot index={5} className='border border-black rounded-none' />
                </InputOTPGroup>
              </InputOTP>
            </div>)}
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
          <span style={{ fontFamily: 'Prata,serif' }} >Already have an account? <Link to='/login' className='font-semibold'>Login Here!</Link></span>
          {
            loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> : <Button
              type='submit'
              className='w-full my-4'
            >Signup</Button>
          }
        </form>
        <div className='flex justify-center items-center'>
          {
            loading ? <Button className=' w-full md:w-[50%] my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> : <GoogleLoginButton />
          }
        </div>
        
      </div>
      <Footer />
    </div>
  )
}

export default Signup