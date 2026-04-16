import mechanic from "./mechanic.model.js";

export const findmechanicByPhone = async (phone) => {
  return await mechanic.findOne({ phone });
};

export const findmechanicByEmail = async (email) => {
  return await mechanic.findOne({ email });
};

export const createmechanic = async (data) => {
  return await mechanic.create(data);
};

export const getmechanicById = async (id) => {
  return await mechanic.findById(id);
};

export const getAllmechanics = async () => {
  return await mechanic.find();
};

export const updatemechanic = async (id, data) => {
  return await mechanic.findByIdAndUpdate(id, data, {
  returnDocument : "after"
  });
};

export const deletemechanic = async (id) => {
  return await mechanic.findByIdAndDelete(id);
};

export const getApprovedmechanics = async () => {
  return await mechanic.find({ status: "approved" });
};

// export const getNearbymechanics = async (lng, lat) => {
//   return await mechanic.find({
//     location: {
//       $near: {
//         $geometry: {
//           type: "Point",
//           coordinates: [lng, lat],
//         },
//         $maxDistance: 5000, // 5km
//       },
//     },
//   });
// };

export const approvemechanic = async (id) => {
  return await mechanic.findByIdAndUpdate(
    id,
    {
      status: "approved",
      isVerified: true,
    },{returnDocument: 'after'}
  );
};

export const rejectmechanic = async (id) => {
  return await mechanic.findByIdAndUpdate(
    id,
    {
      status: "rejected",
      isVerified: false,
    },
    { new: true }
  );
};