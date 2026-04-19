import express from "express";
import * as mechanicController from "./mechanic.controller.js";
import upload from "../../middleware/multer.middleware.js";

const mechanicRouter = express.Router();

/**
 * @swagger
 * /api/v1/mechanic:
 *   post:
 *     summary: Register Mechanic
 *     tags: [MechanicServices - mechanic]
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
 *     responses:
 *       201:
 *         description: Mechanic registered successfully
 */
mechanicRouter.post("/", mechanicController.registermechanic);

/**
 * @swagger
 * /api/v1/mechanic/phone/{phone}:
 *   get:
 *     summary: Get Mechanic By Phone
 *     tags: [MechanicServices - mechanic]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mechanic found
 *       404:
 *         description: Mechanic not found
 */
mechanicRouter.get("/phone/:phone", mechanicController.getmechanicByPhone);

/**
 * @swagger
 * /api/v1/mechanic:
 *   get:
 *     summary: Get All Mechanics
 *     tags: [MechanicServices - mechanic]
 *     responses:
 *       200:
 *         description: List of mechanics
 */
mechanicRouter.get("/", mechanicController.getAllmechanics);

/**
 * @swagger
 * /api/v1/mechanic/approved:
 *   get:
 *     summary: Get Approved Mechanics
 *     tags: [MechanicServices - mechanic]
 *     responses:
 *       200:
 *         description: Approved mechanics list
 */
mechanicRouter.get("/approved", mechanicController.getmechanics);

/**
 * @swagger
 * /api/v1/mechanic/{id}:
 *   get:
 *     summary: Get Mechanic By ID
 *     tags: [MechanicServices - mechanic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Mechanic found
 *       404:
 *         description: Mechanic not found
 */
mechanicRouter.get("/:id", mechanicController.getmechanic);

/**
 * @swagger
 * /api/v1/mechanic/update/{id}:
 *   patch:
 *     summary: Update Mechanic
 *     tags: [MechanicServices - mechanic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Mechanic updated
 */
mechanicRouter.patch("/update/:id", mechanicController.updatemechanic);

/**
 * @swagger
 * /api/v1/mechanic/{id}:
 *   delete:
 *     summary: Delete Mechanic
 *     tags: [MechanicServices - mechanic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Mechanic deleted
 */
mechanicRouter.delete("/:id", mechanicController.deletemechanic);

/**
 * @swagger
 * /api/v1/mechanic/{id}/approve:
 *   patch:
 *     summary: Approve Mechanic
 *     tags: [MechanicServices - mechanic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Mechanic approved
 */
mechanicRouter.patch("/:id/approve", mechanicController.approvemechanic);

/**
 * @swagger
 * /api/v1/mechanic/{id}/reject:
 *   patch:
 *     summary: Reject Mechanic
 *     tags: [MechanicServices - mechanic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Mechanic rejected
 */
mechanicRouter.patch("/:id/reject", mechanicController.rejectmechanic);

/**
 * @swagger
 * /api/v1/mechanic/{id}/profile-image:
 *   patch:
 *     summary: Upload Mechanic Profile Image
 *     tags: [MechanicServices - mechanic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded
 */
mechanicRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  mechanicController.uploadmechanicProfileImage
);

export default mechanicRouter;