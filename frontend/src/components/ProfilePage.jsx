import React from 'react'
import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux'
import { Bookmark, ChevronRight, MapPinned, PackageOpen, Smartphone, UserRoundPen, WalletCards } from 'lucide-react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

function ProfilePage() {
    const { user } = useSelector(store => store.auth)

    return (
        <div className='bg-gray-100'>
            <Navbar />
            <div className=' relative h-50'>
                <div className='absolute left-1/2 transform -translate-x-1/2 top-[30%] w-28 h-28 z-10'><img src={user?.avatar} alt="Avatar" className='object-cover h-full w-full' /></div>
                <div className='absolute bottom-0 z-0 h-14 bg-white w-full'></div>
            </div>

            <div className='bg-white my-2'>
                <div className='border-b-1 p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-3'>
                        <PackageOpen />
                        <div>
                            <h1 className='font-bold text-sm'>Orders</h1>
                            <p className='text-gray-600 text-xs'>Check your order status</p>
                        </div>
                    </div>
                    <ChevronRight className='text-gray-600' size={15} />
                </div>
                <div className='p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-3'>
                        <Bookmark />
                        <div>
                            <h1 className='font-bold text-sm'>Wishlist</h1>
                            <p className='text-gray-600 text-xs'>All your curated product collections</p>
                        </div>
                    </div>
                    <ChevronRight className='text-gray-600' size={15} />
                </div>
            </div>

            <div className='bg-white my-2'>
                <div className='border-b-1 p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-3'>
                        <WalletCards />
                        <div>
                            <h1 className='font-bold text-sm'>Saved Cards</h1>
                            <p className='text-gray-600 text-xs'>Save your cards for faster checkout</p>
                        </div>
                    </div>
                    <ChevronRight className='text-gray-600' size={15} />
                </div>
                <div className='border-b-1 p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center gap-3'>
                        <Smartphone />
                        <div>
                            <h1 className='font-bold text-sm'>Saved UPI</h1>
                            <p className='text-gray-600 text-xs'>View your saved UPI</p>
                        </div>
                    </div>
                    <ChevronRight className='text-gray-600' size={15} />
                </div>
                <Link to="/address">
                    <div className='p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50'>
                        <div className='flex items-center gap-3'>
                            <MapPinned />
                            <div>
                                <h1 className='font-bold text-sm'>Addresses</h1>
                                <p className='text-gray-600 text-xs'>Save address for a hassle-free checkout</p>
                            </div>
                        </div>
                        <ChevronRight className='text-gray-600' size={15} />
                    </div>
                </Link>
            </div>

            <div className='bg-white my-2'>
                <Link to='/profileDetails'>
                    <div className='p-2 flex justify-between items-center cursor-pointer hover:bg-gray-50'>
                        <div className='flex items-center gap-3'>
                            <UserRoundPen />
                            <div>
                                <h1 className='font-bold text-sm'>Profile Details</h1>
                                <p className='text-gray-600 text-xs'>Change your profile details</p>
                            </div>
                        </div>
                        <ChevronRight className='text-gray-600' size={15} />
                    </div>
                </Link>
            </div>

            <div className='bg-white px-12 py-2'>
                <p className='text-xs text-gray-700 font-semibold my-4 cursor-pointer'>FAQs</p>
                <p className='text-xs text-gray-700 font-semibold my-4 cursor-pointer'>ABOUT US</p>
                <p className='text-xs text-gray-700 font-semibold my-4 cursor-pointer'>TERM OF USE</p>
                <p className='text-xs text-gray-700 font-semibold my-4 cursor-pointer'>CUSTOMER POLICIES</p>
                <p className='text-xs text-gray-700 font-semibold my-4 cursor-pointer'>USEFUL LINKS</p>
            </div>

            <div className='px-2 pt-6'>
                <Button className="bg-red-500 font-bold text-sm w-full rounded cursor-pointer">LOGOUT</Button>
            </div>

        </div>
    )
}

export default ProfilePage