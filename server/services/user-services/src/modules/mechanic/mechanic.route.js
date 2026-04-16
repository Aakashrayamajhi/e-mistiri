import express from "express";
import * as mechanicController from "./mechanic.controller.js";
import upload from "../../middleware/multer.middleware.js";

const mechanicRouter = express.Router();

mechanicRouter.post("/", mechanicController.registermechanic);

mechanicRouter.get("/phone/:phone", mechanicController.getmechanicByPhone);

mechanicRouter.get("/", mechanicController.getAllmechanics)
mechanicRouter.get("/approved", mechanicController.getmechanics);
// mechanicRouter.get("/nearby", mechanicController.getNearbymechanics);
mechanicRouter.patch("/update/:id", mechanicController.updatemechanic);
mechanicRouter.get("/:id", mechanicController.getmechanic);
mechanicRouter.delete("/:id", mechanicController.deletemechanic);

mechanicRouter.patch("/:id/approve", mechanicController.approvemechanic);
mechanicRouter.patch("/:id/reject", mechanicController.rejectmechanic);

mechanicRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  mechanicController.uploadmechanicProfileImage
);

export default mechanicRouter;