import express from "express";
import * as userController from "./user.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { requireAdmin } from "../../middleware/rbac.middleware.js";
import upload from "../../middleware/multer.middleware.js";
import { auditLog } from "../../middleware/audit.middleware.js";
import userDTOs from "../../dtos/user.dto.js";

const userRouter = express.Router();

userRouter.get("/", requireAdmin, validate(userDTOs.getAll, 'query'), userController.getAllUsers);
userRouter.post("/", validate(userDTOs.createUser, 'body'), auditLog('user', 'create'), userController.createUser);
userRouter.get("/phone/:phone", validate(userDTOs.getByPhone, 'params'), userController.getUserByPhone);
userRouter.get("/:id", validate(userDTOs.getById, 'params'), userController.getUserById);
userRouter.patch("/:id", validate(userDTOs.updateUser, 'body'), auditLog('user', 'update'), userController.updateUser);
userRouter.delete("/:id", requireAdmin, auditLog('user', 'delete'), userController.deleteUser);

userRouter.patch(
  "/:id/profile-image",
  upload.single("profileImage"),
  userController.uploadProfileImage
);

export default userRouter;
