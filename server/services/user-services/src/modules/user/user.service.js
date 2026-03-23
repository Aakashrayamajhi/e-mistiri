import * as userRepository from "./user.repository.js";
import bcrypt from "bcrypt"

export const createUser = async (data) => {
  const existingUser = await userRepository.findByPhone(data.phone);

  if (existingUser) {
    const error = new Error("User with this Number already exists");
    error.status = 400;
    throw error;
  }

  return await userRepository.createUser(data);
};

export const findUserByPhone = async (phone) => {
  return await userRepository.findByPhone(phone);
};

export const findUserByEmail = async (email) => {
  return await userRepository.findByEmail(email);
};

export const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};



const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
};

const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{6,}$/.test(password);
};

export const updateUser = async (id, data) => {
  try {
  
    if (!data.username || data.username.trim() === "") {
      throw new Error("Username is required");
    }

    if (!data.email || data.email.trim() === "") {
      throw new Error("Email is required");
    }

    if (!isValidEmail(data.email)) {
      throw new Error("Only valid Gmail addresses are allowed");
    }

  
    if ("password" in data) {
      if (!data.password || data.password.trim() === "") {
        throw new Error("Password cannot be empty");
      }

      if (!isStrongPassword(data.password)) {
        throw new Error(
          "Password must be strong (6+ chars, uppercase, lowercase, number, special char)"
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    // clean data
    data.username = data.username.trim();
    data.email = data.email.trim().toLowerCase();

    return await userRepository.updateUser(id, data, {
      returnDocument: "after",
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

export const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};