import User from "./user.model.js";

export const findByPhone = async (phone) => {
  return await User.findOne({ phone }, { password: 0 });
};

export const createUser = async (data) => {
  return await User.create(data);
};

export const getUserById = async (id) => {
  return await User.findById(id, { password: 0 });
};

export const updateUser = async (id, data, options = {}) => {
  return await User.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    ...options
  });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const getAllUsers = async (query = {}) => {
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;
  return await User.find({}, { password: 0 }).skip(skip).limit(limit).lean();
};
