import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Skeleton } from './ui/skeleton'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import ProductCard from './ProductCard'
import useGetAllProducts from '@/hooks/useGetAllProducts'

function Collection() {
    useGetAllProducts();
    const { allProducts } = useSelector(store => store.product);
    const { loading } = useSelector(store => store.auth);
    const [searchParams] = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState(allProducts);
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const filtered = allProducts.filter((product) => {
                const nameMatch = product.name?.toLowerCase().includes(query);
                const descMatch = product.description?.toLowerCase().includes(query);
                const categoryMatch = product.category?.toLowerCase().includes(query);
                return nameMatch || descMatch || categoryMatch;
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(allProducts);
        }
    }, [searchQuery, allProducts]);

    return (
        <div>
            <Navbar/>
            <div className="min-h-screen py-8 px-3 sm:px-4 md:px-6">
                <div className="w-full">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <h1 className="sm:text-3xl text-2xl text-gray-500 font-bold sm:font-semibold">
                            {searchQuery ? 'SEARCH' : 'ALL'} <span className="text-gray-800">{searchQuery ? 'RESULTS' : 'COLLECTIONS'}</span>
                        </h1>
                        <p className="w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[3px]"></p>
                    </div>
                    
                    {searchQuery ? (
                        <p style={{ fontFamily: 'Prata, serif' }} className="text-gray-800 text-center my-6 mx-2">
                            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
                        </p>
                    ) : (
                        <p style={{ fontFamily: 'Prata, serif' }} className="text-gray-800 text-center my-6 mx-2">
                            Explore our complete collection. Fashion that speaks your style.
                        </p>
                    )}

                    {loading ? (
                        <div className="flex flex-col space-y-3 items-center">
                            <Skeleton className="h-[200px] w-full max-w-7xl rounded-xl bg-gray-300" />
                            <div className="space-y-5 mt-6 w-full max-w-7xl">
                                <Skeleton className="h-6 w-3/4 bg-gray-300" />
                                <Skeleton className="h-6 w-1/2 bg-gray-300" />
                                <Skeleton className="h-6 w-1/2 bg-gray-300" />
                            </div>
                        </div>
                    ) : filteredProducts && filteredProducts.length > 0 ? (
                        <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid-cols-2 gap-2 sm:gap-3">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchQuery ? `No products found matching "${searchQuery}"` : "No products available at the moment."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Collection