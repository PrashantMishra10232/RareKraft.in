import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import {Product} from "../models/product.model.js"

const newOrder = asyncHandler(async (req, res) => {
  const { shippingInfo, orderItems, itemsPrice, shippingPrice, totalPrice } =
    req.body;

  if (orderItems.length == 0) {
    throw new ApiError(400, "No order items found");
  }
  const order = await Order.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paidAt: null,
    user: req.user._id,
  });

  res.status(201).json(new ApiResponse(200, order));
});

const updateOrderPaymentInfo = asyncHandler(async (req, res) => {
  const { orderId, paymentId, status } = req.body; // Payment data received from frontend or payment gateway

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found with this id");
  }

  order.paymentInfo = {
    id: paymentId,
    status: status,
  };
  order.paidAt = Date.now();
  order.orderStatus = "Paid"; 

  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, order, "Payment processed and order updated"));
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product");

  if (!order) {
    throw new ApiError(404, "Order not found with this id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order retrieved successfully"));
});

//get logged in user orders
const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found for this user.");
  }

  return res.status(200).json(new ApiResponse(200, orders));
});

//get all orders (seller)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { orders, totalAmount },
        "All Orders retrieved successfully"
      )
    );
});

//update order status(seller)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found with this Id");
  }

  if (order.orderStatus === "Delivered") {
    throw new ApiError(400, "You have already delivered this order");
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, { order }, "Order status updated successfully"));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found with this id");
  }

  await order.deleteOne({ _id: order._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

export {
  deleteOrder,
  updateOrderStatus,
  updateOrderPaymentInfo,
  getAllOrders,
  myOrders,
  getSingleOrder,
  newOrder,
};
