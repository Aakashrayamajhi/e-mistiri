import express from "express";
import * as userAuthController from "./userAuth.controller.js";
import { signupSchema, verifyOTPSchema, loginSchema, refreshTokenSchema } from "../../dtos/userAuth.dto.js";
import { validate } from "../../middleware/validation.middleware.js";
import { signupLimiter, loginLimiter, otpLimiter } from "../../middleware/rateLimiter.middleware.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/signup", signupLimiter, validate(signupSchema), userAuthController.completeProfile);

userAuthRouter.post("/login", loginLimiter, validate(loginSchema), userAuthController.loginUser);

userAuthRouter.post("/refresh-token", validate(refreshTokenSchema), userAuthController.refreshToken);

export default userAuthRouter;
