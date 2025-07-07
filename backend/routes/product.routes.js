import { Router } from "express";
import {isAuthenticatedUser,authorizeRole} from "../middlewares/auth.middleware.js"
import {
  createProduct,
  getAllProducts,
  getAdminProducts,
  getProductDetails,
  updateproduct,
  deleteProduct,
  createReview,
  deleteReview,
  getAllReviews,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js"


const router = Router();

router.route("/new").post(isAuthenticatedUser,upload.array("images"),authorizeRole("Seller"),createProduct);

router.route("/all").get(isAuthenticatedUser,getAllProducts);

router.route("/admin/all").get(isAuthenticatedUser,authorizeRole("Seller"),getAdminProducts);

router.route("/details/:id").get(isAuthenticatedUser,getProductDetails);

router.route("/admin/update/:id").put(isAuthenticatedUser,authorizeRole("Seller"),updateproduct);

router.route("/admin/delete/:id").delete(isAuthenticatedUser,authorizeRole("Seller"),deleteProduct);

router.route("/review").post(isAuthenticatedUser,createReview);

router.route("/review/delete").delete(isAuthenticatedUser,deleteReview);

router.route("/getReviews").get(getAllReviews);


export default router;
