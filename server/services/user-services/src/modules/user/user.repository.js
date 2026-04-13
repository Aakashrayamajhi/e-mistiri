import User from "./user.model.js";

export const findByPhone = async (phone) => {
  return await User.findOne({ phone });
};

export const createUser = async (data) => {
  return await User.create(data);
};

export const getUserById = async (id) => {
  return await User.findById(id);
};

export const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const getAllUsers = async () => {
  return await User.find();
};