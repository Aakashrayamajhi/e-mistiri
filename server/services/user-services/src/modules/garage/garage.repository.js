import Garage from "./garage.model.js";

export const findGarageByPhone = async (phone) => {
  return await Garage.findOne({ phone }, { password: 0 });
};

export const findGarageByEmail = async (email) => {
  return await Garage.findOne({ email }, { password: 0 });
};

export const createGarage = async (data) => {
  return await Garage.create(data);
};

export const getGarageById = async (id) => {
  return await Garage.findById(id, { password: 0 });
};

export const getAllGarages = async (query = {}) => {
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;
  return await Garage.find({}, { password: 0 }).skip(skip).limit(limit).lean();
};

export const updateGarage = async (id, data) => {
  return await Garage.findByIdAndUpdate(id, data, {
    returnDocument: "after"
  });
};

export const deleteGarage = async (id) => {
  return await Garage.findByIdAndDelete(id);
};

export const getApprovedGarages = async () => {
  return await Garage.find({ status: "approved" }, { password: 0 }).lean();
};

export const getNearbyGarages = async (lng, lat, maxDistance = 5000) => {
  return await Garage.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: maxDistance,
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
    { returnDocument: 'after' }
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
