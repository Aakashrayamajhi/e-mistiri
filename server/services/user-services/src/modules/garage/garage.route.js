import express from "express";
import * as garageController from "./garage.controller.js";
import upload from "../../middleware/multer.middleware.js";

const garageRouter = express.Router();

/**
 * @swagger
 * /api/v1/garage:
 *   post:
 *     summary: Register Garage
 *     tags: [GarageServices - garage]
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
 *         description: Garage registered successfully
 */
garageRouter.post("/", garageController.registerGarage);

/**
 * @swagger
 * /api/v1/garage/phone/{phone}:
 *   get:
 *     summary: Get Garage By Phone
 *     tags: [GarageServices - garage]
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garage found successfully
 *       404:
 *         description: Garage not found
 */
garageRouter.get("/phone/:phone", garageController.getGarageByPhone);

/**
 * @swagger
 * /api/v1/garage:
 *   get:
 *     summary: Get All Garages
 *     tags: [GarageServices - garage]
 *     responses:
 *       200:
 *         description: List of all garages
 */
garageRouter.get("/", garageController.getAllGarages);

/**
 * @swagger
 * /api/v1/garage/approved:
 *   get:
 *     summary: Get Approved Garages
 *     tags: [GarageServices - garage]
 *     responses:
 *       200:
 *         description: Approved garages list
 */
garageRouter.get("/approved", garageController.getGarages);

/**
 * @swagger
 * /api/v1/garage/nearby:
 *   get:
 *     summary: Get Nearby Garages
 *     tags: [GarageServices - garage]
 *     parameters:
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Nearby garages fetched
 */
garageRouter.get("/nearby", garageController.getNearbyGarages);

/**
 * @swagger
 * /api/v1/garage/{id}:
 *   get:
 *     summary: Get Garage By ID
 *     tags: [GarageServices - garage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garage found
 *       404:
 *         description: Garage not found
 */
garageRouter.get("/:id", garageController.getGarage);

/**
 * @swagger
 * /api/v1/garage/update/{id}:
 *   patch:
 *     summary: Update Garage
 *     tags: [GarageServices - garage]
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
 *         description: Garage updated
 */
garageRouter.patch("/update/:id", garageController.updateGarage);

/**
 * @swagger
 * /api/v1/garage/{id}:
 *   delete:
 *     summary: Delete Garage
 *     tags: [GarageServices - garage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Garage deleted
 */
garageRouter.delete("/:id", garageController.deleteGarage);

/**
 * @swagger
 * /api/v1/garage/{id}/approve:
 *   patch:
 *     summary: Approve Garage
 *     tags: [GarageServices - garage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Garage approved
 */
garageRouter.patch("/:id/approve", garageController.approveGarage);

/**
 * @swagger
 * /api/v1/garage/{id}/reject:
 *   patch:
 *     summary: Reject Garage
 *     tags: [GarageServices - garage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Garage rejected
 */
garageRouter.patch("/:id/reject", garageController.rejectGarage);

/**
 * @swagger
 * /api/v1/garage/{id}/profile-image:
 *   patch:
 *     summary: Upload Garage Profile Image
 *     tags: [GarageServices - garage]
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
 *         description: Profile image uploaded successfully
 */
garageRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  garageController.uploadGarageProfileImage
);

export default garageRouter;