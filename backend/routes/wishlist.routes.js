import { Router } from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/add").post(isAuthenticatedUser, addToWishlist);
router.route("/remove/:productId").delete(isAuthenticatedUser, removeFromWishlist);
router.route("/").get(isAuthenticatedUser, getWishlist);
router.route("/check/:productId").get(isAuthenticatedUser, checkWishlist);

export default router;

