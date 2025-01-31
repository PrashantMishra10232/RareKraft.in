import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import razorpay from "../utils/razorpay.js"
import Order from "../models/order.model.js"

const processPayment = asyncHandler(async(req,res)=>{
    const {orderId} = req.body; 

    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404,"Order not found")
    }

    if (!order.totalPrice) {
        throw new ApiError(400, "Order price is missing");
    }

    const options = {
        amount: order.totalPrice * 100,//convert to paise
        currency: "INR",
        receipt: `receipt_${orderId}`,
        payment_capture: 1, //auto capture payment
    };

    // create razorpay order
    try {
        // 3️⃣ Create Razorpay Order
        const razorpayOrder = await razorpay.orders.create(options);

        // 4️⃣ Send Response
        return res.status(200).json(new ApiResponse(200, razorpayOrder, "Payment API"));
    } catch (error) {
        throw new ApiError(500, "Error creating Razorpay order", error);
    }
})

const sendRazorpayApiKey = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,{razorpayApiKey: process.env.RAZORPAY_API_KEY}))
})

export {processPayment,sendRazorpayApiKey}