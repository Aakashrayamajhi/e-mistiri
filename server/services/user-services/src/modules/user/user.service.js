import * as userRepository from "./user.repository.js";
import { acquireLock, releaseLock } from "../../utils/lock.js";

export const createUser = async (data) => {
  try {
    const { phone, fullname, password } = data;

    const lockKey = `user:phone:${phone}`;
    const locked = await acquireLock(lockKey, 10);
    if (!locked) {
      const error = new Error("Too many requests, please try again later.");
      error.status = 429;
      throw error;
    }

    try {
      const existingUser = await userRepository.findByPhone(phone);

      if (existingUser) {
        const error = new Error("User with this number already exists");
        error.status = 400;
        throw error;
      }

      return await userRepository.createUser({
        phone,
        fullname: fullname.trim(),
        password,
      });
    } finally {
      await releaseLock(lockKey);
    }

  } catch (error) {
    throw error;
  }
};

export const findUserByPhone = async (phone) => {
  return await userRepository.findByPhone(phone);
};

export const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

export const updateUser = async (id, data) => {
  return await userRepository.updateUser(id, data, {
    returnDocument: "after",
  });
};

export const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

export const getAllUsers = async (query = {}) => {
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;
  return await userRepository.getAllUsers({ limit, skip });
};
