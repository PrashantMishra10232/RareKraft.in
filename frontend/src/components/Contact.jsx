import React from 'react'
import { Skeleton } from './ui/skeleton'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Button } from './ui/button'
import { Input } from './ui/input'

function Contact() {
  return (
        <div>
            <Navbar/>
            <div className='flex items-center justify-center gap-3 border-t-1 sm:mx-10 md:mx-23 mx-3 py-4'>
                <h1 className='text-2xl text-gray-500 font-semibold'>CONTACT <span className='text-gray-800'>US</span></h1>
                <p className='w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[2px] '></p>
            </div>

            <div className="py-10 px-4 md:px-35 sm:px-10 md:flex gap-20">
                <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1752386980/pexels-karolina-grabowska-7680151_1_d2tf0n.jpg" alt="@Chlothzy" 
                className='md:w-120'/>
                <div className='py-12 w-full'>
                    <h1 className='font-bold text-gray-700 text-2xl'>Get in Touch</h1>
                    <form onSubmit={(e)=>e.preventDefault()} className='my-8'>
                        <Input
                        name="name"
                        type="text"
                        placeholder="Your Name"
                        className="border-2 h-12 rounded-none my-5"
                        />
                        <Input
                        name="email"
                        type="text"
                        placeholder="Your Email"
                        className="border-2 h-12 rounded-none my-5"
                        />
                        <textarea name="message" id="message"
                        placeholder='Your Message'
                        className='w-full border-2 h-40 p-3'
                        />
                        <Button
                        className="w-full my-4 h-12 rounded-none"
                        >Submit</Button>
                    </form>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-3 p-2 my-15'>
                <p className='font-bold text-sm'>Join the Chlothzy Style Community</p>
                <h2 className='font-bold text-2xl sm:text-3xl'>Subscribe now & get 20% off</h2>
                <h3 className='font-semibold text-base text-center'>Chlothzy Fashion – Where Style Meets Confidence.</h3>
                <div className='h-12 sm:w-[50%] w-full'>
                    <input type="text" name="subscribe" id="subscribe" placeholder='Enter your Email' className='border-2 p-2 h-full focus:outline-none w-[70%]' />
                    <Button className='h-full w-[30%] rounded-none'>SUBSCRIBE</Button>
                </div>

            </div>
            <Footer/>
        </div>
    )
}

export default Contact