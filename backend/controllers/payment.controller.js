import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import razorpay from "../utils/razorpay.js"
import {Order} from "../models/order.model.js"

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
        amount: order.totalPrice * 100,
        currency: "INR",
        receipt: `receipt_${orderId}`,
        payment_capture: 1, //auto capture payment
    };

    // create razorpay order
    try {
        const razorpayOrder = await razorpay.orders.create(options);
        return res.status(200).json(new ApiResponse(200, razorpayOrder, "Payment API"));
    } catch (error) {
        throw new ApiError(500, "Error creating Razorpay order", error);
    }
})

const verifyPayment = asyncHandler(async(req,res)=>{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature}= req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id //required format to recreate the signature

    const expectedSignature = crypto
    .createHmac('sha256',process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest('hex');

    if(expectedSignature === razorpay_signature){
        res.json({success: true, message: 'Payment verified successfully'});
    }
    else{
        res.status(400).json({success:false, message: 'Invalid signature'});
    }
})

const sendRazorpayApiKey = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,{razorpayApiKey: process.env.RAZORPAY_API_KEY}))
})

export {processPayment,sendRazorpayApiKey,verifyPayment}