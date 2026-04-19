import express from "express";
import * as mechanicAuthController from "./mechanicAuth.controller.js";

const mechanicAuthRouter = express.Router();

/**
 * @swagger
 * /api/v1/mechanicAuth/signup:
 *   post:
 *     summary: Mechanic Signup (Complete Profile)
 *     tags: [MechanicAuth]
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
 *       400:
 *         description: Validation error
 */
mechanicAuthRouter.post("/signup", mechanicAuthController.completeProfile);

/**
 * @swagger
 * /api/v1/mechanicAuth/login:
 *   post:
 *     summary: Mechanic Login
 *     tags: [MechanicAuth]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       401:
 *         description: Invalid credentials
 */
mechanicAuthRouter.post("/login", mechanicAuthController.loginmechanic);

export default mechanicAuthRouter;