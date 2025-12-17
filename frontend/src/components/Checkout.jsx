import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ArrowLeft, MapPin, Plus, Loader2 } from 'lucide-react'
import axios from 'axios'
import { ORDER_API_ENDPOINT, PAYMENT_API_ENDPOINT, USER_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Skeleton } from './ui/skeleton'
import store from '@/redux/store'
import { setCartItems as setReduxCartItems } from '@/redux/cartSlice'
import axiosInstance from '@/utils/axiosInstance'

function Checkout() {
    const { user, loading } = useSelector(store => store.auth)
    const { cartItems: reduxCartItems } = useSelector(store => store.cart)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [cartItems, setCartItems] = useState([])
    const [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [showAddAddress, setShowAddAddress] = useState(false)
    const [processingPayment, setProcessingPayment] = useState(false)
    const [loadingAddresses, setLoadingAddresses] = useState(true)
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)

    // New address form state
    const [newAddress, setNewAddress] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pinCode: '',
        phoneNo: '',
        typeOfAddress: 'Home',
        isDefault: false
    })

    useEffect(() => {
        if (!user) {
            toast.error("Please login to checkout")
            navigate('/login')
            return
        }

        if (!reduxCartItems || reduxCartItems.length === 0) {
            toast.error("Your cart is empty")
            navigate('/cart')
            return
        }

        setCartItems(reduxCartItems)
        fetchAddresses()
        loadRazorpay()
    }, [user, navigate, reduxCartItems])

    const loadRazorpay = () => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => setRazorpayLoaded(true)
        script.onerror = () => {
            toast.error("Failed to load Razorpay")
            setRazorpayLoaded(false)
        }
        document.body.appendChild(script)
    }

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true)
            const res = await axiosInstance.get(`${USER_API_ENDPOINT}/me`, {
                withCredentials: true
            })
            if (res.data.success) {
                const userAddresses = res.data.data?.shippingAddresses || []
                setAddresses(userAddresses)
                // Select default address if available
                const defaultAddress = userAddresses.find(addr => addr.isDefault)
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress)
                } else if (userAddresses.length > 0) {
                    setSelectedAddress(userAddresses[0])
                }
            }
        } catch (error) {
            console.error("Fetch addresses error:", error)
        } finally {
            setLoadingAddresses(false)
        }
    }

    const handleAddAddress = async (e) => {
        e.preventDefault()
        try {
            const res = await axiosInstance.post(
                `${USER_API_ENDPOINT}/addAddress`,
                newAddress,
                { withCredentials: true }
            )
            if (res.data.success) {
                toast.success("Address added successfully")
                setShowAddAddress(false)
                setNewAddress({
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    country: 'India',
                    pinCode: '',
                    phoneNo: '',
                    typeOfAddress: 'Home',
                    isDefault: false
                })
                fetchAddresses()
            }
        } catch (error) {
            console.error("Add address error:", error)
            const errorMessage = error.response?.data?.message || "Failed to add address"
            toast.error(errorMessage)
        }
    }

    const handleProceedToPayment = async () => {
        if (!selectedAddress) {
            toast.error("Please select or add a shipping address")
            return
        }

        if (!razorpayLoaded) {
            toast.error("Payment gateway is loading, please wait")
            return
        }

        try {
            setProcessingPayment(true)

            // Prepare order items from cart
            const orderItems = cartItems.map(item => ({
                name: item.product?.name,
                price: item.product?.price,
                quantity: item.quantity,
                image: item.product?.images?.[0]?.url,
                product: item.product?._id
            }))

            // Calculate prices
            const itemsPrice = cartItems.reduce((sum, item) => 
                sum + (item.product?.price || 0) * (item.quantity || 0), 0
            )
            const shippingPrice = itemsPrice > 0 ? 50 : 0
            const totalPrice = itemsPrice + shippingPrice

            // Prepare shipping info
            const shippingInfo = {
                address: selectedAddress.address,
                city: selectedAddress.city,
                state: selectedAddress.state,
                country: selectedAddress.country,
                pinCode: Number(selectedAddress.pinCode),
                phoneNo: Number(selectedAddress.phoneNo)
            }

            // Create order
            const orderRes = await axios.post(
                `${ORDER_API_ENDPOINT}/new`,
                {
                    shippingInfo,
                    orderItems,
                    itemsPrice,
                    shippingPrice,
                    totalPrice
                },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': store.getState().auth.token ? `Bearer ${store.getState().auth.token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (!orderRes.data.success) {
                throw new Error("Failed to create order")
            }

            const order = orderRes.data.data

            // Get Razorpay API key
            const apiKeyRes = await axios.post(
                `${PAYMENT_API_ENDPOINT}/sendingRazorpayAPiKey`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': store.getState().auth.token ? `Bearer ${store.getState().auth.token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (!apiKeyRes.data.success) {
                throw new Error("Failed to get payment gateway key")
            }

            const razorpayApiKey = apiKeyRes.data.data.razorpayApiKey

            // Create Razorpay order
            const paymentRes = await axios.post(
                `${PAYMENT_API_ENDPOINT}/processPayment`,
                { orderId: order._id },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': store.getState().auth.token ? `Bearer ${store.getState().auth.token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (!paymentRes.data.success) {
                throw new Error("Failed to initialize payment")
            }

            const razorpayOrder = paymentRes.data.data

            // Initialize Razorpay checkout
            const options = {
                key: razorpayApiKey,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "RareKraft",
                description: `Order #${order._id}`,
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyRes = await axios.post(
                            `${PAYMENT_API_ENDPOINT}/verifyPayment`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    'Authorization': store.getState().auth.token ? `Bearer ${store.getState().auth.token}` : '',
                                    'Content-Type': 'application/json'
                                }
                            }
                        )

                        if (verifyRes.data.success) {
                            // Update order payment info
                            await axios.put(
                                `${ORDER_API_ENDPOINT}/admin/paymentInfo`,
                                {
                                    orderId: order._id,
                                    paymentId: response.razorpay_payment_id,
                                    status: 'success'
                                },
                                {
                                    withCredentials: true,
                                    headers: {
                                        'Authorization': store.getState().auth.token ? `Bearer ${store.getState().auth.token}` : '',
                                        'Content-Type': 'application/json'
                                    }
                                }
                            )

                            // Clear cart
                            dispatch(setReduxCartItems([]))
                            
                            toast.success("Payment successful! Order placed.")
                            navigate('/collection')
                        } else {
                            toast.error("Payment verification failed")
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error)
                        toast.error("Payment verification failed")
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: selectedAddress.phoneNo
                },
                theme: {
                    color: "#000000"
                },
                modal: {
                    ondismiss: function() {
                        toast.info("Payment cancelled")
                        setProcessingPayment(false)
                    }
                }
            }

            const RazorpayClass = globalThis.Razorpay || window.Razorpay
            const razorpayInstance = new RazorpayClass(options)
            razorpayInstance.on('payment.failed', function (response) {
                toast.error(`Payment failed: ${response.error.description}`)
                setProcessingPayment(false)
            })
            razorpayInstance.open()
            setProcessingPayment(false)

        } catch (error) {
            console.error("Payment processing error:", error)
            const errorMessage = error.response?.data?.message || "Failed to process payment"
            toast.error(errorMessage)
            setProcessingPayment(false)
        }
    }

    // Calculate totals
    const itemsPrice = cartItems.reduce((sum, item) => 
        sum + (item.product?.price || 0) * (item.quantity || 0), 0
    )
    const shippingPrice = itemsPrice > 0 ? 50 : 0
    const totalPrice = itemsPrice + shippingPrice

    if (loading || loadingAddresses) {
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
                        onClick={() => navigate('/cart')}
                        variant="outline"
                        className="mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                    </Button>

                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Shipping Address */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Address
                                    </h2>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowAddAddress(!showAddAddress)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New
                                    </Button>
                                </div>

                                {showAddAddress && (
                                    <form onSubmit={handleAddAddress} className="mb-4 p-4 border rounded-lg space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>Name</Label>
                                                <Input
                                                    value={newAddress.name}
                                                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Phone</Label>
                                                <Input
                                                    type="tel"
                                                    value={newAddress.phoneNo}
                                                    onChange={(e) => setNewAddress({...newAddress, phoneNo: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Address</Label>
                                            <Input
                                                value={newAddress.address}
                                                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>City</Label>
                                                <Input
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>State</Label>
                                                <Input
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>Pincode</Label>
                                                <Input
                                                    value={newAddress.pinCode}
                                                    onChange={(e) => setNewAddress({...newAddress, pinCode: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Country</Label>
                                                <Input
                                                    value={newAddress.country}
                                                    onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm">Add Address</Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddAddress(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-2">
                                    {addresses.length === 0 ? (
                                        <p className="text-gray-500">No addresses found. Please add one.</p>
                                    ) : (
                                        addresses.map((address) => (
                                            <div
                                                key={address._id}
                                                onClick={() => setSelectedAddress(address)}
                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                    selectedAddress?._id === address._id
                                                        ? 'border-black bg-gray-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-semibold">{address.name}</p>
                                                        <p className="text-sm text-gray-600">{address.address}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {address.city}, {address.state} - {address.pinCode}
                                                        </p>
                                                        <p className="text-sm text-gray-600">{address.country}</p>
                                                        <p className="text-sm text-gray-600">Phone: {address.phoneNo}</p>
                                                    </div>
                                                    {selectedAddress?._id === address._id && (
                                                        <div className="text-black font-bold">✓</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white border rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div key={`${item.product?._id}-${item.size}`} className="flex gap-4">
                                            <img
                                                src={item.product?.images?.[0]?.url}
                                                alt={item.product?.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.product?.name}</p>
                                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">Rs. {(item.product?.price || 0) * (item.quantity || 0)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white border rounded-lg p-6 sticky top-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>Rs. {itemsPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>Rs. {shippingPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
                                        <span>Total</span>
                                        <span>Rs. {totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleProceedToPayment}
                                    disabled={!selectedAddress || processingPayment || !razorpayLoaded}
                                    className="w-full bg-black text-white hover:bg-gray-800"
                                >
                                    {processingPayment ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Checkout

