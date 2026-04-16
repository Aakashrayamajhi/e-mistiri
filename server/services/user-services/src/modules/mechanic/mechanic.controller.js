import * as mechanicService from "./mechanic.service.js";
import { uploadImage } from "../../utils/cloudinary.util.js";

export const registermechanic = async (req, res, next) => {
  try {
    const mechanic = await mechanicService.createmechanic(req.body);

    res.status(201).json({
      success: true,
      message: "mechanic registered successfully",
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
};

export const getmechanics = async (req, res, next) => {
  try {
    const mechanics = await mechanicService.getApprovedmechanics();

    res.json({
      success: true,
      data: mechanics,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllmechanics = async (req, res, next) => {
  try {
    const mechanics = await mechanicService.getAllmechanics();

    res.json({
      success: true,
      data: mechanics,
    });
  } catch (error) {
    next(error);
  }
};

export const getmechanicByPhone = async (req, res) => {
  try {
    const mechanic = await mechanicService.findmechanicByPhone(req.params.phone);

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "mechanic not found",
      });
    }

    return res.json({
      success: true,
      data: mechanic,
    });
  } catch (error) {
    console.error("Get mechanic by phone error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getmechanic = async (req, res, next) => {
  try {
    const mechanic = await mechanicService.getmechanicById(req.params.id);

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "mechanic not found",
      });
    }

    res.json({
      success: true,
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
};

export const updatemechanic = async (req, res) => {
  try {
    const mechanicId = req.params.id;
    console.log("mechanicId:", mechanicId)

    const mechanicIdFromToken = req.headers['x-user-id'];
    console.log("mechanicid form token:", mechanicIdFromToken)

    if (!mechanicIdFromToken || mechanicIdFromToken !== mechanicId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this mechanic",
      });
    }

    const mechanic = await mechanicService.updatemechanic(mechanicId, req.body);

    if (!mechanic) {
      return res.status(404).json({
        success: false,
        message: "mechanic not found",
      });
    }

    return res.json({
      success: true,
      message: "mechanic updated successfully",
      data: mechanic,
    });
  } catch (error) {
    console.error("Update mechanic error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deletemechanic = async (req, res, next) => {
  try {
    await mechanicService.deletemechanic(req.params.id);

    res.json({
      success: true,
      message: "mechanic deleted",
    });
  } catch (error) {
    next(error);
  }
};

// export const getNearbymechanics = async (req, res, next) => {
//   try {
//     const { lng, lat } = req.query;

//     const mechanics = await mechanicService.getNearbymechanics(
//       Number(lng),
//       Number(lat)
//     );

//     res.json({
//       success: true,
//       data: mechanics,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


export const approvemechanic = async (req, res, next) => {
  try {
    const mechanic = await mechanicService.approvemechanic(req.params.id);

    res.json({
      success: true,
      message: "mechanic approved",
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectmechanic = async (req, res, next) => {
  try {
    const mechanic = await mechanicService.rejectmechanic(req.params.id);

    res.json({
      success: true,
      message: "mechanic rejected",
      data: mechanic,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadmechanicProfileImage = async (req, res, next) => {
  try {
    const mechanicId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadImage(req.file.buffer, "mechanics");

    const updated = await mechanicService.updatemechanic(mechanicId, {
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