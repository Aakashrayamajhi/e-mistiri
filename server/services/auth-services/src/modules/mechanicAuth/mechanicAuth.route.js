import express from "express";
import * as mechanicAuthController from "./mechanicAuth.controller.js";
import { signupSchema, verifyOTPSchema, loginSchema, refreshTokenSchema } from "../../dtos/mechanicAuth.dto.js";
import { validate } from "../../middleware/validation.middleware.js";
import { signupLimiter, loginLimiter, otpLimiter } from "../../middleware/rateLimiter.middleware.js";

const mechanicAuthRouter = express.Router();

mechanicAuthRouter.post("/signup", signupLimiter, validate(signupSchema), mechanicAuthController.completeProfile);

mechanicAuthRouter.post("/login", loginLimiter, validate(loginSchema), mechanicAuthController.loginmechanic);

mechanicAuthRouter.post("/refresh-token", validate(refreshTokenSchema), mechanicAuthController.refreshToken);

export default mechanicAuthRouter;
