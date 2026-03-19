import express from "express";
import * as userController from "./user.controller.js";

const userRouter = express.Router();

userRouter.get("/", userController.getAllUsers);
userRouter.post("/", userController.createUser);

userRouter.get("/phone/:phone", userController.getUserByPhone);
userRouter.get("/:id", userController.getUserById);

userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;