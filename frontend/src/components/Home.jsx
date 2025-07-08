import React from 'react'
import Navbar from './shared/Navbar'

function Home() {
    return (
        <div>
            <Navbar />
            <div id="heroSection" className='border border-gray-400 sm:mx-23 mx-3 flex flex-col sm:flex-row'>
                <div className='sm:w-1/2 w-full border-r-gray-400 flex flex-col justify-center items-center py-10 sm:py-0 '>
                    <div className='flex items-center gap-3'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                        <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                    </div>
                    <h1 style={{ fontFamily: 'Prata, serif' }}
                        className='text-3xl sm:py-3 lg:text-5xl leading-tight'>Chlothzy Arrivals</h1>
                    <div className='flex items-center gap-3'>
                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                        <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                    </div>
                </div>
                <div className='w-full sm:w-1/2' >
                    <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1751957413/hero_img-uMuzwHEB_z6omx6.png" alt="@chlothzy" className='w-full' />
                </div>
            </div>
            <div id="latest" className='sm:mx-23 mx-3 py-15 sm:py-20'>
                <div className='flex items-center justify-start sm:justify-center gap-3'>
                    <h1 className='text-3xl text-gray-500 font-semibold'>LATEST <span className='text-gray-800'>COLLECTIONS</span></h1>
                    <p className='w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[3px] '></p>
                </div>
                <p className='text-gray-800 text-center my-4 mx-6'>Chlothzy's latest collection is where elegance meets trand. Fashion that speaks your style.</p>

                <div></div>
            </div>
        </div>
    )
}

export default Home