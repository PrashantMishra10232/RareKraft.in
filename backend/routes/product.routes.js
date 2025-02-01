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


const router = Router();

router.route("/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);

router.route("/all").get(isAuthenticatedUser,getAllProducts);

router.route("/admin/all").get(isAuthenticatedUser,authorizeRole("admin"),getAdminProducts);

router.route("/details/:id").get(isAuthenticatedUser,getProductDetails);

router.route("/admin/update/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateproduct);

router.route("/admin/delete/:id").delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct);

router.route("/review").post(isAuthenticatedUser,createReview);

router.route("/review/delete").delete(isAuthenticatedUser,deleteReview);

router.route("/getReviews").get(getAllReviews);


export default router;
