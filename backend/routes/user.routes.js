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
  forgotPassword,
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

router.route("/getOtp").get(requestOtp);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh_Token").post(isAuthenticatedUser, refreshAccessToken);

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

router.get("/auth/google", (req, res, next) => {
  const { role } = req.query;
  const state = Buffer.from(JSON.stringify({ role })).toString("base64");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  })(req, res, next);
});
router
  .route("/auth/google/callback")
  .get(
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    handleLoginSuccess
  );
export default router;
