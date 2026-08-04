import * as userService from "./user.service.js";

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.validatedBody);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Create user error:", error.message);

    return res.status(error.status || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserByPhone = async (req, res) => {
  try {
    const user = await userService.findUserByPhone(req.validatedParams.phone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by phone error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.validatedParams.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { limit, skip } = req.validatedQuery || {};
    const users = await userService.getAllUsers({ limit, skip });

    return res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userIdFromToken = req.headers['x-user-id'];

    if (!userIdFromToken || userIdFromToken !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this user",
      });
    }

    const user = await userService.updateUser(userId, req.validatedBody);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { uploadImage } = await import("../../utils/cloudinary.util.js");
    const result = await uploadImage(req.file.buffer, "users");

    const user = await userService.updateUser(req.params.id, {
      profileImage: result.secure_url,
    });

    return res.json({
      success: true,
      message: "Profile image uploaded successfully",
      data: user,
    });
  } catch (error) {
    console.error("Upload profile image error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
