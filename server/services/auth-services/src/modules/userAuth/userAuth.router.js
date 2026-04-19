import express from "express";
import * as userAuthController from "./userAuth.controller.js";

const userAuthRouter = express.Router();

// userAuthRouter.post("/send-otp", userAuthController.sendOTP);

// userAuthRouter.post("/verify-otp", userAuthController.verifyOTP);

/**
 * @swagger
 * /api/v1/userAuth/signup:
 *   post:
 *     summary: Complete signup
 *     tags: [UserAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               fullname:
 *                 type: string
 *               password:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signup success
 */

userAuthRouter.post("/signup", userAuthController.completeProfile);


/**
 * @swagger
 * /api/v1/userAuth/login:
 *   post:
 *     summary: Login user
 *     tags: [UserAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */

userAuthRouter.post("/login", userAuthController.loginUser);

export default userAuthRouter;