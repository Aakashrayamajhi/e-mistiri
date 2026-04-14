import * as userRepository from "./user.repository.js";

export const createUser = async (data) => {
  try {
    const { phone, fullname, password } = data;

    if (!phone) {
      const error = new Error("Phone is required");
      error.status = 400;
      throw error;
    }

    if (!fullname || fullname.trim().length < 3) {
      const error = new Error("Fullname must be at least 3 characters");
      error.status = 400;
      throw error;
    }

    if (!password) {
      const error = new Error("Password is required");
      error.status = 400;
      throw error;
    }

    const existingUser = await userRepository.findByPhone(phone);

    if (existingUser) {
      const error = new Error("User with this number already exists");
      error.status = 400;
      throw error;
    }

    const user = await userRepository.createUser({
      phone,
      fullname: fullname.trim(),
      password, 
    });

    return {
      success: true,
      message: "User created successfully",
      data: user,
    };

  } catch (error) {
    throw error;
  }
};

// export const createUser = async (data) => {
//   const existingUser = await userRepository.findByPhone(data.phone);

//   if (existingUser) {
//     const error = new Error("User with this Number already exists");
//     error.status = 400;
//     throw error;
//   }

//   return await userRepository.createUser(data);
// };

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