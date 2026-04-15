import * as userRepository from "./user.repository.js";

export const createUser = async (data) => {
  try {
    const { phone, fullname, password } = data;

    const existingUser = await userRepository.findByPhone(phone);

    if (existingUser) {
      const error = new Error("User with this number already exists");
      error.status = 400;
      throw error;
    }

    let user = await userRepository.createUser({
      phone,
      fullname: fullname.trim(),
      password,
    });

    // user = {
    //   id: user._id,
    //   fullname : user.fullname,
    //   phone : user.phone,
    //   token : user.token,
    //   profileImage : user.profileImage
    // }

    return {
      success: true,
      message: "User created successfully",
      data: user,
    };

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

export const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};