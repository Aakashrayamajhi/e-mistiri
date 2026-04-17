
import express from "express";
import * as mechanicAuthController from "./mechanicAuth.controller.js";

const mechanicAuthRouter = express.Router();

mechanicAuthRouter.post("/signup", mechanicAuthController.completeProfile);

mechanicAuthRouter.post("/login", mechanicAuthController.loginmechanic);

export default mechanicAuthRouter;
