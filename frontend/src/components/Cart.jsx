import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Button } from './ui/button'
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { CART_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Skeleton } from './ui/skeleton'
import store from '@/redux/store'
import { setCartItems } from '@/redux/cartSlice'

function Cart() {
    const { user } = useSelector(store => store.auth)
    const { cartItems: reduxCartItems } = useSelector(store => store.cart)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [cartItems, setCartItems] = useState([])
    const [fetchingCart, setFetchingCart] = useState(true)
    const [updatingItem, setUpdatingItem] = useState(null)

    useEffect(() => {
        if (!user) {
            toast.error("Please login to view your cart")
            navigate('/login')
            return
        }
        // Use Redux cart items if available (useGetCart hook in Navbar already fetches)
        if (reduxCartItems !== undefined && Array.isArray(reduxCartItems)) {
            setCartItems(reduxCartItems)
            setFetchingCart(false)
        } else {
            // Only fetch if Redux doesn't have cart data yet
            fetchCart()
        }
    }, [user, navigate])

    // Separate effect to sync with Redux cart updates (prevents stuttering)
    useEffect(() => {
        if (reduxCartItems !== undefined && Array.isArray(reduxCartItems)) {
            setCartItems(reduxCartItems)
        }
    }, [reduxCartItems])

    const fetchCart = async () => {
        try {
            setFetchingCart(true)
            const token = store.getState().auth.token
            const res = await axios.get(
                `${CART_API_ENDPOINT}`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (res.data.success) {
                const cartData = res.data.data || [];
                setCartItems(cartData);
                dispatch(setCartItems(cartData)); // Update Redux
            } else {
                // If response is not successful but no error thrown
                setCartItems([]);
                dispatch(setCartItems([]));
            }
        } catch (error) {
            console.error("Fetch cart error:", error)
            // Only show error toast for actual server errors (not 401, not 404)
            if (error.response?.status && error.response.status !== 401 && error.response.status !== 404) {
                const errorMessage = error.response?.data?.message || "Failed to fetch cart"
                toast.error(errorMessage)
            }
            // Set empty cart on error
            setCartItems([]);
            dispatch(setCartItems([]));
        } finally {
            setFetchingCart(false)
        }
    }

    const handleRemoveItem = async (productId, size) => {
        try {
            setUpdatingItem(`${productId}-${size}`)
            const token = store.getState().auth.token
            const res = await axios.delete(
                `${CART_API_ENDPOINT}/remove`,
                {
                    data: { productId, size },
                    withCredentials: true,
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (res.data.success) {
                const cartData = res.data.data || [];
                setCartItems(cartData);
                dispatch(setCartItems(cartData)); // Update Redux
                toast.success("Item removed from cart")
            }
        } catch (error) {
            console.error("Remove item error:", error)
            const errorMessage = error.response?.data?.message || "Failed to remove item"
            toast.error(errorMessage)
        } finally {
            setUpdatingItem(null)
        }
    }

    const handleUpdateQuantity = async (productId, size, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(productId, size)
            return
        }

        try {
            setUpdatingItem(`${productId}-${size}`)
            const token = store.getState().auth.token
            const res = await axios.put(
                `${CART_API_ENDPOINT}/update`,
                {
                    productId,
                    size,
                    quantity: newQuantity
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
                const cartData = res.data.data || [];
                setCartItems(cartData);
                dispatch(setCartItems(cartData)); // Update Redux
            }
        } catch (error) {
            console.error("Update quantity error:", error)
            const errorMessage = error.response?.data?.message || "Failed to update quantity"
            toast.error(errorMessage)
        } finally {
            setUpdatingItem(null)
        }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * (item.quantity || 0)
    }, 0)

    const shippingPrice = subtotal > 0 ? 50 : 0 // Example shipping price
    const total = subtotal + shippingPrice

    if (fetchingCart) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen py-8 px-4">
                    <div className="max-w-5xl mx-auto">
                        <Skeleton className="h-12 w-64 mb-6" />
                        <Skeleton className="h-64 w-full mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    <Button
                        onClick={() => navigate('/collection')}
                        variant="outline"
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Collection
                    </Button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-6">Add some products to your cart</p>
                            <Button onClick={() => navigate('/collection')}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="md:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={`${item.product?._id}-${item.size}`}
                                        className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0]?.url}
                                                alt={item.product?.name}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                Size: <span className="font-medium">{item.size}</span>
                                            </p>
                                            <p className="text-lg font-bold text-gray-800 mb-4">
                                                Rs. {item.product?.price}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 border rounded">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleUpdateQuantity(
                                                            item.product?._id,
                                                            item.size,
                                                            (item.quantity || 1) - 1
                                                        )}
                                                        disabled={updatingItem === `${item.product?._id}-${item.size}`}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="px-4 py-1 min-w-[3rem] text-center">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleUpdateQuantity(
                                                            item.product?._id,
                                                            item.size,
                                                            (item.quantity || 1) + 1
                                                        )}
                                                        disabled={updatingItem === `${item.product?._id}-${item.size}`}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Remove Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(item.product?._id, item.size)}
                                                    disabled={updatingItem === `${item.product?._id}-${item.size}`}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="md:col-span-1">
                                <div className="bg-white border rounded-lg p-6 sticky top-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                                    
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>Rs. {subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>Rs. {shippingPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                                            <span>Total</span>
                                            <span>Rs. {total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full bg-black text-white hover:bg-gray-800"
                                        disabled={cartItems.length === 0}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Cart

