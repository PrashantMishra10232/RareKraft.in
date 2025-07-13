import React from 'react'
import { Skeleton } from './ui/skeleton'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'

function Collection() {
    return (
        <div>
            <Navbar/>
            <div className="flex flex-col space-y-3 items-center h-120">
                <Skeleton className="h-[200px] w-full max-w-7xl rounded-xl bg-gray-300" />
                <div className="space-y-5 mt-6 w-full max-w-7xl">
                    <Skeleton className="h-6 w-3/4 bg-gray-300" />
                    <Skeleton className="h-6 w-1/2 bg-gray-300" />
                    <Skeleton className="h-6 w-1/2 bg-gray-300" />
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Collection