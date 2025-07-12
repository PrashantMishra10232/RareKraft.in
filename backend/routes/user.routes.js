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
  updateRole,
  deleteUser,
  handleLoginSuccess,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import passport from "passport";

const router = Router();

router.route("/getOtp").post(requestOtp);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh_Token").post(refreshAccessToken);

router.route("/password/forgot").post(requestResetCode);

router.route("/password/reset").post(resetPassword);

router.route("/logout").post(isAuthenticatedUser, logOut);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRole("Seller"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRole("Seller"), getUser)
  .put(isAuthenticatedUser, authorizeRole("Seller"), updateRole)
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

export default router;