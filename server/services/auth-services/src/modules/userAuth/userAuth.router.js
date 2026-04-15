import express from "express";
import * as userAuthController from "./userAuth.controller.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/send-otp", userAuthController.sendOTP);

userAuthRouter.post("/verify-otp", userAuthController.verifyOTP);

userAuthRouter.post("/signup", userAuthController.completeProfile);

userAuthRouter.post("/login", userAuthController.loginUser);

export default userAuthRouter;