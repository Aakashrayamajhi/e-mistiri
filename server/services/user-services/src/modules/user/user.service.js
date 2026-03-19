import * as userRepository from "./user.repository.js";

export const createUser = async (data) => {
  const existingUser = await userRepository.findByPhone(data.phone);

  if (existingUser) {
    const error = new Error("User already exists");
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

export const updateUser = async (id, data) => {
  return await userRepository.updateUser(id, data, {
    returnDocument: "after",
  });
};
export const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

export const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};