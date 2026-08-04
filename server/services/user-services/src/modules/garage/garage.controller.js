import * as garageService from "./garage.service.js";
import { uploadImage } from "../../utils/cloudinary.util.js";

export const registerGarage = async (req, res, next) => {
  try {
    const garage = await garageService.createGarage(req.validatedBody);

    res.status(201).json({
      success: true,
      message: "Garage registered successfully",
      data: garage,
    });
  } catch (error) {
    next(error);
  }
};

export const getGarages = async (req, res, next) => {
  try {
    const garages = await garageService.getApprovedGarages();

    res.json({
      success: true,
      data: garages,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGarages = async (req, res, next) => {
  try {
    const { limit, skip } = req.validatedQuery || {};
    const garages = await garageService.getAllGarages({ limit, skip });

    res.json({
      success: true,
      count: garages.length,
      data: garages,
    });
  } catch (error) {
    next(error);
  }
};

export const getGarageByPhone = async (req, res) => {
  try {
    const garage = await garageService.findGarageByPhone(req.validatedParams.phone);

    if (!garage) {
      return res.status(404).json({
        success: false,
        message: "garage not found",
      });
    }

    return res.json({
      success: true,
      data: garage,
    });
  } catch (error) {
    console.error("Get garage by phone error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGarage = async (req, res, next) => {
  try {
    const garage = await garageService.getGarageById(req.validatedParams.id);

    if (!garage) {
      return res.status(404).json({
        success: false,
        message: "Garage not found",
      });
    }

    res.json({
      success: true,
      data: garage,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGarage = async (req, res) => {
  try {
    const garageId = req.params.id;
    const garageIdFromToken = req.headers['x-user-id'];

    if (!garageIdFromToken || garageIdFromToken !== garageId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this garage",
      });
    }

    const garage = await garageService.updateGarage(garageId, req.validatedBody);

    if (!garage) {
      return res.status(404).json({
        success: false,
        message: "Garage not found",
      });
    }

    return res.json({
      success: true,
      message: "Garage updated successfully",
      data: garage,
    });
  } catch (error) {
    console.error("Update garage error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteGarage = async (req, res, next) => {
  try {
    await garageService.deleteGarage(req.params.id);

    res.json({
      success: true,
      message: "Garage deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getNearbyGarages = async (req, res, next) => {
  try {
    const { lng, lat, maxDistance } = req.validatedQuery || {};
    const garages = await garageService.getNearbyGarages(
      Number(lng),
      Number(lat),
      maxDistance ? Number(maxDistance) : 5000
    );

    res.json({
      success: true,
      data: garages,
    });
  } catch (error) {
    next(error);
  }
};

export const approveGarage = async (req, res, next) => {
  try {
    const garage = await garageService.approveGarage(req.validatedParams.id);

    res.json({
      success: true,
      message: "Garage approved",
      data: garage,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectGarage = async (req, res, next) => {
  try {
    const garage = await garageService.rejectGarage(req.validatedParams.id);

    res.json({
      success: true,
      message: "Garage rejected",
      data: garage,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadGarageProfileImage = async (req, res, next) => {
  try {
    const garageId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadImage(req.file.buffer, "garages");

    const updated = await garageService.updateGarage(garageId, {
      profileImage: result.secure_url,
    });

    res.json({
      success: true,
      message: "Profile image uploaded",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
