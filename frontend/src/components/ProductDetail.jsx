import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { setProduct } from '@/redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Product_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import Footer from './shared/Footer';
import Navbar from './shared/Navbar';
import { Skeleton } from './ui/skeleton';
import axiosInstance from '@/utils/axiosInstance';
import ProductCard from './admin/ProductCard';

function ProductDetail() {
    const { product,allProducts } = useSelector(store => store.product)
    const { loading } = useSelector(store => store.auth)
    const [activeTab, setActiveTab] = useState("description");
    const params = useParams();
    const dispatch = useDispatch();
    const productId = params.id;    

    //fetch the product
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                dispatch(setLoading(true));
                const res = await axiosInstance.get(`${Product_API_ENDPOINT}/details/${productId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setProduct(res.data.data));
                    console.log("Product deatils:", res.data.data);
                    toast.success(res.data.message);
                }
            } catch (error) {
                console.error("Axios error:", error);
                const erroeMessage = error.response?.data?.message || "Something went wrong"
                toast.error(erroeMessage);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchProductDetails();

    }, [productId, dispatch])

    if (loading || !product) {
        return <div className="flex flex-col space-y-3 items-center h-120">
            <Skeleton className="h-[200px] w-full max-w-7xl rounded-xl bg-gray-300" />
            <div className="space-y-5 mt-6 w-full max-w-7xl">
                <Skeleton className="h-6 w-3/4 bg-gray-300" />
                <Skeleton className="h-6 w-1/2 bg-gray-300" />
                <Skeleton className="h-6 w-1/2 bg-gray-300" />
            </div>
        </div>
    }


    return (
        <div>
            <Navbar />
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 px-4 py-8 max-w-7xl mx-auto">
                {product?.images?.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
                    <div className="flex md:flex-col gap-2 md:w-[100px]">
                        <img
                            src={product?.images[0]?.url || "https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png"}
                            alt="Thumbnail Front"
                            className="w-20 h-24 object-cover border rounded cursor-pointer"
                        />
                        <img
                            src={product?.images[0]?.url || "https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png"}
                            alt="Thumbnail Back"
                            className="w-20 h-24 object-cover border rounded cursor-pointer"
                        />
                    </div>

                    <div className="flex-1">
                        <img
                            src={product?.images[0]?.url || "https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png"}
                            alt="Noir Nights Mini Bodycon"
                            className="w-full h-auto object-cover rounded"
                        />
                    </div>
                </div>
                )}
                

                <div className="flex-1 space-y-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                        {product.name}
                    </h1>

                    <div className="flex items-center space-x-2">
                        <span className="text-red-500 text-lg">★★★★☆</span>
                        <span className="text-gray-500 text-sm">(122)</span>
                    </div>


                    <div className="text-2xl font-bold text-gray-800">RS. {product.price}</div>

                    <p className="text-gray-600">{product.description}</p>

                    <div>
                        <span className="text-gray-700 font-medium">Select Size</span>
                        <div className="flex gap-2 mt-2">
                            {["S", "M", "L", "XL", "XXL"].map((size) => (
                                <button
                                    key={size}
                                    className="border px-4 py-2 rounded hover:bg-gray-100 active:bg-gray-200"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="mt-4 bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 transition">
                        ADD TO CART
                    </button>

                    <div className="text-sm text-gray-600 pt-4 space-y-1">
                        <p> 100% Original product.</p>
                        <p> Cash on delivery available on this product.</p>
                        <p> Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="flex border-b border-gray-300">
                    <button
                        type="button"
                        onClick={() => setActiveTab("description")}
                        className={`px-4 py-2 text-sm md:text-base font-medium border-b-2 transition ${activeTab === "description"
                            ? "border-gray-800 text-gray-800"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Description
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("reviews")}
                        className={`px-4 py-2 text-sm md:text-base font-medium border-b-2 transition ${activeTab === "reviews"
                            ? "border-gray-800 text-gray-800"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Reviews (122)
                    </button>
                </div>

                <div className="mt-4 p-4 border rounded bg-white text-gray-700 space-y-3">
                    {activeTab === "description" && (
                        <>
                            <p>
                                An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet…
                            </p>
                            <p>
                                E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations…
                            </p>
                        </>
                    )}

                    {activeTab === "reviews" && (
                        <>
                            <p className="font-semibold">Customer Reviews</p>
                            <p>
                                “Beautiful dress, fits perfectly and great quality!” — Priya S.
                            </p>
                            <p>
                                “Absolutely stunning piece. Loved the material.” — Radhika M.
                            </p>
                        </>
                    )}
                </div>
            </div>


            {/* //related products */}
            <div className="px-4 py-10 max-w-7xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="h-[2px] w-8 bg-gray-400"></span>
                    <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800">
                        RELATED <span className="font-bold text-gray-900">PRODUCTS</span>
                    </h2>
                    <span className="h-[2px] w-8 bg-gray-400"></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {allProducts.slice(0,5).map((product)=>(
                        <ProductCard key={product._id} product={product}/>
                    ))}
                </div>
            </div>

            <Footer />
        </div>


    )
}

export default ProductDetail