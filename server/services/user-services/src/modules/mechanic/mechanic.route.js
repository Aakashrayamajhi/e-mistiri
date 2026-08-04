import express from "express";
import * as mechanicController from "./mechanic.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { requireAdmin } from "../../middleware/rbac.middleware.js";
import upload from "../../middleware/multer.middleware.js";
import { auditLog } from "../../middleware/audit.middleware.js";
import mechanicDTOs from "../../dtos/mechanic.dto.js";

const mechanicRouter = express.Router();

mechanicRouter.post("/", validate(mechanicDTOs.createMechanic, 'body'), mechanicController.registermechanic);
mechanicRouter.get("/phone/:phone", validate(mechanicDTOs.getByPhone, 'params'), mechanicController.getmechanicByPhone);
mechanicRouter.get("/", requireAdmin, validate(mechanicDTOs.getAll, 'query'), mechanicController.getAllmechanics);
mechanicRouter.get("/approved", validate(mechanicDTOs.getApproved, 'query'), mechanicController.getmechanics);
mechanicRouter.get("/:id", validate(mechanicDTOs.getById, 'params'), mechanicController.getmechanic);
mechanicRouter.patch("/update/:id", validate(mechanicDTOs.updateMechanic, 'body'), mechanicController.updatemechanic);
mechanicRouter.delete("/:id", requireAdmin, auditLog('mechanic', 'delete'), mechanicController.deletemechanic);
mechanicRouter.patch("/:id/approve", requireAdmin, validate(mechanicDTOs.approve, 'params'), auditLog('mechanic', 'approve'), mechanicController.approvemechanic);
mechanicRouter.patch("/:id/reject", requireAdmin, validate(mechanicDTOs.reject, 'params'), auditLog('mechanic', 'reject'), mechanicController.rejectmechanic);

mechanicRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  mechanicController.uploadmechanicProfileImage
);

export default mechanicRouter;
