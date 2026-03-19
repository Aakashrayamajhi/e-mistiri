import express from "express";
import * as userController from "./user.controller.js";
import upload from "../../middleware/multer.middleware.js";

const userRouter = express.Router();

userRouter.get("/", userController.getAllUsers);
userRouter.post("/", userController.createUser);

userRouter.get("/phone/:phone", userController.getUserByPhone);
userRouter.get("/:id", userController.getUserById);

userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

userRouter.put(
  "/:id/profile-image",
  upload.single("image"),
  userController.uploadProfileImage
);

export default userRouter;