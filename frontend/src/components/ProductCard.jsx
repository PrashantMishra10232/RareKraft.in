import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ShoppingCart, X, Heart } from 'lucide-react';
import axios from 'axios';
import { CART_API_ENDPOINT, WISHLIST_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import store from '@/redux/store';
import { setCartItems } from '@/redux/cartSlice';
import { removeWishlistItem, setWishlistItems} from '@/redux/wishlistSlice';
import useGetWishlist from '@/hooks/useGetWishlist';

function ProductCard({ product }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { allProducts } = useSelector(store => store.product);
    const { user } = useSelector(store => store.auth);
    const { wishlistItems } = useSelector(store => store.wishlist);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [togglingWishlist, setTogglingWishlist] = useState(false);

    // Fetch wishlist data
    useGetWishlist();

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
        return <div className='text-center py-4'>No products found.</div>;
    }

    // Get available sizes for this product
    const availableSizes = product?.sizes?.filter(size => size.quantity > 0) || [];

    // Check if product is in wishlist
    useEffect(() => {
        if (user && wishlistItems && Array.isArray(wishlistItems)) {
            const inWishlist = wishlistItems.some(
                item => item.product?._id === product._id
            );
            setIsInWishlist(inWishlist);
        } else {
            setIsInWishlist(false);
        }
    }, [wishlistItems, product._id, user]);

    const handleCardClick = (e) => {
        // Don't navigate if clicking on the add to cart button area
        if (e.target.closest('.add-to-cart-button')) {
            return;
        }
        navigate(`/details/${product._id}`);
    };

    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to add items to cart");
            navigate('/login');
            return;
        }
        setShowSizeModal(true);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }

        try {
            setAddingToCart(true);
            const token = store.getState().auth.token;
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
            );

            if (res.data.success) {
                toast.success("Item added to cart!");
                setShowSizeModal(false);
                setSelectedSize(null);
                // Update cart in Redux
                dispatch(setCartItems(res.data.data || []));
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            const errorMessage = error.response?.data?.message || "Failed to add item to cart";
            toast.error(errorMessage);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleCloseModal = () => {
        setShowSizeModal(false);
        setSelectedSize(null);
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            toast.error("Please login to add items to wishlist");
            navigate('/login');
            return;
        }

        try {
            setTogglingWishlist(true);
            const token = store.getState().auth.token;

            if (isInWishlist) {
                // Remove from wishlist
                const res = await axios.delete(
                    `${WISHLIST_API_ENDPOINT}/remove/${product._id}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (res.data.success) {
                    dispatch(removeWishlistItem(product._id));
                    toast.success("Removed from wishlist");
                }
            } else {
                // Add to wishlist
                const res = await axios.post(
                    `${WISHLIST_API_ENDPOINT}/add`,
                    { productId: product._id },
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (res.data.success) {
                    console.log("Wishlist add response data:", res.data.data);
                    const wishlistData = res.data.data || [];
                    // Normalize all items to ensure addedAt is a string
                    const normalizedData = wishlistData.map(item => ({
                        ...item,
                        addedAt: item.addedAt instanceof Date 
                            ? item.addedAt.toISOString() 
                            : (typeof item.addedAt === 'string' ? item.addedAt : new Date().toISOString())
                    }));
                    dispatch(setWishlistItems(normalizedData));
                    toast.success("Added to wishlist");
                }
            }
        } catch (error) {
            console.error("Wishlist toggle error:", error);
            const errorMessage = error.response?.data?.message || "Failed to update wishlist";
            toast.error(errorMessage);
        } finally {
            setTogglingWishlist(false);
        }
    };

    return (
        <>
            <div 
                onClick={handleCardClick} 
                className="rounded flex flex-col justify-center w-full cursor-pointer relative group"
            >
                <div id='image' className='relative w-full max-h-55 overflow-hidden rounded'>
                    <img 
                        src={product?.images[0]?.url} 
                        alt={product?.name} 
                        loading="lazy" 
                        className='object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110'
                    />
                    {/* Wishlist Button */}
                    {user && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleWishlist();
                            }}
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 bg-white/90 hover:bg-white z-10"
                            disabled={togglingWishlist}
                        >
                            <Heart 
                                className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                            />
                        </Button>
                    )}
                    {/* Add to Cart Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                            onClick={handleAddToCartClick}
                            className="add-to-cart-button bg-white text-black hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-2"
                            disabled={availableSizes.length === 0}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {availableSizes.length === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    </div>
                </div>
                <div id='name' className='text-center truncate'>{product?.name}</div>
                <div id='price' className='font-semibold text-gray-700 text-center '>Rs.{product?.price}</div>
            </div>

            {/* Size Selection Modal */}
            {showSizeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
                    <div 
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Select Size</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCloseModal}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="mb-4">
                            <img 
                                src={product?.images[0]?.url} 
                                alt={product?.name}
                                className="w-24 h-24 object-cover rounded mb-2"
                            />
                            <p className="font-semibold">{product?.name}</p>
                            <p className="text-gray-600">Rs. {product?.price}</p>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Available Sizes:</p>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.length > 0 ? (
                                    availableSizes.map((sizeItem) => (
                                        <button
                                            key={sizeItem.size}
                                            onClick={() => handleSizeSelect(sizeItem.size)}
                                            className={`px-4 py-2 border-2 rounded transition-all ${
                                                selectedSize === sizeItem.size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {sizeItem.size}
                                            <span className="block text-xs text-gray-500 mt-1">
                                                ({sizeItem.quantity} left)
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No sizes available</p>
                                )}
                            </div>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            disabled={!selectedSize || addingToCart}
                            className="w-full bg-black text-white hover:bg-gray-800"
                        >
                            {addingToCart ? 'Adding...' : 'Add to Cart'}
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductCard
