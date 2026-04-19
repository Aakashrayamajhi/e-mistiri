
import express from "express";
import * as garageAuthController from "./garageAuth.controller.js";

const garageAuthRouter = express.Router();

/**
 * @swagger
 * /api/v1/garageAuth/signup:
 *   post:
 *     summary: Garage Signup (Complete Profile)
 *     tags: [GarageAuth]
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
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signup success
 *       400:
 *         description: Validation error
 */
garageAuthRouter.post("/signup", garageAuthController.completeProfile);

/**
 * @swagger
 * /api/v1/garageAuth/login:
 *   post:
 *     summary: Garage Login
 *     tags: [GarageAuth]
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
garageAuthRouter.post("/login", garageAuthController.loginGarage);

export default garageAuthRouter;