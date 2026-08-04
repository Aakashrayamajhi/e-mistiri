import express from "express";
import * as garageAuthController from "./garageAuth.controller.js";
import { signupSchema, verifyOTPSchema, loginSchema, refreshTokenSchema } from "../../dtos/garageAuth.dto.js";
import { validate } from "../../middleware/validation.middleware.js";
import { signupLimiter, loginLimiter, otpLimiter } from "../../middleware/rateLimiter.middleware.js";

const garageAuthRouter = express.Router();

garageAuthRouter.post("/signup", signupLimiter, validate(signupSchema), garageAuthController.completeProfile);

garageAuthRouter.post("/login", loginLimiter, validate(loginSchema), garageAuthController.loginGarage);

garageAuthRouter.post("/refresh-token", validate(refreshTokenSchema), garageAuthController.refreshToken);

export default garageAuthRouter;
