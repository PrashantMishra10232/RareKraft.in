import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

// Add product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Get user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if product already in wishlist
  const existingWishlistItem = user.wishlist.find(
    (item) => item.product.toString() === productId
  );

  if (existingWishlistItem) {
    throw new ApiError(400, "Product already in wishlist");
  }

  // Add to wishlist
  user.wishlist.push({
    product: productId,
    addedAt: Date.now(),
  });

  await user.save();

  // Populate product details for response
  await user.populate("wishlist.product");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.wishlist, "Product added to wishlist successfully")
    );
});

// Remove product from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Get user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Remove from wishlist
  user.wishlist = user.wishlist.filter(
    (item) => item.product.toString() !== productId
  );

  await user.save();

  // Populate product details for response
  await user.populate("wishlist.product");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.wishlist, "Product removed from wishlist successfully")
    );
});

// Get user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist.product");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.wishlist || [], "Wishlist retrieved successfully")
    );
});

// Check if product is in wishlist
const checkWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isInWishlist = user.wishlist.some(
    (item) => item.product.toString() === productId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isInWishlist }, "Wishlist status retrieved successfully")
    );
});

export { addToWishlist, removeFromWishlist, getWishlist, checkWishlist };

