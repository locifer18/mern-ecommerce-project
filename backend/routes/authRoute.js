import express from "express";
import {
  registerController,
  loginController,
  testController,
  updateProfileController,
  getAllOrdersController,
  orderStatusController,
  forgotPasswordController,
  ordersController,
  addShippingAddressController,
  updateShippingAddressController,
  deleteShippingAddressController,
  getSingleOrderController,
  getUserDashboardStatsController,
  getDashboardStatsController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});


//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, ordersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put( "/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

//get single order
router.get('/order/:orderId', requireSignIn, getSingleOrderController);

// User dashboard statistics route
router.get('/user-stats', requireSignIn, getUserDashboardStatsController);

// Admin dashboard statistics route
router.get('/stats', requireSignIn, isAdmin, getDashboardStatsController);

// Shipping address management
router.post('/address', requireSignIn, addShippingAddressController);
router.put('/address/:addressId', requireSignIn, updateShippingAddressController);
router.delete('/address/:addressId', requireSignIn, deleteShippingAddressController);

export default router;