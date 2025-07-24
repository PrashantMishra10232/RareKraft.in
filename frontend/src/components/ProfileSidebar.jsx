import React from 'react'
import { Separator } from './ui/separator';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router';


function ProfileSidebar() {
    const { user } = useSelector(store => store.auth);
    return (
        <div className="sm:flex flex-col hidden w-1/4 pl-4 mb-10">
            <div className='border-b'>
                <h2 className="font-bold text-lg mb-1">Account</h2>
                <p className="text-sm text-gray-600 mb-6">{user.name}</p>
            </div>


            <div className="space-y-2 border-r px-2">
                <div className="font-semibold text-sm text-gray-800 my-2 py-4 cursor-pointer"><Link to='/profilePage'>Overview</Link></div>
                <Separator />

                <div className="my-2 py-4 ">
                    <h3 className="text-xs text-gray-500 mb-2">ORDERS</h3>
                    <div className="hover:text-black cursor-pointer">
                        <NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">Orders & Returns</NavLink>
                    </div>
                </div>
                <Separator />

                <div className="my-2 py-4 ">
                    <h3 className="text-xs text-gray-500 mb-2">CREDITS</h3>
                    <div className="space-y-1">
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">Coupons</NavLink></div>
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">Chlothzy Credit</NavLink></div>
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">ChlothzyCash</NavLink></div>
                    </div>
                </div>
                <Separator />

                <div className="my-2 py-4 ">
                    <h3 className="text-xs text-gray-500 mb-2">ACCOUNT</h3>
                    <div className="space-y-1">
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profileDetails">Profile</NavLink></div>
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 font-semibold text-sm"} to="/profilePage">Saved Cards</NavLink></div>
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">Saved UPI</NavLink></div>
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/address">Addresses</NavLink></div>
                        <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">Delete Account</NavLink></div>
                    </div>
                </div>
                <Separator />

                <div className="my-2 py-4 ">
                    <h3 className="text-xs text-gray-500 mb-2">LEGAL</h3>
                    <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">Terms of Use</NavLink></div>
                    <div className="hover:text-black cursor-pointer"><NavLink className={({ isActive }) => isActive ? "decoration-2 text-green-600 text-sm font-bold" : "text-gray-800 text-sm font-semibold"} to="/profilePage">Privacy Policy</NavLink></div>
                </div>
            </div>
        </div>

    )
}

export default ProfileSidebar