import express from "express";
import * as garageController from "./garage.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { requireAdmin } from "../../middleware/rbac.middleware.js";
import upload from "../../middleware/multer.middleware.js";
import { auditLog } from "../../middleware/audit.middleware.js";
import garageDTOs from "../../dtos/garage.dto.js";

const garageRouter = express.Router();

garageRouter.post("/", validate(garageDTOs.createGarage, 'body'), garageController.registerGarage);
garageRouter.get("/phone/:phone", validate(garageDTOs.getByPhone, 'params'), garageController.getGarageByPhone);
garageRouter.get("/", requireAdmin, validate(garageDTOs.getAll, 'query'), garageController.getAllGarages);
garageRouter.get("/approved", validate(garageDTOs.getApproved, 'query'), garageController.getGarages);
garageRouter.get("/nearby", validate(garageDTOs.getNearby, 'query'), garageController.getNearbyGarages);
garageRouter.get("/:id", validate(garageDTOs.getById, 'params'), garageController.getGarage);
garageRouter.patch("/update/:id", validate(garageDTOs.updateGarage, 'body'), garageController.updateGarage);
garageRouter.delete("/:id", requireAdmin, auditLog('garage', 'delete'), garageController.deleteGarage);
garageRouter.patch("/:id/approve", requireAdmin, validate(garageDTOs.approve, 'params'), auditLog('garage', 'approve'), garageController.approveGarage);
garageRouter.patch("/:id/reject", requireAdmin, validate(garageDTOs.reject, 'params'), auditLog('garage', 'reject'), garageController.rejectGarage);

garageRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  garageController.uploadGarageProfileImage
);

export default garageRouter;
