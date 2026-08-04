import * as garageRepository from "./garage.repository.js";
import { acquireLock, releaseLock } from "../../utils/lock.js";

export const createGarage = async (data) => {
  const lockKey = `garage:phone:${data.phone}`;
  const locked = await acquireLock(lockKey, 10);
  if (!locked) {
    const error = new Error("Too many requests, please try again later.");
    error.status = 429;
    throw error;
  }

  try {
    const existingGarage = await garageRepository.findGarageByPhone(data.phone);

    if (existingGarage) {
      const error = new Error("Garage already exists with this phone");
      error.status = 400;
      throw error;
    }

    return await garageRepository.createGarage(data);
  } finally {
    await releaseLock(lockKey);
  }
};

export const findGarageByPhone = async (phone) => {
  return await garageRepository.findGarageByPhone(phone);
};

export const findGarageByEmail = async (email) => {
  return await garageRepository.findGarageByEmail(email);
};

export const getGarageById = async (id) => {
  return await garageRepository.getGarageById(id);
};

export const getAllGarages = async (query = {}) => {
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;
  return await garageRepository.getAllGarages({ limit, skip });
};

export const updateGarage = async (id, data) => {
  return await garageRepository.updateGarage(id, data);
};

export const deleteGarage = async (id) => {
  return await garageRepository.deleteGarage(id);
};

export const getApprovedGarages = async () => {
  return await garageRepository.getApprovedGarages();
};

export const getNearbyGarages = async (lng, lat, maxDistance = 5000) => {
  return await garageRepository.getNearbyGarages(lng, lat, maxDistance);
};

export const approveGarage = async (id) => {
  const garage = await garageRepository.getGarageById(id);

  if (!garage) {
    const error = new Error("Garage not found");
    error.status = 404;
    throw error;
  }

  return await garageRepository.approveGarage(id);
};

export const rejectGarage = async (id) => {
  const garage = await garageRepository.getGarageById(id);

  if (!garage) {
    const error = new Error("Garage not found");
    error.status = 404;
    throw error;
  }

  return await garageRepository.rejectGarage(id);
};
