import mechanic from "./mechanic.model.js";

export const findmechanicByPhone = async (phone) => {
  return await mechanic.findOne({ phone }, { password: 0 });
};

export const findmechanicByEmail = async (email) => {
  return await mechanic.findOne({ email }, { password: 0 });
};

export const createmechanic = async (data) => {
  return await mechanic.create(data);
};

export const getmechanicById = async (id) => {
  return await mechanic.findById(id, { password: 0 });
};

export const getAllmechanics = async (query = {}) => {
  const limit = parseInt(query.limit) || 10;
  const skip = parseInt(query.skip) || 0;
  return await mechanic.find({}, { password: 0 }).skip(skip).limit(limit).lean();
};

export const updatemechanic = async (id, data) => {
  return await mechanic.findByIdAndUpdate(id, data, {
    returnDocument: "after"
  });
};

export const deletemechanic = async (id) => {
  return await mechanic.findByIdAndDelete(id);
};

export const getApprovedmechanics = async () => {
  return await mechanic.find({ status: "approved" }, { password: 0 }).lean();
};

export const approvemechanic = async (id) => {
  return await mechanic.findByIdAndUpdate(
    id,
    {
      status: "approved",
      isVerified: true,
    },
    { returnDocument: 'after' }
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
