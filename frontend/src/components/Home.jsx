import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import ProductCard from './admin/ProductCard';
import { Button } from './ui/button';

function Home() {
    const { allProducts } = useSelector(store => store.product);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            if (user.role === "Seller") {
                navigate("/admin/dashboard")
            }
        }
    }, [user, navigate])

    return (
        <div>
            <Navbar />
            <div id="heroSection" className='border border-gray-400 md:mx-23 sm:mx-10 mx-3 flex flex-col sm:flex-row'>
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

            <div id="latest" className='sm:mx-10 md:mx-23 mx-3 py-15 sm:py-20 '>
                <div className='flex items-center justify-start sm:justify-center gap-3'>
                    <h1 className='sm:text-3xl text-[1.7rem] text-gray-500 font-bold sm:font-semibold'>LATEST <span className='text-gray-800'>COLLECTIONS</span></h1>
                    <p className='w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[3px] '></p>
                </div>
                <p style={{ fontFamily: 'Prata, serif' }} className='text-gray-800 text-center my-4 mx-6'>Chlothzy's latest collection is where elegance meets trand. Fashion that speaks your style.</p>
                <div className='grid sm:grid-cols-3 md:grid-cols-5 grid-cols-2 gap-2'>
                    {allProducts.length <= 0 ? <span>No Products to show</span> : allProducts.slice(0, 10).map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>

            <div id="Best" className='sm:mx-10 md:mx-23 mx-3'>
                <div className='flex items-center justify-center sm:justify-center gap-1'>
                    <h1 className='sm:text-3xl text-[1.7rem] text-gray-500 font-bold sm:font-semibold'>BEST <span className='text-gray-800'>SELLERS</span></h1>
                    <p className='w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[3px] '></p>
                </div>
                <p style={{ fontFamily: 'Prata, serif' }} className='text-gray-800 text-center my-4 mx-6'>Our best seller — loved by many, styled by all. Elevate your look with timeless charm.</p>
                <div className='grid sm:grid-cols-3 md:grid-cols-5 grid-cols-2 gap-2'>
                    {allProducts.length <= 0 ? <span>No Products to show</span> : allProducts.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>

            <div id="last" className='sm:mx-10 md:mx-23 mx-3 py-25'>
                <div className='flex sm:flex-row flex-col gap-8 sm:justify-between md:justify-around mb-22'>
                    <div className='flex flex-col justify-center items-center gap-1'>
                        <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1752330498/Fnnr49DH8Aq037jw159tbGxsbGxsbFj4C7XOZoyRzeTiAAAAAElFTkSuQmCC_knnr3n.png" alt="@Chlothzy" loading="lazy" className='sm:w-12 sm:h-12 w-10 h-10'/>
                        <h1 className='font-bold text-sm md:text-lg'>Easy Exchange Policy</h1>
                        <p className='text-gray-700 text-xs md:text-base'>We offer hassle free exchange policy</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-1'>
                        <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1752330497/euNCWTo7J5P4HjGzy6NWNlJwAAAAASUVORK5CYII_ru8pbj.png" alt="@Chlothzy" loading="lazy" className='sm:w-12 sm:h-12 w-10 h-10'/>
                        <h1 className='font-bold text-sm md:text-lg'>7 Days Return Policy</h1>
                        <p className='text-gray-700 text-xs md:text-base'>We provide 7 days free return policy</p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-1'>
                        <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1752330498/jzse2YAAAAASUVORK5CYII_wmbxvo.png" alt="@Chlothzy" loading="lazy" className='w-sm:12 h-sm:12 w-10 h-10'/>
                        <h1 className='font-bold text-sm md:text-lg'>Best Customer Support</h1>
                        <p className='text-gray-700 text-xs md:text-base'>we provide 24/7 customer support</p>
                    </div>
                </div>

                <div className='flex flex-col items-center justify-center gap-3 p-2'>
                    <p className='font-bold text-sm'>Join the Chlothzy Style Community</p>
                    <h2 className='font-bold text-2xl sm:text-3xl'>Subscribe now & get 20% off</h2>
                    <h3 className='font-semibold text-base text-center'>Chlothzy Fashion – Where Style Meets Confidence.</h3>
                    <div className='h-12 sm:w-[50%] w-full'>
                        <input type="text" name="subscribe" id="subscribe" placeholder='Enter your Email' className='border-2 p-2 h-full focus:outline-none w-[70%]'/>
                        <Button className='h-full w-[30%] rounded-none'>SUBSCRIBE</Button>
                    </div>
                    
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Home