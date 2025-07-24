import { Router } from "express";
import {
  isAuthenticatedUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import {
  requestOtp,
  registerUser,
  loginUser,
  logOut,
  requestResetCode,
  resetPassword,
  getUserDetails,
  updateUserProfile,
  getAllUsers,
  getUser,
  deleteUser,
  handleLoginSuccess,
  refreshAccessToken,
  addAddress,
  removeAddress,
  updateAddress,
} from "../controllers/user.controller.js";
import passport from "passport";

const router = Router();

router.route("/getOtp").post(requestOtp);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh_token").post(refreshAccessToken);

router.route("/password/forgot").post(requestResetCode);

router.route("/password/reset").post(resetPassword);

router.route("/logout").post(isAuthenticatedUser, logOut);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").patch(isAuthenticatedUser, updateUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRole("Seller"), getAllUsers);

router
  .route("/getUser/:id")
  .get(isAuthenticatedUser, authorizeRole("Seller"), getUser)
  .delete(isAuthenticatedUser, authorizeRole("Seller"), deleteUser);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.route("/auth/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  handleLoginSuccess
);

router.route("/addAddress").post(isAuthenticatedUser,addAddress)
router.route("/removeAddress/:id").delete(isAuthenticatedUser,removeAddress)
router.route("/updateAddress/:id").patch(isAuthenticatedUser,updateAddress)

export default router;