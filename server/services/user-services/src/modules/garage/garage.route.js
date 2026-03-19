import express from "express";
import * as garageController from "./garage.controller.js";

const garageRouter = express.Router();

garageRouter.post("/register", garageController.registerGarage);

garageRouter.get("/", garageController.getGarages);
garageRouter.get("/nearby", garageController.getNearbyGarages);
garageRouter.get("/:id", garageController.getGarage);

garageRouter.patch("/:id", garageController.updateGarage);
garageRouter.delete("/:id", garageController.deleteGarage);

garageRouter.patch("/:id/approve", garageController.approveGarage);
garageRouter.patch("/:id/reject", garageController.rejectGarage);

export default garageRouter;