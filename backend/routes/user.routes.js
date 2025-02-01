import { Router } from "express";
import {
  isAuthenticatedUser,
  authorizeRole,
} from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserProfile,
  getAllUsers,
  getUser,
  updateRole,
  deleteUser,
  refreshAccessToken
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh_Token").post(isAuthenticatedUser,refreshAccessToken);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logOut);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRole("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRole("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRole("admin"), updateRole)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

  export default router;