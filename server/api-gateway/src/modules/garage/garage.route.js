import express from 'express'
import proxy from './garage.proxy.js'

const router = express.Router()
/**
 * @swagger
 * /api/garage:
 *   get:
 *     summary: Get All Garages
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all garages
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
 *                   email:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Register Garage
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "Garage Name"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 example: "garage@example.com"
 *     responses:
 *       201:
 *         description: Garage registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/phone/{phone}:
 *   get:
 *     summary: Get Garage By Phone
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/approved:
 *   get:
 *     summary: Get Approved Garages
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Approved garages list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/nearby:
 *   get:
 *     summary: Get Nearby Garages
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude
 *     responses:
 *       200:
 *         description: Nearby garages fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/{id}:
 *   get:
 *     summary: Get Garage By ID
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garage found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Garage not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete Garage
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garage deleted
 *       404:
 *         description: Garage not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/update/{id}:
 *   patch:
 *     summary: Update Garage
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Garage updated
 *       404:
 *         description: Garage not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/{id}/approve:
 *   patch:
 *     summary: Approve Garage
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garage approved
 *       404:
 *         description: Garage not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/{id}/reject:
 *   patch:
 *     summary: Reject Garage
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garage rejected
 *       404:
 *         description: Garage not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/garage/{id}/profile-image:
 *   patch:
 *     summary: Upload Garage Profile Image
 *     tags: [Garage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       404:
 *         description: Garage not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.use((req, res, next) => {
  console.log(' garage route hit')
  next()
})

router.use(proxy)

export default router