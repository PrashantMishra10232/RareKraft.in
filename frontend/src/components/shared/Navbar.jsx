import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Bookmark, Box, CircleUserRound, LogOutIcon, PackageOpen, Search, ShoppingCart, User, User2 } from 'lucide-react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/utils/axiosInstance';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { logout } from '@/redux/authSlice';
import { persistor } from '@/redux/store';
import { toast } from 'sonner';
import useGetCart from '@/hooks/useGetCart';

function Navbar() {
    const { user } = useSelector(store => store.auth)
    const { cartCount } = useSelector(store => store.cart)
    const { allProducts } = useSelector(store => store.product)
    useGetCart(); // Fetch cart on mount and when user changes

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const logoutHandler = async () => {
        try {
            const res = await axiosInstance.post(`${USER_API_ENDPOINT}/logout`, {}, {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(logout());
                await persistor.purge();
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Logout Error:", error);
            console.error("Error Response:", error.response);
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    }

    // Handle search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = allProducts.filter((product) => {
            const nameMatch = product.name?.toLowerCase().includes(query);
            const descMatch = product.description?.toLowerCase().includes(query);
            const categoryMatch = product.category?.toLowerCase().includes(query);
            return nameMatch || descMatch || categoryMatch;
        });

        setSearchResults(filtered);
    }, [searchQuery, allProducts]);

    const handleSearchResultClick = (productId) => {
        setSearchOpen(false);
        setSearchQuery('');
        navigate(`/details/${productId}`);
    };

    const handleViewAllResults = () => {
        setSearchOpen(false);
        const query = searchQuery;
        setSearchQuery('');
        navigate(`/collection?search=${encodeURIComponent(query)}`);
    };

    return (
        <div className='bg-white'>
            <div className='md:px-35 sm:px-10 sm:py-7 p-3 flex justify-between items-center'>
                {/* Mobile Sidebar */}
                <div className="sm:hidden flex items-center">
                    <button
                        type="button"
                        className="text-gray-700 focus:outline-none"
                        onClick={() => {
                            const sidebar = document.getElementById('mobile-sidebar');
                            if (sidebar) sidebar.classList.toggle('hidden');
                        }}
                        aria-label="Open sidebar"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div
                        id="mobile-sidebar"
                        className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-6 hidden transition-all"
                    >
                        <button
                            type="button"
                            className="mb-6 text-gray-700 focus:outline-none"
                            onClick={() => {
                                const sidebar = document.getElementById('mobile-sidebar');
                                if (sidebar) sidebar.classList.add('hidden');
                            }}
                            aria-label="Close sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ul className="space-y-4 text-gray-700 font-semibold">
                            <li><NavLink  to="/" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>HOME</NavLink></li>
                            <li><NavLink  to="/collection" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>COLLECTION</NavLink></li>
                            <li><NavLink  to="/about" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>ABOUT</NavLink></li>
                            <li><NavLink  to="/contact" onClick={() => document.getElementById('mobile-sidebar').classList.add('hidden')}>CONTACT</NavLink></li>
                        </ul>
                    </div>
                </div>
                <div id="logo">
                    <img src="https://res.cloudinary.com/dlqas2glz/image/upload/v1751957398/logo-C9jKJhBG_zwg2oj.png" alt="logo" className='w-[140px] h-[140px]' />
                </div>
                <div id="menu" className='flex items-center'>
                    <ul className='sm:flex hidden justify-between items-center gap-4 text-gray-700 font-semibold'>
                        <li><NavLink className={({isActive})=>isActive ? "underline decoration-2 underline-offset-4" : "text-gray-700"} to="/">HOME</NavLink></li>
                        <li><NavLink className={({isActive})=>isActive ? "underline decoration-2 underline-offset-4" : "text-gray-700"} to="/collection">COLLECTION</NavLink></li>
                        <li><NavLink className={({isActive})=>isActive ? "underline decoration-2 underline-offset-4" : "text-gray-700"} to="/about">ABOUT</NavLink></li>
                        <li><NavLink className={({isActive})=>isActive ? "underline decoration-2 underline-offset-4" : "text-gray-700"} to="/contact">CONTACT</NavLink></li>
                    </ul>
                </div>
                <div className='flex justify-between gap-4'>
                    <div>
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="cursor-pointer"
                            aria-label="Search products"
                        >
                            <Search />
                        </button>
                    </div>
                    {!user ? (
                        <div>
                            <Link to="/signup" className='cursor-pointer'><User /></Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger>
                                <CircleUserRound className='cursor-pointer' />
                            </PopoverTrigger>
                            <PopoverContent className='mx-2 '>
                                <div className='flex items-center gap-4 space-y-2'>
                                    <Avatar className='cursor-pointer'>
                                        <AvatarImage src={user?.avatar} alt='@shadcn' />
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <h4 className='font-medium'>{user.name}</h4>
                                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col my-2 text-gray-600'>
                                    <div>
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <User2 />
                                            <Button variant='link'><Link to="/profilePage">View Profile</Link></Button>
                                        </div>
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <PackageOpen />
                                            <Button variant='link'><Link>Orders</Link></Button>
                                        </div>
                                        <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                            <Bookmark />
                                            <Button variant='link'><Link>Wishlist</Link></Button>
                                        </div>
                                    </div>
                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                        <LogOutIcon />
                                        <Button variant='link' onClick={logoutHandler} className='cursor-pointer'>Logout</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                    <div>
                        <Link to="/cart" className="cursor-pointer relative inline-block">
                            <ShoppingCart />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Dialog */}
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Search Products</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                                autoFocus
                            />
                        </div>

                        {searchQuery.trim() && (
                            <div className="flex-1 overflow-y-auto max-h-[400px]">
                                {searchResults.length > 0 ? (
                                    <>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-gray-600">
                                                Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                                            </p>
                                            {searchResults.length > 5 && (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={handleViewAllResults}
                                                    className="text-sm"
                                                >
                                                    View All Results
                                                </Button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {searchResults.slice(0, 5).map((product) => (
                                                <div
                                                    key={product._id}
                                                    onClick={() => handleSearchResultClick(product._id)}
                                                    className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <img
                                                        src={product.images?.[0]?.url}
                                                        alt={product.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                                                        <p className="text-xs text-gray-600 truncate">{product.description}</p>
                                                        <p className="text-sm font-bold text-gray-800 mt-1">Rs. {product.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No products found matching "{searchQuery}"</p>
                                        <p className="text-sm mt-2">Try a different search term</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!searchQuery.trim() && (
                            <div className="text-center py-8 text-gray-500">
                                <p>Start typing to search for products</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Navbar