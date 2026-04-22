import express from 'express'
import proxy from './mechanicAuth.proxy.js'

const router = express.Router()

/**
 * @swagger
 * /api/mechanicAuth/signup:
 *   post:
 *     summary: Complete Mechanic Signup
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
 *                 example: "+1234567890"
 *               fullname:
 *                 type: string
 *                 example: "Mechanic Name"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mechanic registered successfully"
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/mechanicAuth/login:
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
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
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
 *                 mechanic:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     phone:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

router.use((req, res, next) => {
  console.log(' mechanicAuth route hit')
  next()
})

router.use(proxy)

export default router