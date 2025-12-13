import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Pen, Trash2 } from 'lucide-react';

function ProductCardAdmin({ product, onDelete }) {
    const navigate = useNavigate();
    const { allProducts } = useSelector(store => store.product);    

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
        return <div className='text-center py-4'>No products found.</div>;
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`)) {
            onDelete(product._id);
        }
    };

    return (
        <div className="rounded flex flex-col justify-center w-full">
            <div id='image' className='relative w-full max-h-55 overflow-hidden rounded'>
                <img src={product?.images[0]?.url} alt="@chlothzy" loading="lazy" className='z-5 object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110'/>
                <Button 
                    onClick={handleDelete}
                    variant="destructive"
                    className="absolute z-10 left-0 top-0 rounded-br-2xl rounded-tl-none rounded-tr-none rounded-bl-none border cursor-pointer"
                    size="sm"
                >
                    <Trash2 className="h-4 w-4"/>
                </Button>
                <Button 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/product/edit/${product._id}`);
                    }}
                    className="absolute z-10 right-0 top-0 rounded-bl-2xl rounded-br-none rounded-t-none border cursor-pointer"
                    size="sm"
                >
                    <Pen className="h-4 w-4"/>
                </Button>
            </div>
            <div id='name' className='text-center truncate'>{product?.name}</div>
            <div id='price' className='font-semibold text-gray-700 text-center '>Rs.{product?.price}</div>
        </div>
    )
}

export default ProductCardAdmin;