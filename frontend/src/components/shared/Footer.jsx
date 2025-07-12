import { Instagram } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'

function Footer() {
    return (
        <div className='sm:flex flex-col md:mx-23 sm:mx-10 border-3 border-green -600'>
            <div className='sm:flex flex-row border-2 border-yellow-600'>
                <div id='1' className='w-full sm:w-1/2 row-span-1'>
                    <div>
                        <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png" alt="@Chlothzy" className='w-[150px] h-[150px] ml-2' />
                    </div>
                    <div>
                        <p className='text-gray-700 px-3 md:pr-50 text-sm'>Chlothzy Fashion brings bold elegance to your wardrobe. From bodycon dresses to chic essentials, we redefine style. Perfect fits, premium fabrics — confidence in every thread. Step into the spotlight with Chlothzy — where fashion speaks.</p>
                    </div>
                </div>

                <div id='2' className='py-8 sm:py-0  sm:w-1/2 sm:flex flex-row justify-between'>
                    <div id='2.1' className='px-4 md:pl-20'>
                        <h1 className='text-2xl font-bold sm:font-semibold mt-4 mb-4 sm:mt-auto sm:text-xl md:text-2xl '>COMPANY</h1>
                        <ul style={{ fontFamily: "Roboto, sans-serif" }} className='text-gray-500 mb-8 sm:text-sm md:text-base'>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink>About Us</NavLink></li>
                            <li><NavLink>Delivery</NavLink></li>
                            <li><NavLink>Privacy Policy</NavLink></li>
                        </ul>
                    </div>

                    <div id='2.2' className='sm:py-0 py-4'>
                        <div className='flex
                         flex-col items-center'>
                            <h1 className='text-2xl font-bold sm:font-semibold mb-5 sm:text-xl md:text-2xl '>GET IN TOUCH</h1>
                            <div className='flex flex-col items-center sm:text-sm md:text-base'>
                                <p className='text-gray-500'><span className='text-gray-700 font-bold'>Phone:</span>8505835814</p>
                                <p className='text-gray-500'><span className='text-gray-700 font-bold  items-center'>Email:</span>contact@chlothzy.shop</p>
                            </div>
                            <div className='flex flex-col justify-center items-center my-7'>
                                <h1 className='text-2xl font-bold sm:font-semibold'>Address:</h1>
                                <p className='text-gray-500'>Unit-113, Malabar Hill</p>
                                <p className='text-gray-500'>Maharashtra - 400006</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-8 sm:mx-23 mx-4 border-t-2 flex flex-col justify-center items-center'>
                <p className='text-center'>Copyright 2025@chlothzy.shop - All Rights Reserved.</p>
                <p className='font-bold'>Follow us on instagram for daily style inspo</p>
                <Instagram className='text-pink-600 mt-3 w-[32px] h-[32px]' />
            </div>
        </div>
    )
}

export default Footer