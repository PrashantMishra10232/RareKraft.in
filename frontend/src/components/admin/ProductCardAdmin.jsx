import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Pen } from 'lucide-react';

function ProductCardAdmin({ product }) {
    const navigate = useNavigate();
    const { allProducts } = useSelector(store => store.product);    

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
        return <div className='text-center py-4'>No products found.</div>;
    }


    return (
        <div className="rounded flex flex-col justify-center w-full">
            <div id='image' className='relative w-full max-h-55 overflow-hidden rounded'>
                <img src={product?.images[0]?.url} alt="@chlothzy" loading="lazy" className='z-5 object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110'/>
                <Button className="absolute z-10 right-0 top-0  rounded-bl-2xl rounded-br-none rounded-t-none border cursor-pointer"><Pen/></Button>
            </div>
            <div id='name' className='text-center truncate'>{product?.name}</div>
            <div id='price' className='font-semibold text-gray-700 text-center '>Rs.{product?.price}</div>
        </div>
    )
}

export default ProductCardAdmin;