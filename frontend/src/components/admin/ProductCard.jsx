import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const navigate = useNavigate();
    const { allProducts } = useSelector(store => store.product);    

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
        return <div className='text-center py-4'>No products found.</div>;
    }


    return (
        <div key={product.id} onClick={()=>navigate(`/details/${product._id}`)} className="rounded flex flex-col justify-center w-full cursor-pointer">
            <div id='image' className='relative w-full max-h-65 overflow-hidden rounded'>
                <img src={product?.images[0]?.url} alt="@chlothzy" loading="lazy" className='object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110'/>
            </div>
            <div id='name' className='text-center truncate'>{product?.name}</div>
            <div id='price' className='font-semibold text-gray-700 text-center '>Rs.{product?.price}</div>
        </div>
    )
}

export default ProductCard