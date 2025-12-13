import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  if (!productId || !size) {
    throw new ApiError(400, "Product ID and size are required");
  }

  // Validate size
  const validSizes = ["S", "M", "L", "XL", "XXL"];
  if (!validSizes.includes(size)) {
    throw new ApiError(400, "Invalid size");
  }

  // Check if product exists and has the selected size in stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const sizeInfo = product.sizes.find((s) => s.size === size);
  if (!sizeInfo) {
    throw new ApiError(400, `Size ${size} is not available for this product`);
  }

  if (sizeInfo.quantity < quantity) {
    throw new ApiError(400, `Only ${sizeInfo.quantity} items available in size ${size}`);
  }

  // Get user and check if item already exists in cart
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if product with same size already exists in cart
  const existingCartItem = user.cart.find(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (existingCartItem) {
    // Update quantity if item already exists
    const newQuantity = existingCartItem.quantity + quantity;
    if (newQuantity > sizeInfo.quantity) {
      throw new ApiError(400, `Only ${sizeInfo.quantity} items available in size ${size}`);
    }
    existingCartItem.quantity = newQuantity;
  } else {
    // Add new item to cart
    user.cart.push({
      product: productId,
      size,
      quantity,
    });
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Item added to cart successfully"));
});

// Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Cart retrieved successfully"));
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, size } = req.body;

  if (!productId || !size) {
    throw new ApiError(400, "Product ID and size are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Remove item from cart
  user.cart = user.cart.filter(
    (item) => !(item.product.toString() === productId && item.size === size)
  );

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Item removed from cart successfully"));
});

// Update cart item quantity
const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, size, quantity } = req.body;

  if (!productId || !size || quantity === undefined) {
    throw new ApiError(400, "Product ID, size, and quantity are required");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // Check product stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const sizeInfo = product.sizes.find((s) => s.size === size);
  if (!sizeInfo) {
    throw new ApiError(400, `Size ${size} is not available for this product`);
  }

  if (sizeInfo.quantity < quantity) {
    throw new ApiError(400, `Only ${sizeInfo.quantity} items available in size ${size}`);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cartItem = user.cart.find(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (!cartItem) {
    throw new ApiError(404, "Item not found in cart");
  }

  cartItem.quantity = quantity;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Cart updated successfully"));
});

// Clear entire cart
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.cart = [];
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, [], "Cart cleared successfully"));
});

export { addToCart, getCart, removeFromCart, updateCartQuantity, clearCart };

