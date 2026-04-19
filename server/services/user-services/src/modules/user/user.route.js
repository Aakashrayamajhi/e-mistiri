import express from "express";
import * as userController from "./user.controller.js";
import upload from "../../middleware/multer.middleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get All Users
 *     tags: [UserServices - user]
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fullname:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
userRouter.get("/", userController.getAllUsers);
userRouter.post("/", userController.createUser);

/**
 * @swagger
 * /api/v1/user/phone/{phone}:
 *   get:
 *     summary: Get User By Phone Number
 *     tags: [UserServices - user]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: User's phone number
 *     responses:
 *       200:
 *         description: Successfully fetched user by phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullname:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 */
userRouter.get("/phone/:phone", userController.getUserByPhone);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get User By ID
 *     tags: [UserServices - user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully fetched user by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fullname:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 */
userRouter.get("/:id", userController.getUserById);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   patch:
 *     summary: Update User By ID
 *     tags: [UserServices - user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
userRouter.patch("/:id", userController.updateUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete User By ID
 *     tags: [UserServices - user]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
userRouter.delete("/:id", userController.deleteUser);

userRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  userController.uploadProfileImage
);

export default userRouter;