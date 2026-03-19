import cloudinary from "../config/cloudinary.config.js";

export const uploadImage = (fileBuffer, folder = "users") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(fileBuffer);
  });
};