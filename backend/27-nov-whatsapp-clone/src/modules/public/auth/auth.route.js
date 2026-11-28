import express from "express";
import AuthController from "./auth.controller.js";

const authController = new AuthController()
const router = express.Router();

// profile screen open karega
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account" }))

router.get('/google/callback', passport.authenticate('google', { session: false }), asyncHandler(authController.GoogleCallback.bind(authController)));

router.get("/refreshToken", asyncHandler(authController.refreshAccessToken.bind(authController)));
router.post("/refresh-token", asyncHandler(authController.refreshAccessToken.bind(authController)));


export default router;