import React from 'react'
// import { Skeleton } from './ui/skeleton'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Button } from './ui/button'


function About() {
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center gap-3 border-t-1 sm:mx-10 md:mx-23 mx-3 py-4'>
                <h1 className='text-2xl text-gray-500 font-semibold'>ABOUT <span className='text-gray-800'>US</span></h1>
                <p className='w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[2px] '></p>
            </div>

            <div className="py-10 px-4 md:px-35 sm:px-10 md:flex gap-20">
                <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1752383387/about_img-CnrQFd3s_1_eebd83.png" alt="@Chlothzy" 
                className='md:w-120'/>
                <div className='flex flex-col gap-8 text-gray-700 my-18'>
                    <p><strong>Chlothzy</strong> is your go-to destination for premium fashion that speaks elegance, confidence, and modern style. We believe in celebrating every body type through bold and beautiful silhouettes—especially our signature <strong>bodycon dresses</strong> designed to turn heads.</p>
                    <p>Our curated collections reflect the latest trends while maintaining timeless quality. Whether you're dressing up for a party or owning your everyday look, <strong>Chlothzy</strong> ensures you're always fashion-forward with comfort and flair.</p>
                    <h3 className='text-black font-bold'>Our Mission</h3>
                    <p>At <strong>Chlothzy</strong>, our mission is to empower individuals through style. We aim to offer easy access to high-quality, trendsetting apparel that makes you feel confident in your own skin—especially with our standout bodycon range.</p>
                </div>
            </div>

            <div className='sm:mx-10 md:mx-23 mx-3'>
                <div className='flex items-center justify-start gap-3 border-t-1  py-4'>
                    <h1 className='text-xl text-gray-500 font-semibold'>WHY <span className='text-gray-800'>CHOOSE US</span></h1>
                    <p className='w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[2px] '></p>
                </div>
                <div className='border md:flex'>
                    <div className='px-8 py-16 flex flex-col gap-4 border-b-2 md:border-b-0 md:border-r-2'>
                        <h3 className='font-bold'>Flattering Fits:</h3>
                        <p className='text-sm text-gray-700'>Our bodycon dresses are crafted to enhance every curve with premium stretchable fabrics.</p>
                    </div>
                    <div className='px-8 py-16 flex flex-col gap-4 border-b-2 md:border-b-0 md:border-r-2'>
                        <h3 className='font-bold'>Effortless Shopping:</h3>
                        <p className='text-sm text-gray-700'>Browse, choose, and flaunt – our site makes fashion accessible and seamless to shop.</p>
                    </div>
                    <div className='px-8 py-16 flex flex-col gap-4'>
                        <h3 className='font-bold'>Fashion that Empowers:</h3>
                        <p className='text-sm text-gray-700'>At Chlothzy, we’re all about bold confidence—each dress is designed to make a statement.</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-3 p-2 my-25'>
                <p className='font-bold text-sm'>Join the Chlothzy Style Community</p>
                <h2 className='font-bold text-2xl sm:text-3xl'>Subscribe now & get 20% off</h2>
                <h3 className='font-semibold text-base text-center'>Chlothzy Fashion – Where Style Meets Confidence.</h3>
                <div className='h-12 sm:w-[50%] w-full'>
                    <input type="text" name="subscribe" id="subscribe" placeholder='Enter your Email' className='border-2 p-2 h-full focus:outline-none w-[70%]' />
                    <Button className='h-full w-[30%] rounded-none'>SUBSCRIBE</Button>
                </div>

            </div>

            <Footer />
        </div>
    )
}

export default About