import {Router} from "express"
import {processPayment,sendRazorpayApiKey} from "../controllers/payment.controller.js"
import {isAuthenticatedUser} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/process").post(isAuthenticatedUser,processPayment);

router.route("/razorpayApiKey").get(isAuthenticatedUser,sendRazorpayApiKey);

export default router;