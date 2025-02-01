import { Router } from "express";
import {
  isAuthenticatedUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import {
  deleteOrder,
  updateOrderStatus,
  updateOrderPaymentInfo,
  getAllOrders,
  myOrders,
  getSingleOrder,
  newOrder,
} from "../controllers/order.Controller.js";
const router = Router();

router.route("/new").post(isAuthenticatedUser,newOrder);

router.route("/admin/:id")
.delete(isAuthenticatedUser,authorizeRole("admin"),deleteOrder)
.put(isAuthenticatedUser,authorizeRole("admin"),updateOrderStatus)
.get(isAuthenticatedUser,getSingleOrder);

router.route("/admin").get(isAuthenticatedUser,authorizeRole("admin"),getAllOrders)

router.route("/me").get(isAuthenticatedUser,myOrders)

router.route("/admin/paymentInfo").put(isAuthenticatedUser,authorizeRole("admin"),updateOrderPaymentInfo)











export default router;
