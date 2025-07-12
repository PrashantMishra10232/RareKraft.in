import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Bookmark, CircleUserRound, LogOutIcon, Search, ShoppingCart, User, User2 } from 'lucide-react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/utils/axiosInstance';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { logout } from '@/redux/authSlice';
import { persistor } from '@/redux/store';
import { toast } from 'sonner';

function Navbar() {
    const { user } = useSelector(store => store.auth)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axiosInstance.post(`${USER_API_ENDPOINT}/logout`, {}, {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(logout());
                await persistor.purge();
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Logout Error:", error);
            console.error("Error Response:", error.response);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    }

    return (
        <div className='bg-white'>
            <div className='md:px-35 sm:px-10 sm:py-7 p-3 flex justify-between items-center'>
                {/* Mobile Sidebar */}
                <div className="sm:hidden flex items-center">
                    <button
                        type="button"
                        className="text-gray-700 focus:outline-none"
                        onClick={() => {
                            const sidebar = document.getElementById('mobile-sidebar');
                            if (sidebar) sidebar.classList.toggle('hidden');
                        }}
                        aria-label="Open sidebar"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div
                        id="mobile-sidebar"
                        className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-6 hidden transition-all"
                    >
                        <button
                            type="button"
                            className="mb-6 text-gray-700 focus:outline-none"
                            onClick={() => {
                                const sidebar = document.getElementById('mobile-sidebar');
                                if (sidebar) sidebar.classList.add('hidden');
                            }}
                            aria-label="Close sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ul className="space-y-4 text-gray-700 font-semibold">
                            <li><NavLink to="/" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>HOME</NavLink></li>
                            <li><NavLink to="#" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>COLLECTION</NavLink></li>
                            <li><NavLink to="#" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>ABOUT</NavLink></li>
                            <li><NavLink to="#" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>CONTACT</NavLink></li>
                        </ul>
                    </div>
                </div>
                <div id="logo">
                    <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png" alt="logo" className='w-[140px] h-[140px]' />
                </div>
                <div id="menu" className='flex items-center'>
                    <ul className='sm:flex hidden justify-between items-center gap-4 text-gray-700 font-semibold'>
                        <li><NavLink to="/">HOME</NavLink></li>
                        <li><NavLink>COLLECTION</NavLink></li>
                        <li><NavLink>ABOUT</NavLink></li>
                        <li><NavLink>CONTACT</NavLink></li>
                    </ul>
                </div>
                <div className='flex justify-between gap-4'>
                    <div>
                        <Search />
                    </div>
                    {!user ? (
                        <div>
                            <Link to="/signup" className='cursor-pointer'><User /></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger>
                                <CircleUserRound className='cursor-pointer' />
                            </PopoverTrigger>
                            <PopoverContent className='w-80'>
                                <div className='flex gap-4 space-y-2'>
                                    <Avatar className='cursor-pointer'>
                                        <AvatarImage src={user?.avatar} alt='@shadcn' />
                                    </Avatar>
                                    <div>
                                        <h4 className='font-medium'>{user.name}</h4>
                                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col my-2 text-gray-600'>
                                    <div>
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <User2 />
                                            <Button variant='link'><Link>View Profile</Link></Button>
                                        </div>
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <Bookmark />
                                            <Button variant='link'><Link>Orders</Link></Button>
                                        </div>
                                    </div>
                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                        <LogOutIcon />
                                        <Button variant='link' onClick={logoutHandler} className='cursor-pointer'>Logout</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                    <div>
                        <ShoppingCart />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar