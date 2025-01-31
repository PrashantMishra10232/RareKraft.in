import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { Product } from "../models/product.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/Cloudinary.js";

//create product --(admin)
const createProduct = asyncHandler(async (req, res) => {
  let images = req.body.images
    ? Array.isArray(req.body.images)
      ? req.body.images
      : [req.body.images]
    : [];

  const imagesLinks = [];

  try {
    //upload images
    const uploadPromises = images.map((image) =>
      uploadOnCloudinary(image, { folder: "products" })
    );

    const uploadResults = await Promise.all(uploadPromises);

    uploadResults.forEach((result) => {
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    });
  } catch (error) {
    throw new ApiError(500, "Image Upload failed");
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product created successfully"));
});

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeature.query;

  return res
    .status(200)
    .json(new ApiResponse(200, { products, productsCount, resultPerPage }));
});

//get all products--(admin)
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  if (products.length === 0) {
    throw new ApiError(404, "You don't have any products listed yet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Here are all our products"));
});

//get product details
const getProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Here is the product's detail"));
});

//update product --(admin)
const updateproduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let updateData = { ...req.body }; // Use a separate object instead of modifying req.body

  if (req.body.images) {
    let images = Array.isArray(req.body.images)
      ? req.body.images
      : [req.body.images];

    if (images.length > 0) {
      // Delete old images (if they exist)
      if (product.images?.length) {
        await Promise.all(
          product.images.map((image) => deleteFromCloudinary(image.public_id))
        );
        console.log("Deleting old images...");
      }

      // Upload new images
      const uploadPromises = images.map((image) =>
        uploadOnCloudinary(image, { folder: "products" })
      );
      console.log("Uploading new images...");

      const uploadResults = await Promise.all(uploadPromises);

      // Store new image links
      updateData.images = uploadResults.map((result) => ({
        public_id: result.public_id,
        url: result.secure_url,
      }));
    }
  }

  // Updating product
  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, product, "The Product is updated successfully"));
});

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "No product found");
  }

  try {
    await Promise.all(
      product.images.map((image) => deleteFromCloudinary(image.public_id))
    );
    console.log(`Successfully deleted images for product ${req.params.id}`);
  } catch (error) {
    console.error(
      `Error deleting images for product ${req.params.id}: ${error.message}`
    );
    throw new ApiError(500, "Error deleting images from Cloudinary");
  }

  await product.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

//create new review or update the review
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;

  if (!rating || !comment || !productId) {
    throw new ApiError(400, "Rating, comment, and productId are required.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  //review object
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const reviewIndex = product.reviews.findIndex(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (reviewIndex !== -1) {
    //update the existing review
    product.reviews[reviewIndex].rating = rating;
    product.reviews[reviewIndex].comment = comment;
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //calculate the new average rating
  const totalRatings = product.reviews.reduce(
    (acc, rev) => acc + rev.rating,
    0
  );
  product.ratings = totalRatings / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Your Review is submitted"));
});

//delete review
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if the review exists in the product's reviews
  const reviewIndex = product.reviews.findIndex(
    (rev) => rev._id.toString() === req.query.id.toString()
  );

  if (reviewIndex === -1) {
    throw new ApiError(404, "Review not found");
  }

  // Remove the review
  product.reviews.splice(reviewIndex, 1);


  //calculate the average rating
  const totalRatings = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  const ratings = product.reviews.length === 0 ? 0 : totalRatings / product.reviews.length;

  //update the product again
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews: product.reviews,
      ratings,
      numOfReviews: product.reviews.length,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});

//get all reviews
const getAllReviews = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.query.id);

    if (!product) {
      throw new ApiError(404,"Product not found");
    }

    return res.status(200)
    .json(new ApiResponse(200,{reviews: product.reviews},"All reviews fetched successfully"))
})
export {
  createProduct,
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  updateproduct,
  deleteProduct,
  createReview,
  deleteReview,
  getAllReviews
};
