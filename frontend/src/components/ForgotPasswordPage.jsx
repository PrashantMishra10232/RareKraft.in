import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { Input } from './ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setLoading } from '@/redux/authSlice'

function ForgotPasswordPage() {
    const { loading } = useSelector(store => store.auth)
    const [resetCodeSent, setResetCodeSent] = useState(false);
    const [input, setInput] = useState({
        email: "",
        code: "",
        password: ""
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = async (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const codeHandler = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/password/forgot`, { email: input.email })
            if (res.data.success) {
                setResetCodeSent(true);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log("Axios Error:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong"
            toast.error(errorMessage)
        } finally {
            dispatch(setLoading(false));
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true))
        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/password/reset`, input,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Axios error:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong"
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
            navigate("/login")
        }
    }

    return (
        <div>
            <Navbar />
            <div id="password" className=' my-30'>
                <form onSubmit={submitHandler} className='w-[80%] sm:w-[30%] mx-auto'>
                    <div className='flex justify-center items-center gap-3'>
                        <h1 style={{ fontFamily: 'Prata, serif' }} className='text-3xl'>Reset Password</h1>
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
                    {resetCodeSent && (
                        <>
                            <div className='my-2'>
                                <Input
                                    type='text'
                                    value={input.code}
                                    name="code"
                                    placeholder="Enter your code here"
                                    onChange={changeEventHandler}
                                    className='border border-black rounded-none h-[42px] my-4'
                                ></Input>
                            </div>

                            <div className='my-2'>
                                <Input
                                    type='password'
                                    value={input.password}
                                    name="password"
                                    placeholder="New Password"
                                    onChange={changeEventHandler}
                                    className='border border-black rounded-none h-[42px] my-4'
                                ></Input>
                            </div>
                        </>
                    )}

                    <div className='flex justify-between'>
                        {loading ? <span style={{ fontFamily: 'Prata,serif' }}> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</span> : <span style={{ fontFamily: 'Prata,serif' }} onClick={codeHandler} className='cursor-pointer hover:underline'>Send reset code!</span>}

                    </div>
                    {
                        loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button> : <Button
                            type='submit'
                            className='w-full my-4'
                        >Change Password</Button>
                    }
                </form>
            </div >
            <Footer />
        </div >
    )
}

export default ForgotPasswordPage