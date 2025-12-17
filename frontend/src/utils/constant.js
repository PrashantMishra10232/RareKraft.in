// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const USER_API_ENDPOINT = `${API_BASE_URL}/api/v1/user`;

export const Product_API_ENDPOINT = `${API_BASE_URL}/api/v1/product`;

export const CART_API_ENDPOINT = `${API_BASE_URL}/api/v1/cart`;

export const ORDER_API_ENDPOINT = `${API_BASE_URL}/api/v1/order`;

export const PAYMENT_API_ENDPOINT = `${API_BASE_URL}/api/v1/payment`;

export const WISHLIST_API_ENDPOINT = `${API_BASE_URL}/api/v1/wishlist`;