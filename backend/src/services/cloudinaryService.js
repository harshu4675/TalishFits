const cloudinary = require("../config/cloudinary");
const logger = require("../utils/logger");

const uploadImage = async (fileBuffer, options = {}) => {
  try {
    const defaultOptions = {
      folder: "talishfits",
      quality: "auto:good",
      fetch_format: "auto",
      ...options,
    };

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        defaultOptions,
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              size: result.bytes,
            });
          }
        },
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    logger.error("Upload service error:", error);
    throw error;
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error("Cloudinary delete error:", error);
    throw error;
  }
};

const uploadAvatar = async (fileBuffer, userId) => {
  return uploadImage(fileBuffer, {
    folder: `talishfits/avatars`,
    public_id: `avatar_${userId}`,
    overwrite: true,
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto:good" },
    ],
  });
};

const uploadProgressPhoto = async (fileBuffer, userId) => {
  return uploadImage(fileBuffer, {
    folder: `talishfits/progress/${userId}`,
    transformation: [
      { width: 800, height: 1000, crop: "limit" },
      { quality: "auto:good" },
    ],
  });
};

module.exports = {
  uploadImage,
  deleteImage,
  uploadAvatar,
  uploadProgressPhoto,
};
