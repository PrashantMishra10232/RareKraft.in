import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Button } from './ui/button'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { WISHLIST_API_ENDPOINT, CART_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import store from '@/redux/store'
import { removeWishlistItem } from '@/redux/wishlistSlice'
import { setCartItems } from '@/redux/cartSlice'
import useGetWishlist from '@/hooks/useGetWishlist'

function Wishlist() {
    const { user } = useSelector(store => store.auth)
    const { wishlistItems } = useSelector(store => store.wishlist)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [removingItem, setRemovingItem] = useState(null)
    const [addingToCart, setAddingToCart] = useState(null)

    useGetWishlist()

    useEffect(() => {
        if (!user) {
            toast.error("Please login to view your wishlist")
            navigate('/login')
            return
        }
    }, [user, navigate])

    const handleRemoveFromWishlist = async (productId) => {
        try {
            setRemovingItem(productId)
            const token = store.getState().auth.token
            const res = await axios.delete(
                `${WISHLIST_API_ENDPOINT}/remove/${productId}`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (res.data.success) {
                dispatch(removeWishlistItem(productId))
                toast.success("Removed from wishlist")
            }
        } catch (error) {
            console.error("Remove from wishlist error:", error)
            const errorMessage = error.response?.data?.message || "Failed to remove from wishlist"
            toast.error(errorMessage)
        } finally {
            setRemovingItem(null)
        }
    }

    const handleAddToCart = async (product) => {
        if (!user) {
            toast.error("Please login to add items to cart")
            navigate('/login')
            return
        }

        // Check if product has available sizes
        const availableSizes = product.sizes?.filter(size => size.quantity > 0) || []
        console.log("Available Sizes:", availableSizes)
        if (availableSizes.length === 0) {
            toast.error("This product is out of stock")
            return
        }

        // Use the first available size - ensure it's a string value
        const firstAvailableSize = availableSizes[0]
        const selectedSize = firstAvailableSize?.size

        // Validate that we have a valid size
        if (!selectedSize || !["S", "M", "L", "XL", "XXL"].includes(selectedSize)) {
            toast.error("Invalid size selected")
            return
        }

        // Validate product ID
        if (!product._id) {
            toast.error("Product ID is missing")
            return
        }

        try {
            setAddingToCart(product._id)
            const token = store.getState().auth.token
            const res = await axios.post(
                `${CART_API_ENDPOINT}/add`,
                {
                    productId: product._id,
                    size: selectedSize,
                    quantity: 1
                },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (res.data.success) {
                toast.success("Item added to cart!")
                // Update Redux cart state with the response data
                dispatch(setCartItems(res.data.data || []))
            }
        } catch (error) {
            console.error("Add to cart error:", error)
            const errorMessage = error.response?.data?.message || "Failed to add item to cart"
            toast.error(errorMessage)
        } finally {
            setAddingToCart(null)
        }
    }

    if (!user) {
        return null
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <h1 className="sm:text-3xl text-2xl text-gray-500 font-bold sm:font-semibold">
                            MY <span className="text-gray-800">WISHLIST</span>
                        </h1>
                        <p className="w-12 bg-[#414141] sm:w-15 h-[1px] sm:h-[3px]"></p>
                    </div>

                    {wishlistItems.length === 0 ? (
                        <div className="text-center py-16">
                            <Heart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-6">Add products you love to your wishlist</p>
                            <Button onClick={() => navigate('/collection')}>
                                Browse Products
                            </Button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {wishlistItems.map((item) => {
                                const product = item.product
                                if (!product) return null

                                const availableSizes = product.sizes?.filter(size => size.quantity > 0) || []
                                const isOutOfStock = availableSizes.length === 0

                                return (
                                    <div
                                        key={item._id || product._id}
                                        className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="relative">
                                            <img
                                                src={product.images?.[0]?.url}
                                                alt={product.name}
                                                className="w-full h-64 object-cover cursor-pointer"
                                                onClick={() => navigate(`/details/${product._id}`)}
                                            />
                                            <Button
                                                onClick={() => handleRemoveFromWishlist(product._id)}
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                disabled={removingItem === product._id}
                                            >
                                                {removingItem === product._id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <div className="p-4">
                                            <h3
                                                className="font-semibold text-lg text-gray-800 mb-2 cursor-pointer hover:text-gray-600"
                                                onClick={() => navigate(`/details/${product._id}`)}
                                            >
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <p className="font-bold text-lg text-gray-800 mb-4">
                                                Rs. {product.price}
                                            </p>
                                            <Button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={isOutOfStock || addingToCart === product._id}
                                                className="w-full"
                                                variant={isOutOfStock ? "outline" : "default"}
                                            >
                                                {addingToCart === product._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Adding...
                                                    </>
                                                ) : isOutOfStock ? (
                                                    "Out of Stock"
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                                        Add to Cart
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Wishlist

