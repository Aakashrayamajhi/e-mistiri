import express from "express";
import * as garageController from "./garage.controller.js";
import upload from "../../middleware/multer.middleware.js";

const garageRouter = express.Router();

garageRouter.post("/register", garageController.registerGarage);

garageRouter.get("/", garageController.getAllGarages)
garageRouter.get("/approved", garageController.getGarages);
garageRouter.get("/nearby", garageController.getNearbyGarages);
garageRouter.patch("/me", garageController.updateGarage);
garageRouter.get("/:id", garageController.getGarage);
garageRouter.delete("/:id", garageController.deleteGarage);

garageRouter.patch("/:id/approve", garageController.approveGarage);
garageRouter.patch("/:id/reject", garageController.rejectGarage);

garageRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  garageController.uploadGarageProfileImage
);

export default garageRouter;