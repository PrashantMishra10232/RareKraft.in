import {Router} from "express"
import {processPayment,sendRazorpayApiKey,verifyPayment} from "../controllers/payment.controller.js"
import {isAuthenticatedUser} from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/processPayment').post(isAuthenticatedUser,processPayment);
router.route('/verifyPayment').post(isAuthenticatedUser,verifyPayment);
router.route('/sendingRazorpayAPiKey').post(isAuthenticatedUser,sendRazorpayApiKey);

export default router;