import * as mechanicRepository from "./mechanic.repository.js";
import { acquireLock, releaseLock } from "../../utils/lock.js";

export const createmechanic = async (data) => {
  const lockKey = `mechanic:phone:${data.phone}`;
  const locked = await acquireLock(lockKey, 10);
  if (!locked) {
    const error = new Error("Too many requests, please try again later.");
    error.status = 429;
    throw error;
  }

  try {
    const existingmechanic = await mechanicRepository.findmechanicByPhone(data.phone);

    if (existingmechanic) {
      const error = new Error("mechanic already exists with this phone");
      error.status = 400;
      throw error;
    }

    return await mechanicRepository.createmechanic(data);
  } finally {
    await releaseLock(lockKey);
  }
};

export const findmechanicByPhone = async (phone) => {
  return await mechanicRepository.findmechanicByPhone(phone);
};

export const findmechanicByEmail = async (email) => {
  return await mechanicRepository.findmechanicByEmail(email);
};

export const getmechanicById = async (id) => {
  return await mechanicRepository.getmechanicById(id);
};

export const getAllmechanics = async (query = {}) => {
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;
  return await mechanicRepository.getAllmechanics({ limit, skip });
};

export const updatemechanic = async (id, data) => {
  return await mechanicRepository.updatemechanic(id, data);
};

export const deletemechanic = async (id) => {
  return await mechanicRepository.deletemechanic(id);
};

export const getApprovedmechanics = async () => {
  return await mechanicRepository.getApprovedmechanics();
};

export const approvemechanic = async (id) => {
  const mechanic = await mechanicRepository.getmechanicById(id);

  if (!mechanic) {
    const error = new Error("mechanic not found");
    error.status = 404;
    throw error;
  }

  return await mechanicRepository.approvemechanic(id);
};

export const rejectmechanic = async (id) => {
  const mechanic = await mechanicRepository.getmechanicById(id);

  if (!mechanic) {
    const error = new Error("mechanic not found");
    error.status = 404;
    throw error;
  }

  return await mechanicRepository.rejectmechanic(id);
};
