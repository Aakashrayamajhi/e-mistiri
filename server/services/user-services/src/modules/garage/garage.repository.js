import Garage from "./garage.model.js";

export const findGarageByPhone = async (phone) => {
  return await Garage.findOne({ phone });
};

export const findGarageByEmail = async (email) => {
  return await Garage.findOne({ email });
};

export const createGarage = async (data) => {
  return await Garage.create(data);
};

export const getGarageById = async (id) => {
  return await Garage.findById(id);
};

export const getAllGarages = async () => {
  return await Garage.find();
};

export const updateGarage = async (id, data) => {
  return await Garage.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const deleteGarage = async (id) => {
  return await Garage.findByIdAndDelete(id);
};


export const getApprovedGarages = async () => {
  return await Garage.find({ status: "approved" });
};


export const getNearbyGarages = async (lng, lat) => {
  return await Garage.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 5000, // 5km
      },
    },
  });
};


export const approveGarage = async (id) => {
  return await Garage.findByIdAndUpdate(
    id,
    {
      status: "approved",
      isVerified: true,
    },
    { new: true }
  );
};


export const rejectGarage = async (id) => {
  return await Garage.findByIdAndUpdate(
    id,
    {
      status: "rejected",
      isVerified: false,
    },
    { new: true }
  );
};