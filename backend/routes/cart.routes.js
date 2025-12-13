import { Router } from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.route("/add").post(isAuthenticatedUser, addToCart);
router.route("/").get(isAuthenticatedUser, getCart);
router.route("/remove").delete(isAuthenticatedUser, removeFromCart);
router.route("/update").put(isAuthenticatedUser, updateCartQuantity);
router.route("/clear").delete(isAuthenticatedUser, clearCart);

export default router;

